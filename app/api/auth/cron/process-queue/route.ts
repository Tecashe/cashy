import { NextResponse } from "next/server"
import { processQueuedMessages } from "@/lib/automation-queue"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    await processQueuedMessages()
    return NextResponse.json({ success: true, timestamp: new Date().toISOString() })
  } catch (error) {
    console.error("[Cron] Queue processing error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
