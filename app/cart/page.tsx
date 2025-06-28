"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useMediaQuery } from "@/hooks/use-media-query";
import React from "react";

export default function CartPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const {
    cart,
    isLoading,
    isError,
    updateCartItem,
    isUpdatingCartItem,
    clearCart,
    isClearingCart,
  } = useCart();

  // Local state for quantity inputs
  const [quantities, setQuantities] = React.useState<{ [key: number]: number }>(
    {}
  );

  // Calculate cart summary from items
  const cartSummary = React.useMemo(() => {
    if (!cart?.cart_items || cart.cart_items.length === 0) {
      return { subtotal: 0, total: 0 };
    }

    const subtotal = cart.cart_items.reduce((sum, item) => {
      return sum + (Number(item.price) || 0);
    }, 0);

    return {
      subtotal,
      total: subtotal, // Assuming no additional fees for now
    };
  }, [cart?.cart_items]);

  React.useEffect(() => {
    // Initialize quantities from cart items
    if (cart?.cart_items) {
      const initial: { [key: number]: number } = {};
      cart.cart_items.forEach((item) => {
        initial[item.id] = Number(item.quantity || 1);
      });
      setQuantities(initial);
    }
  }, [cart?.cart_items]);

  const handleIncrement = (id: number) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  const handleDecrement = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1),
    }));
  };

  const handleUpdate = (cart_id: number) => {
    const quantity = quantities[cart_id];
    if (quantity && quantity > 0) {
      updateCartItem({ id: cart_id, quantity });
    }
  };

  const handleInputChange = (id: number, value: string) => {
    let num = Number(value.replace(/\D/g, ""));
    if (!num || num < 1) num = 1;
    setQuantities((prev) => ({ ...prev, [id]: num }));
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
      <div className="flex items-center gap-2 py-[7px] px-3 mb-6">
        <Link href="/" className="text-[#2F2F2F] text-sm ">
          Homepage
        </Link>
        {" / "}
        <span className="font-medium text-[#2F2F2F] text-sm">My cart</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 border-t border-[#00000012]">
        {/* Cart Items */}
        <div className="lg:w-2/3 px-[20px] pt-[28px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 py-[7px] px-3 ">
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
              {cart.cart_items.map((item, index) => {
                const itemQuantity =
                  quantities[item.cart_id] ?? Number(item.quantity || 1);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-md overflow-hidden transition-all hover:shadow-md"
                  >
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
                        <h3 className="font-[450] text-[#2F2F2F] text-sm group-hover:text-brand-red">
                          {item.name}
                        </h3>
                        <p className="text-sm text-[#2F2F2F]">
                          {item.description}
                        </p>
                        <p className="font-semibold text-[#212121] text-sm mt-2">
                          ₦{Number(item.amount).toLocaleString()}
                        </p>

                        {/* Quantity input, plus/minus, and update button */}
                        <div className="flex items-center gap-2 mt-4">
                          <button
                            type="button"
                            className="border rounded h-8 w-8 flex items-center justify-center"
                            onClick={() => handleDecrement(item.cart_id)}
                            disabled={itemQuantity <= 1 || isUpdatingCartItem}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <input
                            type="number"
                            min={1}
                            name={`quantity${index + 1}`}
                            value={itemQuantity}
                            onChange={(e) =>
                              handleInputChange(item.cart_id, e.target.value)
                            }
                            className="w-16 border rounded px-2 py-1 text-center"
                          />
                          <button
                            type="button"
                            className="border rounded h-8 w-8 flex items-center justify-center"
                            onClick={() => handleIncrement(item.cart_id)}
                            disabled={isUpdatingCartItem}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <Button
                            type="button"
                            onClick={() => handleUpdate(item.cart_id)}
                            disabled={isUpdatingCartItem}
                          >
                            {isUpdatingCartItem ? "Updating..." : "Update"}
                          </Button>
                        </div>

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

                        {/* Desktop: Bottom row with price - REMOVED per user request */}
                        {/* (No per-item total here; only use cart summary from the hook) */}
                      </div>

                      {/* Mobile: Quantity Controls (hidden, now handled above) */}
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
            <div className="flex items-center gap-2  mb-6">
              <h2 className="font-medium text-[15px]">Summary</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-[#2F2F2F] text-sm">Subtotal</span>
                <span className="font-semibold text-[#212121] text-sm">
                  ₦{cartSummary.subtotal.toLocaleString()}
                </span>
              </div>

              <Separator className="bg-[#00000012]" />

              <div className="flex justify-between">
                <span className="font-semibold text-[#212121] text-sm">
                  Total amount
                </span>
                <span className="font-semibold text-[#212121] text-sm">
                  ₦{cartSummary.total.toLocaleString()}
                </span>
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
