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
  icons: {
    icon: [
      { url: "/images/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon/favicon.ico", sizes: "any" }
    ],
    apple: [
      { url: "/images/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      { url: "/images/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ]
  },
  manifest: "/images/favicon/site.webmanifest"
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
