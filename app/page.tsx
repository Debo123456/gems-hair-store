"use client"

import { PromoBar } from "@/components/PromoBar"
import { HomeFeed } from "@/components/HomeFeed"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <PromoBar />
      <HomeFeed sections={['bestSellers', 'newArrivals', 'topRated', 'dealsOfTheDay']} />
    </div>
  )
}
