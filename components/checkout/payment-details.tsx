"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/hooks/use-toast";
import type { CartItem } from "@/hooks/use-cart";
import { apiClient } from "@/api/api-client";
import { Loader2 } from "lucide-react";

const getToken = (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("token")
  }

interface PaymentDetailsFormProps {
  onSubmit: (data: { checkoutResponse: Record<string, unknown>; deliveryFee: string }) => void;
  shippingDetails: {
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber: string;
    houseAddress: string;
    stateOfResidence: string;
    postalCode: string;
    townCity: string;
    alternatePhone?: string;
  };
  cartItems: CartItem[];
  cartSummary: {
    subtotal: number;
    tax: number;
    shipping_fee: number;
    total: number;
  };
}

export default function PaymentDetailsForm({
  onSubmit,
  shippingDetails,
  cartItems,
  cartSummary,
}: PaymentDetailsFormProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast, ToastVariant } = useToast();

  const [discountCode, setDiscountCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState("1"); // Default to option 1

  const handleApplyDiscount = () => {
    if (discountCode) {
      toast({
        title: "Discount Applied",
        description: `Discount code "${discountCode}" has been applied`,
        variant: ToastVariant.Success,
      });
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      // Get auth token
      const token = getToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }
      // Prepare checkout data
      const checkoutData = {
        name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
        email: shippingDetails.email || "customer@example.com",
        phone_number: shippingDetails.phoneNumber,
        address: shippingDetails.houseAddress,
        state: shippingDetails.stateOfResidence,
        postal_code: shippingDetails.postalCode,
        town: shippingDetails.townCity,
        alt_phone_number: shippingDetails.alternatePhone || "",
        delivery_fee: deliveryFee,
      };

      // Call the checkout API
      const checkoutResponse = await apiClient.post<Record<string, unknown>>(
        "/cart/check-out",
        checkoutData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Checkout response:", checkoutResponse);

      // Store checkout response for use in Paystack payment
      localStorage.setItem(
        "checkoutResponse",
        JSON.stringify(checkoutResponse)
      );

      // Pass the checkout response to the parent component
      onSubmit({
        checkoutResponse,
        deliveryFee,
      });

      setIsProcessing(false);
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Error",
        description:
          error instanceof Error ? error.message : "Failed to process checkout",
        variant: ToastVariant.Error,
      });
      setIsProcessing(false);
    }
  };

  // const handlePaystackSuccess = (reference: string, checkoutData?: any) => {
  //   toast({
  //     title: "Payment Successful",
  //     description: `Your payment was successful. Reference: ${reference}`,
  //     variant: ToastVariant.Success,
  //   });

  //   onSubmit({
  //     paymentReference: reference,
  //     checkoutData,
  //   });
  // };

  // Removed unused handlePaystackClose function

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-red">
          Homepage
        </Link>
        {" / "}
        <Link href="/cart" className="hover:text-brand-red">
          My cart
        </Link>
        {" / "}
        <Link href="/checkout" className="hover:text-brand-red">
          Confirm details
        </Link>
        {" / "}
        <span className="font-medium text-gray-700">Payment</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className={isMobile ? "w-full" : "lg:w-1/2"}>
          <h2 className="text-xl font-bold mb-6">Payment Method</h2>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Please select your delivery fee option:
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="deliveryFee1"
                  name="deliveryFee"
                  value="1"
                  checked={deliveryFee === "1"}
                  onChange={() => setDeliveryFee("1")}
                  className="mr-2"
                />
                <label htmlFor="deliveryFee1">Standard Delivery (₦1,000)</label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="deliveryFee2"
                  name="deliveryFee"
                  value="2"
                  checked={deliveryFee === "2"}
                  onChange={() => setDeliveryFee("2")}
                  className="mr-2"
                />
                <label htmlFor="deliveryFee2">Express Delivery (₦2,000)</label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="deliveryFee3"
                  name="deliveryFee"
                  value="3"
                  checked={deliveryFee === "3"}
                  onChange={() => setDeliveryFee("3")}
                  className="mr-2"
                />
                <label htmlFor="deliveryFee3">Premium Delivery (₦3,000)</label>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Click the button below to proceed with checkout. You will be
              redirected to Paystack&#39;s secure payment page.
            </p>

            <Button
              onClick={handleCheckout}
              className="w-full bg-black hover:bg-gray-800 text-white mb-6"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </Button>
          </div>

          {/* Shipping Details Summary */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Shipping details</h3>
              <Link
                href="/checkout"
                className="text-sm text-gray-500 hover:text-brand-red"
              >
                Edit details
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">First name</p>
                <p className="font-medium">{shippingDetails.firstName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Last name</p>
                <p className="font-medium">{shippingDetails.lastName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">State or residence</p>
                <p className="font-medium">
                  {shippingDetails.stateOfResidence}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Town/City</p>
                <p className="font-medium">{shippingDetails.townCity}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone number</p>
                <p className="font-medium">{shippingDetails.phoneNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Postal code</p>
                <p className="font-medium">{shippingDetails.postalCode}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">House address</p>
              <p className="font-medium">{shippingDetails.houseAddress}</p>
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className={isMobile ? "w-full" : "lg:w-1/2"}>
          {isMobile && (
            <h2 className="text-xl font-bold mb-6">My Shopping Cart</h2>
          )}
          {!isMobile && (
            <h2 className="text-xl font-bold mb-6">Order summary</h2>
          )}

          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4">
                <div className="relative w-20 h-20 bg-gray-50 rounded-md overflow-hidden">
                  <Image
                    src={
                      item.images && item.images.length > 0
                        ? item.images[0].image
                        : "/placeholder.svg?height=80&width=80"
                    }
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-bold mt-1">
                    ₦{Number(item.amount).toLocaleString()}
                  </p>
                </div>
                {isMobile && (
                  <div className="flex items-start">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove item
                    </Button>
                  </div>
                )}
                {!isMobile && (
                  <div className="flex items-start gap-2">
                    <Button variant="outline" size="sm">
                      Edit order
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 4H14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.33337 4V2.66667C5.33337 2.29848 5.47385 1.94554 5.72389 1.6955C5.97394 1.44545 6.32688 1.30498 6.69504 1.30498H9.30171C9.66987 1.30498 10.0228 1.44545 10.2729 1.6955C10.5229 1.94554 10.6634 2.29848 10.6634 2.66667V4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.66663 7.33333V11.3333"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.33337 7.33333V11.3333"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.33337 4L4.00004 12.6667C4.00004 13.0349 4.14051 13.3878 4.39056 13.6379C4.64061 13.8879 4.99355 14.0284 5.36171 14.0284H10.6284C10.9965 14.0284 11.3495 13.8879 11.5995 13.6379C11.8496 13.3878 11.99 13.0349 11.99 12.6667L12.6667 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-bold mb-4">Cart summary</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ₦{cartSummary.subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>₦{cartSummary.tax.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Fee</span>
                <span>
                  ₦
                  {deliveryFee === "1"
                    ? "1,000"
                    : deliveryFee === "2"
                    ? "2,000"
                    : "3,000"}
                </span>
              </div>

              <div className="pt-2 border-t mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total amount</span>
                  <span>
                    ₦
                    {(
                      cartSummary.subtotal +
                      cartSummary.tax +
                      Number(deliveryFee) * 1000
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Enter discount code</span>
              </div>
              <div className="flex mt-2">
                <Input
                  placeholder="Discount code"
                  className="rounded-r-none"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <Button
                  className="rounded-l-none bg-black hover:bg-gray-800 text-white"
                  onClick={handleApplyDiscount}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
