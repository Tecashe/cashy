// import { auth } from "@clerk/nextjs/server"
// import { type NextRequest, NextResponse } from "next/server"

// export async function GET(request: NextRequest) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/instagram/callback`

//     const scopes = [
//       "instagram_basic",
//       "instagram_manage_messages",
//       "instagram_manage_comments",
//       "instagram_content_publish",
//       "pages_show_list",
//       "pages_read_engagement",
//     ].join(",")

//     const oauthUrl =
//       `https://api.instagram.com/oauth/authorize?` +
//       `client_id=${process.env.INSTAGRAM_CLIENT_ID}&` +
//       `redirect_uri=${encodeURIComponent(redirectUri)}&` +
//       `scope=${scopes}&` +
//       `response_type=code&` +
//       `state=${userId}` // Pass userId as state for verification

//     return NextResponse.redirect(oauthUrl)
//   } catch (error) {
//     console.error("[v0] Error initiating Instagram OAuth:", error)
//     return NextResponse.json({ error: "Failed to connect Instagram" }, { status: 500 })
//   }
// }


// // app/api/auth/instagram/connect/route.ts
// import { auth } from "@clerk/nextjs/server"
// import { type NextRequest, NextResponse } from "next/server"

// export async function GET(request: NextRequest) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`

//     // Updated scopes for Instagram Business Login
//     const scopes = [
//       "instagram_basic",
//       "instagram_manage_messages",
//       "instagram_manage_comments",
//       "instagram_content_publish",
//       "instagram_manage_insights",
//       "pages_show_list",
//       "pages_read_engagement",
//       "pages_manage_metadata", // Required for webhooks 
//     ].join(",")

//     // Use Facebook OAuth with Instagram permissions
//     const oauthUrl =
//       `https://www.facebook.com/v21.0/dialog/oauth?` +
//       `client_id=${process.env.INSTAGRAM_APP_ID}&` +
//       `redirect_uri=${encodeURIComponent(redirectUri)}&` +
//       `scope=${scopes}&` +
//       `response_type=code&` +
//       `state=${userId}`

//     return NextResponse.redirect(oauthUrl)
//   } catch (error) {
//     console.error("[Instagram OAuth] Error initiating:", error)
//     return NextResponse.json({ error: "Failed to connect Instagram" }, { status: 500 })
//   }
// }



// // app/api/auth/instagram/connect/route.ts
// import { auth } from "@clerk/nextjs/server"
// import { type NextRequest, NextResponse } from "next/server"

// export async function GET(request: NextRequest) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return NextResponse.redirect(new URL("/sign-in", request.url))
//     }

//     // Use Instagram Embedded OAuth URL from environment
//     const instagramOAuthUrl = process.env.INSTAGRAM_EMBEDDED_OAUTH_URL
    
//     if (!instagramOAuthUrl) {
//       console.error("[Instagram OAuth] INSTAGRAM_EMBEDDED_OAUTH_URL not configured")
//       return NextResponse.json(
//         { error: "Instagram OAuth not configured" }, 
//         { status: 500 }
//       )
//     }

//     console.log("[Instagram OAuth] Redirecting to Instagram Embedded OAuth")
//     console.log("[Instagram OAuth] User ID:", userId)
    
//     // Redirect directly to Instagram's embedded OAuth
//     return NextResponse.redirect(instagramOAuthUrl)
//   } catch (error) {
//     console.error("[Instagram OAuth] Error initiating:", error)
//     return NextResponse.json(
//       { error: "Failed to connect Instagram" }, 
//       { status: 500 }
//     )
//   }
// }

// NEW EMBED - app/api/auth/instagram/connect/route.ts


import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    // Use Instagram Embedded OAuth URL from environment
    const instagramOAuthUrl = process.env.INSTAGRAM_EMBEDDED_OAUTH_URL
    
    if (!instagramOAuthUrl) {
      console.error("[Instagram OAuth] INSTAGRAM_EMBEDDED_OAUTH_URL not configured")
      return NextResponse.json(
        { error: "Instagram OAuth not configured" }, 
        { status: 500 }
      )
    }

    console.log("[Instagram OAuth] Redirecting to Instagram Embedded OAuth")
    console.log("[Instagram OAuth] User ID:", userId)
    
    // Redirect directly to Instagram's embedded OAuth
    // This takes the user to Instagram.com to authorize
    return NextResponse.redirect(instagramOAuthUrl)
  } catch (error) {
    console.error("[Instagram OAuth] Error initiating:", error)
    return NextResponse.json(
      { error: "Failed to connect Instagram" }, 
      { status: 500 }
    )
  }
}