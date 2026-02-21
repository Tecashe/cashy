import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"

export async function PATCH(req: Request) {
    try {
        const admin = await requireAdmin()
        const { userId, role } = await req.json()

        if (!["USER", "ADMIN", "SUPPORT"].includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 })
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: { id: true, email: true, role: true },
        })

        // Audit log
        await prisma.auditLog.create({
            data: {
                adminId: admin.id,
                action: "user.role_change",
                targetType: "user",
                targetId: userId,
                details: { newRole: role, adminEmail: admin.email },
            },
        })

        return NextResponse.json(user)
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}
