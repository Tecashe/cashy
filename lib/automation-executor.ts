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

// import type { InstagramAPI } from "./instagram-api"
// import { aiResponseHandler } from "@/lib/ai-response-handler"
// import { generateText } from "ai"
// import { prisma } from "./db"

// export interface ExecutionContext {
//   userId: string
//   senderId: string
//   conversationId: string // Added this
//   username?: string // Added this
//   messageText?: string
//   commentId?: string
//   mediaId?: string
//   storyId?: string
//   triggerData: any
//   conversationHistory?: any[]
//   userTags?: string[]
//   knowledgeBase?: string
//   instagramAccountId: string
// }

// export class AutomationExecutor {
//   private instagramApi: InstagramAPI

//   constructor(instagramApi: InstagramAPI) {
//     this.instagramApi = instagramApi
//   }

//   async executeAction(actionType: string, actionData: any, context: ExecutionContext): Promise<void> {
//     const normalizedActionType = actionType.toUpperCase()
//     console.log("[AutomationExecutor] Executing action:", normalizedActionType, {
//       accountId: context.instagramAccountId,
//       userId: context.userId,
//     })

//     switch (normalizedActionType) {
//       case "SEND_MESSAGE":
//         await this.executeSendMessage(actionData, context)
//         break

//       case "AI_RESPONSE":
//       case "ai_response":
//         await this.executeAIResponse(actionData, context)
//         break

//       case "SEND_IMAGE":
//         await this.executeSendImage(actionData, context)
//         break

//       case "SEND_VIDEO":
//         await this.executeSendVideo(actionData, context)
//         break

//       case "SEND_CAROUSEL":
//         await this.executeSendCarousel(actionData, context)
//         break

//       case "REPLY_TO_COMMENT":
//         await this.executeReplyToComment(actionData, context)
//         break

//       case "HIDE_COMMENT":
//         await this.executeHideComment(actionData, context)
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
//       case "HUMAN_HANDOFF":
//         await this.executeSendToHuman(actionData, context)
//         break

//       case "CONDITION":
//       case "CONDITIONAL_BRANCH":
//         return this.executeCondition(actionData, context)

//       default:
//         console.warn(
//           "[AutomationExecutor] Unknown action type:",
//           actionType,
//           "(normalized:",
//           normalizedActionType + ")",
//         )
//     }
//   }

//   private async executeSendMessage(actionData: any, context: ExecutionContext): Promise<void> {
//     const message = this.personalizeMessage(actionData.message, context)
//     await this.instagramApi.sendTextMessage(context.senderId, message)
//     console.log("[AutomationExecutor] Sent message:", message.substring(0, 50) + "...")
//   }

//   private async executeSendImage(actionData: any, context: ExecutionContext): Promise<void> {
//     const { imageUrl, caption } = actionData

//     if (!imageUrl) {
//       console.error("[AutomationExecutor] Image URL is missing")
//       return
//     }

//     await this.instagramApi.sendImageMessage(context.senderId, imageUrl)

//     if (caption) {
//       const personalizedCaption = this.personalizeMessage(caption, context)
//       await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
//     }
//     console.log("[AutomationExecutor] Sent image:", imageUrl)
//   }

//   private async executeSendVideo(actionData: any, context: ExecutionContext): Promise<void> {
//     const { videoUrl, caption } = actionData

//     if (!videoUrl) {
//       console.error("[AutomationExecutor] Video URL is missing")
//       return
//     }

//     await this.instagramApi.sendVideoMessage(context.senderId, videoUrl)

//     if (caption) {
//       const personalizedCaption = this.personalizeMessage(caption, context)
//       await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
//     }
//     console.log("[AutomationExecutor] Sent video:", videoUrl)
//   }

//   private async executeSendCarousel(actionData: any, context: ExecutionContext): Promise<void> {
//     const { images, caption } = actionData

//     if (!images || images.length === 0) {
//       console.error("[AutomationExecutor] No images provided for carousel")
//       return
//     }

//     console.log("[AutomationExecutor] Sending carousel with", images.length, "images")

//     for (let i = 0; i < images.length; i++) {
//       const imageUrl = images[i]
//       await this.instagramApi.sendImageMessage(context.senderId, imageUrl)

//       if (i < images.length - 1) {
//         await new Promise((resolve) => setTimeout(resolve, 1000))
//       }
//     }

//     if (caption) {
//       const personalizedCaption = this.personalizeMessage(caption, context)
//       await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
//     }

//     console.log("[AutomationExecutor] Carousel sent successfully")
//   }

//   private async executeReplyToComment(actionData: any, context: ExecutionContext): Promise<void> {
//     const { message } = actionData

//     if (!context.commentId) {
//       console.error("[AutomationExecutor] Comment ID is missing for reply")
//       return
//     }

//     const personalizedMessage = this.personalizeMessage(message, context)
//     await this.instagramApi.replyToComment(context.commentId, personalizedMessage)

//     console.log("[AutomationExecutor] Replied to comment:", context.commentId)
//   }

//   private async executeHideComment(actionData: any, context: ExecutionContext): Promise<void> {
//     const { shouldHide = true } = actionData

//     if (!context.commentId) {
//       console.error("[AutomationExecutor] Comment ID is missing for hide action")
//       return
//     }

//     console.log("[AutomationExecutor]", shouldHide ? "Hiding" : "Unhiding", "comment:", context.commentId)

//     // TODO: Implement hideComment method in InstagramAPI class
//     // await this.instagramApi.hideComment(context.commentId, shouldHide)
//   }

//   private async executeAIResponseOriginal(actionData: any, context: ExecutionContext): Promise<void> {
//     const {
//       customInstructions,
//       aiInstructions,
//       tone,
//       useKnowledgeBase,
//       aiKnowledgeBase,
//       temperature = 0.7,
//     } = actionData

//     let systemPrompt = `You are a helpful assistant responding to Instagram messages. ${customInstructions || aiInstructions || ""}`

//     if (tone) {
//       systemPrompt += ` Use a ${tone} tone.`
//     }

//     if ((useKnowledgeBase || aiKnowledgeBase) && context.knowledgeBase) {
//       systemPrompt += `\n\nKnowledge Base:\n${context.knowledgeBase}`
//     }

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
//         temperature,
//       })

//       await this.instagramApi.sendTextMessage(context.senderId, text)
//       console.log("[AutomationExecutor] Sent AI response:", text.substring(0, 50) + "...")
//     } catch (error) {
//       console.error("[AutomationExecutor] AI response error:", error)
//       await this.instagramApi.sendTextMessage(
//         context.senderId,
//         "Thanks for your message! Let me connect you with someone who can help.",
//       )
//     }
//   }

//   private async executeAddTag(actionData: any, context: ExecutionContext): Promise<void> {
//     const { tagName, tag } = actionData
//     const finalTag = tagName || tag

//     console.log("[AutomationExecutor] Added tag:", finalTag, "to user:", context.userId)

//     // You would implement this to store in your database
//     // await db.userTags.create({ userId: context.userId, tag: finalTag, accountId: context.instagramAccountId })
//   }

//   private async executeDelay(actionData: any, context: ExecutionContext): Promise<void> {
//     const { delayAmount, delayUnit, delayMinutes, delayHours, delayDays } = actionData

//     let milliseconds = 0
//     if (delayAmount && delayUnit) {
//       milliseconds = this.convertToMilliseconds(Number.parseInt(delayAmount), delayUnit)
//     } else {
//       milliseconds =
//         (delayMinutes || 0) * 60 * 1000 + (delayHours || 0) * 60 * 60 * 1000 + (delayDays || 0) * 24 * 60 * 60 * 1000
//     }

//     console.log("[AutomationExecutor] Delaying for:", milliseconds, "ms")

//     console.log("[AutomationExecutor] Delay scheduled - next action will execute after delay")

//     // Example: await jobQueue.add('delayed-action', { context, nextActions }, { delay: milliseconds })
//   }

//   private async executeWebhook(actionData: any, context: ExecutionContext): Promise<void> {
//     const { webhookUrl, method = "POST", webhookMethod = "POST", webhookHeaders, webhookBody } = actionData

//     const finalUrl = webhookUrl
//     const finalMethod = method || webhookMethod

//     const payload = webhookBody
//       ? this.personalizeMessage(JSON.stringify(webhookBody), context)
//       : JSON.stringify({
//           userId: context.userId,
//           senderId: context.senderId,
//           message: context.messageText,
//           timestamp: new Date().toISOString(),
//           triggerData: context.triggerData,
//           accountId: context.instagramAccountId,
//         })

//     try {
//       const headers: Record<string, string> = {
//         "Content-Type": "application/json",
//         ...webhookHeaders,
//       }

//       const response = await fetch(finalUrl, {
//         method: finalMethod,
//         headers,
//         body: finalMethod === "POST" ? payload : undefined,
//       })

//       if (!response.ok) {
//         throw new Error(`Webhook failed: ${response.status}`)
//       }

//       console.log("[AutomationExecutor] Webhook sent successfully to:", finalUrl)
//     } catch (error) {
//       console.error("[AutomationExecutor] Webhook error:", error)
//     }
//   }

//   private async executeSendToHuman(actionData: any, context: ExecutionContext): Promise<void> {
//     const { reason, priority = "normal" } = actionData

//     console.log("[AutomationExecutor] Handing off to human:", reason, "Priority:", priority)

//     await this.instagramApi.sendTextMessage(
//       context.senderId,
//       "Thanks for your patience! I'm connecting you with a team member who can assist you further.",
//     )

//     // Example: await supportTicketSystem.create({ userId: context.userId, reason, priority, accountId: context.instagramAccountId })
//   }

//   private async executeCondition(actionData: any, context: ExecutionContext): Promise<void> {
//     const { field, operator, value, conditionGroups } = actionData

//     let conditionMet = false

//     if (conditionGroups && conditionGroups.length > 0) {
//       conditionMet = this.evaluateConditionGroups(conditionGroups, context)
//     } else {
//       switch (field) {
//         case "message":
//           conditionMet = this.evaluateStringCondition(context.messageText || "", operator, value)
//           break

//         case "username":
//           conditionMet = this.evaluateStringCondition(context.triggerData?.username || "", operator, value)
//           break

//         case "follower_count":
//           const followerCount = context.triggerData?.followerCount || 0
//           conditionMet = this.evaluateNumberCondition(followerCount, operator, Number.parseFloat(value))
//           break

//         case "confidence":
//           const confidence = context.triggerData?.confidence || 1.0
//           conditionMet = this.evaluateNumberCondition(confidence, operator, Number.parseFloat(value))
//           break

//         case "tag":
//           conditionMet = context.userTags?.includes(value) || false
//           break

//         case "is_verified":
//           conditionMet = context.triggerData?.isVerified === (value === "true")
//           break
//       }
//     }

//     console.log("[AutomationExecutor] Condition evaluated:", conditionMet, { field, operator, value })
//   }

//   private evaluateConditionGroups(conditionGroups: any[], context: ExecutionContext): boolean {
//     return conditionGroups.every((group: { rules: any[]; operator: string }) => {
//       const results = group.rules.map((rule: { field: string; operator: string; value: string }) => {
//         switch (rule.field) {
//           case "message":
//             return this.evaluateStringCondition(context.messageText || "", rule.operator, rule.value)
//           case "username":
//             return this.evaluateStringCondition(context.triggerData?.username || "", rule.operator, rule.value)
//           case "follower_count":
//             return this.evaluateNumberCondition(
//               context.triggerData?.followerCount || 0,
//               rule.operator,
//               Number.parseFloat(rule.value),
//             )
//           default:
//             return false
//         }
//       })

//       return group.operator === "AND" ? results.every((r: boolean) => r) : results.some((r: boolean) => r)
//     })
//   }

//   private personalizeMessage(message: string, context: ExecutionContext): string {
//     let personalizedMessage = message

//     const replacements: Record<string, string> = {
//       "{name}": context.triggerData?.name || "there",
//       "{username}": context.triggerData?.username || "friend",
//       "{first_name}": context.triggerData?.firstName || context.triggerData?.name?.split(" ")[0] || "there",
//       "{last_name}": context.triggerData?.lastName || context.triggerData?.name?.split(" ")[1] || "",
//       "{full_name}": context.triggerData?.name || "there",
//       "{message}": context.messageText || "",
//       "{follower_count}": String(context.triggerData?.followerCount || 0),
//     }

//     for (const [variable, value] of Object.entries(replacements)) {
//       personalizedMessage = personalizedMessage.replace(new RegExp(variable.replace(/[{}]/g, "\\$&"), "g"), value)
//     }

//     return personalizedMessage
//   }

//   private evaluateStringCondition(text: string, operator: string, value: string): boolean {
//     const lowerText = text.toLowerCase()
//     const lowerValue = value.toLowerCase()

//     switch (operator) {
//       case "contains":
//         return lowerText.includes(lowerValue)
//       case "not_contains":
//         return !lowerText.includes(lowerValue)
//       case "equals":
//         return lowerText === lowerValue
//       case "not_equals":
//         return lowerText !== lowerValue
//       case "starts_with":
//         return lowerText.startsWith(lowerValue)
//       case "ends_with":
//         return lowerText.endsWith(lowerValue)
//       case "is_empty":
//         return text.trim() === ""
//       case "is_not_empty":
//         return text.trim() !== ""
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
//       case "not_equals":
//         return num !== value
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
//     console.log(
//       "[AutomationExecutor] Executing automation flow with",
//       nodes.length,
//       "nodes for account:",
//       context.instagramAccountId,
//     )

//     for (const node of nodes) {
//       if (node.type === "trigger") {
//         console.log("[AutomationExecutor] Trigger node:", node.actionType)
//         continue
//       }

//       if (node.type === "action") {
//         try {
//           await this.executeAction(node.actionType, node.data, context)

//           await new Promise((resolve) => setTimeout(resolve, 1000))
//         } catch (error) {
//           console.error("[AutomationExecutor] Action execution error:", error)
//         }
//       }
//     }

//     console.log("[AutomationExecutor] Automation flow completed")
//   }

//   async executeAIResponse(actionData: any, context: ExecutionContext): Promise<void> {
//     try {
//       console.log("[Automation] Executing AI Response action")

//       // 1. Get conversation history
//       const conversationHistory = await prisma.message.findMany({
//         where: { conversationId: context.conversationId },
//         orderBy: { timestamp: "desc" },
//         take: actionData.historyDepth || 20,
//         select: {
//           content: true,
//           sender: true,
//         },
//       })

//       // Reverse to get chronological order
//       const history = conversationHistory.reverse().map((msg) => ({
//         role: msg.sender === "participant" ? "participant" : "assistant",
//         content: msg.content,
//       }))

//       // 2. Get conversation context
//       const conversation = await prisma.conversation.findUnique({
//         where: { id: context.conversationId },
//         include: {
//           conversationTags: {
//             include: { tag: true },
//           },
//         },
//       })

//       if (!conversation) {
//         throw new Error("Conversation not found")
//       }

//       // 3. Get user's previous interactions for personalization
//       const previousInteractions = await prisma.message.findMany({
//         where: {
//           conversation: {
//             instagramAccountId: context.instagramAccountId,
//             participantId: context.senderId,
//           },
//         },
//         orderBy: { timestamp: "desc" },
//         take: 50,
//       })

//       // 4. Prepare AI config (merge action config with defaults)
//       const aiConfig = {
//         model: actionData.model || "claude-sonnet-4-20250514",
//         tone: actionData.tone || "professional",
//         language: actionData.language || "auto",
//         maxTokens: actionData.maxTokens || 500,
//         temperature: actionData.temperature || 0.7,

//         systemPrompt: actionData.systemPrompt,
//         customInstructions: actionData.aiInstructions || actionData.customInstructions,
//         exampleConversations: actionData.exampleConversations || [],

//         useKnowledgeBase: actionData.aiKnowledgeBase || actionData.useKnowledgeBase || false,
//         knowledgeBaseDocs: actionData.knowledgeBaseDocs || [],

//         autoHandoff: actionData.autoHandoff !== false,
//         handoffTriggers: actionData.handoffTriggers || ["frustrated", "angry", "wants_human"],
//         maxTurns: actionData.maxTurns || 10,
//         confidenceThreshold: actionData.confidenceThreshold || 0.7,
//         useConversationHistory: actionData.useConversationHistory !== false,
//         historyDepth: actionData.historyDepth || 20,

//         contentFiltering: actionData.contentFiltering !== false,
//         sensitiveTopics: actionData.sensitiveTopics || [],
//         requireApproval: actionData.requireApproval || false,

//         useEmojis: actionData.useEmojis !== false,
//         responseLength: actionData.responseLength || "medium",
//         includeQuestions: actionData.includeQuestions !== false,
//         personalizeResponses: actionData.personalizeResponses !== false,

//         enabledFunctions: actionData.enabledFunctions || [],
//       }

//       // 5. Generate AI response
//       const aiResult = await aiResponseHandler.generateResponse(aiConfig, {
//         conversationId: context.conversationId,
//         participantName: context.triggerData?.participantName || context.triggerData?.name || "there",
//         participantUsername: context.triggerData?.participantUsername || context.username,
//         messageText: context.messageText || "",
//         conversationHistory: history,
//         userTags: context.userTags || [],
//         previousInteractions,
//       })

//       console.log("[Automation] AI Response generated:", {
//         responseLength: aiResult.response.length,
//         confidence: aiResult.confidence,
//         shouldHandoff: aiResult.shouldHandoff,
//         sentiment: aiResult.sentiment,
//       })

//       // 6. Check if approval is required
//       if (aiConfig.requireApproval) {
//         // Store response for approval
//         await prisma.pendingAIResponse.create({
//           data: {
//             conversationId: context.conversationId,
//             response: aiResult.response,
//             confidence: aiResult.confidence,
//             sentiment: aiResult.sentiment||"positive",
//             status: "pending",
//           },
//         })

//         console.log("[Automation] AI response queued for approval")
//         return
//       }

//       // 7. Check if handoff is needed
//       if (aiResult.shouldHandoff) {
//         console.log("[Automation] Handoff triggered:", aiResult.sentiment)

//         // Mark conversation for human review
//         await prisma.conversation.update({
//           where: { id: context.conversationId },
//           data: {
//             needsHumanReview: true,
//             handoffReason: aiResult.sentiment,
//           },
//         })

//         // Send handoff message if configured
//         if (actionData.handoffMessage) {
//           await this.instagramApi.sendMessage(context.senderId, actionData.handoffMessage)
//         }

//         // Stop automation
//         return
//       }

//       // 8. Send the AI response
//       await this.instagramApi.sendMessage(context.senderId, aiResult.response)

//       // 9. Save AI response to conversation
//       await prisma.message.create({
//         data: {
//           conversationId: context.conversationId,
//           content: aiResult.response,
//           sender: "business",
//           isFromUser: true,
//           messageType: "ai_response",
//           timestamp: new Date(),
//           metadata: {
//             confidence: aiResult.confidence,
//             sentiment: aiResult.sentiment,
//             usedFunctions: aiResult.usedFunctions,
//           },
//         },
//       })

//       // 10. Log interaction for analytics
//       await aiResponseHandler.logInteraction(
//         context.conversationId,
//         context.messageText || "",
//         aiResult.response,
//         {
//           confidence: aiResult.confidence,
//           sentiment: aiResult.sentiment,
//           shouldHandoff: aiResult.shouldHandoff,
//           usedFunctions: aiResult.usedFunctions,
//         }
//       )

//       console.log("[Automation] AI response sent successfully")
//     } catch (error) {
//       console.error("[Automation] AI Response error:", error)
//       throw error
//     }
//   }
// }




// import type { InstagramAPI } from "./instagram-api"
// import { aiResponseHandler } from "@/lib/ai-response-handler"
// import { generateText } from "ai"
// import { prisma } from "./db"

// export interface ExecutionContext {
//   userId: string
//   senderId: string
//   conversationId: string
//   username: string
//   name: string
//   messageText?: string
//   commentId?: string
//   mediaId?: string
//   storyId?: string
//   triggerData: any
//   conversationHistory?: any[]
//   userTags?: string[]
//   knowledgeBase?: string
//   instagramAccountId: string
// }

// export class AutomationExecutor {
//   private instagramApi: InstagramAPI

//   constructor(instagramApi: InstagramAPI) {
//     this.instagramApi = instagramApi
//   }

//   async executeAction(actionType: string, actionData: any, context: ExecutionContext): Promise<void> {
//     const normalizedActionType = actionType.toUpperCase()
//     console.log("[AutomationExecutor] Executing action:", normalizedActionType, {
//       accountId: context.instagramAccountId,
//       userId: context.userId,
//     })

//     switch (normalizedActionType) {
//       case "SEND_MESSAGE":
//         await this.executeSendMessage(actionData, context)
//         break

//       case "AI_RESPONSE":
//       case "ai_response":
//         await this.executeAIResponse(actionData, context)
//         break

//       case "SEND_IMAGE":
//         await this.executeSendImage(actionData, context)
//         break

//       case "SEND_VIDEO":
//         await this.executeSendVideo(actionData, context)
//         break

//       case "SEND_CAROUSEL":
//         await this.executeSendCarousel(actionData, context)
//         break

//       case "REPLY_TO_COMMENT":
//         await this.executeReplyToComment(actionData, context)
//         break

//       case "HIDE_COMMENT":
//         await this.executeHideComment(actionData, context)
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
//       case "HUMAN_HANDOFF":
//         await this.executeSendToHuman(actionData, context)
//         break

//       case "CONDITION":
//       case "CONDITIONAL_BRANCH":
//         return this.executeCondition(actionData, context)

//       default:
//         console.warn(
//           "[AutomationExecutor] Unknown action type:",
//           actionType,
//           "(normalized:",
//           normalizedActionType + ")",
//         )
//     }
//   }

//   private async executeSendMessage(actionData: any, context: ExecutionContext): Promise<void> {
//     const message = this.personalizeMessage(actionData.message, context)
//     await this.instagramApi.sendTextMessage(context.senderId, message)
    
//     // Save to conversation
//     await prisma.message.create({
//       data: {
//         conversationId: context.conversationId,
//         content: message,
//         sender: "business",
//         isFromUser: true,
//         timestamp: new Date(),
//       },
//     })
    
//     console.log("[AutomationExecutor] Sent message:", message.substring(0, 50) + "...")
//   }

//   private async executeSendImage(actionData: any, context: ExecutionContext): Promise<void> {
//     const { imageUrl, caption } = actionData

//     if (!imageUrl) {
//       console.error("[AutomationExecutor] Image URL is missing")
//       return
//     }

//     await this.instagramApi.sendImageMessage(context.senderId, imageUrl)

//     if (caption) {
//       const personalizedCaption = this.personalizeMessage(caption, context)
//       await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
//     }
//     console.log("[AutomationExecutor] Sent image:", imageUrl)
//   }

//   private async executeSendVideo(actionData: any, context: ExecutionContext): Promise<void> {
//     const { videoUrl, caption } = actionData

//     if (!videoUrl) {
//       console.error("[AutomationExecutor] Video URL is missing")
//       return
//     }

//     await this.instagramApi.sendVideoMessage(context.senderId, videoUrl)

//     if (caption) {
//       const personalizedCaption = this.personalizeMessage(caption, context)
//       await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
//     }
//     console.log("[AutomationExecutor] Sent video:", videoUrl)
//   }

//   private async executeSendCarousel(actionData: any, context: ExecutionContext): Promise<void> {
//     const { images, carouselImages, caption } = actionData
//     const finalImages = images || carouselImages || []

//     if (finalImages.length === 0) {
//       console.error("[AutomationExecutor] No images provided for carousel")
//       return
//     }

//     console.log("[AutomationExecutor] Sending carousel with", finalImages.length, "images")

//     // Check if instagramApi has sendGenericTemplate method
//     if (typeof this.instagramApi.sendGenericTemplate === 'function') {
//       // Use generic template if available
//       const elements = finalImages.map((imageUrl: string, index: number) => ({
//         title: `Image ${index + 1}`,
//         image_url: imageUrl,
//         buttons: [],
//       }))
      
//       await this.instagramApi.sendGenericTemplate(context.senderId, elements)
//     } else {
//       // Fallback: Send images sequentially
//       for (let i = 0; i < finalImages.length; i++) {
//         const imageUrl = finalImages[i]
//         await this.instagramApi.sendImageMessage(context.senderId, imageUrl)

//         if (i < finalImages.length - 1) {
//           await new Promise((resolve) => setTimeout(resolve, 1000))
//         }
//       }
//     }

//     if (caption) {
//       const personalizedCaption = this.personalizeMessage(caption, context)
//       await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
//     }

//     console.log("[AutomationExecutor] Carousel sent successfully")
//   }

//   private async executeReplyToComment(actionData: any, context: ExecutionContext): Promise<void> {
//     const { message } = actionData

//     if (!context.commentId) {
//       console.error("[AutomationExecutor] Comment ID is missing for reply")
//       return
//     }

//     const personalizedMessage = this.personalizeMessage(message, context)
//     await this.instagramApi.replyToComment(context.commentId, personalizedMessage)

//     console.log("[AutomationExecutor] Replied to comment:", context.commentId)
//   }

//   private async executeHideComment(actionData: any, context: ExecutionContext): Promise<void> {
//     const { shouldHide = true } = actionData

//     if (!context.commentId) {
//       console.error("[AutomationExecutor] Comment ID is missing for hide action")
//       return
//     }

//     console.log("[AutomationExecutor]", shouldHide ? "Hiding" : "Unhiding", "comment:", context.commentId)

//     // TODO: Implement hideComment method in InstagramAPI class
//     // await this.instagramApi.hideComment(context.commentId, shouldHide)
//   }

















//   private async executeAIResponse(actionData: any, context: ExecutionContext): Promise<void> {
//     try {
//       console.log("[Automation] 🤖 Executing AI Response with Commerce & MCP")

//       // 1. Get conversation history
//       const conversationHistory = await prisma.message.findMany({
//         where: { conversationId: context.conversationId },
//         orderBy: { timestamp: "desc" },
//         take: actionData.historyDepth || 20,
//         select: {
//           content: true,
//           sender: true,
//         },
//       })

//       // Reverse to get chronological order
//       const history = conversationHistory.reverse().map((msg) => ({
//         role: msg.sender === "participant" ? "participant" : "assistant",
//         content: msg.content,
//       }))

//       // 2. Get conversation context with commerce data
//       const conversation = await prisma.conversation.findUnique({
//         where: { id: context.conversationId },
//         include: {
//           conversationTags: {
//             include: { tag: true },
//           },
//           orders: {
//             orderBy: { createdAt: "desc" },
//             take: 5,
//             include: {
//               items: {
//                 include: {
//                   product: true,
//                 },
//               },
//             },
//           },
//           appointments: {
//             orderBy: { date: "desc" },
//             take: 3,
//           },
//           supportTickets: {
//             orderBy: { createdAt: "desc" },
//             take: 3,
//           },
//         },
//       })

//       if (!conversation) {
//         throw new Error("Conversation not found")
//       }

//       // 3. Get user's previous interactions for personalization
//       const previousInteractions = await prisma.message.findMany({
//         where: {
//           conversation: {
//             instagramAccountId: context.instagramAccountId,
//             participantId: context.senderId,
//           },
//         },
//         orderBy: { timestamp: "desc" },
//         take: 50,
//       })

//       // 4. Prepare AI config (merge action config with defaults)
//       const aiConfig = {
//         model: actionData.model || "claude-sonnet-4-20250514",
//         tone: actionData.tone || "professional",
//         language: actionData.language || "auto",
//         maxTokens: actionData.maxTokens || 2000,
//         temperature: actionData.temperature || 0.7,

//         systemPrompt: actionData.systemPrompt,
//         customInstructions: actionData.aiInstructions || actionData.customInstructions,
//         exampleConversations: actionData.exampleConversations || [],

//         // 🔥 COMMERCE FEATURES
//         enableCommerce: actionData.enableCommerce || false,
//         enablePayments: actionData.enablePayments || false,
//         enableAppointments: actionData.enableAppointments || false,
//         enableProductCatalog: actionData.enableProductCatalog || false,
//         mcpEnabled: actionData.mcpEnabled || false,

//         maxOrderValue: actionData.maxOrderValue || 500000, // $5000 in cents
//         requirePaymentConfirmation: actionData.requirePaymentConfirmation !== false,

//         useKnowledgeBase: actionData.aiKnowledgeBase || actionData.useKnowledgeBase || false,
//         knowledgeBaseDocs: actionData.knowledgeBaseDocs || [],

//         autoHandoff: actionData.autoHandoff !== false,
//         handoffTriggers: actionData.handoffTriggers || ["frustrated", "angry", "wants_human"],
//         maxTurns: actionData.maxTurns || 10,
//         confidenceThreshold: actionData.confidenceThreshold || 0.7,
//         useConversationHistory: actionData.useConversationHistory !== false,
//         historyDepth: actionData.historyDepth || 20,

//         contentFiltering: actionData.contentFiltering !== false,
//         sensitiveTopics: actionData.sensitiveTopics || [],
//         requireApproval: actionData.requireApproval || false,

//         useEmojis: actionData.useEmojis !== false,
//         responseLength: actionData.responseLength || "medium",
//         includeQuestions: actionData.includeQuestions !== false,
//         personalizeResponses: actionData.personalizeResponses !== false,

//         enabledFunctions: actionData.enabledFunctions || [],
//       }

//       // 5. Enhanced context with commerce data
//       const enhancedContext = {
//         conversationId: context.conversationId,
//         participantName: context.triggerData?.participantName || context.name || "there",
//         participantUsername: context.triggerData?.participantUsername || context.username,
//         messageText: context.messageText || "",
//         conversationHistory: history,
//         userTags: conversation.conversationTags.map((ct) => ct.tag.name),
//         previousInteractions,
        
//         // Commerce data
//         orderHistory: conversation.orders,
//         customerEmail: conversation.customerEmail,
//         customerPhone: conversation.customerPhone,
//         recentAppointments: conversation.appointments,
//         supportTickets: conversation.supportTickets,
//       }

//       // 6. Generate AI response
//       const aiResult = await aiResponseHandler.generateResponse(aiConfig, enhancedContext)

//       console.log("[Automation] AI Response generated:", {
//         responseLength: aiResult.response.length,
//         confidence: aiResult.confidence,
//         shouldHandoff: aiResult.shouldHandoff,
//         sentiment: aiResult.sentiment || "neutral",
//         actionsExecuted: (aiResult as any).actions?.length || 0,
//       })

//       // 7. Execute any commerce actions that AI decided to take
//       const actions = (aiResult as any).actions
//       if (actions && Array.isArray(actions) && actions.length > 0) {
//         for (const action of actions) {
//           console.log(`[Automation] 🎯 AI executed: ${action.tool}`)

//           // Handle product carousel
//           if (action.tool === "send_product_carousel" && action.result?.success) {
//             const queuedMessage = await prisma.queuedMessage.findFirst({
//               where: {
//                 conversationId: context.conversationId,
//                 status: "pending",
//                 type: "carousel",
//               },
//               orderBy: { createdAt: "desc" },
//             })

//             if (queuedMessage && typeof this.instagramApi.sendGenericTemplate === 'function') {
//               const carouselData = JSON.parse(queuedMessage.content as string)
//               await this.instagramApi.sendGenericTemplate(
//                 context.senderId,
//                 carouselData.elements
//               )

//               await prisma.queuedMessage.update({
//                 where: { id: queuedMessage.id },
//                 data: { status: "sent", sentAt: new Date() },
//               })
//             }
//           }

//           // Handle payment links
//           if (action.tool === "create_payment_link" && action.result?.success) {
//             await this.instagramApi.sendMessage(
//               context.senderId,
//               `💳 Secure payment link: ${action.result.payment_url}\n\nClick to complete your purchase. Link expires in 24 hours.`
//             )
//           }

//           // Handle appointment bookings
//           if (action.tool === "book_appointment" && action.result?.success) {
//             await this.instagramApi.sendMessage(
//               context.senderId,
//               action.result.confirmation_message || "✅ Your appointment has been booked!"
//             )
//           }
//         }
//       }

//       // 8. Check if approval is required
//       if (aiConfig.requireApproval) {
//         await prisma.pendingAIResponse.create({
//           data: {
//             conversationId: context.conversationId,
//             response: aiResult.response,
//             confidence: aiResult.confidence,
//             sentiment: aiResult.sentiment || "neutral",
//             status: "pending",
//           },
//         })

//         console.log("[Automation] AI response queued for approval")
//         return
//       }

//       // 9. Check if handoff is needed
//       if (aiResult.shouldHandoff) {
//         console.log("[Automation] Handoff triggered:", aiResult.sentiment || "unknown")

//         await prisma.conversation.update({
//           where: { id: context.conversationId },
//           data: {
//             needsHumanReview: true,
//             handoffReason: aiResult.sentiment || "unknown",
//           },
//         })

//         if (actionData.handoffMessage) {
//           await this.instagramApi.sendMessage(context.senderId, actionData.handoffMessage)
//         } else {
//           await this.instagramApi.sendMessage(
//             context.senderId,
//             "Thanks for your patience! I'm connecting you with a team member who can assist you further."
//           )
//         }

//         return
//       }

//       // 10. Send the AI response
//       if (aiResult.response) {
//         await this.instagramApi.sendMessage(context.senderId, aiResult.response)

//         // 11. Save AI response to conversation
//         await prisma.message.create({
//           data: {
//             conversationId: context.conversationId,
//             content: aiResult.response,
//             sender: "business",
//             isFromUser: true,
//             sentByAI: true,
//             messageType: "text",
//             timestamp: new Date(),
//             metadata: {
//               confidence: aiResult.confidence,
//               sentiment: aiResult.sentiment || "neutral",
//               usedFunctions: (aiResult as any).usedFunctions || [],
//               actions: (aiResult as any).actions || [],
//             },
//           },
//         })
//       }

//       // 12. Log interaction for analytics
//       await aiResponseHandler.logInteraction(
//         context.conversationId,
//         context.messageText || "",
//         aiResult.response,
//         {
//           confidence: aiResult.confidence,
//           sentiment: aiResult.sentiment || "neutral",
//           shouldHandoff: aiResult.shouldHandoff,
//           usedFunctions: (aiResult as any).usedFunctions || [],
//         }
//       )

//       console.log("[Automation] ✅ AI response sent successfully")
//     } catch (error) {
//       console.error("[Automation] ❌ AI Response error:", error)

//       // Fallback message
//       await this.instagramApi.sendMessage(
//         context.senderId,
//         "I apologize, but I'm having trouble processing that right now. Let me connect you with someone who can help."
//       )

//       // Trigger human handoff on error
//       await prisma.conversation.update({
//         where: { id: context.conversationId },
//         data: {
//           needsHumanReview: true,
//           handoffReason: "ai_error",
//         },
//       })

//       throw error
//     }
//   }


  






















//   private async executeAddTag(actionData: any, context: ExecutionContext): Promise<void> {
//     const { tagName, tag } = actionData
//     const finalTag = tagName || tag

//     if (!finalTag) {
//       console.error("[AutomationExecutor] No tag specified")
//       return
//     }

//     // Find or create tag
//     const tagRecord = await prisma.tag.upsert({
//       where: {
//         userId_name: {
//           userId: context.userId,
//           name: finalTag,
//         },
//       },
//       create: {
//         userId: context.userId,
//         name: finalTag,
//       },
//       update: {},
//     })

//     // Add tag to conversation
//     await prisma.conversationTag.upsert({
//       where: {
//         conversationId_tagId: {
//           conversationId: context.conversationId,
//           tagId: tagRecord.id,
//         },
//       },
//       create: {
//         conversationId: context.conversationId,
//         tagId: tagRecord.id,
//       },
//       update: {},
//     })

//     console.log("[AutomationExecutor] Added tag:", finalTag)
//   }

//   private async executeDelay(actionData: any, context: ExecutionContext): Promise<void> {
//     const { delayAmount, delayUnit, delayMinutes, delayHours, delayDays } = actionData

//     let milliseconds = 0
//     if (delayAmount && delayUnit) {
//       milliseconds = this.convertToMilliseconds(Number.parseInt(delayAmount), delayUnit)
//     } else {
//       milliseconds =
//         (delayMinutes || 0) * 60 * 1000 + (delayHours || 0) * 60 * 60 * 1000 + (delayDays || 0) * 24 * 60 * 60 * 1000
//     }

//     console.log("[AutomationExecutor] Delaying for:", milliseconds, "ms")
//     await new Promise((resolve) => setTimeout(resolve, milliseconds))
//   }

//   private async executeWebhook(actionData: any, context: ExecutionContext): Promise<void> {
//     const { webhookUrl, method = "POST", webhookMethod = "POST", webhookHeaders, webhookBody } = actionData

//     const finalUrl = webhookUrl
//     const finalMethod = method || webhookMethod

//     if (!finalUrl) {
//       console.error("[AutomationExecutor] No webhook URL provided")
//       return
//     }

//     const payload = webhookBody
//       ? this.personalizeMessage(JSON.stringify(webhookBody), context)
//       : JSON.stringify({
//           userId: context.userId,
//           senderId: context.senderId,
//           message: context.messageText,
//           timestamp: new Date().toISOString(),
//           triggerData: context.triggerData,
//           accountId: context.instagramAccountId,
//         })

//     try {
//       const headers: Record<string, string> = {
//         "Content-Type": "application/json",
//         ...webhookHeaders,
//       }

//       const response = await fetch(finalUrl, {
//         method: finalMethod,
//         headers,
//         body: finalMethod === "POST" ? payload : undefined,
//       })

//       if (!response.ok) {
//         throw new Error(`Webhook failed: ${response.status}`)
//       }

//       console.log("[AutomationExecutor] Webhook sent successfully to:", finalUrl)
//     } catch (error) {
//       console.error("[AutomationExecutor] Webhook error:", error)
//     }
//   }

//   private async executeSendToHuman(actionData: any, context: ExecutionContext): Promise<void> {
//     const { reason, priority = "normal", message } = actionData

//     console.log("[AutomationExecutor] Handing off to human:", reason, "Priority:", priority)

//     // Mark conversation for human review
//     await prisma.conversation.update({
//       where: { id: context.conversationId },
//       data: {
//         needsHumanReview: true,
//         handoffReason: reason || "automation_requested",
//       },
//     })

//     // Send handoff message
//     const handoffMessage = message
//       ? this.personalizeMessage(message, context)
//       : "Thanks for your patience! I'm connecting you with a team member who can assist you further."

//     await this.instagramApi.sendMessage(context.senderId, handoffMessage)
//   }

//   private async executeCondition(actionData: any, context: ExecutionContext): Promise<void> {
//     const { field, operator, value, conditionGroups } = actionData

//     let conditionMet = false

//     if (conditionGroups && conditionGroups.length > 0) {
//       conditionMet = this.evaluateConditionGroups(conditionGroups, context)
//     } else {
//       switch (field) {
//         case "message":
//           conditionMet = this.evaluateStringCondition(context.messageText || "", operator, value)
//           break

//         case "username":
//           conditionMet = this.evaluateStringCondition(context.triggerData?.username || "", operator, value)
//           break

//         case "follower_count":
//           const followerCount = context.triggerData?.followerCount || 0
//           conditionMet = this.evaluateNumberCondition(followerCount, operator, Number.parseFloat(value))
//           break

//         case "confidence":
//           const confidence = context.triggerData?.confidence || 1.0
//           conditionMet = this.evaluateNumberCondition(confidence, operator, Number.parseFloat(value))
//           break

//         case "tag":
//           conditionMet = context.userTags?.includes(value) || false
//           break

//         case "is_verified":
//           conditionMet = context.triggerData?.isVerified === (value === "true")
//           break
//       }
//     }

//     console.log("[AutomationExecutor] Condition evaluated:", conditionMet, { field, operator, value })
//   }

//   private evaluateConditionGroups(conditionGroups: any[], context: ExecutionContext): boolean {
//     return conditionGroups.every((group: { rules: any[]; operator: string }) => {
//       const results = group.rules.map((rule: { field: string; operator: string; value: string }) => {
//         switch (rule.field) {
//           case "message":
//             return this.evaluateStringCondition(context.messageText || "", rule.operator, rule.value)
//           case "username":
//             return this.evaluateStringCondition(context.triggerData?.username || "", rule.operator, rule.value)
//           case "follower_count":
//             return this.evaluateNumberCondition(
//               context.triggerData?.followerCount || 0,
//               rule.operator,
//               Number.parseFloat(rule.value),
//             )
//           default:
//             return false
//         }
//       })

//       return group.operator === "AND" ? results.every((r: boolean) => r) : results.some((r: boolean) => r)
//     })
//   }

//   private personalizeMessage(message: string, context: ExecutionContext): string {
//     let personalizedMessage = message

//     const firstName = context.name?.split(" ")[0] || context.name || "there"

//     const replacements: Record<string, string> = {
//       "{name}": context.name || "there",
//       "{username}": context.username || "friend",
//       "{first_name}": firstName,
//       "{last_name}": context.name?.split(" ")[1] || "",
//       "{full_name}": context.name || "there",
//       "{message}": context.messageText || "",
//       "{follower_count}": String(context.triggerData?.followerCount || 0),
//     }

//     for (const [variable, value] of Object.entries(replacements)) {
//       personalizedMessage = personalizedMessage.replace(new RegExp(variable.replace(/[{}]/g, "\\$&"), "g"), value)
//     }

//     return personalizedMessage
//   }

//   private evaluateStringCondition(text: string, operator: string, value: string): boolean {
//     const lowerText = text.toLowerCase()
//     const lowerValue = value.toLowerCase()

//     switch (operator) {
//       case "contains":
//         return lowerText.includes(lowerValue)
//       case "not_contains":
//         return !lowerText.includes(lowerValue)
//       case "equals":
//         return lowerText === lowerValue
//       case "not_equals":
//         return lowerText !== lowerValue
//       case "starts_with":
//         return lowerText.startsWith(lowerValue)
//       case "ends_with":
//         return lowerText.endsWith(lowerValue)
//       case "is_empty":
//         return text.trim() === ""
//       case "is_not_empty":
//         return text.trim() !== ""
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
//       case "not_equals":
//         return num !== value
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
//     console.log(
//       "[AutomationExecutor] Executing automation flow with",
//       nodes.length,
//       "nodes for account:",
//       context.instagramAccountId,
//     )

//     for (const node of nodes) {
//       if (node.type === "trigger") {
//         console.log("[AutomationExecutor] Trigger node:", node.actionType)
//         continue
//       }

//       if (node.type === "action") {
//         try {
//           await this.executeAction(node.actionType, node.data, context)
//           await new Promise((resolve) => setTimeout(resolve, 1000))
//         } catch (error) {
//           console.error("[AutomationExecutor] Action execution error:", error)
//         }
//       }
//     }

//     console.log("[AutomationExecutor] Automation flow completed")
//   }
// }



// import type { InstagramAPI } from "./instagram-api"
// import { aiResponseHandler } from "@/lib/ai-response-handler"
// import { prisma } from "./db"
// import { callPuterAI } from "./puter-ai-handler"

// export interface ExecutionContext {
//   userId: string
//   senderId: string
//   conversationId: string
//   username: string
//   name: string
//   messageText?: string
//   commentId?: string
//   mediaId?: string
//   storyId?: string
//   triggerData: any
//   conversationHistory?: any[]
//   userTags?: string[]
//   knowledgeBase?: string
//   instagramAccountId: string
// }

// export class AutomationExecutor {
//   private instagramApi: InstagramAPI

//   constructor(instagramApi: InstagramAPI) {
//     this.instagramApi = instagramApi
//   }

//   async executeAction(actionType: string, actionData: any, context: ExecutionContext): Promise<void> {
//     const normalizedActionType = actionType.toUpperCase()
//     console.log("[AutomationExecutor] Executing action:", normalizedActionType, {
//       accountId: context.instagramAccountId,
//       userId: context.userId,
//     })

//     switch (normalizedActionType) {
//       case "SEND_MESSAGE":
//         await this.executeSendMessage(actionData, context)
//         break

//       case "AI_RESPONSE":
//       case "ai_response":
//         await this.executeAIResponse(actionData, context)
//         break

//       case "SEND_IMAGE":
//         await this.executeSendImage(actionData, context)
//         break

//       case "SEND_VIDEO":
//         await this.executeSendVideo(actionData, context)
//         break

//       case "SEND_CAROUSEL":
//         await this.executeSendCarousel(actionData, context)
//         break

//       case "REPLY_TO_COMMENT":
//         await this.executeReplyToComment(actionData, context)
//         break

//       case "HIDE_COMMENT":
//         await this.executeHideComment(actionData, context)
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
//       case "HUMAN_HANDOFF":
//         await this.executeSendToHuman(actionData, context)
//         break

//       case "CONDITION":
//       case "CONDITIONAL_BRANCH":
//         return this.executeCondition(actionData, context)

//       default:
//         console.warn(
//           "[AutomationExecutor] Unknown action type:",
//           actionType,
//           "(normalized:",
//           normalizedActionType + ")",
//         )
//     }
//   }

//   private async executeSendMessage(actionData: any, context: ExecutionContext): Promise<void> {
//     const message = this.personalizeMessage(actionData.message, context)
//     await this.instagramApi.sendTextMessage(context.senderId, message)

//     // Save to conversation
//     await prisma.message.create({
//       data: {
//         conversationId: context.conversationId,
//         content: message,
//         sender: "business",
//         isFromUser: true,
//         timestamp: new Date(),
//       },
//     })

//     console.log("[AutomationExecutor] Sent message:", message.substring(0, 50) + "...")
//   }

//   private async executeSendImage(actionData: any, context: ExecutionContext): Promise<void> {
//     const { imageUrl, caption } = actionData

//     if (!imageUrl) {
//       console.error("[AutomationExecutor] Image URL is missing")
//       return
//     }

//     await this.instagramApi.sendImageMessage(context.senderId, imageUrl)

//     if (caption) {
//       const personalizedCaption = this.personalizeMessage(caption, context)
//       await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
//     }
//     console.log("[AutomationExecutor] Sent image:", imageUrl)
//   }

//   private async executeSendVideo(actionData: any, context: ExecutionContext): Promise<void> {
//     const { videoUrl, caption } = actionData

//     if (!videoUrl) {
//       console.error("[AutomationExecutor] Video URL is missing")
//       return
//     }

//     await this.instagramApi.sendVideoMessage(context.senderId, videoUrl)

//     if (caption) {
//       const personalizedCaption = this.personalizeMessage(caption, context)
//       await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
//     }
//     console.log("[AutomationExecutor] Sent video:", videoUrl)
//   }

//   private async executeSendCarousel(actionData: any, context: ExecutionContext): Promise<void> {
//     const { images, carouselImages, caption } = actionData
//     const finalImages = images || carouselImages || []

//     if (finalImages.length === 0) {
//       console.error("[AutomationExecutor] No images provided for carousel")
//       return
//     }

//     console.log("[AutomationExecutor] Sending carousel with", finalImages.length, "images")

//     // Check if instagramApi has sendGenericTemplate method
//     if (typeof this.instagramApi.sendGenericTemplate === "function") {
//       // Use generic template if available
//       const elements = finalImages.map((imageUrl: string, index: number) => ({
//         title: `Image ${index + 1}`,
//         image_url: imageUrl,
//         buttons: [],
//       }))

//       await this.instagramApi.sendGenericTemplate(context.senderId, elements)
//     } else {
//       // Fallback: Send images sequentially
//       for (let i = 0; i < finalImages.length; i++) {
//         const imageUrl = finalImages[i]
//         await this.instagramApi.sendImageMessage(context.senderId, imageUrl)

//         if (i < finalImages.length - 1) {
//           await new Promise((resolve) => setTimeout(resolve, 1000))
//         }
//       }
//     }

//     if (caption) {
//       const personalizedCaption = this.personalizeMessage(caption, context)
//       await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
//     }

//     console.log("[AutomationExecutor] Carousel sent successfully")
//   }

//   private async executeReplyToComment(actionData: any, context: ExecutionContext): Promise<void> {
//     const { message } = actionData

//     if (!context.commentId) {
//       console.error("[AutomationExecutor] Comment ID is missing for reply")
//       return
//     }

//     const personalizedMessage = this.personalizeMessage(message, context)
//     await this.instagramApi.replyToComment(context.commentId, personalizedMessage)

//     console.log("[AutomationExecutor] Replied to comment:", context.commentId)
//   }

//   private async executeHideComment(actionData: any, context: ExecutionContext): Promise<void> {
//     const { shouldHide = true } = actionData

//     if (!context.commentId) {
//       console.error("[AutomationExecutor] Comment ID is missing for hide action")
//       return
//     }

//     console.log("[AutomationExecutor]", shouldHide ? "Hiding" : "Unhiding", "comment:", context.commentId)

//     // TODO: Implement hideComment method in InstagramAPI class
//     // await this.instagramApi.hideComment(context.commentId, shouldHide)
//   }

//   private async executeAIResponse(actionData: any, context: ExecutionContext): Promise<void> {
//     try {
//       console.log("[Automation] 🤖 Executing AI Response with Commerce & MCP")

//       // 1. Get conversation history
//       const conversationHistory = await prisma.message.findMany({
//         where: { conversationId: context.conversationId },
//         orderBy: { timestamp: "desc" },
//         take: actionData.historyDepth || 20,
//         select: {
//           content: true,
//           sender: true,
//         },
//       })

//       // Reverse to get chronological order
//       const history = conversationHistory.reverse().map((msg) => ({
//         role: msg.sender === "participant" ? "participant" : "assistant",
//         content: msg.content,
//       }))

//       // 2. Get conversation context with commerce data
//       const conversation = await prisma.conversation.findUnique({
//         where: { id: context.conversationId },
//         include: {
//           conversationTags: {
//             include: { tag: true },
//           },
//           orders: {
//             orderBy: { createdAt: "desc" },
//             take: 5,
//             include: {
//               items: {
//                 include: {
//                   product: true,
//                 },
//               },
//             },
//           },
//           appointments: {
//             orderBy: { date: "desc" },
//             take: 3,
//           },
//           supportTickets: {
//             orderBy: { createdAt: "desc" },
//             take: 3,
//           },
//         },
//       })

//       if (!conversation) {
//         throw new Error("Conversation not found")
//       }

//       // 3. Get user's previous interactions for personalization
//       const previousInteractions = await prisma.message.findMany({
//         where: {
//           conversation: {
//             instagramAccountId: context.instagramAccountId,
//             participantId: context.senderId,
//           },
//         },
//         orderBy: { timestamp: "desc" },
//         take: 50,
//       })

//       // 4. Prepare AI config (merge action config with defaults)
//       const aiConfig = {
//         model: actionData.model || "claude-sonnet-4-20250514",
//         tone: actionData.tone || "professional",
//         language: actionData.language || "auto",
//         maxTokens: actionData.maxTokens || 2000,
//         temperature: actionData.temperature || 0.7,

//         systemPrompt: actionData.systemPrompt,
//         customInstructions: actionData.aiInstructions || actionData.customInstructions,
//         exampleConversations: actionData.exampleConversations || [],

//         // 🔥 COMMERCE FEATURES
//         enableCommerce: actionData.enableCommerce || false,
//         enablePayments: actionData.enablePayments || false,
//         enableAppointments: actionData.enableAppointments || false,
//         enableProductCatalog: actionData.enableProductCatalog || false,
//         mcpEnabled: actionData.mcpEnabled || false,

//         maxOrderValue: actionData.maxOrderValue || 500000, // $5000 in cents
//         requirePaymentConfirmation: actionData.requirePaymentConfirmation !== false,

//         useKnowledgeBase: actionData.aiKnowledgeBase || actionData.useKnowledgeBase || false,
//         knowledgeBaseDocs: actionData.knowledgeBaseDocs || [],

//         autoHandoff: actionData.autoHandoff !== false,
//         handoffTriggers: actionData.handoffTriggers || ["frustrated", "angry", "wants_human"],
//         maxTurns: actionData.maxTurns || 10,
//         confidenceThreshold: actionData.confidenceThreshold || 0.7,
//         useConversationHistory: actionData.useConversationHistory !== false,
//         historyDepth: actionData.historyDepth || 20,

//         contentFiltering: actionData.contentFiltering !== false,
//         sensitiveTopics: actionData.sensitiveTopics || [],
//         requireApproval: actionData.requireApproval || false,

//         useEmojis: actionData.useEmojis !== false,
//         responseLength: actionData.responseLength || "medium",
//         includeQuestions: actionData.includeQuestions !== false,
//         personalizeResponses: actionData.personalizeResponses !== false,

//         enabledFunctions: actionData.enabledFunctions || [],
//       }

//       // 5. Enhanced context with commerce data
//       const enhancedContext = {
//         conversationId: context.conversationId,
//         participantName: context.triggerData?.participantName || context.name || "there",
//         participantUsername: context.triggerData?.participantUsername || context.username,
//         messageText: context.messageText || "",
//         conversationHistory: history,
//         userTags: conversation.conversationTags.map((ct) => ct.tag.name),
//         previousInteractions,

//         // Commerce data
//         orderHistory: conversation.orders,
//         customerEmail: conversation.customerEmail,
//         customerPhone: conversation.customerPhone,
//         recentAppointments: conversation.appointments,
//         supportTickets: conversation.supportTickets,
//       }

//       // 6. Generate AI response
//       let aiResult
//       try {
//         aiResult = await aiResponseHandler.generateResponse(aiConfig, enhancedContext)
//       } catch (error) {
//         console.log("[Automation] Main AI failed, trying Puter.js fallback:", error)
//         const puterResponse = await callPuterAI(
//           context.messageText || "",
//           aiConfig.systemPrompt || "You are a helpful AI assistant.",
//         )

//         if (puterResponse.success) {
//           aiResult = {
//             response: puterResponse.response,
//             confidence: 0.8,
//             shouldHandoff: false,
//             sentiment: "neutral",
//           }
//         } else {
//           throw new Error("All AI providers failed")
//         }
//       }

//       console.log("[Automation] AI Response generated:", {
//         responseLength: aiResult.response.length,
//         confidence: aiResult.confidence,
//         shouldHandoff: aiResult.shouldHandoff,
//         sentiment: aiResult.sentiment || "neutral",
//         actionsExecuted: (aiResult as any).actions?.length || 0,
//       })

//       // 7. Execute any commerce actions that AI decided to take
//       const actions = (aiResult as any).actions
//       if (actions && Array.isArray(actions) && actions.length > 0) {
//         for (const action of actions) {
//           console.log(`[Automation] 🎯 AI executed: ${action.tool}`)

//           // Handle product carousel
//           if (action.tool === "send_product_carousel" && action.result?.success) {
//             const queuedMessage = await prisma.queuedMessage.findFirst({
//               where: {
//                 conversationId: context.conversationId,
//                 status: "pending",
//                 type: "carousel",
//               },
//               orderBy: { createdAt: "desc" },
//             })

//             if (queuedMessage && typeof this.instagramApi.sendGenericTemplate === "function") {
//               const carouselData = JSON.parse(queuedMessage.content as string)
//               await this.instagramApi.sendGenericTemplate(context.senderId, carouselData.elements)

//               await prisma.queuedMessage.update({
//                 where: { id: queuedMessage.id },
//                 data: { status: "sent", sentAt: new Date() },
//               })
//             }
//           }

//           // Handle payment links
//           if (action.tool === "create_payment_link" && action.result?.success) {
//             await this.instagramApi.sendMessage(
//               context.senderId,
//               `💳 Secure payment link: ${action.result.payment_url}\n\nClick to complete your purchase. Link expires in 24 hours.`,
//             )
//           }

//           // Handle appointment bookings
//           if (action.tool === "book_appointment" && action.result?.success) {
//             await this.instagramApi.sendMessage(
//               context.senderId,
//               action.result.confirmation_message || "✅ Your appointment has been booked!",
//             )
//           }
//         }
//       }

//       // 8. Check if approval is required
//       if (aiConfig.requireApproval) {
//         await prisma.pendingAIResponse.create({
//           data: {
//             conversationId: context.conversationId,
//             response: aiResult.response,
//             confidence: aiResult.confidence,
//             sentiment: aiResult.sentiment || "neutral",
//             status: "pending",
//           },
//         })

//         console.log("[Automation] AI response queued for approval")
//         return
//       }

//       // 9. Check if handoff is needed
//       if (aiResult.shouldHandoff) {
//         console.log("[Automation] Handoff triggered:", aiResult.sentiment || "unknown")

//         await prisma.conversation.update({
//           where: { id: context.conversationId },
//           data: {
//             needsHumanReview: true,
//             handoffReason: aiResult.sentiment || "unknown",
//           },
//         })

//         if (actionData.handoffMessage) {
//           await this.instagramApi.sendMessage(context.senderId, actionData.handoffMessage)
//         } else {
//           await this.instagramApi.sendMessage(
//             context.senderId,
//             "Thanks for your patience! I'm connecting you with a team member who can assist you further.",
//           )
//         }

//         return
//       }

//       // 10. Send the AI response
//       if (aiResult.response) {
//         await this.instagramApi.sendMessage(context.senderId, aiResult.response)

//         // 11. Save AI response to conversation
//         await prisma.message.create({
//           data: {
//             conversationId: context.conversationId,
//             content: aiResult.response,
//             sender: "business",
//             isFromUser: true,
//             sentByAI: true,
//             messageType: "text",
//             timestamp: new Date(),
//             metadata: {
//               confidence: aiResult.confidence,
//               sentiment: aiResult.sentiment || "neutral",
//               usedFunctions: (aiResult as any).usedFunctions || [],
//               actions: (aiResult as any).actions || [],
//             },
//           },
//         })
//       }

//       // 12. Log interaction for analytics
//       await aiResponseHandler.logInteraction(context.conversationId, context.messageText || "", aiResult.response, {
//         confidence: aiResult.confidence,
//         sentiment: aiResult.sentiment || "neutral",
//         shouldHandoff: aiResult.shouldHandoff,
//         usedFunctions: (aiResult as any).usedFunctions || [],
//       })

//       console.log("[Automation] ✅ AI response sent successfully")
//     } catch (error) {
//       console.error("[Automation] ❌ AI Response error:", error)

//       // Fallback message
//       await this.instagramApi.sendMessage(
//         context.senderId,
//         "I apologize, but I'm having trouble processing that right now. Let me connect you with someone who can help.",
//       )

//       // Trigger human handoff on error
//       await prisma.conversation.update({
//         where: { id: context.conversationId },
//         data: {
//           needsHumanReview: true,
//           handoffReason: "ai_error",
//         },
//       })

//       throw error
//     }
//   }

//   private async executeAddTag(actionData: any, context: ExecutionContext): Promise<void> {
//     const { tagName, tag } = actionData
//     const finalTag = tagName || tag

//     if (!finalTag) {
//       console.error("[AutomationExecutor] No tag specified")
//       return
//     }

//     // Find or create tag
//     const tagRecord = await prisma.tag.upsert({
//       where: {
//         userId_name: {
//           userId: context.userId,
//           name: finalTag,
//         },
//       },
//       create: {
//         userId: context.userId,
//         name: finalTag,
//       },
//       update: {},
//     })

//     // Add tag to conversation
//     await prisma.conversationTag.upsert({
//       where: {
//         conversationId_tagId: {
//           conversationId: context.conversationId,
//           tagId: tagRecord.id,
//         },
//       },
//       create: {
//         conversationId: context.conversationId,
//         tagId: tagRecord.id,
//       },
//       update: {},
//     })

//     console.log("[AutomationExecutor] Added tag:", finalTag)
//   }

//   private async executeDelay(actionData: any, context: ExecutionContext): Promise<void> {
//     const { delayAmount, delayUnit, delayMinutes, delayHours, delayDays } = actionData

//     let milliseconds = 0
//     if (delayAmount && delayUnit) {
//       milliseconds = this.convertToMilliseconds(Number.parseInt(delayAmount), delayUnit)
//     } else {
//       milliseconds =
//         (delayMinutes || 0) * 60 * 1000 + (delayHours || 0) * 60 * 60 * 1000 + (delayDays || 0) * 24 * 60 * 60 * 1000
//     }

//     console.log("[AutomationExecutor] Delaying for:", milliseconds, "ms")
//     await new Promise((resolve) => setTimeout(resolve, milliseconds))
//   }

//   private async executeWebhook(actionData: any, context: ExecutionContext): Promise<void> {
//     const { webhookUrl, method = "POST", webhookMethod = "POST", webhookHeaders, webhookBody } = actionData

//     const finalUrl = webhookUrl
//     const finalMethod = method || webhookMethod

//     if (!finalUrl) {
//       console.error("[AutomationExecutor] No webhook URL provided")
//       return
//     }

//     const payload = webhookBody
//       ? this.personalizeMessage(JSON.stringify(webhookBody), context)
//       : JSON.stringify({
//           userId: context.userId,
//           senderId: context.senderId,
//           message: context.messageText,
//           timestamp: new Date().toISOString(),
//           triggerData: context.triggerData,
//           accountId: context.instagramAccountId,
//         })

//     try {
//       const headers: Record<string, string> = {
//         "Content-Type": "application/json",
//         ...webhookHeaders,
//       }

//       const response = await fetch(finalUrl, {
//         method: finalMethod,
//         headers,
//         body: finalMethod === "POST" ? payload : undefined,
//       })

//       if (!response.ok) {
//         throw new Error(`Webhook failed: ${response.status}`)
//       }

//       console.log("[AutomationExecutor] Webhook sent successfully to:", finalUrl)
//     } catch (error) {
//       console.error("[AutomationExecutor] Webhook error:", error)
//     }
//   }

//   private async executeSendToHuman(actionData: any, context: ExecutionContext): Promise<void> {
//     const { reason, priority = "normal", message } = actionData

//     console.log("[AutomationExecutor] Handing off to human:", reason, "Priority:", priority)

//     // Mark conversation for human review
//     await prisma.conversation.update({
//       where: { id: context.conversationId },
//       data: {
//         needsHumanReview: true,
//         handoffReason: reason || "automation_requested",
//       },
//     })

//     // Send handoff message
//     const handoffMessage = message
//       ? this.personalizeMessage(message, context)
//       : "Thanks for your patience! I'm connecting you with a team member who can assist you further."

//     await this.instagramApi.sendMessage(context.senderId, handoffMessage)
//   }

//   private async executeCondition(actionData: any, context: ExecutionContext): Promise<void> {
//     const { field, operator, value, conditionGroups } = actionData

//     let conditionMet = false

//     if (conditionGroups && conditionGroups.length > 0) {
//       conditionMet = this.evaluateConditionGroups(conditionGroups, context)
//     } else {
//       switch (field) {
//         case "message":
//           conditionMet = this.evaluateStringCondition(context.messageText || "", operator, value)
//           break

//         case "username":
//           conditionMet = this.evaluateStringCondition(context.triggerData?.username || "", operator, value)
//           break

//         case "follower_count":
//           const followerCount = context.triggerData?.followerCount || 0
//           conditionMet = this.evaluateNumberCondition(followerCount, operator, Number.parseFloat(value))
//           break

//         case "confidence":
//           const confidence = context.triggerData?.confidence || 1.0
//           conditionMet = this.evaluateNumberCondition(confidence, operator, Number.parseFloat(value))
//           break

//         case "tag":
//           conditionMet = context.userTags?.includes(value) || false
//           break

//         case "is_verified":
//           conditionMet = context.triggerData?.isVerified === (value === "true")
//           break
//       }
//     }

//     console.log("[AutomationExecutor] Condition evaluated:", conditionMet, { field, operator, value })
//   }

//   private evaluateConditionGroups(conditionGroups: any[], context: ExecutionContext): boolean {
//     return conditionGroups.every((group: { rules: any[]; operator: string }) => {
//       const results = group.rules.map((rule: { field: string; operator: string; value: string }) => {
//         switch (rule.field) {
//           case "message":
//             return this.evaluateStringCondition(context.messageText || "", rule.operator, rule.value)
//           case "username":
//             return this.evaluateStringCondition(context.triggerData?.username || "", rule.operator, rule.value)
//           case "follower_count":
//             return this.evaluateNumberCondition(
//               context.triggerData?.followerCount || 0,
//               rule.operator,
//               Number.parseFloat(rule.value),
//             )
//           default:
//             return false
//         }
//       })

//       return group.operator === "AND" ? results.every((r: boolean) => r) : results.some((r: boolean) => r)
//     })
//   }

//   private personalizeMessage(message: string, context: ExecutionContext): string {
//     let personalizedMessage = message

//     const firstName = context.name?.split(" ")[0] || context.name || "there"

//     const replacements: Record<string, string> = {
//       "{name}": context.name || "there",
//       "{username}": context.username || "friend",
//       "{first_name}": firstName,
//       "{last_name}": context.name?.split(" ")[1] || "",
//       "{full_name}": context.name || "there",
//       "{message}": context.messageText || "",
//       "{follower_count}": String(context.triggerData?.followerCount || 0),
//     }

//     for (const [variable, value] of Object.entries(replacements)) {
//       personalizedMessage = personalizedMessage.replace(new RegExp(variable.replace(/[{}]/g, "\\$&"), "g"), value)
//     }

//     return personalizedMessage
//   }

//   private evaluateStringCondition(text: string, operator: string, value: string): boolean {
//     const lowerText = text.toLowerCase()
//     const lowerValue = value.toLowerCase()

//     switch (operator) {
//       case "contains":
//         return lowerText.includes(lowerValue)
//       case "not_contains":
//         return !lowerText.includes(lowerValue)
//       case "equals":
//         return lowerText === lowerValue
//       case "not_equals":
//         return lowerText !== lowerValue
//       case "starts_with":
//         return lowerText.startsWith(lowerValue)
//       case "ends_with":
//         return lowerText.endsWith(lowerValue)
//       case "is_empty":
//         return text.trim() === ""
//       case "is_not_empty":
//         return text.trim() !== ""
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
//       case "not_equals":
//         return num !== value
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
//     console.log(
//       "[AutomationExecutor] Executing automation flow with",
//       nodes.length,
//       "nodes for account:",
//       context.instagramAccountId,
//     )

//     for (const node of nodes) {
//       if (node.type === "trigger") {
//         console.log("[AutomationExecutor] Trigger node:", node.actionType)
//         continue
//       }

//       if (node.type === "action") {
//         try {
//           await this.executeAction(node.actionType, node.data, context)
//           await new Promise((resolve) => setTimeout(resolve, 1000))
//         } catch (error) {
//           console.error("[AutomationExecutor] Action execution error:", error)
//         }
//       }
//     }

//     console.log("[AutomationExecutor] Automation flow completed")
//   }
// }

import type { InstagramAPI } from "./instagram-api"
import { aiResponseHandler } from "@/lib/ai-response-handler"
import { prisma } from "./db"
import { callPuterAI } from "./puter-ai-handler"
import { sendInstagramCarousel } from "./instagram-carousel"

export interface ExecutionContext {
  userId: string
  senderId: string
  conversationId: string
  username: string
  name: string
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

      case "AI_RESPONSE":
      case "ai_response":
        await this.executeAIResponse(actionData, context)
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

    // Save to conversation
    await prisma.message.create({
      data: {
        conversationId: context.conversationId,
        content: message,
        sender: "business",
        isFromUser: true,
        timestamp: new Date(),
      },
    })

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
    const { images, carouselImages, caption } = actionData
    const finalImages = images || carouselImages || []

    if (finalImages.length === 0) {
      console.error("[AutomationExecutor] No images provided for carousel")
      return
    }

    console.log("[AutomationExecutor] Sending carousel with", finalImages.length, "images")

    // Check if instagramApi has sendGenericTemplate method
    if (typeof this.instagramApi.sendGenericTemplate === "function") {
      // Use generic template if available
      const elements = finalImages.map((imageUrl: string, index: number) => ({
        title: `Image ${index + 1}`,
        image_url: imageUrl,
        buttons: [],
      }))

      await this.instagramApi.sendGenericTemplate(context.senderId, elements)
    } else {
      // Fallback: Send images sequentially
      for (let i = 0; i < finalImages.length; i++) {
        const imageUrl = finalImages[i]
        await this.instagramApi.sendImageMessage(context.senderId, imageUrl)

        if (i < finalImages.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
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

















  // private async executeAIResponse(actionData: any, context: ExecutionContext): Promise<void> {
  //   try {
  //     console.log("[Automation] 🤖 Executing AI Response with Commerce & MCP")

  //     // 1. Get conversation history
  //     const conversationHistory = await prisma.message.findMany({
  //       where: { conversationId: context.conversationId },
  //       orderBy: { timestamp: "desc" },
  //       take: actionData.historyDepth || 20,
  //       select: {
  //         content: true,
  //         sender: true,
  //       },
  //     })

  //     // Reverse to get chronological order
  //     const history = conversationHistory.reverse().map((msg) => ({
  //       role: msg.sender === "participant" ? "participant" : "assistant",
  //       content: msg.content,
  //     }))

  //     // 2. Get conversation context with commerce data
  //     const conversation = await prisma.conversation.findUnique({
  //       where: { id: context.conversationId },
  //       include: {
  //         conversationTags: {
  //           include: { tag: true },
  //         },
  //         orders: {
  //           orderBy: { createdAt: "desc" },
  //           take: 5,
  //           include: {
  //             items: {
  //               include: {
  //                 product: true,
  //               },
  //             },
  //           },
  //         },
  //         appointments: {
  //           orderBy: { date: "desc" },
  //           take: 3,
  //         },
  //         supportTickets: {
  //           orderBy: { createdAt: "desc" },
  //           take: 3,
  //         },
  //       },
  //     })

  //     if (!conversation) {
  //       throw new Error("Conversation not found")
  //     }

  //     // 3. Get user's previous interactions for personalization
  //     const previousInteractions = await prisma.message.findMany({
  //       where: {
  //         conversation: {
  //           instagramAccountId: context.instagramAccountId,
  //           participantId: context.senderId,
  //         },
  //       },
  //       orderBy: { timestamp: "desc" },
  //       take: 50,
  //     })

  //     // 4. Prepare AI config (merge action config with defaults)
  //     const aiConfig = {
  //       model: actionData.model || "claude-sonnet-4-20250514",
  //       tone: actionData.tone || "professional",
  //       language: actionData.language || "auto",
  //       maxTokens: actionData.maxTokens || 2000,
  //       temperature: actionData.temperature || 0.7,

  //       systemPrompt: actionData.systemPrompt,
  //       customInstructions: actionData.aiInstructions || actionData.customInstructions,
  //       exampleConversations: actionData.exampleConversations || [],

  //       // 🔥 COMMERCE FEATURES
  //       enableCommerce: actionData.enableCommerce || false,
  //       enablePayments: actionData.enablePayments || false,
  //       enableAppointments: actionData.enableAppointments || false,
  //       enableProductCatalog: actionData.enableProductCatalog || false,
  //       mcpEnabled: actionData.mcpEnabled || false,

  //       maxOrderValue: actionData.maxOrderValue || 500000, // $5000 in cents
  //       requirePaymentConfirmation: actionData.requirePaymentConfirmation !== false,

  //       useKnowledgeBase: actionData.aiKnowledgeBase || actionData.useKnowledgeBase || false,
  //       knowledgeBaseDocs: actionData.knowledgeBaseDocs || [],

  //       autoHandoff: actionData.autoHandoff !== false,
  //       handoffTriggers: actionData.handoffTriggers || ["frustrated", "angry", "wants_human"],
  //       maxTurns: actionData.maxTurns || 10,
  //       confidenceThreshold: actionData.confidenceThreshold || 0.7,
  //       useConversationHistory: actionData.useConversationHistory !== false,
  //       historyDepth: actionData.historyDepth || 20,

  //       contentFiltering: actionData.contentFiltering !== false,
  //       sensitiveTopics: actionData.sensitiveTopics || [],
  //       requireApproval: actionData.requireApproval || false,

  //       useEmojis: actionData.useEmojis !== false,
  //       responseLength: actionData.responseLength || "medium",
  //       includeQuestions: actionData.includeQuestions !== false,
  //       personalizeResponses: actionData.personalizeResponses !== false,

  //       enabledFunctions: actionData.enabledFunctions || [],
  //     }

  //     // 5. Enhanced context with commerce data
  //     const enhancedContext = {
  //       conversationId: context.conversationId,
  //       participantName: context.triggerData?.participantName || context.name || "there",
  //       participantUsername: context.triggerData?.participantUsername || context.username,
  //       messageText: context.messageText || "",
  //       conversationHistory: history,
  //       userTags: conversation.conversationTags.map((ct) => ct.tag.name),
  //       previousInteractions,

  //       // Commerce data
  //       orderHistory: conversation.orders,
  //       customerEmail: conversation.customerEmail,
  //       customerPhone: conversation.customerPhone,
  //       recentAppointments: conversation.appointments,
  //       supportTickets: conversation.supportTickets,
  //     }

  //     // 6. Generate AI response
  //     let aiResult
  //     try {
  //       aiResult = await aiResponseHandler.generateResponse(aiConfig, enhancedContext)
  //     } catch (error) {
  //       console.log("[Automation] Main AI failed, trying Puter.js fallback:", error)
  //       const puterResponse = await callPuterAI(
  //         context.messageText || "",
  //         aiConfig.systemPrompt || "You are a helpful AI assistant.",
  //       )

  //       if (puterResponse.success) {
  //         aiResult = {
  //           response: puterResponse.response,
  //           confidence: 0.8,
  //           shouldHandoff: false,
  //           sentiment: "neutral",
  //         }
  //       } else {
  //         throw new Error("All AI providers failed")
  //       }
  //     }

  //     console.log("[Automation] AI Response generated:", {
  //       responseLength: aiResult.response.length,
  //       confidence: aiResult.confidence,
  //       shouldHandoff: aiResult.shouldHandoff,
  //       sentiment: aiResult.sentiment || "neutral",
  //       actionsExecuted: (aiResult as any).actions?.length || 0,
  //     })

  //     // 7. Execute any commerce actions that AI decided to take
  //     const actions = (aiResult as any).actions
  //     if (actions && Array.isArray(actions) && actions.length > 0) {
  //       for (const action of actions) {
  //         console.log(`[Automation] 🎯 AI executed: ${action.tool}`)

  //         // Handle product carousel
  //         if (action.tool === "send_product_carousel" && action.result?.success) {
  //           const queuedMessage = await prisma.queuedMessage.findFirst({
  //             where: {
  //               conversationId: context.conversationId,
  //               status: "pending",
  //               type: "carousel",
  //             },
  //             orderBy: { createdAt: "desc" },
  //           })

  //           if (queuedMessage && typeof this.instagramApi.sendGenericTemplate === "function") {
  //             const carouselData = JSON.parse(queuedMessage.content as string)
  //             await this.instagramApi.sendGenericTemplate(context.senderId, carouselData.elements)

  //             await prisma.queuedMessage.update({
  //               where: { id: queuedMessage.id },
  //               data: { status: "sent", sentAt: new Date() },
  //             })
  //           }
  //         }

  //         // Handle payment links
  //         if (action.tool === "create_payment_link" && action.result?.success) {
  //           await this.instagramApi.sendMessage(
  //             context.senderId,
  //             `💳 Secure payment link: ${action.result.payment_url}\n\nClick to complete your purchase. Link expires in 24 hours.`,
  //           )
  //         }

  //         // Handle appointment bookings
  //         if (action.tool === "book_appointment" && action.result?.success) {
  //           await this.instagramApi.sendMessage(
  //             context.senderId,
  //             action.result.confirmation_message || "✅ Your appointment has been booked!",
  //           )
  //         }
  //       }
  //     }

  //     // 8. Check if approval is required
  //     if (aiConfig.requireApproval) {
  //       await prisma.pendingAIResponse.create({
  //         data: {
  //           conversationId: context.conversationId,
  //           response: aiResult.response,
  //           confidence: aiResult.confidence,
  //           sentiment: aiResult.sentiment || "neutral",
  //           status: "pending",
  //         },
  //       })

  //       console.log("[Automation] AI response queued for approval")
  //       return
  //     }

  //     // 9. Check if handoff is needed
  //     if (aiResult.shouldHandoff) {
  //       console.log("[Automation] Handoff triggered:", aiResult.sentiment || "unknown")

  //       await prisma.conversation.update({
  //         where: { id: context.conversationId },
  //         data: {
  //           needsHumanReview: true,
  //           handoffReason: aiResult.sentiment || "unknown",
  //         },
  //       })

  //       if (actionData.handoffMessage) {
  //         await this.instagramApi.sendMessage(context.senderId, actionData.handoffMessage)
  //       } else {
  //         await this.instagramApi.sendMessage(
  //           context.senderId,
  //           "Thanks for your patience! I'm connecting you with a team member who can assist you further.",
  //         )
  //       }

  //       return
  //     }

  //     // 10. Send the AI response
  //     if (aiResult.response) {
  //       await this.instagramApi.sendMessage(context.senderId, aiResult.response)

  //       if (aiResult.carousel && aiResult.carousel.rawCards && aiResult.carousel.rawCards.length > 0) {
  //         console.log("[Automation] 🎠 Sending native Instagram carousel")

  //         const pageAccessToken = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN
  //         if (pageAccessToken) {
  //           await sendInstagramCarousel(context.senderId, aiResult.carousel.rawCards, pageAccessToken)
  //         } else {
  //           console.warn("[Automation] Cannot send carousel: INSTAGRAM_PAGE_ACCESS_TOKEN missing")
  //           // Fallback for missing token: send images sequentially
  //           for (const item of aiResult.carousel.items.slice(0, 3)) {
  //             if (item.image_url) {
  //               await this.instagramApi.sendImageMessage(context.senderId, item.image_url)
  //               await this.instagramApi.sendTextMessage(
  //                 context.senderId,
  //                 `*${item.title}*\n${item.price || ""}\n${item.action_url}`,
  //               )
  //             }
  //           }
  //         }
  //       }

  //       // 11. Save AI response to conversation
  //       await prisma.message.create({
  //         data: {
  //           conversationId: context.conversationId,
  //           content: aiResult.response,
  //           sender: "business",
  //           isFromUser: true,
  //           sentByAI: true,
  //           messageType: "text",
  //           timestamp: new Date(),
  //           metadata: {
  //             confidence: aiResult.confidence,
  //             sentiment: aiResult.sentiment || "neutral",
  //             usedFunctions: (aiResult as any).usedFunctions || [],
  //             actions: (aiResult as any).actions || [],
  //           },
  //         },
  //       })
  //     }

  //     // 12. Log interaction for analytics
  //     await aiResponseHandler.logInteraction(context.conversationId, context.messageText || "", aiResult.response, {
  //       confidence: aiResult.confidence,
  //       sentiment: aiResult.sentiment || "neutral",
  //       shouldHandoff: aiResult.shouldHandoff,
  //       usedFunctions: (aiResult as any).usedFunctions || [],
  //     })

  //     console.log("[Automation] ✅ AI response sent successfully")
  //   } catch (error) {
  //     console.error("[Automation] ❌ AI Response error:", error)

  //     // Fallback message
  //     await this.instagramApi.sendMessage(
  //       context.senderId,
  //       "I apologize, but I'm having trouble processing that right now. Let me connect you with someone who can help.",
  //     )

  //     // Trigger human handoff on error
  //     await prisma.conversation.update({
  //       where: { id: context.conversationId },
  //       data: {
  //         needsHumanReview: true,
  //         handoffReason: "ai_error",
  //       },
  //     })

  //     throw error
  //   }
  // }

  // ============================================================================
// PART 1: automation-executor.ts - executeAIResponse method (COMPLETE FIX)
// ============================================================================

private async executeAIResponse(actionData: any, context: ExecutionContext): Promise<void> {
  try {
    console.log("[Automation] 🤖 Executing AI Response with Commerce & MCP")

    // 1. Get conversation history
    const conversationHistory = await prisma.message.findMany({
      where: { conversationId: context.conversationId },
      orderBy: { timestamp: "desc" },
      take: actionData.historyDepth || 20,
      select: {
        content: true,
        sender: true,
      },
    })

    const history = conversationHistory.reverse().map((msg) => ({
      role: msg.sender === "participant" ? "participant" : "assistant",
      content: msg.content,
    }))

    // 2. Get conversation context with commerce data
    const conversation = await prisma.conversation.findUnique({
      where: { id: context.conversationId },
      include: {
        conversationTags: {
          include: { tag: true },
        },
        orders: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
        appointments: {
          orderBy: { date: "desc" },
          take: 3,
        },
        supportTickets: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
    })

    if (!conversation) {
      throw new Error("Conversation not found")
    }

    // 3. Get user's previous interactions
    const previousInteractions = await prisma.message.findMany({
      where: {
        conversation: {
          instagramAccountId: context.instagramAccountId,
          participantId: context.senderId,
        },
      },
      orderBy: { timestamp: "desc" },
      take: 50,
    })

    // 🔥 4. FETCH KNOWLEDGE BASE DOCUMENTS (NEW)
    let knowledgeDocuments: any[] = []
    if (actionData.aiKnowledgeBase || actionData.useKnowledgeBase) {
      console.log("[Automation] 📚 Loading knowledge base documents...")
      
      knowledgeDocuments = await prisma.knowledgeDocument.findMany({
        where: { 
          userId: context.userId,
        },
        select: {
          id: true,
          title: true,
          content: true,
          type: true,
          tags: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 50, // Limit to avoid token overflow
      })

      console.log(`[Automation] 📚 Loaded ${knowledgeDocuments.length} knowledge documents`)
    }

    // 🔥 5. FETCH PRODUCTS IF COMMERCE IS ENABLED (NEW)
    let products: any[] = []
    if (actionData.enableCommerce || actionData.enableProductCatalog) {
      console.log("[Automation] 🛍️ Loading product catalog...")
      
      products = await prisma.product.findMany({
        where: { 
          userId: context.userId,
          isAvailable: true,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          stock: true,
          category: true,
          images: true,
          sku: true,
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      })

      console.log(`[Automation] 🛍️ Loaded ${products.length} products`)
    }

    // 🔥 6. GET BUSINESS INFORMATION (NEW)
    const user = await prisma.user.findUnique({
      where: { id: context.userId },
      select: {
        businessName: true,
        businessDescription: true,
        businessType: true,
        businessIndustry: true,
      },
    })

    // 7. Prepare AI config
    const aiConfig = {
      model: actionData.model || actionData.aiModel || "claude-sonnet-4-20250514",
      tone: actionData.tone || "professional",
      language: actionData.language || "auto",
      maxTokens: actionData.maxTokens || 2000,
      temperature: actionData.temperature || 0.7,

      systemPrompt: actionData.systemPrompt,
      customInstructions: actionData.aiInstructions || actionData.customInstructions,
      exampleConversations: actionData.exampleConversations || [],

      enableCommerce: actionData.enableCommerce || false,
      enablePayments: actionData.enablePayments || false,
      enableAppointments: actionData.enableAppointments || false,
      enableProductCatalog: actionData.enableProductCatalog || false,
      mcpEnabled: actionData.mcpEnabled || false,

      maxOrderValue: actionData.maxOrderValue || 500000,
      requirePaymentConfirmation: actionData.requirePaymentConfirmation !== false,

      useKnowledgeBase: actionData.aiKnowledgeBase || actionData.useKnowledgeBase || false,
      knowledgeBaseDocs: actionData.knowledgeBaseDocs || [],

      autoHandoff: actionData.autoHandoff !== false,
      handoffTriggers: actionData.handoffTriggers || ["frustrated", "angry", "wants_human"],
      maxTurns: actionData.maxTurns || 10,
      confidenceThreshold: actionData.confidenceThreshold || 0.7,
      useConversationHistory: actionData.useConversationHistory !== false,
      historyDepth: actionData.historyDepth || 20,

      contentFiltering: actionData.contentFiltering !== false,
      sensitiveTopics: actionData.sensitiveTopics || [],
      requireApproval: actionData.requireApproval || false,

      useEmojis: actionData.useEmojis !== false,
      responseLength: actionData.responseLength || "medium",
      includeQuestions: actionData.includeQuestions !== false,
      personalizeResponses: actionData.personalizeResponses !== false,

      enabledFunctions: actionData.enabledFunctions || [],
    }

    // 🔥 8. ENHANCED CONTEXT WITH EVERYTHING (UPDATED)
    const enhancedContext = {
      conversationId: context.conversationId,
      participantName: context.triggerData?.participantName || context.name || "there",
      participantUsername: context.triggerData?.participantUsername || context.username,
      messageText: context.messageText || "",
      conversationHistory: history,
      userTags: conversation.conversationTags.map((ct) => ct.tag.name),
      previousInteractions,
      userId: context.userId, // ✅ Important for product search

      // Commerce data - Convert null to undefined
      orderHistory: conversation.orders,
      customerEmail: conversation.customerEmail ?? undefined,
      customerPhone: conversation.customerPhone ?? undefined,
      recentAppointments: conversation.appointments,
      supportTickets: conversation.supportTickets,

      // 🔥 NEW: KNOWLEDGE BASE AND PRODUCTS
      knowledgeBase: knowledgeDocuments,
      products: products,
      
      // 🔥 NEW: BUSINESS CONTEXT - Convert null to undefined
      businessName: user?.businessName ?? undefined,
      businessDescription: user?.businessDescription ?? undefined,
      businessType: user?.businessType ?? undefined,
      businessIndustry: user?.businessIndustry ?? undefined,
    }

    console.log("[Automation] 📊 Context prepared:", {
      knowledgeDocsCount: knowledgeDocuments.length,
      productsCount: products.length,
      historyLength: history.length,
      hasBusinessInfo: !!user?.businessName,
    })

    // 9. Generate AI response
    let aiResult
    try {
      aiResult = await aiResponseHandler.generateResponse(aiConfig, enhancedContext)
    } catch (error) {
      console.log("[Automation] Main AI failed, trying Puter.js fallback:", error)
      const puterResponse = await callPuterAI(
        context.messageText || "",
        aiConfig.systemPrompt || "You are a helpful AI assistant.",
      )

      if (puterResponse.success) {
        aiResult = {
          response: puterResponse.response,
          confidence: 0.8,
          shouldHandoff: false,
          sentiment: "neutral",
        }
      } else {
        throw new Error("All AI providers failed")
      }
    }

    console.log("[Automation] AI Response generated:", {
      responseLength: aiResult.response.length,
      confidence: aiResult.confidence,
      shouldHandoff: aiResult.shouldHandoff,
      sentiment: aiResult.sentiment || "neutral",
      hasCarousel: !!aiResult.carousel,
      actionsExecuted: (aiResult as any).actions?.length || 0,
    })

    // 10. Check if approval is required
    if (aiConfig.requireApproval) {
      await prisma.pendingAIResponse.create({
        data: {
          conversationId: context.conversationId,
          response: aiResult.response,
          confidence: aiResult.confidence,
          sentiment: aiResult.sentiment || "neutral",
          status: "pending",
        },
      })

      console.log("[Automation] AI response queued for approval")
      return
    }

    // 11. Check if handoff is needed
    if (aiResult.shouldHandoff) {
      console.log("[Automation] Handoff triggered:", aiResult.sentiment || "unknown")

      await prisma.conversation.update({
        where: { id: context.conversationId },
        data: {
          needsHumanReview: true,
          handoffReason: aiResult.sentiment || "unknown",
        },
      })

      if (actionData.handoffMessage) {
        await this.instagramApi.sendMessage(context.senderId, actionData.handoffMessage)
      } else {
        await this.instagramApi.sendMessage(
          context.senderId,
          "Thanks for your patience! I'm connecting you with a team member who can assist you further.",
        )
      }

      return
    }

    // 12. Send the AI response
    if (aiResult.response) {
      await this.instagramApi.sendMessage(context.senderId, aiResult.response)

      // 🔥 13. SEND PRODUCT CAROUSEL IF PRESENT (FIXED)
        // 🔥 SEND PRODUCTS AS IMAGES (Instagram doesn't support carousels in DMs)
      if (aiResult.carousel && aiResult.carousel.rawCards && aiResult.carousel.rawCards.length > 0) {
        console.log("[Automation] 🎠 Sending", aiResult.carousel.rawCards.length, "products")

        const maxProducts = Math.min(aiResult.carousel.rawCards.length, 5)
        
        for (let i = 0; i < maxProducts; i++) {
          const card = aiResult.carousel.rawCards[i]
          
          try {
            // Send product image
            if (card.image_url) {
              await this.instagramApi.sendImageMessage(context.senderId, card.image_url)
              
              // Build caption with product info
              let caption = `*${card.title}*`
              
              if (card.subtitle) {
                caption += `\n${card.subtitle}`
              }
              
              // Add button link if exists
              if (card.buttons && card.buttons.length > 0) {
                const button = card.buttons[0]
                if (button.url) {
                  caption += `\n\n🔗 View: ${button.url}`
                } else if (button.title) {
                  caption += `\n\n💬 ${button.title}`
                }
              }
              
              await this.instagramApi.sendTextMessage(context.senderId, caption)
              
              console.log(`[Automation] ✅ Sent product ${i + 1}/${maxProducts}:`, card.title)
              
              // Rate limit protection - wait between messages
              if (i < maxProducts - 1) {
                await new Promise((resolve) => setTimeout(resolve, 1500))
              }
            }
          } catch (error) {
            console.error(`[Automation] ❌ Failed to send product ${i + 1}:`, error)
            // Continue with next product even if one fails
          }
        }
        
        console.log("[Automation] ✅ Finished sending all products")
      }
      // if (aiResult.carousel && aiResult.carousel.rawCards && aiResult.carousel.rawCards.length > 0) {
      //   console.log("[Automation] 🎠 Sending product carousel with", aiResult.carousel.rawCards.length, "items")

      //   const pageAccessToken = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN
      //   if (pageAccessToken) {
      //     try {
      //       // Use the sendGenericTemplate method to send carousel
      //       if (typeof this.instagramApi.sendGenericTemplate === "function") {
      //         await this.instagramApi.sendGenericTemplate(context.senderId, aiResult.carousel.rawCards)
      //         console.log("[Automation] ✅ Carousel sent successfully")
      //       } else {
      //         console.warn("[Automation] sendGenericTemplate not available, sending as sequential images")
      //         // Fallback: send images sequentially
      //         for (const card of aiResult.carousel.rawCards.slice(0, 5)) {
      //           if (card.image_url) {
      //             await this.instagramApi.sendImageMessage(context.senderId, card.image_url)
      //             await this.instagramApi.sendTextMessage(
      //               context.senderId,
      //               `*${card.title}*\n${card.subtitle || ""}\n${card.buttons?.[0]?.url || ""}`,
      //             )
      //             await new Promise((resolve) => setTimeout(resolve, 1000))
      //           }
      //         }
      //       }
      //     } catch (carouselError) {
      //       console.error("[Automation] ❌ Carousel send error:", carouselError)
      //       // Non-blocking error - continue execution
      //     }
      //   } else {
      //     console.warn("[Automation] Cannot send carousel: INSTAGRAM_PAGE_ACCESS_TOKEN missing")
      //   }
      // }

      // 14. Save AI response to conversation
      await prisma.message.create({
        data: {
          conversationId: context.conversationId,
          content: aiResult.response,
          sender: "business",
          isFromUser: true,
          sentByAI: true,
          messageType: "text",
          timestamp: new Date(),
          metadata: {
            confidence: aiResult.confidence,
            sentiment: aiResult.sentiment || "neutral",
            usedFunctions: (aiResult as any).usedFunctions || [],
            hasCarousel: !!aiResult.carousel,
          },
        },
      })
    }

    // 15. Log interaction for analytics
    await aiResponseHandler.logInteraction(
      context.conversationId, 
      context.messageText || "", 
      aiResult.response, 
      {
        confidence: aiResult.confidence,
        sentiment: aiResult.sentiment || "neutral",
        shouldHandoff: aiResult.shouldHandoff,
        usedFunctions: (aiResult as any).usedFunctions || [],
        hasCarousel: !!aiResult.carousel,
      }
    )

    console.log("[Automation] ✅ AI response sent successfully")
  } catch (error) {
    console.error("[Automation] ❌ AI Response error:", error)

    await this.instagramApi.sendMessage(
      context.senderId,
      "I apologize, but I'm having trouble processing that right now. Let me connect you with someone who can help.",
    )

    await prisma.conversation.update({
      where: { id: context.conversationId },
      data: {
        needsHumanReview: true,
        handoffReason: "ai_error",
      },
    })

    throw error
  }
}


















  private async executeAddTag(actionData: any, context: ExecutionContext): Promise<void> {
    const { tagName, tag } = actionData
    const finalTag = tagName || tag

    if (!finalTag) {
      console.error("[AutomationExecutor] No tag specified")
      return
    }

    // Find or create tag
    const tagRecord = await prisma.tag.upsert({
      where: {
        userId_name: {
          userId: context.userId,
          name: finalTag,
        },
      },
      create: {
        userId: context.userId,
        name: finalTag,
      },
      update: {},
    })

    // Add tag to conversation
    await prisma.conversationTag.upsert({
      where: {
        conversationId_tagId: {
          conversationId: context.conversationId,
          tagId: tagRecord.id,
        },
      },
      create: {
        conversationId: context.conversationId,
        tagId: tagRecord.id,
      },
      update: {},
    })

    console.log("[AutomationExecutor] Added tag:", finalTag)
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
    await new Promise((resolve) => setTimeout(resolve, milliseconds))
  }

  private async executeWebhook(actionData: any, context: ExecutionContext): Promise<void> {
    const { webhookUrl, method = "POST", webhookMethod = "POST", webhookHeaders, webhookBody } = actionData

    const finalUrl = webhookUrl
    const finalMethod = method || webhookMethod

    if (!finalUrl) {
      console.error("[AutomationExecutor] No webhook URL provided")
      return
    }

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
    const { reason, priority = "normal", message } = actionData

    console.log("[AutomationExecutor] Handing off to human:", reason, "Priority:", priority)

    // Mark conversation for human review
    await prisma.conversation.update({
      where: { id: context.conversationId },
      data: {
        needsHumanReview: true,
        handoffReason: reason || "automation_requested",
      },
    })

    // Send handoff message
    const handoffMessage = message
      ? this.personalizeMessage(message, context)
      : "Thanks for your patience! I'm connecting you with a team member who can assist you further."

    await this.instagramApi.sendMessage(context.senderId, handoffMessage)
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

    const firstName = context.name?.split(" ")[0] || context.name || "there"

    const replacements: Record<string, string> = {
      "{name}": context.name || "there",
      "{username}": context.username || "friend",
      "{first_name}": firstName,
      "{last_name}": context.name?.split(" ")[1] || "",
      "{full_name}": context.name || "there",
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
