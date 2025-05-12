"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/api-client"
import type { Product } from "@/types"

// Query keys for caching and invalidation
export const productTypeKeys = {
  all: ["product-types"] as const,
  lists: () => [...productTypeKeys.all, "list"] as const,
}

// Get all product types
export function useProductTypes() {
  return useQuery({
    queryKey: productTypeKeys.lists(),
    queryFn: fetchProductTypes,
  })
}

// API function to fetch product types
async function fetchProductTypes() {
  try {
    // Fetch all products first
    const allProducts = await apiClient.get<Product[]>("/product/all")
    
    // Extract unique product types
    const productTypes = new Set<string>()
    allProducts.forEach((product) => {
      if (product.product_type?.name) {
        productTypes.add(product.product_type.name)
      }
    })

    // Convert Set to array and sort alphabetically
    return Array.from(productTypes).sort()
  } catch (error) {
    console.error("Error fetching product types:", error)
    return []
  }
} 