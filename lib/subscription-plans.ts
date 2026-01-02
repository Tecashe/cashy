export const SUBSCRIPTION_PLANS = {
  free: {
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    features: {
      automations: 1,
      monthlyMessages: 100,
      instagramAccounts: 1,
      aiContentGeneration: 5,
      advancedAnalytics: false,
      prioritySupport: false,
      customBranding: false,
    },
  },
  pro: {
    name: "Pro",
    price: 49,
    description: "For growing businesses",
    features: {
      automations: 10,
      monthlyMessages: 5000,
      instagramAccounts: 5,
      aiContentGeneration: 100,
      advancedAnalytics: true,
      prioritySupport: true,
      customBranding: false,
    },
  },
  enterprise: {
    name: "Enterprise",
    price: 199,
    description: "For large-scale operations",
    features: {
      automations: -1, // unlimited
      monthlyMessages: -1, // unlimited
      instagramAccounts: -1, // unlimited
      aiContentGeneration: -1, // unlimited
      advancedAnalytics: true,
      prioritySupport: true,
      customBranding: true,
    },
  },
}

export type SubscriptionTier = keyof typeof SUBSCRIPTION_PLANS
