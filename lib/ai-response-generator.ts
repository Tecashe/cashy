import { generateText } from "ai"

interface AIResponseConfig {
  businessDescription?: string
  businessName?: string
  aiInstructions?: string
  aiTone?: string
  aiPersonality?: string
  messageContext: {
    participantName: string
    participantUsername: string
    messageContent: string
    conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>
  }
}

export async function generateAIResponse(config: AIResponseConfig): Promise<string> {
  const {
    businessDescription = "",
    businessName = "our business",
    aiInstructions = "",
    aiTone = "professional",
    aiPersonality = "",
    messageContext,
  } = config

  const systemPrompt = `You are an AI assistant for ${businessName}. 
${businessDescription ? `Business Description: ${businessDescription}` : ""}

Your tone should be: ${aiTone}
${aiPersonality ? `Personality: ${aiPersonality}` : ""}

${aiInstructions ? `Special Instructions: ${aiInstructions}` : ""}

You are responding to Instagram direct messages. Keep responses:
- Concise and friendly (under 150 words)
- Natural and conversational
- Helpful and informative
- Avoid being overly formal or robotic
- Use emojis sparingly and naturally

The customer's name is ${messageContext.participantName} (@${messageContext.participantUsername}).`

  const conversationMessages = messageContext.conversationHistory || []
  const messages = [
    ...conversationMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    {
      role: "user" as const,
      content: messageContext.messageContent,
    },
  ]

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxOutputTokens: 250,
    })

    return text
  } catch (error) {
    console.error("[AIResponseGenerator] Error generating response:", error)
    throw new Error("Failed to generate AI response")
  }
}
