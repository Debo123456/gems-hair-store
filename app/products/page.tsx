"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Loader2 } from "lucide-react"
import { AdvancedSearch } from "@/components/AdvancedSearch"
import { useSearch } from "@/hooks/useSearch"
import { useCart } from "@/hooks/useCart"

export default function ProductsPage() {
  const { state, loadMoreProducts, clearSearch } = useSearch()
  const { addToCart } = useCart()

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || '',
      quantity: 1,
      size: product.sizes?.[0] || "Standard"
    })
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

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <AdvancedSearch className="mb-8" />

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {state.totalProducts} Products
            </h2>
            {state.filters.query && (
              <Badge variant="secondary">
                Search: "{state.filters.query}"
              </Badge>
            )}
          </div>
        </div>

        {/* Loading State */}
        {state.loading && state.products.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {state.products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {state.products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                <a href={`/products/${product.id}`} className="block">
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">🛍️</span>
                      )}
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-2">
                      {product.is_new && (
                        <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
                      )}
                      {product.is_on_sale && (
                        <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
                      )}
                      {!product.in_stock && (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.preventDefault()
                          handleAddToCart(product)
                        }}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.review_count})</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                    {product.description && (
                      <CardDescription className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-purple-600">
                          ${product.price}
                        </span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-sm text-gray-400 line-through">
                            ${product.original_price}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      disabled={!product.in_stock}
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddToCart(product)
                      }}
                    >
                      {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </CardContent>
                </a>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {state.products.length === 0 && !state.loading && (
          <Card className="text-center py-12 mt-8">
            <CardContent>
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                {state.filters.query 
                  ? `No products match your search for "${state.filters.query}"`
                  : 'No products available at the moment'
                }
              </p>
                             {state.filters.query && (
                 <Button onClick={clearSearch}>
                   Clear Search
                 </Button>
               )}
            </CardContent>
          </Card>
        )}

        {/* Load More Button */}
        {state.hasMore && !state.loading && (
          <div className="flex justify-center mt-12">
            <Button 
              onClick={loadMoreProducts}
              className="px-8 py-3"
            >
              Load More Products
            </Button>
          </div>
        )}

        {/* Loading More State */}
        {state.loading && state.products.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
              <span className="text-gray-600">Loading more products...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
