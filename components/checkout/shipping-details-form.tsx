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



interface ShippingDetailsFormProps {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    stateOfResidence: string;
    townCity: string;
    phoneNumber: string;
    alt_phoneNumber:string;
    postalCode: string;
    houseAddress: string;
    saveDetails: boolean;
    deliveryType: string;
  }) => void;
  cartItems: CartItem[];
  cartSummary: {
    subtotal: number;
    tax: number;
    shipping_fee: number;
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
    stateOfResidence: "",
    townCity: "",
    phoneNumber: "",
    alt_phoneNumber:"",
    postalCode: "",
    houseAddress: "",
    saveDetails: false,
    deliveryType: "pickup", // default to pickup
  });
  const [states, setStates] = useState<[]>([]);
  const [lgas, setLgas] = useState<string[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingLgas, setIsLoadingLgas] = useState(false);

  // Fetch Nigerian states
  // The API doesn't return the expected structure, so update or remove this interface
  // The response appears to be just an array of strings for LGAs

  // Then update the fetchStates function:
  useEffect(() => {
    const fetchStates = async () => {
      setIsLoadingStates(true);
      try {
        const response = await fetch(
          "https://nga-states-lga.onrender.com/fetch"
        );
        if (!response.ok) throw new Error("Failed to fetch states");
        const data = await response.json();
        // The data is an array of strings, not objects
        setStates(data || []);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setIsLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  // Fetch LGAs when state changes
  useEffect(() => {
    const fetchLGAs = async () => {
      if (!formData.stateOfResidence) {
        setLgas([])
        return
      }
      
      setIsLoadingLgas(true)
      try {
        const response = await fetch(`https://nga-states-lga.onrender.com/?state=${encodeURIComponent(formData.stateOfResidence)}`)
        if (!response.ok) throw new Error('Failed to fetch LGAs')
        // The API returns an array of strings directly
        const data = await response.json()
        setLgas(data || [])
        // Reset town/city when state changes
        setFormData(prev => ({ ...prev, townCity: "" }))
      } catch (error) {
        console.error('Error fetching LGAs:', error)
        setLgas([])
      } finally {
        setIsLoadingLgas(false)
      }
    }
  
    fetchLGAs()
  }, [formData.stateOfResidence])

  // Check if we have saved shipping details
  useEffect(() => {
    const savedDetails = localStorage.getItem("savedShippingDetails");
    if (savedDetails) {
      try {
        setFormData(JSON.parse(savedDetails));
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

    onSubmit(formData);
  };

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
                  htmlFor="stateOfResidence"
                  className="block text-sm font-medium mb-1"
                >
                  State of residence
                </label>
                <select
                  id="stateOfResidence"
                  name="stateOfResidence"
                  value={formData.stateOfResidence}
                  onChange={handleChange}
                  className="w-full border text-black border-gray-300 rounded-md p-2"
                  required
                  disabled={isLoadingStates}
                >
                  <option value="">Select a state</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {isLoadingStates && (
                  <p className="text-xs text-gray-500 mt-1">
                    Loading states...
                  </p>
                )}
              </div>

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
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                  disabled={!formData.stateOfResidence || isLoadingLgas}
                >
                  <option value="">Select LGA</option>
                  {lgas.map((lga) => (
                    <option key={lga} value={lga}>
                      {lga}
                    </option>
                  ))}
                </select>
                {isLoadingLgas && (
                  <p className="text-xs text-gray-500 mt-1">Loading LGAs...</p>
                )}
              </div>
            </div>

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
                  placeholder="+234 000 0000 000"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="alt_phoneNumber"
                  className="block text-sm font-medium mb-1"
                >
                  Alt Phone number
                </label>
                <Input
                  id="alt_phoneNumber"
                  name="alt_phoneNumber"
                  value={formData.alt_phoneNumber}
                  onChange={handleChange}
                  placeholder="+234 000 0000 000"
                  required
                />
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
                  placeholder="000000"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="houseAddress"
                className="block text-sm font-medium mb-1"
              >
                House address
              </label>
              <textarea
                id="houseAddress"
                name="houseAddress"
                value={formData.houseAddress}
                onChange={handleChange}
                placeholder="Enter your house address"
                className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="saveDetails"
                checked={formData.saveDetails}
                onCheckedChange={(checked: boolean | "indeterminate") =>
                  handleCheckboxChange("saveDetails", checked as boolean)
                }
              />
              <label htmlFor="saveDetails" className="text-sm font-medium">
                Save my shipping details for future orders from Auto Store
              </label>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Delivery type</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="doorDelivery"
                    name="deliveryType"
                    value="door"
                    checked={formData.deliveryType === "door"}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <label htmlFor="doorDelivery" className="text-sm">
                    Door delivery (incurs an additional fee of ₦2,500)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="pickupStation"
                    name="deliveryType"
                    value="pickup"
                    checked={formData.deliveryType === "pickup"}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <label htmlFor="pickupStation" className="text-sm">
                    Pick-up station
                  </label>
                </div>
              </div>
            </div>

            {!isMobile && (
              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white"
              >
                Continue to Payment
              </Button>
            )}
          </form>
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
                <span>₦{cartSummary.shipping_fee.toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total amount</span>
                  <span>₦{cartSummary.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Enter discount code</span>
              </div>
              <div className="flex mt-2">
                <Input placeholder="Discount code" className="rounded-r-none" />
                <Button className="rounded-l-none bg-black hover:bg-gray-800 text-white">
                  Apply
                </Button>
              </div>
            </div>
          </div>

          {isMobile && (
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent);
              }}
              className="w-full mt-6 bg-black hover:bg-gray-800 text-white"
            >
              Continue to Payment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
