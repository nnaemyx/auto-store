"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, X, Loader2 } from "lucide-react"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useReturnRequests, type ReturnRequest } from "@/hooks/use-return-requests"
import { formatDate } from "@/hooks/use-orders"

export default function ReturnRequestsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showReturnDetails, setShowReturnDetails] = useState(false)
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null)

  // Fetch return requests
  const { data: returns, isLoading, isError, error } = useReturnRequests()

  // Breadcrumb for desktop
  const breadcrumb = (
    <div className="text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-brand-red">
        Homepage
      </Link>
      {" / "}
      <span className="font-medium text-gray-700">Return requests</span>
    </div>
  )

  const handleViewDetails = (returnItem: ReturnRequest) => {
    setSelectedReturn(returnItem)
    setShowReturnDetails(true)
  }

  const handleCloseDetails = () => {
    setShowReturnDetails(false)
    setSelectedReturn(null)
  }

  // Loading state
  if (isLoading) {
    return (
      <ProfileLayout title="Return requests">
        {!isMobile && breadcrumb}
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red mr-2" />
          <span>Loading your return requests...</span>
        </div>
      </ProfileLayout>
    )
  }

  // Error state
  if (isError) {
    return (
      <ProfileLayout title="Return requests">
        {!isMobile && breadcrumb}
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500 mb-2">Failed to load return requests</p>
          <p className="text-sm text-gray-500 mb-4">
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </ProfileLayout>
    )
  }

  // Empty state
  if (!returns || returns.length === 0) {
    return (
      <ProfileLayout title="Return requests">
        {!isMobile && breadcrumb}
        <div className="text-center py-12">
          <p className="text-lg font-medium mb-2">You haven&apos;t made any return requests yet</p>
          <p className="text-sm text-gray-500 mb-4">When you request a return, it will appear here</p>
          <Button asChild className="bg-black hover:bg-gray-800 text-white">
            <Link href="/profile/orders">View Orders</Link>
          </Button>
        </div>
      </ProfileLayout>
    )
  }

  // Return details modal
  const returnDetailsModal = selectedReturn && (
    <div className="fixed inset-0 bg-white md:bg-black md:bg-opacity-50 flex items-center justify-center z-50 md:p-4">
      <div className="bg-white md:rounded-lg md:max-w-2xl w-full h-full md:h-auto overflow-auto">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Return Order #{selectedReturn.id}</h2>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCloseDetails}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
              <Image
                src={
                  selectedReturn.product?.images && selectedReturn.product.images.length > 0
                    ? selectedReturn.product.images[0].image
                    : "/placeholder.svg?height=64&width=64"
                }
                alt={selectedReturn.product?.name || "Product"}
                fill
                className="object-contain p-2"
              />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h3 className="font-medium">{selectedReturn.product?.name || "Product"}</h3>
                <span className="text-yellow-500 text-sm">{selectedReturn.status || "Processing"}</span>
              </div>
              <p className="font-bold">
                ₦{selectedReturn.product ? Number(selectedReturn.product.amount).toLocaleString() : "0"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Item</p>
              <p className="font-medium">{selectedReturn.product?.name || "Product"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tracking ID</p>
              <p className="font-medium">N/A</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date ordered</p>
              <p className="font-medium">{formatDate(selectedReturn.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="font-medium">N/A</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Reason for return</h3>
            <p className="text-gray-700">{selectedReturn.reason}</p>
          </div>

          {selectedReturn.images && selectedReturn.images.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Uploaded pictures</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedReturn.images.map((image, index) => (
                  <div key={index} className="border border-gray-200 rounded-md aspect-square relative">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Return image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button className="w-full bg-black hover:bg-gray-800 text-white" onClick={handleCloseDetails}>
            {isMobile ? "Back to home" : "Go back"}
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <ProfileLayout title="Return requests">
      {!isMobile && breadcrumb}

      {/* Desktop layout - grid of returns */}
      {!isMobile && (
        <div className="grid grid-cols-2 gap-4">
          {returns.map((returnItem) => (
            <div key={returnItem.id} className="bg-white border rounded-lg overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">Return Request</h3>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <div className="p-4">
                <div className="flex gap-4 mb-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        returnItem.product?.images && returnItem.product.images.length > 0
                          ? returnItem.product.images[0].image
                          : "/placeholder.svg?height=64&width=64"
                      }
                      alt={returnItem.product?.name || "Product"}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{returnItem.product?.name || "Product"}</h4>
                    <p className="text-sm text-gray-500">{returnItem.product?.description || "Description"}</p>
                    <p className="font-bold mt-1">
                      ₦{returnItem.product ? Number(returnItem.product.amount).toLocaleString() : "0"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date of request</p>
                    <p>{formatDate(returnItem.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Order ID</p>
                    <p>#{returnItem.order_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Item ID</p>
                    <p>#{returnItem.order_item}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="text-yellow-500">{returnItem.status || "Processing"}</p>
                  </div>
                </div>

                <Button
                  className="w-full mt-4 bg-black hover:bg-gray-800 text-white"
                  onClick={() => handleViewDetails(returnItem)}
                >
                  View details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile layout - list of returns */}
      {isMobile && (
        <div className="space-y-4">
          {returns.map((returnItem) => (
            <div key={returnItem.id} className="bg-white border rounded-lg overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">Return Request</h3>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <div className="p-4">
                <div className="flex gap-4 mb-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        returnItem.product?.images && returnItem.product.images.length > 0
                          ? returnItem.product.images[0].image
                          : "/placeholder.svg?height=64&width=64"
                      }
                      alt={returnItem.product?.name || "Product"}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{returnItem.product?.name || "Product"}</h4>
                    <p className="text-sm text-gray-500">{returnItem.product?.description || "Description"}</p>
                    <p className="font-bold mt-1">
                      ₦{returnItem.product ? Number(returnItem.product.amount).toLocaleString() : "0"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date of request</p>
                    <p>{formatDate(returnItem.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Order ID</p>
                    <p>#{returnItem.order_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Item ID</p>
                    <p>#{returnItem.order_item}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="text-yellow-500">{returnItem.status || "Processing"}</p>
                  </div>
                </div>

                <Button
                  className="w-full mt-4 bg-black hover:bg-gray-800 text-white"
                  onClick={() => handleViewDetails(returnItem)}
                >
                  View details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Return details modal */}
      {showReturnDetails && returnDetailsModal}
    </ProfileLayout>
  )
}
