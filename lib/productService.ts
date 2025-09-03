import { supabase } from './supabase'
import { Product, ProductCategory } from './supabase'

export interface ProductFilters {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  inStock?: boolean
  isNew?: boolean
  isFeatured?: boolean
  isOnSale?: boolean
}

export interface ProductSort {
  field: 'name' | 'price' | 'rating' | 'created_at' | 'review_count'
  direction: 'asc' | 'desc'
}

export class ProductService {
  // Get all products with optional filtering and sorting
  static async getProducts(
    filters: ProductFilters = {},
    sort: ProductSort = { field: 'created_at', direction: 'desc' },
    page: number = 1,
    limit: number = 20
  ): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
    try {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })

      // Apply filters
      if (filters.query) {
        query = query.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`)
      }

      if (filters.category) {
        query = query.eq('category', filters.category)
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice)
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice)
      }

      if (filters.minRating !== undefined) {
        query = query.gte('rating', filters.minRating)
      }

      if (filters.inStock !== undefined) {
        query = query.eq('in_stock', filters.inStock)
      }

      if (filters.isNew !== undefined) {
        query = query.eq('is_new', filters.isNew)
      }

      if (filters.isFeatured !== undefined) {
        query = query.eq('is_featured', filters.isFeatured)
      }

      if (filters.isOnSale !== undefined) {
        query = query.eq('is_on_sale', filters.isOnSale)
      }

      // Apply sorting
      query = query.order(sort.field, { ascending: sort.direction === 'asc' })

      // Apply pagination
      const offset = (page - 1) * limit
      query = query.range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) {
        console.error('Error fetching products:', error)
        throw error
      }

      const total = count || 0
      const hasMore = offset + limit < total

      return {
        products: data || [],
        total,
        hasMore
      }
    } catch (error) {
      console.error('Error in getProducts:', error)
      return { products: [], total: 0, hasMore: false }
    }
  }

  // Get a single product by ID
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error in getProductById:', error)
      return null
    }
  }

  // Get products by category
  static async getProductsByCategory(
    category: string,
    limit: number = 20
  ): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching products by category:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error in getProductsByCategory:', error)
      return []
    }
  }

  // Get featured products
  static async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching featured products:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error in getFeaturedProducts:', error)
      return []
    }
  }

  // Get new products
  static async getNewProducts(limit: number = 8): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_new', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching new products:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error in getNewProducts:', error)
      return []
    }
  }

  // Get sale products
  static async getSaleProducts(limit: number = 8): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_on_sale', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching sale products:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error in getSaleProducts:', error)
      return []
    }
  }

  // Get top rated products
  static async getTopRatedProducts(limit: number = 8): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .gte('rating', 4.0)
        .order('rating', { ascending: false })
        .order('review_count', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching top rated products:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error in getTopRatedProducts:', error)
      return []
    }
  }

  // Get related products (same category, excluding current product)
  static async getRelatedProducts(
    productId: string,
    category: string,
    limit: number = 4
  ): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('in_stock', true)
        .neq('id', productId)
        .order('rating', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching related products:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error in getRelatedProducts:', error)
      return []
    }
  }

  // Search products with autocomplete suggestions
  static async searchProducts(
    query: string,
    limit: number = 10
  ): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('in_stock', true)
        .order('rating', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error searching products:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error in searchProducts:', error)
      return []
    }
  }

  // Get search suggestions
  static async getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('name')
        .or(`name.ilike.%${query}%`)
        .eq('in_stock', true)
        .order('rating', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching search suggestions:', error)
        throw error
      }

      return data?.map(item => item.name) || []
    } catch (error) {
      console.error('Error in getSearchSuggestions:', error)
      return []
    }
  }

  // Get all categories
  static async getCategories(): Promise<ProductCategory[]> {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })

      if (error) {
        console.log('Error fetching categories:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getCategories:', error)
      return []
    }
  }

  // Get category by slug
  static async getCategoryBySlug(slug: string): Promise<ProductCategory | null> {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error fetching category:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getCategoryBySlug:', error)
      return null
    }
  }

  // Get product count by category
  static async getProductCountByCategory(category: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category', category)
        .eq('in_stock', true)

      if (error) {
        console.error('Error getting product count by category:', error)
        throw error
      }

      return count || 0
    } catch (error) {
      console.error('Error in getProductCountByCategory:', error)
      return 0
    }
  }

  // Get price range for filtering
  static async getPriceRange(): Promise<{ min: number; max: number }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('price')
        .eq('in_stock', true)

      if (error) {
        console.error('Error getting price range:', error)
        throw error
      }

      if (!data || data.length === 0) {
        return { min: 0, max: 0 }
      }

      const prices = data.map(item => item.price)
      return {
        min: Math.min(...prices),
        max: Math.max(...prices)
      }
    } catch (error) {
      console.error('Error in getPriceRange:', error)
      return { min: 0, max: 0 }
    }
  }

  // Update product stock quantity (for admin use)
  static async updateProductStock(
    productId: string,
    newQuantity: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          stock_quantity: newQuantity,
          in_stock: newQuantity > 0
        })
        .eq('id', productId)

      if (error) {
        console.error('Error updating product stock:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Error in updateProductStock:', error)
      return false
    }
  }

  // Get products that need restocking (for admin use)
  static async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .lte('stock_quantity', threshold)
        .order('stock_quantity', { ascending: true })

      if (error) {
        console.error('Error fetching low stock products:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error in getLowStockProducts:', error)
      return []
    }
  }
}
