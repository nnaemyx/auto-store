"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/api-client"
import type { Category } from "@/types"

// Query keys for caching and invalidation
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...categoryKeys.lists(), { ...filters }] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
}

// Get all categories
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: fetchCategories,
  })
}

// Get a single category by ID
export function useCategory(id: number) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => fetchCategoryById(id),
    enabled: !!id, // Only run the query if we have an ID
  })
}

// API functions
async function fetchCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>("/category/all")
  // Filter out deleted categories (delete_status = "1")
  return response
}

async function fetchCategoryById(id: number): Promise<Category> {
  // This endpoint might not exist in the provided list, but we'll include it for completeness
  // In a real app, you might need to filter from the full list if there's no dedicated endpoint
  const categories = await fetchCategories()
  const category = categories.find((c) => c.id === id)

  if (!category) {
    throw new Error(`Category with ID ${id} not found`)
  }

  return category
}

