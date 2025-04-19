"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useReturnRequests } from "@/hooks/use-return-requests"
import { formatDate } from "@/hooks/use-orders"

export default function ReturnRequestsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  
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

  return (
    <ProfileLayout title="Return requests">
      {!isMobile && breadcrumb}

      {/* Desktop layout - grid of returns */}
      {!isMobile && (
        <div className="grid grid-cols-2 gap-4">
          {returns.map((returnItem) => (
            <div key={returnItem.id} className="bg-white border rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex gap-4 mb-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        returnItem.products && returnItem.products.length > 0 && returnItem.products[0].images && returnItem.products[0].images.length > 0
                          ? returnItem.products[0].images[0].image
                          : "/placeholder.png"
                      }
                      alt={returnItem.products && returnItem.products.length > 0 ? returnItem.products[0].name : "Product"}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{returnItem.products && returnItem.products.length > 0 ? returnItem.products[0].name : "Product"}</h4>
                    <p className="text-sm text-gray-500">{returnItem.products && returnItem.products.length > 0 ? returnItem.products[0].description : "Description"}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500">Order ID: #{returnItem.order_id}</p>
                      <p className="font-bold">₦{returnItem.products && returnItem.products.length > 0 && returnItem.products[0].amount ? Number(returnItem.products[0].amount).toLocaleString() : "0"}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date of request</p>
                    <p>{formatDate(returnItem.created_at)}</p>
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
              <div className="p-4">
                <div className="flex gap-4 mb-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        returnItem.products && returnItem.products.length > 0 && returnItem.products[0].images && returnItem.products[0].images.length > 0
                          ? returnItem.products[0].images[0].image
                          : "/placeholder.png"
                      }
                      alt={returnItem.products && returnItem.products.length > 0 ? returnItem.products[0].name : "Product"}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{returnItem.products && returnItem.products.length > 0 ? returnItem.products[0].name : "Product"}</h4>
                    <p className="text-sm text-gray-500">{returnItem.products && returnItem.products.length > 0 ? returnItem.products[0].description : "Description"}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500">Order ID: #{returnItem.order_id}</p>
                      <p className="font-bold">₦{returnItem.products && returnItem.products.length > 0 && returnItem.products[0].amount ? Number(returnItem.products[0].amount).toLocaleString() : "0"}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date of request</p>
                    <p>{formatDate(returnItem.created_at)}</p>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </ProfileLayout>
  )
}
