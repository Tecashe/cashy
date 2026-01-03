// import { auth } from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"
// import Stripe from "stripe"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// const PRICE_IDS = {
//   pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "price_1QmIW9DyVRYWFW9zMT4wQ8Xy",
//   enterprise: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || "price_1QmIW9DyVRYWFW9zMT4wQ8Xy",
// }

// export async function POST(request: Request) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { tier } = await request.json()

//     if (!["pro", "enterprise"].includes(tier)) {
//       return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
//     }

//     // Get or create customer
//     let customer = (
//       await stripe.customers.list({
//         email: userId,
//         limit: 1,
//       })
//     ).data[0]

//     if (!customer) {
//       customer = await stripe.customers.create({
//         email: userId,
//         metadata: { userId },
//       })
//     }

//     // Get active subscription
//     const subscriptions = await stripe.subscriptions.list({
//       customer: customer.id,
//       status: "active",
//       limit: 1,
//     })

//     const priceId = PRICE_IDS[tier as keyof typeof PRICE_IDS]

//     if (subscriptions.data.length > 0) {
//       // Update existing subscription
//       const subscription = subscriptions.data[0]
//       await stripe.subscriptions.update(subscription.id, {
//         items: [
//           {
//             id: subscription.items.data[0].id,
//             price: priceId,
//           },
//         ],
//         proration_behavior: "create_prorations",
//       })

//       return NextResponse.json({ success: true, subscription })
//     } else {
//       // Create new subscription
//       const subscription = await stripe.subscriptions.create({
//         customer: customer.id,
//         items: [{ price: priceId }],
//         payment_behavior: "default_incomplete",
//         payment_settings: {
//           save_default_payment_method: "on_subscription",
//         },
//         expand: ["latest_invoice.payment_intent"],
//       })

//       return NextResponse.json({ success: true, subscription })
//     }
//   } catch (error) {
//     console.error("Error upgrading subscription:", error)
//     return NextResponse.json({ error: "Failed to upgrade subscription" }, { status: 500 })
//   }
// }

import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICE_IDS = {
  pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "price_1RREVGGLBdyWcD0JxyZCsUlv",
  enterprise: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || "price_1RREVGGLBdyWcD0JxyZCsUlv",
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tier } = await request.json()

    if (!["pro", "enterprise"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
    }

    // Get user's email from Clerk
    const user = await (await clerkClient()).users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress

    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 })
    }

    // Get or create customer
    let customer = (
      await stripe.customers.list({
        email: email,
        limit: 1,
      })
    ).data[0]

    if (!customer) {
      customer = await stripe.customers.create({
        email: email,
        metadata: { userId },
      })
    }

    // Get active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    })

    const priceId = PRICE_IDS[tier as keyof typeof PRICE_IDS]

    if (subscriptions.data.length > 0) {
      // Update existing subscription
      const subscription = subscriptions.data[0]
      await stripe.subscriptions.update(subscription.id, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: priceId,
          },
        ],
        proration_behavior: "create_prorations",
      })

      return NextResponse.json({ success: true, subscription })
    } else {
      // Create new subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: "default_incomplete",
        payment_settings: {
          save_default_payment_method: "on_subscription",
        },
        expand: ["latest_invoice.payment_intent"],
      })

      return NextResponse.json({ success: true, subscription })
    }
  } catch (error) {
    console.error("Error upgrading subscription:", error)
    return NextResponse.json({ error: "Failed to upgrade subscription" }, { status: 500 })
  }
}