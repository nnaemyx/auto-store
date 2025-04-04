"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CardData) => void
}

export interface CardData {
  cardNumber: string
  nameOnCard: string
  expiryDate: string
  cvv: string
}

export default function AddCardModal({ isOpen, onClose, onSave }: AddCardModalProps) {
  const [formData, setFormData] = useState<CardData>({
    cardNumber: "",
    nameOnCard: "",
    expiryDate: "",
    cvv: "",
  })

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
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
          <h2 className="text-xl font-bold mb-6">Add new card</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                Card number
              </label>
              <Input
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="0000 0000 0000 0000"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="nameOnCard" className="block text-sm font-medium mb-1">
                Name on card
              </label>
              <Input
                id="nameOnCard"
                name="nameOnCard"
                value={formData.nameOnCard}
                onChange={handleChange}
                placeholder="Enter the name on your card"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">
                  Expiry date
                </label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="DD-MM-YY"
                  required
                />
              </div>

              <div>
                <label htmlFor="cvv" className="block text-sm font-medium mb-1">
                  CVV
                </label>
                <Input
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-black hover:bg-gray-800 text-white">
                Add card
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

