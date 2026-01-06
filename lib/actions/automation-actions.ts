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

// export async function checkDuplicateAutomations(data: {
//   instagramAccountId: string
//   triggerType: string
//   triggerConditions: any
// }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const existingAutomations = await prisma.automation.findMany({
//     where: {
//       userId: user.id,
//       instagramAccountId: data.instagramAccountId,
//       isActive: true,
//     },
//     include: {
//       triggers: true,
//     },
//   })

//   const duplicates = existingAutomations.filter((auto) => {
//     const trigger = auto.triggers[0]
//     if (!trigger || trigger.type !== data.triggerType) return false

//     const existingConditions = trigger.conditions as any
//     const newConditions = data.triggerConditions

//     if (data.triggerType === "comment" || data.triggerType === "story_reply") {
//       const existingPostIds = existingConditions?.postIds || []
//       const newPostIds = newConditions?.postIds || []

//       if (existingPostIds.length === 0 && newPostIds.length === 0) {
//         return true
//       }

//       const overlap = existingPostIds.some((id: string) => newPostIds.includes(id))
//       return overlap
//     }

//     if (data.triggerType === "keyword") {
//       const existingKeywords = existingConditions?.keywords || []
//       const newKeywords = newConditions?.keywords || []
//       const overlap = existingKeywords.some((k: string) => newKeywords.includes(k))
//       return overlap
//     }

//     return trigger.type === data.triggerType
//   })

//   return {
//     hasDuplicates: duplicates.length > 0,
//     duplicates: duplicates.map((auto) => ({
//       id: auto.id,
//       name: auto.name,
//     })),
//   }
// }

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

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import type { InputJsonValue } from "@prisma/client/runtime/library"

// Helper function to calculate execution stats from executions array
async function calculateAutomationStats(automationId: string) {
  const executions = await prisma.automationExecution.findMany({
    where: { automationId },
    select: { status: true, executedAt: true },
  })

  const total = executions.length
  const successful = executions.filter((e) => e.status === "success").length
  const failed = executions.filter((e) => e.status === "failed").length

  return { total, successful, failed }
}

export async function getAutomations() {
  try {
    const { userId } = await auth()

    if (!userId) {
      console.log("[v0] No userId from auth")
      throw new Error("Unauthorized")
    }

    console.log("[v0] Fetching automations for Clerk user:", userId)

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      console.log("[v0] User not found, creating new user...")
      const newUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: "",
          firstName: "",
          lastName: "",
          imageUrl: "",
        },
        select: { id: true },
      })
      return []
    }

    console.log("[v0] Found user, fetching automations for user ID:", user.id)

    const automations = await prisma.automation.findMany({
      where: { userId: user.id, status: { not: "trash" } },
      include: {
        instagramAccount: {
          select: {
            id: true,
            username: true,
            profilePicUrl: true,
            followerCount: true,
          },
        },
        triggers: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            type: true,
            conditions: true,
            order: true,
          },
        },
        actions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            type: true,
            content: true,
            order: true,
          },
        },
        executions: {
          orderBy: { executedAt: "desc" },
          take: 100,
          select: {
            id: true,
            status: true,
            executedAt: true,
            completedAt: true,
            error: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const automationsWithStats = automations.map((automation) => {
      const stats = {
        total: automation.executions.length,
        successful: automation.executions.filter((e) => e.status === "success").length,
        failed: automation.executions.filter((e) => e.status === "failed").length,
      }
      return { ...automation, stats }
    })

    console.log("[v0] Fetched", automationsWithStats.length, "automations")
    return automationsWithStats
  } catch (error) {
    console.error("[v0] Error fetching automations:", error)
    throw error
  }
}

export async function getAutomationById(id: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      throw new Error("User not found")
    }

    const automation = await prisma.automation.findUnique({
      where: { id },
      include: {
        instagramAccount: true,
        triggers: { orderBy: { order: "asc" } },
        actions: { orderBy: { order: "asc" } },
        executions: { orderBy: { executedAt: "desc" } },
      },
    })

    if (!automation || automation.userId !== user.id) {
      return null
    }

    const stats = {
      total: automation.executions.length,
      successful: automation.executions.filter((e) => e.status === "success").length,
      failed: automation.executions.filter((e) => e.status === "failed").length,
    }

    return { ...automation, stats }
  } catch (error) {
    console.error("[v0] Error fetching automation:", error)
    return null
  }
}

export async function toggleAutomationStatus(automationId: string, isActive: boolean) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      throw new Error("User not found")
    }

    const automation = await prisma.automation.update({
      where: { id: automationId },
      data: { isActive },
      include: {
        instagramAccount: true,
        triggers: true,
        actions: true,
        executions: true,
      },
    })

    if (!automation || automation.userId !== user.id) {
      throw new Error("Automation not found")
    }

    revalidatePath("/automations")
    return automation
  } catch (error) {
    console.error("[v0] Error toggling automation:", error)
    throw new Error("Failed to update automation status")
  }
}

export async function deleteAutomation(automationId: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      throw new Error("User not found")
    }

    await moveToTrash(automationId)

    revalidatePath("/automations")
  } catch (error) {
    console.error("[v0] Error deleting automation:", error)
    throw new Error("Failed to delete automation")
  }
}

export async function duplicateAutomation(automationId: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      throw new Error("User not found")
    }

    const original = await prisma.automation.findUnique({
      where: { id: automationId },
      include: {
        triggers: true,
        actions: true,
      },
    })

    if (!original || original.userId !== user.id) {
      throw new Error("Automation not found")
    }

    const duplicated = await prisma.automation.create({
      data: {
        userId: user.id,
        instagramAccountId: original.instagramAccountId,
        name: `${original.name} (Copy)`,
        description: original.description,
        status: "draft",
        isActive: false,
        triggers: {
          createMany: {
            data: original.triggers.map((t) => ({
              type: t.type,
              conditions: (t.conditions || {}) as InputJsonValue,
              order: t.order,
            })),
          },
        },
        actions: {
          createMany: {
            data: original.actions.map((a) => ({
              type: a.type,
              content: (a.content || {}) as InputJsonValue,
              order: a.order,
            })),
          },
        },
      },
      include: {
        triggers: true,
        actions: true,
        instagramAccount: true,
      },
    })

    revalidatePath("/automations")
    return duplicated
  } catch (error) {
    console.error("[v0] Error duplicating automation:", error)
    throw new Error("Failed to duplicate automation")
  }
}

export async function getInstagramAccounts() {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      throw new Error("User not found")
    }

    const accounts = await prisma.instagramAccount.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        username: true,
        profilePicUrl: true,
        followerCount: true,
        isConnected: true,
      },
    })
    return accounts
  } catch (error) {
    console.error("[v0] Error fetching accounts:", error)
    return []
  }
}

export async function getTrashedAutomations() {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      throw new Error("User not found")
    }

    const trashed = await prisma.automation.findMany({
      where: {
        userId: user.id,
        status: "trash",
      },
      include: {
        instagramAccount: {
          select: {
            id: true,
            username: true,
            profilePicUrl: true,
          },
        },
        triggers: {
          select: { id: true, type: true },
        },
        actions: {
          select: { id: true, type: true },
        },
        executions: {
          select: { status: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    const trashedWithStats = trashed.map((automation) => ({
      ...automation,
      stats: {
        total: automation.executions.length,
        successful: automation.executions.filter((e) => e.status === "success").length,
        failed: automation.executions.filter((e) => e.status === "failed").length,
      },
    }))

    return trashedWithStats
  } catch (error) {
    console.error("[v0] Error fetching trashed automations:", error)
    return []
  }
}

export async function permanentlyDeleteAutomation(automationId: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      throw new Error("User not found")
    }

    const automation = await prisma.automation.findUnique({
      where: { id: automationId },
    })

    if (!automation || automation.userId !== user.id) {
      throw new Error("Automation not found or unauthorized")
    }

    await prisma.automationExecution.deleteMany({
      where: { automationId },
    })

    await prisma.automation.delete({
      where: { id: automationId },
    })

    revalidatePath("/automations")
  } catch (error) {
    console.error("[v0] Error permanently deleting automation:", error)
    throw new Error("Failed to permanently delete automation")
  }
}

export async function emptyTrash() {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      throw new Error("User not found")
    }

    const trashedAutomations = await prisma.automation.findMany({
      where: {
        userId: user.id,
        status: "trash",
      },
      select: { id: true },
    })

    for (const automation of trashedAutomations) {
      await prisma.automationExecution.deleteMany({
        where: { automationId: automation.id },
      })
    }

    await prisma.automation.deleteMany({
      where: {
        userId: user.id,
        status: "trash",
      },
    })

    revalidatePath("/automations")
  } catch (error) {
    console.error("[v0] Error emptying trash:", error)
    throw new Error("Failed to empty trash")
  }
}

export async function moveToTrash(automationId: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      throw new Error("User not found")
    }

    const automation = await prisma.automation.update({
      where: { id: automationId },
      data: { status: "trash", isActive: false },
      include: {
        instagramAccount: true,
        triggers: true,
        actions: true,
        executions: true,
      },
    })

    if (!automation || automation.userId !== user.id) {
      throw new Error("Automation not found")
    }

    revalidatePath("/automations")
    return automation
  } catch (error) {
    console.error("[v0] Error moving automation to trash:", error)
    throw new Error("Failed to move automation to trash")
  }
}

export async function restoreFromTrash(automationId: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      throw new Error("User not found")
    }

    const automation = await prisma.automation.update({
      where: { id: automationId },
      data: { status: "draft" },
      include: {
        instagramAccount: true,
        triggers: true,
        actions: true,
      },
    })

    if (!automation || automation.userId !== user.id) {
      throw new Error("Automation not found")
    }

    revalidatePath("/automations")
    return automation
  } catch (error) {
    console.error("[v0] Error restoring automation:", error)
    throw new Error("Failed to restore automation")
  }
}
