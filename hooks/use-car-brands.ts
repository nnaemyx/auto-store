"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/api-client"

export interface CarBrand {
  id: number
  name: string
  logo: string
  description: string
  delete_status: string
}

export function useCarBrands() {
  return useQuery({
    queryKey: ["car-brands"],
    queryFn: async (): Promise<CarBrand[]> => {
      try {
        // Fetch manufacturers directly from the manufacturer API
        const manufacturers = await apiClient.get<CarBrand[]>("/manufacturer/all")

        // Filter out deleted manufacturers and sort by name
        return manufacturers.filter((brand) => brand.delete_status === "2").sort((a, b) => a.name.localeCompare(b.name))
      } catch (error) {
        console.error("Error fetching car brands:", error)
        return []
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  })
}

