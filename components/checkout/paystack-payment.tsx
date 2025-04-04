"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { PAYSTACK_PUBLIC_KEY, generateReference } from "@/lib/paystack"

interface PaystackPaymentProps {
  email: string
  amount: number // in Naira
  onSuccess: (reference: string, checkoutData?: any) => void
  onClose: () => void
  metadata?: Record<string, any>
  className?: string
  text?: string
  checkoutData?: any
}

declare global {
  interface Window {
    PaystackPop: any
  }
}

export default function PaystackPayment({
  email,
  amount,
  onSuccess,
  onClose,
  metadata = {},
  className = "",
  text = "Pay with Paystack",
  checkoutData,
}: PaystackPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  useEffect(() => {
    // Check if Paystack script is already loaded
    if (window.PaystackPop) {
      setIsScriptLoaded(true)
    }
  }, [])

  const handlePayment = () => {
    setIsLoading(true)

    if (!isScriptLoaded) {
      console.error("Paystack script not loaded")
      setIsLoading(false)
      return
    }

    try {
      // Get checkout data from props or localStorage
      const checkoutResponse = checkoutData || JSON.parse(localStorage.getItem("checkoutResponse") || "{}")

      // Use reference from checkout response or generate a new one
      const reference = checkoutResponse.reference || generateReference()

      // Include the checkout response in the metadata
      const enhancedMetadata = {
        ...metadata,
        checkout_data: checkoutResponse,
        amount: checkoutResponse.amount || amount,
        check_out_id: checkoutResponse.check_out_id || "",
        delivery_fee: checkoutResponse.delivery_fee || "",
        order_code: checkoutResponse.order_code || "",
        user_id: checkoutResponse.user_id || "",
      }

      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: checkoutResponse.email || email,
        amount: (checkoutResponse.amount ? Number(checkoutResponse.amount) : amount) * 100, // convert to kobo
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Order Reference",
              variable_name: "order_ref",
              value: reference,
            },
            ...Object.entries(enhancedMetadata).map(([key, value]) => ({
              display_name: key,
              variable_name: key.toLowerCase().replace(/\s+/g, "_"),
              value: typeof value === "object" ? JSON.stringify(value) : value,
            })),
          ],
        },
        onClose: () => {
          setIsLoading(false)
          onClose()
        },
        callback: (response: any) => {
          setIsLoading(false)
          onSuccess(response.reference, checkoutResponse)
        },
      })

      handler.openIframe()
    } catch (error) {
      console.error("Payment error:", error)
      setIsLoading(false)
    }
  }

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" onLoad={() => setIsScriptLoaded(true)} strategy="lazyOnload" />

      <Button
        onClick={handlePayment}
        disabled={isLoading || !isScriptLoaded}
        className={`bg-black hover:bg-gray-800 text-white ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          text
        )}
      </Button>
    </>
  )
}

