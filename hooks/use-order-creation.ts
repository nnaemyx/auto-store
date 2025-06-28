"use client"

import { useMutation } from "@tanstack/react-query"
import { authApiClient } from "@/api/api-client-with-auth"
import { useToast } from "@/hooks/use-toast"

export interface OrderItem {
  product_id: number
  quantity: string
  price: number
  amount: number
}

export interface OrderRequest {
  check_out_id: number
  amount: string
  reference: string
  email: string
  delivery_fee: string
  payment_method: string
  currency: string
  total: number
  payment_reference: string
  payment_verification?: Record<string, unknown> | null
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_postal_code: string
  shipping_phone: string
  shipping_full_name: string
  items: OrderItem[]
  coupon_code?: string
  discount?: number
}

export interface OrderResponse {
  id: number
  user_id: string
  amount: string
  status: string
  created_at: string
  updated_at: string
  delivery_date?: string | null
  order_code: string
  check_out_id: string
  delivery_fee: string
  payment_method: string
  currency: string
  total: number
}

export function useOrderCreation() {
  const { toast, ToastVariant } = useToast()

  return useMutation({
    mutationFn: async (data: OrderRequest): Promise<OrderResponse> => {
      console.log("Creating order with data:", data)
      
      const response = await authApiClient.post<OrderResponse>("/order/create", data)
      
      console.log("Order created successfully:", response)
      return response
    },
    onSuccess: (data) => {
      console.log("Order creation successful:", data)
      toast({
        title: "Order Created",
        description: "Your order has been created successfully",
        variant: ToastVariant.Success,
      })
    },
    onError: (error) => {
      console.error("Order creation error:", error)
      toast({
        title: "Order Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create order",
        variant: ToastVariant.Error,
      })
    },
  })
} 