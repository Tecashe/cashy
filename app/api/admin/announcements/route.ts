import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET() {
    try {
        await requireAdmin()
        const announcements = await prisma.announcement.findMany({
            orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
            include: { author: { select: { firstName: true, email: true } } },
        })
        return NextResponse.json({ announcements })
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}

export async function POST(req: Request) {
    try {
        const admin = await requireAdmin()
        const { title, content, type } = await req.json()

        const announcement = await prisma.announcement.create({
            data: {
                authorId: admin.id,
                title,
                content,
                type: type || "info",
            },
            include: { author: { select: { firstName: true, email: true } } },
        })

        // Audit log
        await prisma.auditLog.create({
            data: {
                adminId: admin.id,
                action: "announcement.create",
                targetType: "announcement",
                targetId: announcement.id,
                details: { title },
            },
        })

        return NextResponse.json({
            announcement: {
                ...announcement,
                createdAt: announcement.createdAt.toISOString(),
                updatedAt: announcement.updatedAt.toISOString(),
                expiresAt: null,
            },
        })
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}
