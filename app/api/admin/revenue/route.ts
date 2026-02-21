import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"

// Exchange rates relative to USD (approximations, in real production fetch from an API)
const EXCHANGE_RATES: Record<string, number> = {
    USD: 1,
    GBP: 0.79,
    EUR: 0.92,
    KES: 129.5, // Kenyan Shilling (M-Pesa home currency)
    AED: 3.67,
    CAD: 1.36,
    AUD: 1.53,
    INR: 83.1,
}

export async function GET(req: Request) {
    try {
        await requireAdmin()

        const { searchParams } = new URL(req.url)
        const days = parseInt(searchParams.get("days") || "365")
        const currency = searchParams.get("currency") || "USD"
        const rate = EXCHANGE_RATES[currency] || 1

        const since = new Date()
        since.setDate(since.getDate() - days)

        // Parallel fetch: all sales data plus per-month breakdown
        const [items, allItems] = await Promise.all([
            prisma.salesUploadItem.findMany({
                where: { date: { gte: since } },
                orderBy: { date: "asc" },
                select: {
                    date: true,
                    amount: true,
                    customer: true,
                    product: true,
                    paymentMethod: true,
                    currency: true,
                },
            }),
            prisma.salesUploadItem.findMany({
                orderBy: { date: "asc" },
                select: { date: true, amount: true, customer: true },
            }),
        ])

        // Convert amounts to target currency
        const convert = (usd: number) => Math.round(usd * rate * 100) / 100

        // Monthly aggregation for the selected period
        const monthlyMap: Record<string, number> = {}
        for (const item of items) {
            const key = `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, "0")}`
            monthlyMap[key] = (monthlyMap[key] || 0) + item.amount
        }

        const monthly = Object.entries(monthlyMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, total]) => ({
                month,
                label: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
                total: convert(total),
                totalUSD: total,
            }))

        // Per-customer breakdown
        const customerMap: Record<string, { total: number; count: number; lastDate: string }> = {}
        for (const item of items) {
            const c = item.customer || "Unknown"
            if (!customerMap[c]) customerMap[c] = { total: 0, count: 0, lastDate: "" }
            customerMap[c].total += item.amount
            customerMap[c].count += 1
            customerMap[c].lastDate = item.date.toISOString().split("T")[0]
        }

        const customers = Object.entries(customerMap)
            .sort(([, a], [, b]) => b.total - a.total)
            .map(([name, data]) => ({
                name,
                total: convert(data.total),
                totalUSD: data.total,
                transactions: data.count,
                lastPayment: data.lastDate,
                avgTransaction: convert(data.total / data.count),
            }))

        // Totals
        const totalUSD = items.reduce((s, i) => s + i.amount, 0)
        const totalConverted = convert(totalUSD)

        // Previous period for comparison
        const prevSince = new Date(since)
        prevSince.setDate(prevSince.getDate() - days)
        const prevItems = allItems.filter(
            (i) => i.date >= prevSince && i.date < since
        )
        const prevTotalUSD = prevItems.reduce((s, i) => s + i.amount, 0)
        const growth =
            prevTotalUSD > 0
                ? Math.round(((totalUSD - prevTotalUSD) / prevTotalUSD) * 1000) / 10
                : 0

        // MRR estimate (annualized monthly)
        const mrr = monthly.length > 0
            ? convert(monthly.reduce((s, m) => s + m.totalUSD, 0) / monthly.length)
            : 0

        // ARR
        const arr = mrr * 12

        // Recent transactions
        const recent = items.slice(-10).reverse().map((i) => ({
            date: i.date.toISOString().split("T")[0],
            amount: convert(i.amount),
            customer: i.customer,
            product: i.product,
            paymentMethod: i.paymentMethod,
        }))

        return NextResponse.json({
            currency,
            rate,
            totalRevenue: totalConverted,
            totalRevenueUSD: totalUSD,
            growth,
            mrr,
            arr,
            transactionCount: items.length,
            monthly,
            customers,
            recent,
            exchangeRates: EXCHANGE_RATES,
        })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}
