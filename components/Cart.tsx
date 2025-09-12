"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, X, Plus, Minus, Trash2, Package, ArrowRight, Loader2 } from "lucide-react"
import { useCart } from "@/hooks/useCart"
import { useRouter } from "next/navigation"

export function Cart() {
  const { state, removeFromCart, updateQuantity, getCartTotal, getCartItemCount } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const router = useRouter()

  const handleQuantityChange = async (productId: string, size: string, newQuantity: number) => {
    if (isProcessing) return
    
    setIsProcessing(`${productId}-${size}`)
    try {
      if (newQuantity <= 0) {
        await removeFromCart(productId)
      } else {
        await updateQuantity(productId, newQuantity)
      }
    } catch (error) {
      console.error('Failed to update quantity:', error)
    } finally {
      setIsProcessing(null)
    }
  }

  const handleRemoveItem = async (productId: string, size: string) => {
    if (isProcessing) return
    
    setIsProcessing(`remove-${productId}-${size}`)
    try {
      await removeFromCart(productId)
    } catch (error) {
      console.error('Failed to remove item:', error)
    } finally {
      setIsProcessing(null)
    }
  }

  const handleCheckout = () => {
    setIsOpen(false)
    router.push("/checkout")
  }

  const isLoading = state.isLoading || state.isSyncing

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative touch-manipulation">
          <ShoppingCart className="h-5 w-5" />
          {getCartItemCount() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
              {getCartItemCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96 p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-semibold">Shopping Cart</SheetTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {getCartItemCount() > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {getCartItemCount()} item{getCartItemCount() !== 1 ? 's' : ''} in cart
              </p>
            )}
            {isLoading && (
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Syncing cart...</span>
              </div>
            )}
          </SheetHeader>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <Package className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">
                  Add some products to get started with your shopping
                </p>
                <Button onClick={() => setIsOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {state.items.map((item) => {
                  const itemKey = `${item.id}-${item.size}`
                  const isItemProcessing = isProcessing === itemKey
                  const isRemoveProcessing = isProcessing === `remove-${itemKey}`
                  
                  return (
                    <div key={itemKey} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Size: {item.size}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 touch-manipulation"
                            onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                            disabled={isItemProcessing}
                          >
                            {isItemProcessing ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Minus className="h-3 w-3" />
                            )}
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 touch-manipulation"
                            onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                            disabled={isItemProcessing}
                          >
                            {isItemProcessing ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Plus className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 touch-manipulation"
                        onClick={() => handleRemoveItem(item.id, item.size)}
                        disabled={isRemoveProcessing}
                      >
                        {isRemoveProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full h-12 text-base touch-manipulation"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>

              {/* Continue Shopping */}
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="w-full touch-manipulation"
                disabled={isLoading}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
