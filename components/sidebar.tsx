// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import {
//   LayoutDashboard,
//   MessageSquare,
//   Zap,
//   ImageIcon,
//   BarChart3,
//   Settings,
//   Instagram,
//   Grid3x3,
//   CreditCard,
// } from "lucide-react"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   { name: "Inbox", href: "/inbox", icon: MessageSquare },
//   { name: "Automations", href: "/automations", icon: Zap },
//   { name: "Content Hub", href: "/content", icon: ImageIcon },
//   { name: "Media Library", href: "/media", icon: Grid3x3 },
//   { name: "Accounts", href: "/accounts", icon: Instagram },
//   { name: "Analytics", href: "/analytics", icon: BarChart3 },
//   { name: "Subscription", href: "/subscription", icon: CreditCard },
//   { name: "Settings", href: "/settings", icon: Settings },
// ]

// export function Sidebar() {
//   const pathname = usePathname()

//   return (
//     <div className="flex h-full w-64 flex-col border-r bg-gradient-to-b from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800">
//       {/* Logo */}
//       <div className="flex h-16 items-center gap-2 border-b px-6">
//         <div className="gradient-instagram flex h-10 w-10 items-center justify-center rounded-lg">
//           <Instagram className="h-6 w-6 text-white" />
//         </div>
//         <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//           Yazzil
//         </span>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 space-y-1 p-4">
//         {navigation.map((item) => {
//           const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={cn(
//                 "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
//                 isActive
//                   ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
//                   : "text-slate-700 hover:bg-white/50 dark:text-slate-300 dark:hover:bg-slate-700/50",
//               )}
//             >
//               <item.icon className="h-5 w-5" />
//               {item.name}
//             </Link>
//           )
//         })}
//       </nav>

//       {/* User Section */}
//       <div className="border-t p-4">
//         <div className="flex items-center gap-3 rounded-lg bg-white/50 p-3 dark:bg-slate-700/50">
//           <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-slate-900 dark:text-white truncate">User Account</p>
//             <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Connected</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MessageSquare,
  Zap,
  ImageIcon,
  BarChart3,
  Settings,
  Instagram,
  Grid3x3,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Plus,
  MessageCircle,
  TrendingUp,
  ChevronDown,
  CheckCircle2,
  Activity,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
    group: "main",
  },
  {
    name: "Inbox",
    href: "/inbox",
    icon: MessageSquare,
    badge: 24,
    group: "main",
  },
  {
    name: "Automations",
    href: "/automations",
    icon: Zap,
    badge: 3,
    group: "main",
  },
  {
    name: "Content Hub",
    href: "/content",
    icon: ImageIcon,
    badge: null,
    group: "content",
  },
  {
    name: "Media Library",
    href: "/media",
    icon: Grid3x3,
    badge: null,
    group: "content",
  },
  {
    name: "Accounts",
    href: "/accounts",
    icon: Instagram,
    badge: null,
    group: "settings",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    badge: null,
    group: "settings",
  },
  {
    name: "Subscription",
    href: "/subscription",
    icon: CreditCard,
    badge: null,
    group: "settings",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    badge: null,
    group: "settings",
  },
]

// Mock accounts data
const accounts = [
  {
    id: 1,
    username: "@fashion_brand",
    avatar: "/diverse-fashion-collection.png",
    active: true,
  },
  {
    id: 2,
    username: "@lifestyle_store",
    avatar: "/diverse-group-relaxing.png",
    active: false,
  },
  {
    id: 3,
    username: "@tech_hub",
    avatar: "/interconnected-tech.png",
    active: false,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(accounts[0])

  return (
    <div
      className={cn(
        "hidden lg:flex h-full flex-col border-r border-border bg-card transition-all duration-300",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      {/* Header with Logo and Collapse Toggle */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-foreground shadow-lg dark:shadow-black/50 transition-all group-hover:scale-105 group-hover:shadow-xl">
              <Instagram className="h-5 w-5 text-background" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-foreground">Yazzil</span>
              <span className="text-[10px] font-medium text-muted-foreground">Professional</span>
            </div>
          </Link>
        )}
        {isCollapsed && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground shadow-lg">
            <Instagram className="h-5 w-5 text-background" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="border-b border-border p-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              className="bg-foreground text-background hover:bg-foreground/90 shadow-lg dark:shadow-black/50 hover:shadow-xl hover:scale-[1.02] transition-all font-medium"
            >
              <Zap className="mr-1.5 h-3.5 w-3.5" />
              New Flow
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-border bg-background hover:bg-accent shadow-md dark:shadow-black/30 hover:shadow-lg hover:scale-[1.02] transition-all font-medium"
            >
              <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
              Compose
            </Button>
          </div>
        </div>
      )}

      {/* Live Stats */}
      {/* {!isCollapsed && (
        <div className="border-b border-border px-4 py-3 bg-muted/30">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Active Automations</span>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="font-semibold text-green-600 dark:text-green-400">3 Live</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Response Rate</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-foreground">94.2%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Messages Today</span>
              <span className="font-semibold text-foreground">1,247</span>
            </div>
          </div>
        </div>
      )} */}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          const showDivider = index > 0 && navigation[index - 1].group !== item.group

          return (
            <div key={item.name}>
              {showDivider && !isCollapsed && <div className="my-3 h-px bg-border" />}
              <Link
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-foreground text-background shadow-lg dark:shadow-black/50"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-foreground" />
                )}
                <item.icon
                  className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive && "text-background")}
                />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge className="h-5 min-w-5 bg-foreground text-background px-1.5 text-xs font-semibold border-0 shadow-md">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Account Switcher */}
      {!isCollapsed && (
        <div className="border-t border-border p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent rounded-xl transition-all hover:shadow-md dark:hover:shadow-black/30"
              >
                <Avatar className="h-9 w-9 border-2 border-border shadow-md">
                  <AvatarImage src={selectedAccount.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-foreground text-background font-semibold">IG</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col items-start text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">{selectedAccount.username}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity className="h-3 w-3 text-green-600 dark:text-green-400" />
                    <span className="text-xs text-muted-foreground">Connected</span>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-card border-border shadow-xl dark:shadow-black/50">
              {accounts.map((account) => (
                <DropdownMenuItem
                  key={account.id}
                  onClick={() => setSelectedAccount(account)}
                  className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all"
                >
                  <Avatar className="h-8 w-8 shadow-sm">
                    <AvatarImage src={account.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-foreground text-background text-xs font-semibold">IG</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium text-foreground">{account.username}</span>
                    <span className="text-xs text-muted-foreground">{account.active ? "Active" : "Switch to"}</span>
                  </div>
                  {account.id === selectedAccount.id && <CheckCircle2 className="h-4 w-4 text-foreground" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-dashed border-border">
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-sm text-foreground font-medium">Connect Account</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Plan Badge */}
      {!isCollapsed && (
        <div className="border-t border-border p-4">
          <div className="rounded-xl bg-accent p-4 border border-border shadow-lg dark:shadow-black/30">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background shadow-md">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-foreground">Pro Plan</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Unlimited automations</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs h-7 font-medium border-border hover:bg-background shadow-sm hover:shadow-md transition-all bg-transparent"
                >
                  View Usage
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed State Indicators */}
      {isCollapsed && (
        <div className="flex flex-col items-center gap-3 border-t border-border p-3">
          <Avatar className="h-9 w-9 border-2 border-border shadow-md">
            <AvatarImage src={selectedAccount.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-foreground text-background text-xs font-semibold">IG</AvatarFallback>
          </Avatar>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background shadow-md">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  )
}
