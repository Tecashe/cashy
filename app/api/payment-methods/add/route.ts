import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get or create customer
    let customer = (
      await stripe.customers.list({
        email: userId,
        limit: 1,
      })
    ).data[0]

    if (!customer) {
      customer = await stripe.customers.create({
        email: userId,
        metadata: { userId },
      })
    }

    // Create a setup intent for adding payment method
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      usage: "off_session",
    })

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      customerId: customer.id,
    })
  } catch (error) {
    console.error("Error creating setup intent:", error)
    return NextResponse.json({ error: "Failed to add payment method" }, { status: 500 })
  }
}
