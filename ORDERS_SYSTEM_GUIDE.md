# Orders System Guide

This guide explains how to use the orders system in the Gems Hair Store application.

## Overview

The orders system provides a complete solution for managing customer orders, including:
- Order creation and management
- Order status tracking
- Order history and search
- Admin order management
- Order statistics and analytics

## Database Setup

### 1. Run the SQL Setup

Execute the SQL script in `SUPABASE_ORDERS_SETUP.md` in your Supabase SQL editor to create the necessary tables:

- `orders` - Main orders table
- `order_items` - Individual items within orders
- `order_status_history` - Track status changes over time

### 2. Automatic Setup

The orders table will be automatically created when you run the database initialization:

```typescript
import { DatabaseSetup } from '@/lib/databaseSetup'

// This will create the orders table if it doesn't exist
await DatabaseSetup.initializeDatabase()
```

## Usage Examples

### Creating an Order

```typescript
import { OrderService } from '@/lib/orderService'
import { CreateOrderData } from '@/lib/orderTypes'

const orderData: CreateOrderData = {
  user_id: 'user-uuid',
  customer_email: 'customer@example.com',
  customer_name: 'John Doe',
  customer_phone: '+1234567890',
  shipping_address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'US'
  },
  total_amount: 29.99,
  subtotal: 24.99,
  tax_amount: 2.50,
  shipping_amount: 2.50,
  payment_method: 'credit_card',
  payment_status: 'pending',
  items: [
    {
      product_id: 'product-uuid',
      product_name: 'Premium Hair Oil',
      product_image_url: '/images/product.jpg',
      quantity: 1,
      unit_price: 24.99,
      total_price: 24.99
    }
  ]
}

const order = await OrderService.createOrder(orderData)
```

### Using React Hooks

#### Get User Orders

```typescript
import { useOrders } from '@/hooks/useOrders'

function UserOrdersPage() {
  const { 
    orders, 
    loading, 
    error, 
    total, 
    page, 
    totalPages,
    refresh 
  } = useOrders({ 
    userId: 'user-uuid',
    initialPage: 1,
    initialLimit: 20 
  })

  if (loading) return <div>Loading orders...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Your Orders ({total})</h1>
      {orders.map(order => (
        <div key={order.id}>
          <h3>Order #{order.order_number}</h3>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total_amount}</p>
        </div>
      ))}
    </div>
  )
}
```

#### Admin Order Management

```typescript
import { useOrders } from '@/hooks/useOrders'

function AdminOrdersPage() {
  const { 
    orders, 
    loading, 
    error,
    setFilters,
    setPage,
    updateOrderStatus 
  } = useOrders({ 
    // No userId = admin view
    initialPage: 1,
    initialLimit: 50 
  })

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus, 'Status updated by admin')
      // Orders will automatically refresh
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  return (
    <div>
      <h1>All Orders</h1>
      {/* Filter controls */}
      <div>
        <button onClick={() => setFilters({ status: ['pending'] })}>
          Show Pending Only
        </button>
        <button onClick={() => setFilters({})}>
          Show All
        </button>
      </div>
      
      {/* Orders list */}
      {orders.map(order => (
        <div key={order.id}>
          <h3>Order #{order.order_number}</h3>
          <p>Customer: {order.customer_name}</p>
          <p>Status: {order.status}</p>
          <button onClick={() => handleStatusUpdate(order.id, 'processing')}>
            Mark as Processing
          </button>
        </div>
      ))}
    </div>
  )
}
```

#### Order Statistics

```typescript
import { useOrderStats } from '@/hooks/useOrders'

function AdminDashboard() {
  const { stats, loading, error } = useOrderStats()

  if (loading) return <div>Loading stats...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Order Statistics</h1>
      <div className="stats-grid">
        <div>
          <h3>Total Orders</h3>
          <p>{stats?.total_orders}</p>
        </div>
        <div>
          <h3>Pending Orders</h3>
          <p>{stats?.pending_orders}</p>
        </div>
        <div>
          <h3>Total Revenue</h3>
          <p>${stats?.total_revenue}</p>
        </div>
        <div>
          <h3>Average Order Value</h3>
          <p>${stats?.average_order_value}</p>
        </div>
      </div>
    </div>
  )
}
```

### Order Service Methods

#### Basic Operations

```typescript
// Create an order
const order = await OrderService.createOrder(orderData)

// Get order by ID
const order = await OrderService.getOrderById('order-uuid')

// Get order by order number
const order = await OrderService.getOrderByNumber('20241201001')

// Update order
await OrderService.updateOrder({
  id: 'order-uuid',
  status: 'shipped',
  tracking_number: 'TRK123456789'
})

// Update order status
await OrderService.updateOrderStatus('order-uuid', 'delivered', 'Package delivered successfully')

// Cancel order
await OrderService.cancelOrder('order-uuid', 'Customer requested cancellation')
```

#### Advanced Queries

```typescript
// Get user orders with pagination
const result = await OrderService.getUserOrders('user-uuid', {
  page: 1,
  limit: 20,
  status: ['pending', 'processing']
})

// Get all orders with filters (admin)
const result = await OrderService.getAllOrders({
  page: 1,
  limit: 50,
  filters: {
    status: ['pending'],
    date_from: '2024-01-01',
    date_to: '2024-12-31',
    customer_email: 'customer@example.com'
  },
  sortBy: 'created_at',
  sortOrder: 'desc'
})

// Search orders
const result = await OrderService.searchOrders('order number or customer email', {
  page: 1,
  limit: 20
})

// Get order statistics
const stats = await OrderService.getOrderStats()

// Get recent orders
const recentOrders = await OrderService.getRecentOrders(10)
```

## Order Status Flow

The system supports the following order statuses:

1. **pending** - Order received, awaiting confirmation
2. **confirmed** - Order confirmed, preparing for processing
3. **processing** - Order is being prepared for shipment
4. **shipped** - Order has been shipped
5. **delivered** - Order has been delivered
6. **cancelled** - Order has been cancelled
7. **refunded** - Order has been refunded

## Payment Status

- **pending** - Payment is pending
- **paid** - Payment has been received
- **failed** - Payment failed
- **refunded** - Payment has been refunded

## Security Features

### Row Level Security (RLS)

The system implements Row Level Security to ensure:
- Users can only view their own orders
- Admins can view and manage all orders
- Order items and status history follow the same security rules

### Admin Access

Admin users have full access to:
- View all orders
- Update order status
- Add tracking information
- View order statistics
- Search and filter orders

## Integration with Checkout

The checkout process has been updated to automatically create orders in the database:

```typescript
// In checkout page
const orderData: CreateOrderData = {
  user_id: user?.id || 'anonymous',
  customer_email: formData.email,
  customer_name: `${formData.firstName} ${formData.lastName}`,
  // ... other fields
}

const createdOrder = await OrderService.createOrder(orderData)
```

## Error Handling

All service methods include proper error handling:

```typescript
try {
  const order = await OrderService.createOrder(orderData)
  // Success
} catch (error) {
  console.error('Failed to create order:', error.message)
  // Handle error
}
```

## Performance Considerations

- Database indexes are created for optimal query performance
- Pagination is implemented for large order lists
- Order status history is tracked for audit purposes
- Automatic order number generation prevents conflicts

## Next Steps

1. **Run the SQL setup** in your Supabase database
2. **Test order creation** through the checkout process
3. **Implement order management UI** for admin users
4. **Add order tracking** for customers
5. **Set up email notifications** for status changes
6. **Integrate payment processing** for real payment status updates
