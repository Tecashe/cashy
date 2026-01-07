// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import { InstagramAPI } from "@/lib/instagram-api"

// export async function getInstagramPosts(accountId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const account = await prisma.instagramAccount.findFirst({
//     where: { id: accountId, userId: user.id },
//   })
//   if (!account) throw new Error("Account not found")

//   try {
//     const api = new InstagramAPI({
//       accessToken: account.accessToken,
//       instagramId: account.instagramId,
//     })

//     const mediaData = await api.getMediaList(50)

//     return mediaData.data.map((media: any) => ({
//       id: media.id,
//       caption: media.caption || "No caption",
//       mediaType: media.media_type,
//       mediaUrl: media.media_url,
//       thumbnailUrl: media.thumbnail_url,
//       permalink: media.permalink,
//       timestamp: media.timestamp,
//     }))
//   } catch (error) {
//     console.error("[Instagram] Failed to fetch posts:", error)
//     throw new Error("Failed to fetch Instagram posts")
//   }
// }

// export async function getInstagramStoriesOLD(accountId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const account = await prisma.instagramAccount.findFirst({
//     where: { id: accountId, userId: user.id },
//   })
//   if (!account) throw new Error("Account not found")

//   try {
//     const api = new InstagramAPI({
//       accessToken: account.accessToken,
//       instagramId: account.instagramId,
//     })

//     // Get stories from recent media
//     const mediaData = await api.getMediaList(25)

//     // Filter for stories (typically media_type === 'STORY' or recent media)
//     const stories = mediaData.data
//       .filter((media: any) => {
//         // Check if media is from last 24 hours (stories expire after 24h)
//         const timestamp = new Date(media.timestamp)
//         const now = new Date()
//         const hoursDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
//         return hoursDiff <= 24
//       })
//       .map((media: any) => ({
//         id: media.id,
//         caption: media.caption || "Story",
//         mediaType: media.media_type,
//         mediaUrl: media.media_url,
//         thumbnailUrl: media.thumbnail_url,
//         timestamp: media.timestamp,
//       }))

//     return stories
//   } catch (error) {
//     console.error("[Instagram] Failed to fetch stories:", error)
//     throw new Error("Failed to fetch Instagram stories")
//   }
// }






// export async function getInstagramMedia(accountId: string, options?: { limit?: number; type?: "posts" | "stories" }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const account = await prisma.instagramAccount.findFirst({
//     where: { id: accountId, userId: user.id },
//   })
//   if (!account) throw new Error("Account not found")

//   try {
//     const api = new InstagramAPI({
//       accessToken: account.accessToken,
//       instagramId: account.instagramId,
//     })

//     const limit = options?.limit || 20
//     const mediaData = await api.getMediaList(limit)

//     return mediaData.data.map((media: any) => ({
//       id: media.id,
//       caption: media.caption || "No caption",
//       mediaType: media.media_type,
//       mediaUrl: media.media_url,
//       thumbnailUrl: media.thumbnail_url,
//       permalink: media.permalink,
//       timestamp: media.timestamp,
//     }))
//   } catch (error) {
//     console.error("[Instagram] Failed to fetch media:", error)
//     // Return mock data if API fails
//     return [
//       {
//         id: "post-1",
//         caption: "Check out our latest product!",
//         mediaType: "IMAGE",
//         thumbnailUrl: "/placeholder.svg?height=100&width=100",
//         permalink: "#",
//         timestamp: new Date().toISOString(),
//       },
//       {
//         id: "post-2",
//         caption: "Behind the scenes of our new campaign",
//         mediaType: "VIDEO",
//         thumbnailUrl: "/placeholder.svg?height=100&width=100",
//         permalink: "#",
//         timestamp: new Date().toISOString(),
//       },
//     ]
//   }
// }

// export async function getInstagramStories(accountId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const account = await prisma.instagramAccount.findFirst({
//     where: { id: accountId, userId: user.id },
//   })
//   if (!account) throw new Error("Account not found")

//   try {
//     const api = new InstagramAPI({
//       accessToken: account.accessToken,
//       instagramId: account.instagramId,
//     })

//     const mediaData = await api.getMediaList(25)

//     const stories = mediaData.data
//       .filter((media: any) => {
//         const timestamp = new Date(media.timestamp)
//         const now = new Date()
//         const hoursDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
//         return hoursDiff <= 24
//       })
//       .map((media: any) => ({
//         id: media.id,
//         caption: media.caption || "Story",
//         mediaType: media.media_type,
//         mediaUrl: media.media_url,
//         thumbnailUrl: media.thumbnail_url,
//         timestamp: media.timestamp,
//       }))

//     return stories
//   } catch (error) {
//     console.error("[Instagram] Failed to fetch stories:", error)
//     return []
//   }
// }


// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import { InstagramAPI } from "@/lib/instagram-api"

// interface InstagramMediaItem {
//   id: string
//   caption?: string
//   media_type: string
//   media_url: string
//   thumbnail_url?: string
//   permalink?: string
//   timestamp: string
// }

// export async function getInstagramPosts(accountId: string): Promise<InstagramMediaItem[]> {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const account = await prisma.instagramAccount.findFirst({
//     where: { id: accountId, userId: user.id },
//   })
//   if (!account) throw new Error("Account not found")

//   try {
//     const api = new InstagramAPI({
//       accessToken: account.accessToken,
//       instagramId: account.instagramId,
//     })

//     const mediaData = await api.getMediaList(50)

//     return mediaData.data.map((media: any) => ({
//       id: media.id,
//       caption: media.caption || "No caption",
//       media_type: media.media_type,
//       media_url: media.media_url,
//       thumbnail_url: media.thumbnail_url,
//       permalink: media.permalink,
//       timestamp: media.timestamp,
//     }))
//   } catch (error) {
//     console.error("[Instagram] Failed to fetch posts:", error)
//     throw new Error("Failed to fetch Instagram posts")
//   }
// }

// export async function getInstagramStories(accountId: string): Promise<InstagramMediaItem[]> {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const account = await prisma.instagramAccount.findFirst({
//     where: { id: accountId, userId: user.id },
//   })
//   if (!account) throw new Error("Account not found")

//   try {
//     const api = new InstagramAPI({
//       accessToken: account.accessToken,
//       instagramId: account.instagramId,
//     })

//     const mediaData = await api.getMediaList(25)

//     const stories = mediaData.data
//       .filter((media: any) => {
//         const timestamp = new Date(media.timestamp)
//         const now = new Date()
//         const hoursDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
//         return hoursDiff <= 24
//       })
//       .map((media: any) => ({
//         id: media.id,
//         caption: media.caption || "Story",
//         media_type: media.media_type,
//         media_url: media.media_url,
//         thumbnail_url: media.thumbnail_url,
//         timestamp: media.timestamp,
//       }))

//     return stories
//   } catch (error) {
//     console.error("[Instagram] Failed to fetch stories:", error)
//     return []
//   }
// }

// export async function getInstagramPostsByIds(accountId: string, postIds: string[]): Promise<InstagramMediaItem[]> {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const account = await prisma.instagramAccount.findFirst({
//     where: { id: accountId, userId: user.id },
//   })
//   if (!account) throw new Error("Account not found")

//   try {
//     const api = new InstagramAPI({
//       accessToken: account.accessToken,
//       instagramId: account.instagramId,
//     })

//     const mediaData = await api.getMediaList(100)

//     const postsMap = new Map(
//       mediaData.data.map((media: any) => [
//         media.id,
//         {
//           id: media.id,
//           caption: media.caption || "No caption",
//           media_type: media.media_type,
//           media_url: media.media_url,
//           thumbnail_url: media.thumbnail_url,
//           permalink: media.permalink,
//           timestamp: media.timestamp,
//         },
//       ]),
//     )

//     // Return posts in the same order as postIds
//     return postIds.map((id) => postsMap.get(id)).filter((post): post is InstagramMediaItem => post !== undefined)
//   } catch (error) {
//     console.error("[Instagram] Failed to fetch posts by IDs:", error)
//     return []
//   }
// }

// export async function getInstagramMedia(
//   accountId: string,
//   options?: { limit?: number; type?: "posts" | "stories" },
// ): Promise<InstagramMediaItem[]> {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const account = await prisma.instagramAccount.findFirst({
//     where: { id: accountId, userId: user.id },
//   })
//   if (!account) throw new Error("Account not found")

//   try {
//     const api = new InstagramAPI({
//       accessToken: account.accessToken,
//       instagramId: account.instagramId,
//     })

//     const limit = options?.limit || 20
//     const mediaData = await api.getMediaList(limit)

//     let filteredData = mediaData.data

//     // Filter by type if specified
//     if (options?.type === "stories") {
//       filteredData = mediaData.data.filter((media: any) => {
//         const timestamp = new Date(media.timestamp)
//         const now = new Date()
//         const hoursDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
//         return hoursDiff <= 24
//       })
//     }

//     return filteredData.map((media: any) => ({
//       id: media.id,
//       caption: media.caption || "No caption",
//       media_type: media.media_type,
//       media_url: media.media_url,
//       thumbnail_url: media.thumbnail_url,
//       permalink: media.permalink,
//       timestamp: media.timestamp,
//     }))
//   } catch (error) {
//     console.error("[Instagram] Failed to fetch media:", error)
//     return []
//   }
// }


"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { InstagramAPI } from "@/lib/instagram-api"

interface InstagramMediaItem {
  id: string
  caption?: string
  media_type: string
  media_url: string
  thumbnail_url?: string
  permalink?: string
  timestamp: string
}

export async function getInstagramPosts(accountId: string): Promise<InstagramMediaItem[]> {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const account = await prisma.instagramAccount.findFirst({
    where: { id: accountId, userId: user.id },
  })
  if (!account) throw new Error("Account not found")

  try {
    const api = new InstagramAPI({
      accessToken: account.accessToken,
      instagramId: account.instagramId,
    })

    const mediaData = await api.getMediaList(50)

    return mediaData.data.map((media: any) => ({
      id: media.id,
      caption: media.caption || "No caption",
      media_type: media.media_type,
      media_url: media.media_url,
      thumbnail_url: media.thumbnail_url,
      permalink: media.permalink,
      timestamp: media.timestamp,
    }))
  } catch (error) {
    console.error("[Instagram] Failed to fetch posts:", error)
    throw new Error("Failed to fetch Instagram posts")
  }
}

export async function getInstagramStories(accountId: string): Promise<InstagramMediaItem[]> {
  console.log("[Instagram Stories] Starting fetch for accountId:", accountId)
  
  const { userId } = await auth()
  if (!userId) {
    console.error("[Instagram Stories] No userId found - unauthorized")
    throw new Error("Unauthorized")
  }
  console.log("[Instagram Stories] Authenticated userId:", userId)

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) {
    console.error("[Instagram Stories] User not found in database")
    throw new Error("User not found")
  }
  console.log("[Instagram Stories] User found, id:", user.id)

  const account = await prisma.instagramAccount.findFirst({
    where: { id: accountId, userId: user.id },
  })
  if (!account) {
    console.error("[Instagram Stories] Account not found for accountId:", accountId, "userId:", user.id)
    throw new Error("Account not found")
  }
  console.log("[Instagram Stories] Account found, instagramId:", account.instagramId)

  try {
    const api = new InstagramAPI({
      accessToken: account.accessToken,
      instagramId: account.instagramId,
    })

    console.log("[Instagram Stories] Calling Instagram API for media list...")
    const mediaData = await api.getMediaList(25)
    console.log("[Instagram Stories] Raw media count from API:", mediaData.data.length)
    console.log("[Instagram Stories] Raw media data:", JSON.stringify(mediaData.data, null, 2))

    const now = new Date()
    console.log("[Instagram Stories] Current time:", now.toISOString())

    const stories = mediaData.data
      .filter((media: any) => {
        const timestamp = new Date(media.timestamp)
        const hoursDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
        const isRecent = hoursDiff <= 24
        
        console.log("[Instagram Stories] Media item:", {
          id: media.id,
          media_type: media.media_type,
          timestamp: media.timestamp,
          hoursDiff: hoursDiff.toFixed(2),
          isRecent
        })
        
        return isRecent
      })
      .map((media: any) => ({
        id: media.id,
        caption: media.caption || "Story",
        media_type: media.media_type,
        media_url: media.media_url,
        thumbnail_url: media.thumbnail_url,
        timestamp: media.timestamp,
      }))

    console.log("[Instagram Stories] Filtered stories count:", stories.length)
    console.log("[Instagram Stories] Final stories data:", JSON.stringify(stories, null, 2))

    return stories
  } catch (error) {
    console.error("[Instagram Stories] API Error details:", error)
    console.error("[Instagram Stories] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return []
  }
}

export async function getInstagramPostsByIds(accountId: string, postIds: string[]): Promise<InstagramMediaItem[]> {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const account = await prisma.instagramAccount.findFirst({
    where: { id: accountId, userId: user.id },
  })
  if (!account) throw new Error("Account not found")

  try {
    const api = new InstagramAPI({
      accessToken: account.accessToken,
      instagramId: account.instagramId,
    })

    const mediaData = await api.getMediaList(100)

    const postsMap = new Map(
      mediaData.data.map((media: any) => [
        media.id,
        {
          id: media.id,
          caption: media.caption || "No caption",
          media_type: media.media_type,
          media_url: media.media_url,
          thumbnail_url: media.thumbnail_url,
          permalink: media.permalink,
          timestamp: media.timestamp,
        },
      ]),
    )

    // Return posts in the same order as postIds
    return postIds.map((id) => postsMap.get(id)).filter((post): post is InstagramMediaItem => post !== undefined)
  } catch (error) {
    console.error("[Instagram] Failed to fetch posts by IDs:", error)
    return []
  }
}

export async function getInstagramMedia(
  accountId: string,
  options?: { limit?: number; type?: "posts" | "stories" },
): Promise<InstagramMediaItem[]> {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const account = await prisma.instagramAccount.findFirst({
    where: { id: accountId, userId: user.id },
  })
  if (!account) throw new Error("Account not found")

  try {
    const api = new InstagramAPI({
      accessToken: account.accessToken,
      instagramId: account.instagramId,
    })

    const limit = options?.limit || 20
    const mediaData = await api.getMediaList(limit)

    let filteredData = mediaData.data

    // Filter by type if specified
    if (options?.type === "stories") {
      filteredData = mediaData.data.filter((media: any) => {
        const timestamp = new Date(media.timestamp)
        const now = new Date()
        const hoursDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
        return hoursDiff <= 24
      })
    }

    return filteredData.map((media: any) => ({
      id: media.id,
      caption: media.caption || "No caption",
      media_type: media.media_type,
      media_url: media.media_url,
      thumbnail_url: media.thumbnail_url,
      permalink: media.permalink,
      timestamp: media.timestamp,
    }))
  } catch (error) {
    console.error("[Instagram] Failed to fetch media:", error)
    return []
  }
}