"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import ProfileLayout from "@/components/profile/profile-layout"
import { useToast } from "@/hooks/use-toast"
import { HelpCircle } from "lucide-react"

export default function SupportPage() {
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    toast({
      title: "Message Sent",
      description: "Your message has been sent. We'll get back to you soon.",
    })
    // Reset form
    setFormData({ name: "", email: "", orderNumber: "", subject: "", message: "" })
  }

  // Breadcrumb
  const breadcrumb = (
    <div className="text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-brand-red">
        Homepage
      </Link>
      {" / "}
      <span className="font-medium text-gray-700">Contact support</span>
    </div>
  )

  return (
    <ProfileLayout title="Contact support">
      {breadcrumb}

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-medium mb-6">Contact support</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Your Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="orderNumber" className="block text-sm font-medium mb-1">
              Order Number (Optional)
            </label>
            <Input
              id="orderNumber"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleChange}
              placeholder="Enter order number if applicable"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Subject
            </label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message"
              rows={6}
              required
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <HelpCircle className="h-4 w-4" />
            <p>Our support team typically responds within 24 hours.</p>
          </div>

          <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
            Send message
          </Button>
        </form>
      </div>
    </ProfileLayout>
  )
}

