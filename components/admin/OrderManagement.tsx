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

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  orderDate: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: number
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  shippingAddress: string
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed'
}

export function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  // Mock orders data - in a real app, this would come from Supabase
  const mockOrders: Order[] = [
    {
      id: "1",
      orderNumber: "ORD-2024-001",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.j@email.com",
      orderDate: "2024-01-15",
      status: "pending",
      totalAmount: 89.97,
      items: [
        { id: "1", name: "Nourishing Hair Mask", quantity: 2, price: 24.99 },
        { id: "2", name: "Volumizing Shampoo", quantity: 1, price: 18.99 },
        { id: "3", name: "Heat Protection Spray", quantity: 1, price: 22.99 }
      ],
      shippingAddress: "123 Main St, New York, NY 10001",
      paymentMethod: "Bank Transfer",
      paymentStatus: "paid"
    },
    {
      id: "2",
      orderNumber: "ORD-2024-002",
      customerName: "Michael Chen",
      customerEmail: "mchen@email.com",
      orderDate: "2024-01-14",
      status: "processing",
      totalAmount: 156.85,
      items: [
        { id: "4", name: "Professional Hair Dryer", quantity: 1, price: 89.99 },
        { id: "5", name: "Styling Gel", quantity: 2, price: 16.99 },
        { id: "6", name: "Hair Brush Set", quantity: 1, price: 32.88 }
      ],
      shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
      paymentMethod: "Bank Transfer",
      paymentStatus: "paid"
    },
    {
      id: "3",
      orderNumber: "ORD-2024-003",
      customerName: "Emily Rodriguez",
      customerEmail: "emily.r@email.com",
      orderDate: "2024-01-13",
      status: "shipped",
      totalAmount: 45.98,
      items: [
        { id: "7", name: "Color-Safe Conditioner", quantity: 1, price: 22.99 },
        { id: "8", name: "Hair Oil Treatment", quantity: 1, price: 22.99 }
      ],
      shippingAddress: "789 Pine Rd, Chicago, IL 60601",
      paymentMethod: "Bank Transfer",
      paymentStatus: "paid"
    },
    {
      id: "4",
      orderNumber: "ORD-2024-004",
      customerName: "David Thompson",
      customerEmail: "dthompson@email.com",
      orderDate: "2024-01-12",
      status: "delivered",
      totalAmount: 67.96,
      items: [
        { id: "9", name: "Anti-Frizz Serum", quantity: 1, price: 28.99 },
        { id: "10", name: "Hair Spray", quantity: 1, price: 18.99 },
        { id: "11", name: "Hair Clips", quantity: 1, price: 19.98 }
      ],
      shippingAddress: "321 Elm St, Miami, FL 33101",
      paymentMethod: "Bank Transfer",
      paymentStatus: "paid"
    }
  ]

  const statuses = ["all", "pending", "processing", "shipped", "delivered", "cancelled"]

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id))
    }
  }

  const handleBulkStatusUpdate = (newStatus: Order['status']) => {
    // In a real app, this would call Supabase to update order statuses
    console.log("Updating orders:", selectedOrders, "to status:", newStatus)
    setSelectedOrders([])
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'processing': return 'default'
      case 'shipped': return 'secondary'
      case 'delivered': return 'default'
      case 'cancelled': return 'destructive'
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

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4">
                    <Checkbox
                      checked={selectedOrders.length === filteredOrders.length}
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
                {filteredOrders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => handleSelectOrder(order.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{order.orderNumber}</div>
                      <div className="text-sm text-gray-600">
                        {order.items.length} item(s)
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-600">{order.customerEmail}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={getStatusColor(order.status) as any} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">${order.totalAmount.toFixed(2)}</div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <Badge variant={getPaymentStatusColor(order.paymentStatus) as any}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </Badge>
                        <div className="text-sm text-gray-600">{order.paymentMethod}</div>
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
        </CardContent>
      </Card>

      {/* Order Details Modal Placeholder */}
      <div className="text-center text-gray-500">
        <p>Click the eye icon to view detailed order information</p>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredOrders.length} of {mockOrders.length} orders
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
