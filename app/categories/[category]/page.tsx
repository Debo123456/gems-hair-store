"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package, Star, ShoppingCart, Heart, Share2 } from "lucide-react"
import { AdvancedSearch } from "@/components/AdvancedSearch"
import { useSearch } from "@/hooks/useSearch"
import { getProductsByCategory, Product } from "@/lib/productSearch"
import { useCart } from "@/hooks/useCart"

// Category metadata
const categoryMetadata: Record<string, { title: string; description: string; image: string }> = {
  "shampoo-conditioner": {
    title: "Shampoo & Conditioner",
    description: "Discover our range of gentle, natural shampoos and conditioners designed for all hair types",
    image: "/categories/shampoo-conditioner.jpg"
  },
  "hair-oils-treatments": {
    title: "Hair Oils & Treatments",
    description: "Nourish and repair your hair with our premium oils and intensive treatments",
    image: "/categories/hair-oils.jpg"
  },
  "styling-products": {
    title: "Styling Products",
    description: "Create the perfect look with our professional styling products and tools",
    image: "/categories/styling.jpg"
  },
  "hair-masks": {
    title: "Hair Masks",
    description: "Deep conditioning masks for intensive repair and hydration",
    image: "/categories/masks.jpg"
  },
  "tools-accessories": {
    title: "Tools & Accessories",
    description: "Professional tools and accessories for perfect hair care and styling",
    image: "/categories/tools.jpg"
  }
}

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const { setCategory, state } = useSearch()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get category info
  const categoryInfo = categoryMetadata[category] || {
    title: "Category",
    description: "Browse our products",
    image: "/categories/default.jpg"
  }

  // Set category in search context
  useEffect(() => {
    if (category) {
      const categoryName = categoryInfo.title
      setCategory(categoryName)
    }
  }, [category, categoryInfo.title, setCategory])

  // Load products for this category
  useEffect(() => {
    if (category) {
      setIsLoading(true)
      try {
        const categoryProducts = getProductsByCategory(categoryInfo.title)
        setProducts(categoryProducts)
      } catch (error) {
        console.error("Failed to load category products:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [category, categoryInfo.title])

  const handleAddToCart = (product: Product, size: string) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size,
      quantity: 1
    })
  }

  const formatCategorySlug = (categoryName: string) => {
    return categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{categoryInfo.title}</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">{categoryInfo.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <AdvancedSearch className="mb-8" showFilters={true} />

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {products.length} Products
            </h2>
            {state.filters.query && (
              <Badge variant="secondary">
                Search: "{state.filters.query}"
              </Badge>
            )}
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select 
              className="border rounded-lg px-3 py-2 text-sm"
              value={state.filters.sortBy}
              onChange={(e) => state.setSortBy(e.target.value as any)}
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative">
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <span className="text-4xl">🛍️</span>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                      <Badge className="bg-green-500 text-white text-xs">New</Badge>
                    )}
                    {product.isOnSale && (
                      <Badge className="bg-red-500 text-white text-xs">Sale</Badge>
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

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= product.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviewCount})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-purple-600">
                      ${product.price}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Size Selection */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <div className="flex gap-2">
                      {product.sizes.map((size) => (
                        <Button
                          key={size}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={!product.inStock}
                    onClick={() => handleAddToCart(product, product.sizes[0])}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* No Results */
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                {state.filters.query 
                  ? `No products match your search for "${state.filters.query}"`
                  : "No products available in this category"
                }
              </p>
              <Button onClick={() => state.clearSearch()}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Related Categories */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Explore Other Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryMetadata).map(([slug, info]) => (
              <Card 
                key={slug} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => window.location.href = `/categories/${slug}`}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{info.title}</h4>
                  <p className="text-sm text-gray-600">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
