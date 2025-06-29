"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useOrders } from "@/hooks/use-orders"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { Order } from "@/hooks/use-orders"
import type { Product } from "@/types/orders"

export default function TrackOrderPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { data: orders, isLoading } = useOrders()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleViewDetails = (order: Order, product?: Product | null) => {
    setSelectedOrder(order)
    setSelectedProduct(product || (order.products && order.products.length > 0 ? { ...order.products[0], amount: String(order.products[0].amount) } as Product : null))
    setShowModal(true)
  }

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

      {isLoading ? (
        <div className="text-center py-10">Loading orders...</div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-10">No orders found.</div>
      ) : (
        <>
          {/* Desktop layout - grid of orders */}
          {!isMobile && (
            <div className="grid grid-cols-2 gap-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border rounded-lg overflow-hidden">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-medium">Order #{order.order_code || order.id}</h3>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="p-4">
                    {/* Products summary */}
                    <div className="flex gap-2 overflow-x-auto mb-4">
                      {order.products && order.products.length > 0 ? (
                        order.products.map((product) => (
                          <div
                            key={product.id}
                            className="flex flex-col items-center cursor-pointer min-w-[80px]"
                            onClick={e => {
                              e.stopPropagation();
                              handleViewDetails(order, { ...product, amount: String(product.amount) } as Product)
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
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Date of order</p>
                        <p>{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Reference number</p>
                        <p>#{order.order_code || order.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Est. delivery date</p>
                        <p>{order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        <p className="text-yellow-500">{order.status}</p>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-black hover:bg-gray-800 text-white" onClick={() => handleViewDetails(order)}>
                      View details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile layout - list of orders */}
          {isMobile && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border rounded-lg overflow-hidden">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-medium">Order #{order.order_code || order.id}</h3>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="p-4">
                    {/* Products summary */}
                    <div className="flex gap-2 overflow-x-auto mb-4">
                      {order.products && order.products.length > 0 ? (
                        order.products.map((product) => (
                          <div
                            key={product.id}
                            className="flex flex-col items-center cursor-pointer min-w-[80px]"
                            onClick={e => {
                              e.stopPropagation();
                              handleViewDetails(order, { ...product, amount: String(product.amount) } as Product)
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
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Date of order</p>
                        <p>{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Reference number</p>
                        <p>#{order.order_code || order.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Est. delivery date</p>
                        <p>{order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        <p className="text-yellow-500">{order.status}</p>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-black hover:bg-gray-800 text-white" onClick={() => handleViewDetails(order)}>
                      View details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order Details Modal */}
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="max-w-lg w-full">
              {selectedOrder && (
                <div>
                  <h2 className="text-lg font-bold mb-2">Order #{selectedOrder.order_code || selectedOrder.id}</h2>
                  {/* Product selector if more than one product */}
                  {selectedOrder.products && selectedOrder.products.length > 1 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto">
                      {selectedOrder.products.map((prod) => (
                        <div
                          key={prod.id}
                          className={`flex flex-col items-center cursor-pointer min-w-[64px] ${selectedProduct?.id === prod.id ? 'border-2 border-black rounded' : ''}`}
                          onClick={() => setSelectedProduct({ ...prod, amount: String(prod.amount) } as Product)}
                        >
                          <div className="relative w-12 h-12 bg-gray-100 rounded-md overflow-hidden mb-1">
                            <Image
                              src={prod.images && prod.images.length > 0 ? prod.images[0].image : "/placeholder.png"}
                              alt={prod.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          <span className="text-xs font-medium truncate w-12">{prod.name}</span>
                          <span className="text-xs text-gray-500">Qty: {prod.quantity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Product details */}
                  <div className="flex gap-4 mb-4 items-center">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {selectedProduct?.images?.map((image: { id: number; product_id: string; image: string }) => (
                        <div
                          key={image.id}
                          className="relative aspect-square w-16 overflow-hidden rounded-lg"
                        >
                      <Image
                            src={image.image}
                            alt={selectedProduct.name}
                            fill={true}
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-medium">{selectedProduct?.name || selectedOrder.products?.[0]?.name || 'Name of Product'}</h4>
                      <p className="font-bold">₦{selectedProduct?.price?.toLocaleString() || selectedOrder.products?.[0]?.price?.toLocaleString() || selectedOrder.amount}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">Item</p>
                      <p className="font-medium">{selectedProduct?.name || selectedOrder.products?.[0]?.name || 'Product'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tracking ID</p>
                      <p className="font-medium">{selectedProduct?.code || selectedOrder.order_code || selectedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date ordered</p>
                      <p className="font-medium">{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Est delivery date</p>
                      <p className="font-medium">{selectedOrder.delivery_date ? new Date(selectedOrder.delivery_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  {/* Timeline/Shipping details */}
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Shipping details</h3>
                    <div className="space-y-2">
                      {selectedOrder.timeline && selectedOrder.timeline.length > 0 ? (
                        selectedOrder.timeline.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">{item.status.name}</span>
                            <span className="text-gray-400">{item.status.description}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No shipping updates yet.</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1 bg-black text-white" onClick={() => setShowModal(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </ProfileLayout>
  )
}

