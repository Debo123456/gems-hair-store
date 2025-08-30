"use client"

import { useState, use, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Star, Heart, Share2, Truck, Shield, RotateCcw, Package, ShoppingCart, Loader2 } from "lucide-react"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { ProductService } from "@/lib/productService"
import { Product } from "@/lib/supabase"
import Link from "next/link"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  
  const { id } = use(params)

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const productData = await ProductService.getProductById(id)
        if (!productData) {
          setError('Product not found')
          return
        }
        
        setProduct(productData)
        
        // Set default size if available
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0])
        }
        
        // Load related products
        const related = await ProductService.getRelatedProducts(
          productData.id,
          productData.category,
          4
        )
        setRelatedProducts(related)
        
      } catch (err) {
        console.error('Failed to load product:', err)
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || '',
      quantity,
      size: selectedSize
    })
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  const handleWishlistToggle = async () => {
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id)
      } else {
        await addToWishlist(product.id)
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error)
    }
  }

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex text-sm text-gray-500">
            <Link href="/" className="hover:text-purple-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-purple-600">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Package className="h-32 w-32 text-gray-400" />
              )}
            </div>
            
            {/* Product Actions */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                className={`flex-1 ${isInWishlist(product.id) ? 'text-red-500 border-red-200' : ''}`}
                onClick={handleWishlistToggle}
              >
                <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`} />
              </Button>
              <Button variant="outline" size="icon" className="flex-1">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                {product.is_new && (
                  <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
                )}
                {product.is_on_sale && (
                  <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
                )}
                <Badge variant="secondary">{product.category}</Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.review_count} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-purple-600">
                ${product.price}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xl text-gray-400 line-through">
                  ${product.original_price}
                </span>
              )}
              {product.original_price && product.original_price > product.price && (
                <Badge className="bg-red-500 hover:bg-red-600">
                  {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Size</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSizeChange(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-20 text-center"
                  min="1"
                  max="10"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleAddToCart}
                disabled={!product.in_stock || !selectedSize}
              >
                {!product.in_stock ? 'Out of Stock' : 
                 !selectedSize ? 'Select Size' :
                 `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
              </Button>
              
              {!product.in_stock && (
                <p className="text-red-600 text-sm text-center">This product is currently out of stock</p>
              )}
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Shipping & Returns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm text-gray-600">
                  {product.shipping_info || 'Free shipping on orders over $50'}
                </p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm text-gray-600">Secure payment</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm text-gray-600">
                  {product.return_policy || '30-day money-back guarantee'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        {(product.ingredients || product.how_to_use) && (
          <div className="mt-16">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {product.ingredients && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
                    <p className="text-gray-600 text-sm">{product.ingredients}</p>
                  </div>
                )}
                
                {product.how_to_use && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">How to Use</h3>
                    <p className="text-gray-600 text-sm">{product.how_to_use}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      {relatedProduct.image_url ? (
                        <img 
                          src={relatedProduct.image_url} 
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-16 w-16 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {relatedProduct.is_new && (
                        <Badge className="bg-green-500 text-white text-xs">New</Badge>
                      )}
                      {relatedProduct.is_on_sale && (
                        <Badge className="bg-red-500 text-white text-xs">Sale</Badge>
                      )}
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm line-clamp-2">{relatedProduct.name}</CardTitle>
                    {relatedProduct.description && (
                      <CardDescription className="text-xs line-clamp-2">{relatedProduct.description}</CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= relatedProduct.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">({relatedProduct.review_count})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-purple-600">
                        ${relatedProduct.price}
                      </span>
                      {relatedProduct.original_price && relatedProduct.original_price > relatedProduct.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ${relatedProduct.original_price}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart */}
                    <Button 
                      size="sm"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={!relatedProduct.in_stock}
                      onClick={() => addToCart({
                        id: relatedProduct.id,
                        name: relatedProduct.name,
                        price: relatedProduct.price,
                        image: relatedProduct.image_url || '',
                        quantity: 1,
                        size: relatedProduct.sizes?.[0] || "Standard"
                      })}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {relatedProduct.in_stock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
