"use client"

import { useState, use, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Star, Heart, Share2, Truck, Shield, RotateCcw, Package, Loader2 } from "lucide-react"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { useAuth } from "@/hooks/useAuth"
import { ProductService } from "@/lib/productService"
import { Product } from "@/lib/supabase"
import { ProductCard } from "@/components/ProductCard"
import { StorageService } from "@/lib/storageService"
import Link from "next/link"
import Image from "next/image"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()
  
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
    if (!user) return
    
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

      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              {product.image_url ? (
                <Image
                  src={StorageService.getOptimizedImageUrl(product.image_url, 600, 600, 90)}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <Package className="h-32 w-32 text-gray-400" />
              )}
            </div>
            
            {/* Product Actions */}
            <div className="flex gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {user ? (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className={`flex-1 ${isInWishlist(product.id) ? 'text-red-500 border-red-200' : ''}`}
                        onClick={handleWishlistToggle}
                      >
                        <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`} />
                      </Button>
                    ) : (
                      <div className={`flex-1 h-10 px-3 py-2 border border-gray-200 rounded-md flex items-center justify-center cursor-not-allowed opacity-50 ${
                        isInWishlist(product.id) ? 'text-red-500 border-red-200' : ''
                      }`}>
                        <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`} />
                      </div>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {user ? (
                      isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'
                    ) : (
                      'Sign in to add to wishlist'
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button variant="outline" size="icon" className="flex-1">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                {product.is_new && (
                  <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
                )}
                {product.is_on_sale && (
                  <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
                )}
                <Badge variant="secondary">{product.category}</Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
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
                <h3 className="font-semibold text-gray-900 mb-4">Size</h3>
                <div className="flex gap-3">
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
              <h3 className="font-semibold text-gray-900 mb-4">Quantity</h3>
              <div className="flex items-center gap-4">
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
                <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Shipping & Returns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-3 text-purple-600" />
                <p className="text-sm text-gray-600">
                  {product.shipping_info || 'Free shipping on orders over $50'}
                </p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-3 text-purple-600" />
                <p className="text-sm text-gray-600">Secure payment</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-3 text-purple-600" />
                <p className="text-sm text-gray-600">
                  {product.return_policy || '30-day money-back guarantee'}
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Product Details Tabs */}
        {(product.ingredients || product.how_to_use) && (
          <div className="mt-20">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Product Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {product.ingredients && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Ingredients</h3>
                    <p className="text-gray-600 leading-relaxed">{product.ingredients}</p>
                  </div>
                )}
                
                {product.how_to_use && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">How to Use</h3>
                    <p className="text-gray-600 leading-relaxed">{product.how_to_use}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
