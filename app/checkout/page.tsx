"use client"
import { useRouter } from "next/navigation"
import ShippingDetailsForm from "@/components/checkout/shipping-details-form"
import { useCart } from "@/hooks/use-cart"
import React from "react"

export default function CheckoutPage() {
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
    postalCode: string
    houseAddress: string
    saveDetails: boolean
    deliveryType: string
    appliedCoupon?: { code: string; discount: number }
  }

  const handleSubmit = (formData: ShippingDetails) => {
    // In a real app, you would save the shipping details
    // For now, we'll just store in localStorage for the next step
    localStorage.setItem("shippingDetails", JSON.stringify(formData))
    
    // Also store coupon data separately for easy access
    if (formData.appliedCoupon) {
      localStorage.setItem("appliedCoupon", JSON.stringify(formData.appliedCoupon))
    } else {
      localStorage.removeItem("appliedCoupon")
    }
    
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
        cartSummary={cartSummary}
      />
    </div>
  )
}

