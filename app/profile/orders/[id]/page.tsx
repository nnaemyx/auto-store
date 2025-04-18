"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useOrder, useOrderProduct } from "@/hooks/use-orders"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Loader2, Package, Truck, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast, ToastVariant } = useToast()
  const orderId = params.id as string
  const { data: order, isLoading, isError } = useOrder(orderId)
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false)

  // Get the first product from the order
  const firstProductId = order?.products && order.products.length > 0 ? order.products[0].id.toString() : undefined

  // Fetch product details with proper typing
  useOrderProduct(
    firstProductId ?? null, 
    order?.products as { [key: string]: unknown; id: number; name: string; description: string; images: { id: number; product_id: string; image: string; }[]; price: number; }[] | undefined
  )

  // Handle request return
  const handleRequestReturn = async () => {
    setIsSubmittingReturn(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Return Requested",
        description: `Return request for order #${orderId} has been submitted.`,
        variant: ToastVariant.Success,
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit return request. Please try again.",
        variant: ToastVariant.Error,
      })
    } finally {
      setIsSubmittingReturn(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red mx-auto mb-4" />
          <p className="text-lg font-medium">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Order</h2>
          <p className="text-gray-600 mb-4">We couldn&apos;t load the order details. Please try again later.</p>
          <Button asChild variant="outline">
            <Link href="/profile/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Get reference number
  const referenceNumber = order.order_code ? `#${order.order_code}` : `#${order.id}`

  // Get status - handle numeric status codes
  const statusName =
    typeof order?.status === "string" && !isNaN(Number(order.status))
      ? order.orderStatus?.name || "Processing"
      : order?.status || "Processing"

  // Get shipping details from checkOut
  const shippingDetails = order?.checkOut || {
    full_name: "N/A",
    phone_number: "N/A",
    address: "N/A",
    state: "N/A",
    town: "N/A",
    postal_code: "N/A",
  }

  // Format dates
  const orderDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A"

  const deliveryDate = order?.delivery_date
    ? new Date(order.delivery_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Pending"

  // Get order items
  const orderItems = order.products || []

  // Calculate order summary
  const subtotal = orderItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity || 1), 0)
  const deliveryFee = Number(order?.delivery_fee || 0)
  const total = Number(order?.amount || 0)
  const tax = total - subtotal - deliveryFee > 0 ? total - subtotal - deliveryFee : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-2 p-2" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Order Details {referenceNumber}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                {statusName.toLowerCase().includes("processing") ? (
                  <Package className="h-8 w-8 text-blue-500 mr-3" />
                ) : statusName.toLowerCase().includes("shipped") ? (
                  <Truck className="h-8 w-8 text-purple-500 mr-3" />
                ) : statusName.toLowerCase().includes("delivered") ? (
                  <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                ) : statusName.toLowerCase().includes("cancelled") ? (
                  <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
                ) : (
                  <Package className="h-8 w-8 text-gray-500 mr-3" />
                )}
                <div>
                  <h3 className="font-medium text-lg">{statusName}</h3>
                  <p className="text-sm text-gray-500">
                    {statusName.toLowerCase().includes("processing")
                      ? "Your order is being processed"
                      : statusName.toLowerCase().includes("shipped")
                        ? "Your order is on the way"
                        : statusName.toLowerCase().includes("delivered")
                          ? "Your order has been delivered"
                          : statusName.toLowerCase().includes("cancelled")
                            ? "Your order has been cancelled"
                            : "Your order is being prepared"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{orderDate}</p>
                {statusName.toLowerCase().includes("delivered") && (
                  <>
                    <p className="text-sm text-gray-500 mt-2">Delivery Date</p>
                    <p className="font-medium">{deliveryDate}</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {orderItems.length > 0 ? (
                  orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={
                            item.images && item.images.length > 0
                              ? item.images[0].image
                              : "/placeholder.svg?height=80&width=80"
                          }
                          alt={item.name || "Product"}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name || "Product"}</h4>
                        <p className="text-sm text-gray-500">{item.description || "Description"}</p>
                        <div className="flex justify-between mt-1">
                          <p className="text-sm">Qty: {item.quantity || 1}</p>
                          <p className="font-bold">₦{Number(item.price).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No items found for this order.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Details */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{shippingDetails.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{shippingDetails.phone_number}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{shippingDetails.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">State</p>
                  <p className="font-medium">{shippingDetails.state}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">City/Town</p>
                  <p className="font-medium">{shippingDetails.town}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Postal Code</p>
                  <p className="font-medium">{shippingDetails.postal_code}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>₦{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span>₦{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total amount</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full mb-3"
                  onClick={handleRequestReturn}
                  disabled={isSubmittingReturn || !statusName.toLowerCase().includes("delivered")}
                >
                  {isSubmittingReturn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Request Return"
                  )}
                </Button>
                <Button asChild className="w-full bg-black hover:bg-gray-800 text-white">
                  <Link href="/profile/orders">Back to Orders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
