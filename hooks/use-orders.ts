"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/api-client"
import { useState, useEffect } from "react"
import { Product as OrdersProduct } from "@/types/orders"

export interface OrderItem {
  id: number
  name: string
  category_id: string
  subcategory_id: string
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
  created_at?: string
  images: {
    id: number
    product_id: string
    image: string
  }[]
  price: number
  cart_id: number
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

export interface CheckOut {
  id: number
  user_id: string
  full_name: string
  phone_number: string
  email: string
  alt_phone_number?: string
  state: string
  address: string
  town: string
  postal_code: string
}

export interface TimelineItem {
  id: number
  order_id: string
  order_status_id: string
  status: OrderStatus
}

export interface Order {
  id: number
  user_id: string
  amount: string
  status: string
  created_at?: string
  updated_at?: string
  delivery_date?: string | null
  order_code: string
  check_out_id: string
  delivery_fee: string
  payment_method: string
  currency: string
  total: number
  orderStatus: OrderStatus
  checkOut: CheckOut
  timeline: TimelineItem[]
  products: OrderItem[]
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
    case "order processing":
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

        if (!response) return []

        // Transform the response to ensure all required fields are present
        return response.map(order => ({
          ...order,
          // Ensure status is properly handled (converting from number to string if needed)
          status: order.orderStatus?.name || order.status.toString(),
          // Ensure products array exists
          products: order.products || [],
          // Ensure items matches products for compatibility
          items: order.products || []
        }))
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

        console.log("useOrder - fetching order with ID:", id);

        const response = await apiClient.get<Order>(`/order/view-order-details/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response) {
          throw new Error("No response received")
        }

        console.log("useOrder - raw response:", response);

        // Transform the response to match our needs
        const transformedOrder = {
          ...response,
          id: response.id,
          user_id: response.user_id || "",
          amount: response.amount || "0",
          order_code: response.order_code || "",
          status: response.orderStatus?.name || (response.status ? response.status.toString() : "Unknown"),
          delivery_fee: response.delivery_fee || "0",
          delivery_date: response.delivery_date || null,
          payment_method: response.payment_method || "Unknown",
          currency: response.currency || "USD",
          total: response.total || 0,
          check_out_id: response.check_out_id || "",
          orderStatus: response.orderStatus || { id: 0, name: "Unknown", description: "" },
          checkOut: response.checkOut || null,
          timeline: response.timeline || [],
          products: Array.isArray(response.products) ? response.products : [],
        };

        console.log("useOrder - transformed order:", transformedOrder);
        return transformedOrder;
      } catch (error) {
        console.error(`Error fetching order #${id}:`, error)
        throw error
      }
    },
    enabled: !!id,
  })
}

// Custom hook to get product details for an order
export function useOrderProduct(
  productId: string | null, 
  orderProducts?: Array<{
    id: number;
    name: string;
    description: string;
    images: Array<{ id: number; product_id: string; image: string; created_at?: string; updated_at?: string }>;
    price: number;
    amount?: string | number;
    quantity?: string;
    [key: string]: unknown;
  }>
) {
  const [error, setError] = useState<Error | null>(null);
  const [product, setProduct] = useState<OrdersProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log("useOrderProduct - productId:", productId);
      console.log("useOrderProduct - orderProducts:", orderProducts);
      
      if (orderProducts && orderProducts.length > 0) {
        // Find the product in the provided products array
        const foundProduct = orderProducts.find(p => p.id.toString() === productId);
        
        console.log("useOrderProduct - foundProduct:", foundProduct);
        
        if (foundProduct) {
          // Create a product object that matches the OrdersProduct type
          const validProduct: OrdersProduct = {
            id: foundProduct.id,
            name: foundProduct.name || "Product",
            description: foundProduct.description || "No description available",
            images: foundProduct.images.map(img => ({
              id: img.id,
              product_id: img.product_id,
              image: img.image,
              created_at: img.created_at || new Date().toISOString(),
              updated_at: img.updated_at || new Date().toISOString()
            })),
            price: foundProduct.price || 0,
            amount: String(foundProduct.amount || 0),
            quantity: foundProduct.quantity || "1",
            category_id: (foundProduct.category_id as string) || "",
            manufacturer_id: (foundProduct.manufacturer_id as string) || "",
            car_model_id: (foundProduct.car_model_id as string) || "",
            rating: (foundProduct.rating as string) || "0",
            product_status_id: (foundProduct.product_status_id as string) || "",
            code: (foundProduct.code as string) || "",
            promotion_id: (foundProduct.promotion_id as string) || "",
            user_id: (foundProduct.user_id as string) || "",
            delete_status: String(foundProduct.delete_status || "0"),
            created_at: String(foundProduct.created_at || new Date().toISOString()),
            updated_at: String(foundProduct.updated_at || new Date().toISOString()),
            category: {
              id: 0,
              name: "",
              description: "",
              image: "",
              delete_status: "0",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            status: {
              id: 0,
              name: "",
              description: "",
              delete_status: "0",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            sub_category: {
              id: 0,
              name: "",
              description: "",
              image: "",
              delete_status: "0",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            promotion: {
              id: 0,
              name: "",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              discount: "0",
              status: "inactive",
              image: "",
              delete_status: "0"
            }
          };
          
          console.log("useOrderProduct - validProduct:", validProduct);
          setProduct(validProduct);
        } else {
          console.error(`Product with ID ${productId} not found in order`);
          setError(new Error(`Product with ID ${productId} not found in order`));
        }
      } else {
        console.error("No products available");
        setError(new Error("No products available"));
      }
    } catch (err) {
      console.error("Error processing product data:", err);
      setError(err instanceof Error ? err : new Error("Failed to process product data"));
    } finally {
      setIsLoading(false);
    }
  }, [productId, orderProducts]);

  return {
    product,
    isLoading,
    error,
  };
}
