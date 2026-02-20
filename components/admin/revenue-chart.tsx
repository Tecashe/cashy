"use client"

import { useState } from "react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts"
import { Button } from "@/components/ui/button"

interface ChartDataPoint {
    date: string
    stripe: number
    sales: number
}

const RANGES = ["7d", "30d", "90d", "12m"] as const
type Range = (typeof RANGES)[number]

async function fetchRevenueData(range: Range) {
    const res = await fetch(`/api/admin/revenue?range=${range}`)
    return res.json()
}

export function RevenueChart({
    initialData,
    initialRange = "30d",
}: {
    initialData: { chartData: ChartDataPoint[] }
    initialRange?: Range
}) {
    const [range, setRange] = useState<Range>(initialRange)
    const [data, setData] = useState(initialData.chartData)
    const [loading, setLoading] = useState(false)

    const changeRange = async (r: Range) => {
        setRange(r)
        setLoading(true)
        try {
            const result = await fetchRevenueData(r)
            setData(result.chartData)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (v: number) =>
        v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(0)}`

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                {RANGES.map((r) => (
                    <Button
                        key={r}
                        size="sm"
                        variant={range === r ? "default" : "outline"}
                        onClick={() => changeRange(r)}
                        className="text-xs"
                    >
                        {r}
                    </Button>
                ))}
            </div>

            <div className={loading ? "opacity-50 pointer-events-none" : ""}>
                <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="stripeGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11 }}
                            tickFormatter={(d) => new Date(d).toLocaleDateString("en", { month: "short", day: "numeric" })}
                            className="fill-muted-foreground"
                        />
                        <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                        <Tooltip
                            formatter={(v: number) => [`$${v.toFixed(2)}`, ""]}
                            labelFormatter={(d) => new Date(d).toLocaleDateString()}
                            contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="stripe"
                            name="Stripe Revenue"
                            stroke="#8b5cf6"
                            fill="url(#stripeGrad)"
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="sales"
                            name="Historical Sales"
                            stroke="#06b6d4"
                            fill="url(#salesGrad)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
