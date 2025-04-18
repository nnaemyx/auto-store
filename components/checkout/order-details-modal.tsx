"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X, Loader2, Upload } from "lucide-react";
import { formatDate } from "@/hooks/use-orders";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitReturnRequest } from "@/hooks/use-return-requests";
import { ExtendedOrder, Product, ProductImage } from "@/types/orders";

// Define the OrderStatus type

// Define the CheckOut type
// Define the TimelineItem type

// Define the ExtendedOrder type

interface OrderDetailsModalProps {
  order: ExtendedOrder | null;
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  isLoadingProduct?: boolean;
  isLoading?: boolean;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  product,
  isLoadingProduct,
  isLoading,
}: OrderDetailsModalProps) {
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const { mutate: submitReturnRequest, isPending: isSubmittingReturnRequest } =
    useSubmitReturnRequest();

  const firstProductId =
    order?.products &&
    Array.isArray(order.products) &&
    order.products.length > 0
      ? order.products[0].id.toString()
      : undefined;

  console.log("OrderDetailsModal - firstProductId:", firstProductId);

  // Additional check to get a product reference even if order.products is missing
  const productReference =
    order?.products &&
    Array.isArray(order.products) &&
    order.products.length > 0
      ? order.products[0]
      : product || null;

  console.log("OrderDetailsModal - productReference:", productReference);

  // Get reference number from metadata or fallback to order_code
  const orderNumber = order?.order_code
    ? `#${order.order_code}`
    : order?.id
    ? `#${order.id}`
    : "#N/A";

  // Get product price
  const productPrice =
    order?.products && order.products.length > 0
      ? `₦${Number(order.products[0].price).toLocaleString()}`
      : order?.amount
      ? `₦${Number(order.amount).toLocaleString()}`
      : "₦0";

  // Format dates
  const orderDate = order?.created_at ? formatDate(order.created_at) : "N/A";
  const deliveryDate = order?.delivery_date
    ? formatDate(order.delivery_date)
    : "Pending";

  // Get tracking ID
  const trackingId = "N/A"; // This doesn't seem to be in the provided data structure

  const handleRequestReturn = () => {
    // If the order is still loading, we can't proceed yet
    if (isLoading) {
      console.log("Order is still loading, waiting for data...");
      return;
    }

    // Validate order exists
    if (!order) {
      console.error("Cannot request return: Order is null");
      return;
    }

    // Debug the order ID
    console.log("Order object:", order);
    console.log("Order ID type:", typeof order.id);
    console.log("Order ID value:", order.id);

    // Check if order ID exists (allowing for zero as a valid ID)
    if (order.id === undefined || order.id === null) {
      console.error("Cannot request return: Order ID is missing");
      return;
    }

    // Open the return modal
    setShowReturnModal(true);
  };

  const handleCancelReturn = () => {
    setShowReturnModal(false);
    setReturnReason("");
    setUploadedImages([]);
  };

  const handleProceedToConfirm = () => {
    setShowReturnModal(false);
    setShowConfirmModal(true);
  };

  const handleConfirmReturn = async () => {
    if (isLoading) {
      console.log("Order is still loading, waiting...");
      return;
    }
  
    if (!order) {
      console.error("No order data available");
      return;
    }
  
    try {
      // DEBUG: Log the full order object to see its structure
      console.log("Full order object:", JSON.stringify(order, null, 2));
      
      // 1. Handle Order ID
      // Try multiple approaches to get a valid order ID
      let orderId;
      
      if (order.id && order.id !== 0) {
        orderId = order.id;
        console.log("Using order.id:", orderId);
      } else if (order.order_code) {
        // If order_code exists and is numeric (remove any minus sign)
        const numericOrderCode = order.order_code.replace(/^-/, '');
        orderId = parseInt(numericOrderCode, 10);
        console.log("Using parsed order_code:", orderId);
      } else {
        // Last resort - use 8 as a hardcoded value from your API example
        console.log("Using hardcoded order ID:", orderId);
      }
      
      console.log("Final order ID to use:", orderId);
      
      // 2. Handle Product ID
      let productId;
      
      if (order.products && Array.isArray(order.products) && order.products.length > 0) {
        productId = order.products[0].id;
        console.log("Using product ID from order.products:", productId);
      } else if (product && product.id) {
        productId = product.id;
        console.log("Using product ID from product prop:", productId);
      } else {
        // Fallback to the example product ID
        console.log("Using hardcoded product ID:", productId);
      }
      
      console.log("Final product ID to use:", productId);
  
      // 3. Create and log the final payload
      const returnData = {
        order_id: String(orderId),
        order_item: String(productId),
        reason: returnReason.trim()
      };
  
      console.log("Final payload:", returnData);
      
      // Submit the request
      await submitReturnRequest(returnData);
      
      // Clean up and close modals
      setShowConfirmModal(false);
      setShowReturnModal(false);
      setReturnReason("");
      setUploadedImages([]);
      onClose();
    } catch (error) {
      console.error("Error submitting return request:", error);
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setShowReturnModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert files to array and create URLs
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  // Loading state
  if (isLoading || isLoadingProduct) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-red mr-2" />
            <span>Loading order details...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // No order state
  if (!order) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          <div className="text-center py-8">
            <p>Order details not available</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      {/* Order Details Dialog */}
      <Dialog
        open={isOpen && !showReturnModal && !showConfirmModal}
        onOpenChange={onClose}
      >
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order {orderNumber}</DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>

          <div className="space-y-6">
            {/* Product info */}
            <div className="flex gap-4">
              {isLoadingProduct ? (
                <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
                </div>
              ) : (
                <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  {product?.images?.map((image: ProductImage) => (
                    <div
                      key={image.id}
                      className="relative aspect-square w-20 overflow-hidden rounded-lg"
                    >
                      <Image
                        src={image.image}
                        alt={product.name}
                        fill={true}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div>
                <h3 className="font-medium">{product?.name || "Product"}</h3>
                <p className="font-bold mt-1">
                  ₦{product?.amount || "Product"}
                </p>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Item</p>
                <p className="font-medium">{product?.name || "Product"}</p>
              </div>
              <div>
                <p className="text-gray-500">Tracking ID</p>
                <p className="font-medium">{trackingId}</p>
              </div>
              <div>
                <p className="text-gray-500">Date ordered</p>
                <p className="font-medium">
                  {String(product?.created_at || "N/A")}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Delivered</p>
                <p className="font-medium">{deliveryDate}</p>
              </div>
            </div>

            {/* Product Rating */}
            <div>
              <h3 className="text-base font-medium mb-2">
                How would you rate this product?
              </h3>
              <Textarea placeholder="Leave a comment" className="w-full" />
              <Button>Submit</Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleRequestReturn}
                // Temporarily disabled for testing
                // disabled={order.status.toLowerCase() !== "delivered"}
              >
                Request return
              </Button>
              <Button
                className="flex-1 bg-black hover:bg-gray-800 text-white"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Return Request Dialog */}
      <Dialog open={showReturnModal} onOpenChange={handleCancelReturn}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Return Order {orderNumber}</DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>

          <div className="space-y-4">
            {/* Product info */}
            <div className="flex items-center gap-4">
              {isLoadingProduct ? (
                <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
                </div>
              ) : (
                <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  {product?.images?.map((image: ProductImage) => (
                    <div
                      key={image.id}
                      className="relative aspect-square w-16 overflow-hidden rounded-lg"
                    >
                      <img
                        src={image.image}
                        alt={product.name}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div>
                <h3 className="font-medium">{product?.name || "Product"}</h3>
                <p className="text-sm">
                  {deliveryDate !== "Pending"
                    ? `Delivered · ${deliveryDate}`
                    : "Not delivered yet"}
                </p>
                <p className="font-bold">{productPrice}</p>
              </div>
            </div>

            {/* Order details in grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Item</p>
                <p className="font-medium">{product?.name || "Product"}</p>
              </div>
              <div>
                <p className="text-gray-500">Tracking ID</p>
                <p className="font-medium">{trackingId}</p>
              </div>
              <div>
                <p className="text-gray-500">Date ordered</p>
                <p className="font-medium">{orderDate}</p>
              </div>
              <div>
                <p className="text-gray-500">Delivered</p>
                <p className="font-medium">{deliveryDate}</p>
              </div>
            </div>

            {/* Return reason */}
            <div>
              <label
                htmlFor="returnReason"
                className="block text-base font-medium mb-2"
              >
                What&apos;s your reason for the return?
              </label>
              <Textarea
                id="returnReason"
                placeholder="State your reason here"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Image upload */}
            <div>
              <p className="block text-base font-medium mb-2">
                Upload pictures (optional)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {uploadedImages.map((image, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-md aspect-square relative"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Uploaded image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      className="absolute top-1 right-1 bg-white rounded-full p-1"
                      onClick={() =>
                        setUploadedImages((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {uploadedImages.length < 4 && (
                  <label className="border border-dashed border-gray-200 rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      multiple={uploadedImages.length < 3}
                    />
                  </label>
                )}
                {/* Add empty placeholders to maintain grid */}
                {Array.from({
                  length: Math.max(0, 3 - uploadedImages.length),
                }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="border border-dashed border-gray-200 rounded-md aspect-square"
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCancelReturn}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-black hover:bg-gray-800 text-white"
                onClick={handleProceedToConfirm}
                disabled={!returnReason.trim()}
              >
                Confirm request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmModal} onOpenChange={handleCancelConfirm}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              Confirm return request?
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-center">
            <p className="text-gray-700">
              {returnReason.length > 100
                ? returnReason.substring(0, 100) + "..."
                : returnReason}
            </p>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCancelConfirm}
              >
                No, cancel request
              </Button>
              <Button
                className="flex-1 bg-black hover:bg-gray-800 text-white"
                onClick={handleConfirmReturn}
                disabled={isSubmittingReturnRequest}
              >
                {isSubmittingReturnRequest ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Yes, request return"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
