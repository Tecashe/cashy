import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get customer
    const customers = await stripe.customers.list({
      email: userId,
      limit: 1,
    })

    if (!customers.data.length) {
      return NextResponse.json({
        totalSpent: 0,
        paymentCount: 0,
        charges: [],
      })
    }

    const customer = customers.data[0]

    // Get charges
    const charges = await stripe.charges.list({
      customer: customer.id,
      limit: 50,
    })

    const totalSpent = charges.data.reduce((sum, charge) => {
      if (charge.paid) sum += charge.amount
      return sum
    }, 0)

    return NextResponse.json({
      totalSpent,
      paymentCount: charges.data.length,
      charges: charges.data.map((charge) => ({
        id: charge.id,
        amount: charge.amount,
        currency: charge.currency,
        created: new Date(charge.created * 1000),
        status: charge.status,
        receipt_url: charge.receipt_url,
        description: charge.description,
      })),
    })
  } catch (error) {
    console.error("Error fetching billing stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
