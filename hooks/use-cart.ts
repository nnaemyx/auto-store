"use client"

import React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/api-client"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"



// Helper functions to safely access localStorage (only in browser)
const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

const getLocalCart = (): { items: CartItem[] } | null => {
  if (typeof window === "undefined") return null
  const cartData = localStorage.getItem("cart")
  return cartData ? JSON.parse(cartData) : null
}

const setLocalCart = (cart: { items: CartItem[] }): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("cart", JSON.stringify(cart))
}

const clearLocalCart = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("cart")
}

// Types for cart items
export interface CartItemImage {
  id: number
  product_id: string
  image: string
}

export interface CartItemCategory {
  id: number
  name: string
  image: string
  description: string
}

export interface CartItemBrand {
  id: number
  name: string
  logo: string
  description: string
}

export interface CartItemCarModel {
  id: number
  name: string
  manufacturer_id: string
  image: string
  description: string
}

export interface CartItem {
  id: number
  name: string
  category_id: string
  manufacturer_id: string
  car_model_id: string
  description: string
  amount: number
  quantity: string
  rating: string
  product_status_id: string
  code: string
  promotion_id: string
  user_id: string
  images: CartItemImage[]
  price: number
  cart_id: number
  category: CartItemCategory
  brand: CartItemBrand
  car_model: CartItemCarModel
}

export interface CartResponse {
  status: string
  items: CartItem[]
}

// Query keys for caching and invalidation
const cartKeys = {
  all: ["cart"] as const,
  items: () => [...cartKeys.all, "items"] as const,
  item: (id: number) => [...cartKeys.items(), id] as const,
}

// Hook for cart operations
export function useCart() {
  const queryClient = useQueryClient()
  const { toast, ToastVariant } = useToast()
  const router = useRouter();

  // Fetch cart items
  const {
    data,
    isLoading,
    isError,
    error,
  }: {
    data: CartResponse | undefined
    isLoading: boolean
    isError: boolean
    error: unknown
  } = useQuery<CartResponse, unknown, CartResponse, ReturnType<typeof cartKeys.items>>({
    queryKey: cartKeys.items(),
    queryFn: fetchCart,
    // Disable automatic refetching to prevent quantity doubling issues
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 30000, // Consider data fresh for 30 seconds
  })

  // Sync localStorage with server data when it changes
  React.useEffect(() => {
    if (data && data.items) {
      setLocalCart({ items: data.items as CartItem[] })
    }
  }, [data])

  // Calculate cart summary
  const cartSummary = React.useMemo(() => {
    if (!data?.items) return { subtotal: 0, tax: 0, shipping_fee: 0, total: 0 }

    const subtotal = data.items.reduce((sum, item) => {
      const quantity = Number(item.quantity || 1);
      return sum + (item.price * quantity);
    }, 0)
    const tax = subtotal * 0.075 // Assuming 7.5% tax
    const shipping_fee = subtotal > 0 ? 1000 : 0 // Flat shipping fee if cart has items
    const total = subtotal + tax + shipping_fee

    return { subtotal, tax, shipping_fee, total }
  }, [data])

  // Add item to cart mutation
  const addToCart = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      addItemToCart(productId, quantity, router, toast, ToastVariant),
    onMutate: async ({ productId, quantity }) => {
      // Cancel any outgoing refetches to prevent conflicts
      await queryClient.cancelQueries({ queryKey: cartKeys.items() })

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData<CartResponse>(cartKeys.items())

      // Optimistically update localStorage
      const localCart = getLocalCart() || { items: [] }
      const existingItemIndex = localCart.items.findIndex((item) => item.id === productId)

      if (existingItemIndex >= 0) {
        // Update existing item with the exact new quantity
        localCart.items[existingItemIndex].quantity = quantity.toString()
      } else {
        // This is a simplified approach - in a real app, you'd need more product details
        console.log("Adding new item to cart - note: this is just a localStorage update")
      }

      setLocalCart(localCart)

      // Also update the query cache
      if (previousCart && previousCart.items) {
        const updatedItems = [...previousCart.items]
        const existingItemIndex = updatedItems.findIndex((item) => item.id === productId)

        if (existingItemIndex >= 0) {
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: quantity.toString(),
          }
        }

        queryClient.setQueryData(cartKeys.items(), {
          ...previousCart,
          items: updatedItems,
        })
      }

      return { previousCart }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
      toast({
        title: "Item added to cart",
        description: "The item has been added to your cart",
        variant: ToastVariant.Success,
      })
    },
    onError: (error, _, context) => {
      // Revert to previous state on error
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.items(), context.previousCart)
        setLocalCart({ items: context.previousCart.items })
      }

      toast({
        title: "Failed to add item",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: ToastVariant.Error,
      })
    },
  })

  // Add a new mutation for local quantity updates
  const updateLocalQuantity = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      const previousCart = queryClient.getQueryData<CartResponse>(cartKeys.items())
      if (!previousCart) return

      const updatedItems = previousCart.items.map(item => 
        item.id === productId 
          ? { ...item, quantity: quantity.toString() }
          : item
      )

      const updatedCart = {
        ...previousCart,
        items: updatedItems
      }

      queryClient.setQueryData(cartKeys.items(), updatedCart)
      setLocalCart({ items: updatedItems })
      return updatedCart
    }
  })

  // Remove item from cart mutation
  const removeFromCart = useMutation({
    mutationFn: (cartId: number) => removeItemFromCart(cartId),
    onMutate: async (cartId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: cartKeys.items() })

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData<CartResponse>(cartKeys.items())

      // Optimistically update the cart
      if (previousCart && previousCart.items) {
        const updatedItems = previousCart.items.filter((item) => item.cart_id !== cartId)
        const updatedCart = { ...previousCart, items: updatedItems }

        queryClient.setQueryData(cartKeys.items(), updatedCart)

        // Update localStorage
        setLocalCart({ items: updatedItems })
      }

      return { previousCart }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart",
        variant: ToastVariant.Success,
      })
    },
    onError: (error, _, context) => {
      // Revert to previous state on error
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.items(), context.previousCart)
        setLocalCart({ items: context.previousCart.items })
      }

      toast({
        title: "Failed to remove item",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: ToastVariant.Error,
      })
    },
  })

  // Clear cart mutation - using the proper API endpoint
  const clearCart = useMutation({
    mutationFn: async () => {
      const token = getToken()

      if (!token) {
        // If no token, just rely on localStorage and return success
        clearLocalCart()
        return { success: true }
      }

      // Use the dedicated clear-all endpoint
      try {
        const response = await apiClient.delete("/cart/clear-all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Clear local storage cart
        clearLocalCart()

        return response || { success: true }
      } catch (error) {
        console.error("Error clearing cart:", error)
        throw error
      }
    },
    onMutate: async () => {
      // Cancel any outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey: cartKeys.items() })

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData<CartResponse>(cartKeys.items())

      // Optimistically update to an empty cart
      queryClient.setQueryData(cartKeys.items(), { status: "successful", items: [] })

      // Clear localStorage cart
      clearLocalCart()

      // Return a context object with the snapshotted value
      return { previousCart }
    },
    onError: (err, _, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.items(), context.previousCart)
        setLocalCart({ items: context.previousCart.items })
      }

      toast({
        title: "Failed to clear cart",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: ToastVariant.Error,
      })
    },
    onSuccess: () => {
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
        variant: ToastVariant.Success,
      })
    },
    onSettled: () => {
      // Always refetch after error or success to make sure the server state
      // matches the client state
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
    },
  })

  return {
    cart: {
      cart_items: data?.items || [],
      summary: cartSummary,
    },
    isLoading,
    isError,
    error,
    addToCart: addToCart.mutate,
    updateQuantity: updateLocalQuantity.mutate, // Use local update by default
    removeFromCart: removeFromCart.mutate,
    clearCart: clearCart.mutate,
    isAddingToCart: addToCart.isPending,
    isUpdatingQuantity: updateLocalQuantity.isPending,
    isRemovingFromCart: removeFromCart.isPending,
    isClearingCart: clearCart.isPending,
  }
}

// API functions
async function fetchCart(): Promise<CartResponse> {
  const token = getToken()

  if (!token) {
    // If no token, return the cart from localStorage
    const localCart = getLocalCart()
    return localCart ? { status: "successful", items: localCart.items } : { status: "successful", items: [] }
  }

  try {
    const response = await apiClient.get<CartResponse>("/cart/get-cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error) {
    console.error("Error fetching cart:", error)

    // Fallback to localStorage on API error
    const localCart = getLocalCart()
    return localCart ? { status: "successful", items: localCart.items } : { status: "successful", items: [] }
  }
}

async function addItemToCart(
  productId: number,
  quantity: number,
  router: ReturnType<typeof useRouter>,
  toast: ReturnType<typeof useToast>["toast"],
  ToastVariant: ReturnType<typeof useToast>["ToastVariant"]
): Promise<{ success: boolean }> {
  const token = getToken();

  if (!token) {
    // Show a toast message prompting the user to log in
    toast({
      title: "Authentication Required",
      description: "Please log in to add items to your cart.",
      variant: ToastVariant.Error, // Assuming "error" is the correct variant
    });

    // Navigate to the login page
    router.push("/auth/login");
        // Throw an error to prevent onSuccess from being called
        throw new Error("User not logged in");
  }

  return apiClient.post(
    "/cart/add-product",
    {
      id: productId,
      quantity: quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

async function removeItemFromCart(cartId: number): Promise<{ success: boolean }> {
  const token = getToken()

  if (!token) {
    // If no token, just return success and rely on localStorage
    return { success: true }
  }

  return apiClient.delete(`/cart/delete-cart/${cartId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

