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
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Package className="h-6 w-6" />
            Product Details
          </DialogTitle>
          <DialogDescription className="text-base">
            View complete product information and details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Product Header */}
          <div className="flex items-start gap-8">
            <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Package className="h-16 w-16 text-gray-400" />
              )}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {product.category}
                </Badge>
                <Badge variant={stockStatus.color as "default" | "destructive" | "secondary" | "outline"} className="px-3 py-1">
                  {stockStatus.label}
                </Badge>
                {product.is_new && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                    New
                  </Badge>
                )}
                {product.is_featured && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
                    Featured
                  </Badge>
                )}
                {product.is_on_sale && (
                  <Badge variant="secondary" className="bg-red-100 text-red-800 px-3 py-1">
                    On Sale
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Pricing & Inventory */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <DollarSign className="h-6 w-6" />
                Pricing & Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Current Price</label>
                  <p className="text-3xl font-bold text-gray-900">${product.price}</p>
                </div>
                {product.original_price && product.original_price > product.price && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Original Price</label>
                    <p className="text-xl text-gray-500 line-through">${product.original_price}</p>
                    <p className="text-sm font-semibold text-green-600">
                      Save ${(product.original_price - product.price).toFixed(2)}
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Stock Quantity</label>
                  <p className="text-2xl font-bold text-gray-900">{product.stock_quantity} units</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Status</label>
                  <div className="flex items-center gap-2">
                    <Badge variant={stockStatus.color as "default" | "destructive" | "secondary" | "outline"} className="px-3 py-1">
                      {stockStatus.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ratings & Reviews */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Star className="h-6 w-6" />
                Ratings & Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-3xl font-bold">{product.rating}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-lg text-gray-600">{product.review_count} reviews</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features and Sizes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Features */}
            {product.features && product.features.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Tag className="h-6 w-6" />
                    Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {product.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Package className="h-6 w-6" />
                    Available Sizes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1 text-sm">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {product.ingredients && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{product.ingredients}</p>
                </CardContent>
              </Card>
            )}

            {product.how_to_use && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">How to Use</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{product.how_to_use}</p>
                </CardContent>
              </Card>
            )}

            {product.shipping_info && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Truck className="h-6 w-6" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{product.shipping_info}</p>
                </CardContent>
              </Card>
            )}

            {product.return_policy && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <RotateCcw className="h-6 w-6" />
                    Return Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{product.return_policy}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Product Metadata */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Calendar className="h-6 w-6" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Product ID</label>
                  <p className="text-gray-900 font-mono text-sm break-all">{product.id}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Created</label>
                  <p className="text-gray-900 font-medium">{formatDate(product.created_at)}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Last Updated</label>
                  <p className="text-gray-900 font-medium">{formatDate(product.updated_at)}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Status</label>
                  <div className="flex items-center gap-2">
                    <Badge variant={stockStatus.color as "default" | "destructive" | "secondary" | "outline"} className="px-3 py-1">
                      {stockStatus.label}
                    </Badge>
                    {product.in_stock ? (
                      <span className="text-green-600 font-medium">Available</span>
                    ) : (
                      <span className="text-red-600 font-medium">Unavailable</span>
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
