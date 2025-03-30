import { Suspense } from "react"
import type { Metadata } from "next"
import ProductsGridSkeleton from "@/components/products/product-grid-skeleton"
import BrandProducts from "@/components/brands/brands-products"

export const metadata: Metadata = {
  title: "Brand Products | Auto Store",
  description: "Browse products by brand",
}

export default async function BrandPage({ params }: { params: { id: string } }) {
    const { id } = await params
  const brandId = Number.parseInt(id)

  return (
    <Suspense fallback={<ProductsGridSkeleton />}>
      <BrandProducts brandId={brandId} />
    </Suspense>
  )
}

