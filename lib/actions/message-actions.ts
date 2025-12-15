"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { InstagramAPI } from "@/lib/instagram-api"
import { generateAIResponse } from "@/lib/ai-response-generator"

export async function sendMessage(conversationId: string, content: string, useAI = false) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: user.id },
    include: { instagramAccount: true },
  })
  if (!conversation) throw new Error("Conversation not found")

  let messageContent = content

  if (useAI && user.aiEnabled) {
    const recentMessages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: "desc" },
      take: 10,
    })

    messageContent = await generateAIResponse({
      businessDescription: user.businessDescription || "",
      aiInstructions: user.aiInstructions || "",
      aiTone: user.aiTone || "professional",
      conversationHistory: recentMessages.map((m) => ({
        role: m.sender === "user" ? "assistant" : "user",
        content: m.content,
      })),
      currentMessage: content,
      customerName: conversation.participantName,
      customerUsername: conversation.participantUsername,
    })
  }

  try {
    const api = new InstagramAPI({
      accessToken: conversation.instagramAccount.accessToken,
      instagramId: conversation.instagramAccount.instagramId,
    })

    await api.sendMessage(conversation.participantId, messageContent)

    const message = await prisma.message.create({
      data: {
        conversationId,
        content: messageContent,
        sender: "user",
        isRead: true,
        messageType: "text",
        sentByAI: useAI && user.aiEnabled,
      },
    })

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageText: messageContent,
        lastMessageAt: new Date(),
        needsHumanReview: false,
      },
    })

    revalidatePath(`/conversations/${conversationId}`)
    return message
  } catch (error) {
    console.error("[Message] Send failed:", error)
    throw new Error("Failed to send message")
  }
}

export async function getMessages(conversationId: string, limit = 50) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: user.id },
  })
  if (!conversation) throw new Error("Conversation not found")

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { timestamp: "asc" },
    take: limit,
  })

  return messages
}

export async function markMessagesAsRead(conversationId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: user.id },
  })
  if (!conversation) throw new Error("Conversation not found")

  await prisma.message.updateMany({
    where: { conversationId, isRead: false },
    data: { isRead: true },
  })

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { unreadCount: 0 },
  })

  revalidatePath(`/conversations/${conversationId}`)
  return { success: true }
}
