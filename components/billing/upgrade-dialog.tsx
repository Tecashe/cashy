"use client"

import { useState } from "react"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { PaymentModal } from "./payment-modal"

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  featureName: string
  requiredTier: "freemium" | "pro" | "business" | "enterprise"
  benefits?: string[]
}

export function UpgradeModal({
  open,
  onClose,
  featureName,
  requiredTier,
  benefits = ["Unlimited automations", "Advanced action types", "Priority support", "Custom integrations"],
}: UpgradeModalProps) {
  const [showPayment, setShowPayment] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleUpgrade = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/pesapal/submit-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: requiredTier }),
      })

      if (!response.ok) throw new Error("Failed to create payment order")

      const data = await response.json()
      setRedirectUrl(data.redirect_url)
      setShowPayment(true)
    } catch (error) {
      console.error("Error creating Pesapal order:", error)
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    setShowPayment(false)
    onClose()

    toast({
      title: "Upgrade Successful!",
      description: `You now have access to all ${requiredTier} features.`,
    })

    window.location.reload()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl">Unlock {featureName}</DialogTitle>
            <DialogDescription className="text-sm pt-2">
              Upgrade to <span className="font-semibold text-foreground capitalize">{requiredTier}</span> plan to access
              this feature
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleUpgrade} disabled={isLoading} className="w-full h-10">
              {isLoading ? "Processing..." : `Upgrade to ${requiredTier}`}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
            <Button onClick={onClose} variant="ghost" disabled={isLoading} className="w-full h-10">
              Maybe Later
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">Cancel anytime · 14-day free trial</p>
        </DialogContent>
      </Dialog>

      {/* Payment modal appears when user clicks upgrade */}
      <PaymentModal
        open={showPayment}
        onOpenChange={setShowPayment}
        tier={requiredTier}
        redirectUrl={redirectUrl}
        isLoading={isLoading}
        onSuccess={handlePaymentSuccess}
      />
    </>
  )
}
