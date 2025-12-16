// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import { revalidatePath } from "next/cache"

// export async function getTags() {
//   const { userId } = await auth()
//   if (!userId) return []

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return []

//   const tags = await prisma.tag.findMany({
//     where: { userId: user.id },
//     include: {
//       _count: {
//         select: { conversationTags: true },
//       },
//     },
//     orderBy: { name: "asc" },
//   })

//   return tags
// }

// export async function createTag(data: { name: string; color?: string }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const tag = await prisma.tag.create({
//     data: {
//       userId: user.id,
//       name: data.name,
//       color: data.color || "#8B5CF6",
//     },
//   })

//   revalidatePath("/tags")
//   return tag
// }

// export async function updateTag(tagId: string, data: { name?: string; color?: string }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const tag = await prisma.tag.findFirst({
//     where: { id: tagId, userId: user.id },
//   })
//   if (!tag) throw new Error("Tag not found")

//   const updated = await prisma.tag.update({
//     where: { id: tagId },
//     data: {
//       name: data.name,
//       color: data.color,
//     },
//   })

//   revalidatePath("/tags")
//   return updated
// }

// export async function deleteTag(tagId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const tag = await prisma.tag.findFirst({
//     where: { id: tagId, userId: user.id },
//   })
//   if (!tag) throw new Error("Tag not found")

//   await prisma.tag.delete({
//     where: { id: tagId },
//   })

//   revalidatePath("/tags")
//   return { success: true }
// }

// export async function addTagToConversation(conversationId: string, tagId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const conversation = await prisma.conversation.findFirst({
//     where: { id: conversationId, userId: user.id },
//   })
//   if (!conversation) throw new Error("Conversation not found")

//   const tag = await prisma.tag.findFirst({
//     where: { id: tagId, userId: user.id },
//   })
//   if (!tag) throw new Error("Tag not found")

//   await prisma.conversationTag.create({
//     data: {
//       conversationId,
//       tagId,
//     },
//   })

//   revalidatePath(`/conversations/${conversationId}`)
//   return { success: true }
// }

// export async function removeTagFromConversation(conversationId: string, tagId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await prisma.conversationTag.delete({
//     where: {
//       conversationId_tagId: {
//         conversationId,
//         tagId,
//       },
//     },
//   })

//   revalidatePath(`/conversations/${conversationId}`)
//   return { success: true }
// }
"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getTags() {
  const { userId } = await auth()
  if (!userId) return []

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return []

  const tags = await prisma.tag.findMany({
    where: { userId: user.id },
    include: {
      _count: {
        select: { conversationTags: true },
      },
    },
    orderBy: { name: "asc" },
  })

  return tags
}

export async function createTag(data: { name: string; color?: string }) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const tag = await prisma.tag.create({
    data: {
      userId: user.id,
      name: data.name,
      color: data.color || "#8B5CF6",
    },
  })

  revalidatePath("/tags")
  return tag
}

export async function updateTag(tagId: string, data: { name?: string; color?: string }) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const tag = await prisma.tag.findFirst({
    where: { id: tagId, userId: user.id },
  })
  if (!tag) throw new Error("Tag not found")

  const updated = await prisma.tag.update({
    where: { id: tagId },
    data: {
      name: data.name,
      color: data.color,
    },
  })

  revalidatePath("/tags")
  return updated
}

export async function deleteTag(tagId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const tag = await prisma.tag.findFirst({
    where: { id: tagId, userId: user.id },
  })
  if (!tag) throw new Error("Tag not found")

  await prisma.tag.delete({
    where: { id: tagId },
  })

  revalidatePath("/tags")
  return { success: true }
}

export async function addTagToConversation(conversationId: string, tagId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: user.id },
  })
  if (!conversation) throw new Error("Conversation not found")

  const tag = await prisma.tag.findFirst({
    where: { id: tagId, userId: user.id },
  })
  if (!tag) throw new Error("Tag not found")

  await prisma.conversationTag.create({
    data: {
      conversationId,
      tagId,
    },
  })

  revalidatePath(`/conversations/${conversationId}`)
  return { success: true }
}

export async function removeTagFromConversation(conversationId: string, tagId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  await prisma.conversationTag.delete({
    where: {
      conversationId_tagId: {
        conversationId,
        tagId,
      },
    },
  })

  revalidatePath(`/conversations/${conversationId}`)
  return { success: true }
}
//PLUTO ADDED