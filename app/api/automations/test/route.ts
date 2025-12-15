import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { processAutomationTriggers } from "@/lib/automation-engine"

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await request.json()
    const { automationId, testMessage } = body

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const automation = await prisma.automation.findFirst({
      where: {
        id: automationId,
        userId: user.id,
      },
      include: {
        triggers: true,
        actions: { orderBy: { order: "asc" } },
        instagramAccount: true,
      },
    })

    if (!automation) {
      return NextResponse.json({
        success: false,
        message: "Automation not found",
      })
    }

    if (!automation.instagramAccount) {
      return NextResponse.json({
        success: false,
        message: "Please connect an Instagram account first",
      })
    }

    // Find or create a test conversation
    let testConversation = await prisma.conversation.findFirst({
      where: {
        userId: user.id,
        instagramAccountId: automation.instagramAccount.id,
        participantUsername: "test_user",
      },
    })

    if (!testConversation) {
      testConversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          instagramAccountId: automation.instagramAccount.id,
          participantId: "test_123456",
          participantUsername: "test_user",
          participantName: "Test User",
          lastMessageText: testMessage || "Test message",
          lastMessageAt: new Date(),
          unreadCount: 0,
        },
      })
    }

    // Process the automation with test data
    await processAutomationTriggers({
      messageContent: testMessage || "Test message",
      senderId: testConversation.participantId,
      senderUsername: testConversation.participantUsername,
      senderName: testConversation.participantName,
      conversationId: testConversation.id,
      messageType: "DM",
      isFirstMessage: false,
      instagramAccountId: automation.instagramAccount.id,
    })

    // Get the messages created during the test
    const messages = await prisma.message.findMany({
      where: { conversationId: testConversation.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    return NextResponse.json({
      success: true,
      message: "Test automation triggered successfully",
      data: {
        automation: {
          name: automation.name,
          trigger: automation.triggers[0]?.type,
          actionsCount: automation.actions.length,
        },
        testConversation: {
          id: testConversation.id,
          participant: testConversation.participantUsername,
        },
        messagesCreated: messages.map((m) => ({
          content: m.content,
          sender: m.sender,
          createdAt: m.createdAt,
        })),
      },
    })
  } catch (error) {
    console.error("[TestAutomation] Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to run test automation",
      },
      { status: 500 }
    )
  }
}