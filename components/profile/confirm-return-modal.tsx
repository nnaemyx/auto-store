"use client"

import { Button } from "@/components/ui/button"

interface ConfirmReturnModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  message?: string
}

export default function ConfirmReturnModal({
  isOpen,
  onClose,
  onConfirm,
  message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim fghf fhfus skaks",
}: ConfirmReturnModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-center mb-4">Confirm return request?</h2>

          <p className="text-center text-gray-600 mb-6">{message}</p>

          <div className="flex flex-col gap-3">
            <Button onClick={onConfirm} className="w-full bg-black hover:bg-gray-800 text-white">
              Yes, request return
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              No, cancel request
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

