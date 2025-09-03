// Order-related TypeScript types and interfaces

export interface Address {
  street: string
  city: string
  state: string
  zip: string
  country: string
  apartment?: string
  company?: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_sku?: string
  product_image_url?: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface OrderStatusHistory {
  id: string
  order_id: string
  status: OrderStatus
  notes?: string
  created_at: string
  created_by?: string
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: OrderStatus
  total_amount: number
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  currency: string
  
  // Customer Information
  customer_email: string
  customer_name: string
  customer_phone?: string
  
  // Addresses
  shipping_address: Address
  billing_address?: Address
  
  // Payment Information
  payment_method?: string
  payment_status: PaymentStatus
  payment_id?: string
  
  // Shipping Information
  shipping_method?: string
  tracking_number?: string
  estimated_delivery?: string
  
  // Notes
  notes?: string
  internal_notes?: string
  
  // Timestamps
  created_at: string
  updated_at: string
  shipped_at?: string
  delivered_at?: string
  
  // Related data (populated by joins)
  items?: OrderItem[]
  status_history?: OrderStatusHistory[]
}

export interface CreateOrderData {
  user_id: string
  customer_email: string
  customer_name: string
  customer_phone?: string
  shipping_address: Address
  billing_address?: Address
  total_amount: number
  subtotal: number
  tax_amount?: number
  shipping_amount?: number
  discount_amount?: number
  currency?: string
  payment_method?: string
  payment_status?: PaymentStatus
  payment_id?: string
  shipping_method?: string
  notes?: string
  items: CreateOrderItemData[]
}

export interface CreateOrderItemData {
  product_id: string
  product_name: string
  product_sku?: string
  product_image_url?: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface UpdateOrderData {
  id: string
  status?: OrderStatus
  payment_status?: PaymentStatus
  tracking_number?: string
  estimated_delivery?: string
  notes?: string
  internal_notes?: string
  shipped_at?: string
  delivered_at?: string
}

export interface OrderFilters {
  status?: OrderStatus[]
  payment_status?: PaymentStatus[]
  date_from?: string
  date_to?: string
  customer_email?: string
  order_number?: string
}

export interface OrderStats {
  total_orders: number
  pending_orders: number
  processing_orders: number
  shipped_orders: number
  delivered_orders: number
  cancelled_orders: number
  total_revenue: number
  average_order_value: number
}

// Order status display configuration
export const ORDER_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'yellow',
    description: 'Order received, awaiting confirmation'
  },
  confirmed: {
    label: 'Confirmed',
    color: 'blue',
    description: 'Order confirmed, preparing for processing'
  },
  processing: {
    label: 'Processing',
    color: 'purple',
    description: 'Order is being prepared for shipment'
  },
  shipped: {
    label: 'Shipped',
    color: 'indigo',
    description: 'Order has been shipped'
  },
  delivered: {
    label: 'Delivered',
    color: 'green',
    description: 'Order has been delivered'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'red',
    description: 'Order has been cancelled'
  },
  refunded: {
    label: 'Refunded',
    color: 'gray',
    description: 'Order has been refunded'
  }
} as const

// Payment status display configuration
export const PAYMENT_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'yellow',
    description: 'Payment is pending'
  },
  paid: {
    label: 'Paid',
    color: 'green',
    description: 'Payment has been received'
  },
  failed: {
    label: 'Failed',
    color: 'red',
    description: 'Payment failed'
  },
  refunded: {
    label: 'Refunded',
    color: 'gray',
    description: 'Payment has been refunded'
  }
} as const
