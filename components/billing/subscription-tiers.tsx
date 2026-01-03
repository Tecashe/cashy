"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { TIER_DISPLAY, type SubscriptionTier } from "@/lib/tier-config"
import { toast } from "sonner"

interface SubscriptionTiersProps {
  currentTier: SubscriptionTier
  userId: string
}

export function SubscriptionTiers({ currentTier, userId }: SubscriptionTiersProps) {
  const [loading, setLoading] = useState(false)
  const [processingTier, setProcessingTier] = useState<SubscriptionTier | null>(null)

  const tiers: SubscriptionTier[] = ["free", "pro", "enterprise"]

const handleUpgradeOrDowngrade = async (targetTier: SubscriptionTier) => {
  try {
    setLoading(true)
    setProcessingTier(targetTier)

    if (targetTier === "free") {
      // Downgrade to free
      const res = await fetch("/api/subscriptions/downgrade", {
        method: "POST",
      })

      if (!res.ok) {
        toast.error("Failed to downgrade subscription")
        return
      }

      toast.success("Downgraded to Free plan")
      window.location.reload()
    } else {
      // Upgrade to pro or enterprise
      const res = await fetch("/api/subscriptions/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: targetTier }),
      })

      if (!res.ok) {
        const error = await res.json()
        toast.error(error.details || "Failed to upgrade subscription")
        return
      }

      const data = await res.json()

      // If checkout is required, redirect to Stripe Checkout
      if (data.requiresCheckout && data.checkoutUrl) {
        window.location.href = data.checkoutUrl
        return
      }

      toast.success(`Upgraded to ${TIER_DISPLAY[targetTier].name} plan`)
      window.location.reload()
    }
  } catch (error) {
    console.error("Error:", error)
    toast.error("Something went wrong")
  } finally {
    setLoading(false)
    setProcessingTier(null)
  }
}

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Choose Your Plan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upgrade or downgrade your subscription anytime. Changes take effect immediately.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => {
          const display = TIER_DISPLAY[tier]
          const isCurrent = tier === currentTier
          const isFreeTier = tier === "free"

          return (
            <Card
              key={tier}
              className={cn(
                "relative flex flex-col transition-all duration-200 border",
                isCurrent
                  ? "border-foreground shadow-lg ring-1 ring-foreground/20"
                  : "border-border hover:border-border/80",
              )}
            >
              {isCurrent && (
                <Badge className="absolute -top-2.5 left-6 bg-foreground text-background px-3">Current Plan</Badge>
              )}

              <CardHeader>
                <CardDescription className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {display.tagline}
                </CardDescription>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">{display.name}</h3>
                <p className="mt-2 text-3xl font-bold text-foreground">{display.price}</p>
                {tier !== "free" && <p className="text-xs text-muted-foreground">/month, billed monthly</p>}
              </CardHeader>

              <CardContent className="flex-1 space-y-6">
                {/* Features List */}
                <ul className="space-y-3">
                  {display.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  onClick={() => handleUpgradeOrDowngrade(tier)}
                  disabled={loading || isCurrent}
                  className={cn(
                    "w-full mt-6",
                    isCurrent && "opacity-50 cursor-not-allowed",
                    !isCurrent && !isFreeTier && "bg-foreground text-background hover:bg-foreground/90",
                    !isCurrent && isFreeTier && "variant-outline bg-transparent border-border",
                  )}
                  variant={isCurrent ? "outline" : isFreeTier ? "outline" : "default"}
                >
                  {processingTier === tier && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isCurrent ? "Current Plan" : isFreeTier ? "Downgrade" : "Upgrade Now"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
