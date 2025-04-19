"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/api-client"
import { useToast } from "@/hooks/use-toast"
import { Product } from "@/types/orders"

export interface ReturnRequest {
  id: string
  order_id: string
  order_item: string
  status: string
  reason: string
  created_at: string
  updated_at: string
  products?: Product[]
  returnStatus?: {
    id: number
    name: string
    description: string
  }
  status_id?: string
  total?: number
  user_id?: string
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

        const response = await apiClient.get<ReturnRequest[]>("/order/get-return-items", {
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
export function useReturnRequest(id: string) {
  const { data: returnRequest, isLoading: isLoadingReturnRequest } = useQuery<ReturnRequest>({
    queryKey: ["return-request", id],
    queryFn: async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      try {
        const response = await apiClient.get<ReturnRequest>(`/order/get-return-items/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response) {
          throw new Error("No response received from server")
        }

        return response
      } catch (error) {
        console.error("Error fetching return request:", error)
        if (error instanceof Error) {
          throw new Error(`API error: ${error.message}`)
        } else {
          throw new Error("Unknown error occurred while fetching return request")
        }
      }
    },
    enabled: !!id,
  })

  // Get the first product from the products array if it exists
  const product = returnRequest?.products && returnRequest.products.length > 0 
    ? returnRequest.products[0] 
    : null

  return {
    returnRequest,
    product,
    isLoading: isLoadingReturnRequest,
    error: null,
  }
}

// Submit a return request
export function useSubmitReturnRequest() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: {
      order_id: string;
      order_item: string;
      reason: string;
    }) => {
      // Validate required fields
      if (!data.order_id) {
        throw new Error("Order ID is required");
      }
      if (!data.order_item) {
        throw new Error("Order item is required");
      }
      if (!data.reason) {
        throw new Error("Return reason is required");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      console.log("Submitting return request with data:", data);
      console.log("Using token:", token.substring(0, 10) + "...");

      try {
        const response = await apiClient.post("/order/return-item", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response) {
          throw new Error("No response received from server");
        }

        console.log("Return request response:", response);
        return response;
      } catch (error) {
        console.error("API error submitting return request:", error);
        if (error instanceof Error) {
          throw new Error(`API error: ${error.message}`);
        } else {
          throw new Error("Unknown error occurred while submitting return request");
        }
      }
    },
    onSuccess: (data) => {
      console.log("Return request submitted successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["returnRequests"] });
      toast({
        title: "Success",
        description: "Return request submitted successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Error submitting return request:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit return request",
      });
    },
  });
}
