"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Building2, Mail, Truck, Download, Home, ShoppingBag } from "lucide-react"
import { useSearchParams } from "next/navigation"

interface Order {
  orderNumber: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    size: string
  }>
  customer: {
    shipping: {
      firstName: string
      lastName: string
      email: string
      address: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }
  totals: {
    subtotal: number
    shipping: number
    total: number
  }
  status: string
  createdAt: string
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (orderNumber) {
      // Load order from localStorage
      const savedOrder = localStorage.getItem(`order-${orderNumber}`)
      if (savedOrder) {
        setOrder(JSON.parse(savedOrder))
      }
      setIsLoading(false)
    }
  }, [orderNumber])

  const handleDownloadInvoice = () => {
    if (!order) return
    
    // Create invoice content
    const invoiceContent = `
GEMS HAIR STORE - INVOICE

Order Number: ${order.orderNumber}
Date: ${new Date(order.createdAt).toLocaleDateString()}

SHIPPING ADDRESS:
${order.customer.shipping.firstName} ${order.customer.shipping.lastName}
${order.customer.shipping.address}
${order.customer.shipping.city}, ${order.customer.shipping.state} ${order.customer.shipping.zipCode}
${order.customer.shipping.country}

ITEMS:
${order.items.map(item => `${item.name} (${item.size}) × ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

TOTALS:
Subtotal: $${order.totals.subtotal.toFixed(2)}
Shipping: $${order.totals.shipping === 0 ? 'Free' : `$${order.totals.shipping.toFixed(2)}`}
Total: $${order.totals.total.toFixed(2)}

PAYMENT METHOD: Bank Transfer
STATUS: ${order.status.toUpperCase()}

Thank you for your order!
    `.trim()

    // Create and download file
    const blob = new Blob([invoiceContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${orderNumber}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <Button asChild>
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 text-lg">
              Thank you for your order. We've sent a confirmation email to {order.customer.shipping.email}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Summary
                </CardTitle>
                <CardDescription>
                  Order #{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={`${item.id}-${item.size}-${index}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded flex items-center justify-center">
                        <span className="text-lg">🛍️</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{item.name}</h5>
                        <p className="text-sm text-gray-600">Size: {item.size} • Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${order.totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={order.totals.shipping === 0 ? "text-green-600" : ""}>
                      {order.totals.shipping === 0 ? "Free" : `$${order.totals.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${order.totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{order.customer.shipping.firstName} {order.customer.shipping.lastName}</p>
                  <p className="text-gray-600">{order.customer.shipping.address}</p>
                  <p className="text-gray-600">{order.customer.shipping.city}, {order.customer.shipping.state} {order.customer.shipping.zipCode}</p>
                  <p className="text-gray-600">{order.customer.shipping.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Complete Payment</h4>
                    <p className="text-sm text-gray-600">Transfer the total amount to our bank account using the details below.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Payment Confirmation</h4>
                    <p className="text-sm text-gray-600">Once payment is received, we'll process and ship your order within 1-2 business days.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Order Tracking</h4>
                    <p className="text-sm text-gray-600">You'll receive tracking information via email once your order ships.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Information Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Payment Details
                </CardTitle>
                <CardDescription>
                  Complete your payment via bank transfer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">Bank Transfer Information</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p><strong>Bank:</strong> Gems Hair Bank</p>
                    <p><strong>Account Name:</strong> Gems Hair Store LLC</p>
                    <p><strong>Account Number:</strong> ****1234</p>
                    <p><strong>Routing Number:</strong> 021000021</p>
                    <p><strong>Amount:</strong> ${order.totals.total.toFixed(2)}</p>
                    <p><strong>Reference:</strong> {order.orderNumber}</p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Important Notes</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Use your order number as payment reference</li>
                    <li>• Payment processing takes 1-2 business days</li>
                    <li>• Orders are processed after payment confirmation</li>
                  </ul>
                </div>
                
                <Button 
                  onClick={handleDownloadInvoice} 
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Questions? Contact us at{" "}
                    <a href="mailto:support@gemshair.com" className="text-purple-600 hover:underline">
                      support@gemshair.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button asChild size="lg">
            <a href="/">
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/products">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
