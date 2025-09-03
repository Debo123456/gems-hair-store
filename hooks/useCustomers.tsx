"use client"

import { useState, useEffect } from 'react'
import { CustomerService } from '@/lib/customerService'
import { Customer, CustomerStats, CustomerFilters } from '@/lib/customerService'

interface UseCustomersReturn {
  customers: Customer[]
  loading: boolean
  error: string | null
  total: number
  page: number
  totalPages: number
  refresh: () => Promise<void>
  setFilters: (filters: CustomerFilters) => void
  setPage: (page: number) => void
  setSortBy: (sortBy: string) => void
  setSortOrder: (sortOrder: 'asc' | 'desc') => void
  searchCustomers: (searchTerm: string) => Promise<void>
}

interface UseCustomersOptions {
  initialPage?: number
  initialLimit?: number
  initialFilters?: CustomerFilters
  autoLoad?: boolean
}

export const useCustomers = (options: UseCustomersOptions = {}): UseCustomersReturn => {
  const {
    initialPage = 1,
    initialLimit = 20,
    initialFilters = {},
    autoLoad = true
  } = options

  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState<CustomerFilters>(initialFilters)
  const [sortBy, setSortBy] = useState<'created_at' | 'total_spent' | 'total_orders' | 'name'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const loadCustomers = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await CustomerService.getCustomers({
        page,
        limit: initialLimit,
        filters,
        sortBy,
        sortOrder
      })

      setCustomers(result.customers)
      setTotal(result.total)
      setTotalPages(result.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers')
      console.error('Error loading customers:', err)
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    await loadCustomers()
  }

  const searchCustomers = async (searchTerm: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await CustomerService.searchCustomers(searchTerm, {
        page,
        limit: initialLimit
      })

      setCustomers(result.customers)
      setTotal(result.total)
      setTotalPages(result.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search customers')
      console.error('Error searching customers:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load customers when dependencies change
  useEffect(() => {
    if (autoLoad) {
      loadCustomers()
    }
  }, [page, filters, sortBy, sortOrder])

  return {
    customers,
    loading,
    error,
    total,
    page,
    totalPages,
    refresh,
    setFilters,
    setPage,
    setSortBy,
    setSortOrder,
    searchCustomers
  }
}

// Hook for customer statistics
export const useCustomerStats = () => {
  const [stats, setStats] = useState<CustomerStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const customerStats = await CustomerService.getCustomerStats()
      setStats(customerStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customer stats')
      console.error('Error loading customer stats:', err)
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

// Hook for a single customer
export const useCustomer = (customerId: string) => {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCustomer = async () => {
    if (!customerId) return

    try {
      setLoading(true)
      setError(null)
      const customerData = await CustomerService.getCustomerById(customerId)
      setCustomer(customerData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customer')
      console.error('Error loading customer:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomer()
  }, [customerId])

  return {
    customer,
    loading,
    error,
    refresh: loadCustomer
  }
}
