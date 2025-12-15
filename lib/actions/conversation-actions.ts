"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getConversations(filter?: {
  archived?: boolean
  needsHumanReview?: boolean
  tagId?: string
}) {
  const { userId } = await auth()
  if (!userId) return []

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return []

  const where: any = { userId: user.id }

  if (filter?.archived !== undefined) {
    where.isArchived = filter.archived
  }

  if (filter?.needsHumanReview !== undefined) {
    where.needsHumanReview = filter.needsHumanReview
  }

  let conversations = await prisma.conversation.findMany({
    where,
    include: {
      conversationTags: {
        include: { tag: true },
      },
      instagramAccount: true,
      _count: {
        select: { messages: true },
      },
    },
    orderBy: { lastMessageAt: "desc" },
  })

  if (filter?.tagId) {
    conversations = conversations.filter((c) => c.conversationTags.some((ct) => ct.tagId === filter.tagId))
  }

  return conversations
}

export async function getConversation(conversationId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: user.id },
    include: {
      conversationTags: {
        include: { tag: true },
      },
      instagramAccount: true,
      messages: {
        orderBy: { timestamp: "asc" },
        take: 50,
      },
    },
  })

  if (!conversation) throw new Error("Conversation not found")
  return conversation
}

export async function archiveConversation(conversationId: string, archive = true) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: user.id },
  })
  if (!conversation) throw new Error("Conversation not found")

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { isArchived: archive },
  })

  revalidatePath("/conversations")
  return { success: true }
}

export async function markForHumanReview(conversationId: string, reason?: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: user.id },
  })
  if (!conversation) throw new Error("Conversation not found")

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      needsHumanReview: true,
      handoffReason: reason,
      unreadCount: conversation.unreadCount + 1,
    },
  })

  revalidatePath("/conversations")
  revalidatePath(`/conversations/${conversationId}`)
  return { success: true }
}
