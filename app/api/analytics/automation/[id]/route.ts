import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { id } = await params

    // Verify automation ownership
    const automation = await prisma.automation.findFirst({
      where: { id, userId: user.id },
    })

    if (!automation) {
      return NextResponse.json({ error: "Automation not found" }, { status: 404 })
    }

    // In production, you'd track automation executions in a separate table
    // For now, we'll return simulated analytics
    const analytics = {
      totalTriggers: 45,
      totalExecutions: 43,
      successRate: 95.6,
      averageExecutionTime: "1.2s",
      lastTriggered: new Date(Date.now() - 1000 * 60 * 30),
      triggersOverTime: [
        { date: "2024-01-01", count: 5 },
        { date: "2024-01-02", count: 8 },
        { date: "2024-01-03", count: 12 },
        { date: "2024-01-04", count: 10 },
        { date: "2024-01-05", count: 10 },
      ],
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error("[v0] Error fetching automation analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
