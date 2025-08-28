import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types
export interface UserProfile {
  id: string
  user_id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  date_of_birth: string | null
  role: string
  created_at: string
  updated_at: string
}

export interface UserAddress {
  id: string
  user_id: string
  type: 'shipping' | 'billing'
  first_name: string
  last_name: string
  company: string | null
  address_line_1: string
  address_line_2: string | null
  city: string
  state: string
  postal_code: string
  country: string
  phone: string | null
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  name: string
  price: number
  image: string | null
  quantity: number
  size: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  original_price: number | null
  image_url: string | null
  category: string
  rating: number
  review_count: number
  stock_quantity: number
  in_stock: boolean
  is_new: boolean
  is_featured: boolean
  is_on_sale: boolean
  features: string[] | null
  ingredients: string | null
  sizes: string[] | null
  how_to_use: string | null
  shipping_info: string | null
  return_policy: string | null
  created_at: string
  updated_at: string
}

export interface ProductCategory {
  id: string
  name: string
  description: string | null
  slug: string
  parent_id: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  shipping_address_id: string
  billing_address_id: string
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed'
  shipping_method: string
  tracking_number: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  name: string
  price: number
  quantity: number
  size: string
  created_at: string
}
