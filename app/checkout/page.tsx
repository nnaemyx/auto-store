"use client"
import { useRouter } from "next/navigation"
import ShippingDetailsForm from "@/components/checkout/shipping-details-form"
import { useCart } from "@/hooks/use-cart"

export default function CheckoutPage() {
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
    saveDetails: boolean
    deliveryType: string
}

  const handleSubmit = (formData: ShippingDetails) => {
    // In a real app, you would save the shipping details
    // For now, we'll just store in localStorage for the next step
    localStorage.setItem("shippingDetails", JSON.stringify(formData))
    router.push("/checkout/payment")
  }

  if (!cart?.cart_items || cart.cart_items.length === 0) {
    router.push("/cart")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ShippingDetailsForm 
        onSubmit={handleSubmit} 
        cartItems={cart.cart_items} 
        cartSummary={cart.summary}
      />
    </div>
  )
}

