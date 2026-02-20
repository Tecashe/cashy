"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    TrendingUp,
    Users,
    Upload,
    Plug,
    ChevronRight,
    ShieldCheck,
} from "lucide-react"

interface AdminNavItem {
    name: string
    href: string
    icon: React.ElementType
    description: string
}

export function AdminNav({ slug }: { slug: string }) {
    const pathname = usePathname()

    const items: AdminNavItem[] = [
        {
            name: "Overview",
            href: `/dashboard/${slug}/admin`,
            icon: LayoutDashboard,
            description: "Platform KPIs & summary",
        },
        {
            name: "Revenue",
            href: `/dashboard/${slug}/admin/revenue`,
            icon: TrendingUp,
            description: "Revenue analytics & trends",
        },
        {
            name: "Users",
            href: `/dashboard/${slug}/admin/users`,
            icon: Users,
            description: "All platform users",
        },
        {
            name: "Sales Upload",
            href: `/dashboard/${slug}/admin/sales`,
            icon: Upload,
            description: "Import historical sales data",
        },
        {
            name: "Integrations",
            href: `/dashboard/${slug}/admin/integrations`,
            icon: Plug,
            description: "GA · GSC · Pexels",
        },
    ]

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Admin Panel</span>
            </div>
            <nav className="p-2">
                {items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary-foreground" : "")} />
                            <div className="flex-1 min-w-0">
                                <p className={isActive ? "text-primary-foreground" : ""}>{item.name}</p>
                                <p className={cn("text-xs truncate", isActive ? "text-primary-foreground/70" : "text-muted-foreground")}>
                                    {item.description}
                                </p>
                            </div>
                            <ChevronRight className={cn("w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity", isActive ? "opacity-70" : "")} />
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
