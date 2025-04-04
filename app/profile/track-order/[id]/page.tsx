import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function OrderDetailsPage({ params }: { params: Promise<{ id:string }> }) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  const fetchParams = async () => {
    const { id } = await params
    console.log(id)
    return id
  }

  const id = fetchParams()
  console.log(id)
  const [orderDetails] = useState({
    id: "3200",
    productName: "Name of product",
    productPrice: "50,687.90",
    status: "In progress",
    item: "Toyota Camry Interior Seats",
    trackingId: "9675 6456 3454",
    dateOrdered: "03/12/2024",
    estimatedDelivery: "12/12/2025",
    shippingStatus: "Shipped . In transit",
    shippingSteps: [
      {
        date: "03/12/2024",
        time: "5:23 PM",
        status: "Order placed and confirmed",
        completed: true,
      },
      {
        date: "04/12/2024",
        time: "7:45 AM",
        status: "Product packaged",
        completed: true,
      },
      {
        date: "04/12/2024",
        time: "9:00AM",
        status: "Products Shipped",
        completed: true,
      },
      {
        date: "04/12/2024",
        time: "",
        status: "Order delivered",
        completed: false,
      },
    ],
  })

  // For desktop modal view
  const [showModal, setShowModal] = useState(true)

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
    const completedSteps = orderDetails.shippingSteps.filter((step) => step.completed).length
    return (completedSteps / orderDetails.shippingSteps.length) * 100
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
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                <Image
                  src="/placeholder.svg?height=64&width=64"
                  alt={orderDetails.productName}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div>
                <div className="flex items-center gap-4">
                  <h3 className="font-medium">{orderDetails.productName}</h3>
                  <span className="text-yellow-500 text-sm">{orderDetails.status}</span>
                </div>
                <p className="font-bold">₦{orderDetails.productPrice}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Item</p>
                <p className="font-medium">{orderDetails.item}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tracking ID</p>
                <p className="font-medium">{orderDetails.trackingId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date ordered</p>
                <p className="font-medium">{orderDetails.dateOrdered}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Est delivery date</p>
                <p className="font-medium">{orderDetails.estimatedDelivery}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="font-medium mb-2">{orderDetails.shippingStatus}</p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${progressPercentage()}%` }}></div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-4">Shipping details</h3>
              <div className="space-y-6">
                {orderDetails.shippingSteps.map((step, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${step.completed ? "bg-black" : "bg-gray-300"}`}></div>
                      {index < orderDetails.shippingSteps.length - 1 && (
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
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
              <Image
                src="/placeholder.svg?height=64&width=64"
                alt={orderDetails.productName}
                fill
                className="object-contain p-2"
              />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h3 className="font-medium">{orderDetails.productName}</h3>
                <span className="text-yellow-500 text-sm">{orderDetails.status}</span>
              </div>
              <p className="font-bold">₦{orderDetails.productPrice}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Item</p>
              <p className="font-medium">{orderDetails.item}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tracking ID</p>
              <p className="font-medium">{orderDetails.trackingId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date ordered</p>
              <p className="font-medium">{orderDetails.dateOrdered}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Est delivery date</p>
              <p className="font-medium">{orderDetails.estimatedDelivery}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-medium mb-2">{orderDetails.shippingStatus}</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${progressPercentage()}%` }}></div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-4">Shipping details</h3>
            <div className="space-y-6">
              {orderDetails.shippingSteps.map((step, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${step.completed ? "bg-black" : "bg-gray-300"}`}></div>
                    {index < orderDetails.shippingSteps.length - 1 && (
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
                Back
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </ProfileLayout>
  )
}

