"use client"

import { Truck } from "lucide-react"
import { Button } from "@/components/ui/button"

const PromoBar = () => {
  return (
    <div className="bg-gray-900 text-white py-2 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Truck className="h-3 w-3" />
            <span>Free shipping on orders over $50</span>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-white border-white hover:bg-white hover:text-gray-900 text-xs h-6 px-3"
          >
            Shop Now
          </Button>
        </div>
      </div>
    </div>
  )
}

export { PromoBar }
