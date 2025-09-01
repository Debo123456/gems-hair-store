"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Settings, 
  Edit, 
  Plus, 
  Trash2,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useWishlist } from "@/hooks/useWishlist"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthenticatedOnly } from "@/components/ProtectedRoute"



export default function DashboardPage() {
  const { user, profile, addresses, signOut, role, isAdmin, loading } = useAuth()
  const { items: wishlistItems } = useWishlist()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")



  // Mock order data - in a real app, this would come from Supabase
  const mockOrders = [
    {
      id: "1",
      orderNumber: "ORD-2024-001",
      status: "delivered",
      total: 89.97,
      date: "2024-01-15",
      items: 3
    },
    {
      id: "2",
      orderNumber: "ORD-2024-002",
      status: "shipped",
      total: 45.99,
      date: "2024-01-20",
      items: 2
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800"
      case "shipped": return "bg-blue-100 text-blue-800"
      case "processing": return "bg-yellow-100 text-yellow-800"
      case "pending": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-4 w-4" />
      case "shipped": return <Truck className="h-4 w-4" />
      case "processing": return <Package className="h-4 w-4" />
      case "pending": return <Calendar className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  return (
    <AuthenticatedOnly fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h1>
          <p className="text-gray-600 mb-4">You need to be signed in to access your dashboard.</p>
          <Button onClick={() => router.push("/auth/signin")}>
            Sign In
          </Button>
        </div>
      </div>
    }>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profile?.full_name || 'User'}!</p>
              {isAdmin && (
                <div className="mt-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Admin User
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <Button asChild variant="outline">
                  <Link href="/admin">
                    Admin Panel
                  </Link>
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={signOut}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{profile?.full_name || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{user?.email || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{profile?.phone || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <Badge variant={isAdmin ? "default" : "secondary"}>
                        {role || "customer"}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Orders Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Orders:</span>
                      <span className="font-medium">{mockOrders.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recent:</span>
                      <span className="font-medium">{mockOrders[0]?.orderNumber}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View All Orders
                  </Button>
                </CardContent>
              </Card>

              {/* Wishlist Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Wishlist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items:</span>
                      <span className="font-medium">{wishlistItems.length}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View Wishlist
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest order activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <Package className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>Track all your orders and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-full">
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{order.orderNumber}</h3>
                            <p className="text-sm text-gray-600">Placed on {order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600">${order.total}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{order.items} items</span>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Addresses</h2>
                <p className="text-gray-600">Manage your shipping and billing addresses</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <Card key={address.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {address.type === 'shipping' ? 'Shipping' : 'Billing'} Address
                      </CardTitle>
                      {address.is_default && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">{address.first_name} {address.last_name}</p>
                      {address.company && <p className="text-gray-600">{address.company}</p>}
                      <p className="text-gray-600">{address.address_line_1}</p>
                      {address.address_line_2 && <p className="text-gray-600">{address.address_line_2}</p>}
                      <p className="text-gray-600">{address.city}, {address.state} {address.postal_code}</p>
                      <p className="text-gray-600">{address.country}</p>
                      {address.phone && <p className="text-gray-600">{address.phone}</p>}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {addresses.length === 0 && (
                <Card className="col-span-full text-center py-12">
                  <CardContent>
                    <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses yet</h3>
                    <p className="text-gray-600 mb-4">
                      Add your first address to make checkout faster
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Wishlist</h2>
                <p className="text-gray-600">Your saved products and favorites</p>
              </div>
              {wishlistItems.length > 0 && (
                <Button variant="outline">
                  Clear All
                </Button>
              )}
            </div>

            {wishlistItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Wishlist items would be rendered here */}
                <Card className="text-center py-12">
                  <CardContent>
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Wishlist Items</h3>
                    <p className="text-gray-600">
                      Your wishlist items will appear here
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-600 mb-4">
                    Start adding products to your wishlist while browsing
                  </p>
                  <Button asChild>
                    <Link href="/products">
                      Browse Products
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile?.full_name || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user?.email || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          readOnly
                        />
                      </div>
                    </div>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Security</h3>
                  <div className="space-y-4">
                    <Button variant="outline">
                      Change Password
                    </Button>
                    <Button variant="outline">
                      Two-Factor Authentication
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Order Updates</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Marketing Emails</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </AuthenticatedOnly>
  )
}
