"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

interface OrderStatus {
  orderNumber: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  estimatedDelivery?: string
  trackingNumber?: string
  lastUpdate: string
  items: Array<{
    name: string
    quantity: number
    size: string
  }>
  total: number
}

// Mock order data - in a real app, this would come from an API
const mockOrders: Record<string, OrderStatus> = {
  "GEMS-1703123456789": {
    orderNumber: "GEMS-1703123456789",
    status: "shipped",
    estimatedDelivery: "2024-01-20",
    trackingNumber: "TRK123456789",
    lastUpdate: "2024-01-15T10:30:00Z",
    items: [
      { name: "Premium Hair Oil", quantity: 2, size: "100ml" },
      { name: "Silk Hair Mask", quantity: 1, size: "200ml" }
    ],
    total: 84.97
  },
  "GEMS-1703123456790": {
    orderNumber: "GEMS-1703123456790",
    status: "pending",
    lastUpdate: "2024-01-15T09:15:00Z",
    items: [
      { name: "Natural Shampoo", quantity: 1, size: "500ml" }
    ],
    total: 19.99
  }
}

const getStatusIcon = (status: OrderStatus["status"]) => {
  switch (status) {
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-600" />
    case "processing":
      return <Package className="h-5 w-5 text-blue-600" />
    case "shipped":
      return <Truck className="h-5 w-5 text-purple-600" />
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "cancelled":
      return <AlertCircle className="h-5 w-5 text-red-600" />
    default:
      return <Clock className="h-5 w-5 text-gray-600" />
  }
}

const getStatusColor = (status: OrderStatus["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "processing":
      return "bg-blue-100 text-blue-800"
    case "shipped":
      return "bg-purple-100 text-purple-800"
    case "delivered":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusDescription = (status: OrderStatus["status"]) => {
  switch (status) {
    case "pending":
      return "Waiting for payment confirmation"
    case "processing":
      return "Order is being prepared for shipping"
    case "shipped":
      return "Order has been shipped and is in transit"
    case "delivered":
      return "Order has been delivered successfully"
    case "cancelled":
      return "Order has been cancelled"
    default:
      return "Unknown status"
  }
}

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [searchedOrder, setSearchedOrder] = useState<OrderStatus | null>(null)
  const [error, setError] = useState("")

  const handleSearch = () => {
    if (!orderNumber.trim()) {
      setError("Please enter an order number")
      return
    }

    const order = mockOrders[orderNumber.trim()]
    if (order) {
      setSearchedOrder(order)
      setError("")
    } else {
      setSearchedOrder(null)
      setError("Order not found. Please check your order number and try again.")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order number to check the status of your order</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <Card className="max-w-2xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Track Order
            </CardTitle>
            <CardDescription>
              Enter your order number to get real-time updates on your order status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Enter order number (e.g., GEMS-1703123456789)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                Track Order
              </Button>
            </div>
            
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Status */}
        {searchedOrder && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order #{searchedOrder.orderNumber}
                  </CardTitle>
                  <CardDescription>
                    Last updated: {new Date(searchedOrder.lastUpdate).toLocaleString()}
                  </CardDescription>
                </div>
                <Badge className={`px-3 py-1 text-sm font-medium ${getStatusColor(searchedOrder.status)}`}>
                  {searchedOrder.status.charAt(0).toUpperCase() + searchedOrder.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Overview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  {getStatusIcon(searchedOrder.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getStatusDescription(searchedOrder.status)}
                    </h3>
                    {searchedOrder.estimatedDelivery && (
                      <p className="text-sm text-gray-600">
                        Estimated delivery: {new Date(searchedOrder.estimatedDelivery).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                
                {searchedOrder.trackingNumber && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <p className="text-sm text-gray-600 mb-1">Tracking Number:</p>
                    <p className="font-mono text-lg font-semibold">{searchedOrder.trackingNumber}</p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {searchedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded flex items-center justify-center">
                        <span className="text-sm">🛍️</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{item.name}</h5>
                        <p className="text-sm text-gray-600">Size: {item.size} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Order Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Order Total:</span>
                <span className="text-2xl font-bold text-purple-600">${searchedOrder.total.toFixed(2)}</span>
              </div>

              {/* Status Timeline */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Order Timeline</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Order Placed</p>
                      <p className="text-sm text-gray-600">
                        {new Date(searchedOrder.lastUpdate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {searchedOrder.status !== "pending" && (
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Payment Confirmed</p>
                        <p className="text-sm text-gray-600">
                          {new Date(searchedOrder.lastUpdate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {searchedOrder.status === "shipped" && (
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Order Shipped</p>
                        <p className="text-sm text-gray-600">
                          {new Date(searchedOrder.lastUpdate).toLocaleString()}
                        </p>
                        {searchedOrder.trackingNumber && (
                          <p className="text-sm text-purple-600">
                            Tracking: {searchedOrder.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {searchedOrder.status === "delivered" && (
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Order Delivered</p>
                        <p className="text-sm text-gray-600">
                          {new Date(searchedOrder.lastUpdate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Can&apos;t find your order or have questions about your order status?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" asChild>
                <a href="mailto:support@gemshair.com">
                  Contact Support
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/products">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
