import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { processAutomationTriggers } from "@/lib/automation-engine"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { id } = await params
    const { testMessage } = await request.json()

    // Verify automation ownership
    const automation = await prisma.automation.findFirst({
      where: { id, userId: user.id },
      include: {
        triggers: true,
        actions: { orderBy: { order: "asc" } },
      },
    })

    if (!automation) {
      return NextResponse.json({ error: "Automation not found" }, { status: 404 })
    }

    // Create a test conversation if needed
    let testConversation = await prisma.conversation.findFirst({
      where: {
        userId: user.id,
        participantUsername: "test_user",
      },
    })

    if (!testConversation) {
      testConversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          instagramAccountId: "test",
          participantId: "test_user_id",
          participantName: "Test User",
          participantUsername: "test_user",
          participantAvatar: "/placeholder.svg",
          lastMessageText: testMessage,
          lastMessageAt: new Date(),
        },
      })
    }

    // Trigger the automation with test dat
    await processAutomationTriggers({
      messageContent: testMessage || "Test message",
      senderId: testConversation.participantId,
      senderUsername: testConversation.participantUsername,
      senderName: testConversation.participantName,
      conversationId: testConversation.id,
      messageType: "DM",
      isFirstMessage: false,
      instagramAccountId: "1234587",
    })

    // Get the messages that were sent as part of the automation
    const automationMessages = await prisma.message.findMany({
      where: {
        conversationId: testConversation.id,
        sender: "user",
        timestamp: {
          gte: new Date(Date.now() - 10000), // Last 10 seconds
        },
      },
      orderBy: { timestamp: "asc" },
    })

    return NextResponse.json({
      success: true,
      triggered: automationMessages.length > 0,
      messages: automationMessages,
    })
  } catch (error) {
    console.error("[v0] Error testing automation:", error)
    return NextResponse.json({ error: "Failed to test automation" }, { status: 500 })
  }
}
