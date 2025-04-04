"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import AddCardModal, { type CardData } from "@/components/profile/add-card-modal"
import { useToast } from "@/hooks/use-toast"
import EditPersonalDetailsModal, { PersonalDetailsData } from "@/components/profile/edeit-personal-details"
import EditShippingDetailsModal, { ShippingDetailsData } from "@/components/profile/edit-shipping-details"

export default function ProfileOverviewPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast } = useToast()

  const [showPersonalDetailsModal, setShowPersonalDetailsModal] = useState(false)
  const [showShippingDetailsModal, setShowShippingDetailsModal] = useState(false)
  const [showAddCardModal, setShowAddCardModal] = useState(false)

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

  const [cards, setCards] = useState([
    { bank: "Xenith Bank", number: "5464686785******64473" },
    { bank: "Xenith Bank", number: "5464686785******64473" },
    { bank: "Xenith Bank", number: "5464686785******64473" },
  ])

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

  const handleAddCard = (data: CardData) => {
    setCards([...cards, { bank: "New Bank", number: data.cardNumber.replace(/\d(?=\d{4})/g, "*") }])
    setShowAddCardModal(false)
    toast({
      title: "Success",
      description: "Card added successfully",
    })
  }

  const handleRemoveCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index))
    toast({
      title: "Success",
      description: "Card removed successfully",
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

      {/* Card Details Section */}
      <div className="bg-white rounded-lg border">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Card details</h2>
          <Button variant="ghost" className="text-gray-500 text-sm" onClick={() => setShowAddCardModal(true)}>
            Add card
          </Button>
        </div>
        <div className="p-4 space-y-4">
          {cards.map((card, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                  <Image src="/placeholder.svg?height=48&width=48" alt="Card" fill className="object-contain p-2" />
                </div>
                <div>
                  <p className="font-medium">{card.bank}</p>
                  <p className="text-sm text-gray-500">{card.number}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full h-8 w-8 p-0"
                onClick={() => handleRemoveCard(index)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          ))}
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

      <AddCardModal isOpen={showAddCardModal} onClose={() => setShowAddCardModal(false)} onSave={handleAddCard} />
    </ProfileLayout>
  )
}

