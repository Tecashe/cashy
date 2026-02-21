"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Users,
    ShoppingBag,
    MessageSquare,
    Zap,
    UserCog,
    Shield,
} from "lucide-react"

interface UserRecord {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    subscriptionTier: string
    subscriptionStatus: string
    businessName: string | null
    role: string
    createdAt: string | Date
    _count: { orders: number; conversations: number; automations: number }
}

const tierColors: Record<string, string> = {
    free: "secondary",
    pro: "default",
    enterprise: "outline",
}

const roleColors: Record<string, string> = {
    USER: "bg-gray-500/10 text-gray-600",
    ADMIN: "bg-violet-500/10 text-violet-600",
    SUPPORT: "bg-blue-500/10 text-blue-600",
}

export function AdminUserTable({
    initialUsers,
    initialTotal,
}: {
    initialUsers: UserRecord[]
    initialTotal: number
}) {
    const [users, setUsers] = useState(initialUsers)
    const [total, setTotal] = useState(initialTotal)
    const [search, setSearch] = useState("")
    const [tier, setTier] = useState("")
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [changingRole, setChangingRole] = useState<string | null>(null)

    const fetchUsers = useCallback(
        async (newPage = 1, newSearch = search, newTier = tier) => {
            setLoading(true)
            try {
                const params = new URLSearchParams({
                    page: String(newPage),
                    limit: "20",
                    ...(newSearch && { search: newSearch }),
                    ...(newTier && { tier: newTier }),
                })
                const res = await fetch(`/api/admin/users?${params}`)
                const data = await res.json()
                setUsers(data.users)
                setTotal(data.total)
                setPage(newPage)
            } finally {
                setLoading(false)
            }
        },
        [search, tier]
    )

    const changeRole = async (userId: string, newRole: string) => {
        setChangingRole(userId)
        try {
            const res = await fetch("/api/admin/users/role", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, role: newRole }),
            })
            if (res.ok) {
                setUsers((prev) =>
                    prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
                )
            }
        } finally {
            setChangingRole(null)
        }
    }

    const changeTier = async (userId: string, newTier: string) => {
        try {
            const res = await fetch("/api/admin/users/subscription", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, tier: newTier }),
            })
            if (res.ok) {
                setUsers((prev) =>
                    prev.map((u) =>
                        u.id === userId ? { ...u, subscriptionTier: newTier } : u
                    )
                )
            }
        } finally {
        }
    }

    const totalPages = Math.ceil(total / 20)

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        All Users ({total})
                    </CardTitle>
                    <div className="flex gap-2 flex-wrap">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-9 w-56"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && fetchUsers(1, search, tier)
                                }
                            />
                        </div>
                        {["", "free", "pro", "enterprise"].map((t) => (
                            <Button
                                key={t}
                                variant={tier === t ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    setTier(t)
                                    fetchUsers(1, search, t)
                                }}
                            >
                                {t || "All"}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium">User</th>
                                    <th className="text-left px-4 py-3 font-medium">Business</th>
                                    <th className="text-left px-4 py-3 font-medium">Plan</th>
                                    <th className="text-left px-4 py-3 font-medium">Role</th>
                                    <th className="text-left px-4 py-3 font-medium">Activity</th>
                                    <th className="text-left px-4 py-3 font-medium">Joined</th>
                                    <th className="text-left px-4 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={loading ? "opacity-50" : ""}>
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-t hover:bg-muted/50 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium">
                                                    {user.firstName || user.lastName
                                                        ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                                                        : "—"}
                                                </p>
                                                <p className="text-muted-foreground text-xs">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {user.businessName || "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={user.subscriptionTier}
                                                onChange={(e) => changeTier(user.id, e.target.value)}
                                                className="text-xs bg-transparent border rounded px-2 py-1 cursor-pointer"
                                            >
                                                <option value="free">Free</option>
                                                <option value="pro">Pro</option>
                                                <option value="enterprise">Enterprise</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                className={`text-xs ${roleColors[user.role] || ""}`}
                                                variant="outline"
                                            >
                                                {user.role === "ADMIN" && (
                                                    <Shield className="w-3 h-3 mr-1" />
                                                )}
                                                {user.role === "SUPPORT" && (
                                                    <UserCog className="w-3 h-3 mr-1" />
                                                )}
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3 text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <ShoppingBag className="w-3 h-3" /> {user._count.orders}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare className="w-3 h-3" />{" "}
                                                    {user._count.conversations}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Zap className="w-3 h-3" /> {user._count.automations}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={user.role}
                                                onChange={(e) => changeRole(user.id, e.target.value)}
                                                disabled={changingRole === user.id}
                                                className="text-xs bg-transparent border rounded px-2 py-1 cursor-pointer disabled:opacity-50"
                                            >
                                                <option value="USER">User</option>
                                                <option value="SUPPORT">Support</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                            Page {page} of {totalPages} ({total} total)
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1 || loading}
                                onClick={() => fetchUsers(page - 1)}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= totalPages || loading}
                                onClick={() => fetchUsers(page + 1)}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
