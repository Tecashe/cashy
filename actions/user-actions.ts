"use server"

import { prisma } from "@/lib/db"

export async function getUserSubscriptionTier(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { subscriptionTier: true },
    })

    return {
      success: true,
      tier: (user?.subscriptionTier as "free" | "pro" | "enterprise") || "free",
    }
  } catch (error) {
    console.error("[v0] Error fetching user subscription tier:", error)
    return { success: false, tier: "free" as const }
  }
}
