import {
  MessageSquare,
  ImageIcon,
  Hash,
  AtSign,
  Target,
  Send,
  Bot,
  Tag,
  Timer,
  GitBranch,
  User,
  Link2,
  Eye,
  MessageCircle,
  UserPlus,
  Images,
} from "lucide-react"

export const TRIGGER_TYPES = {
  new_message: {
    id: "new_message" as const,
    label: "New Direct Message",
    description: "When someone sends a DM to your account",
    icon: MessageSquare,
    requiresConfig: false,
  },
  story_reply: {
    id: "story_reply" as const,
    label: "Story Reply",
    description: "When someone replies to your Instagram story",
    icon: ImageIcon,
    requiresConfig: false,
  },
  comment: {
    id: "comment" as const,
    label: "New Comment",
    description: "When someone comments on your post",
    icon: Hash,
    requiresConfig: true,
  },
  mention: {
    id: "mention" as const,
    label: "Mention",
    description: "When someone @mentions you",
    icon: AtSign,
    requiresConfig: false,
  },
  keyword: {
    id: "keyword" as const,
    label: "Keyword Trigger",
    description: "When a message contains specific keywords",
    icon: Target,
    requiresConfig: true,
  },
  new_follower: {
    id: "new_follower" as const,
    label: "New Follower",
    description: "When someone follows your account",
    icon: UserPlus,
    requiresConfig: false,
  },
} as const

export const ACTION_TYPES = {
  send_message: {
    id: "send_message" as const,
    label: "Send Message",
    description: "Send a text message via DM",
    icon: Send,
    category: "messaging" as const,
  },
  send_image: {
    id: "send_image" as const,
    label: "Send Image",
    description: "Send an image via DM",
    icon: ImageIcon,
    category: "messaging" as const,
  },
  send_carousel: {
    id: "send_carousel" as const,
    label: "Send Carousel",
    description: "Send multiple images",
    icon: Images,
    category: "messaging" as const,
  },
  reply_to_comment: {
    id: "reply_to_comment" as const,
    label: "Reply to Comment",
    description: "Reply to a comment on your post",
    icon: MessageCircle,
    category: "messaging" as const,
  },
  hide_comment: {
    id: "hide_comment" as const,
    label: "Hide Comment",
    description: "Hide or unhide a comment",
    icon: Eye,
    category: "moderation" as const,
  },
  ai_response: {
    id: "ai_response" as const,
    label: "AI Response",
    description: "Generate intelligent AI-powered responses",
    icon: Bot,
    category: "ai" as const,
  },
  add_tag: {
    id: "add_tag" as const,
    label: "Add Tag",
    description: "Tag the conversation for organization",
    icon: Tag,
    category: "organization" as const,
  },
  delay: {
    id: "delay" as const,
    label: "Wait/Delay",
    description: "Add a time delay before next action",
    icon: Timer,
    category: "flow" as const,
  },
  condition: {
    id: "condition" as const,
    label: "Conditional Branch",
    description: "Create if/then/else logic branches",
    icon: GitBranch,
    category: "flow" as const,
  },
  human_handoff: {
    id: "human_handoff" as const,
    label: "Human Handoff",
    description: "Transfer conversation to a human agent",
    icon: User,
    category: "handoff" as const,
  },
  webhook: {
    id: "webhook" as const,
    label: "Webhook",
    description: "Send data to external service",
    icon: Link2,
    category: "integration" as const,
  },
} as const

export const ACTION_CATEGORIES = [
  { id: "all", label: "All Actions" },
  { id: "messaging", label: "Messaging" },
  { id: "ai", label: "AI Powered" },
  { id: "organization", label: "Organization" },
  { id: "moderation", label: "Moderation" },
  { id: "flow", label: "Flow Control" },
  { id: "handoff", label: "Handoff" },
  { id: "integration", label: "Integration" },
] as const

export const CONDITION_OPERATORS = [
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does not contain" },
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Does not equal" },
  { value: "starts_with", label: "Starts with" },
  { value: "ends_with", label: "Ends with" },
  { value: "greater_than", label: "Greater than" },
  { value: "less_than", label: "Less than" },
  { value: "is_empty", label: "Is empty" },
  { value: "is_not_empty", label: "Is not empty" },
] as const

export const CONDITION_FIELDS = [
  { value: "message", label: "Message text" },
  { value: "username", label: "Username" },
  { value: "follower_count", label: "Follower count" },
  { value: "is_verified", label: "Is verified" },
  { value: "first_name", label: "First name" },
  { value: "last_name", label: "Last name" },
] as const

export const AI_TONES = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "casual", label: "Casual" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "helpful", label: "Helpful" },
  { value: "formal", label: "Formal" },
] as const

export const AVAILABLE_VARIABLES = [
  { value: "{username}", label: "Username" },
  { value: "{first_name}", label: "First Name" },
  { value: "{last_name}", label: "Last Name" },
  { value: "{full_name}", label: "Full Name" },
  { value: "{message}", label: "Message Text" },
  { value: "{follower_count}", label: "Follower Count" },
]
