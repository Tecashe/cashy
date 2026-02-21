import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin()
        const { id } = await params
        const body = await req.json()

        const announcement = await prisma.announcement.update({
            where: { id },
            data: body,
        })

        return NextResponse.json({ announcement })
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await requireAdmin()
        const { id } = await params

        await prisma.announcement.delete({ where: { id } })

        await prisma.auditLog.create({
            data: {
                adminId: admin.id,
                action: "announcement.delete",
                targetType: "announcement",
                targetId: id,
            },
        })

        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}
