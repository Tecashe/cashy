// "use server"

// import { prisma } from "@/lib/db"
// import { revalidatePath } from "next/cache"

// // Get all conversations with filters
// export async function getConversations(filters?: {
//   search?: string
//   tagIds?: string[]
//   isRead?: boolean
//   archived?: boolean
//   starred?: boolean
//   userId: string
// }) {
//   try {
//     const where: any = {
//       userId: filters?.userId,
//       isArchived: filters?.archived ?? false,
//     }

//     if (filters?.search) {
//       where.OR = [
//         { participantUsername: { contains: filters.search, mode: "insensitive" } },
//         { participantName: { contains: filters.search, mode: "insensitive" } },
//         {
//           messages: {
//             some: {
//               content: { contains: filters.search, mode: "insensitive" },
//             },
//           },
//         },
//       ]
//     }

//     if (filters?.isRead !== undefined) {
//       where.isRead = filters.isRead
//     }

//     if (filters?.starred !== undefined) {
//       where.starred = filters.starred
//     }

//     if (filters?.tagIds && filters.tagIds.length > 0) {
//       where.conversationTags = {
//         some: {
//           tagId: { in: filters.tagIds },
//         },
//       }
//     }

//     const conversations = await prisma.conversation.findMany({
//       where,
//       include: {
//         messages: {
//           orderBy: { createdAt: "desc" },
//           take: 1,
//         },
//         conversationTags: {
//           include: {
//             tag: true,
//           },
//         },
//         _count: {
//           select: { messages: true },
//         },
//       },
//       orderBy: { lastMessageAt: "desc" },
//     })

//     return { success: true, conversations }
//   } catch (error) {
//     console.error("[v0] Error fetching conversations:", error)
//     return { success: false, error: "Failed to fetch conversations" }
//   }
// }

// // Get single conversation with all messages
// export async function getConversation(id: string) {
//   try {
//     const conversation = await prisma.conversation.findUnique({
//       where: { id },
//       include: {
//         messages: {
//           orderBy: { createdAt: "asc" },
//         },
//         conversationTags: {
//           include: {
//             tag: true,
//           },
//         },
//       },
//     })

//     if (!conversation) {
//       return { success: false, error: "Conversation not found" }
//     }

//     // Auto mark as read when viewing
//     if (!conversation.isRead) {
//       await prisma.conversation.update({
//         where: { id },
//         data: { isRead: true },
//       })
//     }

//     return { success: true, conversation }
//   } catch (error) {
//     console.error("[v0] Error fetching conversation:", error)
//     return { success: false, error: "Failed to fetch conversation" }
//   }
// }

// // Send a message
// export async function sendMessage(conversationId: string, content: string) {
//   try {
//     const message = await prisma.message.create({
//       data: {
//         conversationId,
//         content,
//         sender: "business",
//         isFromUser: false,
//         createdAt: new Date(),
//       },
//     })

//     // Update conversation last message time
//     await prisma.conversation.update({
//       where: { id: conversationId },
//       data: {
//         lastMessageAt: new Date(),
//         lastMessageText: content,
//       },
//     })

//     revalidatePath(`/inbox/${conversationId}`)
//     revalidatePath("/inbox")

//     return { success: true, message }
//   } catch (error) {
//     console.error("[v0] Error sending message:", error)
//     return { success: false, error: "Failed to send message" }
//   }
// }

// // Mark conversation as read/unread
// export async function updateConversationReadStatus(id: string, isRead: boolean) {
//   try {
//     await prisma.conversation.update({
//       where: { id },
//       data: { isRead },
//     })

//     revalidatePath("/inbox")
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error updating read status:", error)
//     return { success: false, error: "Failed to update read status" }
//   }
// }

// // Toggle auto/manual mode
// export async function updateConversationMode(id: string, isAuto: boolean) {
//   try {
//     await prisma.conversation.update({
//       where: { id },
//       data: { isAuto },
//     })

//     revalidatePath(`/inbox/${id}`)
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error updating mode:", error)
//     return { success: false, error: "Failed to update mode" }
//   }
// }

// // Archive conversation
// export async function archiveConversation(id: string, archived: boolean) {
//   try {
//     await prisma.conversation.update({
//       where: { id },
//       data: { isArchived: archived },
//     })

//     revalidatePath("/inbox")
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error archiving conversation:", error)
//     return { success: false, error: "Failed to archive conversation" }
//   }
// }

// // Star conversation
// export async function starConversation(id: string, starred: boolean) {
//   try {
//     await prisma.conversation.update({
//       where: { id },
//       data: { starred },
//     })

//     revalidatePath("/inbox")
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error starring conversation:", error)
//     return { success: false, error: "Failed to star conversation" }
//   }
// }

// // Add note to conversation
// export async function addConversationNote(id: string, note: string) {
//   try {
//     await prisma.conversation.update({
//       where: { id },
//       data: { notes: note },
//     })

//     revalidatePath(`/inbox/${id}`)
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error adding note:", error)
//     return { success: false, error: "Failed to add note" }
//   }
// }

// // Tag management
// export async function addTagToConversation(conversationId: string, tagId: string) {
//   try {
//     await prisma.conversationTag.create({
//       data: {
//         conversationId,
//         tagId,
//       },
//     })

//     revalidatePath("/inbox")
//     revalidatePath(`/inbox/${conversationId}`)
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error adding tag:", error)
//     return { success: false, error: "Failed to add tag" }
//   }
// }

// export async function removeTagFromConversation(conversationId: string, tagId: string) {
//   try {
//     await prisma.conversationTag.delete({
//       where: {
//         conversationId_tagId: {
//           conversationId,
//           tagId,
//         },
//       },
//     })

//     revalidatePath("/inbox")
//     revalidatePath(`/inbox/${conversationId}`)
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error removing tag:", error)
//     return { success: false, error: "Failed to remove tag" }
//   }
// }

// // Get all tags
// export async function getTags(userId: string) {
//   try {
//     const tags = await prisma.tag.findMany({
//       where: { userId },
//       orderBy: { name: "asc" },
//     })

//     return { success: true, tags }
//   } catch (error) {
//     console.error("[v0] Error fetching tags:", error)
//     return { success: false, error: "Failed to fetch tags" }
//   }
// }

// // Create tag
// export async function createTag(userId: string, name: string, color: string) {
//   try {
//     const tag = await prisma.tag.create({
//       data: { userId, name, color },
//     })

//     revalidatePath("/inbox")
//     return { success: true, tag }
//   } catch (error) {
//     console.error("[v0] Error creating tag:", error)
//     return { success: false, error: "Failed to create tag" }
//   }
// }

// // Quick replies
// export async function getQuickReplies(userId: string) {
//   try {
//     const replies = await prisma.quickReply.findMany({
//       where: { userId },
//       orderBy: { createdAt: "desc" },
//     })

//     return { success: true, replies }
//   } catch (error) {
//     console.error("[v0] Error fetching quick replies:", error)
//     return { success: false, error: "Failed to fetch quick replies" }
//   }
// }

// export async function createQuickReply(userId: string, name: string, content: string) {
//   try {
//     const reply = await prisma.quickReply.create({
//       data: { userId, name, content },
//     })

//     revalidatePath("/inbox")
//     return { success: true, reply }
//   } catch (error) {
//     console.error("[v0] Error creating quick reply:", error)
//     return { success: false, error: "Failed to create quick reply" }
//   }
// }

// export async function deleteQuickReply(id: string) {
//   try {
//     await prisma.quickReply.delete({
//       where: { id },
//     })

//     revalidatePath("/inbox")
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error deleting quick reply:", error)
//     return { success: false, error: "Failed to delete quick reply" }
//   }
// }

// // Bulk actions
// export async function bulkUpdateConversations(
//   ids: string[],
//   action: "read" | "unread" | "archive" | "unarchive" | "star" | "unstar",
// ) {
//   try {
//     const updateData: any = {}

//     switch (action) {
//       case "read":
//         updateData.isRead = true
//         break
//       case "unread":
//         updateData.isRead = false
//         break
//       case "archive":
//         updateData.isArchived = true
//         break
//       case "unarchive":
//         updateData.isArchived = false
//         break
//       case "star":
//         updateData.starred = true
//         break
//       case "unstar":
//         updateData.starred = false
//         break
//     }

//     await prisma.conversation.updateMany({
//       where: { id: { in: ids } },
//       data: updateData,
//     })

//     revalidatePath("/inbox")
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error bulk updating conversations:", error)
//     return { success: false, error: "Failed to bulk update conversations" }
//   }
// }

// export async function bulkAddTag(conversationIds: string[], tagId: string) {
//   try {
//     await Promise.all(
//       conversationIds.map((id) =>
//         prisma.conversationTag.create({
//           data: {
//             conversationId: id,
//             tagId,
//           },
//         }),
//       ),
//     )

//     revalidatePath("/inbox")
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error bulk adding tag:", error)
//     return { success: false, error: "Failed to bulk add tag" }
//   }
// }

"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Get all conversations with filters
export async function getConversations(filters?: {
  search?: string
  tagIds?: string[]
  isRead?: boolean
  archived?: boolean
  starred?: boolean
  userId: string
  instagramAccountId?: string
}) {
  try {
    const where: any = {
      userId: filters?.userId,
      isArchived: filters?.archived ?? false,
    }

    if (filters?.instagramAccountId) {
      where.instagramAccountId = filters.instagramAccountId
    }

    if (filters?.search) {
      where.OR = [
        { participantUsername: { contains: filters.search, mode: "insensitive" } },
        { participantName: { contains: filters.search, mode: "insensitive" } },
        {
          messages: {
            some: {
              content: { contains: filters.search, mode: "insensitive" },
            },
          },
        },
      ]
    }

    if (filters?.isRead !== undefined) {
      where.isRead = filters.isRead
    }

    if (filters?.starred !== undefined) {
      where.starred = filters.starred
    }

    if (filters?.tagIds && filters.tagIds.length > 0) {
      where.conversationTags = {
        some: {
          tagId: { in: filters.tagIds },
        },
      }
    }

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        conversationTags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { lastMessageAt: "desc" },
    })

    return { success: true, conversations }
  } catch (error) {
    console.error("[v0] Error fetching conversations:", error)
    return { success: false, error: "Failed to fetch conversations" }
  }
}

// Get single conversation with all messages
export async function getConversation(id: string) {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        conversationTags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!conversation) {
      return { success: false, error: "Conversation not found" }
    }

    // Auto mark as read when viewing
    if (!conversation.isRead) {
      await prisma.conversation.update({
        where: { id },
        data: { isRead: true },
      })
    }

    return { success: true, conversation }
  } catch (error) {
    console.error("[v0] Error fetching conversation:", error)
    return { success: false, error: "Failed to fetch conversation" }
  }
}

// Send a message
export async function sendMessage(conversationId: string, content: string) {
  try {
    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
        sender: "business",
        isFromUser: false,
        createdAt: new Date(),
      },
    })

    // Update conversation last message time
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        lastMessageText: content,
      },
    })

    revalidatePath(`/inbox/${conversationId}`)
    revalidatePath("/inbox")

    return { success: true, message }
  } catch (error) {
    console.error("[v0] Error sending message:", error)
    return { success: false, error: "Failed to send message" }
  }
}

// Mark conversation as read/unread
export async function updateConversationReadStatus(id: string, isRead: boolean) {
  try {
    await prisma.conversation.update({
      where: { id },
      data: { isRead },
    })

    revalidatePath("/inbox")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error updating read status:", error)
    return { success: false, error: "Failed to update read status" }
  }
}

// Toggle auto/manual mode
export async function updateConversationMode(id: string, isAuto: boolean) {
  try {
    await prisma.conversation.update({
      where: { id },
      data: { isAuto },
    })

    revalidatePath(`/inbox/${id}`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error updating mode:", error)
    return { success: false, error: "Failed to update mode" }
  }
}

// Archive conversation
export async function archiveConversation(id: string, archived: boolean) {
  try {
    await prisma.conversation.update({
      where: { id },
      data: { isArchived: archived },
    })

    revalidatePath("/inbox")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error archiving conversation:", error)
    return { success: false, error: "Failed to archive conversation" }
  }
}

// Star conversation
export async function starConversation(id: string, starred: boolean) {
  try {
    await prisma.conversation.update({
      where: { id },
      data: { starred },
    })

    revalidatePath("/inbox")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error starring conversation:", error)
    return { success: false, error: "Failed to star conversation" }
  }
}

// Add note to conversation
export async function addConversationNote(id: string, note: string) {
  try {
    await prisma.conversation.update({
      where: { id },
      data: { notes: note },
    })

    revalidatePath(`/inbox/${id}`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error adding note:", error)
    return { success: false, error: "Failed to add note" }
  }
}

// Tag management
export async function addTagToConversation(conversationId: string, tagId: string) {
  try {
    await prisma.conversationTag.create({
      data: {
        conversationId,
        tagId,
      },
    })

    revalidatePath("/inbox")
    revalidatePath(`/inbox/${conversationId}`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error adding tag:", error)
    return { success: false, error: "Failed to add tag" }
  }
}

export async function removeTagFromConversation(conversationId: string, tagId: string) {
  try {
    await prisma.conversationTag.delete({
      where: {
        conversationId_tagId: {
          conversationId,
          tagId,
        },
      },
    })

    revalidatePath("/inbox")
    revalidatePath(`/inbox/${conversationId}`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error removing tag:", error)
    return { success: false, error: "Failed to remove tag" }
  }
}

// Get all tags
export async function getTags(userId: string) {
  try {
    const tags = await prisma.tag.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    })

    return { success: true, tags }
  } catch (error) {
    console.error("[v0] Error fetching tags:", error)
    return { success: false, error: "Failed to fetch tags" }
  }
}

// Create tag
export async function createTag(userId: string, name: string, color: string) {
  try {
    const tag = await prisma.tag.create({
      data: { userId, name, color },
    })

    revalidatePath("/inbox")
    return { success: true, tag }
  } catch (error) {
    console.error("[v0] Error creating tag:", error)
    return { success: false, error: "Failed to create tag" }
  }
}

// Quick replies
export async function getQuickReplies(userId: string) {
  try {
    const replies = await prisma.quickReply.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, replies }
  } catch (error) {
    console.error("[v0] Error fetching quick replies:", error)
    return { success: false, error: "Failed to fetch quick replies" }
  }
}

export async function createQuickReply(userId: string, name: string, content: string) {
  try {
    const reply = await prisma.quickReply.create({
      data: { userId, name, content },
    })

    revalidatePath("/inbox")
    return { success: true, reply }
  } catch (error) {
    console.error("[v0] Error creating quick reply:", error)
    return { success: false, error: "Failed to create quick reply" }
  }
}

export async function deleteQuickReply(id: string) {
  try {
    await prisma.quickReply.delete({
      where: { id },
    })

    revalidatePath("/inbox")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting quick reply:", error)
    return { success: false, error: "Failed to delete quick reply" }
  }
}

// Bulk actions
export async function bulkUpdateConversations(
  ids: string[],
  action: "read" | "unread" | "archive" | "unarchive" | "star" | "unstar",
) {
  try {
    const updateData: any = {}

    switch (action) {
      case "read":
        updateData.isRead = true
        break
      case "unread":
        updateData.isRead = false
        break
      case "archive":
        updateData.isArchived = true
        break
      case "unarchive":
        updateData.isArchived = false
        break
      case "star":
        updateData.starred = true
        break
      case "unstar":
        updateData.starred = false
        break
    }

    await prisma.conversation.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    })

    revalidatePath("/inbox")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error bulk updating conversations:", error)
    return { success: false, error: "Failed to bulk update conversations" }
  }
}

export async function bulkAddTag(conversationIds: string[], tagId: string) {
  try {
    await Promise.all(
      conversationIds.map((id) =>
        prisma.conversationTag.create({
          data: {
            conversationId: id,
            tagId,
          },
        }),
      ),
    )

    revalidatePath("/inbox")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error bulk adding tag:", error)
    return { success: false, error: "Failed to bulk add tag" }
  }
}
