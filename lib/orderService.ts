import { supabase } from './supabase'
import { 
  Order, 
  OrderItem, 
  OrderStatusHistory, 
  CreateOrderData, 
  UpdateOrderData, 
  OrderFilters, 
  OrderStats,
  OrderStatus,
  PaymentStatus
} from './orderTypes'

export class OrderService {
  /**
   * Create a new order
   */
  static async createOrder(orderData: CreateOrderData): Promise<Order> {
    const { items, ...orderInfo } = orderData

    // Start a transaction
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderInfo])
      .select()
      .single()

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`)
    }

    // Create order items
    const orderItems = items.map(item => ({
      ...item,
      order_id: order.id
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      // If items creation fails, we should clean up the order
      await supabase.from('orders').delete().eq('id', order.id)
      throw new Error(`Failed to create order items: ${itemsError.message}`)
    }

    // Fetch the complete order with items
    return this.getOrderById(order.id)
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId: string): Promise<Order> {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*),
        status_history:order_status_history(*)
      `)
      .eq('id', orderId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch order: ${error.message}`)
    }

    return order as Order
  }

  /**
   * Get orders for a specific user
   */
  static async getUserOrders(
    userId: string, 
    options: {
      page?: number
      limit?: number
      status?: OrderStatus[]
    } = {}
  ): Promise<{ orders: Order[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 20, status } = options

    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `, { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (status && status.length > 0) {
      query = query.in('status', status)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Failed to fetch user orders: ${error.message}`)
    }

    return {
      orders: data as Order[],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  }

  /**
   * Get all orders (admin only)
   */
  static async getAllOrders(
    options: {
      page?: number
      limit?: number
      filters?: OrderFilters
      sortBy?: 'created_at' | 'total_amount' | 'status' | 'order_number'
      sortOrder?: 'asc' | 'desc'
    } = {}
  ): Promise<{ orders: Order[]; total: number; page: number; totalPages: number }> {
    const { 
      page = 1, 
      limit = 20, 
      filters = {}, 
      sortBy = 'created_at', 
      sortOrder = 'desc' 
    } = options

    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*),
        status_history:order_status_history(*)
      `, { count: 'exact' })

    // Apply filters
    if (filters.status && filters.status.length > 0) {
      query = query.in('status', filters.status)
    }

    if (filters.payment_status && filters.payment_status.length > 0) {
      query = query.in('payment_status', filters.payment_status)
    }

    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from)
    }

    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to)
    }

    if (filters.customer_email) {
      query = query.ilike('customer_email', `%${filters.customer_email}%`)
    }

    if (filters.order_number) {
      query = query.ilike('order_number', `%${filters.order_number}%`)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`)
    }

    return {
      orders: data as Order[],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  }

  /**
   * Update order
   */
  static async updateOrder(orderData: UpdateOrderData): Promise<Order> {
    const { id, ...updateData } = orderData

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update order: ${error.message}`)
    }

    return data as Order
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(
    orderId: string, 
    status: OrderStatus, 
    notes?: string
  ): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update order status: ${error.message}`)
    }

    // Add status history entry
    if (notes) {
      await supabase
        .from('order_status_history')
        .insert({
          order_id: orderId,
          status,
          notes
        })
    }

    return data as Order
  }

  /**
   * Cancel order
   */
  static async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    return this.updateOrderStatus(orderId, 'cancelled', reason || 'Order cancelled by user')
  }

  /**
   * Get order statistics
   */
  static async getOrderStats(): Promise<OrderStats> {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      revenueData
    ] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'processing'),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'shipped'),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'delivered'),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
      supabase.from('orders').select('total_amount').eq('status', 'delivered')
    ])

    const totalRevenue = revenueData.data?.reduce((sum, order) => sum + order.total_amount, 0) || 0
    const totalDeliveredOrders = deliveredOrders.count || 0
    const averageOrderValue = totalDeliveredOrders > 0 ? totalRevenue / totalDeliveredOrders : 0

    return {
      total_orders: totalOrders.count || 0,
      pending_orders: pendingOrders.count || 0,
      processing_orders: processingOrders.count || 0,
      shipped_orders: shippedOrders.count || 0,
      delivered_orders: deliveredOrders.count || 0,
      cancelled_orders: cancelledOrders.count || 0,
      total_revenue: totalRevenue,
      average_order_value: averageOrderValue
    }
  }

  /**
   * Get order by order number
   */
  static async getOrderByNumber(orderNumber: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*),
        status_history:order_status_history(*)
      `)
      .eq('order_number', orderNumber)
      .single()

    if (error) {
      throw new Error(`Failed to fetch order: ${error.message}`)
    }

    return data as Order
  }

  /**
   * Get recent orders for dashboard
   */
  static async getRecentOrders(limit: number = 10): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch recent orders: ${error.message}`)
    }

    return data as Order[]
  }

  /**
   * Search orders
   */
  static async searchOrders(
    searchTerm: string,
    options: {
      page?: number
      limit?: number
    } = {}
  ): Promise<{ orders: Order[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 20 } = options

    const { data, error, count } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `, { count: 'exact' })
      .or(`order_number.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%,customer_name.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      throw new Error(`Failed to search orders: ${error.message}`)
    }

    return {
      orders: data as Order[],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  }
}
