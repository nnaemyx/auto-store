"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, X } from "lucide-react"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function OrderHistoryPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [returnReason, setReturnReason] = useState("")

  const [orders, setOrders] = useState([
    {
      id: "329388",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      date: "12/12/2024",
      dateDelivered: "05/01/2025",
      status: "Delivered",
      reference: "#329388",
    },
    {
      id: "329388",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      date: "12/12/2024",
      dateDelivered: "05/01/2025",
      status: "Delivered",
      reference: "#329388",
    },
    {
      id: "329388",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      date: "12/12/2024",
      dateDelivered: "05/01/2025",
      status: "Delivered",
      reference: "#329388",
    },
    {
      id: "329388",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      date: "12/12/2024",
      dateDelivered: "05/01/2025",
      status: "Delivered",
      reference: "#329388",
    },
    {
      id: "329388",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      date: "12/12/2024",
      dateDelivered: "05/01/2025",
      status: "Delivered",
      reference: "#329388",
    },
    {
      id: "329388",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      date: "12/12/2024",
      dateDelivered: "05/01/2025",
      status: "Delivered",
      reference: "#329388",
    },
  ])

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
    console.log("Return requested for order:", selectedOrderId, "Reason:", returnReason)
    setShowReturnModal(false)
    setSelectedOrderId(null)
    setReturnReason("")
  }

  const handleCancelReturn = () => {
    setShowReturnModal(false)
    setSelectedOrderId(null)
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
              <X className="h-5 w-5" />
            </Button>
          </div>

          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim fghf fhfus skaks
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

  return (
    <ProfileLayout title="Order history">
      {!isMobile && breadcrumb}

      {/* Desktop layout - grid of orders */}
      {!isMobile && (
        <div className="grid grid-cols-2 gap-4">
          {orders.map((order, index) => (
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
                      alt={order.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{order.name}</h4>
                    <p className="text-sm text-gray-500">{order.description}</p>
                    <p className="font-bold mt-1">₦{order.price}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date of order</p>
                    <p>{order.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Reference number</p>
                    <p>{order.reference}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date delivered</p>
                    <p>{order.dateDelivered}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="text-green-500">{order.status}</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => handleRequestReturn(order.id)}>
                    Request return
                  </Button>
                  <Button className="flex-1 bg-black hover:bg-gray-800 text-white">View details</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile layout - list of orders */}
      {isMobile && (
        <div className="space-y-4">
          {orders.map((order, index) => (
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
                      alt={order.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{order.name}</h4>
                    <p className="text-sm text-gray-500">{order.description}</p>
                    <p className="font-bold mt-1">₦{order.price}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date of order</p>
                    <p>{order.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Order ID</p>
                    <p>{order.reference}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date delivered</p>
                    <p>{order.dateDelivered}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="text-green-500">{order.status}</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => handleRequestReturn(order.id)}>
                    Return order
                  </Button>
                  <Button className="flex-1 bg-black hover:bg-gray-800 text-white">View details</Button>
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

