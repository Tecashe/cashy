import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { createPaymentIntent, getOrCreateStripeCustomer } from "@/lib/stripe"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tier } = await request.json()

    // Validate tier
    if (!["free", "pro", "enterprise"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
    }

    // Free tier has no payment
    if (tier === "free") {
      return NextResponse.json({ error: "Free tier requires no payment" }, { status: 400 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, email: true, firstName: true, lastName: true, stripeCustomerId: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get or create Stripe customer
    const customerResult = await getOrCreateStripeCustomer(
      user.id,
      user.email,
      `${user.firstName} ${user.lastName}`.trim(),
    )

    if (!customerResult.success) {
      return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
    }

    const customerId = customerResult.customerId!

    // Save customerId to user if not already saved
    if (!user.stripeCustomerId) {
      await prisma.user.update({
        where: { clerkId: userId },
        data: { stripeCustomerId: customerId },
      })
    }

    // Get plan price (in dollars)
    const planPrice = SUBSCRIPTION_PLANS[tier as "pro" | "enterprise"].price

    // Create payment intent
    const intentResult = await createPaymentIntent(planPrice, "usd", customerId, {
      userId: user.id,
      tier,
      userEmail: user.email,
    })

    if (!intentResult.success) {
      return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
    }

    // Record payment attempt
    await prisma.paymentAttempt.create({
      data: {
        userId: user.id,
        conversationId: "", // Empty for subscription payments
        amount: planPrice * 100,
        currency: "usd",
        status: "pending",
        stripePaymentIntentId: intentResult.intentId,
        metadata: { tier },
      },
    })

    return NextResponse.json({
      clientSecret: intentResult.clientSecret,
      intentId: intentResult.intentId,
      customerId,
    })
  } catch (error) {
    console.error("[v0] Payment intent creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
