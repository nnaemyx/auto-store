// Paystack integration for payment processing

// Test keys (these would be environment variables in a real app)
export const PAYSTACK_PUBLIC_KEY = "pk_test_a131aa00b7894d50ae45cd23b8c45d505df98e94"
export const PAYSTACK_SECRET_KEY = "sk_test_7f35db767f3f5082cad14a91c241d0b91b4c8900"

// Types
export interface PaystackInitializeResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export interface PaystackVerifyResponse {
  status: boolean
  message: string
  data: {
    status: string
    reference: string
    amount: number
    gateway_response: string
    paid_at: string
    channel: string
    currency: string
    customer: {
      email: string
      name: string
      phone: string
    }
  }
}

export interface PaystackTransactionParams {
  email: string
  amount: number // in kobo (multiply by 100)
  reference?: string
  callback_url?: string
  metadata?: Record<string, unknown>
}

// Generate a unique reference
export const generateReference = () => {
  const timestamp = new Date().getTime().toString()
  const randomStr = Math.random().toString(36).substring(2, 15)
  return `autostore-${timestamp}-${randomStr}`
}

// Initialize a transaction
export const initializeTransaction = async (params: PaystackTransactionParams): Promise<PaystackInitializeResponse> => {
  try {
    // In a real app, this would be a server-side API call
    // For demo purposes, we'll simulate a successful response
    const reference = params.reference || generateReference()

    return {
      status: true,
      message: "Authorization URL created",
      data: {
        authorization_url: `https://checkout.paystack.com/${reference}`,
        access_code: "access_code_" + reference,
        reference,
      },
    }
  } catch (error) {
    console.error("Paystack initialization error:", error)
    throw new Error("Failed to initialize payment")
  }
}

// Verify a transaction
export const verifyTransaction = async (reference: string): Promise<PaystackVerifyResponse> => {
  try {
    // In a real app, this would be a server-side API call
    // For demo purposes, we'll simulate a successful response
    return {
      status: true,
      message: "Verification successful",
      data: {
        status: "success",
        reference,
        amount: 5000000, // 50,000 Naira in kobo
        gateway_response: "Successful",
        paid_at: new Date().toISOString(),
        channel: "card",
        currency: "NGN",
        customer: {
          email: "customer@example.com",
          name: "John Doe",
          phone: "+2348012345678",
        },
      },
    }
  } catch (error) {
    console.error("Paystack verification error:", error)
    throw new Error("Failed to verify payment")
  }
}

