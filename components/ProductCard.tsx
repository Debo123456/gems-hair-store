"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Star, Heart } from "lucide-react"
import { Product } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { useWishlist } from "@/hooks/useWishlist"
import { StorageService } from "@/lib/storageService"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { user } = useAuth()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)
  const [isInWishlistState, setIsInWishlistState] = useState(false)

  // Check if product is in wishlist
  useEffect(() => {
    setIsInWishlistState(isInWishlist(product.id))
  }, [product.id, isInWishlist])

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to product page
    e.stopPropagation()
    
    if (!user) return

    setIsWishlistLoading(true)
    try {
      if (isInWishlistState) {
        await removeFromWishlist(product.id)
        setIsInWishlistState(false)
      } else {
        await addToWishlist(product.id)
        setIsInWishlistState(true)
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    } finally {
      setIsWishlistLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <Card className="overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white rounded-xl shadow-md hover:scale-105 hover:-translate-y-1 relative">
        <Link href={`/products/${product.id}`}>
          <div className="relative">
            <div className="aspect-[4/3] bg-white flex items-center justify-center relative overflow-hidden">
              {product.image_url ? (
                <Image
                  src={StorageService.getOptimizedImageUrl(product.image_url, 400, 300, 85)}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className="h-16 w-16 text-gray-400" />
              )}
            </div>
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.is_new && (
                <Badge className="bg-green-500 text-white text-xs">New</Badge>
              )}
              {product.is_on_sale && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                  SALE
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <div className="absolute top-2 right-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  {user ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all duration-200 ${
                        isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={handleWishlistToggle}
                      disabled={isWishlistLoading}
                    >
                      <Heart 
                        className={`h-4 w-4 transition-colors duration-200 ${
                          isInWishlistState 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-600 hover:text-red-500'
                        }`} 
                      />
                    </Button>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-white/80 shadow-sm flex items-center justify-center cursor-not-allowed opacity-50">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {user ? (
                    isInWishlistState ? 'Remove from wishlist' : 'Add to wishlist'
                  ) : (
                    'Sign in to add to wishlist'
                  )}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </Link>

        <CardHeader className="pb-2 text-left">
          <div className="flex items-start gap-2">
            <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight font-heading text-left flex-1">{product.name}</CardTitle>
            <div className="flex gap-1 flex-shrink-0">
              {product.is_on_sale && (
                <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">🔥</span>
              )}
              {product.rating >= 4.5 && (
                <span className="text-xs bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded-full">⭐</span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 text-left">
          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base font-bold text-purple-600">
              ${product.price}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xs text-gray-500 line-through">
                ${product.original_price}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= product.rating
                    ? "text-yellow-400/80 fill-current"
                    : "text-gray-200"
                }`}
              />
            ))}
            <span className="text-xs text-gray-500">({product.review_count})</span>
          </div>

          {/* Stock Status */}
          <div className="text-xs text-gray-600">
            {product.in_stock ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
