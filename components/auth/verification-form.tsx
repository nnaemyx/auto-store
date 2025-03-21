"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { SignupFormData } from "@/app/auth/signup/page"

type VerificationFormProps = {
  initialData: SignupFormData
  onSubmit: (data: Partial<SignupFormData>) => void
}

export default function VerificationForm({ initialData, onSubmit }: VerificationFormProps) {
  const [verificationCode, setVerificationCode] = useState(initialData.verificationCode || "")
  const [countdown, setCountdown] = useState(30)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleResendCode = async () => {
    if (countdown > 0) return

    setIsResending(true)

    try {
      // In a real app, you would call your API to resend the code
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCountdown(30)
    } catch (error) {
      console.error("Failed to resend code:", error)
    } finally {
      setIsResending(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ verificationCode })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="verificationCode" className="block text-sm font-medium">
          Verification code
        </label>
        <Input
          id="verificationCode"
          placeholder="Enter code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
        />
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
          Verify account
        </Button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        By clicking &quot;Verify account&quot;, a one time passcode would be sent to the email you used during registration.
        Please enter the code in the next step.
        {countdown > 0 ? (
          <p className="mt-2">Resend code in {countdown} seconds</p>
        ) : (
          <button
            type="button"
            onClick={handleResendCode}
            className="mt-2 text-brand-red hover:underline block w-full"
            disabled={isResending}
          >
            {isResending ? "Resending..." : "Resend code"}
          </button>
        )}
      </div>
    </form>
  )
}

