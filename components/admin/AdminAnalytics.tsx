"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package, Calendar, BarChart3 } from "lucide-react"

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  // Mock analytics data - in a real app, this would come from Supabase
  const mockAnalytics = {
    revenue: {
      current: 45678.90,
      previous: 38945.67,
      change: 17.3,
      trend: "up"
    },
    orders: {
      current: 156,
      previous: 134,
      change: 16.4,
      trend: "up"
    },
    customers: {
      current: 89,
      previous: 76,
      change: 17.1,
      trend: "up"
    },
    products: {
      current: 24,
      previous: 22,
      change: 9.1,
      trend: "up"
    }
  }

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

  const getMetricData = (metric: string) => {
    return mockAnalytics[metric as keyof typeof mockAnalytics]
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

  // Mock chart data
  const revenueData = [
    { month: "Jan", revenue: 12500, orders: 45 },
    { month: "Feb", revenue: 13800, orders: 52 },
    { month: "Mar", revenue: 14200, orders: 58 },
    { month: "Apr", revenue: 15600, orders: 64 },
    { month: "May", revenue: 16800, orders: 71 },
    { month: "Jun", revenue: 18200, orders: 78 },
    { month: "Jul", revenue: 19500, orders: 85 },
    { month: "Aug", revenue: 20800, orders: 92 },
    { month: "Sep", revenue: 22100, orders: 99 },
    { month: "Oct", revenue: 23400, orders: 106 },
    { month: "Nov", revenue: 24700, orders: 113 },
    { month: "Dec", revenue: 26000, orders: 120 }
  ]

  const topProducts = [
    { name: "Nourishing Hair Mask", sales: 234, revenue: 5841.66 },
    { name: "Volumizing Shampoo", sales: 189, revenue: 3589.11 },
    { name: "Heat Protection Spray", sales: 156, revenue: 3586.44 },
    { name: "Professional Hair Dryer", sales: 45, revenue: 4049.55 },
    { name: "Styling Gel", sales: 123, revenue: 2090.77 }
  ]

  const customerSegments = [
    { segment: "New Customers", count: 23, percentage: 25.8 },
    { segment: "Returning Customers", count: 45, percentage: 50.6 },
    { segment: "VIP Customers", count: 12, percentage: 13.5 },
    { segment: "Inactive Customers", count: 9, percentage: 10.1 }
  ]

  const recentActivity = [
    { action: "New order placed", details: "ORD-2024-001 by Sarah Johnson", time: "2 hours ago", type: "order" },
    { action: "Product restocked", details: "Heat Protection Spray - 50 units", time: "4 hours ago", type: "inventory" },
    { action: "New customer registered", details: "Emily Rodriguez", time: "6 hours ago", type: "customer" },
    { action: "Payment received", details: "ORD-2024-002 - $156.85", time: "8 hours ago", type: "payment" },
    { action: "Order shipped", details: "ORD-2024-003 to Chicago", time: "1 day ago", type: "shipping" }
  ]

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
          <Select value={timeRange} onValueChange={setTimeRange}>
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
          <Button variant="outline">
            Export Report
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
                  ${revenueData[revenueData.length - 1].revenue.toLocaleString()}
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  +12.5% from last month
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
                  <div className="font-medium">${Math.round(revenueData.reduce((sum, d) => sum + d.revenue, 0) / revenueData.length).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">Growth Rate</div>
                  <div className="font-medium text-green-600">+17.3%</div>
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
                  {revenueData[revenueData.length - 1].orders}
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  +8.2% from last month
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
                  <div className="font-medium">{Math.round(revenueData.reduce((sum, d) => sum + d.orders, 0) / revenueData.length)}</div>
                </div>
                <div>
                  <div className="text-gray-600">Growth Rate</div>
                  <div className="font-medium text-blue-600">+16.4%</div>
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
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
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
              ))}
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
              {customerSegments.map(segment => (
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
              ))}
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
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{activity.action}</div>
                    <div className="text-xs text-gray-600">{activity.details}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))}
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
              <div className="text-2xl font-bold text-green-600">+17.3%</div>
              <div className="text-sm text-gray-600">Revenue Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">+16.4%</div>
              <div className="text-sm text-gray-600">Order Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">+17.1%</div>
              <div className="text-sm text-gray-600">Customer Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">+9.1%</div>
              <div className="text-sm text-gray-600">Product Growth</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Business Insight</h4>
            <p className="text-sm text-blue-800">
              Your store is showing strong growth across all key metrics. Revenue is up 17.3% with 
              increasing customer acquisition and order volume. Consider expanding your product line 
              and implementing customer retention strategies to maintain this momentum.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
