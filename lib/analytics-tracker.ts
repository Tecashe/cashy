import { prisma } from "@/lib/db"

export async function trackAnalytics(userId: string, event: string, metadata?: Record<string, any>) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Find or create analytics record for today
    const analytics = await prisma.analytics.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    })

    const updates: Record<string, any> = {}

    switch (event) {
      case "message_received":
        updates.messagesReceived = { increment: 1 }
        break
      case "message_sent":
        updates.messagesSent = { increment: 1 }
        break
      case "conversation_started":
        updates.conversationsStarted = { increment: 1 }
        break
      case "automation_triggered":
        updates.automationTriggered = { increment: 1 }
        break
      case "content_generated":
        updates.contentGenerated = { increment: 1 }
        break
    }

    if (analytics) {
      await prisma.analytics.update({
        where: { id: analytics.id },
        data: updates,
      })
    } else {
      await prisma.analytics.create({
        data: {
          userId,
          date: today,
          messagesReceived: event === "message_received" ? 1 : 0,
          messagesSent: event === "message_sent" ? 1 : 0,
          conversationsStarted: event === "conversation_started" ? 1 : 0,
          automationTriggered: event === "automation_triggered" ? 1 : 0,
          contentGenerated: event === "content_generated" ? 1 : 0,
        },
      })
    }
  } catch (error) {
    console.error("[Analytics] Error tracking event:", error)
  }
}
