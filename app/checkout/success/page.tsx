"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import OrderSuccess from "@/components/checkout/order-success"
import { useCart } from "@/hooks/use-cart"
import { Loader2 } from "lucide-react"

export default function SuccessPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  interface OrderDetails {
    shipping: {
      email: string
      address: string
      city: string
      state: string
      zipCode: string
    }
    payment: {
      method: string
      amount: number
      transactionId: string
    }
    checkout?: {
      email?: string
    }
    orderDate: Date
    estimatedDelivery: Date
    orderNumber: string
  }

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Function to handle all initialization tasks
    const initializeSuccessPage = async () => {
      setIsLoading(true)

      // Check if order was confirmed
      const isConfirmed = localStorage.getItem("orderConfirmed")

      if (!isConfirmed) {
        router.push("/cart")
        return
      }

      // Get stored details
      const storedShipping = localStorage.getItem("shippingDetails")
      const storedPayment = localStorage.getItem("paymentDetails")
      const storedCheckout = localStorage.getItem("checkoutResponse")

      if (storedShipping && storedPayment) {
        const checkoutData = storedCheckout ? JSON.parse(storedCheckout) : {}

        // Set order details
        setOrderDetails({
          shipping: JSON.parse(storedShipping),
          payment: JSON.parse(storedPayment),
          checkout: checkoutData,
          orderDate: new Date(),
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          orderNumber:
            checkoutData.order_code ||
            Math.floor(Math.random() * 1000000)
              .toString()
              .padStart(6, "0"),
        })

        // Clear cart and stored data after successful order
        await clearCart()
        localStorage.removeItem("shippingDetails")
        localStorage.removeItem("paymentDetails")
        localStorage.removeItem("orderConfirmed")
        localStorage.removeItem("checkoutResponse")
      } else {
        router.push("/cart")
        return
      }

      // All operations complete, set loading to false
      setIsLoading(false)
    }

    initializeSuccessPage()
  }, [router, clearCart])

  // Show loading state while performing operations
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red mx-auto mb-4" />
          <p className="text-lg font-medium">Processing your order...</p>
        </div>
      </div>
    )
  }

  // Only show the success modal after all operations are complete
  if (!orderDetails) {
    return <div className="container mx-auto px-4 py-8">Redirecting...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OrderSuccess orderDetails={orderDetails} cartItems={cart?.cart_items || []} />
    </div>
  )
}

