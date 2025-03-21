"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SignupFormData } from "@/app/auth/signup/page"
import { Textarea } from "@/components/ui/textarea"

type AdditionalDetailsFormProps = {
  initialData: SignupFormData
  onSubmit: (data: Partial<SignupFormData>) => void
}

export default function AdditionalDetailsForm({ initialData, onSubmit }: AdditionalDetailsFormProps) {
  const [formData, setFormData] = useState({
    phone: initialData.phone || "",
    dateOfBirth: initialData.dateOfBirth || { day: "", month: "", year: "" },
    gender: initialData.gender || "",
    shippingDetails: initialData.shippingDetails || {
      state: "",
      city: "",
      phone: "",
      postalCode: "",
      address: "",
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleSkip = () => {
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Personal details</h3>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone number
            </label>
            <Input
              id="phone"
              placeholder="+234 - 000 0000 000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Date of birth</label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="DD"
                value={formData.dateOfBirth.day}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dateOfBirth: { ...formData.dateOfBirth, day: e.target.value },
                  })
                }
              />
              <Input
                placeholder="MM"
                value={formData.dateOfBirth.month}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dateOfBirth: { ...formData.dateOfBirth, month: e.target.value },
                  })
                }
              />
              <Input
                placeholder="YYYY"
                value={formData.dateOfBirth.year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dateOfBirth: { ...formData.dateOfBirth, year: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={formData.gender === "male" ? "default" : "outline"}
                className={formData.gender === "male" ? "bg-black text-white" : ""}
                onClick={() => setFormData({ ...formData, gender: "male" })}
              >
                Male
              </Button>
              <Button
                type="button"
                variant={formData.gender === "female" ? "default" : "outline"}
                className={formData.gender === "female" ? "bg-black text-white" : ""}
                onClick={() => setFormData({ ...formData, gender: "female" })}
              >
                Female
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium">Shipping details</h3>

          <div className="space-y-2">
            <label htmlFor="state" className="block text-sm font-medium">
              State of residence
            </label>
            <Select
              value={formData.shippingDetails.state}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  shippingDetails: { ...formData.shippingDetails, state: value },
                })
              }
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lagos">Lagos</SelectItem>
                <SelectItem value="abuja">Abuja</SelectItem>
                <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
                <SelectItem value="kano">Kano</SelectItem>
                <SelectItem value="ibadan">Ibadan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium">
              Town/City
            </label>
            <Select
              value={formData.shippingDetails.city}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  shippingDetails: { ...formData.shippingDetails, city: value },
                })
              }
            >
              <SelectTrigger id="city">
                <SelectValue placeholder="Town or city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ikeja">Ikeja</SelectItem>
                <SelectItem value="lekki">Lekki</SelectItem>
                <SelectItem value="victoria-island">Victoria Island</SelectItem>
                <SelectItem value="ikoyi">Ikoyi</SelectItem>
                <SelectItem value="yaba">Yaba</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="shippingPhone" className="block text-sm font-medium">
              Phone number
            </label>
            <Input
              id="shippingPhone"
              placeholder="+234 - 000 0000 000"
              value={formData.shippingDetails.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shippingDetails: { ...formData.shippingDetails, phone: e.target.value },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="postalCode" className="block text-sm font-medium">
              Postal code
            </label>
            <Input
              id="postalCode"
              placeholder="000000"
              value={formData.shippingDetails.postalCode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shippingDetails: { ...formData.shippingDetails, postalCode: e.target.value },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium">
              House address
            </label>
            <Textarea
              id="address"
              placeholder="Enter your house address"
              value={formData.shippingDetails.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shippingDetails: { ...formData.shippingDetails, address: e.target.value },
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button type="submit" className="bg-black hover:bg-gray-800 text-white">
          Proceed
        </Button>
        <Button type="button" variant="outline" onClick={handleSkip}>
          Skip, I&apos;ll do it later
        </Button>
      </div>
    </form>
  )
}

