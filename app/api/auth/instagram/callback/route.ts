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

// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import { exchangeTokenForLongLived } from "@/lib/instagram-api"

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
//   const code = searchParams.get("code")
//   const state = searchParams.get("state")
//   const error = searchParams.get("error")

//   if (error) {
//     console.error("[Instagram OAuth] Error:", error)
//     return NextResponse.redirect(new URL("/settings/instagram?error=access_denied", request.url))
//   }

//   if (!code) {
//     return NextResponse.redirect(new URL("/settings/instagram?error=no_code", request.url))
//   }

//   const { userId: clerkUserId } = await auth()

//   if (!clerkUserId || clerkUserId !== state) {
//     return NextResponse.redirect(new URL("/settings/instagram?error=unauthorized", request.url))
//   }

//   try {
//     const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: new URLSearchParams({
//         client_id: process.env.INSTAGRAM_APP_ID || "",
//         client_secret: process.env.INSTAGRAM_CLIENT_SECRET || "",
//         grant_type: "authorization_code",
//         redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`,
//         code,
//       }),
//     })

//     if (!tokenResponse.ok) {
//       const errorData = await tokenResponse.json()
//       console.error("[Instagram OAuth] Token exchange failed:", errorData)
//       return NextResponse.redirect(new URL("/settings/instagram?error=token_exchange_failed", request.url))
//     }

//     const tokenData = await tokenResponse.json()
//     const shortLivedToken = tokenData.access_token
//     const instagramUserId = tokenData.user_id

//     const longLivedData = await exchangeTokenForLongLived(shortLivedToken)

//     const profileResponse = await fetch(
//       `https://graph.instagram.com/${instagramUserId}?fields=id,username,account_type,profile_picture_url&access_token=${longLivedData.access_token}`,
//     )

//     const profileData = await profileResponse.json()

//     const user = await prisma.user.findUnique({
//       where: { clerkId: clerkUserId },
//     })

//     if (!user) {
//       return NextResponse.redirect(new URL("/settings/instagram?error=user_not_found", request.url))
//     }

//     await prisma.instagramAccount.upsert({
//       where: { instagramId: instagramUserId },
//       create: {
//         userId: user.id,
//         instagramId: instagramUserId,
//         username: profileData.username,
//         profilePicUrl: profileData.profile_picture_url,
//         accessToken: longLivedData.access_token,
//         tokenExpiry: new Date(Date.now() + longLivedData.expires_in * 1000),
//         isConnected: true,
//       },
//       update: {
//         accessToken: longLivedData.access_token,
//         tokenExpiry: new Date(Date.now() + longLivedData.expires_in * 1000),
//         isConnected: true,
//         username: profileData.username,
//         profilePicUrl: profileData.profile_picture_url,
//       },
//     })

//     return NextResponse.redirect(new URL("/settings/instagram?success=true", request.url))
//   } catch (error) {
//     console.error("[Instagram OAuth] Error:", error)
//     return NextResponse.redirect(new URL("/settings/instagram?error=unknown", request.url))
//   }
// }
// app/api/auth/instagram/callback/route.ts

// // app/api/auth/instagram/callback/route.ts
// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
//   const code = searchParams.get("code")
//   const state = searchParams.get("state")
//   const error = searchParams.get("error")

//   if (error) {
//     console.error("[Instagram OAuth] Error:", error)
//     return NextResponse.redirect(new URL("/accounts?error=access_denied", request.url))
//   }

//   if (!code) {
//     return NextResponse.redirect(new URL("/accounts?error=no_code", request.url))
//   }

//   const { userId: clerkUserId } = await auth()

//   if (!clerkUserId || clerkUserId !== state) {
//     return NextResponse.redirect(new URL("/accounts?error=unauthorized", request.url))
//   }

//   try {
//     // Step 1: Exchange code for short-lived token
//     const tokenResponse = await fetch(
//       `https://graph.facebook.com/v21.0/oauth/access_token?` +
//       `client_id=${process.env.INSTAGRAM_APP_ID}&` +
//       `client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&` +
//       `code=${code}&` +
//       `redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`
//     )

//     if (!tokenResponse.ok) {
//       const errorData = await tokenResponse.json()
//       console.error("[Instagram OAuth] Token exchange failed:", errorData)
//       return NextResponse.redirect(new URL("/accounts?error=token_exchange_failed", request.url))
//     }

//     const { access_token: shortLivedToken } = await tokenResponse.json()

//     // Step 2: Get Facebook Pages connected to the user
//     const pagesResponse = await fetch(
//       `https://graph.facebook.com/v21.0/me/accounts?access_token=${shortLivedToken}`
//     )

//     const pagesData = await pagesResponse.json()

//     if (!pagesData.data || pagesData.data.length === 0) {
//       return NextResponse.redirect(new URL("/accounts?error=no_pages", request.url))
//     }

//     // Step 3: For each page, get Instagram Business Account
//     const user = await prisma.user.findUnique({
//       where: { clerkId: clerkUserId },
//     })

//     if (!user) {
//       return NextResponse.redirect(new URL("/accounts?error=user_not_found", request.url))
//     }

//     let connectedCount = 0

//     for (const page of pagesData.data) {
//       try {
//         // Get Instagram Business Account ID linked to this page
//         const igAccountResponse = await fetch(
//           `https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
//         )

//         const igAccountData = await igAccountResponse.json()

//         if (!igAccountData.instagram_business_account) {
//           continue // Skip pages without Instagram Business Account
//         }

//         const instagramId = igAccountData.instagram_business_account.id

//         // Step 4: Exchange page token for long-lived token
//         const longLivedResponse = await fetch(
//           `https://graph.facebook.com/v21.0/oauth/access_token?` +
//           `grant_type=fb_exchange_token&` +
//           `client_id=${process.env.INSTAGRAM_APP_ID}&` +
//           `client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&` +
//           `fb_exchange_token=${page.access_token}`
//         )

//         const longLivedData = await longLivedResponse.json()

//         // Step 5: Get Instagram profile info
//         const profileResponse = await fetch(
//           `https://graph.instagram.com/v21.0/${instagramId}?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count&access_token=${longLivedData.access_token}`
//         )

//         const profileData = await profileResponse.json()

//         // Step 6: Store in database
//         await prisma.instagramAccount.upsert({
//           where: { instagramId: instagramId },
//           create: {
//             userId: user.id,
//             instagramId: instagramId,
//             username: profileData.username,
//             profilePicUrl: profileData.profile_picture_url,
//             followerCount: profileData.followers_count || 0,
//             accessToken: longLivedData.access_token,
//             tokenExpiry: new Date(Date.now() + (longLivedData.expires_in || 5184000) * 1000), // 60 days default
//             isConnected: true,
//           },
//           update: {
//             accessToken: longLivedData.access_token,
//             tokenExpiry: new Date(Date.now() + (longLivedData.expires_in || 5184000) * 1000),
//             isConnected: true,
//             username: profileData.username,
//             profilePicUrl: profileData.profile_picture_url,
//             followerCount: profileData.followers_count || 0,
//           },
//         })

//         connectedCount++
//       } catch (error) {
//         console.error(`[Instagram OAuth] Error processing page ${page.id}:`, error)
//         // Continue to next page
//       }
//     }

//     if (connectedCount === 0) {
//       return NextResponse.redirect(new URL("/accounts?error=no_instagram_accounts", request.url))
//     }

//     return NextResponse.redirect(new URL("/accounts?success=true", request.url))
//   } catch (error) {
//     console.error("[Instagram OAuth] Error:", error)
//     return NextResponse.redirect(new URL("/accounts?error=unknown", request.url))
//   }
// }




// // app/api/auth/instagram/callback/route.ts
// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
//   const code = searchParams.get("code")
//   const state = searchParams.get("state")
//   const error = searchParams.get("error")

//   if (error) {
//     console.error("[Instagram OAuth] Error:", error)
//     return NextResponse.redirect(new URL("/accounts?error=access_denied", request.url))
//   }

//   if (!code) {
//     return NextResponse.redirect(new URL("/accounts?error=no_code", request.url))
//   }

//   const { userId: clerkUserId } = await auth()

//   if (!clerkUserId || clerkUserId !== state) {
//     return NextResponse.redirect(new URL("/accounts?error=unauthorized", request.url))
//   }

//   try {
//     // Step 1: Exchange code for short-lived token
//     const formData = new URLSearchParams({
//       client_id: process.env.INSTAGRAM_APP_ID!,
//       client_secret: process.env.INSTAGRAM_APP_SECRET!,
//       grant_type: "authorization_code",
//       redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`,
//       code: code,
//     })

//     const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: formData.toString(),
//     })

//     if (!tokenResponse.ok) {
//       const errorData = await tokenResponse.json()
//       console.error("[Instagram OAuth] Token exchange failed:", errorData)
//       return NextResponse.redirect(new URL("/accounts?error=token_exchange_failed", request.url))
//     }

//     const tokenData = await tokenResponse.json()
//     const { access_token: shortLivedToken, user_id: instagramUserId } = tokenData

//     // Step 2: Exchange for long-lived token
//     const longLivedResponse = await fetch(
//       `https://graph.instagram.com/access_token?` +
//       `grant_type=ig_exchange_token&` +
//       `client_secret=${process.env.INSTAGRAM_APP_SECRET}&` +
//       `access_token=${shortLivedToken}`
//     )

//     if (!longLivedResponse.ok) {
//       const errorData = await longLivedResponse.json()
//       console.error("[Instagram OAuth] Long-lived token exchange failed:", errorData)
//       return NextResponse.redirect(new URL("/accounts?error=token_exchange_failed", request.url))
//     }

//     const longLivedData = await longLivedResponse.json()
//     const { access_token: longLivedToken, expires_in } = longLivedData

//     // Step 3: Get Instagram profile info
//     const profileResponse = await fetch(
//       `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${longLivedToken}`
//     )

//     if (!profileResponse.ok) {
//       const errorData = await profileResponse.json()
//       console.error("[Instagram OAuth] Profile fetch failed:", errorData)
//       return NextResponse.redirect(new URL("/accounts?error=profile_fetch_failed", request.url))
//     }

//     const profileData = await profileResponse.json()

//     // Step 4: Find user
//     const user = await prisma.user.findUnique({
//       where: { clerkId: clerkUserId },
//     })

//     if (!user) {
//       return NextResponse.redirect(new URL("/accounts?error=user_not_found", request.url))
//     }

//     // Step 5: Store in database
//     await prisma.instagramAccount.upsert({
//       where: { instagramId: profileData.id },
//       create: {
//         userId: user.id,
//         instagramId: profileData.id,
//         username: profileData.username,
//         profilePicUrl: null, // Instagram Embedded OAuth doesn't provide this
//         followerCount: 0,
//         accessToken: longLivedToken,
//         tokenExpiry: new Date(Date.now() + expires_in * 1000), // Usually 60 days
//         isConnected: true,
//       },
//       update: {
//         accessToken: longLivedToken,
//         tokenExpiry: new Date(Date.now() + expires_in * 1000),
//         isConnected: true,
//         username: profileData.username,
//       },
//     })

//     console.log("[Instagram OAuth] Successfully connected:", profileData.username)
//     return NextResponse.redirect(new URL("/accounts?success=true", request.url))
//   } catch (error) {
//     console.error("[Instagram OAuth] Error:", error)
//     return NextResponse.redirect(new URL("/accounts?error=unknown", request.url))
//   }
// }


// // app/api/auth/instagram/callback/route.ts
// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import axios from "axios"

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
//   const code = searchParams.get("code")
//   const error = searchParams.get("error")
//   const errorReason = searchParams.get("error_reason")
//   const errorDescription = searchParams.get("error_description")

//   console.log("[Instagram Callback] Received callback with params:", {
//     hasCode: !!code,
//     error,
//     errorReason,
//     errorDescription
//   })

//   if (error) {
//     console.error("[Instagram Callback] OAuth Error:", {
//       error,
//       reason: errorReason,
//       description: errorDescription
//     })
//     return NextResponse.redirect(
//       new URL(`/accounts?error=${error}&reason=${errorReason}`, request.url)
//     )
//   }

//   if (!code) {
//     console.error("[Instagram Callback] No authorization code received")
//     return NextResponse.redirect(new URL("/accounts?error=no_code", request.url))
//   }

//   const { userId: clerkUserId } = await auth()

//   if (!clerkUserId) {
//     console.error("[Instagram Callback] User not authenticated")
//     return NextResponse.redirect(new URL("/accounts?error=unauthorized", request.url))
//   }

//   try {
//     console.log("[Instagram Callback] Exchanging code for access token...")
    
//     // Step 1: Exchange authorization code for short-lived access token
//     const tokenResponse = await axios.post(
//       "https://api.instagram.com/oauth/access_token",
//       new URLSearchParams({
//         client_id: process.env.INSTAGRAM_APP_ID || "",
//         client_secret: process.env.INSTAGRAM_CLIENT_SECRET || "",
//         grant_type: "authorization_code",
//         redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`,
//         code: code,
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     )

//     console.log("[Instagram Callback] Token response received:", {
//       hasAccessToken: !!tokenResponse.data.access_token,
//       userId: tokenResponse.data.user_id,
//     })

//     const { access_token: shortLivedToken, user_id: instagramUserId } = tokenResponse.data

//     // Step 2: Exchange short-lived token for long-lived token
//     console.log("[Instagram Callback] Exchanging for long-lived token...")
    
//     const longLivedResponse = await axios.get(
//       `https://graph.instagram.com/access_token?` +
//       `grant_type=ig_exchange_token&` +
//       `client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&` +
//       `access_token=${shortLivedToken}`
//     )

//     console.log("[Instagram Callback] Long-lived token received:", {
//       expiresIn: longLivedResponse.data.expires_in,
//       tokenType: longLivedResponse.data.token_type,
//     })

//     const { 
//       access_token: longLivedToken, 
//       expires_in: expiresIn 
//     } = longLivedResponse.data

//     // Step 3: Get Instagram profile data
//     console.log("[Instagram Callback] Fetching Instagram profile data...")
    
//     const profileResponse = await axios.get(
//       `https://graph.instagram.com/me?` +
//       `fields=id,username,account_type,media_count,followers_count,follows_count,profile_picture_url&` +
//       `access_token=${longLivedToken}`
//     )

//     console.log("[Instagram Callback] Profile data received:", {
//       id: profileResponse.data.id,
//       username: profileResponse.data.username,
//       accountType: profileResponse.data.account_type,
//     })

//     const profileData = profileResponse.data

//     // Step 4: Find or create user in database
//     const user = await prisma.user.findUnique({
//       where: { clerkId: clerkUserId },
//     })

//     if (!user) {
//       console.error("[Instagram Callback] User not found in database")
//       return NextResponse.redirect(new URL("/accounts?error=user_not_found", request.url))
//     }

//     // Step 5: Calculate token expiry date (60 days for long-lived tokens)
//     const tokenExpiry = new Date()
//     tokenExpiry.setDate(tokenExpiry.getDate() + 60)

//     console.log("[Instagram Callback] Saving to database...", {
//       userId: user.id,
//       instagramId: profileData.id,
//       username: profileData.username,
//       tokenExpiry: tokenExpiry.toISOString(),
//     })

//     // Step 6: Upsert Instagram account in database
//     await prisma.instagramAccount.upsert({
//       where: { instagramId: profileData.id },
//       create: {
//         userId: user.id,
//         instagramId: profileData.id,
//         username: profileData.username,
//         profilePicUrl: profileData.profile_picture_url,
//         followerCount: profileData.followers_count || 0,
//         accessToken: longLivedToken,
//         tokenExpiry: tokenExpiry,
//         isConnected: true,
//       },
//       update: {
//         accessToken: longLivedToken,
//         tokenExpiry: tokenExpiry,
//         isConnected: true,
//         username: profileData.username,
//         profilePicUrl: profileData.profile_picture_url,
//         followerCount: profileData.followers_count || 0,
//       },
//     })

//     console.log("[Instagram Callback] Instagram account saved successfully")

//     // Redirect to success page
//     return NextResponse.redirect(new URL("/accounts?success=true", request.url))
    
//   } catch (error: any) {
//     console.error("[Instagram Callback] Error:", error)
    
//     // Log detailed error information
//     if (axios.isAxiosError(error)) {
//       console.error("[Instagram Callback] API Error Details:", {
//         status: error.response?.status,
//         statusText: error.response?.statusText,
//         data: error.response?.data,
//         message: error.message,
//       })
//     }

//     return NextResponse.redirect(
//       new URL("/accounts?error=connection_failed", request.url)
//     )
//   }
// }

// // NEW EMBED - app/api/auth/instagram/callback/route.ts
// // This file handles the OAuth callback from Instagram

// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import axios from "axios"

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
//   const code = searchParams.get("code")
//   const error = searchParams.get("error")
//   const errorReason = searchParams.get("error_reason")
//   const errorDescription = searchParams.get("error_description")

//   console.log("[Instagram Callback] Received callback with params:", {
//     hasCode: !!code,
//     error,
//     errorReason,
//     errorDescription
//   })

//   // Handle OAuth errors
//   if (error) {
//     console.error("[Instagram Callback] OAuth Error:", {
//       error,
//       reason: errorReason,
//       description: errorDescription
//     })
//     return NextResponse.redirect(
//       new URL(`/accounts?error=${error}&reason=${errorReason}`, request.url)
//     )
//   }

//   // Check for authorization code
//   if (!code) {
//     console.error("[Instagram Callback] No authorization code received")
//     return NextResponse.redirect(new URL("/accounts?error=no_code", request.url))
//   }

//   // Verify user is authenticated
//   const { userId: clerkUserId } = await auth()

//   if (!clerkUserId) {
//     console.error("[Instagram Callback] User not authenticated")
//     return NextResponse.redirect(new URL("/accounts?error=unauthorized", request.url))
//   }

//   try {
//     console.log("[Instagram Callback] Starting token exchange process...")
    
//     // Step 1: Exchange authorization code for short-lived access token
//     console.log("[Instagram Callback] Exchanging code for short-lived token...")
//     const tokenResponse = await axios.post(
//       "https://api.instagram.com/oauth/access_token",
//       new URLSearchParams({
//         client_id: process.env.INSTAGRAM_APP_ID || "",
//         client_secret: process.env.INSTAGRAM_CLIENT_SECRET || "",
//         grant_type: "authorization_code",
//         redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`,
//         code: code,
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     )

//     console.log("[Instagram Callback] Short-lived token received:", {
//       hasAccessToken: !!tokenResponse.data.access_token,
//       userId: tokenResponse.data.user_id,
//     })

//     const { access_token: shortLivedToken, user_id: instagramUserId } = tokenResponse.data

//     // Step 2: Exchange short-lived token for long-lived token (60 days)
//     console.log("[Instagram Callback] Exchanging for long-lived token...")
    
//     const longLivedResponse = await axios.get(
//       `https://graph.instagram.com/access_token?` +
//       `grant_type=ig_exchange_token&` +
//       `client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&` +
//       `access_token=${shortLivedToken}`
//     )

//     console.log("[Instagram Callback] Long-lived token received:", {
//       expiresIn: longLivedResponse.data.expires_in,
//       tokenType: longLivedResponse.data.token_type,
//     })

//     const { 
//       access_token: longLivedToken, 
//       expires_in: expiresIn 
//     } = longLivedResponse.data

//     // Step 3: Get Instagram profile data using the long-lived token
//     console.log("[Instagram Callback] Fetching Instagram profile data...")
    
//     const profileResponse = await axios.get(
//       `https://graph.instagram.com/me?` +
//       `fields=id,username,account_type,media_count,followers_count,follows_count,profile_picture_url&` +
//       `access_token=${longLivedToken}`
//     )

//     console.log("[Instagram Callback] Profile data received:", {
//       id: profileResponse.data.id,
//       username: profileResponse.data.username,
//       accountType: profileResponse.data.account_type,
//       followersCount: profileResponse.data.followers_count,
//     })

//     const profileData = profileResponse.data

//     // Step 4: Find user in database
//     const user = await prisma.user.findUnique({
//       where: { clerkId: clerkUserId },
//     })

//     if (!user) {
//       console.error("[Instagram Callback] User not found in database")
//       return NextResponse.redirect(new URL("/accounts?error=user_not_found", request.url))
//     }

//     // Step 5: Calculate token expiry date
//     // Long-lived tokens last 60 days
//     const tokenExpiry = new Date()
//     tokenExpiry.setDate(tokenExpiry.getDate() + 60)

//     console.log("[Instagram Callback] Saving Instagram account to database...", {
//       userId: user.id,
//       instagramId: profileData.id,
//       username: profileData.username,
//       tokenExpiry: tokenExpiry.toISOString(),
//     })

//     // Step 6: Create or update Instagram account in database
//     await prisma.instagramAccount.upsert({
//       where: { instagramId: profileData.id },
//       create: {
//         userId: user.id,
//         instagramId: profileData.id,
//         username: profileData.username,
//         profilePicUrl: profileData.profile_picture_url || null,
//         followerCount: profileData.followers_count || 0,
//         accessToken: longLivedToken,
//         tokenExpiry: tokenExpiry,
//         isConnected: true,
//       },
//       update: {
//         accessToken: longLivedToken,
//         tokenExpiry: tokenExpiry,
//         isConnected: true,
//         username: profileData.username,
//         profilePicUrl: profileData.profile_picture_url || null,
//         followerCount: profileData.followers_count || 0,
//       },
//     })

//     console.log("[Instagram Callback] Instagram account saved successfully")

//     // Success! Redirect to accounts page with success message
//     return NextResponse.redirect(new URL("/accounts?success=true", request.url))
    
//   } catch (error: any) {
//     console.error("[Instagram Callback] Error during OAuth flow:", error)
    
//     // Log detailed error information for debugging
//     if (axios.isAxiosError(error)) {
//       console.error("[Instagram Callback] API Error Details:", {
//         status: error.response?.status,
//         statusText: error.response?.statusText,
//         data: error.response?.data,
//         message: error.message,
//       })
//     }

//     // Redirect to accounts page with error
//     return NextResponse.redirect(
//       new URL("/accounts?error=connection_failed", request.url)
//     )
//   }
// }

// NEW EMBED - app/api/auth/instagram/callback/route.ts
// This file handles the OAuth callback from Instagram

// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import axios from "axios"

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
//   const code = searchParams.get("code")
//   const error = searchParams.get("error")
//   const errorReason = searchParams.get("error_reason")
//   const errorDescription = searchParams.get("error_description")

//   console.log("[Instagram Callback] Received callback with params:", {
//     hasCode: !!code,
//     error,
//     errorReason,
//     errorDescription
//   })

//   // Handle OAuth errors
//   if (error) {
//     console.error("[Instagram Callback] OAuth Error:", {
//       error,
//       reason: errorReason,
//       description: errorDescription
//     })
//     return NextResponse.redirect(
//       new URL(`/accounts?error=${error}&reason=${errorReason}`, request.url)
//     )
//   }

//   // Check for authorization code
//   if (!code) {
//     console.error("[Instagram Callback] No authorization code received")
//     return NextResponse.redirect(new URL("/accounts?error=no_code", request.url))
//   }

//   // Verify user is authenticated
//   const { userId: clerkUserId } = await auth()

//   if (!clerkUserId) {
//     console.error("[Instagram Callback] User not authenticated")
//     return NextResponse.redirect(new URL("/accounts?error=unauthorized", request.url))
//   }

//   try {
//     console.log("[Instagram Callback] Starting token exchange process...")
    
//     // Build the redirect URI - must match EXACTLY what was sent in the OAuth request
//     const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`
    
//     console.log("[Instagram Callback] Using redirect_uri:", redirectUri)
//     console.log("[Instagram Callback] App ID:", process.env.INSTAGRAM_APP_ID)
    
//     // Step 1: Exchange authorization code for short-lived access token
//     console.log("[Instagram Callback] Exchanging code for short-lived token...")
    
//     // Use form data format (not URLSearchParams)to avoid encoding issues
//     const formData = new FormData()
//     formData.append('client_id', process.env.INSTAGRAM_APP_ID || '')
//     formData.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET || '')
//     formData.append('grant_type', 'authorization_code')
//     formData.append('redirect_uri', redirectUri)
//     formData.append('code', code)
    
//     const tokenResponse = await axios.post(
//       "https://api.instagram.com/oauth/access_token",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     )

//     console.log("[Instagram Callback] Short-lived token received:", {
//       hasAccessToken: !!tokenResponse.data.access_token,
//       userId: tokenResponse.data.user_id,
//     })

//     const { access_token: shortLivedToken, user_id: instagramUserId } = tokenResponse.data

//     // Step 2: Exchange short-lived token for long-lived token (60 days)
//     console.log("[Instagram Callback] Exchanging for long-lived token...")
    
//     const longLivedResponse = await axios.get(
//       `https://graph.instagram.com/access_token?` +
//       `grant_type=ig_exchange_token&` +
//       `client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&` +
//       `access_token=${shortLivedToken}`
//     )

//     console.log("[Instagram Callback] Long-lived token received:", {
//       expiresIn: longLivedResponse.data.expires_in,
//       tokenType: longLivedResponse.data.token_type,
//     })

//     const { 
//       access_token: longLivedToken, 
//       expires_in: expiresIn 
//     } = longLivedResponse.data

//     // Step 3: Get Instagram profile data using the long-lived token
//     console.log("[Instagram Callback] Fetching Instagram profile data...")
    
//     const profileResponse = await axios.get(
//       `https://graph.instagram.com/me?` +
//       `fields=id,username,account_type,media_count,followers_count,follows_count,profile_picture_url&` +
//       `access_token=${longLivedToken}`
//     )

//     console.log("[Instagram Callback] Profile data received:", {
//       id: profileResponse.data.id,
//       username: profileResponse.data.username,
//       accountType: profileResponse.data.account_type,
//       followersCount: profileResponse.data.followers_count,
//     })

//     const profileData = profileResponse.data

//     // Step 4: Find user in database
//     const user = await prisma.user.findUnique({
//       where: { clerkId: clerkUserId },
//     })

//     if (!user) {
//       console.error("[Instagram Callback] User not found in database")
//       return NextResponse.redirect(new URL("/accounts?error=user_not_found", request.url))
//     }

//     // Step 5: Calculate token expiry date
//     // Long-lived tokens last 60 days
//     const tokenExpiry = new Date()
//     tokenExpiry.setDate(tokenExpiry.getDate() + 60)

//     console.log("[Instagram Callback] Saving Instagram account to database...", {
//       userId: user.id,
//       instagramId: profileData.id,
//       username: profileData.username,
//       tokenExpiry: tokenExpiry.toISOString(),
//     })

//     // Step 6: Create or update Instagram account in database
//     await prisma.instagramAccount.upsert({
//       where: { instagramId: profileData.id },
//       create: {
//         userId: user.id,
//         instagramId: profileData.id,
//         username: profileData.username,
//         profilePicUrl: profileData.profile_picture_url || null,
//         followerCount: profileData.followers_count || 0,
//         accessToken: longLivedToken,
//         tokenExpiry: tokenExpiry,
//         isConnected: true,
//       },
//       update: {
//         accessToken: longLivedToken,
//         tokenExpiry: tokenExpiry,
//         isConnected: true,
//         username: profileData.username,
//         profilePicUrl: profileData.profile_picture_url || null,
//         followerCount: profileData.followers_count || 0,
//       },
//     })

//     console.log("[Instagram Callback] Instagram account saved successfully")

//     // Success! Redirect to accounts page with success message
//     return NextResponse.redirect(new URL("/accounts?success=true", request.url))
    
//   } catch (error: any) {
//     console.error("[Instagram Callback] Error during OAuth flow:", error)
    
//     // Log detailed error information for debugging
//     if (axios.isAxiosError(error)) {
//       console.error("[Instagram Callback] API Error Details:", {
//         status: error.response?.status,
//         statusText: error.response?.statusText,
//         data: error.response?.data,
//         message: error.message,
//         config: {
//           url: error.config?.url,
//           method: error.config?.method,
//           data: error.config?.data,
//         }
//       })
//     }

//     // Redirect to accounts page with error
//     return NextResponse.redirect(
//       new URL("/accounts?error=connection_failed", request.url)
//     )
//   }
// }



// NEW EMBED - app/api/auth/instagram/callback/route.ts
// This file handles the OAuth callback from Instagram
// Now simplified since user sync happens in dashboard layout

// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import { ensureUserExists } from "@/lib/actions/user-sync"
// import axios from "axios"

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
//   const code = searchParams.get("code")
//   const error = searchParams.get("error")
//   const errorReason = searchParams.get("error_reason")
//   const errorDescription = searchParams.get("error_description")

//   console.log("[Instagram Callback] Received callback with params:", {
//     hasCode: !!code,
//     error,
//     errorReason,
//     errorDescription
//   })

//   // Handle OAuth errors
//   if (error) {
//     console.error("[Instagram Callback] OAuth Error:", {
//       error,
//       reason: errorReason,
//       description: errorDescription
//     })
//     return NextResponse.redirect(
//       new URL(`/accounts?error=${error}&reason=${errorReason}`, request.url)
//     )
//   }

//   // Check for authorization code
//   if (!code) {
//     console.error("[Instagram Callback] No authorization code received")
//     return NextResponse.redirect(new URL("/accounts?error=no_code", request.url))
//   }

//   // Verify user is authenticated
//   const { userId: clerkUserId } = await auth()

//   if (!clerkUserId) {
//     console.error("[Instagram Callback] User not authenticated")
//     return NextResponse.redirect(new URL("/accounts?error=unauthorized", request.url))
//   }

//   try {
//     console.log("[Instagram Callback] Starting token exchange process...")
    
//     // Build the redirect URI - must match EXACTLY what was sent in the OAuth request
//     const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`
    
//     console.log("[Instagram Callback] Using redirect_uri:", redirectUri)
//     console.log("[Instagram Callback] App ID:", process.env.INSTAGRAM_APP_ID)
    
//     // Step 1: Exchange authorization code for short-lived access token
//     console.log("[Instagram Callback] Exchanging code for short-lived token...")
    
//     // Use form data format to avoid encoding issues
//     const formData = new FormData()
//     formData.append('client_id', process.env.INSTAGRAM_APP_ID || '')
//     formData.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET || '')
//     formData.append('grant_type', 'authorization_code')
//     formData.append('redirect_uri', redirectUri)
//     formData.append('code', code)
    
//     const tokenResponse = await axios.post(
//       "https://api.instagram.com/oauth/access_token",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     )

//     console.log("[Instagram Callback] Short-lived token received:", {
//       hasAccessToken: !!tokenResponse.data.access_token,
//       userId: tokenResponse.data.user_id,
//     })

//     const { access_token: shortLivedToken, user_id: instagramUserId } = tokenResponse.data

//     // Step 2: Exchange short-lived token for long-lived token (60 days)
//     console.log("[Instagram Callback] Exchanging for long-lived token...")
    
//     const longLivedResponse = await axios.get(
//       `https://graph.instagram.com/access_token?` +
//       `grant_type=ig_exchange_token&` +
//       `client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&` +
//       `access_token=${shortLivedToken}`
//     )

//     console.log("[Instagram Callback] Long-lived token received:", {
//       expiresIn: longLivedResponse.data.expires_in,
//       tokenType: longLivedResponse.data.token_type,
//     })

//     const { 
//       access_token: longLivedToken, 
//       expires_in: expiresIn 
//     } = longLivedResponse.data

//     // Step 3: Get Instagram profile data using the long-lived token
//     console.log("[Instagram Callback] Fetching Instagram profile data...")
    
//     const profileResponse = await axios.get(
//       `https://graph.instagram.com/me?` +
//       `fields=id,username,account_type,media_count,followers_count,follows_count,profile_picture_url&` +
//       `access_token=${longLivedToken}`
//     )

//     console.log("[Instagram Callback] Profile data received:", {
//       id: profileResponse.data.id,
//       username: profileResponse.data.username,
//       accountType: profileResponse.data.account_type,
//       followersCount: profileResponse.data.followers_count,
//     })

//     const profileData = profileResponse.data

//     // Step 4: Ensure user exists in database (sync from Clerk if needed)
//     const user = await ensureUserExists(clerkUserId)

//     if (!user) {
//       console.error("[Instagram Callback] Failed to sync user to database")
//       return NextResponse.redirect(new URL("/accounts?error=user_sync_failed", request.url))
//     }

//     console.log("[Instagram Callback] User found/created:", user.id)

//     // Step 5: Calculate token expiry date
//     // Long-lived tokens last 60 days
//     const tokenExpiry = new Date()
//     tokenExpiry.setDate(tokenExpiry.getDate() + 60)

//     console.log("[Instagram Callback] Saving Instagram account to database...", {
//       userId: user.id,
//       instagramId: profileData.id,
//       username: profileData.username,
//       tokenExpiry: tokenExpiry.toISOString(),
//     })

//     // Step 6: Create or update Instagram account in database
//     await prisma.instagramAccount.upsert({
//       where: { instagramId: profileData.id },
//       create: {
//         userId: user.id,
//         instagramId: profileData.id,
//         username: profileData.username,
//         profilePicUrl: profileData.profile_picture_url || null,
//         followerCount: profileData.followers_count || 0,
//         accessToken: longLivedToken,
//         tokenExpiry: tokenExpiry,
//         isConnected: true,
//       },
//       update: {
//         accessToken: longLivedToken,
//         tokenExpiry: tokenExpiry,
//         isConnected: true,
//         username: profileData.username,
//         profilePicUrl: profileData.profile_picture_url || null,
//         followerCount: profileData.followers_count || 0,
//       },
//     })

//     console.log("[Instagram Callback] Instagram account saved successfully")

//     // Success! Redirect to accounts page with success message
//     return NextResponse.redirect(new URL("/accounts?success=true", request.url))
    
//   } catch (error: any) {
//     console.error("[Instagram Callback] Error during OAuth flow:", error)
    
//     // Log detailed error information for debugging
//     if (axios.isAxiosError(error)) {
//       console.error("[Instagram Callback] API Error Details:", {
//         status: error.response?.status,
//         statusText: error.response?.statusText,
//         data: error.response?.data,
//         message: error.message,
//         config: {
//           url: error.config?.url,
//           method: error.config?.method,
//           data: error.config?.data,
//         }
//       })
//     }

//     // Redirect to accounts page with error
//     return NextResponse.redirect(
//       new URL("/accounts?error=connection_failed", request.url)
//     )
//   }
// }



// NEW EMBED - app/api/auth/instagram/callback/route.ts
// Updated to fetch and save Instagram Page ID for webhooks

// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import { ensureUserExists } from "@/lib/actions/user-sync"
// import axios from "axios"

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
//   const code = searchParams.get("code")
//   const error = searchParams.get("error")
//   const errorReason = searchParams.get("error_reason")
//   const errorDescription = searchParams.get("error_description")

//   console.log("[Instagram Callback] Received callback with params:", {
//     hasCode: !!code,
//     error,
//     errorReason,
//     errorDescription
//   })

//   if (error) {
//     console.error("[Instagram Callback] OAuth Error:", { error, reason: errorReason, description: errorDescription })
//     return NextResponse.redirect(new URL(`/accounts?error=${error}&reason=${errorReason}`, request.url))
//   }

//   if (!code) {
//     console.error("[Instagram Callback] No authorization code received")
//     return NextResponse.redirect(new URL("/accounts?error=no_code", request.url))
//   }

//   const { userId: clerkUserId } = await auth()

//   if (!clerkUserId) {
//     console.error("[Instagram Callback] User not authenticated")
//     return NextResponse.redirect(new URL("/accounts?error=unauthorized", request.url))
//   }

//   try {
//     console.log("[Instagram Callback] Starting token exchange process...")
    
//     const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`
    
//     console.log("[Instagram Callback] Using redirect_uri:", redirectUri)
//     console.log("[Instagram Callback] App ID:", process.env.INSTAGRAM_APP_ID)
    
//     // Step 1: Exchange authorization code for short-lived access token
//     console.log("[Instagram Callback] Exchanging code for short-lived token...")
    
//     const formData = new FormData()
//     formData.append('client_id', process.env.INSTAGRAM_APP_ID || '')
//     formData.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET || '')
//     formData.append('grant_type', 'authorization_code')
//     formData.append('redirect_uri', redirectUri)
//     formData.append('code', code)
    
//     const tokenResponse = await axios.post(
//       "https://api.instagram.com/oauth/access_token",
//       formData,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     )

//     console.log("[Instagram Callback] Short-lived token received:", {
//       hasAccessToken: !!tokenResponse.data.access_token,
//       userId: tokenResponse.data.user_id,
//     })

//     const { access_token: shortLivedToken, user_id: instagramUserId } = tokenResponse.data

//     // Step 2: Exchange short-lived token for long-lived token (60 days)
//     console.log("[Instagram Callback] Exchanging for long-lived token...")
    
//     const longLivedResponse = await axios.get(
//       `https://graph.instagram.com/access_token?` +
//       `grant_type=ig_exchange_token&` +
//       `client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&` +
//       `access_token=${shortLivedToken}`
//     )

//     console.log("[Instagram Callback] Long-lived token received:", {
//       expiresIn: longLivedResponse.data.expires_in,
//       tokenType: longLivedResponse.data.token_type,
//     })

//     const { access_token: longLivedToken, expires_in: expiresIn } = longLivedResponse.data

//     // Step 3: Get Instagram profile data
//     console.log("[Instagram Callback] Fetching Instagram profile data...")
    
//     const profileResponse = await axios.get(
//       `https://graph.instagram.com/me?` +
//       `fields=id,username,account_type,media_count,followers_count,follows_count,profile_picture_url&` +
//       `access_token=${longLivedToken}`
//     )

//     console.log("[Instagram Callback] Profile data received:", {
//       id: profileResponse.data.id,
//       username: profileResponse.data.username,
//       accountType: profileResponse.data.account_type,
//       followersCount: profileResponse.data.followers_count,
//     })

//     const profileData = profileResponse.data

//     // Step 4: Get Instagram Business Account info (includes page ID for webhooks)
//     console.log("[Instagram Callback] Fetching Instagram Business Account details...")
    
//     try {
//       // Try to get the connected Facebook Page and Instagram Business Account ID
//       const businessAccountResponse = await axios.get(
//         `https://graph.instagram.com/${profileData.id}?` +
//         `fields=id,username,ig_id&` +
//         `access_token=${longLivedToken}`
//       )
      
//       console.log("[Instagram Callback] Business account data:", businessAccountResponse.data)
      
//       // The ig_id field contains the Instagram Page ID used in webhooks
//       const instagramPageId = businessAccountResponse.data.ig_id || profileData.id
      
//       console.log("[Instagram Callback] Instagram Page ID for webhooks:", instagramPageId)
//     } catch (error) {
//       console.log("[Instagram Callback] Could not fetch ig_id, will use regular ID")
//     }

//     // Step 5: Ensure user exists in database
//     const user = await ensureUserExists(clerkUserId)

//     if (!user) {
//       console.error("[Instagram Callback] Failed to sync user to database")
//       return NextResponse.redirect(new URL("/accounts?error=user_sync_failed", request.url))
//     }

//     console.log("[Instagram Callback] User found/created:", user.id)

//     // Step 6: Calculate token expiry date (60 days)
//     const tokenExpiry = new Date()
//     tokenExpiry.setDate(tokenExpiry.getDate() + 60)

//     console.log("[Instagram Callback] Saving Instagram account to database...", {
//       userId: user.id,
//       instagramId: profileData.id,
//       username: profileData.username,
//       tokenExpiry: tokenExpiry.toISOString(),
//     })

//     // Step 7: Save Instagram account
//     // IMPORTANT: We save the user ID, but webhooks might use a different Page ID
//     // So we need to handle both in the webhook handler
//     await prisma.instagramAccount.upsert({
//       where: { instagramId: profileData.id },
//       create: {
//         userId: user.id,
//         instagramId: profileData.id,
//         username: profileData.username,
//         profilePicUrl: profileData.profile_picture_url || null,
//         followerCount: profileData.followers_count || 0,
//         accessToken: longLivedToken,
//         tokenExpiry: tokenExpiry,
//         isConnected: true,
//       },
//       update: {
//         accessToken: longLivedToken,
//         tokenExpiry: tokenExpiry,
//         isConnected: true,
//         username: profileData.username,
//         profilePicUrl: profileData.profile_picture_url || null,
//         followerCount: profileData.followers_count || 0,
//       },
//     })

//     console.log("[Instagram Callback] ✅ Instagram account saved successfully")
//     console.log("[Instagram Callback] NOTE: Webhooks may use entry.id which could differ from instagramId")

//     return NextResponse.redirect(new URL("/accounts?success=true", request.url))
    
//   } catch (error: any) {
//     console.error("[Instagram Callback] Error during OAuth flow:", error)
    
//     if (axios.isAxiosError(error)) {
//       console.error("[Instagram Callback] API Error Details:", {
//         status: error.response?.status,
//         statusText: error.response?.statusText,
//         data: error.response?.data,
//         message: error.message,
//         config: { url: error.config?.url, method: error.config?.method }
//       })
//     }

//     return NextResponse.redirect(new URL("/accounts?error=connection_failed", request.url))
//   }
// }

// // NEW EMBED - app/api/auth/instagram/callback/route.ts
// // Updated to fetch and save Instagram Page ID for webhooks

// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import { ensureUserExists } from "@/lib/actions/user-sync"
// import axios from "axios"

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
//   const code = searchParams.get("code")
//   const error = searchParams.get("error")
//   const errorReason = searchParams.get("error_reason")
//   const errorDescription = searchParams.get("error_description")

//   console.log("[Instagram Callback] Received callback with params:", {
//     hasCode: !!code,
//     error,
//     errorReason,
//     errorDescription
//   })

//   if (error) {
//     console.error("[Instagram Callback] OAuth Error:", { error, reason: errorReason, description: errorDescription })
//     return NextResponse.redirect(new URL(`/accounts?error=${error}&reason=${errorReason}`, request.url))
//   }

//   if (!code) {
//     console.error("[Instagram Callback] No authorization code received")
//     return NextResponse.redirect(new URL("/accounts?error=no_code", request.url))
//   }

//   const { userId: clerkUserId } = await auth()

//   if (!clerkUserId) {
//     console.error("[Instagram Callback] User not authenticated")
//     return NextResponse.redirect(new URL("/accounts?error=unauthorized", request.url))
//   }

//   try {
//     console.log("[Instagram Callback] Starting token exchange process...")
    
//     const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`
    
//     console.log("[Instagram Callback] Using redirect_uri:", redirectUri)
//     console.log("[Instagram Callback] App ID:", process.env.INSTAGRAM_APP_ID)
    
//     // Step 1: Exchange authorization code for short-lived access token
//     console.log("[Instagram Callback] Exchanging code for short-lived token...")
    
//     const formData = new FormData()
//     formData.append('client_id', process.env.INSTAGRAM_APP_ID || '')
//     formData.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET || '')
//     formData.append('grant_type', 'authorization_code')
//     formData.append('redirect_uri', redirectUri)
//     formData.append('code', code)
    
//     const tokenResponse = await axios.post(
//       "https://api.instagram.com/oauth/access_token",
//       formData,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     )

//     console.log("[Instagram Callback] Short-lived token received:", {
//       hasAccessToken: !!tokenResponse.data.access_token,
//       userId: tokenResponse.data.user_id,
//     })

//     const { access_token: shortLivedToken, user_id: instagramUserId } = tokenResponse.data

//     // Step 2: Exchange short-lived token for long-lived token (60 days)
//     console.log("[Instagram Callback] Exchanging for long-lived token...")
    
//     const longLivedResponse = await axios.get(
//       `https://graph.instagram.com/access_token?` +
//       `grant_type=ig_exchange_token&` +
//       `client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&` +
//       `access_token=${shortLivedToken}`
//     )

//     console.log("[Instagram Callback] Long-lived token received:", {
//       expiresIn: longLivedResponse.data.expires_in,
//       tokenType: longLivedResponse.data.token_type,
//     })

//     const { access_token: longLivedToken, expires_in: expiresIn } = longLivedResponse.data

//     // Step 3: Get Instagram profile data
//     console.log("[Instagram Callback] Fetching Instagram profile data...")
    
//     const profileResponse = await axios.get(
//       `https://graph.instagram.com/me?` +
//       `fields=id,username,account_type,media_count,followers_count,follows_count,profile_picture_url&` +
//       `access_token=${longLivedToken}`
//     )

//     console.log("[Instagram Callback] Profile data received:", {
//       id: profileResponse.data.id,
//       username: profileResponse.data.username,
//       accountType: profileResponse.data.account_type,
//       followersCount: profileResponse.data.followers_count,
//     })

//     const profileData = profileResponse.data

//     // Step 4: Get Instagram Business Account info (includes page ID for webhooks)
//     console.log("[Instagram Callback] Fetching Instagram Business Account details...")
    
//     try {
//       // Try to get the connected Facebook Page and Instagram Business Account ID
//       const businessAccountResponse = await axios.get(
//         `https://graph.instagram.com/${profileData.id}?` +
//         `fields=id,username,ig_id&` +
//         `access_token=${longLivedToken}`
//       )
      
//       console.log("[Instagram Callback] Business account data:", businessAccountResponse.data)
      
//       // The ig_id field contains the Instagram Page ID used in webhooks
//       const instagramPageId = businessAccountResponse.data.ig_id || profileData.id
      
//       console.log("[Instagram Callback] Instagram Page ID for webhooks:", instagramPageId)
//     } catch (error) {
//       console.log("[Instagram Callback] Could not fetch ig_id, will use regular ID")
//     }

//     // Step 5: Ensure user exists in database
//     const user = await ensureUserExists(clerkUserId)

//     if (!user) {
//       console.error("[Instagram Callback] Failed to sync user to database")
//       return NextResponse.redirect(new URL("/accounts?error=user_sync_failed", request.url))
//     }

//     console.log("[Instagram Callback] User found/created:", user.id)

//     // Step 6: Calculate token expiry date (60 days)
//     const tokenExpiry = new Date()
//     tokenExpiry.setDate(tokenExpiry.getDate() + 60)

//     console.log("[Instagram Callback] Saving Instagram account to database...", {
//       userId: user.id,
//       instagramId: profileData.id,
//       username: profileData.username,
//       tokenExpiry: tokenExpiry.toISOString(),
//     })

//     // Step 7: Save Instagram account
//     // IMPORTANT: We save the user ID, but webhooks might use a different Page ID
//     // So we need to handle both in the webhook handler
//     await prisma.instagramAccount.upsert({
//       where: { instagramId: profileData.id },
//       create: {
//         userId: user.id,
//         instagramId: profileData.id,
//         username: profileData.username,
//         profilePicUrl: profileData.profile_picture_url || null,
//         followerCount: profileData.followers_count || 0,
//         accessToken: longLivedToken,
//         tokenExpiry: tokenExpiry,
//         isConnected: true,
//       },
//       update: {
//         accessToken: longLivedToken,
//         tokenExpiry: tokenExpiry,
//         isConnected: true,
//         username: profileData.username,
//         profilePicUrl: profileData.profile_picture_url || null,
//         followerCount: profileData.followers_count || 0,
//       },
//     })

//     console.log("[Instagram Callback] ✅ Instagram account saved successfully")
//     console.log("[Instagram Callback] NOTE: Webhooks may use entry.id which could differ from instagramId")

//     return NextResponse.redirect(new URL("/accounts?success=true", request.url))
    
//   } catch (error: any) {
//     console.error("[Instagram Callback] Error during OAuth flow:", error)
    
//     if (axios.isAxiosError(error)) {
//       console.error("[Instagram Callback] API Error Details:", {
//         status: error.response?.status,
//         statusText: error.response?.statusText,
//         data: error.response?.data,
//         message: error.message,
//         config: { url: error.config?.url, method: error.config?.method }
//       })
//     }

//     return NextResponse.redirect(new URL("/accounts?error=connection_failed", request.url))
//   }
// }

// NEW EMBED - app/api/auth/instagram/callback/route.ts
// Now fetches BOTH User ID and Page ID for webhooks

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { ensureUserExists } from "@/lib/actions/user-sync"
import axios from "axios"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const errorReason = searchParams.get("error_reason")
  const errorDescription = searchParams.get("error_description")

  console.log("[Instagram Callback] Received callback")

  if (error) {
    console.error("[Instagram Callback] OAuth Error:", { error, reason: errorReason })
    return NextResponse.redirect(new URL(`/accounts?error=${error}&reason=${errorReason}`, request.url))
  }

  if (!code) {
    console.error("[Instagram Callback] No authorization code")
    return NextResponse.redirect(new URL("/accounts?error=no_code", request.url))
  }

  const { userId: clerkUserId } = await auth()

  if (!clerkUserId) {
    console.error("[Instagram Callback] User not authenticated")
    return NextResponse.redirect(new URL("/accounts?error=unauthorized", request.url))
  }

  try {
    console.log("[Instagram Callback] Starting OAuth flow...")
    
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`
    
    // Step 1: Exchange code for short-lived token
    console.log("[Instagram Callback] Step 1: Getting short-lived token...")
    
    const formData = new FormData()
    formData.append('client_id', process.env.INSTAGRAM_APP_ID || '')
    formData.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET || '')
    formData.append('grant_type', 'authorization_code')
    formData.append('redirect_uri', redirectUri)
    formData.append('code', code)
    
    const tokenResponse = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    )

    console.log("[Instagram Callback] ✅ Short-lived token received")
    console.log("[Instagram Callback] User ID from token:", tokenResponse.data.user_id)

    const { access_token: shortLivedToken, user_id: instagramUserId } = tokenResponse.data

    // Step 2: Exchange for long-lived token
    console.log("[Instagram Callback] Step 2: Getting long-lived token...")
    
    const longLivedResponse = await axios.get(
      `https://graph.instagram.com/access_token?` +
      `grant_type=ig_exchange_token&` +
      `client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&` +
      `access_token=${shortLivedToken}`
    )

    console.log("[Instagram Callback] ✅ Long-lived token received (expires in", longLivedResponse.data.expires_in, "seconds)")

    const { access_token: longLivedToken } = longLivedResponse.data

    // Step 3: Get profile data
    console.log("[Instagram Callback] Step 3: Getting profile data...")
    
    const profileResponse = await axios.get(
      `https://graph.instagram.com/me?` +
      `fields=id,username,account_type,media_count,followers_count,follows_count,profile_picture_url&` +
      `access_token=${longLivedToken}`
    )

    const profileData = profileResponse.data
    
    console.log("[Instagram Callback] ✅ Profile data received:")
    console.log("[Instagram Callback]   - User ID:", profileData.id)
    console.log("[Instagram Callback]   - Username:", profileData.username)
    console.log("[Instagram Callback]   - Account Type:", profileData.account_type)

    // Step 4: Get Instagram Business Account ID (Page ID used by webhooks)
    console.log("[Instagram Callback] Step 4: Getting Instagram Business Account ID...")
    
    let instagramPageId = null
    
    try {
      // Method 1: Try to get business account info
      const businessResponse = await axios.get(
        `https://graph.facebook.com/v18.0/me/accounts?` +
        `fields=instagram_business_account{id}&` +
        `access_token=${longLivedToken}`
      )
      
      console.log("[Instagram Callback] Business response:", JSON.stringify(businessResponse.data, null, 2))
      
      if (businessResponse.data.data?.[0]?.instagram_business_account?.id) {
        instagramPageId = businessResponse.data.data[0].instagram_business_account.id
        console.log("[Instagram Callback] ✅ Found Page ID from business account:", instagramPageId)
      }
    } catch (error) {
      console.log("[Instagram Callback] Method 1 failed, trying method 2...")
    }
    
    // Method 2: Try direct business account endpoint
    if (!instagramPageId) {
      try {
        const igBusinessResponse = await axios.get(
          `https://graph.instagram.com/${profileData.id}?` +
          `fields=id,username,ig_id&` +
          `access_token=${longLivedToken}`
        )
        
        console.log("[Instagram Callback] IG Business response:", JSON.stringify(igBusinessResponse.data, null, 2))
        
        if (igBusinessResponse.data.ig_id) {
          instagramPageId = igBusinessResponse.data.ig_id
          console.log("[Instagram Callback] ✅ Found Page ID from ig_id:", instagramPageId)
        }
      } catch (error) {
        console.log("[Instagram Callback] Method 2 failed")
      }
    }
    
    // Method 3: Use the user ID as fallback
    if (!instagramPageId) {
      console.log("[Instagram Callback] ⚠️ Could not find separate Page ID, using User ID as fallback")
      instagramPageId = profileData.id
    }
    
    console.log("[Instagram Callback] Final IDs:")
    console.log("[Instagram Callback]   - User ID (for API):", profileData.id)
    console.log("[Instagram Callback]   - Page ID (for webhooks):", instagramPageId)

    // Step 5: Ensure user exists
    console.log("[Instagram Callback] Step 5: Ensuring user exists in database...")
    
    const user = await ensureUserExists(clerkUserId)

    if (!user) {
      console.error("[Instagram Callback] Failed to sync user")
      return NextResponse.redirect(new URL("/accounts?error=user_sync_failed", request.url))
    }

    console.log("[Instagram Callback] ✅ User found/created:", user.id)

    // Step 6: Save Instagram account with BOTH IDs
    console.log("[Instagram Callback] Step 6: Saving Instagram account...")
    
    const tokenExpiry = new Date()
    tokenExpiry.setDate(tokenExpiry.getDate() + 60)

    await prisma.instagramAccount.upsert({
      where: { instagramId: profileData.id },
      create: {
        userId: user.id,
        instagramId: profileData.id,          // User ID for API calls
        instagramPageId: instagramPageId,      // Page ID for webhooks
        username: profileData.username,
        profilePicUrl: profileData.profile_picture_url || null,
        followerCount: profileData.followers_count || 0,
        accessToken: longLivedToken,
        tokenExpiry: tokenExpiry,
        isConnected: true,
      },
      update: {
        accessToken: longLivedToken,
        tokenExpiry: tokenExpiry,
        instagramPageId: instagramPageId,      // Update Page ID too
        isConnected: true,
        username: profileData.username,
        profilePicUrl: profileData.profile_picture_url || null,
        followerCount: profileData.followers_count || 0,
      },
    })

    console.log("[Instagram Callback] ✅ Instagram account saved with both IDs")
    console.log("[Instagram Callback] ✅ OAuth flow complete!")

    return NextResponse.redirect(new URL("/accounts?success=true", request.url))
    
  } catch (error: any) {
    console.error("[Instagram Callback] ❌ Error:", error)
    
    if (axios.isAxiosError(error)) {
      console.error("[Instagram Callback] API Error:", {
        status: error.response?.status,
        data: error.response?.data,
      })
    }

    return NextResponse.redirect(new URL("/accounts?error=connection_failed", request.url))
  }
}