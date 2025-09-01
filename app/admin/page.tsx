"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package, ShoppingCart, Users, BarChart3, Plus, Edit, Trash2,
  Calendar, DollarSign, Truck, CheckCircle, TrendingUp, Eye
} from "lucide-react"
import { useRouter } from "next/navigation"
import { AdminOnly } from "@/components/ProtectedRoute"
import { ProductManagement } from "@/components/admin/ProductManagement"
import { OrderManagement } from "@/components/admin/OrderManagement"
import { CustomerManagement } from "@/components/admin/CustomerManagement"
import { AdminAnalytics } from "@/components/admin/AdminAnalytics"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("products")

  // Mock admin data - in a real app, this would come from Supabase
  const mockStats = {
    totalProducts: 24,
    totalOrders: 156,
    totalCustomers: 89,
    totalRevenue: 45678.90,
    pendingOrders: 12,
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
                <div className="text-2xl font-bold">{mockStats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  +12 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  +8 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockStats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +23% from last month
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
                  {mockStats.pendingOrders} orders need attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
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
