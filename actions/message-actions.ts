// "use server"

// import { prisma } from "@/lib/db"
// import { InstagramAPI } from "@/lib/instagram-api"
// import { revalidatePath } from "next/cache"

// type MessageType = "text" | "image" | "video" | "audio" | "carousel"

// interface SendMessageParams {
//   conversationId: string
//   content: string
//   messageType?: MessageType
//   attachmentUrl?: string
//   attachmentMetadata?: Record<string, any>
// }

// export async function sendMessageToInstagram(params: SendMessageParams) {
//   try {
//     const { conversationId, content, messageType = "text", attachmentUrl, attachmentMetadata } = params

//     // Get conversation details
//     const conversation = await prisma.conversation.findUnique({
//       where: { id: conversationId },
//       include: {
//         instagramAccount: true,
//       },
//     })

//     if (!conversation) {
//       return { success: false, error: "Conversation not found" }
//     }

//     // Initialize Instagram API
//     const igAPI = new InstagramAPI({
//       accessToken: conversation.instagramAccount.accessToken,
//       instagramId: conversation.instagramAccount.instagramId,
//       pageId: conversation.instagramAccount.instagramPageId || undefined,
//     })

//     // Send the message via Instagram API based on type
//     let igResponse
//     try {
//       switch (messageType) {
//         case "text":
//           igResponse = await igAPI.sendTextMessage(conversation.participantId, content)
//           break
//         case "image":
//           if (!attachmentUrl) {
//             return { success: false, error: "Image URL is required for image messages" }
//           }
//           igResponse = await igAPI.sendImageMessage(conversation.participantId, attachmentUrl)
//           break
//         case "video":
//           if (!attachmentUrl) {
//             return { success: false, error: "Video URL is required for video messages" }
//           }
//           igResponse = await igAPI.sendVideoMessage(conversation.participantId, attachmentUrl)
//           break
//         case "audio":
//           if (!attachmentUrl) {
//             return { success: false, error: "Audio URL is required for audio messages" }
//           }
//           igResponse = await igAPI.sendAudioMessage(conversation.participantId, attachmentUrl)
//           break
//         case "carousel":
//           if (!attachmentMetadata?.elements) {
//             return { success: false, error: "Carousel elements are required" }
//           }
//           igResponse = await igAPI.sendGenericTemplate(conversation.participantId, attachmentMetadata.elements)
//           break
//         default:
//           return { success: false, error: `Unsupported message type: ${messageType}` }
//       }
//     } catch (igError: any) {
//       console.error("[v0] Instagram API error:", igError)
//       return { success: false, error: igError.message || "Failed to send message via Instagram" }
//     }

//     // Save message to database
//     const message = await prisma.message.create({
//       data: {
//         conversationId,
//         content,
//         sender: "business",
//         isFromUser: false,
//         timestamp: new Date(),
//         messageType,
//         attachmentUrl,
//         attachmentMetadata: attachmentMetadata,
//       },
//     })

//     // Update conversation
//     await prisma.conversation.update({
//       where: { id: conversationId },
//       data: {
//         lastMessageAt: new Date(),
//         lastMessageText: messageType === "text" ? content : `Sent ${messageType}`,
//         status: "awaiting_response",
//       },
//     })

//     revalidatePath(`/inbox/${conversationId}`)
//     revalidatePath("/inbox")

//     return { success: true, message, igResponse }
//   } catch (error) {
//     console.error("[v0] Error in sendMessageToInstagram:", error)
//     return { success: false, error: "Failed to send message" }
//   }
// }

// export async function uploadMessageAttachment(file: FormData, type: "image" | "video" | "audio") {
//   try {
//     // Upload to Vercel Blob
//     const fileData = file.get("file") as File
//     if (!fileData) {
//       return { success: false, error: "No file provided" }
//     }

//     // Check file size (Instagram limits)
//     const maxSizes = {
//       image: 8 * 1024 * 1024, // 8MB
//       video: 25 * 1024 * 1024, // 25MB
//       audio: 25 * 1024 * 1024, // 25MB
//     }

//     if (fileData.size > maxSizes[type]) {
//       return { success: false, error: `File size exceeds ${maxSizes[type] / (1024 * 1024)}MB limit` }
//     }

//     // Upload to Vercel Blob (you need @vercel/blob package)
//     const { put } = await import("@vercel/blob")
//     const blob = await put(fileData.name, fileData, {
//       access: "public",
//     })

//     return { success: true, url: blob.url }
//   } catch (error) {
//     console.error("[v0] Error uploading attachment:", error)
//     return { success: false, error: "Failed to upload file" }
//   }
// }

// "use server"

// import { prisma } from "@/lib/db"
// import { InstagramAPI } from "@/lib/instagram-api"
// import { revalidatePath } from "next/cache"

// type MessageType = "text" | "image" | "video" | "audio" | "carousel"

// interface SendMessageParams {
//   conversationId: string
//   content: string
//   messageType?: MessageType
//   attachmentUrl?: string
//   attachmentMetadata?: Record<string, any>
// }

// export async function sendMessageToInstagram(params: SendMessageParams) {
//   try {
//     const { conversationId, content, messageType = "text", attachmentUrl, attachmentMetadata } = params

//     // Get conversation details
//     const conversation = await prisma.conversation.findUnique({
//       where: { id: conversationId },
//       include: {
//         instagramAccount: true,
//       },
//     })

//     if (!conversation) {
//       return { success: false, error: "Conversation not found" }
//     }

//     if (conversation.lastCustomerMessageAt) {
//       const hoursSinceLastCustomerMessage =
//         (Date.now() - conversation.lastCustomerMessageAt.getTime()) / (1000 * 60 * 60)

//       if (hoursSinceLastCustomerMessage > 24) {
//         return {
//           success: false,
//           error:
//             "Cannot send message. You can only reply within 24 hours of the customer's last message. The customer needs to send you a message first.",
//           code: "MESSAGING_WINDOW_EXCEEDED",
//         }
//       }
//     } else {
//       // No customer message yet, cannot initiate conversation
//       return {
//         success: false,
//         error: "Cannot send message. The customer must initiate the conversation first.",
//         code: "NO_CUSTOMER_MESSAGE",
//       }
//     }

//     // Initialize Instagram API
//     const igAPI = new InstagramAPI({
//       accessToken: conversation.instagramAccount.accessToken,
//       instagramId: conversation.instagramAccount.instagramId,
//       pageId: conversation.instagramAccount.instagramPageId || undefined,
//     })

//     const rateLimitInfo = igAPI.getRateLimitInfo()
//     if (rateLimitInfo && rateLimitInfo.remaining < 10) {
//       return {
//         success: false,
//         error: `Rate limit nearly exceeded. Only ${rateLimitInfo.remaining}% of your hourly limit remains. Please wait before sending more messages.`,
//         code: "RATE_LIMIT_WARNING",
//       }
//     }

//     // Send the message via Instagram API based on type
//     let igResponse
//     try {
//       switch (messageType) {
//         case "text":
//           igResponse = await igAPI.sendTextMessage(conversation.participantId, content)
//           break
//         case "image":
//           if (!attachmentUrl) {
//             return { success: false, error: "Image URL is required for image messages" }
//           }
//           igResponse = await igAPI.sendImageMessage(conversation.participantId, attachmentUrl)
//           break
//         case "video":
//           if (!attachmentUrl) {
//             return { success: false, error: "Video URL is required for video messages" }
//           }
//           igResponse = await igAPI.sendVideoMessage(conversation.participantId, attachmentUrl)
//           break
//         case "audio":
//           if (!attachmentUrl) {
//             return { success: false, error: "Audio URL is required for audio messages" }
//           }
//           igResponse = await igAPI.sendAudioMessage(conversation.participantId, attachmentUrl)
//           break
//         case "carousel":
//           if (!attachmentMetadata?.elements) {
//             return { success: false, error: "Carousel elements are required" }
//           }
//           igResponse = await igAPI.sendGenericTemplate(conversation.participantId, attachmentMetadata.elements)
//           break
//         default:
//           return { success: false, error: `Unsupported message type: ${messageType}` }
//       }
//     } catch (igError: any) {
//       console.error("[v0] Instagram API error:", igError)
//       return { success: false, error: igError.message || "Failed to send message via Instagram" }
//     }

//     // Save message to database
//     const message = await prisma.message.create({
//       data: {
//         conversationId,
//         content,
//         sender: "business",
//         isFromUser: false,
//         timestamp: new Date(),
//         messageType,
//         attachmentUrl,
//         attachmentMetadata: attachmentMetadata,
//       },
//     })

//     // Update conversation
//     await prisma.conversation.update({
//       where: { id: conversationId },
//       data: {
//         lastMessageAt: new Date(),
//         lastMessageText: messageType === "text" ? content : `Sent ${messageType}`,
//         status: "awaiting_response",
//       },
//     })

//     revalidatePath(`/inbox/${conversationId}`)
//     revalidatePath("/inbox")

//     return { success: true, message, igResponse }
//   } catch (error) {
//     console.error("[v0] Error in sendMessageToInstagram:", error)
//     return { success: false, error: "Failed to send message" }
//   }
// }

// export async function uploadMessageAttachment(file: FormData, type: "image" | "video" | "audio") {
//   try {
//     // Upload to Vercel Blob
//     const fileData = file.get("file") as File
//     if (!fileData) {
//       return { success: false, error: "No file provided" }
//     }

//     // Check file size (Instagram limits)
//     const maxSizes = {
//       image: 8 * 1024 * 1024, // 8MB
//       video: 25 * 1024 * 1024, // 25MB
//       audio: 25 * 1024 * 1024, // 25MB
//     }

//     if (fileData.size > maxSizes[type]) {
//       return { success: false, error: `File size exceeds ${maxSizes[type] / (1024 * 1024)}MB limit` }
//     }

//     // Upload to Vercel Blob (you need @vercel/blob package)
//     const { put } = await import("@vercel/blob")
//     const blob = await put(fileData.name, fileData, {
//       access: "public",
//     })

//     return { success: true, url: blob.url }
//   } catch (error) {
//     console.error("[v0] Error uploading attachment:", error)
//     return { success: false, error: "Failed to upload file" }
//   }
// }


// "use server"

// import { prisma } from "@/lib/db"
// import { InstagramAPI } from "@/lib/instagram-api"
// import { revalidatePath } from "next/cache"

// type MessageType = "text" | "image" | "video" | "audio" | "carousel"

// interface SendMessageParams {
//   conversationId: string
//   content: string
//   messageType?: MessageType
//   attachmentUrl?: string
//   attachmentMetadata?: Record<string, any>
// }

// export async function sendMessageToInstagram(params: SendMessageParams) {
//   try {
//     const { conversationId, content, messageType = "text", attachmentUrl, attachmentMetadata } = params

//     console.log("[v0] Sending message to Instagram:", { conversationId, messageType, contentLength: content.length })

//     const conversation = await prisma.conversation.findUnique({
//       where: { id: conversationId },
//       include: {
//         instagramAccount: true,
//       },
//     })

//     if (!conversation) {
//       return { success: false, error: "Conversation not found" }
//     }

//     console.log("[v0] Conversation participant:", {
//       participantId: conversation.participantId,
//       participantName: conversation.participantName,
//       participantUsername: conversation.participantUsername,
//       businessAccountId: conversation.instagramAccount.instagramId,
//       businessUsername: conversation.instagramAccount.username,
//     })

//     if (conversation.participantId === conversation.instagramAccount.instagramId) {
//       console.error("[v0] ERROR: Participant is the business account, not the customer!")
//       return {
//         success: false,
//         error:
//           "Invalid conversation data: The participant is set to your business account instead of the customer. Click 'Fix Wrong Customer Data' button to resolve this.",
//         code: "INVALID_PARTICIPANT",
//       }
//     }

//     if (conversation.lastCustomerMessageAt) {
//       const hoursSinceLastCustomerMessage =
//         (Date.now() - conversation.lastCustomerMessageAt.getTime()) / (1000 * 60 * 60)

//       console.log("[v0] Hours since last customer message:", hoursSinceLastCustomerMessage)

//       if (hoursSinceLastCustomerMessage > 24) {
//         console.warn("[v0] WARNING: Outside 24-hour messaging window")
//         return {
//           success: false,
//           error:
//             "Cannot send message. You can only reply within 24 hours of the customer's last message. The customer needs to send you a message first.",
//           code: "MESSAGING_WINDOW_EXCEEDED",
//         }
//       }
//     } else {
//       console.warn("[v0] WARNING: No customer message detected yet")
//       return {
//         success: false,
//         error: "Cannot send message. The customer must initiate the conversation first.",
//         code: "NO_CUSTOMER_MESSAGE",
//       }
//     }

//     const igAPI = new InstagramAPI({
//       accessToken: conversation.instagramAccount.accessToken,
//       instagramId: conversation.instagramAccount.instagramId,
//       pageId: conversation.instagramAccount.instagramPageId || undefined,
//     })

//     const rateLimitInfo = igAPI.getRateLimitInfo()
//     if (rateLimitInfo && rateLimitInfo.remaining < 10) {
//       return {
//         success: false,
//         error: `Rate limit nearly exceeded. Only ${rateLimitInfo.remaining}% of your hourly limit remains. Please wait before sending more messages.`,
//         code: "RATE_LIMIT_WARNING",
//       }
//     }

//     let igResponse
//     try {
//       console.log("[v0] Sending to Instagram participant:", conversation.participantId)

//       switch (messageType) {
//         case "text":
//           igResponse = await igAPI.sendTextMessage(conversation.participantId, content)
//           break
//         case "image":
//           if (!attachmentUrl) {
//             return { success: false, error: "Image URL is required for image messages" }
//           }
//           igResponse = await igAPI.sendImageMessage(conversation.participantId, attachmentUrl)
//           break
//         case "video":
//           if (!attachmentUrl) {
//             return { success: false, error: "Video URL is required for video messages" }
//           }
//           igResponse = await igAPI.sendVideoMessage(conversation.participantId, attachmentUrl)
//           break
//         case "audio":
//           if (!attachmentUrl) {
//             return { success: false, error: "Audio URL is required for audio messages" }
//           }
//           igResponse = await igAPI.sendAudioMessage(conversation.participantId, attachmentUrl)
//           break
//         case "carousel":
//           if (!attachmentMetadata?.elements) {
//             return { success: false, error: "Carousel elements are required" }
//           }
//           igResponse = await igAPI.sendGenericTemplate(conversation.participantId, attachmentMetadata.elements)
//           break
//         default:
//           return { success: false, error: `Unsupported message type: ${messageType}` }
//       }

//       console.log("[v0] Instagram API response:", igResponse)
//     } catch (igError: any) {
//       console.error("[v0] Instagram API error:", igError)
//       return { success: false, error: igError.message || "Failed to send message via Instagram" }
//     }

//     const message = await prisma.message.create({
//       data: {
//         conversationId,
//         content,
//         sender: "business",
//         isFromUser: false,
//         timestamp: new Date(),
//         messageType,
//         attachmentUrl,
//         attachmentMetadata: attachmentMetadata ,
//       },
//     })

//     await prisma.conversation.update({
//       where: { id: conversationId },
//       data: {
//         lastMessageAt: new Date(),
//         lastMessageText: messageType === "text" ? content : `Sent ${messageType}`,
//         status: "awaiting_response",
//       },
//     })

//     revalidatePath(`/inbox/${conversationId}`)
//     revalidatePath("/inbox")

//     return { success: true, message, igResponse }
//   } catch (error) {
//     console.error("[v0] Error in sendMessageToInstagram:", error)
//     return { success: false, error: "Failed to send message" }
//   }
// }

// export async function uploadMessageAttachment(file: FormData, type: "image" | "video" | "audio") {
//   try {
//     const fileData = file.get("file") as File
//     if (!fileData) {
//       return { success: false, error: "No file provided" }
//     }

//     const maxSizes = {
//       image: 8 * 1024 * 1024,
//       video: 25 * 1024 * 1024,
//       audio: 25 * 1024 * 1024,
//     }

//     if (fileData.size > maxSizes[type]) {
//       return { success: false, error: `File size exceeds ${maxSizes[type] / (1024 * 1024)}MB limit` }
//     }

//     const { put } = await import("@vercel/blob")
//     const blob = await put(fileData.name, fileData, {
//       access: "public",
//     })

//     return { success: true, url: blob.url }
//   } catch (error) {
//     console.error("[v0] Error uploading attachment:", error)
//     return { success: false, error: "Failed to upload file" }
//   }
// }


"use server"

import { prisma } from "@/lib/db"
import { InstagramAPI } from "@/lib/instagram-api"
import { revalidatePath } from "next/cache"

type MessageType = "text" | "image" | "video" | "audio" | "carousel"

interface SendMessageParams {
  conversationId: string
  content: string
  messageType?: MessageType
  attachmentUrl?: string
  attachmentMetadata?: Record<string, any>
}

export async function sendMessageToInstagram(params: SendMessageParams) {
  console.log("=====================================")
  console.log("[MESSAGE-ACTIONS] 🚀 START: sendMessageToInstagram")
  console.log("[MESSAGE-ACTIONS] 📦 Params received:", {
    conversationId: params.conversationId,
    contentLength: params.content?.length,
    messageType: params.messageType,
    hasAttachmentUrl: !!params.attachmentUrl,
    hasAttachmentMetadata: !!params.attachmentMetadata,
  })
  console.log("=====================================")

  try {
    const { conversationId, content, messageType = "text", attachmentUrl, attachmentMetadata } = params

    // Step 1: Fetch conversation
    console.log("[MESSAGE-ACTIONS] 📥 Step 1: Fetching conversation from database...")
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        instagramAccount: true,
      },
    })

    if (!conversation) {
      console.error("[MESSAGE-ACTIONS] ❌ ERROR: Conversation not found!")
      return { success: false, error: "Conversation not found" }
    }

    console.log("[MESSAGE-ACTIONS] ✅ Conversation found:", {
      id: conversation.id,
      participantId: conversation.participantId,
      participantName: conversation.participantName,
      participantUsername: conversation.participantUsername,
      lastCustomerMessageAt: conversation.lastCustomerMessageAt,
      instagramAccountId: conversation.instagramAccount.id,
      businessUsername: conversation.instagramAccount.username,
      businessInstagramId: conversation.instagramAccount.instagramId,
      businessPageId: conversation.instagramAccount.instagramPageId,
      hasAccessToken: !!conversation.instagramAccount.accessToken,
      accessTokenLength: conversation.instagramAccount.accessToken?.length || 0,
    })

    // Step 2: Validate participant
    console.log("[MESSAGE-ACTIONS] 🔍 Step 2: Validating participant...")
    if (conversation.participantId === conversation.instagramAccount.instagramId) {
      console.error("[MESSAGE-ACTIONS] ❌ ERROR: Participant is the business account!")
      return {
        success: false,
        error:
          "Invalid conversation data: The participant is set to your business account instead of the customer. Click 'Fix Wrong Customer Data' button to resolve this.",
        code: "INVALID_PARTICIPANT",
      }
    }
    console.log("[MESSAGE-ACTIONS] ✅ Participant validation passed")

    // Step 3: Check 24-hour messaging window
    console.log("[MESSAGE-ACTIONS] ⏰ Step 3: Checking 24-hour messaging window...")
    if (conversation.lastCustomerMessageAt) {
      const hoursSinceLastCustomerMessage =
        (Date.now() - conversation.lastCustomerMessageAt.getTime()) / (1000 * 60 * 60)

      console.log("[MESSAGE-ACTIONS] 📊 Messaging window info:", {
        lastCustomerMessageAt: conversation.lastCustomerMessageAt,
        hoursSince: hoursSinceLastCustomerMessage.toFixed(2),
        isWithinWindow: hoursSinceLastCustomerMessage <= 24,
      })

      if (hoursSinceLastCustomerMessage > 24) {
        console.warn("[MESSAGE-ACTIONS] ⚠️ WARNING: Outside 24-hour messaging window")
        return {
          success: false,
          error:
            "Cannot send message. You can only reply within 24 hours of the customer's last message. The customer needs to send you a message first.",
          code: "MESSAGING_WINDOW_EXCEEDED",
        }
      }
      console.log("[MESSAGE-ACTIONS] ✅ Within 24-hour window")
    } else {
      console.warn("[MESSAGE-ACTIONS] ⚠️ WARNING: No customer message detected yet")
      return {
        success: false,
        error: "Cannot send message. The customer must initiate the conversation first.",
        code: "NO_CUSTOMER_MESSAGE",
      }
    }

    // Step 4: Initialize Instagram API
    console.log("[MESSAGE-ACTIONS] 🔧 Step 4: Initializing Instagram API...")
    const apiConfig = {
      accessToken: conversation.instagramAccount.accessToken,
      instagramId: conversation.instagramAccount.instagramPageId || conversation.instagramAccount.instagramId,
      pageId: conversation.instagramAccount.instagramPageId || undefined,
    }
    console.log("[MESSAGE-ACTIONS] 📋 API Config:", {
      hasAccessToken: !!apiConfig.accessToken,
      accessTokenPrefix: apiConfig.accessToken?.substring(0, 20) + "...",
      instagramId: apiConfig.instagramId,
      pageId: apiConfig.pageId,
      usingPageId: !!conversation.instagramAccount.instagramPageId,
    })

    const igAPI = new InstagramAPI(apiConfig)
    console.log("[MESSAGE-ACTIONS] ✅ Instagram API initialized")

    // Step 5: Check rate limits
    console.log("[MESSAGE-ACTIONS] 📊 Step 5: Checking rate limits...")
    const rateLimitInfo = igAPI.getRateLimitInfo()
    if (rateLimitInfo) {
      console.log("[MESSAGE-ACTIONS] Rate limit info:", rateLimitInfo)
      if (rateLimitInfo.remaining < 10) {
        console.warn("[MESSAGE-ACTIONS] ⚠️ WARNING: Rate limit nearly exceeded")
        return {
          success: false,
          error: `Rate limit nearly exceeded. Only ${rateLimitInfo.remaining}% of your hourly limit remains. Please wait before sending more messages.`,
          code: "RATE_LIMIT_WARNING",
        }
      }
    } else {
      console.log("[MESSAGE-ACTIONS] ℹ️ No rate limit info available yet")
    }

    // Step 6: Send message via Instagram API
    console.log("[MESSAGE-ACTIONS] 📤 Step 6: Sending message to Instagram API...")
    console.log("[MESSAGE-ACTIONS] 📝 Message details:", {
      messageType,
      recipientId: conversation.participantId,
      contentPreview: content.substring(0, 50) + (content.length > 50 ? "..." : ""),
      contentLength: content.length,
      attachmentUrl,
    })

    let igResponse
    try {
      switch (messageType) {
        case "text":
          console.log("[MESSAGE-ACTIONS] 💬 Sending text message...")
          console.log("[MESSAGE-ACTIONS] 🎯 Calling sendTextMessage with:", {
            recipientId: conversation.participantId,
            content: content,
          })
          igResponse = await igAPI.sendTextMessage(conversation.participantId, content)
          break

        case "image":
          if (!attachmentUrl) {
            console.error("[MESSAGE-ACTIONS] ❌ ERROR: Image URL missing")
            return { success: false, error: "Image URL is required for image messages" }
          }
          console.log("[MESSAGE-ACTIONS] 🖼️ Sending image message...")
          igResponse = await igAPI.sendImageMessage(conversation.participantId, attachmentUrl)
          break

        case "video":
          if (!attachmentUrl) {
            console.error("[MESSAGE-ACTIONS] ❌ ERROR: Video URL missing")
            return { success: false, error: "Video URL is required for video messages" }
          }
          console.log("[MESSAGE-ACTIONS] 🎥 Sending video message...")
          igResponse = await igAPI.sendVideoMessage(conversation.participantId, attachmentUrl)
          break

        case "audio":
          if (!attachmentUrl) {
            console.error("[MESSAGE-ACTIONS] ❌ ERROR: Audio URL missing")
            return { success: false, error: "Audio URL is required for audio messages" }
          }
          console.log("[MESSAGE-ACTIONS] 🎵 Sending audio message...")
          igResponse = await igAPI.sendAudioMessage(conversation.participantId, attachmentUrl)
          break

        case "carousel":
          if (!attachmentMetadata?.elements) {
            console.error("[MESSAGE-ACTIONS] ❌ ERROR: Carousel elements missing")
            return { success: false, error: "Carousel elements are required" }
          }
          console.log("[MESSAGE-ACTIONS] 🎠 Sending carousel message...")
          igResponse = await igAPI.sendGenericTemplate(conversation.participantId, attachmentMetadata.elements)
          break

        default:
          console.error("[MESSAGE-ACTIONS] ❌ ERROR: Unsupported message type:", messageType)
          return { success: false, error: `Unsupported message type: ${messageType}` }
      }

      console.log("[MESSAGE-ACTIONS] ✅ Instagram API response received:")
      console.log("[MESSAGE-ACTIONS] 📨 Response:", JSON.stringify(igResponse, null, 2))
    } catch (igError: any) {
      console.error("[MESSAGE-ACTIONS] ❌ Instagram API ERROR:")
      console.error("[MESSAGE-ACTIONS] Error type:", igError.constructor.name)
      console.error("[MESSAGE-ACTIONS] Error message:", igError.message)
      console.error("[MESSAGE-ACTIONS] Error stack:", igError.stack)
      console.error("[MESSAGE-ACTIONS] Full error object:", JSON.stringify(igError, null, 2))
      
      // Try to extract more details from the error
      if (igError.response) {
        console.error("[MESSAGE-ACTIONS] API Response Status:", igError.response.status)
        console.error("[MESSAGE-ACTIONS] API Response Data:", igError.response.data)
      }
      
      return { 
        success: false, 
        error: igError.message || "Failed to send message via Instagram",
        details: {
          errorType: igError.constructor.name,
          errorMessage: igError.message,
          recipientId: conversation.participantId,
          messageType,
        }
      }
    }

    // Step 7: Save message to database
    console.log("[MESSAGE-ACTIONS] 💾 Step 7: Saving message to database...")
    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
        sender: "business",
        isFromUser: false,
        timestamp: new Date(),
        messageType,
        attachmentUrl,
        attachmentMetadata: attachmentMetadata,
      },
    })
    console.log("[MESSAGE-ACTIONS] ✅ Message saved to database:", {
      messageId: message.id,
      conversationId: message.conversationId,
    })

    // Step 8: Update conversation
    console.log("[MESSAGE-ACTIONS] 🔄 Step 8: Updating conversation...")
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        lastMessageText: messageType === "text" ? content : `Sent ${messageType}`,
        status: "awaiting_response",
      },
    })
    console.log("[MESSAGE-ACTIONS] ✅ Conversation updated")

    // Step 9: Revalidate paths
    console.log("[MESSAGE-ACTIONS] 🔄 Step 9: Revalidating paths...")
    revalidatePath(`/inbox/${conversationId}`)
    revalidatePath("/inbox")
    console.log("[MESSAGE-ACTIONS] ✅ Paths revalidated")

    console.log("=====================================")
    console.log("[MESSAGE-ACTIONS] ✅ SUCCESS: Message sent successfully!")
    console.log("=====================================")

    return { success: true, message, igResponse }
  } catch (error: any) {
    console.error("=====================================")
    console.error("[MESSAGE-ACTIONS] ❌ FATAL ERROR in sendMessageToInstagram:")
    console.error("[MESSAGE-ACTIONS] Error type:", error.constructor.name)
    console.error("[MESSAGE-ACTIONS] Error message:", error.message)
    console.error("[MESSAGE-ACTIONS] Error stack:", error.stack)
    console.error("[MESSAGE-ACTIONS] Full error:", error)
    console.error("=====================================")
    return { 
      success: false, 
      error: "Failed to send message",
      details: {
        errorType: error.constructor.name,
        errorMessage: error.message,
      }
    }
  }
}

export async function uploadMessageAttachment(file: FormData, type: "image" | "video" | "audio") {
  console.log("=====================================")
  console.log("[MESSAGE-ACTIONS] 📤 START: uploadMessageAttachment")
  console.log("[MESSAGE-ACTIONS] File type:", type)
  console.log("=====================================")

  try {
    const fileData = file.get("file") as File
    if (!fileData) {
      console.error("[MESSAGE-ACTIONS] ❌ ERROR: No file provided")
      return { success: false, error: "No file provided" }
    }

    console.log("[MESSAGE-ACTIONS] 📁 File details:", {
      name: fileData.name,
      size: fileData.size,
      type: fileData.type,
    })

    const maxSizes = {
      image: 8 * 1024 * 1024,
      video: 25 * 1024 * 1024,
      audio: 25 * 1024 * 1024,
    }

    if (fileData.size > maxSizes[type]) {
      console.error("[MESSAGE-ACTIONS] ❌ ERROR: File size exceeds limit:", {
        fileSize: fileData.size,
        maxSize: maxSizes[type],
      })
      return { success: false, error: `File size exceeds ${maxSizes[type] / (1024 * 1024)}MB limit` }
    }

    console.log("[MESSAGE-ACTIONS] 📤 Uploading to Vercel Blob...")
    const { put } = await import("@vercel/blob")
    const blob = await put(fileData.name, fileData, {
      access: "public",
    })

    console.log("[MESSAGE-ACTIONS] ✅ File uploaded successfully:", {
      url: blob.url,
    })
    console.log("=====================================")

    return { success: true, url: blob.url }
  } catch (error: any) {
    console.error("=====================================")
    console.error("[MESSAGE-ACTIONS] ❌ ERROR in uploadMessageAttachment:")
    console.error("[MESSAGE-ACTIONS] Error type:", error.constructor.name)
    console.error("[MESSAGE-ACTIONS] Error message:", error.message)
    console.error("[MESSAGE-ACTIONS] Error stack:", error.stack)
    console.error("=====================================")
    return { success: false, error: "Failed to upload file" }
  }
}