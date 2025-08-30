"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight, Package, Loader2 } from "lucide-react"
import { ProductService } from "@/lib/productService"
import { Product, ProductCategory } from "@/lib/supabase"
import Link from "next/link"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [saleProducts, setSaleProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true)
        
        // Load all data in parallel
        const [featured, newProds, sale, cats] = await Promise.all([
          ProductService.getFeaturedProducts(8),
          ProductService.getNewProducts(8),
          ProductService.getSaleProducts(8),
          ProductService.getCategories()
        ])
        
        setFeaturedProducts(featured)
        setNewProducts(newProds)
        setSaleProducts(sale)
        setCategories(cats)
        
      } catch (error) {
        console.error('Failed to load home data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadHomeData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Perfect Hair Care
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Premium quality products designed to enhance your natural beauty
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-purple-600 hover:bg-gray-100">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <Button variant="ghost" asChild className="text-purple-600 hover:text-purple-700">
                <Link href="/products">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Shop by Category</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.slice(0, 6).map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <div className="group bg-gray-50 rounded-lg p-8 text-center hover:bg-purple-50 transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                      <Package className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                    {category.description && (
                      <p className="text-gray-600">{category.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
              <Button variant="ghost" asChild className="text-purple-600 hover:text-purple-700">
                <Link href="/products">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sale Products */}
      {saleProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">On Sale</h2>
              <Button variant="ghost" asChild className="text-purple-600 hover:text-purple-700">
                <Link href="/products">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Hair?
          </h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Join thousands of customers who have discovered the secret to beautiful, healthy hair
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-purple-600 hover:bg-gray-100">
              <Link href="/products">Start Shopping</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              <Link href="/auth/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            {product.image_url ? (
              <img 
                src={`/images/products${product.image_url.replace('.jpg', '.svg')}`}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <Package className="h-16 w-16 text-gray-400" />
            )}
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_new && (
              <Badge className="bg-green-500 text-white text-xs">New</Badge>
            )}
            {product.is_on_sale && (
              <Badge className="bg-red-500 text-white text-xs">Sale</Badge>
            )}
          </div>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-sm line-clamp-2">{product.name}</CardTitle>
          {product.description && (
            <CardDescription className="text-xs line-clamp-2">{product.description}</CardDescription>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= product.rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.review_count})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-purple-600">
              ${product.price}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.original_price}
              </span>
            )}
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
    </Link>
  )
}
