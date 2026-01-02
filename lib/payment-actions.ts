"use server"

import { prisma } from "@/lib/db"

export async function getPaymentMethods(userId: string) {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        // type: true,
        brand: true,
        last4: true,
        expiryMonth: true,
        expiryYear: true,
        isDefault: true,
        createdAt: true,
      },
    })

    return { success: true, data: paymentMethods }
  } catch (error) {
    console.error("[v0] Error fetching payment methods:", error)
    return { success: false, data: [] }
  }
}

export async function setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
  try {
    await prisma.paymentMethod.updateMany({
      where: { userId },
      data: { isDefault: false },
    })

    await prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: { isDefault: true },
    })

    return { success: true }
  } catch (error) {
    console.error("[v0] Error setting default payment method:", error)
    return { success: false }
  }
}

export async function deletePaymentMethod(userId: string, paymentMethodId: string) {
  try {
    await prisma.paymentMethod.delete({
      where: {
        id: paymentMethodId,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting payment method:", error)
    return { success: false }
  }
}

export async function getPaymentHistory(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) return { success: false, data: [] }

    const payments = await prisma.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        description: true,
        stripePaymentIntentId: true,
        createdAt: true,
      },
    })

    return { success: true, data: payments }
  } catch (error) {
    console.error("[v0] Error fetching payment history:", error)
    return { success: false, data: [] }
  }
}

export async function getSubscriptionDetails(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        subscriptionTier: true,
        email: true,
      },
    })

    if (!user) return { success: false, data: null }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        status: true,
        currentPeriodStart: true,
        currentPeriodEnd: true,
        cancelAtPeriodEnd: true,
        canceledAt: true,
        tier: true,
      },
    })

    return { success: true, data: { user, subscription } }
  } catch (error) {
    console.error("[v0] Error fetching subscription details:", error)
    return { success: false, data: null }
  }
}

export async function getBillingStats(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) return { success: false, data: null }

    const [totalSpent, paymentCount, upcomingCharge] = await Promise.all([
      prisma.payment.aggregate({
        where: { userId: user.id, status: "succeeded" },
        _sum: { amount: true },
      }),
      prisma.payment.count({
        where: { userId: user.id },
      }),
      prisma.payment.findFirst({
        where: { userId: user.id, status: "pending" },
        orderBy: { createdAt: "desc" },
      }),
    ])

    return {
      success: true,
      data: {
        totalSpent: totalSpent._sum.amount || 0,
        paymentCount,
        upcomingCharge: upcomingCharge?.amount || null,
      },
    }
  } catch (error) {
    console.error("[v0] Error fetching billing stats:", error)
    return { success: false, data: null }
  }
}
