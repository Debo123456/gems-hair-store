"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Package, Star, ShoppingCart, Tag, Calendar, DollarSign, Truck, RotateCcw } from "lucide-react"
import { AdminProduct } from "@/lib/adminProductService"

interface ViewProductModalProps {
  product: AdminProduct | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewProductModal({ product, open, onOpenChange }: ViewProductModalProps) {
  if (!product) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStockStatus = (product: AdminProduct) => {
    if (!product.in_stock) return { label: "Out of Stock", color: "destructive" }
    if (product.stock_quantity < 10) return { label: "Low Stock", color: "warning" }
    return { label: "In Stock", color: "default" }
  }

  const stockStatus = getStockStatus(product)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Details
          </DialogTitle>
          <DialogDescription>
            View complete product information and details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Header */}
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Package className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                <p className="text-gray-600 mt-1">{product.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm">
                  {product.category}
                </Badge>
                <Badge variant={stockStatus.color as "default" | "destructive" | "secondary" | "outline"}>
                  {stockStatus.label}
                </Badge>
                {product.is_new && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    New
                  </Badge>
                )}
                {product.is_featured && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Featured
                  </Badge>
                )}
                {product.is_on_sale && (
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    On Sale
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing & Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Price</label>
                  <p className="text-2xl font-bold text-gray-900">${product.price}</p>
                </div>
                {product.original_price && product.original_price > product.price && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Original Price</label>
                    <p className="text-lg text-gray-500 line-through">${product.original_price}</p>
                    <p className="text-sm text-green-600">
                      Save ${(product.original_price - product.price).toFixed(2)}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Stock Quantity</label>
                  <p className="text-lg font-semibold text-gray-900">{product.stock_quantity} units</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ratings & Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Ratings & Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold">{product.rating}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{product.review_count} reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Available Sizes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, index) => (
                    <Badge key={index} variant="outline">
                      {size}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.ingredients && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{product.ingredients}</p>
                </CardContent>
              </Card>
            )}

            {product.how_to_use && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How to Use</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{product.how_to_use}</p>
                </CardContent>
              </Card>
            )}

            {product.shipping_info && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{product.shipping_info}</p>
                </CardContent>
              </Card>
            )}

            {product.return_policy && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5" />
                    Return Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{product.return_policy}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Product Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-gray-500">Product ID</label>
                  <p className="text-gray-900 font-mono">{product.id}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-500">Created</label>
                  <p className="text-gray-900">{formatDate(product.created_at)}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900">{formatDate(product.updated_at)}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-500">Status</label>
                  <div className="flex items-center gap-2">
                    <Badge variant={stockStatus.color as "default" | "destructive" | "secondary" | "outline"}>
                      {stockStatus.label}
                    </Badge>
                    {product.in_stock ? (
                      <span className="text-green-600">Available</span>
                    ) : (
                      <span className="text-red-600">Unavailable</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
