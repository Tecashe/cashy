import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"

export async function PATCH(req: Request) {
    try {
        const admin = await requireAdmin()
        const { userId, tier } = await req.json()

        if (!["free", "pro", "enterprise"].includes(tier)) {
            return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { subscriptionTier: tier },
            select: { id: true, email: true, subscriptionTier: true },
        })

        // Update subscription record if exists
        await prisma.subscription.updateMany({
            where: { userId },
            data: { tier },
        })

        // Audit log
        await prisma.auditLog.create({
            data: {
                adminId: admin.id,
                action: "user.subscription_override",
                targetType: "user",
                targetId: userId,
                details: { newTier: tier, adminEmail: admin.email },
            },
        })

        return NextResponse.json(user)
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}
