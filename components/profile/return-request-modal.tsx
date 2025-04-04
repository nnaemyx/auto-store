"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import ConfirmReturnModal from "./confirm-return-modal"

interface ReturnRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ReturnRequestData) => void
  product: {
    id: string
    name: string
    price: string
    image: string
    item: string
    trackingId: string
    dateOrdered: string
    dateDelivered: string
  }
}

export interface ReturnRequestData {
  reason: string
  images: File[]
}

export default function ReturnRequestModal({ isOpen, onClose, onSubmit, product }: ReturnRequestModalProps) {
  const [formData, setFormData] = useState<ReturnRequestData>({
    reason: "",
    images: [],
  })
  const [showConfirmation, setShowConfirmation] = useState(false)

  if (!isOpen) return null

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      reason: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmation(true)
  }

  const handleConfirmReturn = () => {
    setShowConfirmation(false)
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-white md:bg-black md:bg-opacity-50 flex items-center justify-center z-50 md:p-4">
      <div className="bg-white md:rounded-lg w-full md:max-w-md h-full md:h-auto overflow-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center p-4 border-b">
          <button onClick={onClose} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-medium">Order #{product.id}</h2>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg?height=64&width=64"}
                alt={product.name}
                fill
                className="object-contain p-2"
              />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h3 className="font-medium">{product.name}</h3>
                <span className="text-green-500 text-sm">Delivered · {product.dateDelivered}</span>
              </div>
              <p className="font-bold">₦{product.price}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Item</p>
              <p className="font-medium">{product.item}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tracking ID</p>
              <p className="font-medium">{product.trackingId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date ordered</p>
              <p className="font-medium">{product.dateOrdered}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="font-medium">{product.dateDelivered}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">What&#39;s your reason for the return?</label>
              <Textarea
                value={formData.reason}
                onChange={handleReasonChange}
                placeholder="State your reason here"
                rows={6}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Upload pictures (optional)</label>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-md aspect-square flex items-center justify-center bg-gray-50"
                  >
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-300"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path
                        d="M3 16l5-5 5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 14l3-3 4 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-black hover:bg-gray-800 text-white">
                Confirm request
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmReturnModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmReturn}
      />
    </div>
  )
}

