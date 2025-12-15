import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: user.id, isArchived: false },
      include: {
        messages: {
          orderBy: { timestamp: "desc" },
          take: 1,
        },
        conversationTags: {
          include: { tag: true },
        },
      },
      orderBy: { lastMessageAt: "desc" },
    })

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("[v0] Error fetching conversations:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}
