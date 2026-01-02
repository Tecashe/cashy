import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { prisma } from "@/lib/db"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"

async function getCurrentSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { subscriptionTier: true },
  })
  return user?.subscriptionTier || "free"
}

export default async function PricingPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const currentTier = await getCurrentSubscription(userId)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the perfect plan to automate your Instagram business
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {Object.entries(SUBSCRIPTION_PLANS).map(([tier, plan]) => {
            const isCurrent = tier === currentTier
            const isPopular = tier === "pro"

            return (
              <Card
                key={tier}
                className={`relative flex flex-col ${isPopular ? "border-primary shadow-lg md:scale-105" : ""}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-6">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>
                        {plan.features.automations === -1 ? "Unlimited" : plan.features.automations} automations
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>
                        {plan.features.monthlyMessages === -1
                          ? "Unlimited"
                          : plan.features.monthlyMessages.toLocaleString()}{" "}
                        messages/month
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>
                        {plan.features.instagramAccounts === -1 ? "Unlimited" : plan.features.instagramAccounts}{" "}
                        Instagram accounts
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>
                        {plan.features.aiContentGeneration === -1 ? "Unlimited" : plan.features.aiContentGeneration} AI
                        generations
                      </span>
                    </li>
                    {plan.features.advancedAnalytics && (
                      <li className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Advanced analytics</span>
                      </li>
                    )}
                    {plan.features.prioritySupport && (
                      <li className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Priority support</span>
                      </li>
                    )}
                    {plan.features.customBranding && (
                      <li className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Custom branding</span>
                      </li>
                    )}
                  </ul>

                  <Button
                    asChild
                    className={`mt-auto w-full ${
                      isCurrent
                        ? "bg-muted text-muted-foreground cursor-default"
                        : isPopular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : ""
                    }`}
                    disabled={isCurrent}
                  >
                    {isCurrent ? (
                      <span>Current Plan</span>
                    ) : tier === "free" ? (
                      <span>Get Started Free</span>
                    ) : (
                      <a href={`/checkout?plan=${tier}`}>Upgrade Now</a>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 rounded-lg border border-border bg-card p-8">
          <h2 className="text-xl font-bold text-foreground">Need a custom plan?</h2>
          <p className="mt-2 text-muted-foreground">
            Contact our sales team for enterprise solutions tailored to your business.
          </p>
          <Button className="mt-4">Contact Sales</Button>
        </div>
      </div>
    </div>
  )
}
