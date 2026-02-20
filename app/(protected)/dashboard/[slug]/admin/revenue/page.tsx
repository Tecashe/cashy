import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isAdminUser } from "@/lib/admin-auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { TrendingUp, DollarSign, ArrowUpRight, BarChart3 } from "lucide-react"
import { TopProductsChart } from "@/components/admin/top-products-chart"

async function getRevenueData() {
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const startDate90 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)

    const [stripeTotal, uploadedTotal, stripeMonthly, uploadedMonthly, topProducts] = await Promise.all([
        prisma.payment.aggregate({ where: { status: "succeeded" }, _sum: { amount: true } }),
        prisma.salesUploadItem.aggregate({ _sum: { amount: true } }),
        prisma.payment.aggregate({
            where: { status: "succeeded", createdAt: { gte: startDate } },
            _sum: { amount: true },
        }),
        prisma.salesUploadItem.aggregate({ where: { date: { gte: startDate } }, _sum: { amount: true } }),
        prisma.salesUploadItem.groupBy({
            by: ["product"],
            where: { product: { not: null }, date: { gte: startDate90 } },
            _sum: { amount: true },
            orderBy: { _sum: { amount: "desc" } },
            take: 8,
        }),
    ])

    const stripePayments = await prisma.payment.findMany({
        where: { status: "succeeded", createdAt: { gte: startDate } },
        select: { amount: true, createdAt: true },
    })
    const salesItems = await prisma.salesUploadItem.findMany({
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
    salesItems.forEach((s) => { dayMap.get(addDay(s.date))!.sales += s.amount })
    const chartData = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date))

    return {
        totals: {
            allTimeTotal: (stripeTotal._sum.amount || 0) / 100 + (uploadedTotal._sum.amount || 0),
            stripeTotal: (stripeTotal._sum.amount || 0) / 100,
            uploadedTotal: uploadedTotal._sum.amount || 0,
            monthlyStripe: (stripeMonthly._sum.amount || 0) / 100,
            monthlyUploaded: uploadedMonthly._sum.amount || 0,
        },
        chartData,
        topProducts: topProducts.map((p) => ({
            name: p.product || "Unknown",
            revenue: p._sum.amount || 0,
        })),
    }
}

export default async function AdminRevenuePage({ params }: { params: Promise<{ slug: string }> }) {
    const { userId } = await auth()
    if (!userId) redirect("/sign-in")
    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress
    const resolvedParams = await params
    if (!isAdminUser(email)) redirect(`/dashboard/${resolvedParams.slug}`)

    const data = await getRevenueData()
    const { totals, chartData, topProducts } = data
    const monthlyTotal = totals.monthlyStripe + totals.monthlyUploaded

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">Revenue Analytics</h2>
                <p className="text-muted-foreground text-sm">Combined Stripe payments + uploaded historical sales</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { label: "All-Time Revenue", value: `$${totals.allTimeTotal.toLocaleString("en", { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "30-Day Revenue", value: `$${monthlyTotal.toLocaleString("en", { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-500/10" },
                    { label: "Stripe Payments", value: `$${totals.stripeTotal.toLocaleString("en", { minimumFractionDigits: 2 })}`, icon: ArrowUpRight, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Historical Sales", value: `$${totals.uploadedTotal.toLocaleString("en", { minimumFractionDigits: 2 })}`, icon: BarChart3, color: "text-orange-500", bg: "bg-orange-500/10" },
                ].map((card) => (
                    <Card key={card.label}>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{card.label}</p>
                                    <p className="text-2xl font-bold mt-1">{card.value}</p>
                                </div>
                                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                                    <card.icon className={`w-5 h-5 ${card.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Revenue Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <RevenueChart initialData={{ chartData }} initialRange="30d" />
                </CardContent>
            </Card>

            {topProducts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Top Products (90 days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TopProductsChart data={topProducts} />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
