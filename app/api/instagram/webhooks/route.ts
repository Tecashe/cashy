import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { processAutomationTriggers } from "@/lib/automation-engine"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  // Verify the webhook subscription
  if (mode === "subscribe" && token === process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
    console.log("[v0] Instagram webhook verified")
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

// Instagram webhook handler for incoming messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Instagram webhook received:", JSON.stringify(body, null, 2))

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const { field, value } = change

        if (field === "messages") {
          const message = value.messages?.[0]
          const senderId = value.sender?.id

          if (message && senderId) {
            await processIncomingMessage(message, senderId)
          }
        }

        if (field === "comments") {
          const comment = value
          await processComment(comment)
        }

        if (field === "story_insights") {
          const reply = value
          await processStoryReply(reply)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

// Process incoming message and check automation triggers
async function processIncomingMessage(message: any, senderId: string) {
  try {
    // Find Instagram account by sender ID
    const instagramAccount = await prisma.instagramAccount.findFirst({
      where: { instagramId: senderId },
    })

    if (!instagramAccount) {
      console.log("[v0] Instagram account not found for sender:", senderId)
      return
    }

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        instagramAccountId: instagramAccount.id,
        participantId: message.from.id,
      },
    })

    const isFirstMessage = !conversation

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          instagramAccountId: instagramAccount.id,
          userId: instagramAccount.userId,
          participantId: message.from.id,
          participantName: message.from.username || "Unknown",
          participantUsername: message.from.username || "unknown",
          participantAvatar: null,
          lastMessageText: message.text,
          lastMessageAt: new Date(message.timestamp),
          unreadCount: 1,
        },
      })
    } else {
      // Update existing conversation
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageText: message.text,
          lastMessageAt: new Date(message.timestamp),
          unreadCount: { increment: 1 },
        },
      })
    }

    // Save message to database
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: message.text,
        sender: "participant",
        isRead: false,
        messageType: "text",
      },
    })

    // Trigger automation engine
    await processAutomationTriggers({
      messageContent: message.text,
      senderId: message.from.id,
      conversationId: conversation.id,
      messageType: "DM",
      isFirstMessage,
    })
  } catch (error) {
    console.error("[v0] Error processing incoming message:", error)
  }
}

async function processComment(comment: any) {
  try {
    const { id: commentId, text, from, media } = comment

    // Find Instagram account that owns this media
    const instagramAccount = await prisma.instagramAccount.findFirst({
      where: { instagramId: media?.id },
    })

    if (!instagramAccount) {
      console.log("[v0] Instagram account not found for media:", media?.id)
      return
    }

    // Find or create conversation with commenter
    let conversation = await prisma.conversation.findFirst({
      where: {
        instagramAccountId: instagramAccount.id,
        participantId: from.id,
      },
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          instagramAccountId: instagramAccount.id,
          userId: instagramAccount.userId,
          participantId: from.id,
          participantName: from.username || "Unknown",
          participantUsername: from.username || "unknown",
          participantAvatar: null,
          lastMessageText: `Commented: ${text}`,
          lastMessageAt: new Date(),
          unreadCount: 0,
        },
      })
    }

    // Check for automations triggered by comments
    await processAutomationTriggers({
      messageContent: text,
      senderId: from.id,
      conversationId: conversation.id,
      messageType: "COMMENT",
      isFirstMessage: false,
    })

    console.log("[v0] Comment processed successfully")
  } catch (error) {
    console.error("[v0] Error processing comment:", error)
  }
}

async function processStoryReply(reply: any) {
  try {
    const { id: replyId, text, from } = reply

    const instagramAccount = await prisma.instagramAccount.findFirst({
      where: { instagramId: from.id },
    })

    if (!instagramAccount) {
      console.log("[v0] Instagram account not found for story reply")
      return
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        instagramAccountId: instagramAccount.id,
        participantId: from.id,
      },
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          instagramAccountId: instagramAccount.id,
          userId: instagramAccount.userId,
          participantId: from.id,
          participantName: from.username || "Unknown",
          participantUsername: from.username || "unknown",
          participantAvatar: null,
          lastMessageText: `Story reply: ${text}`,
          lastMessageAt: new Date(),
          unreadCount: 1,
        },
      })
    }

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: text,
        sender: "participant",
        isRead: false,
        messageType: "story_reply",
      },
    })

    await processAutomationTriggers({
      messageContent: text,
      senderId: from.id,
      conversationId: conversation.id,
      messageType: "STORY_REPLY",
      isFirstMessage: false,
    })

    console.log("[v0] Story reply processed successfully")
  } catch (error) {
    console.error("[v0] Error processing story reply:", error)
  }
}
