// This file contains Paystack integration utilities

/**
 * Get the Paystack public key from environment variables
 */
export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ""

/**
 * Generate a unique reference for Paystack transactions
 * Format: AUTOSTORE_YYYY-MM-DD_RANDOM
 */
export function generateReference(): string {
  const date = new Date().toISOString().slice(0, 10)
  const random = Math.random().toString(36).substring(2, 15)
  return `AUTOSTORE_${date}_${random}`
}

/**
 * Verify a Paystack transaction
 * This should be called from a server action or API route
 */
interface PaystackTransactionResponse {
  status: string
  message: string
  data: {
    reference: string
    amount: number
    status: string
    transaction_date: string
  }
}

export async function verifyPaystackTransaction(reference: string): Promise<PaystackTransactionResponse> {
  try {
    // Get auth token
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication token not found")
    }

    console.log("Verifying transaction with reference:", reference)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/paystack/verify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reference }),
    })

    console.log("POST verification status:", response.status)

    if (!response.ok) {
      throw new Error(`Verification failed with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error verifying transaction:", error)
    throw error
  }
}

/**
 * Store payment reference in localStorage
 */
export function storePaymentReference(reference: string): void {
  localStorage.setItem("paymentReference", reference)
}

/**
 * Store payment details in localStorage
 */
export function storePaymentDetails(details: Record<string, unknown>): void {
  localStorage.setItem("paymentDetails", JSON.stringify(details))
}

/**
 * Mark order as confirmed in localStorage
 */
export function confirmOrder(): void {
  localStorage.setItem("orderConfirmed", "true")
}

