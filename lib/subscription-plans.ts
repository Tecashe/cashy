export const SUBSCRIPTION_PLANS = {
  freemium: {
    name: "Freemium",
    price: 49,
    description: "14-day free trial, then $49/mo",
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
    price: 79,
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
  business: {
    name: "Business",
    price: 149,
    description: "For scaling operations",
    features: {
      automations: 50,
      monthlyMessages: 25000,
      instagramAccounts: 15,
      aiContentGeneration: 500,
      advancedAnalytics: true,
      prioritySupport: true,
      customBranding: true,
    },
  },
  enterprise: {
    name: "Enterprise",
    price: 0,
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
