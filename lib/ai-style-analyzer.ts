// lib/ai-style-analyzer.ts
// This analyzes how the business owner talks and teaches AI to mimics it

import Anthropic from "@anthropic-ai/sdk"
import { prisma } from "@/lib/db"

interface StyleProfile {
  avgMessageLength: number
  usesEmojis: boolean
  emojiFrequency: number
  usesPunctuation: string[]
  commonPhrases: string[]
  sentenceStructure: string
  formality: string
  energy: string
}

export class AIStyleAnalyzer {
  private anthropic: Anthropic

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  /**
   * Analyze business owner's messaging style from their past messages
   */
  async analyzeBusinessOwnerStyle(userId: string): Promise<StyleProfile> {
    // Get messages sent BY the business (not AI)
    const businessMessages = await prisma.message.findMany({
      where: {
        conversation: { userId },
        isFromUser: true,
        sentByAI: false, // Only human-written messages
      },
      orderBy: { timestamp: "desc" },
      take: 50, // Last 50 messages
      select: {
        content: true,
      },
    })

    if (businessMessages.length < 5) {
      return this.getDefaultStyle()
    }

    const messages = businessMessages.map((m) => m.content)

    // Basic analysis
    const avgLength = messages.reduce((sum, msg) => sum + msg.length, 0) / messages.length
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
    const hasEmojis = messages.some((msg) => emojiRegex.test(msg))
    const emojiCount = messages.join("").match(emojiRegex)?.length || 0
    const emojiFrequency = emojiCount / messages.length

    // Use Claude to analyze writing style
    const styleAnalysis = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Analyze the writing style of these business messages. Return JSON only.

Messages:
${messages.slice(0, 20).join("\n---\n")}

Return:
{
  "formality": "formal|professional|casual|very_casual",
  "energy": "enthusiastic|friendly|neutral|serious",
  "sentenceStructure": "short_punchy|medium|long_detailed",
  "commonPhrases": ["phrase1", "phrase2", "phrase3"],
  "punctuationStyle": "minimal|moderate|expressive",
  "personalityTraits": ["trait1", "trait2"]
}`,
        },
      ],
    })

   

    const textBlock = styleAnalysis.content.find((block) => block.type === "text")
    const analysisText = textBlock && textBlock.type === "text" ? textBlock.text : "{}"

  const analysis = JSON.parse(analysisText.replace(/```json|```/g, ""))

    return {
      avgMessageLength: avgLength,
      usesEmojis: hasEmojis,
      emojiFrequency,
      usesPunctuation: [analysis.punctuationStyle],
      commonPhrases: analysis.commonPhrases || [],
      sentenceStructure: analysis.sentenceStructure,
      formality: analysis.formality,
      energy: analysis.energy,
    }
  }

  /**
   * Generate style instructions for AI based on analysis
   */
  generateStyleInstructions(styleProfile: StyleProfile, userMessages: string[]): string {
    const instructions = []

    // Message length
    if (styleProfile.avgMessageLength < 50) {
      instructions.push("Keep responses very brief (1-2 sentences, under 50 characters).")
    } else if (styleProfile.avgMessageLength < 150) {
      instructions.push("Keep responses concise (2-3 sentences, around 100 characters).")
    } else {
      instructions.push("Provide detailed responses (3-5 sentences).")
    }

    // Emojis
    if (styleProfile.usesEmojis) {
      if (styleProfile.emojiFrequency > 0.5) {
        instructions.push("Use emojis frequently (1-2 per message). 😊🎉")
      } else {
        instructions.push("Use emojis occasionally (1 every few messages).")
      }
    } else {
      instructions.push("Don't use emojis - keep it professional.")
    }

    // Formality
    switch (styleProfile.formality) {
      case "very_casual":
        instructions.push("Be very casual and friendly - use 'hey', 'yeah', 'gonna', etc.")
        break
      case "casual":
        instructions.push("Be casual but professional - conversational tone.")
        break
      case "professional":
        instructions.push("Be professional and clear.")
        break
      case "formal":
        instructions.push("Be formal and polished.")
        break
    }

    // Energy
    switch (styleProfile.energy) {
      case "enthusiastic":
        instructions.push("Show enthusiasm and excitement!")
        break
      case "friendly":
        instructions.push("Be warm and approachable.")
        break
      case "serious":
        instructions.push("Keep tone serious and focused.")
        break
    }

    // Common phrases
    if (styleProfile.commonPhrases.length > 0) {
      instructions.push(
        `Use these phrases naturally: ${styleProfile.commonPhrases.slice(0, 3).join(", ")}`
      )
    }

    // Examples
    if (userMessages.length > 0) {
      instructions.push("\nHere are examples of how the business owner writes:")
      userMessages.slice(0, 5).forEach((msg, i) => {
        instructions.push(`Example ${i + 1}: "${msg}"`)
      })
      instructions.push("Match this writing style closely.")
    }

    return instructions.join("\n")
  }

  private getDefaultStyle(): StyleProfile {
    return {
      avgMessageLength: 100,
      usesEmojis: false,
      emojiFrequency: 0,
      usesPunctuation: ["moderate"],
      commonPhrases: [],
      sentenceStructure: "medium",
      formality: "professional",
      energy: "friendly",
    }
  }

  /**
   * Cache style profile in database for performance
   */
  async cacheStyleProfile(userId: string): Promise<void> {
    const businessMessages = await prisma.message.findMany({
      where: {
        conversation: { userId },
        isFromUser: true,
        sentByAI: false,
      },
      orderBy: { timestamp: "desc" },
      take: 20,
      select: { content: true },
    })

    const messages = businessMessages.map((m) => m.content)
    const styleProfile = await this.analyzeBusinessOwnerStyle(userId)
    const styleInstructions = this.generateStyleInstructions(styleProfile, messages)

    // Store in user's AI instructions
    await prisma.user.update({
      where: { id: userId },
      data: {
        aiPersonality: styleInstructions,
        updatedAt: new Date(),
      },
    })

    console.log(`[Style Analyzer] Cached style profile for user ${userId}`)
  }
}

// Background job to periodically update style profiles
export async function updateAllStyleProfiles() {
  const analyzer = new AIStyleAnalyzer()

  // Get users with AI enabled who have sent manual messages
  const users = await prisma.user.findMany({
    where: {
      aiEnabled: true,
      conversations: {
        some: {
          messages: {
            some: {
              isFromUser: true,
              sentByAI: false,
            },
          },
        },
      },
    },
    select: { id: true },
  })

  console.log(`[Style Analyzer] Updating style for ${users.length} users`)

  for (const user of users) {
    try {
      await analyzer.cacheStyleProfile(user.id)
      // Rate limit: don't overwhelm API
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`[Style Analyzer] Error for user ${user.id}:`, error)
    }
  }
}