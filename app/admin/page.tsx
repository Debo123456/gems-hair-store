"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package, ShoppingCart, Users, BarChart3, Plus, Edit, Trash2,
  Calendar, DollarSign, Truck, CheckCircle, TrendingUp, Eye, Star
} from "lucide-react"
import { useRouter } from "next/navigation"
import { AdminOnly } from "@/components/ProtectedRoute"
import { ProductManagement } from "@/components/admin/ProductManagement"
import { OrderManagement } from "@/components/admin/OrderManagement"
import { CustomerManagement } from "@/components/admin/CustomerManagement"
import { AdminAnalytics } from "@/components/admin/AdminAnalytics"

import { useOrderStats } from "@/hooks/useOrders"
import { useCustomerStats } from "@/hooks/useCustomers"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("products")
  const { stats: orderStats, loading: orderStatsLoading } = useOrderStats()
  const { stats: customerStats, loading: customerStatsLoading } = useCustomerStats()

  // Mock data for other stats - these would come from other services in a real app
  const mockStats = {
    totalProducts: 24,
    lowStockProducts: 3
  }

  return (
    <AdminOnly fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don&apos;t have permission to access this page.</p>
          <Button onClick={() => router.push("/")}>
            Back to Store
          </Button>
        </div>
      </div>
    }>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage your e-commerce store</p>
              </div>
              <Button onClick={() => router.push("/")}>
                Back to Store
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orderStatsLoading ? "..." : orderStats?.total_orders || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {orderStatsLoading ? "Loading..." : `${orderStats?.pending_orders || 0} pending`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customerStatsLoading ? "..." : customerStats?.total_customers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {customerStatsLoading ? "Loading..." : `${customerStats?.new_customers_this_month || 0} new this month`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${orderStatsLoading ? "..." : (orderStats?.total_revenue || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {orderStatsLoading ? "Loading..." : `Avg: $${(orderStats?.average_order_value || 0).toFixed(2)}`}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Customer Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customerStatsLoading ? "..." : customerStats?.active_customers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Recent activity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customerStatsLoading ? "..." : customerStats?.vip_customers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  High value customers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customerStatsLoading ? "..." : customerStats?.new_customers_this_month || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Recent signups
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orderStatsLoading ? "..." : orderStats?.processing_orders || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Being prepared
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shipped</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orderStatsLoading ? "..." : orderStats?.shipped_orders || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  In transit
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orderStatsLoading ? "..." : orderStats?.delivered_orders || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Completed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Pending Orders
                </CardTitle>
                <CardDescription>
                  {orderStatsLoading ? "Loading..." : `${orderStats?.pending_orders || 0} orders need attention`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab("orders")}
                >
                  View Pending Orders
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription>
                  {mockStats.lowStockProducts} products running low
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Low Stock Items
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Customers
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4">
              <ProductManagement />
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <OrderManagement />
            </TabsContent>

            <TabsContent value="customers" className="space-y-4">
              <CustomerManagement />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <AdminAnalytics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminOnly>
  )
}
