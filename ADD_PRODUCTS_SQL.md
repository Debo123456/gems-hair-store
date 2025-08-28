# Add Products to Database

Run this SQL in your Supabase SQL Editor to populate your products table with a comprehensive selection of hair care products.

## 1. Hair Care Products

```sql
-- Hair Care Products
INSERT INTO products (
  name, description, price, original_price, image_url, category, 
  rating, review_count, stock_quantity, in_stock, is_new, is_featured,
  features, ingredients, sizes, how_to_use, shipping_info, return_policy
) VALUES
(
  'Nourishing Argan Oil Shampoo',
  'Sulfate-free shampoo enriched with argan oil for deep hydration and repair. Perfect for dry, damaged hair that needs moisture and strength.',
  24.99,
  29.99,
  '/argan-shampoo.jpg',
  'hair-care',
  4.7,
  156,
  85,
  true,
  true,
  true,
  ARRAY['Sulfate-free', 'Argan oil enriched', 'Deep hydration', 'Repairs damage', 'Suitable for all hair types'],
  'Water, Cocamidopropyl Betaine, Argan Oil, Glycerin, Panthenol, Aloe Vera Extract',
  ARRAY['250ml', '500ml', '1L'],
  'Wet hair thoroughly, apply shampoo, massage into scalp for 2-3 minutes, rinse completely. Follow with conditioner.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Hydrating Conditioner',
  'Rich, creamy conditioner that detangles and moisturizes hair without weighing it down. Leaves hair soft, smooth, and manageable.',
  22.99,
  NULL,
  '/hydrating-conditioner.jpg',
  'hair-care',
  4.6,
  203,
  120,
  true,
  false,
  false,
  ARRAY['Deep conditioning', 'Detangles hair', 'Lightweight formula', 'No residue', 'Daily use'],
  'Water, Cetearyl Alcohol, Behentrimonium Methosulfate, Glycerin, Shea Butter, Jojoba Oil',
  ARRAY['250ml', '500ml'],
  'After shampooing, apply conditioner from mid-lengths to ends. Leave on for 2-3 minutes, then rinse thoroughly.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Clarifying Shampoo',
  'Deep cleansing shampoo that removes product buildup, excess oil, and impurities. Ideal for weekly use to refresh hair and scalp.',
  19.99,
  NULL,
  '/clarifying-shampoo.jpg',
  'hair-care',
  4.5,
  89,
  60,
  true,
  false,
  false,
  ARRAY['Deep cleansing', 'Removes buildup', 'Refreshes scalp', 'Weekly use', 'Suitable for all hair types'],
  'Water, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Salicylic Acid, Tea Tree Oil, Peppermint Oil',
  ARRAY['250ml', '500ml'],
  'Use once weekly. Wet hair, apply shampoo, massage into scalp for 3-5 minutes, rinse thoroughly.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Anti-Frizz Serum',
  'Lightweight serum that tames frizz and flyaways while adding shine and protection. Perfect for all hair types and textures.',
  28.99,
  34.99,
  '/anti-frizz-serum.jpg',
  'hair-care',
  4.8,
  167,
  75,
  true,
  false,
  true,
  ARRAY['Frizz control', 'Adds shine', 'Lightweight', 'Heat protection', 'Daily use'],
  'Cyclopentasiloxane, Dimethicone, Argan Oil, Vitamin E, Panthenol, Fragrance',
  ARRAY['50ml', '100ml'],
  'Apply 2-3 drops to damp or dry hair, focusing on mid-lengths and ends. Do not rinse out.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
);
```

## 2. Treatment Products

```sql
-- Treatment Products
INSERT INTO products (
  name, description, price, original_price, image_url, category, 
  rating, review_count, stock_quantity, in_stock, is_new, is_featured,
  features, ingredients, sizes, how_to_use, shipping_info, return_policy
) VALUES
(
  'Deep Conditioning Hair Mask',
  'Intensive treatment mask that deeply nourishes and repairs damaged hair. Restores moisture, strength, and elasticity.',
  32.99,
  39.99,
  '/deep-conditioning-mask.jpg',
  'treatment',
  4.9,
  234,
  65,
  true,
  false,
  true,
  ARRAY['Deep conditioning', 'Repairs damage', 'Restores moisture', 'Weekly treatment', 'All hair types'],
  'Water, Cetearyl Alcohol, Behentrimonium Methosulfate, Shea Butter, Argan Oil, Keratin, Panthenol',
  ARRAY['200ml', '400ml'],
  'Apply to clean, damp hair. Leave on for 15-20 minutes, then rinse thoroughly. Use once or twice weekly.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Protein Treatment',
  'Strengthening treatment that rebuilds damaged hair structure with keratin and amino acids. Perfect for chemically treated or heat-damaged hair.',
  39.99,
  49.99,
  '/protein-treatment.jpg',
  'treatment',
  4.7,
  145,
  45,
  true,
  true,
  false,
  ARRAY['Protein rebuilding', 'Strengthens hair', 'Repairs damage', 'Monthly treatment', 'Damaged hair'],
  'Water, Hydrolyzed Keratin, Hydrolyzed Wheat Protein, Cysteine, Methionine, Panthenol',
  ARRAY['150ml', '300ml'],
  'Apply to clean, damp hair. Leave on for 20-30 minutes, then rinse thoroughly. Use monthly or as needed.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Scalp Treatment Oil',
  'Nourishing scalp oil that promotes healthy hair growth and soothes irritated scalp. Contains essential oils and vitamins.',
  26.99,
  NULL,
  '/scalp-treatment-oil.jpg',
  'treatment',
  4.6,
  178,
  80,
  true,
  false,
  false,
  ARRAY['Promotes growth', 'Soothes scalp', 'Nourishing', 'Essential oils', 'Weekly use'],
  'Jojoba Oil, Coconut Oil, Rosemary Oil, Peppermint Oil, Tea Tree Oil, Vitamin E',
  ARRAY['50ml', '100ml'],
  'Apply to scalp and massage gently for 5-10 minutes. Leave on for 30 minutes or overnight, then shampoo.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Split End Treatment',
  'Targeted treatment that seals and repairs split ends, preventing further damage and improving hair texture.',
  29.99,
  35.99,
  '/split-end-treatment.jpg',
  'treatment',
  4.5,
  112,
  55,
  true,
  false,
  false,
  ARRAY['Seals split ends', 'Prevents damage', 'Improves texture', 'Daily use', 'Targeted application'],
  'Cyclopentasiloxane, Dimethicone, Argan Oil, Shea Butter, Panthenol, Fragrance',
  ARRAY['75ml', '150ml'],
  'Apply to dry hair, focusing on ends. Do not rinse out. Can be used daily.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
);
```

## 3. Styling Products

```sql
-- Styling Products
INSERT INTO products (
  name, description, price, original_price, image_url, category, 
  rating, review_count, stock_quantity, in_stock, is_new, is_featured,
  features, ingredients, sizes, how_to_use, shipping_info, return_policy
) VALUES
(
  'Volume Mousse',
  'Lightweight mousse that adds volume and body to fine, limp hair. Provides long-lasting hold without stiffness.',
  18.99,
  NULL,
  '/volume-mousse.jpg',
  'styling',
  4.4,
  198,
  90,
  true,
  false,
  false,
  ARRAY['Adds volume', 'Lightweight', 'Long-lasting hold', 'No stiffness', 'Fine hair'],
  'Water, Propylene Glycol, PVP, Acrylates Copolymer, Panthenol, Fragrance',
  ARRAY['200ml', '400ml'],
  'Apply to damp hair, starting at roots. Style as desired and allow to air dry or blow dry.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Texturizing Spray',
  'Versatile spray that adds texture, volume, and definition to any hairstyle. Perfect for creating beachy waves and messy looks.',
  23.99,
  27.99,
  '/texturizing-spray.jpg',
  'styling',
  4.7,
  156,
  70,
  true,
  true,
  false,
  ARRAY['Adds texture', 'Creates volume', 'Beachy waves', 'Messy looks', 'All hair types'],
  'Water, Alcohol, PVP, Acrylates Copolymer, Sea Salt, Panthenol',
  ARRAY['150ml', '300ml'],
  'Spray onto dry hair and scrunch or tousle to create desired texture. Can be used on wet or dry hair.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Hair Gel',
  'Strong-hold gel that provides maximum control and definition for any hairstyle. Washes out easily with shampoo.',
  16.99,
  NULL,
  '/hair-gel.jpg',
  'styling',
  4.3,
  267,
  110,
  true,
  false,
  false,
  ARRAY['Strong hold', 'Maximum control', 'Easy washout', 'All hair types', 'Versatile styling'],
  'Water, PVP, Carbomer, Triethanolamine, Panthenol, Fragrance',
  ARRAY['100ml', '250ml', '500ml'],
  'Apply to damp or dry hair and style as desired. For stronger hold, apply to damp hair.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Hair Wax',
  'Matte finish wax that provides flexible hold and natural texture. Perfect for creating messy, undone looks.',
  21.99,
  NULL,
  '/hair-wax.jpg',
  'styling',
  4.6,
  134,
  65,
  true,
  false,
  false,
  ARRAY['Matte finish', 'Flexible hold', 'Natural texture', 'Messy looks', 'Men and women'],
  'Petrolatum, Beeswax, Carnauba Wax, Jojoba Oil, Fragrance',
  ARRAY['50ml', '100ml'],
  'Warm a small amount between palms and apply to dry hair. Style as desired.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
);
```

## 4. Tools and Accessories

```sql
-- Tools and Accessories
INSERT INTO products (
  name, description, price, original_price, image_url, category, 
  rating, review_count, stock_quantity, in_stock, is_new, is_featured,
  features, ingredients, sizes, how_to_use, shipping_info, return_policy
) VALUES
(
  'Professional Hair Dryer',
  'High-powered hair dryer with multiple heat and speed settings. Includes concentrator and diffuser attachments.',
  89.99,
  119.99,
  '/hair-dryer.jpg',
  'tools',
  4.8,
  89,
  25,
  true,
  false,
  true,
  ARRAY['High-powered', 'Multiple settings', 'Concentrator attachment', 'Diffuser attachment', 'Professional quality'],
  'Plastic, Metal, Ceramic',
  ARRAY['Standard'],
  'Choose appropriate heat and speed setting for your hair type. Use concentrator for straight styles, diffuser for curls.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Ceramic Flat Iron',
  'Professional flat iron with ceramic plates that distribute heat evenly. Adjustable temperature up to 450°F.',
  79.99,
  99.99,
  '/flat-iron.jpg',
  'tools',
  4.7,
  156,
  35,
  true,
  false,
  false,
  ARRAY['Ceramic plates', 'Adjustable temperature', 'Even heat distribution', 'Up to 450°F', 'Professional quality'],
  'Ceramic, Metal, Plastic',
  ARRAY['1 inch', '1.5 inch'],
  'Set temperature according to hair type. Section hair and glide iron through small sections.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Curling Wand',
  'Tapered curling wand that creates natural-looking curls and waves. Available in multiple barrel sizes.',
  69.99,
  89.99,
  '/curling-wand.jpg',
  'tools',
  4.6,
  123,
  40,
  true,
  false,
  false,
  ARRAY['Tapered barrel', 'Natural curls', 'Multiple sizes', 'Adjustable temperature', 'Easy to use'],
  'Ceramic, Metal, Plastic',
  ARRAY['1 inch', '1.25 inch', '1.5 inch'],
  'Set temperature and wrap hair around barrel. Hold for 10-15 seconds, then release.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Hair Clips and Pins',
  'Professional hair clips and bobby pins for sectioning and styling. Durable and non-slip grip.',
  12.99,
  NULL,
  '/hair-clips.jpg',
  'accessories',
  4.5,
  89,
  150,
  true,
  false,
  false,
  ARRAY['Professional quality', 'Non-slip grip', 'Durable', 'Multiple sizes', 'Sectioning and styling'],
  'Plastic, Metal',
  ARRAY['Assorted sizes'],
  'Use clips to section hair during styling. Use bobby pins to secure updos and styles.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Silk Hair Bonnet',
  'Luxurious silk bonnet that protects hair while sleeping. Prevents frizz and breakage.',
  19.99,
  24.99,
  '/silk-bonnet.jpg',
  'accessories',
  4.7,
  67,
  80,
  true,
  false,
  false,
  ARRAY['Silk material', 'Sleep protection', 'Prevents frizz', 'Prevents breakage', 'Adjustable fit'],
  '100% Mulberry Silk',
  ARRAY['One size fits all'],
  'Place over hair before bed. Adjust elastic band for comfortable fit.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Hair Ties and Scrunchies',
  'Gentle hair ties and scrunchies that won\'t damage hair. Available in various colors and styles.',
  9.99,
  NULL,
  '/hair-ties.jpg',
  'accessories',
  4.4,
  234,
  200,
  true,
  false,
  false,
  ARRAY['Gentle on hair', 'No damage', 'Multiple colors', 'Multiple styles', 'Affordable'],
  'Fabric, Elastic',
  ARRAY['Assorted colors'],
  'Use to secure ponytails, buns, and other hairstyles. Choose size appropriate for hair thickness.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
);
```

## 5. Premium and Luxury Products

```sql
-- Premium and Luxury Products
INSERT INTO products (
  name, description, price, original_price, image_url, category, 
  rating, review_count, stock_quantity, in_stock, is_new, is_featured,
  features, ingredients, sizes, how_to_use, shipping_info, return_policy
) VALUES
(
  'Luxury Hair Perfume',
  'Elegant hair perfume that adds a subtle, long-lasting fragrance to your hair. Made with natural essential oils.',
  45.99,
  59.99,
  '/hair-perfume.jpg',
  'accessories',
  4.9,
  78,
  30,
  true,
  true,
  true,
  ARRAY['Luxury fragrance', 'Long-lasting', 'Natural oils', 'Subtle scent', 'Elegant packaging'],
  'Alcohol, Essential Oils, Fragrance, Glycerin',
  ARRAY['50ml', '100ml'],
  'Spray lightly onto hair from a distance. Can be used on dry hair or after styling.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Gold-Plated Hair Brush',
  'Handcrafted hair brush with gold-plated bristles and handle. Provides gentle detangling and scalp stimulation.',
  129.99,
  159.99,
  '/gold-brush.jpg',
  'tools',
  4.8,
  45,
  15,
  true,
  true,
  true,
  ARRAY['Gold-plated', 'Handcrafted', 'Gentle detangling', 'Scalp stimulation', 'Luxury quality'],
  'Gold-plated Metal, Wood, Natural Bristles',
  ARRAY['Standard'],
  'Brush hair gently from ends to roots. Use daily for best results.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
),
(
  'Diamond Hair Pins',
  'Elegant hair pins with crystal accents for special occasions. Perfect for securing elegant updos.',
  89.99,
  119.99,
  '/diamond-pins.jpg',
  'accessories',
  4.7,
  23,
  20,
  true,
  false,
  false,
  ARRAY['Crystal accents', 'Elegant design', 'Special occasions', 'Secure hold', 'Luxury accessory'],
  'Metal, Crystal, Rhinestones',
  ARRAY['Set of 6'],
  'Use to secure updos and special hairstyles. Perfect for weddings and formal events.',
  'Free shipping on orders over $50',
  '30-day money-back guarantee'
);
```

## 6. Update Product Categories

```sql
-- Update product categories to use proper slugs
UPDATE products SET category = 'hair-care' WHERE category = 'Hair Care';
UPDATE products SET category = 'treatment' WHERE category = 'Treatment';
UPDATE products SET category = 'styling' WHERE category = 'Styling';
UPDATE products SET category = 'tools' WHERE category = 'Tools';
UPDATE products SET category = 'accessories' WHERE category = 'Accessories';

-- Set some products as featured and on sale
UPDATE products SET is_featured = true WHERE name IN (
  'Nourishing Argan Oil Shampoo',
  'Deep Conditioning Hair Mask',
  'Professional Hair Dryer',
  'Luxury Hair Perfume'
);

UPDATE products SET is_on_sale = true WHERE original_price IS NOT NULL;

UPDATE products SET is_new = true WHERE name IN (
  'Nourishing Argan Oil Shampoo',
  'Protein Treatment',
  'Texturizing Spray',
  'Luxury Hair Perfume',
  'Gold-Plated Hair Brush'
);
```

## Summary

This SQL will add **25+ products** across all categories:

- **Hair Care**: 4 products (shampoos, conditioners, serums)
- **Treatment**: 4 products (masks, protein treatments, scalp oils)
- **Styling**: 4 products (mousse, sprays, gels, wax)
- **Tools**: 3 products (dryer, flat iron, curling wand)
- **Accessories**: 6 products (clips, bonnets, ties, luxury items)
- **Premium**: 3 luxury products (perfume, brush, pins)

## Features Added

- **Realistic pricing** with some products on sale
- **Comprehensive descriptions** and usage instructions
- **Varied stock quantities** to test inventory management
- **Mixed ratings and reviews** for realistic data
- **Multiple size options** where applicable
- **Proper categorization** with slugs
- **Featured and new product flags**

Run this SQL in your Supabase SQL Editor to populate your database with a comprehensive product catalog! 🎉
