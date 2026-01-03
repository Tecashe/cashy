import { auth } from "@clerk/nextjs/server"
import { createNotification } from "@/lib/notification-actions"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { title, message, type, actionUrl, data } = await req.json()

    if (!title || !message || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const notification = await createNotification(title, message, type, actionUrl, data)

    return NextResponse.json({ notification }, { status: 201 })
  } catch (error) {
    console.error("[Create Notification Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
