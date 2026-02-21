import { requireAdmin } from "@/lib/admin-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plug, CheckCircle2, XCircle, ExternalLink } from "lucide-react"

export default async function AdminIntegrationsPage() {
    await requireAdmin()

    const integrations = [
        {
            name: "Google Analytics",
            description: "Track page views, user behavior, and conversion funnels.",
            configured: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
            configKey: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
            link: "https://analytics.google.com",
        },
        {
            name: "Google Search Console",
            description: "Monitor search performance, indexing, and SEO health.",
            configured: !!process.env.NEXT_PUBLIC_GSC_SITE_URL,
            configKey: "NEXT_PUBLIC_GSC_SITE_URL",
            link: "https://search.google.com/search-console",
        },
        {
            name: "Pexels Stock Photos",
            description: "Access thousands of free stock photos for content.",
            configured: !!process.env.PEXELS_API_KEY,
            configKey: "PEXELS_API_KEY",
            link: "https://www.pexels.com/api/",
        },
        {
            name: "Stripe Payments",
            description: "Process payments and manage subscriptions.",
            configured: !!process.env.STRIPE_SECRET_KEY,
            configKey: "STRIPE_SECRET_KEY",
            link: "https://dashboard.stripe.com",
        },
        {
            name: "Clerk Auth",
            description: "User authentication and session management.",
            configured: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
            configKey: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
            link: "https://dashboard.clerk.com",
        },
        {
            name: "Neon Database",
            description: "Serverless PostgreSQL database.",
            configured: !!process.env.DATABASE_URL,
            configKey: "DATABASE_URL",
            link: "https://console.neon.tech",
        },
    ]

    const configuredCount = integrations.filter((i) => i.configured).length

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
                <p className="text-muted-foreground mt-1">
                    {configuredCount} of {integrations.length} integrations configured.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration) => (
                    <Card key={integration.name} className={!integration.configured ? "opacity-60" : ""}>
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold">{integration.name}</h3>
                                        {integration.configured ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-400" />
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                                    <p className="text-xs text-muted-foreground mt-2 font-mono">
                                        ENV: {integration.configKey}
                                    </p>
                                </div>
                                <a
                                    href={integration.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
