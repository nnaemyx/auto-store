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
import { useDeliveryFees } from "@/hooks/use-delivery-fees"

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
    tax: number
    shipping_fee: number
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
  const [isProcessing, setIsProcessing] = useState(false)
  const [deliveryFee, setDeliveryFee] = useState("")
  const [checkoutComplete, setCheckoutComplete] = useState(false)
  const [checkoutData, setCheckoutData] = useState<Record<string, unknown> | null>(null)

  // Fetch delivery fees from the API
  const { data: deliveryFees, isLoading: isLoadingFees, isError: isErrorFees } = useDeliveryFees()

  // Set default delivery fee if none selected and fees are loaded
  if (deliveryFees && deliveryFees.length > 0 && !deliveryFee) {
    setDeliveryFee(deliveryFees[0].id.toString())
  }

  const handleApplyDiscount = () => {
    if (discountCode) {
      toast({
        title: "Discount Applied",
        description: `Discount code "${discountCode}" has been applied`,
        variant: ToastVariant.Success,
      })
    }
  }

  const handleCheckout = async () => {
    if (!deliveryFee) {
      toast({
        title: "Missing Delivery Option",
        description: "Please select a delivery option",
        variant: ToastVariant.Error,
      })
      return
    }

    setIsProcessing(true)

    try {
      // Get auth token
      const token = getToken()
      if (!token) {
        throw new Error("Authentication token not found. Please log in.")
      }

      // Find selected delivery fee
      const selectedFeeOption = deliveryFees?.find((fee) => fee.id.toString() === deliveryFee)
      if (!selectedFeeOption) {
        throw new Error("Invalid delivery fee selected")
      }

      // Calculate total amount including delivery fee
      const totalAmount = cartSummary.subtotal + cartSummary.tax + selectedFeeOption.amount

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
        delivery_fee: selectedFeeOption.id.toString(),
        amount: totalAmount,
        tax: cartSummary.tax,
        subtotal: cartSummary.subtotal,
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
        tax: cartSummary.tax,
        subtotal: cartSummary.subtotal,
        delivery_fee: selectedFeeOption.amount,
      }))

      // Update state with checkout data
      setCheckoutData({
        ...response,
        tax: cartSummary.tax,
        subtotal: cartSummary.subtotal,
        delivery_fee: selectedFeeOption.amount,
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
        deliveryFee,
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

  // Calculate total amount with selected delivery fee
  const selectedFeeOption = deliveryFees?.find((fee) => fee.id.toString() === deliveryFee)
  const deliveryFeeAmount = selectedFeeOption?.amount || 0
  // Use cartSummary.total directly to maintain consistency
  const totalAmount = cartSummary.total

  // Log the amounts for debugging
  console.log("Amount breakdown:", {
    subtotal: cartSummary.subtotal,
    tax: cartSummary.tax,
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

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">Please select your delivery option:</p>

            {isLoadingFees ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-brand-red mr-2" />
                <span>Loading delivery options...</span>
              </div>
            ) : isErrorFees ? (
              <p className="text-red-500 text-sm">Error loading delivery options. Please try again.</p>
            ) : (
              <div className="space-y-3 mb-6">
                {deliveryFees?.map((fee) => (
                  <div key={fee.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`deliveryFee${fee.id}`}
                      name="deliveryFee"
                      value={fee.id.toString()}
                      checked={deliveryFee === fee.id.toString()}
                      onChange={() => setDeliveryFee(fee.id.toString())}
                      className="mr-2"
                      disabled={checkoutComplete}
                    />
                    <label htmlFor={`deliveryFee${fee.id}`} className="flex flex-col">
                      <span>
                        {fee.name} (₦{fee.amount.toLocaleString()})
                      </span>
                      {fee.description && <span className="text-xs text-gray-500">{fee.description}</span>}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {!checkoutComplete ? (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  First, click the button below to process your checkout. Then you&apos;ll be able to make payment.
                </p>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-black hover:bg-gray-800 text-white mb-6"
                  disabled={isProcessing || isLoadingFees || !deliveryFee}
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

              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>₦{cartSummary.tax.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Fee</span>
                <span>₦{deliveryFeeAmount.toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total amount</span>
                  <span>₦{totalAmount.toLocaleString()}</span>
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

