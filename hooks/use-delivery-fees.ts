"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/api-client"

export interface DeliveryFee {
  id: number
  name: string
  amount: number
  description?: string
  location: string
  weight_range: {
    min: number
    max: number
  }
}

export function useDeliveryFees() {
  return useQuery({
    queryKey: ["delivery-fees"],
    queryFn: async (): Promise<DeliveryFee[]> => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication required")
        }

        const response = await apiClient.get<DeliveryFee[]>("/cart/get-delivery-fee", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        return response || []
      } catch (error) {
        console.error("Error fetching delivery fees:", error)
        return []
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  })
}

