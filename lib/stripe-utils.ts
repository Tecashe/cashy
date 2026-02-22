import type { SubscriptionTier } from "./subscription-plans"

// Map subscription tiers to Pesapal plan amounts (in USD)
export const PESAPAL_PLAN_AMOUNTS: Record<SubscriptionTier, number> = {
  freemium: 49,
  pro: 79,
  business: 149,
  enterprise: 0, // Custom pricing
}

export function getAmountForTier(tier: SubscriptionTier): number | null {
  if (tier === "enterprise") return null
  return PESAPAL_PLAN_AMOUNTS[tier]
}

export function getTierFromAmount(amount: number): SubscriptionTier | null {
  for (const [tier, planAmount] of Object.entries(PESAPAL_PLAN_AMOUNTS)) {
    if (planAmount === amount) return tier as SubscriptionTier
  }
  return null
}
