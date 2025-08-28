import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search, Star } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Premium Hair Oil",
    description: "Nourishing hair oil for all hair types",
    price: 29.99,
    originalPrice: 39.99,
    image: "/hair-oil.jpg",
    category: "Hair Care",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    isNew: true
  },
  {
    id: 2,
    name: "Silk Hair Mask",
    description: "Deep conditioning treatment for damaged hair",
    price: 24.99,
    originalPrice: 29.99,
    image: "/hair-mask.jpg",
    category: "Treatment",
    rating: 4.9,
    reviews: 89,
    inStock: true,
    isNew: false
  },
  {
    id: 3,
    name: "Natural Shampoo",
    description: "Sulfate-free shampoo for healthy hair",
    price: 19.99,
    image: "/shampoo.jpg",
    category: "Hair Care",
    rating: 4.7,
    reviews: 156,
    inStock: true,
    isNew: false
  },
  {
    id: 4,
    name: "Styling Gel",
    description: "Strong hold gel for perfect styling",
    price: 15.99,
    image: "/styling-gel.jpg",
    category: "Styling",
    rating: 4.6,
    reviews: 78,
    inStock: false,
    isNew: false
  },
  {
    id: 5,
    name: "Heat Protectant Spray",
    description: "Protects hair from heat damage",
    price: 22.99,
    image: "/heat-protectant.jpg",
    category: "Treatment",
    rating: 4.8,
    reviews: 112,
    inStock: true,
    isNew: true
  },
  {
    id: 6,
    name: "Wide Tooth Comb",
    description: "Gentle detangling comb for all hair types",
    price: 12.99,
    image: "/comb.jpg",
    category: "Tools",
    rating: 4.5,
    reviews: 67,
    inStock: true,
    isNew: false
  },
  {
    id: 7,
    name: "Hair Clips Set",
    description: "Professional hair clips for styling",
    price: 18.99,
    image: "/clips.jpg",
    category: "Accessories",
    rating: 4.4,
    reviews: 45,
    inStock: true,
    isNew: false
  },
  {
    id: 8,
    name: "Microfiber Towel",
    description: "Gentle hair drying towel",
    price: 16.99,
    image: "/towel.jpg",
    category: "Accessories",
    rating: 4.7,
    reviews: 92,
    inStock: true,
    isNew: false
  }
]

const categories = ["All", "Hair Care", "Treatment", "Styling", "Tools", "Accessories"]

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover our complete collection of premium hair care products</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="newest">
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <span className="text-4xl">🛍️</span>
                </div>
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
                  )}
                  {!product.inStock && (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                <CardDescription className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-purple-600">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  disabled={!product.inStock}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">1</Button>
            <Button size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
