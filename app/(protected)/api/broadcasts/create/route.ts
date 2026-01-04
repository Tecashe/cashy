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

    const { message, targetType, tags } = await request.json()

    // Get conversations based on target type
    let conversations

    if (targetType === "all") {
      conversations = await prisma.conversation.findMany({
        where: { userId: user.id, isArchived: false },
        include: { instagramAccount: true },
      })
    } else if (targetType === "tagged" && tags && tags.length > 0) {
      conversations = await prisma.conversation.findMany({
        where: {
          userId: user.id,
          isArchived: false,
          conversationTags: {
            some: {
              tagId: { in: tags },
            },
          },
        },
        include: { instagramAccount: true },
      })
    } else {
      return NextResponse.json({ error: "Invalid target type" }, { status: 400 })
    }

    // Send message to all conversations
    const results = []
    for (const conversation of conversations) {
      try {
        // TODO: Send via Instagram API (commented out for now)
        // await fetch(
        //   `https://graph.instagram.com/v21.0/${conversation.participantId}/messages`,
        //   {
        //     method: 'POST',
        //     headers: {
        //       'Authorization': `Bearer ${conversation.instagramAccount.accessToken}`,
        //       'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //       recipient: { id: conversation.participantId },
        //       message: { text: message }
        //     })
        //   }
        // )

        // Save message to database
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            content: message,
            sender: "user",
            isRead: true,
            messageType: "text",
          },
        })

        await prisma.conversation.update({
          where: { id: conversation.id },
          data: {
            lastMessageText: message,
            lastMessageAt: new Date(),
          },
        })

        results.push({ conversationId: conversation.id, success: true })
      } catch (error) {
        results.push({ conversationId: conversation.id, success: false, error: String(error) })
      }
    }

    return NextResponse.json({
      success: true,
      totalSent: results.filter((r) => r.success).length,
      totalFailed: results.filter((r) => !r.success).length,
      results,
    })
  } catch (error) {
    console.error("[v0] Error creating broadcast:", error)
    return NextResponse.json({ error: "Failed to create broadcast" }, { status: 500 })
  }
}
