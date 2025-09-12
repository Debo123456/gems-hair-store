"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, Menu, User, Heart, LogOut, LogIn, X, ShoppingBag, User as UserIcon, Settings, Package } from "lucide-react"
import { Cart } from "./Cart"
import { useAuth } from "@/hooks/useAuth"
import { useWishlist } from "@/hooks/useWishlist"
import { AdminOnly } from "@/components/ProtectedRoute"

import Link from "next/link"

const Header = () => {
  const { user, profile, signOut } = useAuth()
  const { items: wishlistItems } = useWishlist()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search functionality would go here
  }

  const handleSignOut = async () => {
    await signOut()
    setIsMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setIsSearchExpanded(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden touch-manipulation">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Mobile Navigation Menu</SheetTitle>
                  <SheetDescription>Navigation menu for mobile devices</SheetDescription>
                </SheetHeader>
                <div className="flex h-full flex-col">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-lg font-semibold text-purple-600">Gems Hair</h2>
                    <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Mobile Search */}
                  <div className="p-4 border-b">
                    <form onSubmit={handleSearch} className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-10 pr-4 w-full"
                        onFocus={() => setIsSearchExpanded(true)}
                      />
                    </form>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 p-6 space-y-4">
                    <Link 
                      href="/" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <Package className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Home</span>
                    </Link>
                    <Link 
                      href="/products" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <Package className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Products</span>
                    </Link>
                    <Link 
                      href="/orders/track" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <Package className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Track Order</span>
                    </Link>
                    <Link 
                      href="/contact" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <Package className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Contact</span>
                    </Link>
                  </nav>

                  {/* Mobile User Section */}
                  <div className="p-6 border-t">
                    {user ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/avatar.jpg" alt={profile?.full_name || undefined} />
                            <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{profile?.full_name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Link 
                            href="/dashboard" 
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={closeMobileMenu}
                          >
                            <UserIcon className="h-5 w-5 text-purple-600" />
                            <span>Dashboard</span>
                          </Link>
                          <Link 
                            href="/dashboard?tab=wishlist" 
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={closeMobileMenu}
                          >
                            <Heart className="h-5 w-5 text-purple-600" />
                            <span>Wishlist</span>
                            {wishlistItems.length > 0 && (
                              <Badge className="ml-auto bg-purple-100 text-purple-600 text-xs">
                                {wishlistItems.length}
                              </Badge>
                            )}
                          </Link>
                          <AdminOnly>
                            <Link 
                              href="/admin" 
                              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                              onClick={closeMobileMenu}
                            >
                              <Settings className="h-5 w-5 text-purple-600" />
                              <span>Admin</span>
                            </Link>
                          </AdminOnly>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={handleSignOut}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button asChild className="w-full">
                          <Link href="/auth/signin" onClick={closeMobileMenu}>
                            <LogIn className="h-4 w-4 mr-2" />
                            Sign In
                          </Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/auth/signup" onClick={closeMobileMenu}>
                            Sign Up
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center">
              <img 
                src="/images/logo/logo.png" 
                alt="Gems Hair" 
                className="h-8 md:h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
              Products
            </Link>
            <Link href="/orders/track" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
              Track Order
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
              Contact
            </Link>
            <AdminOnly>
              <Link href="/admin" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                Admin
              </Link>
            </AdminOnly>
          </nav>

          {/* Search Bar - Hidden on mobile when menu is open */}
          <div className={`hidden md:flex flex-1 max-w-md mx-8 ${isMobileMenuOpen ? 'hidden' : ''}`}>
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 pr-4 w-full"
              />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Wishlist - Hidden on mobile when menu is open */}
            {!isMobileMenuOpen && (
              <Button variant="ghost" size="icon" className="relative touch-manipulation" asChild>
                <Link href="/dashboard?tab=wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistItems.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                      {wishlistItems.length}
                    </Badge>
                  )}
                </Link>
              </Button>
            )}

            {/* Cart */}
            <Cart />

            {/* User Menu - Desktop Only */}
            {user && !isMobileMenuOpen && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:flex touch-manipulation">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar.jpg" alt={profile?.full_name || undefined} />
                      <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard?tab=orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard?tab=wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard?tab=settings">Settings</Link>
                  </DropdownMenuItem>
                  <AdminOnly>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </AdminOnly>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Sign In/Up - Desktop Only */}
            {!user && !isMobileMenuOpen && (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export { Header }
