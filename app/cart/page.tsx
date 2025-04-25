"use client";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingCart } from "lucide-react";
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
    clearCart,
    isClearingCart,
  } = useCart();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity({ productId, quantity: newQuantity });
    }
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
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 py-[7px] px-3 rounded-[4px] w-[92px] bg-[#00000008] mb-6">
        <Link href="/" className="text-[#2F2F2F] text-sm hover:text-brand-red">
          Homepage
        </Link>
        {" / "}
        <span className="font-medium text-[#2F2F2F] text-sm">My cart</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 border-t border-[#00000012]">
        {/* Cart Items */}
        <div className="lg:w-2/3 px-[20px] pt-[28px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 py-[7px] px-3 rounded-[4px] w-[92px] bg-[#00000008]">
              <h1 className="font-medium text-[15px]">My Cart</h1>
            </div>
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

          <form>
            <div className="space-y-6">
              {cart.cart_items.map((item) => {
                const itemQuantity = Number(item.quantity || 1);
                return (
                  <div key={item.id} className="bg-white rounded-md overflow-hidden transition-all hover:shadow-md">
                    <div className="flex flex-col sm:flex-row p-4 gap-4">
                      {/* Product Image */}
                      <div className="relative w-full sm:w-24 h-24 bg-gray-50 rounded-[8px] overflow-hidden">
                        <Image
                          src={
                            item.images && item.images.length > 0
                              ? item.images[0].image
                              : ""
                          }
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-[450] text-[#2F2F2F] text-sm group-hover:text-brand-red">{item.name}</h3>
                        <p className="text-sm text-[#2F2F2F]">
                          {item.description}
                        </p>
                        <p className="font-semibold text-[#212121] text-sm mt-2">
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
                              onClick={() => {
                                /* Handle remove */
                              }}
                            >
                              Remove item
                            </Button>
                          </div>
                        )}

                        {/* Desktop: Bottom row with quantity and actions */}
                        {!isMobile && (
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, itemQuantity - 1)}
                                disabled={itemQuantity <= 1}
                                type="button"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="mx-3 min-w-[40px] text-center font-medium">
                                {itemQuantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, itemQuantity + 1)}
                                type="button"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold text-[#212121] text-sm">
                                ₦{(Number(item.amount) * itemQuantity).toLocaleString()}
                              </span>
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
                              onClick={() => handleQuantityChange(item.id, itemQuantity - 1)}
                              disabled={itemQuantity <= 1}
                              type="button"
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
                              onClick={() => handleQuantityChange(item.id, itemQuantity + 1)}
                              type="button"
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
          </form>
        </div>

        {/* Cart Summary */}
        <div className="lg:w-1/3 px-[20px] pt-[28px]">
          <div className="bg-white rounded-md border border-[#00000012] p-6 sticky top-24">
            <div className="flex items-center gap-2 py-[7px] px-3 rounded-[4px] w-[92px] bg-[#00000008] mb-6">
              <h2 className="font-medium text-[15px]">Summary</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-[#2F2F2F] text-sm">Subtotal</span>
                <span className="font-semibold text-[#212121] text-sm">
                  ₦{cart.summary.subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#2F2F2F] text-sm">Tax</span>
                <span className="text-[#2F2F2F] text-sm">₦{cart.summary.tax.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#2F2F2F] text-sm">Shipping Fee</span>
                <span className="text-[#2F2F2F] text-sm">₦{cart.summary.shipping_fee.toLocaleString()}</span>
              </div>

              <Separator className="bg-[#00000012]" />

              <div className="flex justify-between">
                <span className="font-semibold text-[#212121] text-sm">Total amount</span>
                <span className="font-semibold text-[#212121] text-sm">₦{cart.summary.total.toLocaleString()}</span>
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
