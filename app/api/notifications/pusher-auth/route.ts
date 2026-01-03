import { auth } from "@clerk/nextjs/server"
import { pusherServer } from "@/lib/pusher"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { socket_id, channel_name } = await req.json()

    const pusherAuth = pusherServer.authorizeChannel(socket_id, channel_name)

    return NextResponse.json(pusherAuth)
  } catch (error) {
    console.error("[Pusher Auth Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
