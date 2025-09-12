"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package, ShoppingCart, Users, BarChart3
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

        {/* Main Dashboard Tabs */}
        <div className="container mx-auto px-4 py-6">
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
