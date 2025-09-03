"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/hooks/useAuth"
import { CartService } from "@/lib/cartService"
import { OrderService } from "@/lib/orderService"
import { CreateOrderData } from "@/lib/orderTypes"
import { Package, Truck, CreditCard, CheckCircle, Loader2 } from "lucide-react"

interface CheckoutFormData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string

  // Shipping Address
  shippingAddress: {
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    postalCode: string
    country: string
  }

  // Payment
  paymentMethod: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { state: cartState, clearCart, getCartTotal, getCartItemCount } = useCart()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    shippingAddress: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "United States"
    },
    paymentMethod: "bank_transfer"
  })

  // Redirect if cart is empty
  useEffect(() => {
    if (cartState.items.length === 0) {
      router.push("/products")
    }
  }, [cartState.items.length, router])

  // Don't render if cart is empty
  if (cartState.items.length === 0) {
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CheckoutFormData] as Record<string, string>,
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Create order data for OrderService
      const orderData: CreateOrderData = {
        user_id: user?.id || 'anonymous',
        customer_email: formData.email,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_phone: formData.phone,
        shipping_address: {
          street: formData.shippingAddress.addressLine1,
          city: formData.shippingAddress.city,
          state: formData.shippingAddress.state,
          zip: formData.shippingAddress.postalCode,
          country: formData.shippingAddress.country,
          apartment: formData.shippingAddress.addressLine2 || undefined
        },
        total_amount: getCartTotal(),
        subtotal: getCartTotal() * 0.9, // Assuming 10% tax
        tax_amount: getCartTotal() * 0.1,
        shipping_amount: 0, // Free shipping
        payment_method: formData.paymentMethod,
        payment_status: 'pending',
        items: cartState.items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          product_image_url: item.image,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity
        }))
      }

      // Create order in Supabase
      const createdOrder = await OrderService.createOrder(orderData)

      // Clear cart from Supabase if user is authenticated
      if (user) {
        try {
          await CartService.clearUserCart(user.id)
        } catch (error) {
          console.error('Failed to clear Supabase cart:', error)
        }
      }

      // Clear local cart
      await clearCart()

      // Redirect to success page
      router.push(`/checkout/success?order=${createdOrder.order_number}`)
    } catch (error) {
      console.error('Checkout failed:', error)
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: "Shipping", icon: Truck },
    { number: 2, title: "Payment", icon: CreditCard },
    { number: 3, title: "Review", icon: CheckCircle }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'bg-purple-600 border-purple-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 ml-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && "Shipping Information"}
                  {currentStep === 2 && "Payment Method"}
                  {currentStep === 3 && "Order Review"}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Enter your shipping details"}
                  {currentStep === 2 && "Choose your payment method"}
                  {currentStep === 3 && "Review your order before confirming"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="First Name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Last Name"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Email"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Phone"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 1
                      </label>
                      <Input
                        value={formData.shippingAddress.addressLine1}
                        onChange={(e) => handleInputChange('shippingAddress.addressLine1', e.target.value)}
                        placeholder="Street Address"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 2 (Optional)
                      </label>
                      <Input
                        value={formData.shippingAddress.addressLine2}
                        onChange={(e) => handleInputChange('shippingAddress.addressLine2', e.target.value)}
                        placeholder="Apartment, suite, etc."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <Input
                          value={formData.shippingAddress.city}
                          onChange={(e) => handleInputChange('shippingAddress.city', e.target.value)}
                          placeholder="City"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <Input
                          value={formData.shippingAddress.state}
                          onChange={(e) => handleInputChange('shippingAddress.state', e.target.value)}
                          placeholder="State"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <Input
                          value={formData.shippingAddress.postalCode}
                          onChange={(e) => handleInputChange('shippingAddress.postalCode', e.target.value)}
                          placeholder="Postal Code"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <Input
                        value={formData.shippingAddress.country}
                        onChange={(e) => handleInputChange('shippingAddress.country', e.target.value)}
                        placeholder="Country"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Method */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="bank_transfer"
                          name="paymentMethod"
                          value="bank_transfer"
                          checked={formData.paymentMethod === "bank_transfer"}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                          className="text-purple-600"
                        />
                        <label htmlFor="bank_transfer" className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Bank Transfer</div>
                              <div className="text-sm text-gray-500">
                                Pay via bank transfer (2-3 business days)
                              </div>
                            </div>
                            <Badge variant="secondary">Available</Badge>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="credit_card"
                          name="paymentMethod"
                          value="credit_card"
                          checked={formData.paymentMethod === "credit_card"}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                          disabled
                          className="text-gray-400"
                        />
                        <label htmlFor="credit_card" className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-500">Credit Card</div>
                              <div className="text-sm text-gray-400">
                                Credit card payments coming soon
                              </div>
                            </div>
                            <Badge variant="outline">Coming Soon</Badge>
                          </div>
                        </label>
                      </div>
                    </div>

                    {formData.paymentMethod === "bank_transfer" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Bank Transfer Details</h4>
                        <p className="text-sm text-blue-800">
                          You will receive bank transfer instructions via email after placing your order.
                          Please allow 2-3 business days for payment processing.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Order Review */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {/* Customer Information */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm">
                          <span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Email:</span> {formData.email}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Phone:</span> {formData.phone}
                        </p>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm">
                          {formData.shippingAddress.addressLine1}
                          {formData.shippingAddress.addressLine2 && (
                            <>
                              <br />
                              {formData.shippingAddress.addressLine2}
                            </>
                          )}
                        </p>
                        <p className="text-sm">
                          {formData.shippingAddress.city}, {formData.shippingAddress.state} {formData.shippingAddress.postalCode}
                        </p>
                        <p className="text-sm">{formData.shippingAddress.country}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm">
                          <span className="font-medium">Method:</span> {formData.paymentMethod === "bank_transfer" ? "Bank Transfer" : "Credit Card"}
                        </p>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className="mt-1 text-purple-600"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the{" "}
                        <a href="/terms" className="text-purple-600 hover:underline">
                          Terms and Conditions
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-purple-600 hover:underline">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handlePrevStep}>
                      Previous
                    </Button>
                  )}
                  
                  {currentStep < 3 ? (
                    <Button onClick={handleNextStep} className="ml-auto">
                      Next Step
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                      className="ml-auto"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {getCartItemCount()} item{getCartItemCount() !== 1 ? 's' : ''} in your cart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartState.items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>${(getCartTotal() * 1.08).toFixed(2)}</span>
                  </div>
                </div>

                {/* Current Step Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Step {currentStep} of 3
                  </h4>
                  <p className="text-sm text-gray-600">
                    {currentStep === 1 && "Complete your shipping information to continue"}
                    {currentStep === 2 && "Choose your payment method"}
                    {currentStep === 3 && "Review your order and confirm"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
