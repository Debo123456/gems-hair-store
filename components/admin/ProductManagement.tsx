"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, Tag, RefreshCw, AlertCircle, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Product } from "@/lib/productSearch"
import { AddProductModal } from "./AddProductModal"
import { EditProductModal } from "./EditProductModal"
import { ViewProductModal } from "./ViewProductModal"
import { DeleteProductDialog } from "./DeleteProductDialog"
import { BulkDeleteDialog } from "./BulkDeleteDialog"
import { AdminProductCard } from "./AdminProductCard"
import { useAdminProducts } from "@/hooks/useAdminProducts"
import { AdminProduct } from "@/lib/adminProductService"
import { AdminProductService } from "@/lib/adminProductService"
import { ProductCategory } from "@/lib/supabase"

export function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [viewingProduct, setViewingProduct] = useState<AdminProduct | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<{ id: string; name: string } | null>(null)
  const [showBulkDelete, setShowBulkDelete] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const {
    products,
    loading,
    error,
    total,
    page,
    totalPages,
    stats,
    statsLoading,
    options,
    refresh,
    deleteProduct,
    deleteProducts,
    updateOptions
  } = useAdminProducts({
    limit: 20,
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  // Load categories from database
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true)
        const dbCategories = await AdminProductService.getCategories()
        setCategories(dbCategories)
      } catch (error) {
        console.error('Failed to load categories:', error)
        setCategories([])
      } finally {
        setCategoriesLoading(false)
      }
    }

    loadCategories()
  }, [])

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

  const handleProductCreated = () => {
    setShowAddProduct(false)
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
                <SelectItem value="all">All Categories</SelectItem>
                {categoriesLoading ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading categories...
                    </div>
                  </SelectItem>
                ) : (
                  categories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
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

      {/* Pagination Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg p-4">
        {/* Results Info */}
        <div className="text-sm text-gray-600">
          {total > 0 ? (
            <>Showing {((page - 1) * (options.limit || 20)) + 1} to {Math.min(page * (options.limit || 20), total)} of {total} products</>
          ) : (
            <>No products found. {error && `(${error})`}</>
          )}
        </div>

        {/* Items per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <Select
            value={options.limit?.toString() || "20"}
            onValueChange={(value) => updateOptions({ limit: parseInt(value), page: 1 })}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">per page</span>
        </div>
      </div>

      {/* Enhanced Pagination Controls */}
      {totalPages > 1 ? (
        <div className="relative flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg p-4">
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
              disabled={page === 1 || loading}
              onClick={() => updateOptions({ page: 1 })}
              className="hidden sm:flex"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            {/* Previous Page */}
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || loading}
              onClick={() => updateOptions({ page: page - 1 })}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {(() => {
                const pages = []
                const maxVisiblePages = 5
                let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
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
                      variant={page === 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateOptions({ page: 1 })}
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
                      variant={page === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateOptions({ page: i })}
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
                      variant={page === totalPages ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateOptions({ page: totalPages })}
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
              disabled={page === totalPages || loading}
              onClick={() => updateOptions({ page: page + 1 })}
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Last Page */}
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages || loading}
              onClick={() => updateOptions({ page: totalPages })}
              className="hidden sm:flex"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : total === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center gap-4 bg-white border border-gray-200 rounded-lg p-8">
          <Package className="h-16 w-16 text-gray-400" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-4">
              {error ? `Error: ${error}` : "Get started by adding your first product to the store."}
            </p>
            <Button onClick={() => setShowAddProduct(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        </div>
      ) : null}

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

      {/* Add Product Modal */}
      <AddProductModal
        open={showAddProduct}
        onOpenChange={setShowAddProduct}
        onProductAdded={handleProductCreated}
      />
    </div>
  )
}
