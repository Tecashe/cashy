"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    DollarSign,
    Headphones,
    ShieldCheck,
    Megaphone,
    ClipboardList,
    FileUp,
    Settings,
    BarChart3,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Plug,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface AdminUser {
    firstName: string | null
    lastName: string | null
    email: string
    role: string
    imageUrl: string | null
}

const navSections = [
    {
        label: "Main",
        items: [
            { label: "Overview", href: "/admin", icon: LayoutDashboard },
            { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        ],
    },
    {
        label: "Management",
        items: [
            { label: "Users", href: "/admin/users", icon: Users },
            { label: "Team & Roles", href: "/admin/team", icon: ShieldCheck },
            { label: "Subscriptions", href: "/admin/subscriptions", icon: DollarSign },
        ],
    },
    {
        label: "Communication",
        items: [
            { label: "Support Tickets", href: "/admin/support", icon: Headphones },
            { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
        ],
    },
    {
        label: "Data",
        items: [
            { label: "Revenue", href: "/admin/revenue", icon: DollarSign },
            { label: "Sales Import", href: "/admin/sales", icon: FileUp },
            { label: "Audit Logs", href: "/admin/audit-logs", icon: ClipboardList },
        ],
    },
    {
        label: "System",
        items: [
            { label: "Integrations", href: "/admin/integrations", icon: Plug },
            { label: "Settings", href: "/admin/settings", icon: Settings },
        ],
    },
]

export function AdminSidebar({ adminUser }: { adminUser: AdminUser }) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside
            className={cn(
                "flex flex-col h-screen bg-background border-r border-border transition-all duration-300 sticky top-0",
                collapsed ? "w-[68px]" : "w-[260px]"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-border">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">Yazzil Admin</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                Control Panel
                            </p>
                        </div>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 space-y-6">
                {navSections.map((section) => (
                    <div key={section.label}>
                        {!collapsed && (
                            <p className="px-4 mb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                {section.label}
                            </p>
                        )}
                        <div className="space-y-0.5 px-2">
                            {section.items.map((item) => {
                                const isActive =
                                    item.href === "/admin"
                                        ? pathname === "/admin"
                                        : pathname.startsWith(item.href)
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group",
                                            isActive
                                                ? "bg-violet-600/10 text-violet-600 dark:text-violet-400 font-medium"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        )}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        <item.icon
                                            className={cn(
                                                "w-4 h-4 shrink-0 transition-colors",
                                                isActive
                                                    ? "text-violet-600 dark:text-violet-400"
                                                    : "group-hover:text-foreground"
                                            )}
                                        />
                                        {!collapsed && <span>{item.label}</span>}
                                        {isActive && !collapsed && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400" />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User profile & exit */}
            <div className="border-t border-border p-3 space-y-2">
                {!collapsed && (
                    <div className="flex items-center gap-3 px-2 py-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {adminUser.firstName?.[0] || adminUser.email[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">
                                {adminUser.firstName
                                    ? `${adminUser.firstName} ${adminUser.lastName || ""}`.trim()
                                    : adminUser.email}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                {adminUser.role}
                            </p>
                        </div>
                    </div>
                )}
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    title={collapsed ? "Back to Dashboard" : undefined}
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {!collapsed && <span>Back to Dashboard</span>}
                </Link>
            </div>
        </aside>
    )
}
