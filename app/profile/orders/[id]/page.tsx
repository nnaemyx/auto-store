"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Upload } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useOrder, formatDate, getOrderStatusColor } from "@/hooks/use-orders"
import { useSubmitReturnRequest } from "@/hooks/use-return-requests"
import { useRouter } from "next/navigation"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const orderId = params.id
  const isMobile = useMediaQuery("(max-width: 768px)")
  const router = useRouter()

  const [showReturnModal, setShowReturnModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [returnReason, setReturnReason] = useState("")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  // Fetch order details
  const { data: order, isLoading, isError, error } = useOrder(orderId)

  // Return request mutation
  const { submitReturnRequest, isSubmitting } = useSubmitReturnRequest()

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

  const handleCancelReturn = () => {
    setShowReturnModal(false)
    setReturnReason("")
    setUploadedImages([])
  }

  const handleProceedToConfirm = () => {
    setShowReturnModal(false)
    setShowConfirmModal(true)
  }

  const handleConfirmReturn = () => {
    if (!order) return

    // Get the order item ID from the first product
    const orderItemId =
      order.products && order.products.length > 0
        ? order.products[0].id.toString()
        : order.items && order.items.length > 0
          ? order.items[0].id.toString()
          : ""

    submitReturnRequest({
      order_id: order.id.toString(),
      order_item: orderItemId,
      reason: returnReason,
    })

    setShowConfirmModal(false)
    setReturnReason("")
    setUploadedImages([])

    // Navigate to return requests page
    router.push("/profile/returns")
  }

  const handleCancelConfirm = () => {
    setShowConfirmModal(false)
    setShowReturnModal(true)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // Convert files to array and create URLs
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
    setUploadedImages((prev) => [...prev, ...newImages])
  }

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

  // Return confirmation modal
  const returnModal = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Return Order #{order.reference || order.id}</h2>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCancelReturn}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Product info */}
          <div className="flex items-center gap-4 mb-4">
            {order.items && order.items.length > 0 && (
              <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                <Image
                  src={
                    order.items[0].product.images && order.items[0].product.images.length > 0
                      ? order.items[0].product.images[0].image
                      : "/placeholder.svg?height=64&width=64"
                  }
                  alt={order.items[0].product.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
            )}
            {order.products && order.products.length > 0 && !order.items && (
              <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                <Image src="/placeholder.svg?height=64&width=64" alt="Product" fill className="object-contain p-2" />
              </div>
            )}
            <div>
              <h3 className="font-medium">
                {order.items && order.items.length > 0 ? order.items[0].product.name : "Product"}
              </h3>
              <p className="text-sm">
                {order.delivery_date ? `Delivered · ${formatDate(order.delivery_date)}` : "Not delivered yet"}
              </p>
              <p className="font-bold">
                ₦
                {order.items && order.items.length > 0
                  ? Number(order.items[0].price).toLocaleString()
                  : Number(order.amount).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="returnReason" className="block text-sm font-medium mb-2">
              What&apos;s your reason for the return?
            </label>
            <Textarea
              id="returnReason"
              className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
              placeholder="State your reason here"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <p className="block text-sm font-medium mb-2">Upload pictures (optional)</p>
            <div className="grid grid-cols-2 gap-2">
              {uploadedImages.map((image, index) => (
                <div key={index} className="border border-gray-200 rounded-md aspect-square relative">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Uploaded image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    className="absolute top-1 right-1 bg-white rounded-full p-1"
                    onClick={() => setUploadedImages((prev) => prev.filter((_, i) => i !== index))}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {uploadedImages.length < 4 && (
                <label className="border border-dashed border-gray-200 rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    multiple={uploadedImages.length < 3}
                  />
                </label>
              )}
              {/* Add empty placeholders to maintain grid */}
              {Array.from({ length: Math.max(0, 3 - uploadedImages.length) }).map((_, index) => (
                <div key={`empty-${index}`} className="border border-dashed border-gray-200 rounded-md aspect-square" />
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={handleCancelReturn}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-black hover:bg-gray-800 text-white"
              onClick={handleProceedToConfirm}
              disabled={!returnReason.trim()}
            >
              Confirm request
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  // Confirmation dialog
  const confirmationModal = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h2 className="text-lg font-medium text-center mb-4">Confirm return request?</h2>

          <p className="text-center mb-6">
            {returnReason.length > 100 ? returnReason.substring(0, 100) + "..." : returnReason}
          </p>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={handleCancelConfirm}>
              No, cancel request
            </Button>
            <Button
              className="flex-1 bg-black hover:bg-gray-800 text-white"
              onClick={handleConfirmReturn}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Yes, request return"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  // Mobile view has a simpler layout with a back button
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white py-4 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/profile/orders" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-medium">Order #{order.reference || order.id}</h1>
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
                      <p className="font-bold">₦{Number(item.price).toLocaleString()}</p>
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            {order.products &&
              !order.items &&
              order.products.map((item) => (
                <div key={item.id} className="flex gap-4 mb-4 border-b pb-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=64&width=64"
                      alt="Product"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Product</h3>
                    <p className="text-sm text-gray-500">Description</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="font-bold">₦{Number(item.price).toLocaleString()}</p>
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            {(!order.items || order.items.length === 0) && (!order.products || order.products.length === 0) && (
              <div className="text-center py-4">
                <p className="text-gray-500">No items found in this order</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Date of order</p>
              <p className="font-medium">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order.reference || order.id}</p>
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
              // Temporarily disabled for testing
              // disabled={order.status.toLowerCase() !== "delivered"}
            >
              Return order
            </Button>
            <Button className="flex-1 bg-black hover:bg-gray-800 text-white" asChild>
              <Link href="/profile/orders">Back to Orders</Link>
            </Button>
          </div>
        </div>

        {/* Return modals */}
        {showReturnModal && returnModal}
        {showConfirmModal && confirmationModal}
      </div>
    )
  }

  // Desktop view with sidebar
  return (
    <ProfileLayout title={`Order #${order.reference || order.id}`}>
      {breadcrumb}

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-6">
          {/* Order header */}
          <div className="flex justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Order #{order.reference || order.id}</h2>
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
                      <p className="font-bold">₦{Number(item.price).toLocaleString()}</p>
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            {order.products &&
              !order.items &&
              order.products.map((item) => (
                <div key={item.id} className="flex gap-4 mb-4 border-b pb-4">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt="Product"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Product</h3>
                    <p className="text-sm text-gray-500">Description</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="font-bold">₦{Number(item.price).toLocaleString()}</p>
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            {(!order.items || order.items.length === 0) && (!order.products || order.products.length === 0) && (
              <div className="text-center py-4">
                <p className="text-gray-500">No items found in this order</p>
              </div>
            )}
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
              // Temporarily disabled for testing
              // disabled={order.status.toLowerCase() !== "delivered"}
            >
              Request return
            </Button>
            <Button className="flex-1 bg-black hover:bg-gray-800 text-white" asChild>
              <Link href="/profile/orders">Back to Orders</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Return modals */}
      {showReturnModal && returnModal}
      {showConfirmModal && confirmationModal}
    </ProfileLayout>
  )
}
