"use client"

import { useMutation } from "@tanstack/react-query"
import { authApiClient } from "@/api/api-client-with-auth"
import { useToast } from "@/hooks/use-toast"
import { CartItem } from "@/hooks/use-cart"

export interface CheckoutDetails {
  firstName: string
  lastName: string
  email?: string
  phoneNumber: string
  alt_phoneNumber: string
  houseAddress: string
  stateOfResidence: string
  postalCode: string
  townCity: string
  alternatePhone?: string
}

export interface CheckoutRequest {
  user_id: string
  name: string
  phone_number: string
  email: string
  alt_phone_number?: string
  state: string
  address: string
  town: string
  postal_code: string
  items: CartItem[]
  subtotal: number
  delivery_fee: number
  total_amount: number
  coupon_code?: string
  discount?: number
}

export interface CheckoutResponse {
  id: number
  user_id: string
  name: string
  phone_number: string
  email: string
  alt_phone_number?: string
  state: string
  address: string
  town: string
  postal_code: string
  created_at: string
  updated_at: string
}

export function useCheckout() {
  const { toast, ToastVariant } = useToast()

  return useMutation({
    mutationFn: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
      console.log("Creating checkout with data:", data)
      
      const response = await authApiClient.post<CheckoutResponse>("/cart/check-out", data)
      
      console.log("Checkout created successfully:", response)
      return response
    },
    onSuccess: (data) => {
      console.log("Checkout successful:", data)
      toast({
        title: "Checkout Created",
        description: "Your checkout has been created successfully",
        variant: ToastVariant.Success,
      })
    },
    onError: (error) => {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : "Failed to create checkout",
        variant: ToastVariant.Error,
      })
    },
  })
} 