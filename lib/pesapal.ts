/**
 * Pesapal API v3 Integration
 * 
 * Card-only payment via iFrame.
 * Docs: https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/api-reference
 */

const PESAPAL_URLS = {
    sandbox: {
        auth: "https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken",
        registerIPN: "https://cybqa.pesapal.com/pesapalv3/api/URLSetup/RegisterIPN",
        submitOrder: "https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest",
        getTransactionStatus: "https://cybqa.pesapal.com/pesapalv3/api/Transactions/GetTransactionStatus",
    },
    production: {
        auth: "https://pay.pesapal.com/v3/api/Auth/RequestToken",
        registerIPN: "https://pay.pesapal.com/v3/api/URLSetup/RegisterIPN",
        submitOrder: "https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest",
        getTransactionStatus: "https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus",
    },
}

function getUrls() {
    const env = process.env.PESAPAL_ENVIRONMENT === "production" ? "production" : "sandbox"
    return PESAPAL_URLS[env]
}

// Token cache
let cachedToken: { token: string; expiresAt: Date } | null = null

/**
 * Authenticate with Pesapal and get a bearer token.
 * Token is valid for 5 minutes and is cached.
 */
export async function getAuthToken(): Promise<string> {
    // Return cached token if still valid (with 30-second buffer)
    if (cachedToken && cachedToken.expiresAt > new Date(Date.now() + 30000)) {
        return cachedToken.token
    }

    const urls = getUrls()
    const response = await fetch(urls.auth, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            consumer_key: process.env.PESAPAL_CONSUMER_KEY,
            consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
        }),
    })

    if (!response.ok) {
        throw new Error(`Pesapal auth failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.error) {
        throw new Error(`Pesapal auth error: ${JSON.stringify(data.error)}`)
    }

    cachedToken = {
        token: data.token,
        expiresAt: new Date(data.expiryDate),
    }

    return data.token
}

/**
 * Register an IPN (Instant Payment Notification) URL.
 * Returns the IPN ID to use in order submissions.
 */
export async function registerIPN(ipnUrl: string): Promise<string> {
    const token = await getAuthToken()
    const urls = getUrls()

    const response = await fetch(urls.registerIPN, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            url: ipnUrl,
            ipn_notification_type: "GET",
        }),
    })

    if (!response.ok) {
        throw new Error(`Pesapal IPN registration failed: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
        throw new Error(`Pesapal IPN registration error: ${JSON.stringify(data.error)}`)
    }

    return data.ipn_id
}

// IPN ID cache
let cachedIpnId: string | null = null

/**
 * Get or register the IPN ID (cached for the lifetime of the server).
 */
export async function getOrRegisterIPN(): Promise<string> {
    if (cachedIpnId) return cachedIpnId

    const ipnUrl = process.env.PESAPAL_IPN_URL
    if (!ipnUrl) {
        throw new Error("PESAPAL_IPN_URL environment variable is not set")
    }

    cachedIpnId = await registerIPN(ipnUrl)
    return cachedIpnId
}

export interface SubmitOrderParams {
    orderId: string
    amount: number
    currency: string
    description: string
    callbackUrl: string
    customerEmail: string
    customerPhone?: string
    customerFirstName?: string
    customerLastName?: string
}

export interface SubmitOrderResponse {
    order_tracking_id: string
    merchant_reference: string
    redirect_url: string
    error: string | null
    status: string
}

/**
 * Submit an order to Pesapal.
 * Returns the redirect_url which can be loaded in an iFrame.
 */
export async function submitOrder(params: SubmitOrderParams): Promise<SubmitOrderResponse> {
    const token = await getAuthToken()
    const urls = getUrls()
    const notificationId = await getOrRegisterIPN()

    const response = await fetch(urls.submitOrder, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            id: params.orderId,
            currency: params.currency,
            amount: params.amount,
            description: params.description,
            callback_url: params.callbackUrl,
            redirect_mode: "",
            notification_id: notificationId,
            billing_address: {
                email_address: params.customerEmail,
                phone_number: params.customerPhone || "",
                first_name: params.customerFirstName || "",
                last_name: params.customerLastName || "",
                country_code: "KE",
                line_1: "",
                line_2: "",
                city: "",
                state: "",
                postal_code: "",
                zip_code: "",
            },
        }),
    })

    if (!response.ok) {
        throw new Error(`Pesapal submit order failed: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
        throw new Error(`Pesapal submit order error: ${JSON.stringify(data.error)}`)
    }

    return data
}

export interface TransactionStatus {
    payment_method: string
    amount: number
    created_date: string
    confirmation_code: string
    payment_status_description: string
    description: string
    message: string
    payment_account: string
    call_back_url: string
    status_code: number
    merchant_reference: string
    payment_status_code: string
    currency: string
    error: { error_type: string; code: string; message: string } | null
    status: string
}

/**
 * Get the transaction status from Pesapal.
 * Status codes: 0=INVALID, 1=COMPLETED, 2=FAILED, 3=REVERSED
 */
export async function getTransactionStatus(orderTrackingId: string): Promise<TransactionStatus> {
    const token = await getAuthToken()
    const urls = getUrls()

    const response = await fetch(
        `${urls.getTransactionStatus}?orderTrackingId=${orderTrackingId}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        },
    )

    if (!response.ok) {
        throw new Error(`Pesapal get status failed: ${response.status}`)
    }

    const data = await response.json()
    return data
}
