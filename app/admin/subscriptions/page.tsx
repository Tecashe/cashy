import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Users, CreditCard, TrendingUp, AlertCircle } from "lucide-react"

export default async function AdminSubscriptionsPage() {
    await requireAdmin()

    const [subscriptions, tierCounts, statusCounts] = await Promise.all([
        prisma.subscription.findMany({
            orderBy: { createdAt: "desc" },
            take: 50,
            include: {
                user: { select: { email: true, firstName: true, lastName: true, subscriptionTier: true } },
            },
        }),
        prisma.subscription.groupBy({ by: ["tier"], _count: true }),
        prisma.subscription.groupBy({ by: ["status"], _count: true }),
    ])

    const statusColors: Record<string, string> = {
        active: "bg-green-500/10 text-green-600",
        canceled: "bg-red-500/10 text-red-600",
        past_due: "bg-yellow-500/10 text-yellow-600",
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
                <p className="text-muted-foreground mt-1">
                    View all subscriptions, override tiers from the Users page.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {tierCounts.map((tier: { tier: string; _count: number }) => (
                    <Card key={tier.tier}>
                        <CardContent className="p-5">
                            <p className="text-sm text-muted-foreground capitalize">{tier.tier}</p>
                            <p className="text-2xl font-bold">{tier._count}</p>
                        </CardContent>
                    </Card>
                ))}
                {statusCounts.map((status: { status: string; _count: number }) => (
                    <Card key={status.status}>
                        <CardContent className="p-5">
                            <Badge variant="outline" className={`${statusColors[status.status] || ""} mb-1`}>
                                {status.status}
                            </Badge>
                            <p className="text-2xl font-bold">{status._count}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Subscription List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Recent Subscriptions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium">User</th>
                                    <th className="text-left px-4 py-3 font-medium">Tier</th>
                                    <th className="text-left px-4 py-3 font-medium">Status</th>
                                    <th className="text-left px-4 py-3 font-medium">Period</th>
                                    <th className="text-left px-4 py-3 font-medium">Stripe ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscriptions.map((sub) => (
                                    <tr key={sub.id} className="border-t hover:bg-muted/50">
                                        <td className="px-4 py-3">
                                            {sub.user.firstName || sub.user.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className="capitalize">{sub.tier}</Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className={`text-xs ${statusColors[sub.status] || ""}`}>
                                                {sub.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">
                                            {sub.currentPeriodStart.toLocaleDateString()} → {sub.currentPeriodEnd.toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                                            {sub.stripeSubscriptionId?.slice(0, 20) || "—"}
                                        </td>
                                    </tr>
                                ))}
                                {subscriptions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            No subscriptions found
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
