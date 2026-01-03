// "use server"

// import { auth } from "@clerk/nextjs/server"
// import Stripe from "stripe"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// export async function getCurrentSubscriptionTier(): Promise<string> {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return "free"
//     }

//     const customers = await stripe.customers.list({
//       email: userId,
//       limit: 1,
//     })

//     if (!customers.data.length) {
//       return "free"
//     }

//     const customer = customers.data[0]
//     const subscriptions = await stripe.subscriptions.list({
//       customer: customer.id,
//       limit: 1,
//       status: "active",
//     })

//     if (!subscriptions.data.length) {
//       return "free"
//     }

//     const subscription = subscriptions.data[0]
//     const priceId = subscription.items.data[0]?.price.id

//     if (priceId?.includes("pro")) {
//       return "pro"
//     } else if (priceId?.includes("enterprise")) {
//       return "enterprise"
//     }

//     return "free"
//   } catch (error) {
//     console.error("Error getting subscription tier:", error)
//     return "free"
//   }
// }
"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function getCurrentSubscriptionTier(): Promise<string> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return "free"
    }

    // Query your database directly - it's the source of truth
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { subscriptionTier: true },
    })

    return (user?.subscriptionTier as string) || "free"
    
  } catch (error) {
    console.error("Error getting subscription tier:", error)
    return "free"
  }
}
