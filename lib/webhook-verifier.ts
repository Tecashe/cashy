import crypto from "crypto"

export function verifyInstagramWebhook(payload: string, signature: string): boolean {
  const appSecret = process.env.INSTAGRAM_APP_SECRET

  if (!appSecret) {
    console.error("[WebhookVerifier] Missing INSTAGRAM_APP_SECRET")
    return false
  }

  // Remove 'sha256=' prefix if present
  const sig = signature.startsWith("sha256=") ? signature.substring(7) : signature

  const expectedSignature = crypto.createHmac("sha256", appSecret).update(payload, "utf8").digest("hex")

  // Use timing-safe comparison
  try {
    return crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expectedSignature, "hex"))
  } catch {
    return false
  }
}
