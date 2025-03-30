import type { Metadata } from "next"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import BrandsGrid from "@/components/brands/brands-grid"

export const metadata: Metadata = {
  title: "Shop by Automobile Brand | Auto Store",
  description: "Browse auto parts by car brand including Toyota, Lexus, Honda, and more",
}

// Import the client component

export default function BrandsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shop by Automobile Brand</h1>

      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
          </div>
        }
      >
        <BrandsGrid />
      </Suspense>
    </div>
  )
}

