import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { processAutomationTriggers } from "@/lib/automation-engine"
//
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
        instagramAccount: true,
      },
    })

    if (!automation || !automation.instagramAccount) {
      return new NextResponse("Automation or Instagram account not found", { status: 404 })
    }

    const testConversation = await prisma.conversation.findFirst({
      where: {
        userId: user.id,
        instagramAccountId: automation.instagramAccount.id,
      },
      orderBy: { lastMessageAt: "desc" },
    })

    if (!testConversation) {
      return NextResponse.json({
        success: false,
        message: "No conversations found to test with. Connect your Instagram account and receive a message first.",
      })
    }

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

    return NextResponse.json({
      success: true,
      message: "Test automation triggered successfully",
    })
  } catch (error) {
    console.error("[TestAutomation] Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
