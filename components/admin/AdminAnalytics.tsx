"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package, Calendar, BarChart3, Download, RefreshCw } from "lucide-react"
import { useAnalytics } from "@/hooks/useAnalytics"
import { AnalyticsFilters } from "@/lib/analyticsService"

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<AnalyticsFilters['timeRange']>("30d")
  const [selectedMetric, setSelectedMetric] = useState("revenue")
  const [isExporting, setIsExporting] = useState(false)

  // Use real analytics data from Supabase
  const {
    analyticsData,
    revenueData,
    topProducts,
    customerSegments,
    recentActivity,
    loading,
    error,
    refresh,
    setFilters
  } = useAnalytics({ timeRange })

  const timeRanges = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "1y", label: "Last year" }
  ]

  const metrics = [
    { value: "revenue", label: "Revenue", icon: DollarSign },
    { value: "orders", label: "Orders", icon: ShoppingBag },
    { value: "customers", label: "Customers", icon: Users },
    { value: "products", label: "Products", icon: Package }
  ]

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as AnalyticsFilters['timeRange'])
    setFilters({ timeRange: value as AnalyticsFilters['timeRange'] })
  }

  const handleExportReport = async () => {
    setIsExporting(true)
    try {
      // Create analytics report data
      const reportData = {
        timeRange,
        generatedAt: new Date().toISOString(),
        analytics: analyticsData,
        revenueData,
        topProducts,
        customerSegments,
        recentActivity
      }
      
      // Convert to JSON and download
      const dataStr = JSON.stringify(reportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting report:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const getMetricData = (metric: string) => {
    if (!analyticsData) return { current: 0, previous: 0, change: 0, trend: 'up' as const }
    return analyticsData[metric as keyof typeof analyticsData]
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600"
  }

  // Loading and error states
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 mb-4">Error loading analytics</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={refresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="h-4 w-4 text-blue-600" />
      case 'inventory': return <Package className="h-4 w-4 text-green-600" />
      case 'customer': return <Users className="h-4 w-4 text-purple-600" />
      case 'payment': return <DollarSign className="h-4 w-4 text-green-600" />
      case 'shipping': return <Package className="h-4 w-4 text-orange-600" />
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Insights</h2>
          <p className="text-gray-600">Track your business performance and trends</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportReport} disabled={isExporting || loading}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export Report'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map(metric => {
          const data = getMetricData(metric.value)
          const Icon = metric.icon
          return (
            <Card key={metric.value}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metric.value === "revenue" ? `$${data.current.toLocaleString()}` : data.current}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {getTrendIcon(data.trend)}
                  <span className={getTrendColor(data.trend)}>
                    +{data.change}%
                  </span>
                  <span className="text-muted-foreground">vs previous period</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over the last year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  ${revenueData.length > 0 ? revenueData[revenueData.length - 1].revenue.toLocaleString() : '0'}
                </div>
                <Badge variant="outline" className={`${analyticsData?.revenue.trend === 'up' ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'}`}>
                  {analyticsData?.revenue.change ? `${analyticsData.revenue.change > 0 ? '+' : ''}${analyticsData.revenue.change}%` : '0%'} from previous period
                </Badge>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                  <p>Chart visualization would go here</p>
                  <p className="text-sm">Using a charting library like Recharts or Chart.js</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Total Revenue</div>
                  <div className="font-medium">${revenueData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">Avg Monthly</div>
                  <div className="font-medium">${revenueData.length > 0 ? Math.round(revenueData.reduce((sum, d) => sum + d.revenue, 0) / revenueData.length).toLocaleString() : '0'}</div>
                </div>
                <div>
                  <div className="text-gray-600">Growth Rate</div>
                  <div className={`font-medium ${analyticsData?.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData?.revenue.change ? `${analyticsData.revenue.change > 0 ? '+' : ''}${analyticsData.revenue.change}%` : '0%'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Order Volume</CardTitle>
            <CardDescription>Monthly order count and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {revenueData.length > 0 ? revenueData[revenueData.length - 1].orders : '0'}
                </div>
                <Badge variant="outline" className={`${analyticsData?.orders.trend === 'up' ? 'text-blue-600 border-blue-200' : 'text-red-600 border-red-200'}`}>
                  {analyticsData?.orders.change ? `${analyticsData.orders.change > 0 ? '+' : ''}${analyticsData.orders.change}%` : '0%'} from previous period
                </Badge>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                  <p>Chart visualization would go here</p>
                  <p className="text-sm">Using a charting library like Recharts or Chart.js</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Total Orders</div>
                  <div className="font-medium">{revenueData.reduce((sum, d) => sum + d.orders, 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">Avg Monthly</div>
                  <div className="font-medium">{revenueData.length > 0 ? Math.round(revenueData.reduce((sum, d) => sum + d.orders, 0) / revenueData.length) : '0'}</div>
                </div>
                <div>
                  <div className="text-gray-600">Growth Rate</div>
                  <div className={`font-medium ${analyticsData?.orders.trend === 'up' ? 'text-blue-600' : 'text-red-600'}`}>
                    {analyticsData?.orders.change ? `${analyticsData.orders.change > 0 ? '+' : ''}${analyticsData.orders.change}%` : '0%'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Best sellers by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{product.name}</div>
                        <div className="text-xs text-gray-600">{product.sales} units sold</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${product.revenue.toFixed(2)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Package className="h-8 w-8 mx-auto mb-2" />
                  <p>No product sales data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Breakdown by customer type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerSegments.length > 0 ? (
                customerSegments.map(segment => (
                  <div key={segment.segment} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{segment.segment}</span>
                      <span className="font-medium">{segment.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${segment.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600">{segment.percentage}%</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <p>No customer data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest store activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{activity.action}</div>
                      <div className="text-xs text-gray-600">{activity.details}</div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>Key business metrics and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${analyticsData?.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {analyticsData?.revenue.change ? `${analyticsData.revenue.change > 0 ? '+' : ''}${analyticsData.revenue.change}%` : '0%'}
              </div>
              <div className="text-sm text-gray-600">Revenue Growth</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${analyticsData?.orders.trend === 'up' ? 'text-blue-600' : 'text-red-600'}`}>
                {analyticsData?.orders.change ? `${analyticsData.orders.change > 0 ? '+' : ''}${analyticsData.orders.change}%` : '0%'}
              </div>
              <div className="text-sm text-gray-600">Order Growth</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${analyticsData?.customers.trend === 'up' ? 'text-purple-600' : 'text-red-600'}`}>
                {analyticsData?.customers.change ? `${analyticsData.customers.change > 0 ? '+' : ''}${analyticsData.customers.change}%` : '0%'}
              </div>
              <div className="text-sm text-gray-600">Customer Growth</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${analyticsData?.products.trend === 'up' ? 'text-orange-600' : 'text-red-600'}`}>
                {analyticsData?.products.change ? `${analyticsData.products.change > 0 ? '+' : ''}${analyticsData.products.change}%` : '0%'}
              </div>
              <div className="text-sm text-gray-600">Product Growth</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Business Insight</h4>
            <p className="text-sm text-blue-800">
              {analyticsData ? (
                `Your store is showing ${analyticsData.revenue.trend === 'up' ? 'strong growth' : 'some challenges'} across key metrics. ` +
                `Revenue is ${analyticsData.revenue.trend === 'up' ? 'up' : 'down'} ${analyticsData.revenue.change}% with ` +
                `${analyticsData.customers.trend === 'up' ? 'increasing' : 'decreasing'} customer acquisition and ` +
                `${analyticsData.orders.trend === 'up' ? 'growing' : 'declining'} order volume. ` +
                `${analyticsData.revenue.trend === 'up' ? 'Consider expanding your product line and implementing customer retention strategies to maintain this momentum.' : 'Focus on customer acquisition and product optimization to improve performance.'}`
              ) : (
                'Loading business insights...'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
