"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import OrderSuccess from "@/components/checkout/order-success"
import { useCart } from "@/hooks/use-cart"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SuccessPage() {
  const router = useRouter()
  const { cart } = useCart()
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
  const [paymentMeta] = useState<Record<string, string>>({})

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
            
            // Use the verification function that works with backend
            const { verifyPaystackTransaction } = await import("@/lib/paystack")
            const verificationResult = await verifyPaystackTransaction(paymentReference)
            
            console.log("Payment verification result:", verificationResult)
            
            if (verificationResult.status === "success" || verificationResult.data?.status === "success") {
              setVerificationStatus("success")
              toast({
                title: "Payment Successful",
                description: "Your payment has been verified and order created successfully",
                variant: ToastVariant.Success,
              })
            } else {
              setVerificationStatus("failed")
              toast({
                title: "Payment Verification Failed",
                description: "We couldn't verify your payment. Please contact support.",
                variant: ToastVariant.Error,
              })
            }
          } catch (error) {
            console.error("Payment verification error:", error)
            setVerificationStatus("failed")
            toast({
              title: "Payment Verification Error",
              description: error instanceof Error ? error.message : "Unknown error",
              variant: ToastVariant.Error,
            })
          }
        } else {
          // No reference needed for testing/development purposes
          setVerificationStatus("success")
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

        // Calculate total amount from multiple sources
        const totalAmount = 
          (metadataFromStorage && metadataFromStorage.amount) ||
          (checkoutData && checkoutData.amount) ||
          (paymentMeta && paymentMeta.amount) ||
          0

        console.log("Total amount calculation:", {
          metadataFromStorage,
          checkoutData,
          paymentMeta,
          calculatedTotal: totalAmount
        })

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
            total_amount: parseFloat(totalAmount.toString())
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
  }, [router, toast, ToastVariant.Success, ToastVariant.Error, paymentMeta]) // Add missing dependencies

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
    router.push("/profile/orders")
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