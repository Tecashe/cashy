import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { conversationId, content } = await request.json()

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { instagramAccount: true },
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // TODO: Send message via Instagram API (uncomment when ready)
    const response = await fetch(
      `https://graph.instagram.com/v21.0/${conversation.participantId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${conversation.instagramAccount.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient: { id: conversation.participantId },
          message: { text: content }
        })
      }
    )

    // Save message to database
    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
        sender: "user",
        timestamp: new Date(),
        isRead: true,
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

    return NextResponse.json({ message })
  } catch (error) {
    console.error("[v0] Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
