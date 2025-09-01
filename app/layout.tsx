import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { CartProvider } from "@/hooks/useCart"
import { SearchProvider } from "@/hooks/useSearch"
import { AuthProvider } from "@/hooks/useAuth"
import { WishlistProvider } from "@/hooks/useWishlist"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Gems Hair Store - Premium Hair Care Products",
  description: "Discover premium quality hair care products designed to enhance your natural beauty. From nourishing treatments to styling essentials.",
  keywords: "hair care, hair products, hair treatment, styling products, beauty",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <AuthProvider>
          <WishlistProvider>
            <SearchProvider>
              <CartProvider>
                <Header />
                <main>{children}</main>
                <Footer />
              </CartProvider>
            </SearchProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
