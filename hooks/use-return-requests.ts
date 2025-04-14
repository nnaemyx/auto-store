"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/api-client"
import { useToast } from "@/hooks/use-toast"

export interface ReturnRequest {
  id: number
  order_id: string
  order_item: string
  reason: string
  status: string
  created_at: string
  images?: string[]
  product?: {
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

// Get all return requests
export function useReturnRequests() {
  return useQuery({
    queryKey: ["returnRequests"],
    queryFn: async (): Promise<ReturnRequest[]> => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication token not found")
        }

        const response = await apiClient.get<ReturnRequest[]>("/order/return-requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        return response || []
      } catch (error) {
        console.error("Error fetching return requests:", error)
        return []
      }
    },
  })
}

// Get a single return request
export function useReturnRequest(id: string | number) {
  return useQuery({
    queryKey: ["returnRequest", id],
    queryFn: async (): Promise<ReturnRequest> => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication token not found")
        }

        const response = await apiClient.get<ReturnRequest>(`/order/return-request/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        return response
      } catch (error) {
        console.error(`Error fetching return request #${id}:`, error)
        throw error
      }
    },
    enabled: !!id, // Only run query if ID is provided
  })
}

// Submit a return request
export function useSubmitReturnRequest() {
  const queryClient = useQueryClient()
  const { toast, ToastVariant } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const mutation = useMutation({
    mutationFn: async (data: { order_id: string; order_item: string; reason: string }) => {
      setIsSubmitting(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication token not found")
        }

        const response = await apiClient.post("/order/return-item", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        return response
      } catch (error) {
        console.error("Error submitting return request:", error)
        throw error
      } finally {
        setIsSubmitting(false)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returnRequests"] })
      toast({
        title: "Return Request Submitted",
        description: "Your return request has been submitted successfully.",
        variant: ToastVariant.Success,
      })
    },
    onError: (error) => {
      toast({
        title: "Failed to Submit Return Request",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: ToastVariant.Error,
      })
    },
  })

  return {
    submitReturnRequest: mutation.mutate,
    isSubmitting,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  }
}
