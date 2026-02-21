import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, User, Shield, Clock } from "lucide-react"

export default async function AdminAuditLogsPage() {
    await requireAdmin()

    const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
            admin: {
                select: { email: true, firstName: true, lastName: true, role: true },
            },
        },
    })

    const actionColors: Record<string, string> = {
        "user.role_change": "bg-violet-500/10 text-violet-600",
        "user.subscription_override": "bg-emerald-500/10 text-emerald-600",
        "ticket.status_change": "bg-blue-500/10 text-blue-600",
        "ticket.assign": "bg-yellow-500/10 text-yellow-600",
        "announcement.create": "bg-green-500/10 text-green-600",
        "announcement.delete": "bg-red-500/10 text-red-600",
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                <p className="text-muted-foreground mt-1">
                    Track all admin actions for security and accountability. Last 100 entries.
                </p>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium">Time</th>
                                    <th className="text-left px-4 py-3 font-medium">Admin</th>
                                    <th className="text-left px-4 py-3 font-medium">Action</th>
                                    <th className="text-left px-4 py-3 font-medium">Target</th>
                                    <th className="text-left px-4 py-3 font-medium">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id} className="border-t hover:bg-muted/50 transition-colors">
                                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span className="text-xs">{log.createdAt.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center">
                                                    <Shield className="w-3 h-3 text-violet-600" />
                                                </div>
                                                <span className="text-xs">
                                                    {log.admin.firstName || log.admin.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${actionColors[log.action] || ""}`}
                                            >
                                                {log.action}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs text-muted-foreground">
                                                {log.targetType}: {log.targetId?.slice(0, 8)}...
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <pre className="text-xs text-muted-foreground max-w-[300px] truncate">
                                                {log.details ? JSON.stringify(log.details) : "—"}
                                            </pre>
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                            No audit logs yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
