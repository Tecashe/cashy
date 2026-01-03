// import { auth } from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"
// import Stripe from "stripe"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// export async function GET() {
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
//       return NextResponse.json({ paymentMethods: [] })
//     }

//     const customer = customers.data[0]

//     // Get payment methods
//     const paymentMethods = await stripe.paymentMethods.list({
//       customer: customer.id,
//       type: "card",
//     })

//     return NextResponse.json({
//       paymentMethods: paymentMethods.data.map((pm) => ({
//         id: pm.id,
//         brand: (pm.card as any)?.brand || "unknown",
//         last4: (pm.card as any)?.last4 || "****",
//         expMonth: (pm.card as any)?.exp_month,
//         expYear: (pm.card as any)?.exp_year,
//         isDefault: pm.id === customer.invoice_settings?.default_payment_method,
//       })),
//       defaultPaymentMethodId: customer.invoice_settings?.default_payment_method,
//     })
//   } catch (error) {
//     console.error("Error fetching payment methods:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }
import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's email from Clerk
    const user = await (await clerkClient()).users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress

    if (!email) {
      return NextResponse.json({ paymentMethods: [] })
    }

    // Get customer
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    if (!customers.data.length) {
      return NextResponse.json({ paymentMethods: [] })
    }

    const customer = customers.data[0]

    // Get payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: "card",
    })

    return NextResponse.json({
      paymentMethods: paymentMethods.data.map((pm) => ({
        id: pm.id,
        brand: pm.card?.brand || "unknown",
        last4: pm.card?.last4 || "****",
        expMonth: pm.card?.exp_month,
        expYear: pm.card?.exp_year,
        isDefault: pm.id === customer.invoice_settings?.default_payment_method,
      })),
      defaultPaymentMethodId: customer.invoice_settings?.default_payment_method,
    })
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}