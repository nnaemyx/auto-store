"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, Loader2 } from "lucide-react"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useAuth } from "@/api/use-auth"

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  images: Array<{ image: string }>
}

interface OrderDetails {
  id: string
  status: string
  tracking_id: string
  date_ordered: string
  estimated_delivery: string
  shipping_status: string
  shipping_steps: Array<{
    date: string
    time: string
    status: string
    completed: boolean
  }>
  items: OrderItem[]
  total_amount: number
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { api } = useAuth()

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { id } = await params
        const response = await api.get<OrderDetails>(`/order/${id}`)
        setOrderDetails(response)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [params, api])

  // For desktop modal view
  const [showModal, setShowModal] = useState(true)

  if (isLoading) {
    return (
      <ProfileLayout title="Loading...">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
        </div>
      </ProfileLayout>
    )
  }

  if (error || !orderDetails) {
    return (
      <ProfileLayout title="Error">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Order</h2>
          <p className="text-gray-600 mb-4">{error || "Failed to load order details"}</p>
          <Link href="/profile/track-order">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>
      </ProfileLayout>
    )
  }

  // Breadcrumb for desktop
  const breadcrumb = (
    <div className="text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-brand-red">
        Homepage
      </Link>
      {" / "}
      <Link href="/profile/track-order" className="hover:text-brand-red">
        Track order
      </Link>
      {" / "}
      <span className="font-medium text-gray-700">Order #{orderDetails.id}</span>
    </div>
  )

  // Progress bar calculation
  const progressPercentage = () => {
    const completedSteps = orderDetails.shipping_steps.filter((step) => step.completed).length
    return (completedSteps / orderDetails.shipping_steps.length) * 100
  }

  // Desktop modal view
  if (!isMobile && showModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-medium">Order #{orderDetails.id}</h2>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowModal(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6">
            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-medium mb-4">Order Items</h3>
              <div className="space-y-4">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={item.images[0]?.image || "/placeholder.svg?height=64&width=64"}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <p className="font-bold">₦{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Tracking ID</p>
                <p className="font-medium">{orderDetails.tracking_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date ordered</p>
                <p className="font-medium">{orderDetails.date_ordered}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Est delivery date</p>
                <p className="font-medium">{orderDetails.estimated_delivery}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium">₦{orderDetails.total_amount.toLocaleString()}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="font-medium mb-2">{orderDetails.shipping_status}</p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${progressPercentage()}%` }}></div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-4">Shipping details</h3>
              <div className="space-y-6">
                {orderDetails.shipping_steps.map((step, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${step.completed ? "bg-black" : "bg-gray-300"}`}></div>
                      {index < orderDetails.shipping_steps.length - 1 && (
                        <div className={`w-0.5 h-full ${step.completed ? "bg-black" : "bg-gray-300"}`}></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {step.date} {step.time && `· ${step.time}`}
                      </p>
                      <p className="font-medium">{step.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 bg-black hover:bg-gray-800 text-white">Track order</Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                View order
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProfileLayout title={`Order #${orderDetails.id}`}>
      {!isMobile && breadcrumb}

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4">
          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-medium mb-4">Order Items</h3>
            <div className="space-y-4">
              {orderDetails.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={item.images[0]?.image || "/placeholder.svg?height=64&width=64"}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="font-bold">₦{item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Tracking ID</p>
              <p className="font-medium">{orderDetails.tracking_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date ordered</p>
              <p className="font-medium">{orderDetails.date_ordered}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Est delivery date</p>
              <p className="font-medium">{orderDetails.estimated_delivery}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium">₦{orderDetails.total_amount.toLocaleString()}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-medium mb-2">{orderDetails.shipping_status}</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${progressPercentage()}%` }}></div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-4">Shipping details</h3>
            <div className="space-y-6">
              {orderDetails.shipping_steps.map((step, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${step.completed ? "bg-black" : "bg-gray-300"}`}></div>
                    {index < orderDetails.shipping_steps.length - 1 && (
                      <div className={`w-0.5 h-full ${step.completed ? "bg-black" : "bg-gray-300"}`}></div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {step.date} {step.time && `· ${step.time}`}
                    </p>
                    <p className="font-medium">{step.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 bg-black hover:bg-gray-800 text-white">Track order</Button>
            <Link href="/profile/track-order" className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </ProfileLayout>
  )
}

