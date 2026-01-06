// "use server"

// import { prisma } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { auth } from "@clerk/nextjs/server"

// export async function getAutomations() {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     const automations = await prisma.automation.findMany({
//       where: { userId: user.id },
//       include: {
//         instagramAccount: {
//           select: {
//             id: true,
//             username: true,
//             profilePicUrl: true,
//             followerCount: true,
//           },
//         },
//         triggers: {
//           orderBy: { order: "asc" },
//           select: {
//             id: true,
//             type: true,
//             conditions: true,
//             order: true,
//           },
//         },
//         actions: {
//           orderBy: { order: "asc" },
//           select: {
//             id: true,
//             type: true,
//             content: true,
//             order: true,
//           },
//         },
//         executions: {
//           orderBy: { executedAt: "desc" },
//           take: 100,
//           select: {
//             id: true,
//             status: true,
//             executedAt: true,
//             completedAt: true,
//             error: true,
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     })

//     return automations
//   } catch (error) {
//     console.error("[v0] Error fetching automations:", error)
//     throw new Error("Failed to fetch automations")
//   }
// }

// export async function getAutomationById(id: string) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     const automation = await prisma.automation.findUnique({
//       where: { id },
//       include: {
//         instagramAccount: true,
//         triggers: { orderBy: { order: "asc" } },
//         actions: { orderBy: { order: "asc" } },
//         executions: { orderBy: { executedAt: "desc" } },
//       },
//     })

//     if (!automation || automation.userId !== user.id) {
//       return null
//     }

//     return automation
//   } catch (error) {
//     console.error("[v0] Error fetching automation:", error)
//     return null
//   }
// }

// export async function toggleAutomationStatus(automationId: string, isActive: boolean) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     const automation = await prisma.automation.update({
//       where: { id: automationId },
//       data: { isActive },
//       include: {
//         instagramAccount: true,
//         triggers: true,
//         actions: true,
//         executions: true,
//       },
//     })

//     if (!automation || automation.userId !== user.id) {
//       throw new Error("Automation not found")
//     }

//     revalidatePath("/automations")
//     return automation
//   } catch (error) {
//     console.error("[v0] Error toggling automation:", error)
//     throw new Error("Failed to update automation status")
//   }
// }

// export async function deleteAutomation(automationId: string) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     await prisma.automation.delete({
//       where: { id: automationId },
//     })

//     revalidatePath("/automations")
//   } catch (error) {
//     console.error("[v0] Error deleting automation:", error)
//     throw new Error("Failed to delete automation")
//   }
// }

// export async function duplicateAutomation(automationId: string) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     const original = await prisma.automation.findUnique({
//       where: { id: automationId },
//       include: {
//         triggers: true,
//         actions: true,
//       },
//     })

//     if (!original || original.userId !== user.id) {
//       throw new Error("Automation not found")
//     }

//     const duplicated = await prisma.automation.create({
//       data: {
//         userId: user.id,
//         instagramAccountId: original.instagramAccountId,
//         name: `${original.name} (Copy)`,
//         description: original.description,
//         status: "draft",
//         isActive: false,
//         triggers: {
//           createMany: {
//             data: original.triggers.map((t) => ({
//               type: t.type,
//               conditions: t.conditions,
//               order: t.order,
//             })),
//           },
//         },
//         actions: {
//           createMany: {
//             data: original.actions.map((a) => ({
//               type: a.type,
//               content: a.content,
//               order: a.order,
//             })),
//           },
//         },
//       },
//       include: {
//         triggers: true,
//         actions: true,
//         instagramAccount: true,
//       },
//     })

//     revalidatePath("/automations")
//     return duplicated
//   } catch (error) {
//     console.error("[v0] Error duplicating automation:", error)
//     throw new Error("Failed to duplicate automation")
//   }
// }

// export async function getInstagramAccounts() {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     const accounts = await prisma.instagramAccount.findMany({
//       where: { userId: user.id },
//       select: {
//         id: true,
//         username: true,
//         profilePicUrl: true,
//         followerCount: true,
//         isConnected: true,
//       },
//     })
//     return accounts
//   } catch (error) {
//     console.error("[v0] Error fetching accounts:", error)
//     return []
//   }
// }

// export async function getTrashedAutomations() {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     const trashed = await prisma.automation.findMany({
//       where: {
//         userId: user.id,
//         status: "trash",
//       },
//       include: {
//         instagramAccount: {
//           select: {
//             id: true,
//             username: true,
//             profilePicUrl: true,
//           },
//         },
//         triggers: {
//           select: { id: true, type: true },
//         },
//         actions: {
//           select: { id: true, type: true },
//         },
//       },
//       orderBy: { updatedAt: "desc" },
//     })

//     return trashed
//   } catch (error) {
//     console.error("[v0] Error fetching trashed automations:", error)
//     return []
//   }
// }

// export async function moveToTrash(automationId: string) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     const automation = await prisma.automation.update({
//       where: { id: automationId },
//       data: { status: "trash", isActive: false },
//       include: {
//         instagramAccount: true,
//         triggers: true,
//         actions: true,
//         executions: true,
//       },
//     })

//     if (!automation || automation.userId !== user.id) {
//       throw new Error("Automation not found")
//     }

//     revalidatePath("/automations")
//     return automation
//   } catch (error) {
//     console.error("[v0] Error moving automation to trash:", error)
//     throw new Error("Failed to move automation to trash")
//   }
// }

// export async function restoreFromTrash(automationId: string) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     const automation = await prisma.automation.update({
//       where: { id: automationId },
//       data: { status: "draft" },
//       include: {
//         instagramAccount: true,
//         triggers: true,
//         actions: true,
//       },
//     })

//     if (!automation || automation.userId !== user.id) {
//       throw new Error("Automation not found")
//     }

//     revalidatePath("/automations")
//     return automation
//   } catch (error) {
//     console.error("[v0] Error restoring automation:", error)
//     throw new Error("Failed to restore automation")
//   }
// }

// export async function permanentlyDeleteAutomation(automationId: string) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     await prisma.automation.delete({
//       where: { id: automationId },
//     })

//     revalidatePath("/automations")
//   } catch (error) {
//     console.error("[v0] Error permanently deleting automation:", error)
//     throw new Error("Failed to permanently delete automation")
//   }
// }

// export async function emptyTrash() {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     await prisma.automation.deleteMany({
//       where: {
//         userId: user.id,
//         status: "trash",
//       },
//     })

//     revalidatePath("/automations")
//   } catch (error) {
//     console.error("[v0] Error emptying trash:", error)
//     throw new Error("Failed to empty trash")
//   }
// }
// "use server"

// import { prisma } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { auth } from "@clerk/nextjs/server"
// import type { InputJsonValue } from "@prisma/client/runtime/library"

// export async function getAutomations() {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     const automations = await prisma.automation.findMany({
//       where: { userId: user.id },
//       include: {
//         instagramAccount: {
//           select: {
//             id: true,
//             username: true,
//             profilePicUrl: true,
//             followerCount: true,
//           },
//         },
//         triggers: {
//           orderBy: { order: "asc" },
//           select: {
//             id: true,
//             type: true,
//             conditions: true,
//             order: true,
//           },
//         },
//         actions: {
//           orderBy: { order: "asc" },
//           select: {
//             id: true,
//             type: true,
//             content: true,
//             order: true,
//           },
//         },
//         executions: {
//           orderBy: { executedAt: "desc" },
//           take: 100,
//           select: {
//             id: true,
//             status: true,
//             executedAt: true,
//             completedAt: true,
//             error: true,
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     })

//     return automations
//   } catch (error) {
//     console.error("[v0] Error fetching automations:", error)
//     throw new Error("Failed to fetch automations")
//   }
// }

// export async function getAutomationById(id: string) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     const automation = await prisma.automation.findUnique({
//       where: { id },
//       include: {
//         instagramAccount: true,
//         triggers: { orderBy: { order: "asc" } },
//         actions: { orderBy: { order: "asc" } },
//         executions: { orderBy: { executedAt: "desc" } },
//       },
//     })

//     if (!automation || automation.userId !== user.id) {
//       return null
//     }

//     return automation
//   } catch (error) {
//     console.error("[v0] Error fetching automation:", error)
//     return null
//   }
// }

// export async function toggleAutomationStatus(automationId: string, isActive: boolean) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     const automation = await prisma.automation.update({
//       where: { id: automationId },
//       data: { isActive },
//       include: {
//         instagramAccount: true,
//         triggers: true,
//         actions: true,
//         executions: true,
//       },
//     })

//     if (!automation || automation.userId !== user.id) {
//       throw new Error("Automation not found")
//     }

//     revalidatePath("/automations")
//     return automation
//   } catch (error) {
//     console.error("[v0] Error toggling automation:", error)
//     throw new Error("Failed to update automation status")
//   }
// }

// export async function deleteAutomation(automationId: string) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     await prisma.automation.delete({
//       where: { id: automationId },
//     })

//     revalidatePath("/automations")
//   } catch (error) {
//     console.error("[v0] Error deleting automation:", error)
//     throw new Error("Failed to delete automation")
//   }
// }

// export async function duplicateAutomation(automationId: string) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     const original = await prisma.automation.findUnique({
//       where: { id: automationId },
//       include: {
//         triggers: true,
//         actions: true,
//       },
//     })

//     if (!original || original.userId !== user.id) {
//       throw new Error("Automation not found")
//     }

//     const duplicated = await prisma.automation.create({
//       data: {
//         userId: user.id,
//         instagramAccountId: original.instagramAccountId,
//         name: `${original.name} (Copy)`,
//         description: original.description,
//         status: "draft",
//         isActive: false,
//         triggers: {
//           createMany: {
//             data: original.triggers.map((t) => ({
//               type: t.type,
//               conditions: (t.conditions || {}) as InputJsonValue,
//               order: t.order,
//             })),
//           },
//         },
//         actions: {
//           createMany: {
//             data: original.actions.map((a) => ({
//               type: a.type,
//               content: (a.content || {}) as InputJsonValue,
//               order: a.order,
//             })),
//           },
//         },
//       },
//       include: {
//         triggers: true,
//         actions: true,
//         instagramAccount: true,
//       },
//     })

//     revalidatePath("/automations")
//     return duplicated
//   } catch (error) {
//     console.error("[v0] Error duplicating automation:", error)
//     throw new Error("Failed to duplicate automation")
//   }
// }

// export async function getInstagramAccounts() {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     const accounts = await prisma.instagramAccount.findMany({
//       where: { userId: user.id },
//       select: {
//         id: true,
//         username: true,
//         profilePicUrl: true,
//         followerCount: true,
//         isConnected: true,
//       },
//     })
//     return accounts
//   } catch (error) {
//     console.error("[v0] Error fetching accounts:", error)
//     return []
//   }
// }

// export async function getTrashedAutomations() {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     const trashed = await prisma.automation.findMany({
//       where: {
//         userId: user.id,
//         status: "trash",
//       },
//       include: {
//         instagramAccount: {
//           select: {
//             id: true,
//             username: true,
//             profilePicUrl: true,
//           },
//         },
//         triggers: {
//           select: { id: true, type: true },
//         },
//         actions: {
//           select: { id: true, type: true },
//         },
//       },
//       orderBy: { updatedAt: "desc" },
//     })

//     return trashed
//   } catch (error) {
//     console.error("[v0] Error fetching trashed automations:", error)
//     return []
//   }
// }

// export async function moveToTrash(automationId: string) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     const automation = await prisma.automation.update({
//       where: { id: automationId },
//       data: { status: "trash", isActive: false },
//       include: {
//         instagramAccount: true,
//         triggers: true,
//         actions: true,
//         executions: true,
//       },
//     })

//     if (!automation || automation.userId !== user.id) {
//       throw new Error("Automation not found")
//     }

//     revalidatePath("/automations")
//     return automation
//   } catch (error) {
//     console.error("[v0] Error moving automation to trash:", error)
//     throw new Error("Failed to move automation to trash")
//   }
// }

// export async function restoreFromTrash(automationId: string) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     const automation = await prisma.automation.update({
//       where: { id: automationId },
//       data: { status: "draft" },
//       include: {
//         instagramAccount: true,
//         triggers: true,
//         actions: true,
//       },
//     })

//     if (!automation || automation.userId !== user.id) {
//       throw new Error("Automation not found")
//     }

//     revalidatePath("/automations")
//     return automation
//   } catch (error) {
//     console.error("[v0] Error restoring automation:", error)
//     throw new Error("Failed to restore automation")
//   }
// }

// export async function permanentlyDeleteAutomation(automationId: string) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     await prisma.automation.delete({
//       where: { id: automationId },
//     })

//     revalidatePath("/automations")
//   } catch (error) {
//     console.error("[v0] Error permanently deleting automation:", error)
//     throw new Error("Failed to permanently delete automation")
//   }
// }

// export async function emptyTrash() {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     await prisma.automation.deleteMany({
//       where: {
//         userId: user.id,
//         status: "trash",
//       },
//     })

//     revalidatePath("/automations")
//   } catch (error) {
//     console.error("[v0] Error emptying trash:", error)
//     throw new Error("Failed to empty trash")
//   }
// }

"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import type { InputJsonValue } from "@prisma/client/runtime/library"

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
      where: { userId: user.id },
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

    console.log("[v0] Fetched", automations.length, "automations")
    return automations
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

    return automation
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

    await prisma.automation.delete({
      where: { id: automationId },
    })

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
      },
      orderBy: { updatedAt: "desc" },
    })

    return trashed
  } catch (error) {
    console.error("[v0] Error fetching trashed automations:", error)
    return []
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
