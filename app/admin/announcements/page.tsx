import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"
import { AnnouncementsManager } from "@/components/admin/announcements-manager"

export default async function AdminAnnouncementsPage() {
    await requireAdmin()

    const announcements = await prisma.announcement.findMany({
        orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
        include: {
            author: { select: { firstName: true, email: true } },
        },
    })

    const serialized = announcements.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
        expiresAt: a.expiresAt?.toISOString() || null,
    }))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
                <p className="text-muted-foreground mt-1">
                    Broadcast messages to all users. Pinned announcements appear at the top of the user dashboard.
                </p>
            </div>
            <AnnouncementsManager initialAnnouncements={serialized} />
        </div>
    )
}
