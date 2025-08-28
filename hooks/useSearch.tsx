"use client"

import { createContext, useContext, useReducer, useEffect, ReactNode, useState } from "react"
import { ProductService, ProductFilters, ProductSort } from "@/lib/productService"
import { Product, ProductCategory } from "@/lib/supabase"

// Types
interface SearchState {
  products: Product[]
  categories: ProductCategory[]
  filters: ProductFilters
  sort: ProductSort
  currentPage: number
  totalProducts: number
  hasMore: boolean
  loading: boolean
  error: string | null
}

type SearchAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_CATEGORIES'; payload: ProductCategory[] }
  | { type: 'SET_TOTAL_PRODUCTS'; payload: number }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_PRICE_RANGE'; payload: { min: number; max: number } }
  | { type: 'SET_MIN_RATING'; payload: number }
  | { type: 'SET_IN_STOCK'; payload: boolean }
  | { type: 'SET_IS_NEW'; payload: boolean }
  | { type: 'SET_IS_FEATURED'; payload: boolean }
  | { type: 'SET_IS_ON_SALE'; payload: boolean }
  | { type: 'SET_SORT'; payload: ProductSort }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'RESET_FILTERS' }
  | { type: 'CLEAR_SEARCH' }
  | { type: 'APPEND_PRODUCTS'; payload: Product[] }

// Initial state
const initialState: SearchState = {
  products: [],
  categories: [],
  filters: {},
  sort: { field: 'created_at', direction: 'desc' },
  currentPage: 1,
  totalProducts: 0,
  hasMore: false,
  loading: false,
  error: null
}

// Search reducer
function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload }
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload }
    
    case 'SET_TOTAL_PRODUCTS':
      return { ...state, totalProducts: action.payload }
    
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload }
    
    case 'SET_QUERY':
      return { 
        ...state, 
        filters: { ...state.filters, query: action.payload },
        currentPage: 1 
      }
    
    case 'SET_CATEGORY':
      return { 
        ...state, 
        filters: { ...state.filters, category: action.payload },
        currentPage: 1 
      }
    
    case 'SET_PRICE_RANGE':
      return { 
        ...state, 
        filters: { 
          ...state.filters, 
          minPrice: action.payload.min,
          maxPrice: action.payload.max 
        },
        currentPage: 1 
      }
    
    case 'SET_MIN_RATING':
      return { 
        ...state, 
        filters: { ...state.filters, minRating: action.payload },
        currentPage: 1 
      }
    
    case 'SET_IN_STOCK':
      return { 
        ...state, 
        filters: { ...state.filters, inStock: action.payload },
        currentPage: 1 
      }
    
    case 'SET_IS_NEW':
      return { 
        ...state, 
        filters: { ...state.filters, isNew: action.payload },
        currentPage: 1 
      }
    
    case 'SET_IS_FEATURED':
      return { 
        ...state, 
        filters: { ...state.filters, isFeatured: action.payload },
        currentPage: 1 
      }
    
    case 'SET_IS_ON_SALE':
      return { 
        ...state, 
        filters: { ...state.filters, isOnSale: action.payload },
        currentPage: 1 
      }
    
    case 'SET_SORT':
      return { ...state, sort: action.payload }
    
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload }
    
    case 'RESET_FILTERS':
      return { 
        ...state, 
        filters: {},
        currentPage: 1 
      }
    
    case 'CLEAR_SEARCH':
      return { 
        ...state, 
        filters: { ...state.filters, query: undefined },
        currentPage: 1 
      }
    
    case 'APPEND_PRODUCTS':
      return { 
        ...state, 
        products: [...state.products, ...action.payload] 
      }
    
    default:
      return state
  }
}

// Search context
const SearchContext = createContext<{
  state: SearchState
  setQuery: (query: string) => void
  setCategory: (category: string) => void
  setPriceRange: (min: number, max: number) => void
  setMinRating: (rating: number) => void
  setInStock: (inStock: boolean) => void
  setIsNew: (isNew: boolean) => void
  setIsFeatured: (isFeatured: boolean) => void
  setIsOnSale: (isOnSale: boolean) => void
  setSort: (sort: ProductSort) => void
  setCurrentPage: (page: number) => void
  resetFilters: () => void
  clearSearch: () => void
  loadMoreProducts: () => Promise<void>
  searchProducts: () => Promise<void>
} | null>(null)

// Search provider component
export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialState)
  const [debouncedQuery, setDebouncedQuery] = useState("")

  // Load categories on mount
  useEffect(() => {
    loadCategories()
  }, [])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(state.filters.query || "")
    }, 300)

    return () => clearTimeout(timer)
  }, [state.filters.query])

  // Search products when filters change
  useEffect(() => {
    if (debouncedQuery !== undefined) {
      searchProducts()
    }
  }, [debouncedQuery, state.filters.category, state.filters.minPrice, state.filters.maxPrice, state.filters.minRating, state.filters.inStock, state.filters.isNew, state.filters.isFeatured, state.filters.isOnSale, state.sort])

  // Load categories
  const loadCategories = async () => {
    try {
      const categories = await ProductService.getCategories()
      dispatch({ type: 'SET_CATEGORIES', payload: categories })
    } catch (error) {
      console.error('Failed to load categories:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load categories' })
    }
  }

  // Search products
  const searchProducts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    
    try {
      const result = await ProductService.getProducts(
        state.filters,
        state.sort,
        state.currentPage,
        20
      )
      
      dispatch({ type: 'SET_PRODUCTS', payload: result.products })
      dispatch({ type: 'SET_TOTAL_PRODUCTS', payload: result.total })
      dispatch({ type: 'SET_HAS_MORE', payload: result.hasMore })
    } catch (error) {
      console.error('Failed to search products:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to search products' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Load more products (pagination)
  const loadMoreProducts = async () => {
    if (state.loading || !state.hasMore) return

    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      const nextPage = state.currentPage + 1
      const result = await ProductService.getProducts(
        state.filters,
        state.sort,
        nextPage,
        20
      )
      
      dispatch({ type: 'APPEND_PRODUCTS', payload: result.products })
      dispatch({ type: 'SET_CURRENT_PAGE', payload: nextPage })
      dispatch({ type: 'SET_HAS_MORE', payload: result.hasMore })
    } catch (error) {
      console.error('Failed to load more products:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load more products' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Action handlers
  const setQuery = (query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query })
  }

  const setCategory = (category: string) => {
    dispatch({ type: 'SET_CATEGORY', payload: category })
  }

  const setPriceRange = (min: number, max: number) => {
    dispatch({ type: 'SET_PRICE_RANGE', payload: { min, max } })
  }

  const setMinRating = (rating: number) => {
    dispatch({ type: 'SET_MIN_RATING', payload: rating })
  }

  const setInStock = (inStock: boolean) => {
    dispatch({ type: 'SET_IN_STOCK', payload: inStock })
  }

  const setIsNew = (isNew: boolean) => {
    dispatch({ type: 'SET_IS_NEW', payload: isNew })
  }

  const setIsFeatured = (isFeatured: boolean) => {
    dispatch({ type: 'SET_IS_FEATURED', payload: isFeatured })
  }

  const setIsOnSale = (isOnSale: boolean) => {
    dispatch({ type: 'SET_IS_ON_SALE', payload: isOnSale })
  }

  const setSort = (sort: ProductSort) => {
    dispatch({ type: 'SET_SORT', payload: sort })
  }

  const setCurrentPage = (page: number) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page })
  }

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' })
  }

  const clearSearch = () => {
    dispatch({ type: 'CLEAR_SEARCH' })
  }

  return (
    <SearchContext.Provider
      value={{
        state,
        setQuery,
        setCategory,
        setPriceRange,
        setMinRating,
        setInStock,
        setIsNew,
        setIsFeatured,
        setIsOnSale,
        setSort,
        setCurrentPage,
        resetFilters,
        clearSearch,
        loadMoreProducts,
        searchProducts
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

// Custom hook to use search context
export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
