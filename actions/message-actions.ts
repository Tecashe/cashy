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
  try {
    const { conversationId, content, messageType = "text", attachmentUrl, attachmentMetadata } = params

    // Get conversation details
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        instagramAccount: true,
      },
    })

    if (!conversation) {
      return { success: false, error: "Conversation not found" }
    }

    if (conversation.lastCustomerMessageAt) {
      const hoursSinceLastCustomerMessage =
        (Date.now() - conversation.lastCustomerMessageAt.getTime()) / (1000 * 60 * 60)

      if (hoursSinceLastCustomerMessage > 24) {
        return {
          success: false,
          error:
            "Cannot send message. You can only reply within 24 hours of the customer's last message. The customer needs to send you a message first.",
          code: "MESSAGING_WINDOW_EXCEEDED",
        }
      }
    } else {
      // No customer message yet, cannot initiate conversation
      return {
        success: false,
        error: "Cannot send message. The customer must initiate the conversation first.",
        code: "NO_CUSTOMER_MESSAGE",
      }
    }

    // Initialize Instagram API
    const igAPI = new InstagramAPI({
      accessToken: conversation.instagramAccount.accessToken,
      instagramId: conversation.instagramAccount.instagramId,
      pageId: conversation.instagramAccount.instagramPageId || undefined,
    })

    const rateLimitInfo = igAPI.getRateLimitInfo()
    if (rateLimitInfo && rateLimitInfo.remaining < 10) {
      return {
        success: false,
        error: `Rate limit nearly exceeded. Only ${rateLimitInfo.remaining}% of your hourly limit remains. Please wait before sending more messages.`,
        code: "RATE_LIMIT_WARNING",
      }
    }

    // Send the message via Instagram API based on type
    let igResponse
    try {
      switch (messageType) {
        case "text":
          igResponse = await igAPI.sendTextMessage(conversation.participantId, content)
          break
        case "image":
          if (!attachmentUrl) {
            return { success: false, error: "Image URL is required for image messages" }
          }
          igResponse = await igAPI.sendImageMessage(conversation.participantId, attachmentUrl)
          break
        case "video":
          if (!attachmentUrl) {
            return { success: false, error: "Video URL is required for video messages" }
          }
          igResponse = await igAPI.sendVideoMessage(conversation.participantId, attachmentUrl)
          break
        case "audio":
          if (!attachmentUrl) {
            return { success: false, error: "Audio URL is required for audio messages" }
          }
          igResponse = await igAPI.sendAudioMessage(conversation.participantId, attachmentUrl)
          break
        case "carousel":
          if (!attachmentMetadata?.elements) {
            return { success: false, error: "Carousel elements are required" }
          }
          igResponse = await igAPI.sendGenericTemplate(conversation.participantId, attachmentMetadata.elements)
          break
        default:
          return { success: false, error: `Unsupported message type: ${messageType}` }
      }
    } catch (igError: any) {
      console.error("[v0] Instagram API error:", igError)
      return { success: false, error: igError.message || "Failed to send message via Instagram" }
    }

    // Save message to database
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

    // Update conversation
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        lastMessageText: messageType === "text" ? content : `Sent ${messageType}`,
        status: "awaiting_response",
      },
    })

    revalidatePath(`/inbox/${conversationId}`)
    revalidatePath("/inbox")

    return { success: true, message, igResponse }
  } catch (error) {
    console.error("[v0] Error in sendMessageToInstagram:", error)
    return { success: false, error: "Failed to send message" }
  }
}

export async function uploadMessageAttachment(file: FormData, type: "image" | "video" | "audio") {
  try {
    // Upload to Vercel Blob
    const fileData = file.get("file") as File
    if (!fileData) {
      return { success: false, error: "No file provided" }
    }

    // Check file size (Instagram limits)
    const maxSizes = {
      image: 8 * 1024 * 1024, // 8MB
      video: 25 * 1024 * 1024, // 25MB
      audio: 25 * 1024 * 1024, // 25MB
    }

    if (fileData.size > maxSizes[type]) {
      return { success: false, error: `File size exceeds ${maxSizes[type] / (1024 * 1024)}MB limit` }
    }

    // Upload to Vercel Blob (you need @vercel/blob package)
    const { put } = await import("@vercel/blob")
    const blob = await put(fileData.name, fileData, {
      access: "public",
    })

    return { success: true, url: blob.url }
  } catch (error) {
    console.error("[v0] Error uploading attachment:", error)
    return { success: false, error: "Failed to upload file" }
  }
}
