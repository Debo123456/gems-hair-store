"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Truck, Shield, Mail } from "lucide-react"

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
                  We&apos;re available via phone calls and WhatsApp for quick responses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">876 287 3324</div>
                  <p className="text-gray-600 mb-4">Phone & WhatsApp Business</p>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={handleWhatsAppClick}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      WhatsApp
                    </Button>
                    <Button 
                      onClick={() => window.open('tel:+18762873324', '_self')}
                      variant="outline"
                      className="border-green-500 text-green-600 hover:bg-green-50 px-6 py-3"
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Mail className="h-5 w-5 text-purple-500" />
                      <span className="text-lg font-semibold text-gray-900">Email Support</span>
                    </div>
                    <div className="text-lg text-purple-600 font-medium mb-2">gemshairstoreandmore@gmail.com</div>
                    <Button 
                      onClick={() => window.open('mailto:gemshairstoreandmore@gmail.com', '_blank')}
                      variant="outline"
                      className="border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 text-center">
                  <p>Available for orders, support, and product inquiries via calls or WhatsApp</p>
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
