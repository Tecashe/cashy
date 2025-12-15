"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getAISettings() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      businessDescription: true,
      aiEnabled: true,
      aiInstructions: true,
      aiTone: true,
      aiPersonality: true,
    },
  })

  if (!user) throw new Error("User not found")
  return user
}

export async function updateAISettings(data: {
  businessDescription?: string
  aiEnabled?: boolean
  aiInstructions?: string
  aiTone?: string
  aiPersonality?: string
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })
  if (!user) throw new Error("User not found")

  const updated = await prisma.user.update({
    where: { clerkId: userId },
    data: {
      businessDescription: data.businessDescription,
      aiEnabled: data.aiEnabled,
      aiInstructions: data.aiInstructions,
      aiTone: data.aiTone,
      aiPersonality: data.aiPersonality,
    },
  })

  revalidatePath("/settings/ai")
  return updated
}
