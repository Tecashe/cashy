// import { auth } from "@clerk/nextjs/server"
// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/db"
// import { exchangeTokenForLongLived } from "@/lib/instagram-api"

// export async function GET(request: NextRequest) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return NextResponse.redirect(new URL("/sign-in", request.url))
//     }

//     const searchParams = request.nextUrl.searchParams
//     const code = searchParams.get("code")
//     const state = searchParams.get("state")
//     const error = searchParams.get("error")

//     // Handle OAuth errors
//     if (error) {
//       console.error("[v0] Instagram OAuth error:", error)
//       return NextResponse.redirect(new URL("/settings?error=oauth_denied", request.url))
//     }

//     if (!code) {
//       return NextResponse.redirect(new URL("/settings?error=no_code", request.url))
//     }

//     // Verify state matches userId for security
//     if (state !== userId) {
//       return NextResponse.redirect(new URL("/settings?error=invalid_state", request.url))
//     }

//     const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: new URLSearchParams({
//         client_id: process.env.INSTAGRAM_CLIENT_ID!,
//         client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
//         grant_type: "authorization_code",
//         redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/instagram/callback`,
//         code,
//       }),
//     })

//     if (!tokenResponse.ok) {
//       const errorData = await tokenResponse.json()
//       console.error("[v0] Token exchange failed:", errorData)
//       return NextResponse.redirect(new URL("/settings?error=token_exchange_failed", request.url))
//     }

//     const tokenData = await tokenResponse.json()
//     const { access_token, user_id } = tokenData

//     const longLivedToken = await exchangeTokenForLongLived(access_token)

//     const userInfoResponse = await fetch(
//       `https://graph.instagram.com/v21.0/${user_id}?fields=id,username,name,profile_picture_url,followers_count&access_token=${longLivedToken.access_token}`,
//     )

//     if (!userInfoResponse.ok) {
//       console.error("[v0] Failed to fetch user info")
//       return NextResponse.redirect(new URL("/settings?error=user_info_failed", request.url))
//     }

//     const userInfo = await userInfoResponse.json()

//     let user = await prisma.user.findUnique({ where: { clerkId: userId } })

//     if (!user) {
//       user = await prisma.user.create({
//         data: {
//           clerkId: userId,
//           email: `${userId}@temp.com`, // Temporary, should be updated with real email
//         },
//       })
//     }

//     await prisma.instagramAccount.upsert({
//       where: { instagramId: user_id.toString() },
//       update: {
//         accessToken: longLivedToken.access_token,
//         tokenExpiry: new Date(Date.now() + longLivedToken.expires_in * 1000),
//         isConnected: true,
//         username: userInfo.username,
//         profilePicUrl: userInfo.profile_picture_url,
//         followerCount: userInfo.followers_count || 0,
//       },
//       create: {
//         userId: user.id,
//         instagramId: user_id.toString(),
//         username: userInfo.username,
//         profilePicUrl: userInfo.profile_picture_url,
//         followerCount: userInfo.followers_count || 0,
//         accessToken: longLivedToken.access_token,
//         tokenExpiry: new Date(Date.now() + longLivedToken.expires_in * 1000),
//         isConnected: true,
//       },
//     })

//     return NextResponse.redirect(new URL("/settings?success=connected", request.url))
//   } catch (error) {
//     console.error("[v0] Error in Instagram OAuth callback:", error)
//     return NextResponse.redirect(new URL("/settings?error=connection_failed", request.url))
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { exchangeTokenForLongLived } from "@/lib/instagram-api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  if (error) {
    console.error("[Instagram OAuth] Error:", error)
    return NextResponse.redirect(new URL("/settings/instagram?error=access_denied", request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/settings/instagram?error=no_code", request.url))
  }

  const { userId: clerkUserId } = await auth()

  if (!clerkUserId || clerkUserId !== state) {
    return NextResponse.redirect(new URL("/settings/instagram?error=unauthorized", request.url))
  }

  try {
    const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID || "",
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET || "",
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`,
        code,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error("[Instagram OAuth] Token exchange failed:", errorData)
      return NextResponse.redirect(new URL("/settings/instagram?error=token_exchange_failed", request.url))
    }

    const tokenData = await tokenResponse.json()
    const shortLivedToken = tokenData.access_token
    const instagramUserId = tokenData.user_id

    const longLivedData = await exchangeTokenForLongLived(shortLivedToken)

    const profileResponse = await fetch(
      `https://graph.instagram.com/${instagramUserId}?fields=id,username,account_type,profile_picture_url&access_token=${longLivedData.access_token}`,
    )

    const profileData = await profileResponse.json()

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      return NextResponse.redirect(new URL("/settings/instagram?error=user_not_found", request.url))
    }

    await prisma.instagramAccount.upsert({
      where: { instagramId: instagramUserId },
      create: {
        userId: user.id,
        instagramId: instagramUserId,
        username: profileData.username,
        profilePicUrl: profileData.profile_picture_url,
        accessToken: longLivedData.access_token,
        tokenExpiry: new Date(Date.now() + longLivedData.expires_in * 1000),
        isConnected: true,
      },
      update: {
        accessToken: longLivedData.access_token,
        tokenExpiry: new Date(Date.now() + longLivedData.expires_in * 1000),
        isConnected: true,
        username: profileData.username,
        profilePicUrl: profileData.profile_picture_url,
      },
    })

    return NextResponse.redirect(new URL("/settings/instagram?success=true", request.url))
  } catch (error) {
    console.error("[Instagram OAuth] Error:", error)
    return NextResponse.redirect(new URL("/settings/instagram?error=unknown", request.url))
  }
}
