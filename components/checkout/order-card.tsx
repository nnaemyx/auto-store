"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { formatDate, getOrderStatusColor } from "@/hooks/use-orders"
import Link from "next/link"
import { Product } from "@/types/orders"

// Define the OrderStatus type
interface OrderStatus {
  id: number
  name: string
  description: string
}

// Define the CheckOut type
interface CheckOut {
  id: number
  user_id: string
  full_name: string
  phone_number: string
  email: string
  alt_phone_number?: string
  state: string
  address: string
  town: string
  postal_code: string
}

// Define the TimelineItem type
interface TimelineItem {
  id: number
  order_id: string
  order_status_id: string
  status: OrderStatus
}

// Define the ExtendedOrder type
interface ExtendedOrder {
  id: number
  user_id: string
  amount: string
  order_code: string
  check_out_id: string
  status: string
  delivery_fee: string
  delivery_date: string
  payment_method: string
  currency: string
  created_at: string
  updated_at: string
  orderStatus?: OrderStatus
  checkOut?: CheckOut
  timeline?: TimelineItem[]
  products?: Array<{
    id: number
    name: string
    created_at: string
    description: string
    amount: number
    quantity: string
    price: number
    images: Array<{ id: number; product_id: string; image: string }>
    [key: string]: unknown
  }>
}

interface OrderCardProps {
  order: ExtendedOrder
  onViewDetails: (orderId: number, product?: Product | null, isLoadingProduct?: boolean) => void
  onRequestReturn: (orderId: number) => void
}

export default function OrderCard({ order, onViewDetails }: OrderCardProps) {

  // Get all products from the order
  const products = order.products || []

  // Get delivery fee (formatted)
  const deliveryFee = order.delivery_fee ? `₦${Number(order.delivery_fee).toLocaleString()}` : "₦0"

  // Get status
  const status = order.orderStatus?.name || order.status || "Processing"
  const statusColor = getOrderStatusColor(order.orderStatus?.name || order.status)

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
        <h3 className="font-medium">Order</h3>
        <Link href={`/profile/orders/${order.id}`}>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Link>
      </div>

      {/* Products summary */}
      <div className="p-4 flex gap-2 overflow-x-auto">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col items-center cursor-pointer min-w-[80px]"
              onClick={e => {
                e.stopPropagation();
                onViewDetails(order.id, { ...product, amount: String(product.amount) } as Product, false)
              }}
            >
              <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden mb-1">
                <Image
                  src={product.images && product.images.length > 0 ? product.images[0].image : "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <span className="text-xs font-medium truncate w-16">{product.name}</span>
              <span className="text-xs text-gray-500">Qty: {product.quantity}</span>
            </div>
          ))
        ) : (
          <span className="text-gray-500">No products</span>
        )}
      </div>

      {/* Order details */}
      <div className="p-4 grid grid-cols-2 gap-2">
        <div>
          <p className="text-sm text-gray-500">Date of order</p>
          <p className="font-medium">{orderDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Delivery fee</p>
          <p className="font-medium">{deliveryFee}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Date delivered</p>
          <p className="font-medium">{deliveryDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className={statusColor}>{status}</p>
        </div>
        {order.checkOut && (
          <>
            <div>
              <p className="text-sm text-gray-500">Delivery address</p>
              <p className="font-medium truncate">{order.checkOut.address}, {order.checkOut.town}, {order.checkOut.state}</p>
            </div>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 p-4 pt-0">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onViewDetails(order.id)}
        >
          Request return
        </Button>
        <Button 
          className="w-full bg-black hover:bg-gray-800 text-white" 
          onClick={() => onViewDetails(order.id, products.length > 0 ? { ...products[0], amount: String(products[0].amount) } as Product : null, false)}
        >
          View details
        </Button>
      </div>
    </Card>
  )
}
