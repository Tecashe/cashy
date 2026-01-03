import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { paymentMethodId } = await request.json()

    // Get customer
    const customers = await stripe.customers.list({
      email: userId,
      limit: 1,
    })

    if (!customers.data.length) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const customer = customers.data[0]

    // Set as default
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error setting default payment method:", error)
    return NextResponse.json({ error: "Failed to set default payment method" }, { status: 500 })
  }
}
