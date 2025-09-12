import { supabase } from './supabase'

export interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    change: number
    trend: 'up' | 'down'
  }
  orders: {
    current: number
    previous: number
    change: number
    trend: 'up' | 'down'
  }
  customers: {
    current: number
    previous: number
    change: number
    trend: 'up' | 'down'
  }
  products: {
    current: number
    previous: number
    change: number
    trend: 'up' | 'down'
  }
}

export interface RevenueData {
  month: string
  revenue: number
  orders: number
}

export interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: number
  image_url?: string
}

export interface CustomerSegment {
  segment: string
  count: number
  percentage: number
}

export interface RecentActivity {
  id: string
  action: string
  details: string
  time: string
  type: 'order' | 'inventory' | 'customer' | 'payment' | 'shipping'
  created_at: string
}

export interface AnalyticsFilters {
  timeRange: '7d' | '30d' | '90d' | '1y'
  startDate?: string
  endDate?: string
}

export class AnalyticsService {
  /**
   * Get analytics data for key metrics
   */
  static async getAnalyticsData(filters: AnalyticsFilters): Promise<AnalyticsData> {
    const { startDate, endDate } = this.getDateRange(filters)
    
    try {
      // Get current period data
      const currentData = await this.getPeriodData(startDate, endDate)
      
      // Get previous period data for comparison
      const previousStartDate = this.getPreviousPeriodStartDate(startDate, endDate)
      const previousEndDate = this.getPreviousPeriodEndDate(startDate, endDate)
      const previousData = await this.getPeriodData(previousStartDate, previousEndDate)
      
      // Calculate changes and trends
      const revenue = this.calculateMetricChange(
        currentData.revenue,
        previousData.revenue,
        'revenue'
      )
      
      const orders = this.calculateMetricChange(
        currentData.orders,
        previousData.orders,
        'orders'
      )
      
      const customers = this.calculateMetricChange(
        currentData.customers,
        previousData.customers,
        'customers'
      )
      
      const products = this.calculateMetricChange(
        currentData.products,
        previousData.products,
        'products'
      )
      
      return {
        revenue,
        orders,
        customers,
        products
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      // Return zero data on error
      return this.getZeroAnalyticsData()
    }
  }

  /**
   * Get revenue data for charts
   */
  static async getRevenueData(filters: AnalyticsFilters): Promise<RevenueData[]> {
    const { startDate, endDate } = this.getDateRange(filters)
    
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('created_at, total_amount')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .eq('status', 'delivered') // Only count delivered orders
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching revenue data:', error)
        return []
      }

      // Group by month
      const monthlyData = this.groupOrdersByMonth(orders || [])
      return monthlyData
    } catch (error) {
      console.error('Error fetching revenue data:', error)
      return []
    }
  }

  /**
   * Get top performing products
   */
  static async getTopProducts(filters: AnalyticsFilters, limit: number = 5): Promise<TopProduct[]> {
    const { startDate, endDate } = this.getDateRange(filters)
    
    try {
      // First get orders in the date range
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .eq('status', 'delivered')

      if (ordersError) {
        console.error('Error fetching orders for top products:', ordersError)
        return []
      }

      if (!orders || orders.length === 0) {
        return []
      }

      // Get order items for these orders
      const orderIds = orders.map(order => order.id)
      const { data: orderItems, error } = await supabase
        .from('order_items')
        .select(`
          product_id,
          product_name,
          product_image_url,
          quantity,
          unit_price,
          total_price,
          order_id
        `)
        .in('order_id', orderIds)

      if (error) {
        console.error('Error fetching order items:', error)
        return []
      }

      // Aggregate product data
      const productMap = new Map<string, TopProduct>()
      
      orderItems?.forEach(item => {
        const productId = item.product_id
        if (productMap.has(productId)) {
          const existing = productMap.get(productId)!
          existing.sales += item.quantity
          existing.revenue += item.total_price
        } else {
          productMap.set(productId, {
            id: productId,
            name: item.product_name,
            sales: item.quantity,
            revenue: item.total_price,
            image_url: item.product_image_url
          })
        }
      })

      // Sort by revenue and return top products
      return Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit)
    } catch (error) {
      console.error('Error fetching top products:', error)
      return []
    }
  }

  /**
   * Get customer segments
   */
  static async getCustomerSegments(): Promise<CustomerSegment[]> {
    try {
      // First get all customers
      const { data: customers, error: customersError } = await supabase
        .from('user_profiles')
        .select('id, created_at')
        .eq('role', 'customer')

      if (customersError) {
        console.error('Error fetching customers:', customersError)
        return []
      }

      const totalCustomers = customers?.length || 0
      if (totalCustomers === 0) {
        return []
      }

      // Get all orders for these customers
      const customerIds = customers?.map(c => c.id) || []
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('customer_id, total_amount, created_at, status')
        .in('customer_id', customerIds)

      if (ordersError) {
        console.error('Error fetching orders for customer segments:', ordersError)
        // Continue with empty orders array
      }

      // Calculate segments
      const now = new Date()
      const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000)
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      let newCustomers = 0
      let returningCustomers = 0
      let vipCustomers = 0
      let inactiveCustomers = 0

      customers?.forEach(customer => {
        const joinDate = new Date(customer.created_at)
        const customerOrders = orders?.filter(order => order.customer_id === customer.id) || []
        
        const totalSpent = customerOrders
          .filter(order => order.status === 'delivered')
          .reduce((sum, order) => sum + order.total_amount, 0)
        
        const recentOrders = customerOrders.filter(order => 
          new Date(order.created_at) > sixMonthsAgo && order.status === 'delivered'
        )

        if (joinDate > oneMonthAgo) {
          newCustomers++
        } else if (recentOrders.length > 0) {
          returningCustomers++
        }

        if (totalSpent > 500) {
          vipCustomers++
        }

        if (joinDate < oneMonthAgo && recentOrders.length === 0) {
          inactiveCustomers++
        }
      })

      return [
        { segment: 'New Customers', count: newCustomers, percentage: Math.round((newCustomers / totalCustomers) * 100) },
        { segment: 'Returning Customers', count: returningCustomers, percentage: Math.round((returningCustomers / totalCustomers) * 100) },
        { segment: 'VIP Customers', count: vipCustomers, percentage: Math.round((vipCustomers / totalCustomers) * 100) },
        { segment: 'Inactive Customers', count: inactiveCustomers, percentage: Math.round((inactiveCustomers / totalCustomers) * 100) }
      ]
    } catch (error) {
      console.error('Error fetching customer segments:', error)
      return []
    }
  }

  /**
   * Get recent activity
   */
  static async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    try {
      const activities: RecentActivity[] = []

      // Get recent orders
      const { data: recentOrders, error: ordersError } = await supabase
        .from('orders')
        .select('id, order_number, customer_name, total_amount, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5)

      if (!ordersError && recentOrders) {
        recentOrders.forEach(order => {
          activities.push({
            id: `order-${order.id}`,
            action: 'New order placed',
            details: `${order.order_number} by ${order.customer_name}`,
            time: this.getTimeAgo(order.created_at),
            type: 'order',
            created_at: order.created_at
          })
        })
      }

      // Get recent customer registrations
      const { data: recentCustomers, error: customersError } = await supabase
        .from('user_profiles')
        .select('id, full_name, created_at')
        .eq('role', 'customer')
        .order('created_at', { ascending: false })
        .limit(3)

      if (!customersError && recentCustomers) {
        recentCustomers.forEach(customer => {
          activities.push({
            id: `customer-${customer.id}`,
            action: 'New customer registered',
            details: customer.full_name || 'Unknown',
            time: this.getTimeAgo(customer.created_at),
            type: 'customer',
            created_at: customer.created_at
          })
        })
      }

      // Sort by creation date and return limited results
      return activities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit)
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      return []
    }
  }

  /**
   * Helper methods
   */
  private static getDateRange(filters: AnalyticsFilters): { startDate: string; endDate: string } {
    const now = new Date()
    const endDate = now.toISOString()
    
    let startDate: Date
    switch (filters.timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }
    
    return {
      startDate: startDate.toISOString(),
      endDate
    }
  }

  private static getPreviousPeriodStartDate(currentStart: string, currentEnd: string): string {
    const start = new Date(currentStart)
    const end = new Date(currentEnd)
    const periodLength = end.getTime() - start.getTime()
    const previousEnd = new Date(start.getTime() - 1)
    const previousStart = new Date(previousEnd.getTime() - periodLength)
    return previousStart.toISOString()
  }

  private static getPreviousPeriodEndDate(currentStart: string, currentEnd: string): string {
    const start = new Date(currentStart)
    const previousEnd = new Date(start.getTime() - 1)
    return previousEnd.toISOString()
  }

  private static async getPeriodData(startDate: string, endDate: string) {
    // Get orders data
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount, status')
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (ordersError) {
      console.error('Error fetching orders:', ordersError)
      return { revenue: 0, orders: 0, customers: 0, products: 0 }
    }

    // Get customers data
    const { data: customers, error: customersError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'customer')
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (customersError) {
      console.error('Error fetching customers:', customersError)
    }

    // Get products data
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (productsError) {
      console.error('Error fetching products:', productsError)
    }

    const revenue = orders?.filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.total_amount, 0) || 0
    const orderCount = orders?.filter(order => order.status === 'delivered').length || 0

    return {
      revenue,
      orders: orderCount,
      customers: customers?.length || 0,
      products: products?.length || 0
    }
  }

  private static calculateMetricChange(current: number, previous: number, type: string) {
    const change = previous > 0 ? ((current - previous) / previous) * 100 : 0
    return {
      current,
      previous,
      change: Math.round(change * 10) / 10,
      trend: change >= 0 ? 'up' as const : 'down' as const
    }
  }

  private static groupOrdersByMonth(orders: { created_at: string; total_amount: number }[]): RevenueData[] {
    const monthlyData = new Map<string, { revenue: number; orders: number }>()
    
    orders.forEach(order => {
      const date = new Date(order.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthName = date.toLocaleDateString('en-US', { month: 'short' })
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { revenue: 0, orders: 0 })
      }
      
      const data = monthlyData.get(monthKey)!
      data.revenue += order.total_amount
      data.orders += 1
    })

    return Array.from(monthlyData.entries())
      .map(([key, data]) => ({
        month: new Date(key + '-01').toLocaleDateString('en-US', { month: 'short' }),
        revenue: data.revenue,
        orders: data.orders
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }

  private static getTimeAgo(dateString: string): string {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} day${days > 1 ? 's' : ''} ago`
    }
  }

  private static getZeroAnalyticsData(): AnalyticsData {
    return {
      revenue: { current: 0, previous: 0, change: 0, trend: 'up' },
      orders: { current: 0, previous: 0, change: 0, trend: 'up' },
      customers: { current: 0, previous: 0, change: 0, trend: 'up' },
      products: { current: 0, previous: 0, change: 0, trend: 'up' }
    }
  }
}
