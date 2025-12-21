"use server"

import { prisma } from "@/lib/db"
import { InstagramAPI } from "@/lib/instagram-api"
import { revalidatePath } from "next/cache"

export async function autoSyncConversationParticipant(conversationId: string) {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        instagramAccount: true,
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!conversation) {
      return { success: false, error: "Conversation not found" }
    }

    const api = new InstagramAPI({
      accessToken: conversation.instagramAccount.accessToken,
      instagramId: conversation.instagramAccount.instagramId,
      pageId: conversation.instagramAccount.instagramPageId || undefined,
    })

    // Get all conversations from Instagram to find the matching one
    const instagramConversations = await api.getConversations(50)

    const matchingConversation = instagramConversations.data?.find((c: any) =>
      c.participants?.some((p: any) => p.id === conversation.participantId),
    )

    if (matchingConversation) {
      // Find the participant that is NOT the business account
      const customerParticipant = matchingConversation.participants?.find(
        (p: any) => p.id !== conversation.instagramAccount.instagramId,
      )

      if (customerParticipant) {
        console.log("[v0] Found customer participant:", customerParticipant)

        // Fetch full profile details for the customer
        try {
          const customerApi = new InstagramAPI({
            accessToken: conversation.instagramAccount.accessToken,
            instagramId: customerParticipant.id,
            pageId: conversation.instagramAccount.instagramPageId || undefined,
          })

          const customerProfile = await customerApi.getProfile()

          // Update conversation with correct customer data
          await prisma.conversation.update({
            where: { id: conversationId },
            data: {
              participantId: customerProfile.id,
              participantName: customerProfile.name || customerProfile.username,
              participantUsername: customerProfile.username,
              participantAvatar: customerProfile.profile_picture_url || null,
            },
          })

          console.log("[v0] Successfully synced customer profile:", customerProfile.username)
          revalidatePath("/inbox")
          return { success: true, participant: customerProfile }
        } catch (profileError) {
          console.log("[v0] Could not fetch full profile, using basic participant data")

          // Fallback: use basic participant data from conversation
          await prisma.conversation.update({
            where: { id: conversationId },
            data: {
              participantId: customerParticipant.id,
              participantName: customerParticipant.username || "Instagram User",
              participantUsername: customerParticipant.username || "",
              participantAvatar: null,
            },
          })

          revalidatePath("/inbox")
          return { success: true, participant: customerParticipant }
        }
      }
    }

    // If we couldn't find the conversation on Instagram, return error
    console.error("[v0] Could not find matching conversation on Instagram")
    return {
      success: false,
      error: "Could not find conversation on Instagram. The conversation may have been deleted.",
    }
  } catch (error: any) {
    console.error("[v0] Error auto-syncing participant:", error)
    return { success: false, error: error.message || "Failed to sync participant data" }
  }
}

export async function batchSyncAllConversations(userId: string, instagramAccountId: string) {
  try {
    console.log("[v0] Starting batch sync for all conversations...")

    const conversations = await prisma.conversation.findMany({
      where: {
        userId,
        instagramAccountId,
      },
      take: 50,
    })

    console.log(`[v0] Found ${conversations.length} conversations to sync`)

    let syncedCount = 0
    let failedCount = 0

    for (const conversation of conversations) {
      const result = await autoSyncConversationParticipant(conversation.id)
      if (result.success) {
        syncedCount++
      } else {
        failedCount++
      }
    }

    console.log(`[v0] Sync complete: ${syncedCount} synced, ${failedCount} failed`)
    revalidatePath("/inbox")
    return { success: true, syncedCount, failedCount }
  } catch (error) {
    console.error("[v0] Error batch syncing conversations:", error)
    return { success: false, error: "Failed to batch sync" }
  }
}

export { autoSyncConversationParticipant as autoSyncConversationFromInstagram }
