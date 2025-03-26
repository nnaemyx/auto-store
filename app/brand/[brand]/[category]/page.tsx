import type { Metadata } from "next"
import ProductCategoryPage from "@/components/product-category-page"

export const metadata: Metadata = {
  title: "Product Category | Auto Store",
  description: "Browse products by category",
}

export default async function CategoryPage({
  params,
}: {
  params: { brand: string; category: string }
}) {
  // Format brand and category names for display
  const brand = params.brand.charAt(0).toUpperCase() + params.brand.slice(1)
  const category = params.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  // Here you could fetch data based on the params if needed
  // const products = await fetchProductsByCategory(params.brand, params.category)

  return (
    <ProductCategoryPage
      brand={params.brand}
      brandDisplay={brand}
      category={params.category}
      categoryDisplay={category}
    />
  )
}

