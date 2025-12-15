// import { prisma } from "@/lib/db"
// import { trackAnalytics } from "./analytics-tracker"

// interface TriggerContext {
//   messageContent?: string
//   senderId: string
//   conversationId: string
//   messageType: "DM" | "COMMENT" | "STORY_REPLY" | "MENTION"
//   isFirstMessage: boolean
// }

// export async function processAutomationTriggers(context: TriggerContext) {
//   const { conversationId, messageContent, senderId, messageType, isFirstMessage } = context

//   // Get conversation to finduser
//   const conversation = await prisma.conversation.findUnique({
//     where: { id: conversationId },
//     include: { user: true },
//   })

//   if (!conversation) return

//   // Find active automations for this user
//   const automations = await prisma.automation.findMany({
//     where: {
//       userId: conversation.userId,
//       isActive: true,
//     },
//     include: {
//       triggers: true,
//       actions: {
//         orderBy: { order: "asc" },
//       },
//     },
//   })

//   // Check each automation for matching triggers
//   for (const automation of automations) {
//     for (const trigger of automation.triggers) {
//       if (shouldTrigger(trigger, context)) {
//         console.log(`[AutomationEngine] Triggering automation: ${automation.name}`)
//         await trackAnalytics(conversation.userId, "automation_triggered")
//         await executeAutomation(automation, context)
//         break
//       }
//     }
//   }
// }

// function shouldTrigger(trigger: { type: string; conditions: any }, context: TriggerContext): boolean {
//   const { messageContent = "", messageType, isFirstMessage } = context
//   const conditions = trigger.conditions as any

//   switch (trigger.type) {
//     case "DM_RECEIVED":
//       return messageType === "DM"

//     case "FIRST_MESSAGE":
//       return isFirstMessage && messageType === "DM"

//     case "KEYWORD":
//       if (messageType !== "DM") return false
//       const keywords = conditions.keywords || []
//       const matchType = conditions.matchType || "contains"

//       if (matchType === "contains") {
//         return keywords.some((keyword: string) => messageContent.toLowerCase().includes(keyword.toLowerCase()))
//       } else if (matchType === "exact") {
//         return keywords.some((keyword: string) => messageContent.toLowerCase() === keyword.toLowerCase())
//       }
//       return false

//     case "STORY_REPLY":
//       return messageType === "STORY_REPLY"

//     case "COMMENT":
//       return messageType === "COMMENT"

//     case "MENTION":
//       return messageType === "MENTION"

//     default:
//       return false
//   }
// }

// async function executeAutomation(automation: any, context: TriggerContext) {
//   const { conversationId, senderId } = context

//   for (const action of automation.actions) {
//     try {
//       await executeAction(action, { conversationId, senderId })

//       // Handle delays between actions
//       if (action.type === "DELAY") {
//         const delayMs = calculateDelay(action.content)
//         await new Promise((resolve) => setTimeout(resolve, delayMs))
//       }
//     } catch (error) {
//       console.error(`[AutomationEngine] Error executing action ${action.type}:`, error)
//     }
//   }
// }

// async function executeAction(
//   action: { type: string; content: any },
//   context: { conversationId: string; senderId: string },
// ) {
//   const { conversationId } = context

//   switch (action.type) {
//     case "SEND_MESSAGE":
//       await sendAutomationMessage(conversationId, action.content.message || "")
//       break

//     case "ADD_TAG":
//       await addAutomationTag(conversationId, action.content.tagName || "")
//       break

//     case "REMOVE_TAG":
//       break

//     case "SEND_TO_HUMAN":
//       await prisma.conversation.update({
//         where: { id: conversationId },
//         data: { unreadCount: 1 },
//       })
//       break

//     case "WEBHOOK":
//       if (action.content.webhookUrl) {
//         await fetch(action.content.webhookUrl, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(context),
//         })
//       }
//       break

//     case "DELAY":
//       break

//     default:
//       console.log(`[AutomationEngine] Unknown action type: ${action.type}`)
//   }
// }

// async function sendAutomationMessage(conversationId: string, message: string) {
//   const conversation = await prisma.conversation.findUnique({
//     where: { id: conversationId },
//     include: { instagramAccount: true },
//   })

//   if (!conversation) return

//   const personalizedMessage = message
//     .replace(/\{name\}/g, conversation.participantName)
//     .replace(/\{username\}/g, conversation.participantUsername)

//   // TODO: Send via Instagram API

//   await prisma.message.create({
//     data: {
//       conversationId,
//       content: personalizedMessage,
//       sender: "user",
//       isRead: true,
//       messageType: "text",
//     },
//   })

//   await prisma.conversation.update({
//     where: { id: conversationId },
//     data: {
//       lastMessageText: personalizedMessage,
//       lastMessageAt: new Date(),
//     },
//   })

//   await trackAnalytics(conversation.userId, "message_sent")
// }

// async function addAutomationTag(conversationId: string, tagName: string) {
//   const conversation = await prisma.conversation.findUnique({
//     where: { id: conversationId },
//   })

//   if (!conversation) return

//   let tag = await prisma.tag.findFirst({
//     where: {
//       userId: conversation.userId,
//       name: tagName,
//     },
//   })

//   if (!tag) {
//     tag = await prisma.tag.create({
//       data: {
//         userId: conversation.userId,
//         name: tagName,
//         color: "#8B5CF6",
//       },
//     })
//   }

//   await prisma.conversationTag
//     .create({
//       data: {
//         conversationId,
//         tagId: tag.id,
//       },
//     })
//     .catch(() => {})
// }

// function calculateDelay(content: any): number {
//   const amount = content.delayAmount || 0
//   const unit = content.delayUnit || "minutes"

//   switch (unit) {
//     case "minutes":
//       return amount * 60 * 1000
//     case "hours":
//       return amount * 60 * 60 * 1000
//     case "days":
//       return amount * 24 * 60 * 60 * 1000
//     default:
//       return 0
//   }
// }
import { prisma } from "@/lib/db"
import { trackAnalytics } from "./analytics-tracker"

interface TriggerContext {
  messageContent?: string
  senderId: string
  senderUsername: string
  senderName: string
  conversationId: string
  messageType: "DM" | "COMMENT" | "STORY_REPLY" | "MENTION"
  isFirstMessage: boolean
  instagramAccountId: string
}

export async function processAutomationTriggers(context: TriggerContext) {
  const { conversationId, messageContent, senderId, messageType, isFirstMessage, instagramAccountId } = context

  // Get conversation to find user
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { user: true },
  })

  if (!conversation) return

  // Find active automations for this user and Instagram account
  const automations = await prisma.automation.findMany({
    where: {
      userId: conversation.userId,
      instagramAccountId: instagramAccountId,
      isActive: true,
    },
    include: {
      triggers: true,
      actions: {
        orderBy: { order: "asc" },
      },
    },
  })

  // Check each automation for matching triggers
  for (const automation of automations) {
    for (const trigger of automation.triggers) {
      if (shouldTrigger(trigger, context)) {
        console.log(`[AutomationEngine] Triggering automation: ${automation.name}`)
        await trackAnalytics(conversation.userId, "automation_triggered")
        await executeAutomation(automation, context)
        break
      }
    }
  }
}

function shouldTrigger(trigger: { type: string; conditions: any }, context: TriggerContext): boolean {
  const { messageContent = "", messageType, isFirstMessage } = context
  const conditions = trigger.conditions as any

  switch (trigger.type) {
    case "DM_RECEIVED":
      return messageType === "DM"

    case "FIRST_MESSAGE":
      return isFirstMessage && messageType === "DM"

    case "KEYWORD":
      if (messageType !== "DM") return false
      const keywords = conditions.keywords || []
      const matchType = conditions.matchType || "contains"

      if (matchType === "contains") {
        return keywords.some((keyword: string) => messageContent.toLowerCase().includes(keyword.toLowerCase()))
      } else if (matchType === "exact") {
        return keywords.some((keyword: string) => messageContent.toLowerCase() === keyword.toLowerCase())
      }
      return false

    case "STORY_REPLY":
      return messageType === "STORY_REPLY"

    case "COMMENT":
      return messageType === "COMMENT"

    case "MENTION":
      return messageType === "MENTION"

    default:
      return false
  }
}

async function executeAutomation(automation: any, context: TriggerContext) {
  const { conversationId, senderId } = context

  for (const action of automation.actions) {
    try {
      await executeAction(action, { conversationId, senderId })

      // Handle delays between actions
      if (action.type === "DELAY") {
        const delayMs = calculateDelay(action.content)
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    } catch (error) {
      console.error(`[AutomationEngine] Error executing action ${action.type}:`, error)
    }
  }
}

async function executeAction(
  action: { type: string; content: any },
  context: { conversationId: string; senderId: string },
) {
  const { conversationId } = context

  switch (action.type) {
    case "SEND_MESSAGE":
      await sendAutomationMessage(conversationId, action.content.message || "")
      break

    case "ADD_TAG":
      await addAutomationTag(conversationId, action.content.tagName || "")
      break

    case "REMOVE_TAG":
      break

    case "SEND_TO_HUMAN":
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { unreadCount: 1 },
      })
      break

    case "WEBHOOK":
      if (action.content.webhookUrl) {
        await fetch(action.content.webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(context),
        })
      }
      break

    case "DELAY":
      break

    default:
      console.log(`[AutomationEngine] Unknown action type: ${action.type}`)
  }
}

async function sendAutomationMessage(conversationId: string, message: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { instagramAccount: true },
  })

  if (!conversation) return

  const personalizedMessage = message
    .replace(/\{name\}/g, conversation.participantName)
    .replace(/\{username\}/g, conversation.participantUsername)

  // TODO: Send via Instagram API

  await prisma.message.create({
    data: {
      conversationId,
      content: personalizedMessage,
      sender: "user",
      isRead: true,
      messageType: "text",
    },
  })

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      lastMessageText: personalizedMessage,
      lastMessageAt: new Date(),
    },
  })

  await trackAnalytics(conversation.userId, "message_sent")
}

async function addAutomationTag(conversationId: string, tagName: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  })

  if (!conversation) return

  let tag = await prisma.tag.findFirst({
    where: {
      userId: conversation.userId,
      name: tagName,
    },
  })

  if (!tag) {
    tag = await prisma.tag.create({
      data: {
        userId: conversation.userId,
        name: tagName,
        color: "#8B5CF6",
      },
    })
  }

  await prisma.conversationTag
    .create({
      data: {
        conversationId,
        tagId: tag.id,
      },
    })
    .catch(() => {})
}

function calculateDelay(content: any): number {
  const amount = content.delayAmount || 0
  const unit = content.delayUnit || "minutes"

  switch (unit) {
    case "minutes":
      return amount * 60 * 1000
    case "hours":
      return amount * 60 * 60 * 1000
    case "days":
      return amount * 24 * 60 * 60 * 1000
    default:
      return 0
  }
}