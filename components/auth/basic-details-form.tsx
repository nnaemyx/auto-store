"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SignupFormData } from "@/app/auth/signup/page"

type BasicDetailsFormProps = {
  initialData: SignupFormData
  onSubmit: (data: Partial<SignupFormData>) => void
}

export default function BasicDetailsForm({ initialData, onSubmit }: BasicDetailsFormProps) {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || "",
    email: initialData.email || "",
    location: initialData.location || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-[445px] mx-auto flex flex-col justify-center px-[22.5px]">
      <div className="space-y-2">
        <label htmlFor="fullName" className="block text-sm font-medium">
          Full name
        </label>
        <Input
          id="fullName"
          placeholder="Enter your full name (surname first)"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
          className="mx-auto border"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="mx-auto border"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="location" className="block text-sm font-medium">
          Location
        </label>
        <Select
          value={formData.location}
          onValueChange={(value) => setFormData({ ...formData, location: value })}
          required
        >
          <SelectTrigger id="location" className="w-full">
            <SelectValue placeholder="State of Residence" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="lagos">Lagos</SelectItem>
            <SelectItem value="abuja">Abuja</SelectItem>
            <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
            <SelectItem value="kano">Kano</SelectItem>
            <SelectItem value="ibadan">Ibadan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
          Proceed
        </Button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        By clicking &quot;Proceed&quot;, you acknowledge that you have read and understood the{" "}
        <a href="/terms" className="underline">
          Terms of agreement and Privacy policy
        </a>{" "}
        of &quot;E-commerce&quot;
      </div>
    </form>
  )
}

