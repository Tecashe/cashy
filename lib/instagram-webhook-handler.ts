interface WebhookEntry {
  id: string
  time: number
  messaging?: MessagingEvent[]
  changes?: ChangeEvent[]
}

interface MessagingEvent {
  sender: { id: string }
  recipient: { id: string }
  timestamp: number
  message?: {
    mid: string
    text?: string
    attachments?: any[]
  }
  postback?: {
    title: string
    payload: string
  }
}

interface ChangeEvent {
  field: string
  value: {
    id: string
    media_id?: string
    comment_id?: string
    text?: string
    from?: { id: string; username: string }
  }
}

export class InstagramWebhookHandler {
  static verifyWebhook(mode: string, token: string, challenge: string, verifyToken: string): string | null {
    if (mode === "subscribe" && token === verifyToken) {
      return challenge
    }
    return null
  }

  static async processWebhook(body: any) {
    const events: any[] = []

    if (body.object === "instagram") {
      for (const entry of body.entry) {
        // Handle messaging events (DMs, story replies)
        if (entry.messaging) {
          for (const messagingEvent of entry.messaging) {
            if (messagingEvent.message) {
              events.push({
                type: "MESSAGE_RECEIVED",
                senderId: messagingEvent.sender.id,
                recipientId: messagingEvent.recipient.id,
                timestamp: messagingEvent.timestamp,
                message: messagingEvent.message,
              })
            }
          }
        }

        // Handle changes (comments, mentions)
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === "comments") {
              events.push({
                type: "COMMENT_RECEIVED",
                mediaId: change.value.media_id,
                commentId: change.value.id,
                text: change.value.text,
                from: change.value.from,
                timestamp: entry.time,
              })
            } else if (change.field === "mentions") {
              events.push({
                type: "MENTION_RECEIVED",
                mediaId: change.value.media_id,
                commentId: change.value.comment_id,
                from: change.value.from,
                timestamp: entry.time,
              })
            }
          }
        }
      }
    }

    return events
  }

  static matchesTriggerConditions(event: any, trigger: any): boolean {
    switch (trigger.type) {
      case "DM_RECEIVED":
        return event.type === "MESSAGE_RECEIVED"

      case "FIRST_MESSAGE":
        // This would need to check if it's the first message from this user
        return event.type === "MESSAGE_RECEIVED"

      case "KEYWORD":
        if (event.type === "MESSAGE_RECEIVED" && event.message?.text) {
          const text = event.message.text.toLowerCase()
          const keywords = trigger.data.keywords || []
          const matchType = trigger.data.matchType || "contains"

          return keywords.some((keyword: string) => {
            const kw = keyword.toLowerCase()
            if (matchType === "exact") {
              return text === kw
            } else if (matchType === "starts_with") {
              return text.startsWith(kw)
            } else {
              return text.includes(kw)
            }
          })
        }
        return false

      case "STORY_REPLY":
        return event.type === "MESSAGE_RECEIVED" && event.message?.is_story_reply

      case "COMMENT_RECEIVED":
        return event.type === "COMMENT_RECEIVED"

      case "MENTION_RECEIVED":
        return event.type === "MENTION_RECEIVED"

      case "POST_PUBLISHED":
        return event.type === "POST_PUBLISHED"

      default:
        return false
    }
  }
}
