"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useOrders, useOrder } from "@/hooks/use-orders"
import OrderCard from "@/components/checkout/order-card"
import OrderDetailsModal from "@/components/checkout/order-details-modal"

export default function OrderHistoryPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Fetch orders using the hook
  const { data: orders, isLoading, isError, error } = useOrders()

  // Fetch selected order details when needed
  const { data: selectedOrder, isLoading: isLoadingOrder } = useOrder(selectedOrderId || 0)

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

  const handleViewDetails = (orderId: number) => {
    setSelectedOrderId(orderId)
    setIsDetailsModalOpen(true)
  }

  const handleRequestReturn = (orderId: number) => {
    // First open the details modal
    setSelectedOrderId(orderId)
    setIsDetailsModalOpen(true)
    // The return request will be handled within the modal
  }

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false)
    // Don't reset selectedOrderId immediately to avoid flickering during close animation
    setTimeout(() => {
      setSelectedOrderId(null)
    }, 300)
  }

  // Loading state
  if (isLoading) {
    return (
      <ProfileLayout title="Order history">
        {!isMobile && breadcrumb}
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red mr-2" />
          <span>Loading your orders...</span>
        </div>
      </ProfileLayout>
    )
  }

  // Error state
  if (isError) {
    return (
      <ProfileLayout title="Order history">
        {!isMobile && breadcrumb}
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500 mb-2">Failed to load orders</p>
          <p className="text-sm text-gray-500 mb-4">
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </ProfileLayout>
    )
  }

  // Empty state
  if (!orders || orders.length === 0) {
    return (
      <ProfileLayout title="Order history">
        {!isMobile && breadcrumb}
        <div className="text-center py-12">
          <p className="text-lg font-medium mb-2">You haven&apos;t placed any orders yet</p>
          <p className="text-sm text-gray-500 mb-4">When you place an order, it will appear here</p>
          <Button asChild className="bg-black hover:bg-gray-800 text-white">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </ProfileLayout>
    )
  }

  return (
    <ProfileLayout title="Order history">
      {!isMobile && breadcrumb}

      {/* Order Cards Grid */}
      <div className={isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onViewDetails={handleViewDetails}
            onRequestReturn={handleRequestReturn}
          />
        ))}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder || null}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        isLoading={isLoadingOrder}
      />
    </ProfileLayout>
  )
}
