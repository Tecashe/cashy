import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/db"
import { getTransactionStatus } from "@/lib/pesapal"

/**
 * Pesapal IPN (Instant Payment Notification) handler.
 * This endpoint is called by Pesapal when a payment status changes.
 * It must be publicly accessible (not behind auth middleware).
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const orderTrackingId = searchParams.get("OrderTrackingId")
        const orderMerchantReference = searchParams.get("OrderMerchantReference")
        const orderNotificationType = searchParams.get("OrderNotificationType")

        if (!orderTrackingId || !orderMerchantReference) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
        }

        console.log(`[Pesapal IPN] Received ${orderNotificationType} for order ${orderTrackingId}`)

        // Get the transaction status from Pesapal
        const status = await getTransactionStatus(orderTrackingId)

        console.log(`[Pesapal IPN] Transaction status: ${status.payment_status_description} (code: ${status.status_code})`)

        // Find the payment attempt by the order tracking ID
        const paymentAttempt = await prisma.paymentAttempt.findFirst({
            where: {
                stripePaymentIntentId: orderTrackingId,
            },
        })

        if (!paymentAttempt) {
            console.error(`[Pesapal IPN] Payment attempt not found for order ${orderTrackingId}`)
            return NextResponse.json({ orderTrackingId, status: "received" })
        }

        const metadata = paymentAttempt.metadata as { tier?: string } | null
        const tier = metadata?.tier

        // Status code 1 = COMPLETED
        if (status.status_code === 1 && tier) {
            // Update payment attempt status
            await prisma.paymentAttempt.update({
                where: { id: paymentAttempt.id },
                data: {
                    status: "completed",
                    completedAt: new Date(),
                },
            })

            // Update user's subscription tier
            await prisma.user.update({
                where: { id: paymentAttempt.userId },
                data: {
                    subscriptionTier: tier,
                    subscriptionStatus: "active",
                },
            })

            // Update or create subscription record
            const existingSubscription = await prisma.subscription.findUnique({
                where: { userId: paymentAttempt.userId },
            })

            const now = new Date()
            const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

            if (existingSubscription) {
                await prisma.subscription.update({
                    where: { userId: paymentAttempt.userId },
                    data: {
                        tier,
                        status: "active",
                        currentPeriodStart: now,
                        currentPeriodEnd: periodEnd,
                        pesapalOrderTrackingId: orderTrackingId,
                    },
                })
            } else {
                await prisma.subscription.create({
                    data: {
                        userId: paymentAttempt.userId,
                        tier,
                        status: "active",
                        currentPeriodStart: now,
                        currentPeriodEnd: periodEnd,
                        pesapalOrderTrackingId: orderTrackingId,
                    },
                })
            }

            console.log(`[Pesapal IPN] User ${paymentAttempt.userId} upgraded to ${tier}`)
        } else if (status.status_code === 2) {
            // FAILED
            await prisma.paymentAttempt.update({
                where: { id: paymentAttempt.id },
                data: { status: "failed" },
            })
            console.log(`[Pesapal IPN] Payment failed for order ${orderTrackingId}`)
        } else if (status.status_code === 3) {
            // REVERSED
            await prisma.paymentAttempt.update({
                where: { id: paymentAttempt.id },
                data: { status: "reversed" },
            })
            console.log(`[Pesapal IPN] Payment reversed for order ${orderTrackingId}`)
        }

        return NextResponse.json({ orderTrackingId, status: "received" })
    } catch (error) {
        console.error("[Pesapal IPN] Error:", error)
        return NextResponse.json({ error: "IPN processing error" }, { status: 500 })
    }
}
