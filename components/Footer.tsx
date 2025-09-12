"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Instagram, MessageCircle, Mail } from "lucide-react"
import Link from "next/link"

const Footer = () => {

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info & Social */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-purple-400">Gems Hair</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Premium quality hair care products designed to enhance your natural beauty. 
              From nourishing treatments to styling essentials. Virtual store with fast delivery across Jamaica.
            </p>
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                onClick={() => window.open('https://www.facebook.com/share/161a2iYvSf/', '_blank')}
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                onClick={() => window.open('https://www.instagram.com/gemshairandmore?igsh=ZWU5YmFmaGxxemY=', '_blank')}
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                onClick={() => window.open('https://www.tiktok.com/@gemshairandmore?_t=ZM-8zfU0BExvte&_r=1', '_blank')}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </Button>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/categories/hair-care" className="hover:text-white transition-colors">Hair Care</Link></li>
              <li><Link href="/categories/treatment" className="hover:text-white transition-colors">Treatments</Link></li>
              <li><Link href="/categories/styling" className="hover:text-white transition-colors">Styling</Link></li>
              <li><Link href="/categories/tools" className="hover:text-white transition-colors">Tools & Accessories</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Customer Service</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/orders/track" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-4 w-4 text-green-400" />
                <div>
                  <span className="block">Phone: 876 287 3324</span>
                  <span className="text-xs text-gray-400">Calls & WhatsApp - Orders & support</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-purple-400" />
                <div>
                  <span className="block">gemshairstoreandmore@gmail.com</span>
                  <span className="text-xs text-gray-400">Email support</span>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                <p>Virtual Store - Online Only</p>
                <p>Fast delivery across Jamaica</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-400">
            © 2024 Gems Hair. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
