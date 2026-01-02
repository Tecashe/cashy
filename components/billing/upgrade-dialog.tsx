// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Check } from "lucide-react"
// import { SUBSCRIPTION_PLANS, type SubscriptionTier } from "@/lib/subscription-plans"
// import { PaymentModal } from "./payment-modal"
// import { useTransition } from "react"

// interface UpgradeDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   currentTier: SubscriptionTier
// }

// export function UpgradeDialog({ open, onOpenChange, currentTier }: UpgradeDialogProps) {
//   const [selectedTier, setSelectedTier] = useState<"pro" | "enterprise" | null>(null)
//   const [paymentOpen, setPaymentOpen] = useState(false)
//   const [clientSecret, setClientSecret] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [isPending, startTransition] = useTransition()

//   const handleSelectTier = async (tier: "pro" | "enterprise") => {
//     setSelectedTier(tier)
//     setIsLoading(true)

//     try {
//       const response = await fetch("/api/payments/create-intent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ tier }),
//       })

//       if (!response.ok) throw new Error("Failed to create payment intent")

//       const data = await response.json()
//       setClientSecret(data.clientSecret)
//       setPaymentOpen(true)
//     } catch (error) {
//       console.error("[v0] Error creating intent:", error)
//       alert("Failed to initiate payment. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handlePaymentSuccess = async () => {
//     if (!selectedTier || !clientSecret) return

//     startTransition(async () => {
//       try {
//         // Extract payment intent ID from client secret
//         const intentId = clientSecret.split("_secret_")[0]

//         const response = await fetch("/api/payments/confirm", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             paymentIntentId: intentId,
//             tier: selectedTier,
//             saveCard: true,
//           }),
//         })

//         if (!response.ok) throw new Error("Failed to confirm payment")

//         setPaymentOpen(false)
//         onOpenChange(false)
//         setSelectedTier(null)
//         setClientSecret(null)

//         // Refresh page or show success message
//         window.location.reload()
//       } catch (error) {
//         console.error("[v0] Error confirming payment:", error)
//         alert("Payment successful but failed to update subscription. Please contact support.")
//       }
//     })
//   }

//   return (
//     <>
//       <Dialog open={open} onOpenChange={onOpenChange}>
//         <DialogContent className="max-w-3xl">
//           <DialogHeader>
//             <DialogTitle>Upgrade Your Plan</DialogTitle>
//             <DialogDescription>Choose the perfect plan for your business</DialogDescription>
//           </DialogHeader>

//           <div className="grid grid-cols-2 gap-6 py-6">
//             {(["pro", "enterprise"] as const).map((tier) => {
//               const plan = SUBSCRIPTION_PLANS[tier]
//               const isCurrentTier = currentTier === tier
//               const isDowngrade = currentTier === "enterprise" && tier === "pro"

//               return (
//                 <Card key={tier} className={`relative ${isCurrentTier ? "border-primary ring-2 ring-primary" : ""}`}>
//                   {isCurrentTier && (
//                     <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
//                       Current
//                     </div>
//                   )}

//                   <CardHeader>
//                     <CardTitle>{plan.name}</CardTitle>
//                     <CardDescription>{plan.description}</CardDescription>
//                     <div className="mt-4">
//                       <span className="text-4xl font-bold">${plan.price}</span>
//                       <span className="ml-2 text-muted-foreground">/month</span>
//                     </div>
//                   </CardHeader>

//                   <CardContent className="space-y-6">
//                     <div className="space-y-3">
//                       {Object.entries(plan.features).map(([feature, value]) => (
//                         <div key={feature} className="flex items-start gap-3">
//                           <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
//                           <div className="flex-1">
//                             <p className="text-sm font-medium capitalize">{feature.replace(/([A-Z])/g, " $1")}</p>
//                             {typeof value === "boolean" ? (
//                               <p className="text-xs text-muted-foreground">{value ? "Included" : "Not included"}</p>
//                             ) : (
//                               <p className="text-xs text-muted-foreground">
//                                 {value === -1 ? "Unlimited" : `${value.toLocaleString()}`}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     <Button
//                       className="w-full"
//                       disabled={isCurrentTier || isDowngrade || isLoading || isPending}
//                       onClick={() => handleSelectTier(tier)}
//                     >
//                       {isCurrentTier
//                         ? "Current Plan"
//                         : isDowngrade
//                           ? "Cannot Downgrade"
//                           : isLoading
//                             ? "Loading..."
//                             : `Upgrade to ${plan.name}`}
//                     </Button>
//                   </CardContent>
//                 </Card>
//               )
//             })}
//           </div>
//         </DialogContent>
//       </Dialog>

//       {selectedTier && (
//         <PaymentModal
//           open={paymentOpen}
//           onOpenChange={setPaymentOpen}
//           tier={selectedTier}
//           clientSecret={clientSecret}
//           isLoading={isLoading}
//           onSuccess={handlePaymentSuccess}
//         />
//       )}
//     </>
//   )
// }


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
  requiredTier: "free" | "pro" | "enterprise"
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
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleUpgrade = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: requiredTier }),
      })

      if (!response.ok) throw new Error("Failed to create payment intent")

      const data = await response.json()
      setClientSecret(data.clientSecret)
      setShowPayment(true)
    } catch (error) {
      console.error("[v0] Error creating payment intent:", error)
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = async () => {
    if (!clientSecret) return

    try {
      const intentId = clientSecret.split("_secret_")[0]

      const response = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: intentId,
          tier: requiredTier,
          saveCard: true,
        }),
      })

      if (!response.ok) throw new Error("Failed to confirm payment")

      setShowPayment(false)
      onClose()

      toast({
        title: "Upgrade Successful!",
        description: `You now have access to all ${requiredTier} features.`,
      })

      window.location.reload()
    } catch (error) {
      console.error("[v0] Error confirming payment:", error)
      toast({
        title: "Subscription Error",
        description: "Payment successful but failed to update subscription. Please contact support.",
        variant: "destructive",
      })
    }
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

          <p className="text-xs text-muted-foreground text-center pt-2">Cancel anytime · 14-day money-back guarantee</p>
        </DialogContent>
      </Dialog>

      {/* Payment modal appears when user clicks upgrade */}
      <PaymentModal
        open={showPayment}
        onOpenChange={setShowPayment}
        tier={requiredTier}
        clientSecret={clientSecret}
        isLoading={isLoading}
        onSuccess={handlePaymentSuccess}
      />
    </>
  )
}
