"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/api-client"

export interface OrderItem {
  id: number
  order_id: string
  product_id: string
  quantity: string
  price: string
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

export interface OrderStatus {
  id: number
  name: string
  description: string
}

export interface OrderMetadata {
  amount: number
  reference: number
  email: string
  check_out_id: number
  delivery_fee: string
  order_code: number
  user_id: number
}

export interface OrderShipping {
  address: string
  city: string
  state: string
  postal_code: string
}

export interface Order {
  id: number
  reference?: string
  amount: string
  status: string
  created_at?: string
  updated_at?: string
  delivery_date?: string | null
  order_code: string
  check_out_id: string
  delivery_fee: string
  payment_method: string
  user_id: string
  currency?: string
  metadata?: OrderMetadata
  orderStatus?: OrderStatus
  products?: OrderItem[]
  items?: OrderItem[]
  shipping?: OrderShipping
}

// Function to format date for display
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A"

  try {
    // Check if the date is valid
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return "N/A"
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "N/A"
  }
}

// Get order status with appropriate color
export function getOrderStatusColor(status: string | OrderStatus | undefined): string {
  if (!status) return "text-gray-500"

  // If status is an object (OrderStatus), use its name
  const statusName = typeof status === "object" ? status.name.toLowerCase() : status.toLowerCase()

  switch (statusName) {
    case "delivered":
      return "text-green-500"
    case "new order":
      return "text-blue-500"
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

        // Handle null response or empty array
        if (!response) return []

        // Ensure each order has an id to prevent "property id on null" error
        return response.filter((order) => order && order.id) || []
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
        if (!id) throw new Error("No order ID provided")

        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication token not found")
        }

        const response = await apiClient.get<Order>(`/order/view-order-details/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Normalize the response to ensure items is always available
        // Some APIs return 'products', others return 'items'
        if (response) {
          if (response.products && !response.items) {
            response.items = response.products
          } else if (response.items && !response.products) {
            response.products = response.items
          } else if (!response.items && !response.products) {
            response.items = []
            response.products = []
          }
        }

        return response
      } catch (error) {
        console.error(`Error fetching order #${id}:`, error)
        throw error
      }
    },
    enabled: !!id, // Only run query if ID is provided
  })
}

// Custom hook to get product details for an order
export function useOrderProduct(productId: string | undefined) {
  return useQuery({
    queryKey: ["orderProduct", productId],
    queryFn: async () => {
      if (!productId) throw new Error("No product ID provided")

      try {
        const response = await apiClient.get(`/product/get-product/${productId}`)
        return response
      } catch (error) {
        console.error(`Error fetching product #${productId}:`, error)
        throw error
      }
    },
    enabled: !!productId,
  })
}
