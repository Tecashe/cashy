"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
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








export async function onBoardUser() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { status: 401, data: null }
    }

    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    // If user doesn't exist, create them
    if (!user) {
      const client = await clerkClient()
      const clerkUser = await client.users.getUser(userId)

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          firstName: clerkUser.firstName || null,
          lastName: clerkUser.lastName || null,
          imageUrl: clerkUser.imageUrl || null,
        },
      })

      // Create free tier subscription for new user
      // await prisma.subscription.create({
      //   data: {
      //     userId: user.id,
      //     tier: "free",
      //     status: "active",
      //   },
      // })

      return {
        status: 201,
        data: {
          id: user.id,
          firstname: user.firstName,
          lastname: user.lastName,
        },
      }
    }

    // User exists
    return {
      status: 200,
      data: {
        id: user.id,
        firstname: user.firstName,
        lastname: user.lastName,
      },
    }
  } catch (error) {
    console.error("Error onboarding user:", error)
    return { status: 500, data: null }
  }
}