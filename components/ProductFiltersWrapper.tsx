"use client"

import { Suspense } from "react"
import { ProductFilters } from "./ProductFilters"

interface FilterState {
  categories: string[]
  brands: string[]
  concerns: string[]
  priceRange: [number, number]
  minRating: number
  inStock: boolean
}

interface ProductFiltersWrapperProps {
  className?: string
  onFiltersChange: (filters: FilterState) => void
}

// Loading fallback for the filters
const FiltersSkeleton = () => (
  <div className="hidden xl:block w-80 flex-shrink-0">
    <div className="sticky top-4 bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border-b border-gray-200 last:border-b-0">
            <div className="flex items-center justify-between py-4">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="pb-4 space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const ProductFiltersWrapper = ({ className, onFiltersChange }: ProductFiltersWrapperProps) => {
  return (
    <Suspense fallback={<FiltersSkeleton />}>
      <ProductFilters className={className} onFiltersChange={onFiltersChange} />
    </Suspense>
  )
}
