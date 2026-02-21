"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Users, Eye, Clock, TrendingUp, TrendingDown, RefreshCw,
    MousePointer2, BarChart3, Globe, ArrowUpRight, ArrowDownRight,
    Info, Activity, ExternalLink
} from "lucide-react"

interface GAMetrics {
    sessions: number
    pageviews: number
    users: number
    bounceRate: number
    avgSessionDuration: number
    changes: {
        sessions: number
        pageviews: number
        users: number
        bounceRate: number
        avgSessionDuration: number
    }
}

interface TopPage {
    path: string
    views: number
    users: number
}

interface GAData {
    metrics: GAMetrics
    topPages: TopPage[]
}

const GA_PERIODS = [
    { days: 7, label: "7 days" },
    { days: 14, label: "14 days" },
    { days: 30, label: "30 days" },
    { days: 90, label: "90 days" },
]

function fmtDuration(secs: number) {
    const m = Math.floor(secs / 60)
    const s = Math.round(secs % 60)
    return `${m}m ${s}s`
}

function Change({ value, invert = false }: { value: number; invert?: boolean }) {
    const positive = invert ? value <= 0 : value >= 0
    return (
        <span className={`flex items-center gap-0.5 text-xs font-medium ${positive ? "text-green-500" : "text-red-500"}`}>
            {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(value)}%
        </span>
    )
}

export function AdminGAWidget() {
    const [data, setData] = useState<GAData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [days, setDays] = useState(30)

    const fetchGA = useCallback(async (d = days) => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`/api/admin/google-analytics?days=${d}`)
            if (!res.ok) {
                const body = await res.json()
                throw new Error(body.error || "Failed to fetch GA data")
            }
            setData(await res.json())
        } catch (e: any) {
            setError(e.message || "Failed to load Google Analytics data")
        } finally {
            setLoading(false)
        }
    }, [days])

    useEffect(() => { fetchGA() }, [])

    const m = data?.metrics

    const kpis = m ? [
        {
            label: "Sessions",
            value: m.sessions.toLocaleString(),
            change: m.changes.sessions,
            icon: Activity,
            tooltip: "A session is a group of user interactions with your website within a given time frame.",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            label: "Page Views",
            value: m.pageviews.toLocaleString(),
            change: m.changes.pageviews,
            icon: Eye,
            tooltip: "Total number of pages viewed. Repeated views of a single page are counted.",
            color: "text-violet-500",
            bg: "bg-violet-500/10",
        },
        {
            label: "Active Users",
            value: m.users.toLocaleString(),
            change: m.changes.users,
            icon: Users,
            tooltip: "Number of distinct users who visited the site in the selected period.",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            label: "Bounce Rate",
            value: `${m.bounceRate}%`,
            change: m.changes.bounceRate,
            invert: true,
            icon: TrendingDown,
            tooltip: "Percentage of visitors who left without interacting. Lower is better.",
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
        {
            label: "Avg Session",
            value: fmtDuration(m.avgSessionDuration),
            change: m.changes.avgSessionDuration,
            icon: Clock,
            tooltip: "Average time users spend on your site per session. Higher is better engagement.",
            color: "text-pink-500",
            bg: "bg-pink-500/10",
        },
    ] : []

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg">Google Analytics</h2>
                        <p className="text-xs text-muted-foreground">Live website traffic data vs previous period</p>
                    </div>
                    <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex rounded-lg border border-border overflow-hidden bg-background">
                        {GA_PERIODS.map((p) => (
                            <button
                                key={p.days}
                                onClick={() => { setDays(p.days); fetchGA(p.days) }}
                                className={`px-3 py-1.5 text-xs font-medium transition-colors ${days === p.days ? "bg-amber-500 text-white" : "text-muted-foreground hover:bg-muted"}`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => fetchGA()} disabled={loading}>
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {error ? (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-medium">Google Analytics unavailable</p>
                            <p className="text-xs text-muted-foreground mt-1">{error}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                This may be because the Google Service Account key or Property ID is not configured.
                                Check your <code className="bg-muted px-1 rounded">.env</code> file for:
                                <code className="bg-muted px-1 ml-1 rounded">GOOGLE_ANALYTICS_PROPERTY_ID</code> and
                                <code className="bg-muted px-1 ml-1 rounded">GOOGLE_SERVICE_ACCOUNT_KEY</code>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* KPI Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardContent className="p-4 h-20" />
                                </Card>
                            ))
                        ) : kpis.map((kpi) => (
                            <Card key={kpi.label} title={kpi.tooltip}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground">{kpi.label}</p>
                                            <p className="text-xl font-bold mt-0.5">{kpi.value}</p>
                                        </div>
                                        <div className={`p-1.5 rounded-lg ${kpi.bg}`}>
                                            <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <Change value={kpi.change} invert={(kpi as any).invert} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Top Pages */}
                    {data?.topPages && data.topPages.length > 0 && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    Top Pages
                                    <span className="text-xs font-normal text-muted-foreground">— most viewed in last {days} days</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {data.topPages.map((page, i) => {
                                        const maxViews = data.topPages[0]?.views || 1
                                        const pct = Math.round((page.views / maxViews) * 100)
                                        return (
                                            <div key={i} className="space-y-1">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-muted-foreground font-mono truncate max-w-[200px]">{page.path}</span>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {page.views.toLocaleString()}</span>
                                                        <span className="flex items-center gap-1 text-muted-foreground"><Users className="w-3 h-3" /> {page.users.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <div className="h-1 bg-muted rounded-full">
                                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Context note */}
                    <div className="text-xs text-muted-foreground flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                        <Info className="w-3.5 h-3.5 shrink-0" />
                        Percentage changes compare the selected period to the previous equivalent period. E.g., "30 days" compares the last 30 days to the 30 days before that.
                    </div>
                </>
            )}
        </div>
    )
}
