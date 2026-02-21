import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"
import { AdminSupportPanel } from "@/components/admin/admin-support-panel"

export default async function AdminSupportPage() {
    await requireAdmin()

    const tickets = await prisma.supportTicket.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { email: true, firstName: true, lastName: true },
            },
            _count: { select: { messages: true } },
        },
    })

    const serialized = tickets.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        resolvedAt: t.resolvedAt?.toISOString() || null,
    }))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
                <p className="text-muted-foreground mt-1">
                    View, triage, and respond to user support requests.
                </p>
            </div>
            <AdminSupportPanel initialTickets={serialized as any} />
        </div>
    )
}
