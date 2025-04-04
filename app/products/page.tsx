import { Suspense } from "react"
import type { Metadata } from "next"
import ProductsGridSkeleton from "@/components/products/product-grid-skeleton"
import ProductsGrid from "@/components/products/product-grid"


export const metadata: Metadata = {
  title: "All Products | Auto Store",
  description: "Browse our complete collection of auto parts and accessories",
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: {
    category_id?: string
    manufacturer_id?: string
    car_model_id?: string
  }
}) {
  // Extract filter parameters from the URL
  const categoryId = searchParams.category_id ? Number.parseInt(searchParams.category_id) : undefined
  const manufacturerId = searchParams.manufacturer_id ? Number.parseInt(searchParams.manufacturer_id) : undefined
  const carModelId = searchParams.car_model_id ? Number.parseInt(searchParams.car_model_id) : undefined

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">
        {categoryId ? "Category Products" : manufacturerId ? "Brand Products" : "All Products"}
      </h1>

      {/* Show active filters if any */}
      {(categoryId || manufacturerId || carModelId) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Active Filters:</h2>
          <div className="flex flex-wrap gap-2">
            {categoryId && (
              <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">Category ID: {categoryId}</span>
            )}
            {manufacturerId && (
              <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">Brand ID: {manufacturerId}</span>
            )}
            {carModelId && (
              <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">Car Model ID: {carModelId}</span>
            )}
          </div>
        </div>
      )}

      <Suspense fallback={<ProductsGridSkeleton />}>
        <ProductsGrid categoryId={categoryId} manufacturerId={manufacturerId} carModelId={carModelId} />
      </Suspense>
    </div>
  )
}

