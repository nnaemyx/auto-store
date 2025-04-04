"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PaymentDetailsForm from "@/components/checkout/payment-details"
import { useCart } from "@/hooks/use-cart"

export default function PaymentPage() {
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
  }

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(null)

  useEffect(() => {
    // Get shipping details from localStorage
    const storedDetails = localStorage.getItem("shippingDetails")
    if (storedDetails) {
      setShippingDetails(JSON.parse(storedDetails))
    } else {
      // If no shipping details, redirect back to checkout
      router.push("/checkout")
    }
  }, [router])

  interface PaymentDetails {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
    saveCardDetails: boolean;
  }

  const handleSubmit = (formData: PaymentDetails) => {
    // In a real app, you would process the payment
    // For now, we'll just store in localStorage for the confirmation
    localStorage.setItem("paymentDetails", JSON.stringify(formData))
    router.push("/checkout/confirm")
  }

  if (!cart?.cart_items || cart.cart_items.length === 0) {
    router.push("/cart")
    return null
  }

  if (!shippingDetails) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PaymentDetailsForm
        onSubmit={handleSubmit}
        shippingDetails={shippingDetails}
        cartItems={cart.cart_items}
        cartSummary={cart.summary}
      />
    </div>
  )
}

