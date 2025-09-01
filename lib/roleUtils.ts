/**
 * Role-based access control utilities
 */

export type UserRole = 'customer' | 'admin'

export interface RoleCheckResult {
  hasAccess: boolean
  requiredRole: UserRole
  userRole: UserRole | null
}

/**
 * Check if a user has the required role
 */
export const hasRole = (userRole: UserRole | null, requiredRole: UserRole): boolean => {
  if (!userRole) return false
  
  // Admin has access to everything
  if (userRole === 'admin') return true
  
  // Customer only has access to customer-level features
  return userRole === requiredRole
}

/**
 * Check if user is admin
 */
export const isAdmin = (userRole: UserRole | null): boolean => {
  return userRole === 'admin'
}

/**
 * Check if user is customer
 */
export const isCustomer = (userRole: UserRole | null): boolean => {
  return userRole === 'customer'
}

/**
 * Get role hierarchy level (higher number = more permissions)
 */
export const getRoleLevel = (role: UserRole | null): number => {
  switch (role) {
    case 'admin':
      return 2
    case 'customer':
      return 1
    default:
      return 0
  }
}

/**
 * Check if user role meets minimum required level
 */
export const meetsRoleLevel = (userRole: UserRole | null, minimumLevel: number): boolean => {
  return getRoleLevel(userRole) >= minimumLevel
}
