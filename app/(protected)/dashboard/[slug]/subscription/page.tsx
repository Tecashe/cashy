import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { prisma } from "@/lib/db"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-limits"

async function getCurrentSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { subscriptionTier: true, subscriptionStatus: true },
  })
  return user?.subscriptionTier||"unknown"
}

export default async function SubscriptionPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const currentTier = await getCurrentSubscription(userId)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Choose YourPlan</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Upgrade to unlock powerful automation features</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(SUBSCRIPTION_PLANS).map(([tier, plan]) => {
          const isCurrent = tier === currentTier
          const isPopular = tier === "pro"

          return (
            <Card
              key={tier}
              className={`glass-card relative ${isPopular ? "border-2 border-purple-600 shadow-xl" : ""}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-slate-600 dark:text-slate-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      {plan.features.automations === -1 ? "Unlimited" : plan.features.automations} automations
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      {plan.features.monthlyMessages === -1
                        ? "Unlimited"
                        : plan.features.monthlyMessages.toLocaleString()}{" "}
                      messages/month
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      {plan.features.instagramAccounts === -1 ? "Unlimited" : plan.features.instagramAccounts} Instagram
                      accounts
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      {plan.features.aiContentGeneration === -1 ? "Unlimited" : plan.features.aiContentGeneration} AI
                      generations
                    </span>
                  </li>
                  {plan.features.advancedAnalytics && (
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Advanced analytics</span>
                    </li>
                  )}
                  {plan.features.prioritySupport && (
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Priority support</span>
                    </li>
                  )}
                  {plan.features.customBranding && (
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Custom branding</span>
                    </li>
                  )}
                </ul>

                <Button
                  className={`w-full ${
                    isCurrent
                      ? "bg-slate-200 text-slate-600 cursor-default"
                      : isPopular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        : ""
                  }`}
                  disabled={isCurrent}
                >
                  {isCurrent ? "Current Plan" : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
