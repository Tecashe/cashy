// import type { InstagramAPI } from "./instagram-api"
// import { generateText } from "ai"

// export interface ExecutionContext {
//   userId: string
//   senderId: string
//   messageText?: string
//   triggerData: any
//   conversationHistory?: any[]
//   userTags?: string[]
//   knowledgeBase?: string
// }

// export class AutomationExecutor {
//   private instagramApi: InstagramAPI

//   constructor(instagramApi: InstagramAPI) {
//     this.instagramApi = instagramApi
//   }

//   async executeAction(actionType: string, actionData: any, context: ExecutionContext): Promise<void> {
//     console.log("[v0] Executing action:", actionType, actionData)

//     switch (actionType) {
//       case "SEND_MESSAGE":
//         await this.executeSendMessage(actionData, context)
//         break

//       case "SEND_IMAGE":
//         await this.executeSendImage(actionData, context)
//         break

//       case "SEND_VIDEO":
//         await this.executeSendVideo(actionData, context)
//         break

//       case "AI_RESPONSE":
//         await this.executeAIResponse(actionData, context)
//         break

//       case "ADD_TAG":
//         await this.executeAddTag(actionData, context)
//         break

//       case "DELAY":
//         await this.executeDelay(actionData, context)
//         break

//       case "WEBHOOK":
//         await this.executeWebhook(actionData, context)
//         break

//       case "SEND_TO_HUMAN":
//         await this.executeSendToHuman(actionData, context)
//         break

//       case "CONDITION":
//         return this.executeCondition(actionData, context)

//       default:
//         console.warn("[v0] Unknown action type:", actionType)
//     }
//   }

//   private async executeSendMessage(actionData: any, context: ExecutionContext): Promise<void> {
//     const message = this.personalizeMessage(actionData.message, context)
//     await this.instagramApi.sendTextMessage(context.senderId, message)
//     console.log("[v0] Sent message:", message)
//   }

//   private async executeSendImage(actionData: any, context: ExecutionContext): Promise<void> {
//     const { imageUrl, caption } = actionData
//     await this.instagramApi.sendImageMessage(context.senderId, imageUrl)

//     if (caption) {
//       const personalizedCaption = this.personalizeMessage(caption, context)
//       await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
//     }
//     console.log("[v0] Sent image:", imageUrl)
//   }

//   private async executeSendVideo(actionData: any, context: ExecutionContext): Promise<void> {
//     const { videoUrl, caption } = actionData
//     await this.instagramApi.sendVideoMessage(context.senderId, videoUrl)

//     if (caption) {
//       const personalizedCaption = this.personalizeMessage(caption, context)
//       await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
//     }
//     console.log("[v0] Sent video:", videoUrl)
//   }

//   private async executeAIResponse(actionData: any, context: ExecutionContext): Promise<void> {
//     const { customInstructions, tone, useKnowledgeBase } = actionData

//     let systemPrompt = `You are a helpful assistant responding to Instagram messages. ${customInstructions || ""}`

//     if (tone) {
//       systemPrompt += ` Use a ${tone} tone.`
//     }

//     if (useKnowledgeBase && context.knowledgeBase) {
//       systemPrompt += `\n\nKnowledge Base:\n${context.knowledgeBase}`
//     }

//     // Build conversation context
//     let userMessage = context.messageText || "Hello"
//     if (context.conversationHistory && context.conversationHistory.length > 0) {
//       const recentMessages = context.conversationHistory.slice(-5)
//       const contextMessages = recentMessages.map((msg: any) => `${msg.from}: ${msg.text}`).join("\n")
//       userMessage = `Previous conversation:\n${contextMessages}\n\nLatest message: ${context.messageText}`
//     }

//     try {
//       const { text } = await generateText({
//         model: "openai/gpt-4o-mini",
//         prompt: userMessage,
//         system: systemPrompt,
//         // maxTokens: 500,
//         //TODO
//       })

//       await this.instagramApi.sendTextMessage(context.senderId, text)
//       console.log("[v0] Sent AI response:", text)
//     } catch (error) {
//       console.error("[v0] AI response error:", error)
//       // Fallback message
//       await this.instagramApi.sendTextMessage(
//         context.senderId,
//         "Thanks for your message! Let me connect you with someone who can help.",
//       )
//     }
//   }

//   private async executeAddTag(actionData: any, context: ExecutionContext): Promise<void> {
//     const { tagName } = actionData
//     // Store tag in database (this would be implemented based on your database schema)
//     console.log("[v0] Added tag:", tagName, "to user:", context.userId)

//     // You would implement this to store in your database
//     // await db.userTags.create({ userId: context.userId, tag: tagName })
//   }

//   private async executeDelay(actionData: any, context: ExecutionContext): Promise<void> {
//     const { delayAmount, delayUnit } = actionData
//     const milliseconds = this.convertToMilliseconds(Number.parseInt(delayAmount), delayUnit)

//     console.log("[v0] Delaying for:", delayAmount, delayUnit)

//     // In production, you would use a job queue (like Bull, BullMQ) to schedule delayed actions
//     // For now, we'll just log it
//     console.log("[v0] Delay scheduled for:", milliseconds, "ms")

//     // Example: await jobQueue.add('delayed-action', { context, nextActions }, { delay: milliseconds })
//   }

//   private async executeWebhook(actionData: any, context: ExecutionContext): Promise<void> {
//     const { webhookUrl, method = "POST" } = actionData

//     const payload = {
//       userId: context.userId,
//       senderId: context.senderId,
//       message: context.messageText,
//       timestamp: new Date().toISOString(),
//       triggerData: context.triggerData,
//     }

//     try {
//       const response = await fetch(webhookUrl, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       })

//       if (!response.ok) {
//         throw new Error(`Webhook failed: ${response.status}`)
//       }

//       console.log("[v0] Webhook sent successfully to:", webhookUrl)
//     } catch (error) {
//       console.error("[v0] Webhook error:", error)
//     }
//   }

//   private async executeSendToHuman(actionData: any, context: ExecutionContext): Promise<void> {
//     const { reason, priority = "normal" } = actionData

//     console.log("[v0] Handing off to human:", reason, "Priority:", priority)

//     // In production, you would:
//     // 1. Create a ticket in your support system
//     // 2. Notify team members
//     // 3. Update conversation status

//     await this.instagramApi.sendTextMessage(
//       context.senderId,
//       "Thanks for your patience! I'm connecting you with a team member who can assist you further.",
//     )

//     // Example: await supportTicketSystem.create({ userId: context.userId, reason, priority })
//   }

//   private async executeCondition(actionData: any, context: ExecutionContext): Promise<void> {
//     const { field, operator, value } = actionData

//     let conditionMet = false

//     switch (field) {
//       case "message":
//         conditionMet = this.evaluateStringCondition(context.messageText || "", operator, value)
//         break

//       case "confidence":
//         // This would come from AI response confidence score
//         const confidence = context.triggerData?.confidence || 1.0
//         conditionMet = this.evaluateNumberCondition(confidence, operator, Number.parseFloat(value))
//         break

//       case "tag":
//         conditionMet = context.userTags?.includes(value) || false
//         break
//     }

//     console.log("[v0] Condition evaluated:", conditionMet, { field, operator, value })

//     // Return condition result for branching logic
//     // In a full implementation, you would use this to determine which branch to follow
//   }

//   private personalizeMessage(message: string, context: ExecutionContext): string {
//     // Replace variables in message
//     let personalizedMessage = message

//     // Common personalization variables
//     const replacements: Record<string, string> = {
//       "{name}": context.triggerData?.name || "there",
//       "{username}": context.triggerData?.username || "friend",
//       "{first_name}": context.triggerData?.firstName || context.triggerData?.name?.split(" ")[0] || "there",
//     }

//     for (const [variable, value] of Object.entries(replacements)) {
//       personalizedMessage = personalizedMessage.replace(new RegExp(variable, "g"), value)
//     }

//     return personalizedMessage
//   }

//   private evaluateStringCondition(text: string, operator: string, value: string): boolean {
//     const lowerText = text.toLowerCase()
//     const lowerValue = value.toLowerCase()

//     switch (operator) {
//       case "contains":
//         return lowerText.includes(lowerValue)
//       case "equals":
//         return lowerText === lowerValue
//       case "starts_with":
//         return lowerText.startsWith(lowerValue)
//       case "ends_with":
//         return lowerText.endsWith(lowerValue)
//       default:
//         return false
//     }
//   }

//   private evaluateNumberCondition(num: number, operator: string, value: number): boolean {
//     switch (operator) {
//       case "greater_than":
//         return num > value
//       case "less_than":
//         return num < value
//       case "equals":
//         return num === value
//       default:
//         return false
//     }
//   }

//   private convertToMilliseconds(amount: number, unit: string): number {
//     const conversions: Record<string, number> = {
//       seconds: 1000,
//       minutes: 60 * 1000,
//       hours: 60 * 60 * 1000,
//       days: 24 * 60 * 60 * 1000,
//     }

//     return amount * (conversions[unit] || conversions.minutes)
//   }

//   async executeAutomationFlow(
//     nodes: Array<{ type: string; actionType: string; data: any }>,
//     context: ExecutionContext,
//   ): Promise<void> {
//     console.log("[v0] Executing automation flow with", nodes.length, "nodes")

//     for (const node of nodes) {
//       if (node.type === "trigger") {
//         console.log("[v0] Trigger node:", node.actionType)
//         continue
//       }

//       if (node.type === "action") {
//         try {
//           await this.executeAction(node.actionType, node.data, context)

//           // Add delay between actions to avoid rate limiting
//           await new Promise((resolve) => setTimeout(resolve, 1000))
//         } catch (error) {
//           console.error("[v0] Action execution error:", error)
//           // Continue with next action even if one fails
//         }
//       }
//     }

//     console.log("[v0] Automation flow completed")
//   }
// }

// import type { InstagramAPI } from "./instagram-api"
// import { generateText } from "ai"

// export interface ExecutionContext {
//   userId: string
//   senderId: string
//   messageText?: string
//   triggerData: any
//   conversationHistory?: any[]
//   userTags?: string[]
//   knowledgeBase?: string
// }

// export class AutomationExecutor {
//   private instagramApi: InstagramAPI

//   constructor(instagramApi: InstagramAPI) {
//     this.instagramApi = instagramApi
//   }

//   async executeAction(actionType: string, actionData: any, context: ExecutionContext): Promise<void> {
//     // Normalize action type to uppercase
//     const normalizedActionType = actionType.toUpperCase()
//     console.log("[v0] Executing action:", normalizedActionType, actionData)

//     switch (normalizedActionType) {
//       case "SEND_MESSAGE":
//         await this.executeSendMessage(actionData, context)
//         break

//       case "SEND_IMAGE":
//         await this.executeSendImage(actionData, context)
//         break

//       case "SEND_VIDEO":
//         await this.executeSendVideo(actionData, context)
//         break

//       case "AI_RESPONSE":
//         await this.executeAIResponse(actionData, context)
//         break

//       case "ADD_TAG":
//         await this.executeAddTag(actionData, context)
//         break

//       case "DELAY":
//         await this.executeDelay(actionData, context)
//         break

//       case "WEBHOOK":
//         await this.executeWebhook(actionData, context)
//         break

//       case "SEND_TO_HUMAN":
//         await this.executeSendToHuman(actionData, context)
//         break

//       case "CONDITION":
//         return this.executeCondition(actionData, context)

//       default:
//         console.warn("[v0] Unknown action type:", actionType, "(normalized:", normalizedActionType + ")")
//     }
//   }

//   private async executeSendMessage(actionData: any, context: ExecutionContext): Promise<void> {
//     const message = this.personalizeMessage(actionData.message, context)
//     await this.instagramApi.sendTextMessage(context.senderId, message)
//     console.log("[v0] Sent message:", message)
//   }

//   private async executeSendImage(actionData: any, context: ExecutionContext): Promise<void> {
//     const { imageUrl, caption } = actionData
//     await this.instagramApi.sendImageMessage(context.senderId, imageUrl)

//     if (caption) {
//       const personalizedCaption = this.personalizeMessage(caption, context)
//       await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
//     }
//     console.log("[v0] Sent image:", imageUrl)
//   }

//   private async executeSendVideo(actionData: any, context: ExecutionContext): Promise<void> {
//     const { videoUrl, caption } = actionData
//     await this.instagramApi.sendVideoMessage(context.senderId, videoUrl)

//     if (caption) {
//       const personalizedCaption = this.personalizeMessage(caption, context)
//       await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
//     }
//     console.log("[v0] Sent video:", videoUrl)
//   }

//   private async executeAIResponse(actionData: any, context: ExecutionContext): Promise<void> {
//     const { customInstructions, tone, useKnowledgeBase } = actionData

//     let systemPrompt = `You are a helpful assistant responding to Instagram messages. ${customInstructions || ""}`

//     if (tone) {
//       systemPrompt += ` Use a ${tone} tone.`
//     }

//     if (useKnowledgeBase && context.knowledgeBase) {
//       systemPrompt += `\n\nKnowledge Base:\n${context.knowledgeBase}`
//     }

//     // Build conversation context
//     let userMessage = context.messageText || "Hello"
//     if (context.conversationHistory && context.conversationHistory.length > 0) {
//       const recentMessages = context.conversationHistory.slice(-5)
//       const contextMessages = recentMessages.map((msg: any) => `${msg.from}: ${msg.text}`).join("\n")
//       userMessage = `Previous conversation:\n${contextMessages}\n\nLatest message: ${context.messageText}`
//     }

//     try {
//       const { text } = await generateText({
//         model: "openai/gpt-4o-mini",
//         prompt: userMessage,
//         system: systemPrompt,
//         // maxTokens: 500,
//         //TODO
//       })

//       await this.instagramApi.sendTextMessage(context.senderId, text)
//       console.log("[v0] Sent AI response:", text)
//     } catch (error) {
//       console.error("[v0] AI response error:", error)
//       // Fallback message
//       await this.instagramApi.sendTextMessage(
//         context.senderId,
//         "Thanks for your message! Let me connect you with someone who can help.",
//       )
//     }
//   }

//   private async executeAddTag(actionData: any, context: ExecutionContext): Promise<void> {
//     const { tagName } = actionData
//     // Store tag in database (this would be implemented based on your database schema)
//     console.log("[v0] Added tag:", tagName, "to user:", context.userId)

//     // You would implement this to store in your database
//     // await db.userTags.create({ userId: context.userId, tag: tagName })
//   }

//   private async executeDelay(actionData: any, context: ExecutionContext): Promise<void> {
//     const { delayAmount, delayUnit } = actionData
//     const milliseconds = this.convertToMilliseconds(Number.parseInt(delayAmount), delayUnit)

//     console.log("[v0] Delaying for:", delayAmount, delayUnit)

//     // In production, you would use a job queue (like Bull, BullMQ) to schedule delayed actions
//     // For now, we'll just log it
//     console.log("[v0] Delay scheduled for:", milliseconds, "ms")

//     // Example: await jobQueue.add('delayed-action', { context, nextActions }, { delay: milliseconds })
//   }

//   private async executeWebhook(actionData: any, context: ExecutionContext): Promise<void> {
//     const { webhookUrl, method = "POST" } = actionData

//     const payload = {
//       userId: context.userId,
//       senderId: context.senderId,
//       message: context.messageText,
//       timestamp: new Date().toISOString(),
//       triggerData: context.triggerData,
//     }

//     try {
//       const response = await fetch(webhookUrl, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       })

//       if (!response.ok) {
//         throw new Error(`Webhook failed: ${response.status}`)
//       }

//       console.log("[v0] Webhook sent successfully to:", webhookUrl)
//     } catch (error) {
//       console.error("[v0] Webhook error:", error)
//     }
//   }

//   private async executeSendToHuman(actionData: any, context: ExecutionContext): Promise<void> {
//     const { reason, priority = "normal" } = actionData

//     console.log("[v0] Handing off to human:", reason, "Priority:", priority)

//     // In production, you would:
//     // 1. Create a ticket in your support system
//     // 2. Notify team members
//     // 3. Update conversation status

//     await this.instagramApi.sendTextMessage(
//       context.senderId,
//       "Thanks for your patience! I'm connecting you with a team member who can assist you further.",
//     )

//     // Example: await supportTicketSystem.create({ userId: context.userId, reason, priority })
//   }

//   private async executeCondition(actionData: any, context: ExecutionContext): Promise<void> {
//     const { field, operator, value } = actionData

//     let conditionMet = false

//     switch (field) {
//       case "message":
//         conditionMet = this.evaluateStringCondition(context.messageText || "", operator, value)
//         break

//       case "confidence":
//         // This would come from AI response confidence score
//         const confidence = context.triggerData?.confidence || 1.0
//         conditionMet = this.evaluateNumberCondition(confidence, operator, Number.parseFloat(value))
//         break

//       case "tag":
//         conditionMet = context.userTags?.includes(value) || false
//         break
//     }

//     console.log("[v0] Condition evaluated:", conditionMet, { field, operator, value })

//     // Return condition result for branching logic
//     // In a full implementation, you would use this to determine which branch to follow
//   }

//   private personalizeMessage(message: string, context: ExecutionContext): string {
//     // Replace variables in message
//     let personalizedMessage = message

//     // Common personalization variables
//     const replacements: Record<string, string> = {
//       "{name}": context.triggerData?.name || "there",
//       "{username}": context.triggerData?.username || "friend",
//       "{first_name}": context.triggerData?.firstName || context.triggerData?.name?.split(" ")[0] || "there",
//     }

//     for (const [variable, value] of Object.entries(replacements)) {
//       personalizedMessage = personalizedMessage.replace(new RegExp(variable, "g"), value)
//     }

//     return personalizedMessage
//   }

//   private evaluateStringCondition(text: string, operator: string, value: string): boolean {
//     const lowerText = text.toLowerCase()
//     const lowerValue = value.toLowerCase()

//     switch (operator) {
//       case "contains":
//         return lowerText.includes(lowerValue)
//       case "equals":
//         return lowerText === lowerValue
//       case "starts_with":
//         return lowerText.startsWith(lowerValue)
//       case "ends_with":
//         return lowerText.endsWith(lowerValue)
//       default:
//         return false
//     }
//   }

//   private evaluateNumberCondition(num: number, operator: string, value: number): boolean {
//     switch (operator) {
//       case "greater_than":
//         return num > value
//       case "less_than":
//         return num < value
//       case "equals":
//         return num === value
//       default:
//         return false
//     }
//   }

//   private convertToMilliseconds(amount: number, unit: string): number {
//     const conversions: Record<string, number> = {
//       seconds: 1000,
//       minutes: 60 * 1000,
//       hours: 60 * 60 * 1000,
//       days: 24 * 60 * 60 * 1000,
//     }

//     return amount * (conversions[unit] || conversions.minutes)
//   }

//   async executeAutomationFlow(
//     nodes: Array<{ type: string; actionType: string; data: any }>,
//     context: ExecutionContext,
//   ): Promise<void> {
//     console.log("[v0] Executing automation flow with", nodes.length, "nodes")

//     for (const node of nodes) {
//       if (node.type === "trigger") {
//         console.log("[v0] Trigger node:", node.actionType)
//         continue
//       }

//       if (node.type === "action") {
//         try {
//           await this.executeAction(node.actionType, node.data, context)

//           // Add delay between actions to avoid rate limiting
//           await new Promise((resolve) => setTimeout(resolve, 1000))
//         } catch (error) {
//           console.error("[v0] Action execution error:", error)
//           // Continue with next action even if one fails
//         }
//       }
//     }

//     console.log("[v0] Automation flow completed")
//   }
// }

import type { InstagramAPI } from "./instagram-api"
import { generateText } from "ai"

export interface ExecutionContext {
  userId: string
  senderId: string
  messageText?: string
  commentId?: string
  mediaId?: string
  storyId?: string
  triggerData: any
  conversationHistory?: any[]
  userTags?: string[]
  knowledgeBase?: string
  instagramAccountId: string
}

export class AutomationExecutor {
  private instagramApi: InstagramAPI

  constructor(instagramApi: InstagramAPI) {
    this.instagramApi = instagramApi
  }

  async executeAction(actionType: string, actionData: any, context: ExecutionContext): Promise<void> {
    const normalizedActionType = actionType.toUpperCase()
    console.log("[AutomationExecutor] Executing action:", normalizedActionType, {
      accountId: context.instagramAccountId,
      userId: context.userId,
    })

    switch (normalizedActionType) {
      case "SEND_MESSAGE":
        await this.executeSendMessage(actionData, context)
        break

      case "SEND_IMAGE":
        await this.executeSendImage(actionData, context)
        break

      case "SEND_VIDEO":
        await this.executeSendVideo(actionData, context)
        break

      case "SEND_CAROUSEL":
        await this.executeSendCarousel(actionData, context)
        break

      case "REPLY_TO_COMMENT":
        await this.executeReplyToComment(actionData, context)
        break

      case "HIDE_COMMENT":
        await this.executeHideComment(actionData, context)
        break

      case "AI_RESPONSE":
        await this.executeAIResponse(actionData, context)
        break

      case "ADD_TAG":
        await this.executeAddTag(actionData, context)
        break

      case "DELAY":
        await this.executeDelay(actionData, context)
        break

      case "WEBHOOK":
        await this.executeWebhook(actionData, context)
        break

      case "SEND_TO_HUMAN":
      case "HUMAN_HANDOFF":
        await this.executeSendToHuman(actionData, context)
        break

      case "CONDITION":
      case "CONDITIONAL_BRANCH":
        return this.executeCondition(actionData, context)

      default:
        console.warn(
          "[AutomationExecutor] Unknown action type:",
          actionType,
          "(normalized:",
          normalizedActionType + ")",
        )
    }
  }

  private async executeSendMessage(actionData: any, context: ExecutionContext): Promise<void> {
    const message = this.personalizeMessage(actionData.message, context)
    await this.instagramApi.sendTextMessage(context.senderId, message)
    console.log("[AutomationExecutor] Sent message:", message.substring(0, 50) + "...")
  }

  private async executeSendImage(actionData: any, context: ExecutionContext): Promise<void> {
    const { imageUrl, caption } = actionData

    if (!imageUrl) {
      console.error("[AutomationExecutor] Image URL is missing")
      return
    }

    await this.instagramApi.sendImageMessage(context.senderId, imageUrl)

    if (caption) {
      const personalizedCaption = this.personalizeMessage(caption, context)
      await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
    }
    console.log("[AutomationExecutor] Sent image:", imageUrl)
  }

  private async executeSendVideo(actionData: any, context: ExecutionContext): Promise<void> {
    const { videoUrl, caption } = actionData

    if (!videoUrl) {
      console.error("[AutomationExecutor] Video URL is missing")
      return
    }

    await this.instagramApi.sendVideoMessage(context.senderId, videoUrl)

    if (caption) {
      const personalizedCaption = this.personalizeMessage(caption, context)
      await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
    }
    console.log("[AutomationExecutor] Sent video:", videoUrl)
  }

  private async executeSendCarousel(actionData: any, context: ExecutionContext): Promise<void> {
    const { images, caption } = actionData

    if (!images || images.length === 0) {
      console.error("[AutomationExecutor] No images provided for carousel")
      return
    }

    console.log("[AutomationExecutor] Sending carousel with", images.length, "images")

    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i]
      await this.instagramApi.sendImageMessage(context.senderId, imageUrl)

      if (i < images.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    if (caption) {
      const personalizedCaption = this.personalizeMessage(caption, context)
      await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
    }

    console.log("[AutomationExecutor] Carousel sent successfully")
  }

  private async executeReplyToComment(actionData: any, context: ExecutionContext): Promise<void> {
    const { message } = actionData

    if (!context.commentId) {
      console.error("[AutomationExecutor] Comment ID is missing for reply")
      return
    }

    const personalizedMessage = this.personalizeMessage(message, context)
    await this.instagramApi.replyToComment(context.commentId, personalizedMessage)

    console.log("[AutomationExecutor] Replied to comment:", context.commentId)
  }

  private async executeHideComment(actionData: any, context: ExecutionContext): Promise<void> {
    const { shouldHide = true } = actionData

    if (!context.commentId) {
      console.error("[AutomationExecutor] Comment ID is missing for hide action")
      return
    }

    console.log("[AutomationExecutor]", shouldHide ? "Hiding" : "Unhiding", "comment:", context.commentId)

    // TODO: Implement hideComment method in InstagramAPI class
    // await this.instagramApi.hideComment(context.commentId, shouldHide)
  }

  private async executeAIResponse(actionData: any, context: ExecutionContext): Promise<void> {
    const {
      customInstructions,
      aiInstructions,
      tone,
      useKnowledgeBase,
      aiKnowledgeBase,
      temperature = 0.7,
    } = actionData

    let systemPrompt = `You are a helpful assistant responding to Instagram messages. ${customInstructions || aiInstructions || ""}`

    if (tone) {
      systemPrompt += ` Use a ${tone} tone.`
    }

    if ((useKnowledgeBase || aiKnowledgeBase) && context.knowledgeBase) {
      systemPrompt += `\n\nKnowledge Base:\n${context.knowledgeBase}`
    }

    let userMessage = context.messageText || "Hello"
    if (context.conversationHistory && context.conversationHistory.length > 0) {
      const recentMessages = context.conversationHistory.slice(-5)
      const contextMessages = recentMessages.map((msg: any) => `${msg.from}: ${msg.text}`).join("\n")
      userMessage = `Previous conversation:\n${contextMessages}\n\nLatest message: ${context.messageText}`
    }

    try {
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: userMessage,
        system: systemPrompt,
        temperature,
      })

      await this.instagramApi.sendTextMessage(context.senderId, text)
      console.log("[AutomationExecutor] Sent AI response:", text.substring(0, 50) + "...")
    } catch (error) {
      console.error("[AutomationExecutor] AI response error:", error)
      await this.instagramApi.sendTextMessage(
        context.senderId,
        "Thanks for your message! Let me connect you with someone who can help.",
      )
    }
  }

  private async executeAddTag(actionData: any, context: ExecutionContext): Promise<void> {
    const { tagName, tag } = actionData
    const finalTag = tagName || tag

    console.log("[AutomationExecutor] Added tag:", finalTag, "to user:", context.userId)

    // You would implement this to store in your database
    // await db.userTags.create({ userId: context.userId, tag: finalTag, accountId: context.instagramAccountId })
  }

  private async executeDelay(actionData: any, context: ExecutionContext): Promise<void> {
    const { delayAmount, delayUnit, delayMinutes, delayHours, delayDays } = actionData

    let milliseconds = 0
    if (delayAmount && delayUnit) {
      milliseconds = this.convertToMilliseconds(Number.parseInt(delayAmount), delayUnit)
    } else {
      milliseconds =
        (delayMinutes || 0) * 60 * 1000 + (delayHours || 0) * 60 * 60 * 1000 + (delayDays || 0) * 24 * 60 * 60 * 1000
    }

    console.log("[AutomationExecutor] Delaying for:", milliseconds, "ms")

    console.log("[AutomationExecutor] Delay scheduled - next action will execute after delay")

    // Example: await jobQueue.add('delayed-action', { context, nextActions }, { delay: milliseconds })
  }

  private async executeWebhook(actionData: any, context: ExecutionContext): Promise<void> {
    const { webhookUrl, method = "POST", webhookMethod = "POST", webhookHeaders, webhookBody } = actionData

    const finalUrl = webhookUrl
    const finalMethod = method || webhookMethod

    const payload = webhookBody
      ? this.personalizeMessage(JSON.stringify(webhookBody), context)
      : JSON.stringify({
          userId: context.userId,
          senderId: context.senderId,
          message: context.messageText,
          timestamp: new Date().toISOString(),
          triggerData: context.triggerData,
          accountId: context.instagramAccountId,
        })

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...webhookHeaders,
      }

      const response = await fetch(finalUrl, {
        method: finalMethod,
        headers,
        body: finalMethod === "POST" ? payload : undefined,
      })

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`)
      }

      console.log("[AutomationExecutor] Webhook sent successfully to:", finalUrl)
    } catch (error) {
      console.error("[AutomationExecutor] Webhook error:", error)
    }
  }

  private async executeSendToHuman(actionData: any, context: ExecutionContext): Promise<void> {
    const { reason, priority = "normal" } = actionData

    console.log("[AutomationExecutor] Handing off to human:", reason, "Priority:", priority)

    await this.instagramApi.sendTextMessage(
      context.senderId,
      "Thanks for your patience! I'm connecting you with a team member who can assist you further.",
    )

    // Example: await supportTicketSystem.create({ userId: context.userId, reason, priority, accountId: context.instagramAccountId })
  }

  private async executeCondition(actionData: any, context: ExecutionContext): Promise<void> {
    const { field, operator, value, conditionGroups } = actionData

    let conditionMet = false

    if (conditionGroups && conditionGroups.length > 0) {
      conditionMet = this.evaluateConditionGroups(conditionGroups, context)
    } else {
      switch (field) {
        case "message":
          conditionMet = this.evaluateStringCondition(context.messageText || "", operator, value)
          break

        case "username":
          conditionMet = this.evaluateStringCondition(context.triggerData?.username || "", operator, value)
          break

        case "follower_count":
          const followerCount = context.triggerData?.followerCount || 0
          conditionMet = this.evaluateNumberCondition(followerCount, operator, Number.parseFloat(value))
          break

        case "confidence":
          const confidence = context.triggerData?.confidence || 1.0
          conditionMet = this.evaluateNumberCondition(confidence, operator, Number.parseFloat(value))
          break

        case "tag":
          conditionMet = context.userTags?.includes(value) || false
          break

        case "is_verified":
          conditionMet = context.triggerData?.isVerified === (value === "true")
          break
      }
    }

    console.log("[AutomationExecutor] Condition evaluated:", conditionMet, { field, operator, value })
  }

  private evaluateConditionGroups(conditionGroups: any[], context: ExecutionContext): boolean {
    return conditionGroups.every((group: { rules: any[]; operator: string }) => {
      const results = group.rules.map((rule: { field: string; operator: string; value: string }) => {
        switch (rule.field) {
          case "message":
            return this.evaluateStringCondition(context.messageText || "", rule.operator, rule.value)
          case "username":
            return this.evaluateStringCondition(context.triggerData?.username || "", rule.operator, rule.value)
          case "follower_count":
            return this.evaluateNumberCondition(
              context.triggerData?.followerCount || 0,
              rule.operator,
              Number.parseFloat(rule.value),
            )
          default:
            return false
        }
      })

      return group.operator === "AND" ? results.every((r: boolean) => r) : results.some((r: boolean) => r)
    })
  }

  private personalizeMessage(message: string, context: ExecutionContext): string {
    let personalizedMessage = message

    const replacements: Record<string, string> = {
      "{name}": context.triggerData?.name || "there",
      "{username}": context.triggerData?.username || "friend",
      "{first_name}": context.triggerData?.firstName || context.triggerData?.name?.split(" ")[0] || "there",
      "{last_name}": context.triggerData?.lastName || context.triggerData?.name?.split(" ")[1] || "",
      "{full_name}": context.triggerData?.name || "there",
      "{message}": context.messageText || "",
      "{follower_count}": String(context.triggerData?.followerCount || 0),
    }

    for (const [variable, value] of Object.entries(replacements)) {
      personalizedMessage = personalizedMessage.replace(new RegExp(variable.replace(/[{}]/g, "\\$&"), "g"), value)
    }

    return personalizedMessage
  }

  private evaluateStringCondition(text: string, operator: string, value: string): boolean {
    const lowerText = text.toLowerCase()
    const lowerValue = value.toLowerCase()

    switch (operator) {
      case "contains":
        return lowerText.includes(lowerValue)
      case "not_contains":
        return !lowerText.includes(lowerValue)
      case "equals":
        return lowerText === lowerValue
      case "not_equals":
        return lowerText !== lowerValue
      case "starts_with":
        return lowerText.startsWith(lowerValue)
      case "ends_with":
        return lowerText.endsWith(lowerValue)
      case "is_empty":
        return text.trim() === ""
      case "is_not_empty":
        return text.trim() !== ""
      default:
        return false
    }
  }

  private evaluateNumberCondition(num: number, operator: string, value: number): boolean {
    switch (operator) {
      case "greater_than":
        return num > value
      case "less_than":
        return num < value
      case "equals":
        return num === value
      case "not_equals":
        return num !== value
      default:
        return false
    }
  }

  private convertToMilliseconds(amount: number, unit: string): number {
    const conversions: Record<string, number> = {
      seconds: 1000,
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
    }

    return amount * (conversions[unit] || conversions.minutes)
  }

  async executeAutomationFlow(
    nodes: Array<{ type: string; actionType: string; data: any }>,
    context: ExecutionContext,
  ): Promise<void> {
    console.log(
      "[AutomationExecutor] Executing automation flow with",
      nodes.length,
      "nodes for account:",
      context.instagramAccountId,
    )

    for (const node of nodes) {
      if (node.type === "trigger") {
        console.log("[AutomationExecutor] Trigger node:", node.actionType)
        continue
      }

      if (node.type === "action") {
        try {
          await this.executeAction(node.actionType, node.data, context)

          await new Promise((resolve) => setTimeout(resolve, 1000))
        } catch (error) {
          console.error("[AutomationExecutor] Action execution error:", error)
        }
      }
    }

    console.log("[AutomationExecutor] Automation flow completed")
  }
}
