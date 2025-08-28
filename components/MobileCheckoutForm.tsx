"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { 
  User, Mail, Phone, MapPin, CreditCard, Truck, 
  ChevronDown, ChevronUp, Eye, EyeOff, Lock, Shield
} from "lucide-react"

interface MobileCheckoutFormProps {
  onSubmit: (data: any) => void
  isLoading?: boolean
}

export function MobileCheckoutForm({ onSubmit, isLoading = false }: MobileCheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Shipping Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    
    // Payment
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    
    // Options
    saveInfo: false,
    newsletter: false,
    terms: false
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone
      case 2:
        return formData.address && formData.city && formData.state && formData.zipCode
      case 3:
        return formData.cardNumber && formData.expiryDate && formData.cvv && formData.cardholderName && formData.terms
      default:
        return false
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step < currentStep ? '✓' : step}
            </div>
            {step < 3 && (
              <div className={`w-12 h-1 mx-2 ${
                step < currentStep ? 'bg-purple-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Tell us about yourself
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    className="h-12 text-base touch-manipulation"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    className="h-12 text-base touch-manipulation"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                  className="h-12 text-base touch-manipulation"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="h-12 text-base touch-manipulation"
                  required
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Shipping Address */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
              <CardDescription>
                Where should we deliver your order?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main Street"
                  className="h-12 text-base touch-manipulation"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="New York"
                    className="h-12 text-base touch-manipulation"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="NY"
                    className="h-12 text-base touch-manipulation"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="10001"
                    className="h-12 text-base touch-manipulation"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger className="h-12 text-base touch-manipulation">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
              <CardDescription>
                Secure payment with bank transfer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-800">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Bank Transfer Details</span>
                </div>
                <p className="text-sm text-blue-700 mt-2">
                  You'll receive bank transfer instructions after placing your order.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name (for reference)</Label>
                <Input
                  id="cardholderName"
                  value={formData.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                  placeholder="John Doe"
                  className="h-12 text-base touch-manipulation"
                  required
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveInfo"
                    checked={formData.saveInfo}
                    onCheckedChange={(checked) => handleInputChange('saveInfo', checked as boolean)}
                  />
                  <Label htmlFor="saveInfo" className="text-sm">
                    Save payment information for future orders
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={formData.newsletter}
                    onCheckedChange={(checked) => handleInputChange('newsletter', checked as boolean)}
                  />
                  <Label htmlFor="newsletter" className="text-sm">
                    Subscribe to our newsletter for updates and offers
                  </Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.terms}
                    onCheckedChange={(checked) => handleInputChange('terms', checked as boolean)}
                    required
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    I agree to the <a href="#" className="text-purple-600 underline">Terms of Service</a> and{' '}
                    <a href="#" className="text-purple-600 underline">Privacy Policy</a>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              className="h-12 px-6 touch-manipulation"
            >
              Previous
            </Button>
          )}
          
          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              className="h-12 px-6 ml-auto touch-manipulation"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!isStepValid(currentStep) || isLoading}
              className="h-12 px-8 ml-auto touch-manipulation"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Complete Order'
              )}
            </Button>
          )}
        </div>
      </form>

      {/* Additional Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Shipping Options */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection('shipping')}
              className="flex items-center justify-between w-full p-3 rounded-lg border hover:bg-gray-50 transition-colors touch-manipulation"
            >
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Shipping Options</span>
              </div>
              {expandedSection === 'shipping' ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            
            {expandedSection === 'shipping' && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Standard Shipping</div>
                    <div className="text-sm text-gray-600">5-7 business days</div>
                  </div>
                  <div className="font-medium">$5.99</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Express Shipping</div>
                    <div className="text-sm text-gray-600">2-3 business days</div>
                  </div>
                  <div className="font-medium">$12.99</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Free Shipping</div>
                    <div className="text-sm text-gray-600">Orders over $50</div>
                  </div>
                  <div className="font-medium text-green-600">Free</div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection('summary')}
              className="flex items-center justify-between w-full p-3 rounded-lg border hover:bg-gray-50 transition-colors touch-manipulation"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Order Summary</span>
              </div>
              {expandedSection === 'summary' ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            
            {expandedSection === 'summary' && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>$89.97</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>$5.99</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>$95.96</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
