export type TriggerType =
  | "new_message" // When someone sends a DM
  | "story_reply" // When someone replies to a story
  | "comment" // When someone comments on a post
  | "mention" // When someone @mentions in comments
  | "new_follower" // When someone follows the account
  | "keyword" // When message contains specific keywords

export type ActionType =
  | "send_message" // Send a text message
  | "send_image" // Send an image via DM
  | "send_carousel" // Send multiple images
  | "ai_response" // AI-generated response
  | "add_tag" // Tag the conversation
  | "delay" // Wait before next action
  | "condition" // Branch based on condition
  | "human_handoff" // Transfer to human agent
  | "reply_to_comment" // Reply to the comment
  | "hide_comment" // Hide/unhide comment
  | "webhook" // Send data to external URL

export interface TriggerConfig {
  type: TriggerType
  config: {
    // For keyword trigger
    keywords?: string[]
    matchType?: "any" | "all" | "exact"
    // For comment trigger
    postId?: string
    // Generic metadata
    [key: string]: any
  }
}

export interface ActionConfig {
  type: ActionType
  config: {
    // For message actions
    message?: string
    // For image actions
    imageUrl?: string
    images?: string[]
    // For AI response
    aiPrompt?: string
    aiKnowledgeBase?: string
    aiInstructions?: string
    temperature?: number
    maxTokens?: number
    // For tags
    tag?: string
    // For delay
    delayMinutes?: number
    delayHours?: number
    // For conditions
    conditionType?: "contains" | "equals" | "greater_than" | "less_than"
    conditionValue?: string
    conditionField?: string
    // For webhook
    webhookUrl?: string
    webhookMethod?: "GET" | "POST"
    webhookHeaders?: Record<string, string>
    webhookBody?: string
    // Generic metadata
    [key: string]: any
  }
  // For conditional branching
  trueBranch?: ActionConfig[]
  falseBranch?: ActionConfig[]
}

export interface AutomationFlow {
  id?: string
  name: string
  description?: string
  instagramAccountId: string
  trigger: TriggerConfig
  actions: ActionConfig[]
  isActive: boolean
}
