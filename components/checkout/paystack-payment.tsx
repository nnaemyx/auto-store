"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  PAYSTACK_PUBLIC_KEY,
  generateReference,
  storePaymentReference,
  storePaymentDetails,
  confirmOrder,
} from "@/lib/paystack"

// Define the CheckoutData interface
interface CheckoutData {
  email?: string
  amount?: number
  order_code?: string
  check_out_id?: string
  delivery_fee?: string | number
  [key: string]: unknown
}

interface PaystackPaymentProps {
  email: string
  amount: number // in Naira
  onSuccess: (reference: string, checkoutData?: CheckoutData) => void
  onClose: () => void
  metadata?: Record<string, string | number | boolean>
  className?: string
  text?: string
  checkoutData?: CheckoutData
}

interface PaystackConfig {
  key: string
  email: string
  amount: number
  ref: string
  metadata?: {
    custom_fields: Array<{
      display_name: string
      variable_name: string
      value: string | number
    }>
  }
  callback: (response: { reference: string }) => void
  onClose: () => void
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => { openIframe: () => void }
    }
  }
}

export default function PaystackPayment({
  email,
  amount,
  onSuccess,
  onClose,
  className = "",
  text = "Pay with Paystack",
  checkoutData,
}: PaystackPaymentProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [scriptError, setScriptError] = useState<string | null>(null)

  // Check if Paystack script is already loaded or load it
  useEffect(() => {
    // If window.PaystackPop exists, script is already loaded
    if (typeof window !== "undefined" && window.PaystackPop) {
      setIsScriptLoaded(true)
      return
    }

    // Set up a timer to check for script loading
    const checkScriptInterval = setInterval(() => {
      if (typeof window !== "undefined" && window.PaystackPop) {
        setIsScriptLoaded(true)
        clearInterval(checkScriptInterval)
      }
    }, 500)

    // Clean up interval
    return () => clearInterval(checkScriptInterval)
  }, [])

  // Log state for debugging
  useEffect(() => {
    console.log("Paystack payment state:", {
      isLoading,
      isVerifying,
      isScriptLoaded,
      hasPublicKey: !!PAYSTACK_PUBLIC_KEY,
      scriptError,
      checkoutData: !!checkoutData,
    })
  }, [isLoading, isVerifying, isScriptLoaded, scriptError, checkoutData])

  const handlePayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Check if script is loaded
      if (typeof window === "undefined" || !window.PaystackPop) {
        throw new Error("Paystack script not loaded")
      }

      // Check if public key is available
      if (!PAYSTACK_PUBLIC_KEY) {
        throw new Error("Paystack public key not found")
      }

      // Generate a fresh reference for each payment attempt
      const reference: string = generateReference()

      // Use the provided checkout data or create a minimal one
      const paymentData: CheckoutData = checkoutData || {}

      // Ensure we have the correct email and amount
      const paymentEmail: string = paymentData.email || email
      const paymentAmount: number = (paymentData.amount ? Number(paymentData.amount) : amount) * 100 // convert to kobo

      console.log("Payment setup:", {
        email: paymentEmail,
        amount: paymentAmount,
        reference: reference,
        key: PAYSTACK_PUBLIC_KEY.substring(0, 8) + "...", // Log partial key for security
      })

      // Define the callback function separately to ensure it's valid
      const callbackFunction = (response: { reference: string }) => {
        console.log("Paystack callback received with reference:", response.reference)

        try {
          setIsVerifying(true)

          // Store payment reference for verification on success page
          storePaymentReference(response.reference)

          // Store payment details
          storePaymentDetails({
            method: "Paystack",
            status: "pending",
            transactionId: response.reference,
            amount: paymentAmount / 100, // Convert back to Naira
            date: new Date().toISOString(),
          })

          // Mark order as confirmed
          confirmOrder()

          // Call onSuccess with the reference and combined data
          onSuccess(response.reference, {
            ...paymentData,
            paymentReference: response.reference,
          })

          // Redirect to success page
          router.push("/checkout/success")
        } catch (error) {
          console.error("Payment processing error:", error)
          setIsVerifying(false)
          setIsLoading(false)

          // Still call onSuccess but with an error flag
          onSuccess(response.reference, {
            ...paymentData,
            paymentError: error instanceof Error ? error.message : "Unknown error",
          })
        }
      }

      // Define the onClose function separately
      const onCloseFunction = () => {
        setIsLoading(false)
        onClose()
      }

      // Create the config object with the required metadata
      const config = {
        key: PAYSTACK_PUBLIC_KEY,
        email: paymentEmail,
        amount: paymentAmount,
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Amount",
              variable_name: "amount",
              value: paymentAmount / 100, // Convert back to Naira
            },
            {
              display_name: "Reference",
              variable_name: "reference",
              value: reference,
            },
            {
              display_name: "Email",
              variable_name: "email",
              value: paymentEmail,
            },
            {
              display_name: "Checkout ID",
              variable_name: "check_out_id",
              value: paymentData.check_out_id || "1",
            },
            {
              display_name: "Delivery Fee",
              variable_name: "delivery_fee",
              value: paymentData.delivery_fee || "2000",
            },
            {
              display_name: "Order Code",
              variable_name: "order_code",
              value: paymentData.order_code || "",
            },
            {
              display_name: "User ID",
              variable_name: "user_id",
              value: "1", // Default user ID if not provided
            },
          ],
        },
        onClose: onCloseFunction,
        callback: callbackFunction,
      }

      console.log("Initializing Paystack with config:", {
        ...config,
        key: "HIDDEN",
        callback: "Function defined",
        onClose: "Function defined",
      })

      const handler = window.PaystackPop.setup(config)
      handler.openIframe()
    } catch (error) {
      console.error("Payment error:", error)
      setScriptError(error instanceof Error ? error.message : "Unknown error")
      setIsLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        onLoad={() => {
          console.log("Paystack script loaded via Script component")
          setIsScriptLoaded(true)
        }}
        onError={(e) => {
          console.error("Failed to load Paystack script:", e)
          setScriptError("Failed to load Paystack script")
        }}
        strategy="afterInteractive"
      />

      {scriptError && (
        <div className="text-red-500 text-sm mb-2">Error: {scriptError}. Please refresh the page and try again.</div>
      )}

      <form onSubmit={handlePayment}>
        <Button
          type="submit"
          disabled={isLoading || isVerifying}
          className={`bg-black hover:bg-gray-800 text-white ${className}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying payment...
            </>
          ) : (
            text
          )}
        </Button>
      </form>
    </>
  )
}

