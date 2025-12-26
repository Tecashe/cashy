// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"

// export async function getAnalyticsOverview(dateRange: "7d" | "30d" | "90d" = "30d") {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90
//   const startDate = new Date()
//   startDate.setDate(startDate.getDate() - days)

//   // Get analytics data
//   const analyticsData = await prisma.analytics.findMany({
//     where: {
//       userId: user.id,
//       date: { gte: startDate },
//     },
//     orderBy: { date: "asc" },
//   })

//   // Get conversation metrics
//   const conversations = await prisma.conversation.findMany({
//     where: {
//       userId: user.id,
//       createdAt: { gte: startDate },
//     },
//     include: {
//       messages: {
//         where: { createdAt: { gte: startDate } },
//       },
//       conversationTags: {
//         include: { tag: true },
//       },
//     },
//   })

//   // Get automation executions
//   const automationExecutions = await prisma.automationExecution.findMany({
//     where: {
//       automation: { userId: user.id },
//       executedAt: { gte: startDate },
//     },
//     include: {
//       automation: true,
//     },
//   })

//   // Calculate metrics
//   const totalMessages = analyticsData.reduce((sum, a) => sum + a.messagesReceived + a.messagesSent, 0)
//   const messagesReceived = analyticsData.reduce((sum, a) => sum + a.messagesReceived, 0)
//   const messagesSent = analyticsData.reduce((sum, a) => sum + a.messagesSent, 0)
//   const conversationsStarted = analyticsData.reduce((sum, a) => sum + a.conversationsStarted, 0)
//   const automationTriggered = analyticsData.reduce((sum, a) => sum + a.automationTriggered, 0)

//   // Calculate average response time
//   const conversationsWithResponseTime = conversations.filter((c) => c.lastResponseTime !== null)
//   const avgResponseTime =
//     conversationsWithResponseTime.length > 0
//       ? conversationsWithResponseTime.reduce((sum, c) => sum + (c.lastResponseTime || 0), 0) /
//         conversationsWithResponseTime.length
//       : 0

//   // Automation success rate
//   const successfulExecutions = automationExecutions.filter((e) => e.status === "success").length
//   const automationSuccessRate =
//     automationExecutions.length > 0 ? (successfulExecutions / automationExecutions.length) * 100 : 0

//   // Status breakdown
//   const statusBreakdown = {
//     open: conversations.filter((c) => c.status === "open").length,
//     awaiting_response: conversations.filter((c) => c.status === "awaiting_response").length,
//     resolved: conversations.filter((c) => c.status === "resolved").length,
//   }

//   // Category breakdown
//   const categoryBreakdown = {
//     sales: conversations.filter((c) => c.category === "sales").length,
//     support: conversations.filter((c) => c.category === "support").length,
//     collaboration: conversations.filter((c) => c.category === "collaboration").length,
//     general: conversations.filter((c) => c.category === "general").length,
//   }

//   // Top tags
//   const tagCounts = new Map<string, { name: string; color: string; count: number }>()
//   conversations.forEach((conv) => {
//     conv.conversationTags.forEach((ct) => {
//       const existing = tagCounts.get(ct.tag.id)
//       if (existing) {
//         existing.count++
//       } else {
//         tagCounts.set(ct.tag.id, {
//           name: ct.tag.name,
//           color: ct.tag.color,
//           count: 1,
//         })
//       }
//     })
//   })
//   const topTags = Array.from(tagCounts.values())
//     .sort((a, b) => b.count - a.count)
//     .slice(0, 5)

//   return {
//     overview: {
//       totalMessages,
//       messagesReceived,
//       messagesSent,
//       conversationsStarted,
//       automationTriggered,
//       avgResponseTime: Math.round(avgResponseTime),
//       automationSuccessRate: Math.round(automationSuccessRate),
//     },
//     statusBreakdown,
//     categoryBreakdown,
//     topTags,
//     chartData: analyticsData.map((a) => ({
//       date: a.date.toISOString().split("T")[0],
//       received: a.messagesReceived,
//       sent: a.messagesSent,
//       conversations: a.conversationsStarted,
//     })),
//   }
// }

// export async function getAutomationPerformance() {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automations = await prisma.automation.findMany({
//     where: { userId: user.id },
//     include: {
//       executions: {
//         orderBy: { executedAt: "desc" },
//         take: 100,
//       },
//       _count: {
//         select: { executions: true },
//       },
//     },
//   })

//   return automations.map((auto) => {
//     const successCount = auto.executions.filter((e) => e.status === "success").length
//     const failedCount = auto.executions.filter((e) => e.status === "failed").length
//     const successRate = auto.executions.length > 0 ? (successCount / auto.executions.length) * 100 : 0

//     return {
//       id: auto.id,
//       name: auto.name,
//       isActive: auto.isActive,
//       totalExecutions: auto._count.executions,
//       successCount,
//       failedCount,
//       successRate: Math.round(successRate),
//       lastExecuted: auto.executions[0]?.executedAt || null,
//     }
//   })
// }

// export async function getRecentActivity() {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   // Get recent conversations
//   const recentConversations = await prisma.conversation.findMany({
//     where: { userId: user.id },
//     orderBy: { lastMessageAt: "desc" },
//     take: 5,
//     include: {
//       messages: {
//         orderBy: { timestamp: "desc" },
//         take: 1,
//       },
//     },
//   })

//   // Get recent automation executions
//   const recentExecutions = await prisma.automationExecution.findMany({
//     where: {
//       automation: { userId: user.id },
//     },
//     orderBy: { executedAt: "desc" },
//     take: 5,
//     include: {
//       automation: true,
//     },
//   })

//   return {
//     conversations: recentConversations.map((c) => ({
//       id: c.id,
//       participantName: c.participantName,
//       participantUsername: c.participantUsername,
//       lastMessage: c.lastMessageText,
//       lastMessageAt: c.lastMessageAt,
//       unreadCount: c.unreadCount,
//     })),
//     executions: recentExecutions.map((e) => ({
//       id: e.id,
//       automationName: e.automation.name,
//       status: e.status,
//       executedAt: e.executedAt,
//       error: e.error,
//     })),
//   }
// }

"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function getAnalyticsOverview(dateRange: "7d" | "30d" | "90d" = "30d") {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Get all conversations in date range
  const conversations = await prisma.conversation.findMany({
    where: {
      userId: user.id,
      createdAt: { gte: startDate },
    },
    include: {
      messages: {
        where: { createdAt: { gte: startDate } },
      },
      conversationTags: {
        include: { tag: true },
      },
    },
  })

  // Get all messages in date range
  const allMessages = await prisma.message.findMany({
    where: {
      conversation: { userId: user.id },
      createdAt: { gte: startDate },
    },
    orderBy: { timestamp: "asc" },
  })

  // Get automation executions
  const automationExecutions = await prisma.automationExecution.findMany({
    where: {
      automation: { userId: user.id },
      executedAt: { gte: startDate },
    },
    include: {
      automation: true,
    },
  })

  // Calculate real metrics
  const messagesReceived = allMessages.filter((m) => !m.isFromUser).length
  const messagesSent = allMessages.filter((m) => m.isFromUser).length
  const totalMessages = allMessages.length
  const conversationsStarted = conversations.length
  const automationTriggered = automationExecutions.length

  // Calculate average response time (in minutes)
  const conversationsWithResponseTime = conversations.filter((c) => c.lastResponseTime !== null)
  const avgResponseTime =
    conversationsWithResponseTime.length > 0
      ? conversationsWithResponseTime.reduce((sum, c) => sum + (c.lastResponseTime || 0), 0) /
        conversationsWithResponseTime.length
      : 0

  // Automation success rate
  const successfulExecutions = automationExecutions.filter((e) => e.status === "success").length
  const automationSuccessRate =
    automationExecutions.length > 0 ? (successfulExecutions / automationExecutions.length) * 100 : 0

  // Status breakdown (all conversations, not just in date range)
  const allConversations = await prisma.conversation.findMany({
    where: { userId: user.id },
  })

  const statusBreakdown = {
    open: allConversations.filter((c) => c.status === "open").length,
    awaiting_response: allConversations.filter((c) => c.status === "awaiting_response").length,
    resolved: allConversations.filter((c) => c.status === "resolved").length,
  }

  // Category breakdown
  const categoryBreakdown = {
    sales: allConversations.filter((c) => c.category === "sales").length,
    support: allConversations.filter((c) => c.category === "support").length,
    collaboration: allConversations.filter((c) => c.category === "collaboration").length,
    general: allConversations.filter((c) => c.category === "general").length,
  }

  // Top tags
//   const tagCounts = new Map<string, { name: string; color: string; count: number }>()
//   allConversations.forEach((conv) => {
//     if (conv.conversationTags) {
//       // This needs to be included
//       // We'll handle this separately
//     }
//   })

  // Get tags with counts
  const tagsWithCounts = await prisma.tag.findMany({
    where: { userId: user.id },
    include: {
      conversationTags: {
        where: {
          conversation: { userId: user.id },
        },
      },
    },
  })

  const topTags = tagsWithCounts
    .map((tag) => ({
      name: tag.name,
      color: tag.color,
      count: tag.conversationTags.length,
    }))
    .filter((tag) => tag.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Create chart data by grouping messages by date
  const chartDataMap = new Map<string, { received: number; sent: number; conversations: number }>()

  // Initialize all dates in range
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split("T")[0]
    chartDataMap.set(dateStr, { received: 0, sent: 0, conversations: 0 })
  }

  // Populate with actual message data
  allMessages.forEach((msg) => {
    const dateStr = msg.timestamp.toISOString().split("T")[0]
    const existing = chartDataMap.get(dateStr)
    if (existing) {
      if (msg.isFromUser) {
        existing.sent++
      } else {
        existing.received++
      }
    }
  })

  // Count conversations per day
  conversations.forEach((conv) => {
    const dateStr = conv.createdAt.toISOString().split("T")[0]
    const existing = chartDataMap.get(dateStr)
    if (existing) {
      existing.conversations++
    }
  })

  const chartData = Array.from(chartDataMap.entries())
    .map(([date, data]) => ({
      date,
      received: data.received,
      sent: data.sent,
      conversations: data.conversations,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    overview: {
      totalMessages,
      messagesReceived,
      messagesSent,
      conversationsStarted,
      automationTriggered,
      avgResponseTime: Math.round(avgResponseTime),
      automationSuccessRate: Math.round(automationSuccessRate),
    },
    statusBreakdown,
    categoryBreakdown,
    topTags,
    chartData,
  }
}

export async function getAutomationPerformance() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const automations = await prisma.automation.findMany({
    where: { userId: user.id },
    include: {
      executions: {
        orderBy: { executedAt: "desc" },
        take: 100,
      },
      _count: {
        select: { executions: true },
      },
    },
  })

  return automations.map((auto) => {
    const successCount = auto.executions.filter((e) => e.status === "success").length
    const failedCount = auto.executions.filter((e) => e.status === "failed").length
    const successRate = auto.executions.length > 0 ? (successCount / auto.executions.length) * 100 : 0

    return {
      id: auto.id,
      name: auto.name,
      isActive: auto.isActive,
      totalExecutions: auto._count.executions,
      successCount,
      failedCount,
      successRate: Math.round(successRate),
      lastExecuted: auto.executions[0]?.executedAt || null,
    }
  })
}

export async function getRecentActivity() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  // Get recent conversations
  const recentConversations = await prisma.conversation.findMany({
    where: { userId: user.id },
    orderBy: { lastMessageAt: "desc" },
    take: 5,
    include: {
      messages: {
        orderBy: { timestamp: "desc" },
        take: 1,
      },
    },
  })

  // Get recent automation executions
  const recentExecutions = await prisma.automationExecution.findMany({
    where: {
      automation: { userId: user.id },
    },
    orderBy: { executedAt: "desc" },
    take: 5,
    include: {
      automation: true,
    },
  })

  return {
    conversations: recentConversations.map((c) => ({
      id: c.id,
      participantName: c.participantName,
      participantUsername: c.participantUsername,
      lastMessage: c.lastMessageText,
      lastMessageAt: c.lastMessageAt,
      unreadCount: c.unreadCount,
    })),
    executions: recentExecutions.map((e) => ({
      id: e.id,
      automationName: e.automation.name,
      status: e.status,
      executedAt: e.executedAt,
      error: e.error,
    })),
  }
}