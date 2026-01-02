import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
})

export default stripe

export async function createPaymentIntent(
  amount: number,
  currency = "usd",
  customerId?: string,
  metadata?: Record<string, string>,
) {
  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString(),
      },
    })

    return { success: true, clientSecret: intent.client_secret, intentId: intent.id }
  } catch (error) {
    console.error("[v0] Error creating payment intent:", error)
    return { success: false, error: "Failed to create payment intent" }
  }
}

export async function getOrCreateStripeCustomer(userId: string, email: string, name?: string) {
  try {
    // Check if customer already exists
    const customers = await stripe.customers.list({ email, limit: 1 })

    if (customers.data.length > 0) {
      return { success: true, customerId: customers.data[0].id }
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { userId },
    })

    return { success: true, customerId: customer.id }
  } catch (error) {
    console.error("[v0] Error managing Stripe customer:", error)
    return { success: false, error: "Failed to create customer" }
  }
}

export async function savePaymentMethod(customerId: string, paymentMethodId: string) {
  try {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    })

    return { success: true }
  } catch (error) {
    console.error("[v0] Error saving payment method:", error)
    return { success: false, error: "Failed to save payment method" }
  }
}
