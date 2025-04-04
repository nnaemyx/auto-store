"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { CartItem } from "@/hooks/use-cart"

interface OrderSuccessProps {
  orderDetails: {
    shipping: {
      email: string
      address: string
      city: string
      state: string
      zipCode: string
    }
    payment: {
      method: string
      amount: number
      transactionId: string
    }
    checkout?: {
      email?: string
    }
    orderDate: Date
    estimatedDelivery: Date
    orderNumber: string
  }
  cartItems: CartItem[]
}

export default function OrderSuccess({ orderDetails, cartItems }: OrderSuccessProps) {
  const [showModal, setShowModal] = useState(true)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleTrackOrder = () => {
    // In a real app, this would navigate to an order tracking page
    console.log("Track order clicked")
  }

  const handleBackHome = () => {
    // Navigate back to home
    window.location.href = "/"
  }

  // If modal is closed, show the full page version
  if (!showModal) {
    return (
      <div>
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-red">
            Homepage
          </Link>
          {" / "}
          <Link href="/cart" className="hover:text-brand-red">
            My cart
          </Link>
          {" / "}
          <Link href="/checkout" className="hover:text-brand-red">
            Confirm details
          </Link>
          {" / "}
          <span className="font-medium text-gray-700">Order success</span>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-lg border p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Order confirmed</h2>
          <p className="text-center text-xl mb-6">Your order is on the way!!!</p>

          <p className="text-center text-gray-600 mb-8">
            Thank you for your order! Your order number is <strong>#{orderDetails.orderNumber}</strong>. We&apos;ve sent
            a confirmation email to{" "}
            {orderDetails.shipping.email || orderDetails.checkout?.email || "your email address"}.
          </p>

          <div className="space-y-4 mb-8">
            {cartItems.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="relative w-16 h-16 bg-gray-50 rounded-md overflow-hidden">
                  <Image
                    src={
                      item.images && item.images.length > 0
                        ? item.images[0].image
                        : "/placeholder.svg?height=64&width=64"
                    }
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="font-bold">₦{Number(item.amount).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center mb-8">
            Your order is set to be delivered within 4-5 working days: {formatDate(orderDetails.estimatedDelivery)}
          </p>

          <div className="flex gap-4">
            <Button onClick={handleTrackOrder} className="flex-1 bg-black hover:bg-gray-800 text-white">
              Track order
            </Button>
            <Button variant="outline" onClick={handleBackHome} className="flex-1">
              Back home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Modal version
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={handleCloseModal} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="text-xl font-bold text-center mb-4">Order confirmed</h2>
        <p className="text-center text-lg mb-4">Your order is on the way!!!</p>

        <p className="text-center text-gray-600 mb-6">
          Thank you for your order! Your order number is <strong>#{orderDetails.orderNumber}</strong>. We&apos;ve sent a
          confirmation email to {orderDetails.shipping.email || orderDetails.checkout?.email || "your email address"}.
        </p>

        <div className="space-y-4 mb-6">
          {cartItems.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="relative w-16 h-16 bg-gray-50 rounded-md overflow-hidden">
                <Image
                  src={
                    item.images && item.images.length > 0 ? item.images[0].image : "/placeholder.svg?height=64&width=64"
                  }
                  alt={item.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="font-bold">₦{Number(item.amount).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mb-6">
          Your order is set to be delivered within 4-5 working days: {formatDate(orderDetails.estimatedDelivery)}
        </p>

        <div className="flex gap-4">
          <Button onClick={handleTrackOrder} className="flex-1 bg-black hover:bg-gray-800 text-white">
            Track order
          </Button>
          <Button variant="outline" onClick={handleBackHome} className="flex-1">
            Back home
          </Button>
        </div>
      </div>
    </div>
  )
}

