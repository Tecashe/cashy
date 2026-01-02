"use server"

import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

export type SubscriptionTier = "free" | "pro" | "enterprise"

export interface SubscriptionResponse {
  success: boolean
  tier: SubscriptionTier
  status?: string
  error?: string
}

export async function getUserSubscriptionTier(userId: string): Promise<SubscriptionResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
      },
    })

    return {
      success: true,
      tier: (user?.subscriptionTier as SubscriptionTier) || "free",
      status: user?.subscriptionStatus || "active",
    }
  } catch (error) {
    console.error("[v0] Error fetching user subscription tier:", error)
    return { success: false, tier: "free" as const }
  }
}

export async function checkUserSubscription(requiredTier: SubscriptionTier): Promise<boolean> {
  try {
    const { userId } = await auth()
    if (!userId) return false

    const response = await getUserSubscriptionTier(userId)
    const tiers = ["free", "pro", "enterprise"]
    const currentTierIndex = tiers.indexOf(response.tier)
    const requiredTierIndex = tiers.indexOf(requiredTier)

    return currentTierIndex >= requiredTierIndex
  } catch (error) {
    console.error("[v0] Error checking subscription:", error)
    return false
  }
}

export async function upgradeSubscription(
  userId: string,
  newTier: SubscriptionTier,
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        subscriptionTier: newTier,
        subscriptionStatus: "active",
        updatedAt: new Date(),
      },
    })

    console.log(`[v0] User ${userId} upgraded to ${newTier}`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error upgrading subscription:", error)
    return {
      success: false,
      error: "Failed to upgrade subscription",
    }
  }
}

export async function getSavedPaymentMethods(userId: string) {
  try {
    const methods = await prisma.paymentMethod.findMany({
      where: { userId },
      select: {
        id: true,
        stripePaymentMethodId: true,
        last4: true,
        brand: true,
        expiryMonth: true,
        expiryYear: true,
        isDefault: true,
        createdAt: true,
      },
      orderBy: { isDefault: "desc" },
    })

    return { success: true, methods }
  } catch (error) {
    console.error("[v0] Error fetching payment methods:", error)
    return { success: false, methods: [] }
  }
}
