import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { getTransactionStatus } from "@/lib/pesapal"
import { upgradeSubscription } from "@/lib/subscription-context"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderTrackingId, tier } = await request.json()

    if (!orderTrackingId || !tier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get transaction status from Pesapal
    const status = await getTransactionStatus(orderTrackingId)

    // Status code 1 = COMPLETED
    if (status.status_code !== 1) {
      return NextResponse.json({ error: "Payment not completed", status: status.payment_status_description }, { status: 400 })
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
      where: { stripePaymentIntentId: orderTrackingId },
      data: {
        status: "succeeded",
        completedAt: new Date(),
      },
    })

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
    console.error("[Pesapal] Payment confirmation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
