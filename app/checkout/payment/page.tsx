"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PaymentDetailsForm from "@/components/checkout/payment-details"
import { useCart } from "@/hooks/use-cart"
import React from "react"

export default function PaymentPage() {
  const router = useRouter()
  const { cart } = useCart()

  // Calculate cart summary from items
  const cartSummary = React.useMemo(() => {
    if (!cart?.cart_items || cart.cart_items.length === 0) {
      return { subtotal: 0, total: 0 };
    }

    const subtotal = cart.cart_items.reduce((sum, item) => {
      return sum + (Number(item.price) || 0);
    }, 0);

    return {
      subtotal,
      total: subtotal, // Assuming no additional fees for now
    };
  }, [cart?.cart_items]);

  interface ShippingDetails {
    firstName: string
    lastName: string
    stateOfResidence: string
    townCity: string
    phoneNumber: string
    alt_phoneNumber: string
    postalCode: string
    houseAddress: string
    email?: string
    alternatePhone?: string
  }

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get shipping details from localStorage
    const storedDetails = localStorage.getItem("shippingDetails")
    if (storedDetails) {
      setShippingDetails(JSON.parse(storedDetails))
    } else {
      // If no shipping details, redirect back to checkout
      router.push("/checkout")
    }
    setIsLoading(false)
  }, [router])

  // Check if cart is empty and redirect if needed
  useEffect(() => {
    if (cart && (!cart.cart_items || cart.cart_items.length === 0)) {
      router.push("/cart")
    }
  }, [cart, router])

  // Update this function to match the expected type from PaymentDetailsForm
  const handleSubmit = (data: { checkoutResponse: Record<string, unknown>; deliveryFee: string }) => {
    // Store checkout data for the confirmation page
    localStorage.setItem("checkoutData", JSON.stringify(data))

    // Navigate to the confirmation page
    router.push("/checkout/confirm")
  }

  // Show loading state while checking conditions
  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  // Don't render the form if shipping details are missing
  if (!shippingDetails) {
    return <div className="container mx-auto px-4 py-8">Loading shipping details...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PaymentDetailsForm
        onSubmit={handleSubmit}
        shippingDetails={shippingDetails}
        cartItems={cart?.cart_items || []}
        cartSummary={cartSummary}
      />
    </div>
  )
}

