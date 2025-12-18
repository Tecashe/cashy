// // app/api/webhooks/instagram/route.ts
// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/db"
// import { InstagramAPI } from "@/lib/instagram-api"
// import { AutomationExecutor } from "@/lib/automation-executor"
// import { enqueueMessage } from "@/lib/automation-queue"

// // Webhook verification (GET request from Meta)
// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
  
//   const mode = searchParams.get("hub.mode")
//   const token = searchParams.get("hub.verify_token")
//   const challenge = searchParams.get("hub.challenge")
  
//   const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN
  
//   if (mode === "subscribe" && token === verifyToken) {
//     console.log("[Instagram Webhook] Verified successfully")
//     return new NextResponse(challenge, { status: 200 })
//   }
  
//   console.error("[Instagram Webhook] Verification failed")
//   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
// }

// // Webhook events (POST request from Meta)
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
    
//     console.log("[Instagram Webhook] Received:", JSON.stringify(body, null, 2))
    
//     // Process webhook based on object type
//     if (body.object === "instagram") {
//       for (const entry of body.entry || []) {
//         // Handle messaging events (DMs, story replies)
//         if (entry.messaging) {
//           for (const messagingEvent of entry.messaging) {
//             await processMessagingEvent(messagingEvent, entry)
//           }
//         }
        
//         // Handle changes (comments, mentions)
//         if (entry.changes) {
//           for (const change of entry.changes) {
//             await processChangeEvent(change, entry)
//           }
//         }
//       }
//     }
    
//     // Always return 200 to acknowledge receipt
//     return NextResponse.json({ success: true }, { status: 200 })
//   } catch (error) {
//     console.error("[Instagram Webhook] Error:", error)
//     // Still return 200 to prevent Meta from retrying
//     return NextResponse.json({ success: true }, { status: 200 })
//   }
// }

// async function processMessagingEvent(messagingEvent: any, entry: any) {
//   try {
//     const senderId = messagingEvent.sender?.id
//     const recipientId = messagingEvent.recipient?.id
//     const message = messagingEvent.message
    
//     if (!senderId || !recipientId || !message) return
    
//     // Find the Instagram account that received this message
//     const instagramAccount = await prisma.instagramAccount.findFirst({
//       where: { instagramId: recipientId },
//       include: { user: true }
//     })
    
//     if (!instagramAccount) {
//       console.log("[Instagram Webhook] Account not found for recipient:", recipientId)
//       return
//     }
    
//     // Find or create conversation
//     let conversation = await prisma.conversation.findFirst({
//       where: {
//         instagramAccountId: instagramAccount.id,
//         participantId: senderId,
//       },
//     })
    
//     const isFirstMessage = !conversation
    
//     if (!conversation) {
//       conversation = await prisma.conversation.create({
//         data: {
//           instagramAccountId: instagramAccount.id,
//           userId: instagramAccount.userId,
//           participantId: senderId,
//           participantName: messagingEvent.sender.username || "Unknown",
//           participantUsername: messagingEvent.sender.username || "unknown",
//           participantAvatar: null,
//           lastMessageText: message.text || "[Media]",
//           lastMessageAt: new Date(messagingEvent.timestamp || Date.now()),
//           unreadCount: 1,
//         },
//       })
//     } else {
//       await prisma.conversation.update({
//         where: { id: conversation.id },
//         data: {
//           lastMessageText: message.text || "[Media]",
//           lastMessageAt: new Date(messagingEvent.timestamp || Date.now()),
//           unreadCount: { increment: 1 },
//         },
//       })
//     }
    
//     // Save message to database
//     await prisma.message.create({
//       data: {
//         conversationId: conversation.id,
//         content: message.text || "[Media]",
//         sender: "participant",
//         isRead: false,
//         messageType: message.is_story_reply ? "story_reply" : "text",
//       },
//     })
    
//     // Determine message type
//     const messageType = message.is_story_reply ? "STORY_REPLY" : "DM"
    
//     // Process automation triggers
//     await processAutomationTriggers({
//       conversationId: conversation.id,
//       messageContent: message.text,
//       senderId: senderId,
//       senderUsername: messagingEvent.sender.username || "unknown",
//       senderName: messagingEvent.sender.username || "Unknown",
//       messageType,
//       isFirstMessage,
//       instagramAccountId: instagramAccount.id,
//     })
    
//   } catch (error) {
//     console.error("[Instagram Webhook] Error processing messaging event:", error)
//   }
// }

// async function processChangeEvent(change: any, entry: any) {
//   try {
//     const { field, value } = change
    
//     if (field === "comments") {
//       await processComment(value, entry)
//     } else if (field === "mentions") {
//       await processMention(value, entry)
//     }
//   } catch (error) {
//     console.error("[Instagram Webhook] Error processing change event:", error)
//   }
// }

// async function processComment(value: any, entry: any) {
//   try {
//     const { id: commentId, text, from, media } = value
    
//     if (!from || !text) return
    
//     // Find Instagram account by media owner or from webhook entry
//     const instagramAccount = await prisma.instagramAccount.findFirst({
//       where: { instagramId: entry.id },
//       include: { user: true }
//     })
    
//     if (!instagramAccount) {
//       console.log("[Instagram Webhook] Account not found for comment")
//       return
//     }
    
//     // Find or create conversation with commenter
//     let conversation = await prisma.conversation.findFirst({
//       where: {
//         instagramAccountId: instagramAccount.id,
//         participantId: from.id,
//       },
//     })
    
//     if (!conversation) {
//       conversation = await prisma.conversation.create({
//         data: {
//           instagramAccountId: instagramAccount.id,
//           userId: instagramAccount.userId,
//           participantId: from.id,
//           participantName: from.username || "Unknown",
//           participantUsername: from.username || "unknown",
//           participantAvatar: null,
//           lastMessageText: `Commented: ${text}`,
//           lastMessageAt: new Date(),
//           unreadCount: 0,
//         },
//       })
//     }
    
//     // Process automation triggers for comments
//     await processAutomationTriggers({
//       conversationId: conversation.id,
//       messageContent: text,
//       senderId: from.id,
//       senderUsername: from.username || "unknown",
//       senderName: from.username || "Unknown",
//       messageType: "COMMENT",
//       isFirstMessage: false,
//       instagramAccountId: instagramAccount.id,
//       triggerData: {
//         commentId,
//         mediaId: media?.id,
//       }
//     })
    
//   } catch (error) {
//     console.error("[Instagram Webhook] Error processing comment:", error)
//   }
// }

// async function processMention(value: any, entry: any) {
//   try {
//     const { comment_id, media_id, from } = value
    
//     if (!from) return
    
//     // Find Instagram account
//     const instagramAccount = await prisma.instagramAccount.findFirst({
//       where: { instagramId: entry.id },
//       include: { user: true }
//     })
    
//     if (!instagramAccount) {
//       console.log("[Instagram Webhook] Account not found for mention")
//       return
//     }
    
//     // Find or create conversation
//     let conversation = await prisma.conversation.findFirst({
//       where: {
//         instagramAccountId: instagramAccount.id,
//         participantId: from.id,
//       },
//     })
    
//     if (!conversation) {
//       conversation = await prisma.conversation.create({
//         data: {
//           instagramAccountId: instagramAccount.id,
//           userId: instagramAccount.userId,
//           participantId: from.id,
//           participantName: from.username || "Unknown",
//           participantUsername: from.username || "unknown",
//           participantAvatar: null,
//           lastMessageText: "Mentioned you",
//           lastMessageAt: new Date(),
//           unreadCount: 0,
//         },
//       })
//     }
    
//     // Process automation triggers for mentions
//     await processAutomationTriggers({
//       conversationId: conversation.id,
//       messageContent: "",
//       senderId: from.id,
//       senderUsername: from.username || "unknown",
//       senderName: from.username || "Unknown",
//       messageType: "MENTION",
//       isFirstMessage: false,
//       instagramAccountId: instagramAccount.id,
//       triggerData: {
//         commentId: comment_id,
//         mediaId: media_id,
//       }
//     })
    
//   } catch (error) {
//     console.error("[Instagram Webhook] Error processing mention:", error)
//   }
// }

// interface TriggerContext {
//   conversationId: string
//   messageContent?: string
//   senderId: string
//   senderUsername: string
//   senderName: string
//   messageType: "DM" | "COMMENT" | "STORY_REPLY" | "MENTION"
//   isFirstMessage: boolean
//   instagramAccountId: string
//   triggerData?: any
// }

// async function processAutomationTriggers(context: TriggerContext) {
//   const { conversationId, messageContent, senderId, messageType, isFirstMessage, instagramAccountId } = context
  
//   // Get conversation with related data
//   const conversation = await prisma.conversation.findUnique({
//     where: { id: conversationId },
//     include: { 
//       user: true,
//       instagramAccount: true,
//       conversationTags: {
//         include: { tag: true }
//       }
//     },
//   })
  
//   if (!conversation) return
  
//   // Find active automations for this user and Instagram account
//   const automations = await prisma.automation.findMany({
//     where: {
//       userId: conversation.userId,
//       instagramAccountId: instagramAccountId,
//       isActive: true,
//     },
//     include: {
//       triggers: true,
//       actions: {
//         orderBy: { order: "asc" },
//       },
//       instagramAccount: true,
//     },
//   })
  
//   // Check each automation for matching triggers
//   for (const automation of automations) {
//     const shouldExecute = checkAutomationTriggers(automation, context)
    
//     if (shouldExecute) {
//       console.log(`[Automation] Triggering automation: ${automation.name}`)
      
//       // Create execution record
//       const execution = await prisma.automationExecution.create({
//         data: {
//           automationId: automation.id,
//           conversationId: conversationId,
//           status: "pending",
//           triggeredBy: `${messageType}_${senderId}`,
//         }
//       })
      
//       await executeAutomation(automation, context, conversation, execution.id)
      
//       // Only execute first matching automation (can be changed if needed)
//       break
//     }
//   }
// }

// function checkAutomationTriggers(automation: any, context: TriggerContext): boolean {
//   const { messageContent = "", messageType, isFirstMessage } = context
  
//   // If no triggers, don't execute
//   if (!automation.triggers || automation.triggers.length === 0) {
//     return false
//   }
  
//   const triggerResults = automation.triggers.map((trigger: any) => {
//     const conditions = trigger.conditions || {}
    
//     switch (trigger.type) {
//       case "DM_RECEIVED":
//       case "new_message":
//         return messageType === "DM"
        
//       case "FIRST_MESSAGE":
//         return isFirstMessage && messageType === "DM"
        
//       case "KEYWORD":
//       case "keyword":
//         if (messageType !== "DM" && messageType !== "COMMENT") return false
//         const keywords = conditions.keywords || []
//         const matchType = conditions.matchType || "contains"
        
//         if (matchType === "contains" || matchType === "any") {
//           return keywords.some((keyword: string) => 
//             messageContent.toLowerCase().includes(keyword.toLowerCase())
//           )
//         } else if (matchType === "exact" || matchType === "all") {
//           return keywords.every((keyword: string) => 
//             messageContent.toLowerCase().includes(keyword.toLowerCase())
//           )
//         } else if (matchType === "starts_with") {
//           return keywords.some((keyword: string) => 
//             messageContent.toLowerCase().startsWith(keyword.toLowerCase())
//           )
//         }
//         return false
        
//       case "STORY_REPLY":
//       case "story_reply":
//         return messageType === "STORY_REPLY"
        
//       case "COMMENT":
//       case "COMMENT_RECEIVED":
//       case "comment":
//         return messageType === "COMMENT"
        
//       case "MENTION":
//       case "MENTION_RECEIVED":
//       case "mention":
//         return messageType === "MENTION"
        
//       default:
//         return false
//     }
//   })
  
//   // Default to OR logic if not specified
//   return triggerResults.some((result: any) => result)
// }

// async function executeAutomation(
//   automation: any, 
//   context: TriggerContext, 
//   conversation: any,
//   executionId: string
// ) {
//   try {
//     // Initialize Instagram API
//     const instagramAPI = new InstagramAPI({
//       accessToken: conversation.instagramAccount.accessToken,
//       instagramId: conversation.instagramAccount.instagramId,
//     })
    
//     const executor = new AutomationExecutor(instagramAPI)
    
//     // Build execution context
//     const executionContext = {
//       userId: conversation.userId,
//       senderId: context.senderId,
//       messageText: context.messageContent,
//       triggerData: {
//         participantName: conversation.participantName,
//         participantUsername: conversation.participantUsername,
//         username: context.senderUsername,
//         name: context.senderName,
//         ...context.triggerData,
//       },
//       conversationHistory: [],
//       userTags: conversation.conversationTags.map((ct: any) => ct.tag.name),
//     }
    
//     // Execute each action in sequence
//     for (const action of automation.actions) {
//       try {
//         const actionData = action.content || {}
        
//         // Handle delays
//         if (action.type === "DELAY" || action.type === "delay") {
//           const delayMs = calculateDelay(actionData)
          
//           // For longer delays, use message queue
//           if (delayMs > 60000) { // More than 1 minute
//             const remainingActions = automation.actions.slice(
//               automation.actions.indexOf(action) + 1
//             )
            
//             if (remainingActions.length > 0) {
//               // Queue remaining actions
//               for (const futureAction of remainingActions) {
//                 if (futureAction.type === "SEND_MESSAGE" || futureAction.type === "send_message") {
//                   await enqueueMessage({
//                     conversationId: context.conversationId,
//                     messageContent: futureAction.content?.message || "",
//                     recipientId: context.senderId,
//                     scheduledFor: new Date(Date.now() + delayMs),
//                     metadata: { automationId: automation.id, actionId: futureAction.id }
//                   })
//                 }
//               }
//             }
//             break // Stop processing after scheduling
//           } else {
//             // For short delays, just wait
//             await new Promise(resolve => setTimeout(resolve, delayMs))
//           }
//         } else {
//           // Execute the action
//           await executor.executeAction(action.type, actionData, executionContext)
          
//           // Small delay between actions to avoid rate limits
//           await new Promise(resolve => setTimeout(resolve, 1000))
//         }
        
//       } catch (error) {
//         console.error(`[Automation] Error executing action ${action.type}:`, error)
//         // Continue with next action
//       }
//     }
    
//     // Update execution record
//     await prisma.automationExecution.update({
//       where: { id: executionId },
//       data: {
//         status: "success",
//         completedAt: new Date(),
//       }
//     })
    
//     console.log(`[Automation] Completed automation: ${automation.name}`)
    
//   } catch (error) {
//     console.error("[Automation] Error executing automation:", error)
    
//     // Update execution record with error
//     await prisma.automationExecution.update({
//       where: { id: executionId },
//       data: {
//         status: "failed",
//         error: error instanceof Error ? error.message : "Unknown error",
//         completedAt: new Date(),
//       }
//     })
//   }
// }

// function calculateDelay(actionData: any): number {
//   const days = actionData.delayDays || 0
//   const hours = actionData.delayHours || 0
//   const minutes = actionData.delayMinutes || 0
  
//   return (days * 24 * 60 + hours * 60 + minutes) * 60 * 1000
// }

// NEW EMBED - app/api/webhooks/instagram/route.ts
// This file handles incoming webhooks from Instagram

// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/db"
// import { InstagramAPI } from "@/lib/instagram-api"
// import { AutomationExecutor } from "@/lib/automation-executor"
// import { enqueueMessage } from "@/lib/automation-queue"

// // GET - Webhook verification (called by Meta to verify your endpoint)
// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
  
//   const mode = searchParams.get("hub.mode")
//   const token = searchParams.get("hub.verify_token")
//   const challenge = searchParams.get("hub.challenge")
  
//   const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN
  
//   if (mode === "subscribe" && token === verifyToken) {
//     console.log("[Instagram Webhook] Verified successfully")
//     return new NextResponse(challenge, { status: 200 })
//   }
  
//   console.error("[Instagram Webhook] Verification failed")
//   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
// }

// // POST - Webhook events (called by Meta when events occur)
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
    
//     console.log("[Instagram Webhook] Received:", JSON.stringify(body, null, 2))
    
//     // Process webhook based on object type
//     if (body.object === "instagram") {
//       for (const entry of body.entry || []) {
//         // Handle messaging events (DMs, story replies)
//         if (entry.messaging) {
//           for (const messagingEvent of entry.messaging) {
//             await processMessagingEvent(messagingEvent, entry)
//           }
//         }
        
//         // Handle changes (comments, mentions)
//         if (entry.changes) {
//           for (const change of entry.changes) {
//             await processChangeEvent(change, entry)
//           }
//         }
//       }
//     }
    
//     // Always return 200 to acknowledge receipt
//     return NextResponse.json({ success: true }, { status: 200 })
//   } catch (error) {
//     console.error("[Instagram Webhook] Error:", error)
//     // Still return 200 to prevent Meta from retrying
//     return NextResponse.json({ success: true }, { status: 200 })
//   }
// }

// // Handle direct messages and story replies
// async function processMessagingEvent(messagingEvent: any, entry: any) {
//   try {
//     const senderId = messagingEvent.sender?.id
//     const recipientId = messagingEvent.recipient?.id
//     const message = messagingEvent.message
    
//     if (!senderId || !recipientId || !message) return
    
//     // Find the Instagram account that received this message
//     const instagramAccount = await prisma.instagramAccount.findFirst({
//       where: { instagramId: recipientId },
//       include: { user: true }
//     })
    
//     if (!instagramAccount) {
//       console.log("[Instagram Webhook] Account not found for recipient:", recipientId)
//       return
//     }
    
//     // Find or create conversation
//     let conversation = await prisma.conversation.findFirst({
//       where: {
//         instagramAccountId: instagramAccount.id,
//         participantId: senderId,
//       },
//     })
    
//     const isFirstMessage = !conversation
    
//     if (!conversation) {
//       conversation = await prisma.conversation.create({
//         data: {
//           instagramAccountId: instagramAccount.id,
//           userId: instagramAccount.userId,
//           participantId: senderId,
//           participantName: messagingEvent.sender.username || "Unknown",
//           participantUsername: messagingEvent.sender.username || "unknown",
//           participantAvatar: null,
//           lastMessageText: message.text || "[Media]",
//           lastMessageAt: new Date(messagingEvent.timestamp || Date.now()),
//           unreadCount: 1,
//         },
//       })
//     } else {
//       await prisma.conversation.update({
//         where: { id: conversation.id },
//         data: {
//           lastMessageText: message.text || "[Media]",
//           lastMessageAt: new Date(messagingEvent.timestamp || Date.now()),
//           unreadCount: { increment: 1 },
//         },
//       })
//     }
    
//     // Save message to database
//     await prisma.message.create({
//       data: {
//         conversationId: conversation.id,
//         content: message.text || "[Media]",
//         sender: "participant",
//         isRead: false,
//         messageType: message.is_story_reply ? "story_reply" : "text",
//       },
//     })
    
//     // Determine message type
//     const messageType = message.is_story_reply ? "STORY_REPLY" : "DM"
    
//     // Process automation triggers
//     await processAutomationTriggers({
//       conversationId: conversation.id,
//       messageContent: message.text,
//       senderId: senderId,
//       senderUsername: messagingEvent.sender.username || "unknown",
//       senderName: messagingEvent.sender.username || "Unknown",
//       messageType,
//       isFirstMessage,
//       instagramAccountId: instagramAccount.id,
//     })
    
//   } catch (error) {
//     console.error("[Instagram Webhook] Error processing messaging event:", error)
//   }
// }

// // Handle comments and mentions
// async function processChangeEvent(change: any, entry: any) {
//   try {
//     const { field, value } = change
    
//     if (field === "comments") {
//       await processComment(value, entry)
//     } else if (field === "mentions") {
//       await processMention(value, entry)
//     }
//   } catch (error) {
//     console.error("[Instagram Webhook] Error processing change event:", error)
//   }
// }

// // Process comment on a post
// async function processComment(value: any, entry: any) {
//   try {
//     const { id: commentId, text, from, media } = value
    
//     if (!from || !text) return
    
//     // Find Instagram account by media owner or from webhook entry
//     const instagramAccount = await prisma.instagramAccount.findFirst({
//       where: { instagramId: entry.id },
//       include: { user: true }
//     })
    
//     if (!instagramAccount) {
//       console.log("[Instagram Webhook] Account not found for comment")
//       return
//     }
    
//     // Find or create conversation with commenter
//     let conversation = await prisma.conversation.findFirst({
//       where: {
//         instagramAccountId: instagramAccount.id,
//         participantId: from.id,
//       },
//     })
    
//     if (!conversation) {
//       conversation = await prisma.conversation.create({
//         data: {
//           instagramAccountId: instagramAccount.id,
//           userId: instagramAccount.userId,
//           participantId: from.id,
//           participantName: from.username || "Unknown",
//           participantUsername: from.username || "unknown",
//           participantAvatar: null,
//           lastMessageText: `Commented: ${text}`,
//           lastMessageAt: new Date(),
//           unreadCount: 0,
//         },
//       })
//     }
    
//     // Process automation triggers for comments
//     await processAutomationTriggers({
//       conversationId: conversation.id,
//       messageContent: text,
//       senderId: from.id,
//       senderUsername: from.username || "unknown",
//       senderName: from.username || "Unknown",
//       messageType: "COMMENT",
//       isFirstMessage: false,
//       instagramAccountId: instagramAccount.id,
//       triggerData: {
//         commentId,
//         mediaId: media?.id,
//       }
//     })
    
//   } catch (error) {
//     console.error("[Instagram Webhook] Error processing comment:", error)
//   }
// }

// // Process mention in a post
// async function processMention(value: any, entry: any) {
//   try {
//     const { comment_id, media_id, from } = value
    
//     if (!from) return
    
//     // Find Instagram account
//     const instagramAccount = await prisma.instagramAccount.findFirst({
//       where: { instagramId: entry.id },
//       include: { user: true }
//     })
    
//     if (!instagramAccount) {
//       console.log("[Instagram Webhook] Account not found for mention")
//       return
//     }
    
//     // Find or create conversation
//     let conversation = await prisma.conversation.findFirst({
//       where: {
//         instagramAccountId: instagramAccount.id,
//         participantId: from.id,
//       },
//     })
    
//     if (!conversation) {
//       conversation = await prisma.conversation.create({
//         data: {
//           instagramAccountId: instagramAccount.id,
//           userId: instagramAccount.userId,
//           participantId: from.id,
//           participantName: from.username || "Unknown",
//           participantUsername: from.username || "unknown",
//           participantAvatar: null,
//           lastMessageText: "Mentioned you",
//           lastMessageAt: new Date(),
//           unreadCount: 0,
//         },
//       })
//     }
    
//     // Process automation triggers for mentions
//     await processAutomationTriggers({
//       conversationId: conversation.id,
//       messageContent: "",
//       senderId: from.id,
//       senderUsername: from.username || "unknown",
//       senderName: from.username || "Unknown",
//       messageType: "MENTION",
//       isFirstMessage: false,
//       instagramAccountId: instagramAccount.id,
//       triggerData: {
//         commentId: comment_id,
//         mediaId: media_id,
//       }
//     })
    
//   } catch (error) {
//     console.error("[Instagram Webhook] Error processing mention:", error)
//   }
// }

// // Trigger context interface
// interface TriggerContext {
//   conversationId: string
//   messageContent?: string
//   senderId: string
//   senderUsername: string
//   senderName: string
//   messageType: "DM" | "COMMENT" | "STORY_REPLY" | "MENTION"
//   isFirstMessage: boolean
//   instagramAccountId: string
//   triggerData?: any
// }

// // Check if event should trigger automations
// async function processAutomationTriggers(context: TriggerContext) {
//   const { conversationId, messageContent, senderId, messageType, isFirstMessage, instagramAccountId } = context
  
//   // Get conversation with related data
//   const conversation = await prisma.conversation.findUnique({
//     where: { id: conversationId },
//     include: { 
//       user: true,
//       instagramAccount: true,
//       conversationTags: {
//         include: { tag: true }
//       }
//     },
//   })
  
//   if (!conversation) return
  
//   // Find active automations for this user and Instagram account
//   const automations = await prisma.automation.findMany({
//     where: {
//       userId: conversation.userId,
//       instagramAccountId: instagramAccountId,
//       isActive: true,
//     },
//     include: {
//       triggers: true,
//       actions: {
//         orderBy: { order: "asc" },
//       },
//       instagramAccount: true,
//     },
//   })
  
//   // Check each automation for matching triggers
//   for (const automation of automations) {
//     const shouldExecute = checkAutomationTriggers(automation, context)
    
//     if (shouldExecute) {
//       console.log(`[Automation] Triggering automation: ${automation.name}`)
      
//       // Create execution record
//       const execution = await prisma.automationExecution.create({
//         data: {
//           automationId: automation.id,
//           conversationId: conversationId,
//           status: "pending",
//           triggeredBy: `${messageType}_${senderId}`,
//         }
//       })
      
//       await executeAutomation(automation, context, conversation, execution.id)
      
//       // Only execute first matching automation
//       break
//     }
//   }
// }

// // Check if automation triggers match the event
// function checkAutomationTriggers(automation: any, context: TriggerContext): boolean {
//   const { messageContent = "", messageType, isFirstMessage } = context
  
//   // If no triggers, don't execute
//   if (!automation.triggers || automation.triggers.length === 0) {
//     return false
//   }
  
//   const triggerResults = automation.triggers.map((trigger: any) => {
//     const conditions = trigger.conditions || {}
    
//     switch (trigger.type) {
//       case "DM_RECEIVED":
//       case "new_message":
//         return messageType === "DM"
        
//       case "FIRST_MESSAGE":
//         return isFirstMessage && messageType === "DM"
        
//       case "KEYWORD":
//       case "keyword":
//         if (messageType !== "DM" && messageType !== "COMMENT") return false
//         const keywords = conditions.keywords || []
//         const matchType = conditions.matchType || "contains"
        
//         if (matchType === "contains" || matchType === "any") {
//           return keywords.some((keyword: string) => 
//             messageContent.toLowerCase().includes(keyword.toLowerCase())
//           )
//         } else if (matchType === "exact" || matchType === "all") {
//           return keywords.every((keyword: string) => 
//             messageContent.toLowerCase().includes(keyword.toLowerCase())
//           )
//         } else if (matchType === "starts_with") {
//           return keywords.some((keyword: string) => 
//             messageContent.toLowerCase().startsWith(keyword.toLowerCase())
//           )
//         }
//         return false
        
//       case "STORY_REPLY":
//       case "story_reply":
//         return messageType === "STORY_REPLY"
        
//       case "COMMENT":
//       case "COMMENT_RECEIVED":
//       case "comment":
//         return messageType === "COMMENT"
        
//       case "MENTION":
//       case "MENTION_RECEIVED":
//       case "mention":
//         return messageType === "MENTION"
        
//       default:
//         return false
//     }
//   })
  
//   // Default to OR logic
//   return triggerResults.some((result: any) => result)
// }

// // Execute automation actions
// async function executeAutomation(
//   automation: any, 
//   context: TriggerContext, 
//   conversation: any,
//   executionId: string
// ) {
//   try {
//     // Initialize Instagram API
//     const instagramAPI = new InstagramAPI({
//       accessToken: conversation.instagramAccount.accessToken,
//       instagramId: conversation.instagramAccount.instagramId,
//     })
    
//     const executor = new AutomationExecutor(instagramAPI)
    
//     // Build execution context
//     const executionContext = {
//       userId: conversation.userId,
//       senderId: context.senderId,
//       messageText: context.messageContent,
//       triggerData: {
//         participantName: conversation.participantName,
//         participantUsername: conversation.participantUsername,
//         username: context.senderUsername,
//         name: context.senderName,
//         ...context.triggerData,
//       },
//       conversationHistory: [],
//       userTags: conversation.conversationTags.map((ct: any) => ct.tag.name),
//     }
    
//     // Execute each action in sequence
//     for (const action of automation.actions) {
//       try {
//         const actionData = action.content || {}
        
//         // Handle delays
//         if (action.type === "DELAY" || action.type === "delay") {
//           const delayMs = calculateDelay(actionData)
          
//           // For longer delays, use message queue
//           if (delayMs > 60000) { // More than 1 minute
//             const remainingActions = automation.actions.slice(
//               automation.actions.indexOf(action) + 1
//             )
            
//             if (remainingActions.length > 0) {
//               // Queue remaining actions
//               for (const futureAction of remainingActions) {
//                 if (futureAction.type === "SEND_MESSAGE" || futureAction.type === "send_message") {
//                   await enqueueMessage({
//                     conversationId: context.conversationId,
//                     messageContent: futureAction.content?.message || "",
//                     recipientId: context.senderId,
//                     scheduledFor: new Date(Date.now() + delayMs),
//                     metadata: { automationId: automation.id, actionId: futureAction.id }
//                   })
//                 }
//               }
//             }
//             break // Stop processing after scheduling
//           } else {
//             // For short delays, just wait
//             await new Promise(resolve => setTimeout(resolve, delayMs))
//           }
//         } else {
//           // Execute the action
//           await executor.executeAction(action.type, actionData, executionContext)
          
//           // Small delay between actions to avoid rate limits
//           await new Promise(resolve => setTimeout(resolve, 1000))
//         }
        
//       } catch (error) {
//         console.error(`[Automation] Error executing action ${action.type}:`, error)
//         // Continue with next action
//       }
//     }
    
//     // Update execution record
//     await prisma.automationExecution.update({
//       where: { id: executionId },
//       data: {
//         status: "success",
//         completedAt: new Date(),
//       }
//     })
    
//     console.log(`[Automation] Completed automation: ${automation.name}`)
    
//   } catch (error) {
//     console.error("[Automation] Error executing automation:", error)
    
//     // Update execution record with error
//     await prisma.automationExecution.update({
//       where: { id: executionId },
//       data: {
//         status: "failed",
//         error: error instanceof Error ? error.message : "Unknown error",
//         completedAt: new Date(),
//       }
//     })
//   }
// }

// // Calculate delay in milliseconds
// function calculateDelay(actionData: any): number {
//   const days = actionData.delayDays || 0
//   const hours = actionData.delayHours || 0
//   const minutes = actionData.delayMinutes || 0
  
//   return (days * 24 * 60 + hours * 60 + minutes) * 60 * 1000
// }


// NEW EMBED - app/api/webhooks/instagram/route.ts
// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/db"
// import { InstagramAPI } from "@/lib/instagram-api"
// import { AutomationExecutor } from "@/lib/automation-executor"
// import { enqueueMessage } from "@/lib/automation-queue"

// // GET - Webhook verification (called by Meta to verify your endpoint)
// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
  
//   const mode = searchParams.get("hub.mode")
//   const token = searchParams.get("hub.verify_token")
//   const challenge = searchParams.get("hub.challenge")
  
//   const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN
  
//   console.log("[Instagram Webhook] Verification attempt:", {
//     mode,
//     tokenMatch: token === verifyToken,
//     hasChallenge: !!challenge,
//   })
  
//   if (mode === "subscribe" && token === verifyToken) {
//     console.log("[Instagram Webhook] ✅ Verified successfully")
//     return new NextResponse(challenge, { status: 200 })
//   }
  
//   console.error("[Instagram Webhook] ❌ Verification failed")
//   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
// }

// // POST - Webhook events (called by Meta when events occur)
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
    
//     console.log("[Instagram Webhook] 📨 Received webhook:", JSON.stringify(body, null, 2))
    
//     // Process webhook based on object type
//     if (body.object === "instagram") {
//       for (const entry of body.entry || []) {
//         console.log("[Instagram Webhook] Processing entry:", {
//           entryId: entry.id,
//           time: entry.time,
//           hasMessaging: !!entry.messaging,
//           hasChanges: !!entry.changes,
//         })
        
//         // Handle messaging events (DMs, story replies)
//         if (entry.messaging) {
//           console.log("[Instagram Webhook] Found messaging events:", entry.messaging.length)
//           for (const messagingEvent of entry.messaging) {
//             await processMessagingEvent(messagingEvent, entry)
//           }
//         }
        
//         // Handle changes (comments, mentions)
//         if (entry.changes) {
//           console.log("[Instagram Webhook] Found change events:", entry.changes.length)
//           for (const change of entry.changes) {
//             await processChangeEvent(change, entry)
//           }
//         }
//       }
//     }
    
//     // Always return 200 to acknowledge receipt
//     return NextResponse.json({ success: true }, { status: 200 })
//   } catch (error) {
//     console.error("[Instagram Webhook] ❌ Error:", error)
//     // Still return 200 to prevent Meta from retrying
//     return NextResponse.json({ success: true }, { status: 200 })
//   }
// }

// // Handle direct messages and story replies
// async function processMessagingEvent(messagingEvent: any, entry: any) {
//   try {
//     const senderId = messagingEvent.sender?.id
//     const recipientId = messagingEvent.recipient?.id
//     const message = messagingEvent.message
    
//     console.log("[Instagram Webhook] 💬 Processing message:", {
//       senderId,
//       recipientId,
//       entryId: entry.id,
//       messageText: message?.text,
//       hasMessage: !!message,
//     })
    
//     if (!senderId || !recipientId || !message) {
//       console.log("[Instagram Webhook] ⚠️ Missing required fields, skipping")
//       return
//     }
    
//     // IMPORTANT: Try to find account by EITHER instagramId OR by entry.id
//     // Instagram webhooks can use different ID formats
//     console.log("[Instagram Webhook] 🔍 Looking for Instagram account...")
//     console.log("[Instagram Webhook] Searching by recipientId:", recipientId)
//     console.log("[Instagram Webhook] Searching by entryId:", entry.id)
    
//     let instagramAccount = await prisma.instagramAccount.findFirst({
//       where: {
//         OR: [
//           { instagramId: recipientId },
//           { instagramId: entry.id },
//         ]
//       },
//       include: { user: true }
//     })
    
//     // If not found, try to get all accounts and log for debugging
//     if (!instagramAccount) {
//       console.log("[Instagram Webhook] ⚠️ Account not found, checking all accounts...")
//       const allAccounts = await prisma.instagramAccount.findMany({
//         select: { id: true, instagramId: true, username: true }
//       })
//       console.log("[Instagram Webhook] All Instagram accounts in database:", allAccounts)
//       console.log("[Instagram Webhook] Looking for match with:", {
//         recipientId,
//         entryId: entry.id,
//       })
//       return
//     }
    
//     console.log("[Instagram Webhook] ✅ Found Instagram account:", {
//       accountId: instagramAccount.id,
//       username: instagramAccount.username,
//       instagramId: instagramAccount.instagramId,
//     })
    
//     // Find or create conversation
//     let conversation = await prisma.conversation.findFirst({
//       where: {
//         instagramAccountId: instagramAccount.id,
//         participantId: senderId,
//       },
//     })
    
//     const isFirstMessage = !conversation
    
//     console.log("[Instagram Webhook] Conversation status:", {
//       exists: !!conversation,
//       isFirstMessage,
//       participantId: senderId,
//     })
    
//     if (!conversation) {
//       console.log("[Instagram Webhook] Creating new conversation...")
//       conversation = await prisma.conversation.create({
//         data: {
//           instagramAccountId: instagramAccount.id,
//           userId: instagramAccount.userId,
//           participantId: senderId,
//           participantName: messagingEvent.sender.username || "Unknown",
//           participantUsername: messagingEvent.sender.username || "unknown",
//           participantAvatar: null,
//           lastMessageText: message.text || "[Media]",
//           lastMessageAt: new Date(messagingEvent.timestamp || Date.now()),
//           unreadCount: 1,
//         },
//       })
//       console.log("[Instagram Webhook] ✅ Conversation created:", conversation.id)
//     } else {
//       console.log("[Instagram Webhook] Updating existing conversation...")
//       await prisma.conversation.update({
//         where: { id: conversation.id },
//         data: {
//           lastMessageText: message.text || "[Media]",
//           lastMessageAt: new Date(messagingEvent.timestamp || Date.now()),
//           unreadCount: { increment: 1 },
//         },
//       })
//       console.log("[Instagram Webhook] ✅ Conversation updated")
//     }
    
//     // Save message to database
//     console.log("[Instagram Webhook] Saving message to database...")
//     await prisma.message.create({
//       data: {
//         conversationId: conversation.id,
//         content: message.text || "[Media]",
//         sender: "participant",
//         isRead: false,
//         messageType: message.is_story_reply ? "story_reply" : "text",
//       },
//     })
//     console.log("[Instagram Webhook] ✅ Message saved")
    
//     // Determine message type
//     const messageType = message.is_story_reply ? "STORY_REPLY" : "DM"
    
//     // Process automation triggers
//     console.log("[Instagram Webhook] 🤖 Processing automation triggers...")
//     await processAutomationTriggers({
//       conversationId: conversation.id,
//       messageContent: message.text,
//       senderId: senderId,
//       senderUsername: messagingEvent.sender.username || "unknown",
//       senderName: messagingEvent.sender.username || "Unknown",
//       messageType,
//       isFirstMessage,
//       instagramAccountId: instagramAccount.id,
//     })
    
//   } catch (error) {
//     console.error("[Instagram Webhook] ❌ Error processing messaging event:", error)
//   }
// }

// // Handle comments and mentions
// async function processChangeEvent(change: any, entry: any) {
//   try {
//     const { field, value } = change
    
//     console.log("[Instagram Webhook] 🔄 Processing change event:", {
//       field,
//       entryId: entry.id,
//     })
    
//     if (field === "comments") {
//       await processComment(value, entry)
//     } else if (field === "mentions") {
//       await processMention(value, entry)
//     }
//   } catch (error) {
//     console.error("[Instagram Webhook] ❌ Error processing change event:", error)
//   }
// }

// // Process comment on a post
// async function processComment(value: any, entry: any) {
//   try {
//     const { id: commentId, text, from, media } = value
    
//     console.log("[Instagram Webhook] 💭 Processing comment:", {
//       commentId,
//       text,
//       from,
//       mediaId: media?.id,
//     })
    
//     if (!from || !text) {
//       console.log("[Instagram Webhook] ⚠️ Comment missing required fields")
//       return
//     }
    
//     // Find Instagram account by entry ID
//     const instagramAccount = await prisma.instagramAccount.findFirst({
//       where: { instagramId: entry.id },
//       include: { user: true }
//     })
    
//     if (!instagramAccount) {
//       console.log("[Instagram Webhook] ⚠️ Account not found for comment")
//       return
//     }
    
//     console.log("[Instagram Webhook] ✅ Found account for comment:", instagramAccount.username)
    
//     // Find or create conversation with commenter
//     let conversation = await prisma.conversation.findFirst({
//       where: {
//         instagramAccountId: instagramAccount.id,
//         participantId: from.id,
//       },
//     })
    
//     if (!conversation) {
//       conversation = await prisma.conversation.create({
//         data: {
//           instagramAccountId: instagramAccount.id,
//           userId: instagramAccount.userId,
//           participantId: from.id,
//           participantName: from.username || "Unknown",
//           participantUsername: from.username || "unknown",
//           participantAvatar: null,
//           lastMessageText: `Commented: ${text}`,
//           lastMessageAt: new Date(),
//           unreadCount: 0,
//         },
//       })
//       console.log("[Instagram Webhook] ✅ Conversation created for commenter")
//     }
    
//     // Process automation triggers for comments
//     await processAutomationTriggers({
//       conversationId: conversation.id,
//       messageContent: text,
//       senderId: from.id,
//       senderUsername: from.username || "unknown",
//       senderName: from.username || "Unknown",
//       messageType: "COMMENT",
//       isFirstMessage: false,
//       instagramAccountId: instagramAccount.id,
//       triggerData: {
//         commentId,
//         mediaId: media?.id,
//       }
//     })
    
//   } catch (error) {
//     console.error("[Instagram Webhook] ❌ Error processing comment:", error)
//   }
// }

// // Process mention in a post
// async function processMention(value: any, entry: any) {
//   try {
//     const { comment_id, media_id, from } = value
    
//     console.log("[Instagram Webhook] 📣 Processing mention:", {
//       commentId: comment_id,
//       mediaId: media_id,
//       from,
//     })
    
//     if (!from) {
//       console.log("[Instagram Webhook] ⚠️ Mention missing sender")
//       return
//     }
    
//     // Find Instagram account
//     const instagramAccount = await prisma.instagramAccount.findFirst({
//       where: { instagramId: entry.id },
//       include: { user: true }
//     })
    
//     if (!instagramAccount) {
//       console.log("[Instagram Webhook] ⚠️ Account not found for mention")
//       return
//     }
    
//     console.log("[Instagram Webhook] ✅ Found account for mention:", instagramAccount.username)
    
//     // Find or create conversation
//     let conversation = await prisma.conversation.findFirst({
//       where: {
//         instagramAccountId: instagramAccount.id,
//         participantId: from.id,
//       },
//     })
    
//     if (!conversation) {
//       conversation = await prisma.conversation.create({
//         data: {
//           instagramAccountId: instagramAccount.id,
//           userId: instagramAccount.userId,
//           participantId: from.id,
//           participantName: from.username || "Unknown",
//           participantUsername: from.username || "unknown",
//           participantAvatar: null,
//           lastMessageText: "Mentioned you",
//           lastMessageAt: new Date(),
//           unreadCount: 0,
//         },
//       })
//       console.log("[Instagram Webhook] ✅ Conversation created for mention")
//     }
    
//     // Process automation triggers for mentions
//     await processAutomationTriggers({
//       conversationId: conversation.id,
//       messageContent: "",
//       senderId: from.id,
//       senderUsername: from.username || "unknown",
//       senderName: from.username || "Unknown",
//       messageType: "MENTION",
//       isFirstMessage: false,
//       instagramAccountId: instagramAccount.id,
//       triggerData: {
//         commentId: comment_id,
//         mediaId: media_id,
//       }
//     })
    
//   } catch (error) {
//     console.error("[Instagram Webhook] ❌ Error processing mention:", error)
//   }
// }

// // Trigger context interface
// interface TriggerContext {
//   conversationId: string
//   messageContent?: string
//   senderId: string
//   senderUsername: string
//   senderName: string
//   messageType: "DM" | "COMMENT" | "STORY_REPLY" | "MENTION"
//   isFirstMessage: boolean
//   instagramAccountId: string
//   triggerData?: any
// }

// // Check if event should trigger automations
// async function processAutomationTriggers(context: TriggerContext) {
//   const { conversationId, messageContent, senderId, messageType, isFirstMessage, instagramAccountId } = context
  
//   console.log("[Automation] 🔍 Checking for automation triggers:", {
//     messageType,
//     isFirstMessage,
//     messageContent,
//     instagramAccountId,
//   })
  
//   // Get conversation with related data
//   const conversation = await prisma.conversation.findUnique({
//     where: { id: conversationId },
//     include: { 
//       user: true,
//       instagramAccount: true,
//       conversationTags: {
//         include: { tag: true }
//       }
//     },
//   })
  
//   if (!conversation) {
//     console.log("[Automation] ⚠️ Conversation not found")
//     return
//   }
  
//   // Find active automations for this user and Instagram account
//   const automations = await prisma.automation.findMany({
//     where: {
//       userId: conversation.userId,
//       instagramAccountId: instagramAccountId,
//       isActive: true,
//     },
//     include: {
//       triggers: true,
//       actions: {
//         orderBy: { order: "asc" },
//       },
//       instagramAccount: true,
//     },
//   })
  
//   console.log("[Automation] Found active automations:", automations.length)
  
//   // Check each automation for matching triggers
//   for (const automation of automations) {
//     console.log("[Automation] Checking automation:", {
//       id: automation.id,
//       name: automation.name,
//       triggersCount: automation.triggers.length,
//     })
    
//     const shouldExecute = checkAutomationTriggers(automation, context)
    
//     if (shouldExecute) {
//       console.log(`[Automation] ✅ Triggering automation: ${automation.name}`)
      
//       // Create execution record
//       const execution = await prisma.automationExecution.create({
//         data: {
//           automationId: automation.id,
//           conversationId: conversationId,
//           status: "pending",
//           triggeredBy: `${messageType}_${senderId}`,
//         }
//       })
      
//       await executeAutomation(automation, context, conversation, execution.id)
      
//       // Only execute first matching automation
//       break
//     } else {
//       console.log(`[Automation] ❌ Automation did not match: ${automation.name}`)
//     }
//   }
// }

// // Check if automation triggers match the event
// function checkAutomationTriggers(automation: any, context: TriggerContext): boolean {
//   const { messageContent = "", messageType, isFirstMessage } = context
  
//   // If no triggers, don't execute
//   if (!automation.triggers || automation.triggers.length === 0) {
//     console.log("[Automation] No triggers configured")
//     return false
//   }
  
//   const triggerResults = automation.triggers.map((trigger: any) => {
//     const conditions = trigger.conditions || {}
    
//     console.log("[Automation] Evaluating trigger:", {
//       type: trigger.type,
//       conditions,
//     })
    
//     switch (trigger.type) {
//       case "DM_RECEIVED":
//       case "new_message":
//         return messageType === "DM"
        
//       case "FIRST_MESSAGE":
//         return isFirstMessage && messageType === "DM"
        
//       case "KEYWORD":
//       case "keyword":
//         if (messageType !== "DM" && messageType !== "COMMENT") return false
//         const keywords = conditions.keywords || []
//         const matchType = conditions.matchType || "contains"
        
//         console.log("[Automation] Checking keywords:", {
//           keywords,
//           matchType,
//           messageContent,
//         })
        
//         if (matchType === "contains" || matchType === "any") {
//           return keywords.some((keyword: string) => 
//             messageContent.toLowerCase().includes(keyword.toLowerCase())
//           )
//         } else if (matchType === "exact" || matchType === "all") {
//           return keywords.every((keyword: string) => 
//             messageContent.toLowerCase().includes(keyword.toLowerCase())
//           )
//         } else if (matchType === "starts_with") {
//           return keywords.some((keyword: string) => 
//             messageContent.toLowerCase().startsWith(keyword.toLowerCase())
//           )
//         }
//         return false
        
//       case "STORY_REPLY":
//       case "story_reply":
//         return messageType === "STORY_REPLY"
        
//       case "COMMENT":
//       case "COMMENT_RECEIVED":
//       case "comment":
//         return messageType === "COMMENT"
        
//       case "MENTION":
//       case "MENTION_RECEIVED":
//       case "mention":
//         return messageType === "MENTION"
        
//       default:
//         console.log("[Automation] Unknown trigger type:", trigger.type)
//         return false
//     }
//   })
  
//   // Default to OR logic
//   const result = triggerResults.some((result: any) => result)
//   console.log("[Automation] Trigger evaluation result:", result)
//   return result
// }

// // Execute automation actions
// async function executeAutomation(
//   automation: any, 
//   context: TriggerContext, 
//   conversation: any,
//   executionId: string
// ) {
//   try {
//     console.log("[Automation] 🚀 Executing automation:", automation.name)
//     console.log("[Automation] Actions to execute:", automation.actions.length)
    
//     // Initialize Instagram API
//     const instagramAPI = new InstagramAPI({
//       accessToken: conversation.instagramAccount.accessToken,
//       instagramId: conversation.instagramAccount.instagramId,
//     })
    
//     const executor = new AutomationExecutor(instagramAPI)
    
//     // Build execution context
//     const executionContext = {
//       userId: conversation.userId,
//       senderId: context.senderId,
//       messageText: context.messageContent,
//       triggerData: {
//         participantName: conversation.participantName,
//         participantUsername: conversation.participantUsername,
//         username: context.senderUsername,
//         name: context.senderName,
//         ...context.triggerData,
//       },
//       conversationHistory: [],
//       userTags: conversation.conversationTags.map((ct: any) => ct.tag.name),
//     }
    
//     // Execute each action in sequence
//     for (const action of automation.actions) {
//       try {
//         console.log("[Automation] Executing action:", {
//           type: action.type,
//           order: action.order,
//         })
        
//         const actionData = action.content || {}
        
//         // Handle delays
//         if (action.type === "DELAY" || action.type === "delay") {
//           const delayMs = calculateDelay(actionData)
          
//           console.log("[Automation] Processing delay:", { delayMs })
          
//           // For longer delays, use message queue
//           if (delayMs > 60000) { // More than 1 minute
//             const remainingActions = automation.actions.slice(
//               automation.actions.indexOf(action) + 1
//             )
            
//             console.log("[Automation] Queuing remaining actions:", remainingActions.length)
            
//             if (remainingActions.length > 0) {
//               // Queue remaining actions
//               for (const futureAction of remainingActions) {
//                 if (futureAction.type === "SEND_MESSAGE" || futureAction.type === "send_message") {
//                   await enqueueMessage({
//                     conversationId: context.conversationId,
//                     messageContent: futureAction.content?.message || "",
//                     recipientId: context.senderId,
//                     scheduledFor: new Date(Date.now() + delayMs),
//                     metadata: { automationId: automation.id, actionId: futureAction.id }
//                   })
//                 }
//               }
//             }
//             break // Stop processing after scheduling
//           } else {
//             // For short delays, just wait
//             await new Promise(resolve => setTimeout(resolve, delayMs))
//           }
//         } else {
//           // Execute the action
//           await executor.executeAction(action.type, actionData, executionContext)
          
//           console.log("[Automation] ✅ Action executed successfully")
          
//           // Small delay between actions to avoid rate limits
//           await new Promise(resolve => setTimeout(resolve, 1000))
//         }
        
//       } catch (error) {
//         console.error(`[Automation] ❌ Error executing action ${action.type}:`, error)
//         // Continue with next action
//       }
//     }
    
//     // Update execution record
//     await prisma.automationExecution.update({
//       where: { id: executionId },
//       data: {
//         status: "success",
//         completedAt: new Date(),
//       }
//     })
    
//     console.log(`[Automation] ✅ Completed automation: ${automation.name}`)
    
//   } catch (error) {
//     console.error("[Automation] ❌ Error executing automation:", error)
    
//     // Update execution record with error
//     await prisma.automationExecution.update({
//       where: { id: executionId },
//       data: {
//         status: "failed",
//         error: error instanceof Error ? error.message : "Unknown error",
//         completedAt: new Date(),
//       }
//     })
//   }
// }

// // Calculate delay in milliseconds
// function calculateDelay(actionData: any): number {
//   const days = actionData.delayDays || 0
//   const hours = actionData.delayHours || 0
//   const minutes = actionData.delayMinutes || 0
  
//   return (days * 24 * 60 + hours * 60 + minutes) * 60 * 1000
// }

// NEW EMBED - app/api/webhooks/instagram/route.ts


// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/db"
// import { InstagramAPI } from "@/lib/instagram-api"
// import { AutomationExecutor } from "@/lib/automation-executor"
// import { enqueueMessage } from "@/lib/automation-queue"

// // GET - Webhook verification (called by Meta to verify your endpoint)
// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
  
//   const mode = searchParams.get("hub.mode")
//   const token = searchParams.get("hub.verify_token")
//   const challenge = searchParams.get("hub.challenge")
  
//   const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN
  
//   console.log("[Instagram Webhook] Verification attempt:", {
//     mode,
//     tokenMatch: token === verifyToken,
//     hasChallenge: !!challenge,
//   })
  
//   if (mode === "subscribe" && token === verifyToken) {
//     console.log("[Instagram Webhook] ✅ Verified successfully")
//     return new NextResponse(challenge, { status: 200 })
//   }
  
//   console.error("[Instagram Webhook] ❌ Verification failed")
//   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
// }

// // POST - Webhook events (called by Meta when events occur)
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
    
//     console.log("[Instagram Webhook] 📨 Received webhook:", JSON.stringify(body, null, 2))
    
//     // Process webhook based on object type
//     if (body.object === "instagram") {
//       for (const entry of body.entry || []) {
//         console.log("[Instagram Webhook] Processing entry:", {
//           entryId: entry.id,
//           time: entry.time,
//           hasMessaging: !!entry.messaging,
//           hasChanges: !!entry.changes,
//         })
        
//         // Handle messaging events (DMs, story replies)
//         if (entry.messaging) {
//           console.log("[Instagram Webhook] Found messaging events:", entry.messaging.length)
//           for (const messagingEvent of entry.messaging) {
//             await processMessagingEvent(messagingEvent, entry)
//           }
//         }
        
//         // Handle changes (comments, mentions)
//         if (entry.changes) {
//           console.log("[Instagram Webhook] Found change events:", entry.changes.length)
//           for (const change of entry.changes) {
//             await processChangeEvent(change, entry)
//           }
//         }
//       }
//     }
    
//     // Always return 200 to acknowledge receipt
//     return NextResponse.json({ success: true }, { status: 200 })
//   } catch (error) {
//     console.error("[Instagram Webhook] ❌ Error:", error)
//     // Still return 200 to prevent Meta from retrying
//     return NextResponse.json({ success: true }, { status: 200 })
//   }
// }

// // Handle direct messages and story replies
// async function processMessagingEvent(messagingEvent: any, entry: any) {
//   try {
//     const senderId = messagingEvent.sender?.id
//     const recipientId = messagingEvent.recipient?.id
//     const message = messagingEvent.message
    
//     console.log("[Instagram Webhook] 💬 Processing message:", {
//       senderId,
//       recipientId,
//       entryId: entry.id,
//       messageText: message?.text,
//       hasMessage: !!message,
//     })
    
//     if (!senderId || !recipientId || !message) {
//       console.log("[Instagram Webhook] ⚠️ Missing required fields, skipping")
//       return
//     }
    
//     // IMPORTANT: Try to find account by User ID, Page ID, or entry.id
//     // Instagram uses different IDs in different contexts
//     console.log("[Instagram Webhook] 🔍 Looking for Instagram account...")
//     console.log("[Instagram Webhook] Searching by:")
//     console.log("[Instagram Webhook]   - recipientId:", recipientId)
//     console.log("[Instagram Webhook]   - entryId:", entry.id)
    
//     let instagramAccount = await prisma.instagramAccount.findFirst({
//       where: {
//         OR: [
//           { instagramId: recipientId },        // User ID
//           { instagramId: entry.id },           // Entry ID
//           { instagramPageId: recipientId },    // Page ID for webhooks
//           { instagramPageId: entry.id },       // Page ID for webhooks
//         ]
//       },
//       include: { user: true }
//     })
    
//     // If not found, try to get all accounts and log for debugging
//     if (!instagramAccount) {
//       console.log("[Instagram Webhook] ⚠️ Account not found, checking all accounts...")
//       const allAccounts = await prisma.instagramAccount.findMany({
//         select: { id: true, instagramId: true, instagramPageId: true, username: true }
//       })
//       console.log("[Instagram Webhook] All Instagram accounts in database:", allAccounts)
//       console.log("[Instagram Webhook] Looking for match with:", {
//         recipientId,
//         entryId: entry.id,
//       })
//       console.log("[Instagram Webhook] ⚠️ None of the accounts match the webhook IDs")
//       console.log("[Instagram Webhook] 💡 You need to reconnect your Instagram account to save the Page ID")
//       return
//     }
    
//     console.log("[Instagram Webhook] ✅ Found Instagram account:", {
//       accountId: instagramAccount.id,
//       username: instagramAccount.username,
//       instagramId: instagramAccount.instagramId,
//     })
    
//     // Find or create conversation
//     let conversation = await prisma.conversation.findFirst({
//       where: {
//         instagramAccountId: instagramAccount.id,
//         participantId: senderId,
//       },
//     })
    
//     const isFirstMessage = !conversation
    
//     console.log("[Instagram Webhook] Conversation status:", {
//       exists: !!conversation,
//       isFirstMessage,
//       participantId: senderId,
//     })
    
//     if (!conversation) {
//       console.log("[Instagram Webhook] Creating new conversation...")
//       conversation = await prisma.conversation.create({
//         data: {
//           instagramAccountId: instagramAccount.id,
//           userId: instagramAccount.userId,
//           participantId: senderId,
//           participantName: messagingEvent.sender.username || "Unknown",
//           participantUsername: messagingEvent.sender.username || "unknown",
//           participantAvatar: null,
//           lastMessageText: message.text || "[Media]",
//           lastMessageAt: new Date(messagingEvent.timestamp || Date.now()),
//           unreadCount: 1,
//         },
//       })
//       console.log("[Instagram Webhook] ✅ Conversation created:", conversation.id)
//     } else {
//       console.log("[Instagram Webhook] Updating existing conversation...")
//       await prisma.conversation.update({
//         where: { id: conversation.id },
//         data: {
//           lastMessageText: message.text || "[Media]",
//           lastMessageAt: new Date(messagingEvent.timestamp || Date.now()),
//           unreadCount: { increment: 1 },
//         },
//       })
//       console.log("[Instagram Webhook] ✅ Conversation updated")
//     }
    
//     // Save message to database
//     console.log("[Instagram Webhook] Saving message to database...")
//     await prisma.message.create({
//       data: {
//         conversationId: conversation.id,
//         content: message.text || "[Media]",
//         sender: "participant",
//         isRead: false,
//         messageType: message.is_story_reply ? "story_reply" : "text",
//       },
//     })
//     console.log("[Instagram Webhook] ✅ Message saved")
    
//     // Determine message type
//     const messageType = message.is_story_reply ? "STORY_REPLY" : "DM"
    
//     // Process automation triggers
//     console.log("[Instagram Webhook] 🤖 Processing automation triggers...")
//     await processAutomationTriggers({
//       conversationId: conversation.id,
//       messageContent: message.text,
//       senderId: senderId,
//       senderUsername: messagingEvent.sender.username || "unknown",
//       senderName: messagingEvent.sender.username || "Unknown",
//       messageType,
//       isFirstMessage,
//       instagramAccountId: instagramAccount.id,
//     })
    
//   } catch (error) {
//     console.error("[Instagram Webhook] ❌ Error processing messaging event:", error)
//   }
// }

// // Handle comments and mentions
// async function processChangeEvent(change: any, entry: any) {
//   try {
//     const { field, value } = change
    
//     console.log("[Instagram Webhook] 🔄 Processing change event:", {
//       field,
//       entryId: entry.id,
//     })
    
//     if (field === "comments") {
//       await processComment(value, entry)
//     } else if (field === "mentions") {
//       await processMention(value, entry)
//     }
//   } catch (error) {
//     console.error("[Instagram Webhook] ❌ Error processing change event:", error)
//   }
// }

// // Process comment on a post
// async function processComment(value: any, entry: any) {
//   try {
//     const { id: commentId, text, from, media } = value
    
//     console.log("[Instagram Webhook] 💭 Processing comment:", {
//       commentId,
//       text,
//       from,
//       mediaId: media?.id,
//     })
    
//     if (!from || !text) {
//       console.log("[Instagram Webhook] ⚠️ Comment missing required fields")
//       return
//     }
    
//     // Find Instagram account by entry ID
//     const instagramAccount = await prisma.instagramAccount.findFirst({
//       where: { instagramId: entry.id },
//       include: { user: true }
//     })
    
//     if (!instagramAccount) {
//       console.log("[Instagram Webhook] ⚠️ Account not found for comment")
//       return
//     }
    
//     console.log("[Instagram Webhook] ✅ Found account for comment:", instagramAccount.username)
    
//     // Find or create conversation with commenter
//     let conversation = await prisma.conversation.findFirst({
//       where: {
//         instagramAccountId: instagramAccount.id,
//         participantId: from.id,
//       },
//     })
    
//     if (!conversation) {
//       conversation = await prisma.conversation.create({
//         data: {
//           instagramAccountId: instagramAccount.id,
//           userId: instagramAccount.userId,
//           participantId: from.id,
//           participantName: from.username || "Unknown",
//           participantUsername: from.username || "unknown",
//           participantAvatar: null,
//           lastMessageText: `Commented: ${text}`,
//           lastMessageAt: new Date(),
//           unreadCount: 0,
//         },
//       })
//       console.log("[Instagram Webhook] ✅ Conversation created for commenter")
//     }
    
//     // Process automation triggers for comments
//     await processAutomationTriggers({
//       conversationId: conversation.id,
//       messageContent: text,
//       senderId: from.id,
//       senderUsername: from.username || "unknown",
//       senderName: from.username || "Unknown",
//       messageType: "COMMENT",
//       isFirstMessage: false,
//       instagramAccountId: instagramAccount.id,
//       triggerData: {
//         commentId,
//         mediaId: media?.id,
//       }
//     })
    
//   } catch (error) {
//     console.error("[Instagram Webhook] ❌ Error processing comment:", error)
//   }
// }

// // Process mention in a post
// async function processMention(value: any, entry: any) {
//   try {
//     const { comment_id, media_id, from } = value
    
//     console.log("[Instagram Webhook] 📣 Processing mention:", {
//       commentId: comment_id,
//       mediaId: media_id,
//       from,
//     })
    
//     if (!from) {
//       console.log("[Instagram Webhook] ⚠️ Mention missing sender")
//       return
//     }
    
//     // Find Instagram account
//     const instagramAccount = await prisma.instagramAccount.findFirst({
//       where: { instagramId: entry.id },
//       include: { user: true }
//     })
    
//     if (!instagramAccount) {
//       console.log("[Instagram Webhook] ⚠️ Account not found for mention")
//       return
//     }
    
//     console.log("[Instagram Webhook] ✅ Found account for mention:", instagramAccount.username)
    
//     // Find or create conversation
//     let conversation = await prisma.conversation.findFirst({
//       where: {
//         instagramAccountId: instagramAccount.id,
//         participantId: from.id,
//       },
//     })
    
//     if (!conversation) {
//       conversation = await prisma.conversation.create({
//         data: {
//           instagramAccountId: instagramAccount.id,
//           userId: instagramAccount.userId,
//           participantId: from.id,
//           participantName: from.username || "Unknown",
//           participantUsername: from.username || "unknown",
//           participantAvatar: null,
//           lastMessageText: "Mentioned you",
//           lastMessageAt: new Date(),
//           unreadCount: 0,
//         },
//       })
//       console.log("[Instagram Webhook] ✅ Conversation created for mention")
//     }
    
//     // Process automation triggers for mentions
//     await processAutomationTriggers({
//       conversationId: conversation.id,
//       messageContent: "",
//       senderId: from.id,
//       senderUsername: from.username || "unknown",
//       senderName: from.username || "Unknown",
//       messageType: "MENTION",
//       isFirstMessage: false,
//       instagramAccountId: instagramAccount.id,
//       triggerData: {
//         commentId: comment_id,
//         mediaId: media_id,
//       }
//     })
    
//   } catch (error) {
//     console.error("[Instagram Webhook] ❌ Error processing mention:", error)
//   }
// }

// // Trigger context interface
// interface TriggerContext {
//   conversationId: string
//   messageContent?: string
//   senderId: string
//   senderUsername: string
//   senderName: string
//   messageType: "DM" | "COMMENT" | "STORY_REPLY" | "MENTION"
//   isFirstMessage: boolean
//   instagramAccountId: string
//   triggerData?: any
// }

// // Check if event should trigger automations
// async function processAutomationTriggers(context: TriggerContext) {
//   const { conversationId, messageContent, senderId, messageType, isFirstMessage, instagramAccountId } = context
  
//   console.log("[Automation] 🔍 Checking for automation triggers:", {
//     messageType,
//     isFirstMessage,
//     messageContent,
//     instagramAccountId,
//   })
  
//   // Get conversation with related data
//   const conversation = await prisma.conversation.findUnique({
//     where: { id: conversationId },
//     include: { 
//       user: true,
//       instagramAccount: true,
//       conversationTags: {
//         include: { tag: true }
//       }
//     },
//   })
  
//   if (!conversation) {
//     console.log("[Automation] ⚠️ Conversation not found")
//     return
//   }
  
//   // Find active automations for this user and Instagram account
//   const automations = await prisma.automation.findMany({
//     where: {
//       userId: conversation.userId,
//       instagramAccountId: instagramAccountId,
//       isActive: true,
//     },
//     include: {
//       triggers: true,
//       actions: {
//         orderBy: { order: "asc" },
//       },
//       instagramAccount: true,
//     },
//   })
  
//   console.log("[Automation] Found active automations:", automations.length)
  
//   // Check each automation for matching triggers
//   for (const automation of automations) {
//     console.log("[Automation] Checking automation:", {
//       id: automation.id,
//       name: automation.name,
//       triggersCount: automation.triggers.length,
//     })
    
//     const shouldExecute = checkAutomationTriggers(automation, context)
    
//     if (shouldExecute) {
//       console.log(`[Automation] ✅ Triggering automation: ${automation.name}`)
      
//       // Create execution record
//       const execution = await prisma.automationExecution.create({
//         data: {
//           automationId: automation.id,
//           conversationId: conversationId,
//           status: "pending",
//           triggeredBy: `${messageType}_${senderId}`,
//         }
//       })
      
//       await executeAutomation(automation, context, conversation, execution.id)
      
//       // Only execute first matching automation
//       break
//     } else {
//       console.log(`[Automation] ❌ Automation did not match: ${automation.name}`)
//     }
//   }
// }

// // Check if automation triggers match the event
// function checkAutomationTriggers(automation: any, context: TriggerContext): boolean {
//   const { messageContent = "", messageType, isFirstMessage } = context
  
//   // If no triggers, don't execute
//   if (!automation.triggers || automation.triggers.length === 0) {
//     console.log("[Automation] No triggers configured")
//     return false
//   }
  
//   const triggerResults = automation.triggers.map((trigger: any) => {
//     const conditions = trigger.conditions || {}
    
//     console.log("[Automation] Evaluating trigger:", {
//       type: trigger.type,
//       conditions,
//     })
    
//     switch (trigger.type) {
//       case "DM_RECEIVED":
//       case "new_message":
//         return messageType === "DM"
        
//       case "FIRST_MESSAGE":
//         return isFirstMessage && messageType === "DM"
        
//       case "KEYWORD":
//       case "keyword":
//         if (messageType !== "DM" && messageType !== "COMMENT") return false
//         const keywords = conditions.keywords || []
//         const matchType = conditions.matchType || "contains"
        
//         console.log("[Automation] Checking keywords:", {
//           keywords,
//           matchType,
//           messageContent,
//         })
        
//         if (matchType === "contains" || matchType === "any") {
//           return keywords.some((keyword: string) => 
//             messageContent.toLowerCase().includes(keyword.toLowerCase())
//           )
//         } else if (matchType === "exact" || matchType === "all") {
//           return keywords.every((keyword: string) => 
//             messageContent.toLowerCase().includes(keyword.toLowerCase())
//           )
//         } else if (matchType === "starts_with") {
//           return keywords.some((keyword: string) => 
//             messageContent.toLowerCase().startsWith(keyword.toLowerCase())
//           )
//         }
//         return false
        
//       case "STORY_REPLY":
//       case "story_reply":
//         return messageType === "STORY_REPLY"
        
//       case "COMMENT":
//       case "COMMENT_RECEIVED":
//       case "comment":
//         return messageType === "COMMENT"
        
//       case "MENTION":
//       case "MENTION_RECEIVED":
//       case "mention":
//         return messageType === "MENTION"
        
//       default:
//         console.log("[Automation] Unknown trigger type:", trigger.type)
//         return false
//     }
//   })
  
//   // Default to OR logic
//   const result = triggerResults.some((result: any) => result)
//   console.log("[Automation] Trigger evaluation result:", result)
//   return result
// }

// // Execute automation actions
// async function executeAutomation(
//   automation: any, 
//   context: TriggerContext, 
//   conversation: any,
//   executionId: string
// ) {
//   try {
//     console.log("[Automation] 🚀 Executing automation:", automation.name)
//     console.log("[Automation] Actions to execute:", automation.actions.length)
    
//     // Initialize Instagram API
//     const instagramAPI = new InstagramAPI({
//       accessToken: conversation.instagramAccount.accessToken,
//       instagramId: conversation.instagramAccount.instagramId,
//     })
    
//     const executor = new AutomationExecutor(instagramAPI)
    
//     // Build execution context
//     const executionContext = {
//       userId: conversation.userId,
//       senderId: context.senderId,
//       messageText: context.messageContent,
//       triggerData: {
//         participantName: conversation.participantName,
//         participantUsername: conversation.participantUsername,
//         username: context.senderUsername,
//         name: context.senderName,
//         ...context.triggerData,
//       },
//       conversationHistory: [],
//       userTags: conversation.conversationTags.map((ct: any) => ct.tag.name),
//     }
    
//     // Execute each action in sequence
//     for (const action of automation.actions) {
//       try {
//         console.log("[Automation] Executing action:", {
//           type: action.type,
//           order: action.order,
//         })
        
//         const actionData = action.content || {}
        
//         // Handle delays
//         if (action.type === "DELAY" || action.type === "delay") {
//           const delayMs = calculateDelay(actionData)
          
//           console.log("[Automation] Processing delay:", { delayMs })
          
//           // For longer delays, use message queue
//           if (delayMs > 60000) { // More than 1 minute
//             const remainingActions = automation.actions.slice(
//               automation.actions.indexOf(action) + 1
//             )
            
//             console.log("[Automation] Queuing remaining actions:", remainingActions.length)
            
//             if (remainingActions.length > 0) {
//               // Queue remaining actions
//               for (const futureAction of remainingActions) {
//                 if (futureAction.type === "SEND_MESSAGE" || futureAction.type === "send_message") {
//                   await enqueueMessage({
//                     conversationId: context.conversationId,
//                     messageContent: futureAction.content?.message || "",
//                     recipientId: context.senderId,
//                     scheduledFor: new Date(Date.now() + delayMs),
//                     metadata: { automationId: automation.id, actionId: futureAction.id }
//                   })
//                 }
//               }
//             }
//             break // Stop processing after scheduling
//           } else {
//             // For short delays, just wait
//             await new Promise(resolve => setTimeout(resolve, delayMs))
//           }
//         } else {
//           // Execute the action
//           await executor.executeAction(action.type, actionData, executionContext)
          
//           console.log("[Automation] ✅ Action executed successfully")
          
//           // Small delay between actions to avoid rate limits
//           await new Promise(resolve => setTimeout(resolve, 1000))
//         }
        
//       } catch (error) {
//         console.error(`[Automation] ❌ Error executing action ${action.type}:`, error)
//         // Continue with next action
//       }
//     }
    
//     // Update execution record
//     await prisma.automationExecution.update({
//       where: { id: executionId },
//       data: {
//         status: "success",
//         completedAt: new Date(),
//       }
//     })
    
//     console.log(`[Automation] ✅ Completed automation: ${automation.name}`)
    
//   } catch (error) {
//     console.error("[Automation] ❌ Error executing automation:", error)
    
//     // Update execution record with error
//     await prisma.automationExecution.update({
//       where: { id: executionId },
//       data: {
//         status: "failed",
//         error: error instanceof Error ? error.message : "Unknown error",
//         completedAt: new Date(),
//       }
//     })
//   }
// }

// // Calculate delay in milliseconds
// function calculateDelay(actionData: any): number {
//   const days = actionData.delayDays || 0
//   const hours = actionData.delayHours || 0
//   const minutes = actionData.delayMinutes || 0
  
//   return (days * 24 * 60 + hours * 60 + minutes) * 60 * 1000
// }

// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/db"
// import { InstagramAPI } from "@/lib/instagram-api"
// import { AutomationExecutor } from "@/lib/automation-executor"
// import { enqueueMessage } from "@/lib/automation-queue"

// // GET - Webhook verification
// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
//   const mode = searchParams.get("hub.mode")
//   const token = searchParams.get("hub.verify_token")
//   const challenge = searchParams.get("hub.challenge")
  
//   if (mode === "subscribe" && token === process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
//     console.log("[Instagram Webhook] ✅ Verified successfully")
//     return new NextResponse(challenge, { status: 200 })
//   }
  
//   console.error("[Instagram Webhook] ❌ Verification failed")
//   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
// }

// // POST - Webhook events
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
    
//     console.log("[Instagram Webhook] 📨 Received webhook:", JSON.stringify(body, null, 2))
    
//     if (body.object === "instagram") {
//       for (const entry of body.entry || []) {
//         const webhookPageId = entry.id // ← THE KEY: Use this ID for API calls
        
//         console.log("[Instagram Webhook] Processing entry:", {
//           webhookPageId,
//           time: entry.time,
//           hasMessaging: !!entry.messaging,
//           hasChanges: !!entry.changes,
//         })
        
//         // Handle messaging events (DMs, story replies)
//         if (entry.messaging) {
//           for (const messagingEvent of entry.messaging) {
//             await processMessagingEvent(messagingEvent, webhookPageId)
//           }
//         }
        
//         // Handle changes (comments, mentions)
//         if (entry.changes) {
//           for (const change of entry.changes) {
//             await processChangeEvent(change, webhookPageId)
//           }
//         }
//       }
//     }
    
//     return NextResponse.json({ success: true }, { status: 200 })
//   } catch (error) {
//     console.error("[Instagram Webhook] ❌ Error:", error)
//     return NextResponse.json({ success: true }, { status: 200 })
//   }
// }

// // Handle direct messages and story replies
// async function processMessagingEvent(messagingEvent: any, webhookPageId: string) {
//   try {
//     const senderId = messagingEvent.sender?.id
//     const message = messagingEvent.message
    
//     console.log("[Instagram Webhook] 💬 Processing message:", {
//       senderId,
//       webhookPageId,
//       messageText: message?.text,
//     })
    
//     if (!senderId || !message || message.is_echo) {
//       console.log("[Instagram Webhook] ⚠️ Skipping (missing data or echo)")
//       return
//     }
    
//     // Find Instagram account - match by webhookPageId OR update if found by other means
//     let instagramAccount = await prisma.instagramAccount.findFirst({
//       where: {
//         OR: [
//           { instagramPageId: webhookPageId },
//           { instagramId: webhookPageId },
//         ]
//       },
//       include: { user: true }
//     })
    
//     // If not found, try to find ANY connected account and update it
//     if (!instagramAccount) {
//       console.log("[Instagram Webhook] No account found by webhook ID")
//       console.log("[Instagram Webhook] Searching for recently connected accounts...")
      
//       instagramAccount = await prisma.instagramAccount.findFirst({
//         where: { 
//           isConnected: true,
//           // Optional: add time filter to only match recently connected accounts
//           createdAt: {
//             gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
//           }
//         },
//         orderBy: { createdAt: 'desc' },
//         include: { user: true }
//       })
      
//       if (instagramAccount) {
//         console.log("[Instagram Webhook] ✅ Found recent account:", instagramAccount.username)
//         console.log("[Instagram Webhook] Updating with webhook Page ID:", webhookPageId)
        
//         // Update with the correct webhook Page ID
//         instagramAccount = await prisma.instagramAccount.update({
//           where: { id: instagramAccount.id },
//           data: { instagramPageId: webhookPageId },
//           include: { user: true }
//         })
        
//         console.log("[Instagram Webhook] ✅ Account updated with webhook ID")
//       } else {
//         console.log("[Instagram Webhook] ⚠️ No matching account found")
//         const allAccounts = await prisma.instagramAccount.findMany({
//           select: { id: true, instagramId: true, instagramPageId: true, username: true, createdAt: true }
//         })
//         console.log("[Instagram Webhook] All accounts:", allAccounts)
//         return
//       }
//     }
    
//     console.log("[Instagram Webhook] ✅ Using account:", instagramAccount.username)
    
//     // Find or create conversation
//     let conversation = await prisma.conversation.findFirst({
//       where: {
//         instagramAccountId: instagramAccount.id,
//         participantId: senderId,
//       },
//     })
    
//     const isFirstMessage = !conversation
    
//     if (!conversation) {
//       console.log("[Instagram Webhook] Creating new conversation...")
//       conversation = await prisma.conversation.create({
//         data: {
//           instagramAccountId: instagramAccount.id,
//           userId: instagramAccount.userId,
//           participantId: senderId,
//           participantName: messagingEvent.sender.username || "Unknown",
//           participantUsername: messagingEvent.sender.username || "unknown",
//           participantAvatar: null,
//           lastMessageText: message.text || "[Media]",
//           lastMessageAt: new Date(messagingEvent.timestamp || Date.now()),
//           unreadCount: 1,
//         },
//       })
//     } else {
//       await prisma.conversation.update({
//         where: { id: conversation.id },
//         data: {
//           lastMessageText: message.text || "[Media]",
//           lastMessageAt: new Date(messagingEvent.timestamp || Date.now()),
//           unreadCount: { increment: 1 },
//         },
//       })
//     }
    
//     // Save message
//     await prisma.message.create({
//       data: {
//         conversationId: conversation.id,
//         content: message.text || "[Media]",
//         sender: "participant",
//         isRead: false,
//         messageType: message.is_story_reply ? "story_reply" : "text",
//       },
//     })
    
//     console.log("[Instagram Webhook] ✅ Message saved")
    
//     // Process automation triggers - PASS webhookPageId for API calls
//     const messageType = message.is_story_reply ? "STORY_REPLY" : "DM"
    
//     await processAutomationTriggers({
//       conversationId: conversation.id,
//       messageContent: message.text,
//       senderId: senderId,
//       senderUsername: messagingEvent.sender.username || "unknown",
//       senderName: messagingEvent.sender.username || "Unknown",
//       messageType,
//       isFirstMessage,
//       instagramAccountId: instagramAccount.id,
//       webhookPageId: webhookPageId, // ← Pass webhook ID for API calls
//       accessToken: instagramAccount.accessToken,
//     })
    
//   } catch (error) {
//     console.error("[Instagram Webhook] ❌ Error processing message:", error)
//   }
// }

// // Handle comments
// async function processChangeEvent(change: any, webhookPageId: string) {
//   try {
//     const { field, value } = change
    
//     console.log("[Instagram Webhook] 🔄 Processing change:", field)
    
//     if (field === "comments") {
//       await processComment(value, webhookPageId)
//     } else if (field === "mentions") {
//       await processMention(value, webhookPageId)
//     }
//   } catch (error) {
//     console.error("[Instagram Webhook] ❌ Error processing change:", error)
//   }
// }

// async function processComment(value: any, webhookPageId: string) {
//   try {
//     const { id: commentId, text, from, media } = value
    
//     if (!from || !text) {
//       console.log("[Instagram Webhook] ⚠️ Comment missing data")
//       return
//     }
    
//     // Find account by webhook Page ID
//     const instagramAccount = await prisma.instagramAccount.findFirst({
//       where: {
//         OR: [
//           { instagramPageId: webhookPageId },
//           { instagramId: webhookPageId },
//         ]
//       },
//       include: { user: true }
//     })
    
//     if (!instagramAccount) {
//       console.log("[Instagram Webhook] ⚠️ No account for comment")
//       return
//     }
    
//     // Find or create conversation
//     let conversation = await prisma.conversation.findFirst({
//       where: {
//         instagramAccountId: instagramAccount.id,
//         participantId: from.id,
//       },
//     })
    
//     if (!conversation) {
//       conversation = await prisma.conversation.create({
//         data: {
//           instagramAccountId: instagramAccount.id,
//           userId: instagramAccount.userId,
//           participantId: from.id,
//           participantName: from.username || "Unknown",
//           participantUsername: from.username || "unknown",
//           participantAvatar: null,
//           lastMessageText: `Commented: ${text}`,
//           lastMessageAt: new Date(),
//           unreadCount: 0,
//         },
//       })
//     }
    
//     // Process automation
//     await processAutomationTriggers({
//       conversationId: conversation.id,
//       messageContent: text,
//       senderId: from.id,
//       senderUsername: from.username || "unknown",
//       senderName: from.username || "Unknown",
//       messageType: "COMMENT",
//       isFirstMessage: false,
//       instagramAccountId: instagramAccount.id,
//       webhookPageId: webhookPageId,
//       accessToken: instagramAccount.accessToken,
//       triggerData: { commentId, mediaId: media?.id }
//     })
    
//   } catch (error) {
//     console.error("[Instagram Webhook] ❌ Error processing comment:", error)
//   }
// }

// async function processMention(value: any, webhookPageId: string) {
//   try {
//     const { comment_id, media_id, from } = value
    
//     if (!from) return
    
//     const instagramAccount = await prisma.instagramAccount.findFirst({
//       where: {
//         OR: [
//           { instagramPageId: webhookPageId },
//           { instagramId: webhookPageId },
//         ]
//       },
//       include: { user: true }
//     })
    
//     if (!instagramAccount) return
    
//     let conversation = await prisma.conversation.findFirst({
//       where: {
//         instagramAccountId: instagramAccount.id,
//         participantId: from.id,
//       },
//     })
    
//     if (!conversation) {
//       conversation = await prisma.conversation.create({
//         data: {
//           instagramAccountId: instagramAccount.id,
//           userId: instagramAccount.userId,
//           participantId: from.id,
//           participantName: from.username || "Unknown",
//           participantUsername: from.username || "unknown",
//           participantAvatar: null,
//           lastMessageText: "Mentioned you",
//           lastMessageAt: new Date(),
//           unreadCount: 0,
//         },
//       })
//     }
    
//     await processAutomationTriggers({
//       conversationId: conversation.id,
//       messageContent: "",
//       senderId: from.id,
//       senderUsername: from.username || "unknown",
//       senderName: from.username || "Unknown",
//       messageType: "MENTION",
//       isFirstMessage: false,
//       instagramAccountId: instagramAccount.id,
//       webhookPageId: webhookPageId,
//       accessToken: instagramAccount.accessToken,
//       triggerData: { commentId: comment_id, mediaId: media_id }
//     })
    
//   } catch (error) {
//     console.error("[Instagram Webhook] ❌ Error processing mention:", error)
//   }
// }

// // Trigger context
// interface TriggerContext {
//   conversationId: string
//   messageContent?: string
//   senderId: string
//   senderUsername: string
//   senderName: string
//   messageType: "DM" | "COMMENT" | "STORY_REPLY" | "MENTION"
//   isFirstMessage: boolean
//   instagramAccountId: string
//   webhookPageId: string  // ← The ID from webhook to use for API calls
//   accessToken: string
//   triggerData?: any
// }

// // Process automation triggers
// async function processAutomationTriggers(context: TriggerContext) {
//   console.log("[Automation] 🔍 Checking triggers:", {
//     messageType: context.messageType,
//     isFirstMessage: context.isFirstMessage,
//   })
  
//   const conversation = await prisma.conversation.findUnique({
//     where: { id: context.conversationId },
//     include: { 
//       user: true,
//       instagramAccount: true,
//       conversationTags: { include: { tag: true } }
//     },
//   })
  
//   if (!conversation) return
  
//   const automations = await prisma.automation.findMany({
//     where: {
//       userId: conversation.userId,
//       instagramAccountId: context.instagramAccountId,
//       isActive: true,
//     },
//     include: {
//       triggers: true,
//       actions: { orderBy: { order: "asc" } },
//       instagramAccount: true,
//     },
//   })
  
//   console.log("[Automation] Found automations:", automations.length)
  
//   for (const automation of automations) {
//     const shouldExecute = checkAutomationTriggers(automation, context)
    
//     if (shouldExecute) {
//       console.log(`[Automation] ✅ Triggering: ${automation.name}`)
      
//       const execution = await prisma.automationExecution.create({
//         data: {
//           automationId: automation.id,
//           conversationId: context.conversationId,
//           status: "pending",
//           triggeredBy: `${context.messageType}_${context.senderId}`,
//         }
//       })
      
//       await executeAutomation(automation, context, conversation, execution.id)
//       break
//     }
//   }
// }

// function checkAutomationTriggers(automation: any, context: TriggerContext): boolean {
//   const { messageContent = "", messageType, isFirstMessage } = context
  
//   if (!automation.triggers || automation.triggers.length === 0) {
//     return false
//   }
  
//   const triggerResults = automation.triggers.map((trigger: any) => {
//     const conditions = trigger.conditions || {}
    
//     switch (trigger.type) {
//       case "DM_RECEIVED":
//       case "new_message":
//         return messageType === "DM"
        
//       case "FIRST_MESSAGE":
//         return isFirstMessage && messageType === "DM"
        
//       case "KEYWORD":
//       case "keyword":
//         if (messageType !== "DM" && messageType !== "COMMENT") return false
//         const keywords = conditions.keywords || []
//         const matchType = conditions.matchType || "contains"
        
//         if (matchType === "contains" || matchType === "any") {
//           return keywords.some((keyword: string) => 
//             messageContent.toLowerCase().includes(keyword.toLowerCase())
//           )
//         } else if (matchType === "exact" || matchType === "all") {
//           return keywords.every((keyword: string) => 
//             messageContent.toLowerCase().includes(keyword.toLowerCase())
//           )
//         } else if (matchType === "starts_with") {
//           return keywords.some((keyword: string) => 
//             messageContent.toLowerCase().startsWith(keyword.toLowerCase())
//           )
//         }
//         return false
        
//       case "STORY_REPLY":
//         return messageType === "STORY_REPLY"
        
//       case "COMMENT":
//       case "COMMENT_RECEIVED":
//         return messageType === "COMMENT"
        
//       case "MENTION":
//       case "MENTION_RECEIVED":
//         return messageType === "MENTION"
        
//       default:
//         return false
//     }
//   })
  
//   return triggerResults.some((result: any) => result)
// }

// async function executeAutomation(
//   automation: any, 
//   context: TriggerContext, 
//   conversation: any,
//   executionId: string
// ) {
//   try {
//     console.log("[Automation] 🚀 Executing:", automation.name)
    
//     // ← THE KEY: Use webhookPageId for API calls, NOT stored instagramId
//     const instagramAPI = new InstagramAPI({
//       accessToken: context.accessToken,
//       instagramId: context.webhookPageId, // ← Use webhook ID here!
//     })
    
//     const executor = new AutomationExecutor(instagramAPI)
    
//     const executionContext = {
//       userId: conversation.userId,
//       senderId: context.senderId,
//       messageText: context.messageContent,
//       triggerData: {
//         participantName: conversation.participantName,
//         participantUsername: conversation.participantUsername,
//         username: context.senderUsername,
//         name: context.senderName,
//         ...context.triggerData,
//       },
//       conversationHistory: [],
//       userTags: conversation.conversationTags.map((ct: any) => ct.tag.name),
//     }
    
//     for (const action of automation.actions) {
//       try {
//         const actionData = action.content || {}
        
//         if (action.type === "DELAY" || action.type === "delay") {
//           const delayMs = calculateDelay(actionData)
          
//           if (delayMs > 60000) {
//             const remainingActions = automation.actions.slice(
//               automation.actions.indexOf(action) + 1
//             )
            
//             for (const futureAction of remainingActions) {
//               if (futureAction.type === "SEND_MESSAGE") {
//                 await enqueueMessage({
//                   conversationId: context.conversationId,
//                   messageContent: futureAction.content?.message || "",
//                   recipientId: context.senderId,
//                   scheduledFor: new Date(Date.now() + delayMs),
//                   metadata: { automationId: automation.id, actionId: futureAction.id }
//                 })
//               }
//             }
//             break
//           } else {
//             await new Promise(resolve => setTimeout(resolve, delayMs))
//           }
//         } else {
//           await executor.executeAction(action.type, actionData, executionContext)
//           await new Promise(resolve => setTimeout(resolve, 1000))
//         }
        
//       } catch (error) {
//         console.error(`[Automation] ❌ Action failed:`, error)
//       }
//     }
    
//     await prisma.automationExecution.update({
//       where: { id: executionId },
//       data: { status: "success", completedAt: new Date() }
//     })
    
//     console.log(`[Automation] ✅ Completed: ${automation.name}`)
    
//   } catch (error) {
//     console.error("[Automation] ❌ Error:", error)
//     await prisma.automationExecution.update({
//       where: { id: executionId },
//       data: {
//         status: "failed",
//         error: error instanceof Error ? error.message : "Unknown error",
//         completedAt: new Date(),
//       }
//     })
//   }
// }

// function calculateDelay(actionData: any): number {
//   const days = actionData.delayDays || 0
//   const hours = actionData.delayHours || 0
//   const minutes = actionData.delayMinutes || 0
//   return (days * 24 * 60 + hours * 60 + minutes) * 60 * 1000
// }



import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { InstagramAPI } from "@/lib/instagram-api"
import { AutomationExecutor } from "@/lib/automation-executor"
import { enqueueMessage } from "@/lib/automation-queue"

// GET - Webhook verification
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")
  
  if (mode === "subscribe" && token === process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
    console.log("[Instagram Webhook] ✅ Verified successfully")
    return new NextResponse(challenge, { status: 200 })
  }
  
  console.error("[Instagram Webhook] ❌ Verification failed")
  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

// POST - Webhook events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log("[Instagram Webhook] 📨 Received webhook:", JSON.stringify(body, null, 2))
    
    if (body.object === "instagram") {
      for (const entry of body.entry || []) {
        const webhookPageId = entry.id
        
        console.log("[Instagram Webhook] Processing entry:", {
          webhookPageId,
          time: entry.time,
          hasMessaging: !!entry.messaging,
          hasChanges: !!entry.changes,
        })
        
        // Handle messaging events (DMs, story replies)
        if (entry.messaging) {
          for (const messagingEvent of entry.messaging) {
            await processMessagingEvent(messagingEvent, webhookPageId)
          }
        }
        
        // Handle changes (comments, mentions)
        if (entry.changes) {
          for (const change of entry.changes) {
            await processChangeEvent(change, webhookPageId)
          }
        }
      }
    }
    
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[Instagram Webhook] ❌ Error:", error)
    return NextResponse.json({ success: true }, { status: 200 })
  }
}

// Handle direct messages and story replies
async function processMessagingEvent(messagingEvent: any, webhookPageId: string) {
  try {
    const senderId = messagingEvent.sender?.id
    const message = messagingEvent.message
    
    console.log("[Instagram Webhook] 💬 Processing message:", {
      senderId,
      webhookPageId,
      messageText: message?.text,
    })
    
    if (!senderId || !message || message.is_echo) {
      console.log("[Instagram Webhook] ⚠️ Skipping (missing data or echo)")
      return
    }
    
    // Find Instagram account - match by webhookPageId OR update if found by other means
    let instagramAccount = await prisma.instagramAccount.findFirst({
      where: {
        OR: [
          { instagramPageId: webhookPageId },
          { instagramId: webhookPageId },
        ]
      },
      include: { user: true }
    })
    
    // If not found, try to find ANY connected account and update it
    if (!instagramAccount) {
      console.log("[Instagram Webhook] No account found by webhook ID")
      console.log("[Instagram Webhook] Searching for recently connected accounts...")
      
      instagramAccount = await prisma.instagramAccount.findFirst({
        where: { 
          isConnected: true,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { createdAt: 'desc' },
        include: { user: true }
      })
      
      if (instagramAccount) {
        console.log("[Instagram Webhook] ✅ Found recent account:", instagramAccount.username)
        console.log("[Instagram Webhook] Updating with webhook Page ID:", webhookPageId)
        
        instagramAccount = await prisma.instagramAccount.update({
          where: { id: instagramAccount.id },
          data: { instagramPageId: webhookPageId },
          include: { user: true }
        })
        
        console.log("[Instagram Webhook] ✅ Account updated with webhook ID")
      } else {
        console.log("[Instagram Webhook] ⚠️ No matching account found")
        const allAccounts = await prisma.instagramAccount.findMany({
          select: { id: true, instagramId: true, instagramPageId: true, username: true, createdAt: true }
        })
        console.log("[Instagram Webhook] All accounts:", allAccounts)
        return
      }
    }
    
    console.log("[Instagram Webhook] ✅ Using account:", instagramAccount.username)
    
    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        instagramAccountId: instagramAccount.id,
        participantId: senderId,
      },
    })
    
    const isFirstMessage = !conversation
    
    if (!conversation) {
      console.log("[Instagram Webhook] Creating new conversation...")
      conversation = await prisma.conversation.create({
        data: {
          instagramAccountId: instagramAccount.id,
          userId: instagramAccount.userId,
          participantId: senderId,
          participantName: messagingEvent.sender.username || "Unknown",
          participantUsername: messagingEvent.sender.username || "unknown",
          participantAvatar: null,
          lastMessageText: message.text || "[Media]",
          lastMessageAt: new Date(messagingEvent.timestamp || Date.now()),
          unreadCount: 1,
        },
      })
    } else {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageText: message.text || "[Media]",
          lastMessageAt: new Date(messagingEvent.timestamp || Date.now()),
          unreadCount: { increment: 1 },
        },
      })
    }
    
    // Save message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: message.text || "[Media]",
        sender: "participant",
        isRead: false,
        messageType: message.is_story_reply ? "story_reply" : "text",
      },
    })
    
    console.log("[Instagram Webhook] ✅ Message saved")
    
    // Process automation triggers
    const messageType = message.is_story_reply ? "STORY_REPLY" : "DM"
    
    await processAutomationTriggers({
      conversationId: conversation.id,
      messageContent: message.text,
      senderId: senderId,
      senderUsername: messagingEvent.sender.username || "unknown",
      senderName: messagingEvent.sender.username || "Unknown",
      messageType,
      isFirstMessage,
      instagramAccountId: instagramAccount.id,
      webhookPageId: webhookPageId,
      accessToken: instagramAccount.accessToken,
    })
    
  } catch (error) {
    console.error("[Instagram Webhook] ❌ Error processing message:", error)
  }
}

// Handle comments and mentions
async function processChangeEvent(change: any, webhookPageId: string) {
  try {
    const { field, value } = change
    
    console.log("[Instagram Webhook] 🔄 Processing change:", field)
    
    if (field === "comments") {
      await processComment(value, webhookPageId)
    } else if (field === "mentions") {
      await processMention(value, webhookPageId)
    }
  } catch (error) {
    console.error("[Instagram Webhook] ❌ Error processing change:", error)
  }
}

async function processComment(value: any, webhookPageId: string) {
  try {
    const { id: commentId, text, from, media } = value
    
    if (!from || !text) {
      console.log("[Instagram Webhook] ⚠️ Comment missing data")
      return
    }
    
    // Find account by webhook Page ID
    const instagramAccount = await prisma.instagramAccount.findFirst({
      where: {
        OR: [
          { instagramPageId: webhookPageId },
          { instagramId: webhookPageId },
        ]
      },
      include: { user: true }
    })
    
    if (!instagramAccount) {
      console.log("[Instagram Webhook] ⚠️ No account for comment")
      return
    }
    
    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        instagramAccountId: instagramAccount.id,
        participantId: from.id,
      },
    })
    
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          instagramAccountId: instagramAccount.id,
          userId: instagramAccount.userId,
          participantId: from.id,
          participantName: from.username || "Unknown",
          participantUsername: from.username || "unknown",
          participantAvatar: null,
          lastMessageText: `Commented: ${text}`,
          lastMessageAt: new Date(),
          unreadCount: 0,
        },
      })
    }
    
    // Detect if comment contains mentions
    const hasMention = /@\w+/.test(text)
    const mentionMatches = text.match(/@(\w+)/g) || []
    const mentionedUsernames = mentionMatches.map((m: string) => m.substring(1))
    
    console.log("[Instagram Webhook] 💬 Comment details:", {
      text,
      hasMention,
      mentionedUsernames,
      commentId
    })
    
    // Determine message type based on whether it has mentions
    const messageType = hasMention ? "COMMENT_MENTION" : "COMMENT"
    
    await processAutomationTriggers({
      conversationId: conversation.id,
      messageContent: text,
      senderId: from.id,
      senderUsername: from.username || "unknown",
      senderName: from.username || "Unknown",
      messageType: messageType as any,
      isFirstMessage: false,
      instagramAccountId: instagramAccount.id,
      webhookPageId: webhookPageId,
      accessToken: instagramAccount.accessToken,
      triggerData: { 
        commentId, 
        mediaId: media?.id,
        hasMention,
        mentionedUsernames 
      }
    })
    
  } catch (error) {
    console.error("[Instagram Webhook] ❌ Error processing comment:", error)
  }
}

async function processMention(value: any, webhookPageId: string) {
  try {
    const { comment_id, media_id, from } = value
    
    if (!from) return
    
    const instagramAccount = await prisma.instagramAccount.findFirst({
      where: {
        OR: [
          { instagramPageId: webhookPageId },
          { instagramId: webhookPageId },
        ]
      },
      include: { user: true }
    })
    
    if (!instagramAccount) return
    
    let conversation = await prisma.conversation.findFirst({
      where: {
        instagramAccountId: instagramAccount.id,
        participantId: from.id,
      },
    })
    
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          instagramAccountId: instagramAccount.id,
          userId: instagramAccount.userId,
          participantId: from.id,
          participantName: from.username || "Unknown",
          participantUsername: from.username || "unknown",
          participantAvatar: null,
          lastMessageText: "Mentioned you",
          lastMessageAt: new Date(),
          unreadCount: 0,
        },
      })
    }
    
    await processAutomationTriggers({
      conversationId: conversation.id,
      messageContent: "",
      senderId: from.id,
      senderUsername: from.username || "unknown",
      senderName: from.username || "Unknown",
      messageType: "MENTION",
      isFirstMessage: false,
      instagramAccountId: instagramAccount.id,
      webhookPageId: webhookPageId,
      accessToken: instagramAccount.accessToken,
      triggerData: { commentId: comment_id, mediaId: media_id }
    })
    
  } catch (error) {
    console.error("[Instagram Webhook] ❌ Error processing mention:", error)
  }
}

// Trigger context interface
interface TriggerContext {
  conversationId: string
  messageContent?: string
  senderId: string
  senderUsername: string
  senderName: string
  messageType: "DM" | "COMMENT" | "COMMENT_MENTION" | "STORY_REPLY" | "MENTION"
  isFirstMessage: boolean
  instagramAccountId: string
  webhookPageId: string
  accessToken: string
  triggerData?: any
}

// Process automation triggers
async function processAutomationTriggers(context: TriggerContext) {
  console.log("[Automation] 🔍 Checking triggers:", {
    messageType: context.messageType,
    isFirstMessage: context.isFirstMessage,
    hasMention: context.triggerData?.hasMention,
  })
  
  const conversation = await prisma.conversation.findUnique({
    where: { id: context.conversationId },
    include: { 
      user: true,
      instagramAccount: true,
      conversationTags: { include: { tag: true } }
    },
  })
  
  if (!conversation) return
  
  const automations = await prisma.automation.findMany({
    where: {
      userId: conversation.userId,
      instagramAccountId: context.instagramAccountId,
      isActive: true,
    },
    include: {
      triggers: true,
      actions: { orderBy: { order: "asc" } },
      instagramAccount: true,
    },
  })
  
  console.log("[Automation] Found automations:", automations.length)
  
  for (const automation of automations) {
    const shouldExecute = checkAutomationTriggers(automation, context)
    
    if (shouldExecute) {
      console.log(`[Automation] ✅ Triggering: ${automation.name}`)
      
      const execution = await prisma.automationExecution.create({
        data: {
          automationId: automation.id,
          conversationId: context.conversationId,
          status: "pending",
          triggeredBy: `${context.messageType}_${context.senderId}`,
        }
      })
      
      await executeAutomation(automation, context, conversation, execution.id)
      break
    }
  }
}

function checkAutomationTriggers(automation: any, context: TriggerContext): boolean {
  const { messageContent = "", messageType, isFirstMessage } = context
  
  if (!automation.triggers || automation.triggers.length === 0) {
    console.log("[Automation] ❌ No triggers found for:", automation.name)
    return false
  }
  
  console.log("[Automation] 📋 Checking triggers for:", automation.name, {
    triggerCount: automation.triggers.length,
    messageType,
    hasContent: !!messageContent
  })
  
  const triggerResults = automation.triggers.map((trigger: any) => {
    const conditions = trigger.conditions || {}
    
    console.log("[Automation] 🔍 Evaluating trigger:", {
      automationName: automation.name,
      type: trigger.type,
      conditions,
      messageType
    })
    
    let matches = false
    
    switch (trigger.type) {
      case "DM_RECEIVED":
      case "new_message":
        matches = messageType === "DM"
        break
        
      case "FIRST_MESSAGE":
        matches = isFirstMessage && messageType === "DM"
        break
        
      case "KEYWORD":
      case "keyword":
        if (messageType !== "DM" && messageType !== "COMMENT" && messageType !== "COMMENT_MENTION") {
          matches = false
          break
        }
        
        const keywords = conditions.keywords || []
        const matchType = conditions.matchType || "contains"
        
        console.log("[Automation] 🔑 Keyword check:", {
          keywords,
          matchType,
          messageContent
        })
        
        if (matchType === "contains" || matchType === "any") {
          matches = keywords.some((keyword: string) => 
            messageContent.toLowerCase().includes(keyword.toLowerCase())
          )
        } else if (matchType === "exact" || matchType === "all") {
          matches = keywords.every((keyword: string) => 
            messageContent.toLowerCase().includes(keyword.toLowerCase())
          )
        } else if (matchType === "starts_with") {
          matches = keywords.some((keyword: string) => 
            messageContent.toLowerCase().startsWith(keyword.toLowerCase())
          )
        }
        break
        
      case "STORY_REPLY":
        matches = messageType === "STORY_REPLY"
        break
        
      case "COMMENT":
      case "COMMENT_RECEIVED":
        // Match both regular comments AND comment mentions
        matches = messageType === "COMMENT" || messageType === "COMMENT_MENTION"
        
        // If conditions require a mention, check for it
        if (matches && conditions.requireMention) {
          matches = context.triggerData?.hasMention || false
        }
        
        // If specific username must be mentioned
        if (matches && conditions.mentionUsername) {
          const mentionedUsernames = context.triggerData?.mentionedUsernames || []
          matches = mentionedUsernames.includes(conditions.mentionUsername)
        }
        break
        
      case "COMMENT_MENTION":
        // Only trigger on comments with mentions
        matches = messageType === "COMMENT_MENTION"
        
        // If specific username must be mentioned
        if (matches && conditions.mentionUsername) {
          const mentionedUsernames = context.triggerData?.mentionedUsernames || []
          matches = mentionedUsernames.includes(conditions.mentionUsername)
        }
        break
        
      case "mention":
      case "MENTION":
      case "MENTION_RECEIVED":
        // Handle both comment mentions and story/feed mentions
        matches = messageType === "MENTION" || messageType === "COMMENT_MENTION"
        
        // If specific username must be mentioned
        if (matches && conditions.mentionUsername) {
          const mentionedUsernames = context.triggerData?.mentionedUsernames || []
          matches = mentionedUsernames.includes(conditions.mentionUsername)
        }
        break
        
      default:
        console.log("[Automation] ⚠️ Unknown trigger type:", trigger.type)
        matches = false
    }
    
    console.log("[Automation] 📊 Trigger result:", {
      automationName: automation.name,
      triggerType: trigger.type,
      matches
    })
    
    return matches
  })
  
  const shouldExecute = triggerResults.some((result: any) => result)
  
  console.log("[Automation] 🎯 Final decision for", automation.name, ":", {
    shouldExecute,
    matchedTriggers: triggerResults.filter((r: any) => r).length,
    totalTriggers: triggerResults.length
  })
  
  return shouldExecute
}

async function executeAutomation(
  automation: any, 
  context: TriggerContext, 
  conversation: any,
  executionId: string
) {
  try {
    console.log("[Automation] 🚀 Executing:", automation.name)
    
    // Use webhookPageId for API calls
    const instagramAPI = new InstagramAPI({
      accessToken: context.accessToken,
      instagramId: context.webhookPageId,
    })
    
    const executor = new AutomationExecutor(instagramAPI)
    
    const executionContext = {
      userId: conversation.userId,
      senderId: context.senderId,
      messageText: context.messageContent,
      triggerData: {
        participantName: conversation.participantName,
        participantUsername: conversation.participantUsername,
        username: context.senderUsername,
        name: context.senderName,
        ...context.triggerData,
      },
      conversationHistory: [],
      userTags: conversation.conversationTags.map((ct: any) => ct.tag.name),
    }
    
    for (const action of automation.actions) {
      try {
        const actionData = action.content || {}
        
        if (action.type === "DELAY" || action.type === "delay") {
          const delayMs = calculateDelay(actionData)
          
          if (delayMs > 60000) {
            const remainingActions = automation.actions.slice(
              automation.actions.indexOf(action) + 1
            )
            
            for (const futureAction of remainingActions) {
              if (futureAction.type === "SEND_MESSAGE") {
                await enqueueMessage({
                  conversationId: context.conversationId,
                  messageContent: futureAction.content?.message || "",
                  recipientId: context.senderId,
                  scheduledFor: new Date(Date.now() + delayMs),
                  metadata: { automationId: automation.id, actionId: futureAction.id }
                })
              }
            }
            break
          } else {
            await new Promise(resolve => setTimeout(resolve, delayMs))
          }
        } else {
          await executor.executeAction(action.type, actionData, executionContext)
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        
      } catch (error) {
        console.error(`[Automation] ❌ Action failed:`, error)
      }
    }
    
    await prisma.automationExecution.update({
      where: { id: executionId },
      data: { status: "success", completedAt: new Date() }
    })
    
    console.log(`[Automation] ✅ Completed: ${automation.name}`)
    
  } catch (error) {
    console.error("[Automation] ❌ Error:", error)
    await prisma.automationExecution.update({
      where: { id: executionId },
      data: {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      }
    })
  }
}

function calculateDelay(actionData: any): number {
  const days = actionData.delayDays || 0
  const hours = actionData.delayHours || 0
  const minutes = actionData.delayMinutes || 0
  return (days * 24 * 60 + hours * 60 + minutes) * 60 * 1000
}