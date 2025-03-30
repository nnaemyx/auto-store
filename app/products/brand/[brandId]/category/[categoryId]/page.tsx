import { Suspense } from "react"
import type { Metadata } from "next"
import ProductsGridSkeleton from "@/components/products/product-grid-skeleton";
import BrandCategoryProducts from "@/components/brands/brand-category-products";

export const metadata: Metadata = {
  title: "Brand Category Products | Auto Store",
  description: "Browse products by brand and category",
}

export default function BrandCategoryPage({ params }: { params: { brandId: string; categoryId: string } }) {
  const brandId = Number.parseInt(params.brandId)
  const categoryId = Number.parseInt(params.categoryId)

  return (
    <Suspense fallback={<ProductsGridSkeleton />}>
      <BrandCategoryProducts brandId={brandId} categoryId={categoryId} />
    </Suspense>
  )
}

