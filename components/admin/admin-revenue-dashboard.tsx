"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    TrendingUp, DollarSign, BarChart3, Users,
    CreditCard, RefreshCw, Info, ArrowUpRight, ArrowDownRight,
    Zap, ChevronDown, Check
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
    { code: "USD", symbol: "$", flag: "🇺🇸", name: "US Dollar" },
    { code: "GBP", symbol: "£", flag: "🇬🇧", name: "British Pound" },
    { code: "EUR", symbol: "€", flag: "🇪🇺", name: "Euro" },
    { code: "KES", symbol: "KSh", flag: "🇰🇪", name: "Kenyan Shilling" },
    { code: "AED", symbol: "د.إ", flag: "🇦🇪", name: "UAE Dirham" },
    { code: "CAD", symbol: "C$", flag: "🇨🇦", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", flag: "🇦🇺", name: "Australian Dollar" },
]

// Use 450 for "12 months" to cover Jan 2025–Jan 2026 regardless of current date
const PERIODS = [
    { days: 90, label: "Last 3 Months" },
    { days: 180, label: "Last 6 Months" },
    { days: 450, label: "Last 12 Months" },
    { days: 730, label: "All Time" },
]

function fmt(amount: number, currency: string) {
    const sym = CURRENCIES.find((c) => c.code === currency)?.symbol || "$"
    return `${sym}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// ─── Dropdown component ─────────────────────────────────────────────────────
function Dropdown<T extends string>({
    value,
    onChange,
    options,
    renderOption,
    renderValue,
}: {
    value: T
    onChange: (v: T) => void
    options: { value: T; label: string }[]
    renderOption?: (v: T, label: string) => React.ReactNode
    renderValue?: (v: T) => React.ReactNode
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const selected = options.find((o) => o.value === value)

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-sm font-medium hover:border-violet-400 transition-colors min-w-[150px] justify-between"
            >
                <span>{renderValue ? renderValue(value) : selected?.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="absolute top-full mt-1 left-0 z-50 bg-popover border border-border rounded-xl shadow-xl py-1 min-w-[200px] animate-in fade-in slide-in-from-top-1 duration-150">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setOpen(false) }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/60 transition-colors text-left"
                        >
                            {renderOption ? renderOption(opt.value, opt.label) : opt.label}
                            {opt.value === value && <Check className="w-3.5 h-3.5 text-violet-600 ml-auto shrink-0" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

// ─── Beautiful Line Chart ────────────────────────────────────────────────────
function LineChart({ data, currency }: { data: MonthlyData[]; currency: string }) {
    const [hovered, setHovered] = useState<number | null>(null)

    if (!data.length) return (
        <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
            No data for this period
        </div>
    )

    const W = 640
    const H = 200
    const padL = 52
    const padR = 20
    const padT = 24
    const padB = 32
    const chartW = W - padL - padR
    const chartH = H - padT - padB

    const values = data.map((d) => d.total)
    const max = Math.max(...values)
    const min = Math.min(...values)
    const range = max - min || 1

    const px = (i: number) => padL + (i / (data.length - 1)) * chartW
    const py = (v: number) => padT + chartH - ((v - min) / range) * chartH

    // Smooth SVG path using cubic bezier curves
    const points = data.map((d, i) => ({ x: px(i), y: py(d.total) }))
    const pathD = points.reduce((acc, pt, i) => {
        if (i === 0) return `M ${pt.x} ${pt.y}`
        const prev = points[i - 1]
        const cpx = (prev.x + pt.x) / 2
        return `${acc} C ${cpx} ${prev.y} ${cpx} ${pt.y} ${pt.x} ${pt.y}`
    }, "")

    // Area fill path
    const areaD = `${pathD} L ${points[points.length - 1].x} ${padT + chartH} L ${points[0].x} ${padT + chartH} Z`

    // Y gridlines
    const gridLines = [0, 0.25, 0.5, 0.75, 1].map((frac) => ({
        y: padT + chartH - frac * chartH,
        label: ((min + frac * range) >= 1000)
            ? `${((min + frac * range) / 1000).toFixed(1)}k`
            : Math.round(min + frac * range).toString(),
    }))

    return (
        <div className="relative w-full overflow-x-auto select-none">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full"
                style={{ minHeight: 220 }}
                onMouseLeave={() => setHovered(null)}
            >
                <defs>
                    <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Gridlines */}
                {gridLines.map((g, i) => (
                    <g key={i}>
                        <line x1={padL} y1={g.y} x2={W - padR} y2={g.y}
                            stroke="#6b7280" strokeOpacity={0.12} strokeWidth={1} strokeDasharray="4 4" />
                        <text x={padL - 6} y={g.y + 4} textAnchor="end" fontSize={9} fill="#9ca3af">
                            {g.label}
                        </text>
                    </g>
                ))}

                {/* Area fill */}
                <path d={areaD} fill="url(#lineAreaGrad)" />

                {/* Line */}
                <path
                    d={pathD}
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                />

                {/* Hover zones + dots */}
                {points.map((pt, i) => (
                    <g key={i}
                        onMouseEnter={() => setHovered(i)}
                        style={{ cursor: "crosshair" }}
                    >
                        {/* Invisible hit zone */}
                        <rect
                            x={pt.x - (chartW / data.length) / 2}
                            y={padT}
                            width={chartW / data.length}
                            height={chartH}
                            fill="transparent"
                        />
                        {/* Dot */}
                        <circle
                            cx={pt.x} cy={pt.y} r={hovered === i ? 6 : 3.5}
                            fill={hovered === i ? "#ffffff" : "#7c3aed"}
                            stroke="#7c3aed"
                            strokeWidth={hovered === i ? 2.5 : 0}
                            style={{ transition: "r 0.15s" }}
                        />
                        {/* Month label */}
                        <text
                            x={pt.x}
                            y={H - 6}
                            textAnchor="middle"
                            fontSize={data.length > 10 ? 7.5 : 9}
                            fill={hovered === i ? "#7c3aed" : "#9ca3af"}
                            fontWeight={hovered === i ? "700" : "400"}
                        >
                            {data[i].label.split(" ")[0]}
                        </text>
                    </g>
                ))}

                {/* Hover tooltip */}
                {hovered !== null && (() => {
                    const pt = points[hovered]
                    const d = data[hovered]
                    const tipW = 120
                    const tipH = 46
                    const tipX = Math.min(Math.max(pt.x - tipW / 2, padL), W - padR - tipW)
                    const tipY = pt.y - tipH - 12
                    return (
                        <g>
                            <line x1={pt.x} y1={padT} x2={pt.x} y2={padT + chartH}
                                stroke="#7c3aed" strokeOpacity={0.3} strokeWidth={1} strokeDasharray="3 3" />
                            <rect x={tipX} y={tipY} width={tipW} height={tipH} rx={8}
                                fill="#1e1b4b" stroke="#7c3aed" strokeOpacity={0.4} strokeWidth={1} />
                            <text x={tipX + tipW / 2} y={tipY + 16} textAnchor="middle" fontSize={10} fill="#c4b5fd" fontWeight="600">
                                {d.label}
                            </text>
                            <text x={tipX + tipW / 2} y={tipY + 34} textAnchor="middle" fontSize={13} fill="#ffffff" fontWeight="800">
                                {fmt(d.total, currency)}
                            </text>
                        </g>
                    )
                })()}
            </svg>
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
    const [days, setDays] = useState(450)  // 450 covers Jan 2025–Jan 2026 fully
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showAllCustomers, setShowAllCustomers] = useState(false)

    const fetchData = useCallback(async (cur = currency, d = days) => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`/api/admin/revenue?currency=${cur}&days=${d}`)
            if (!res.ok) throw new Error("Failed to fetch")
            setData(await res.json())
        } catch {
            setError("Failed to load revenue data")
        } finally {
            setLoading(false)
        }
    }, [currency, days])

    useEffect(() => { fetchData() }, [])

    const handleCurrency = (c: string) => { setCurrency(c); fetchData(c, days) }
    const handlePeriod = (d: string) => { const n = parseInt(d); setDays(n); fetchData(currency, n) }

    const selectedPeriod = PERIODS.find((p) => p.days === days)

    const currencyOptions = CURRENCIES.map((c) => ({ value: c.code, label: `${c.flag} ${c.code} — ${c.name}` }))
    const periodOptions = PERIODS.map((p) => ({ value: String(p.days), label: p.label }))

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-4 justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Revenue Analytics</h1>
                    <p className="text-muted-foreground mt-1 max-w-xl text-sm">
                        Enterprise M-Pesa revenue across all clients — Jan 2025 to Jan 2026.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                    {/* Period dropdown */}
                    <Dropdown<string>
                        value={String(days)}
                        onChange={handlePeriod}
                        options={periodOptions}
                        renderValue={(v) => PERIODS.find((p) => String(p.days) === v)?.label || ""}
                    />
                    {/* Currency dropdown */}
                    <Dropdown<string>
                        value={currency}
                        onChange={handleCurrency}
                        options={currencyOptions}
                        renderValue={(v) => {
                            const c = CURRENCIES.find((x) => x.code === v)
                            return <span>{c?.flag} {c?.code}</span>
                        }}
                        renderOption={(v, label) => <span>{label}</span>}
                    />
                    <Button variant="outline" size="sm" onClick={() => fetchData()} disabled={loading}>
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {data && currency !== "USD" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 w-fit">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    1 USD ≈ {data.rate} {currency} · amounts converted for display only
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-600 text-sm">{error}</div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none" />
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Total Revenue</p>
                                <p className="text-2xl font-bold mt-1 tabular-nums">
                                    {loading ? "—" : fmt(data?.totalRevenue || 0, currency)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">M-Pesa · {selectedPeriod?.label}</p>
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

                <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Avg Monthly Revenue</p>
                                <p className="text-2xl font-bold mt-1 tabular-nums">
                                    {loading ? "—" : fmt(data?.mrr || 0, currency)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">per month</p>
                            </div>
                            <div className="p-2 rounded-xl bg-emerald-500/10">
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                            </div>
                        </div>
                        {data && (
                            <div className="text-xs text-muted-foreground mt-3">
                                ARR: <span className="font-semibold text-foreground">{fmt(data.arr, currency)}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Transactions</p>
                                <p className="text-2xl font-bold mt-1 tabular-nums">
                                    {loading ? "—" : data?.transactionCount || 0}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">M-Pesa payments</p>
                            </div>
                            <div className="p-2 rounded-xl bg-blue-500/10">
                                <Zap className="w-4 h-4 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Enterprise Clients</p>
                                <p className="text-2xl font-bold mt-1 tabular-nums">
                                    {loading ? "—" : data?.customers.length || 0}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">active retainers</p>
                            </div>
                            <div className="p-2 rounded-xl bg-amber-500/10">
                                <Users className="w-4 h-4 text-amber-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Line Chart */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <BarChart3 className="w-4 h-4" />
                                Revenue Over Time
                            </CardTitle>
                            <CardDescription className="mt-0.5 text-xs">
                                Monthly M-Pesa enterprise collections · hover each point for details
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <MpesaIcon />
                            <span className="text-xs text-muted-foreground">Enterprise Plan</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="h-56 flex items-center justify-center">
                            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <LineChart data={data?.monthly || []} currency={currency} />
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Per-Client Breakdown */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Users className="w-4 h-4" /> Revenue by Client
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Ranked by total collected · payment frequency and average shown
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {(showAllCustomers ? data?.customers : data?.customers.slice(0, 6))?.map((c, i) => {
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
                                                <span className="font-semibold tabular-nums">{fmt(c.total, currency)}</span>
                                                <p className="text-[10px] text-muted-foreground">{c.transactions} pmts · avg {fmt(c.avgTransaction, currency)}</p>
                                            </div>
                                        </div>
                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-700"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                            {!loading && (data?.customers.length || 0) > 6 && (
                                <button onClick={() => setShowAllCustomers(!showAllCustomers)}
                                    className="text-xs text-violet-500 hover:underline">
                                    {showAllCustomers ? "Show less" : `Show all ${data?.customers.length} clients`}
                                </button>
                            )}
                            {loading && <div className="py-4 text-center text-muted-foreground text-sm">Loading…</div>}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <CreditCard className="w-4 h-4" /> Recent Transactions
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Last 10 M-Pesa payments — enterprise plan retainers
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            {data?.recent.map((tx, i) => (
                                <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <MpesaIcon />
                                        <div>
                                            <p className="text-sm font-medium leading-tight">{tx.customer || "Unknown"}</p>
                                            <p className="text-xs text-muted-foreground">{tx.date}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold text-emerald-600 tabular-nums">
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
