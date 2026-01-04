import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/clerk"

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth()

    const { message, config } = await request.json()

    const { enhancedAIHandler } = await import("@/lib/mcp-server-manager")

    const result = await enhancedAIHandler.generateCommerceResponse(
      config,
      {
        conversationId: "test",
        participantName: "Test User",
        participantUsername: "testuser",
        messageText: message,
        conversationHistory: [],
        userTags: [],
      },
      userId
    )

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}