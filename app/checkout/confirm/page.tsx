"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import OrderConfirmation from "@/components/checkout/order-confirmation"
import { useCart } from "@/hooks/use-cart"

export default function ConfirmPage() {
  const router = useRouter()
  const { cart } = useCart()
  interface ShippingDetails {
    firstName: string
    lastName: string
    stateOfResidence: string
    townCity: string
    phoneNumber: string
    postalCode: string
    houseAddress: string
    email?: string
  }

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(null)
  interface PaymentDetails {
    method: string
    provider: string
    transactionId?: string
  }

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)

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

  interface CheckoutData {
    email?: string
    amount?: number
    order_code?: string
    check_out_id?: string
    delivery_fee?: string | number
    [key: string]: unknown
  }

  const handleConfirmOrder = (checkoutData?: CheckoutData) => {
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

