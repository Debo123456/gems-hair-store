"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Trash2, Eye, Package } from "lucide-react"
import { AdminProduct } from "@/lib/adminProductService"

interface AdminProductCardProps {
  product: AdminProduct
  isSelected: boolean
  onSelect: (productId: string) => void
  onEdit: (product: AdminProduct) => void
  onView: (product: AdminProduct) => void
  onDelete: (product: AdminProduct) => void
}

export function AdminProductCard({ 
  product, 
  isSelected, 
  onSelect, 
  onEdit, 
  onView, 
  onDelete 
}: AdminProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Get product badges
  const getProductBadges = () => {
    const badges = []
    if (product.is_new) badges.push({ text: "New", color: "bg-green-100 text-green-800" })
    if (product.is_on_sale) badges.push({ text: "Sale", color: "bg-red-100 text-red-800" })
    if (product.is_featured) badges.push({ text: "Featured", color: "bg-purple-100 text-purple-800" })
    return badges
  }

  // Get stock status
  const getStockStatus = () => {
    if (!product.in_stock) {
      return { label: "Out of Stock", color: "bg-red-100 text-red-800" }
    }
    if (product.stock_quantity <= 5) {
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
    }
    return { label: "In Stock", color: "bg-green-100 text-green-800" }
  }

  const badges = getProductBadges()
  const stockStatus = getStockStatus()

  return (
    <div 
      className="relative overflow-hidden border border-gray-200 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(product.id)}
          className="bg-white/90 backdrop-blur-sm"
        />
      </div>

      {/* Product Image */}
      <div className="relative">
        <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Product Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {badges.map((badge, index) => (
            <Badge key={index} className={`text-xs px-2 py-1 ${badge.color}`}>
              {badge.text}
            </Badge>
          ))}
        </div>

        {/* Admin Actions Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit(product)}
              className="bg-white/90 hover:bg-white"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onView(product)}
              className="bg-white/90 hover:bg-white"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(product)}
              className="bg-red-500/90 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < Math.floor(product.rating)
                    ? "bg-yellow-400"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.review_count})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            ${product.price}
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-sm text-gray-500 line-through">
              ${product.original_price}
            </span>
          )}
        </div>

        {/* Stock Status and Category */}
        <div className="flex items-center justify-between">
          <Badge className={`text-xs ${stockStatus.color}`}>
            {stockStatus.label}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </div>

        {/* Stock Quantity */}
        <div className="text-sm text-gray-600">
          Stock: {product.stock_quantity} units
        </div>

        {/* Admin Actions - Always Visible */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onView(product)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
