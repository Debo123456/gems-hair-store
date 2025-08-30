"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, Tag } from "lucide-react"
import { Product } from "@/lib/productSearch"

export function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Mock products data - in a real app, this would come from Supabase
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Nourishing Hair Mask",
      description: "Deep conditioning treatment for damaged hair",
      price: 24.99,
      originalPrice: 29.99,
      category: "Treatments",
      rating: 4.8,
      reviewCount: 156,
      image: "/products/hair-mask.jpg",
      inStock: true,
      stockQuantity: 45,
      sizes: ["250ml", "500ml"],
      features: ["Deep conditioning", "Repair", "Moisturizing"],
      tags: ["deep conditioning", "damaged hair", "repair"],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
      images: ["/products/hair-mask.jpg"]
    },
    {
      id: "2",
      name: "Volumizing Shampoo",
      description: "Adds volume and body to fine hair",
      price: 18.99,
      originalPrice: 18.99,
      category: "Shampoo",
      rating: 4.6,
      reviewCount: 89,
      image: "/products/volumizing-shampoo.jpg",
      inStock: true,
      stockQuantity: 32,
      sizes: ["250ml", "500ml"],
      features: ["Volume", "Body", "Fine hair"],
      tags: ["volume", "fine hair", "body"],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
      images: ["/products/volumizing-shampoo.jpg"]
    },
    {
      id: "3",
      name: "Heat Protection Spray",
      description: "Protects hair from heat damage up to 450°F",
      price: 22.99,
      originalPrice: 22.99,
      category: "Styling",
      rating: 4.9,
      reviewCount: 203,
      image: "/products/heat-protection.jpg",
      inStock: false,
      stockQuantity: 0,
      sizes: ["150ml", "300ml"],
      features: ["Heat protection", "Styling", "Damage prevention"],
      tags: ["heat protection", "styling", "damage prevention"],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
      images: ["/products/heat-protection.jpg"]
    }
  ]

  const categories = ["all", "Shampoo", "Conditioner", "Treatments", "Styling", "Tools"]

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  const handleBulkDelete = () => {
    // In a real app, this would call Supabase to delete products
    console.log("Deleting products:", selectedProducts)
    setSelectedProducts([])
  }

  const getStockStatus = (product: Product) => {
    if (!product.inStock) return { label: "Out of Stock", color: "destructive" }
    if (product.stockQuantity < 10) return { label: "Low Stock", color: "warning" }
    return { label: "In Stock", color: "default" }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedProducts.length} product(s) selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Selected
                </Button>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Grid/List */}
      <div className="space-y-4">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.id} className="relative">
                <div className="absolute top-4 left-4">
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => handleSelectProduct(product.id)}
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStockStatus(product).color as "default" | "destructive" | "secondary" | "outline"}>
                      {getStockStatus(product).label}
                    </Badge>
                    <Badge variant="outline">{product.category}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>⭐ {product.rating}</span>
                    <span>•</span>
                    <span>{product.reviewCount} reviews</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">
                        <Checkbox
                          checked={selectedProducts.length === filteredProducts.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="text-left p-4">Product</th>
                      <th className="text-left p-4">Category</th>
                      <th className="text-left p-4">Price</th>
                      <th className="text-left p-4">Stock</th>
                      <th className="text-left p-4">Rating</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="border-b">
                        <td className="p-4">
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() => handleSelectProduct(product.id)}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-600 line-clamp-1">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{product.category}</Badge>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">${product.price}</div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-sm text-gray-500 line-through">
                              ${product.originalPrice}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <Badge variant={getStockStatus(product).color as "default" | "destructive" | "secondary" | "outline"}>
                            {getStockStatus(product).label}
                          </Badge>
                          <div className="text-sm text-gray-600 mt-1">
                            {product.stockQuantity} units
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <span>⭐</span>
                            <span>{product.rating}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {product.reviewCount} reviews
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {mockProducts.length} products
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
