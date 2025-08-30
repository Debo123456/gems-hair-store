import { supabase } from './supabase'
import { CartItem } from './supabase'

export class CartService {
  // Get user's cart items
  static async getUserCart(userId: string): Promise<CartItem[]> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching cart:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error in getUserCart:', error)
      return []
    }
  }

  // Add item to cart
  static async addToCart(userId: string, item: Omit<CartItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<CartItem | null> {
    try {
      // Check if item already exists with same product_id and size
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', item.product_id)
        .eq('size', item.size)
        .single()

      if (existingItem) {
        // Update quantity if item exists
        const { data, error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItem.quantity + item.quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id)
          .select()
          .single()

        if (error) {
          console.error('Error updating cart item:', error)
          throw error
        }

        return data
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            size: item.size
          })
          .select()
          .single()

        if (error) {
          console.error('Error adding to cart:', error)
          throw error
        }

        return data
      }
    } catch (error) {
      console.error('Error in addToCart:', error)
      return null
    }
  }

  // Update cart item quantity
  static async updateCartItemQuantity(cartItemId: string, quantity: number): Promise<CartItem | null> {
    try {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return await this.removeFromCart(cartItemId)
      }

      const { data, error } = await supabase
        .from('cart_items')
        .update({ 
          quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', cartItemId)
        .select()
        .single()

      if (error) {
        console.error('Error updating cart item quantity:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error in updateCartItemQuantity:', error)
      return null
    }
  }

  // Remove item from cart
  static async removeFromCart(cartItemId: string): Promise<CartItem | null> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .select()
        .single()

      if (error) {
        console.error('Error removing from cart:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error in removeFromCart:', error)
      return null
    }
  }

  // Clear user's entire cart
  static async clearUserCart(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)

      if (error) {
        console.error('Error clearing cart:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Error in clearUserCart:', error)
      return false
    }
  }

  // Get cart item count for user
  static async getCartItemCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (error) {
        console.error('Error getting cart count:', error)
        throw error
      }

      return count || 0
    } catch (error) {
      console.error('Error in getCartItemCount:', error)
      return 0
    }
  }

  // Get cart total for user
  static async getCartTotal(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('price, quantity')
        .eq('user_id', userId)

      if (error) {
        console.error('Error getting cart total:', error)
        throw error
      }

      return data?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0
    } catch (error) {
      console.error('Error in getCartTotal:', error)
      return 0
    }
  }

  // Sync local cart with Supabase (for guest users who sign in)
  static async syncLocalCart(userId: string, localCartItems: Array<{
    id: string
    name: string
    price: number
    image: string
    quantity: number
    size: string
  }>): Promise<boolean> {
    try {
      if (localCartItems.length === 0) return true

      // Clear existing cart first
      await this.clearUserCart(userId)

      // Add all local items
      for (const item of localCartItems) {
        await this.addToCart(userId, {
          product_id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          size: item.size
        })
      }

      return true
    } catch (error) {
      console.error('Error in syncLocalCart:', error)
      return false
    }
  }
}
