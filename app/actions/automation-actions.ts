"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createAutomation(data: {
  name: string
  description?: string
  triggerType: string
  triggerConditions: any
  actions: Array<{
    type: string
    content: any
    order: number
  }>
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const automation = await prisma.automation.create({
    data: {
      userId: user.id,
      name: data.name,
      description: data.description,
      status: "draft",
      triggers: {
        create: {
          type: data.triggerType,
          conditions: data.triggerConditions,
          order: 0,
        },
      },
      actions: {
        create: data.actions.map((action) => ({
          type: action.type,
          content: action.content,
          order: action.order,
        })),
      },
    },
    include: {
      triggers: true,
      actions: true,
    },
  })

  revalidatePath("/automations")
  return automation
}

export async function updateAutomation(
  automationId: string,
  data: {
    name?: string
    description?: string
    triggerConditions?: any
    actions?: Array<{
      id?: string
      type: string
      content: any
      order: number
    }>
  },
) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  // Verify ownership
  const automation = await prisma.automation.findFirst({
    where: { id: automationId, userId: user.id },
  })
  if (!automation) throw new Error("Automation not found")

  // Update automation
  const updated = await prisma.automation.update({
    where: { id: automationId },
    data: {
      name: data.name,
      description: data.description,
    },
  })

  // Update actions if provided
  if (data.actions) {
    // Delete old actions
    await prisma.automationAction.deleteMany({
      where: { automationId },
    })

    // Create new actions
    await prisma.automationAction.createMany({
      data: data.actions.map((action) => ({
        automationId,
        type: action.type,
        content: action.content,
        order: action.order,
      })),
    })
  }

  revalidatePath("/automations")
  revalidatePath(`/automations/${automationId}`)
  return updated
}

export async function toggleAutomationStatus(automationId: string, isActive: boolean) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const automation = await prisma.automation.findFirst({
    where: { id: automationId, userId: user.id },
  })
  if (!automation) throw new Error("Automation not found")

  await prisma.automation.update({
    where: { id: automationId },
    data: {
      isActive,
      status: isActive ? "active" : "paused",
    },
  })

  revalidatePath("/automations")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteAutomation(automationId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const automation = await prisma.automation.findFirst({
    where: { id: automationId, userId: user.id },
  })
  if (!automation) throw new Error("Automation not found")

  await prisma.automation.delete({
    where: { id: automationId },
  })

  revalidatePath("/automations")
  return { success: true }
}

export async function getAutomations() {
  const { userId } = await auth()
  if (!userId) return []

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return []

  const automations = await prisma.automation.findMany({
    where: { userId: user.id },
    include: {
      triggers: true,
      actions: { orderBy: { order: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  })

  return automations
}

export async function getAutomation(automationId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const automation = await prisma.automation.findFirst({
    where: { id: automationId, userId: user.id },
    include: {
      triggers: true,
      actions: { orderBy: { order: "asc" } },
    },
  })

  if (!automation) throw new Error("Automation not found")
  return automation
}
