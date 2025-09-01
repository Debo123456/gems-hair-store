"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { UserProfile, UserAddress } from "@/lib/supabase"
import { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  profile: UserProfile | null
  addresses: UserAddress[]
  role: 'customer' | 'admin' | null
  loading: boolean
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  addresses: UserAddress[]
  role: 'customer' | 'admin' | null
  loading: boolean
  isAdmin: boolean
  isCustomer: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>
  addAddress: (address: Omit<UserAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; error?: string }>
  updateAddress: (id: string, updates: Partial<UserAddress>) => Promise<{ success: boolean; error?: string }>
  deleteAddress: (id: string) => Promise<{ success: boolean; error?: string }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    addresses: [],
    role: null,
    loading: true
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setState(prev => ({ ...prev, user: session.user }))
          // Load profile and addresses in parallel, but don't fail if they error
          await Promise.allSettled([
            loadUserProfile(session.user.id),
            loadUserAddresses(session.user.id)
          ])
        }
      } catch (error) {
        console.warn('Error getting initial session:', error)
      } finally {
        setState(prev => ({ ...prev, loading: false }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            setState(prev => ({ ...prev, user: session.user }))
            // Load profile and addresses in parallel, but don't fail if they error
            await Promise.allSettled([
              loadUserProfile(session.user.id),
              loadUserAddresses(session.user.id)
            ])
            // Note: Cart syncing will be handled by the CartProvider
          } else if (event === 'SIGNED_OUT') {
            setState({
              user: null,
              profile: null,
              addresses: [],
              role: null,
              loading: false
            })
          }
        } catch (error) {
          console.warn('Error handling auth state change:', error)
        } finally {
          setState(prev => ({ ...prev, loading: false }))
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading user profile for userId:', userId)
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        
        // Handle case where user profile doesn't exist yet
        if (error.code === 'PGRST116') {
          // No rows returned - user profile doesn't exist yet
          console.log('User profile not found, will be created on first update')
          // Try to create a basic profile
          await createBasicUserProfile(userId)
          return
        }
        
        // Handle other common errors
        if (error.code === 'PGRST301') {
          console.error('Table "user_profiles" does not exist or no permission to access it')
          // Set a default role for now
          setState(prev => ({ 
            ...prev, 
            profile: null,
            role: 'customer' // Default to customer if table doesn't exist
          }))
          return
        }
        
        // Log other errors but don't break the flow
        console.warn('Error loading user profile:', error.message || error)
        return
      }

      console.log('User profile loaded successfully:', data)
      setState(prev => ({ 
        ...prev, 
        profile: data,
        role: data.role || 'customer' // Default to customer if role is not set
      }))
    } catch (error) {
      console.warn('Unexpected error loading user profile:', error)
    }
  }

  const createBasicUserProfile = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || 'User',
            role: 'customer' // Default new users to customer role
          })

        if (error) {
          console.warn('Failed to create basic user profile:', error.message || error)
        } else {
          console.log('Basic user profile created successfully')
          // Reload the profile
          await loadUserProfile(userId)
        }
      }
    } catch (error) {
      console.warn('Error creating basic user profile:', error)
    }
  }

  const loadUserAddresses = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true })

      if (error) {
        // Handle case where table might not exist or other errors
        console.warn('Error loading user addresses:', error.message || error)
        // Set empty array as fallback
        setState(prev => ({ ...prev, addresses: [] }))
        return
      }

      setState(prev => ({ ...prev, addresses: data || [] }))
    } catch (error) {
      console.warn('Unexpected error loading user addresses:', error)
      // Set empty array as fallback
      setState(prev => ({ ...prev, addresses: [] }))
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            role: 'customer' // Default new users to customer role
          })

        if (profileError) {
          console.warn('Error creating user profile during signup:', profileError.message || profileError)
          // Don't fail the signup if profile creation fails
          // The profile will be created later when the user first logs in
        }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.warn('Error signing out:', error)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!state.user) {
        return { success: false, error: 'No user logged in' }
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', state.user.id)

      if (error) {
        return { success: false, error: error.message }
      }

      // Reload profile
      await loadUserProfile(state.user.id)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const addAddress = async (address: Omit<UserAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!state.user) {
        return { success: false, error: 'No user logged in' }
      }

      const { error } = await supabase
        .from('user_addresses')
        .insert({
          ...address,
          user_id: state.user.id
        })

      if (error) {
        return { success: false, error: error.message }
      }

      // Reload addresses
      await loadUserAddresses(state.user.id)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const updateAddress = async (id: string, updates: Partial<UserAddress>) => {
    try {
      if (!state.user) {
        return { success: false, error: 'No user logged in' }
      }

      const { error } = await supabase
        .from('user_addresses')
        .update(updates)
        .eq('id', id)
        .eq('user_id', state.user.id)

      if (error) {
        return { success: false, error: error.message }
      }

      // Reload addresses
      await loadUserAddresses(state.user.id)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const deleteAddress = async (id: string) => {
    try {
      if (!state.user) {
        return { success: false, error: 'No user logged in' }
      }

      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', state.user.id)

      if (error) {
        return { success: false, error: error.message }
      }

      // Reload addresses
      await loadUserAddresses(state.user.id)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const refreshProfile = async () => {
    if (state.user) {
      await loadUserProfile(state.user.id)
    }
  }

  // Computed values for easier role checking
  const isAdmin = state.role === 'admin'
  const isCustomer = state.role === 'customer'

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isAdmin,
        isCustomer,
        signUp,
        signIn,
        signOut,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
