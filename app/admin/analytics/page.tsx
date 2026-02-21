import { requireAdmin } from "@/lib/admin-auth"
import { AdminGAWidget } from "@/components/admin/admin-ga-widget"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingBag, Zap, MessageSquare } from "lucide-react"

export default async function AdminAnalyticsPage() {
    await requireAdmin()

    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [
        usersThisMonth, usersLastMonth,
        ordersThisMonth, ordersLastMonth,
        automationsTotal, conversationsThisMonth,
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
            label: "New Users", current: usersThisMonth, previous: usersLastMonth,
            icon: Users, color: "text-blue-500", bg: "bg-blue-500/10",
            tip: "Users who created an account this calendar month.",
        },
        {
            label: "Orders", current: ordersThisMonth, previous: ordersLastMonth,
            icon: ShoppingBag, color: "text-emerald-500", bg: "bg-emerald-500/10",
            tip: "Chatbot-assisted orders placed this month.",
        },
        {
            label: "Active Automations", current: automationsTotal, previous: null,
            icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10",
            tip: "Total automations that are currently enabled across all workspaces.",
        },
        {
            label: "Conversations", current: conversationsThisMonth, previous: null,
            icon: MessageSquare, color: "text-violet-500", bg: "bg-violet-500/10",
            tip: "AI conversations initiated this month across all users.",
        },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-1">
                    Platform usage metrics and live Google Analytics website traffic data.
                </p>
            </div>

            {/* Platform Metrics */}
            <div>
                <h2 className="text-base font-semibold mb-3">Platform Metrics — This Month</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((m) => {
                        const growth = m.previous !== null && m.previous > 0
                            ? Math.round(((m.current - m.previous) / m.previous) * 100)
                            : null
                        return (
                            <Card key={m.label} title={m.tip}>
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground">{m.label}</p>
                                            <p className="text-2xl font-bold mt-1">{m.current.toLocaleString()}</p>
                                            {growth !== null && (
                                                <p className={`text-xs mt-1 ${growth >= 0 ? "text-green-500" : "text-red-500"}`}>
                                                    {growth >= 0 ? "↑" : "↓"} {Math.abs(growth)}% vs last month
                                                </p>
                                            )}
                                        </div>
                                        <div className={`p-2 rounded-xl ${m.bg}`}>
                                            <m.icon className={`w-4 h-4 ${m.color}`} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* Google Analytics */}
            <Card>
                <CardContent className="p-6">
                    <AdminGAWidget />
                </CardContent>
            </Card>
        </div>
    )
}
