"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { hasFeatureAccess } from "@/lib/subscription"

export async function generateAISuggestions(conversationId: string, userId: string) {
  try {
    // Check subscription access
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true },
    })

    if (!user || !hasFeatureAccess(user.subscriptionTier as any, "aiSuggestions")) {
      return {
        success: false,
        error: "AI Suggestions is a premium feature. Upgrade to access.",
        requiresUpgrade: true,
      }
    }

    // Check if we have cached suggestions
    const existing = await prisma.aISuggestion.findUnique({
      where: { conversationId },
    })

    if (existing && existing.expiresAt > new Date()) {
      return { success: true, suggestions: existing.suggestions, cached: true }
    }

    // Fetch conversation context
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    })

    if (!conversation) {
      return { success: false, error: "Conversation not found" }
    }

    // Get business context
    const businessInfo = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        businessType: true,
        businessName: true,
        aiTone: true,
      },
    })

    // Prepare context for AI
    const context = {
      category: conversation.category,
      customerName: conversation.participantName,
      lastMessages: conversation.messages.map((m) => ({
        from: m.isFromUser ? "customer" : "business",
        content: m.content,
      })),
      businessType: businessInfo?.businessType || "business",
      tone: businessInfo?.aiTone || "professional",
    }

    // TODO: Replace with actual AI API call (OpenAI, Anthropic, etc.)
    // For now, generate rule-based suggestions
    const suggestions = generateRuleBasedSuggestions(context)

    // Cache the suggestions for 5 minutes
    await prisma.aISuggestion.upsert({
      where: { conversationId },
      create: {
        conversationId,
        suggestions,
        context: context as any,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
      update: {
        suggestions,
        context: context as any,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    })

    revalidatePath(`/inbox/${conversationId}`)
    return { success: true, suggestions, cached: false }
  } catch (error) {
    console.error("[v0] Error generating AI suggestions:", error)
    return { success: false, error: "Failed to generate suggestions" }
  }
}

// Helper function for rule-based suggestions (replace with AI later)
function generateRuleBasedSuggestions(context: any): string[] {
  const { category, lastMessages } = context
  const lastCustomerMessage = lastMessages.find((m: any) => m.from === "customer")?.content || ""

  const suggestions: string[] = []

  if (category === "sales") {
    if (lastCustomerMessage.toLowerCase().includes("price")) {
      suggestions.push("Our pricing starts at $X. Would you like me to send you our full pricing details?")
      suggestions.push("Great question! Let me share our pricing options with you.")
    } else {
      suggestions.push("Thanks for your interest! How can I help you today?")
      suggestions.push("I'd be happy to answer any questions you have about our products.")
    }
  } else if (category === "support") {
    suggestions.push("I'm sorry to hear you're experiencing issues. Can you tell me more about what's happening?")
    suggestions.push("Let me help you resolve this right away. What specific problem are you facing?")
  } else if (category === "collaboration") {
    suggestions.push("Thanks for reaching out about a partnership! I'd love to discuss this further.")
    suggestions.push("We're always open to collaborations. Can you share more about what you have in mind?")
  } else {
    suggestions.push("Thanks for your message! How can I assist you today?")
    suggestions.push("I appreciate you reaching out. What can I help you with?")
  }

  // Always add a personalized option
  suggestions.push(`Hi ${context.customerName}! I'll get back to you shortly with all the details.`)

  return suggestions.slice(0, 3) // Return max 3 suggestions
}
