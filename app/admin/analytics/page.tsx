import { requireAdmin } from "@/lib/admin-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, ShoppingBag, Zap } from "lucide-react"
import { prisma } from "@/lib/db"

export default async function AdminAnalyticsPage() {
    await requireAdmin()

    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [
        usersThisMonth,
        usersLastMonth,
        ordersThisMonth,
        ordersLastMonth,
        automationsTotal,
        conversationsThisMonth,
    ] = await Promise.all([
        prisma.user.count({ where: { createdAt: { gte: thisMonth } } }),
        prisma.user.count({ where: { createdAt: { gte: lastMonth, lt: thisMonth } } }),
        prisma.order.count({ where: { createdAt: { gte: thisMonth } } }),
        prisma.order.count({ where: { createdAt: { gte: lastMonth, lt: thisMonth } } }),
        prisma.automation.count({ where: { isActive: true } }),
        prisma.conversation.count({ where: { createdAt: { gte: thisMonth } } }),
    ])

    const metrics = [
        {
            label: "New Users",
            current: usersThisMonth,
            previous: usersLastMonth,
            icon: Users,
            color: "text-blue-500",
        },
        {
            label: "Orders",
            current: ordersThisMonth,
            previous: ordersLastMonth,
            icon: ShoppingBag,
            color: "text-emerald-500",
        },
        {
            label: "Active Automations",
            current: automationsTotal,
            previous: null,
            icon: Zap,
            color: "text-amber-500",
        },
        {
            label: "Conversations This Month",
            current: conversationsThisMonth,
            previous: null,
            icon: TrendingUp,
            color: "text-violet-500",
        },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-1">
                    Platform growth metrics and comparisons.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m) => {
                    const growth =
                        m.previous !== null && m.previous > 0
                            ? Math.round(((m.current - m.previous) / m.previous) * 100)
                            : null

                    return (
                        <Card key={m.label}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{m.label}</p>
                                        <p className="text-2xl font-bold mt-1">{m.current.toLocaleString()}</p>
                                        {growth !== null && (
                                            <p className={`text-xs mt-1 ${growth >= 0 ? "text-green-500" : "text-red-500"}`}>
                                                {growth >= 0 ? "↑" : "↓"} {Math.abs(growth)}% vs last month
                                            </p>
                                        )}
                                    </div>
                                    <m.icon className={`w-5 h-5 ${m.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Platform Health</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                            <p className="text-sm text-muted-foreground">GA Tracking</p>
                            <Badge variant="outline" className={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? "bg-green-500/10 text-green-600 mt-2" : "bg-yellow-500/10 text-yellow-600 mt-2"}>
                                {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? "Active" : "Not Configured"}
                            </Badge>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                            <p className="text-sm text-muted-foreground">Pexels</p>
                            <Badge variant="outline" className={process.env.PEXELS_API_KEY ? "bg-green-500/10 text-green-600 mt-2" : "bg-yellow-500/10 text-yellow-600 mt-2"}>
                                {process.env.PEXELS_API_KEY ? "Active" : "Not Configured"}
                            </Badge>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                            <p className="text-sm text-muted-foreground">Database</p>
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 mt-2">Connected</Badge>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                            <p className="text-sm text-muted-foreground">Auth</p>
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 mt-2">Clerk Active</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
