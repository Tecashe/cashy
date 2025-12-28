// app/api/onboarding/route.ts

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Update user with business profile
    const user = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        businessName: data.businessName,
        businessDescription: data.businessDescription,
        businessType: data.businessType,
        businessIndustry: data.industry || null,
        
        // AI Configuration
        aiEnabled: true,
        aiTone: data.aiTone || 'professional',
        aiPersonality: data.aiPersonality || null,
        aiInstructions: buildAIInstructions(data),
      },
    })

    // Create knowledge documents if provided
    if (data.faqs) {
      await prisma.knowledgeDocument.create({
        data: {
          userId: user.id,
          title: "FAQs",
          content: data.faqs,
          type: "faq",
          tags: ["onboarding", "faq"],
          embedding: [], // Will be populated by background job
        },
      })
    }

    if (data.policies) {
      await prisma.knowledgeDocument.create({
        data: {
          userId: user.id,
          title: "Business Policies",
          content: data.policies,
          type: "policy",
          tags: ["onboarding", "policy"],
          embedding: [],
        },
      })
    }

    // Store API key if BYOK (encrypted)
    if (data.aiProvider === 'byok' && data.anthropicApiKey) {
      const { encrypt } = await import("@/lib/encrypt")
      
      await prisma.integration.create({
        data: {
          userId: user.id,
          type: 'anthropic_api',
          name: 'Anthropic API',
          isActive: true,
          config: {
            encrypted: encrypt(data.anthropicApiKey),
            provider: 'byok',
          },
        },
      })
    }

    // Create default automation based on business type and selected features
    await createDefaultAutomations(user.id, data)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        businessName: user.businessName,
        businessType: user.businessType,
      },
    })
  } catch (error) {
    console.error("[Onboarding] Error:", error)
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    )
  }
}

function buildAIInstructions(data: any): string {
  const instructions = []

  // Base instruction
  instructions.push(`You are an AI assistant for ${data.businessName}.`)
  instructions.push(data.businessDescription)

  // Add feature-specific instructions
  if (data.enableProducts) {
    instructions.push("You can browse the product catalog, recommend products, and help customers make purchases.")
  }

  if (data.enableBooking) {
    instructions.push("You can check availability and book appointments for customers.")
  }

  if (data.enableLeadQual) {
    instructions.push("When talking to new leads, ask qualifying questions to understand their needs and budget.")
  }

  if (data.enableSupport) {
    instructions.push("Answer customer questions using the knowledge base. If you don't know something, create a support ticket.")
  }

  // Add custom personality
  if (data.aiPersonality) {
    instructions.push(data.aiPersonality)
  }

  return instructions.join("\n\n")
}

async function createDefaultAutomations(userId: string, data: any) {
  const instagramAccount = await prisma.instagramAccount.findFirst({
    where: { userId },
  })

  if (!instagramAccount) return

  const automations = []

  // COACH: Welcome + Booking Flow
  if (data.businessType === 'coach' && data.enableBooking) {
    automations.push({
      userId,
      instagramAccountId: instagramAccount.id,
      name: "Welcome & Book Discovery Call",
      description: "Greet new contacts and help them book a discovery call",
      status: "published",
      isActive: true,
      triggers: {
        create: {
          type: "FIRST_MESSAGE",
          conditions: {},
          order: 0,
        },
      },
      actions: {
        create: [
          {
            type: "AI_RESPONSE",
            content: {
              enableBooking: true,
              enableCommerce: false,
              aiTone: data.aiTone,
              systemPrompt: `Warmly welcome the person. Let them know you're ${data.businessName}'s AI assistant. Ask if they'd like to book a free discovery call.`,
            },
            order: 0,
          },
        ],
      },
    })
  }

  // ECOMMERCE: Product Recommendations
  if (data.businessType === 'ecommerce' && data.enableProducts) {
    automations.push({
      userId,
      instagramAccountId: instagramAccount.id,
      name: "Product Assistant",
      description: "Help customers find and buy products",
      status: "published",
      isActive: true,
      triggers: {
        create: {
          type: "DM_RECEIVED",
          conditions: {},
          order: 0,
        },
      },
      actions: {
        create: [
          {
            type: "AI_RESPONSE",
            content: {
              enableCommerce: true,
              enableProductCatalog: true,
              enablePayments: true,
              aiTone: data.aiTone,
              systemPrompt: `You're a helpful shopping assistant for ${data.businessName}. Help customers find products, answer questions, and complete purchases.`,
            },
            order: 0,
          },
        ],
      },
    })
  }

  // SERVICES: Lead Qualification
  if (data.businessType === 'services' && data.enableLeadQual) {
    automations.push({
      userId,
      instagramAccountId: instagramAccount.id,
      name: "Qualify New Leads",
      description: "Ask qualifying questions and schedule consultations",
      status: "published",
      isActive: true,
      triggers: {
        create: {
          type: "FIRST_MESSAGE",
          conditions: {},
          order: 0,
        },
      },
      actions: {
        create: [
          {
            type: "AI_RESPONSE",
            content: {
              enableBooking: data.enableBooking,
              aiTone: data.aiTone,
              systemPrompt: `Ask about their project needs, timeline, and budget. If they're a good fit, offer to schedule a consultation.`,
            },
            order: 0,
          },
        ],
      },
    })
  }

  // Create all automations
  for (const automation of automations) {
    await prisma.automation.create({ data: automation })
  }
}

// ============================================
// GET: Retrieve onboarding status
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        businessName: true,
        businessDescription: true,
        businessType: true,
        businessIndustry: true,
        aiEnabled: true,
        aiTone: true,
        aiPersonality: true,
      },
    })

    const isOnboarded = !!(user?.businessName && user?.businessDescription)

    return NextResponse.json({
      isOnboarded,
      profile: user,
    })
  } catch (error) {
    console.error("[Onboarding] Error:", error)
    return NextResponse.json(
      { error: "Failed to check onboarding status" },
      { status: 500 }
    )
  }
}