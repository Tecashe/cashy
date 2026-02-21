import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export type AdminRole = "USER" | "ADMIN" | "SUPPORT"

export async function getAdminUser() {
    const user = await currentUser()
    if (!user) return null

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
        select: { id: true, email: true, firstName: true, lastName: true, role: true, imageUrl: true },
    })

    if (!dbUser) return null
    if (dbUser.role !== "ADMIN" && dbUser.role !== "SUPPORT") return null

    return { ...dbUser, clerkId: user.id }
}

export async function requireAdmin() {
    const admin = await getAdminUser()
    if (!admin) throw new Error("Unauthorized: Admin access required")
    return admin
}

export async function isAdminUser(email?: string | null): Promise<boolean> {
    if (!email) return false
    // Check DB role first
    const user = await prisma.user.findUnique({
        where: { email },
        select: { role: true },
    })
    if (user?.role === "ADMIN" || user?.role === "SUPPORT") return true
    // Fallback to env whitelist for initial bootstrap
    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) || []
    return adminEmails.includes(email.toLowerCase())
}
