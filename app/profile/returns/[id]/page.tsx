"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useReturnRequest } from "@/hooks/use-return-requests"
import { formatDate } from "@/hooks/use-orders"

export default function ReturnRequestDetailsPage({ params }: { params: { id: string } }) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { data: returnDetails, isLoading, isError, error } = useReturnRequest(params.id)

  // Breadcrumb for desktop
  const breadcrumb = (
    <div className="text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-brand-red">
        Homepage
      </Link>
      {" / "}
      <Link href="/profile/returns" className="hover:text-brand-red">
        Return requests
      </Link>
      {" / "}
      <span className="font-medium text-gray-700">Return #{params.id}</span>
    </div>
  )

  // Loading state
  if (isLoading) {
    return (
      <ProfileLayout title={`Return #${params.id}`}>
        {!isMobile && breadcrumb}
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red mr-2" />
          <span>Loading return request details...</span>
        </div>
      </ProfileLayout>
    )
  }

  // Error state
  if (isError || !returnDetails) {
    return (
      <ProfileLayout title={`Return #${params.id}`}>
        {!isMobile && breadcrumb}
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500 mb-2">Failed to load return request details</p>
          <p className="text-sm text-gray-500 mb-4">
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </p>
          <Button onClick={() => window.location.reload()} className="mr-2">
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/profile/returns">Back to Return Requests</Link>
          </Button>
        </div>
      </ProfileLayout>
    )
  }

  // Mobile view has a simpler layout with a back button
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white py-4 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/profile/returns" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-medium">Return #{returnDetails.id}</h1>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
              <Image
                src={
                  returnDetails.product?.images && returnDetails.product.images.length > 0
                    ? returnDetails.product.images[0].image
                    : "/placeholder.svg?height=64&width=64"
                }
                alt={returnDetails.product?.name || "Product"}
                fill
                className="object-contain p-2"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{returnDetails.product?.name || "Product"}</h3>
                <span className="text-yellow-500 text-sm">{returnDetails.status || "Processing"}</span>
              </div>
              <p className="font-bold">
                ₦{returnDetails.product ? Number(returnDetails.product.amount).toLocaleString() : "0"}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Item</p>
                <p className="font-medium">{returnDetails.product?.name || "Product"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tracking ID</p>
                <p className="font-medium">N/A</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date requested</p>
                <p className="font-medium">{formatDate(returnDetails.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-yellow-500">{returnDetails.status || "Processing"}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Reason for return</h3>
            <p className="text-gray-700">{returnDetails.reason}</p>
          </div>

          {returnDetails.images && returnDetails.images.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Uploaded pictures</h3>
              <div className="grid grid-cols-2 gap-2">
                {returnDetails.images.map((image, index) => (
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

          <Button className="w-full bg-black hover:bg-gray-800 text-white" asChild>
            <Link href="/profile/returns">Back to return requests</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Desktop view with sidebar
  return (
    <ProfileLayout title={`Return #${returnDetails.id}`}>
      {breadcrumb}

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
              <Image
                src={
                  returnDetails.product?.images && returnDetails.product.images.length > 0
                    ? returnDetails.product.images[0].image
                    : "/placeholder.svg?height=64&width=64"
                }
                alt={returnDetails.product?.name || "Product"}
                fill
                className="object-contain p-2"
              />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h3 className="font-medium">{returnDetails.product?.name || "Product"}</h3>
                <span className="text-yellow-500 text-sm">{returnDetails.status || "Processing"}</span>
              </div>
              <p className="font-bold">
                ₦{returnDetails.product ? Number(returnDetails.product.amount).toLocaleString() : "0"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Item</p>
              <p className="font-medium">{returnDetails.product?.name || "Product"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tracking ID</p>
              <p className="font-medium">N/A</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date requested</p>
              <p className="font-medium">{formatDate(returnDetails.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-yellow-500">{returnDetails.status || "Processing"}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Reason for return</h3>
            <p className="text-gray-700">{returnDetails.reason}</p>
          </div>

          {returnDetails.images && returnDetails.images.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Uploaded pictures</h3>
              <div className="grid grid-cols-4 gap-4">
                {returnDetails.images.map((image, index) => (
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

          <Button className="w-full bg-black hover:bg-gray-800 text-white" asChild>
            <Link href="/profile/returns">Back to return requests</Link>
          </Button>
        </div>
      </div>
    </ProfileLayout>
  )
}
