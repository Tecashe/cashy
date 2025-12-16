export type TriggerType = "DM_RECEIVED" | "FIRST_MESSAGE" | "KEYWORD" | "STORY_REPLY" | "COMMENT" | "MENTION"

export type ActionType =
  | "SEND_MESSAGE"
  | "SEND_IMAGE"
  | "REPLY_TO_COMMENT"
  | "HIDE_COMMENT"
  | "AI_RESPONSE"
  | "ADD_TAG"
  | "DELAY"
  | "CONDITION"
  | "SEND_TO_HUMAN"
  | "WEBHOOK"

export interface Trigger {
  id: string
  type: TriggerType
  config: TriggerConfig
}

export interface TriggerConfig {
  // For keyword triggers
  keywords?: string[]
  keywordMatchType?: "any" | "all" | "exact"

  // For comment triggers
  postId?: string
  postType?: "specific" | "any" | "next"
  commentKeywords?: string[]
  commentMatchType?: "any" | "exact"

  // Generic conditions
  [key: string]: any
}

export interface Action {
  id: string
  type: ActionType
  config: ActionConfig
  parentId?: string | null
  branchType?: "true" | "false" | null
}

export interface ActionConfig {
  // Message actions
  message?: string
  imageUrl?: string
  quickReplies?: QuickReply[]

  // AI Response
  tone?: string
  useKnowledgeBase?: boolean
  customInstructions?: string
  maxLength?: number

  // Tag
  tagId?: string
  tagName?: string
  tagColor?: string

  // Delay
  delayAmount?: number
  delayUnit?: "minutes" | "hours" | "days"

  // Condition
  conditionField?: string
  conditionOperator?: "equals" | "contains" | "starts_with" | "ends_with" | "greater_than" | "less_than" | "exists"
  conditionValue?: string
  logic?: "AND" | "OR"
  conditions?: ConditionRule[]

  // Webhook
  webhookUrl?: string
  webhookMethod?: "GET" | "POST" | "PUT"
  webhookHeaders?: Record<string, string>
  webhookBody?: string

  // Comment actions
  hideComment?: boolean

  [key: string]: any
}

export interface QuickReply {
  id: string
  text: string
  payload?: string
}

export interface ConditionRule {
  id: string
  field: string
  operator: string
  value: string
}

export interface AutomationData {
  id?: string
  name: string
  description?: string
  instagramAccountId?: string
  triggers: Trigger[]
  triggerLogic: "AND" | "OR"
  actions: Action[]
  isActive: boolean
  status?: string
}

export interface Variable {
  id: string
  name: string
  description: string
  example: string
}

export const AVAILABLE_VARIABLES: Variable[] = [
  { id: "name", name: "{name}", description: "User's full name", example: "John Doe" },
  { id: "first_name", name: "{first_name}", description: "User's first name", example: "John" },
  { id: "username", name: "{username}", description: "Instagram username", example: "@johndoe" },
  { id: "message", name: "{message}", description: "Their message content", example: "Hello!" },
  { id: "post_caption", name: "{post_caption}", description: "Post caption text", example: "Check out..." },
]

export const AI_TONES = [
  { value: "professional", label: "Professional", description: "Formal and business-like" },
  { value: "friendly", label: "Friendly", description: "Warm and approachable" },
  { value: "casual", label: "Casual", description: "Relaxed and conversational" },
  { value: "enthusiastic", label: "Enthusiastic", description: "Energetic and excited" },
  { value: "empathetic", label: "Empathetic", description: "Understanding and caring" },
  { value: "concise", label: "Concise", description: "Brief and to the point" },
]

export const CONDITION_FIELDS = [
  { value: "message_content", label: "Message Content" },
  { value: "username", label: "Username" },
  { value: "follower_count", label: "Follower Count" },
  { value: "tag", label: "Has Tag" },
  { value: "message_count", label: "Message Count" },
  { value: "first_message", label: "Is First Message" },
]

export const CONDITION_OPERATORS = [
  { value: "equals", label: "Equals" },
  { value: "contains", label: "Contains" },
  { value: "starts_with", label: "Starts with" },
  { value: "ends_with", label: "Ends with" },
  { value: "greater_than", label: "Greater than" },
  { value: "less_than", label: "Less than" },
  { value: "exists", label: "Exists" },
]
