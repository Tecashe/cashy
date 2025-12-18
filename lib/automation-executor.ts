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

import type { InstagramAPI } from "./instagram-api"
import { generateText } from "ai"

export interface ExecutionContext {
  userId: string
  senderId: string
  messageText?: string
  triggerData: any
  conversationHistory?: any[]
  userTags?: string[]
  knowledgeBase?: string
}

export class AutomationExecutor {
  private instagramApi: InstagramAPI

  constructor(instagramApi: InstagramAPI) {
    this.instagramApi = instagramApi
  }

  async executeAction(actionType: string, actionData: any, context: ExecutionContext): Promise<void> {
    // Normalize action type to uppercase
    const normalizedActionType = actionType.toUpperCase()
    console.log("[v0] Executing action:", normalizedActionType, actionData)

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
        await this.executeSendToHuman(actionData, context)
        break

      case "CONDITION":
        return this.executeCondition(actionData, context)

      default:
        console.warn("[v0] Unknown action type:", actionType, "(normalized:", normalizedActionType + ")")
    }
  }

  private async executeSendMessage(actionData: any, context: ExecutionContext): Promise<void> {
    const message = this.personalizeMessage(actionData.message, context)
    await this.instagramApi.sendTextMessage(context.senderId, message)
    console.log("[v0] Sent message:", message)
  }

  private async executeSendImage(actionData: any, context: ExecutionContext): Promise<void> {
    const { imageUrl, caption } = actionData
    await this.instagramApi.sendImageMessage(context.senderId, imageUrl)

    if (caption) {
      const personalizedCaption = this.personalizeMessage(caption, context)
      await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
    }
    console.log("[v0] Sent image:", imageUrl)
  }

  private async executeSendVideo(actionData: any, context: ExecutionContext): Promise<void> {
    const { videoUrl, caption } = actionData
    await this.instagramApi.sendVideoMessage(context.senderId, videoUrl)

    if (caption) {
      const personalizedCaption = this.personalizeMessage(caption, context)
      await this.instagramApi.sendTextMessage(context.senderId, personalizedCaption)
    }
    console.log("[v0] Sent video:", videoUrl)
  }

  private async executeAIResponse(actionData: any, context: ExecutionContext): Promise<void> {
    const { customInstructions, tone, useKnowledgeBase } = actionData

    let systemPrompt = `You are a helpful assistant responding to Instagram messages. ${customInstructions || ""}`

    if (tone) {
      systemPrompt += ` Use a ${tone} tone.`
    }

    if (useKnowledgeBase && context.knowledgeBase) {
      systemPrompt += `\n\nKnowledge Base:\n${context.knowledgeBase}`
    }

    // Build conversation context
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
        // maxTokens: 500,
        //TODO
      })

      await this.instagramApi.sendTextMessage(context.senderId, text)
      console.log("[v0] Sent AI response:", text)
    } catch (error) {
      console.error("[v0] AI response error:", error)
      // Fallback message
      await this.instagramApi.sendTextMessage(
        context.senderId,
        "Thanks for your message! Let me connect you with someone who can help.",
      )
    }
  }

  private async executeAddTag(actionData: any, context: ExecutionContext): Promise<void> {
    const { tagName } = actionData
    // Store tag in database (this would be implemented based on your database schema)
    console.log("[v0] Added tag:", tagName, "to user:", context.userId)

    // You would implement this to store in your database
    // await db.userTags.create({ userId: context.userId, tag: tagName })
  }

  private async executeDelay(actionData: any, context: ExecutionContext): Promise<void> {
    const { delayAmount, delayUnit } = actionData
    const milliseconds = this.convertToMilliseconds(Number.parseInt(delayAmount), delayUnit)

    console.log("[v0] Delaying for:", delayAmount, delayUnit)

    // In production, you would use a job queue (like Bull, BullMQ) to schedule delayed actions
    // For now, we'll just log it
    console.log("[v0] Delay scheduled for:", milliseconds, "ms")

    // Example: await jobQueue.add('delayed-action', { context, nextActions }, { delay: milliseconds })
  }

  private async executeWebhook(actionData: any, context: ExecutionContext): Promise<void> {
    const { webhookUrl, method = "POST" } = actionData

    const payload = {
      userId: context.userId,
      senderId: context.senderId,
      message: context.messageText,
      timestamp: new Date().toISOString(),
      triggerData: context.triggerData,
    }

    try {
      const response = await fetch(webhookUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`)
      }

      console.log("[v0] Webhook sent successfully to:", webhookUrl)
    } catch (error) {
      console.error("[v0] Webhook error:", error)
    }
  }

  private async executeSendToHuman(actionData: any, context: ExecutionContext): Promise<void> {
    const { reason, priority = "normal" } = actionData

    console.log("[v0] Handing off to human:", reason, "Priority:", priority)

    // In production, you would:
    // 1. Create a ticket in your support system
    // 2. Notify team members
    // 3. Update conversation status

    await this.instagramApi.sendTextMessage(
      context.senderId,
      "Thanks for your patience! I'm connecting you with a team member who can assist you further.",
    )

    // Example: await supportTicketSystem.create({ userId: context.userId, reason, priority })
  }

  private async executeCondition(actionData: any, context: ExecutionContext): Promise<void> {
    const { field, operator, value } = actionData

    let conditionMet = false

    switch (field) {
      case "message":
        conditionMet = this.evaluateStringCondition(context.messageText || "", operator, value)
        break

      case "confidence":
        // This would come from AI response confidence score
        const confidence = context.triggerData?.confidence || 1.0
        conditionMet = this.evaluateNumberCondition(confidence, operator, Number.parseFloat(value))
        break

      case "tag":
        conditionMet = context.userTags?.includes(value) || false
        break
    }

    console.log("[v0] Condition evaluated:", conditionMet, { field, operator, value })

    // Return condition result for branching logic
    // In a full implementation, you would use this to determine which branch to follow
  }

  private personalizeMessage(message: string, context: ExecutionContext): string {
    // Replace variables in message
    let personalizedMessage = message

    // Common personalization variables
    const replacements: Record<string, string> = {
      "{name}": context.triggerData?.name || "there",
      "{username}": context.triggerData?.username || "friend",
      "{first_name}": context.triggerData?.firstName || context.triggerData?.name?.split(" ")[0] || "there",
    }

    for (const [variable, value] of Object.entries(replacements)) {
      personalizedMessage = personalizedMessage.replace(new RegExp(variable, "g"), value)
    }

    return personalizedMessage
  }

  private evaluateStringCondition(text: string, operator: string, value: string): boolean {
    const lowerText = text.toLowerCase()
    const lowerValue = value.toLowerCase()

    switch (operator) {
      case "contains":
        return lowerText.includes(lowerValue)
      case "equals":
        return lowerText === lowerValue
      case "starts_with":
        return lowerText.startsWith(lowerValue)
      case "ends_with":
        return lowerText.endsWith(lowerValue)
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
    console.log("[v0] Executing automation flow with", nodes.length, "nodes")

    for (const node of nodes) {
      if (node.type === "trigger") {
        console.log("[v0] Trigger node:", node.actionType)
        continue
      }

      if (node.type === "action") {
        try {
          await this.executeAction(node.actionType, node.data, context)

          // Add delay between actions to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 1000))
        } catch (error) {
          console.error("[v0] Action execution error:", error)
          // Continue with next action even if one fails
        }
      }
    }

    console.log("[v0] Automation flow completed")
  }
}

