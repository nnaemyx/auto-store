"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/api-client"

export interface CarModel {
  id: number
  name: string
  manufacturer_id: string
  image: string
  description: string
}

export function useCarModels(brandId?: string) {
  return useQuery({
    queryKey: ["car-models", brandId],
    queryFn: async (): Promise<CarModel[]> => {
      try {
        if (!brandId) return []

        // Fetch all products
        interface Product {
          id: number
          name: string
          manufacturer_id: string
          brand: {
            id: number
            name: string
            manufacturer_id: string
            image: string
            description: string
          }
        }

        const products = await apiClient.get<Product[]>("/product/all")

        // Filter products by manufacturer_id and extract unique car models
        const filteredProducts = products.filter((product: Product) => product.manufacturer_id === brandId)

        // Extract unique car models from filtered products
        const modelsMap = new Map()

        filteredProducts.forEach((product: Product) => {
          if (product.brand && !modelsMap.has(product.brand.id)) {
            modelsMap.set(product.brand.id, {
              id: product.brand.id,
              name: product.brand.name,
              manufacturer_id: product.brand.manufacturer_id,
              image: product.brand.image,
              description: product.brand.description,
            })
          }
        })

        // Convert map to array
        return Array.from(modelsMap.values())
      } catch (error) {
        console.error("Error fetching car models:", error)
        return []
      }
    },
    enabled: !!brandId, // Only run query if brandId is provided
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  })
}

