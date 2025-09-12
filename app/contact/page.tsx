"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Clock, Truck, Shield } from "lucide-react"

export default function ContactPage() {
  const handleWhatsAppClick = () => {
    const phoneNumber = "8762873324" // Remove spaces for WhatsApp link
    const message = "Hello! I'm interested in your hair care products. Can you help me with more information?"
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch with us for any questions, orders, or support. We&apos;re here to help you find the perfect hair care products.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  Get in Touch
                </CardTitle>
                <CardDescription>
                  We&apos;re available via WhatsApp for quick responses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">876 287 3324</div>
                  <p className="text-gray-600 mb-4">WhatsApp Business</p>
                  <Button 
                    onClick={handleWhatsAppClick}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </div>
                <div className="text-sm text-gray-500 text-center">
                  <p>Available for orders, support, and product inquiries</p>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday:</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday:</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday:</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> WhatsApp responses may be slower outside business hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services & Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What We Can Help With</CardTitle>
                <CardDescription>
                  Our team is ready to assist you with various inquiries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Product Inquiries</h4>
                      <p className="text-sm text-gray-600">Get recommendations and detailed product information</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Order Support</h4>
                      <p className="text-sm text-gray-600">Track orders, modify orders, or get shipping updates</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Customer Service</h4>
                      <p className="text-sm text-gray-600">Returns, exchanges, and general customer support</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Virtual Store Info */}
            <Card className="border-purple-200 bg-purple-50/50">
              <CardHeader>
                <CardTitle className="text-purple-900">Virtual Store</CardTitle>
                <CardDescription className="text-purple-700">
                  Online-only business with fast delivery across Jamaica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>No physical store location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Fast delivery across Jamaica</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>WhatsApp is our primary contact method</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Secure online payments</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-gray-900 mb-2">How do I place an order?</h3>
                <p className="text-sm text-gray-600">
                  Browse our products online, add items to your cart, and proceed to checkout. You can also contact us via WhatsApp for assistance.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-gray-900 mb-2">What are your delivery times?</h3>
                <p className="text-sm text-gray-600">
                  We offer fast delivery across Jamaica. Delivery times vary by location but typically range from 1-3 business days.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-gray-900 mb-2">Can I track my order?</h3>
                <p className="text-sm text-gray-600">
                  Yes! Use our order tracking feature or contact us via WhatsApp with your order number for updates.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-gray-900 mb-2">Do you offer returns?</h3>
                <p className="text-sm text-gray-600">
                  We have a flexible return policy. Contact us via WhatsApp within 7 days of delivery for return assistance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
