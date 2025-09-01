import { supabase } from './supabase'

export interface SampleProduct {
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
}

export class DatabaseSetup {
  /**
   * Check if the database has products
   */
  static async hasProducts(): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.error('Error checking products:', error)
        return false
      }

      return (count || 0) > 0
    } catch (error) {
      console.error('Error in hasProducts:', error)
      return false
    }
  }

  /**
   * Check if the database has categories
   */
  static async hasCategories(): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('product_categories')
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.error('Error checking categories:', error)
        return false
      }

      return (count || 0) > 0
    } catch (error) {
      console.error('Error in hasCategories:', error)
      return false
    }
  }

  /**
   * Insert sample categories
   */
  static async insertSampleCategories(): Promise<boolean> {
    try {
      const categories = [
        { name: 'Hair Care', description: 'Essential hair care products for daily use', slug: 'hair-care', sort_order: 1 },
        { name: 'Treatment', description: 'Deep conditioning and repair treatments', slug: 'treatment', sort_order: 2 },
        { name: 'Styling', description: 'Products for styling and finishing', slug: 'styling', sort_order: 3 },
        { name: 'Tools', description: 'Hair styling tools and accessories', slug: 'tools', sort_order: 4 },
        { name: 'Accessories', description: 'Hair accessories and extras', slug: 'accessories', sort_order: 5 }
      ]

      const { error } = await supabase
        .from('product_categories')
        .insert(categories)

      if (error) {
        console.error('Error inserting categories:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in insertSampleCategories:', error)
      return false
    }
  }

  /**
   * Insert sample products
   */
  static async insertSampleProducts(): Promise<boolean> {
    try {
      const sampleProducts: SampleProduct[] = [
        {
          name: 'Premium Hair Oil',
          description: 'Nourishing hair oil for all hair types. This premium blend contains natural ingredients like argan oil, coconut oil, and vitamin E to deeply moisturize and strengthen your hair. Perfect for daily use to maintain healthy, shiny locks.',
          price: 29.99,
          original_price: 39.99,
          image_url: '/images/products/argan-shampoo.svg',
          category: 'Hair Care',
          rating: 4.8,
          review_count: 124,
          stock_quantity: 50,
          in_stock: true,
          is_new: true,
          is_featured: true,
          is_on_sale: true,
          features: ['Natural ingredients', 'Suitable for all hair types', 'Deep moisturizing', 'No harmful chemicals', 'Long-lasting results'],
          ingredients: 'Argan Oil, Coconut Oil, Vitamin E, Jojoba Oil, Rosemary Extract',
          sizes: ['100ml', '200ml', '500ml'],
          how_to_use: 'Apply 2-3 drops to damp hair, focusing on ends. Can be used daily for best results.',
          shipping_info: 'Free shipping on orders over $50',
          return_policy: '30-day money-back guarantee'
        },
        {
          name: 'Silk Hair Mask',
          description: 'Deep conditioning treatment for damaged hair. This intensive mask repairs split ends, reduces frizz, and restores hair\'s natural shine. Formulated with silk proteins and natural oils for maximum hydration.',
          price: 24.99,
          original_price: 29.99,
          image_url: '/images/products/hair-mask.svg',
          category: 'Treatment',
          rating: 4.9,
          review_count: 89,
          stock_quantity: 75,
          in_stock: true,
          is_new: false,
          is_featured: true,
          is_on_sale: true,
          features: ['Deep conditioning', 'Repairs split ends', 'Reduces frizz', 'Silk protein formula', 'Weekly treatment'],
          ingredients: 'Silk Protein, Argan Oil, Shea Butter, Aloe Vera, Vitamin B5',
          sizes: ['200ml', '400ml'],
          how_to_use: 'Apply to clean, damp hair. Leave on for 10-15 minutes, then rinse thoroughly. Use once or twice weekly.',
          shipping_info: 'Free shipping on orders over $50',
          return_policy: '30-day money-back guarantee'
        },
        {
          name: 'Volume Boosting Shampoo',
          description: 'Sulfate-free shampoo that adds volume and body to fine, limp hair. Enriched with biotin and keratin to strengthen hair while providing long-lasting volume.',
          price: 19.99,
          image_url: '/images/products/argan-shampoo.svg',
          category: 'Hair Care',
          rating: 4.6,
          review_count: 203,
          stock_quantity: 100,
          in_stock: true,
          is_new: false,
          is_featured: false,
          is_on_sale: false,
          features: ['Sulfate-free', 'Volume boosting', 'Biotin enriched', 'Keratin fortified', 'Gentle cleansing'],
          ingredients: 'Water, Cocamidopropyl Betaine, Sodium Lauroyl Methyl Isethionate, Biotin, Keratin',
          sizes: ['250ml', '500ml', '1L'],
          how_to_use: 'Wet hair thoroughly, apply shampoo, massage into scalp, rinse completely. Follow with conditioner.',
          shipping_info: 'Free shipping on orders over $50',
          return_policy: '30-day money-back guarantee'
        },
        {
          name: 'Heat Protection Spray',
          description: 'Advanced heat protection spray that shields hair from damage caused by styling tools up to 450°F. Contains natural oils and vitamins to nourish while protecting.',
          price: 22.99,
          image_url: '/images/products/anti-frizz-serum.svg',
          category: 'Styling',
          rating: 4.7,
          review_count: 156,
          stock_quantity: 60,
          in_stock: true,
          is_new: true,
          is_featured: false,
          is_on_sale: false,
          features: ['Heat protection up to 450°F', 'Lightweight formula', 'No residue', 'Nourishing ingredients', 'Suitable for all hair types'],
          ingredients: 'Water, Cyclopentasiloxane, Dimethicone, Argan Oil, Vitamin E',
          sizes: ['150ml', '300ml'],
          how_to_use: 'Spray evenly on damp or dry hair before using heat styling tools. Do not rinse out.',
          shipping_info: 'Free shipping on orders over $50',
          return_policy: '30-day money-back guarantee'
        },
        {
          name: 'Detangling Brush',
          description: 'Gentle detangling brush with flexible bristles that glide through hair without causing breakage. Perfect for wet or dry hair, reduces frizz and static.',
          price: 34.99,
          original_price: 39.99,
          image_url: '/images/products/styling-gel.svg',
          category: 'Tools',
          rating: 4.8,
          review_count: 92,
          stock_quantity: 30,
          in_stock: true,
          is_new: false,
          is_featured: false,
          is_on_sale: false,
          features: ['Gentle detangling', 'Flexible bristles', 'Reduces breakage', 'Anti-static', 'Wet/dry use'],
          ingredients: 'Nylon bristles, Wooden handle, Anti-static coating',
          sizes: ['Standard'],
          how_to_use: 'Start from the ends and work your way up to the roots. Use gentle strokes to avoid breakage.',
          shipping_info: 'Free shipping on orders over $50',
          return_policy: '30-day money-back guarantee'
        }
      ]

      const { error } = await supabase
        .from('products')
        .insert(sampleProducts)

      if (error) {
        console.error('Error inserting products:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in insertSampleProducts:', error)
      return false
    }
  }

  /**
   * Initialize database with sample data
   */
  static async initializeDatabase(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Initializing database...')

      // Check if categories exist
      const hasCategories = await this.hasCategories()
      if (!hasCategories) {
        console.log('Inserting sample categories...')
        const categoriesSuccess = await this.insertSampleCategories()
        if (!categoriesSuccess) {
          return { success: false, message: 'Failed to insert categories' }
        }
      }

      // Check if products exist
      const hasProducts = await this.hasProducts()
      if (!hasProducts) {
        console.log('Inserting sample products...')
        const productsSuccess = await this.insertSampleProducts()
        if (!productsSuccess) {
          return { success: false, message: 'Failed to insert products' }
        }
      }

      return { success: true, message: 'Database initialized successfully' }
    } catch (error) {
      console.error('Error initializing database:', error)
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get database status
   */
  static async getDatabaseStatus(): Promise<{
    hasProducts: boolean
    hasCategories: boolean
    productCount: number
    categoryCount: number
  }> {
    try {
      const [hasProducts, hasCategories] = await Promise.all([
        this.hasProducts(),
        this.hasCategories()
      ])

      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      const { count: categoryCount } = await supabase
        .from('product_categories')
        .select('*', { count: 'exact', head: true })

      return {
        hasProducts,
        hasCategories,
        productCount: productCount || 0,
        categoryCount: categoryCount || 0
      }
    } catch (error) {
      console.error('Error getting database status:', error)
      return {
        hasProducts: false,
        hasCategories: false,
        productCount: 0,
        categoryCount: 0
      }
    }
  }
}
