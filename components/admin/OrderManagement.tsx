"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, Eye, Truck, CheckCircle, Clock, AlertCircle, Package } from "lucide-react"
import { useOrders } from "@/hooks/useOrders"
import { Order, OrderStatus, ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from "@/lib/orderTypes"

export function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  // Use real order data from the database
  const { 
    orders, 
    loading, 
    error, 
    total, 
    page, 
    totalPages,
    setFilters,
    setPage,
    updateOrderStatus,
    searchOrders
  } = useOrders({
    initialPage: 1,
    initialLimit: 20
  })



  const statuses = ["all", "pending", "processing", "shipped", "delivered", "cancelled"]

  // Use real orders data from the database
  const displayOrders = orders

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === displayOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(displayOrders.map(o => o.id))
    }
  }

  const handleBulkStatusUpdate = async (newStatus: OrderStatus) => {
    try {
      // Update each selected order
      for (const orderId of selectedOrders) {
        await updateOrderStatus(orderId, newStatus, 'Bulk status update')
      }
      setSelectedOrders([])
    } catch (error) {
      console.error('Failed to update order statuses:', error)
    }
  }

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status)
    if (status === "all") {
      setFilters({})
    } else {
      setFilters({ status: [status as OrderStatus] })
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      searchOrders(query)
    } else {
      setFilters({})
    }
  }

  const getStatusColor = (status: string) => {
    const config = ORDER_STATUS_CONFIG[status as keyof typeof ORDER_STATUS_CONFIG]
    if (!config) return 'default'
    
    switch (config.color) {
      case 'yellow': return 'warning'
      case 'blue': return 'default'
      case 'purple': return 'secondary'
      case 'indigo': return 'secondary'
      case 'green': return 'default'
      case 'red': return 'destructive'
      case 'gray': return 'secondary'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'processing': return <Package className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default'
      case 'pending': return 'warning'
      case 'failed': return 'destructive'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Export Orders
          </Button>
          <Button>
            Create Order
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders, customers..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={handleStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedOrders.length} order(s) selected
              </span>
              <div className="flex gap-2">
                <Select onValueChange={(value: Order['status']) => handleBulkStatusUpdate(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  Print Labels
                </Button>
                <Button variant="outline" size="sm">
                  Send Updates
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {loading && (
            <div className="p-8 text-center">
              <div className="text-gray-500">Loading orders...</div>
            </div>
          )}
          {error && (
            <div className="p-8 text-center">
              <div className="text-red-500">Error loading orders: {error}</div>
            </div>
          )}
          {!loading && !error && displayOrders.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-500">No orders found</div>
            </div>
          )}
          {!loading && !error && displayOrders.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4">
                      <Checkbox
                        checked={selectedOrders.length === displayOrders.length && displayOrders.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left p-4">Order</th>
                    <th className="text-left p-4">Customer</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Total</th>
                    <th className="text-left p-4">Payment</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayOrders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => handleSelectOrder(order.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{order.order_number}</div>
                      <div className="text-sm text-gray-600">
                        {order.items?.length || 0} item(s)
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{order.customer_name}</div>
                      <div className="text-sm text-gray-600">{order.customer_email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={getStatusColor(order.status) as "default" | "destructive" | "secondary" | "outline"} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">${order.total_amount.toFixed(2)}</div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <Badge variant={getPaymentStatusColor(order.payment_status) as "default" | "destructive" | "secondary" | "outline"}>
                          {PAYMENT_STATUS_CONFIG[order.payment_status as keyof typeof PAYMENT_STATUS_CONFIG]?.label || order.payment_status}
                        </Badge>
                        <div className="text-sm text-gray-600">{order.payment_method || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Truck className="h-4 w-4" />
                        </Button>
                        <Select value={order.status} onValueChange={(value: Order['status']) => console.log("Update order", order.id, "to", value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal Placeholder */}
      <div className="text-center text-gray-500">
        <p>Click the eye icon to view detailed order information</p>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {displayOrders.length} of {total} orders
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
