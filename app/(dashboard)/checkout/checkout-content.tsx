"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"

export function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const plan = searchParams.get("plan") || "pro"
  const [loading, setLoading] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)

  const planData = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS]

  useEffect(() => {
    const initiateCheckout = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        })

        if (!response.ok) throw new Error("Failed to create checkout")

        const data = await response.json()
        setCheckoutUrl(data.checkoutUrl)

        // Redirect to Stripe checkout
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl
        }
      } catch (error) {
        console.error("Checkout error:", error)
        setLoading(false)
      }
    }

    initiateCheckout()
  }, [plan])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Upgrading to {planData?.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          {loading || !checkoutUrl ? (
            <>
              <Spinner />
              <p className="text-muted-foreground text-center">
                Redirecting to payment... If you are not redirected, please wait.
              </p>
            </>
          ) : (
            <>
              <p className="text-muted-foreground text-center">You will be redirected to complete your purchase.</p>
              <Button onClick={() => (window.location.href = checkoutUrl)}>Continue to Payment</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
