"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { InstagramAPI } from "@/lib/instagram-api"

export async function getInstagramPosts(accountId: string) {
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
      mediaType: media.media_type,
      mediaUrl: media.media_url,
      thumbnailUrl: media.thumbnail_url,
      permalink: media.permalink,
      timestamp: media.timestamp,
    }))
  } catch (error) {
    console.error("[Instagram] Failed to fetch posts:", error)
    throw new Error("Failed to fetch Instagram posts")
  }
}

export async function getInstagramStories(accountId: string) {
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

    // Get stories from recent media
    const mediaData = await api.getMediaList(25)

    // Filter for stories (typically media_type === 'STORY' or recent media)
    const stories = mediaData.data
      .filter((media: any) => {
        // Check if media is from last 24 hours (stories expire after 24h)
        const timestamp = new Date(media.timestamp)
        const now = new Date()
        const hoursDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
        return hoursDiff <= 24
      })
      .map((media: any) => ({
        id: media.id,
        caption: media.caption || "Story",
        mediaType: media.media_type,
        mediaUrl: media.media_url,
        thumbnailUrl: media.thumbnail_url,
        timestamp: media.timestamp,
      }))

    return stories
  } catch (error) {
    console.error("[Instagram] Failed to fetch stories:", error)
    throw new Error("Failed to fetch Instagram stories")
  }
}
