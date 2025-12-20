// "use server"

// import { prisma } from "@/lib/db"
// import { revalidatePath } from "next/cache"

// export async function getConversations(filters: {
//   userId: string
//   instagramAccountId?: string
//   search?: string
//   category?: string
//   status?: string
//   isVip?: boolean
//   isRead?: boolean
//   starred?: boolean
//   archived?: boolean
//   assignedTo?: string
//   tagIds?: string[]
//   dateRange?: { from: Date; to: Date }
//   sortBy?: "priority" | "recent" | "oldest" | "unread"
//   limit?: number
//   cursor?: string
// }) {
//   try {
//     const where: any = {
//       userId: filters.userId,
//       isArchived: filters.archived ?? false,
//     }

//     if (filters.instagramAccountId) {
//       where.instagramAccountId = filters.instagramAccountId
//     }

//     if (filters.search) {
//       where.OR = [
//         { participantUsername: { contains: filters.search, mode: "insensitive" } },
//         { participantName: { contains: filters.search, mode: "insensitive" } },
//         { lastMessageText: { contains: filters.search, mode: "insensitive" } },
//       ]
//     }

//     if (filters.category) {
//       where.category = filters.category
//     }

//     if (filters.status) {
//       where.status = filters.status
//     }

//     if (filters.isVip !== undefined) {
//       where.isVip = filters.isVip
//     }

//     if (filters.isRead !== undefined) {
//       where.isRead = filters.isRead
//     }

//     if (filters.starred !== undefined) {
//       where.starred = filters.starred
//     }

//     if (filters.assignedTo) {
//       where.assignedToUserId = filters.assignedTo
//     }

//     if (filters.tagIds && filters.tagIds.length > 0) {
//       where.conversationTags = {
//         some: {
//           tagId: { in: filters.tagIds },
//         },
//       }
//     }

//     if (filters.dateRange) {
//       where.lastMessageAt = {
//         gte: filters.dateRange.from,
//         lte: filters.dateRange.to,
//       }
//     }

//     if (filters.cursor) {
//       where.id = { lt: filters.cursor }
//     }

//     // Determine sort order
//     let orderBy: any = { lastMessageAt: "desc" }
//     if (filters.sortBy === "priority") {
//       orderBy = { priorityScore: "desc" }
//     } else if (filters.sortBy === "oldest") {
//       orderBy = { lastMessageAt: "asc" }
//     } else if (filters.sortBy === "unread") {
//       orderBy = [{ isRead: "asc" }, { lastMessageAt: "desc" }]
//     }

//     const conversations = await prisma.conversation.findMany({
//       where,
//       include: {
//         messages: {
//           orderBy: { createdAt: "desc" },
//           take: 1,
//         },
//         conversationTags: {
//           include: {
//             tag: true,
//           },
//         },
//         internalNotes: {
//           orderBy: { createdAt: "desc" },
//           take: 1,
//         },
//         reminders: {
//           where: { isCompleted: false },
//           orderBy: { remindAt: "asc" },
//           take: 1,
//         },
//         _count: {
//           select: {
//             messages: true,
//             internalNotes: true,
//           },
//         },
//       },
//       orderBy,
//       take: filters.limit || 50,
//     })

//     return { success: true, conversations }
//   } catch (error) {
//     console.error("[v0] Error fetching conversations:", error)
//     return { success: false, error: "Failed to fetch conversations", conversations: [] }
//   }
// }

// export async function getConversation(id: string) {
//   try {
//     const conversation = await prisma.conversation.findUnique({
//       where: { id },
//       include: {
//         messages: {
//           orderBy: { createdAt: "asc" },
//         },
//         conversationTags: {
//           include: {
//             tag: true,
//           },
//         },
//         internalNotes: {
//           orderBy: { createdAt: "desc" },
//         },
//         reminders: {
//           where: { isCompleted: false },
//           orderBy: { remindAt: "asc" },
//         },
//         aiSuggestions: {
//           where: {
//             expiresAt: { gt: new Date() },
//           },
//           take: 1,
//         },
//       },
//     })

//     if (!conversation) {
//       return { success: false, error: "Conversation not found" }
//     }

//     // Auto mark as read
//     if (!conversation.isRead) {
//       await prisma.conversation.update({
//         where: { id },
//         data: { isRead: true, unreadCount: 0 },
//       })
//     }

//     return { success: true, conversation }
//   } catch (error) {
//     console.error("[v0] Error fetching conversation:", error)
//     return { success: false, error: "Failed to fetch conversation" }
//   }
// }

// export async function getCustomerHistory(participantId: string, userId: string) {
//   try {
//     const conversations = await prisma.conversation.findMany({
//       where: {
//         participantId,
//         userId,
//       },
//       include: {
//         messages: {
//           take: 1,
//           orderBy: { createdAt: "asc" },
//         },
//         _count: {
//           select: { messages: true },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     })

//     const totalMessages = conversations.reduce((sum, conv) => sum + conv._count.messages, 0)
//     const firstContact = conversations[conversations.length - 1]?.firstContactAt

//     return {
//       success: true,
//       history: {
//         conversationCount: conversations.length,
//         totalMessages,
//         firstContact,
//         conversations: conversations.map((c) => ({
//           id: c.id,
//           firstMessage: c.messages[0]?.content || "",
//           date: c.createdAt,
//           messageCount: c._count.messages,
//         })),
//       },
//     }
//   } catch (error) {
//     console.error("[v0] Error fetching customer history:", error)
//     return { success: false, error: "Failed to fetch customer history" }
//   }
// }

// export async function updateConversationPriority(conversationId: string) {
//   try {
//     const conversation = await prisma.conversation.findUnique({
//       where: { id: conversationId },
//       include: {
//         messages: {
//           orderBy: { createdAt: "desc" },
//           take: 5,
//         },
//       },
//     })

//     if (!conversation) return { success: false }

//     let score = 0
//     let category = "general"

//     // Analyze last 5 messages for keywords
//     const recentMessages = conversation.messages.map((m) => m.content.toLowerCase()).join(" ")

//     // Sales intent keywords (high priority)
//     const salesKeywords = ["price", "buy", "purchase", "order", "cost", "available", "how much", "payment"]
//     if (salesKeywords.some((kw) => recentMessages.includes(kw))) {
//       score += 40
//       category = "sales"
//     }

//     // Support keywords (medium priority)
//     const supportKeywords = ["help", "problem", "issue", "not working", "broken", "error"]
//     if (supportKeywords.some((kw) => recentMessages.includes(kw))) {
//       score += 25
//       category = "support"
//     }

//     // Collaboration keywords
//     const collabKeywords = ["collab", "partnership", "work together", "sponsor", "promote"]
//     if (collabKeywords.some((kw) => recentMessages.includes(kw))) {
//       score += 30
//       category = "collaboration"
//     }

//     // Time-based scoring
//     if (conversation.lastMessageAt) {
//       const hoursSinceLastMessage = (Date.now() - conversation.lastMessageAt.getTime()) / (1000 * 60 * 60)

//       if (hoursSinceLastMessage > 24) score += 20 // Needs follow-up
//       if (hoursSinceLastMessage > 48) score += 30 // Urgent follow-up
//     }

//     // VIP bonus
//     if (conversation.isVip) score += 20

//     // Unread bonus
//     if (!conversation.isRead) score += 15

//     // Cap at 100
//     score = Math.min(score, 100)

//     await prisma.conversation.update({
//       where: { id: conversationId },
//       data: {
//         priorityScore: score,
//         category,
//       },
//     })

//     revalidatePath("/inbox")
//     return { success: true, score, category }
//   } catch (error) {
//     console.error("[v0] Error updating priority:", error)
//     return { success: false, error: "Failed to update priority" }
//   }
// }

// export async function addInternalNote(conversationId: string, userId: string, content: string, mentions: string[]) {
//   try {
//     const note = await prisma.internalNote.create({
//       data: {
//         conversationId,
//         userId,
//         content,
//         mentions,
//       },
//     })

//     revalidatePath(`/inbox/${conversationId}`)
//     return { success: true, note }
//   } catch (error) {
//     console.error("[v0] Error adding note:", error)
//     return { success: false, error: "Failed to add note" }
//   }
// }

// export async function getInternalNotes(conversationId: string) {
//   try {
//     const notes = await prisma.internalNote.findMany({
//       where: { conversationId },
//       orderBy: { createdAt: "desc" },
//     })

//     return { success: true, notes }
//   } catch (error) {
//     console.error("[v0] Error fetching notes:", error)
//     return { success: false, error: "Failed to fetch notes", notes: [] }
//   }
// }

// export async function getMessageTemplates(userId: string, category?: string) {
//   try {
//     const where: any = { userId, isActive: true }
//     if (category) where.category = category

//     const templates = await prisma.messageTemplate.findMany({
//       where,
//       orderBy: { usageCount: "desc" },
//     })

//     return { success: true, templates }
//   } catch (error) {
//     console.error("[v0] Error fetching templates:", error)
//     return { success: false, error: "Failed to fetch templates", templates: [] }
//   }
// }

// export async function createMessageTemplate(
//   userId: string,
//   title: string,
//   content: string,
//   category: string,
//   variables: string[],
// ) {
//   try {
//     const template = await prisma.messageTemplate.create({
//       data: {
//         userId,
//         title,
//         content,
//         category,
//         variables,
//       },
//     })

//     revalidatePath("/inbox")
//     return { success: true, template }
//   } catch (error) {
//     console.error("[v0] Error creating template:", error)
//     return { success: false, error: "Failed to create template" }
//   }
// }

// export async function updateTemplateUsage(templateId: string) {
//   try {
//     await prisma.messageTemplate.update({
//       where: { id: templateId },
//       data: {
//         usageCount: { increment: 1 },
//       },
//     })

//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error updating template usage:", error)
//     return { success: false }
//   }
// }

// export async function deleteMessageTemplate(templateId: string) {
//   try {
//     await prisma.messageTemplate.delete({
//       where: { id: templateId },
//     })

//     revalidatePath("/inbox")
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error deleting template:", error)
//     return { success: false, error: "Failed to delete template" }
//   }
// }

// export async function createReminder(conversationId: string, userId: string, message: string, remindAt: Date) {
//   try {
//     const reminder = await prisma.reminder.create({
//       data: {
//         conversationId,
//         userId,
//         message,
//         remindAt,
//       },
//     })

//     revalidatePath(`/inbox/${conversationId}`)
//     return { success: true, reminder }
//   } catch (error) {
//     console.error("[v0] Error creating reminder:", error)
//     return { success: false, error: "Failed to create reminder" }
//   }
// }

// export async function completeReminder(reminderId: string) {
//   try {
//     await prisma.reminder.update({
//       where: { id: reminderId },
//       data: {
//         isCompleted: true,
//         completedAt: new Date(),
//       },
//     })

//     revalidatePath("/inbox")
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error completing reminder:", error)
//     return { success: false, error: "Failed to complete reminder" }
//   }
// }

// export async function getDueReminders(userId: string) {
//   try {
//     const reminders = await prisma.reminder.findMany({
//       where: {
//         userId,
//         isCompleted: false,
//         remindAt: { lte: new Date() },
//       },
//       include: {
//         conversation: {
//           select: {
//             id: true,
//             participantName: true,
//             participantUsername: true,
//           },
//         },
//       },
//       orderBy: { remindAt: "asc" },
//     })

//     return { success: true, reminders }
//   } catch (error) {
//     console.error("[v0] Error fetching due reminders:", error)
//     return { success: false, error: "Failed to fetch reminders", reminders: [] }
//   }
// }

// export async function updateConversationStatus(conversationId: string, status: string) {
//   try {
//     await prisma.conversation.update({
//       where: { id: conversationId },
//       data: { status },
//     })

//     revalidatePath("/inbox")
//     revalidatePath(`/inbox/${conversationId}`)
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error updating status:", error)
//     return { success: false, error: "Failed to update status" }
//   }
// }

// export async function assignConversation(conversationId: string, userId: string | null) {
//   try {
//     await prisma.conversation.update({
//       where: { id: conversationId },
//       data: { assignedToUserId: userId },
//     })

//     revalidatePath("/inbox")
//     revalidatePath(`/inbox/${conversationId}`)
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error assigning conversation:", error)
//     return { success: false, error: "Failed to assign conversation" }
//   }
// }

// export async function toggleVipStatus(conversationId: string, isVip: boolean) {
//   try {
//     await prisma.conversation.update({
//       where: { id: conversationId },
//       data: { isVip },
//     })

//     // Update priority score
//     await updateConversationPriority(conversationId)

//     revalidatePath("/inbox")
//     revalidatePath(`/inbox/${conversationId}`)
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error toggling VIP status:", error)
//     return { success: false, error: "Failed to toggle VIP status" }
//   }
// }

// export async function bulkUpdateConversations(
//   conversationIds: string[],
//   action: "read" | "unread" | "archive" | "unarchive" | "star" | "unstar" | "delete",
//   userId: string,
// ) {
//   try {
//     const updateData: any = {}

//     switch (action) {
//       case "read":
//         updateData.isRead = true
//         updateData.unreadCount = 0
//         break
//       case "unread":
//         updateData.isRead = false
//         break
//       case "archive":
//         updateData.isArchived = true
//         break
//       case "unarchive":
//         updateData.isArchived = false
//         break
//       case "star":
//         updateData.starred = true
//         break
//       case "unstar":
//         updateData.starred = false
//         break
//     }

//     if (action === "delete") {
//       await prisma.conversation.deleteMany({
//         where: {
//           id: { in: conversationIds },
//           userId, // Ensure user owns these conversations
//         },
//       })
//     } else {
//       await prisma.conversation.updateMany({
//         where: {
//           id: { in: conversationIds },
//           userId,
//         },
//         data: updateData,
//       })
//     }

//     revalidatePath("/inbox")
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error bulk updating:", error)
//     return { success: false, error: "Failed to bulk update conversations" }
//   }
// }

// export async function bulkAssign(conversationIds: string[], assignedToUserId: string | null) {
//   try {
//     await prisma.conversation.updateMany({
//       where: { id: { in: conversationIds } },
//       data: { assignedToUserId },
//     })

//     revalidatePath("/inbox")
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error bulk assigning:", error)
//     return { success: false, error: "Failed to bulk assign" }
//   }
// }

// export async function bulkAddTags(conversationIds: string[], tagId: string) {
//   try {
//     // Create all conversation-tag relationships
//     await Promise.all(
//       conversationIds.map((conversationId) =>
//         prisma.conversationTag.upsert({
//           where: {
//             conversationId_tagId: {
//               conversationId,
//               tagId,
//             },
//           },
//           create: {
//             conversationId,
//             tagId,
//           },
//           update: {},
//         }),
//       ),
//     )

//     revalidatePath("/inbox")
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error bulk adding tags:", error)
//     return { success: false, error: "Failed to bulk add tags" }
//   }
// }

// export async function autoArchiveResolved(userId: string, daysOld = 7) {
//   try {
//     const cutoffDate = new Date()
//     cutoffDate.setDate(cutoffDate.getDate() - daysOld)

//     const result = await prisma.conversation.updateMany({
//       where: {
//         userId,
//         isArchived: false,
//         status: "resolved",
//         lastMessageAt: { lt: cutoffDate },
//       },
//       data: {
//         isArchived: true,
//       },
//     })

//     revalidatePath("/inbox")
//     return { success: true, count: result.count }
//   } catch (error) {
//     console.error("[v0] Error auto-archiving:", error)
//     return { success: false, error: "Failed to auto-archive" }
//   }
// }

// export async function getInboxAnalytics(userId: string, dateRange: { from: Date; to: Date }) {
//   try {
//     const conversations = await prisma.conversation.findMany({
//       where: {
//         userId,
//         createdAt: {
//           gte: dateRange.from,
//           lte: dateRange.to,
//         },
//       },
//       include: {
//         messages: {
//           select: {
//             createdAt: true,
//             isFromUser: true,
//           },
//         },
//       },
//     })

//     // Calculate metrics
//     const totalConversations = conversations.length
//     const unresolvedCount = conversations.filter((c) => c.status !== "resolved").length
//     const avgResponseTime = calculateAvgResponseTime(conversations)
//     const messagesByHour = calculateMessagesByHour(conversations)
//     const conversationsByCategory = calculateByCategory(conversations)

//     return {
//       success: true,
//       analytics: {
//         totalConversations,
//         unresolvedCount,
//         avgResponseTime,
//         messagesByHour,
//         conversationsByCategory,
//       },
//     }
//   } catch (error) {
//     console.error("[v0] Error fetching analytics:", error)
//     return { success: false, error: "Failed to fetch analytics" }
//   }
// }

// // Helper functions for analytics
// function calculateAvgResponseTime(conversations: any[]) {
//   const responseTimes: number[] = []

//   conversations.forEach((conv) => {
//     const messages = conv.messages.sort((a: any, b: any) => a.createdAt.getTime() - b.createdAt.getTime())

//     for (let i = 1; i < messages.length; i++) {
//       if (!messages[i - 1].isFromUser && messages[i].isFromUser) {
//         const diff = messages[i].createdAt.getTime() - messages[i - 1].createdAt.getTime()
//         responseTimes.push(diff / (1000 * 60)) // Convert to minutes
//       }
//     }
//   })

//   if (responseTimes.length === 0) return 0
//   return Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
// }

// function calculateMessagesByHour(conversations: any[]) {
//   const hourCounts: number[] = new Array(24).fill(0)

//   conversations.forEach((conv) => {
//     conv.messages.forEach((msg: any) => {
//       const hour = new Date(msg.createdAt).getHours()
//       hourCounts[hour]++
//     })
//   })

//   return hourCounts
// }

// function calculateByCategory(conversations: any[]) {
//   const categories: Record<string, number> = {}

//   conversations.forEach((conv) => {
//     categories[conv.category] = (categories[conv.category] || 0) + 1
//   })

//   return categories
// }

// export async function getSavedFilters(userId: string) {
//   try {
//     const filters = await prisma.savedFilter.findMany({
//       where: { userId },
//       orderBy: { createdAt: "desc" },
//     })

//     return { success: true, filters }
//   } catch (error) {
//     console.error("[v0] Error fetching saved filters:", error)
//     return { success: false, error: "Failed to fetch saved filters", filters: [] }
//   }
// }

// export async function createSavedFilter(userId: string, name: string, filters: any) {
//   try {
//     const savedFilter = await prisma.savedFilter.create({
//       data: {
//         userId,
//         name,
//         filters,
//       },
//     })

//     revalidatePath("/inbox")
//     return { success: true, savedFilter }
//   } catch (error) {
//     console.error("[v0] Error creating saved filter:", error)
//     return { success: false, error: "Failed to create saved filter" }
//   }
// }

// export async function deleteSavedFilter(filterId: string) {
//   try {
//     await prisma.savedFilter.delete({
//       where: { id: filterId },
//     })

//     revalidatePath("/inbox")
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error deleting saved filter:", error)
//     return { success: false, error: "Failed to delete saved filter" }
//   }
// }

// export async function sendMessage(conversationId: string, content: string, userId: string) {
//   try {
//     const message = await prisma.message.create({
//       data: {
//         conversationId,
//         content,
//         sender: "business",
//         isFromUser: false,
//         timestamp: new Date(),
//       },
//     })

//     // Update conversation
//     await prisma.conversation.update({
//       where: { id: conversationId },
//       data: {
//         lastMessageAt: new Date(),
//         lastMessageText: content,
//         status: "awaiting_response",
//       },
//     })

//     // Update priority after sending
//     await updateConversationPriority(conversationId)

//     revalidatePath(`/inbox/${conversationId}`)
//     revalidatePath("/inbox")

//     return { success: true, message }
//   } catch (error) {
//     console.error("[v0] Error sending message:", error)
//     return { success: false, error: "Failed to send message" }
//   }
// }


"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getConversations(filters: {
  userId: string
  instagramAccountId?: string
  search?: string
  category?: string
  status?: string
  isVip?: boolean
  isRead?: boolean
  starred?: boolean
  archived?: boolean
  assignedTo?: string
  tagIds?: string[]
  dateRange?: { from: Date; to: Date }
  sortBy?: "priority" | "recent" | "oldest" | "unread"
  limit?: number
  cursor?: string
}) {
  try {
    const where: any = {
      userId: filters.userId,
      isArchived: filters.archived ?? false,
    }

    if (filters.instagramAccountId) {
      where.instagramAccountId = filters.instagramAccountId
    }

    if (filters.search) {
      where.OR = [
        { participantUsername: { contains: filters.search, mode: "insensitive" } },
        { participantName: { contains: filters.search, mode: "insensitive" } },
        { lastMessageText: { contains: filters.search, mode: "insensitive" } },
      ]
    }

    if (filters.category) {
      where.category = filters.category
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.isVip !== undefined) {
      where.isVip = filters.isVip
    }

    if (filters.isRead !== undefined) {
      where.isRead = filters.isRead
    }

    if (filters.starred !== undefined) {
      where.starred = filters.starred
    }

    if (filters.assignedTo) {
      where.assignedToUserId = filters.assignedTo
    }

    if (filters.tagIds && filters.tagIds.length > 0) {
      where.conversationTags = {
        some: {
          tagId: { in: filters.tagIds },
        },
      }
    }

    if (filters.dateRange) {
      where.lastMessageAt = {
        gte: filters.dateRange.from,
        lte: filters.dateRange.to,
      }
    }

    if (filters.cursor) {
      where.id = { lt: filters.cursor }
    }

    // Determine sort order
    let orderBy: any = { lastMessageAt: "desc" }
    if (filters.sortBy === "priority") {
      orderBy = { priorityScore: "desc" }
    } else if (filters.sortBy === "oldest") {
      orderBy = { lastMessageAt: "asc" }
    } else if (filters.sortBy === "unread") {
      orderBy = [{ isRead: "asc" }, { lastMessageAt: "desc" }]
    }

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        conversationTags: {
          include: {
            tag: true,
          },
        },
        internalNotes: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        reminders: {
          where: { isCompleted: false },
          orderBy: { remindAt: "asc" },
          take: 1,
        },
        _count: {
          select: {
            messages: true,
            internalNotes: true,
          },
        },
      },
      orderBy,
      take: filters.limit || 50,
    })

    return { success: true, conversations }
  } catch (error) {
    console.error("[v0] Error fetching conversations:", error)
    return { success: false, error: "Failed to fetch conversations", conversations: [] }
  }
}

export async function getConversation(id: string) {
  try {
    let conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        conversationTags: {
          include: {
            tag: true,
          },
        },
        internalNotes: {
          orderBy: { createdAt: "desc" },
        },
        reminders: {
          where: { isCompleted: false },
          orderBy: { remindAt: "asc" },
          take: 1,
        },
        aiSuggestions: {
          where: {
            expiresAt: { gt: new Date() },
          },
          take: 1,
        },
        instagramAccount: true,
      },
    })

    if (!conversation) {
      return { success: false, error: "Conversation not found" }
    }

    const isBusinessAccount = conversation.participantId === conversation.instagramAccount.instagramId
    const isMissingData = !conversation.participantName || conversation.participantName === "Unknown"

    if (isBusinessAccount || isMissingData) {
      console.log("[v0] Detected wrong or missing participant data, auto-syncing from Instagram...")

      // Import the sync function dynamically to avoid circular dependencies
      const { autoSyncConversationParticipant } = await import("./instagram-sync-actions")
      await autoSyncConversationParticipant(conversation.id)

      // Refetch conversation with updated data
      const updatedConversation = await prisma.conversation.findUnique({
        where: { id },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
          conversationTags: {
            include: {
              tag: true,
            },
          },
          internalNotes: {
            orderBy: { createdAt: "desc" },
          },
          reminders: {
            where: { isCompleted: false },
            orderBy: { remindAt: "asc" },
            take: 1,
          },
          aiSuggestions: {
            where: {
              expiresAt: { gt: new Date() },
            },
            take: 1,
          },
          instagramAccount: true,
        },
      })

      if (updatedConversation) {
        conversation = updatedConversation
      }
    }

    // Auto mark as read
    if (!conversation.isRead) {
      await prisma.conversation.update({
        where: { id },
        data: { isRead: true, unreadCount: 0 },
      })
    }

    return { success: true, conversation }
  } catch (error) {
    console.error("[v0] Error fetching conversation:", error)
    return { success: false, error: "Failed to fetch conversation" }
  }
}

export async function getCustomerHistory(participantId: string, userId: string) {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participantId,
        userId,
      },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const totalMessages = conversations.reduce((sum, conv) => sum + conv._count.messages, 0)
    const firstContact = conversations[conversations.length - 1]?.firstContactAt

    return {
      success: true,
      history: {
        conversationCount: conversations.length,
        totalMessages,
        firstContact,
        conversations: conversations.map((c) => ({
          id: c.id,
          firstMessage: c.messages[0]?.content || "",
          date: c.createdAt,
          messageCount: c._count.messages,
        })),
      },
    }
  } catch (error) {
    console.error("[v0] Error fetching customer history:", error)
    return { success: false, error: "Failed to fetch customer history" }
  }
}

export async function updateConversationPriority(conversationId: string) {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    })

    if (!conversation) return { success: false }

    let score = 0
    let category = "general"

    // Analyze last 5 messages for keywords
    const recentMessages = conversation.messages.map((m) => m.content.toLowerCase()).join(" ")

    // Sales intent keywords (high priority)
    const salesKeywords = ["price", "buy", "purchase", "order", "cost", "available", "how much", "payment"]
    if (salesKeywords.some((kw) => recentMessages.includes(kw))) {
      score += 40
      category = "sales"
    }

    // Support keywords (medium priority)
    const supportKeywords = ["help", "problem", "issue", "not working", "broken", "error"]
    if (supportKeywords.some((kw) => recentMessages.includes(kw))) {
      score += 25
      category = "support"
    }

    // Collaboration keywords
    const collabKeywords = ["collab", "partnership", "work together", "sponsor", "promote"]
    if (collabKeywords.some((kw) => recentMessages.includes(kw))) {
      score += 30
      category = "collaboration"
    }

    // Time-based scoring
    if (conversation.lastMessageAt) {
      const hoursSinceLastMessage = (Date.now() - conversation.lastMessageAt.getTime()) / (1000 * 60 * 60)

      if (hoursSinceLastMessage > 24) score += 20 // Needs follow-up
      if (hoursSinceLastMessage > 48) score += 30 // Urgent follow-up
    }

    // VIP bonus
    if (conversation.isVip) score += 20

    // Unread bonus
    if (!conversation.isRead) score += 15

    // Cap at 100
    score = Math.min(score, 100)

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        priorityScore: score,
        category,
      },
    })

    revalidatePath("/inbox")
    return { success: true, score, category }
  } catch (error) {
    console.error("[v0] Error updating priority:", error)
    return { success: false, error: "Failed to update priority" }
  }
}

export async function addInternalNote(conversationId: string, userId: string, content: string, mentions: string[]) {
  try {
    const note = await prisma.internalNote.create({
      data: {
        conversationId,
        userId,
        content,
        mentions,
      },
    })

    revalidatePath(`/inbox/${conversationId}`)
    return { success: true, note }
  } catch (error) {
    console.error("[v0] Error adding note:", error)
    return { success: false, error: "Failed to add note" }
  }
}

export async function getInternalNotes(conversationId: string) {
  try {
    const notes = await prisma.internalNote.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, notes }
  } catch (error) {
    console.error("[v0] Error fetching notes:", error)
    return { success: false, error: "Failed to fetch notes", notes: [] }
  }
}

export async function getMessageTemplates(userId: string, category?: string) {
  try {
    const where: any = { userId, isActive: true }
    if (category) where.category = category

    const templates = await prisma.messageTemplate.findMany({
      where,
      orderBy: { usageCount: "desc" },
    })

    return { success: true, templates }
  } catch (error) {
    console.error("[v0] Error fetching templates:", error)
    return { success: false, error: "Failed to fetch templates", templates: [] }
  }
}

export async function createMessageTemplate(
  userId: string,
  title: string,
  content: string,
  category: string,
  variables: string[],
) {
  try {
    const template = await prisma.messageTemplate.create({
      data: {
        userId,
        title,
        content,
        category,
        variables,
      },
    })

    revalidatePath("/inbox")
    return { success: true, template }
  } catch (error) {
    console.error("[v0] Error creating template:", error)
    return { success: false, error: "Failed to create template" }
  }
}

export async function updateTemplateUsage(templateId: string) {
  try {
    await prisma.messageTemplate.update({
      where: { id: templateId },
      data: {
        usageCount: { increment: 1 },
      },
    })

    return { success: true }
  } catch (error) {
    console.error("[v0] Error updating template usage:", error)
    return { success: false }
  }
}

export async function deleteMessageTemplate(templateId: string) {
  try {
    await prisma.messageTemplate.delete({
      where: { id: templateId },
    })

    revalidatePath("/inbox")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting template:", error)
    return { success: false, error: "Failed to delete template" }
  }
}

export async function createReminder(conversationId: string, userId: string, message: string, remindAt: Date) {
  try {
    const reminder = await prisma.reminder.create({
      data: {
        conversationId,
        userId,
        message,
        remindAt,
      },
    })

    revalidatePath(`/inbox/${conversationId}`)
    return { success: true, reminder }
  } catch (error) {
    console.error("[v0] Error creating reminder:", error)
    return { success: false, error: "Failed to create reminder" }
  }
}

export async function completeReminder(reminderId: string) {
  try {
    await prisma.reminder.update({
      where: { id: reminderId },
      data: {
        isCompleted: true,
        completedAt: new Date(),
      },
    })

    revalidatePath("/inbox")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error completing reminder:", error)
    return { success: false, error: "Failed to complete reminder" }
  }
}

export async function getDueReminders(userId: string) {
  try {
    const reminders = await prisma.reminder.findMany({
      where: {
        userId,
        isCompleted: false,
        remindAt: { lte: new Date() },
      },
      include: {
        conversation: {
          select: {
            id: true,
            participantName: true,
            participantUsername: true,
          },
        },
      },
      orderBy: { remindAt: "asc" },
    })

    return { success: true, reminders }
  } catch (error) {
    console.error("[v0] Error fetching due reminders:", error)
    return { success: false, error: "Failed to fetch reminders", reminders: [] }
  }
}

export async function updateConversationStatus(conversationId: string, status: string) {
  try {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { status },
    })

    revalidatePath("/inbox")
    revalidatePath(`/inbox/${conversationId}`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error updating status:", error)
    return { success: false, error: "Failed to update status" }
  }
}

export async function assignConversation(conversationId: string, userId: string | null) {
  try {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { assignedToUserId: userId },
    })

    revalidatePath("/inbox")
    revalidatePath(`/inbox/${conversationId}`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error assigning conversation:", error)
    return { success: false, error: "Failed to assign conversation" }
  }
}

export async function toggleVipStatus(conversationId: string, isVip: boolean) {
  try {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { isVip },
    })

    // Update priority score
    await updateConversationPriority(conversationId)

    revalidatePath("/inbox")
    revalidatePath(`/inbox/${conversationId}`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error toggling VIP status:", error)
    return { success: false, error: "Failed to toggle VIP status" }
  }
}

export async function bulkUpdateConversations(
  conversationIds: string[],
  action: "read" | "unread" | "archive" | "unarchive" | "star" | "unstar" | "delete",
  userId: string,
) {
  try {
    const updateData: any = {}

    switch (action) {
      case "read":
        updateData.isRead = true
        updateData.unreadCount = 0
        break
      case "unread":
        updateData.isRead = false
        break
      case "archive":
        updateData.isArchived = true
        break
      case "unarchive":
        updateData.isArchived = false
        break
      case "star":
        updateData.starred = true
        break
      case "unstar":
        updateData.starred = false
        break
    }

    if (action === "delete") {
      await prisma.conversation.deleteMany({
        where: {
          id: { in: conversationIds },
          userId, // Ensure user owns these conversations
        },
      })
    } else {
      await prisma.conversation.updateMany({
        where: {
          id: { in: conversationIds },
          userId,
        },
        data: updateData,
      })
    }

    revalidatePath("/inbox")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error bulk updating:", error)
    return { success: false, error: "Failed to bulk update conversations" }
  }
}

export async function bulkAssign(conversationIds: string[], assignedToUserId: string | null) {
  try {
    await prisma.conversation.updateMany({
      where: { id: { in: conversationIds } },
      data: { assignedToUserId },
    })

    revalidatePath("/inbox")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error bulk assigning:", error)
    return { success: false, error: "Failed to bulk assign" }
  }
}

export async function bulkAddTags(conversationIds: string[], tagId: string) {
  try {
    // Create all conversation-tag relationships
    await Promise.all(
      conversationIds.map((conversationId) =>
        prisma.conversationTag.upsert({
          where: {
            conversationId_tagId: {
              conversationId,
              tagId,
            },
          },
          create: {
            conversationId,
            tagId,
          },
          update: {},
        }),
      ),
    )

    revalidatePath("/inbox")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error bulk adding tags:", error)
    return { success: false, error: "Failed to bulk add tags" }
  }
}

export async function autoArchiveResolved(userId: string, daysOld = 7) {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const result = await prisma.conversation.updateMany({
      where: {
        userId,
        isArchived: false,
        status: "resolved",
        lastMessageAt: { lt: cutoffDate },
      },
      data: {
        isArchived: true,
      },
    })

    revalidatePath("/inbox")
    return { success: true, count: result.count }
  } catch (error) {
    console.error("[v0] Error auto-archiving:", error)
    return { success: false, error: "Failed to auto-archive" }
  }
}

export async function getInboxAnalytics(userId: string, dateRange: { from: Date; to: Date }) {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        userId,
        createdAt: {
          gte: dateRange.from,
          lte: dateRange.to,
        },
      },
      include: {
        messages: {
          select: {
            createdAt: true,
            isFromUser: true,
          },
        },
      },
    })

    // Calculate metrics
    const totalConversations = conversations.length
    const unresolvedCount = conversations.filter((c) => c.status !== "resolved").length
    const avgResponseTime = calculateAvgResponseTime(conversations)
    const messagesByHour = calculateMessagesByHour(conversations)
    const conversationsByCategory = calculateByCategory(conversations)

    return {
      success: true,
      analytics: {
        totalConversations,
        unresolvedCount,
        avgResponseTime,
        messagesByHour,
        conversationsByCategory,
      },
    }
  } catch (error) {
    console.error("[v0] Error fetching analytics:", error)
    return { success: false, error: "Failed to fetch analytics" }
  }
}

// Helper functions for analytics
function calculateAvgResponseTime(conversations: any[]) {
  const responseTimes: number[] = []

  conversations.forEach((conv) => {
    const messages = conv.messages.sort((a: any, b: any) => a.createdAt.getTime() - b.createdAt.getTime())

    for (let i = 1; i < messages.length; i++) {
      if (!messages[i - 1].isFromUser && messages[i].isFromUser) {
        const diff = messages[i].createdAt.getTime() - messages[i - 1].createdAt.getTime()
        responseTimes.push(diff / (1000 * 60)) // Convert to minutes
      }
    }
  })

  if (responseTimes.length === 0) return 0
  return Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
}

function calculateMessagesByHour(conversations: any[]) {
  const hourCounts: number[] = new Array(24).fill(0)

  conversations.forEach((conv) => {
    conv.messages.forEach((msg: any) => {
      const hour = new Date(msg.createdAt).getHours()
      hourCounts[hour]++
    })
  })

  return hourCounts
}

function calculateByCategory(conversations: any[]) {
  const categories: Record<string, number> = {}

  conversations.forEach((conv) => {
    categories[conv.category] = (categories[conv.category] || 0) + 1
  })

  return categories
}

export async function getSavedFilters(userId: string) {
  try {
    const filters = await prisma.savedFilter.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, filters }
  } catch (error) {
    console.error("[v0] Error fetching saved filters:", error)
    return { success: false, error: "Failed to fetch saved filters", filters: [] }
  }
}

export async function createSavedFilter(userId: string, name: string, filters: any) {
  try {
    const savedFilter = await prisma.savedFilter.create({
      data: {
        userId,
        name,
        filters,
      },
    })

    revalidatePath("/inbox")
    return { success: true, savedFilter }
  } catch (error) {
    console.error("[v0] Error creating saved filter:", error)
    return { success: false, error: "Failed to create saved filter" }
  }
}

export async function deleteSavedFilter(filterId: string) {
  try {
    await prisma.savedFilter.delete({
      where: { id: filterId },
    })

    revalidatePath("/inbox")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting saved filter:", error)
    return { success: false, error: "Failed to delete saved filter" }
  }
}

export async function sendMessage(conversationId: string, content: string, userId: string) {
  try {
    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
        sender: "business",
        isFromUser: false,
        timestamp: new Date(),
      },
    })

    // Update conversation
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        lastMessageText: content,
        status: "awaiting_response",
      },
    })

    // Update priority after sending
    await updateConversationPriority(conversationId)

    revalidatePath(`/inbox/${conversationId}`)
    revalidatePath("/inbox")

    return { success: true, message }
  } catch (error) {
    console.error("[v0] Error sending message:", error)
    return { success: false, error: "Failed to send message" }
  }
}
