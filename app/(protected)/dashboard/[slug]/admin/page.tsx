import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isAdminUser } from "@/lib/admin-auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { TierPieChart } from "@/components/admin/tier-pie-chart"
import {
    Users, DollarSign, ShoppingBag, TrendingUp, CreditCard,
    ArrowUpRight, Activity, UserPlus,
} from "lucide-react"
import Link from "next/link"

async function getAdminData() {
    const [
        totalUsers,
        totalOrders,
        activeSubscriptions,
        payments,
        salesItems,
        newUsersThisWeek,
        tierBreakdown,
        recentUsers,
        recentOrders,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.order.count(),
        prisma.subscription.count({ where: { status: "active" } }),
        prisma.payment.findMany({ where: { status: "succeeded" }, select: { amount: true } }),
        prisma.salesUploadItem.findMany({ select: { amount: true } }),
        prisma.user.count({
            where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
        }),
        prisma.user.groupBy({ by: ["subscriptionTier"], _count: { id: true } }),
        prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            select: { id: true, email: true, firstName: true, lastName: true, subscriptionTier: true, createdAt: true },
        }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            select: { id: true, orderNumber: true, customerName: true, total: true, status: true, createdAt: true },
        }),
    ])

    // 30-day revenue chart data
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const stripePayments = await prisma.payment.findMany({
        where: { status: "succeeded", createdAt: { gte: startDate } },
        select: { amount: true, createdAt: true },
    })
    const salesItemsData = await prisma.salesUploadItem.findMany({
        where: { date: { gte: startDate } },
        select: { amount: true, date: true },
    })
    const dayMap = new Map<string, { stripe: number; sales: number; date: string }>()
    const addDay = (d: Date) => {
        const key = d.toISOString().slice(0, 10)
        if (!dayMap.has(key)) dayMap.set(key, { stripe: 0, sales: 0, date: key })
        return key
    }
    stripePayments.forEach((p) => { dayMap.get(addDay(p.createdAt))!.stripe += p.amount / 100 })
    salesItemsData.forEach((s) => { dayMap.get(addDay(s.date))!.sales += s.amount })
    const revenueData = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date))

    const stripeRevenue = payments.reduce((s, p) => s + p.amount, 0) / 100
    const uploadedRevenue = salesItems.reduce((s, si) => s + si.amount, 0)
    const totalRevenue = stripeRevenue + uploadedRevenue

    const last30Payments = await prisma.payment.findMany({
        where: { status: "succeeded", createdAt: { gte: startDate } },
        select: { amount: true },
    })
    const mrr = last30Payments.reduce((s, p) => s + p.amount, 0) / 100

    return {
        stats: { totalUsers, totalOrders, activeSubscriptions, totalRevenue, mrr, newUsersThisWeek },
        tierBreakdown: tierBreakdown.map((t) => ({ name: t.subscriptionTier, value: t._count.id })),
        recentUsers,
        recentOrders,
        revenueData,
    }
}

export default async function AdminOverviewPage({ params }: { params: Promise<{ slug: string }> }) {
    const { userId } = await auth()
    if (!userId) redirect("/sign-in")

    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress
    const resolvedParams = await params
    if (!isAdminUser(email)) redirect(`/dashboard/${resolvedParams.slug}`)

    const { slug } = resolvedParams
    const data = await getAdminData()

    const kpis = [
        {
            title: "Total Revenue",
            value: `$${data.stats.totalRevenue.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            sub: `$${data.stats.mrr.toFixed(2)} MRR (30d)`,
        },
        {
            title: "Total Users",
            value: data.stats.totalUsers.toLocaleString(),
            icon: Users,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
            sub: `+${data.stats.newUsersThisWeek} this week`,
        },
        {
            title: "Active Subscriptions",
            value: data.stats.activeSubscriptions.toLocaleString(),
            icon: CreditCard,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            sub: `${((data.stats.activeSubscriptions / Math.max(data.stats.totalUsers, 1)) * 100).toFixed(1)}% conversion`,
        },
        {
            title: "Total Orders",
            value: data.stats.totalOrders.toLocaleString(),
            icon: ShoppingBag,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            sub: "Lifetime",
        },
    ]

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {kpis.map((kpi) => (
                    <Card key={kpi.title} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{kpi.title}</p>
                                    <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
                                </div>
                                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Revenue Chart + Tier Breakdown */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Revenue Over Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RevenueChart initialData={{ chartData: data.revenueData }} initialRange="30d" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Plan Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TierPieChart data={data.tierBreakdown} />
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Recent Users */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="w-5 h-5" />
                                New Users
                            </CardTitle>
                            <Link
                                href={`/dashboard/${slug}/admin/users`}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                View all <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {data.recentUsers.map((user) => (
                                <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                        {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.email}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.subscriptionTier === "pro"
                                            ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                                            : "bg-muted text-muted-foreground"
                                        }`}>
                                        {user.subscriptionTier}
                                    </span>
                                </div>
                            ))}
                            {data.recentUsers.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No users yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Recent Orders
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {data.recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                                        <ShoppingBag className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{order.customerName}</p>
                                        <p className="text-xs text-muted-foreground">#{order.orderNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold">${(order.total / 100).toFixed(2)}</p>
                                        <p className={`text-xs ${order.status === "completed" ? "text-green-600" :
                                                order.status === "pending" ? "text-yellow-600" : "text-muted-foreground"
                                            }`}>{order.status}</p>
                                    </div>
                                </div>
                            ))}
                            {data.recentOrders.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No orders yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
