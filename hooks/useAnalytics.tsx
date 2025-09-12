"use client"

import { useState, useEffect } from 'react'
import { AnalyticsService, AnalyticsData, RevenueData, TopProduct, CustomerSegment, RecentActivity, AnalyticsFilters } from '@/lib/analyticsService'

interface UseAnalyticsReturn {
  analyticsData: AnalyticsData | null
  revenueData: RevenueData[]
  topProducts: TopProduct[]
  customerSegments: CustomerSegment[]
  recentActivity: RecentActivity[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  setFilters: (filters: AnalyticsFilters) => void
}

export const useAnalytics = (initialFilters: AnalyticsFilters = { timeRange: '30d' }): UseAnalyticsReturn => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AnalyticsFilters>(initialFilters)

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load all analytics data in parallel
      const [
        analytics,
        revenue,
        products,
        segments,
        activity
      ] = await Promise.all([
        AnalyticsService.getAnalyticsData(filters),
        AnalyticsService.getRevenueData(filters),
        AnalyticsService.getTopProducts(filters, 5),
        AnalyticsService.getCustomerSegments(),
        AnalyticsService.getRecentActivity(10)
      ])

      setAnalyticsData(analytics)
      setRevenueData(revenue)
      setTopProducts(products)
      setCustomerSegments(segments)
      setRecentActivity(activity)
    } catch (err) {
      console.error('Error loading analytics data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    await loadAnalyticsData()
  }

  const handleSetFilters = (newFilters: AnalyticsFilters) => {
    setFilters(newFilters)
  }

  // Load data when filters change
  useEffect(() => {
    loadAnalyticsData()
  }, [filters])

  return {
    analyticsData,
    revenueData,
    topProducts,
    customerSegments,
    recentActivity,
    loading,
    error,
    refresh,
    setFilters: handleSetFilters
  }
}

// Hook for specific analytics sections
export const useRevenueAnalytics = (filters: AnalyticsFilters) => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadRevenueData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await AnalyticsService.getRevenueData(filters)
      setRevenueData(data)
    } catch (err) {
      console.error('Error loading revenue data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load revenue data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRevenueData()
  }, [filters])

  return {
    revenueData,
    loading,
    error,
    refresh: loadRevenueData
  }
}

export const useTopProducts = (filters: AnalyticsFilters, limit: number = 5) => {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTopProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await AnalyticsService.getTopProducts(filters, limit)
      setTopProducts(data)
    } catch (err) {
      console.error('Error loading top products:', err)
      setError(err instanceof Error ? err.message : 'Failed to load top products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTopProducts()
  }, [filters, limit])

  return {
    topProducts,
    loading,
    error,
    refresh: loadTopProducts
  }
}
