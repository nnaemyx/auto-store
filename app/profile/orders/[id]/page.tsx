"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useOrder, formatDate, getOrderStatusColor } from "@/hooks/use-orders"

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => setOrderId(id));
  }, [params]);
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [returnReason, setReturnReason] = useState("")

  // Fetch order details
  const { data: order, isLoading, isError, error } = useOrder(orderId ?? "")

  // Breadcrumb for desktop
  const breadcrumb = (
    <div className="text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-brand-red">
        Homepage
      </Link>
      {" / "}
      <Link href="/profile/orders" className="hover:text-brand-red">
        Order history
      </Link>
      {" / "}
      <span className="font-medium text-gray-700">Order #{orderId}</span>
    </div>
  )

  const handleRequestReturn = () => {
    setShowReturnModal(true)
  }

  const handleConfirmReturn = () => {
    // In a real app, you would submit the return request to your backend
    console.log("Return requested for order:", orderId, "Reason:", returnReason)
    setShowReturnModal(false)
    setReturnReason("")
  }

  const handleCancelReturn = () => {
    setShowReturnModal(false)
    setReturnReason("")
  }

  // Return confirmation modal
  const returnModal = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Confirm return request?</h2>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCancelReturn}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>

          <p className="mb-4">
            Please provide details about why you want to return this item. We&#39;ll review your request and get back to you
            within 24-48 hours.
          </p>

          <div className="mb-4">
            <label htmlFor="returnReason" className="block text-sm font-medium mb-2">
              What&#39;s your reason for the refund?
            </label>
            <textarea
              id="returnReason"
              className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
              placeholder="Leave a comment"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <p className="block text-sm font-medium mb-2">Upload pictures (optional)</p>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-md aspect-square flex items-center justify-center bg-gray-50"
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-300"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M3 16l5-5 5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 14l3-3 4 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={handleCancelReturn}>
              Cancel
            </Button>
            <Button className="flex-1 bg-black hover:bg-gray-800 text-white" onClick={handleConfirmReturn}>
              Confirm request
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  // Loading state
  if (isLoading) {
    return (
      <div className={isMobile ? "min-h-screen bg-white p-4" : ""}>
        {isMobile ? (
          <div className="bg-white py-4 px-4 flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Link href="/profile/orders" className="mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-lg font-medium">Order #{orderId}</h1>
            </div>
          </div>
        ) : (
          <ProfileLayout title={`Order #${orderId}`}>{breadcrumb}</ProfileLayout>
        )}

        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red mr-2" />
          <span>Loading order details...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (isError || !order) {
    return (
      <div className={isMobile ? "min-h-screen bg-white p-4" : ""}>
        {isMobile ? (
          <div className="bg-white py-4 px-4 flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Link href="/profile/orders" className="mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-lg font-medium">Order #{orderId}</h1>
            </div>
          </div>
        ) : (
          <ProfileLayout title={`Order #${orderId}`}>{breadcrumb}</ProfileLayout>
        )}

        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500 mb-2">Failed to load order details</p>
          <p className="text-sm text-gray-500 mb-4">
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </p>
          <Button onClick={() => window.location.reload()} className="mr-2">
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/profile/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Mobile view has a simpler layout with a back button
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white py-4 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/profile/orders" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-medium">Order #{order.reference}</h1>
          </div>
        </div>

        <div className="p-4">
          {/* Order Items */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">Order Items</h2>
            {order.items &&
              order.items.map((item) => (
                <div key={item.id} className="flex gap-4 mb-4 border-b pb-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={
                        item.product.images && item.product.images.length > 0
                          ? item.product.images[0].image
                          : "/placeholder.svg?height=64&width=64"
                      }
                      alt={item.product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">{item.product.description}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="font-bold">₦{Number(item.amount).toLocaleString()}</p>
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Date of order</p>
              <p className="font-medium">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order.reference}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date delivered</p>
              <p className="font-medium">{order.delivery_date ? formatDate(order.delivery_date) : "Pending"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className={getOrderStatusColor(order.status)}>{order.status}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₦{(Number(order.amount) * 0.925).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (7.5%)</span>
                <span>₦{(Number(order.amount) * 0.075).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total</span>
                <span>₦{Number(order.amount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Shipping Address</h3>
              <p className="text-sm">
                {order.shipping.address}, {order.shipping.city}, {order.shipping.state} {order.shipping.postal_code}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleRequestReturn}
              disabled={order.status.toLowerCase() !== "delivered"}
            >
              Return order
            </Button>
            <Button className="flex-1 bg-black hover:bg-gray-800 text-white" asChild>
              <Link href="/profile/orders">Back to Orders</Link>
            </Button>
          </div>
        </div>

        {/* Return confirmation modal */}
        {showReturnModal && returnModal}
      </div>
    )
  }

  // Desktop view with sidebar
  return (
    <ProfileLayout title={`Order #${order.reference}`}>
      {breadcrumb}

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-6">
          {/* Order header */}
          <div className="flex justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Order #{order.reference}</h2>
              <p className="text-sm text-gray-500">Placed on {formatDate(order.created_at)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Status</p>
              <p className={`font-medium ${getOrderStatusColor(order.status)}`}>{order.status}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Order Items</h3>
            {order.items &&
              order.items.map((item) => (
                <div key={item.id} className="flex gap-4 mb-4 border-b pb-4">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={
                        item.product.images && item.product.images.length > 0
                          ? item.product.images[0].image
                          : "/placeholder.svg?height=80&width=80"
                      }
                      alt={item.product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">{item.product.description}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="font-bold">₦{Number(item.amount).toLocaleString()}</p>
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Order details in two columns */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            {/* Left column - Order summary */}
            <div>
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₦{(Number(order.amount) * 0.925).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (7.5%)</span>
                    <span>₦{(Number(order.amount) * 0.075).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>₦{Number(order.amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Shipping details */}
            <div>
              <h3 className="text-lg font-medium mb-4">Shipping Details</h3>
              {order.shipping ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-2">{order.shipping.address}</p>
                  <p>
                    {order.shipping.city}, {order.shipping.state} {order.shipping.postal_code}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500">Shipping information not available</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleRequestReturn}
              disabled={order.status.toLowerCase() !== "delivered"}
            >
              Request return
            </Button>
            <Button className="flex-1 bg-black hover:bg-gray-800 text-white" asChild>
              <Link href="/profile/orders">Back to Orders</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Return confirmation modal */}
      {showReturnModal && returnModal}
    </ProfileLayout>
  )
}

