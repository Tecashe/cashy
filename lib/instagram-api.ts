// interface InstagramAccount {
//   accessToken: string
//   instagramId: string
// }

// interface RateLimitInfo {
//   remaining: number
//   reset: Date
// }

// export class InstagramAPI {
//   private accessToken: string
//   private instagramId: string
//   private baseUrl = "https://graph.instagram.com/v21.0"
//   private rateLimitInfo: RateLimitInfo | null = null

//   constructor(account: InstagramAccount) {
//     this.accessToken = account.accessToken
//     this.instagramId = account.instagramId
//   }

//   private async handleResponse(response: Response) {
//     // Extract rate limit headers
//     const remaining = response.headers.get("X-Business-Use-Case-Usage")
//     if (remaining) {
//       try {
//         const usage = JSON.parse(remaining)
//         // Instagram uses a percentage-based system
//         this.rateLimitInfo = {
//           remaining: 100 - (usage[Object.keys(usage)[0]]?.call_count || 0),
//           reset: new Date(Date.now() + 3600000), // Resets every hour
//         }
//       } catch (e) {
//         console.error("[InstagramAPI] Failed to parse rate limit headers:", e)
//       }
//     }

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))

//       // Handle specific error codes
//       if (response.status === 429) {
//         throw new Error("Rate limit exceeded. Please try again later.")
//       }

//       if (response.status === 401) {
//         throw new Error("Instagram access token expired. Please reconnect your account.")
//       }

//       if (response.status === 400 && error.error?.code === 10) {
//         throw new Error("Permission denied. Please ensure all required permissions are granted.")
//       }

//       throw new Error(error.error?.message || `Instagram API Error: ${response.status}`)
//     }

//     return await response.json()
//   }

//   async sendMessage(recipientId: string, message: string) {
//     const response = await fetch(`${this.baseUrl}/${this.instagramId}/messages`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipient: { id: recipientId },
//         message: { text: message },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async getConversation(userId: string) {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}/conversations?platform=instagram&user_id=${userId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getMessages(conversationId: string, limit = 50) {
//     const response = await fetch(`${this.baseUrl}/${conversationId}/messages?limit=${limit}`, {
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//       },
//     })

//     return await this.handleResponse(response)
//   }

//   async replyToComment(commentId: string, message: string) {
//     const response = await fetch(`${this.baseUrl}/${commentId}/replies`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         message,
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async getComments(mediaId: string) {
//     const response = await fetch(`${this.baseUrl}/${mediaId}/comments?fields=id,text,username,timestamp`, {
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//       },
//     })

//     return await this.handleResponse(response)
//   }

//   async publishPhoto(imageUrl: string, caption: string) {
//     const containerResponse = await fetch(`${this.baseUrl}/${this.instagramId}/media`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         image_url: imageUrl,
//         caption,
//       }),
//     })

//     const containerData = await this.handleResponse(containerResponse)

//     await new Promise((resolve) => setTimeout(resolve, 3000))

//     const publishResponse = await fetch(`${this.baseUrl}/${this.instagramId}/media_publish`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         creation_id: containerData.id,
//       }),
//     })

//     return await this.handleResponse(publishResponse)
//   }

//   async getInsights(metrics: string[], period: "day" | "week" | "days_28" = "day") {
//     const metricsParam = metrics.join(",")
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}/insights?metric=${metricsParam}&period=${period}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getProfile() {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   getRateLimitInfo(): RateLimitInfo | null {
//     return this.rateLimitInfo
//   }

//   static async refreshAccessToken(currentToken: string) {
//     const response = await fetch(
//       `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`,
//     )

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
//       throw new Error(error.error?.message || "Failed to refresh token")
//     }

//     return await response.json()
//   }
// }

// export async function exchangeTokenForLongLived(shortLivedToken: string) {
//   const response = await fetch(
//     `https://graph.instagram.com/access_token?` +
//       `grant_type=ig_exchange_token&` +
//       `client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&` +
//       `access_token=${shortLivedToken}`,
//   )

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
//     throw new Error(error.error?.message || "Failed to exchange token")
//   }

//   return await response.json()
// }

// interface InstagramAccount {
//   accessToken: string
//   instagramId: string
//   pageId?: string
// }

// interface RateLimitInfo {
//   remaining: number
//   reset: Date
// }

// interface InstagramProfile {
//   id: string
//   username: string
//   name?: string
//   profile_picture_url?: string
//   followers_count?: number
//   follows_count?: number
//   media_count?: number
// }

// interface InstagramTokenResponse {
//   access_token: string
//   expires_in: number
// }

// interface InstagramMessage {
//   id: string
//   from: { id: string; username?: string }
//   to: { id: string }
//   message: string
//   timestamp: string
//   attachments?: any[]
// }

// interface InstagramComment {
//   id: string
//   text: string
//   username: string
//   timestamp: string
//   media_id?: string
//   from: { id: string; username: string }
//   parent_id?: string
// }

// interface InstagramConversation {
//   id: string
//   participants: { id: string; username?: string }[]
//   messages?: { data: InstagramMessage[] }
// }

// export class InstagramAPI {
//   private accessToken: string
//   private instagramId: string
//   private pageId?: string
//   private baseUrl = "https://graph.instagram.com/v21.0"
//   private rateLimitInfo: RateLimitInfo | null = null

//   constructor(account: InstagramAccount) {
//     this.accessToken = account.accessToken
//     this.instagramId = account.instagramId
//     this.pageId = account.pageId
//   }

//   private async handleResponse(response: Response) {
//     // Extract rate limit headers
//     const remaining = response.headers.get("X-Business-Use-Case-Usage")
//     if (remaining) {
//       try {
//         const usage = JSON.parse(remaining)
//         // Instagram uses a percentage-based system
//         this.rateLimitInfo = {
//           remaining: 100 - (usage[Object.keys(usage)[0]]?.call_count || 0),
//           reset: new Date(Date.now() + 3600000), // Resets every hour
//         }
//       } catch (e) {
//         console.error("[InstagramAPI] Failed to parse rate limit headers:", e)
//       }
//     }

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))

//       // Handle specific error codes
//       if (response.status === 429) {
//         throw new Error("Rate limit exceeded. Please try again later.")
//       }

//       if (response.status === 401) {
//         throw new Error("Instagram access token expired. Please reconnect your account.")
//       }

//       if (response.status === 400 && error.error?.code === 10) {
//         throw new Error("Permission denied. Please ensure all required permissions are granted.")
//       }

//       throw new Error(error.error?.message || `Instagram API Error: ${response.status}`)
//     }

//     return await response.json()
//   }

//   getRateLimitInfo(): RateLimitInfo | null {
//     return this.rateLimitInfo
//   }

//   // ============================================
//   // TOKEN MANAGEMENT
//   // ============================================

//   static async refreshAccessToken(currentToken: string): Promise<InstagramTokenResponse> {
//     const response = await fetch(
//       `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`,
//     )

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
//       throw new Error(error.error?.message || "Failed to refresh token")
//     }

//     return response.json()
//   }

//   // ============================================
//   // PROFILE & MEDIA
//   // ============================================

//   async getProfile(): Promise<InstagramProfile> {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getMediaList(limit = 25) {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${limit}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async publishPhoto(imageUrl: string, caption: string) {
//     const containerResponse = await fetch(`${this.baseUrl}/${this.instagramId}/media`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         image_url: imageUrl,
//         caption,
//       }),
//     })

//     const containerData = await this.handleResponse(containerResponse)

//     // Wait for Instagram to process the container
//     await new Promise((resolve) => setTimeout(resolve, 3000))

//     const publishResponse = await fetch(`${this.baseUrl}/${this.instagramId}/media_publish`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         creation_id: containerData.id,
//       }),
//     })

//     return await this.handleResponse(publishResponse)
//   }

//   // ============================================
//   // MESSAGING API - Full capabilities
//   // ============================================

//   async getConversation(userId: string): Promise<InstagramConversation> {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}/conversations?platform=instagram&user_id=${userId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getConversations(limit = 50) {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}/conversations?fields=id,participants,messages&limit=${limit}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getMessages(conversationId: string, limit = 50): Promise<{ data: InstagramMessage[] }> {
//     const response = await fetch(`${this.baseUrl}/${conversationId}/messages?limit=${limit}`, {
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//       },
//     })

//     return await this.handleResponse(response)
//   }

//   async sendMessage(recipientId: string, message: string) {
//     const response = await fetch(`${this.baseUrl}/${this.instagramId}/messages`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipient: { id: recipientId },
//         message: { text: message },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async sendTextMessage(recipientId: string, text: string) {
//     return this.sendMessage(recipientId, text)
//   }

//   async sendImageMessage(recipientId: string, imageUrl: string) {
//     const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipient: { id: recipientId },
//         message: {
//           attachment: {
//             type: "image",
//             payload: {
//               url: imageUrl,
//               is_reusable: true,
//             },
//           },
//         },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async sendVideoMessage(recipientId: string, videoUrl: string) {
//     const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipient: { id: recipientId },
//         message: {
//           attachment: {
//             type: "video",
//             payload: {
//               url: videoUrl,
//               is_reusable: true,
//             },
//           },
//         },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async sendAudioMessage(recipientId: string, audioUrl: string) {
//     const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipient: { id: recipientId },
//         message: {
//           attachment: {
//             type: "audio",
//             payload: {
//               url: audioUrl,
//               is_reusable: true,
//             },
//           },
//         },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async sendGenericTemplate(recipientId: string, elements: any[]) {
//     const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipient: { id: recipientId },
//         message: {
//           attachment: {
//             type: "template",
//             payload: {
//               template_type: "generic",
//               elements,
//             },
//           },
//         },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async uploadAttachment(type: "image" | "video" | "audio", url: string) {
//     if (!this.pageId) {
//       throw new Error("Page ID is required for attachment upload")
//     }

//     const response = await fetch(`https://graph.facebook.com/v21.0/${this.pageId}/message_attachments`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         platform: "instagram",
//         message: {
//           attachment: {
//             type,
//             payload: {
//               url,
//               is_reusable: true,
//             },
//           },
//         },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   // ============================================
//   // COMMENTS & MENTIONS API
//   // ============================================

//   async getComments(mediaId: string): Promise<{ data: InstagramComment[] }> {
//     const response = await fetch(`${this.baseUrl}/${mediaId}/comments?fields=id,text,username,timestamp`, {
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//       },
//     })

//     return await this.handleResponse(response)
//   }

//   async replyToComment(commentId: string, message: string) {
//     const response = await fetch(`${this.baseUrl}/${commentId}/replies`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         message,
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async getMentionedComment(commentId: string) {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}?fields=mentioned_comment.comment_id(${commentId})`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getMentionedMedia() {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}?fields=mentioned_media.limit(50){id,caption,media_type,media_url,timestamp}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async replyToMention(commentId: string, message: string) {
//     const response = await fetch(`${this.baseUrl}/${this.instagramId}/mentions`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         comment_id: commentId,
//         message,
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   // ============================================
//   // STORY REPLIES API
//   // ============================================

//   async getStoryReplies(storyId: string) {
//     const response = await fetch(`${this.baseUrl}/${storyId}/replies?fields=id,text,username,timestamp,from`, {
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//       },
//     })

//     return await this.handleResponse(response)
//   }

//   // ============================================
//   // INSIGHTS & ANALYTICS
//   // ============================================

//   async getInsights(metrics: string[], period: "day" | "week" | "days_28" = "day") {
//     const metricsParam = metrics.join(",")
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}/insights?metric=${metricsParam}&period=${period}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getMediaInsights(mediaId: string) {
//     const response = await fetch(`${this.baseUrl}/${mediaId}/insights?metric=engagement,impressions,reach,saved`, {
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//       },
//     })

//     return await this.handleResponse(response)
//   }

//   async getAccountInsights(period: "day" | "week" | "days_28" = "day") {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}/insights?metric=impressions,reach,profile_views,follower_count&period=${period}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   // ============================================
//   // WEBHOOKS SETUP
//   // ============================================

//   async subscribeToWebhooks(fields: string[]) {
//     if (!this.pageId) {
//       throw new Error("Page ID is required for webhook subscription")
//     }

//     const response = await fetch(`https://graph.facebook.com/v21.0/${this.pageId}/subscribed_apps`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         subscribed_fields: fields.join(","),
//       }),
//     })

//     return await this.handleResponse(response)
//   }
// }

// // ============================================
// // HELPER FUNCTIONS
// // ============================================

// export async function exchangeTokenForLongLived(shortLivedToken: string): Promise<InstagramTokenResponse> {
//   const response = await fetch(
//     `https://graph.instagram.com/access_token?` +
//       `grant_type=ig_exchange_token&` +
//       `client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&` +
//       `access_token=${shortLivedToken}`,
//   )

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
//     throw new Error(error.error?.message || "Failed to exchange token")
//   }

//   return response.json()
// }



// interface InstagramAccount {
//   accessToken: string
//   instagramId: string
//   pageId?: string
// }

// interface RateLimitInfo {
//   remaining: number
//   reset: Date
// }

// interface InstagramProfile {
//   id: string
//   username: string
//   name?: string
//   profile_picture_url?: string
//   followers_count?: number
//   follows_count?: number
//   media_count?: number
// }

// interface InstagramTokenResponse {
//   access_token: string
//   expires_in: number
// }

// interface InstagramMessage {
//   id: string
//   from: { id: string; username?: string }
//   to: { id: string }
//   message: string
//   timestamp: string
//   attachments?: any[]
// }

// interface InstagramComment {
//   id: string
//   text: string
//   username: string
//   timestamp: string
//   media_id?: string
//   from: { id: string; username: string }
//   parent_id?: string
// }

// interface InstagramConversation {
//   id: string
//   participants: { id: string; username?: string }[]
//   messages?: { data: InstagramMessage[] }
// }

// export class InstagramAPI {
//   private accessToken: string
//   private instagramId: string
//   private pageId?: string
//   private baseUrl = "https://graph.instagram.com/v21.0"
//   private rateLimitInfo: RateLimitInfo | null = null

//   constructor(account: InstagramAccount) {
//     this.accessToken = account.accessToken
//     this.instagramId = account.instagramId
//     this.pageId = account.pageId
//   }

//   private async handleResponse(response: Response) {
//     // Extract rate limit headers
//     const remaining = response.headers.get("X-Business-Use-Case-Usage")
//     if (remaining) {
//       try {
//         const usage = JSON.parse(remaining)
//         // Instagram uses a percentage-based system
//         this.rateLimitInfo = {
//           remaining: 100 - (usage[Object.keys(usage)[0]]?.call_count || 0),
//           reset: new Date(Date.now() + 3600000), // Resets every hour
//         }
//       } catch (e) {
//         console.error("[InstagramAPI] Failed to parse rate limit headers:", e)
//       }
//     }

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))

//       // Handle specific error codes
//       if (response.status === 429) {
//         throw new Error("Rate limit exceeded. Please try again later.")
//       }

//       if (response.status === 401) {
//         throw new Error("Instagram access token expired. Please reconnect your account.")
//       }

//       if (response.status === 400 && error.error?.code === 10) {
//         throw new Error("Permission denied. Please ensure all required permissions are granted.")
//       }

//       if (error.error?.code === 10900 || error.error?.message?.includes("allowed window")) {
//         throw new Error(
//           "This message is sent outside of allowed window. You can only message customers who contacted you within the last 24 hours.",
//         )
//       }

//       if (error.error?.code === 551) {
//         throw new Error("This user isn't available right now. They may have blocked your account.")
//       }

//       throw new Error(error.error?.message || `Instagram API Error: ${response.status}`)
//     }

//     return await response.json()
//   }

//   getRateLimitInfo(): RateLimitInfo | null {
//     return this.rateLimitInfo
//   }

//   // ============================================
//   // TOKEN MANAGEMENT
//   // ============================================

//   static async refreshAccessToken(currentToken: string): Promise<InstagramTokenResponse> {
//     const response = await fetch(
//       `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`,
//     )

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
//       throw new Error(error.error?.message || "Failed to refresh token")
//     }

//     return response.json()
//   }

//   // ============================================
//   // PROFILE & MEDIA
//   // ============================================

//   async getProfile(): Promise<InstagramProfile> {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getMediaList(limit = 25) {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${limit}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async publishPhoto(imageUrl: string, caption: string) {
//     const containerResponse = await fetch(`${this.baseUrl}/${this.instagramId}/media`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         image_url: imageUrl,
//         caption,
//       }),
//     })

//     const containerData = await this.handleResponse(containerResponse)

//     // Wait for Instagram to process the container
//     await new Promise((resolve) => setTimeout(resolve, 3000))

//     const publishResponse = await fetch(`${this.baseUrl}/${this.instagramId}/media_publish`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         creation_id: containerData.id,
//       }),
//     })

//     return await this.handleResponse(publishResponse)
//   }

//   // ============================================
//   // MESSAGING API - Full capabilities
//   // ============================================

//   async getConversation(userId: string): Promise<InstagramConversation> {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}/conversations?platform=instagram&user_id=${userId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getConversations(limit = 50) {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}/conversations?fields=id,participants,messages&limit=${limit}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getMessages(conversationId: string, limit = 50): Promise<{ data: InstagramMessage[] }> {
//     const response = await fetch(`${this.baseUrl}/${conversationId}/messages?limit=${limit}`, {
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//       },
//     })

//     return await this.handleResponse(response)
//   }

//   async sendMessage(recipientId: string, message: string) {
//     const response = await fetch(`${this.baseUrl}/${this.instagramId}/messages`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipient: { id: recipientId },
//         message: { text: message },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async sendTextMessage(recipientId: string, text: string) {
//     return this.sendMessage(recipientId, text)
//   }

//   async sendImageMessage(recipientId: string, imageUrl: string) {
//     const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipient: { id: recipientId },
//         message: {
//           attachment: {
//             type: "image",
//             payload: {
//               url: imageUrl,
//               is_reusable: true,
//             },
//           },
//         },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async sendVideoMessage(recipientId: string, videoUrl: string) {
//     const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipient: { id: recipientId },
//         message: {
//           attachment: {
//             type: "video",
//             payload: {
//               url: videoUrl,
//               is_reusable: true,
//             },
//           },
//         },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async sendAudioMessage(recipientId: string, audioUrl: string) {
//     const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipient: { id: recipientId },
//         message: {
//           attachment: {
//             type: "audio",
//             payload: {
//               url: audioUrl,
//               is_reusable: true,
//             },
//           },
//         },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async sendGenericTemplate(recipientId: string, elements: any[]) {
//     const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipient: { id: recipientId },
//         message: {
//           attachment: {
//             type: "template",
//             payload: {
//               template_type: "generic",
//               elements,
//             },
//           },
//         },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async uploadAttachment(type: "image" | "video" | "audio", url: string) {
//     if (!this.pageId) {
//       throw new Error("Page ID is required for attachment upload")
//     }

//     const response = await fetch(`https://graph.facebook.com/v21.0/${this.pageId}/message_attachments`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         platform: "instagram",
//         message: {
//           attachment: {
//             type,
//             payload: {
//               url,
//               is_reusable: true,
//             },
//           },
//         },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   // ============================================
//   // COMMENTS & MENTIONS API
//   // ============================================

//   async getComments(mediaId: string): Promise<{ data: InstagramComment[] }> {
//     const response = await fetch(`${this.baseUrl}/${mediaId}/comments?fields=id,text,username,timestamp`, {
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//       },
//     })

//     return await this.handleResponse(response)
//   }

//   async replyToComment(commentId: string, message: string) {
//     const response = await fetch(`${this.baseUrl}/${commentId}/replies`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         message,
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async getMentionedComment(commentId: string) {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}?fields=mentioned_comment.comment_id(${commentId})`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getMentionedMedia() {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}?fields=mentioned_media.limit(50){id,caption,media_type,media_url,timestamp}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async replyToMention(commentId: string, message: string) {
//     const response = await fetch(`${this.baseUrl}/${this.instagramId}/mentions`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         comment_id: commentId,
//         message,
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   // ============================================
//   // STORY REPLIES API
//   // ============================================

//   async getStoryReplies(storyId: string) {
//     const response = await fetch(`${this.baseUrl}/${storyId}/replies?fields=id,text,username,timestamp,from`, {
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//       },
//     })

//     return await this.handleResponse(response)
//   }

//   // ============================================
//   // INSIGHTS & ANALYTICS
//   // ============================================

//   async getInsights(metrics: string[], period: "day" | "week" | "days_28" = "day") {
//     const metricsParam = metrics.join(",")
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}/insights?metric=${metricsParam}&period=${period}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getMediaInsights(mediaId: string) {
//     const response = await fetch(`${this.baseUrl}/${mediaId}/insights?metric=engagement,impressions,reach,saved`, {
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//       },
//     })

//     return await this.handleResponse(response)
//   }

//   async getAccountInsights(period: "day" | "week" | "days_28" = "day") {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}/insights?metric=impressions,reach,profile_views,follower_count&period=${period}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   // ============================================
//   // WEBHOOKS SETUP
//   // ============================================

//   async subscribeToWebhooks(fields: string[]) {
//     if (!this.pageId) {
//       throw new Error("Page ID is required for webhook subscription")
//     }

//     const response = await fetch(`https://graph.facebook.com/v21.0/${this.pageId}/subscribed_apps`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         subscribed_fields: fields.join(","),
//       }),
//     })

//     return await this.handleResponse(response)
//   }
// }

// // ============================================
// // HELPER FUNCTIONS
// // ============================================

// export async function exchangeTokenForLongLived(shortLivedToken: string): Promise<InstagramTokenResponse> {
//   const response = await fetch(
//     `https://graph.instagram.com/access_token?` +
//       `grant_type=ig_exchange_token&` +
//       `client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&` +
//       `access_token=${shortLivedToken}`,
//   )

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
//     throw new Error(error.error?.message || "Failed to exchange token")
//   }

//   return response.json()
// }

















// interface InstagramAccount {
//   accessToken: string
//   instagramId: string
//   pageId?: string
// }

// interface RateLimitInfo {
//   remaining: number
//   reset: Date
// }

// interface InstagramProfile {
//   id: string
//   username: string
//   name?: string
//   profile_picture_url?: string
//   followers_count?: number
//   follows_count?: number
//   media_count?: number
// }

// interface InstagramTokenResponse {
//   access_token: string
//   expires_in: number
// }

// interface InstagramMessage {
//   id: string
//   from: { id: string; username?: string }
//   to: { id: string }
//   message: string
//   timestamp: string
//   attachments?: any[]
// }

// interface InstagramComment {
//   id: string
//   text: string
//   username: string
//   timestamp: string
//   media_id?: string
//   from: { id: string; username: string }
//   parent_id?: string
// }

// interface InstagramConversation {
//   id: string
//   participants: { id: string; username?: string }[]
//   messages?: { data: InstagramMessage[] }
// }

// interface InstagramUserProfile {
//   id: string
//   username: string
//   name?: string
//   profile_pic?: string
// }

// export class InstagramAPI {
//   private accessToken: string
//   private instagramId: string
//   private pageId?: string
//   private baseUrl = "https://graph.instagram.com/v21.0"
//   private rateLimitInfo: RateLimitInfo | null = null

//   constructor(account: InstagramAccount) {
//     this.accessToken = account.accessToken
//     this.instagramId = account.instagramId
//     this.pageId = account.pageId
//   }

//   private async handleResponse(response: Response) {
//     // Extract rate limit headers
//     const remaining = response.headers.get("X-Business-Use-Case-Usage")
//     if (remaining) {
//       try {
//         const usage = JSON.parse(remaining)
//         // Instagram uses a percentage-based system
//         this.rateLimitInfo = {
//           remaining: 100 - (usage[Object.keys(usage)[0]]?.call_count || 0),
//           reset: new Date(Date.now() + 3600000), // Resets every hour
//         }
//       } catch (e) {
//         console.error("[InstagramAPI] Failed to parse rate limit headers:", e)
//       }
//     }

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))

//       // Handle specific error codes
//       if (response.status === 429) {
//         throw new Error("Rate limit exceeded. Please try again later.")
//       }

//       if (response.status === 401) {
//         throw new Error("Instagram access token expired. Please reconnect your account.")
//       }

//       if (response.status === 400 && error.error?.code === 10) {
//         throw new Error("Permission denied. Please ensure all required permissions are granted.")
//       }

//       if (error.error?.code === 10900 || error.error?.message?.includes("allowed window")) {
//         throw new Error(
//           "This message is sent outside of allowed window. You can only message customers who contacted you within the last 24 hours.",
//         )
//       }

//       if (error.error?.code === 551) {
//         throw new Error("This user isn't available right now. They may have blocked your account.")
//       }

//       throw new Error(error.error?.message || `Instagram API Error: ${response.status}`)
//     }

//     return await response.json()
//   }

//   getRateLimitInfo(): RateLimitInfo | null {
//     return this.rateLimitInfo
//   }

//   // ============================================
//   // TOKEN MANAGEMENT
//   // ============================================

//   static async refreshAccessToken(currentToken: string): Promise<InstagramTokenResponse> {
//     const response = await fetch(
//       `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`,
//     )

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
//       throw new Error(error.error?.message || "Failed to refresh token")
//     }

//     return response.json()
//   }

//   // ============================================
//   // PROFILE & MEDIA
//   // ============================================

//   async getProfile(): Promise<InstagramProfile> {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getUserProfile(userId: string): Promise<InstagramUserProfile> {
//     const response = await fetch(
//       `${this.baseUrl}/${userId}?fields=id,username,name,profile_pic`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getMediaList(limit = 25) {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${limit}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async publishPhoto(imageUrl: string, caption: string) {
//     const containerResponse = await fetch(`${this.baseUrl}/${this.instagramId}/media`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         image_url: imageUrl,
//         caption,
//       }),
//     })

//     const containerData = await this.handleResponse(containerResponse)

//     // Wait for Instagram to process the container
//     await new Promise((resolve) => setTimeout(resolve, 3000))

//     const publishResponse = await fetch(`${this.baseUrl}/${this.instagramId}/media_publish`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         creation_id: containerData.id,
//       }),
//     })

//     return await this.handleResponse(publishResponse)
//   }

//   // ============================================
//   // MESSAGING API - Full capabilities
//   // ============================================

//   async getConversation(userId: string): Promise<InstagramConversation> {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}/conversations?platform=instagram&user_id=${userId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getConversations(limit = 50) {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}/conversations?fields=id,participants,messages&limit=${limit}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getMessages(conversationId: string, limit = 50): Promise<{ data: InstagramMessage[] }> {
//     const response = await fetch(`${this.baseUrl}/${conversationId}/messages?limit=${limit}`, {
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//       },
//     })

//     return await this.handleResponse(response)
//   }

//   async sendMessage(recipientId: string, message: string) {
//     const response = await fetch(`${this.baseUrl}/${this.instagramId}/messages`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipient: { id: recipientId },
//         message: { text: message },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async sendTextMessage(recipientId: string, text: string) {
//     return this.sendMessage(recipientId, text)
//   }

//   async sendImageMessage(recipientId: string, imageUrl: string) {
//     const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipient: { id: recipientId },
//         message: {
//           attachment: {
//             type: "image",
//             payload: {
//               url: imageUrl,
//               is_reusable: true,
//             },
//           },
//         },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async sendVideoMessage(recipientId: string, videoUrl: string) {
//     const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipient: { id: recipientId },
//         message: {
//           attachment: {
//             type: "video",
//             payload: {
//               url: videoUrl,
//               is_reusable: true,
//             },
//           },
//         },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async sendAudioMessage(recipientId: string, audioUrl: string) {
//     const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipient: { id: recipientId },
//         message: {
//           attachment: {
//             type: "audio",
//             payload: {
//               url: audioUrl,
//               is_reusable: true,
//             },
//           },
//         },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async sendGenericTemplate(recipientId: string, elements: any[]) {
//     const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipient: { id: recipientId },
//         message: {
//           attachment: {
//             type: "template",
//             payload: {
//               template_type: "generic",
//               elements,
//             },
//           },
//         },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async uploadAttachment(type: "image" | "video" | "audio", url: string) {
//     if (!this.pageId) {
//       throw new Error("Page ID is required for attachment upload")
//     }

//     const response = await fetch(`https://graph.facebook.com/v21.0/${this.pageId}/message_attachments`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         platform: "instagram",
//         message: {
//           attachment: {
//             type,
//             payload: {
//               url,
//               is_reusable: true,
//             },
//           },
//         },
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   // ============================================
//   // COMMENTS & MENTIONS API
//   // ============================================

//   async getComments(mediaId: string): Promise<{ data: InstagramComment[] }> {
//     const response = await fetch(`${this.baseUrl}/${mediaId}/comments?fields=id,text,username,timestamp`, {
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//       },
//     })

//     return await this.handleResponse(response)
//   }

//   async replyToComment(commentId: string, message: string) {
//     const response = await fetch(`${this.baseUrl}/${commentId}/replies`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         message,
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   async getMentionedComment(commentId: string) {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}?fields=mentioned_comment.comment_id(${commentId})`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getMentionedMedia() {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}?fields=mentioned_media.limit(50){id,caption,media_type,media_url,timestamp}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async replyToMention(commentId: string, message: string) {
//     const response = await fetch(`${this.baseUrl}/${this.instagramId}/mentions`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         comment_id: commentId,
//         message,
//       }),
//     })

//     return await this.handleResponse(response)
//   }

//   // ============================================
//   // STORY REPLIES API
//   // ============================================

//   async getStoryReplies(storyId: string) {
//     const response = await fetch(`${this.baseUrl}/${storyId}/replies?fields=id,text,username,timestamp,from`, {
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//       },
//     })

//     return await this.handleResponse(response)
//   }

//   // ============================================
//   // INSIGHTS & ANALYTICS
//   // ============================================

//   async getInsights(metrics: string[], period: "day" | "week" | "days_28" = "day") {
//     const metricsParam = metrics.join(",")
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}/insights?metric=${metricsParam}&period=${period}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   async getMediaInsights(mediaId: string) {
//     const response = await fetch(`${this.baseUrl}/${mediaId}/insights?metric=engagement,impressions,reach,saved`, {
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//       },
//     })

//     return await this.handleResponse(response)
//   }

//   async getAccountInsights(period: "day" | "week" | "days_28" = "day") {
//     const response = await fetch(
//       `${this.baseUrl}/${this.instagramId}/insights?metric=impressions,reach,profile_views,follower_count&period=${period}`,
//       {
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//         },
//       },
//     )

//     return await this.handleResponse(response)
//   }

//   // ============================================
//   // WEBHOOKS SETUP
//   // ============================================

//   async subscribeToWebhooks(fields: string[]) {
//     if (!this.pageId) {
//       throw new Error("Page ID is required for webhook subscription")
//     }

//     const response = await fetch(`https://graph.facebook.com/v21.0/${this.pageId}/subscribed_apps`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         subscribed_fields: fields.join(","),
//       }),
//     })

//     return await this.handleResponse(response)
//   }
// }

// // ============================================
// // HELPER FUNCTIONS
// // ============================================

// export async function exchangeTokenForLongLived(shortLivedToken: string): Promise<InstagramTokenResponse> {
//   const response = await fetch(
//     `https://graph.instagram.com/access_token?` +
//       `grant_type=ig_exchange_token&` +
//       `client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&` +
//       `access_token=${shortLivedToken}`,
//   )

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
//     throw new Error(error.error?.message || "Failed to exchange token")
//   }

//   return response.json()
// }













interface InstagramAccount {
  accessToken: string
  instagramId: string
  pageId?: string
}

interface RateLimitInfo {
  remaining: number
  reset: Date
}

interface InstagramProfile {
  id: string
  username: string
  name?: string
  profile_picture_url?: string
  followers_count?: number
  follows_count?: number
  media_count?: number
}

interface InstagramTokenResponse {
  access_token: string
  expires_in: number
}

interface InstagramMessage {
  id: string
  from: { id: string; username?: string }
  to: { id: string }
  message: string
  timestamp: string
  attachments?: any[]
}

interface InstagramComment {
  id: string
  text: string
  username: string
  timestamp: string
  media_id?: string
  from: { id: string; username: string }
  parent_id?: string
}

interface InstagramConversation {
  id: string
  participants: { id: string; username?: string }[]
  messages?: { data: InstagramMessage[] }
}

interface InstagramUserProfile {
  id: string
  username: string
  name?: string
  profile_pic?: string
}

export class InstagramAPI {
  private accessToken: string
  private instagramId: string
  private pageId?: string
  private baseUrl = "https://graph.instagram.com/v21.0"
  private rateLimitInfo: RateLimitInfo | null = null

  constructor(account: InstagramAccount) {
    this.accessToken = account.accessToken
    this.instagramId = account.instagramId
    this.pageId = account.pageId
  }

  private async handleResponse(response: Response) {
    // Extract rate limit headers
    const remaining = response.headers.get("X-Business-Use-Case-Usage")
    if (remaining) {
      try {
        const usage = JSON.parse(remaining)
        // Instagram uses a percentage-based system
        this.rateLimitInfo = {
          remaining: 100 - (usage[Object.keys(usage)[0]]?.call_count || 0),
          reset: new Date(Date.now() + 3600000), // Resets every hour
        }
      } catch (e) {
        console.error("[InstagramAPI] Failed to parse rate limit headers:", e)
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))

      console.error("[InstagramAPI] API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        error: error,
        url: response.url
      })

      // Handle specific error codes
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.")
      }

      if (response.status === 401) {
        throw new Error(
          `Instagram access token error: ${error.error?.message || 'Token expired or invalid'}. ` +
          `Check: 1) Token has required permissions, 2) Instagram account is linked to Facebook Page.`
        )
      }

      if (response.status === 400) {
        if (error.error?.code === 10) {
          throw new Error("Permission denied. Ensure all required permissions are granted.")
        }
        if (error.error?.code === 100) {
          throw new Error(`Invalid request: ${error.error.message}`)
        }
      }

      if (error.error?.code === 10900 || error.error?.message?.includes("allowed window")) {
        throw new Error(
          "This message is outside the 24-hour messaging window. You can only message customers who contacted you within the last 24 hours.",
        )
      }

      if (error.error?.code === 551) {
        throw new Error("This user isn't available right now. They may have blocked your account.")
      }

      throw new Error(error.error?.message || `Instagram API Error: ${response.status}`)
    }

    return await response.json()
  }

  getRateLimitInfo(): RateLimitInfo | null {
    return this.rateLimitInfo
  }

  // ============================================
  // TOKEN MANAGEMENT
  // ============================================

  static async refreshAccessToken(currentToken: string): Promise<InstagramTokenResponse> {
    const response = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`,
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
      throw new Error(error.error?.message || "Failed to refresh token")
    }

    return response.json()
  }

  // ============================================
  // PROFILE & MEDIA
  // ============================================

  async getProfile(): Promise<InstagramProfile> {
    const response = await fetch(
      `${this.baseUrl}/${this.instagramId}?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    )

    return await this.handleResponse(response)
  }

  async getUserProfile(userId: string): Promise<InstagramUserProfile> {
    const response = await fetch(
      `${this.baseUrl}/${userId}?fields=id,username,name,profile_pic`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    )

    return await this.handleResponse(response)
  }

  async getMediaList(limit = 25) {
    const response = await fetch(
      `${this.baseUrl}/${this.instagramId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    )

    return await this.handleResponse(response)
  }

  async publishPhoto(imageUrl: string, caption: string) {
    const containerResponse = await fetch(`${this.baseUrl}/${this.instagramId}/media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageUrl,
        caption,
      }),
    })

    const containerData = await this.handleResponse(containerResponse)

    // Wait for Instagram to process the container
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const publishResponse = await fetch(`${this.baseUrl}/${this.instagramId}/media_publish`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        creation_id: containerData.id,
      }),
    })

    return await this.handleResponse(publishResponse)
  }

  // ============================================
  // MESSAGING API - Using Instagram Graph API only
  // Pattern: https://graph.instagram.com/v21.0/{PAGE_ID}/messages
  // ============================================

  async getConversation(userId: string): Promise<InstagramConversation> {
    const response = await fetch(
      `${this.baseUrl}/${this.instagramId}/conversations?platform=instagram&user_id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    )

    return await this.handleResponse(response)
  }

  async getConversations(limit = 50) {
    const response = await fetch(
      `${this.baseUrl}/${this.instagramId}/conversations?fields=id,participants,messages&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    )

    return await this.handleResponse(response)
  }

  async getMessages(conversationId: string, limit = 50): Promise<{ data: InstagramMessage[] }> {
    const response = await fetch(`${this.baseUrl}/${conversationId}/messages?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })

    return await this.handleResponse(response)
  }

  async sendMessage(recipientId: string, message: string) {
    // Use the Page ID for messaging endpoint (same pattern as your working code)
    const senderId = this.pageId || this.instagramId
    
    console.log("[InstagramAPI] Sending text message:", {
      endpoint: `${this.baseUrl}/${senderId}/messages`,
      senderId,
      recipientId,
      messagePreview: message.substring(0, 50)
    })

    const messagePayload = {
      recipient: { id: recipientId },
      messaging_type: "RESPONSE",
      message: { text: message },
    }

    console.log("[InstagramAPI] Request payload:", JSON.stringify(messagePayload, null, 2))

    const response = await fetch(`${this.baseUrl}/${senderId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagePayload),
    })

    return await this.handleResponse(response)
  }

  async sendTextMessage(recipientId: string, text: string) {
    return this.sendMessage(recipientId, text)
  }

  async sendImageMessage(recipientId: string, imageUrl: string) {
    // Use the Page ID for messaging endpoint
    const senderId = this.pageId || this.instagramId
    
    console.log("[InstagramAPI] Sending image message:", {
      endpoint: `${this.baseUrl}/${senderId}/messages`,
      senderId,
      recipientId,
      imageUrl,
      isHttps: imageUrl.startsWith('https://')
    })

    if (!imageUrl.startsWith('https://')) {
      throw new Error('Image URL must use HTTPS protocol')
    }

    const messagePayload = {
      recipient: { id: recipientId },
      messaging_type: "RESPONSE",
      message: {
        attachment: {
          type: "image",
          payload: {
            url: imageUrl,
            is_reusable: true,
          },
        },
      },
    }

    console.log("[InstagramAPI] Image request payload:", JSON.stringify(messagePayload, null, 2))

    const response = await fetch(`${this.baseUrl}/${senderId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagePayload),
    })

    return await this.handleResponse(response)
  }

  async sendVideoMessage(recipientId: string, videoUrl: string) {
    const senderId = this.pageId || this.instagramId
    
    console.log("[InstagramAPI] Sending video message:", {
      endpoint: `${this.baseUrl}/${senderId}/messages`,
      senderId,
      recipientId,
      videoUrl,
      isHttps: videoUrl.startsWith('https://')
    })

    if (!videoUrl.startsWith('https://')) {
      throw new Error('Video URL must use HTTPS protocol')
    }

    const messagePayload = {
      recipient: { id: recipientId },
      messaging_type: "RESPONSE",
      message: {
        attachment: {
          type: "video",
          payload: {
            url: videoUrl,
            is_reusable: true,
          },
        },
      },
    }

    const response = await fetch(`${this.baseUrl}/${senderId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagePayload),
    })

    return await this.handleResponse(response)
  }

  async sendAudioMessage(recipientId: string, audioUrl: string) {
    const senderId = this.pageId || this.instagramId
    
    console.log("[InstagramAPI] Sending audio message:", {
      endpoint: `${this.baseUrl}/${senderId}/messages`,
      senderId,
      recipientId,
      audioUrl,
      isHttps: audioUrl.startsWith('https://')
    })

    if (!audioUrl.startsWith('https://')) {
      throw new Error('Audio URL must use HTTPS protocol')
    }

    const messagePayload = {
      recipient: { id: recipientId },
      messaging_type: "RESPONSE",
      message: {
        attachment: {
          type: "audio",
          payload: {
            url: audioUrl,
            is_reusable: true,
          },
        },
      },
    }

    const response = await fetch(`${this.baseUrl}/${senderId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagePayload),
    })

    return await this.handleResponse(response)
  }

  async sendGenericTemplate(recipientId: string, elements: any[]) {
    const senderId = this.pageId || this.instagramId
    
    console.log("[InstagramAPI] Sending generic template:", {
      endpoint: `${this.baseUrl}/${senderId}/messages`,
      senderId,
      recipientId,
      elementsCount: elements.length
    })

    const messagePayload = {
      recipient: { id: recipientId },
      messaging_type: "RESPONSE",
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: elements.slice(0, 10).map((card) => ({
              title: card.title.substring(0, 80),
              subtitle: card.subtitle?.substring(0, 80),
              image_url: card.image_url,
              buttons: card.buttons?.slice(0, 3).map((btn: any) => ({
                type: btn.url ? "web_url" : "postback",
                title: btn.title.substring(0, 20),
                url: btn.url,
                payload: btn.url ? undefined : btn.payload?.substring(0, 1000),
              })),
            })),
          },
        },
      },
    }

    const response = await fetch(`${this.baseUrl}/${senderId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagePayload),
    })

    return await this.handleResponse(response)
  }

  async uploadAttachment(type: "image" | "video" | "audio", url: string) {
    if (!this.pageId) {
      throw new Error("Page ID is required for attachment upload")
    }

    console.log("[InstagramAPI] Uploading attachment:", {
      endpoint: `${this.baseUrl}/${this.pageId}/message_attachments`,
      type,
      url
    })

    if (!url.startsWith('https://')) {
      throw new Error('Attachment URL must use HTTPS protocol')
    }

    const payload = {
      message: {
        attachment: {
          type,
          payload: {
            url,
            is_reusable: true,
          },
        },
      },
    }

    const response = await fetch(`${this.baseUrl}/${this.pageId}/message_attachments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    return await this.handleResponse(response)
  }

  // ============================================
  // COMMENTS & MENTIONS API
  // ============================================

  async getComments(mediaId: string): Promise<{ data: InstagramComment[] }> {
    const response = await fetch(`${this.baseUrl}/${mediaId}/comments?fields=id,text,username,timestamp`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })

    return await this.handleResponse(response)
  }

  async replyToComment(commentId: string, message: string) {
    const response = await fetch(`${this.baseUrl}/${commentId}/replies`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    })

    return await this.handleResponse(response)
  }

  async getMentionedComment(commentId: string) {
    const response = await fetch(
      `${this.baseUrl}/${this.instagramId}?fields=mentioned_comment.comment_id(${commentId})`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    )

    return await this.handleResponse(response)
  }

  async getMentionedMedia() {
    const response = await fetch(
      `${this.baseUrl}/${this.instagramId}?fields=mentioned_media.limit(50){id,caption,media_type,media_url,timestamp}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    )

    return await this.handleResponse(response)
  }

  async replyToMention(commentId: string, message: string) {
    const response = await fetch(`${this.baseUrl}/${this.instagramId}/mentions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment_id: commentId,
        message,
      }),
    })

    return await this.handleResponse(response)
  }

  // ============================================
  // STORY REPLIES API
  // ============================================

  async getStoryReplies(storyId: string) {
    const response = await fetch(`${this.baseUrl}/${storyId}/replies?fields=id,text,username,timestamp,from`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })

    return await this.handleResponse(response)
  }

  // ============================================
  // INSIGHTS & ANALYTICS
  // ============================================

  async getInsights(metrics: string[], period: "day" | "week" | "days_28" = "day") {
    const metricsParam = metrics.join(",")
    const response = await fetch(
      `${this.baseUrl}/${this.instagramId}/insights?metric=${metricsParam}&period=${period}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    )

    return await this.handleResponse(response)
  }

  async getMediaInsights(mediaId: string) {
    const response = await fetch(`${this.baseUrl}/${mediaId}/insights?metric=engagement,impressions,reach,saved`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })

    return await this.handleResponse(response)
  }

  async getAccountInsights(period: "day" | "week" | "days_28" = "day") {
    const response = await fetch(
      `${this.baseUrl}/${this.instagramId}/insights?metric=impressions,reach,profile_views,follower_count&period=${period}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    )

    return await this.handleResponse(response)
  }

  // ============================================
  // WEBHOOKS SETUP
  // ============================================

  async subscribeToWebhooks(fields: string[]) {
    if (!this.pageId) {
      throw new Error("Page ID is required for webhook subscription")
    }

    const response = await fetch(`${this.baseUrl}/${this.pageId}/subscribed_apps`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscribed_fields: fields.join(","),
      }),
    })

    return await this.handleResponse(response)
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export async function exchangeTokenForLongLived(shortLivedToken: string): Promise<InstagramTokenResponse> {
  const response = await fetch(
    `https://graph.instagram.com/access_token?` +
      `grant_type=ig_exchange_token&` +
      `client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&` +
      `access_token=${shortLivedToken}`,
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
    throw new Error(error.error?.message || "Failed to exchange token")
  }

  return response.json()
}