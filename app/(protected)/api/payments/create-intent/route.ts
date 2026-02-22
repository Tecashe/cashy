import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { submitOrder } from "@/lib/pesapal"
import { PESAPAL_PLAN_AMOUNTS } from "@/lib/stripe-utils"
import { SUBSCRIPTION_PLANS, type SubscriptionTier } from "@/lib/subscription-plans"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tier } = await request.json()

    // Validate tier
    if (!["freemium", "pro", "business", "enterprise"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
    }

    // Enterprise requires contacting sales
    if (tier === "enterprise") {
      return NextResponse.json({ error: "Enterprise requires contacting sales" }, { status: 400 })
    }

    const amount = PESAPAL_PLAN_AMOUNTS[tier as SubscriptionTier]
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid plan amount" }, { status: 400 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, email: true, firstName: true, lastName: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const orderId = `YAZ-PAY-${tier.toUpperCase()}-${Date.now()}`
    const callbackUrl = process.env.PESAPAL_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/pesapal/callback`

    // Submit order to Pesapal
    const orderResult = await submitOrder({
      orderId,
      amount,
      currency: "USD",
      description: `Yazzil ${SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS].name} Plan`,
      callbackUrl,
      customerEmail: user.email,
      customerFirstName: user.firstName || "",
      customerLastName: user.lastName || "",
    })

    // Record payment attempt
    await prisma.paymentAttempt.create({
      data: {
        userId: user.id,
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
    })
  } catch (error) {
    console.error("[Pesapal] Payment order creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
