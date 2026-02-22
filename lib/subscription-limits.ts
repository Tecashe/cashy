export const SUBSCRIPTION_PLANS = {
  freemium: {
    name: "Freemium",
    price: 49,
    features: {
      automations: 2,
      monthlyMessages: 100,
      instagramAccounts: 1,
      aiContentGeneration: 10,
      advancedAnalytics: false,
      prioritySupport: false,
      customBranding: false,
    },
  },
  pro: {
    name: "Pro",
    price: 79,
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

export function getSubscriptionLimits(tier: string) {
  return SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS] || SUBSCRIPTION_PLANS.freemium
}

export function canCreateAutomation(currentCount: number, tier: string): boolean {
  const limits = getSubscriptionLimits(tier)
  return limits.features.automations === -1 || currentCount < limits.features.automations
}

export function canSendMessage(monthlyCount: number, tier: string): boolean {
  const limits = getSubscriptionLimits(tier)
  return limits.features.monthlyMessages === -1 || monthlyCount < limits.features.monthlyMessages
}

export function canConnectAccount(currentCount: number, tier: string): boolean {
  const limits = getSubscriptionLimits(tier)
  return limits.features.instagramAccounts === -1 || currentCount < limits.features.instagramAccounts
}

export function canGenerateContent(monthlyCount: number, tier: string): boolean {
  const limits = getSubscriptionLimits(tier)
  return limits.features.aiContentGeneration === -1 || monthlyCount < limits.features.aiContentGeneration
}
