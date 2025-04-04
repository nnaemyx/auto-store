"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface MobileSupportProps {
  activeTab: "contact-form" | "contact-info" | "faq"
  onBack: () => void
}

export default function MobileSupport({ activeTab, onBack }: MobileSupportProps) {
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    subject: "",
    message: "",
  })

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

  // FAQ data
  const faqItems = [
    {
      question: "How do I track my order?",
      answer:
        "You can track your order by going to your profile and selecting 'Track Order'. Enter your order number to see the current status and location of your package.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept returns within 14 days of delivery. Items must be in their original condition with all tags and packaging. To initiate a return, go to your order history and select the item you wish to return.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping typically takes 3-5 business days within Nigeria. Express shipping options are available at checkout for 1-2 business day delivery in major cities.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Currently, we only ship within Nigeria. We're working on expanding our shipping options to other countries in the future.",
    },
    {
      question: "How can I change or cancel my order?",
      answer:
        "You can change or cancel your order within 1 hour of placing it. After that, please contact our customer support team for assistance.",
    },
  ]

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
    //   variant: "default",
    })
    // Reset form
    setFormData({ name: "", email: "", orderNumber: "", subject: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white py-4 px-4 flex items-center justify-between sticky top-0 z-10 border-b">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-medium">
            {activeTab === "contact-form"
              ? "Contact Form"
              : activeTab === "contact-info"
                ? "Contact Information"
                : "FAQ"}
          </h1>
        </div>
      </div>

      <div className="p-4">
        {activeTab === "contact-form" && (
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
              Send message
            </Button>
          </form>
        )}

        {activeTab === "contact-info" && (
          <div className="space-y-6">
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

            <div className="pt-4">
              <h3 className="font-medium mb-2">Business Hours</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Weekdays</p>
                  <p className="font-medium">9:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weekends</p>
                  <p className="font-medium">10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "faq" && (
          <div>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Still have questions?</h3>
              <p className="text-gray-600 mb-4">
                If you couldn&apos;t find the answer to your question in our FAQ, please don&apos;t hesitate to contact our
                support team.
              </p>
              <Button onClick={() => onBack()} className="w-full bg-black hover:bg-gray-800 text-white">
                Back to Support
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

