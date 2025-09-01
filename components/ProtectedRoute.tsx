"use client"

import { useAuth } from "@/hooks/useAuth"
import { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'admin' | 'customer' | null
  fallback?: ReactNode
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole = 'customer',
  fallback = null 
}: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth()

  // Show nothing while loading
  if (loading) {
    return null
  }

  // If no user is logged in, show fallback
  if (!user) {
    return <>{fallback}</>
  }

  // If role is required and user doesn't have it, show fallback
  if (requiredRole !== null && requiredRole && role !== requiredRole) {
    return <>{fallback}</>
  }

  // User has required role (or no role required), show children
  return <>{children}</>
}

// Convenience components for common use cases
export const AdminOnly = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
  <ProtectedRoute requiredRole="admin" fallback={fallback}>
    {children}
  </ProtectedRoute>
)

export const CustomerOnly = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
  <ProtectedRoute requiredRole="customer" fallback={fallback}>
    {children}
  </ProtectedRoute>
)

export const AuthenticatedOnly = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
  <ProtectedRoute requiredRole={null} fallback={fallback}>
    {children}
  </ProtectedRoute>
)