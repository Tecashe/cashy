"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Types
export type CustomerFilter = {
  search?: string
  tags?: string[]
  status?: string[]
  category?: string[]
  isVip?: boolean
  unreadOnly?: boolean
  starredOnly?: boolean
  dateRange?: { start: Date; end: Date }
  sortBy?: "recent" | "oldest" | "mostMessages" | "priority"
}

export type CustomerSegment = "all" | "vip" | "active" | "inactive" | "high_value" | "at_risk"

// Get all customers with comprehensive data
export async function getCustomers(filter: CustomerFilter = {}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  // Build where clause
  const where: any = {
    userId: user.id,
    isArchived: false,
  }

  // Search by name or username
  if (filter.search) {
    where.OR = [
      { participantName: { contains: filter.search, mode: "insensitive" } },
      { participantUsername: { contains: filter.search, mode: "insensitive" } },
    ]
  }

  // Filter by tags
  if (filter.tags && filter.tags.length > 0) {
    where.conversationTags = {
      some: {
        tagId: { in: filter.tags },
      },
    }
  }

  // Filter by status
  if (filter.status && filter.status.length > 0) {
    where.status = { in: filter.status }
  }

  // Filter by category
  if (filter.category && filter.category.length > 0) {
    where.category = { in: filter.category }
  }

  // VIP filter
  if (filter.isVip !== undefined) {
    where.isVip = filter.isVip
  }

  // Unread only
  if (filter.unreadOnly) {
    where.unreadCount = { gt: 0 }
  }

  // Starred only
  if (filter.starredOnly) {
    where.starred = true
  }

  // Date range
  if (filter.dateRange) {
    where.firstContactAt = {
      gte: filter.dateRange.start,
      lte: filter.dateRange.end,
    }
  }

  // Sorting
  let orderBy: any = { lastMessageAt: "desc" }
  if (filter.sortBy === "oldest") {
    orderBy = { firstContactAt: "asc" }
  } else if (filter.sortBy === "mostMessages") {
    orderBy = { messages: { _count: "desc" } }
  } else if (filter.sortBy === "priority") {
    orderBy = { priorityScore: "desc" }
  }

  const conversations = await prisma.conversation.findMany({
    where,
    include: {
      conversationTags: {
        include: { tag: true },
      },
      messages: {
        select: { id: true },
      },
      instagramAccount: {
        select: { username: true },
      },
      _count: {
        select: { messages: true },
      },
    },
    orderBy,
  })

  // Calculate customer metrics
  const customers = conversations.map((conv) => {
    const messageCount = conv._count.messages
    const daysSinceFirstContact = Math.floor(
      (Date.now() - conv.firstContactAt.getTime()) / (1000 * 60 * 60 * 24)
    )
    const daysSinceLastMessage = conv.lastMessageAt
      ? Math.floor((Date.now() - conv.lastMessageAt.getTime()) / (1000 * 60 * 60 * 24))
      : 999

    // Calculate engagement score (0-100)
    let engagementScore = 0
    if (messageCount > 0) {
      engagementScore += Math.min(messageCount * 5, 40) // Up to 40 points for messages
      engagementScore += Math.max(0, 30 - daysSinceLastMessage) // Up to 30 points for recency
      engagementScore += conv.isVip ? 20 : 0 // 20 points for VIP
      engagementScore += conv.starred ? 10 : 0 // 10 points for starred
    }

    return {
      id: conv.id,
      participantId: conv.participantId,
      participantName: conv.participantName,
      participantUsername: conv.participantUsername,
      participantAvatar: conv.participantAvatar,
      lastMessageText: conv.lastMessageText,
      lastMessageAt: conv.lastMessageAt,
      firstContactAt: conv.firstContactAt,
      unreadCount: conv.unreadCount,
      isVip: conv.isVip,
      starred: conv.starred,
      status: conv.status,
      category: conv.category,
      priorityScore: conv.priorityScore,
      messageCount,
      tags: conv.conversationTags.map((ct) => ({
        id: ct.tag.id,
        name: ct.tag.name,
        color: ct.tag.color,
      })),
      engagementScore: Math.min(Math.round(engagementScore), 100),
      daysSinceFirstContact,
      daysSinceLastMessage,
      connectedAccount: conv.instagramAccount.username,
    }
  })

  return customers
}

// Get single customer with full details
export async function getCustomerProfile(conversationId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId: user.id,
    },
    include: {
      messages: {
        orderBy: { timestamp: "desc" },
        take: 100,
      },
      conversationTags: {
        include: { tag: true },
      },
      internalNotes: {
        orderBy: { createdAt: "desc" },
      },
      reminders: {
        where: { isCompleted: false },
        orderBy: { remindAt: "asc" },
      },
      instagramAccount: true,
    },
  })

  if (!conversation) throw new Error("Customer not found")

  // Calculate conversation statistics
  const totalMessages = conversation.messages.length
  const customerMessages = conversation.messages.filter((m) => !m.isFromUser).length
  const businessMessages = conversation.messages.filter((m) => m.isFromUser).length
  const aiMessages = conversation.messages.filter((m) => m.sentByAI).length
  const automationMessages = conversation.messages.filter((m) => m.sentByAutomation).length

  // Calculate response times
  const responseTimes: number[] = []
  for (let i = 1; i < conversation.messages.length; i++) {
    const current = conversation.messages[i]
    const previous = conversation.messages[i - 1]
    
    if (current.isFromUser && !previous.isFromUser) {
      const timeDiff = current.timestamp.getTime() - previous.timestamp.getTime()
      responseTimes.push(Math.round(timeDiff / 1000 / 60)) // minutes
    }
  }

  const avgResponseTime =
    responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0

  // Analyze message patterns
  const messagesByDay = new Map<string, number>()
  conversation.messages.forEach((msg) => {
    const day = msg.timestamp.toISOString().split("T")[0]
    messagesByDay.set(day, (messagesByDay.get(day) || 0) + 1)
  })

  const activityData = Array.from(messagesByDay.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Calculate engagement metrics
  const daysSinceFirstContact = Math.floor(
    (Date.now() - conversation.firstContactAt.getTime()) / (1000 * 60 * 60 * 24)
  )
  const daysSinceLastMessage = conversation.lastMessageAt
    ? Math.floor((Date.now() - conversation.lastMessageAt.getTime()) / (1000 * 60 * 60 * 24))
    : 999

  return {
    id: conversation.id,
    participantId: conversation.participantId,
    participantName: conversation.participantName,
    participantUsername: conversation.participantUsername,
    participantAvatar: conversation.participantAvatar,
    lastMessageAt: conversation.lastMessageAt,
    firstContactAt: conversation.firstContactAt,
    isVip: conversation.isVip,
    starred: conversation.starred,
    status: conversation.status,
    category: conversation.category,
    priorityScore: conversation.priorityScore,
    notes: conversation.notes,
    tags: conversation.conversationTags.map((ct) => ct.tag),
    internalNotes: conversation.internalNotes,
    reminders: conversation.reminders,
    connectedAccount: conversation.instagramAccount,
    statistics: {
      totalMessages,
      customerMessages,
      businessMessages,
      aiMessages,
      automationMessages,
      avgResponseTime,
      daysSinceFirstContact,
      daysSinceLastMessage,
    },
    activityData,
    messages: conversation.messages,
  }
}

// Update customer details
export async function updateCustomer(
  conversationId: string,
  data: {
    isVip?: boolean
    starred?: boolean
    status?: string
    category?: string
    priorityScore?: number
    notes?: string
  }
) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: user.id },
  })

  if (!conversation) throw new Error("Customer not found")

  await prisma.conversation.update({
    where: { id: conversationId },
    data,
  })

  revalidatePath("/customers")
  revalidatePath(`/customers/${conversationId}`)
  return { success: true }
}

// Add internal note
export async function addInternalNote(conversationId: string, content: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: user.id },
  })

  if (!conversation) throw new Error("Customer not found")

  await prisma.internalNote.create({
    data: {
      conversationId,
      userId: user.id,
      content,
      mentions: [],
    },
  })

  revalidatePath(`/customers/${conversationId}`)
  return { success: true }
}

// Add reminder
export async function addReminder(conversationId: string, message: string, remindAt: Date) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: user.id },
  })

  if (!conversation) throw new Error("Customer not found")

  await prisma.reminder.create({
    data: {
      conversationId,
      userId: user.id,
      message,
      remindAt,
    },
  })

  revalidatePath(`/customers/${conversationId}`)
  return { success: true }
}

// Get customer segments with counts
export async function getCustomerSegments() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [total, vip, active, inactive, highValue, atRisk, unread, starred] = await Promise.all([
    // Total customers
    prisma.conversation.count({
      where: { userId: user.id, isArchived: false },
    }),
    // VIP customers
    prisma.conversation.count({
      where: { userId: user.id, isArchived: false, isVip: true },
    }),
    // Active (messaged in last 7 days)
    prisma.conversation.count({
      where: {
        userId: user.id,
        isArchived: false,
        lastMessageAt: { gte: sevenDaysAgo },
      },
    }),
    // Inactive (no message in 30+ days)
    prisma.conversation.count({
      where: {
        userId: user.id,
        isArchived: false,
        lastMessageAt: { lt: thirtyDaysAgo },
      },
    }),
    // High value (priority > 70)
    prisma.conversation.count({
      where: {
        userId: user.id,
        isArchived: false,
        priorityScore: { gte: 70 },
      },
    }),
    // At risk (was active but no message in 14+ days)
    prisma.conversation.count({
      where: {
        userId: user.id,
        isArchived: false,
        lastMessageAt: {
          gte: thirtyDaysAgo,
          lt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    // Unread
    prisma.conversation.count({
      where: {
        userId: user.id,
        isArchived: false,
        unreadCount: { gt: 0 },
      },
    }),
    // Starred
    prisma.conversation.count({
      where: {
        userId: user.id,
        isArchived: false,
        starred: true,
      },
    }),
  ])

  return {
    all: total,
    vip,
    active,
    inactive,
    high_value: highValue,
    at_risk: atRisk,
    unread,
    starred,
  }
}

// Bulk operations
export async function bulkUpdateCustomers(
  conversationIds: string[],
  action: "add_tag" | "remove_tag" | "set_vip" | "set_status" | "set_category" | "archive",
  value?: any
) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  // Verify all conversations belong to user
  const conversations = await prisma.conversation.findMany({
    where: {
      id: { in: conversationIds },
      userId: user.id,
    },
  })

  if (conversations.length !== conversationIds.length) {
    throw new Error("Some customers not found")
  }

  switch (action) {
    case "add_tag":
      for (const convId of conversationIds) {
        await prisma.conversationTag.upsert({
          where: {
            conversationId_tagId: {
              conversationId: convId,
              tagId: value,
            },
          },
          create: {
            conversationId: convId,
            tagId: value,
          },
          update: {},
        })
      }
      break

    case "remove_tag":
      await prisma.conversationTag.deleteMany({
        where: {
          conversationId: { in: conversationIds },
          tagId: value,
        },
      })
      break

    case "set_vip":
      await prisma.conversation.updateMany({
        where: { id: { in: conversationIds } },
        data: { isVip: value },
      })
      break

    case "set_status":
      await prisma.conversation.updateMany({
        where: { id: { in: conversationIds } },
        data: { status: value },
      })
      break

    case "set_category":
      await prisma.conversation.updateMany({
        where: { id: { in: conversationIds } },
        data: { category: value },
      })
      break

    case "archive":
      await prisma.conversation.updateMany({
        where: { id: { in: conversationIds } },
        data: { isArchived: true },
      })
      break
  }

  revalidatePath("/customers")
  return { success: true, updated: conversationIds.length }
}