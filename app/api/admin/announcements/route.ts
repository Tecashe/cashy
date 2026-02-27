import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"
import { pusherServer } from "@/lib/pusher"

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

        try {
            // Create anotification for every user
            const users = await prisma.user.findMany({ select: { id: true } })

            let icon = "📋"
            if (type === "warning") icon = "⚠️"
            if (type === "success") icon = "✅"
            if (type === "error") icon = "❌"

            if (users.length > 0) {
                const notificationTitle = `New Announcement: ${title}`
                const notificationMessage = content.substring(0, 150) + (content.length > 150 ? "..." : "")

                const notificationData = users.map(u => ({
                    userId: u.id,
                    title: notificationTitle,
                    message: notificationMessage,
                    type: type || "info",
                    icon,
                    actionUrl: "/dashboard",
                }))

                await prisma.notification.createMany({
                    data: notificationData
                })

                // Trigger pusher events in batches of 100 max
                const BATCH_SIZE = 100
                const createdAt = new Date()
                for (let i = 0; i < users.length; i += BATCH_SIZE) {
                    const batch = users.slice(i, i + BATCH_SIZE)
                    // A trigger can send to an array of channels (max 100)
                    const channels = batch.map(u => `notifications-${u.id}`)
                    try {
                        await pusherServer.trigger(channels, "new-notification", {
                            title: notificationTitle,
                            message: notificationMessage,
                            type: type || "info",
                            icon,
                            actionUrl: "/dashboard",
                            createdAt: createdAt,
                        })
                    } catch (err) {
                        console.error("Failed to trigger pusher for batch", err)
                    }
                }
            }
        } catch (error) {
            console.error("Failed to send notifications for announcement:", error)
            // We ignore errors fetching users or pushing, so the announcement still gets created
        }

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
