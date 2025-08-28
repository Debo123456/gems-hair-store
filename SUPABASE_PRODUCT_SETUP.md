# Supabase Product Database Setup

## 1. Create Products Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image_url TEXT,
  category TEXT NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  features TEXT[],
  ingredients TEXT,
  sizes TEXT[],
  how_to_use TEXT,
  shipping_info TEXT,
  return_policy TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_is_on_sale ON products(is_on_sale);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created_at ON products(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (products are publicly readable)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Only authenticated users with admin role can modify products
CREATE POLICY "Only admins can insert products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update products" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete products" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- Create categories table for better organization
CREATE TABLE product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES product_categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for categories
CREATE INDEX idx_product_categories_slug ON product_categories(slug);
CREATE INDEX idx_product_categories_parent_id ON product_categories(parent_id);

-- Enable RLS for categories
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Categories are publicly readable
CREATE POLICY "Categories are viewable by everyone" ON product_categories
  FOR SELECT USING (true);

-- Only admins can modify categories
CREATE POLICY "Only admins can modify categories" ON product_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Insert default categories
INSERT INTO product_categories (name, description, slug, sort_order) VALUES
  ('Hair Care', 'Essential hair care products for daily use', 'hair-care', 1),
  ('Treatment', 'Deep conditioning and repair treatments', 'treatment', 2),
  ('Styling', 'Products for styling and finishing', 'styling', 3),
  ('Tools', 'Hair styling tools and accessories', 'tools', 4),
  ('Accessories', 'Hair accessories and extras', 'accessories', 5);

-- Update user_profiles table to include admin role
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';

-- Create index for admin role lookups
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
```

## 2. Insert Sample Products

Run this SQL to populate with sample data:

```sql
-- Insert sample products
INSERT INTO products (
  name, description, price, original_price, image_url, category, 
  rating, review_count, stock_quantity, in_stock, is_new, is_featured,
  features, ingredients, sizes, how_to_use, shipping_info, return_policy
) VALUES
(
  'Premium Hair Oil',
  'Nourishing hair oil for all hair types. This premium blend contains natural ingredients like argan oil, coconut oil, and vitamin E to deeply moisturize and strengthen your hair. Perfect for daily use to maintain healthy, shiny locks.',
  29.99,
  39.99,
  '/hair-oil.jpg',
  'Hair Care',
  4.8,
  124,
  50,
  true,
  true,
  true,
  ARRAY['Natural ingredients', 'Suitable for all hair types', 'Deep moisturizing', 'No harmful chemicals', 'Long-lasting results'],
  'Argan Oil, Coconut Oil, Vitamin E, Jojoba Oil, Rosemary Extract',
  ARRAY['100ml', '200ml', '500ml'],
  'Apply 2-3 drops to damp hair, focusing on ends. Can be used daily for best results.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Silk Hair Mask',
  'Deep conditioning treatment for damaged hair. This intensive mask repairs split ends, reduces frizz, and restores hair''s natural shine. Formulated with silk proteins and natural oils for maximum hydration.',
  24.99,
  29.99,
  '/hair-mask.jpg',
  'Treatment',
  4.9,
  89,
  75,
  true,
  false,
  true,
  ARRAY['Deep conditioning', 'Repairs split ends', 'Reduces frizz', 'Silk protein formula', 'Weekly treatment'],
  'Silk Protein, Argan Oil, Shea Butter, Aloe Vera, Vitamin B5',
  ARRAY['200ml', '400ml'],
  'Apply to clean, damp hair. Leave on for 10-15 minutes, then rinse thoroughly. Use once or twice weekly.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Volume Boosting Shampoo',
  'Sulfate-free shampoo that adds volume and body to fine, limp hair. Enriched with biotin and keratin to strengthen hair while providing long-lasting volume.',
  19.99,
  NULL,
  '/volume-shampoo.jpg',
  'Hair Care',
  4.6,
  203,
  100,
  true,
  false,
  false,
  ARRAY['Sulfate-free', 'Volume boosting', 'Biotin enriched', 'Keratin fortified', 'Gentle cleansing'],
  'Water, Cocamidopropyl Betaine, Sodium Lauroyl Methyl Isethionate, Biotin, Keratin',
  ARRAY['250ml', '500ml', '1L'],
  'Wet hair thoroughly, apply shampoo, massage into scalp, rinse completely. Follow with conditioner.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Heat Protection Spray',
  'Advanced heat protection spray that shields hair from damage caused by styling tools up to 450°F. Contains natural oils and vitamins to nourish while protecting.',
  22.99,
  NULL,
  '/heat-protection.jpg',
  'Styling',
  4.7,
  156,
  60,
  true,
  true,
  false,
  ARRAY['Heat protection up to 450°F', 'Lightweight formula', 'No residue', 'Nourishing ingredients', 'Suitable for all hair types'],
  'Water, Cyclopentasiloxane, Dimethicone, Argan Oil, Vitamin E',
  ARRAY['150ml', '300ml'],
  'Spray evenly on damp or dry hair before using heat styling tools. Do not rinse out.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Detangling Brush',
  'Gentle detangling brush with flexible bristles that glide through hair without causing breakage. Perfect for wet or dry hair, reduces frizz and static.',
  34.99,
  39.99,
  '/detangling-brush.jpg',
  'Tools',
  4.8,
  92,
  30,
  true,
  false,
  false,
  ARRAY['Gentle detangling', 'Flexible bristles', 'Reduces breakage', 'Anti-static', 'Wet/dry use'],
  'Nylon bristles, Wooden handle, Anti-static coating',
  ARRAY['Standard'],
  'Start from the ends and work your way up to the roots. Use gentle strokes to avoid breakage.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
);

-- Update product categories to reference the categories table
UPDATE products SET category = 'hair-care' WHERE category = 'Hair Care';
UPDATE products SET category = 'treatment' WHERE category = 'Treatment';
UPDATE products SET category = 'styling' WHERE category = 'Styling';
UPDATE products SET category = 'tools' WHERE category = 'Tools';
```

## 3. Features

This setup provides:
- **Comprehensive product data** with all necessary fields
- **Category organization** with hierarchical support
- **Admin role system** for product management
- **Efficient indexing** for fast searches and filters
- **Row-level security** with public read access
- **Automatic timestamps** for tracking changes
- **Sample data** to get started immediately

## 4. Next Steps

After running this setup:
1. Update your product service to use Supabase instead of mock data
2. Implement admin interfaces for product management
3. Add image upload functionality for product images
4. Create product search and filtering APIs
