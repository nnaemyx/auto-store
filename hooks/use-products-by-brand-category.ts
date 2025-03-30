"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/api-client"
import type { Product } from "@/types"

// Query keys for caching and invalidation
export const productKeys = {
  byBrandCategory: (brandId: number, categoryId: number) =>
    ["products", "brand", brandId, "category", categoryId] as const,
}

// Get products by brand and category
export function useProductsByBrandCategory(brandId: number, categoryId: number) {
  return useQuery({
    queryKey: productKeys.byBrandCategory(brandId, categoryId),
    queryFn: () => fetchProductsByBrandCategory(brandId, categoryId),
    enabled: !!brandId && !!categoryId, // Only run the query if we have both IDs
  })
}

// Helper function to get the full image URL
function getImageUrl(imagePath: string): string {
  if (!imagePath) return "/placeholder.svg?height=200&width=200"

  // If it's already a full URL, return it
  if (imagePath.startsWith("http")) return imagePath

  // Otherwise, prepend the API base URL
  return `${process.env.NEXT_PUBLIC_API_URL}/${imagePath}`
}

// API function
async function fetchProductsByBrandCategory(brandId: number, categoryId: number): Promise<Product[]> {
  const response = await apiClient.get<Product[]>(`/product/product-brand-category/${brandId}/${categoryId}`)

  // Filter out deleted products (delete_status = "1")
  const filteredProducts = response.filter((product) => product.delete_status === "2")

  // Process images to get full URLs
  return filteredProducts.map((product) => ({
    ...product,
    images: product.images.map((img) => ({
      ...img,
      image: getImageUrl(img.image),
    })),
  }))
}

