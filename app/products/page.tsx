import { Suspense } from "react"
import type { Metadata } from "next"
import ProductsGridSkeleton from "@/components/products/product-grid-skeleton"
import ProductsGrid from "@/components/products/product-grid"


export const metadata: Metadata = {
  title: "All Products | Auto Store",
  description: "Browse our complete collection of auto parts and accessories",
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">All Products</h1>

      <Suspense fallback={<ProductsGridSkeleton />}>
        <ProductsGrid />
      </Suspense>
    </div>
  )
}

