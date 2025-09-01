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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero/hero.jpg" 
            alt="Beautiful hair care lifestyle" 
            className="w-full h-full object-cover"
          />
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-gray-800/50 to-black/40 animate-gradient-shift" style={{backgroundSize: '400% 400%'}}></div>
          {/* Subtle Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
                         <h1 className="text-5xl md:text-7xl font-black mb-6 font-heading drop-shadow-lg tracking-tight">
               Discover Your Perfect Hair Care
             </h1>
                         <p className="text-xl md:text-2xl mb-8 text-white/90 drop-shadow-md font-medium tracking-wide">
               Premium quality products designed to enhance your natural beauty
             </p>
                         <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              <Button size="lg" asChild className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4">
                 <Link href="/products">Explore The Collection</Link>
               </Button>
               <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 backdrop-blur-sm bg-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4">
                 Our Philosophy
               </Button>
            </div>
          </div>
        </div>
      </section>

             {/* Featured Products */}
                               {featuredProducts.length > 0 && (
           <section className="py-24 bg-gray-50 px-8 md:px-16 lg:px-24">
                      <div className="container mx-auto">
             <div className="text-center mb-8">
               <h2 className="text-4xl font-bold text-gray-900 font-heading mb-4">Featured Products</h2>
               <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
             </div>
             <div className="text-center mb-8">
               <Button variant="ghost" asChild className="text-purple-600 hover:text-purple-700">
                 <Link href="/products">
                   View All <ArrowRight className="ml-2 h-4 w-4" />
                 </Link>
               </Button>
             </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

             {/* Categories */}
       {categories.length > 0 && (
         <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12 font-heading">Shop by Category</h2>
            
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
               {categories.slice(0, 6).map((category) => (
                 <Link key={category.id} href={`/categories/${category.slug}`}>
                   <div className="group bg-gray-50 rounded-lg p-8 text-center hover:bg-purple-50 transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-1">
                     <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300 shadow-sm">
                       <Package className="h-8 w-8 text-purple-600" />
                     </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 font-heading">{category.name}</h3>
                    {category.description && (
                      <p className="text-gray-600 leading-relaxed">{category.description}</p>
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
          <section className="py-24 bg-gray-50 px-8 md:px-16 lg:px-24">
                      <div className="container mx-auto">
             <div className="text-center mb-8">
               <h2 className="text-4xl font-bold text-gray-900 font-heading mb-4">New Arrivals</h2>
               <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
             </div>
             <div className="text-center mb-8">
               <Button variant="ghost" asChild className="text-purple-600 hover:text-purple-700">
                 <Link href="/products">
                   View All <ArrowRight className="ml-2 h-4 w-4" />
                 </Link>
               </Button>
             </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

             {/* Sale Products */}
       {saleProducts.length > 0 && (
         <section className="py-24 bg-white">
                     <div className="container mx-auto px-4">
             <div className="text-center mb-8">
               <h2 className="text-4xl font-bold text-gray-900 font-heading mb-4">On Sale</h2>
               <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
             </div>
             <div className="text-center mb-8">
               <Button variant="ghost" asChild className="text-purple-600 hover:text-purple-700">
                 <Link href="/products">
                   View All <ArrowRight className="ml-2 h-4 w-4" />
                 </Link>
               </Button>
             </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

             {/* CTA Section */}
       <section className="py-28 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
                     <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">
             Ready to Transform Your Hair?
           </h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Join thousands of customers who have discovered the secret to beautiful, healthy hair
          </p>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button size="lg" asChild className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4">
               <Link href="/products">Start Shopping</Link>
             </Button>
             <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4">
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
             <Card className="overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white rounded-xl shadow-md hover:scale-105 hover:-translate-y-1">
        <div className="relative">
                     <div className="aspect-[4/3] bg-white flex items-center justify-center">
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
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                SALE
              </Badge>
            )}
          </div>
        </div>

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
          {/* Price - Always Visible */}
                     <div className="flex items-center gap-2 mb-3">
             <span className="text-base font-bold text-purple-600">
               ${product.price}
             </span>
             {product.original_price && product.original_price > product.price && (
               <span className="text-xs text-gray-500 line-through">
                 ${product.original_price}
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
                    className={`h-2.5 w-2.5 ${
                      star <= product.rating
                        ? "text-yellow-400/80 fill-current"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.review_count})</span>
            </div>

            {/* Stock Status - Always Visible */}
            <div className="text-xs text-gray-600 mb-2">
              {product.in_stock ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>

                         {/* Description - Always Visible (Condensed) */}
             {product.description && (
               <p className="text-xs text-gray-500 line-clamp-1 mb-2 leading-relaxed">
                 {product.description}
               </p>
             )}
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
             >
               Add to Cart
             </Button>
           </div>
        </CardContent>
      </Card>
    </Link>
  )
}
