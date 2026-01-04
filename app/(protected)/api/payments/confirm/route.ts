import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import stripe from "@/lib/stripe"
import { upgradeSubscription } from "@/lib/subscription-context"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { paymentIntentId, tier, saveCard } = await request.json()

    if (!paymentIntentId || !tier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get payment intent status from Stripe
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (intent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update payment attempt
    await prisma.paymentAttempt.updateMany({
      where: { stripePaymentIntentId: paymentIntentId },
      data: {
        status: "succeeded",
        completedAt: new Date(),
      },
    })

    // Save payment method if requested
    if (saveCard && intent.payment_method) {
      const paymentMethod = await stripe.paymentMethods.retrieve(intent.payment_method as string)

      if (paymentMethod.card) {
        await prisma.paymentMethod.upsert({
          where: {
            stripePaymentMethodId: paymentMethod.id,
          },
          create: {
            userId: user.id,
            stripePaymentMethodId: paymentMethod.id,
            last4: paymentMethod.card.last4,
            brand: paymentMethod.card.brand,
            expiryMonth: paymentMethod.card.exp_month,
            expiryYear: paymentMethod.card.exp_year,
            isDefault: true,
          },
          update: {
            expiryMonth: paymentMethod.card.exp_month,
            expiryYear: paymentMethod.card.exp_year,
          },
        })
      }
    }

    // Upgrade subscription
    const result = await upgradeSubscription(userId, tier)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Subscription upgraded successfully",
    })
  } catch (error) {
    console.error("[v0] Payment confirmation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
