"use client";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function CartPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const {
    cart,
    isLoading,
    isError,
    updateQuantity,
    removeFromCart,
    clearCart,
    isUpdatingQuantity,
    isRemovingFromCart,
    isClearingCart,
  } = useCart();

  // Fixed handleQuantityChange function to use absolute values instead of relative changes
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      console.log(
        `Setting quantity for product ${productId} to exact value: ${newQuantity}`
      );
      updateQuantity({ productId, quantity: newQuantity });
    }
  };

  // Update the handleRemoveItem function to use cart_id instead of item_id
  const handleRemoveItem = (cartId: number) => {
    removeFromCart(cartId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-red-500 mb-2">
            Error Loading Cart
          </h2>
          <p className="text-gray-600 mb-4">
            Failed to load your cart items. Please try again later.
          </p>
          <Button asChild>
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart?.cart_items || cart.cart_items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">My Shopping Cart</h1>
        <div className="text-center py-16 space-y-4">
          <ShoppingCart className="h-12 w-12 mx-auto text-gray-400" />
          <h2 className="text-xl font-medium">Your cart is empty</h2>
          <p className="text-gray-500">
            Looks like you haven&#39;t added any items to your cart yet.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-red">
          Homepage
        </Link>
        {" / "}
        <span className="font-medium text-gray-700">My cart</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Shopping Cart</h1>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleClearCart}
              disabled={isClearingCart}
            >
              {isClearingCart ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-red-500 rounded-full"></div>
                  Clearing...
                </div>
              ) : (
                "Clear cart"
              )}
            </Button>
          </div>

          <div className="space-y-6">
            {cart.cart_items.map((item) => {
              // Parse quantity once to ensure it's a number
              const itemQuantity = Number.parseInt(item.quantity || "1", 10);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm border"
                >
                  <div className="flex flex-col sm:flex-row p-4 gap-4">
                    {/* Product Image */}
                    <div className="relative w-full sm:w-24 h-24 bg-gray-50 rounded-md overflow-hidden">
                      <Image
                        src={
                          item.images && item.images.length > 0
                            ? item.images[0].image
                            : "/placeholder.svg?height=100&width=100"
                        }
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                      <p className="font-bold mt-2">
                        ₦{Number(item.amount).toLocaleString()}
                      </p>

                      {/* Mobile: Edit and Remove buttons */}
                      {isMobile && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              /* Handle edit */
                            }}
                          >
                            Edit order
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 text-red-500 border-red-100 hover:bg-red-50"
                            onClick={() => handleRemoveItem(item.cart_id)}
                            disabled={isRemovingFromCart}
                          >
                            Remove item
                          </Button>
                        </div>
                      )}

                      {/* Desktop: Bottom row with quantity and actions */}
                      {!isMobile && (
                        <div className="flex justify-between items-end mt-4">
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleQuantityChange(item.id, itemQuantity - 1)
                              }
                              disabled={isUpdatingQuantity || itemQuantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="mx-3 min-w-[40px] text-center">
                              {itemQuantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleQuantityChange(item.id, itemQuantity + 1)
                              }
                              disabled={isUpdatingQuantity}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                /* Handle edit */
                              }}
                            >
                              Edit order
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveItem(item.cart_id)}
                              disabled={isRemovingFromCart}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Mobile: Quantity Controls */}
                    {isMobile && (
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleQuantityChange(item.id, itemQuantity - 1)
                            }
                            disabled={isUpdatingQuantity || itemQuantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-3 min-w-[40px] text-center">
                            {itemQuantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleQuantityChange(item.id, itemQuantity + 1)
                            }
                            disabled={isUpdatingQuantity}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg border p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Cart summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ₦{cart.summary.subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>₦{cart.summary.tax.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Fee</span>
                <span>₦{cart.summary.shipping_fee.toLocaleString()}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total amount</span>
                <span>₦{cart.summary.total.toLocaleString()}</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button className="w-full mt-6 bg-black hover:bg-gray-800 text-white">
                Check Out
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
