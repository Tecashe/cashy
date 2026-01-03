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

//     // Get customer from metadata
//     const customers = await stripe.customers.list({
//       email: userId,
//       limit: 1,
//     })

//     if (!customers.data.length) {
//       return NextResponse.json({
//         tier: "free",
//         status: "inactive",
//         subscription: null,
//         customer: null,
//       })
//     }

//     const customer = customers.data[0]

//     // Get subscriptions
//     const subscriptions = await stripe.subscriptions.list({
//       customer: customer.id,
//       limit: 1,
//       status: "all",
//     })

//     const subscription = subscriptions.data[0] || null

//     // Determine tier from subscription
//     let tier = "free"
//     if (subscription && subscription.status === "active") {
//       const priceId = subscription.items.data[0]?.price.id
//       if (priceId?.includes("pro")) {
//         tier = "pro"
//       } else if (priceId?.includes("enterprise")) {
//         tier = "enterprise"
//       }
//     }
// //yguyg
//     return NextResponse.json({
//       tier,
//       status: subscription?.status || "inactive",
//       subscription: subscription
//         ? {
//             id: subscription.id,
//             status: subscription.status,
//             currentPeriodEnd: new Date(subscription.current_period_end * 1000),
//             currentPeriodStart: new Date(subscription.current_period_start * 1000),
//           }
//         : null,
//       customer: {
//         id: customer.id,
//         email: customer.email,
//       },
//     })
//   } catch (error) {
//     console.error("Error fetching subscription:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

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

//     // Get customer from metadata
//     const customers = await stripe.customers.list({
//       email: userId,
//       limit: 1,
//     })

//     if (!customers.data.length) {
//       return NextResponse.json({
//         tier: "free",
//         status: "inactive",
//         subscription: null,
//         customer: null,
//       })
//     }

//     const customer = customers.data[0]

//     // Get subscriptions
//     const subscriptions = await stripe.subscriptions.list({
//       customer: customer.id,
//       limit: 1,
//       status: "all",
//     })

//     const subscription = subscriptions.data[0] || null

//     // Determine tier from subscription
//     let tier = "free"
//     if (subscription && subscription.status === "active") {
//       const priceId = subscription.items.data[0]?.price.id
//       if (priceId?.includes("pro")) {
//         tier = "pro"
//       } else if (priceId?.includes("enterprise")) {
//         tier = "enterprise"
//       }
//     }

//     return NextResponse.json({
//       tier,
//       status: subscription?.status || "inactive",
//       subscription: subscription
//         ? {
//             id: subscription.id,
//             status: subscription.status,
//             currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
//             currentPeriodStart: new Date(subscription.items.data[0].current_period_start * 1000),
//           }
//         : null,
//       customer: {
//         id: customer.id,
//         email: customer.email,
//       },
//     })
//   } catch (error) {
//     console.error("Error fetching subscription:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// import { auth, clerkClient } from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"
// import Stripe from "stripe"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// export async function GET() {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Get user's email from Clerk
//     const user = await (await clerkClient()).users.getUser(userId)
//     const email = user.emailAddresses[0]?.emailAddress

//     if (!email) {
//       return NextResponse.json({
//         tier: "free",
//         status: "inactive",
//         subscription: null,
//         customer: null,
//       })
//     }

//     // Get customer from email
//     const customers = await stripe.customers.list({
//       email: email,
//       limit: 1,
//     })

//     if (!customers.data.length) {
//       return NextResponse.json({
//         tier: "free",
//         status: "inactive",
//         subscription: null,
//         customer: null,
//       })
//     }

//     const customer = customers.data[0]

//     // Get subscriptions
//     const subscriptions = await stripe.subscriptions.list({
//       customer: customer.id,
//       limit: 1,
//       status: "all",
//     })

//     const subscription = subscriptions.data[0] || null

//     // Determine tier from subscription
//     let tier = "free"
//     if (subscription && subscription.status === "active") {
//       const priceId = subscription.items.data[0]?.price.id
//       if (priceId?.includes("pro")) {
//         tier = "pro"
//       } else if (priceId?.includes("enterprise")) {
//         tier = "enterprise"
//       }
//     }

//     return NextResponse.json({
//       tier,
//       status: subscription?.status || "inactive",
//       subscription: subscription
//         ? {
//             id: subscription.id,
//             status: subscription.status,
//             currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
//             currentPeriodStart: new Date(subscription.items.data[0].current_period_start * 1000),
//           }
//         : null,
//       customer: {
//         id: customer.id,
//         email: customer.email,
//       },
//     })
//   } catch (error) {
//     console.error("Error fetching subscription:", error)
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
      return NextResponse.json({
        tier: "free",
        status: "inactive",
        subscription: null,
        customer: null,
      })
    }

    // Get customer from email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    if (!customers.data.length) {
      return NextResponse.json({
        tier: "free",
        status: "inactive",
        subscription: null,
        customer: null,
      })
    }

    const customer = customers.data[0]

    // Get subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 1,
      status: "all",
    })

    const subscription = subscriptions.data[0] || null

    // Determine tier from subscription
    let tier = "free"
    if (subscription && subscription.status === "active") {
      const priceId = subscription.items.data[0]?.price.id
      
      // Debug log
      console.log("Subscription found:", {
        priceId,
        status: subscription.status,
        proPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
        enterprisePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
      })
      
      // Exact match with environment variables
      if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) {
        tier = "pro"
      } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID) {
        tier = "enterprise"
      } else {
        // Fallback: check if price ID contains keywords
        const priceIdLower = priceId?.toLowerCase() || ""
        if (priceIdLower.includes("pro") || priceIdLower.includes("premium")) {
          tier = "pro"
        } else if (priceIdLower.includes("enterprise") || priceIdLower.includes("business")) {
          tier = "enterprise"
        }
      }
      
      console.log("Determined tier:", tier)
    }

    const response = {
      tier,
      status: subscription?.status || "inactive",
      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
            currentPeriodStart: new Date(subscription.items.data[0].current_period_start * 1000),
            priceId: subscription.items.data[0]?.price.id,
          }
        : null,
      customer: {
        id: customer.id,
        email: customer.email,
      },
    }
    
    console.log("API Response:", JSON.stringify(response, null, 2))
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}