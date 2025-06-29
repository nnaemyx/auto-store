"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/api/api-client"
import { CartItem } from "@/hooks/use-cart"
import { useCheckout, CheckoutRequest } from "@/hooks/use-checkout"
import { Loader2 } from "lucide-react"
import PaystackPayment from "@/components/checkout/paystack-payment"
import { useAuth } from "@/api/use-auth"
import { authApiClient } from "@/api/api-client-with-auth"

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

interface DeliveryOption {
  id: number;
  name: string;
  description: string;
  amount: string;
}

export default function PaymentDetailsForm({
  onSubmit,
  shippingDetails,
  cartItems,
  cartSummary,
}: PaymentDetailsFormProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkoutComplete, setCheckoutComplete] = useState(false)
  const [checkoutData, setCheckoutData] = useState<Record<string, unknown> | null>(null)
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [deliveryFeeAmount, setDeliveryFeeAmount] = useState(0)
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([])
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<DeliveryOption | null>(null)
  const [isLoadingDeliveryOptions, setIsLoadingDeliveryOptions] = useState(false)

  // Initialize hooks
  const checkoutMutation = useCheckout()
  const auth = useAuth()

  // Get applied coupon from localStorage
  useEffect(() => {
    const storedCoupon = localStorage.getItem("appliedCoupon")
    if (storedCoupon) {
      try {
        const coupon = JSON.parse(storedCoupon)
        setAppliedCoupon(coupon)
      } catch (error) {
        console.error("Error parsing stored coupon:", error)
      }
    }
  }, [])

  // Fetch delivery options on mount
  useEffect(() => {
    const fetchDeliveryOptions = async () => {
      setIsLoadingDeliveryOptions(true)
      try {
        const data = await apiClient.get<DeliveryOption[]>("/get-delivery-option")
        setDeliveryOptions(data)
        if (data.length > 0) setSelectedDeliveryOption(data[0])
      } catch {
        setDeliveryOptions([])
      } finally {
        setIsLoadingDeliveryOptions(false)
      }
    }
    fetchDeliveryOptions()
  }, [])

  // Update delivery fee when option changes
  useEffect(() => {
    if (selectedDeliveryOption) {
      setDeliveryFeeAmount(Number(selectedDeliveryOption.amount))
    }
  }, [selectedDeliveryOption])

  // Calculate subtotal with discount
  const subtotalWithDiscount = cartSummary.subtotal - (appliedCoupon?.discount || 0)

  // Calculate total amount with delivery fee and discount
  const totalAmount = subtotalWithDiscount + deliveryFeeAmount

  // Log the amounts for debugging
  console.log("Amount breakdown:", {
    subtotal: cartSummary.subtotal,
    appliedCouponDiscount: appliedCoupon?.discount || 0,
    subtotalWithDiscount,
    deliveryFee: deliveryFeeAmount,
    totalAmount,
    cartSummaryTotal: cartSummary.total,
  })

  console.log("Auth user data:", {
    user: auth.user,
    userId: auth.user?.id,
    userIdString: auth.user?.id?.toString()
  })

  const handleCheckout = async () => {
    if (!auth.user?.id) {
      toast({
        title: "Authentication Error",
        description: "Please log in to continue with checkout",
      })
      return
    }

    setIsProcessing(true)

    try {
      console.log("Starting checkout process...")
      console.log("Auth context:", {
        user: auth.user,
        userId: auth.user.id,
        isAuthenticated: !!auth.user
      })

      // Test the checkout endpoint first to see the response structure
      try {
        const testResponse = await authApiClient.get("/cart/check-out")
        console.log("Test checkout endpoint response:", testResponse)
      } catch (testError) {
        console.log("Test checkout endpoint error (expected):", testError)
      }

      // Create checkout request data
      const checkoutRequest: CheckoutRequest = {
        user_id: auth.user.id.toString(),
        name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
        phone_number: shippingDetails.phoneNumber,
        email: shippingDetails.email || "customer@example.com",
        alt_phone_number: shippingDetails.alt_phoneNumber,
        state: shippingDetails.stateOfResidence,
        address: shippingDetails.houseAddress,
        town: shippingDetails.townCity,
        postal_code: shippingDetails.postalCode,
        items: cartItems,
        subtotal: cartSummary.subtotal,
        delivery_fee: selectedDeliveryOption ? selectedDeliveryOption.id : 0,
        total_amount: totalAmount,
        coupon_code: appliedCoupon?.code,
        discount: appliedCoupon?.discount || 0
      }

      console.log("Creating checkout with data:", checkoutRequest)
      console.log("User ID being sent to checkout:", checkoutRequest.user_id)

      // Use the checkout hook to create checkout
      const checkoutResponse = await checkoutMutation.mutateAsync(checkoutRequest)
      
      console.log("Checkout created successfully:", checkoutResponse)
      console.log("Checkout response structure:", JSON.stringify(checkoutResponse, null, 2))
      console.log("Checkout response ID:", checkoutResponse?.id)
      console.log("Checkout response user_id:", checkoutResponse?.user_id)
      
      if (!checkoutResponse?.id) {
        console.error("Checkout response missing ID. Full response:", checkoutResponse)
        throw new Error(`Checkout response missing ID. Response: ${JSON.stringify(checkoutResponse)}`)
      }

      // Create checkout response data for Paystack
      const checkoutResponseData = {
        amount: totalAmount.toString(),
        reference: `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: shippingDetails.email,
        check_out_id: checkoutResponse.id.toString(),
        delivery_fee: selectedDeliveryOption ? String(selectedDeliveryOption.id) : "",
        tax: "0",
        order_code: `ORD_${Date.now()}`,
        user_id: auth.user.id.toString(),
        subtotal: cartSummary.subtotal.toString(),
        discount: (appliedCoupon?.discount || 0).toString(),
        coupon_code: appliedCoupon?.code || null,
        shipping_address: shippingDetails.houseAddress,
        shipping_city: shippingDetails.townCity,
        shipping_state: shippingDetails.stateOfResidence,
        shipping_postal_code: shippingDetails.postalCode,
        shipping_phone: shippingDetails.phoneNumber,
        shipping_name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
        items: cartItems
      }

      console.log("Created checkout response data:", checkoutResponseData)
      console.log("Final user_id for Paystack:", checkoutResponseData.user_id)
      console.log("Final check_out_id for Paystack:", checkoutResponseData.check_out_id)
      localStorage.setItem("checkoutResponse", JSON.stringify(checkoutResponseData))

      // Update state with checkout data
      setCheckoutData(checkoutResponseData)
      setCheckoutComplete(true)

      toast({
        title: "Checkout Complete",
        description: "Your order has been prepared. Please proceed with payment.",
      })
    } catch (error) {
      console.error("Checkout error:", error)
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      })

      toast({
        title: "Checkout Error",
        description: error instanceof Error ? error.message : "Failed to process checkout",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  interface PaystackResponseData {
    verificationResult?: Record<string, unknown>;
    [key: string]: unknown; // Add additional fields if necessary
  }

  const handlePaystackSuccess = async (reference: string, responseData?: PaystackResponseData) => {
    toast({
      title: "Payment Successful",
      description: `Your payment was successful. Reference: ${reference}`,
    })

    // Pass the checkout data to the parent component
    if (checkoutData) {
      onSubmit({
        checkoutResponse: {
          ...checkoutData,
          paymentReference: reference,
          paymentVerification: responseData?.verificationResult || null,
        },
        deliveryFee: selectedDeliveryOption ? String(selectedDeliveryOption.id) : "",
      })
    }
  }

  const handlePaystackClose = () => {
    toast({
      title: "Payment Cancelled",
      description: "You cancelled the payment process",
    })
  }

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
              <div>
                <label className="block text-sm font-medium mb-1">Delivery Location</label>
                <select
                  className="w-full border text-black border-gray-300 rounded-md p-2 mb-2"
                  value={selectedDeliveryOption?.id || ''}
                  onChange={e => {
                    const opt = deliveryOptions.find(opt => opt.id === Number(e.target.value))
                    setSelectedDeliveryOption(opt || null)
                  }}
                  disabled={isLoadingDeliveryOptions}
                >
                  {deliveryOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name} - ₦{Number(opt.amount).toLocaleString()}
                    </option>
                  ))}
                </select>
                {selectedDeliveryOption && (
                  <p className="text-xs text-gray-500 mb-1">{selectedDeliveryOption.description}</p>
                )}
                {isLoadingDeliveryOptions && <p className="text-xs text-gray-500">Loading delivery options...</p>}
              </div>
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
                  amount={checkoutData?.amount ? Number(checkoutData.amount) : totalAmount}
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
                  <p className="font-bold mt-1">₦{Number(item.amount).toLocaleString()}</p>
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

              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₦{appliedCoupon.discount.toLocaleString()}</span>
              </div>
              )}

              <div className="pt-2 border-t mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total amount</span>
                  <span>₦{(cartSummary.subtotal - (appliedCoupon?.discount || 0)).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {appliedCoupon && (
              <div className="mt-4 p-3 bg-green-50 rounded-md">
              <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Coupon applied: {appliedCoupon.code}
                    </p>
                    <p className="text-xs text-green-600">
                      You saved ₦{appliedCoupon.discount.toLocaleString()}
                    </p>
                  </div>
              </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

