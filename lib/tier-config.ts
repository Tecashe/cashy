// // Tier-based feature access configuration
// export const TIER_FEATURES = {
//   free: {
//     triggers: ["message_reply", "story_reply"],
//     actions: ["send_message", "add_tag"],
//     maxAutomations: 2,
//     maxTags: 5,
//     maxStorageGB: 1,
//   },
//   pro: {
//     triggers: ["message_reply", "story_reply", "comment", "keyword", "story_mention"],
//     actions: ["send_message", "add_tag", "send_dm", "remove_tag", "add_to_list"],
//     maxAutomations: 10,
//     maxTags: 50,
//     maxStorageGB: 50,
//   },
//   enterprise: {
//     triggers: ["message_reply", "story_reply", "comment", "keyword", "story_mention", "direct_message"],
//     actions: ["send_message", "add_tag", "send_dm", "remove_tag", "add_to_list", "webhook", "api_call"],
//     maxAutomations: 999,
//     maxTags: 999,
//     maxStorageGB: 500,
//   },
// }

// export type SubscriptionTier = keyof typeof TIER_FEATURES

// export function isFeatureAvailable(
//   tier: SubscriptionTier,
//   featureType: "trigger" | "action",
//   featureName: string,
// ): boolean {
//   const tierConfig = TIER_FEATURES[tier]
//   if (featureType === "trigger") {
//     return tierConfig.triggers.includes(featureName)
//   }
//   return tierConfig.actions.includes(featureName)
// }

// export function getUpgradeRequired(currentTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
//   const tierHierarchy = { free: 0, pro: 1, enterprise: 2 }
//   return tierHierarchy[currentTier] < tierHierarchy[requiredTier]
// }

// export function getMinimumTierForFeature(featureType: "trigger" | "action", featureName: string): SubscriptionTier {
//   for (const [tier, config] of Object.entries(TIER_FEATURES)) {
//     const features = featureType === "trigger" ? config.triggers : config.actions
//     if (features.includes(featureName)) {
//       return tier as SubscriptionTier
//     }
//   }
//   return "enterprise"
// }

import type { TriggerType, ActionType } from "./types/automation"

export type SubscriptionTier = "free" | "pro" | "enterprise"

interface TierLimits {
  maxAutomations: number
  maxTags: number
  maxStorageGB: number
  triggers: TriggerType[]
  actions: ActionType[]
}

export const TIER_FEATURES: Record<SubscriptionTier, TierLimits> = {
  free: {
    triggers: ["new_message", "story_reply"],
    actions: ["send_message", "add_tag"],
    maxAutomations: 2,
    maxTags: 5,
    maxStorageGB: 1,
  },
  pro: {
    triggers: ["new_message", "story_reply", "comment", "keyword", "mention"],
    actions: ["send_message", "add_tag", "send_image", "send_carousel", "add_tag"],
    maxAutomations: 10,
    maxTags: 50,
    maxStorageGB: 50,
  },
  enterprise: {
    triggers: ["new_message", "story_reply", "comment", "keyword", "mention", "new_follower"],
    actions: [
      "send_message",
      "send_image",
      "send_carousel",
      "ai_response",
      "add_tag",
      "delay",
      "condition",
      "human_handoff",
      "reply_to_comment",
      "hide_comment",
      "webhook",
    ],
    maxAutomations: 999,
    maxTags: 999,
    maxStorageGB: 500,
  },
}

export const TIER_DISPLAY = {
  free: {
    name: "Free",
    price: "$0",
    tagline: "Perfect for getting started",
    features: [
      "Up to 2 automations",
      "Basic triggers & actions",
      "Message & Story replies",
      "5 custom tags",
      "1GB storage",
    ],
  },
  pro: {
    name: "Pro",
    price: "$49",
    tagline: "Power up your automation",
    features: [
      "Up to 10 automations",
      "Advanced triggers (comments, keywords)",
      "Story mentions tracking",
      "50 custom tags",
      "50GB storage",
      "Priority support",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: "Custom",
    tagline: "Unlimited power & flexibility",
    features: [
      "Unlimited automations",
      "Direct message triggers",
      "Custom webhooks & API",
      "Unlimited tags",
      "500GB storage",
      "Dedicated support",
    ],
  },
}

export function isFeatureAvailable(
  tier: SubscriptionTier,
  featureType: "trigger" | "action",
  featureName: string,
): boolean {
  const tierConfig = TIER_FEATURES[tier]
  if (featureType === "trigger") {
    return tierConfig.triggers.includes(featureName as TriggerType)
  }
  return tierConfig.actions.includes(featureName as ActionType)
}

export function getUpgradeRequired(currentTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  const tierHierarchy = { free: 0, pro: 1, enterprise: 2 }
  return tierHierarchy[currentTier] < tierHierarchy[requiredTier]
}

export function getMinimumTierForFeature(featureType: "trigger" | "action", featureName: string): SubscriptionTier {
  for (const tier of Object.keys(TIER_FEATURES) as SubscriptionTier[]) {
    const config = TIER_FEATURES[tier]
    const features: string[] = featureType === "trigger" ? config.triggers : config.actions
    if (features.includes(featureName)) {
      return tier
    }
  }
  return "enterprise"
}

export function getTriggerBenefits(trigger: TriggerType, tier: SubscriptionTier): string[] {
  const baseBenefits = TIER_DISPLAY[tier].features

  const triggerBenefits: Record<TriggerType, string[]> = {
    comment: [
      "Auto-respond to Instagram comments",
      "Engage with your audience instantly",
      "Keyword filtering support",
      ...baseBenefits,
    ],
    keyword: ["Trigger on specific keywords", "Smart message filtering", "Advanced targeting options", ...baseBenefits],
    mention: ["Detect mentions automatically", "Never miss a tag", "Build stronger connections", ...baseBenefits],
    new_follower: [
      "Welcome new followers automatically",
      "Scale your audience engagement",
      "Personalized onboarding",
      ...baseBenefits,
    ],
    // Free triggers don't need upgrade benefits
    new_message: baseBenefits,
    story_reply: baseBenefits,
  }

  return triggerBenefits[trigger] || baseBenefits
}

export function getActionBenefits(action: ActionType, tier: SubscriptionTier): string[] {
  const baseBenefits = TIER_DISPLAY[tier].features

  const actionBenefits: Record<ActionType, string[]> = {
    send_image: ["Send automated images", "Visual content at scale", "Increase engagement rates", ...baseBenefits],
    send_carousel: ["Send carousel posts", "Multi-step messaging", "Better storytelling", ...baseBenefits],
    ai_response: ["AI-powered responses", "Smart message generation", "Human-like conversations", ...baseBenefits],
    delay: ["Schedule delayed actions", "Perfect timing automation", "Workflow control", ...baseBenefits],
    condition: ["Conditional logic", "Smart branching", "Advanced automation", ...baseBenefits],
    human_handoff: ["Hand off to humans", "Escalation management", "Hybrid automation", ...baseBenefits],
    reply_to_comment: ["Auto-reply to comments", "Comment management", "Quick engagement", ...baseBenefits],
    hide_comment: ["Hide inappropriate comments", "Moderation automation", "Community management", ...baseBenefits],
    webhook: ["Connect to external systems", "Real-time data sync", "Custom integrations", ...baseBenefits],
    // Free actions don't need upgrade benefits
    send_message: baseBenefits,
    add_tag: baseBenefits,
  }

  return actionBenefits[action] || baseBenefits
}
