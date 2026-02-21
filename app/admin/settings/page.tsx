import { requireAdmin } from "@/lib/admin-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Shield, Globe, Bell, Database } from "lucide-react"

export default async function AdminSettingsPage() {
    await requireAdmin()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Platform configuration and preferences.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Shield className="w-4 h-4" />
                            Access Control
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Admin Email Whitelist</span>
                            <Badge variant="outline" className="text-xs">
                                {process.env.ADMIN_EMAILS ? "Active" : "DB-Only"}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Role-Based Access</span>
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 text-xs">Enabled</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground pt-2">
                            Admin roles are managed from the Users page. The environment variable
                            ADMIN_EMAILS serves as a bootstrap fallback.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Globe className="w-4 h-4" />
                            Platform Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Domain</span>
                            <span className="text-sm text-muted-foreground">yazzil.com</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Framework</span>
                            <span className="text-sm text-muted-foreground">Next.js 16</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Database</span>
                            <span className="text-sm text-muted-foreground">PostgreSQL (Neon)</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Auth Provider</span>
                            <span className="text-sm text-muted-foreground">Clerk</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Bell className="w-4 h-4" />
                            Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">In-app Notifications</span>
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 text-xs">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Email Notifications</span>
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 text-xs">Coming Soon</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Database className="w-4 h-4" />
                            Data Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Audit Logging</span>
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 text-xs">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Data Export</span>
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 text-xs">Coming Soon</Badge>
                        </div>
                        <a href="/admin/audit-logs" className="text-xs text-violet-500 hover:underline">
                            View Audit Logs →
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
