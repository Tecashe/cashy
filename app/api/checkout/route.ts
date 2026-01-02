import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import stripe from "@/lib/stripe"
import { getPriceIdForTier } from "@/lib/stripe-utils"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      })
    }

    const { plan } = await request.json()

    if (!plan || !SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS]) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), {
        status: 400,
      })
    }

    if (plan === "free") {
      return new Response(JSON.stringify({ error: "Use account settings to downgrade to free" }), {
        status: 400,
      })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, email: true },
    })

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      })
    }

    const priceId = getPriceIdForTier(plan as keyof typeof SUBSCRIPTION_PLANS)
    if (!priceId) {
      return new Response(JSON.stringify({ error: "Invalid plan pricing" }), {
        status: 400,
      })
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      metadata: {
        userId: user.id,
        clerkId: userId,
        plan: plan,
      },
    })

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        checkoutUrl: session.url,
      }),
      {
        status: 200,
      },
    )
  } catch (error) {
    console.error("Checkout error:", error)
    return new Response(JSON.stringify({ error: "Checkout failed" }), {
      status: 500,
    })
  }
}
