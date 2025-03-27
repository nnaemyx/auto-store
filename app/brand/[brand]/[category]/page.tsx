import type { Metadata } from "next"
import ProductCategoryPage from "@/components/products/product-category-page"

export const metadata: Metadata = {
  title: "Product Category | Auto Store",
  description: "Browse products by category",
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ brand: string; category: string }>
}) {
  // Await the params to resolve the promise
  const { brand, category } = await params

  // Format brand and category names for display
  const brandDisplay = brand.charAt(0).toUpperCase() + brand.slice(1)
  const categoryDisplay = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  // Here you could fetch data based on the params if needed
  // const products = await fetchProductsByCategory(brand, category)

  return (
    <ProductCategoryPage
      brand={brand}
      brandDisplay={brandDisplay}
      category={category}
      categoryDisplay={categoryDisplay}
    />
  )
}