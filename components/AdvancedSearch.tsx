"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X, Star, DollarSign, Package } from "lucide-react"
import { useSearch } from "@/hooks/useSearch"

interface AdvancedSearchProps {
  className?: string
  showFilters?: boolean
  onToggleFilters?: () => void
}

export function AdvancedSearch({ className = "", showFilters = false, onToggleFilters }: AdvancedSearchProps) {
  const { state, setQuery, setCategory, setPriceRange, setMinRating, setInStock, setIsNew, setIsFeatured, setIsOnSale, setSort, resetFilters } = useSearch()
  const [localQuery, setLocalQuery] = useState(state.filters.query || "")
  const [isExpanded, setIsExpanded] = useState(showFilters)

  // Sync local query with global state
  useEffect(() => {
    setLocalQuery(state.filters.query || "")
  }, [state.filters.query])

  const handleSearch = () => {
    setQuery(localQuery)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handlePriceRangeChange = (value: string[]) => {
    const min = parseInt(value[0]) || 0
    const max = parseInt(value[1]) || 1000
    setPriceRange(min, max)
  }

  const handleRatingChange = (rating: number) => {
    setMinRating(rating === state.filters.minRating ? 0 : rating)
  }

  const handleSortChange = (sortBy: string) => {
    setSort({ field: sortBy as any, direction: 'desc' })
  }

  const handleCategoryChange = (category: string) => {
    setCategory(category)
  }

  const toggleFilters = () => {
    setIsExpanded(!isExpanded)
    onToggleFilters?.()
  }

  const clearAllFilters = () => {
    resetFilters()
    setLocalQuery("")
  }

  const hasActiveFilters = state.filters.category || 
    (state.filters.maxPrice !== undefined && state.filters.maxPrice < 1000) || 
    (state.filters.minRating !== undefined && state.filters.minRating > 0) || 
    state.filters.inStock !== undefined ||
    state.filters.isNew !== undefined ||
    state.filters.isFeatured !== undefined ||
    state.filters.isOnSale !== undefined ||
    state.sort.field !== "created_at"

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products by name, description, or category..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-4"
              />
            </div>
            <Button onClick={handleSearch} className="px-6">
              Search
            </Button>
            <Button 
              variant="outline" 
              onClick={toggleFilters}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1">
                  Active
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {isExpanded && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Advanced Filters
              </span>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={toggleFilters}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Refine your search with advanced filters and sorting options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Categories
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "All Products",
                  "hair-care",
                  "treatment",
                  "styling",
                  "tools",
                  "accessories"
                ].map((category) => (
                  <Button
                    key={category}
                    variant={state.filters.category === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryChange(category === "All Products" ? "" : category)}
                    className="justify-start text-sm"
                  >
                    {category === "All Products" ? "All Products" : 
                     category === "hair-care" ? "Hair Care" :
                     category === "treatment" ? "Treatment" :
                     category === "styling" ? "Styling" :
                     category === "tools" ? "Tools" :
                     category === "accessories" ? "Accessories" : category}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Price Range
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Min Price</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={state.filters.minPrice || ""}
                    onChange={(e) => {
                      const min = parseInt(e.target.value) || 0
                      const max = state.filters.maxPrice || 1000
                      setPriceRange(min, max)
                    }}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Max Price</label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={state.filters.maxPrice || ""}
                    onChange={(e) => {
                      const min = state.filters.minPrice || 0
                      const max = parseInt(e.target.value) || 1000
                      setPriceRange(min, max)
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Rating */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Minimum Rating
              </h4>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={state.filters.minRating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleRatingChange(rating)}
                    className="flex items-center gap-1"
                  >
                    <Star className="h-4 w-4" />
                    {rating}+
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Availability */}
            <div>
              <h4 className="font-medium mb-3">Availability</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={state.filters.inStock === true}
                    onCheckedChange={() => setInStock(true)}
                  />
                  <label htmlFor="in-stock" className="text-sm">In Stock Only</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="out-of-stock"
                    checked={state.filters.inStock === false}
                    onCheckedChange={() => setInStock(false)}
                  />
                  <label htmlFor="out-of-stock" className="text-sm">Out of Stock Only</label>
                </div>
                <div className="text-xs text-gray-500">
                  Leave both unchecked to show all products
                </div>
              </div>
            </div>

            <Separator />

            {/* Product Flags */}
            <div>
              <h4 className="font-medium mb-3">Product Features</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="new"
                    checked={state.filters.isNew === true}
                    onCheckedChange={(checked) => setIsNew(checked as boolean)}
                  />
                  <label htmlFor="new" className="text-sm">New Products</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={state.filters.isFeatured === true}
                    onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                  />
                  <label htmlFor="featured" className="text-sm">Featured Products</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sale"
                    checked={state.filters.isOnSale === true}
                    onCheckedChange={(checked) => setIsOnSale(checked as boolean)}
                  />
                  <label htmlFor="sale" className="text-sm">On Sale</label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Sorting */}
            <div>
              <h4 className="font-medium mb-3">Sort By</h4>
              <Select value={state.sort.field} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price">Price (Low to High)</SelectItem>
                  <SelectItem value="rating">Rating (High to Low)</SelectItem>
                  <SelectItem value="created_at">Newest First</SelectItem>
                  <SelectItem value="review_count">Most Reviewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
