"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function TermsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Breadcrumb for desktop
  const breadcrumb = (
    <div className="text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-brand-red">
        Homepage
      </Link>
      {" / "}
      <span className="font-medium text-gray-700">Terms of agreement</span>
    </div>
  )

  // Mobile view has a simpler layout with a back button
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        <div className="p-4">
          <div className="flex items-center mb-4">
            <Link href="/profile" className="text-sm text-gray-500">
              Homepage
            </Link>
            <span className="text-sm text-gray-500 mx-1">/</span>
            <span className="text-sm">Terms of agreement</span>
          </div>

          <h1 className="text-xl font-bold mb-4">Terms of Agreement</h1>

          <div className="space-y-4">
            <p className="text-gray-700">
              Terms and Conditions<br />
              Effective Date: [Insert Date]<br />
              Welcome to Autostores.ng. By accessing or using our website, you agree to be bound by these Terms and Conditions. Please read them carefully.
            </p>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">1. Use of Our Platform</h2>
              <p className="text-gray-700">
                You must be at least 18 years old to use this website. By using our services, you agree to provide accurate, complete, and updated information.
              </p>

              <h2 className="text-lg font-semibold">2. Product Availability</h2>
              <p className="text-gray-700">
                While we strive to maintain up-to-date listings, availability may vary. We reserve the right to cancel or modify orders due to product unavailability.
              </p>

              <h2 className="text-lg font-semibold">3. Pricing and Payment</h2>
              <p className="text-gray-700">
                Prices are listed in NGN and are subject to change without notice. We accept secure online payments through approved channels only.
              </p>

              <h2 className="text-lg font-semibold">4. Refund & Return Policy</h2>
              <p className="text-gray-700">
                We operate a no cash refund policy. Store credit will be issued for eligible returns, valid toward future purchases.
              </p>

              <h2 className="text-lg font-semibold">5. User Conduct</h2>
              <p className="text-gray-700">
                You agree not to use our platform for any unlawful or harmful activity, including transmitting false information or interfering with operations.
              </p>

              <h2 className="text-lg font-semibold">6. Limitation of Liability</h2>
              <p className="text-gray-700">
                Autostores.ng is not liable for any indirect, incidental, or consequential damages resulting from the use of our services.
              </p>

              <h2 className="text-lg font-semibold">7. Changes to Terms</h2>
              <p className="text-gray-700">
                We may update these terms periodically. Continued use of our platform signifies acceptance of the updated terms.
              </p>
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
    <ProfileLayout title="Terms of agreement">
      {breadcrumb}

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold mb-6">Terms of Agreement</h2>

        <div className="space-y-4">
          <p className="text-gray-700">
            Terms and Conditions<br />
            Effective Date: [Insert Date]<br />
            Welcome to Autostores.ng. By accessing or using our website, you agree to be bound by these Terms and Conditions. Please read them carefully.
          </p>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">1. Use of Our Platform</h2>
            <p className="text-gray-700">
              You must be at least 18 years old to use this website. By using our services, you agree to provide accurate, complete, and updated information.
            </p>

            <h2 className="text-lg font-semibold">2. Product Availability</h2>
            <p className="text-gray-700">
              While we strive to maintain up-to-date listings, availability may vary. We reserve the right to cancel or modify orders due to product unavailability.
            </p>

            <h2 className="text-lg font-semibold">3. Pricing and Payment</h2>
            <p className="text-gray-700">
              Prices are listed in NGN and are subject to change without notice. We accept secure online payments through approved channels only.
            </p>

            <h2 className="text-lg font-semibold">4. Refund & Return Policy</h2>
            <p className="text-gray-700">
              We operate a no cash refund policy. Store credit will be issued for eligible returns, valid toward future purchases.
            </p>

            <h2 className="text-lg font-semibold">5. User Conduct</h2>
            <p className="text-gray-700">
              You agree not to use our platform for any unlawful or harmful activity, including transmitting false information or interfering with operations.
            </p>

            <h2 className="text-lg font-semibold">6. Limitation of Liability</h2>
            <p className="text-gray-700">
              Autostores.ng is not liable for any indirect, incidental, or consequential damages resulting from the use of our services.
            </p>

            <h2 className="text-lg font-semibold">7. Changes to Terms</h2>
            <p className="text-gray-700">
              We may update these terms periodically. Continued use of our platform signifies acceptance of the updated terms.
            </p>
          </div>
        </div>
      </div>
    </ProfileLayout>
  )
}

