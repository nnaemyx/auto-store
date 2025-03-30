import { Suspense } from "react"
import type { Metadata } from "next"
import ProductsGridSkeleton from "@/components/products/product-grid-skeleton";
import BrandCategoryProducts from "@/components/brands/brand-category-products";

export const metadata: Metadata = {
  title: "Brand Category Products | Auto Store",
  description: "Browse products by brand and category",
}

export default async function BrandCategoryPage({ params }: { params: Promise<{  brandId: string; categoryId: string  }> }) {
    const {brandId, categoryId} = await params
  const brandid = Number.parseInt(brandId)
  const categoryid = Number.parseInt(categoryId)

  return (
    <Suspense fallback={<ProductsGridSkeleton />}>
      <BrandCategoryProducts brandId={brandid} categoryId={categoryid} />
    </Suspense>
  )
}

