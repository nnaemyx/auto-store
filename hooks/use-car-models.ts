"use client"

import { useQuery } from "@tanstack/react-query"
import { authApiClient } from "@/api/api-client-with-auth"

interface CarModel {
  id: string
  name: string
}

// Query keys for caching and invalidation
export const carModelKeys = {
  all: ["car-models"] as const,
  lists: () => [...carModelKeys.all, "list"] as const,
  list: (manufacturerId: string) => [...carModelKeys.lists(), manufacturerId] as const,
}

// Get car models by manufacturer ID
export function useCarModels(manufacturerId?: string) {
  console.log("useCarModels called with manufacturerId:", manufacturerId)
  
  return useQuery({
    queryKey: carModelKeys.list(manufacturerId || ""),
    queryFn: () => fetchCarModels(manufacturerId!),
    enabled: !!manufacturerId,
  })
}

// API function
async function fetchCarModels(manufacturerId: string): Promise<CarModel[]> {
  console.log("fetchCarModels called with manufacturerId:", manufacturerId)
  try {
    // Try the original endpoint first
    const response = await authApiClient.get<{ carModels: CarModel[] } | CarModel[]>(`/get-car-models/${manufacturerId}`)
    console.log("fetchCarModels response:", response)
    
    // Handle the response structure - car models might be nested under 'carModels' property
    if ('carModels' in response && Array.isArray(response.carModels)) {
      return (response as { carModels: CarModel[] }).carModels
    } else if (Array.isArray(response)) {
      return response
    } else {
      console.error("Unexpected response structure:", response)
      return []
    }
  } catch (error) {
    console.error("fetchCarModels error with /get-car-models:", error)
    
    // If that fails, try alternative endpoint formats
    try {
      const response = await authApiClient.get<{ carModels: CarModel[] } | CarModel[]>(`/car-models/${manufacturerId}`)
      console.log("fetchCarModels response (alternative):", response)
      
      // Handle the response structure for alternative endpoint
      if ('carModels' in response && Array.isArray(response.carModels)) {
        return (response as { carModels: CarModel[] }).carModels
      } else if (Array.isArray(response)) {
        return response
      } else {
        console.error("Unexpected response structure (alternative):", response)
        return []
      }
    } catch (error2) {
      console.error("fetchCarModels error with /car-models:", error2)
      throw error2
    }
  }
} 