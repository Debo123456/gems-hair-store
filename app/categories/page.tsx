"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ArrowRight } from "lucide-react"
import Link from "next/link"

// Category metadata
const categories = [
  {
    slug: "hair-care",
    title: "Hair Care",
    description: "Discover our range of gentle, natural shampoos and conditioners designed for all hair types",
    productCount: 4
  },
  {
    slug: "treatment",
    title: "Treatment",
    description: "Nourish and repair your hair with our premium oils and intensive treatments",
    productCount: 3
  },
  {
    slug: "styling",
    title: "Styling Products",
    description: "Create the perfect look with our professional styling products and tools",
    productCount: 2
  },
  {
    slug: "tools",
    title: "Tools & Accessories",
    description: "Professional tools and accessories for perfect hair care and styling",
    productCount: 1
  },
  {
    slug: "accessories",
    title: "Accessories",
    description: "Essential hair care accessories and styling tools",
    productCount: 1
  }
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive range of hair care products organized by category
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`}>
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Package className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl group-hover:text-purple-600 transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.productCount} products
                    </span>
                    <ArrowRight className="h-5 w-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
