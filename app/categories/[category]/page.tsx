"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Star, ShoppingCart, Heart, Share2, ArrowLeft, Loader2 } from "lucide-react"
import { AdvancedSearch } from "@/components/AdvancedSearch"
import { useSearch } from "@/hooks/useSearch"
import { Product } from "@/lib/productSearch"
import { useCart } from "@/hooks/useCart"
import { ProductService } from "@/lib/productService"
import { ProductCategory } from "@/lib/supabase"
import Link from "next/link"

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const { setCategory, setSort, clearSearch, state } = useSearch()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categoryInfo, setCategoryInfo] = useState<ProductCategory | null>(null)
  const [categoryLoading, setCategoryLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load category info from database
  useEffect(() => {
    const loadCategoryInfo = async () => {
      if (!category) return
      
      try {
        setCategoryLoading(true)
        setError(null)
        
        const categoryData = await ProductService.getCategoryBySlug(category)
        if (categoryData) {
          setCategoryInfo(categoryData)
          setCategory(categoryData.name)
        } else {
          setError("Category not found")
        }
      } catch (err) {
        console.error("Failed to load category info:", err)
        setError("Failed to load category information")
      } finally {
        setCategoryLoading(false)
      }
    }

    loadCategoryInfo()
  }, [category, setCategory])

  // Load products for this category
  useEffect(() => {
    const loadCategoryProducts = async () => {
      if (!category || !categoryInfo) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        const result = await ProductService.getProducts(
          { category: categoryInfo.name },
          { field: 'created_at', direction: 'desc' },
          1,
          50
        )
        
        setProducts(result.products)
        setFilteredProducts(result.products)
      } catch (err) {
        console.error("Failed to load category products:", err)
        setError("Failed to load products")
        setProducts([])
        setFilteredProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    if (categoryInfo) {
      loadCategoryProducts()
    }
  }, [category, categoryInfo])

  // Filter and sort products based on search state
  useEffect(() => {
    if (state.filters.query || state.filters.minPrice || state.filters.maxPrice || state.filters.minRating) {
      // Apply filters manually since we're using mock data
      const filtered = products.filter(product => {
        if (state.filters.query && !product.name.toLowerCase().includes(state.filters.query.toLowerCase())) {
          return false
        }
        if (state.filters.minPrice && product.price < state.filters.minPrice) {
          return false
        }
        if (state.filters.maxPrice && product.price > state.filters.maxPrice) {
          return false
        }
        if (state.filters.minRating && product.rating < state.filters.minRating) {
          return false
        }
        return true
      })
      
      // Apply sorting
      filtered.sort((a, b) => {
        switch (state.sort.field) {
          case 'name':
            return a.name.localeCompare(b.name)
          case 'price':
            return state.sort.direction === 'asc' ? a.price - b.price : b.price - a.price
          case 'rating':
            return b.rating - a.rating
          case 'created_at':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          default:
            return 0
        }
      })
      
      setFilteredProducts(filtered)
    } else {
      // Just apply sorting to all products
      const sorted = [...products].sort((a, b) => {
        switch (state.sort.field) {
          case 'name':
            return a.name.localeCompare(b.name)
          case 'price':
            return state.sort.direction === 'asc' ? a.price - b.price : b.price - a.price
          case 'rating':
            return b.rating - a.rating
          case 'created_at':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          default:
            return 0
        }
      })
      setFilteredProducts(sorted)
    }
  }, [state.filters, state.sort, products])

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: "Standard"
    })
  }

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    )
  }

  if (error || !categoryInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "The category you're looking for doesn't exist."}</p>
          <Link href="/categories">
            <Button>Browse All Categories</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Package className="h-12 w-12 text-purple-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 font-heading">{categoryInfo.name}</h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                {categoryInfo.description || "Browse our products in this category"}
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 mr-2" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center mb-4">
            <Link href="/products" className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
              <ArrowLeft className="h-4 w-4" />
              Back to All Products
            </Link>
          </div>
          <div className="text-center">
                         <div className="w-24 h-24 bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
               <Package className="h-12 w-12 text-purple-600" />
             </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4 font-heading">{categoryInfo.name}</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              {categoryInfo.description || "Browse our products in this category"}
            </p>
          </div>
        </div>
      </div>

             <div className="container mx-auto px-4 py-12">
         {/* Search and Filters */}
         <AdvancedSearch className="mb-12" showFilters={true} />

                 {/* Results Summary */}
         <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-900 font-heading">
              {filteredProducts.length} Products
            </h2>
            {state.filters.query && (
              <Badge variant="secondary">
                Search: &ldquo;{state.filters.query}&rdquo;
              </Badge>
            )}
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select 
              className="border rounded-lg px-3 py-2 text-sm"
              value={state.sort.field}
              onChange={(e) => setSort({ field: e.target.value as 'name' | 'price' | 'rating' | 'created_at', direction: 'asc' })}
            >
              <option value="name">Name (A-Z)</option>
              <option value="price">Price (Low to High)</option>
              <option value="rating">Highest Rated</option>
              <option value="created_at">Newest First</option>
            </select>
          </div>
        </div>

                 {/* Products Grid */}
         {filteredProducts.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group bg-white rounded-xl shadow-md hover:scale-105 hover:-translate-y-1">
                <div className="relative">
                  {/* Product Image */}
                  <div className="aspect-square bg-white flex items-center justify-center">
                    {product.image ? (
                      <img 
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Package className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                      <Badge className="bg-green-500 text-white text-xs">New</Badge>
                    )}
                    {product.isOnSale && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                        SALE
                      </Badge>
                    )}
                    {!product.inStock && (
                      <Badge variant="secondary" className="text-xs">Out of Stock</Badge>
                    )}
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardHeader className="pb-2 text-left">
                  <div className="flex items-start gap-2">
                    <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight font-heading text-left flex-1">{product.name}</CardTitle>
                    <div className="flex gap-1 flex-shrink-0">
                      {product.isOnSale && (
                        <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">🔥</span>
                      )}
                      {product.rating >= 4.5 && (
                        <span className="text-xs bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded-full">⭐</span>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 text-left">
                  {/* Price - Always Visible */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base font-bold text-purple-600">
                      ${product.price}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                                                           {/* Always Visible - Condensed Info */}
                      <div className="mb-3">
                        {/* Rating - Always Visible */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
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
                          </div>
                          <span className="text-sm text-gray-500">({product.reviewCount})</span>
                        </div>

                        {/* Description - Always Visible (Condensed) */}
                        {product.description && (
                          <p className="text-xs text-gray-500 line-clamp-1 mb-2 leading-relaxed">
                            {product.description}
                          </p>
                        )}

                        {/* Size Selection - Always Visible (Condensed) */}
                        <div className="mb-2">
                          <div className="flex gap-1 flex-wrap">
                            {product.sizes.slice(0, 3).map((size) => (
                              <span
                                key={size}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded border"
                              >
                                {size}
                              </span>
                            ))}
                            {product.sizes.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded border">
                                +{product.sizes.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - Always Visible */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-xs border-gray-300 hover:border-purple-500 hover:text-purple-600"
                        >
                          Quick View
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 text-xs bg-purple-600 hover:bg-purple-700"
                          disabled={!product.inStock}
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          {product.inStock ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* No Results */
          <Card className="text-center py-12 border border-gray-200 bg-white rounded-xl shadow-md">
            <CardContent>
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">No products found</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {state.filters.query 
                  ? `No products match your search for &ldquo;${state.filters.query}&rdquo;`
                  : "No products available in this category"
                }
              </p>
              <Button onClick={() => clearSearch()}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}

                 {/* Related Categories */}
         <div className="mt-24">
           <h3 className="text-3xl font-bold text-gray-900 mb-8 font-heading">Explore Other Categories</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {Object.entries(categoryMetadata).map(([slug, info]) => (
               <Link key={slug} href={`/categories/${slug}`}>
                 <Card className="border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer bg-white rounded-xl shadow-md hover:scale-105 hover:-translate-y-1">
                   <CardContent className="p-6">
                     <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                       <Package className="h-7 w-7 text-purple-600" />
                     </div>
                    <h4 className="font-semibold text-gray-900 mb-2 font-heading">{info.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{info.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
