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
      
      const response = await authApiClient.post<Record<string, unknown>>("/cart/check-out", data)
      
      console.log("Raw checkout API response:", response)
      console.log("Response type:", typeof response)
      console.log("Response keys:", Object.keys(response))
      console.log("Response stringified:", JSON.stringify(response, null, 2))
      
      // Check if response has the expected structure
      if (!response) {
        throw new Error("No response received from checkout API")
      }
      
      // Handle different possible response structures
      let checkoutData: CheckoutResponse
      
      if ('id' in response && response.id) {
        // Direct response with id
        checkoutData = response as unknown as CheckoutResponse
      } else if ('check_out_id' in response && response.check_out_id) {
        // API returns check_out_id instead of id (this is your case)
        console.log("Found check_out_id in response:", response.check_out_id)
        checkoutData = {
          id: response.check_out_id as number,
          user_id: (response.user_id as string) || data.user_id,
          name: data.name, // Use request data since response doesn't have name
          phone_number: data.phone_number,
          email: (response.email as string) || data.email,
          alt_phone_number: data.alt_phone_number,
          state: data.state,
          address: data.address,
          town: data.town,
          postal_code: data.postal_code,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as CheckoutResponse
      } else if ('data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
        // Response wrapped in data object
        checkoutData = response.data as unknown as CheckoutResponse
      } else if ('checkout' in response && response.checkout && typeof response.checkout === 'object' && 'id' in response.checkout) {
        // Response wrapped in checkout object
        checkoutData = response.checkout as unknown as CheckoutResponse
      } else if ('message' in response && 'status' in response) {
        // API might return success message without data
        console.log("API returned success message:", response.message)
        // Create a minimal checkout response with generated ID
        checkoutData = {
          id: Date.now(), // Generate a temporary ID
          user_id: data.user_id,
          name: data.name,
          phone_number: data.phone_number,
          email: data.email,
          alt_phone_number: data.alt_phone_number,
          state: data.state,
          address: data.address,
          town: data.town,
          postal_code: data.postal_code,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as CheckoutResponse
      } else {
        // Log the full response for debugging
        console.error("Unexpected checkout response structure:", JSON.stringify(response, null, 2))
        throw new Error("Checkout response missing ID field. Response structure: " + JSON.stringify(response))
      }
      
      console.log("Processed checkout data:", checkoutData)
      return checkoutData
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