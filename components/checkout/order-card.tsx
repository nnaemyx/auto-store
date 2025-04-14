"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { formatDate, getOrderStatusColor, type Order, useOrderProduct } from "@/hooks/use-orders"
import Link from "next/link"

// Define the Product type
interface Product {
  id: number
  name: string
  description?: string
  amount?: string | number
  price?: string | number
  images?: Array<{ id: number; product_id: string; image: string }>
  [key: string]: unknown
}

interface OrderCardProps {
  order: Order
  onViewDetails: (orderId: number) => void
  onRequestReturn: (orderId: number) => void
}

export default function OrderCard({ order, onViewDetails, onRequestReturn }: OrderCardProps) {
  // Get the first product from the order - handle both products and items arrays
  const firstProductId =
    order.products && order.products.length > 0
      ? order.products[0].product_id
      : order.items && order.items.length > 0
        ? order.items[0].product_id
        : undefined

  // Fetch product details with proper typing
  const { data: product, isLoading: isLoadingProduct } = useOrderProduct(firstProductId) as {
    data: Product | null
    isLoading: boolean
  }

  // Get reference number from metadata or fallback to order_code
  const referenceNumber = order.reference
    ? `#${order.reference}`
    : order.metadata?.reference
      ? `#${order.metadata.reference}`
      : order.metadata?.order_code
        ? `#${order.metadata.order_code}`
        : order.order_code
          ? `#${order.order_code}`
          : `#${order.id}`

  // Get product price
  const productPrice =
    order.products && order.products.length > 0
      ? Number(order.products[0].price).toLocaleString()
      : order.items && order.items.length > 0
        ? Number(order.items[0].price).toLocaleString()
        : Number(order.amount).toLocaleString()

  // Get status
  const status = order.orderStatus?.name || order.status || "Processing"
  const statusColor = getOrderStatusColor(order.orderStatus || order.status)

  // Format dates
  const orderDate = order.created_at ? formatDate(order.created_at) : "N/A"
  const deliveryDate = order.delivery_date ? formatDate(order.delivery_date) : "Pending"

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div
        className="p-4 border-b flex justify-between items-center cursor-pointer"
        onClick={() => onViewDetails(order.id)}
      >
        <h3 className="font-medium">Order {referenceNumber}</h3>
        <Link href={`/profile/orders/${order.id}`}>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Link>
      </div>

      {/* Product info */}
      <div className="p-4 flex gap-4">
        {isLoadingProduct ? (
          <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
          </div>
        ) : (
          <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={
                product?.images && product.images.length > 0
                  ? product.images[0].image
                  : "/placeholder.svg?height=80&width=80"
              }
              alt={product?.name || "Product"}
              fill
              className="object-contain p-2"
            />
          </div>
        )}
        <div>
          <h4 className="font-medium">{product?.name || "Product"}</h4>
          <p className="text-sm text-gray-500">{product?.description || "Description"}</p>
          <p className="font-bold mt-1">₦{productPrice}</p>
        </div>
      </div>

      {/* Order details */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-y-4">
        <div>
          <p className="text-sm text-gray-500">Date of order</p>
          <p className="font-medium">{orderDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Reference number</p>
          <p className="font-medium">{referenceNumber}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Date delivered</p>
          <p className="font-medium">{deliveryDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className={statusColor}>{status}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 p-4 pt-0">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onRequestReturn(order.id)}
          // Temporarily disabled for testing
          // disabled={status.toLowerCase() !== "delivered"}
        >
          Request return
        </Button>
        <Button className="w-full bg-black hover:bg-gray-800 text-white" onClick={() => onViewDetails(order.id)}>
          View details
        </Button>
      </div>
    </Card>
  )
}
