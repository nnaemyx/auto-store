"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { formatDate, getOrderStatusColor, useOrderProduct } from "@/hooks/use-orders"
import Link from "next/link"
import { Product } from "@/types/orders"
import { useAuth } from "@/api/use-auth"

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
  const { user } = useAuth()
  
  // Get the first product from the order
  const firstProductId =
    order.products && order.products.length > 0
      ? order.products[0].id.toString()
      : undefined

  console.log("OrderCard - order:", order);
  console.log("OrderCard - order.id:", order.id);
  console.log("OrderCard - products:", order.products);
  console.log("OrderCard - firstProductId:", firstProductId);
  console.log("OrderCard - order.checkOut:", order.checkOut);
  console.log("OrderCard - order.user_id:", order.user_id);
  console.log("OrderCard - order.check_out_id:", order.check_out_id);

  // Fetch product details with proper typing
  const { product, isLoading: isLoadingProduct } = useOrderProduct(firstProductId ?? null, order.products)

  console.log("OrderCard - product from hook:", product);

  // Get reference number from metadata or fallback to order_code
  const referenceNumber = order.order_code
    ? `#${order.order_code}`
    : `#${order.id}`

  // Get product price
  const productPrice =
    order.products && order.products.length > 0
      ? Number(order.products[0].price).toLocaleString()
      : Number(order.amount).toLocaleString()

  // Get status
  const status = order.orderStatus?.name || order.status || "Processing"
  const statusColor = getOrderStatusColor(order.orderStatus?.name || order.status)

  // Format dates
  const orderDate = order.created_at ? formatDate(order.created_at) : "N/A"
  const deliveryDate = order.delivery_date ? formatDate(order.delivery_date) : "Pending"

  // Get customer name from checkOut if available, otherwise use authenticated user's name
  const customerName = order.checkOut?.full_name || user?.username || "Customer"

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div
        className="p-4 border-b flex justify-between items-center cursor-pointer"
        onClick={() => onViewDetails(order.id, product as unknown as Product, isLoadingProduct)}
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
                  : "/placeholder.png"
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
        {order.checkOut && (
          <>
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium">{customerName}</p>
            </div>
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
          onClick={() => onViewDetails(order.id, product as unknown as Product, isLoadingProduct)}
          // Temporarily disabled for testing
          // disabled={status.toLowerCase() !== "delivered"}
        >
          Request return
        </Button>
        <Button className="w-full bg-black hover:bg-gray-800 text-white" onClick={() => onViewDetails(order.id, product as unknown as Product, isLoadingProduct)}>
          View details
        </Button>
      </div>
    </Card>
  )
}
