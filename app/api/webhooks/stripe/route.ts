
// // ============================================
// // Webhook handler for Stripe: /api/webhooks/stripe/route.ts
// // ============================================

// import Stripe from "stripe"
// import { NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/db"
// import { getServerSession } from "next-auth"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-12-15.clover",
// })

// export async function POST(request: NextRequest) {
//   const body = await request.text()
//   const sig = request.headers.get("stripe-signature")!

//   let event: Stripe.Event

//   try {
//     event = stripe.webhooks.constructEvent(
//       body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET!
//     )
//   } catch (err) {
//     return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
//   }

//   // Handle the event
//   switch (event.type) {
//     case "checkout.session.completed":
//       const session = event.data.object as Stripe.Checkout.Session
      
//       // Find the payment attempt
//       const paymentAttempt = await prisma.paymentAttempt.findFirst({
//         where: {
//           stripePaymentIntentId: session.payment_intent as string,
//         },
//         include: {
//           conversation: true,
//         },
//       })

//       if (paymentAttempt) {
//         // Update status
//         await prisma.paymentAttempt.update({
//           where: { id: paymentAttempt.id },
//           data: {
//             status: "completed",
//             completedAt: new Date(),
//           },
//         })

//         // Send confirmation message
//         const instagramAccount = await prisma.instagramAccount.findUnique({
//           where: { id: paymentAttempt.conversation?.instagramAccountId },
//         })

//         if (instagramAccount) {
//           const { InstagramAPI } = await import("@/lib/instagram-api")
//           const api = new InstagramAPI({
//             accessToken: instagramAccount.accessToken,
//             instagramId: instagramAccount.instagramId,
//           })

//           await api.sendMessage(
//             paymentAttempt.conversation?.participantId,
//             `✅ Payment received! Your order is confirmed. Order ID: #${session.id.slice(-8)}`
//           )
//         }
//       }
//       break

//     case "payment_intent.payment_failed":
//       // Handle failed payment
//       const paymentIntent = event.data.object as Stripe.PaymentIntent
      
//       await prisma.paymentAttempt.updateMany({
//         where: { stripePaymentIntentId: paymentIntent.id },
//         data: { status: "failed" },
//       })
//       break
//   }

//   return NextResponse.json({ received: true })
// }

// ============================================
// Webhook handler for Stripe: /api/webhooks/stripe/route.ts
// ============================================

import Stripe from "stripe"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session
      
      // Find the payment attempt
      const paymentAttempt = await prisma.paymentAttempt.findFirst({
        where: {
          stripePaymentIntentId: session.payment_intent as string,
        },
      })

      if (paymentAttempt) {
        // Update status
        await prisma.paymentAttempt.update({
          where: { id: paymentAttempt.id },
          data: {
            status: "completed",
            completedAt: new Date(),
          },
        })

        // Get conversation to send message
        const conversation = await prisma.conversation.findUnique({
          where: { id: paymentAttempt.conversationId },
          include: {
            instagramAccount: true,
          },
        })

        if (conversation?.instagramAccount) {
          const { InstagramAPI } = await import("@/lib/instagram-api")
          const api = new InstagramAPI({
            accessToken: conversation.instagramAccount.accessToken,
            instagramId: conversation.instagramAccount.instagramId,
          })

          await api.sendMessage(
            conversation.participantId,
            `✅ Payment received! Your order is confirmed. Order ID: #${session.id.slice(-8)}`
          )
        }
      }
      break

    case "payment_intent.payment_failed":
      // Handle failed payment
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      
      await prisma.paymentAttempt.updateMany({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: { status: "failed" },
      })
      break
  }

  return NextResponse.json({ received: true })
}