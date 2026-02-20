"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3, ExternalLink, TrendingUp, Eye, MousePointerClick, ArrowUpRight } from "lucide-react"
import { useState } from "react"

interface GAMetrics {
    sessions: number
    pageviews: number
    users: number
    bounceRate: number
    avgSessionDuration: number
}

export function GoogleAnalyticsWidget({ siteUrl }: { siteUrl?: string }) {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    const [gaId, setGaId] = useState("")
    const [saved, setSaved] = useState(false)

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
                        <Button
                            size="sm"
                            onClick={() => {
                                navigator.clipboard?.writeText(`NEXT_PUBLIC_GA_MEASUREMENT_ID=${gaId}`)
                                setSaved(true)
                                setTimeout(() => setSaved(false), 2000)
                            }}
                        >
                            {saved ? "Copied!" : "Copy to Clipboard"}
                        </Button>
                    </div>
                    <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Quick Setup:</p>
                        <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Go to analytics.google.com and create/find your property</li>
                            <li>Copy your Measurement ID (G-XXXXXXXXXX)</li>
                            <li>Add it to your .env file and redeploy</li>
                        </ol>
                        <a
                            href="https://analytics.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary mt-3 hover:underline"
                        >
                            Open Google Analytics <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // When configured, show the GA embed instructions + real-time report link
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-orange-500" />
                        Google Analytics
                    </div>
                    <a
                        href={`https://analytics.google.com/analytics/web/#/p${measurementId}/reports/reportinghub`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="outline" size="sm" className="gap-1">
                            Open GA <ArrowUpRight className="w-3 h-3" />
                        </Button>
                    </a>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
                        Connected — ID: {measurementId}
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Sessions", icon: TrendingUp, placeholder: "—" },
                        { label: "Page Views", icon: Eye, placeholder: "—" },
                        { label: "Click Rate", icon: MousePointerClick, placeholder: "—" },
                    ].map((m) => (
                        <div key={m.label} className="p-3 rounded-lg border text-center">
                            <m.icon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                            <p className="text-lg font-bold">{m.placeholder}</p>
                            <p className="text-xs text-muted-foreground">{m.label}</p>
                        </div>
                    ))}
                </div>

                <p className="text-xs text-muted-foreground">
                    Live metrics require a server-side service account. Add <code className="bg-muted px-1 rounded">GOOGLE_SERVICE_ACCOUNT_KEY</code> for real-time data.
                </p>

                {/* Embedded Realtime Report */}
                <div className="aspect-video rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                    <div className="text-center">
                        <BarChart3 className="w-10 h-10 mx-auto mb-2 text-muted-foreground opacity-40" />
                        <p className="text-sm text-muted-foreground">Real-time embed unavailable</p>
                        <a
                            href={`https://analytics.google.com`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline mt-1 block"
                        >
                            View in Google Analytics →
                        </a>
                    </div>
                </div>
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
                            target="_blank"
                            rel="noopener noreferrer"
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
                        <a
                            href="https://search.google.com/search-console"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
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
