"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/api-client"
import type { Product, ProductFilters } from "@/types"

// Query keys for caching and invalidation
export const productTypeKeys = {
  all: ["products", "by-type"] as const,
  lists: () => [...productTypeKeys.all, "list"] as const,
  list: (type: string, filters: ProductFilters = {}) => [...productTypeKeys.lists(), type, { ...filters }] as const,
}

// Get products by type (interior, exterior, etc.)
export function useProductsByType(type: string, filters: ProductFilters = {}) {
  return useQuery({
    queryKey: productTypeKeys.list(type, filters),
    queryFn: () => fetchProductsByType(type, filters),
    enabled: !!type, // Only run the query if we have a type
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

// API function to fetch products by type
async function fetchProductsByType(type: string, filters: ProductFilters = {}): Promise<Product[]> {
  try {
    console.log(`Fetching products for type: ${type}`)

    // Fetch all products first
    const allProducts = await apiClient.get<Product[]>("/product/all")
    console.log(`Total products fetched: ${allProducts.length}`)

    // Filter products by product_type.name (case-insensitive)
    let filteredProducts = allProducts.filter((product: Product) => {
      if (!product.product_type) {
        return false
      }

      const productTypeName = product.product_type.name.toLowerCase()
      const searchType = type.toLowerCase()

      // Map old product types to new ones
      const typeMapping: { [key: string]: string[] } = {
        "universal products": ["interior", "exterior", "universal"],
        "car spare parts": ["spare parts", "parts"]
      }

      // Check if the product type matches any of the mapped types
      return typeMapping[searchType]?.some(mappedType => 
        productTypeName.includes(mappedType)
      ) || productTypeName.includes(searchType)
    })

    console.log(`Found ${filteredProducts.length} products matching type: ${type}`)

    // Apply client-side filters if needed
    if (filters.price_min !== undefined) {
      filteredProducts = filteredProducts.filter((p) => Number.parseFloat(p.amount) >= filters.price_min!)
    }

    if (filters.price_max !== undefined) {
      filteredProducts = filteredProducts.filter((p) => Number.parseFloat(p.amount) <= filters.price_max!)
    }

    if (filters.manufacturer_id) {
      filteredProducts = filteredProducts.filter(
        (p) => p.manufacturer_id && Number.parseInt(p.manufacturer_id) === filters.manufacturer_id,
      )
    }

    // Sort products
    if (filters.sort_by) {
      const sortOrder = filters.sort_order === "desc" ? -1 : 1

      filteredProducts.sort((a, b) => {
        if (filters.sort_by === "price") {
          return sortOrder * (Number.parseFloat(a.amount) - Number.parseFloat(b.amount))
        }
        if (filters.sort_by === "name") {
          return sortOrder * a.name.localeCompare(b.name)
        }
        return 0
      })
    }

    // Process images to get full URLs
    return filteredProducts.map((product) => ({
      ...product,
      images: product.images.map((img) => ({
        ...img,
        image: getImageUrl(img.image),
      })),
    }))
  } catch (error) {
    console.error(`Error fetching ${type} products:`, error)
    return []
  }
}

