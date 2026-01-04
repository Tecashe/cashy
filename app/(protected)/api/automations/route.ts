import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const automations = await prisma.automation.findMany({
      where: { userId: user.id },
      include: {
        triggers: true,
        actions: { orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ automations })
  } catch (error) {
    console.error("[v0] Error fetching automations:", error)
    return NextResponse.json({ error: "Failed to fetch automations" }, { status: 500 })
  }
}
