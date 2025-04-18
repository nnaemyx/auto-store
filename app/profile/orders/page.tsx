"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ProfileLayout from "@/components/profile/profile-layout";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useOrders, useOrder, Order } from "@/hooks/use-orders";
import OrderCard from "@/components/checkout/order-card";
import { Product, ExtendedOrder } from "@/types/orders";
import OrderDetailsModal from "@/components/checkout/order-details-modal";

// Import the ExtendedOrder type from order-card.tsx
type OrderCardExtendedOrder = Parameters<typeof OrderCard>[0]["order"];

// Helper function to convert Order to ExtendedOrder
const convertToExtendedOrder = (order: Order | null): ExtendedOrder => {
  if (!order) {
    console.log("convertToExtendedOrder - order is null or undefined");
    return {
      id: 0,
      user_id: "",
      amount: "0",
      order_code: "",
      check_out_id: "",
      status: "",
      delivery_fee: "",
      delivery_date: "",
      payment_method: "",
      currency: "",
      created_at: "",
      updated_at: "",
      products: []
    };
  }

  console.log("convertToExtendedOrder - order:", order);
  console.log("convertToExtendedOrder - order.id:", order.id);
  console.log("convertToExtendedOrder - order.products:", order.products);

  // Ensure we have a valid order object with all required fields
  const extendedOrder = {
    id: order.id || 0,
    user_id: order.user_id || "",
    amount: order.amount || "0",
    order_code: order.order_code || "",
    check_out_id: order.check_out_id || "",
    status: order.status || "",
    delivery_fee: order.delivery_fee || "",
    delivery_date: order.delivery_date || "",
    payment_method: order.payment_method || "",
    currency: order.currency || "",
    created_at: order.created_at || "",
    updated_at: order.updated_at || "",
    orderStatus: order.orderStatus || null,
    checkOut: order.checkOut || null,
    timeline: order.timeline || [],
    products: order.products
      ? order.products.map((product) => ({
          id: product.id,
          name: product.name || "",
          created_at: product.created_at || new Date().toISOString(),
          description: product.description || "",
          amount: product.amount || 0,
          quantity: product.quantity || "",
          price: product.price || 0,
          images: product.images || [],
        }))
      : [],
  };

  console.log("convertToExtendedOrder - extendedOrder:", extendedOrder);
  console.log("convertToExtendedOrder - extendedOrder.id:", extendedOrder.id);
  console.log(
    "convertToExtendedOrder - extendedOrder.products:",
    extendedOrder.products
  );

  return extendedOrder;
};

export default function OrderHistoryPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  // Fetch orders using the hook
  const { data: orders, isLoading, isError, error } = useOrders();

  // Fetch selected order details when needed
  const { data: selectedOrder, isLoading: isLoadingOrder } = useOrder(
    selectedOrderId || 0
  );


  // Breadcrumb for desktop
  const breadcrumb = (
    <div className="text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-brand-red">
        Homepage
      </Link>
      {" / "}
      <span className="font-medium text-gray-700">Order history</span>
    </div>
  );

  const handleViewDetails = (
    orderId: number,
    product?: Product | null,
    isLoadingProduct?: boolean
  ) => {

    setSelectedOrderId(orderId);
    setSelectedProduct(product || null);
    setIsLoadingProduct(isLoadingProduct || false);
    setIsDetailsModalOpen(true);
  };

  const handleRequestReturn = (orderId: number) => {
    console.log("handleRequestReturn - orderId:", orderId);
    // First open the details modal
    setSelectedOrderId(orderId);
    setIsDetailsModalOpen(true);
    // The return request will be handled within the modal
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    // Don't reset selectedOrderId immediately to avoid flickering during close animation
    setTimeout(() => {
      setSelectedOrderId(null);
    }, 300);
  };

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
    );
  }

  // Error state
  if (isError) {
    return (
      <ProfileLayout title="Order history">
        {!isMobile && breadcrumb}
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500 mb-2">Failed to load orders</p>
          <p className="text-sm text-gray-500 mb-4">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </ProfileLayout>
    );
  }

  // Empty state
  if (!orders || orders.length === 0) {
    return (
      <ProfileLayout title="Order history">
        {!isMobile && breadcrumb}
        <div className="text-center py-12">
          <p className="text-lg font-medium mb-2">
            You haven&apos;t placed any orders yet
          </p>
          <p className="text-sm text-gray-500 mb-4">
            When you place an order, it will appear here
          </p>
          <Button asChild className="bg-black hover:bg-gray-800 text-white">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout title="Order history">
      {!isMobile && breadcrumb}

      {/* Order Cards Grid */}
      <div
        className={
          isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"
        }
      >
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={convertToExtendedOrder(order) as OrderCardExtendedOrder}
            onViewDetails={handleViewDetails}
            onRequestReturn={handleRequestReturn}
          />
        ))}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder ? convertToExtendedOrder(selectedOrder) : null}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        product={selectedProduct || undefined}
        isLoadingProduct={isLoadingProduct}
        isLoading={isLoadingOrder}
      />
    </ProfileLayout>
  );
}
