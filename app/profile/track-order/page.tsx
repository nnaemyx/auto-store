"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function TrackOrderPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [orders] = useState([
    {
      id: "329388",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      date: "12/12/2024",
      estimatedDelivery: "05/01/2025",
      status: "Order shipped",
    },
    {
      id: "329388",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      date: "12/12/2024",
      estimatedDelivery: "05/01/2025",
      status: "Order shipped",
    },
    {
      id: "329388",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      date: "12/12/2024",
      estimatedDelivery: "05/01/2025",
      status: "Order shipped",
    },
    {
      id: "329388",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      date: "12/12/2024",
      estimatedDelivery: "05/01/2025",
      status: "Order shipped",
    },
    {
      id: "329388",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      date: "12/12/2024",
      estimatedDelivery: "05/01/2025",
      status: "Order shipped",
    },
    {
      id: "329388",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      date: "12/12/2024",
      estimatedDelivery: "05/01/2025",
      status: "Order shipped",
    },
  ])

  // Breadcrumb for desktop
  const breadcrumb = (
    <div className="text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-brand-red">
        Homepage
      </Link>
      {" / "}
      <span className="font-medium text-gray-700">Track order</span>
    </div>
  )

  return (
    <ProfileLayout title="Track order">
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
                    <p>#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Est. delivery date</p>
                    <p>{order.estimatedDelivery}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="text-yellow-500">{order.status}</p>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-black hover:bg-gray-800 text-white">View details</Button>
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
                    <p className="text-gray-500">Reference number</p>
                    <p>#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Est. delivery date</p>
                    <p>{order.estimatedDelivery}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="text-yellow-500">{order.status}</p>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-black hover:bg-gray-800 text-white">View details</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ProfileLayout>
  )
}

