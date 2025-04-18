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
export interface CheckoutData {
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
  metadata?: Record<string, unknown>
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
      const paymentAmount: number = (paymentData.amount ? Number(paymentData.amount) : amount) 

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

          // Store additional metadata in localStorage for access on success page
          try {
            // Store metadata separately for easier access on verification
            localStorage.setItem(
              "paymentMetadata",
              JSON.stringify({
                amount: (paymentAmount / 100).toString(),
                reference: reference,
                email: paymentEmail,
                check_out_id: paymentData.check_out_id || "1",
                delivery_fee: paymentData.delivery_fee?.toString() || "2000",
                order_code: paymentData.order_code || "didhdd",
                user_id: "1",
              }),
            )
          } catch (err) {
            console.warn("Failed to store payment metadata:", err)
          }

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

      // Create metadata object directly without custom_fields
      const metadataFields = {
        amount: (paymentAmount / 100).toString(), // Convert back to Naira as string
        reference: reference,
        email: paymentEmail,
        check_out_id: paymentData.check_out_id || "1",
        delivery_fee: paymentData.delivery_fee?.toString() || "2000",
        order_code: paymentData.order_code || "didhdd",
        user_id: "1",
      }

      // Create the config object with the correct metadata structure
      const config: PaystackConfig = {
        key: PAYSTACK_PUBLIC_KEY,
        email: paymentEmail,
        amount: paymentAmount,
        ref: reference,
        metadata: {
          metadata: metadataFields,
        },
        callback: callbackFunction,
        onClose: onCloseFunction,
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
