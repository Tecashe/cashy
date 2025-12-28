// app/api/automations/from-template/route.ts

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        instagramAccounts: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const instagramAccount = user.instagramAccounts[0]
    if (!instagramAccount) {
      return NextResponse.json(
        { error: "No Instagram account connected" },
        { status: 400 }
      )
    }

    const { templateId, config } = await request.json()

    // Get template name
    const templateNames: Record<string, string> = {
      "coach-welcome": "Welcome & Book Discovery Call",
      "coach-follow-up": "Post-Session Follow-Up",
      "ecom-product-rec": "Product Recommendations",
      "ecom-cart-abandon": "Cart Abandonment Recovery",
      "ecom-order-confirm": "Order Confirmation",
      "service-quote": "Service Quote Request",
      "service-consultation": "Free Consultation Booking",
      "universal-support": "Smart Customer Support",
      "universal-story-reply": "Story Reply Engagement",
    }

    const templateName = templateNames[templateId] || "Untitled Automation"

    // Create automation from template
    const automation = await prisma.automation.create({
      data: {
        userId: user.id,
        instagramAccountId: instagramAccount.id,
        name: templateName,
        description: `Created from ${templateName} template`,
        status: "published",
        isActive: true,
        triggers: {
          create: {
            type: config.trigger.type,
            conditions: config.trigger.conditions || {},
            order: 0,
          },
        },
        actions: {
          create: config.actions.map((action: any, index: number) => ({
            type: action.type,
            content: action.config,
            order: index,
          })),
        },
      },
      include: {
        triggers: true,
        actions: true,
      },
    })

    return NextResponse.json({
      success: true,
      automation: {
        id: automation.id,
        name: automation.name,
        isActive: automation.isActive,
      },
    })
  } catch (error) {
    console.error("[Template] Error creating automation:", error)
    return NextResponse.json(
      { error: "Failed to create automation from template" },
      { status: 500 }
    )
  }
}