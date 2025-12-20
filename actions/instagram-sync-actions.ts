"use server"

import { prisma } from "@/lib/db"
import { InstagramAPI } from "@/lib/instagram-api"
import { revalidatePath } from "next/cache"

export async function syncInstagramUserProfile(conversationId: string) {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        instagramAccount: true,
      },
    })

    if (!conversation) {
      return { success: false, error: "Conversation not found" }
    }

    // If we already have participant data, skip
    if (conversation.participantName && conversation.participantAvatar) {
      return { success: true, alreadySynced: true }
    }

    const api = new InstagramAPI({
      accessToken: conversation.instagramAccount.accessToken,
      instagramId: conversation.instagramAccount.instagramId,
      pageId: conversation.instagramAccount.instagramPageId || undefined,
    })

    try {
      // Try to get user profile from Instagram
      const profile = await api.getProfile()

      // Update conversation with real Instagram data
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          participantName: profile.name || profile.username,
          participantAvatar: profile.profile_picture_url || null,
          participantUsername: profile.username,
        },
      })

      revalidatePath("/inbox")
      return { success: true, profile }
    } catch (apiError: any) {
      console.error("[v0] Instagram API error:", apiError)
      // If API fails, at least set a default name
      if (!conversation.participantName) {
        await prisma.conversation.update({
          where: { id: conversationId },
          data: {
            participantName: conversation.participantUsername || "Instagram User",
          },
        })
      }
      return { success: true, error: "Could not fetch Instagram profile, using defaults" }
    }
  } catch (error) {
    console.error("[v0] Error syncing Instagram profile:", error)
    return { success: false, error: "Failed to sync profile data" }
  }
}

export async function batchSyncInstagramProfiles(userId: string, instagramAccountId: string) {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        userId,
        instagramAccountId,
        OR: [{ participantName: "" }, { participantName: "Unknown" }, { participantAvatar: null }],
      },
      take: 50,
      include: {
        instagramAccount: true,
      },
    })

    let syncedCount = 0
    let failedCount = 0

    for (const conversation of conversations) {
      const result = await syncInstagramUserProfile(conversation.id)
      if (result.success) {
        syncedCount++
      } else {
        failedCount++
      }
    }

    revalidatePath("/inbox")
    return { success: true, syncedCount, failedCount }
  } catch (error) {
    console.error("[v0] Error batch syncing profiles:", error)
    return { success: false, error: "Failed to batch sync profiles" }
  }
}
