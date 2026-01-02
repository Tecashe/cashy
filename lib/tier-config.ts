// Tier-based feature access configuration
export const TIER_FEATURES = {
  free: {
    triggers: ["message_reply", "story_reply"],
    actions: ["send_message", "add_tag"],
    maxAutomations: 2,
    maxTags: 5,
    maxStorageGB: 1,
  },
  pro: {
    triggers: ["message_reply", "story_reply", "comment", "keyword", "story_mention"],
    actions: ["send_message", "add_tag", "send_dm", "remove_tag", "add_to_list"],
    maxAutomations: 10,
    maxTags: 50,
    maxStorageGB: 50,
  },
  enterprise: {
    triggers: ["message_reply", "story_reply", "comment", "keyword", "story_mention", "direct_message"],
    actions: ["send_message", "add_tag", "send_dm", "remove_tag", "add_to_list", "webhook", "api_call"],
    maxAutomations: 999,
    maxTags: 999,
    maxStorageGB: 500,
  },
}

export type SubscriptionTier = keyof typeof TIER_FEATURES

export function isFeatureAvailable(
  tier: SubscriptionTier,
  featureType: "trigger" | "action",
  featureName: string,
): boolean {
  const tierConfig = TIER_FEATURES[tier]
  if (featureType === "trigger") {
    return tierConfig.triggers.includes(featureName)
  }
  return tierConfig.actions.includes(featureName)
}

export function getUpgradeRequired(currentTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  const tierHierarchy = { free: 0, pro: 1, enterprise: 2 }
  return tierHierarchy[currentTier] < tierHierarchy[requiredTier]
}

export function getMinimumTierForFeature(featureType: "trigger" | "action", featureName: string): SubscriptionTier {
  for (const [tier, config] of Object.entries(TIER_FEATURES)) {
    const features = featureType === "trigger" ? config.triggers : config.actions
    if (features.includes(featureName)) {
      return tier as SubscriptionTier
    }
  }
  return "enterprise"
}
