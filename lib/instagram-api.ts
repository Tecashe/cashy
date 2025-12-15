interface InstagramAccount {
  accessToken: string
  instagramId: string
}

interface RateLimitInfo {
  remaining: number
  reset: Date
}

export class InstagramAPI {
  private accessToken: string
  private instagramId: string
  private baseUrl = "https://graph.instagram.com/v21.0"
  private rateLimitInfo: RateLimitInfo | null = null

  constructor(account: InstagramAccount) {
    this.accessToken = account.accessToken
    this.instagramId = account.instagramId
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

      // Handle specific error codes
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.")
      }

      if (response.status === 401) {
        throw new Error("Instagram access token expired. Please reconnect your account.")
      }

      if (response.status === 400 && error.error?.code === 10) {
        throw new Error("Permission denied. Please ensure all required permissions are granted.")
      }

      throw new Error(error.error?.message || `Instagram API Error: ${response.status}`)
    }

    return await response.json()
  }

  async sendMessage(recipientId: string, message: string) {
    const response = await fetch(`${this.baseUrl}/${this.instagramId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message },
      }),
    })

    return await this.handleResponse(response)
  }

  async getConversation(userId: string) {
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

  async getMessages(conversationId: string, limit = 50) {
    const response = await fetch(`${this.baseUrl}/${conversationId}/messages?limit=${limit}`, {
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

  async getComments(mediaId: string) {
    const response = await fetch(`${this.baseUrl}/${mediaId}/comments?fields=id,text,username,timestamp`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })

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

  async getProfile() {
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

  getRateLimitInfo(): RateLimitInfo | null {
    return this.rateLimitInfo
  }

  static async refreshAccessToken(currentToken: string) {
    const response = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`,
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
      throw new Error(error.error?.message || "Failed to refresh token")
    }

    return await response.json()
  }
}

export async function exchangeTokenForLongLived(shortLivedToken: string) {
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

  return await response.json()
}
