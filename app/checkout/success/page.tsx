"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import OrderSuccess from "@/components/checkout/order-success"
import { useCart } from "@/hooks/use-cart"

export default function SuccessPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
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
      clearCart()
      localStorage.removeItem("shippingDetails")
      localStorage.removeItem("paymentDetails")
      localStorage.removeItem("orderConfirmed")
      localStorage.removeItem("checkoutResponse")
    } else {
      router.push("/cart")
    }
  }, [router, clearCart])

  if (!orderDetails) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OrderSuccess orderDetails={orderDetails} cartItems={cart?.cart_items || []} />
    </div>
  )
}

