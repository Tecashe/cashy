import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"
import { AdminUserTable } from "@/components/admin/admin-user-table"

export default async function AdminUsersPage() {
    await requireAdmin()

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            take: 20,
            include: {
                _count: { select: { orders: true, conversations: true, automations: true } },
            },
        }),
        prisma.user.count(),
    ])

    const serialized = users.map((u) => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        subscriptionTier: u.subscriptionTier,
        subscriptionStatus: u.subscriptionStatus,
        businessName: u.businessName,
        role: u.role,
        mrr: u.mrr ?? null,
        contractValue: u.contractValue ?? null,
        accountManager: u.accountManager ?? null,
        createdAt: u.createdAt.toISOString(),
        _count: u._count,
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
