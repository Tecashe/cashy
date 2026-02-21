import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ ticketId: string }> }
) {
    try {
        const admin = await requireAdmin()
        const { ticketId } = await params
        const { status } = await req.json()

        if (!["open", "in_progress", "resolved", "closed"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 })
        }

        const ticket = await prisma.supportTicket.update({
            where: { id: ticketId },
            data: {
                status,
                resolvedAt: status === "resolved" ? new Date() : undefined,
            },
        })

        // Audit log
        await prisma.auditLog.create({
            data: {
                adminId: admin.id,
                action: "ticket.status_change",
                targetType: "ticket",
                targetId: ticketId,
                details: { newStatus: status },
            },
        })

        return NextResponse.json({ ticket })
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}
