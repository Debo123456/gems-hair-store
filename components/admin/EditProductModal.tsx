"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, X, Save, AlertCircle } from "lucide-react"
import { AdminProductService, AdminProduct, UpdateProductData } from "@/lib/adminProductService"

interface EditProductModalProps {
  product: AdminProduct
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductUpdated?: () => void
}

export function EditProductModal({ product, open, onOpenChange, onProductUpdated }: EditProductModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newFeature, setNewFeature] = useState("")
  const [newSize, setNewSize] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    imageUrl: "",
    category: "",
    stockQuantity: "0",
    inStock: true,
    isNew: false,
    isFeatured: false,
    isOnSale: false,
    features: [] as string[],
    ingredients: "",
    sizes: [] as string[],
    howToUse: "",
    shippingInfo: "",
    returnPolicy: ""
  })

  const categories = [
    "Hair Care",
    "Treatment", 
    "Styling",
    "Tools",
    "Accessories"
  ]

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        originalPrice: product.original_price?.toString() || "",
        imageUrl: product.image_url || "",
        category: product.category || "",
        stockQuantity: product.stock_quantity?.toString() || "0",
        inStock: product.in_stock ?? true,
        isNew: product.is_new ?? false,
        isFeatured: product.is_featured ?? false,
        isOnSale: product.is_on_sale ?? false,
        features: product.features || [],
        ingredients: product.ingredients || "",
        sizes: product.sizes || [],
        howToUse: product.how_to_use || "",
        shippingInfo: product.shipping_info || "",
        returnPolicy: product.return_policy || ""
      })
    }
  }, [product])

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
  }

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleAddSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()]
      }))
      setNewSize("")
    }
  }

  const handleRemoveSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }))
  }

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return "Product name is required"
    if (!formData.description.trim()) return "Product description is required"
    if (!formData.price || parseFloat(formData.price) <= 0) return "Valid price is required"
    if (!formData.category) return "Category is required"
    if (!formData.imageUrl.trim()) return "Image URL is required"
    if (formData.features.length === 0) return "At least one feature is required"
    if (formData.sizes.length === 0) return "At least one size is required"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const updateData: UpdateProductData = {
        id: product.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        image_url: formData.imageUrl.trim(),
        category: formData.category,
        stock_quantity: parseInt(formData.stockQuantity),
        in_stock: formData.inStock,
        is_new: formData.isNew,
        is_featured: formData.isFeatured,
        is_on_sale: formData.isOnSale,
        features: formData.features,
        ingredients: formData.ingredients.trim() || undefined,
        sizes: formData.sizes,
        how_to_use: formData.howToUse.trim() || undefined,
        shipping_info: formData.shippingInfo.trim() || undefined,
        return_policy: formData.returnPolicy.trim() || undefined
      }

      await AdminProductService.updateProduct(updateData)
      onOpenChange(false)
      onProductUpdated?.()

    } catch (error) {
      console.error('Error updating product:', error)
      setError(error instanceof Error ? error.message : 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product information. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
              <CardDescription>Essential product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter product description"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL *</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing & Inventory</CardTitle>
              <CardDescription>Set pricing and stock information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) => handleInputChange("inStock", checked as boolean)}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isNew"
                    checked={formData.isNew}
                    onCheckedChange={(checked) => handleInputChange("isNew", checked as boolean)}
                  />
                  <Label htmlFor="isNew">New Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleInputChange("isFeatured", checked as boolean)}
                  />
                  <Label htmlFor="isFeatured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isOnSale"
                    checked={formData.isOnSale}
                    onCheckedChange={(checked) => handleInputChange("isOnSale", checked as boolean)}
                  />
                  <Label htmlFor="isOnSale">On Sale</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features *</CardTitle>
              <CardDescription>Key product features and benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                />
                <Button type="button" onClick={handleAddFeature} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sizes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Sizes *</CardTitle>
              <CardDescription>Product size options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Add a size (e.g., 250ml, Small, etc.)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                />
                <Button type="button" onClick={handleAddSize} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.sizes.map((size, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {size}
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(index)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
              <CardDescription>Ingredients, usage instructions, and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients</Label>
                <Textarea
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) => handleInputChange("ingredients", e.target.value)}
                  placeholder="List key ingredients"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="howToUse">How to Use</Label>
                <Textarea
                  id="howToUse"
                  value={formData.howToUse}
                  onChange={(e) => handleInputChange("howToUse", e.target.value)}
                  placeholder="Usage instructions"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingInfo">Shipping Information</Label>
                <Textarea
                  id="shippingInfo"
                  value={formData.shippingInfo}
                  onChange={(e) => handleInputChange("shippingInfo", e.target.value)}
                  placeholder="Shipping details and policies"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="returnPolicy">Return Policy</Label>
                <Textarea
                  id="returnPolicy"
                  value={formData.returnPolicy}
                  onChange={(e) => handleInputChange("returnPolicy", e.target.value)}
                  placeholder="Return and refund policy"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Product
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
