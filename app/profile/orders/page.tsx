"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, X, Loader2 } from "lucide-react"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useOrders, formatDate, getOrderStatusColor } from "@/hooks/use-orders"

export default function OrderHistoryPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [returnReason, setReturnReason] = useState("")
  interface OrderMetadata {
    [key: string]: string | number | boolean | null | undefined;
  }

  const [orderMetadata, setOrderMetadata] = useState<OrderMetadata>({})

  // Fetch orders using the hook
  const { data: orders, isLoading, isError, error } = useOrders()

  // Fetch metadata from localStorage on component mount
  useEffect(() => {
    const fetchOrderMetadata = () => {
      try {
        // Get any stored payment metadata
        const storedMetadata = localStorage.getItem("paymentMetadata")
        const checkoutResponse = localStorage.getItem("checkoutResponse")
        
        // Create a metadata object combining all sources
        const metadata = {
          ...(storedMetadata ? JSON.parse(storedMetadata) : {}),
          ...(checkoutResponse ? JSON.parse(checkoutResponse) : {})
        }
        
        setOrderMetadata(metadata)
        console.log("Fetched order metadata:", metadata)
      } catch (err) {
        console.error("Error fetching order metadata:", err)
      }
    }

    fetchOrderMetadata()
  }, [])

  // Enhanced function to get additional order details including metadata
  const getOrderDetails = (orderId: string) => {
    // Find order in our list
    const order = orders?.find(order => order.id.toString() === orderId)
    
    // Match with stored metadata if possible
    // In a real app, you'd probably match via order reference, transaction ID, etc.
    const enrichedOrder = {
      ...order,
      metadata: orderMetadata
    }
    
    return enrichedOrder
  }

  // Breadcrumb for desktop
  const breadcrumb = (
    <div className="text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-brand-red">
        Homepage
      </Link>
      {" / "}
      <span className="font-medium text-gray-700">Order history</span>
    </div>
  )

  const handleRequestReturn = (orderId: string) => {
    setSelectedOrderId(orderId)
    setShowReturnModal(true)
  }

  const handleConfirmReturn = () => {
    // In a real app, you would submit the return request to your backend
    // Include any relevant metadata from the enriched order
    const orderDetails = getOrderDetails(selectedOrderId as string)
    
    console.log("Return requested for order:", selectedOrderId, "Reason:", returnReason, "Metadata:", orderDetails.metadata)
    setShowReturnModal(false)
    setSelectedOrderId(null)
    setReturnReason("")
  }

  const handleCancelReturn = () => {
    setShowReturnModal(false)
    setSelectedOrderId(null)
    setReturnReason("")
  }

  // Function to handle order detail click - store metadata for detail page
  const handleViewOrderDetails = (orderId: string) => {
    try {
      // Get the enriched order with metadata
      const orderDetails = getOrderDetails(orderId)
      
      // Store the current order details for the detail page to access
      localStorage.setItem("currentOrderDetails", JSON.stringify(orderDetails))
    } catch (err) {
      console.error("Error preparing order details:", err)
    }
  }

  // Return confirmation modal
  const returnModal = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Confirm return request?</h2>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCancelReturn}>
              <X className="h-5 w-5" />
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
      <ProfileLayout title="Order history">
        {!isMobile && breadcrumb}
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red mr-2" />
          <span>Loading your orders...</span>
        </div>
      </ProfileLayout>
    )
  }

  // Error state
  if (isError) {
    return (
      <ProfileLayout title="Order history">
        {!isMobile && breadcrumb}
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500 mb-2">Failed to load orders</p>
          <p className="text-sm text-gray-500 mb-4">
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </ProfileLayout>
    )
  }

  // Empty state
  if (!orders || orders.length === 0) {
    return (
      <ProfileLayout title="Order history">
        {!isMobile && breadcrumb}
        <div className="text-center py-12">
          <p className="text-lg font-medium mb-2">You haven&#39;t placed any orders yet</p>
          <p className="text-sm text-gray-500 mb-4">When you place an order, it will appear here</p>
          <Button asChild className="bg-black hover:bg-gray-800 text-white">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </ProfileLayout>
    )
  }

  return (
    <ProfileLayout title="Order history">
      {!isMobile && breadcrumb}

      {/* Desktop layout - grid of orders */}
      {!isMobile && (
        <div className="grid grid-cols-2 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border rounded-lg overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">Order #{order.reference}</h3>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <div className="p-4">
                {order.items && order.items.length > 0 && (
                  <div className="flex gap-4 mb-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
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
                    <div>
                      <h4 className="font-medium">{order.items[0].product.name}</h4>
                      <p className="text-sm text-gray-500">
                        {order.items.length > 1 ? `+${order.items.length - 1} more items` : ""}
                      </p>
                      <p className="font-bold mt-1">₦{Number(order.amount).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date of order</p>
                    <p>{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Reference number</p>
                    <p>{order.reference}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date delivered</p>
                    <p>{order.delivery_date ? formatDate(order.delivery_date) : "Pending"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className={getOrderStatusColor(order.status)}>{order.status}</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleRequestReturn(order.id.toString())}
                    disabled={order.status.toLowerCase() !== "delivered"}
                  >
                    Request return
                  </Button>
                  <Button 
                    className="flex-1 bg-black hover:bg-gray-800 text-white" 
                    asChild
                    onClick={() => handleViewOrderDetails(order.id.toString())}
                  >
                    <Link href={`/profile/orders/${order.id}`}>View details</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile layout - list of orders */}
      {isMobile && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border rounded-lg overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">Order #{order.reference}</h3>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <div className="p-4">
                {order.items && order.items.length > 0 && (
                  <div className="flex gap-4 mb-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
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
                    <div>
                      <h4 className="font-medium">{order.items[0].product.name}</h4>
                      <p className="text-sm text-gray-500">
                        {order.items.length > 1 ? `+${order.items.length - 1} more items` : ""}
                      </p>
                      <p className="font-bold mt-1">₦{Number(order.amount).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date of order</p>
                    <p>{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Order ID</p>
                    <p>{order.reference}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date delivered</p>
                    <p>{order.delivery_date ? formatDate(order.delivery_date) : "Pending"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className={getOrderStatusColor(order.status)}>{order.status}</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleRequestReturn(order.id.toString())}
                    disabled={order.status.toLowerCase() !== "delivered"}
                  >
                    Return order
                  </Button>
                  <Button 
                    className="flex-1 bg-black hover:bg-gray-800 text-white" 
                    asChild
                    onClick={() => handleViewOrderDetails(order.id.toString())}
                  >
                    <Link href={`/profile/orders/${order.id}`}>View details</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Return confirmation modal */}
      {showReturnModal && returnModal}
    </ProfileLayout>
  )
}