import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"
import { AdminUserTable } from "@/components/admin/admin-user-table"

export default async function AdminUsersPage() {
    await requireAdmin()

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            take: 20,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                subscriptionTier: true,
                subscriptionStatus: true,
                businessName: true,
                role: true,
                createdAt: true,
                _count: { select: { orders: true, conversations: true, automations: true } },
            },
        }),
        prisma.user.count(),
    ])

    const serialized = users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
    }))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-muted-foreground mt-1">
                    Search, filter, and manage all platform users. Change roles and subscriptions.
                </p>
            </div>
            <AdminUserTable initialUsers={serialized} initialTotal={total} />
        </div>
    )
}
