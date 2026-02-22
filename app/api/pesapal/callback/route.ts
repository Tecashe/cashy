import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

/**
 * Pesapal Callback handler.
 * After payment, Pesapal redirects the customer to this URL.
 * We redirect them back to the billing page with the result.
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const orderTrackingId = searchParams.get("OrderTrackingId")
    const orderMerchantReference = searchParams.get("OrderMerchantReference")
    const orderNotificationType = searchParams.get("OrderNotificationType")

    console.log(`[Pesapal Callback] Order ${orderTrackingId}, Reference: ${orderMerchantReference}, Type: ${orderNotificationType}`)

    // Redirect back to the billing page with success indicator
    // The actual subscription update happens via IPN
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const redirectUrl = new URL("/billing", appUrl)
    redirectUrl.searchParams.set("payment", "success")
    if (orderTrackingId) {
        redirectUrl.searchParams.set("orderId", orderTrackingId)
    }

    return NextResponse.redirect(redirectUrl.toString())
}
