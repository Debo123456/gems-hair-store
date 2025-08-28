"use client"

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react"
import { useAuth } from "./useAuth"
import { CartService } from "@/lib/cartService"
import { CartItem as SupabaseCartItem } from "@/lib/supabase"
import { supabase } from "@/lib/supabase"

// Types
export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
  isSyncing: boolean
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SYNCING'; payload: boolean }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SYNC_CART'; payload: CartItem[] }

// Initial state
const initialState: CartState = {
  items: [],
  isOpen: false,
  isLoading: false,
  isSyncing: false
}

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_SYNCING':
      return { ...state, isSyncing: action.payload }
    
    case 'SET_ITEMS':
      return { ...state, items: action.payload }
    
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && item.size === action.payload.size
      )

      if (existingItemIndex > -1) {
        // Update existing item quantity
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += action.payload.quantity
        return { ...state, items: updatedItems }
      } else {
        // Add new item
        return { ...state, items: [...state.items, action.payload] }
      }
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }
    }

    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        )
      }
    }

    case 'CLEAR_CART':
      return { ...state, items: [] }
    
    case 'SYNC_CART':
      return { ...state, items: action.payload }

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    
    default:
      return state
  }
}

// Cart context
const CartContext = createContext<{
  state: CartState
  addToCart: (item: CartItem) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  toggleCart: () => void
  closeCart: () => void
  getCartTotal: () => number
  getCartItemCount: () => number
  syncWithSupabase: () => Promise<void>
} | null>(null)

// Cart provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { user } = useAuth()

  // Load cart from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      loadCartFromSupabase()
    } else {
      // Load from localStorage for guest users
      loadCartFromLocalStorage()
    }
  }, [user])

  // Listen for auth state changes to sync cart when user signs in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // User just signed in, sync local cart with Supabase
          await syncLocalCartWithSupabase(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          // User signed out, clear cart and load from localStorage
          dispatch({ type: 'CLEAR_CART' })
          loadCartFromLocalStorage()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Load cart from Supabase
  const loadCartFromSupabase = async () => {
    if (!user) return

    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const cartItems = await CartService.getUserCart(user.id)
      const formattedItems: CartItem[] = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image || '',
        quantity: item.quantity,
        size: item.size
      }))
      
      dispatch({ type: 'SET_ITEMS', payload: formattedItems })
    } catch (error) {
      console.error('Failed to load cart from Supabase:', error)
      // Fallback to localStorage if Supabase fails
      loadCartFromLocalStorage()
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Load cart from localStorage
  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (parsedCart.items && Array.isArray(parsedCart.items)) {
          dispatch({ type: 'SET_ITEMS', payload: parsedCart.items })
        }
      }
    } catch (error) {
      console.error('Failed to parse saved cart:', error)
    }
  }

  // Save cart to localStorage (for guest users)
  const saveCartToLocalStorage = (items: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify({ items }))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }

  // Sync local cart with Supabase when user signs in
  const syncLocalCartWithSupabase = async (userId: string) => {
    const localItems = state.items
    if (localItems.length === 0) return

    dispatch({ type: 'SET_SYNCING', payload: true })
    try {
      await CartService.syncLocalCart(userId, localItems)
      // Reload cart from Supabase after sync
      await loadCartFromSupabase()
    } catch (error) {
      console.error('Failed to sync cart with Supabase:', error)
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false })
    }
  }

  // Sync local cart with Supabase (manual sync)
  const syncWithSupabase = async () => {
    if (!user || state.isSyncing) return

    dispatch({ type: 'SET_SYNCING', payload: true })
    try {
      const localItems = state.items
      if (localItems.length > 0) {
        await CartService.syncLocalCart(user.id, localItems)
        // Reload cart from Supabase after sync
        await loadCartFromSupabase()
      }
    } catch (error) {
      console.error('Failed to sync cart with Supabase:', error)
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false })
    }
  }

  // Add item to cart
  const addToCart = async (item: CartItem) => {
    if (user) {
      // Add to Supabase
      try {
        await CartService.addToCart(user.id, {
          product_id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          size: item.size
        })
        // Reload cart from Supabase
        await loadCartFromSupabase()
      } catch (error) {
        console.error('Failed to add item to Supabase cart:', error)
        // Fallback to local state
        dispatch({ type: 'ADD_ITEM', payload: item })
      }
    } else {
      // Add to local state for guest users
      dispatch({ type: 'ADD_ITEM', payload: item })
      saveCartToLocalStorage([...state.items, item])
    }
  }

  // Remove item from cart
  const removeFromCart = async (id: string) => {
    if (user) {
      // Remove from Supabase
      try {
        await CartService.removeFromCart(id)
        // Reload cart from Supabase
        await loadCartFromSupabase()
      } catch (error) {
        console.error('Failed to remove item from Supabase cart:', error)
        // Fallback to local state
        dispatch({ type: 'REMOVE_ITEM', payload: id })
      }
    } else {
      // Remove from local state for guest users
      const updatedItems = state.items.filter(item => item.id !== id)
      dispatch({ type: 'REMOVE_ITEM', payload: id })
      saveCartToLocalStorage(updatedItems)
    }
  }

  // Update item quantity
  const updateQuantity = async (id: string, quantity: number) => {
    if (user) {
      // Update in Supabase
      try {
        await CartService.updateCartItemQuantity(id, quantity)
        // Reload cart from Supabase
        await loadCartFromSupabase()
      } catch (error) {
        console.error('Failed to update item quantity in Supabase cart:', error)
        // Fallback to local state
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
      }
    } else {
      // Update local state for guest users
      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
      saveCartToLocalStorage(updatedItems)
    }
  }

  // Clear cart
  const clearCart = async () => {
    if (user) {
      // Clear from Supabase
      try {
        await CartService.clearUserCart(user.id)
        dispatch({ type: 'CLEAR_CART' })
      } catch (error) {
        console.error('Failed to clear Supabase cart:', error)
        // Fallback to local state
        dispatch({ type: 'CLEAR_CART' })
      }
    } else {
      // Clear local state for guest users
      dispatch({ type: 'CLEAR_CART' })
      saveCartToLocalStorage([])
    }
  }

  // Toggle cart visibility
  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  // Close cart
  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  // Calculate cart total
  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // Get cart item count
  const getCartItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }

  // Save to localStorage whenever items change (for guest users)
  useEffect(() => {
    if (!user && state.items.length > 0) {
      saveCartToLocalStorage(state.items)
    }
  }, [state.items, user])

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        closeCart,
        getCartTotal,
        getCartItemCount,
        syncWithSupabase
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
