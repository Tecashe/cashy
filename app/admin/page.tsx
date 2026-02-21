import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    DollarSign,
    ShoppingBag,
    TrendingUp,
    Headphones,
    Clock,
    Activity,
    Zap,
} from "lucide-react"

export default async function AdminOverviewPage() {
    await requireAdmin()

    const [
        totalUsers,
        newUsersThisMonth,
        totalOrders,
        activeSubscriptions,
        openTickets,
        recentUsers,
        recentOrders,
        tierDistribution,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
            where: { createdAt: { gte: new Date(new Date().setDate(1)) } },
        }),
        prisma.order.count(),
        prisma.subscription.count({ where: { status: "active" } }),
        prisma.supportTicket.count({ where: { status: "open" } }),
        prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                subscriptionTier: true,
                createdAt: true,
            },
        }),
        prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                orderNumber: true,
                customerName: true,
                total: true,
                status: true,
                createdAt: true,
            },
        }),
        prisma.user.groupBy({
            by: ["subscriptionTier"],
            _count: { id: true },
        }),
    ])

    const totalRevenue = await prisma.payment.aggregate({
        where: { status: "succeeded" },
        _sum: { amount: true },
    })

    const kpis = [
        {
            title: "Total Users",
            value: totalUsers.toLocaleString(),
            subtitle: `+${newUsersThisMonth} this month`,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Total Revenue",
            value: `$${((totalRevenue._sum.amount || 0) / 100).toLocaleString()}`,
            subtitle: "All-time",
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Total Orders",
            value: totalOrders.toLocaleString(),
            subtitle: "Cumulative",
            icon: ShoppingBag,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
        {
            title: "Active Subscriptions",
            value: activeSubscriptions.toLocaleString(),
            subtitle: "Paid plans",
            icon: TrendingUp,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
        },
        {
            title: "Open Tickets",
            value: openTickets.toLocaleString(),
            subtitle: "Need attention",
            icon: Headphones,
            color: openTickets > 0 ? "text-red-500" : "text-green-500",
            bg: openTickets > 0 ? "bg-red-500/10" : "bg-green-500/10",
        },
    ]

    const statusColors: Record<string, string> = {
        pending: "bg-yellow-500/10 text-yellow-600",
        processing: "bg-blue-500/10 text-blue-600",
        completed: "bg-green-500/10 text-green-600",
        cancelled: "bg-red-500/10 text-red-600",
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Welcome back. Here&apos;s what&apos;s happening on the platform.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {kpis.map((kpi) => (
                    <Card key={kpi.title} className="relative overflow-hidden">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{kpi.title}</p>
                                    <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
                                </div>
                                <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tier Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Plan Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-6 flex-wrap">
                        {tierDistribution.map((tier: { subscriptionTier: string; _count: { id: number } }) => (
                            <div key={tier.subscriptionTier} className="text-center">
                                <p className="text-3xl font-bold">{tier._count.id}</p>
                                <Badge variant="outline" className="mt-1 capitalize">
                                    {tier.subscriptionTier}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Recent Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentUsers.map((user: { id: string; firstName: string | null; lastName: string | null; email: string; subscriptionTier: string; createdAt: Date }) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                                >
                                    <div>
                                        <p className="font-medium text-sm">
                                            {user.firstName || user.lastName
                                                ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                                                : "—"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="capitalize text-xs">
                                            {user.subscriptionTier}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3 inline mr-1" />
                                            {user.createdAt.toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {recentUsers.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No users yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5" />
                            Recent Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentOrders.map((order: { id: string; orderNumber: string; customerName: string; total: number; status: string; createdAt: Date }) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                                >
                                    <div>
                                        <p className="font-medium text-sm">{order.customerName}</p>
                                        <p className="text-xs text-muted-foreground">#{order.orderNumber}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            className={`text-xs capitalize ${statusColors[order.status] || ""}`}
                                            variant="outline"
                                        >
                                            {order.status}
                                        </Badge>
                                        <span className="text-sm font-medium">
                                            ${(order.total / 100).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {recentOrders.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No orders yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: "View All Users", href: "/admin/users", icon: Users },
                            { label: "Support Tickets", href: "/admin/support", icon: Headphones },
                            { label: "Manage Team", href: "/admin/team", icon: Activity },
                            { label: "Post Announcement", href: "/admin/announcements", icon: Zap },
                        ].map((action) => (
                            <a
                                key={action.href}
                                href={action.href}
                                className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors group"
                            >
                                <action.icon className="w-5 h-5 text-muted-foreground group-hover:text-violet-500 transition-colors" />
                                <span className="text-sm font-medium">{action.label}</span>
                            </a>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
