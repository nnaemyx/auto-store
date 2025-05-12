"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

const CustomOrderPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Show success message
    toast({
      title: "Order Request Submitted",
      description: "Our customer care team will contact you shortly regarding your order.",
    });

    setIsSubmitting(false);
    // Reset form
    e.currentTarget.reset();
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-6 text-center">Custom Order Request</h1>
          
          <div className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-brand-red">
              Homepage
            </Link>
            {" / "}
            <span className="font-medium text-gray-700">Custom Order</span>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-gray-700 mb-8">
              Can&apos;t find what you&apos;re looking for? Fill out this form to request a custom order. Our team will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="Enter your phone number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Enter your address" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input id="productName" placeholder="Enter the name of the product you want" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Please describe the product you're looking for in detail. Include any specific requirements or features you need."
                  className="min-h-[150px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional">Additional Information</Label>
                <Textarea 
                  id="additional" 
                  placeholder="Any additional information that might help us understand your requirements better."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  className="bg-black text-white hover:bg-gray-800 px-8"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
              <p>For immediate assistance, you can also:</p>
              <div className="mt-2 space-x-4">
                <a href="tel:+2349039756266" className="text-blue-600 hover:text-blue-700">
                  Call us: +234 903 975 6266
                </a>
                <span>|</span>
                <a href="mailto:support@autostores.ng" className="text-blue-600 hover:text-blue-700">
                  Email: support@autostores.ng
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrderPage; 