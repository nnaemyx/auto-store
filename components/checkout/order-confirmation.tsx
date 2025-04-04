"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { CartItem } from "@/hooks/use-cart"
import PaystackPayment from "./paystack-payment"
import { useToast } from "@/hooks/use-toast"

interface CheckoutData {
  email: string
  amount: number
  order_code: string
  check_out_id: string
  delivery_fee?: number
}

interface OrderConfirmationProps {
  onConfirm: (checkoutData?: CheckoutData) => void
  shippingDetails: {
    firstName: string
    lastName: string
    stateOfResidence: string
    townCity: string
    phoneNumber: string
    postalCode: string
    houseAddress: string
    email?: string
  }
  paymentDetails: {
    method: string
    provider: string
    transactionId?: string
  }
  cartItems: CartItem[]
  cartSummary: {
    subtotal: number
    tax: number
    shipping_fee: number
    total: number
  }
}

export default function OrderConfirmation({
  onConfirm,
  shippingDetails,
  cartItems,
  cartSummary,
}: OrderConfirmationProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast, ToastVariant } = useToast()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [discountCode, setDiscountCode] = useState("")

  // Get checkout data from localStorage
  const checkoutData = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("checkoutResponse") || "{}") : {}

  const handleConfirmOrder = () => {
    setShowConfirmModal(false)
    onConfirm(checkoutData)
  }

  const handleCancelConfirm = () => {
    setShowConfirmModal(false)
  }

  interface CheckoutData {
    email: string
    amount: number
    order_code: string
    check_out_id: string
    delivery_fee?: number
  }

  const handlePaystackSuccess = (reference: string, checkoutData?: CheckoutData) => {
    toast({
      title: "Payment Successful",
      description: `Your payment was successful. Reference: ${reference}`,
      variant: ToastVariant.Success,
    })

    onConfirm(checkoutData)
  }

  const handlePaystackClose = () => {
    toast({
      title: "Payment Cancelled",
      description: "You cancelled the payment process",
      variant: ToastVariant.Error,
    })
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
        <Link href="/checkout/payment" className="hover:text-brand-red">
          Payment
        </Link>
        {" / "}
        <span className="font-medium text-gray-700">Confirm order</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Order Summary Section */}
        <div className={isMobile ? "w-full" : "lg:w-1/2"}>
          <h2 className="text-xl font-bold mb-6">Order summary</h2>

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
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-bold mt-1">₦{Number(item.amount).toLocaleString()}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Button variant="outline" size="sm">
                    Edit order
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M2 4H14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.33337 4V2.66667C5.33337 2.29848 5.47385 1.94554 5.72389 1.6955C5.97394 1.44545 6.32688 1.30498 6.69504 1.30498H9.30171C9.66987 1.30498 10.0228 1.44545 10.2729 1.6955C10.5229 1.94554 10.6634 2.29848 10.6634 2.66667V4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.66663 7.33333V11.3333"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.33337 7.33333V11.3333"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.33337 4L4.00004 12.6667C4.00004 13.0349 4.14051 13.3878 4.39056 13.6379C4.64061 13.8879 4.99355 14.0284 5.36171 14.0284H10.6284C10.9965 14.0284 11.3495 13.8879 11.5995 13.6379C11.8496 13.3878 11.99 13.0349 11.99 12.6667L12.6667 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
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
                <span>
                  ₦{checkoutData.delivery_fee ? checkoutData.delivery_fee : cartSummary.shipping_fee.toLocaleString()}
                </span>
              </div>

              <div className="pt-2 border-t mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total amount</span>
                  <span>₦{checkoutData.amount ? checkoutData.amount : cartSummary.total.toLocaleString()}</span>
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

        {/* Payment Details Section */}
        <div className={isMobile ? "w-full" : "lg:w-1/2"}>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Payment details</h2>
              <Link href="/checkout/payment" className="text-sm text-gray-500 hover:text-brand-red">
                Change payment method
              </Link>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 bg-gray-50 rounded-md overflow-hidden">
                  <Image src="/placeholder.svg?height=64&width=64" alt="Paystack" fill className="object-contain p-2" />
                </div>
                <div>
                  <p className="font-medium">Paystack</p>
                  <p className="text-sm text-gray-500">Secure online payment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Details Summary */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Shipping details</h3>
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
                <p className="text-sm text-gray-500">Postal code</p>
                <p className="font-medium">{shippingDetails.postalCode}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">House address</p>
              <p className="font-medium">{shippingDetails.houseAddress}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <PaystackPayment
              email={checkoutData.email || shippingDetails.email || "customer@example.com"}
              amount={checkoutData.amount ? Number(checkoutData.amount) : cartSummary.total}
              onSuccess={handlePaystackSuccess}
              onClose={handlePaystackClose}
              checkoutData={checkoutData}
              metadata={{
                order_items: cartItems.length,
                customer_name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
                order_code: checkoutData.order_code || "",
                check_out_id: checkoutData.check_out_id || "",
              }}
              className="flex-1"
              text="Complete Payment"
            />
            <Link href="/cart" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancel order
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-center mb-4">Confirm order?</h2>
            <p className="text-center text-gray-600 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim fghf fhfus skaks
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={handleConfirmOrder} className="w-full bg-black hover:bg-gray-800 text-white">
                Yes, place order
              </Button>
              <Button variant="outline" onClick={handleCancelConfirm} className="w-full">
                No, I want to confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

