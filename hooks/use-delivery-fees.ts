"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/api-client"

export interface DeliveryFee {
  id: number
  name: string
  amount: number
  description?: string
}

export function useDeliveryFees() {
  return useQuery({
    queryKey: ["delivery-fees"],
    queryFn: async (): Promise<DeliveryFee[]> => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          // If no token, return default delivery fees
          return [
            { id: 1, name: "Standard Delivery", amount: 1000, description: "Delivery within 5-7 days" },
            { id: 2, name: "Express Delivery", amount: 2000, description: "Delivery within 2-3 days" },
            { id: 3, name: "Premium Delivery", amount: 3000, description: "Next day delivery" },
          ]
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

