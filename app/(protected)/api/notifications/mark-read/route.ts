import { auth } from "@clerk/nextjs/server"
import { markNotificationAsRead } from "@/lib/notification-actions"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { notificationId } = await req.json()
    if (!notificationId) return NextResponse.json({ error: "Missing notificationId" }, { status: 400 })

    await markNotificationAsRead(notificationId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Mark Notification Read Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
