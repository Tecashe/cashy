import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isAdminUser } from "@/lib/admin-auth"
import { prisma } from "@/lib/db"
import { UserTable } from "@/components/admin/user-table"

async function getUsers() {
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            take: 20,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                subscriptionTier: true,
                subscriptionStatus: true,
                businessName: true,
                createdAt: true,
                _count: { select: { orders: true, conversations: true, automations: true } },
            },
        }),
        prisma.user.count(),
    ])
    return { users, total }
}

export default async function AdminUsersPage({ params }: { params: Promise<{ slug: string }> }) {
    const { userId } = await auth()
    if (!userId) redirect("/sign-in")
    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress
    const resolvedParams = await params
    if (!isAdminUser(email)) redirect(`/dashboard/${resolvedParams.slug}`)

    const { users, total } = await getUsers()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">User Management</h2>
                <p className="text-muted-foreground text-sm">Search, filter and view all platform users</p>
            </div>
            <UserTable
                initialUsers={users as Parameters<typeof UserTable>[0]["initialUsers"]}
                initialTotal={total}
            />
        </div>
    )
}
