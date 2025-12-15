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


interface InstagramProfile {
  id: string
  username: string
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
  media_id: string
  from: { id: string; username: string }
  parent_id?: string
}

interface InstagramMention {
  id: string
  media_id: string
  comment_id?: string
  timestamp: string
}

export class InstagramAPI {
  private accessToken: string
  private instagramId: string
  private pageId?: string

  constructor(config: { accessToken: string; instagramId: string; pageId?: string }) {
    this.accessToken = config.accessToken
    this.instagramId = config.instagramId
    this.pageId = config.pageId
  }

  static async refreshAccessToken(currentToken: string): Promise<InstagramTokenResponse> {
    const response = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`,
    )

    if (!response.ok) {
      throw new Error("Failed to refresh Instagram access token")
    }

    return response.json()
  }

  async getProfile(): Promise<InstagramProfile> {
    const response = await fetch(
      `https://graph.instagram.com/${this.instagramId}?fields=id,username,profile_picture_url,followers_count,follows_count,media_count&access_token=${this.accessToken}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch Instagram profile")
    }

    return response.json()
  }

  async getMediaList(limit = 25) {
    const response = await fetch(
      `https://graph.instagram.com/${this.instagramId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${limit}&access_token=${this.accessToken}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch Instagram media")
    }

    return response.json()
  }

  async getConversations(limit = 50) {
    const response = await fetch(
      `https://graph.instagram.com/${this.instagramId}/conversations?fields=id,participants,messages&limit=${limit}&access_token=${this.accessToken}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch Instagram conversations")
    }

    return response.json()
  }

  async sendMessage(recipientId: string, message: string) {
    const response = await fetch(`https://graph.instagram.com/v21.0/me/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message },
        access_token: this.accessToken,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to send Instagram message")
    }

    return response.json()
  }

  // ============================================
  // MESSAGING API - Full capabilities
  // ============================================

  async sendTextMessage(recipientId: string, text: string) {
    const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text },
        access_token: this.accessToken,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to send message: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async sendImageMessage(recipientId: string, imageUrl: string) {
    const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: {
          attachment: {
            type: "image",
            payload: {
              url: imageUrl,
              is_reusable: true,
            },
          },
        },
        access_token: this.accessToken,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to send image: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async sendVideoMessage(recipientId: string, videoUrl: string) {
    const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: {
          attachment: {
            type: "video",
            payload: {
              url: videoUrl,
              is_reusable: true,
            },
          },
        },
        access_token: this.accessToken,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to send video: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async sendAudioMessage(recipientId: string, audioUrl: string) {
    const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: {
          attachment: {
            type: "audio",
            payload: {
              url: audioUrl,
              is_reusable: true,
            },
          },
        },
        access_token: this.accessToken,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to send audio: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async sendGenericTemplate(recipientId: string, elements: any[]) {
    const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements,
            },
          },
        },
        access_token: this.accessToken,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to send template: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async uploadAttachment(type: "image" | "video" | "audio", url: string) {
    if (!this.pageId) {
      throw new Error("Page ID is required for attachment upload")
    }

    const response = await fetch(`https://graph.facebook.com/v21.0/${this.pageId}/message_attachments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        platform: "instagram",
        message: {
          attachment: {
            type,
            payload: {
              url,
              is_reusable: true,
            },
          },
        },
        access_token: this.accessToken,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to upload attachment: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  // ============================================
  // COMMENTS & MENTIONS API
  // ============================================

  async getComments(mediaId: string) {
    const response = await fetch(
      `https://graph.instagram.com/${mediaId}/comments?fields=id,text,username,timestamp,from,replies&access_token=${this.accessToken}`,
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to fetch comments: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async replyToComment(commentId: string, message: string) {
    const response = await fetch(`https://graph.instagram.com/${commentId}/replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        access_token: this.accessToken,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to reply to comment: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async getMentionedComment(commentId: string) {
    const response = await fetch(
      `https://graph.instagram.com/${this.instagramId}?fields=mentioned_comment.comment_id(${commentId})&access_token=${this.accessToken}`,
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to get mentioned comment: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async getMentionedMedia() {
    const response = await fetch(
      `https://graph.instagram.com/${this.instagramId}?fields=mentioned_media.limit(50){id,caption,media_type,media_url,timestamp}&access_token=${this.accessToken}`,
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to get mentioned media: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async replyToMention(commentId: string, message: string) {
    const response = await fetch(`https://graph.instagram.com/${this.instagramId}/mentions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment_id: commentId,
        message,
        access_token: this.accessToken,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to reply to mention: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  // ============================================
  // STORY REPLIES API
  // ============================================

  async getStoryReplies(storyId: string) {
    const response = await fetch(
      `https://graph.instagram.com/${storyId}/replies?fields=id,text,username,timestamp,from&access_token=${this.accessToken}`,
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to fetch story replies: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  // ============================================
  // INSIGHTS & ANALYTICS
  // ============================================

  async getMediaInsights(mediaId: string) {
    const response = await fetch(
      `https://graph.instagram.com/${mediaId}/insights?metric=engagement,impressions,reach,saved&access_token=${this.accessToken}`,
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to fetch media insights: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async getAccountInsights(period: "day" | "week" | "days_28" = "day") {
    const response = await fetch(
      `https://graph.instagram.com/${this.instagramId}/insights?metric=impressions,reach,profile_views,follower_count&period=${period}&access_token=${this.accessToken}`,
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to fetch account insights: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  // ============================================
  // WEBHOOKS SETUP
  // ============================================

  async subscribeToWebhooks(fields: string[]) {
    if (!this.pageId) {
      throw new Error("Page ID is required for webhook subscription")
    }

    const response = await fetch(`https://graph.facebook.com/v21.0/${this.pageId}/subscribed_apps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscribed_fields: fields.join(","),
        access_token: this.accessToken,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to subscribe to webhooks: ${JSON.stringify(error)}`)
    }

    return response.json()
  }
}
