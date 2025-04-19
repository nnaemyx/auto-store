"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/api-client"
import { useToast } from "@/hooks/use-toast"

export interface ProductReview {
  id: string
  product_id: string
  user_id: string
  comment: string
  rating: number
  created_at: string
  updated_at: string
  user?: {
    id: string
    name: string
    email: string
  }
}

// Get reviews for a product
export function useProductReviews(productId: string | null) {
  return useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: async (): Promise<ProductReview[]> => {
      if (!productId) return []
      
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication token not found")
        }

        const response = await apiClient.get<ProductReview[]>(`/product/get-review/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        return response || []
      } catch (error) {
        console.error("Error fetching product reviews:", error)
        return []
      }
    },
    enabled: !!productId,
  })
}

// Submit a product review
export function useSubmitProductReview() {
  const queryClient = useQueryClient()
  const { toast, ToastVariant } = useToast()

  return useMutation({
    mutationFn: async (data: {
      product_id: string
      user_id: string
      comment: string
      rating: number
    }) => {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      try {
        const response = await apiClient.post("/product/post-review", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        return response
      } catch (error) {
        console.error("Error submitting product review:", error)
        throw error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", variables.product_id] })
      toast({
        title: "Success",
        description: "Your review has been submitted successfully",
        variant: ToastVariant.Success,
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: ToastVariant.Error,
      })
    },
  })
} 