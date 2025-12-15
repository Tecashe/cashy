"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function schedulePost(data: {
  caption: string
  mediaUrls: string[]
  hashtags: string[]
  scheduledFor: Date
  location?: string
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const post = await prisma.contentPost.create({
    data: {
      userId: user.id,
      caption: data.caption,
      mediaUrls: data.mediaUrls,
      hashtags: data.hashtags,
      scheduledFor: data.scheduledFor,
      location: data.location,
      status: "scheduled",
    },
  })

  revalidatePath("/content")
  revalidatePath("/content/calendar")
  return post
}

export async function getScheduledPosts() {
  const { userId } = await auth()
  if (!userId) return []

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return []

  const posts = await prisma.contentPost.findMany({
    where: {
      userId: user.id,
      status: { in: ["draft", "scheduled"] },
    },
    orderBy: { scheduledFor: "asc" },
  })

  return posts
}

export async function deletePost(postId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const post = await prisma.contentPost.findFirst({
    where: { id: postId, userId: user.id },
  })

  if (!post) throw new Error("Post not found")

  await prisma.contentPost.delete({
    where: { id: postId },
  })

  revalidatePath("/content")
  revalidatePath("/content/calendar")
  return { success: true }
}
