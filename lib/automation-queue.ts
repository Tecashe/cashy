import { prisma } from "./db"
import { InstagramAPI } from "./instagram-api"
import { replaceVariables } from "./variable-replacer"

export async function enqueueMessage(data: {
  conversationId: string
  messageContent: string
  recipientId: string
  scheduledFor: Date
  metadata?: any
}) {
  return await prisma.messageQueue.create({
    data: {
      conversationId: data.conversationId,
      messageContent: data.messageContent,
      recipientId: data.recipientId,
      scheduledFor: data.scheduledFor,
      metadata: data.metadata || {},
    },
  })
}
//
export async function processQueuedMessages() {
  const now = new Date()

  const pendingMessages = await prisma.messageQueue.findMany({
    where: {
      status: "pending",
      scheduledFor: {
        lte: now,
      },
    },
    take: 10,
    orderBy: {
      scheduledFor: "asc",
    },
  })

  for (const message of pendingMessages) {
    await processMessage(message)
  }
}

async function processMessage(message: any) {
  try {
    await prisma.messageQueue.update({
      where: { id: message.id },
      data: { status: "processing" },
    })

    const conversation = await prisma.conversation.findUnique({
      where: { id: message.conversationId },
      include: {
        instagramAccount: true,
        user: true,
      },
    })

    if (!conversation) {
      throw new Error("Conversation not found")
    }

    const instagramAPI = new InstagramAPI({
      accessToken: conversation.instagramAccount.accessToken,
      instagramId: conversation.instagramAccount.instagramId,
    })

    const personalizedMessage = replaceVariables(message.messageContent, {
      name: conversation.participantName,
      username: conversation.participantUsername,
      businessName: conversation.user.businessName || undefined,
    })

    await instagramAPI.sendMessage(message.recipientId, personalizedMessage)

    await prisma.message.create({
      data: {
        conversationId: message.conversationId,
        content: personalizedMessage,
        sender: "user",
        isRead: true,
        messageType: "text",
        sentByAutomation: true,
      },
    })

    await prisma.conversation.update({
      where: { id: message.conversationId },
      data: {
        lastMessageText: personalizedMessage,
        lastMessageAt: new Date(),
      },
    })

    await prisma.messageQueue.update({
      where: { id: message.id },
      data: {
        status: "sent",
        processedAt: new Date(),
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const retryCount = message.retryCount + 1

    if (retryCount >= message.maxRetries) {
      await prisma.messageQueue.update({
        where: { id: message.id },
        data: {
          status: "failed",
          error: errorMessage,
          retryCount,
          processedAt: new Date(),
        },
      })
    } else {
      await prisma.messageQueue.update({
        where: { id: message.id },
        data: {
          status: "pending",
          error: errorMessage,
          retryCount,
          scheduledFor: new Date(Date.now() + Math.pow(2, retryCount) * 60000),
        },
      })
    }
  }
}

// Start queue processor (should be called from a cron job or background worker)
export function startQueueProcessor(intervalMs = 10000) {
  setInterval(async () => {
    await processQueuedMessages()
  }, intervalMs)
}
