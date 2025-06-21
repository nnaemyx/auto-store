"use client"

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from '@/components/ui/label';
import { useToast, ToastVariant } from "@/hooks/use-toast";
import { useCustomOrder } from '@/hooks/use-custom-order';

const CustomOrderPage = () => {
  const { toast } = useToast();
  const customOrderMutation = useCustomOrder();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedImages, setSelectedImages] = React.useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    
    // Extract only the required fields
    const orderData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      product_name: formData.get('product_name') as string,
      description: formData.get('description') as string,
      address: formData.get('address') as string || undefined,
      additional: formData.get('additional') as string || undefined,
      images: selectedImages || undefined,
    };

    try {
      await customOrderMutation.mutateAsync(orderData);
      toast({
        title: "Order Request Submitted",
        description: "Our customer care team will contact you shortly regarding your order.",
      });
      formRef.current?.reset();
      setSelectedImages(null);
    } catch (error) {
      console.error("Custom order error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit order request",
        variant: ToastVariant.Error,
      });
    }
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

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="Enter your full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="Enter your phone number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" placeholder="Enter your address" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_name">Product Name</Label>
                <Input id="product_name" name="product_name" placeholder="Enter the name of the product you want" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  placeholder="Please describe the product you're looking for in detail. Include any specific requirements or features you need."
                  className="min-h-[150px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional">Additional Information</Label>
                <Textarea 
                  id="additional" 
                  name="additional"
                  placeholder="Any additional information that might help us understand your requirements better."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Product Images (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      setSelectedImages(e.target.files);
                    }}
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <div className="space-y-2">
                      <div className="text-gray-600">
                        <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-brand-red hover:text-brand-red/80">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </label>
                  {/* Image preview */}
                  {selectedImages && selectedImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      {Array.from(selectedImages).map((file, idx) => (
                        <div key={idx} className="w-20 h-20 relative border rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  className="bg-black text-white hover:bg-gray-800 px-8"
                  disabled={customOrderMutation.isPending}
                >
                  {customOrderMutation.isPending ? "Submitting..." : "Submit Request"}
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