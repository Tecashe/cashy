// export type TriggerType = "new_message" | "story_reply" | "comment" | "mention" | "new_follower" | "keyword"

// export type ActionType =
//   | "send_message"
//   | "send_image"
//   | "send_carousel"
//   | "ai_response"
//   | "add_tag"
//   | "delay"
//   | "condition"
//   | "human_handoff"
//   | "reply_to_comment"
//   | "hide_comment"
//   | "webhook"

// export type LogicOperator = "AND" | "OR"

// export type ConditionOperator =
//   | "contains"
//   | "not_contains"
//   | "equals"
//   | "not_equals"
//   | "starts_with"
//   | "ends_with"
//   | "greater_than"
//   | "less_than"
//   | "is_empty"
//   | "is_not_empty"

// export interface TriggerConfig {
//   type: TriggerType
//   config: {
//     keywords?: string[]
//     matchType?: "any" | "all" | "exact"
//     postId?: string
//     [key: string]: any
//   }
// }

// export interface ConditionRule {
//   id: string
//   field: string
//   operator: ConditionOperator
//   value: string
// }

// export interface ConditionGroup {
//   id: string
//   operator: LogicOperator
//   rules: ConditionRule[]
// }

// export interface ActionConfig {
//   id: string
//   type: ActionType
//   config: {
//     message?: string
//     imageUrl?: string
//     images?: string[]
//     aiPrompt?: string
//     aiKnowledgeBase?: boolean
//     aiInstructions?: string
//     tone?: string
//     temperature?: number
//     maxTokens?: number
//     tag?: string
//     delayMinutes?: number
//     delayHours?: number
//     delayDays?: number
//     conditionGroups?: ConditionGroup[]
//     webhookUrl?: string
//     webhookMethod?: "GET" | "POST"
//     webhookHeaders?: Record<string, string>
//     webhookBody?: string
//     shouldHide?: boolean
//     [key: string]: any
//   }
//   trueBranch?: ActionConfig[]
//   falseBranch?: ActionConfig[]
// }

// export interface AutomationFlow {
//   id?: string
//   name: string
//   description?: string
//   instagramAccountId: string
//   triggers: TriggerConfig[]
//   triggerLogic: LogicOperator
//   actions: ActionConfig[]
//   isActive: boolean
// }

export type TriggerType = "new_message" | "story_reply" | "comment" | "mention" | "new_follower" | "keyword"

export type ActionType =
  | "send_message"
  | "send_image"
  | "send_carousel"
  | "ai_response"
  | "add_tag"
  | "delay"
  | "condition"
  | "human_handoff"
  | "reply_to_comment"
  | "hide_comment"
  | "webhook"

export type LogicOperator = "AND" | "OR"

export type ConditionOperator =
  | "contains"
  | "not_contains"
  | "equals"
  | "not_equals"
  | "starts_with"
  | "ends_with"
  | "greater_than"
  | "less_than"
  | "is_empty"
  | "is_not_empty"

export interface TriggerConfig {
  type: TriggerType
  config: {
    listenMode?: "any" | "keywords" | "first_time" | "question"
    keywords?: string[]
    matchType?: "any" | "all" | "exact"
    postId?: string
    postIds?: string[]
    storyIds?: string[]
    [key: string]: any
  }
}

export interface ConditionRule {
  id: string
  field: string
  operator: ConditionOperator
  value: string
}

export interface ConditionGroup {
  id: string
  operator: LogicOperator
  rules: ConditionRule[]
}

export interface ActionConfig {
  id: string
  type: ActionType
  config: {
    message?: string
    imageUrl?: string
    images?: string[]
    aiPrompt?: string
    aiKnowledgeBase?: boolean
    aiInstructions?: string
    tone?: string
    temperature?: number
    maxTokens?: number
    tag?: string
    delayMinutes?: number
    delayHours?: number
    delayDays?: number
    conditionGroups?: ConditionGroup[]
    webhookUrl?: string
    webhookMethod?: "GET" | "POST"
    webhookHeaders?: Record<string, string>
    webhookBody?: string
    shouldHide?: boolean
    [key: string]: any
  }
  trueBranch?: ActionConfig[]
  falseBranch?: ActionConfig[]
}

export interface AutomationFlow {
  id?: string
  name: string
  description?: string
  instagramAccountId: string
  triggers: TriggerConfig[]
  triggerLogic: LogicOperator
  actions: ActionConfig[]
  isActive: boolean
}

export interface InstagramPost {
  id: string
  caption: string
  mediaType: string
  mediaUrl: string
  thumbnailUrl?: string
  permalink?: string
  timestamp: string
}

export interface InstagramStory {
  id: string
  caption: string
  mediaType: string
  mediaUrl: string
  thumbnailUrl?: string
  timestamp: string
}
