"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, X } from "lucide-react"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function ReturnRequestsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showReturnDetails, setShowReturnDetails] = useState(false)
  interface ReturnItem {
    id: string;
    name: string;
    description: string;
    price: string;
    date: string;
    dateDelivered: string;
    status: string;
    orderId: string;
    productName: string;
    productPrice: string;
    item: string;
    trackingId: string;
    reason: string;
    images: string[];
  }

  const [selectedReturn, setSelectedReturn] = useState<ReturnItem | null>(null)

  const [returns] = useState([
    {
      id: "3200",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      date: "03/12/2024",
      dateDelivered: "12/12/2024",
      status: "Processing",
      orderId: "#23635536",
      productName: "Name of product",
      productPrice: "50,687.90",
      item: "Toyota Camry Interior Seats",
      trackingId: "9675 6456 3454",
      reason:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim fghf fhfus skaks",
      images: [
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
      ],
    },
    {
      id: "3201",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      date: "03/12/2024",
      dateDelivered: "12/12/2024",
      status: "Processing",
      orderId: "#23635536",
      productName: "Name of product",
      productPrice: "50,687.90",
      item: "Toyota Camry Interior Seats",
      trackingId: "9675 6456 3454",
      reason:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim fghf fhfus skaks",
      images: [
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
      ],
    },
  ])

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

  const handleViewDetails = (returnItem: ReturnItem) => {
    setSelectedReturn(returnItem)
    setShowReturnDetails(true)
  }

  const handleCloseDetails = () => {
    setShowReturnDetails(false)
    setSelectedReturn(null)
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
                src="/placeholder.svg?height=64&width=64"
                alt={selectedReturn.productName}
                fill
                className="object-contain p-2"
              />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h3 className="font-medium">{selectedReturn.productName}</h3>
                <span className="text-yellow-500 text-sm">Request processing</span>
              </div>
              <p className="font-bold">₦{selectedReturn.productPrice}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Item</p>
              <p className="font-medium">{selectedReturn.item}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tracking ID</p>
              <p className="font-medium">{selectedReturn.trackingId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date ordered</p>
              <p className="font-medium">{selectedReturn.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="font-medium">{selectedReturn.dateDelivered}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Reason for return</h3>
            <p className="text-gray-700">{selectedReturn.reason}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Uploaded pictures</h3>
            <div className="grid grid-cols-2 gap-2">
              {selectedReturn.images.map((image: string, index: number) => (
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
          {returns.map((returnItem, index) => (
            <div key={index} className="bg-white border rounded-lg overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">Name of item</h3>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <div className="p-4">
                <div className="flex gap-4 mb-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src="/placeholder.svg?height=64&width=64"
                      alt={returnItem.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{returnItem.name}</h4>
                    <p className="text-sm text-gray-500">{returnItem.description}</p>
                    <p className="font-bold mt-1">₦{returnItem.price}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date of order</p>
                    <p>{returnItem.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Order ID</p>
                    <p>{returnItem.orderId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date delivered</p>
                    <p>{returnItem.dateDelivered}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="text-yellow-500">{returnItem.status}</p>
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
          {returns.map((returnItem, index) => (
            <div key={index} className="bg-white border rounded-lg overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">Name of item</h3>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <div className="p-4">
                <div className="flex gap-4 mb-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src="/placeholder.svg?height=64&width=64"
                      alt={returnItem.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{returnItem.name}</h4>
                    <p className="text-sm text-gray-500">{returnItem.description}</p>
                    <p className="font-bold mt-1">₦{returnItem.price}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date of order</p>
                    <p>{returnItem.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Order ID</p>
                    <p>{returnItem.orderId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date delivered</p>
                    <p>{returnItem.dateDelivered}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="text-yellow-500">{returnItem.status}</p>
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

