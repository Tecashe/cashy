"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function sendMessage(conversationId: string, content: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  // Verify conversation ownership
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: user.id },
    include: { instagramAccount: true },
  })

  if (!conversation) throw new Error("Conversation not found")

  // TODO: Send message via Instagram API
  // const instagramResponse = await fetch(
  //   `https://graph.instagram.com/v21.0/${conversation.participantId}/messages`,
  //   {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${conversation.instagramAccount.accessToken}`,
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       recipient: { id: conversation.participantId },
  //       message: { text: content }
  //     })
  //   }
  // )

  // Save message to database
  const message = await prisma.message.create({
    data: {
      conversationId,
      content,
      sender: "user",
      isRead: true,
      messageType: "text",
    },
  })

  // Update conversation
  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      lastMessageText: content,
      lastMessageAt: new Date(),
    },
  })

  revalidatePath("/inbox")
  revalidatePath(`/inbox/${conversationId}`)
  return message
}

export async function getConversations() {
  const { userId } = await auth()
  if (!userId) return []

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return []

  const conversations = await prisma.conversation.findMany({
    where: { userId: user.id, isArchived: false },
    include: {
      messages: {
        orderBy: { timestamp: "desc" },
        take: 1,
      },
      conversationTags: {
        include: { tag: true },
      },
    },
    orderBy: { lastMessageAt: "desc" },
  })

  return conversations
}

export async function getMessages(conversationId: string) {
  const { userId } = await auth()
  if (!userId) return []

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return []

  // Verify ownership
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: user.id },
  })

  if (!conversation) return []

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { timestamp: "asc" },
  })

  return messages
}

export async function addTagToConversation(conversationId: string, tagId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  await prisma.conversationTag.create({
    data: {
      conversationId,
      tagId,
    },
  })

  revalidatePath("/inbox")
  return { success: true }
}

export async function createTag(name: string, color: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const tag = await prisma.tag.create({
    data: {
      userId: user.id,
      name,
      color,
    },
  })

  revalidatePath("/inbox")
  return tag
}

export async function getTags() {
  const { userId } = await auth()
  if (!userId) return []

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return []

  const tags = await prisma.tag.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })

  return tags
}
