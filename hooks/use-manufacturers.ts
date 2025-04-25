"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/api-client"
import type { Manufacturer } from "@/types"

// Query keys for caching and invalidation
export const manufacturerKeys = {
  all: ["manufacturers"] as const,
  lists: () => [...manufacturerKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...manufacturerKeys.lists(), { ...filters }] as const,
  details: () => [...manufacturerKeys.all, "detail"] as const,
  detail: (id: number) => [...manufacturerKeys.details(), id] as const,
}

// Get all manufacturers
export function useManufacturers() {
  return useQuery({
    queryKey: manufacturerKeys.lists(),
    queryFn: fetchManufacturers,
  })
}

// Get a single manufacturer by ID
export function useManufacturer(id: number) {
  return useQuery({
    queryKey: manufacturerKeys.detail(id),
    queryFn: () => fetchManufacturerById(id),
    enabled: !!id, 
  })
}

// API functions
async function fetchManufacturers(): Promise<Manufacturer[]> {
  const response = await apiClient.get<Manufacturer[]>("/manufacturer/all")
  return response
}

async function fetchManufacturerById(id: number): Promise<Manufacturer> {
  const manufacturers = await fetchManufacturers()
  const manufacturer = manufacturers.find((m) => m.id === id)

  if (!manufacturer) {
    throw new Error(`Manufacturer with ID ${id} not found`)
  }

  return manufacturer
}

