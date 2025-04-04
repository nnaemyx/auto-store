"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"

interface ProductReviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ReviewData) => void
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

export interface ReviewData {
  rating: number
  comment: string
}

export default function ProductReviewModal({ isOpen, onClose, onSubmit, product }: ProductReviewModalProps) {
  const [formData, setFormData] = useState<ReviewData>({
    rating: 0,
    comment: "",
  })

  if (!isOpen) return null

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      comment: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
              <label className="block text-sm font-medium mb-2">How would you rate this product?</label>
              <Textarea
                value={formData.comment}
                onChange={handleCommentChange}
                placeholder="Leave a comment"
                rows={6}
              />
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-black hover:bg-gray-800 text-white">
                Post comment
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

