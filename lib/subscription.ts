export type SubscriptionTier = "freemium" | "pro" | "business" | "enterprise"

export const SUBSCRIPTION_FEATURES = {
  freemium: {
    name: "Freemium",
    conversations: 50,
    teamMembers: 1,
    aiSuggestions: false,
    analytics: false,
    reminders: false,
    bulkActions: false,
    savedFilters: 3,
    templates: 10,
    advancedFilters: false,
    exportConversations: false,
  },
  pro: {
    name: "Pro",
    conversations: 500,
    teamMembers: 5,
    aiSuggestions: true,
    analytics: true,
    reminders: true,
    bulkActions: true,
    savedFilters: 20,
    templates: 50,
    advancedFilters: true,
    exportConversations: true,
  },
  business: {
    name: "Business",
    conversations: 2000,
    teamMembers: 15,
    aiSuggestions: true,
    analytics: true,
    reminders: true,
    bulkActions: true,
    savedFilters: 50,
    templates: 200,
    advancedFilters: true,
    exportConversations: true,
  },
  enterprise: {
    name: "Enterprise",
    conversations: Number.POSITIVE_INFINITY,
    teamMembers: Number.POSITIVE_INFINITY,
    aiSuggestions: true,
    analytics: true,
    reminders: true,
    bulkActions: true,
    savedFilters: Number.POSITIVE_INFINITY,
    templates: Number.POSITIVE_INFINITY,
    advancedFilters: true,
    exportConversations: true,
  },
}

export function hasFeatureAccess(
  userTier: SubscriptionTier,
  feature: keyof typeof SUBSCRIPTION_FEATURES.freemium,
): boolean {
  const tierFeatures = SUBSCRIPTION_FEATURES[userTier]
  return (
    tierFeatures[feature as keyof typeof tierFeatures] === true ||
    typeof tierFeatures[feature as keyof typeof tierFeatures] === "number"
  )
}

export function hasAccess(userTier: SubscriptionTier, feature: keyof typeof SUBSCRIPTION_FEATURES.freemium): boolean {
  return hasFeatureAccess(userTier, feature)
}

type FeatureKey = Exclude<keyof typeof SUBSCRIPTION_FEATURES.freemium, "name">

export function getFeatureLimit(
  userTier: SubscriptionTier,
  feature: FeatureKey,
): number | boolean {
  const tierFeatures = SUBSCRIPTION_FEATURES[userTier]
  return tierFeatures[feature]
}