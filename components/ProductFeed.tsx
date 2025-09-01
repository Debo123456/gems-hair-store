"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ProductService } from "@/lib/productService"
import { Product } from "@/lib/supabase"
import Link from "next/link"
import { ProductCard } from "./ProductCard"

interface ProductFeedProps {
  initialSections: ('bestSellers' | 'newArrivals' | 'onSale')[]
}

// Skeleton Product Card Component
const ProductCardSkeleton = () => {
  return (
    <div className="overflow-hidden border border-gray-200 bg-white rounded-xl shadow-md">
      <div className="relative">
        {/* Image skeleton */}
        <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
        
        {/* Badge skeleton */}
        <div className="absolute top-2 left-2">
          <div className="w-8 h-4 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>

        {/* Price skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Stock status skeleton */}
        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  )
}

// Section Skeleton Component
const SectionSkeleton = ({ title }: { title: string }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export const ProductFeed = ({ initialSections }: ProductFeedProps) => {
  const [sections, setSections] = useState<{
    bestSellers: Product[]
    newArrivals: Product[]
    onSale: Product[]
  }>({
    bestSellers: [],
    newArrivals: [],
    onSale: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        
        const [bestSellers, newArrivals, onSale] = await Promise.all([
          ProductService.getFeaturedProducts(12),
          ProductService.getNewProducts(12),
          ProductService.getSaleProducts(12)
        ])
        
        setSections({
          bestSellers,
          newArrivals,
          onSale
        })
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {initialSections.map((section, index) => {
          const products = sections[section]
          const sectionTitle = {
            bestSellers: "Best Sellers",
            newArrivals: "New Arrivals", 
            onSale: "On Sale"
          }[section]

          // Show skeleton while loading
          if (loading) {
            return <SectionSkeleton key={section} title={sectionTitle} />
          }

          // Don't render section if no products
          if (!products.length) return null

          return (
            <div key={section} className={index > 0 ? "mt-12" : ""}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-heading">{sectionTitle}</h2>
                <Button variant="ghost" asChild className="text-purple-600 hover:text-purple-700">
                  <Link href="/products">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
