"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/api-client"

export interface OrderItem {
  id: number
  product_id: number
  order_id: number
  quantity: number
  amount: number
  product: {
    id: number
    name: string
    description: string
    amount: string
    images: {
      id: number
      product_id: string
      image: string
    }[]
  }
}

export interface Order {
  id: number
  reference: string
  amount: number
  status: string
  created_at: string
  updated_at: string
  delivery_date?: string
  items: OrderItem[]
  shipping?: {
    address: string
    city: string
    state: string
    postal_code: string
  }
}

// Function to format date for display
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

// Get order status with appropriate color
export function getOrderStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "delivered":
      return "text-green-500"
    case "processing":
      return "text-blue-500"
    case "shipped":
      return "text-purple-500"
    case "pending":
      return "text-yellow-500"
    case "cancelled":
      return "text-red-500"
    default:
      return "text-gray-500"
  }
}

// Get all orders
export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async (): Promise<Order[]> => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication token not found")
        }

        const response = await apiClient.get<Order[]>("/order/view-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        return response || []
      } catch (error) {
        console.error("Error fetching orders:", error)
        return []
      }
    },
  })
}

// Get a single order
export function useOrder(id: string | number) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async (): Promise<Order> => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication token not found")
        }

        const response = await apiClient.get<Order>(`/order/view-order-details/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        return response
      } catch (error) {
        console.error(`Error fetching order #${id}:`, error)
        throw error
      }
    },
    enabled: !!id, // Only run query if ID is provided
  })
}

