// Product image paths for different categories
export const productImages = {
  // Hair Care Products
  "argan-shampoo": "/images/products/argan-shampoo.svg",
  "hydrating-conditioner": "/images/products/hydrating-conditioner.svg",
  "clarifying-shampoo": "/images/products/argan-shampoo.svg", // Reusing for now
  "anti-frizz-serum": "/images/products/anti-frizz-serum.svg",
  
  // Treatment Products
  "deep-conditioning-mask": "/images/products/hair-mask.svg",
  "protein-treatment": "/images/products/hair-mask.svg", // Reusing for now
  "scalp-treatment-oil": "/images/products/anti-frizz-serum.svg", // Reusing for now
  "split-end-treatment": "/images/products/anti-frizz-serum.svg", // Reusing for now
  
  // Styling Products
  "volume-mousse": "/images/products/styling-gel.svg", // Reusing for now
  "texturizing-spray": "/images/products/styling-gel.svg", // Reusing for now
  "hair-gel": "/images/products/styling-gel.svg",
  "hair-wax": "/images/products/styling-gel.svg", // Reusing for now
  
  // Tools and Accessories
  "hair-dryer": "/images/products/styling-gel.svg", // Reusing for now
  "flat-iron": "/images/products/styling-gel.svg", // Reusing for now
  "curling-wand": "/images/products/styling-gel.svg", // Reusing for now
  "hair-clips": "/images/products/styling-gel.svg", // Reusing for now
  "silk-bonnet": "/images/products/styling-gel.svg", // Reusing for now
  "hair-ties": "/images/products/styling-gel.svg", // Reusing for now
  
  // Premium Products
  "hair-perfume": "/images/products/anti-frizz-serum.svg", // Reusing for now
  "gold-brush": "/images/products/styling-gel.svg", // Reusing for now
  "diamond-pins": "/images/products/styling-gel.svg", // Reusing for now
}

// Function to get product image by name
export function getProductImage(productName: string): string {
  // Convert product name to key format
  const key = productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  
  // Try to find exact match first
  if (productImages[key as keyof typeof productImages]) {
    return productImages[key as keyof typeof productImages]
  }
  
  // Try partial matches
  for (const [imageKey, imagePath] of Object.entries(productImages)) {
    if (key.includes(imageKey) || imageKey.includes(key)) {
      return imagePath
    }
  }
  
  // Default fallback
  return "/images/products/argan-shampoo.svg"
}

// Function to get random product image for fallback
export function getRandomProductImage(): string {
  const imagePaths = Object.values(productImages)
  const randomIndex = Math.floor(Math.random() * imagePaths.length)
  return imagePaths[randomIndex]
}
