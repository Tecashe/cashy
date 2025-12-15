// export interface AutomationTemplate {
//   id: string
//   name: string
//   description: string
//   category: "welcome" | "sales" | "support" | "engagement"
//   icon: string
//   triggerType: string
//   triggerConditions: any
//   actions: Array<{
//     type: string
//     content: any
//     order: number
//   }>
// }

// export const automationTemplates: AutomationTemplate[] = [
//   {
//     id: "welcome-new-follower",
//     name: "Welcome New Followers",
//     description: "Automatically greet new followers when they send their first message",
//     category: "welcome",
//     icon: "wave",
//     triggerType: "FIRST_MESSAGE",
//     triggerConditions: {},
//     actions: [
//       {
//         type: "SEND_MESSAGE",
//         order: 0,
//         content: {
//           message: "Hey {name}! Thanks for following us! How can we help you today?",
//         },
//       },
//       {
//         type: "ADD_TAG",
//         order: 1,
//         content: {
//           tagName: "New Follower",
//         },
//       },
//     ],
//   },
//   {
//     id: "pricing-inquiry",
//     name: "Pricing Inquiry Handler",
//     description: "Respond to pricing questions with product information",
//     category: "sales",
//     icon: "dollar",
//     triggerType: "KEYWORD",
//     triggerConditions: {
//       keywords: ["price", "pricing", "cost", "how much"],
//       matchType: "contains",
//     },
//     actions: [
//       {
//         type: "SEND_MESSAGE",
//         order: 0,
//         content: {
//           message:
//             "Thanks for your interest! I'd love to share our pricing with you. What product are you interested in?",
//         },
//       },
//       {
//         type: "ADD_TAG",
//         order: 1,
//         content: {
//           tagName: "Pricing Interest",
//         },
//       },
//       {
//         type: "DELAY",
//         order: 2,
//         content: {
//           delayAmount: "5",
//           delayUnit: "minutes",
//         },
//       },
//       {
//         type: "SEND_MESSAGE",
//         order: 3,
//         content: {
//           message: "Still have questions? Feel free to ask! Our team is here to help.",
//         },
//       },
//     ],
//   },
//   {
//     id: "story-reply-handler",
//     name: "Story Reply Engagement",
//     description: "Engage with people who reply to your stories",
//     category: "engagement",
//     icon: "camera",
//     triggerType: "STORY_REPLY",
//     triggerConditions: {},
//     actions: [
//       {
//         type: "SEND_MESSAGE",
//         order: 0,
//         content: {
//           message: "Thanks for the reply, {name}! Glad you enjoyed our story!",
//         },
//       },
//       {
//         type: "ADD_TAG",
//         order: 1,
//         content: {
//           tagName: "Story Engaged",
//         },
//       },
//     ],
//   },
//   {
//     id: "lead-qualification",
//     name: "Lead Qualification Bot",
//     description: "Qualify leads with AI-powered responses",
//     category: "sales",
//     icon: "target",
//     triggerType: "KEYWORD",
//     triggerConditions: {
//       keywords: ["interested", "learn more", "info", "information"],
//       matchType: "contains",
//     },
//     actions: [
//       {
//         type: "AI_RESPONSE",
//         order: 0,
//         content: {
//           customInstructions: "Qualify the lead by understanding their needs and budget. Be friendly and helpful.",
//         },
//       },
//       {
//         type: "ADD_TAG",
//         order: 1,
//         content: {
//           tagName: "Qualified Lead",
//         },
//       },
//       {
//         type: "DELAY",
//         order: 2,
//         content: {
//           delayAmount: "10",
//           delayUnit: "minutes",
//         },
//       },
//       {
//         type: "SEND_TO_HUMAN",
//         order: 3,
//         content: {
//           reason: "Qualified lead ready for sales team",
//         },
//       },
//     ],
//   },
//   {
//     id: "support-ticket",
//     name: "Support Ticket System",
//     description: "Create support tickets for customer issues",
//     category: "support",
//     icon: "ticket",
//     triggerType: "KEYWORD",
//     triggerConditions: {
//       keywords: ["help", "problem", "issue", "bug", "error"],
//       matchType: "contains",
//     },
//     actions: [
//       {
//         type: "SEND_MESSAGE",
//         order: 0,
//         content: {
//           message: "I'm sorry you're experiencing an issue, {name}! Let me help you with that.",
//         },
//       },
//       {
//         type: "ADD_TAG",
//         order: 1,
//         content: {
//           tagName: "Support Needed",
//         },
//       },
//       {
//         type: "AI_RESPONSE",
//         order: 2,
//         content: {
//           customInstructions:
//             "Gather information about the issue. Ask clarifying questions to understand the problem better.",
//         },
//       },
//       {
//         type: "SEND_TO_HUMAN",
//         order: 3,
//         content: {
//           reason: "Support ticket - needs human review",
//         },
//       },
//     ],
//   },
//   {
//     id: "appointment-booking",
//     name: "Appointment Scheduler",
//     description: "Help customers book appointments or consultations",
//     category: "sales",
//     icon: "calendar",
//     triggerType: "KEYWORD",
//     triggerConditions: {
//       keywords: ["appointment", "schedule", "booking", "consultation", "meet"],
//       matchType: "contains",
//     },
//     actions: [
//       {
//         type: "SEND_MESSAGE",
//         order: 0,
//         content: {
//           message: "Great! I'd love to help you schedule an appointment. What day works best for you?",
//         },
//       },
//       {
//         type: "ADD_TAG",
//         order: 1,
//         content: {
//           tagName: "Booking Interest",
//         },
//       },
//       {
//         type: "WEBHOOK",
//         order: 2,
//         content: {
//           webhookUrl: "https://your-calendar-system.com/webhook",
//         },
//       },
//     ],
//   },
//   {
//     id: "faq-handler",
//     name: "FAQ Auto-Responder",
//     description: "Answer common questions automatically with AI",
//     category: "support",
//     icon: "question",
//     triggerType: "DM_RECEIVED",
//     triggerConditions: {},
//     actions: [
//       {
//         type: "AI_RESPONSE",
//         order: 0,
//         content: {
//           customInstructions: "Answer frequently asked questions about the business. Be concise and helpful.",
//         },
//       },
//       {
//         type: "CONDITION",
//         order: 1,
//         content: {
//           field: "confidence",
//           operator: "less_than",
//           value: "0.7",
//         },
//       },
//     ],
//   },
//   {
//     id: "thank-you-after-purchase",
//     name: "Post-Purchase Thank You",
//     description: "Thank customers after they make a purchase",
//     category: "engagement",
//     icon: "celebration",
//     triggerType: "KEYWORD",
//     triggerConditions: {
//       keywords: ["purchased", "bought", "ordered"],
//       matchType: "contains",
//     },
//     actions: [
//       {
//         type: "DELAY",
//         order: 0,
//         content: {
//           delayAmount: "1",
//           delayUnit: "hours",
//         },
//       },
//       {
//         type: "SEND_MESSAGE",
//         order: 1,
//         content: {
//           message:
//             "Thank you so much for your purchase, {name}! We hope you love it! If you have any questions, we're here to help.",
//         },
//       },
//       {
//         type: "ADD_TAG",
//         order: 2,
//         content: {
//           tagName: "Customer",
//         },
//       },
//       {
//         type: "DELAY",
//         order: 3,
//         content: {
//           delayAmount: "3",
//           delayUnit: "days",
//         },
//       },
//       {
//         type: "SEND_MESSAGE",
//         order: 4,
//         content: {
//           message: "Hey {name}! How are you enjoying your purchase? We'd love to hear your feedback!",
//         },
//       },
//     ],
//   },
// ]

// export function getTemplatesByCategory(category: string) {
//   return automationTemplates.filter((t) => t.category === category)
// }

// export function getTemplateById(id: string) {
//   return automationTemplates.find((t) => t.id === id)
// }

export interface AutomationTemplate {
  id: string
  name: string
  description: string
  category: "welcome" | "sales" | "support" | "engagement" | "ecommerce" | "real-estate" | "fitness" | "restaurant"
  icon: string
  triggerType: string
  triggerConditions: any
  actions: Array<{
    type: string
    content: any
    order: number
  }>
  industry?: string
}

export const automationTemplates: AutomationTemplate[] = [
  // WELCOME & ENGAGEMENT
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
    id: "story-reply-engagement",
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
          message: "Thanks for the reply, {name}! Glad you enjoyed our story! 😊",
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
    id: "comment-auto-reply",
    name: "Auto-Reply to Comments",
    description: "Automatically respond to comments on your posts",
    category: "engagement",
    icon: "message",
    triggerType: "COMMENT_RECEIVED",
    triggerConditions: {},
    actions: [
      {
        type: "SEND_MESSAGE",
        order: 0,
        content: {
          message: "Thanks for your comment! We'll send you a DM with more info 💬",
        },
      },
      {
        type: "DELAY",
        order: 1,
        content: {
          delayAmount: "2",
          delayUnit: "minutes",
        },
      },
      {
        type: "AI_RESPONSE",
        order: 2,
        content: {
          customInstructions: "Answer any questions about the post. Be friendly and helpful.",
          tone: "friendly",
        },
      },
    ],
  },
  {
    id: "mention-handler",
    name: "Mention Response",
    description: "Respond when someone mentions you in their story or post",
    category: "engagement",
    icon: "at-sign",
    triggerType: "MENTION_RECEIVED",
    triggerConditions: {},
    actions: [
      {
        type: "SEND_MESSAGE",
        order: 0,
        content: {
          message: "Hey {name}! Thanks for the mention! Really appreciate it! 🙌",
        },
      },
      {
        type: "ADD_TAG",
        order: 1,
        content: {
          tagName: "Brand Advocate",
        },
      },
    ],
  },

  // SALES & ECOMMERCE
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
        type: "SEND_IMAGE",
        order: 3,
        content: {
          imageUrl: "https://yoursite.com/pricing-image.jpg",
          caption: "Here's our complete pricing guide!",
        },
      },
    ],
  },
  {
    id: "product-inquiry",
    name: "Product Information Bot",
    description: "Send product details when customers ask about products",
    category: "ecommerce",
    icon: "shopping-bag",
    industry: "E-commerce",
    triggerType: "KEYWORD",
    triggerConditions: {
      keywords: ["product", "item", "buy", "purchase", "shop"],
      matchType: "contains",
    },
    actions: [
      {
        type: "SEND_MESSAGE",
        order: 0,
        content: {
          message: "Great! Let me show you our products 🛍️",
        },
      },
      {
        type: "SEND_IMAGE",
        order: 1,
        content: {
          imageUrl: "https://yoursite.com/product-catalog.jpg",
          caption: "Check out our latest collection!",
        },
      },
      {
        type: "AI_RESPONSE",
        order: 2,
        content: {
          customInstructions: "Answer product questions, share availability, and help with purchase decisions.",
          tone: "friendly",
        },
      },
      {
        type: "ADD_TAG",
        order: 3,
        content: {
          tagName: "Product Interest",
        },
      },
    ],
  },
  {
    id: "abandoned-cart-recovery",
    name: "Cart Abandonment Follow-up",
    description: "Follow up with customers who abandoned their cart",
    category: "ecommerce",
    icon: "shopping-cart",
    industry: "E-commerce",
    triggerType: "KEYWORD",
    triggerConditions: {
      keywords: ["cart", "checkout", "order"],
      matchType: "contains",
    },
    actions: [
      {
        type: "SEND_MESSAGE",
        order: 0,
        content: {
          message: "Hey {name}! I noticed you were checking out our products. Need any help completing your order?",
        },
      },
      {
        type: "DELAY",
        order: 1,
        content: {
          delayAmount: "1",
          delayUnit: "hours",
        },
      },
      {
        type: "SEND_MESSAGE",
        order: 2,
        content: {
          message: "Here's a special 10% discount code for you: WELCOME10 💝",
        },
      },
      {
        type: "ADD_TAG",
        order: 3,
        content: {
          tagName: "Cart Abandoned",
        },
      },
    ],
  },

  // REAL ESTATE
  {
    id: "property-inquiry",
    name: "Property Inquiry Handler",
    description: "Respond to property inquiries with details and schedule viewings",
    category: "sales",
    icon: "home",
    industry: "Real Estate",
    triggerType: "KEYWORD",
    triggerConditions: {
      keywords: ["property", "viewing", "house", "apartment", "available"],
      matchType: "contains",
    },
    actions: [
      {
        type: "SEND_MESSAGE",
        order: 0,
        content: {
          message: "Thanks for your interest in our property! I'd love to help you find your dream home 🏡",
        },
      },
      {
        type: "AI_RESPONSE",
        order: 1,
        content: {
          customInstructions:
            "Ask about their budget, preferred location, and requirements. Offer to schedule a viewing.",
          tone: "professional",
        },
      },
      {
        type: "ADD_TAG",
        order: 2,
        content: {
          tagName: "Property Lead",
        },
      },
      {
        type: "SEND_TO_HUMAN",
        order: 3,
        content: {
          reason: "Property viewing request - needs agent follow-up",
          priority: "high",
        },
      },
    ],
  },

  // FITNESS & WELLNESS
  {
    id: "class-booking",
    name: "Class Booking Assistant",
    description: "Help members book fitness classes",
    category: "sales",
    icon: "calendar",
    industry: "Fitness",
    triggerType: "KEYWORD",
    triggerConditions: {
      keywords: ["class", "book", "schedule", "training", "workout"],
      matchType: "contains",
    },
    actions: [
      {
        type: "SEND_MESSAGE",
        order: 0,
        content: {
          message: "Great! Let me help you book a class 💪",
        },
      },
      {
        type: "SEND_IMAGE",
        order: 1,
        content: {
          imageUrl: "https://yoursite.com/class-schedule.jpg",
          caption: "Here's our weekly class schedule",
        },
      },
      {
        type: "AI_RESPONSE",
        order: 2,
        content: {
          customInstructions: "Help book classes, answer questions about class types, and share pricing.",
          tone: "friendly",
        },
      },
      {
        type: "ADD_TAG",
        order: 3,
        content: {
          tagName: "Class Interest",
        },
      },
    ],
  },

  // RESTAURANT & FOOD
  {
    id: "reservation-handler",
    name: "Restaurant Reservation",
    description: "Handle reservation requests automatically",
    category: "sales",
    icon: "utensils",
    industry: "Restaurant",
    triggerType: "KEYWORD",
    triggerConditions: {
      keywords: ["reservation", "book", "table", "dine", "menu"],
      matchType: "contains",
    },
    actions: [
      {
        type: "SEND_MESSAGE",
        order: 0,
        content: {
          message: "Thanks for choosing us! Let me help you with a reservation 🍽️",
        },
      },
      {
        type: "AI_RESPONSE",
        order: 1,
        content: {
          customInstructions: "Ask for date, time, number of guests. Share menu if requested. Be warm and welcoming.",
          tone: "friendly",
        },
      },
      {
        type: "ADD_TAG",
        order: 2,
        content: {
          tagName: "Reservation Request",
        },
      },
      {
        type: "WEBHOOK",
        order: 3,
        content: {
          webhookUrl: "https://your-booking-system.com/api/reservations",
          method: "POST",
        },
      },
    ],
  },
  {
    id: "menu-inquiry",
    name: "Menu Information",
    description: "Send menu and answer food-related questions",
    category: "support",
    icon: "book",
    industry: "Restaurant",
    triggerType: "KEYWORD",
    triggerConditions: {
      keywords: ["menu", "food", "dishes", "special", "allergens"],
      matchType: "contains",
    },
    actions: [
      {
        type: "SEND_IMAGE",
        order: 0,
        content: {
          imageUrl: "https://yoursite.com/menu.jpg",
          caption: "Here's our full menu! 📖",
        },
      },
      {
        type: "AI_RESPONSE",
        order: 1,
        content: {
          customInstructions:
            "Answer questions about menu items, ingredients, allergens, and daily specials. Be helpful and descriptive.",
          tone: "friendly",
        },
      },
    ],
  },

  // SUPPORT
  {
    id: "support-ticket",
    name: "Support Ticket System",
    description: "Create support tickets for customer issues",
    category: "support",
    icon: "ticket",
    triggerType: "KEYWORD",
    triggerConditions: {
      keywords: ["help", "problem", "issue", "bug", "error", "not working"],
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
          tone: "professional",
        },
      },
      {
        type: "SEND_TO_HUMAN",
        order: 3,
        content: {
          reason: "Support ticket - needs human review",
          priority: "normal",
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
          customInstructions:
            "Answer frequently asked questions about the business. Be concise and helpful. Use knowledge base.",
          tone: "friendly",
          useKnowledgeBase: true,
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
      {
        type: "SEND_TO_HUMAN",
        order: 2,
        content: {
          reason: "Low confidence - needs human assistance",
          priority: "normal",
        },
      },
    ],
  },

  // LEAD QUALIFICATION
  {
    id: "lead-qualification",
    name: "Lead Qualification Bot",
    description: "Qualify leads with AI-powered responses",
    category: "sales",
    icon: "target",
    triggerType: "KEYWORD",
    triggerConditions: {
      keywords: ["interested", "learn more", "info", "information", "details"],
      matchType: "contains",
    },
    actions: [
      {
        type: "AI_RESPONSE",
        order: 0,
        content: {
          customInstructions: "Qualify the lead by understanding their needs and budget. Be friendly and helpful.",
          tone: "professional",
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
          priority: "high",
        },
      },
    ],
  },

  // APPOINTMENT BOOKING
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
        type: "AI_RESPONSE",
        order: 2,
        content: {
          customInstructions: "Help schedule appointments. Ask for date, time, and reason for visit.",
          tone: "professional",
        },
      },
      {
        type: "WEBHOOK",
        order: 3,
        content: {
          webhookUrl: "https://your-calendar-system.com/webhook",
          method: "POST",
        },
      },
    ],
  },

  // POST-PURCHASE
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

export function getTemplatesByIndustry(industry: string) {
  return automationTemplates.filter((t) => t.industry === industry)
}

export function getTemplateById(id: string) {
  return automationTemplates.find((t) => t.id === id)
}
