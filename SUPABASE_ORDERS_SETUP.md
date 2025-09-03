# Orders Table Setup for Supabase

This file contains the SQL scripts to set up the orders table and related functionality in Supabase.

## Orders Table

```sql
-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total_amount DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Customer Information
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  
  -- Shipping Address
  shipping_address JSONB NOT NULL,
  
  -- Billing Address (optional, defaults to shipping)
  billing_address JSONB,
  
  -- Payment Information
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_id VARCHAR(255),
  
  -- Shipping Information
  shipping_method VARCHAR(100),
  tracking_number VARCHAR(100),
  estimated_delivery DATE,
  
  -- Order Notes
  notes TEXT,
  internal_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  product_image_url TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_status_history table for tracking status changes
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  order_num TEXT;
  counter INTEGER;
BEGIN
  -- Get current date in YYYYMMDD format
  order_num := TO_CHAR(NOW(), 'YYYYMMDD');
  
  -- Get count of orders for today
  SELECT COUNT(*) + 1 INTO counter
  FROM orders
  WHERE DATE(created_at) = CURRENT_DATE;
  
  -- Pad counter with zeros (e.g., 001, 002, etc.)
  order_num := order_num || LPAD(counter::TEXT, 3, '0');
  
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to automatically set order_number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Create trigger to add initial status to history
CREATE OR REPLACE FUNCTION add_initial_status_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO order_status_history (order_id, status, notes)
  VALUES (NEW.id, NEW.status, 'Order created');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_initial_status_history_trigger
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION add_initial_status_history();

-- Create trigger to track status changes
CREATE OR REPLACE FUNCTION track_status_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (order_id, status, notes)
    VALUES (NEW.id, NEW.status, 'Status updated from ' || OLD.status || ' to ' || NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_status_changes_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION track_status_changes();

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for order_items
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for their orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create RLS policies for order_status_history
CREATE POLICY "Users can view their own order status history" ON order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_status_history.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Admin policies (for admin users)
CREATE POLICY "Admins can view all orders" ON orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all order items" ON order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all order status history" ON order_status_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Sample data (optional - for testing)
INSERT INTO orders (
  user_id,
  customer_email,
  customer_name,
  customer_phone,
  shipping_address,
  billing_address,
  total_amount,
  subtotal,
  tax_amount,
  shipping_amount,
  status,
  payment_status,
  payment_method,
  shipping_method,
  notes
) VALUES (
  (SELECT id FROM auth.users LIMIT 1), -- Replace with actual user ID
  'customer@example.com',
  'John Doe',
  '+1234567890',
  '{"street": "123 Main St", "city": "New York", "state": "NY", "zip": "10001", "country": "US"}',
  '{"street": "123 Main St", "city": "New York", "state": "NY", "zip": "10001", "country": "US"}',
  29.99,
  24.99,
  2.50,
  2.50,
  'pending',
  'pending',
  'credit_card',
  'standard',
  'Please deliver during business hours'
);

-- Add sample order items
INSERT INTO order_items (
  order_id,
  product_id,
  product_name,
  quantity,
  unit_price,
  total_price
) VALUES (
  (SELECT id FROM orders ORDER BY created_at DESC LIMIT 1),
  (SELECT id FROM products LIMIT 1),
  'Premium Hair Oil',
  1,
  24.99,
  24.99
);
```

## Usage Instructions

1. **Run the SQL Script**: Execute the above SQL in your Supabase SQL editor
2. **Verify Tables**: Check that the tables `orders`, `order_items`, and `order_status_history` are created
3. **Test RLS**: Ensure Row Level Security is working correctly
4. **Test Functions**: Verify that order numbers are generated automatically

## Table Structure

### Orders Table
- **Primary Key**: `id` (UUID)
- **User Reference**: `user_id` (links to auth.users)
- **Order Details**: order_number, status, amounts, currency
- **Customer Info**: email, name, phone
- **Addresses**: shipping_address, billing_address (JSONB)
- **Payment**: payment_method, payment_status, payment_id
- **Shipping**: shipping_method, tracking_number, estimated_delivery
- **Timestamps**: created_at, updated_at, shipped_at, delivered_at

### Order Items Table
- **Primary Key**: `id` (UUID)
- **Order Reference**: `order_id` (links to orders)
- **Product Info**: product_id, product_name, product_sku, product_image_url
- **Quantity & Pricing**: quantity, unit_price, total_price

### Order Status History Table
- **Primary Key**: `id` (UUID)
- **Order Reference**: `order_id` (links to orders)
- **Status Tracking**: status, notes, created_at, created_by

## Features

- **Automatic Order Numbers**: Generated in format YYYYMMDD001
- **Status Tracking**: Complete history of status changes
- **Row Level Security**: Users can only access their own orders
- **Admin Access**: Admins can view and manage all orders
- **Automatic Timestamps**: Updated_at is automatically maintained
- **Data Integrity**: Foreign key constraints and check constraints
