import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/instagram/callback`

    const scopes = [
      "instagram_basic",
      "instagram_manage_messages",
      "instagram_manage_comments",
      "instagram_content_publish",
      "pages_show_list",
      "pages_read_engagement",
    ].join(",")

    const oauthUrl =
      `https://api.instagram.com/oauth/authorize?` +
      `client_id=${process.env.INSTAGRAM_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${scopes}&` +
      `response_type=code&` +
      `state=${userId}` // Pass userId as state for verification

    return NextResponse.redirect(oauthUrl)
  } catch (error) {
    console.error("[v0] Error initiating Instagram OAuth:", error)
    return NextResponse.json({ error: "Failed to connect Instagram" }, { status: 500 })
  }
}
