export interface AutomationTemplate {
  id: string
  name: string
  description: string
  category: "welcome" | "sales" | "support" | "engagement"
  icon: string
  triggerType: string
  triggerConditions: any
  actions: Array<{
    type: string
    content: any
    order: number
  }>
}

export const automationTemplates: AutomationTemplate[] = [
  {
    id: "welcome-new-follower",
    name: "Welcome New Followers",
    description: "Automatically greet new followers when they send their first message",
    category: "welcome",
    icon: "wave",
    triggerType: "FIRST_MESSAGE",
    triggerConditions: {},
    actions: [
      {
        type: "SEND_MESSAGE",
        order: 0,
        content: {
          message: "Hey {name}! Thanks for following us! How can we help you today?",
        },
      },
      {
        type: "ADD_TAG",
        order: 1,
        content: {
          tagName: "New Follower",
        },
      },
    ],
  },
  {
    id: "pricing-inquiry",
    name: "Pricing Inquiry Handler",
    description: "Respond to pricing questions with product information",
    category: "sales",
    icon: "dollar",
    triggerType: "KEYWORD",
    triggerConditions: {
      keywords: ["price", "pricing", "cost", "how much"],
      matchType: "contains",
    },
    actions: [
      {
        type: "SEND_MESSAGE",
        order: 0,
        content: {
          message:
            "Thanks for your interest! I'd love to share our pricing with you. What product are you interested in?",
        },
      },
      {
        type: "ADD_TAG",
        order: 1,
        content: {
          tagName: "Pricing Interest",
        },
      },
      {
        type: "DELAY",
        order: 2,
        content: {
          delayAmount: "5",
          delayUnit: "minutes",
        },
      },
      {
        type: "SEND_MESSAGE",
        order: 3,
        content: {
          message: "Still have questions? Feel free to ask! Our team is here to help.",
        },
      },
    ],
  },
  {
    id: "story-reply-handler",
    name: "Story Reply Engagement",
    description: "Engage with people who reply to your stories",
    category: "engagement",
    icon: "camera",
    triggerType: "STORY_REPLY",
    triggerConditions: {},
    actions: [
      {
        type: "SEND_MESSAGE",
        order: 0,
        content: {
          message: "Thanks for the reply, {name}! Glad you enjoyed our story!",
        },
      },
      {
        type: "ADD_TAG",
        order: 1,
        content: {
          tagName: "Story Engaged",
        },
      },
    ],
  },
  {
    id: "lead-qualification",
    name: "Lead Qualification Bot",
    description: "Qualify leads with AI-powered responses",
    category: "sales",
    icon: "target",
    triggerType: "KEYWORD",
    triggerConditions: {
      keywords: ["interested", "learn more", "info", "information"],
      matchType: "contains",
    },
    actions: [
      {
        type: "AI_RESPONSE",
        order: 0,
        content: {
          customInstructions: "Qualify the lead by understanding their needs and budget. Be friendly and helpful.",
        },
      },
      {
        type: "ADD_TAG",
        order: 1,
        content: {
          tagName: "Qualified Lead",
        },
      },
      {
        type: "DELAY",
        order: 2,
        content: {
          delayAmount: "10",
          delayUnit: "minutes",
        },
      },
      {
        type: "SEND_TO_HUMAN",
        order: 3,
        content: {
          reason: "Qualified lead ready for sales team",
        },
      },
    ],
  },
  {
    id: "support-ticket",
    name: "Support Ticket System",
    description: "Create support tickets for customer issues",
    category: "support",
    icon: "ticket",
    triggerType: "KEYWORD",
    triggerConditions: {
      keywords: ["help", "problem", "issue", "bug", "error"],
      matchType: "contains",
    },
    actions: [
      {
        type: "SEND_MESSAGE",
        order: 0,
        content: {
          message: "I'm sorry you're experiencing an issue, {name}! Let me help you with that.",
        },
      },
      {
        type: "ADD_TAG",
        order: 1,
        content: {
          tagName: "Support Needed",
        },
      },
      {
        type: "AI_RESPONSE",
        order: 2,
        content: {
          customInstructions:
            "Gather information about the issue. Ask clarifying questions to understand the problem better.",
        },
      },
      {
        type: "SEND_TO_HUMAN",
        order: 3,
        content: {
          reason: "Support ticket - needs human review",
        },
      },
    ],
  },
  {
    id: "appointment-booking",
    name: "Appointment Scheduler",
    description: "Help customers book appointments or consultations",
    category: "sales",
    icon: "calendar",
    triggerType: "KEYWORD",
    triggerConditions: {
      keywords: ["appointment", "schedule", "booking", "consultation", "meet"],
      matchType: "contains",
    },
    actions: [
      {
        type: "SEND_MESSAGE",
        order: 0,
        content: {
          message: "Great! I'd love to help you schedule an appointment. What day works best for you?",
        },
      },
      {
        type: "ADD_TAG",
        order: 1,
        content: {
          tagName: "Booking Interest",
        },
      },
      {
        type: "WEBHOOK",
        order: 2,
        content: {
          webhookUrl: "https://your-calendar-system.com/webhook",
        },
      },
    ],
  },
  {
    id: "faq-handler",
    name: "FAQ Auto-Responder",
    description: "Answer common questions automatically with AI",
    category: "support",
    icon: "question",
    triggerType: "DM_RECEIVED",
    triggerConditions: {},
    actions: [
      {
        type: "AI_RESPONSE",
        order: 0,
        content: {
          customInstructions: "Answer frequently asked questions about the business. Be concise and helpful.",
        },
      },
      {
        type: "CONDITION",
        order: 1,
        content: {
          field: "confidence",
          operator: "less_than",
          value: "0.7",
        },
      },
    ],
  },
  {
    id: "thank-you-after-purchase",
    name: "Post-Purchase Thank You",
    description: "Thank customers after they make a purchase",
    category: "engagement",
    icon: "celebration",
    triggerType: "KEYWORD",
    triggerConditions: {
      keywords: ["purchased", "bought", "ordered"],
      matchType: "contains",
    },
    actions: [
      {
        type: "DELAY",
        order: 0,
        content: {
          delayAmount: "1",
          delayUnit: "hours",
        },
      },
      {
        type: "SEND_MESSAGE",
        order: 1,
        content: {
          message:
            "Thank you so much for your purchase, {name}! We hope you love it! If you have any questions, we're here to help.",
        },
      },
      {
        type: "ADD_TAG",
        order: 2,
        content: {
          tagName: "Customer",
        },
      },
      {
        type: "DELAY",
        order: 3,
        content: {
          delayAmount: "3",
          delayUnit: "days",
        },
      },
      {
        type: "SEND_MESSAGE",
        order: 4,
        content: {
          message: "Hey {name}! How are you enjoying your purchase? We'd love to hear your feedback!",
        },
      },
    ],
  },
]

export function getTemplatesByCategory(category: string) {
  return automationTemplates.filter((t) => t.category === category)
}

export function getTemplateById(id: string) {
  return automationTemplates.find((t) => t.id === id)
}
