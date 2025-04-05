"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useToast } from "@/hooks/use-toast"
import EditPersonalDetailsModal, { PersonalDetailsData } from "@/components/profile/edeit-personal-details"
import EditShippingDetailsModal, { ShippingDetailsData } from "@/components/profile/edit-shipping-details"

export default function ProfileOverviewPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast } = useToast()

  const [showPersonalDetailsModal, setShowPersonalDetailsModal] = useState(false)
  const [showShippingDetailsModal, setShowShippingDetailsModal] = useState(false)

  const [personalDetails, setPersonalDetails] = useState<PersonalDetailsData>({
    firstName: "John",
    lastName: "Daniel",
    email: "johndaniel@fakegmail.com",
    phone: "+234 7068141207",
    dateOfBirth: {
      day: "24",
      month: "12",
      year: "2005",
    },
    gender: "Male",
  })

  const [shippingDetails, setShippingDetails] = useState<ShippingDetailsData>({
    firstName: "John",
    lastName: "Daniel",
    state: "Kwara",
    city: "Ilorin",
    postalCode: "876 546",
    houseAddress:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim fghf fhfus skaks",
    alternatePhone: "090 8697 8768",
    deliveryType: "pickup",
  })



  // Breadcrumb for desktop
  const breadcrumb = (
    <div className="text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-brand-red">
        Homepage
      </Link>
      {" / "}
      <span className="font-medium text-gray-700">Profile overview</span>
    </div>
  )

  const handleSavePersonalDetails = (data: PersonalDetailsData) => {
    setPersonalDetails(data)
    setShowPersonalDetailsModal(false)
    toast({
      title: "Success",
      description: "Personal details updated successfully",
    })
  }

  const handleSaveShippingDetails = (data: ShippingDetailsData) => {
    setShippingDetails(data)
    setShowShippingDetailsModal(false)
    toast({
      title: "Success",
      description: "Shipping details updated successfully",
    })
  }



  return (
    <ProfileLayout>
      {!isMobile && breadcrumb}

      {/* Personal Details Section */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Personal details</h2>
          <Button variant="ghost" className="text-gray-500 text-sm" onClick={() => setShowPersonalDetailsModal(true)}>
            Edit details
          </Button>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">First name</p>
            <p className="font-medium">{personalDetails.firstName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last name</p>
            <p className="font-medium">{personalDetails.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email address</p>
            <p className="font-medium">{personalDetails.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone number</p>
            <p className="font-medium">{personalDetails.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date of birth</p>
            <p className="font-medium">{`${personalDetails.dateOfBirth.day}th ${new Date(
              0,
              Number.parseInt(personalDetails.dateOfBirth.month) - 1,
            ).toLocaleString("default", { month: "long" })}, ${personalDetails.dateOfBirth.year}`}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium">{personalDetails.gender}</p>
          </div>
        </div>
      </div>

      {/* Shipping Details Section */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Shipping details</h2>
          <Button variant="ghost" className="text-gray-500 text-sm" onClick={() => setShowShippingDetailsModal(true)}>
            Edit details
          </Button>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Recipient&#39;s full name</p>
            <p className="font-medium">{`${shippingDetails.firstName} ${shippingDetails.lastName} Mac`}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">State</p>
            <p className="font-medium">{shippingDetails.state}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">City</p>
            <p className="font-medium">{shippingDetails.city}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Postal code</p>
            <p className="font-medium">{shippingDetails.postalCode}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">House address</p>
            <p className="font-medium">{shippingDetails.houseAddress}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Delivery preference</p>
            <p className="font-medium">
              {shippingDetails.deliveryType === "pickup" ? "Pick up station" : "Door delivery"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Alternate phone number</p>
            <p className="font-medium">{shippingDetails.alternatePhone}</p>
          </div>
        </div>
      </div>



      {/* Modals */}
      <EditPersonalDetailsModal
        isOpen={showPersonalDetailsModal}
        onClose={() => setShowPersonalDetailsModal(false)}
        onSave={handleSavePersonalDetails}
        initialData={personalDetails}
      />

      <EditShippingDetailsModal
        isOpen={showShippingDetailsModal}
        onClose={() => setShowShippingDetailsModal(false)}
        onSave={handleSaveShippingDetails}
        initialData={shippingDetails}
      />
    </ProfileLayout>
  )
}

