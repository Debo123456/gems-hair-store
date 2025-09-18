"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ProductService } from "@/lib/productService"
import { Product } from "@/lib/supabase"
import Link from "next/link"
import { ProductCard } from "./ProductCard"
import { ProductFiltersWrapper } from "./ProductFiltersWrapper"

interface HomeFeedProps {
  sections?: ('bestSellers' | 'newArrivals' | 'topRated' | 'dealsOfTheDay')[]
}

interface FilterState {
  categories: string[]
  brands: string[]
  concerns: string[]
  priceRange: [number, number]
  minRating: number
  inStock: boolean
}

// Skeleton Product Card Component
const ProductCardSkeleton = () => {
  return (
    <div className="overflow-hidden border border-gray-200 bg-white rounded-xl shadow-md min-w-[280px]">
      <div className="relative">
        <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
        <div className="absolute top-2 left-2">
          <div className="w-8 h-4 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  )
}

// Product Carousel Component
const ProductCarousel = ({ 
  title, 
  products, 
  loading, 
  viewAllLink 
}: { 
  title: string
  products: Product[]
  loading: boolean
  viewAllLink: string
}) => {

  return (
    <section className="mb-0">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 font-heading">{title}</h2>
        <Button variant="ghost" asChild className="text-purple-600 hover:text-purple-700">
          <Link href={viewAllLink}>
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-8">
        {loading ? (
          [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
        ) : (
          products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {/* Mobile/Tablet Grid */}
      <div className="lg:hidden">
        <div className="grid grid-cols-2 gap-4">
          {loading ? (
            [...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export const HomeFeed = ({ sections = ['bestSellers', 'newArrivals', 'topRated', 'dealsOfTheDay'] }: HomeFeedProps) => {
  const [feedData, setFeedData] = useState<{
    bestSellers: Product[]
    newArrivals: Product[]
    topRated: Product[]
    dealsOfTheDay: Product[]
  }>({
    bestSellers: [],
    newArrivals: [],
    topRated: [],
    dealsOfTheDay: []
  })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    concerns: [],
    priceRange: [0, 10000], // Increased from 200 to 10000 to include expensive products
    minRating: 0,
    inStock: false
  })

  useEffect(() => {
    const loadFeedData = async () => {
      try {
        setLoading(true)
        
        const [bestSellers, newArrivals, topRated, dealsOfTheDay] = await Promise.all([
          ProductService.getFeaturedProducts(12),
          ProductService.getNewProducts(12),
          ProductService.getTopRatedProducts(12),
          ProductService.getSaleProducts(12)
        ])
        
        setFeedData({
          bestSellers,
          newArrivals,
          topRated,
          dealsOfTheDay
        })
      } catch (error) {
        console.error('Failed to load feed data:', error)
        // If there's an error, it might be because the database isn't set up
        console.log('This might be because the database needs to be initialized with sample data.')
      } finally {
        setLoading(false)
      }
    }

    loadFeedData()
  }, [])

  // Filter products based on current filters
  const filterProducts = (products: Product[]): Product[] => {
    return products.filter(product => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      // Rating filter
      if (filters.minRating > 0 && product.rating < filters.minRating) {
        return false
      }

      // Stock filter
      if (filters.inStock && !product.in_stock) {
        return false
      }

      return true
    })
  }

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const sectionConfig = {
    bestSellers: {
      title: "Best Sellers",
      products: filterProducts(feedData.bestSellers),
      viewAllLink: "/products?sort=featured"
    },
    newArrivals: {
      title: "New Arrivals",
      products: filterProducts(feedData.newArrivals),
      viewAllLink: "/products?sort=newest"
    },
    topRated: {
      title: "Top Rated",
      products: filterProducts(feedData.topRated),
      viewAllLink: "/products?sort=rating"
    },
    dealsOfTheDay: {
      title: "Deals of the Day",
      products: filterProducts(feedData.dealsOfTheDay),
      viewAllLink: "/products?sort=sale"
    }
  }


  return (
    <div className="py-12">
      <div className="container mx-auto px-6 md:px-8 lg:px-12">
        {/* Product Sections */}
        <div className="xl:flex xl:gap-8">
          {/* Desktop Filters */}
          <ProductFiltersWrapper className="xl:block" onFiltersChange={handleFiltersChange} />
          
          {/* Product Content */}
          <div className="xl:flex-1">
            {!loading && feedData.bestSellers.length === 0 && feedData.newArrivals.length === 0 && feedData.topRated.length === 0 && feedData.dealsOfTheDay.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  It looks like the database hasn&apos;t been initialized with sample products yet.
                </p>
                <p className="text-sm text-gray-500">
                  If you&apos;re an admin, you can initialize the database from the dashboard or add products manually.
                </p>
              </div>
            ) : (
              sections.map((section, index) => {
                const config = sectionConfig[section]
                return (
                  <div key={section} className={index > 0 ? "mt-20" : ""}>
                    <ProductCarousel
                      title={config.title}
                      products={config.products}
                      loading={loading}
                      viewAllLink={config.viewAllLink}
                    />
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
