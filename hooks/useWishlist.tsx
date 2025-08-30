"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase, WishlistItem } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { Product } from '@/lib/productSearch'

interface WishlistContextType {
  items: WishlistItem[]
  loading: boolean
  addToWishlist: (productId: string) => Promise<{ error: Error | null }>
  removeFromWishlist: (productId: string) => Promise<{ error: Error | null }>
  isInWishlist: (productId: string) => boolean
  getWishlistProducts: () => Product[]
  clearWishlist: () => Promise<{ error: Error | null }>
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadWishlist()
    } else {
      setItems([])
    }
  }, [user])

  const loadWishlist = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error loading wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (productId: string) => {
    if (!user) return { error: new Error('No user logged in') }

    try {
      // Check if already in wishlist
      const existingItem = items.find(item => item.product_id === productId)
      if (existingItem) {
        return { error: new Error('Product already in wishlist') }
      }

      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          user_id: user.id,
          product_id: productId
        })

      if (error) throw error

      await loadWishlist()
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error : new Error(String(error)) }
    }
  }

  const removeFromWishlist = async (productId: string) => {
    if (!user) return { error: new Error('No user logged in') }

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)

      if (error) throw error

      await loadWishlist()
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error : new Error(String(error)) }
    }
  }

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId)
  }

  const getWishlistProducts = () => {
    // This would need to be implemented with actual product data
    // For now, return empty array
    return []
  }

  const clearWishlist = async () => {
    if (!user) return { error: new Error('No user logged in') }

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      setItems([])
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error : new Error(String(error)) }
    }
  }

  const value: WishlistContextType = {
    items,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistProducts,
    clearWishlist
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
