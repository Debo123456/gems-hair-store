"use client"

import { useState, useEffect } from 'react'
import { OrderService } from '@/lib/orderService'
import { Order, CreateOrderData, UpdateOrderData, OrderFilters, OrderStats, OrderStatus } from '@/lib/orderTypes'

interface UseOrdersReturn {
  orders: Order[]
  loading: boolean
  error: string | null
  total: number
  page: number
  totalPages: number
  refresh: () => Promise<void>
  createOrder: (data: CreateOrderData) => Promise<Order>
  updateOrder: (data: UpdateOrderData) => Promise<void>
  updateOrderStatus: (orderId: string, status: string, notes?: string) => Promise<void>
  cancelOrder: (orderId: string, reason?: string) => Promise<void>
  searchOrders: (searchTerm: string) => Promise<void>
  setFilters: (filters: OrderFilters) => void
  setPage: (page: number) => void
  setSortBy: (sortBy: string) => void
  setSortOrder: (sortOrder: 'asc' | 'desc') => void
}

interface UseOrdersOptions {
  userId?: string
  initialPage?: number
  initialLimit?: number
  initialFilters?: OrderFilters
  autoLoad?: boolean
}

export const useOrders = (options: UseOrdersOptions = {}): UseOrdersReturn => {
  const {
    userId,
    initialPage = 1,
    initialLimit = 20,
    initialFilters = {},
    autoLoad = true
  } = options

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState<OrderFilters>(initialFilters)
  const [sortBy, setSortBy] = useState<'created_at' | 'total_amount' | 'status' | 'order_number'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      let result
      if (userId) {
        // Load user-specific orders
        result = await OrderService.getUserOrders(userId, {
          page,
          limit: initialLimit,
          status: filters.status
        })
      } else {
        // Load all orders (admin)
        result = await OrderService.getAllOrders({
          page,
          limit: initialLimit,
          filters,
          sortBy,
          sortOrder
        })
      }

      setOrders(result.orders)
      setTotal(result.total)
      setTotalPages(result.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders')
      console.error('Error loading orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    await loadOrders()
  }

  const createOrder = async (data: CreateOrderData): Promise<Order> => {
    try {
      setError(null)
      const newOrder = await OrderService.createOrder(data)
      await refresh() // Refresh the orders list
      return newOrder
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateOrder = async (data: UpdateOrderData): Promise<void> => {
    try {
      setError(null)
      await OrderService.updateOrder(data)
      await refresh() // Refresh the orders list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateOrderStatus = async (orderId: string, status: OrderStatus, notes?: string): Promise<void> => {
    try {
      setError(null)
      await OrderService.updateOrderStatus(orderId, status, notes)
      await refresh() // Refresh the orders list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order status'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const cancelOrder = async (orderId: string, reason?: string): Promise<void> => {
    try {
      setError(null)
      await OrderService.cancelOrder(orderId, reason)
      await refresh() // Refresh the orders list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel order'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const searchOrders = async (searchTerm: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await OrderService.searchOrders(searchTerm, {
        page,
        limit: initialLimit
      })

      setOrders(result.orders)
      setTotal(result.total)
      setTotalPages(result.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search orders')
      console.error('Error searching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load orders when dependencies change
  useEffect(() => {
    if (autoLoad) {
      loadOrders()
    }
  }, [page, filters, sortBy, sortOrder, userId])

  return {
    orders,
    loading,
    error,
    total,
    page,
    totalPages,
    refresh,
    createOrder,
    updateOrder,
    updateOrderStatus,
    cancelOrder,
    searchOrders,
    setFilters,
    setPage,
    setSortBy,
    setSortOrder
  }
}

// Hook for order statistics
export const useOrderStats = () => {
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const orderStats = await OrderService.getOrderStats()
      setStats(orderStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order stats')
      console.error('Error loading order stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refresh: loadStats
  }
}

// Hook for a single order
export const useOrder = (orderId: string) => {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadOrder = async () => {
    if (!orderId) return

    try {
      setLoading(true)
      setError(null)
      const orderData = await OrderService.getOrderById(orderId)
      setOrder(orderData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order')
      console.error('Error loading order:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrder()
  }, [orderId])

  return {
    order,
    loading,
    error,
    refresh: loadOrder
  }
}
