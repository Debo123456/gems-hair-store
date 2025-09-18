import { supabase, supabaseServiceRole } from './supabase'

export interface AdminProduct {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  image_url: string
  category: string
  rating: number
  review_count: number
  stock_quantity: number
  in_stock: boolean
  is_new: boolean
  is_featured: boolean
  is_on_sale: boolean
  features: string[]
  ingredients?: string
  sizes: string[]
  how_to_use?: string
  shipping_info?: string
  return_policy?: string
  created_at: string
  updated_at: string
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  original_price?: number
  image_url: string
  category: string
  stock_quantity: number
  in_stock: boolean
  is_new: boolean
  is_featured: boolean
  is_on_sale: boolean
  features: string[]
  ingredients?: string
  sizes: string[]
  how_to_use?: string
  shipping_info?: string
  return_policy?: string
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string
}

export class AdminProductService {
  /**
   * Get all products with pagination and filtering
   */
  static async getProducts(options: {
    page?: number
    limit?: number
    search?: string
    category?: string
    inStock?: boolean
    sortBy?: 'name' | 'price' | 'created_at' | 'updated_at'
    sortOrder?: 'asc' | 'desc'
  } = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      inStock,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (inStock !== undefined) {
      query = query.eq('in_stock', inStock)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`)
    }

    return {
      products: data as AdminProduct[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  }

  /**
   * Get a single product by ID
   */
  static async getProduct(id: string): Promise<AdminProduct> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch product: ${error.message}`)
    }

    return data as AdminProduct
  }

  /**
   * Create a new product
   */
  static async createProduct(productData: CreateProductData): Promise<AdminProduct> {
    const { data, error } = await supabaseServiceRole
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`)
    }

    return data as AdminProduct
  }

  /**
   * Update an existing product
   */
  static async updateProduct(productData: UpdateProductData): Promise<AdminProduct> {
    const { id, ...updateData } = productData

    const { data, error } = await supabaseServiceRole
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`)
    }

    return data as AdminProduct
  }

  /**
   * Delete a product
   */
  static async deleteProduct(id: string): Promise<void> {
    const { error } = await supabaseServiceRole
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`)
    }
  }

  /**
   * Delete multiple products
   */
  static async deleteProducts(ids: string[]): Promise<void> {
    console.log("AdminProductService: deleteProducts called with IDs:", ids)
    
    try {
      const { error } = await supabaseServiceRole
        .from('products')
        .delete()
        .in('id', ids)

      console.log("AdminProductService: Supabase delete response - error:", error)

      if (error) {
        console.error("AdminProductService: Delete failed with error:", error)
        throw new Error(`Failed to delete products: ${error.message}`)
      }
      
      console.log("AdminProductService: Products deleted successfully")
    } catch (err) {
      console.error("AdminProductService: Exception caught in deleteProducts:", err)
      console.error("AdminProductService: Error details:", {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        name: err instanceof Error ? err.name : 'UnknownError'
      })
      throw err
    }
  }

  /**
   * Get product categories
   */
  static async getCategories() {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`)
    }

    return data
  }

  /**
   * Get product statistics
   */
  static async getProductStats() {
    const [
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      lowStockProducts,
      newProducts,
      featuredProducts,
      saleProducts
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', true),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', false),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', true).lt('stock_quantity', 10),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_new', true),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_on_sale', true)
    ])

    return {
      total: totalProducts.count || 0,
      inStock: inStockProducts.count || 0,
      outOfStock: outOfStockProducts.count || 0,
      lowStock: lowStockProducts.count || 0,
      new: newProducts.count || 0,
      featured: featuredProducts.count || 0,
      onSale: saleProducts.count || 0
    }
  }

  /**
   * Update product stock
   */
  static async updateStock(id: string, stockQuantity: number, inStock?: boolean): Promise<AdminProduct> {
    const updateData: { stock_quantity: number; in_stock: boolean } = { 
      stock_quantity: stockQuantity,
      in_stock: inStock !== undefined ? inStock : stockQuantity > 0
    }

    const { data, error } = await supabaseServiceRole
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update stock: ${error.message}`)
    }

    return data as AdminProduct
  }

  /**
   * Toggle product status flags
   */
  static async toggleProductFlag(id: string, flag: 'is_new' | 'is_featured' | 'is_on_sale'): Promise<AdminProduct> {
    // First get the current value
    const { data: currentData, error: fetchError } = await supabaseServiceRole
      .from('products')
      .select(flag)
      .eq('id', id)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch product: ${fetchError.message}`)
    }

    // Toggle the flag
    const newValue = !(currentData as Record<string, boolean>)[flag]

    const { data, error } = await supabaseServiceRole
      .from('products')
      .update({ [flag]: newValue })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to toggle ${flag}: ${error.message}`)
    }

    return data as AdminProduct
  }
}
