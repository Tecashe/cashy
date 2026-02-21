import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, UserCog, Crown } from "lucide-react"

export default async function AdminTeamPage() {
    await requireAdmin()

    const teamMembers = await prisma.user.findMany({
        where: { role: { in: ["ADMIN", "SUPPORT"] } },
        orderBy: { createdAt: "asc" },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            imageUrl: true,
            createdAt: true,
            _count: {
                select: {
                    auditLogs: true,
                },
            },
        },
    })

    const roleIcons: Record<string, typeof Crown> = {
        ADMIN: Crown,
        SUPPORT: UserCog,
    }

    const roleColors: Record<string, string> = {
        ADMIN: "bg-violet-500/10 text-violet-600 border-violet-500/20",
        SUPPORT: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team & Roles</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage admin and support staff. To add a member, go to Users and change their role.
                    </p>
                </div>
                <a href="/admin/users">
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                        + Add from Users →
                    </Badge>
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => {
                    const Icon = roleIcons[member.role] || ShieldCheck
                    return (
                        <Card key={member.id} className="relative overflow-hidden">
                            <div className={`absolute top-0 left-0 right-0 h-1 ${member.role === "ADMIN" ? "bg-violet-500" : "bg-blue-500"}`} />
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
                                        {member.firstName?.[0] || member.email[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate">
                                            {member.firstName
                                                ? `${member.firstName} ${member.lastName || ""}`.trim()
                                                : member.email}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className={`text-xs ${roleColors[member.role] || ""}`}>
                                                <Icon className="w-3 h-3 mr-1" />
                                                {member.role}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {member._count.auditLogs} actions
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Member since {member.createdAt.toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
                {teamMembers.length === 0 && (
                    <Card className="col-span-full">
                        <CardContent className="p-8 text-center text-muted-foreground">
                            <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>No team members yet. Go to Users to assign roles.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
