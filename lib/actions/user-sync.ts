// lib/actions/user-sync.ts
"use server"

import { clerkClient } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function syncUserToDatabase(userId: string) {
  try {
    console.log("[User Sync] Syncing user to database:", userId)
    
    // Check if user exists in database first
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (existingUser) {
      console.log("[User Sync] User already exists:", existingUser.id)
      return { success: true, user: existingUser }
    }

    // User doesn't exist, create them
    console.log("[User Sync] User not found, creating new user...")
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)

    console.log("[User Sync] Fetched Clerk user:", {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    })

    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        firstName: clerkUser.firstName || null,
        lastName: clerkUser.lastName || null,
        imageUrl: clerkUser.imageUrl || null,
        subscriptionTier: "free",
        subscriptionStatus: "active",
      },
    })

    console.log("[User Sync] User created successfully:", newUser.id)
    return { success: true, user: newUser }
  } catch (error) {
    console.error("[User Sync] Error syncing user to database:", error)
    return { success: false, error: "Failed to sync user" }
  }
}

export async function getCurrentUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        instagramAccounts: {
          where: { isConnected: true },
        },
      },
    })

    return user
  } catch (error) {
    console.error("[User Sync] Error getting current user:", error)
    return null
  }
}

export async function ensureUserExists(userId: string) {
  try {
    // Try to get user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    // If user doesn't exist, sync them
    if (!user) {
      console.log("[User Sync] User not found, syncing from Clerk...")
      const result = await syncUserToDatabase(userId)
      if (result.success && result.user) {
        user = result.user
      }
    }

    return user
  } catch (error) {
    console.error("[User Sync] Error ensuring user exists:", error)
    return null
  }
}