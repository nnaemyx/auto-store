"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import OrderSuccess from "@/components/checkout/order-success"
import { useCart } from "@/hooks/use-cart"
import { Loader2 } from "lucide-react"
import { verifyPaystackTransaction } from "@/lib/paystack"
import { useToast } from "@/hooks/use-toast"

export default function SuccessPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { toast, ToastVariant } = useToast()
  const initializationComplete = useRef(false)

  interface OrderDetails {
    shipping: {
      address: string
      city: string
      state: string
      postalCode: string
      country: string
    }
    payment: {
      method: string
      status: string
      transactionId: string
      [key: string]: unknown
    }
    checkout: {
      order_code: string
      total_amount: number
      [key: string]: unknown
    }
    orderDate: Date
    estimatedDelivery: Date
    orderNumber: string
  }

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState<string>("pending")
  const [paymentMeta, setPaymentMeta] = useState<Record<string, string>>({})

  // Helper function to extract metadata from Paystack response
  interface VerificationResponse {
    data?: {
      reference?: string
      amount?: number
      status?: string
      transaction_date?: string
      metadata?: {
        custom_fields?: Array<{
          variable_name?: string
          value?: string | number
        }>
      }
    }
  }

  const extractMetadataFromVerification = (verification: VerificationResponse) => {
    try {
      if (!verification || !verification.data || !verification.data.metadata) {
        return null
      }

      const { metadata } = verification.data
      
      // Parse the custom_fields if they exist
      if (metadata.custom_fields && Array.isArray(metadata.custom_fields)) {
        const extractedData: Record<string, string> = {}
        
        metadata.custom_fields.forEach((field: { variable_name?: string; value?: string | number }) => {
          if (field.variable_name && field.value !== undefined) {
            extractedData[field.variable_name] = field.value.toString()
          }
        })
        
        return extractedData
      }
      
      return null
    } catch (error) {
      console.error("Error extracting metadata:", error)
      return null
    }
  }

  useEffect(() => {
    // Prevent multiple executions of the initialization logic
    if (initializationComplete.current) {
      return
    }

    // Function to handle all initialization tasks
    const initializeSuccessPage = async () => {
      try {
        // Mark initialization as started to prevent duplicate runs
        initializationComplete.current = true

        // Check if order was confirmed
        const isConfirmed = localStorage.getItem("orderConfirmed")

        if (!isConfirmed) {
          router.push("/cart")
          return
        }

        // Get stored details
        const storedShipping = localStorage.getItem("shippingDetails")
        const storedPayment = localStorage.getItem("paymentDetails")
        const storedCheckout = localStorage.getItem("checkoutResponse")
        const paymentReference = localStorage.getItem("paymentReference")
        const storedMetadata = localStorage.getItem("paymentMetadata")

        if (!storedShipping || !storedPayment) {
          router.push("/cart")
          return
        }

        const shippingDetails = JSON.parse(storedShipping)
        const paymentDetails = JSON.parse(storedPayment)
        const checkoutData = storedCheckout ? JSON.parse(storedCheckout) : {}
        const metadataFromStorage = storedMetadata ? JSON.parse(storedMetadata) : null

        // Verify payment if reference exists
        if (paymentReference) {
          setVerificationStatus("verifying")
          try {
            console.log("Attempting to verify payment with reference:", paymentReference)
            const verificationResult = await verifyPaystackTransaction(paymentReference)
            console.log("Verification result:", verificationResult)

            // Extract metadata from verification response
            const extractedMetadata = extractMetadataFromVerification(verificationResult)
            console.log("Extracted metadata from verification:", extractedMetadata)
            
            if (extractedMetadata) {
              setPaymentMeta(extractedMetadata)
            } else if (metadataFromStorage) {
              // Use metadata from localStorage as fallback
              console.log("Using metadata from localStorage:", metadataFromStorage)
              setPaymentMeta(metadataFromStorage)
            }

            if (
              verificationResult &&
              (verificationResult.status === "success" ||
                (verificationResult.data && verificationResult.data.status === "success"))
            ) {
              setVerificationStatus("success")

              // Clear cart after successful payment verification
              await clearCart()

              // Show success toast only once
              toast({
                title: "Payment Verified",
                description: "Your payment has been successfully verified",
                variant: ToastVariant.Success,
              })
            } else {
              // For testing purposes, we'll still show success
              // IMPORTANT: Remove this in production!
              console.warn("Using simulated success for testing")
              setVerificationStatus("success")
              await clearCart()

              // In production, uncomment this:
              /*
              setVerificationStatus("failed")
              toast({
                title: "Payment Verification Failed",
                description: "We couldn't verify your payment. Please contact support.",
                variant: ToastVariant.Error,
              })
              */
            }
          } catch (error) {
            console.error("Payment verification error:", error)

            // For testing purposes, we'll still show success
            // IMPORTANT: Remove this in production!
            console.warn("Using simulated success despite error")
            setVerificationStatus("success")
            await clearCart()

            // In production, uncomment this:
            /*
            setVerificationStatus("failed")
            toast({
              title: "Payment Verification Error",
              description: error instanceof Error ? error.message : "Unknown error",
              variant: ToastVariant.Error,
            })
            */
          }
        } else {
          // Clear cart even if no reference (for testing/development purposes)
          await clearCart()
        }

        // Format shipping details for the order details object
        const formattedShipping = {
          address: shippingDetails.houseAddress || "",
          city: shippingDetails.townCity || "",
          state: shippingDetails.stateOfResidence || "",
          postalCode: shippingDetails.postalCode || "",
          country: "Nigeria",
        }

        // Find order code from metadata if available
        const orderCode = paymentMeta.order_code || 
                          (metadataFromStorage && metadataFromStorage.order_code) || 
                          checkoutData.order_code ||
                          Math.floor(Math.random() * 1000000).toString().padStart(6, "0")

        // Set order details
        setOrderDetails({
          shipping: formattedShipping,
          payment: {
            ...paymentDetails,
            metadata: paymentMeta // Add metadata to payment object
          },
          checkout: {
            ...checkoutData,
            order_code: orderCode,
            // Add metadata if available
            ...(paymentMeta.amount ? { total_amount: parseFloat(paymentMeta.amount) } : {})
          },
          orderDate: new Date(),
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          orderNumber: orderCode,
        })

        // Clear stored data after successful order
        // We'll keep this commented out for now for debugging purposes
        // localStorage.removeItem("shippingDetails")
        // localStorage.removeItem("paymentDetails")
        // localStorage.removeItem("orderConfirmed")
        // localStorage.removeItem("checkoutResponse")
        // localStorage.removeItem("paymentReference")
        // localStorage.removeItem("paymentMetadata")
      } catch (error) {
        console.error("Error initializing success page:", error)
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: ToastVariant.Error,
        })
        router.push("/cart")
      } finally {
        // All operations complete, set loading to false
        setIsLoading(false)
      }
    }

    initializeSuccessPage()
  }, []) // Empty dependency array to run only once

  // Function to handle user navigation after viewing order details
  const handleContinueShopping = () => {
    // Clear localStorage data when user decides to continue
    localStorage.removeItem("shippingDetails")
    localStorage.removeItem("paymentDetails")
    localStorage.removeItem("orderConfirmed")
    localStorage.removeItem("checkoutResponse")
    localStorage.removeItem("paymentReference")
    localStorage.removeItem("paymentMetadata")

    // Navigate to home page
    router.push("/")
  }

  const handleViewOrders = () => {
    // Clear localStorage data when user decides to view orders
    localStorage.removeItem("shippingDetails")
    localStorage.removeItem("paymentDetails")
    localStorage.removeItem("orderConfirmed")
    localStorage.removeItem("checkoutResponse")
    localStorage.removeItem("paymentReference")
    localStorage.removeItem("paymentMetadata")

    // Navigate to orders page
    router.push("/account/orders")
  }

  // Show loading state while performing operations
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red mx-auto mb-4" />
          <p className="text-lg font-medium">
            {verificationStatus === "verifying" ? "Verifying your payment..." : "Processing your order..."}
          </p>
        </div>
      </div>
    )
  }

  // Only show the success modal after all operations are complete
  if (!orderDetails) {
    return <div className="container mx-auto px-4 py-8">Redirecting...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OrderSuccess
        orderDetails={orderDetails}
        cartItems={cart?.cart_items || []}
        verificationStatus={verificationStatus}
        onContinueShopping={handleContinueShopping}
        onViewOrders={handleViewOrders}
      />
    </div>
  )
}