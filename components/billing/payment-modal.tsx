"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tier: "freemium" | "pro" | "business" | "enterprise"
  onSuccess?: () => void
  redirectUrl: string | null
  isLoading?: boolean
}

export function PaymentModal({
  open,
  onOpenChange,
  tier,
  onSuccess,
  redirectUrl,
  isLoading = false,
}: PaymentModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false)

  useEffect(() => {
    if (!open) {
      setIframeLoaded(false)
    }
  }, [open])

  // Listen for messages from the iframe (Pesapal callback)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Pesapal may send a postMessage when payment is complete
      if (event.data?.type === "pesapal_payment_complete") {
        onSuccess?.()
        onOpenChange(false)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [onSuccess, onOpenChange])

  if (!redirectUrl || isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Processing Payment</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
          <p className="text-sm text-muted-foreground text-center">Preparing your upgrade to {tier} plan...</p>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-xl md:max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base">Complete Your Payment</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Enter your card details to upgrade to the <span className="font-semibold capitalize">{tier}</span> plan
          </p>
        </DialogHeader>

        <div className="flex-1 relative min-h-0">
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="flex flex-col items-center gap-3">
                <Spinner />
                <p className="text-sm text-muted-foreground">Loading payment form...</p>
              </div>
            </div>
          )}
          <iframe
            src={redirectUrl}
            className="w-full h-full border-0 rounded-lg"
            onLoad={() => setIframeLoaded(true)}
            title="Pesapal Payment"
            allow="payment"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
