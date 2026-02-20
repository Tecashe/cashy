/**
 * Admin authentication utility
 * Checks if a given email is in the ADMIN_EMAILS environment variable whitelist
 */

export function isAdminUser(email: string | null | undefined): boolean {
    if (!email) return false
    const adminEmails = process.env.ADMIN_EMAILS || ""
    const list = adminEmails.split(",").map((e) => e.trim().toLowerCase())
    return list.includes(email.toLowerCase())
}
