"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, ShoppingCart, Star, Package, ZoomIn } from "lucide-react"
import { Product } from "@/lib/productSearch"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import Image from "next/image"

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [isLiked, setIsLiked] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  
  // Touch gesture handling
  const cardRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  // Check if product is in wishlist on mount
  useEffect(() => {
    setIsLiked(isInWishlist(product.id))
  }, [product.id, isInWishlist])

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY)

    if (isHorizontalSwipe && Math.abs(distanceX) > 50) {
      if (distanceX > 0) {
        setSwipeDirection('left')
        setShowQuickActions(true)
      } else {
        setSwipeDirection('right')
        setShowQuickActions(false)
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        size: "Standard" // Default size
      })
      // Show success feedback
      setTimeout(() => setIsAddingToCart(false), 1000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
      setIsAddingToCart(false)
    }
  }

  const handleWishlistToggle = async () => {
    try {
      if (isLiked) {
        await removeFromWishlist(product.id)
        setIsLiked(false)
      } else {
        await addToWishlist(product.id)
        setIsLiked(true)
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error)
    }
  }

  const handleQuickView = () => {
    if (onQuickView) {
      onQuickView(product)
    }
  }

  return (
    <Card 
      ref={cardRef}
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg touch-manipulation"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
          <Package className="h-16 w-16 text-gray-400" />
        </div>
        
        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
          showQuickActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <div className="absolute inset-0 flex items-center justify-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              className="h-10 w-10 rounded-full p-0 touch-manipulation"
              onClick={handleQuickView}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-10 w-10 rounded-full p-0 touch-manipulation"
              onClick={handleWishlistToggle}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute top-2 left-2">
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Sale Badge */}
        {product.originalPrice > product.price && (
          <div className="absolute top-2 right-2">
            <Badge variant="default" className="bg-red-500 text-white text-xs">
              Sale
            </Badge>
          </div>
        )}

        {/* Swipe Indicator */}
        <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${
          showQuickActions ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-2 leading-tight">
              {product.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-2 text-sm">
              {product.description}
            </CardDescription>
          </div>
          
          {/* Wishlist Button - Desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-8 w-8 ml-2 touch-manipulation"
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>
        </div>

        {/* Category */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          
          {/* Stock Info */}
          <span className="text-xs text-gray-500">
            {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAddingToCart}
          className="w-full touch-manipulation h-11"
        >
          {isAddingToCart ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Adding...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
            </div>
          )}
        </Button>

        {/* Touch Hint */}
        <div className="md:hidden text-center">
          <p className="text-xs text-gray-400">
            Swipe left for quick actions
          </p>
        </div>
      </CardContent>

      {/* Swipe Animation */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 transition-transform duration-300 ${
          swipeDirection === 'left' ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ pointerEvents: 'none' }}
      />
    </Card>
  )
}
