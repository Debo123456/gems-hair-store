"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { ProductService } from "@/lib/productService"
import { Product } from "@/lib/supabase"
import { ProductCard } from "@/components/ProductCard"
import { ProductFiltersWrapper } from "@/components/ProductFiltersWrapper"

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
    priceRange: [0, 10000], // Increased to include expensive products
    minRating: 0,
    inStock: false
  })
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        
        // Convert filters to ProductService format
        const productFilters = {
          category: filters.categories.length > 0 ? filters.categories[0] : undefined,
          minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
          maxPrice: filters.priceRange[1] < 10000 ? filters.priceRange[1] : undefined,
          minRating: filters.minRating > 0 ? filters.minRating : undefined,
          inStock: filters.inStock || undefined
        }
        
        const result = await ProductService.getProducts(
          productFilters,
          { field: 'created_at', direction: 'desc' },
          currentPage,
          itemsPerPage
        )
        
        setProducts(result.products)
        setTotalProducts(result.total)
        setTotalPages(Math.ceil(result.total / itemsPerPage))
      } catch (error) {
        console.error('Failed to load products:', error)
        setProducts([])
        setTotalProducts(0)
        setTotalPages(0)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [currentPage, itemsPerPage, filters])

  // Filter products based on search only (other filters are handled server-side)
  const filteredProducts = products.filter(product => {
    // Search filter (client-side for real-time search)
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is handled by the filteredProducts logic
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page when changing items per page
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
              {totalProducts > 0 ? (
                <>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products</>
              ) : (
                <>No products found</>
              )}
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
          <ProductFiltersWrapper className="xl:block" onFiltersChange={handleFiltersChange} />
          
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
                        priceRange: [0, 10000], // Increased to include expensive products
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

            {/* Pagination Info */}
            {totalProducts > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg p-4 mt-8">
                {/* Results Info */}
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
                </div>

                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => handleItemsPerPageChange(parseInt(value))}
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="48">48</SelectItem>
                      <SelectItem value="96">96</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600">per page</span>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="relative flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg p-4 mt-4">
                {loading && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                  </div>
                )}
                
                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                  {/* First Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1 || loading}
                    onClick={() => handlePageChange(1)}
                    className="hidden sm:flex"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>

                  {/* Previous Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1 || loading}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Previous</span>
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {(() => {
                      const pages = []
                      const maxVisiblePages = 5
                      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
                      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

                      // Adjust start page if we're near the end
                      if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1)
                      }

                      // First page and ellipsis
                      if (startPage > 1) {
                        pages.push(
                          <Button
                            key={1}
                            variant={currentPage === 1 ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(1)}
                            disabled={loading}
                            className="w-8 h-8 p-0"
                          >
                            1
                          </Button>
                        )
                        if (startPage > 2) {
                          pages.push(
                            <span key="ellipsis1" className="text-gray-500 px-2">
                              ...
                            </span>
                          )
                        }
                      }

                      // Page numbers
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <Button
                            key={i}
                            variant={currentPage === i ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(i)}
                            disabled={loading}
                            className="w-8 h-8 p-0"
                          >
                            {i}
                          </Button>
                        )
                      }

                      // Last page and ellipsis
                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(
                            <span key="ellipsis2" className="text-gray-500 px-2">
                              ...
                            </span>
                          )
                        }
                        pages.push(
                          <Button
                            key={totalPages}
                            variant={currentPage === totalPages ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={loading}
                            className="w-8 h-8 p-0"
                          >
                            {totalPages}
                          </Button>
                        )
                      }

                      return pages
                    })()}
                  </div>

                  {/* Next Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages || loading}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <span className="hidden sm:inline mr-1">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  {/* Last Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages || loading}
                    onClick={() => handlePageChange(totalPages)}
                    className="hidden sm:flex"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
