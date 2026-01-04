import { NextResponse } from "next/server"
import { aiResponseHandler } from "@/lib/ai-response-handler"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, config } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Test AI response
    const result = await aiResponseHandler.generateResponse(
      config || {
        model: "claude-sonnet-4-20250514",
        tone: "friendly",
        useKnowledgeBase: false,
        maxTokens: 300,
      },
      {
        conversationId: "test-conversation",
        participantName: "Test User",
        participantUsername: "testuser",
        messageText: message,
        conversationHistory: [],
      },
    )

    return NextResponse.json({
      success: true,
      response: result.response,
      confidence: result.confidence,
      sentiment: result.sentiment,
      provider: process.env.ANTHROPIC_API_KEY ? "anthropic (with deepseek fallback)" : "deepseek only",
    })
  } catch (error: any) {
    console.error("[Test AI] Error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate AI response",
        details: error.message,
        hint: "Check if ANTHROPIC_API_KEY or DEEPSEEK_API_KEY is set in environment variables",
      },
      { status: 500 },
    )
  }
}
