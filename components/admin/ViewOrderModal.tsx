"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Truck, 
  Calendar, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Edit,
  Printer,
  Send
} from "lucide-react"
import { Order, OrderItem, OrderStatusHistory, ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from "@/lib/orderTypes"

interface ViewOrderModalProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateOrder?: (orderId: string, updates: Partial<Order>) => void
  onStatusUpdate?: (orderId: string, status: Order['status'], notes?: string) => Promise<void>
}

export function ViewOrderModal({ order, open, onOpenChange, onUpdateOrder, onStatusUpdate }: ViewOrderModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newStatus, setNewStatus] = useState<Order['status']>(order?.status || 'pending')
  const [statusNotes, setStatusNotes] = useState('')
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  if (!order) return null

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
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'processing': return <Package className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <AlertCircle className="h-4 w-4" />
      case 'refunded': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default'
      case 'pending': return 'warning'
      case 'failed': return 'destructive'
      case 'refunded': return 'secondary'
      default: return 'default'
    }
  }

  const formatAddress = (address: {
    street?: string
    apartment?: string
    city?: string
    state?: string
    zip?: string
    country?: string
  } | null) => {
    if (!address) return 'N/A'
    const parts = [
      address.street,
      address.apartment,
      address.city,
      address.state,
      address.zip,
      address.country
    ].filter(Boolean)
    return parts.join(', ')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleStatusUpdate = async () => {
    if (!onStatusUpdate || newStatus === order.status) return

    setIsUpdatingStatus(true)
    try {
      await onStatusUpdate(order.id, newStatus, statusNotes || undefined)
      setStatusNotes('')
      // Optionally close the modal or show success message
    } catch (error) {
      console.error('Failed to update order status:', error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Package className="h-6 w-6" />
            Order Details - {order.order_number}
          </DialogTitle>
          <DialogDescription className="text-base">
            Complete order information and management
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Header - Full Width */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={getStatusColor(order.status) as "default" | "destructive" | "secondary" | "outline"} 
                    className="flex items-center gap-2 px-4 py-2 text-sm"
                  >
                    {getStatusIcon(order.status)}
                    {ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG]?.label || order.status}
                  </Badge>
                  <Badge 
                    variant={getPaymentStatusColor(order.payment_status) as "default" | "destructive" | "secondary" | "outline"}
                    className="px-4 py-2 text-sm"
                  >
                    {PAYMENT_STATUS_CONFIG[order.payment_status as keyof typeof PAYMENT_STATUS_CONFIG]?.label || order.payment_status}
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-gray-900">${order.total_amount.toFixed(2)}</div>
                <div className="text-sm text-gray-600">
                  Placed on {formatDate(order.created_at)}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Send Update
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status Update Section */}
          {isEditing && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Edit className="h-5 w-5" />
                  Update Order Status
                </CardTitle>
                <CardDescription>
                  Change the order status and add notes for tracking purposes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="status-select" className="text-sm font-medium">New Status</Label>
                    <Select value={newStatus} onValueChange={(value: Order['status']) => setNewStatus(value)}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="lg:col-span-2 space-y-2">
                    <Label htmlFor="status-notes" className="text-sm font-medium">Notes (Optional)</Label>
                    <Textarea
                      id="status-notes"
                      placeholder="Add notes about this status change..."
                      value={statusNotes}
                      onChange={(e) => setStatusNotes(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={handleStatusUpdate}
                    disabled={isUpdatingStatus || newStatus === order.status}
                    className="min-w-[140px]"
                  >
                    {isUpdatingStatus ? 'Updating...' : 'Update Status'}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setNewStatus(order.status)
                    setStatusNotes('')
                    setIsEditing(false)
                  }}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content Grid - Better Space Utilization */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Customer & Addresses */}
            <div className="xl:col-span-1 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-base">{order.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm break-all">{order.customer_email}</span>
                    </div>
                    {order.customer_phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{order.customer_phone}</span>
                      </div>
                    )}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <strong>User ID:</strong> <span className="font-mono text-xs">{order.user_id}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Order ID:</strong> <span className="font-mono text-xs">{order.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Addresses */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin className="h-4 w-4" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <div className="font-medium">{order.shipping_address?.street}</div>
                      {order.shipping_address?.apartment && (
                        <div>{order.shipping_address.apartment}</div>
                      )}
                      <div>
                        {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zip}
                      </div>
                      <div>{order.shipping_address?.country}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin className="h-4 w-4" />
                      Billing Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      {order.billing_address ? (
                        <>
                          <div className="font-medium">{order.billing_address.street}</div>
                          {order.billing_address.apartment && (
                            <div>{order.billing_address.apartment}</div>
                          )}
                          <div>
                            {order.billing_address.city}, {order.billing_address.state} {order.billing_address.zip}
                          </div>
                          <div>{order.billing_address.country}</div>
                        </>
                      ) : (
                        <div className="text-gray-500 italic">Same as shipping address</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Order Items & Summary */}
            <div className="xl:col-span-2 space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items ({order.items?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items?.map((item: OrderItem) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.product_image_url ? (
                            <img 
                              src={item.product_image_url} 
                              alt={item.product_name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-base mb-1">{item.product_name}</div>
                          {item.product_sku && (
                            <div className="text-sm text-gray-600 mb-1">SKU: {item.product_sku}</div>
                          )}
                          <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-medium text-base">${item.unit_price.toFixed(2)}</div>
                          <div className="text-sm text-gray-600">each</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-lg">${item.total_price.toFixed(2)}</div>
                          <div className="text-sm text-gray-600">total</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary & Payment Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                      {order.tax_amount > 0 && (
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>${order.tax_amount.toFixed(2)}</span>
                        </div>
                      )}
                      {order.shipping_amount > 0 && (
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>${order.shipping_amount.toFixed(2)}</span>
                        </div>
                      )}
                      {order.discount_amount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-${order.discount_amount.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>${order.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CreditCard className="h-4 w-4" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Method:</span>
                      <span className="text-sm">{order.payment_method || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge variant={getPaymentStatusColor(order.payment_status) as "default" | "destructive" | "secondary" | "outline"}>
                        {PAYMENT_STATUS_CONFIG[order.payment_status as keyof typeof PAYMENT_STATUS_CONFIG]?.label || order.payment_status}
                      </Badge>
                    </div>
                    {order.payment_id && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Payment ID:</span>
                        <span className="text-sm font-mono">{order.payment_id}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Shipping Information & Additional Details */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Method:</div>
                    <div className="text-sm font-medium">{order.shipping_method || 'N/A'}</div>
                  </div>
                  {order.tracking_number && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Tracking:</div>
                      <div className="text-sm font-mono">{order.tracking_number}</div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.estimated_delivery && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Est. Delivery:</div>
                      <div className="text-sm">{formatDate(order.estimated_delivery)}</div>
                    </div>
                  )}
                  {order.shipped_at && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Shipped:</div>
                      <div className="text-sm">{formatDate(order.shipped_at)}</div>
                    </div>
                  )}
                  {order.delivered_at && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Delivered:</div>
                      <div className="text-sm">{formatDate(order.delivered_at)}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes Section */}
            {(order.notes || order.internal_notes) && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.notes && (
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-2">Customer Notes:</div>
                      <div className="text-sm p-3 bg-gray-50 rounded-lg">{order.notes}</div>
                    </div>
                  )}
                  {order.internal_notes && (
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-2">Internal Notes:</div>
                      <div className="text-sm p-3 bg-yellow-50 rounded-lg">{order.internal_notes}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Status History */}
          {order.status_history && order.status_history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Status History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.status_history.map((history: OrderStatusHistory, index: number) => (
                    <div key={history.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(history.status as Order['status'])}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={getStatusColor(history.status) as "default" | "destructive" | "secondary" | "outline"}>
                            {ORDER_STATUS_CONFIG[history.status as keyof typeof ORDER_STATUS_CONFIG]?.label || history.status}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {formatDate(history.created_at)}
                          </span>
                        </div>
                        {history.notes && (
                          <div className="text-sm text-gray-700 mb-2">{history.notes}</div>
                        )}
                        {history.created_by && (
                          <div className="text-xs text-gray-500">
                            Updated by: {history.created_by}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
