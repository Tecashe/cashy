import { type NextRequest, NextResponse } from "next/server"
import { verifyInstagramWebhook } from "@/lib/webhook-verifier"
import { prisma } from "@/lib/db"
import { processAutomationTriggers } from "@/lib/automation-engine"
//
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN

  if (mode === "subscribe" && token === verifyToken) {
    console.log("[Webhook] Instagram webhook verified")
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse("Forbidden", { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-hub-signature-256")

    if (!signature || !verifyInstagramWebhook(body, signature)) {
      console.error("[Webhook] Invalid signature")
      return new NextResponse("Invalid signature", { status: 401 })
    }

    const data = JSON.parse(body)

    if (data.object === "instagram") {
      for (const entry of data.entry) {
        if (entry.messaging) {
          for (const message of entry.messaging) {
            await handleMessage(message, entry.id)
          }
        }

        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === "comments") {
              await handleComment(change.value, entry.id)
            } else if (change.field === "mentions") {
              await handleMention(change.value, entry.id)
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

async function handleMessage(message: any, instagramAccountId: string) {
  const senderId = message.sender.id
  const recipientId = message.recipient.id
  const messageText = message.message?.text || ""
  const isEcho = message.message?.is_echo || false

  if (isEcho) return

  const instagramAccount = await prisma.instagramAccount.findUnique({
    where: { instagramId: recipientId },
    include: { user: true },
  })

  if (!instagramAccount) {
    console.error("[Webhook] Instagram account not found:", recipientId)
    return
  }

  let conversation = await prisma.conversation.findFirst({
    where: {
      instagramAccountId: instagramAccount.id,
      participantId: senderId,
    },
  })

  const isFirstMessage = !conversation

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        instagramAccountId: instagramAccount.id,
        userId: instagramAccount.userId,
        participantId: senderId,
        participantName: message.sender.name || "Instagram User",
        participantUsername: message.sender.username || senderId,
        participantAvatar: message.sender.profile_pic || null,
        lastMessageText: messageText,
        lastMessageAt: new Date(),
        unreadCount: 1,
      },
    })
  } else {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageText: messageText,
        lastMessageAt: new Date(),
        unreadCount: { increment: 1 },
      },
    })
  }

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      content: messageText,
      sender: "participant",
      isRead: false,
      timestamp: new Date(message.timestamp || Date.now()),
      messageType: message.message?.reply_to ? "story_reply" : "text",
    },
  })

  await prisma.analytics.upsert({
    where: {
      userId_date: {
        userId: instagramAccount.userId,
        date: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
    create: {
      userId: instagramAccount.userId,
      date: new Date(new Date().setHours(0, 0, 0, 0)),
      messagesReceived: 1,
      conversationsStarted: isFirstMessage ? 1 : 0,
    },
    update: {
      messagesReceived: { increment: 1 },
      conversationsStarted: { increment: isFirstMessage ? 1 : 0 },
    },
  })

  await processAutomationTriggers({
    messageContent: messageText,
    senderId,
    senderUsername: message.sender.username || senderId,
    senderName: message.sender.name || "Instagram User",
    conversationId: conversation.id,
    messageType: message.message?.reply_to ? "STORY_REPLY" : "DM",
    isFirstMessage,
    instagramAccountId: instagramAccount.id,
  })
}

async function handleComment(comment: any, instagramAccountId: string) {
  const instagramAccount = await prisma.instagramAccount.findUnique({
    where: { instagramId: instagramAccountId },
    include: { user: true },
  })

  if (!instagramAccount) return

  let conversation = await prisma.conversation.findFirst({
    where: {
      instagramAccountId: instagramAccount.id,
      participantId: comment.from.id,
    },
  })

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        instagramAccountId: instagramAccount.id,
        userId: instagramAccount.userId,
        participantId: comment.from.id,
        participantName: comment.from.username,
        participantUsername: comment.from.username,
        lastMessageText: comment.text,
        lastMessageAt: new Date(),
        unreadCount: 1,
      },
    })
  }

  await processAutomationTriggers({
    messageContent: comment.text,
    senderId: comment.from.id,
    senderUsername: comment.from.username,
    senderName: comment.from.username,
    conversationId: conversation.id,
    messageType: "COMMENT",
    isFirstMessage: false,
    instagramAccountId: instagramAccount.id,
  })
}

async function handleMention(mention: any, instagramAccountId: string) {
  const instagramAccount = await prisma.instagramAccount.findUnique({
    where: { instagramId: instagramAccountId },
    include: { user: true },
  })

  if (!instagramAccount) return

  let conversation = await prisma.conversation.findFirst({
    where: {
      instagramAccountId: instagramAccount.id,
      participantId: mention.from.id,
    },
  })

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        instagramAccountId: instagramAccount.id,
        userId: instagramAccount.userId,
        participantId: mention.from.id,
        participantName: mention.from.username,
        participantUsername: mention.from.username,
        lastMessageText: `Mentioned in story`,
        lastMessageAt: new Date(),
        unreadCount: 1,
      },
    })
  }

  await processAutomationTriggers({
    messageContent: mention.text || "",
    senderId: mention.from.id,
    senderUsername: mention.from.username,
    senderName: mention.from.username,
    conversationId: conversation.id,
    messageType: "MENTION",
    isFirstMessage: false,
    instagramAccountId: instagramAccount.id,
  })
}
