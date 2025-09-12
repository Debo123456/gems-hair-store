"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, Tag, RefreshCw, AlertCircle } from "lucide-react"
import { Product } from "@/lib/productSearch"
import { AddProductModal } from "./AddProductModal"
import { EditProductModal } from "./EditProductModal"
import { ViewProductModal } from "./ViewProductModal"
import { DeleteProductDialog } from "./DeleteProductDialog"
import { BulkDeleteDialog } from "./BulkDeleteDialog"
import { AdminProductCard } from "./AdminProductCard"
import { useAdminProducts } from "@/hooks/useAdminProducts"
import { AdminProduct } from "@/lib/adminProductService"

export function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [viewingProduct, setViewingProduct] = useState<AdminProduct | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<{ id: string; name: string } | null>(null)
  const [showBulkDelete, setShowBulkDelete] = useState(false)

  const {
    products,
    loading,
    error,
    total,
    page,
    totalPages,
    stats,
    statsLoading,
    refresh,
    deleteProduct,
    deleteProducts,
    updateOptions
  } = useAdminProducts({
    limit: 20,
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  const categories = ["all", "Hair Care", "Treatment", "Styling", "Tools", "Accessories"]

  // Update search and category filters
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    updateOptions({ search: value || undefined, page: 1 })
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    updateOptions({ category: value === "all" ? undefined : value, page: 1 })
  }

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(p => p.id))
    }
  }

  const handleBulkDelete = () => {
    setShowBulkDelete(true)
  }

  const handleBulkDeleteConfirm = async (ids: string[]) => {
    console.log("Bulk delete confirmed for products:", ids)
    try {
      await deleteProducts(ids)
      setSelectedProducts([])
      console.log("Products deleted successfully")
    } catch (error) {
      console.error("Failed to delete products:", error)
      throw error // Re-throw so the dialog can handle the error
    }
  }

  const handleEditProduct = (product: AdminProduct) => {
    setEditingProduct(product)
  }

  const handleViewProduct = (product: AdminProduct) => {
    setViewingProduct(product)
  }

  const handleDeleteProduct = (product: AdminProduct) => {
    setDeletingProduct({ id: product.id, name: product.name })
  }

  const handleProductUpdated = () => {
    setEditingProduct(null)
    refresh()
  }

  const handleProductDeleted = () => {
    setDeletingProduct(null)
    refresh()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <AddProductModal onProductAdded={refresh} />
        </div>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsLoading ? "Loading..." : "All products"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.lowStock || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsLoading ? "Loading..." : "Products running low"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.outOfStock || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsLoading ? "Loading..." : "Need restocking"}
            </p>
          </CardContent>
        </Card>
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
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
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
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Grid/List */}
      <div className="space-y-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <AdminProductCard
                key={product.id}
                product={product}
                isSelected={selectedProducts.includes(product.id)}
                onSelect={handleSelectProduct}
                onEdit={handleEditProduct}
                onView={handleViewProduct}
                onDelete={handleDeleteProduct}
              />
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
                          checked={selectedProducts.length === products.length}
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
                    {products.map((product: AdminProduct) => (
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
                              {product.image_url ? (
                                <img 
                                  src={product.image_url} 
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <Package className="h-6 w-6 text-gray-400" />
                              )}
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
                          {product.original_price && product.original_price > product.price && (
                            <div className="text-sm text-gray-500 line-through">
                              ${product.original_price}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <Badge variant={!product.in_stock ? "destructive" : product.stock_quantity < 10 ? "secondary" : "default"}>
                            {!product.in_stock ? "Out of Stock" : product.stock_quantity < 10 ? "Low Stock" : "In Stock"}
                          </Badge>
                          <div className="text-sm text-gray-600 mt-1">
                            {product.stock_quantity} units
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <span>⭐</span>
                            <span>{product.rating}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {product.review_count} reviews
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewProduct(product)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteProduct(product)}
                            >
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
          Showing {products.length} of {total} products
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === 1}
            onClick={() => updateOptions({ page: page - 1 })}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 px-2">
            Page {page} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === totalPages}
            onClick={() => updateOptions({ page: page + 1 })}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
          onProductUpdated={handleProductUpdated}
        />
      )}

      {/* View Product Modal */}
      {viewingProduct && (
        <ViewProductModal
          product={viewingProduct}
          open={!!viewingProduct}
          onOpenChange={(open) => !open && setViewingProduct(null)}
        />
      )}

      {/* Delete Product Dialog */}
      {deletingProduct && (
        <DeleteProductDialog
          product={deletingProduct}
          open={!!deletingProduct}
          onOpenChange={(open) => !open && setDeletingProduct(null)}
          onProductDeleted={handleProductDeleted}
        />
      )}

      {/* Bulk Delete Dialog */}
      <BulkDeleteDialog
        productIds={selectedProducts}
        productNames={selectedProducts.map(id => products.find(p => p.id === id)?.name || 'Unknown').filter(Boolean)}
        open={showBulkDelete}
        onOpenChange={setShowBulkDelete}
        onDeleteProducts={handleBulkDeleteConfirm}
      />
    </div>
  )
}
