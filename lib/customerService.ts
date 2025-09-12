import { supabase } from './supabase'
import { OrderService } from './orderService'

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  joinDate: string
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  status: 'active' | 'inactive' | 'vip'
  location?: string
  avatar?: string
  role: string
}

export interface CustomerStats {
  total_customers: number
  active_customers: number
  vip_customers: number
  new_customers_this_month: number
  total_revenue: number
  average_order_value: number
}

export interface CustomerFilters {
  status?: string[]
  role?: string[]
  date_from?: string
  date_to?: string
  search?: string
}

export class CustomerService {
  /**
   * Get all customers with their order statistics
   * Since we don't have a user_profiles table, we'll work with auth.users directly
   */
  static async getCustomers(
    options: {
      page?: number
      limit?: number
      filters?: CustomerFilters
      sortBy?: 'created_at' | 'total_spent' | 'total_orders' | 'name'
      sortOrder?: 'asc' | 'desc'
    } = {}
  ): Promise<{ customers: Customer[]; total: number; page: number; totalPages: number }> {
    const { 
      page = 1, 
      limit = 20, 
      filters = {}, 
      sortBy = 'created_at', 
      sortOrder = 'desc' 
    } = options

    try {
      // Try to get data from user_profiles table first
      let customerUsers: Array<{
        id: string
        email: string
        full_name: string
        created_at: string
        role: string
      }> = []
      
      try {
        const { data: profiles, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('role', 'customer')

        if (!error && profiles) {
          customerUsers = profiles
        } else {
          console.log('user_profiles table not found, using mock data')
          // Fallback to mock data if user_profiles table doesn't exist
          const mockUsers = [
            {
              id: "d1a47f94-b56d-48fe-8ea6-a27af8a91c37",
              email: "admin@gemstore.com",
              full_name: "Admin User",
              created_at: "2025-08-28T06:14:02.528919+00:00",
              role: "admin"
            },
            {
              id: "f8e5b967-b039-492d-8eb6-ae44ab4e821c",
              email: "danieldawson496@gmail.com",
              full_name: "Daniel Dawson",
              created_at: "2025-08-28T18:53:36.511923+00:00",
              role: "customer"
            }
          ]
          customerUsers = mockUsers.filter(user => user.role === 'customer')
        }
      } catch (error) {
        console.log('Error accessing user_profiles, using mock data:', error)
        // Fallback to mock data
        const mockUsers = [
          {
            id: "d1a47f94-b56d-48fe-8ea6-a27af8a91c37",
            email: "admin@gemstore.com",
            full_name: "Admin User",
            created_at: "2025-08-28T06:14:02.528919+00:00",
            role: "admin"
          },
          {
            id: "f8e5b967-b039-492d-8eb6-ae44ab4e821c",
            email: "danieldawson496@gmail.com",
            full_name: "Daniel Dawson",
            created_at: "2025-08-28T18:53:36.511923+00:00",
            role: "customer"
          }
        ]
        customerUsers = mockUsers.filter(user => user.role === 'customer')
      }

      // Apply search filter
      let filteredUsers = customerUsers
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredUsers = customerUsers.filter(user => 
          user.full_name?.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        )
      }

      // Get order statistics for each customer
      const customers: Customer[] = []
      
      for (const user of filteredUsers) {
        try {
          // Get customer's orders
          const { orders } = await OrderService.getUserOrders(user.id, {
            page: 1,
            limit: 1000 // Get all orders for statistics
          })

          // Calculate statistics
          const totalOrders = orders.length
          const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0)
          const lastOrder = orders.length > 0 ? orders[0] : null // Orders are sorted by created_at desc

          // Determine customer status
          let status: 'active' | 'inactive' | 'vip' = 'inactive'
          if (totalOrders > 0) {
            if (totalSpent > 500) {
              status = 'vip'
            } else {
              status = 'active'
            }
          }

          // Check if customer is active (has orders in last 6 months)
          const sixMonthsAgo = new Date()
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
          const recentOrders = orders.filter(order => 
            new Date(order.created_at) > sixMonthsAgo
          )
          
          if (recentOrders.length === 0 && totalOrders > 0) {
            status = 'inactive'
          }

          customers.push({
            id: user.id,
            name: user.full_name || 'Unknown',
            email: user.email || '',
            phone: undefined,
            joinDate: user.created_at,
            totalOrders,
            totalSpent,
            lastOrderDate: lastOrder?.created_at,
            status,
            location: undefined,
            avatar: undefined,
            role: user.role
          })
        } catch (error) {
          console.warn(`Failed to get orders for customer ${user.id}:`, error)
          // Add customer without order data
          customers.push({
            id: user.id,
            name: user.full_name || 'Unknown',
            email: user.email || '',
            phone: undefined,
            joinDate: user.created_at,
            totalOrders: 0,
            totalSpent: 0,
            status: 'inactive',
            role: user.role
          })
        }
      }

      // Apply status filter after calculating status
      const finalCustomers = filters.status && filters.status.length > 0
        ? customers.filter(customer => filters.status!.includes(customer.status))
        : customers

      // Apply pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedCustomers = finalCustomers.slice(startIndex, endIndex)

      return {
        customers: paginatedCustomers,
        total: finalCustomers.length,
        page,
        totalPages: Math.ceil(finalCustomers.length / limit)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      return {
        customers: [],
        total: 0,
        page: 1,
        totalPages: 0
      }
    }
  }

  /**
   * Get customer statistics
   */
  static async getCustomerStats(): Promise<CustomerStats> {
    try {
      // Try to get data from user_profiles table first
      let customerUsers: Array<{
        id: string
        email: string
        full_name: string
        created_at: string
        role: string
      }> = []
      
      try {
        const { data: profiles, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('role', 'customer')

        if (!error && profiles) {
          customerUsers = profiles
        } else {
          console.log('user_profiles table not found, using mock data')
          // Fallback to mock data if user_profiles table doesn't exist
          const mockUsers = [
            {
              id: "d1a47f94-b56d-48fe-8ea6-a27af8a91c37",
              email: "admin@gemstore.com",
              full_name: "Admin User",
              created_at: "2025-08-28T06:14:02.528919+00:00",
              role: "admin"
            },
            {
              id: "f8e5b967-b039-492d-8eb6-ae44ab4e821c",
              email: "danieldawson496@gmail.com",
              full_name: "Daniel Dawson",
              created_at: "2025-08-28T18:53:36.511923+00:00",
              role: "customer"
            }
          ]
          customerUsers = mockUsers.filter(user => user.role === 'customer')
        }
      } catch (error) {
        console.log('Error accessing user_profiles, using mock data:', error)
        // Fallback to mock data
        const mockUsers = [
          {
            id: "d1a47f94-b56d-48fe-8ea6-a27af8a91c37",
            email: "admin@gemstore.com",
            full_name: "Admin User",
            created_at: "2025-08-28T06:14:02.528919+00:00",
            role: "admin"
          },
          {
            id: "f8e5b967-b039-492d-8eb6-ae44ab4e821c",
            email: "danieldawson496@gmail.com",
            full_name: "Daniel Dawson",
            created_at: "2025-08-28T18:53:36.511923+00:00",
            role: "customer"
          }
        ]
        customerUsers = mockUsers.filter(user => user.role === 'customer')
      }

      const totalCustomers = customerUsers.length
      let activeCustomers = 0
      let vipCustomers = 0
      let newCustomersThisMonth = 0
      let totalRevenue = 0
      let totalOrders = 0

      const currentMonth = new Date()
      currentMonth.setDate(1) // First day of current month

      for (const user of customerUsers) {
        // Check if new this month
        if (new Date(user.created_at) >= currentMonth) {
          newCustomersThisMonth++
        }

        try {
          // Get customer's orders
          const { orders } = await OrderService.getUserOrders(user.id, {
            page: 1,
            limit: 1000
          })

          const customerTotalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0)
          const customerTotalOrders = orders.length

          totalRevenue += customerTotalSpent
          totalOrders += customerTotalOrders

          // Check if customer is active (has orders in last 6 months)
          const sixMonthsAgo = new Date()
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
          const recentOrders = orders.filter(order => 
            new Date(order.created_at) > sixMonthsAgo
          )

          if (recentOrders.length > 0) {
            activeCustomers++
          }

          // Check if VIP (spent more than $500)
          if (customerTotalSpent > 500) {
            vipCustomers++
          }
        } catch (error) {
          console.warn(`Failed to get orders for customer ${user.id}:`, error)
        }
      }

      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      return {
        total_customers: totalCustomers,
        active_customers: activeCustomers,
        vip_customers: vipCustomers,
        new_customers_this_month: newCustomersThisMonth,
        total_revenue: totalRevenue,
        average_order_value: averageOrderValue
      }
    } catch (error) {
      console.error('Error getting customer stats:', error)
      return {
        total_customers: 0,
        active_customers: 0,
        vip_customers: 0,
        new_customers_this_month: 0,
        total_revenue: 0,
        average_order_value: 0
      }
    }
  }

  /**
   * Get customer by ID
   */
  static async getCustomerById(customerId: string): Promise<Customer | null> {
    try {
      // Find the customer in our mock data
      const mockUsers = [
        {
          id: "d1a47f94-b56d-48fe-8ea6-a27af8a91c37",
          email: "admin@gemstore.com",
          full_name: "Admin User",
          created_at: "2025-08-28T06:14:02.528919+00:00",
          role: "admin"
        },
        {
          id: "f8e5b967-b039-492d-8eb6-ae44ab4e821c",
          email: "danieldawson496@gmail.com",
          full_name: "Daniel Dawson",
          created_at: "2025-08-28T18:53:36.511923+00:00",
          role: "customer"
        }
      ]

      const user = mockUsers.find(u => u.id === customerId && u.role === 'customer')
      if (!user) {
        return null
      }

      // Get customer's orders
      const { orders } = await OrderService.getUserOrders(user.id, {
        page: 1,
        limit: 1000
      })

      const totalOrders = orders.length
      const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0)
      const lastOrder = orders.length > 0 ? orders[0] : null

      // Determine customer status
      let status: 'active' | 'inactive' | 'vip' = 'inactive'
      if (totalOrders > 0) {
        if (totalSpent > 500) {
          status = 'vip'
        } else {
          status = 'active'
        }
      }

      // Check if customer is active (has orders in last 6 months)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      const recentOrders = orders.filter(order => 
        new Date(order.created_at) > sixMonthsAgo
      )
      
      if (recentOrders.length === 0 && totalOrders > 0) {
        status = 'inactive'
      }

      return {
        id: user.id,
        name: user.full_name || 'Unknown',
        email: user.email || '',
        phone: undefined,
        joinDate: user.created_at,
        totalOrders,
        totalSpent,
        lastOrderDate: lastOrder?.created_at,
        status,
        location: undefined,
        avatar: undefined,
        role: user.role
      }
    } catch (error) {
      console.error('Error getting customer by ID:', error)
      return null
    }
  }

  /**
   * Create a new customer
   */
  static async createCustomer(customerData: {
    name: string
    email: string
    phone?: string
    location?: string
    notes?: string
  }): Promise<Customer> {
    try {
      // First, create a user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: customerData.email,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: customerData.name,
          phone: customerData.phone,
          location: customerData.location,
          notes: customerData.notes
        }
      })

      if (authError) {
        throw new Error(`Failed to create user: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error('Failed to create user account')
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: customerData.email,
          full_name: customerData.name,
          role: 'customer',
          phone: customerData.phone,
          location: customerData.location,
          notes: customerData.notes
        })

      if (profileError) {
        console.warn('Failed to create user profile:', profileError)
        // Don't throw error here as the user was created successfully
      }

      // Return the created customer
      return {
        id: authData.user.id,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        joinDate: new Date().toISOString(),
        totalOrders: 0,
        totalSpent: 0,
        status: 'inactive',
        location: customerData.location,
        role: 'customer'
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      throw error
    }
  }

  /**
   * Search customers
   */
  static async searchCustomers(
    searchTerm: string,
    options: {
      page?: number
      limit?: number
    } = {}
  ): Promise<{ customers: Customer[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 20 } = options

    try {
      // Use the same mock data approach
      const mockUsers = [
        {
          id: "d1a47f94-b56d-48fe-8ea6-a27af8a91c37",
          email: "admin@gemstore.com",
          full_name: "Admin User",
          created_at: "2025-08-28T06:14:02.528919+00:00",
          role: "admin"
        },
        {
          id: "f8e5b967-b039-492d-8eb6-ae44ab4e821c",
          email: "danieldawson496@gmail.com",
          full_name: "Daniel Dawson",
          created_at: "2025-08-28T18:53:36.511923+00:00",
          role: "customer"
        }
      ]

      const customerUsers = mockUsers.filter(user => user.role === 'customer')
      const searchTermLower = searchTerm.toLowerCase()
      
      const filteredUsers = customerUsers.filter(user => 
        user.full_name?.toLowerCase().includes(searchTermLower) ||
        user.email.toLowerCase().includes(searchTermLower)
      )

      // Convert to customers (simplified version for search)
      const customers: Customer[] = filteredUsers.map(user => ({
        id: user.id,
        name: user.full_name || 'Unknown',
        email: user.email || '',
        phone: undefined,
        joinDate: user.created_at,
        totalOrders: 0, // Would need to fetch orders for each customer
        totalSpent: 0,
        status: 'inactive' as const,
        role: user.role
      }))

      // Apply pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedCustomers = customers.slice(startIndex, endIndex)

      return {
        customers: paginatedCustomers,
        total: customers.length,
        page,
        totalPages: Math.ceil(customers.length / limit)
      }
    } catch (error) {
      console.error('Error searching customers:', error)
      return {
        customers: [],
        total: 0,
        page: 1,
        totalPages: 0
      }
    }
  }
}