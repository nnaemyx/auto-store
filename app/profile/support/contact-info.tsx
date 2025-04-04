"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function ContactInfoPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Breadcrumb for desktop
  const breadcrumb = (
    <div className="text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-brand-red">
        Homepage
      </Link>
      {" / "}
      <span className="font-medium text-gray-700">Contact support</span>
    </div>
  )

  // Contact information
  const contactInfo = {
    phone: "07088976575, 08086758574",
    whatsapp: "07088976575, 08086758574",
    email: "autostoreng@gmail.com",
    twitter: "@auto_store.ng",
    facebook: "auto_st.ore",
    instagram: "a_utostore.ng",
    address:
      "Suite 36 and 37, 2nd Floor, Yasuha Plaza (Behind AP Plaza) Plot 1046, Adetokunbo Ademola Crescent, Wuse II, Abuja.",
  }

  // Mobile view has a simpler layout with a back button
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        <div className="p-4">
          <div className="flex items-center mb-4">
            <Link href="/" className="text-sm text-gray-500">
              Homepage
            </Link>
            <span className="text-sm text-gray-500 mx-1">/</span>
            <span className="text-sm">Contact support</span>
          </div>

          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Contacts</h2>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Phone numbers</p>
                <p className="font-medium">{contactInfo.phone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Whatsapp numbers</p>
                <p className="font-medium">{contactInfo.whatsapp}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{contactInfo.email}</p>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Twitter</p>
                  <p className="font-medium">{contactInfo.twitter}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Facebook</p>
                  <p className="font-medium">{contactInfo.facebook}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Instagram</p>
                <p className="font-medium">{contactInfo.instagram}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Office address</p>
                <p className="font-medium">{contactInfo.address}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button className="w-full bg-black hover:bg-gray-800 text-white" asChild>
              <Link href="/profile">Back</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Desktop view with sidebar
  return (
    <ProfileLayout title="Contact support">
      {breadcrumb}

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Contacts</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Phone numbers</p>
              <p className="font-medium">{contactInfo.phone}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Whatsapp numbers</p>
              <p className="font-medium">{contactInfo.whatsapp}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{contactInfo.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Twitter</p>
              <p className="font-medium">{contactInfo.twitter}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Facebook</p>
              <p className="font-medium">{contactInfo.facebook}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Instagram</p>
              <p className="font-medium">{contactInfo.instagram}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Office address</p>
              <p className="font-medium">{contactInfo.address}</p>
            </div>
          </div>
        </div>
      </div>
    </ProfileLayout>
  )
}

