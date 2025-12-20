"use server"

import { prisma } from "@/lib/db"
import { InstagramAPI } from "@/lib/instagram-api"
import { revalidatePath } from "next/cache"

export async function debugConversationData(conversationId: string) {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        instagramAccount: true,
        messages: {
          orderBy: { createdAt: "asc" },
          take: 5,
        },
      },
    })

    if (!conversation) {
      return { success: false, error: "Conversation not found" }
    }

    console.log("[v0] DEBUG - Conversation Data:")
    console.log({
      participantId: conversation.participantId,
      participantName: conversation.participantName,
      participantUsername: conversation.participantUsername,
      businessAccount: {
        id: conversation.instagramAccount.instagramId,
        username: conversation.instagramAccount.username,
      },
      messageCount: conversation.messages.length,
      sampleMessages: conversation.messages.map((m) => ({
        sender: m.sender,
        isFromUser: m.isFromUser,
        content: m.content.substring(0, 50),
      })),
    })

    return { success: true, data: conversation }
  } catch (error) {
    console.error("[v0] Error debugging conversation:", error)
    return { success: false, error: "Debug failed" }
  }
}

export async function fixConversationParticipants(userId: string, instagramAccountId: string) {
  try {
    // Find conversations where the participant is actually the business account
    const conversations = await prisma.conversation.findMany({
      where: {
        userId,
        instagramAccountId,
      },
      include: {
        instagramAccount: true,
        messages: {
          orderBy: { createdAt: "asc" },
          take: 1,
          where: {
            isFromUser: true, // Get first customer message
          },
        },
      },
    })

    console.log(`[v0] Found ${conversations.length} conversations to check`)

    let fixedCount = 0
    let errorCount = 0

    for (const conversation of conversations) {
      // Check if participant is actually the business account (WRONG!)
      const isBusinessAccount =
        conversation.participantId === conversation.instagramAccount.instagramId ||
        conversation.participantUsername === conversation.instagramAccount.username

      if (isBusinessAccount) {
        console.log(`[v0] Conversation ${conversation.id} has WRONG participant data - it's the business account!`)

        // Try to fix from Instagram API
        const api = new InstagramAPI({
          accessToken: conversation.instagramAccount.accessToken,
          instagramId: conversation.instagramAccount.instagramId,
          pageId: conversation.instagramAccount.instagramPageId || undefined,
        })

        try {
          // Get the actual Instagram conversation
          const igConversations = await api.getConversations(50)

          // Find matching conversation and get the OTHER participant (the customer)
          const matchingConversation = igConversations.data?.find((c: any) => {
            // The conversation should have 2 participants: business and customer
            return c.participants?.some(
              (p: any) => p.id !== conversation.instagramAccount.instagramId, // Find the one that's NOT us
            )
          })

          if (matchingConversation) {
            // Get the customer (not the business)
            const customerParticipant = matchingConversation.participants.find(
              (p: any) => p.id !== conversation.instagramAccount.instagramId,
            )

            if (customerParticipant) {
              // Try to get customer profile
              try {
                const customerProfile = await api.getProfile()

                await prisma.conversation.update({
                  where: { id: conversation.id },
                  data: {
                    participantId: customerParticipant.id,
                    participantUsername: customerProfile.username || customerParticipant.username || "unknown",
                    participantName: customerProfile.name || customerProfile.username || "Customer",
                    participantAvatar: customerProfile.profile_picture_url || null,
                  },
                })

                console.log(`[v0] Fixed conversation ${conversation.id} with real customer data`)
                fixedCount++
              } catch {
                // Fallback: use participant data without full profile
                await prisma.conversation.update({
                  where: { id: conversation.id },
                  data: {
                    participantId: customerParticipant.id,
                    participantUsername: customerParticipant.username || "unknown",
                    participantName: customerParticipant.username || "Customer",
                  },
                })

                console.log(`[v0] Fixed conversation ${conversation.id} with basic customer data`)
                fixedCount++
              }
            }
          }
        } catch (apiError) {
          console.error(`[v0] Failed to fix conversation ${conversation.id}:`, apiError)
          errorCount++
        }
      }
    }

    revalidatePath("/inbox")

    return {
      success: true,
      message: `Fixed ${fixedCount} conversations, ${errorCount} errors`,
      fixedCount,
      errorCount,
    }
  } catch (error) {
    console.error("[v0] Error fixing conversations:", error)
    return { success: false, error: "Failed to fix conversations" }
  }
}

export async function createConversationFromInstagramMessage(params: {
  userId: string
  instagramAccountId: string
  customerInstagramId: string
  customerUsername?: string
  messageContent: string
  messageId: string
}) {
  try {
    const { userId, instagramAccountId, customerInstagramId, customerUsername, messageContent, messageId } = params

    // Check if conversation already exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        userId,
        instagramAccountId,
        participantId: customerInstagramId,
      },
    })

    if (conversation) {
      // Add message to existing conversation
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          content: messageContent,
          sender: "customer",
          isFromUser: true, // Customer sent this
          timestamp: new Date(),
        },
      })

      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageAt: new Date(),
          lastMessageText: messageContent,
          lastCustomerMessageAt: new Date(), // Update for 24hr window
          isRead: false,
          unreadCount: { increment: 1 },
        },
      })

      return { success: true, conversation, isNew: false }
    }

    // Create new conversation with CUSTOMER as participant
    const instagramAccount = await prisma.instagramAccount.findUnique({
      where: { id: instagramAccountId },
    })

    if (!instagramAccount) {
      return { success: false, error: "Instagram account not found" }
    }

    // Try to get customer profile
    const api = new InstagramAPI({
      accessToken: instagramAccount.accessToken,
      instagramId: instagramAccount.instagramId,
      pageId: instagramAccount.instagramPageId || undefined,
    })

    let customerName = customerUsername || "Customer"
    let customerAvatar: string | null = null

    try {
      const profile = await api.getProfile()
      customerName = profile.name || profile.username
      customerAvatar = profile.profile_picture_url || null
    } catch {
      console.log("[v0] Could not fetch customer profile, using defaults")
    }

    // Create conversation with CUSTOMER data (not business!)
    conversation = await prisma.conversation.create({
      data: {
        userId,
        instagramAccountId,
        participantId: customerInstagramId, // CUSTOMER'S Instagram ID
        participantUsername: customerUsername || "unknown",
        participantName: customerName,
        participantAvatar: customerAvatar,
        lastMessageAt: new Date(),
        lastMessageText: messageContent,
        lastCustomerMessageAt: new Date(), // Customer initiated
        isRead: false,
        unreadCount: 1,
        messages: {
          create: {
            content: messageContent,
            sender: "customer",
            isFromUser: true, // Customer message
            timestamp: new Date(),
          },
        },
      },
    })

    revalidatePath("/inbox")

    return { success: true, conversation, isNew: true }
  } catch (error) {
    console.error("[v0] Error creating conversation:", error)
    return { success: false, error: "Failed to create conversation" }
  }
}
