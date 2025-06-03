"use client"

import { useQuery } from "@tanstack/react-query"

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
    // Return the new product types
    return ["Universal Products", "Car Spare Parts"]
  } catch (error) {
    console.error("Error fetching product types:", error)
    return []
  }
} 