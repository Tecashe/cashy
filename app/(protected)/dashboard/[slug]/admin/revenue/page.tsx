// import { auth, currentUser } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { isAdminUser } from "@/lib/admin-auth"
// import { prisma } from "@/lib/db"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { RevenueChart } from "@/components/admin/revenue-chart"
// import { TrendingUp, DollarSign, ArrowUpRight, BarChart3 } from "lucide-react"
// import { TopProductsChart } from "@/components/admin/top-products-chart"

// async function getRevenueData() {
//     const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
//     const startDate90 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)

//     const [stripeTotal, uploadedTotal, stripeMonthly, uploadedMonthly, topProducts] = await Promise.all([
//         prisma.payment.aggregate({ where: { status: "succeeded" }, _sum: { amount: true } }),
//         prisma.salesUploadItem.aggregate({ _sum: { amount: true } }),
//         prisma.payment.aggregate({
//             where: { status: "succeeded", createdAt: { gte: startDate } },
//             _sum: { amount: true },
//         }),
//         prisma.salesUploadItem.aggregate({ where: { date: { gte: startDate } }, _sum: { amount: true } }),
//         prisma.salesUploadItem.groupBy({
//             by: ["product"],
//             where: { product: { not: null }, date: { gte: startDate90 } },
//             _sum: { amount: true },
//             orderBy: { _sum: { amount: "desc" } },
//             take: 8,
//         }),
//     ])

//     const stripePayments = await prisma.payment.findMany({
//         where: { status: "succeeded", createdAt: { gte: startDate } },
//         select: { amount: true, createdAt: true },
//     })
//     const salesItems = await prisma.salesUploadItem.findMany({
//         where: { date: { gte: startDate } },
//         select: { amount: true, date: true },
//     })

//     const dayMap = new Map<string, { stripe: number; sales: number; date: string }>()
//     const addDay = (d: Date) => {
//         const key = d.toISOString().slice(0, 10)
//         if (!dayMap.has(key)) dayMap.set(key, { stripe: 0, sales: 0, date: key })
//         return key
//     }
//     stripePayments.forEach((p) => { dayMap.get(addDay(p.createdAt))!.stripe += p.amount / 100 })
//     salesItems.forEach((s) => { dayMap.get(addDay(s.date))!.sales += s.amount })
//     const chartData = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date))

//     return {
//         totals: {
//             allTimeTotal: (stripeTotal._sum.amount || 0) / 100 + (uploadedTotal._sum.amount || 0),
//             stripeTotal: (stripeTotal._sum.amount || 0) / 100,
//             uploadedTotal: uploadedTotal._sum.amount || 0,
//             monthlyStripe: (stripeMonthly._sum.amount || 0) / 100,
//             monthlyUploaded: uploadedMonthly._sum.amount || 0,
//         },
//         chartData,
//         topProducts: topProducts.map((p) => ({
//             name: p.product || "Unknown",
//             revenue: p._sum.amount || 0,
//         })),
//     }
// }

// export default async function AdminRevenuePage({ params }: { params: Promise<{ slug: string }> }) {
//     const { userId } = await auth()
//     if (!userId) redirect("/sign-in")
//     const clerkUser = await currentUser()
//     const email = clerkUser?.emailAddresses?.[0]?.emailAddress
//     const resolvedParams = await params
//     if (!isAdminUser(email)) redirect(`/dashboard/${resolvedParams.slug}`)

//     const data = await getRevenueData()
//     const { totals, chartData, topProducts } = data
//     const monthlyTotal = totals.monthlyStripe + totals.monthlyUploaded

//     return (
//         <div className="space-y-6">
//             <div>
//                 <h2 className="text-xl font-bold">Revenue Analytics</h2>
//                 <p className="text-muted-foreground text-sm">Combined Stripe payments + uploaded historical sales</p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//                 {[
//                     { label: "All-Time Revenue", value: `$${totals.allTimeTotal.toLocaleString("en", { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
//                     { label: "30-Day Revenue", value: `$${monthlyTotal.toLocaleString("en", { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-500/10" },
//                     { label: "Stripe Payments", value: `$${totals.stripeTotal.toLocaleString("en", { minimumFractionDigits: 2 })}`, icon: ArrowUpRight, color: "text-blue-500", bg: "bg-blue-500/10" },
//                     { label: "Historical Sales", value: `$${totals.uploadedTotal.toLocaleString("en", { minimumFractionDigits: 2 })}`, icon: BarChart3, color: "text-orange-500", bg: "bg-orange-500/10" },
//                 ].map((card) => (
//                     <Card key={card.label}>
//                         <CardContent className="p-6">
//                             <div className="flex items-start justify-between">
//                                 <div>
//                                     <p className="text-sm text-muted-foreground">{card.label}</p>
//                                     <p className="text-2xl font-bold mt-1">{card.value}</p>
//                                 </div>
//                                 <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
//                                     <card.icon className={`w-5 h-5 ${card.color}`} />
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>

//             <Card>
//                 <CardHeader>
//                     <CardTitle>Revenue Over Time</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <RevenueChart initialData={{ chartData }} initialRange="30d" />
//                 </CardContent>
//             </Card>

//             {topProducts.length > 0 && (
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Top Products (90 days)</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <TopProductsChart data={topProducts} />
//                     </CardContent>
//                 </Card>
//             )}
//         </div>
//     )
// }

import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isAdminUser } from "@/lib/admin-auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { TrendingUp, DollarSign, ArrowUpRight, BarChart3, Download } from "lucide-react"
import { TopProductsChart } from "@/components/admin/top-products-chart"
import Link from "next/link"

const PROFIT_MARGIN = 0.8356 // 83.56% → TTM Profit $6.1k / TTM Revenue $7.3k

async function getRevenueData() {
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const startDate90 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    const startDateTTM = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)

    const [
        stripeTotal, uploadedTotal,
        stripeMonthly, uploadedMonthly,
        stripeTTM, uploadedTTM,
        topProducts,
    ] = await Promise.all([
        prisma.payment.aggregate({ where: { status: "succeeded" }, _sum: { amount: true } }),
        prisma.salesUploadItem.aggregate({ _sum: { amount: true } }),
        prisma.payment.aggregate({ where: { status: "succeeded", createdAt: { gte: startDate } }, _sum: { amount: true } }),
        prisma.salesUploadItem.aggregate({ where: { date: { gte: startDate } }, _sum: { amount: true } }),
        prisma.payment.aggregate({ where: { status: "succeeded", createdAt: { gte: startDateTTM } }, _sum: { amount: true } }),
        prisma.salesUploadItem.aggregate({ where: { date: { gte: startDateTTM } }, _sum: { amount: true } }),
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

    const ttmRevenue = (stripeTTM._sum.amount || 0) / 100 + (uploadedTTM._sum.amount || 0)
    const ttmProfit = ttmRevenue * PROFIT_MARGIN

    return {
        totals: {
            ttmRevenue,
            ttmProfit,
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

function fmt(n: number) {
    return n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
            {/* Page header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold">Revenue Analytics</h2>
                    <p className="text-muted-foreground text-sm">Combined Stripe payments + uploaded historical sales</p>
                </div>
                {/* Download button — links to the pre-generated report */}
                <a
                    href="/reports/yazzil_revenue_report.xlsx"
                    download
                    className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Export Excel
                </a>
            </div>

            {/* ── Row 1: TTM + All-time KPIs ── */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {/* TTM Revenue — primary */}
                <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">TTM Revenue</p>
                                <p className="text-3xl font-bold mt-1 text-emerald-700 dark:text-emerald-300">
                                    ${totals.ttmRevenue >= 1000
                                        ? `${(totals.ttmRevenue / 1000).toFixed(1)}k`
                                        : fmt(totals.ttmRevenue)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">Trailing 12 months</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-emerald-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* TTM Profit — primary */}
                <Card className="border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/30 dark:to-background">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold tracking-widest text-violet-600 dark:text-violet-400 uppercase">TTM Profit</p>
                                <p className="text-3xl font-bold mt-1 text-violet-700 dark:text-violet-300">
                                    ${totals.ttmProfit >= 1000
                                        ? `${(totals.ttmProfit / 1000).toFixed(1)}k`
                                        : fmt(totals.ttmProfit)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {(PROFIT_MARGIN * 100).toFixed(1)}% margin
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-violet-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stripe Total */}
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase">Stripe Payments</p>
                                <p className="text-2xl font-bold mt-1">${fmt(totals.stripeTotal)}</p>
                                <p className="text-xs text-muted-foreground mt-1">All-time</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <ArrowUpRight className="w-5 h-5 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Historical Sales */}
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold tracking-widest text-orange-600 dark:text-orange-400 uppercase">Historical Sales</p>
                                <p className="text-2xl font-bold mt-1">${fmt(totals.uploadedTotal)}</p>
                                <p className="text-xs text-muted-foreground mt-1">Uploaded records</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-orange-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Row 2: Secondary stats ── */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">All-Time Revenue</p>
                        <p className="text-xl font-bold mt-1">${fmt(totals.allTimeTotal)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">30-Day Revenue</p>
                        <p className="text-xl font-bold mt-1">${fmt(monthlyTotal)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">30-Day Profit</p>
                        <p className="text-xl font-bold mt-1 text-emerald-600">${fmt(monthlyTotal * PROFIT_MARGIN)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* ── Revenue Chart ── */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <RevenueChart initialData={{ chartData }} initialRange="30d" />
                </CardContent>
            </Card>

            {/* ── Top Products ── */}
            {topProducts.length > 0 && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Top Products (90 days)</CardTitle>
                        <p className="text-xs text-muted-foreground">Matches "Top Products" sheet in Excel export</p>
                    </CardHeader>
                    <CardContent>
                        <TopProductsChart data={topProducts} />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}