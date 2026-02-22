import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { submitOrder } from "@/lib/pesapal"
import { PESAPAL_PLAN_AMOUNTS } from "@/lib/stripe-utils"
import type { SubscriptionTier } from "@/lib/subscription-plans"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tier } = await request.json()

    if (!["pro", "business", "enterprise"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
    }

    if (tier === "enterprise") {
      return NextResponse.json({ error: "Enterprise requires contacting sales" }, { status: 400 })
    }

    const amount = PESAPAL_PLAN_AMOUNTS[tier as SubscriptionTier]
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid plan amount" }, { status: 400 })
    }

    // Get user's email from Clerk
    const user = await (await clerkClient()).users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress

    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 })
    }

    // Get user from DB
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, firstName: true, lastName: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const orderId = `YAZ-UP-${tier.toUpperCase()}-${Date.now()}`
    const callbackUrl = process.env.PESAPAL_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/pesapal/callback`

    // Submit order to Pesapal
    const orderResult = await submitOrder({
      orderId,
      amount,
      currency: "USD",
      description: `Yazzil ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan Subscription`,
      callbackUrl,
      customerEmail: email,
      customerFirstName: dbUser.firstName || "",
      customerLastName: dbUser.lastName || "",
    })

    // Store the order tracking ID
    await prisma.paymentAttempt.create({
      data: {
        userId: dbUser.id,
        conversationId: "",
        amount: amount * 100,
        currency: "usd",
        status: "pending",
        stripePaymentIntentId: orderResult.order_tracking_id,
        metadata: {
          tier,
          pesapalOrderTrackingId: orderResult.order_tracking_id,
          pesapalMerchantReference: orderResult.merchant_reference,
        },
      },
    })

    return NextResponse.json({
      redirect_url: orderResult.redirect_url,
      order_tracking_id: orderResult.order_tracking_id,
      requiresCheckout: true,
    })
  } catch (error) {
    console.error("Error upgrading subscription:", error)
    return NextResponse.json({
      error: "Failed to upgrade subscription",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}