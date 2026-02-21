"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    TrendingUp, TrendingDown, DollarSign, BarChart3, Users,
    CreditCard, RefreshCw, Info, ArrowUpRight, ArrowDownRight,
    Calendar, Zap
} from "lucide-react"

interface MonthlyData {
    month: string
    label: string
    total: number
    totalUSD: number
}

interface CustomerData {
    name: string
    total: number
    totalUSD: number
    transactions: number
    lastPayment: string
    avgTransaction: number
}

interface RecentTx {
    date: string
    amount: number
    customer: string | null
    product: string | null
    paymentMethod: string
}

interface RevenueData {
    currency: string
    rate: number
    totalRevenue: number
    totalRevenueUSD: number
    growth: number
    mrr: number
    arr: number
    transactionCount: number
    monthly: MonthlyData[]
    customers: CustomerData[]
    recent: RecentTx[]
    exchangeRates: Record<string, number>
}

const CURRENCIES = [
    { code: "USD", symbol: "$", flag: "🇺🇸" },
    { code: "GBP", symbol: "£", flag: "🇬🇧" },
    { code: "EUR", symbol: "€", flag: "🇪🇺" },
    { code: "KES", symbol: "KSh", flag: "🇰🇪" },
    { code: "AED", symbol: "د.إ", flag: "🇦🇪" },
    { code: "CAD", symbol: "C$", flag: "🇨🇦" },
    { code: "AUD", symbol: "A$", flag: "🇦🇺" },
]

const PERIODS = [
    { days: 30, label: "30 days" },
    { days: 90, label: "90 days" },
    { days: 180, label: "6 months" },
    { days: 365, label: "12 months" },
    { days: 730, label: "All time" },
]

function fmt(amount: number, currency: string) {
    const sym = CURRENCIES.find((c) => c.code === currency)?.symbol || "$"
    return `${sym}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function SimpleBarChart({ data, currency }: { data: MonthlyData[]; currency: string }) {
    if (!data.length) return <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No data for this period</div>
    const max = Math.max(...data.map((d) => d.total))
    return (
        <div className="flex items-end gap-1.5 h-48 w-full">
            {data.map((d, i) => {
                const height = max > 0 ? Math.max((d.total / max) * 100, 3) : 3
                return (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group relative" title={`${d.label}: ${fmt(d.total, currency)}`}>
                        <div className="w-full bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-sm transition-all duration-500 hover:from-violet-500 hover:to-violet-300 cursor-pointer"
                            style={{ height: `${height}%` }} />
                        {data.length <= 12 && (
                            <span className="text-[9px] text-muted-foreground rotate-45 origin-left whitespace-nowrap">
                                {d.label.split(" ")[0]}
                            </span>
                        )}
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover border border-border rounded-lg px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-lg">
                            <span className="font-medium">{fmt(d.total, currency)}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function MpesaIcon() {
    return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-600 border border-green-500/20">
            M
        </span>
    )
}

export function AdminRevenueDashboard() {
    const [data, setData] = useState<RevenueData | null>(null)
    const [currency, setCurrency] = useState("USD")
    const [days, setDays] = useState(365)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showAllCustomers, setShowAllCustomers] = useState(false)

    const fetchData = useCallback(async (cur = currency, d = days) => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`/api/admin/revenue?currency=${cur}&days=${d}`)
            if (!res.ok) throw new Error("Failed to fetch")
            const json = await res.json()
            setData(json)
        } catch (e) {
            setError("Failed to load revenue data")
        } finally {
            setLoading(false)
        }
    }, [currency, days])

    useEffect(() => { fetchData() }, [])

    const handleCurrency = (c: string) => {
        setCurrency(c)
        fetchData(c, days)
    }

    const handlePeriod = (d: number) => {
        setDays(d)
        fetchData(currency, d)
    }

    const sym = CURRENCIES.find((c) => c.code === currency)?.symbol || "$"
    const selectedPeriod = PERIODS.find((p) => p.days === days)

    return (
        <div className="space-y-6">
            {/* Header + Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Revenue Analytics</h1>
                    <p className="text-muted-foreground mt-1 max-w-xl">
                        Enterprise M-Pesa revenue data across all clients. All transactions collected via M-Pesa mobile payments.
                        Stripe revenue is tracked separately and not yet connected.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                    {/* Period picker */}
                    <div className="flex rounded-lg border border-border overflow-hidden bg-background">
                        {PERIODS.map((p) => (
                            <button
                                key={p.days}
                                onClick={() => handlePeriod(p.days)}
                                className={`px-3 py-1.5 text-xs font-medium transition-colors ${days === p.days ? "bg-violet-600 text-white" : "text-muted-foreground hover:bg-muted"}`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                    {/* Refresh */}
                    <Button variant="outline" size="sm" onClick={() => fetchData()} disabled={loading}>
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {/* Currency Switcher */}
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-muted-foreground font-medium">Currency:</span>
                {CURRENCIES.map((c) => (
                    <button
                        key={c.code}
                        onClick={() => handleCurrency(c.code)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${currency === c.code ? "bg-violet-600 text-white border-violet-600" : "bg-background border-border text-muted-foreground hover:border-violet-400 hover:text-foreground"}`}
                    >
                        <span>{c.flag}</span>
                        <span>{c.code}</span>
                    </button>
                ))}
                {data && currency !== "USD" && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        1 USD = {data.rate} {currency}
                    </span>
                )}
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-600 text-sm">{error}</div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Revenue */}
                <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent" />
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Total Revenue</p>
                                <p className="text-2xl font-bold mt-1">
                                    {loading ? "—" : fmt(data?.totalRevenue || 0, currency)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    M-Pesa · {selectedPeriod?.label}
                                </p>
                            </div>
                            <div className="p-2 rounded-xl bg-violet-500/10">
                                <DollarSign className="w-4 h-4 text-violet-500" />
                            </div>
                        </div>
                        {data && (
                            <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${data.growth >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {data.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {Math.abs(data.growth)}% vs previous period
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* MRR */}
                <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Avg Monthly Revenue</p>
                                <p className="text-2xl font-bold mt-1">
                                    {loading ? "—" : fmt(data?.mrr || 0, currency)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">Average per month</p>
                            </div>
                            <div className="p-2 rounded-xl bg-emerald-500/10">
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                            </div>
                        </div>
                        {data && (
                            <div className="text-xs text-muted-foreground mt-3">
                                ARR: <span className="font-medium text-foreground">{fmt(data.arr, currency)}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Transactions */}
                <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Transactions</p>
                                <p className="text-2xl font-bold mt-1">
                                    {loading ? "—" : data?.transactionCount || 0}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">via M-Pesa</p>
                            </div>
                            <div className="p-2 rounded-xl bg-blue-500/10">
                                <Zap className="w-4 h-4 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Clients */}
                <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Enterprise Clients</p>
                                <p className="text-2xl font-bold mt-1">
                                    {loading ? "—" : data?.customers.length || 0}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">M-Pesa subscribers</p>
                            </div>
                            <div className="p-2 rounded-xl bg-amber-500/10">
                                <Users className="w-4 h-4 text-amber-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Context banner */}
            <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">About this data: </span>
                    This dashboard shows enterprise client payments collected via <strong>M-Pesa</strong> mobile money.
                    All amounts were originally received in USD — the currency selector converts for display purposes only using approximate exchange rates.
                    Revenue reflects retainer payments from {data?.customers.length || 7} enterprise clients.
                    {currency !== "USD" && (
                        <span className="text-blue-600 ml-1">Showing amounts in {currency} (1 USD ≈ {data?.rate} {currency}).</span>
                    )}
                </div>
            </div>

            {/* Bar Chart */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Revenue Over Time
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Monthly M-Pesa collections — {selectedPeriod?.label}. Each bar represents total intake for that month across all enterprise clients.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <MpesaIcon />
                            <span className="text-xs text-muted-foreground">M-Pesa Enterprise</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="h-48 flex items-center justify-center">
                            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <SimpleBarChart data={data?.monthly || []} currency={currency} />
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Per-Client Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Revenue by Client
                        </CardTitle>
                        <CardDescription>
                            Ranked by total paid in the selected period. Average transaction size and payment frequency shown.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {(showAllCustomers ? data?.customers : data?.customers.slice(0, 5))?.map((c, i) => {
                                const maxTotal = data?.customers[0]?.total || 1
                                const pct = Math.round((c.total / maxTotal) * 100)
                                return (
                                    <div key={c.name} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-600 text-[10px] flex items-center justify-center font-bold shrink-0">
                                                    {i + 1}
                                                </span>
                                                <span className="font-medium">{c.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-semibold">{fmt(c.total, currency)}</span>
                                                <p className="text-[10px] text-muted-foreground">{c.transactions} payments · avg {fmt(c.avgTransaction, currency)}</p>
                                            </div>
                                        </div>
                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-500"
                                                style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                )
                            })}
                            {!loading && (data?.customers.length || 0) > 5 && (
                                <button
                                    onClick={() => setShowAllCustomers(!showAllCustomers)}
                                    className="text-xs text-violet-500 hover:underline mt-2"
                                >
                                    {showAllCustomers ? "Show less" : `Show all ${data?.customers.length} clients`}
                                </button>
                            )}
                            {loading && <div className="py-4 text-center text-muted-foreground text-sm">Loading…</div>}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Recent Transactions
                        </CardTitle>
                        <CardDescription>
                            Last 10 M-Pesa payments received. All enterprise plan retainers.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {data?.recent.map((tx, i) => (
                                <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <MpesaIcon />
                                        <div>
                                            <p className="text-sm font-medium">{tx.customer || "Unknown"}</p>
                                            <p className="text-xs text-muted-foreground">{tx.date}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold text-emerald-600">
                                        {fmt(tx.amount, currency)}
                                    </span>
                                </div>
                            ))}
                            {loading && <div className="py-4 text-center text-muted-foreground text-sm">Loading…</div>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
