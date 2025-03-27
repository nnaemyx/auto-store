import { Suspense } from "react"
import type { Metadata } from "next"
import ProductDetails from "@/components/products/product-details"

export const metadata: Metadata = {
  title: "Product Details | Auto Store",
  description: "View detailed information about this product",
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetails id={Number.parseInt(params.id)} />
    </Suspense>
  )
}

function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Image skeleton */}
        <div className="space-y-4">
          <div className="relative h-[300px] md:h-[400px] bg-gray-100 rounded-lg animate-pulse" />
          <div className="flex space-x-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-[80px] h-[80px] bg-gray-100 rounded-md animate-pulse" />
            ))}
          </div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-6">
          <div>
            <div className="h-8 bg-gray-100 rounded-md w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-100 rounded-md w-1/2 mt-2 animate-pulse" />
          </div>
          <div className="h-20 bg-gray-100 rounded-md animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded-md w-1/4 animate-pulse" />
            <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded-md w-1/4 animate-pulse" />
            <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="h-10 bg-gray-100 rounded-md w-1/3 animate-pulse" />
            <div className="h-10 bg-gray-100 rounded-md w-1/3 animate-pulse" />
            <div className="h-10 bg-gray-100 rounded-md w-1/6 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

