"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EditPersonalDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: PersonalDetailsData) => void
  initialData: PersonalDetailsData
}

export interface PersonalDetailsData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: {
    day: string
    month: string
    year: string
  }
  gender: string
}

export default function EditPersonalDetailsModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EditPersonalDetailsModalProps) {
  const [formData, setFormData] = useState<PersonalDetailsData>(initialData)

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "day" || name === "month" || name === "year") {
      setFormData({
        ...formData,
        dateOfBirth: {
          ...formData.dateOfBirth,
          [name]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleGenderChange = (gender: string) => {
    setFormData({
      ...formData,
      gender,
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
          <h2 className="text-xl font-bold mb-6">Personal details</h2>

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

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email address
              </label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone number
              </label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Date of birth</label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  name="day"
                  placeholder="DD"
                  value={formData.dateOfBirth.day}
                  onChange={handleChange}
                  maxLength={2}
                  required
                />
                <Input
                  name="month"
                  placeholder="MM"
                  value={formData.dateOfBirth.month}
                  onChange={handleChange}
                  maxLength={2}
                  required
                />
                <Input
                  name="year"
                  placeholder="YYYY"
                  value={formData.dateOfBirth.year}
                  onChange={handleChange}
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Gender</label>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    checked={formData.gender === "Male"}
                    onChange={() => handleGenderChange("Male")}
                    className="mr-2"
                  />
                  <label htmlFor="male">Male</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    checked={formData.gender === "Female"}
                    onChange={() => handleGenderChange("Female")}
                    className="mr-2"
                  />
                  <label htmlFor="female">Female</label>
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

