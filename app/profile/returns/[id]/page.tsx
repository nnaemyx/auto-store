"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function ReturnRequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const fetchParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    fetchParams();
  }, [params]);

  const [returnDetails, setReturnDetails] = useState<{
    id: string;
    productName: string;
    productPrice: string;
    status: string;
    item: string;
    trackingId: string;
    dateOrdered: string;
    dateDelivered: string;
    reason: string;
    images: string[];
  } | null>(null);

  useEffect(() => {
    if (resolvedParams) {
      setReturnDetails({
        id: resolvedParams.id,
        productName: "Name of product",
        productPrice: "50,687.90",
        status: "Processing",
        item: "Toyota Camry Interior Seats",
        trackingId: "9675 6456 3454",
        dateOrdered: "03/12/2024",
        dateDelivered: "12/12/2025",
        reason:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim fghf fhfus skaks",
        images: [
          "/placeholder.svg?height=100&width=100",
          "/placeholder.svg?height=100&width=100",
          "/placeholder.svg?height=100&width=100",
          "/placeholder.svg?height=100&width=100",
        ],
      });
    }
  }, [resolvedParams]);

  if (!resolvedParams || !returnDetails) {
    return <div>Loading...</div>;
  }

  // Breadcrumb for desktop
  const breadcrumb = (
    <div className="text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-brand-red">
        Homepage
      </Link>
      {" / "}
      <Link href="/profile/returns" className="hover:text-brand-red">
        Return requests
      </Link>
      {" / "}
      <span className="font-medium text-gray-700">Order #{returnDetails.id}</span>
    </div>
  )

  // Mobile view has a simpler layout with a back button
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white py-4 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/profile/returns" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-medium">Order #{returnDetails.id}</h1>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
              <Image
                src="/placeholder.svg?height=64&width=64"
                alt={returnDetails.productName}
                fill
                className="object-contain p-2"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{returnDetails.productName}</h3>
                <span className="text-yellow-500 text-sm">{returnDetails.status}</span>
              </div>
              <p className="font-bold">₦{returnDetails.productPrice}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Item</p>
                <p className="font-medium">{returnDetails.item}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tracking ID</p>
                <p className="font-medium">{returnDetails.trackingId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date ordered</p>
                <p className="font-medium">{returnDetails.dateOrdered}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="font-medium">{returnDetails.dateDelivered}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Reason for return</h3>
            <p className="text-gray-700">{returnDetails.reason}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Upload pictures (optional)</h3>
            <div className="grid grid-cols-2 gap-2">
              {returnDetails.images.map((image, index) => (
                <div key={index} className="border border-gray-200 rounded-md aspect-square relative">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Return image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full bg-black hover:bg-gray-800 text-white" asChild>
            <Link href="/profile/returns">Back to home</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Desktop view with sidebar
  return (
    <ProfileLayout title={`Order #${returnDetails.id}`}>
      {breadcrumb}

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
              <Image
                src="/placeholder.svg?height=64&width=64"
                alt={returnDetails.productName}
                fill
                className="object-contain p-2"
              />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h3 className="font-medium">{returnDetails.productName}</h3>
                <span className="text-yellow-500 text-sm">{returnDetails.status}</span>
              </div>
              <p className="font-bold">₦{returnDetails.productPrice}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Item</p>
              <p className="font-medium">{returnDetails.item}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tracking ID</p>
              <p className="font-medium">{returnDetails.trackingId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date ordered</p>
              <p className="font-medium">{returnDetails.dateOrdered}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="font-medium">{returnDetails.dateDelivered}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Reason for return</h3>
            <p className="text-gray-700">{returnDetails.reason}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Uploaded pictures</h3>
            <div className="grid grid-cols-4 gap-4">
              {returnDetails.images.map((image, index) => (
                <div key={index} className="border border-gray-200 rounded-md aspect-square relative">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Return image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full bg-black hover:bg-gray-800 text-white" asChild>
            <Link href="/profile/returns">Track order</Link>
          </Button>
        </div>
      </div>
    </ProfileLayout>
  )
}

