"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [returnReason, setReturnReason] = useState("")

  const [orderDetails] = useState({
    id: resolvedParams?.id || "",
    name: "Name of Product",
    description: "Description",
    price: "40,500.00",
    date: "12/12/2024",
    dateDelivered: "05/01/2025",
    status: "Delivered",
    reference: "#329388",
  })

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
      <span className="font-medium text-gray-700">Order #{orderDetails.id}</span>
    </div>
  )

  const handleRequestReturn = () => {
    setShowReturnModal(true)
  }

  const handleConfirmReturn = () => {
    // In a real app, you would submit the return request to your backend
    console.log("Return requested for order:", orderDetails.id, "Reason:", returnReason)
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

  // Mobile view has a simpler layout with a back button
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white py-4 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/profile/orders" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-medium">Order #{orderDetails.id}</h1>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
              <Image
                src="/placeholder.svg?height=64&width=64"
                alt={orderDetails.name}
                fill
                className="object-contain p-2"
              />
            </div>
            <div>
              <h3 className="font-medium">{orderDetails.name}</h3>
              <p className="text-sm text-gray-500">{orderDetails.description}</p>
              <p className="font-bold mt-1">₦{orderDetails.price}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Date of order</p>
              <p className="font-medium">{orderDetails.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{orderDetails.reference}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date delivered</p>
              <p className="font-medium">{orderDetails.dateDelivered}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-green-500">{orderDetails.status}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={handleRequestReturn}>
              Return order
            </Button>
            <Button className="flex-1 bg-black hover:bg-gray-800 text-white" asChild>
              <Link href="/profile/orders">Back</Link>
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
    <ProfileLayout title={`Order #${orderDetails.id}`}>
      {breadcrumb}

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
              <Image
                src="/placeholder.svg?height=64&width=64"
                alt={orderDetails.name}
                fill
                className="object-contain p-2"
              />
            </div>
            <div>
              <h3 className="font-medium">{orderDetails.name}</h3>
              <p className="text-sm text-gray-500">{orderDetails.description}</p>
              <p className="font-bold mt-1">₦{orderDetails.price}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Date of order</p>
              <p className="font-medium">{orderDetails.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Reference number</p>
              <p className="font-medium">{orderDetails.reference}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date delivered</p>
              <p className="font-medium">{orderDetails.dateDelivered}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-green-500">{orderDetails.status}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={handleRequestReturn}>
              Request return
            </Button>
            <Button className="flex-1 bg-black hover:bg-gray-800 text-white" asChild>
              <Link href="/profile/orders">View details</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Return confirmation modal */}
      {showReturnModal && returnModal}
    </ProfileLayout>
  )
}

