"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { CartItem } from "@/hooks/use-cart";
import { Checkbox } from "../ui/checkbox";
import { Loader2, Tag } from "lucide-react";

interface ShippingDetails {
    firstName: string;
    lastName: string;
    email: string;
    stateOfResidence: string;
    townCity: string;
    phoneNumber: string;
    alt_phoneNumber: string;
    postalCode: string;
    houseAddress: string;
    saveDetails: boolean;
    deliveryType: string;
    couponCode?: string;
}

interface ShippingDetailsFormProps {
  onSubmit: (formData: ShippingDetails & { appliedCoupon?: { code: string; discount: number } }) => void;
  cartItems: CartItem[];
  cartSummary: {
    subtotal: number;
    total: number;
  };
}

export default function ShippingDetailsForm({
  onSubmit,
  cartItems,
  cartSummary,
}: ShippingDetailsFormProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    stateOfResidence: "Lagos",
    townCity: "",
    phoneNumber: "",
    alt_phoneNumber:"",
    postalCode: "",
    houseAddress: "",
    saveDetails: false,
    deliveryType: "pickup", // default to pickup
  });
  // const [lgas, setLgas] = useState<string[]>([]);
  // const [isLoadingLgas, setIsLoadingLgas] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Fetch Lagos LGAs
  // useEffect(() => {
  //   const fetchLGAs = async () => {
  //     setIsLoadingLgas(true);
  //     try {
  //       const response = await fetch(
  //         `https://nga-states-lga.onrender.com/?state=Lagos`
  //       );
  //       if (!response.ok) throw new Error("Failed to fetch LGAs");
  //       const data = await response.json();
  //       setLgas(data || []);
  //     } catch (error) {
  //       console.error("Error fetching LGAs:", error);
  //       setLgas([]);
  //     } finally {
  //       setIsLoadingLgas(false);
  //     }
  //   };

  //   fetchLGAs();
  // }, []);

  // Check if we have saved shipping details
  useEffect(() => {
    const savedDetails = localStorage.getItem("savedShippingDetails");
    if (savedDetails) {
      try {
        const parsed = JSON.parse(savedDetails);
        // Ensure state is always Lagos
        setFormData({ ...parsed, stateOfResidence: "Lagos" });
      } catch (error) {
        console.error("Error parsing saved shipping details:", error);
        localStorage.removeItem("savedShippingDetails");
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save details if checkbox is checked
    if (formData.saveDetails) {
      localStorage.setItem("savedShippingDetails", JSON.stringify(formData));
    } else {
      // Remove saved details if checkbox is unchecked
      localStorage.removeItem("savedShippingDetails");
    }

    // Include applied coupon data in the submission
    const submissionData = {
      ...formData,
      ...(appliedCoupon && { appliedCoupon })
    };

    onSubmit(submissionData);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      // Simulate API call to validate coupon
      // In real implementation, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response - replace with actual API call
      const mockDiscount = Math.min(cartSummary.subtotal * 0.1, 5000); // 10% off, max ₦5,000
      
      setAppliedCoupon({
        code: couponCode,
        discount: mockDiscount
      });
      setCouponCode("");
    } catch {
      setCouponError("Invalid coupon code");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const finalTotal = appliedCoupon 
    ? cartSummary.total - appliedCoupon.discount 
    : cartSummary.total;

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
        <span className="font-medium text-gray-700">Confirm details</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className={isMobile ? "w-full" : "lg:w-1/2"}>
          <h2 className="text-xl font-bold mb-6">Shipping details</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium mb-1"
                >
                  First name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium mb-1"
                >
                  Last name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="stateOfResidence"
                  className="block text-sm font-medium mb-1"
                >
                  State of residence
                </label>
                <Input
                  id="stateOfResidence"
                  name="stateOfResidence"
                  value="Lagos"
                  disabled
                  className="bg-gray-100"
                />
              </div>
              </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="townCity"
                  className="block text-sm font-medium mb-1"
                >
                  LGA (Local Government Area)
                </label>
                <select
                  id="townCity"
                  name="townCity"
                  value={formData.townCity}
                  onChange={handleChange}
                  className="w-full border text-black border-gray-300 rounded-md p-2"
                  required
                  disabled={isLoadingLgas}
                >
                  <option value="">Select an LGA</option>
                  {lgas.map((lga) => (
                    <option key={lga} value={lga}>
                      {lga}
                    </option>
                  ))}
                </select>
                {isLoadingLgas && (
                  <p className="text-xs text-gray-500 mt-1">
                    Loading LGAs...
                  </p>
                )}
              </div>
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium mb-1"
                >
                  Phone number
                </label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="alt_phoneNumber"
                  className="block text-sm font-medium mb-1"
                >
                  Alternative phone number
                </label>
                <Input
                  id="alt_phoneNumber"
                  name="alt_phoneNumber"
                  value={formData.alt_phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter alternative phone number"
                />
              </div>
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium mb-1"
                >
                  Postal code
                </label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                placeholder="Enter your postal code"
                required
                />
            </div>

            <div>
              <label
                htmlFor="houseAddress"
                className="block text-sm font-medium mb-1"
              >
                House address
              </label>
              <Input
                id="houseAddress"
                name="houseAddress"
                value={formData.houseAddress}
                onChange={handleChange}
                placeholder="Enter your house address"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="saveDetails"
                checked={formData.saveDetails}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("saveDetails", checked as boolean)
                }
              />
              <label
                htmlFor="saveDetails"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Save these details for next time
              </label>
            </div>

            <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
              Continue to payment
              </Button>
          </form>
        </div>

        {/* Order Summary Section */}
        <div className={isMobile ? "w-full" : "lg:w-1/2"}>
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-bold mb-6">Order summary</h2>

            {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                  <Image
                      src={item.images && item.images.length > 0 ? item.images[0].image : "/placeholder.svg"}
                    alt={item.name}
                    fill
                      className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="font-medium">
                      ₦{Number(item.amount).toLocaleString()}
                    </p>
                  </div>
              </div>
            ))}
          </div>

            {/* Summary Details */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₦{cartSummary.subtotal.toLocaleString()}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₦{appliedCoupon.discount.toLocaleString()}</span>
              </div>
              )}
              
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <span>₦{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4" />
                <span className="text-sm font-medium">Have a coupon?</span>
              </div>
              
              {!appliedCoupon ? (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      className="bg-black hover:bg-gray-800 text-white px-4"
                    >
                      {isApplyingCoupon ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-500">{couponError}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Coupon applied: {appliedCoupon.code}
                    </p>
                    <p className="text-xs text-green-600">
                      You saved ₦{appliedCoupon.discount.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleRemoveCoupon}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
