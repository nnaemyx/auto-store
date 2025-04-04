"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Phone, Mail, MapPin, MessageSquare, HelpCircle, Twitter, Facebook, Instagram } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import MobileSupport from "./mobile-support"

export default function SupportPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    subject: "",
    message: "",
  })

  const [activeTab, setActiveTab] = useState<"contact-form" | "contact-info" | "faq">("contact-form")
  const [showMobileView, setShowMobileView] = useState(false)

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

  const handleMobileTabSelect = (tab: "contact-form" | "contact-info" | "faq") => {
    setActiveTab(tab)
    setShowMobileView(true)
  }

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

  // Mobile view with option buttons
  if (isMobile && !showMobileView) {
    return (
      <ProfileLayout title="Contact support">
        <div className="space-y-4">
          <Button
            onClick={() => handleMobileTabSelect("contact-form")}
            className="w-full bg-white border hover:bg-gray-50 text-black justify-start h-auto py-4"
          >
            <div className="flex flex-col items-start">
              <h3 className="font-medium">Contact Form</h3>
              <p className="text-sm text-gray-500">Send us a message</p>
            </div>
          </Button>

          <Button
            onClick={() => handleMobileTabSelect("contact-info")}
            className="w-full bg-white border hover:bg-gray-50 text-black justify-start h-auto py-4"
          >
            <div className="flex flex-col items-start">
              <h3 className="font-medium">Contact Information</h3>
              <p className="text-sm text-gray-500">Phone, email, and address</p>
            </div>
          </Button>

          <Button
            onClick={() => handleMobileTabSelect("faq")}
            className="w-full bg-white border hover:bg-gray-50 text-black justify-start h-auto py-4"
          >
            <div className="flex flex-col items-start">
              <h3 className="font-medium">Frequently Asked Questions</h3>
              <p className="text-sm text-gray-500">Find answers to common questions</p>
            </div>
          </Button>
        </div>
      </ProfileLayout>
    )
  }

  // Mobile detailed view
  if (isMobile && showMobileView) {
    return <MobileSupport activeTab={activeTab} onBack={() => setShowMobileView(false)} />
  }

  // Desktop view with tabs
  return (
    <ProfileLayout title="Contact support">
      {breadcrumb}

      <Tabs defaultValue="contact-form" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="contact-form">Contact Form</TabsTrigger>
          <TabsTrigger value="contact-info">Contact Information</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="contact-form">
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
        </TabsContent>

        <TabsContent value="contact-info">
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Contact Information</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-brand-red mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone numbers</p>
                    <p className="font-medium">{contactInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-brand-red mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Whatsapp numbers</p>
                    <p className="font-medium">{contactInfo.whatsapp}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-brand-red mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="font-medium">{contactInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Twitter className="h-5 w-5 text-brand-red mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Twitter</p>
                    <p className="font-medium">{contactInfo.twitter}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Facebook className="h-5 w-5 text-brand-red mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Facebook</p>
                    <p className="font-medium">{contactInfo.facebook}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Instagram className="h-5 w-5 text-brand-red mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Instagram</p>
                    <p className="font-medium">{contactInfo.instagram}</p>
                  </div>
                </div>

                <div className="md:col-span-2 flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-brand-red mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Office address</p>
                    <p className="font-medium">{contactInfo.address}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Business Hours</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Weekdays</p>
                    <p className="font-medium">9:00 AM - 6:00 PM</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Weekends</p>
                    <p className="font-medium">10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Location Map</h3>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map would be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq">
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Frequently Asked Questions</h2>
            </div>

            <div className="p-6">
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
                  If you couldn&#39;t find the answer to your question in our FAQ, please don&#39;t hesitate to contact our
                  support team.
                </p>
                <Button
                  onClick={() => {
                    const element = document.querySelector('[data-value="contact-form"]') as HTMLElement | null;
                    element?.click();
                  }}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </ProfileLayout>
  )
}

