import { type NextRequest, NextResponse } from "next/server"
import { PAYSTACK_SECRET_KEY } from "@/lib/paystack"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    // Verify that the request is from Paystack
    const hash = crypto.createHmac("sha512", PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest("hex")

    if (hash !== req.headers.get("x-paystack-signature")) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Get the event data
    const event = await req.json()

    // Handle different event types
    switch (event.event) {
      case "charge.success":
        // Handle successful charge
        console.log("Successful charge:", event.data)
        // Update order status in database
        break

      case "transfer.success":
        // Handle successful transfer
        console.log("Successful transfer:", event.data)
        break

      case "transfer.failed":
        // Handle failed transfer
        console.log("Failed transfer:", event.data)
        break

      default:
        // Handle other events
        console.log("Unhandled event:", event)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

