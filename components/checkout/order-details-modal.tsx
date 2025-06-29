"use client";

import React, { useState, useEffect } from "react";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X, Loader2, Upload, Star } from "lucide-react";
import { formatDate } from "@/hooks/use-orders";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitReturnRequest } from "@/hooks/use-return-requests";
import { ExtendedOrder, Product, ProductImage } from "@/types/orders";
import ProductReviews from "@/components/product/product-reviews";
import {
  useProductReviews,
  useSubmitProductReview,
} from "@/hooks/use-product-reviews";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/api/use-auth";

interface OrderDetailsModalProps {
  order: ExtendedOrder | null;
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  isLoadingProduct?: boolean;
  isLoading?: boolean;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  product: initialProduct,
  isLoadingProduct,
  isLoading,
}: OrderDetailsModalProps) {
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { data: reviews, isLoading: isLoadingReviews } = useProductReviews(
    selectedProduct?.id?.toString() || null
  );
  const { mutate: submitReview, isPending: isSubmittingReview } =
    useSubmitProductReview();
  const { toast, ToastVariant } = useToast();
  const { user } = useAuth();

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
      : initialProduct || null;

  console.log("OrderDetailsModal - productReference:", productReference);

  // Get reference number from metadata or fallback to order_code
  const orderNumber = order?.order_code
    ? `#${order.order_code}`
    : order?.id
    ? `#${order.id}`
    : "#N/A";

  // Calculate total amount if more than one product
  const totalAmount = order?.products && order.products.length > 1
    ? order.products.reduce((sum, p) => sum + (Number(p.amount) * Number(p.quantity || 1)), 0)
    : null;

  // Format dates
  const orderDate = order?.created_at ? formatDate(order.created_at) : "N/A";
  const deliveryDate = order?.delivery_date
    ? formatDate(order.delivery_date)
    : "Pending";

  

  // Reset selectedProduct when order changes or modal opens
  useEffect(() => {
    if (isOpen && order) {
      // Set to initialProduct if provided, otherwise use first product from order
      const newSelectedProduct = initialProduct || (order.products && order.products.length > 0 ? { ...order.products[0], amount: String(order.products[0].amount) } as Product : null);
      setSelectedProduct(newSelectedProduct);
    }
  }, [isOpen, order, initialProduct]);

  // Reset form states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setComment("");
    }
  }, [isOpen]);

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
      let orderId = 0; // Default fallback value

      // Check if order has a details property (API response structure)
      const orderDetails = order.details || order;

      if (orderDetails.id && orderDetails.id !== 0) {
        orderId = orderDetails.id;
        console.log("Using orderDetails.id:", orderId);
      } else if (orderDetails.order_code) {
        // If order_code exists and is numeric (remove any minus sign)
        const numericOrderCode = orderDetails.order_code.replace(/^-/, "");
        orderId = parseInt(numericOrderCode, 10) || 0; // Use 0 if parsing fails
        console.log("Using parsed order_code:", orderId);
      } else {
        console.log("Using fallback order ID:", orderId);
      }

      console.log("Final order ID to use:", orderId);

      // 2. Handle Product ID
      let productId = 0; // Default fallback value

      // Check if products exist in the order details
      const products = orderDetails.products || [];

      if (products && Array.isArray(products) && products.length > 0) {
        productId = products[0].id;
        console.log("Using product ID from orderDetails.products:", productId);
      } else if (selectedProduct && selectedProduct.id) {
        productId = selectedProduct.id;
        console.log("Using product ID from product prop:", productId);
      } else {
        console.log("Using fallback product ID:", productId);
      }

      console.log("Final product ID to use:", productId);

      // 3. Create and log the final payload
      const returnData = {
        order_id: String(orderId),
        order_item: String(productId),
        reason: returnReason.trim(),
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

  const handleSubmitReview = () => {
    if (!rating || !comment.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a rating and comment",
        variant: ToastVariant.Error,
      });
      return;
    }

    submitReview(
      {
        product_id: selectedProduct?.id?.toString() || "",
        user_id: user?.id?.toString() || "",
        comment: comment.trim(),
        rating,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Review submitted successfully",
            variant: ToastVariant.Success,
          });
          setComment("");
          setRating(0);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to submit review",
            variant: ToastVariant.Error,
          });
        },
      }
    );
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
            <DialogTitle>
              Order <span className="text-gray-500 ml-2">{orderNumber}</span>
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>

          {/* Product list selector */}
          {order?.products && order.products.length > 1 && (
            <>
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {order.products.map((prod) => (
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
              <div className="mb-4 text-right font-bold text-lg">
                Total: ₦{totalAmount?.toLocaleString()}
              </div>
            </>
          )}

          <div className="space-y-6">
            {/* Product info */}
            <div className="flex gap-4">
                <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                {selectedProduct?.images?.map((image: ProductImage) => (
                    <div
                      key={image.id}
                      className="relative aspect-square w-20 overflow-hidden rounded-lg"
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
                <h3 className="font-medium">{selectedProduct?.name || "Product"}</h3>
                <p className="font-bold mt-1">
                  ₦{selectedProduct?.amount || "Product"}
                </p>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Item</p>
                <p className="font-medium">{selectedProduct?.name || "Product"}</p>
              </div>
              <div>
                <p className="text-gray-500">Tracking ID</p>
                <p className="font-medium">{selectedProduct?.code || 'N/A'}</p>
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

            {/* Product Rating */}
            <div>
              <h3 className="text-base font-medium mb-2">Product Reviews</h3>

              {selectedProduct?.id && Array.isArray(reviews) && (
                <>
                  <ProductReviews
                    reviews={reviews}
                    isLoading={isLoadingReviews}
                  />
                </>
              )}

              {/* Review Form */}
              {selectedProduct?.id && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-base font-medium mb-4">Write a Review</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmitReview();
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Rating:</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              className="focus:outline-none"
                              onClick={() => setRating(i + 1)}
                            >
                              <Star
                                className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill={i < rating ? '#facc15' : 'none'}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your review here..."
                        className="w-full"
                      />
                      <Button
                        type="submit"
                        className="bg-black hover:bg-gray-800 text-white"
                        disabled={isSubmittingReview}
                      >
                        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                  {selectedProduct?.images?.map((image: ProductImage) => (
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
              )}
              <div>
                <h3 className="font-medium">{selectedProduct?.name || "Product"}</h3>
                <p className="text-sm">
                  {deliveryDate !== "Pending"
                    ? `Delivered · ${deliveryDate}`
                    : "Not delivered yet"}
                </p>
                <p className="font-bold">{selectedProduct?.amount}</p>
              </div>
            </div>

            {/* Order details in grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Item</p>
                <p className="font-medium">{selectedProduct?.name || "Product"}</p>
              </div>
              <div>
                <p className="text-gray-500">Tracking ID</p>
                <p className="font-medium">{selectedProduct?.code || 'N/A'}</p>
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
