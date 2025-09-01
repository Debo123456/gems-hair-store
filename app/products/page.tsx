"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2 } from "lucide-react"
import { ProductService } from "@/lib/productService"
import { Product } from "@/lib/supabase"
import { ProductCard } from "@/components/ProductCard"
import { ProductFilters } from "@/components/ProductFilters"

// Skeleton Product Card Component
const ProductCardSkeleton = () => {
  return (
    <div className="overflow-hidden border border-gray-200 bg-white rounded-xl shadow-md">
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

interface FilterState {
  categories: string[]
  brands: string[]
  concerns: string[]
  priceRange: [number, number]
  minRating: number
  inStock: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    concerns: [],
    priceRange: [0, 200],
    minRating: 0,
    inStock: false
  })

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const { products: allProducts } = await ProductService.getProducts()
        setProducts(allProducts)
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

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

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is handled by the filteredProducts logic
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover our complete collection of premium hair care products</p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-8">
        {/* Results Summary and Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredProducts.length} Products
            </h2>
            {searchQuery && (
              <Badge variant="secondary">
                Search: &ldquo;{searchQuery}&rdquo;
              </Badge>
            )}
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
        </div>

        {/* Main Content */}
        <div className="xl:flex xl:gap-8">
          {/* Desktop Filters */}
          <ProductFilters className="xl:block" onFiltersChange={handleFiltersChange} />
          
          {/* Products Grid */}
          <div className="xl:flex-1">
            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(12)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!loading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery 
                    ? `No products match your search for &ldquo;${searchQuery}&rdquo;`
                    : 'No products available with the current filters'
                  }
                </p>
                {(searchQuery || Object.values(filters).some(v => 
                  Array.isArray(v) ? v.length > 0 : v !== false && v !== 0
                )) && (
                  <Button 
                    onClick={() => {
                      setSearchQuery("")
                      setFilters({
                        categories: [],
                        brands: [],
                        concerns: [],
                        priceRange: [0, 200],
                        minRating: 0,
                        inStock: false
                      })
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
