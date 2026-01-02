import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import Stripe from "@/lib/stripe"

async function CheckoutSuccessContent() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { searchParams } = notFound()
  const sessionId = searchParams?.get("session_id")

  if (sessionId) {
    try {
      const stripe = Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId)

      // Payment is verified by webhook, but we can show it here
      if (session.payment_status !== "paid") {
        redirect("/pricing?error=payment_incomplete")
      }
    } catch (error) {
      console.error("Failed to verify session:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Upgrade Successful!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="text-center text-muted-foreground">
            <p>Your subscription has been activated. You now have access to all premium features.</p>
          </div>
          <Button asChild className="w-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/pricing">View All Plans</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
