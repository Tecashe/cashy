import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  const instagramAppId = process.env.INSTAGRAM_APP_ID
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`

  const scope = [
    "instagram_basic",
    "instagram_manage_messages",
    "instagram_manage_comments",
    "instagram_manage_insights",
    "instagram_content_publish",
  ].join(",")

  const authUrl = new URL("https://www.facebook.com/v21.0/dialog/oauth")
  authUrl.searchParams.set("client_id", instagramAppId || "")
  authUrl.searchParams.set("redirect_uri", redirectUri)
  authUrl.searchParams.set("scope", scope)
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set("state", userId)

  return NextResponse.redirect(authUrl.toString())
}
