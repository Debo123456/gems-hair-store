"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Eye, Mail, Phone, MapPin, Calendar, DollarSign, ShoppingBag, Star, Users, CheckCircle } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  joinDate: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
  status: 'active' | 'inactive' | 'vip'
  location: string
  avatar?: string
}

export function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])

  // Mock customers data - in a real app, this would come from Supabase
  const mockCustomers: Customer[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 123-4567",
      joinDate: "2023-03-15",
      totalOrders: 12,
      totalSpent: 456.78,
      lastOrderDate: "2024-01-15",
      status: "vip",
      location: "New York, NY",
      avatar: "/avatars/sarah.jpg"
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "mchen@email.com",
      phone: "+1 (555) 234-5678",
      joinDate: "2023-06-22",
      totalOrders: 8,
      totalSpent: 289.45,
      lastOrderDate: "2024-01-14",
      status: "active",
      location: "Los Angeles, CA",
      avatar: "/avatars/michael.jpg"
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.r@email.com",
      phone: "+1 (555) 345-6789",
      joinDate: "2023-09-08",
      totalOrders: 5,
      totalSpent: 156.92,
      lastOrderDate: "2024-01-13",
      status: "active",
      location: "Chicago, IL",
      avatar: "/avatars/emily.jpg"
    },
    {
      id: "4",
      name: "David Thompson",
      email: "dthompson@email.com",
      phone: "+1 (555) 456-7890",
      joinDate: "2023-11-12",
      totalOrders: 3,
      totalSpent: 89.97,
      lastOrderDate: "2024-01-12",
      status: "active",
      location: "Miami, FL",
      avatar: "/avatars/david.jpg"
    },
    {
      id: "5",
      name: "Lisa Wang",
      email: "lisa.wang@email.com",
      phone: "+1 (555) 567-8901",
      joinDate: "2023-02-28",
      totalOrders: 18,
      totalSpent: 892.34,
      lastOrderDate: "2024-01-10",
      status: "vip",
      location: "San Francisco, CA",
      avatar: "/avatars/lisa.jpg"
    },
    {
      id: "6",
      name: "James Wilson",
      email: "jwilson@email.com",
      phone: "+1 (555) 678-9012",
      joinDate: "2023-07-15",
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: "Never",
      status: "inactive",
      location: "Seattle, WA",
      avatar: "/avatars/james.jpg"
    }
  ]

  const statuses = ["all", "active", "inactive", "vip"]

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery)
    const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    )
  }

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id))
    }
  }

  const handleBulkAction = (action: string) => {
    // In a real app, this would perform bulk actions on selected customers
    console.log("Performing action:", action, "on customers:", selectedCustomers)
    setSelectedCustomers([])
  }

  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'vip': return 'default'
      default: return 'default'
    }
  }

  const getStatusBadge = (status: Customer['status']) => {
    switch (status) {
      case 'active': return <Badge variant="default">Active</Badge>
      case 'inactive': return <Badge variant="secondary">Inactive</Badge>
      case 'vip': return <Badge variant="default" className="bg-yellow-100 text-yellow-800 border-yellow-200">VIP</Badge>
      default: return <Badge variant="default">Active</Badge>
    }
  }

  const getCustomerValue = (customer: Customer) => {
    if (customer.totalSpent >= 500) return "High Value"
    if (customer.totalSpent >= 200) return "Medium Value"
    if (customer.totalSpent >= 50) return "Low Value"
    return "No Value"
  }

  const getValueColor = (value: string) => {
    switch (value) {
      case 'High Value': return 'default'
      case 'Medium Value': return 'secondary'
      case 'Low Value': return 'outline'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Management</h2>
          <p className="text-gray-600">Manage customer relationships and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Export Customers
          </Button>
          <Button>
            Add Customer
          </Button>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCustomers.length}</div>
            <p className="text-xs text-muted-foreground">
              +12 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCustomers.filter(c => c.status === 'active' || c.status === 'vip').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockCustomers.filter(c => c.status === 'active' || c.status === 'vip').length / mockCustomers.length) * 100)}% of total
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
              {mockCustomers.filter(c => c.status === 'vip').length}
            </div>
            <p className="text-xs text-muted-foreground">
              High-value customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / mockCustomers.filter(c => c.totalOrders > 0).length).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per customer
            </p>
          </CardContent>
        </Card>
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
                placeholder="Search customers..."
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
      {selectedCustomers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedCustomers.length} customer(s) selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('export')}>
                  Export Selected
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('email')}>
                  Send Email
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('status')}>
                  Update Status
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4">
                    <Checkbox
                      checked={selectedCustomers.length === filteredCustomers.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Contact</th>
                  <th className="text-left p-4">Location</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Orders</th>
                  <th className="text-left p-4">Total Spent</th>
                  <th className="text-left p-4">Last Order</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={() => handleSelectCustomer(customer.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={customer.avatar} alt={customer.name} />
                          <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-600">
                            Joined {new Date(customer.joinDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {customer.location}
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(customer.status)}
                    </td>
                    <td className="p-4">
                      <div className="text-center">
                        <div className="font-medium">{customer.totalOrders}</div>
                        <Badge variant={getValueColor(getCustomerValue(customer))} className="text-xs">
                          {getCustomerValue(customer)}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">${customer.totalSpent.toFixed(2)}</div>
                      {customer.totalOrders > 0 && (
                        <div className="text-sm text-gray-600">
                          ${(customer.totalSpent / customer.totalOrders).toFixed(2)} avg
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {customer.lastOrderDate === "Never" ? (
                          <span className="text-gray-500">Never</span>
                        ) : (
                          new Date(customer.lastOrderDate).toLocaleDateString()
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Select value={customer.status} onValueChange={(value: Customer['status']) => console.log("Update customer", customer.id, "to", value)}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
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

      {/* Customer Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Breakdown by customer value</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {['High Value', 'Medium Value', 'Low Value', 'No Value'].map(segment => {
              const count = mockCustomers.filter(c => getCustomerValue(c) === segment).length
              const percentage = Math.round((count / mockCustomers.length) * 100)
              return (
                <div key={segment} className="flex items-center justify-between">
                  <span className="text-sm">{segment}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Highest spending customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCustomers
              .filter(c => c.totalSpent > 0)
              .sort((a, b) => b.totalSpent - a.totalSpent)
              .slice(0, 5)
              .map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium">{customer.name}</span>
                  </div>
                  <span className="text-sm font-medium">${customer.totalSpent.toFixed(2)}</span>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredCustomers.length} of {mockCustomers.length} customers
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
