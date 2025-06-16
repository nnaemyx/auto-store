"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useToast } from "@/hooks/use-toast"
import type { CartItem } from "@/hooks/use-cart"
import { apiClient } from "@/api/api-client"
import { Loader2 } from "lucide-react"
import PaystackPayment from "./paystack-payment"

const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

interface PaymentDetailsFormProps {
  onSubmit: (data: { checkoutResponse: Record<string, unknown>; deliveryFee: string }) => void
  shippingDetails: {
    firstName: string
    lastName: string
    email?: string
    phoneNumber: string
    alt_phoneNumber: string
    houseAddress: string
    stateOfResidence: string
    postalCode: string
    townCity: string
    alternatePhone?: string
  }
  cartItems: CartItem[]
  cartSummary: {
    subtotal: number
    total: number
  }
}

export default function PaymentDetailsForm({
  onSubmit,
  shippingDetails,
  cartItems,
  cartSummary,
}: PaymentDetailsFormProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast, ToastVariant } = useToast()

  const [discountCode, setDiscountCode] = useState("")
  const [discountAmount, setDiscountAmount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkoutComplete, setCheckoutComplete] = useState(false)
  const [checkoutData, setCheckoutData] = useState<Record<string, unknown> | null>(null)

  // Calculate total weight of cart items
  const totalWeight = cartItems.reduce((sum, item) => {
    const weight = Number(item.weight || 0);
    const quantity = Number(item.quantity || 1);
    return sum + (weight * quantity);
  }, 0);

  // Calculate delivery fee based on weight
  const deliveryFeeAmount = totalWeight <= 5 ? 2000 : 
                           totalWeight <= 10 ? 3000 : 
                           totalWeight <= 20 ? 5000 : 8000;

  // Calculate subtotal with discount
  const subtotalWithDiscount = cartSummary.subtotal - discountAmount;

  // Calculate total amount with delivery fee and discount
  const totalAmount = subtotalWithDiscount + deliveryFeeAmount;

  const handleApplyDiscount = async () => {
    if (!discountCode) {
      toast({
        title: "Invalid Code",
        description: "Please enter a discount code",
        variant: ToastVariant.Error,
      })
      return
    }

    try {
      const token = getToken()
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await apiClient.post<{ discount_amount: number }>("/cart/apply-discount", {
        code: discountCode
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setDiscountAmount(response.discount_amount)
      toast({
        title: "Discount Applied",
        description: `Discount of ₦${response.discount_amount.toLocaleString()} has been applied`,
        variant: ToastVariant.Success,
      })
    } catch (error) {
      toast({
        title: "Invalid Code",
        description: error instanceof Error ? error.message : "Invalid discount code",
        variant: ToastVariant.Error,
      })
    }
  }

  const handleCheckout = async () => {
    setIsProcessing(true)

    try {
      // Get auth token
      const token = getToken()
      if (!token) {
        throw new Error("Authentication token not found. Please log in.")
      }

      // Prepare checkout data
      const checkoutPayload = {
        name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
        email: shippingDetails.email || "customer@example.com",
        phone_number: shippingDetails.phoneNumber,
        address: shippingDetails.houseAddress,
        state: shippingDetails.stateOfResidence,
        postal_code: shippingDetails.postalCode,
        town: shippingDetails.townCity,
        alt_phone_number: shippingDetails.alt_phoneNumber,
        delivery_fee: deliveryFeeAmount,
        amount: cartSummary.subtotal + deliveryFeeAmount,
        tax: 0,
        subtotal: cartSummary.subtotal,
        items: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price || item.amount
        }))
      }

      // Call the checkout API
      const response = await apiClient.post<Record<string, unknown>>("/cart/check-out", checkoutPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Checkout response:", response)

      // Store checkout response for use in Paystack payment
      localStorage.setItem("checkoutResponse", JSON.stringify({
        ...response,
        tax: 0,
        subtotal: cartSummary.subtotal,
        delivery_fee: deliveryFeeAmount,
      }))

      // Update state with checkout data
      setCheckoutData({
        ...response,
        tax: 0,
        subtotal: cartSummary.subtotal,
        delivery_fee: deliveryFeeAmount,
      })
      setCheckoutComplete(true)
      setIsProcessing(false)

      // Show success message
      toast({
        title: "Checkout Complete",
        description: "Please proceed to payment",
        variant: ToastVariant.Success,
      })
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Error",
        description: error instanceof Error ? error.message : "Failed to process checkout",
        variant: ToastVariant.Error,
      })
      setIsProcessing(false)
    }
  }

  interface PaystackResponseData {
    verificationResult?: Record<string, unknown>;
    [key: string]: unknown; // Add additional fields if necessary
  }

  const handlePaystackSuccess = (reference: string, responseData?: PaystackResponseData) => {
    toast({
      title: "Payment Successful",
      description: `Your payment was successful. Reference: ${reference}`,
      variant: ToastVariant.Success,
    })

    // Pass the checkout data to the parent component
    if (checkoutData) {
      onSubmit({
        checkoutResponse: {
          ...checkoutData,
          paymentReference: reference,
          paymentVerification: responseData?.verificationResult || null,
        },
        deliveryFee: deliveryFeeAmount.toString(),
      })
    }
  }

  const handlePaystackClose = () => {
    toast({
      title: "Payment Cancelled",
      description: "You cancelled the payment process",
      variant: ToastVariant.Error,
    })
  }

  // Log the amounts for debugging
  console.log("Amount breakdown:", {
    subtotal: cartSummary.subtotal,
    tax: 0,
    deliveryFee: deliveryFeeAmount,
    total: totalAmount,
    cartSummaryTotal: cartSummary.total
  })

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-red">
          Homepage
        </Link>
        {" / "}
        <Link href="/cart" className="hover:text-brand-red">
          My cart
        </Link>
        {" / "}
        <Link href="/checkout" className="hover:text-brand-red">
          Confirm details
        </Link>
        {" / "}
        <span className="font-medium text-gray-700">Payment</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className={isMobile ? "w-full" : "lg:w-1/2"}>
          <h2 className="text-xl font-bold mb-6">Payment Method</h2>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-bold mb-6">Payment Details</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>₦{deliveryFeeAmount.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-500">
                Delivery fee is calculated based on total weight ({totalWeight}kg)
              </p>
            </div>

            {!checkoutComplete ? (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  First, click the button below to process your checkout. Then you&apos;ll be able to make payment.
                </p>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-black hover:bg-gray-800 text-white mb-6"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Process Checkout"
                  )}
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Your checkout is complete. Click the button below to proceed with payment.
                </p>

                <PaystackPayment
                  email={shippingDetails.email || "customer@example.com"}
                  amount={totalAmount}
                  onSuccess={handlePaystackSuccess}
                  onClose={handlePaystackClose}
                  checkoutData={checkoutData || undefined}
                  className="w-full mb-6"
                  text="Pay Now"
                />
              </>
            )}
          </div>

          {/* Shipping Details Summary */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Shipping details</h3>
              <Link href="/checkout" className="text-sm text-gray-500 hover:text-brand-red">
                Edit details
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">First name</p>
                <p className="font-medium">{shippingDetails.firstName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Last name</p>
                <p className="font-medium">{shippingDetails.lastName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">State or residence</p>
                <p className="font-medium">{shippingDetails.stateOfResidence}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Town/City</p>
                <p className="font-medium">{shippingDetails.townCity}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone number</p>
                <p className="font-medium">{shippingDetails.phoneNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Alt Phone Number</p>
                <p className="font-medium">{shippingDetails.alt_phoneNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Postal code</p>
                <p className="font-medium">{shippingDetails.postalCode}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">House address</p>
              <p className="font-medium">{shippingDetails.houseAddress}</p>
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className={isMobile ? "w-full" : "lg:w-1/2"}>
          {isMobile && <h2 className="text-xl font-bold mb-6">My Shopping Cart</h2>}
          {!isMobile && <h2 className="text-xl font-bold mb-6">Order summary</h2>}

          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4">
                <div className="relative w-20 h-20 bg-gray-50 rounded-md overflow-hidden">
                  <Image
                    src={
                      item.images && item.images.length > 0
                        ? item.images[0].image
                        : "/placeholder.svg?height=80&width=80"
                    }
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <p className="font-bold mt-1">₦{Number(item.price || item.amount).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-bold mb-4">Cart summary</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₦{cartSummary.subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₦{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-2 border-t mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total amount</span>
                  <span>₦{(cartSummary.subtotal - discountAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Enter discount code</span>
              </div>
              <div className="flex mt-2">
                <Input
                  placeholder="Discount code"
                  className="rounded-r-none"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <Button className="rounded-l-none bg-black hover:bg-gray-800 text-white" onClick={handleApplyDiscount}>
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

