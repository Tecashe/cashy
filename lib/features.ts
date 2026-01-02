// Feature definitions for subscription tiers
export const FEATURES = {
  // Free tier features
  free: {
    createAutomations: false,
    aiAssistant: false,
    aiSuggestions: false,
    knowledgeBase: false,
    aiConfiguration: false,
    advancedIntegrations: false,
    aiTesting: false,
    maxProducts: 5,
    maxKnowledgeDocs: 0,
    maxAutomations: 0,
  },

  // Pro tier features
  pro: {
    createAutomations: true,
    aiAssistant: true,
    aiSuggestions: true,
    knowledgeBase: true,
    aiConfiguration: true,
    advancedIntegrations: false,
    aiTesting: true,
    maxProducts: 100,
    maxKnowledgeDocs: 50,
    maxAutomations: 10,
  },

  // Enterprise tier features
  enterprise: {
    createAutomations: true,
    aiAssistant: true,
    aiSuggestions: true,
    knowledgeBase: true,
    aiConfiguration: true,
    advancedIntegrations: true,
    aiTesting: true,
    maxProducts: -1, // unlimited
    maxKnowledgeDocs: -1,
    maxAutomations: -1,
  },
} as const

export type SubscriptionTier = keyof typeof FEATURES
export type FeatureKey = keyof (typeof FEATURES)[SubscriptionTier]

/**
 * Check if a user tier has access to a feature
 */
export function hasAccess(tier: SubscriptionTier | "free" | "pro" | "enterprise", feature: FeatureKey): boolean {
  const tierFeatures = FEATURES[tier as SubscriptionTier]
  if (!tierFeatures) return false

  const featureValue = tierFeatures[feature]

  // For boolean features
  if (typeof featureValue === "boolean") {
    return featureValue
  }

  // For numeric limits, true means they have the feature (any limit > 0 or -1 for unlimited)
  if (typeof featureValue === "number") {
    return featureValue !== 0
  }

  return false
}

/**
 * Get feature limit for a tier
 */
export function getFeatureLimit(tier: SubscriptionTier, feature: FeatureKey): number {
  const tierFeatures = FEATURES[tier]
  if (!tierFeatures) return 0

  const featureValue = tierFeatures[feature]

  // Return numeric limits, or 0 if feature is not a number
  if (typeof featureValue === "number") {
    return featureValue
  }

  return 0
}

/**
 * Get the minimum tier required for a feature
 */
export function getMinimumTierForFeature(feature: FeatureKey): SubscriptionTier {
  // Check enterprise
  if (FEATURES.enterprise[feature]) {
    return "enterprise"
  }

  // Check pro
  if (FEATURES.pro[feature]) {
    return "pro"
  }

  // Otherwise free
  return "free"
}

/**
 * Subscription feature descriptions
 */
export const FEATURE_DESCRIPTIONS: Record<FeatureKey, string> = {
  createAutomations: "Create unlimited automation flows for Instagram DMs",
  aiAssistant: "Deploy an AI assistant to handle customer conversations",
  aiSuggestions: "Get AI-powered smart reply suggestions in conversations",
  knowledgeBase: "Create a knowledge base for your AI to reference",
  aiConfiguration: "Fine-tune AI personality, tone, and behavior",
  advancedIntegrations: "Connect Stripe, Shopify, WooCommerce, and more",
  aiTesting: "Test your AI with production API keys",
  maxProducts: "Maximum products in your catalog",
  maxKnowledgeDocs: "Maximum knowledge base documents",
  maxAutomations: "Maximum automations you can create",
}
