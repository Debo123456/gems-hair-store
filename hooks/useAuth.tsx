"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { UserProfile, UserAddress } from "@/lib/supabase"

interface AuthState {
  user: any | null
  profile: UserProfile | null
  addresses: UserAddress[]
  loading: boolean
}

interface AuthContextType {
  user: any | null
  profile: UserProfile | null
  addresses: UserAddress[]
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>
  addAddress: (address: Omit<UserAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; error?: string }>
  updateAddress: (id: string, updates: Partial<UserAddress>) => Promise<{ success: boolean; error?: string }>
  deleteAddress: (id: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    addresses: [],
    loading: true
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setState(prev => ({ ...prev, user: session.user }))
        await loadUserProfile(session.user.id)
        await loadUserAddresses(session.user.id)
      }
      setState(prev => ({ ...prev, loading: false }))
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setState(prev => ({ ...prev, user: session.user }))
          await loadUserProfile(session.user.id)
          await loadUserAddresses(session.user.id)
          // Note: Cart syncing will be handled by the CartProvider
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            profile: null,
            addresses: [],
            loading: false
          })
        }
        setState(prev => ({ ...prev, loading: false }))
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error loading user profile:', error)
        return
      }

      setState(prev => ({ ...prev, profile: data }))
    } catch (error) {
      console.error('Error loading user profile:', error)
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
        console.error('Error loading user addresses:', error)
        return
      }

      setState(prev => ({ ...prev, addresses: data || [] }))
    } catch (error) {
      console.error('Error loading user addresses:', error)
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
            user_id: data.user.id,
            full_name: fullName
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
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
      console.error('Error signing out:', error)
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
        .eq('user_id', state.user.id)

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

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        signOut,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress
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
