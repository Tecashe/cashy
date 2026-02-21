// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { BarChart3, ExternalLink, TrendingUp, Eye, MousePointerClick, ArrowUpRight } from "lucide-react"
// import { useState } from "react"

// interface GAMetrics {
//     sessions: number
//     pageviews: number
//     users: number
//     bounceRate: number
//     avgSessionDuration: number
// }

// export function GoogleAnalyticsWidget({ siteUrl }: { siteUrl?: string }) {
//     const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
//     const [gaId, setGaId] = useState("")
//     const [saved, setSaved] = useState(false)

//     if (!measurementId) {
//         return (
//             <Card>
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <BarChart3 className="w-5 h-5 text-orange-500" />
//                         Google Analytics
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
//                         <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Not Configured</p>
//                         <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
//                             Add <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">NEXT_PUBLIC_GA_MEASUREMENT_ID</code> to your .env file
//                         </p>
//                     </div>
//                     <div className="space-y-3">
//                         <div>
//                             <Label className="text-xs">Your GA4 Measurement ID (G-XXXXXXXXXX)</Label>
//                             <Input
//                                 placeholder="G-XXXXXXXXXX"
//                                 value={gaId}
//                                 onChange={(e) => setGaId(e.target.value)}
//                                 className="mt-1 font-mono text-sm"
//                             />
//                         </div>
//                         <Button
//                             size="sm"
//                             onClick={() => {
//                                 navigator.clipboard?.writeText(`NEXT_PUBLIC_GA_MEASUREMENT_ID=${gaId}`)
//                                 setSaved(true)
//                                 setTimeout(() => setSaved(false), 2000)
//                             }}
//                         >
//                             {saved ? "Copied!" : "Copy to Clipboard"}
//                         </Button>
//                     </div>
//                     <div className="pt-2 border-t">
//                         <p className="text-xs text-muted-foreground mb-2">Quick Setup:</p>
//                         <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
//                             <li>Go to analytics.google.com and create/find your property</li>
//                             <li>Copy your Measurement ID (G-XXXXXXXXXX)</li>
//                             <li>Add it to your .env file and redeploy</li>
//                         </ol>
//                         <a
//                             href="https://analytics.google.com"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-1 text-xs text-primary mt-3 hover:underline"
//                         >
//                             Open Google Analytics <ExternalLink className="w-3 h-3" />
//                         </a>
//                     </div>
//                 </CardContent>
//             </Card>
//         )
//     }

//     // When configured, show the GA embed instructions + real-time report link
//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                         <BarChart3 className="w-5 h-5 text-orange-500" />
//                         Google Analytics
//                     </div>
//                     <a
//                         href={`https://analytics.google.com/analytics/web/#/p${measurementId}/reports/reportinghub`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                     >
//                         <Button variant="outline" size="sm" className="gap-1">
//                             Open GA <ArrowUpRight className="w-3 h-3" />
//                         </Button>
//                     </a>
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//                 <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
//                     <p className="text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
//                         <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
//                         Connected — ID: {measurementId}
//                     </p>
//                 </div>

//                 <div className="grid grid-cols-3 gap-3">
//                     {[
//                         { label: "Sessions", icon: TrendingUp, placeholder: "—" },
//                         { label: "Page Views", icon: Eye, placeholder: "—" },
//                         { label: "Click Rate", icon: MousePointerClick, placeholder: "—" },
//                     ].map((m) => (
//                         <div key={m.label} className="p-3 rounded-lg border text-center">
//                             <m.icon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
//                             <p className="text-lg font-bold">{m.placeholder}</p>
//                             <p className="text-xs text-muted-foreground">{m.label}</p>
//                         </div>
//                     ))}
//                 </div>

//                 <p className="text-xs text-muted-foreground">
//                     Live metrics require a server-side service account. Add <code className="bg-muted px-1 rounded">GOOGLE_SERVICE_ACCOUNT_KEY</code> for real-time data.
//                 </p>

//                 {/* Embedded Realtime Report */}
//                 <div className="aspect-video rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
//                     <div className="text-center">
//                         <BarChart3 className="w-10 h-10 mx-auto mb-2 text-muted-foreground opacity-40" />
//                         <p className="text-sm text-muted-foreground">Real-time embed unavailable</p>
//                         <a
//                             href={`https://analytics.google.com`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-xs text-primary hover:underline mt-1 block"
//                         >
//                             View in Google Analytics →
//                         </a>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

// export function SearchConsoleWidget({ siteUrl }: { siteUrl?: string }) {
//     const configuredUrl = process.env.NEXT_PUBLIC_GSC_SITE_URL || siteUrl

//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                         <TrendingUp className="w-5 h-5 text-blue-500" />
//                         Google Search Console
//                     </div>
//                     {configuredUrl && (
//                         <a
//                             href={`https://search.google.com/search-console/performance/search-analytics?resource_id=${encodeURIComponent(configuredUrl)}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                         >
//                             <Button variant="outline" size="sm" className="gap-1">
//                                 Open GSC <ArrowUpRight className="w-3 h-3" />
//                             </Button>
//                         </a>
//                     )}
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//                 {!configuredUrl ? (
//                     <div className="space-y-3">
//                         <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
//                             <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Not Configured</p>
//                             <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
//                                 Add <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">NEXT_PUBLIC_GSC_SITE_URL</code> to your .env
//                             </p>
//                         </div>
//                         <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
//                             <li>Go to Google Search Console and verify your site</li>
//                             <li>Copy your verified property URL</li>
//                             <li>Set <code className="bg-muted px-1 rounded">NEXT_PUBLIC_GSC_SITE_URL=https://your-app.vercel.app</code></li>
//                         </ol>
//                         <a
//                             href="https://search.google.com/search-console"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
//                         >
//                             Open Search Console <ExternalLink className="w-3 h-3" />
//                         </a>
//                     </div>
//                 ) : (
//                     <div className="space-y-3">
//                         <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
//                             <p className="text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
//                                 <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
//                                 Site: {configuredUrl}
//                             </p>
//                         </div>
//                         <div className="grid grid-cols-2 gap-3">
//                             {[
//                                 { label: "Total Clicks", value: "—" },
//                                 { label: "Impressions", value: "—" },
//                                 { label: "Avg CTR", value: "—" },
//                                 { label: "Avg Position", value: "—" },
//                             ].map((m) => (
//                                 <div key={m.label} className="p-3 rounded-lg border">
//                                     <p className="text-xl font-bold">{m.value}</p>
//                                     <p className="text-xs text-muted-foreground">{m.label}</p>
//                                 </div>
//                             ))}
//                         </div>
//                         <p className="text-xs text-muted-foreground">
//                             Live data requires <code className="bg-muted px-1 rounded">GOOGLE_SERVICE_ACCOUNT_KEY</code>.
//                         </p>
//                     </div>
//                 )}
//             </CardContent>
//         </Card>
//     )
// }


// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { BarChart3, ExternalLink, TrendingUp, Eye, MousePointerClick, ArrowUpRight, Users, Clock, RefreshCw } from "lucide-react"
// import { useState, useEffect, useCallback } from "react"

// interface GAMetrics {
//     sessions: number
//     pageviews: number
//     users: number
//     bounceRate: number
//     avgSessionDuration: number
// }

// export function GoogleAnalyticsWidget({ siteUrl }: { siteUrl?: string }) {
//     const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
//     const [gaId, setGaId] = useState("")
//     const [saved, setSaved] = useState(false)
//     const [metrics, setMetrics] = useState<GAMetrics | null>(null)
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState<string | null>(null)

//     const fetchMetrics = useCallback(async () => {
//         setLoading(true)
//         setError(null)
//         try {
//             const res = await fetch("/api/google-analytics")
//             if (!res.ok) throw new Error("Failed to fetch")
//             const data = await res.json()
//             setMetrics(data.metrics)
//         } catch (err) {
//             setError("Could not load GA data")
//         } finally {
//             setLoading(false)
//         }
//     }, [])

//     useEffect(() => {
//         if (measurementId) {
//             fetchMetrics()
//         }
//     }, [measurementId, fetchMetrics])

//     const formatDuration = (seconds: number) => {
//         const m = Math.floor(seconds / 60)
//         const s = seconds % 60
//         return `${m}m ${s}s`
//     }

//     if (!measurementId) {
//         return (
//             <Card>
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <BarChart3 className="w-5 h-5 text-orange-500" />
//                         Google Analytics
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
//                         <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Not Configured</p>
//                         <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
//                             Add <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">NEXT_PUBLIC_GA_MEASUREMENT_ID</code> to your .env file
//                         </p>
//                     </div>
//                     <div className="space-y-3">
//                         <div>
//                             <Label className="text-xs">Your GA4 Measurement ID (G-XXXXXXXXXX)</Label>
//                             <Input
//                                 placeholder="G-XXXXXXXXXX"
//                                 value={gaId}
//                                 onChange={(e) => setGaId(e.target.value)}
//                                 className="mt-1 font-mono text-sm"
//                             />
//                         </div>
//                         <Button
//                             size="sm"
//                             onClick={() => {
//                                 navigator.clipboard?.writeText(`NEXT_PUBLIC_GA_MEASUREMENT_ID=${gaId}`)
//                                 setSaved(true)
//                                 setTimeout(() => setSaved(false), 2000)
//                             }}
//                         >
//                             {saved ? "Copied!" : "Copy to Clipboard"}
//                         </Button>
//                     </div>
//                     <div className="pt-2 border-t">
//                         <p className="text-xs text-muted-foreground mb-2">Quick Setup:</p>
//                         <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
//                             <li>Go to analytics.google.com and create/find your property</li>
//                             <li>Copy your Measurement ID (G-XXXXXXXXXX)</li>
//                             <li>Add it to your .env file and redeploy</li>
//                         </ol>
//                         <a
//                             href="https://analytics.google.com"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-1 text-xs text-primary mt-3 hover:underline"
//                         >
//                             Open Google Analytics <ExternalLink className="w-3 h-3" />
//                         </a>
//                     </div>
//                 </CardContent>
//             </Card>
//         )
//     }

//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                         <BarChart3 className="w-5 h-5 text-orange-500" />
//                         Google Analytics
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-7 w-7"
//                             onClick={fetchMetrics}
//                             disabled={loading}
//                             title="Refresh"
//                         >
//                             <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
//                         </Button>
//                         <a
//                             href={`https://analytics.google.com/analytics/web/#/p${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}/reports/reportinghub`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                         >
//                             <Button variant="outline" size="sm" className="gap-1">
//                                 Open GA <ArrowUpRight className="w-3 h-3" />
//                             </Button>
//                         </a>
//                     </div>
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//                 <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
//                     <p className="text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
//                         <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
//                         Connected — ID: {measurementId} · Last 30 days
//                     </p>
//                 </div>

//                 {error && (
//                     <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
//                         <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
//                     </div>
//                 )}

//                 <div className="grid grid-cols-3 gap-3">
//                     {[
//                         {
//                             label: "Sessions",
//                             icon: TrendingUp,
//                             value: loading ? "..." : metrics ? metrics.sessions.toLocaleString() : "—",
//                         },
//                         {
//                             label: "Page Views",
//                             icon: Eye,
//                             value: loading ? "..." : metrics ? metrics.pageviews.toLocaleString() : "—",
//                         },
//                         {
//                             label: "Users",
//                             icon: Users,
//                             value: loading ? "..." : metrics ? metrics.users.toLocaleString() : "—",
//                         },
//                     ].map((m) => (
//                         <div key={m.label} className="p-3 rounded-lg border text-center">
//                             <m.icon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
//                             <p className="text-lg font-bold">{m.value}</p>
//                             <p className="text-xs text-muted-foreground">{m.label}</p>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                     <div className="p-3 rounded-lg border">
//                         <div className="flex items-center gap-1 mb-1">
//                             <MousePointerClick className="w-3.5 h-3.5 text-muted-foreground" />
//                             <p className="text-xs text-muted-foreground">Bounce Rate</p>
//                         </div>
//                         <p className="text-xl font-bold">
//                             {loading ? "..." : metrics ? `${metrics.bounceRate}%` : "—"}
//                         </p>
//                     </div>
//                     <div className="p-3 rounded-lg border">
//                         <div className="flex items-center gap-1 mb-1">
//                             <Clock className="w-3.5 h-3.5 text-muted-foreground" />
//                             <p className="text-xs text-muted-foreground">Avg. Session</p>
//                         </div>
//                         <p className="text-xl font-bold">
//                             {loading ? "..." : metrics ? formatDuration(metrics.avgSessionDuration) : "—"}
//                         </p>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

// export function SearchConsoleWidget({ siteUrl }: { siteUrl?: string }) {
//     const configuredUrl = process.env.NEXT_PUBLIC_GSC_SITE_URL || siteUrl

//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                         <TrendingUp className="w-5 h-5 text-blue-500" />
//                         Google Search Console
//                     </div>
//                     {configuredUrl && (
//                         <a
//                             href={`https://search.google.com/search-console/performance/search-analytics?resource_id=${encodeURIComponent(configuredUrl)}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                         >
//                             <Button variant="outline" size="sm" className="gap-1">
//                                 Open GSC <ArrowUpRight className="w-3 h-3" />
//                             </Button>
//                         </a>
//                     )}
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//                 {!configuredUrl ? (
//                     <div className="space-y-3">
//                         <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
//                             <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Not Configured</p>
//                             <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
//                                 Add <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">NEXT_PUBLIC_GSC_SITE_URL</code> to your .env
//                             </p>
//                         </div>
//                         <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
//                             <li>Go to Google Search Console and verify your site</li>
//                             <li>Copy your verified property URL</li>
//                             <li>Set <code className="bg-muted px-1 rounded">NEXT_PUBLIC_GSC_SITE_URL=https://your-app.vercel.app</code></li>
//                         </ol>
//                         <a
//                             href="https://search.google.com/search-console"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
//                         >
//                             Open Search Console <ExternalLink className="w-3 h-3" />
//                         </a>
//                     </div>
//                 ) : (
//                     <div className="space-y-3">
//                         <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
//                             <p className="text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
//                                 <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
//                                 Site: {configuredUrl}
//                             </p>
//                         </div>
//                         <div className="grid grid-cols-2 gap-3">
//                             {[
//                                 { label: "Total Clicks", value: "—" },
//                                 { label: "Impressions", value: "—" },
//                                 { label: "Avg CTR", value: "—" },
//                                 { label: "Avg Position", value: "—" },
//                             ].map((m) => (
//                                 <div key={m.label} className="p-3 rounded-lg border">
//                                     <p className="text-xl font-bold">{m.value}</p>
//                                     <p className="text-xs text-muted-foreground">{m.label}</p>
//                                 </div>
//                             ))}
//                         </div>
//                         <p className="text-xs text-muted-foreground">
//                             Live data requires <code className="bg-muted px-1 rounded">GOOGLE_SERVICE_ACCOUNT_KEY</code>.
//                         </p>
//                     </div>
//                 )}
//             </CardContent>
//         </Card>
//     )
// }

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    BarChart3, ExternalLink, TrendingUp, TrendingDown, Eye,
    MousePointerClick, ArrowUpRight, Users, Clock, RefreshCw, FileText
} from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

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

function Change({ value, invert = false }: { value: number; invert?: boolean }) {
    const positive = invert ? value < 0 : value > 0
    const color = positive ? "text-green-600" : "text-red-500"
    const Icon = positive ? TrendingUp : TrendingDown
    return (
        <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${color}`}>
            <Icon className="w-3 h-3" />
            {Math.abs(value)}%
        </span>
    )
}

function formatDuration(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m ${s}s`
}

export function GoogleAnalyticsWidget({ siteUrl }: { siteUrl?: string }) {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    const [gaId, setGaId] = useState("")
    const [saved, setSaved] = useState(false)
    const [metrics, setMetrics] = useState<GAMetrics | null>(null)
    const [topPages, setTopPages] = useState<TopPage[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [days, setDays] = useState(30)

    const fetchMetrics = useCallback(async (d: number) => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`/api/google-analytics?days=${d}`)
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            setMetrics(data.metrics)
            setTopPages(data.topPages ?? [])
        } catch {
            setError("Could not load GA data")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (measurementId) fetchMetrics(days)
    }, [measurementId, days, fetchMetrics])

    const handleDaysChange = (d: number) => {
        setDays(d)
    }

    if (!measurementId) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-orange-500" />
                        Google Analytics
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                        <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Not Configured</p>
                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                            Add <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">NEXT_PUBLIC_GA_MEASUREMENT_ID</code> to your .env file
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <Label className="text-xs">Your GA4 Measurement ID (G-XXXXXXXXXX)</Label>
                            <Input
                                placeholder="G-XXXXXXXXXX"
                                value={gaId}
                                onChange={(e) => setGaId(e.target.value)}
                                className="mt-1 font-mono text-sm"
                            />
                        </div>
                        <Button size="sm" onClick={() => {
                            navigator.clipboard?.writeText(`NEXT_PUBLIC_GA_MEASUREMENT_ID=${gaId}`)
                            setSaved(true)
                            setTimeout(() => setSaved(false), 2000)
                        }}>
                            {saved ? "Copied!" : "Copy to Clipboard"}
                        </Button>
                    </div>
                    <div className="pt-2 border-t">
                        <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary mt-1 hover:underline">
                            Open Google Analytics <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Chart data from top pages
    const chartData = topPages.map((p) => ({
        name: p.path.length > 20 ? p.path.slice(0, 20) + "…" : p.path,
        views: p.views,
    }))

    const statCards = [
        { label: "Sessions", icon: TrendingUp, value: metrics?.sessions, change: metrics?.changes.sessions },
        { label: "Page Views", icon: Eye, value: metrics?.pageviews, change: metrics?.changes.pageviews },
        { label: "Users", icon: Users, value: metrics?.users, change: metrics?.changes.users },
        { label: "Bounce Rate", icon: MousePointerClick, value: metrics ? `${metrics.bounceRate}%` : undefined, change: metrics?.changes.bounceRate, invert: true },
        { label: "Avg. Session", icon: Clock, value: metrics ? formatDuration(metrics.avgSessionDuration) : undefined, change: metrics?.changes.avgSessionDuration },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-orange-500" />
                        Google Analytics
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Date range selector */}
                        <div className="flex rounded-md border overflow-hidden text-xs">
                            {[7, 30, 90].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => handleDaysChange(d)}
                                    className={`px-2.5 py-1 font-medium transition-colors ${days === d
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-background text-muted-foreground hover:bg-muted"
                                        }`}
                                >
                                    {d}d
                                </button>
                            ))}
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => fetchMetrics(days)} disabled={loading} title="Refresh">
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                        </Button>
                        <a href={`https://analytics.google.com/analytics/web/#/p${measurementId}/reports/reportinghub`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="gap-1">
                                Open GA <ArrowUpRight className="w-3 h-3" />
                            </Button>
                        </a>
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
                {/* Status bar */}
                <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
                        Connected — {measurementId} · Last {days} days vs previous {days} days
                    </p>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                        <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
                    </div>
                )}

                {/* Metric cards */}
                <div className="grid grid-cols-3 gap-3">
                    {statCards.slice(0, 3).map((m) => (
                        <div key={m.label} className="p-3 rounded-lg border text-center space-y-1">
                            <m.icon className="w-4 h-4 mx-auto text-muted-foreground" />
                            <p className="text-lg font-bold leading-tight">
                                {loading ? "..." : m.value !== undefined ? (typeof m.value === "number" ? m.value.toLocaleString() : m.value) : "—"}
                            </p>
                            <p className="text-xs text-muted-foreground">{m.label}</p>
                            {!loading && m.change !== undefined && (
                                <Change value={m.change} invert={m.invert} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {statCards.slice(3).map((m) => (
                        <div key={m.label} className="p-3 rounded-lg border space-y-1">
                            <div className="flex items-center gap-1">
                                <m.icon className="w-3.5 h-3.5 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">{m.label}</p>
                            </div>
                            <p className="text-xl font-bold">
                                {loading ? "..." : m.value !== undefined ? m.value : "—"}
                            </p>
                            {!loading && m.change !== undefined && (
                                <Change value={m.change} invert={m.invert} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Bar chart — top pages by views */}
                {chartData.length > 0 && (
                    <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Page Views by Path</p>
                        <ResponsiveContainer width="100%" height={120}>
                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip
                                    contentStyle={{ fontSize: 12 }}
                                    formatter={(val: number) => [val.toLocaleString(), "Views"]}
                                />
                                <Bar dataKey="views" radius={[3, 3, 0, 0]}>
                                    {chartData.map((_, i) => (
                                        <Cell key={i} fill={i === 0 ? "#f97316" : "#fb923c"} opacity={1 - i * 0.12} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Top pages table */}
                {topPages.length > 0 && (
                    <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" /> Top Pages
                        </p>
                        <div className="rounded-lg border overflow-hidden">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-muted/50 border-b">
                                        <th className="text-left px-3 py-2 font-medium text-muted-foreground">Path</th>
                                        <th className="text-right px-3 py-2 font-medium text-muted-foreground">Views</th>
                                        <th className="text-right px-3 py-2 font-medium text-muted-foreground">Users</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topPages.map((page, i) => (
                                        <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                            <td className="px-3 py-2 font-mono text-muted-foreground truncate max-w-[160px]">{page.path}</td>
                                            <td className="px-3 py-2 text-right font-medium">{page.views.toLocaleString()}</td>
                                            <td className="px-3 py-2 text-right text-muted-foreground">{page.users.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export function SearchConsoleWidget({ siteUrl }: { siteUrl?: string }) {
    const configuredUrl = process.env.NEXT_PUBLIC_GSC_SITE_URL || siteUrl

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        Google Search Console
                    </div>
                    {configuredUrl && (
                        <a
                            href={`https://search.google.com/search-console/performance/search-analytics?resource_id=${encodeURIComponent(configuredUrl)}`}
                            target="_blank" rel="noopener noreferrer"
                        >
                            <Button variant="outline" size="sm" className="gap-1">
                                Open GSC <ArrowUpRight className="w-3 h-3" />
                            </Button>
                        </a>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!configuredUrl ? (
                    <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Not Configured</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                Add <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">NEXT_PUBLIC_GSC_SITE_URL</code> to your .env
                            </p>
                        </div>
                        <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Go to Google Search Console and verify your site</li>
                            <li>Copy your verified property URL</li>
                            <li>Set <code className="bg-muted px-1 rounded">NEXT_PUBLIC_GSC_SITE_URL=https://your-app.vercel.app</code></li>
                        </ol>
                        <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                            Open Search Console <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                ) : (

                    <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                            <p className="text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                                Site: {configuredUrl}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Total Clicks", value: "—" },
                                { label: "Impressions", value: "—" },
                                { label: "Avg CTR", value: "—" },
                                { label: "Avg Position", value: "—" },
                            ].map((m) => (
                                <div key={m.label} className="p-3 rounded-lg border">
                                    <p className="text-xl font-bold">{m.value}</p>
                                    <p className="text-xs text-muted-foreground">{m.label}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Live data requires <code className="bg-muted px-1 rounded">GOOGLE_SERVICE_ACCOUNT_KEY</code>.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}