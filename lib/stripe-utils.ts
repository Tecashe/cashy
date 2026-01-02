import type { SubscriptionTier } from "./subscription-plans"

// Map subscription tiers to Stripe price IDs
export const STRIPE_PRICE_IDS: Record<SubscriptionTier, string> = {
  free: "", // Free tier has no price ID
  pro: process.env.STRIPE_PRO_PRICE_ID || "",
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID || "",
}

export function getPriceIdForTier(tier: SubscriptionTier): string | null {
  if (tier === "free") return null
  return STRIPE_PRICE_IDS[tier]
}

export function getTierFromPriceId(priceId: string): SubscriptionTier | null {
  for (const [tier, id] of Object.entries(STRIPE_PRICE_IDS)) {
    if (id === priceId) return tier as SubscriptionTier
  }
  return null
}
