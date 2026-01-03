// import { auth } from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"
// import Stripe from "stripe"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// export async function POST(request: Request) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Get customer
//     const customers = await stripe.customers.list({
//       email: userId,
//       limit: 1,
//     })

//     if (!customers.data.length) {
//       return NextResponse.json({ error: "Customer not found" }, { status: 404 })
//     }

//     const customer = customers.data[0]

//     // Get active subscription
//     const subscriptions = await stripe.subscriptions.list({
//       customer: customer.id,
//       status: "active",
//       limit: 1,
//     })

//     if (!subscriptions.data.length) {
//       return NextResponse.json({ error: "No active subscription" }, { status: 400 })
//     }

//     // Cancel the subscriptio
//     const subscription = subscriptions.data[0]
//     await stripe.subscriptions.del(subscription.id)

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error downgrading subscription:", error)
//     return NextResponse.json({ error: "Failed to downgrade subscription" }, { status: 500 })
//   }
// }
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

    // Get customer
    const customers = await stripe.customers.list({
      email: userId,
      limit: 1,
    })

    if (!customers.data.length) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const customer = customers.data[0]

    // Get active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    })

    if (!subscriptions.data.length) {
      return NextResponse.json({ error: "No active subscription" }, { status: 400 })
    }

    // Cancel the subscription
    const subscription = subscriptions.data[0]
    await stripe.subscriptions.cancel(subscription.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error downgrading subscription:", error)
    return NextResponse.json({ error: "Failed to downgrade subscription" }, { status: 500 })
  }
}
