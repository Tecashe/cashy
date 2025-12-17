// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/db"
// import { processAutomationTriggers } from "@/lib/automation-engine"

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
//   const mode = searchParams.get("hub.mode")
//   const token = searchParams.get("hub.verify_token")
//   const challenge = searchParams.get("hub.challenge")

//   // Verify the webhook subscription
//   if (mode === "subscribe" && token === process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
//     console.log("[v0] Instagram webhook verified")
//     return new NextResponse(challenge, { status: 200 })
//   }

//   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
// }

// // Instagram webhook handler for incoming messages
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()

//     console.log("[v0] Instagram webhook received:", JSON.stringify(body, null, 2))

//     for (const entry of body.entry || []) {
//       for (const change of entry.changes || []) {
//         const { field, value } = change

//         if (field === "messages") {
//           const message = value.messages?.[0]
//           const senderId = value.sender?.id

//           if (message && senderId) {
//             await processIncomingMessage(message, senderId)
//           }
//         }

//         if (field === "comments") {
//           const comment = value
//           await processComment(comment)
//         }

//         if (field === "story_insights") {
//           const reply = value
//           await processStoryReply(reply)
//         }
//       }
//     }

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("[v0] Error processing webhook:", error)
//     return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
//   }
// }

// // Process incoming message and check automation triggers
// async function processIncomingMessage(message: any, senderId: string) {
//   try {
//     // Find Instagram account by sender ID
//     const instagramAccount = await prisma.instagramAccount.findFirst({
//       where: { instagramId: senderId },
//     })

//     if (!instagramAccount) {
//       console.log("[v0] Instagram account not found for sender:", senderId)
//       return
//     }

//     // Find or create conversation
//     let conversation = await prisma.conversation.findFirst({
//       where: {
//         instagramAccountId: instagramAccount.id,
//         participantId: message.from.id,
//       },
//     })

//     const isFirstMessage = !conversation

//     if (!conversation) {
//       conversation = await prisma.conversation.create({
//         data: {
//           instagramAccountId: instagramAccount.id,
//           userId: instagramAccount.userId,
//           participantId: message.from.id,
//           participantName: message.from.username || "Unknown",
//           participantUsername: message.from.username || "unknown",
//           participantAvatar: null,
//           lastMessageText: message.text,
//           lastMessageAt: new Date(message.timestamp),
//           unreadCount: 1,
//         },
//       })
//     } else {
//       // Update existing conversation
//       await prisma.conversation.update({
//         where: { id: conversation.id },
//         data: {
//           lastMessageText: message.text,
//           lastMessageAt: new Date(message.timestamp),
//           unreadCount: { increment: 1 },
//         },
//       })
//     }

//     // Save message to database
//     await prisma.message.create({
//       data: {
//         conversationId: conversation.id,
//         content: message.text,
//         sender: "participant",
//         isRead: false,
//         messageType: "text",
//       },
//     })

//     // Trigger automation engine
//     await processAutomationTriggers({
//       messageContent: message.text,
//       senderId: message.from.id,
//       conversationId: conversation.id,
//       messageType: "DM",
//       isFirstMessage,
//     })
//   } catch (error) {
//     console.error("[v0] Error processing incoming message:", error)
//   }
// }

// async function processComment(comment: any) {
//   try {
//     const { id: commentId, text, from, media } = comment

//     // Find Instagram account that owns this media
//     const instagramAccount = await prisma.instagramAccount.findFirst({
//       where: { instagramId: media?.id },
//     })

//     if (!instagramAccount) {
//       console.log("[v0] Instagram account not found for media:", media?.id)
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

//     // Check for automations triggered by comments
//     await processAutomationTriggers({
//       messageContent: text,
//       senderId: from.id,
//       conversationId: conversation.id,
//       messageType: "COMMENT",
//       isFirstMessage: false,
//     })

//     console.log("[v0] Comment processed successfully")
//   } catch (error) {
//     console.error("[v0] Error processing comment:", error)
//   }
// }

// async function processStoryReply(reply: any) {
//   try {
//     const { id: replyId, text, from } = reply

//     const instagramAccount = await prisma.instagramAccount.findFirst({
//       where: { instagramId: from.id },
//     })

//     if (!instagramAccount) {
//       console.log("[v0] Instagram account not found for story reply")
//       return
//     }

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
//           lastMessageText: `Story reply: ${text}`,
//           lastMessageAt: new Date(),
//           unreadCount: 1,
//         },
//       })
//     }

//     await prisma.message.create({
//       data: {
//         conversationId: conversation.id,
//         content: text,
//         sender: "participant",
//         isRead: false,
//         messageType: "story_reply",
//       },
//     })

//     await processAutomationTriggers({
//       messageContent: text,
//       senderId: from.id,
//       conversationId: conversation.id,
//       messageType: "STORY_REPLY",
//       isFirstMessage: false,
//     })

//     console.log("[v0] Story reply processed successfully")
//   } catch (error) {
//     console.error("[v0] Error processing story reply:", error)
//   }
// }

// app/api/webhooks/instagram/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { InstagramAPI } from "@/lib/instagram-api"
import { AutomationExecutor } from "@/lib/automation-executor"
import { enqueueMessage } from "@/lib/automation-queue"

// Webhook verification (GET request from Meta)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")
  
  const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN
  
  if (mode === "subscribe" && token === verifyToken) {
    console.log("[Instagram Webhook] Verified successfully")
    return new NextResponse(challenge, { status: 200 })
  }
  
  console.error("[Instagram Webhook] Verification failed")
  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

// Webhook events (POST request from Meta)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log("[Instagram Webhook] Received:", JSON.stringify(body, null, 2))
    
    // Process webhook based on object type
    if (body.object === "instagram") {
      for (const entry of body.entry || []) {
        // Handle messaging events (DMs, story replies)
        if (entry.messaging) {
          for (const messagingEvent of entry.messaging) {
            await processMessagingEvent(messagingEvent, entry)
          }
        }
        
        // Handle changes (comments, mentions)
        if (entry.changes) {
          for (const change of entry.changes) {
            await processChangeEvent(change, entry)
          }
        }
      }
    }
    
    // Always return 200 to acknowledge receipt
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[Instagram Webhook] Error:", error)
    // Still return 200 to prevent Meta from retrying
    return NextResponse.json({ success: true }, { status: 200 })
  }
}

async function processMessagingEvent(messagingEvent: any, entry: any) {
  try {
    const senderId = messagingEvent.sender?.id
    const recipientId = messagingEvent.recipient?.id
    const message = messagingEvent.message
    
    if (!senderId || !recipientId || !message) return
    
    // Find the Instagram account that received this message
    const instagramAccount = await prisma.instagramAccount.findFirst({
      where: { instagramId: recipientId },
      include: { user: true }
    })
    
    if (!instagramAccount) {
      console.log("[Instagram Webhook] Account not found for recipient:", recipientId)
      return
    }
    
    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        instagramAccountId: instagramAccount.id,
        participantId: senderId,
      },
    })
    
    const isFirstMessage = !conversation
    
    if (!conversation) {
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
    
    // Save message to database
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: message.text || "[Media]",
        sender: "participant",
        isRead: false,
        messageType: message.is_story_reply ? "story_reply" : "text",
      },
    })
    
    // Determine message type
    const messageType = message.is_story_reply ? "STORY_REPLY" : "DM"
    
    // Process automation triggers
    await processAutomationTriggers({
      conversationId: conversation.id,
      messageContent: message.text,
      senderId: senderId,
      senderUsername: messagingEvent.sender.username || "unknown",
      senderName: messagingEvent.sender.username || "Unknown",
      messageType,
      isFirstMessage,
      instagramAccountId: instagramAccount.id,
    })
    
  } catch (error) {
    console.error("[Instagram Webhook] Error processing messaging event:", error)
  }
}

async function processChangeEvent(change: any, entry: any) {
  try {
    const { field, value } = change
    
    if (field === "comments") {
      await processComment(value, entry)
    } else if (field === "mentions") {
      await processMention(value, entry)
    }
  } catch (error) {
    console.error("[Instagram Webhook] Error processing change event:", error)
  }
}

async function processComment(value: any, entry: any) {
  try {
    const { id: commentId, text, from, media } = value
    
    if (!from || !text) return
    
    // Find Instagram account by media owner or from webhook entry
    const instagramAccount = await prisma.instagramAccount.findFirst({
      where: { instagramId: entry.id },
      include: { user: true }
    })
    
    if (!instagramAccount) {
      console.log("[Instagram Webhook] Account not found for comment")
      return
    }
    
    // Find or create conversation with commenter
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
    
    // Process automation triggers for comments
    await processAutomationTriggers({
      conversationId: conversation.id,
      messageContent: text,
      senderId: from.id,
      senderUsername: from.username || "unknown",
      senderName: from.username || "Unknown",
      messageType: "COMMENT",
      isFirstMessage: false,
      instagramAccountId: instagramAccount.id,
      triggerData: {
        commentId,
        mediaId: media?.id,
      }
    })
    
  } catch (error) {
    console.error("[Instagram Webhook] Error processing comment:", error)
  }
}

async function processMention(value: any, entry: any) {
  try {
    const { comment_id, media_id, from } = value
    
    if (!from) return
    
    // Find Instagram account
    const instagramAccount = await prisma.instagramAccount.findFirst({
      where: { instagramId: entry.id },
      include: { user: true }
    })
    
    if (!instagramAccount) {
      console.log("[Instagram Webhook] Account not found for mention")
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
          lastMessageText: "Mentioned you",
          lastMessageAt: new Date(),
          unreadCount: 0,
        },
      })
    }
    
    // Process automation triggers for mentions
    await processAutomationTriggers({
      conversationId: conversation.id,
      messageContent: "",
      senderId: from.id,
      senderUsername: from.username || "unknown",
      senderName: from.username || "Unknown",
      messageType: "MENTION",
      isFirstMessage: false,
      instagramAccountId: instagramAccount.id,
      triggerData: {
        commentId: comment_id,
        mediaId: media_id,
      }
    })
    
  } catch (error) {
    console.error("[Instagram Webhook] Error processing mention:", error)
  }
}

interface TriggerContext {
  conversationId: string
  messageContent?: string
  senderId: string
  senderUsername: string
  senderName: string
  messageType: "DM" | "COMMENT" | "STORY_REPLY" | "MENTION"
  isFirstMessage: boolean
  instagramAccountId: string
  triggerData?: any
}

async function processAutomationTriggers(context: TriggerContext) {
  const { conversationId, messageContent, senderId, messageType, isFirstMessage, instagramAccountId } = context
  
  // Get conversation with related data
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { 
      user: true,
      instagramAccount: true,
      conversationTags: {
        include: { tag: true }
      }
    },
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
      instagramAccount: true,
    },
  })
  
  // Check each automation for matching triggers
  for (const automation of automations) {
    const shouldExecute = checkAutomationTriggers(automation, context)
    
    if (shouldExecute) {
      console.log(`[Automation] Triggering automation: ${automation.name}`)
      
      // Create execution record
      const execution = await prisma.automationExecution.create({
        data: {
          automationId: automation.id,
          conversationId: conversationId,
          status: "pending",
          triggeredBy: `${messageType}_${senderId}`,
        }
      })
      
      await executeAutomation(automation, context, conversation, execution.id)
      
      // Only execute first matching automation (can be changed if needed)
      break
    }
  }
}

function checkAutomationTriggers(automation: any, context: TriggerContext): boolean {
  const { messageContent = "", messageType, isFirstMessage } = context
  
  // If no triggers, don't execute
  if (!automation.triggers || automation.triggers.length === 0) {
    return false
  }
  
  const triggerResults = automation.triggers.map((trigger: any) => {
    const conditions = trigger.conditions || {}
    
    switch (trigger.type) {
      case "DM_RECEIVED":
      case "new_message":
        return messageType === "DM"
        
      case "FIRST_MESSAGE":
        return isFirstMessage && messageType === "DM"
        
      case "KEYWORD":
      case "keyword":
        if (messageType !== "DM" && messageType !== "COMMENT") return false
        const keywords = conditions.keywords || []
        const matchType = conditions.matchType || "contains"
        
        if (matchType === "contains" || matchType === "any") {
          return keywords.some((keyword: string) => 
            messageContent.toLowerCase().includes(keyword.toLowerCase())
          )
        } else if (matchType === "exact" || matchType === "all") {
          return keywords.every((keyword: string) => 
            messageContent.toLowerCase().includes(keyword.toLowerCase())
          )
        } else if (matchType === "starts_with") {
          return keywords.some((keyword: string) => 
            messageContent.toLowerCase().startsWith(keyword.toLowerCase())
          )
        }
        return false
        
      case "STORY_REPLY":
      case "story_reply":
        return messageType === "STORY_REPLY"
        
      case "COMMENT":
      case "COMMENT_RECEIVED":
      case "comment":
        return messageType === "COMMENT"
        
      case "MENTION":
      case "MENTION_RECEIVED":
      case "mention":
        return messageType === "MENTION"
        
      default:
        return false
    }
  })
  
  // Default to OR logic if not specified
  return triggerResults.some((result: any) => result)
}

async function executeAutomation(
  automation: any, 
  context: TriggerContext, 
  conversation: any,
  executionId: string
) {
  try {
    // Initialize Instagram API
    const instagramAPI = new InstagramAPI({
      accessToken: conversation.instagramAccount.accessToken,
      instagramId: conversation.instagramAccount.instagramId,
    })
    
    const executor = new AutomationExecutor(instagramAPI)
    
    // Build execution context
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
    
    // Execute each action in sequence
    for (const action of automation.actions) {
      try {
        const actionData = action.content || {}
        
        // Handle delays
        if (action.type === "DELAY" || action.type === "delay") {
          const delayMs = calculateDelay(actionData)
          
          // For longer delays, use message queue
          if (delayMs > 60000) { // More than 1 minute
            const remainingActions = automation.actions.slice(
              automation.actions.indexOf(action) + 1
            )
            
            if (remainingActions.length > 0) {
              // Queue remaining actions
              for (const futureAction of remainingActions) {
                if (futureAction.type === "SEND_MESSAGE" || futureAction.type === "send_message") {
                  await enqueueMessage({
                    conversationId: context.conversationId,
                    messageContent: futureAction.content?.message || "",
                    recipientId: context.senderId,
                    scheduledFor: new Date(Date.now() + delayMs),
                    metadata: { automationId: automation.id, actionId: futureAction.id }
                  })
                }
              }
            }
            break // Stop processing after scheduling
          } else {
            // For short delays, just wait
            await new Promise(resolve => setTimeout(resolve, delayMs))
          }
        } else {
          // Execute the action
          await executor.executeAction(action.type, actionData, executionContext)
          
          // Small delay between actions to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        
      } catch (error) {
        console.error(`[Automation] Error executing action ${action.type}:`, error)
        // Continue with next action
      }
    }
    
    // Update execution record
    await prisma.automationExecution.update({
      where: { id: executionId },
      data: {
        status: "success",
        completedAt: new Date(),
      }
    })
    
    console.log(`[Automation] Completed automation: ${automation.name}`)
    
  } catch (error) {
    console.error("[Automation] Error executing automation:", error)
    
    // Update execution record with error
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