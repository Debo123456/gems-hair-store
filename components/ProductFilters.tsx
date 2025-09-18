"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Filter, X, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProductService } from "@/lib/productService"
import { ProductCategory } from "@/lib/supabase"

interface FilterState {
  categories: string[]
  brands: string[]
  concerns: string[]
  priceRange: [number, number]
  minRating: number
  inStock: boolean
}

interface ProductFiltersProps {
  className?: string
  onFiltersChange: (filters: FilterState) => void
}

// Static filter options (brands and concerns)
const STATIC_FILTER_OPTIONS = {
  brands: [
    { id: 'gems', label: 'Gems' },
    { id: 'premium', label: 'Premium' },
    { id: 'natural', label: 'Natural' }
  ],
  concerns: [
    { id: 'dryness', label: 'Dryness' },
    { id: 'frizz', label: 'Frizz' },
    { id: 'damage', label: 'Damage' },
    { id: 'volume', label: 'Volume' },
    { id: 'color-protection', label: 'Color Protection' }
  ]
}

const FilterSection = ({ 
  title, 
  children, 
  isOpen = true 
}: { 
  title: string
  children: React.ReactNode
  isOpen?: boolean
}) => {
  const [open, setOpen] = useState(isOpen)

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left font-medium text-gray-900 hover:text-gray-700"
      >
        <span>{title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {open && (
        <div className="pb-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  )
}

const CheckboxGroup = ({ 
  options, 
  selected, 
  onChange 
}: { 
  options: { id: string; label: string }[]
  selected: string[]
  onChange: (value: string, checked: boolean) => void
}) => {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <Checkbox
            id={option.id}
            checked={selected.includes(option.id)}
            onCheckedChange={(checked) => onChange(option.id, checked as boolean)}
          />
          <label
            htmlFor={option.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  )
}

const PriceRangeSlider = ({ 
  value, 
  onChange 
}: { 
  value: [number, number]
  onChange: (value: [number, number]) => void
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-gray-600">
        <span>${value[0]}</span>
        <span>${value[1]}</span>
      </div>
      <Slider
        value={value}
        onValueChange={onChange}
        max={200}
        min={0}
        step={10}
        className="w-full"
      />
    </div>
  )
}

const RatingFilter = ({ 
  value, 
  onChange 
}: { 
  value: number
  onChange: (value: number) => void
}) => {
  const ratings = [4, 3, 2, 1]

  return (
    <div className="space-y-2">
      {ratings.map((rating) => (
        <div key={rating} className="flex items-center space-x-2">
          <Checkbox
            id={`rating-${rating}`}
            checked={value === rating}
            onCheckedChange={() => onChange(rating)}
          />
          <label
            htmlFor={`rating-${rating}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {rating}+ Stars
          </label>
        </div>
      ))}
    </div>
  )
}

const ActiveFilters = ({ 
  filters, 
  onClear 
}: { 
  filters: FilterState
  onClear: () => void
}) => {
  const activeFilters = [
    ...filters.categories.map(cat => ({ type: 'category', label: cat })),
    ...filters.brands.map(brand => ({ type: 'brand', label: brand })),
    ...filters.concerns.map(concern => ({ type: 'concern', label: concern })),
    ...(filters.minRating > 0 ? [{ type: 'rating', label: `${filters.minRating}+ Stars` }] : []),
    ...(filters.inStock ? [{ type: 'stock', label: 'In Stock' }] : [])
  ]

  if (activeFilters.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {activeFilters.map((filter, index) => (
        <Badge key={index} variant="secondary" className="text-xs">
          {filter.label}
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="text-xs h-6 px-2"
      >
        Clear All
      </Button>
    </div>
  )
}

export const ProductFilters = ({ className, onFiltersChange }: ProductFiltersProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    concerns: [],
    priceRange: [0, 10000], // Increased to include expensive products
    minRating: 0,
    inStock: false
  })

  // Load categories from database
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true)
        const dbCategories = await ProductService.getCategories()
        const categoryOptions = dbCategories.map(category => ({
          id: category.slug,
          label: category.name
        }))
        setCategories(categoryOptions)
      } catch (error) {
        console.error('Failed to load categories:', error)
        // Fallback to empty array if categories fail to load
        setCategories([])
      } finally {
        setCategoriesLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Initialize filters from URL params
  useEffect(() => {
    const newFilters: FilterState = {
      categories: searchParams.get('categories')?.split(',') || [],
      brands: searchParams.get('brands')?.split(',') || [],
      concerns: searchParams.get('concerns')?.split(',') || [],
      priceRange: [
        parseInt(searchParams.get('minPrice') || '0'),
        parseInt(searchParams.get('maxPrice') || '200')
      ],
      minRating: parseInt(searchParams.get('minRating') || '0'),
      inStock: searchParams.get('inStock') === 'true'
    }
    setFilters(newFilters)
  }, [searchParams])

  // Update URL when filters change
  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams()
    
    if (newFilters.categories.length > 0) {
      params.set('categories', newFilters.categories.join(','))
    }
    if (newFilters.brands.length > 0) {
      params.set('brands', newFilters.brands.join(','))
    }
    if (newFilters.concerns.length > 0) {
      params.set('concerns', newFilters.concerns.join(','))
    }
    if (newFilters.priceRange[0] > 0) {
      params.set('minPrice', newFilters.priceRange[0].toString())
    }
    if (newFilters.priceRange[1] < 10000) {
      params.set('maxPrice', newFilters.priceRange[1].toString())
    }
    if (newFilters.minRating > 0) {
      params.set('minRating', newFilters.minRating.toString())
    }
    if (newFilters.inStock) {
      params.set('inStock', 'true')
    }

    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname
    router.push(newURL, { scroll: false })
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    updateURL(newFilters)
    onFiltersChange(newFilters)
  }

  const handleCheckboxChange = (type: keyof FilterState, value: string, checked: boolean) => {
    const currentValues = filters[type] as string[]
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value)
    
    handleFilterChange({
      ...filters,
      [type]: newValues
    })
  }

  const handlePriceChange = (value: [number, number]) => {
    handleFilterChange({
      ...filters,
      priceRange: value
    })
  }

  const handleRatingChange = (value: number) => {
    handleFilterChange({
      ...filters,
      minRating: filters.minRating === value ? 0 : value
    })
  }

  const handleStockChange = (checked: boolean) => {
    handleFilterChange({
      ...filters,
      inStock: checked
    })
  }

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      categories: [],
      brands: [],
      concerns: [],
      priceRange: [0, 10000], // Increased to include expensive products
      minRating: 0,
      inStock: false
    }
    handleFilterChange(clearedFilters)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <ActiveFilters filters={filters} onClear={clearAllFilters} />
      
      <FilterSection title="Category">
        {categoriesLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            <span className="ml-2 text-sm text-gray-500">Loading categories...</span>
          </div>
        ) : categories.length > 0 ? (
          <CheckboxGroup
            options={categories}
            selected={filters.categories}
            onChange={(value, checked) => handleCheckboxChange('categories', value, checked)}
          />
        ) : (
          <p className="text-sm text-gray-500">No categories available</p>
        )}
      </FilterSection>

      <FilterSection title="Brand">
        <CheckboxGroup
          options={STATIC_FILTER_OPTIONS.brands}
          selected={filters.brands}
          onChange={(value, checked) => handleCheckboxChange('brands', value, checked)}
        />
      </FilterSection>

      <FilterSection title="Concern">
        <CheckboxGroup
          options={STATIC_FILTER_OPTIONS.concerns}
          selected={filters.concerns}
          onChange={(value, checked) => handleCheckboxChange('concerns', value, checked)}
        />
      </FilterSection>

      <FilterSection title="Price Range">
        <PriceRangeSlider
          value={filters.priceRange}
          onChange={handlePriceChange}
        />
      </FilterSection>

      <FilterSection title="Rating">
        <RatingFilter
          value={filters.minRating}
          onChange={handleRatingChange}
        />
      </FilterSection>

      <FilterSection title="Availability">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={filters.inStock}
            onCheckedChange={handleStockChange}
          />
          <label
            htmlFor="inStock"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            In Stock Only
          </label>
        </div>
      </FilterSection>
    </div>
  )

  return (
    <>
      {/* Desktop Left Rail */}
      <aside className={`hidden xl:block w-80 flex-shrink-0 ${className}`}>
        <div className="sticky top-4 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Bottom Sheet */}
      <div className="xl:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full mb-4">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {Object.values(filters).some(v => 
                Array.isArray(v) ? v.length > 0 : v !== false && v !== 0
              ) && (
                <Badge variant="secondary" className="ml-2">
                  Active
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
