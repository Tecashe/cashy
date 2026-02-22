"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { TIER_DISPLAY, type SubscriptionTier } from "@/lib/tier-config"
import { toast } from "sonner"
import { PaymentModal } from "./payment-modal"

interface SubscriptionTiersProps {
  currentTier: SubscriptionTier
  userId: string
}

export function SubscriptionTiers({ currentTier, userId }: SubscriptionTiersProps) {
  const [loading, setLoading] = useState(false)
  const [processingTier, setProcessingTier] = useState<SubscriptionTier | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null)

  const tiers: SubscriptionTier[] = ["freemium", "pro", "business", "enterprise"]

  const handleUpgradeOrDowngrade = async (targetTier: SubscriptionTier) => {
    try {
      setLoading(true)
      setProcessingTier(targetTier)

      if (targetTier === "freemium") {
        // Show confirmation dialog first
        const confirmed = window.confirm(
          "Are you sure you want to downgrade to Freemium? You'll lose access to premium features."
        )
        if (!confirmed) return

        const res = await fetch("/api/subscriptions/downgrade", {
          method: "POST",
        })

        if (!res.ok) {
          const error = await res.json()
          toast.error(error.details || "Failed to downgrade subscription")
          return
        }

        toast.success("Successfully downgraded to Freemium plan!")

        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else if (targetTier === "enterprise") {
        // Open Calendly for enterprise
        window.open("https://calendly.com/tecashe111/30min", "_blank")
      } else {
        // Show loading toast
        const loadingToast = toast.loading(`Preparing ${TIER_DISPLAY[targetTier].name} upgrade...`)

        const res = await fetch("/api/pesapal/submit-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tier: targetTier }),
        })

        toast.dismiss(loadingToast)

        if (!res.ok) {
          const error = await res.json()
          toast.error(error.details || "Failed to create payment order")
          return
        }

        const data = await res.json()
        setRedirectUrl(data.redirect_url)
        setSelectedTier(targetTier)
        setShowPayment(true)
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
      setProcessingTier(null)
    }
  }

  const handlePaymentSuccess = () => {
    setShowPayment(false)
    toast.success(`Successfully upgraded to ${selectedTier ? TIER_DISPLAY[selectedTier].name : ""} plan!`)
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Choose Your Plan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upgrade or downgrade your subscription anytime. Changes take effect immediately.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {tiers.map((tier) => {
          const display = TIER_DISPLAY[tier]
          const isCurrent = tier === currentTier
          const isFreemiumTier = tier === "freemium"
          const isEnterprise = tier === "enterprise"

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
                {tier !== "enterprise" && <p className="text-xs text-muted-foreground">/month, billed monthly</p>}
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
                    !isCurrent && !isFreemiumTier && !isEnterprise && "bg-foreground text-background hover:bg-foreground/90",
                    !isCurrent && isFreemiumTier && "variant-outline bg-transparent border-border",
                  )}
                  variant={isCurrent ? "outline" : isFreemiumTier ? "outline" : "default"}
                >
                  {processingTier === tier && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isCurrent
                    ? "Current Plan"
                    : isFreemiumTier
                      ? "Downgrade"
                      : isEnterprise
                        ? "Contact Sales"
                        : "Upgrade Now"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pesapal Payment Modal */}
      {selectedTier && (
        <PaymentModal
          open={showPayment}
          onOpenChange={setShowPayment}
          tier={selectedTier}
          redirectUrl={redirectUrl}
          isLoading={loading}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
