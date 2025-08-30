// Search filters interface
export interface SearchFilters {
  query?: string
  category?: string
  priceRange: [number, number]
  rating: number
  availability: "in-stock" | "out-of-stock" | "all"
  sortBy: "price-low" | "price-high" | "rating" | "newest" | "name"
}

// Enhanced product interface with more details for search
export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  rating: number
  reviewCount: number
  inStock: boolean
  stockQuantity: number
  sizes: string[]
  tags: string[]
  features: string[]
  ingredients?: string[]
  createdAt: string
  updatedAt: string
  image: string
  images: string[]
  isNew?: boolean
  isFeatured?: boolean
  isOnSale?: boolean
}

// Mock product database - in a real app, this would come from an API/database
export const products: Product[] = [
  {
    id: "1",
    name: "Premium Hair Oil",
    description: "Nourishing hair oil with argan and coconut extracts for deep hydration and shine",
    price: 24.99,
    originalPrice: 29.99,
    category: "Hair Oils & Treatments",
    subcategory: "Hair Oils",
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    stockQuantity: 45,
    sizes: ["50ml", "100ml", "200ml"],
    tags: ["argan oil", "coconut oil", "hydrating", "shine", "nourishing"],
    features: ["Deep hydration", "Adds shine", "Repairs damage", "Suitable for all hair types"],
    ingredients: ["Argan Oil", "Coconut Oil", "Jojoba Oil", "Vitamin E", "Natural Fragrance"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    image: "/images/products/argan-shampoo.svg",
    images: [
      "/images/products/argan-shampoo.svg",
      "/images/products/argan-shampoo.svg"
    ],
    isNew: true,
    isFeatured: true,
    isOnSale: true
  },
  {
    id: "2",
    name: "Silk Hair Mask",
    description: "Intensive repair mask with silk proteins and keratin for damaged hair",
    price: 34.99,
    category: "Hair Masks",
    subcategory: "Repair Masks",
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
    stockQuantity: 32,
    sizes: ["100ml", "200ml"],
    tags: ["silk protein", "keratin", "repair", "damaged hair", "intensive"],
    features: ["Deep repair", "Silk proteins", "Keratin treatment", "Weekly use"],
    ingredients: ["Silk Protein", "Keratin", "Shea Butter", "Argan Oil", "Natural Extracts"],
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    image: "/images/products/hair-mask.svg",
    images: [
      "/images/products/hair-mask.svg",
      "/images/products/hair-mask.svg"
    ],
    isNew: true,
    isFeatured: true
  },
  {
    id: "3",
    name: "Natural Shampoo",
    description: "Gentle cleansing shampoo with natural ingredients for daily use",
    price: 19.99,
    category: "Shampoo & Conditioner",
    subcategory: "Shampoo",
    rating: 4.6,
    reviewCount: 234,
    inStock: true,
    stockQuantity: 67,
    sizes: ["250ml", "500ml", "1L"],
    tags: ["natural", "gentle", "daily use", "sulfate-free", "cleansing"],
    features: ["Sulfate-free", "Natural ingredients", "Gentle cleansing", "Daily use"],
    ingredients: ["Coconut Oil", "Aloe Vera", "Chamomile", "Natural Surfactants"],
    createdAt: "2023-12-01T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
    image: "/images/products/argan-shampoo.svg",
    images: [
      "/images/products/argan-shampoo.svg",
      "/images/products/argan-shampoo.svg"
    ]
  },
  {
    id: "4",
    name: "Volume Mousse",
    description: "Lightweight mousse for added volume and body without weighing hair down",
    price: 18.99,
    category: "Styling Products",
    subcategory: "Mousse",
    rating: 4.4,
    reviewCount: 78,
    inStock: false,
    stockQuantity: 0,
    sizes: ["150ml", "300ml"],
    tags: ["volume", "lightweight", "body", "styling", "mousse"],
    features: ["Adds volume", "Lightweight", "No residue", "Easy to style"],
    ingredients: ["Water", "Styling Polymers", "Natural Extracts", "Preservatives"],
    createdAt: "2023-11-15T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z",
    image: "/images/products/styling-gel.svg",
    images: [
      "/images/products/styling-gel.svg",
      "/images/products/styling-gel.svg"
    ]
  },
  {
    id: "5",
    name: "Heat Protectant Spray",
    description: "Advanced heat protection spray with thermal shield technology",
    price: 22.99,
    category: "Styling Products",
    subcategory: "Heat Protection",
    rating: 4.7,
    reviewCount: 112,
    inStock: true,
    stockQuantity: 28,
    sizes: ["100ml", "200ml"],
    tags: ["heat protection", "thermal shield", "styling", "protection", "spray"],
    features: ["Thermal shield", "Up to 450°F protection", "Lightweight", "No buildup"],
    ingredients: ["Thermal Shield Complex", "Argan Oil", "Vitamin E", "Natural Extracts"],
    createdAt: "2023-10-20T00:00:00Z",
    updatedAt: "2024-01-08T00:00:00Z",
    image: "/images/products/anti-frizz-serum.svg",
    images: [
      "/images/products/anti-frizz-serum.svg",
      "/images/products/anti-frizz-serum.svg"
    ]
  },
  {
    id: "6",
    name: "Wide Tooth Comb",
    description: "Gentle detangling comb made from natural materials for wet hair",
    price: 12.99,
    category: "Tools & Accessories",
    subcategory: "Combs",
    rating: 4.5,
    reviewCount: 45,
    inStock: true,
    stockQuantity: 89,
    sizes: ["One Size"],
    tags: ["detangling", "wet hair", "natural", "gentle", "comb"],
    features: ["Wide teeth", "Natural materials", "Gentle detangling", "Wet hair safe"],
    ingredients: ["Natural Wood", "Natural Bristles"],
    createdAt: "2023-09-01T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
    image: "/images/products/styling-gel.svg",
    images: [
      "/images/products/styling-gel.svg",
      "/images/products/styling-gel.svg"
    ]
  }
]

// Search and filter functions
export function searchProducts(filters: SearchFilters, page: number = 1, itemsPerPage: number = 12) {
  let filteredProducts = [...products]

  // Text search
  if (filters.query) {
    const query = filters.query.toLowerCase()
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query)) ||
      product.features.some(feature => feature.toLowerCase().includes(query))
    )
  }

  // Category filter
  if (filters.category) {
    filteredProducts = filteredProducts.filter(product =>
      product.category === filters.category
    )
  }

  // Price range filter
  filteredProducts = filteredProducts.filter(product =>
    product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
  )

  // Rating filter
  if (filters.rating > 0) {
    filteredProducts = filteredProducts.filter(product =>
      product.rating >= filters.rating
    )
  }

  // Availability filter
  if (filters.availability === "in-stock") {
    filteredProducts = filteredProducts.filter(product => product.inStock)
  } else if (filters.availability === "out-of-stock") {
    filteredProducts = filteredProducts.filter(product => !product.inStock)
  }

  // Sorting
  filteredProducts.sort((a, b) => {
    switch (filters.sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "name":
      default:
        return a.name.localeCompare(b.name)
    }
  })

  // Pagination
  const totalResults = filteredProducts.length
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  return {
    products: paginatedProducts,
    totalResults,
    currentPage: page,
    totalPages: Math.ceil(totalResults / itemsPerPage),
    hasNextPage: endIndex < totalResults,
    hasPreviousPage: page > 1
  }
}

// Get products by category
export function getProductsByCategory(category: string) {
  return products.filter(product => product.category === category)
}

// Get related products
export function getRelatedProducts(productId: string, limit: number = 4) {
  const currentProduct = products.find(p => p.id === productId)
  if (!currentProduct) return []

  // Find products in the same category or with similar tags
  const related = products
    .filter(p => p.id !== productId)
    .filter(p => 
      p.category === currentProduct.category ||
      p.subcategory === currentProduct.subcategory ||
      p.tags.some(tag => currentProduct.tags.includes(tag))
    )
    .sort((a, b) => {
      // Prioritize same category, then subcategory, then tag similarity
      const aScore = (a.category === currentProduct.category ? 3 : 0) +
                    (a.subcategory === currentProduct.subcategory ? 2 : 0) +
                    (a.tags.filter(tag => currentProduct.tags.includes(tag)).length)
      const bScore = (b.category === currentProduct.category ? 3 : 0) +
                    (b.subcategory === currentProduct.subcategory ? 2 : 0) +
                    (b.tags.filter(tag => currentProduct.tags.includes(tag)).length)
      return bScore - aScore
    })

  return related.slice(0, limit)
}

// Get featured products
export function getFeaturedProducts(limit: number = 6) {
  return products
    .filter(product => product.isFeatured)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

// Get new products
export function getNewProducts(limit: number = 6) {
  return products
    .filter(product => product.isNew)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

// Get products on sale
export function getSaleProducts(limit: number = 6) {
  return products
    .filter(product => product.isOnSale && product.originalPrice)
    .sort((a, b) => {
      const aDiscount = ((a.originalPrice! - a.price) / a.originalPrice!) * 100
      const bDiscount = ((b.originalPrice! - b.price) / b.originalPrice!) * 100
      return bDiscount - aDiscount
    })
    .slice(0, limit)
}

// Get product suggestions based on search query
export function getSearchSuggestions(query: string, limit: number = 5) {
  if (!query.trim()) return []

  const suggestions = new Set<string>()
  const lowerQuery = query.toLowerCase()

  // Add matching product names
  products.forEach(product => {
    if (product.name.toLowerCase().includes(lowerQuery)) {
      suggestions.add(product.name)
    }
  })

  // Add matching categories
  products.forEach(product => {
    if (product.category.toLowerCase().includes(lowerQuery)) {
      suggestions.add(product.category)
    }
  })

  // Add matching tags
  products.forEach(product => {
    product.tags.forEach(tag => {
      if (tag.toLowerCase().includes(lowerQuery)) {
        suggestions.add(tag)
      }
    })
  })

  return Array.from(suggestions).slice(0, limit)
}
