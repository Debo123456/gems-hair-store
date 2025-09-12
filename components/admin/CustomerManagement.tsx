"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Eye, Mail, Phone, MapPin, DollarSign, Star, Users, CheckCircle, TrendingUp } from "lucide-react"
import { useCustomers } from "@/hooks/useCustomers"
import { Customer } from "@/lib/customerService"
import { AddCustomerModal } from "./AddCustomerModal"
import { exportCustomersToCSV } from "@/lib/exportUtils"

export function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

    // Use real customer data from the database
  const { 
    customers, 
    loading, 
    error, 
    total,
    setFilters,
    searchCustomers,
    refresh
  } = useCustomers({
    initialPage: 1,
    initialLimit: 20
  })


  const statuses = ["all", "active", "inactive", "vip"]

  // Use real customers data from the database
  const displayCustomers = customers

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    )
  }

  const handleSelectAll = () => {
    if (selectedCustomers.length === displayCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(displayCustomers.map(c => c.id))
    }
  }

  const handleBulkAction = (action: string) => {
    // In a real app, this would perform bulk actions on selected customers
    console.log("Performing action:", action, "on customers:", selectedCustomers)
    setSelectedCustomers([])
  }

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status)
    if (status === "all") {
      setFilters({})
    } else {
      setFilters({ status: [status] })
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      searchCustomers(query)
    } else {
      setFilters({})
    }
  }

  const handleAddCustomer = () => {
    setShowAddCustomerModal(true)
  }

  const handleCustomerAdded = () => {
    // Refresh the customer list
    refresh()
    setShowAddCustomerModal(false)
  }

  const handleExportCustomers = async () => {
    setIsExporting(true)
    try {
      // Export current customers (you can enhance this to get all customers if needed)
      exportCustomersToCSV(displayCustomers)
    } catch (error) {
      console.error('Error exporting customers:', error)
    } finally {
      setIsExporting(false)
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
          <Button 
            variant="outline" 
            onClick={handleExportCustomers}
            disabled={isExporting || displayCustomers.length === 0}
          >
            {isExporting ? 'Exporting...' : 'Export Customers'}
          </Button>
          <Button onClick={handleAddCustomer}>
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
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? "Loading..." : "Registered customers"}
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
              {displayCustomers.filter(c => c.status === 'active' || c.status === 'vip').length}
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
              {displayCustomers.filter(c => c.status === 'vip').length}
            </div>
            <p className="text-xs text-muted-foreground">
              High-value customers
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
              {displayCustomers.filter(c => {
                const joinDate = new Date(c.joinDate)
                const now = new Date()
                const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
                return joinDate >= thisMonth
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Recent signups
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
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">Loading customers...</div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500">Error loading customers: {error}</div>
            </div>
          ) : displayCustomers.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">No customers found</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4">
                      <Checkbox
                        checked={selectedCustomers.length === displayCustomers.length && displayCustomers.length > 0}
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
                  {displayCustomers.map(customer => (
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
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {customer.location || 'N/A'}
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
                        {customer.lastOrderDate ? (
                          new Date(customer.lastOrderDate).toLocaleDateString()
                        ) : (
                          <span className="text-gray-500">Never</span>
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
          )}
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
              const count = displayCustomers.filter(c => getCustomerValue(c) === segment).length
              const percentage = displayCustomers.length > 0 ? Math.round((count / displayCustomers.length) * 100) : 0
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
            {displayCustomers.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-4">
                No customer data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Highest spending customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {displayCustomers
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
            {displayCustomers.filter(c => c.totalSpent > 0).length === 0 && (
              <div className="text-center text-gray-500 text-sm py-4">
                No customers with orders yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {displayCustomers.length} of {total} customers
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

      {/* Add Customer Modal */}
      <AddCustomerModal
        open={showAddCustomerModal}
        onOpenChange={setShowAddCustomerModal}
        onCustomerAdded={handleCustomerAdded}
      />
    </div>
  )
}
