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

      // Setup orders table first
      const hasOrdersTable = await this.hasOrdersTable()
      if (!hasOrdersTable) {
        console.log('Setting up orders table...')
        const ordersSuccess = await this.setupOrdersTable()
        if (!ordersSuccess) {
          return { success: false, message: 'Failed to setup orders table' }
        }
      }

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
   * Check if the database has orders table
   */
  static async hasOrdersTable(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      // If we get an error, the table doesn't exist
      if (error) {
        return false
      }

      return true
    } catch (error) {
      console.error('Error checking orders table:', error)
      return false
    }
  }

  /**
   * Setup orders table and related functionality
   */
  static async setupOrdersTable(): Promise<boolean> {
    try {
      // Read the SQL from the orders setup file
      const ordersSetupSQL = `
        -- Create orders table
        CREATE TABLE IF NOT EXISTS orders (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          order_number VARCHAR(20) UNIQUE NOT NULL,
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
          total_amount DECIMAL(10,2) NOT NULL,
          subtotal DECIMAL(10,2) NOT NULL,
          tax_amount DECIMAL(10,2) DEFAULT 0,
          shipping_amount DECIMAL(10,2) DEFAULT 0,
          discount_amount DECIMAL(10,2) DEFAULT 0,
          currency VARCHAR(3) DEFAULT 'USD',
          
          -- Customer Information
          customer_email VARCHAR(255) NOT NULL,
          customer_name VARCHAR(255) NOT NULL,
          customer_phone VARCHAR(20),
          
          -- Shipping Address
          shipping_address JSONB NOT NULL,
          
          -- Billing Address (optional, defaults to shipping)
          billing_address JSONB,
          
          -- Payment Information
          payment_method VARCHAR(50),
          payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
          payment_id VARCHAR(255),
          
          -- Shipping Information
          shipping_method VARCHAR(100),
          tracking_number VARCHAR(100),
          estimated_delivery DATE,
          
          -- Order Notes
          notes TEXT,
          internal_notes TEXT,
          
          -- Timestamps
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          shipped_at TIMESTAMP WITH TIME ZONE,
          delivered_at TIMESTAMP WITH TIME ZONE
        );

        -- Create order_items table
        CREATE TABLE IF NOT EXISTS order_items (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
          product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
          product_name VARCHAR(255) NOT NULL,
          product_sku VARCHAR(100),
          product_image_url TEXT,
          quantity INTEGER NOT NULL CHECK (quantity > 0),
          unit_price DECIMAL(10,2) NOT NULL,
          total_price DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create order_status_history table for tracking status changes
        CREATE TABLE IF NOT EXISTS order_status_history (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
          status VARCHAR(20) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_by UUID REFERENCES auth.users(id)
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
        CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
        CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
        CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
        CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
        CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);

        -- Enable Row Level Security (RLS)
        ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
        ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
        ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies for orders
        CREATE POLICY IF NOT EXISTS "Users can view their own orders" ON orders
          FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY IF NOT EXISTS "Users can create their own orders" ON orders
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY IF NOT EXISTS "Users can update their own orders" ON orders
          FOR UPDATE USING (auth.uid() = user_id);

        -- Create RLS policies for order_items
        CREATE POLICY IF NOT EXISTS "Users can view their own order items" ON order_items
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM orders 
              WHERE orders.id = order_items.order_id 
              AND orders.user_id = auth.uid()
            )
          );

        CREATE POLICY IF NOT EXISTS "Users can create order items for their orders" ON order_items
          FOR INSERT WITH CHECK (
            EXISTS (
              SELECT 1 FROM orders 
              WHERE orders.id = order_items.order_id 
              AND orders.user_id = auth.uid()
            )
          );

        -- Create RLS policies for order_status_history
        CREATE POLICY IF NOT EXISTS "Users can view their own order status history" ON order_status_history
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM orders 
              WHERE orders.id = order_status_history.order_id 
              AND orders.user_id = auth.uid()
            )
          );

        -- Admin policies (for admin users)
        CREATE POLICY IF NOT EXISTS "Admins can view all orders" ON orders
          FOR ALL USING (
            EXISTS (
              SELECT 1 FROM user_profiles 
              WHERE user_profiles.id = auth.uid() 
              AND user_profiles.role = 'admin'
            )
          );

        CREATE POLICY IF NOT EXISTS "Admins can view all order items" ON order_items
          FOR ALL USING (
            EXISTS (
              SELECT 1 FROM user_profiles 
              WHERE user_profiles.id = auth.uid() 
              AND user_profiles.role = 'admin'
            )
          );

        CREATE POLICY IF NOT EXISTS "Admins can view all order status history" ON order_status_history
          FOR ALL USING (
            EXISTS (
              SELECT 1 FROM user_profiles 
              WHERE user_profiles.id = auth.uid() 
              AND user_profiles.role = 'admin'
            )
          );
      `

      // Execute the SQL
      const { error } = await supabase.rpc('exec_sql', { sql: ordersSetupSQL })
      
      if (error) {
        console.error('Error setting up orders table:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in setupOrdersTable:', error)
      return false
    }
  }

  /**
   * Get database status
   */
  static async getDatabaseStatus(): Promise<{
    hasProducts: boolean
    hasCategories: boolean
    hasOrdersTable: boolean
    productCount: number
    categoryCount: number
    orderCount: number
  }> {
    try {
      const [hasProducts, hasCategories, hasOrdersTable] = await Promise.all([
        this.hasProducts(),
        this.hasCategories(),
        this.hasOrdersTable()
      ])

      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      const { count: categoryCount } = await supabase
        .from('product_categories')
        .select('*', { count: 'exact', head: true })

      let orderCount = 0
      if (hasOrdersTable) {
        const { count } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
        orderCount = count || 0
      }

      return {
        hasProducts,
        hasCategories,
        hasOrdersTable,
        productCount: productCount || 0,
        categoryCount: categoryCount || 0,
        orderCount
      }
    } catch (error) {
      console.error('Error getting database status:', error)
      return {
        hasProducts: false,
        hasCategories: false,
        hasOrdersTable: false,
        productCount: 0,
        categoryCount: 0,
        orderCount: 0
      }
    }
  }
}
