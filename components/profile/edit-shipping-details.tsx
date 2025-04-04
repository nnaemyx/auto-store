"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface EditShippingDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ShippingDetailsData) => void
  initialData: ShippingDetailsData
}

export interface ShippingDetailsData {
  firstName: string
  lastName: string
  state: string
  city: string
  postalCode: string
  houseAddress: string
  alternatePhone: string
  deliveryType: "door" | "pickup"
}

export default function EditShippingDetailsModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EditShippingDetailsModalProps) {
  const [formData, setFormData] = useState<ShippingDetailsData>(initialData)

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleDeliveryTypeChange = (type: "door" | "pickup") => {
    setFormData({
      ...formData,
      deliveryType: type,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Shipping details</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                  First name
                </label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                  Last name
                </label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="state" className="block text-sm font-medium mb-1">
                  State of residence
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="">Select state</option>
                  <option value="Kwara">Kwara</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                </select>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">
                  Town/City
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="">Select city</option>
                  <option value="Ilorin">Ilorin</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="alternatePhone" className="block text-sm font-medium mb-1">
                Alternate phone number
              </label>
              <Input
                id="alternatePhone"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleChange}
                placeholder="090 8697 8768"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
                Postal code
              </label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="876 546"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="houseAddress" className="block text-sm font-medium mb-1">
                House address
              </label>
              <Textarea
                id="houseAddress"
                name="houseAddress"
                value={formData.houseAddress}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Delivery type</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="doorDelivery"
                    name="deliveryType"
                    checked={formData.deliveryType === "door"}
                    onChange={() => handleDeliveryTypeChange("door")}
                    className="mr-2"
                  />
                  <label htmlFor="doorDelivery" className="text-sm">
                    Door delivery (incurs additional fee of ₦2,500)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="pickupStation"
                    name="deliveryType"
                    checked={formData.deliveryType === "pickup"}
                    onChange={() => handleDeliveryTypeChange("pickup")}
                    className="mr-2"
                  />
                  <label htmlFor="pickupStation" className="text-sm">
                    Pick up station
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-black hover:bg-gray-800 text-white">
                Save changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

