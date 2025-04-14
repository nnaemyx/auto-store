"use client"

import Link from "next/link"
import Image from "next/image"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CartItem } from "@/hooks/use-cart"

interface OrderSuccessProps {
  orderDetails: {
    shipping: {
      address: string
      city: string
      state: string
      postalCode: string
      country?: string
    }
    payment: {
      method: string
      status: string
      transactionId: string
      [key: string]: unknown
    }
    checkout: {
      order_code?: string
      total_amount?: number
      [key: string]: unknown
    }
    orderDate: Date
    estimatedDelivery: Date
    orderNumber: string
  }
  cartItems: CartItem[]
  verificationStatus: string
  onContinueShopping?: () => void
  onViewOrders?: () => void
}

export default function OrderSuccess({
  orderDetails,
  cartItems,
  verificationStatus,
  onContinueShopping,
  onViewOrders,
}: OrderSuccessProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          {verificationStatus === "success" ? (
            <CheckCircle className="h-16 w-16 text-green-500" />
          ) : verificationStatus === "failed" ? (
            <XCircle className="h-16 w-16 text-red-500" />
          ) : (
            <Clock className="h-16 w-16 text-amber-500" />
          )}
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {verificationStatus === "success"
            ? "Order Confirmed!"
            : verificationStatus === "failed"
              ? "Payment Verification Failed"
              : "Order Received - Verifying Payment"}
        </h1>
        <p className="text-gray-600">
          {verificationStatus === "success"
            ? "Thank you for your purchase. Your order has been successfully processed."
            : verificationStatus === "failed"
              ? "We couldn't verify your payment. Please contact our support team."
              : "We're processing your payment. This may take a moment."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Number</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold">{orderDetails.orderNumber}</p>
            <p className="text-sm text-gray-500">Keep this for your reference</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estimated Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold">{formatDate(orderDetails.estimatedDelivery)}</p>
            <p className="text-sm text-gray-500">Delivery times may vary</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {verificationStatus === "success" ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-bold text-green-500">Verified</span>
                </>
              ) : verificationStatus === "failed" ? (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="font-bold text-red-500">Failed</span>
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-amber-500" />
                  <span className="font-bold text-amber-500">Pending</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">Transaction ID: {orderDetails.payment.transactionId}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
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
                        <div className="flex justify-between mt-1">
                          <p className="text-sm">Qty: {item.quantity || 1}</p>
                          <p className="font-bold">₦{Number(item.amount).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No items in your order.</p>
                )}

                <div className="pt-2 border-t mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total amount</span>
                    <span>₦{Number(orderDetails.checkout.total_amount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">
                  {orderDetails.shipping.address}
                  <br />
                  {orderDetails.shipping.city}, {orderDetails.shipping.state} {orderDetails.shipping.postalCode}
                  <br />
                  {orderDetails.shipping.country || "Nigeria"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild={!onContinueShopping} variant="outline" onClick={onContinueShopping}>
          {!onContinueShopping ? <Link href="/">Continue Shopping</Link> : "Continue Shopping"}
        </Button>

        <Button asChild={!onViewOrders} onClick={onViewOrders}>
          {!onViewOrders ? <Link href="/profile/orders">View My Orders</Link> : "View My Orders"}
        </Button>
      </div>
    </div>
  )
}
