import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Calendar, CreditCard } from "lucide-react"

export default async function AdminRevenuePage() {
    await requireAdmin()

    const [totalRevenue, monthlyRevenue, recentPayments, subscriptionsByTier] = await Promise.all([
        prisma.payment.aggregate({
            where: { status: "succeeded" },
            _sum: { amount: true },
            _count: true,
        }),
        prisma.payment.aggregate({
            where: {
                status: "succeeded",
                createdAt: { gte: new Date(new Date().setDate(1)) },
            },
            _sum: { amount: true },
            _count: true,
        }),
        prisma.payment.findMany({
            where: { status: "succeeded" },
            orderBy: { createdAt: "desc" },
            take: 20,
            include: { user: { select: { email: true, firstName: true } } },
        }),
        prisma.subscription.groupBy({
            by: ["tier"],
            where: { status: "active" },
            _count: true,
        }),
    ])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Revenue Analytics</h1>
                <p className="text-muted-foreground mt-1">
                    Track payments, revenue trends, and subscription metrics.
                </p>
            </div>

            {/* Revenue KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">All-Time Revenue</p>
                                <p className="text-2xl font-bold mt-1">
                                    ${((totalRevenue._sum.amount || 0) / 100).toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">{totalRevenue._count} payments</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-emerald-500/10">
                                <DollarSign className="w-5 h-5 text-emerald-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">This Month</p>
                                <p className="text-2xl font-bold mt-1">
                                    ${((monthlyRevenue._sum.amount || 0) / 100).toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">{monthlyRevenue._count} payments</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-blue-500/10">
                                <Calendar className="w-5 h-5 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {subscriptionsByTier.map((sub: { tier: string; _count: number }) => (
                    <Card key={sub.tier}>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground capitalize">{sub.tier} Subs</p>
                                    <p className="text-2xl font-bold mt-1">{sub._count}</p>
                                    <p className="text-xs text-muted-foreground">Active</p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-violet-500/10">
                                    <TrendingUp className="w-5 h-5 text-violet-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Payments */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Recent Payments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium">User</th>
                                    <th className="text-left px-4 py-3 font-medium">Amount</th>
                                    <th className="text-left px-4 py-3 font-medium">Status</th>
                                    <th className="text-left px-4 py-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPayments.map((payment) => (
                                    <tr key={payment.id} className="border-t hover:bg-muted/50 transition-colors">
                                        <td className="px-4 py-3">
                                            {payment.user.firstName || payment.user.email}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            ${(payment.amount / 100).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600">
                                                {payment.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {payment.createdAt.toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {recentPayments.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                            No payments yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
