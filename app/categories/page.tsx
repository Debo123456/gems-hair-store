"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { ProductService } from "@/lib/productService"
import { ProductCategory } from "@/lib/supabase"

interface CategoryWithCount extends ProductCategory {
  productCount: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Load categories from database
        const dbCategories = await ProductService.getCategories()
        
        // Get product count for each category
        const categoriesWithCounts = await Promise.all(
          dbCategories.map(async (category) => {
            const { total } = await ProductService.getProducts(
              { category: category.name },
              { field: 'created_at', direction: 'desc' },
              1,
              1
            )
            return {
              ...category,
              productCount: total
            }
          })
        )
        
        setCategories(categoriesWithCounts)
      } catch (err) {
        console.error('Failed to load categories:', err)
        setError('Failed to load categories. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-purple-600 hover:text-purple-700"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

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
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Categories will appear here once they are added to the store.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link key={category.slug} href={`/categories/${category.slug}`}>
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Package className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-2xl group-hover:text-purple-600 transition-colors">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {category.description || "Browse our products in this category"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                      </span>
                      <ArrowRight className="h-5 w-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
