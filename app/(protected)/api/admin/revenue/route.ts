import { auth, currentUser } from "@clerk/nextjs/server"
import { isAdminUser } from "@/lib/admin-auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress
    if (!isAdminUser(email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const range = searchParams.get("range") || "30d"

    const daysMap: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90, "12m": 365 }
    const days = daysMap[range] || 30
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const stripePayments = await prisma.payment.findMany({
        where: { status: "succeeded", createdAt: { gte: startDate } },
        select: { amount: true, createdAt: true, currency: true },
        orderBy: { createdAt: "asc" },
    })

    const salesItems = await prisma.salesUploadItem.findMany({
        where: { date: { gte: startDate } },
        select: { amount: true, date: true, currency: true, product: true },
        orderBy: { date: "asc" },
    })

    const allTimeStripe = await prisma.payment.aggregate({
        where: { status: "succeeded" },
        _sum: { amount: true },
    })
    const allTimeSales = await prisma.salesUploadItem.aggregate({
        _sum: { amount: true },
    })

    const dayMap = new Map<string, { stripe: number; sales: number; date: string }>()
    const addDays = (d: Date) => {
        const key = d.toISOString().slice(0, 10)
        if (!dayMap.has(key)) dayMap.set(key, { stripe: 0, sales: 0, date: key })
        return key
    }

    stripePayments.forEach((p) => {
        const key = addDays(p.createdAt)
        dayMap.get(key)!.stripe += p.amount / 100
    })
    salesItems.forEach((s) => {
        const key = addDays(s.date)
        dayMap.get(key)!.sales += s.amount
    })

    const chartData = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date))

    const productMap = new Map<string, number>()
    salesItems.forEach((s) => {
        if (s.product) {
            productMap.set(s.product, (productMap.get(s.product) || 0) + s.amount)
        }
    })
    const topProducts = Array.from(productMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, revenue]) => ({ name, revenue }))

    return NextResponse.json({
        chartData,
        topProducts,
        totals: {
            allTimeStripe: (allTimeStripe._sum.amount || 0) / 100,
            allTimeSales: allTimeSales._sum.amount || 0,
        },
        periodStripe: stripePayments.reduce((s, p) => s + p.amount / 100, 0),
        periodSales: salesItems.reduce((s, si) => s + si.amount, 0),
    })
}
