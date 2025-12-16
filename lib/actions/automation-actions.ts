// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import { Prisma } from '@prisma/client'
// import { revalidatePath } from "next/cache"

// export async function createAutomation(data: {
//   name: string
//   description?: string
//   instagramAccountId?: string
//   triggerType: string
//   triggerConditions: any
//   actions: Array<{
//     type: string
//     content: any
//     order: number
//   }>
// }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automation = await prisma.automation.create({
//     data: {
//       userId: user.id,
//       name: data.name,
//       description: data.description,
//       instagramAccountId: data.instagramAccountId,
//       status: "draft",
//       triggers: {
//         create: {
//           type: data.triggerType,
//           conditions: data.triggerConditions,
//           order: 0,
//         },
//       },
//       actions: {
//         create: data.actions.map((action) => ({
//           type: action.type,
//           content: action.content,
//           order: action.order,
//         })),
//       },
//     },
//     include: {
//       triggers: true,
//       actions: { orderBy: { order: "asc" } },
//       instagramAccount: true,
//     },
//   })

//   revalidatePath("/automations")
//   return automation
// }

// export async function updateAutomation(
//   automationId: string,
//   data: {
//     name?: string
//     description?: string
//     instagramAccountId?: string
//     triggerType?: string
//     triggerConditions?: any
//     actions?: Array<{
//       id?: string
//       type: string
//       content: any
//       order: number
//     }>
//   },
// ) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automation = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//     include: { triggers: true },
//   })
//   if (!automation) throw new Error("Automation not found")

//   const updated = await prisma.automation.update({
//     where: { id: automationId },
//     data: {
//       name: data.name,
//       description: data.description,
//       instagramAccountId: data.instagramAccountId,
//     },
//   })

//   if (data.triggerType && data.triggerConditions) {
//     await prisma.automationTrigger.deleteMany({
//       where: { automationId },
//     })
//     await prisma.automationTrigger.create({
//       data: {
//         automationId,
//         type: data.triggerType,
//         conditions: data.triggerConditions,
//         order: 0,
//       },
//     })
//   }

//   if (data.actions) {
//     await prisma.automationAction.deleteMany({
//       where: { automationId },
//     })
//     await prisma.automationAction.createMany({
//       data: data.actions.map((action) => ({
//         automationId,
//         type: action.type,
//         content: action.content,
//         order: action.order,
//       })),
//     })
//   }

//   revalidatePath("/automations")
//   revalidatePath(`/automations/${automationId}`)
//   return updated
// }

// export async function toggleAutomationStatus(automationId: string, isActive: boolean) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automation = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//   })
//   if (!automation) throw new Error("Automation not found")

//   await prisma.automation.update({
//     where: { id: automationId },
//     data: {
//       isActive,
//       status: isActive ? "active" : "paused",
//     },
//   })

//   revalidatePath("/automations")
//   revalidatePath("/dashboard")
//   return { success: true }
// }

// export async function deleteAutomation(automationId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automation = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//   })
//   if (!automation) throw new Error("Automation not found")

//   await prisma.automation.delete({
//     where: { id: automationId },
//   })

//   revalidatePath("/automations")
//   return { success: true }
// }

// export async function getAutomations() {
//   const { userId } = await auth()
//   if (!userId) return []

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return []

//   const automations = await prisma.automation.findMany({
//     where: { userId: user.id },
//     include: {
//       triggers: true,
//       actions: { orderBy: { order: "asc" } },
//       instagramAccount: true,
//       _count: {
//         select: { executions: true },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   return automations
// }

// export async function getAutomation(automationId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automation = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//     include: {
//       triggers: true,
//       actions: { orderBy: { order: "asc" } },
//       instagramAccount: true,
//       executions: {
//         orderBy: { executedAt: "desc" },
//         take: 10,
//       },
//     },
//   })

//   if (!automation) throw new Error("Automation not found")
//   return automation
// }

// export async function duplicateAutomation(automationId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const original = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//     include: {
//       triggers: true,
//       actions: { orderBy: { order: "asc" } },
//     },
//   })

//   if (!original) throw new Error("Automation not found")

//   // const duplicate = await prisma.automation.create({
//   //   data: {
//   //     userId: user.id,
//   //     name: `${original.name} (Copy)`,
//   //     description: original.description,
//   //     instagramAccountId: original.instagramAccountId,
//   //     status: "draft",
//   //     isActive: false,
//   //     triggers: {
//   //       create: original.triggers.map((t) => ({
//   //         type: t.type,
//   //         conditions: t.conditions,
//   //         order: t.order,
//   //       })),
//   //     },
//   //     actions: {
//   //       create: original.actions.map((a) => ({
//   //         type: a.type,
//   //         content: a.content,
//   //         order: a.order,
//   //       })),
//   //     },
//   //   },
//   //   include: {
//   //     triggers: true,
//   //     actions: true,
//   //   },
//   // })
  

// const duplicate = await prisma.automation.create({
//     data: {
//       userId: user.id,
//       name: `${original.name} (Copy)`,
//       description: original.description,
//       instagramAccountId: original.instagramAccountId,
//       status: "draft",
//       isActive: false,
//       triggers: {
//         create: original.triggers.map((t) => ({
//           type: t.type,
//           conditions: t.conditions as Prisma.InputJsonValue,
//           order: t.order,
//         })),
//       },
//       actions: {
//         create: original.actions.map((a) => ({
//           type: a.type,
//           content: a.content as Prisma.InputJsonValue,
//           order: a.order,
//         })),
//       },
//     },
//     include: {
//       triggers: true,
//       actions: true,
//     },
//   })

//   revalidatePath("/automations")
//   return duplicate
// }

// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import type { Prisma } from "@prisma/client"
// import { revalidatePath } from "next/cache"

// export async function createAutomation(data: {
//   name: string
//   description?: string
//   instagramAccountId?: string
//   triggerType: string
//   triggerConditions: any
//   actions: Array<{
//     type: string
//     content: any
//     order: number
//   }>
// }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automation = await prisma.automation.create({
//     data: {
//       userId: user.id,
//       name: data.name,
//       description: data.description,
//       instagramAccountId: data.instagramAccountId,
//       status: "draft",
//       triggers: {
//         create: {
//           type: data.triggerType,
//           conditions: data.triggerConditions,
//           order: 0,
//         },
//       },
//       actions: {
//         create: data.actions.map((action) => ({
//           type: action.type,
//           content: action.content,
//           order: action.order,
//         })),
//       },
//     },
//     include: {
//       triggers: true,
//       actions: { orderBy: { order: "asc" } },
//       instagramAccount: true,
//     },
//   })

//   revalidatePath("/automations")
//   return automation
// }

// export async function updateAutomation(
//   automationId: string,
//   data: {
//     name?: string
//     description?: string
//     instagramAccountId?: string
//     triggerType?: string
//     triggerConditions?: any
//     actions?: Array<{
//       id?: string
//       type: string
//       content: any
//       order: number
//     }>
//   },
// ) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automation = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//     include: { triggers: true },
//   })
//   if (!automation) throw new Error("Automation not found")

//   const updated = await prisma.automation.update({
//     where: { id: automationId },
//     data: {
//       name: data.name,
//       description: data.description,
//       instagramAccountId: data.instagramAccountId,
//     },
//   })

//   if (data.triggerType && data.triggerConditions) {
//     await prisma.automationTrigger.deleteMany({
//       where: { automationId },
//     })
//     await prisma.automationTrigger.create({
//       data: {
//         automationId,
//         type: data.triggerType,
//         conditions: data.triggerConditions,
//         order: 0,
//       },
//     })
//   }

//   if (data.actions) {
//     await prisma.automationAction.deleteMany({
//       where: { automationId },
//     })
//     await prisma.automationAction.createMany({
//       data: data.actions.map((action) => ({
//         automationId,
//         type: action.type,
//         content: action.content,
//         order: action.order,
//       })),
//     })
//   }

//   revalidatePath("/automations")
//   revalidatePath(`/automations/${automationId}`)
//   return updated
// }

// export async function toggleAutomationStatus(automationId: string, isActive: boolean) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automation = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//   })
//   if (!automation) throw new Error("Automation not found")

//   await prisma.automation.update({
//     where: { id: automationId },
//     data: {
//       isActive,
//       status: isActive ? "active" : "paused",
//     },
//   })

//   revalidatePath("/automations")
//   revalidatePath("/dashboard")
//   return { success: true }
// }

// export async function deleteAutomation(automationId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automation = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//   })
//   if (!automation) throw new Error("Automation not found")

//   await prisma.automation.delete({
//     where: { id: automationId },
//   })

//   revalidatePath("/automations")
//   return { success: true }
// }

// export async function getAutomations() {
//   const { userId } = await auth()
//   if (!userId) return []

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return []

//   const automations = await prisma.automation.findMany({
//     where: { userId: user.id },
//     include: {
//       triggers: true,
//       actions: { orderBy: { order: "asc" } },
//       instagramAccount: true,
//       _count: {
//         select: { executions: true },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   return automations
// }

// export async function getAutomation(automationId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automation = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//     include: {
//       triggers: true,
//       actions: { orderBy: { order: "asc" } },
//       instagramAccount: true,
//       executions: {
//         orderBy: { executedAt: "desc" },
//         take: 10,
//       },
//     },
//   })

//   if (!automation) throw new Error("Automation not found")
//   return automation
// }

// export async function duplicateAutomation(automationId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const original = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//     include: {
//       triggers: true,
//       actions: { orderBy: { order: "asc" } },
//     },
//   })

//   if (!original) throw new Error("Automation not found")

//   const duplicate = await prisma.automation.create({
//     data: {
//       userId: user.id,
//       name: `${original.name} (Copy)`,
//       description: original.description,
//       instagramAccountId: original.instagramAccountId,
//       status: "draft",
//       isActive: false,
//       triggers: {
//         create: original.triggers.map((t) => ({
//           type: t.type,
//           conditions: t.conditions as Prisma.InputJsonValue,
//           order: t.order,
//         })),
//       },
//       actions: {
//         create: original.actions.map((a) => ({
//           type: a.type,
//           content: a.content as Prisma.InputJsonValue,
//           order: a.order,
//         })),
//       },
//     },
//     include: {
//       triggers: true,
//       actions: true,
//     },
//   })

//   revalidatePath("/automations")
//   return duplicate
// }


// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import type { Prisma } from "@prisma/client"
// import { revalidatePath } from "next/cache"

// export async function createAutomation(data: {
//   name: string
//   description?: string
//   instagramAccountId?: string
//   triggerType: string
//   triggerConditions: any
//   actions: Array<{
//     type: string
//     content: any
//     order: number
//   }>
// }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automation = await prisma.automation.create({
//     data: {
//       userId: user.id,
//       name: data.name,
//       description: data.description,
//       instagramAccountId: data.instagramAccountId,
//       status: "draft",
//       triggers: {
//         create: {
//           type: data.triggerType,
//           conditions: data.triggerConditions,
//           order: 0,
//         },
//       },
//       actions: {
//         create: data.actions.map((action) => ({
//           type: action.type,
//           content: action.content,
//           order: action.order,
//         })),
//       },
//     },
//     include: {
//       triggers: true,
//       actions: { orderBy: { order: "asc" } },
//       instagramAccount: true,
//     },
//   })

//   revalidatePath("/automations")
//   return automation
// }

// export async function updateAutomation(
//   automationId: string,
//   data: {
//     name?: string
//     description?: string
//     instagramAccountId?: string
//     triggerType?: string
//     triggerConditions?: any
//     actions?: Array<{
//       id?: string
//       type: string
//       content: any
//       order: number
//     }>
//   },
// ) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automation = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//     include: { triggers: true },
//   })
//   if (!automation) throw new Error("Automation not found")

//   const updated = await prisma.automation.update({
//     where: { id: automationId },
//     data: {
//       name: data.name,
//       description: data.description,
//       instagramAccountId: data.instagramAccountId,
//     },
//   })

//   if (data.triggerType && data.triggerConditions) {
//     await prisma.automationTrigger.deleteMany({
//       where: { automationId },
//     })
//     await prisma.automationTrigger.create({
//       data: {
//         automationId,
//         type: data.triggerType,
//         conditions: data.triggerConditions,
//         order: 0,
//       },
//     })
//   }

//   if (data.actions) {
//     await prisma.automationAction.deleteMany({
//       where: { automationId },
//     })
//     await prisma.automationAction.createMany({
//       data: data.actions.map((action) => ({
//         automationId,
//         type: action.type,
//         content: action.content,
//         order: action.order,
//       })),
//     })
//   }

//   revalidatePath("/automations")
//   revalidatePath(`/automations/${automationId}`)
//   return updated
// }

// export async function toggleAutomationStatus(automationId: string, isActive: boolean) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automation = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//   })
//   if (!automation) throw new Error("Automation not found")

//   await prisma.automation.update({
//     where: { id: automationId },
//     data: {
//       isActive,
//       status: isActive ? "active" : "paused",
//     },
//   })

//   revalidatePath("/automations")
//   revalidatePath("/dashboard")
//   return { success: true }
// }

// export async function deleteAutomation(automationId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automation = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//   })
//   if (!automation) throw new Error("Automation not found")

//   await prisma.automation.delete({
//     where: { id: automationId },
//   })

//   revalidatePath("/automations")
//   return { success: true }
// }

// export async function getAutomations() {
//   const { userId } = await auth()
//   if (!userId) return []

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return []

//   const automations = await prisma.automation.findMany({
//     where: { userId: user.id },
//     include: {
//       triggers: true,
//       actions: { orderBy: { order: "asc" } },
//       instagramAccount: true,
//       _count: {
//         select: { executions: true },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   return automations
// }

// export async function getAutomation(automationId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const automation = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//     include: {
//       triggers: true,
//       actions: { orderBy: { order: "asc" } },
//       instagramAccount: true,
//       executions: {
//         orderBy: { executedAt: "desc" },
//         take: 10,
//       },
//     },
//   })

//   if (!automation) throw new Error("Automation not found")
//   return automation
// }

// export async function duplicateAutomation(automationId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const original = await prisma.automation.findFirst({
//     where: { id: automationId, userId: user.id },
//     include: {
//       triggers: true,
//       actions: { orderBy: { order: "asc" } },
//     },
//   })

//   if (!original) throw new Error("Automation not found")

//   const duplicate = await prisma.automation.create({
//     data: {
//       userId: user.id,
//       name: `${original.name} (Copy)`,
//       description: original.description,
//       instagramAccountId: original.instagramAccountId,
//       status: "draft",
//       isActive: false,
//       triggers: {
//         create: original.triggers.map((t) => ({
//           type: t.type,
//           conditions: t.conditions as Prisma.InputJsonValue,
//           order: t.order,
//         })),
//       },
//       actions: {
//         create: original.actions.map((a) => ({
//           type: a.type,
//           content: a.content as Prisma.InputJsonValue,
//           order: a.order,
//         })),
//       },
//     },
//     include: {
//       triggers: true,
//       actions: true,
//     },
//   })

//   revalidatePath("/automations")
//   return duplicate
// }















"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import type { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function createAutomation(data: {
  name: string
  description?: string
  instagramAccountId?: string
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
      instagramAccountId: data.instagramAccountId,
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
      actions: { orderBy: { order: "asc" } },
      instagramAccount: true,
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
    instagramAccountId?: string
    triggerType?: string
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

  const automation = await prisma.automation.findFirst({
    where: { id: automationId, userId: user.id },
    include: { triggers: true },
  })
  if (!automation) throw new Error("Automation not found")

  const updated = await prisma.automation.update({
    where: { id: automationId },
    data: {
      name: data.name,
      description: data.description,
      instagramAccountId: data.instagramAccountId,
    },
  })

  if (data.triggerType && data.triggerConditions) {
    await prisma.automationTrigger.deleteMany({
      where: { automationId },
    })
    await prisma.automationTrigger.create({
      data: {
        automationId,
        type: data.triggerType,
        conditions: data.triggerConditions,
        order: 0,
      },
    })
  }

  if (data.actions) {
    await prisma.automationAction.deleteMany({
      where: { automationId },
    })
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
      instagramAccount: true,
      _count: {
        select: { executions: true },
      },
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
      instagramAccount: true,
      executions: {
        orderBy: { executedAt: "desc" },
        take: 10,
      },
    },
  })

  if (!automation) throw new Error("Automation not found")
  return automation
}

export async function duplicateAutomation(automationId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const original = await prisma.automation.findFirst({
    where: { id: automationId, userId: user.id },
    include: {
      triggers: true,
      actions: { orderBy: { order: "asc" } },
    },
  })

  if (!original) throw new Error("Automation not found")

  const duplicate = await prisma.automation.create({
    data: {
      userId: user.id,
      name: `${original.name} (Copy)`,
      description: original.description,
      instagramAccountId: original.instagramAccountId,
      status: "draft",
      isActive: false,
      triggers: {
        create: original.triggers.map((t) => ({
          type: t.type,
          conditions: t.conditions as Prisma.InputJsonValue,
          order: t.order,
        })),
      },
      actions: {
        create: original.actions.map((a) => ({
          type: a.type,
          content: a.content as Prisma.InputJsonValue,
          order: a.order,
        })),
      },
    },
    include: {
      triggers: true,
      actions: true,
    },
  })

  revalidatePath("/automations")
  return duplicate
}

//PLUTO ADDED