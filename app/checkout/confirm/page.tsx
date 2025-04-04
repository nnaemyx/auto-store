"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import OrderConfirmation from "@/components/checkout/order-confirmation"
import { useCart } from "@/hooks/use-cart"

export default function ConfirmPage() {
  const router = useRouter()
  const { cart } = useCart()
  const [shippingDetails, setShippingDetails] = useState<any>(null)
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  useEffect(() => {
    // Get stored details from localStorage
    const storedShipping = localStorage.getItem("shippingDetails")
    const storedPayment = localStorage.getItem("paymentDetails")

    if (storedShipping && storedPayment) {
      setShippingDetails(JSON.parse(storedShipping))
      setPaymentDetails(JSON.parse(storedPayment))
    } else {
      // If missing details, redirect back
      router.push(storedShipping ? "/checkout/payment" : "/checkout")
    }
  }, [router])

  const handleConfirmOrder = (checkoutData?: any) => {
    // In a real app, you would submit the order to your backend
    // For now, we'll just simulate a successful order
    localStorage.setItem("orderConfirmed", "true")

    // Store checkout data if available
    if (checkoutData) {
      localStorage.setItem("checkoutData", JSON.stringify(checkoutData))
    }

    router.push("/checkout/success")
  }

  if (!cart?.cart_items || cart.cart_items.length === 0) {
    router.push("/cart")
    return null
  }

  if (!shippingDetails || !paymentDetails) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OrderConfirmation
        onConfirm={handleConfirmOrder}
        shippingDetails={shippingDetails}
        paymentDetails={paymentDetails}
        cartItems={cart.cart_items}
        cartSummary={cart.summary}
      />
    </div>
  )
}

