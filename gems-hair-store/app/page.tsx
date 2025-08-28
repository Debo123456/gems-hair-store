import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const featuredProducts = [
  {
    id: 1,
    name: "Premium Hair Oil",
    description: "Nourishing hair oil for all hair types",
    price: 29.99,
    image: "/hair-oil.jpg",
    category: "Hair Care",
    rating: 4.8
  },
  {
    id: 2,
    name: "Silk Hair Mask",
    description: "Deep conditioning treatment for damaged hair",
    price: 24.99,
    image: "/hair-mask.jpg",
    category: "Treatment",
    rating: 4.9
  },
  {
    id: 3,
    name: "Natural Shampoo",
    description: "Sulfate-free shampoo for healthy hair",
    price: 19.99,
    image: "/shampoo.jpg",
    category: "Hair Care",
    rating: 4.7
  },
  {
    id: 4,
    name: "Styling Gel",
    description: "Strong hold gel for perfect styling",
    price: 15.99,
    image: "/styling-gel.jpg",
    category: "Styling",
    rating: 4.6
  }
]

const categories = [
  "Hair Care", "Treatment", "Styling", "Tools", "Accessories"
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Discover Your Perfect
            <span className="text-purple-600"> Hair Products</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Premium quality hair care products designed to enhance your natural beauty. 
            From nourishing treatments to styling essentials, we have everything you need.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
              <a href="/products">Shop Now</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/products">View Products</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Card key={category} className="text-center cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{category}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <span className="text-4xl">🛍️</span>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{product.category}</Badge>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-600">
                      ${product.price}
                    </span>
                    <Button size="sm">Add to Cart</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-purple-100 mb-8">
            Get the latest product updates and exclusive offers delivered to your inbox.
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border-0 focus:ring-2 focus:ring-purple-300"
            />
            <Button variant="secondary">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
