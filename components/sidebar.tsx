
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
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   MessageCircle,
//   TrendingUp,
//   ChevronDown,
//   CheckCircle2,
//   Activity,
// } from "lucide-react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"

// const navigation = [
//   {
//     name: "Dashboard",
//     href: "/dashboard",
//     icon: LayoutDashboard,
//     badge: null,
//     group: "main",
//   },
//   {
//     name: "Inbox",
//     href: "/inbox",
//     icon: MessageSquare,
//     badge: 24,
//     group: "main",
//   },
//   {
//     name: "Automations",
//     href: "/automations",
//     icon: Zap,
//     badge: 3,
//     group: "main",
//   },
//   {
//     name: "Content Hub",
//     href: "/content",
//     icon: ImageIcon,
//     badge: null,
//     group: "content",
//   },
//   {
//     name: "Media Library",
//     href: "/media",
//     icon: Grid3x3,
//     badge: null,
//     group: "content",
//   },
//   {
//     name: "Accounts",
//     href: "/accounts",
//     icon: Instagram,
//     badge: null,
//     group: "settings",
//   },
//   {
//     name: "Analytics",
//     href: "/analytics",
//     icon: BarChart3,
//     badge: null,
//     group: "settings",
//   },
//   {
//     name: "Subscription",
//     href: "/subscription",
//     icon: CreditCard,
//     badge: null,
//     group: "settings",
//   },
//   {
//     name: "Settings",
//     href: "/settings",
//     icon: Settings,
//     badge: null,
//     group: "settings",
//   },
// ]

// // Mock accounts data
// const accounts = [
//   {
//     id: 1,
//     username: "@fashion_brand",
//     avatar: "/diverse-fashion-collection.png",
//     active: true,
//   },
//   {
//     id: 2,
//     username: "@lifestyle_store",
//     avatar: "/diverse-group-relaxing.png",
//     active: false,
//   },
//   {
//     id: 3,
//     username: "@tech_hub",
//     avatar: "/interconnected-tech.png",
//     active: false,
//   },
// ]

// export function Sidebar() {
//   const pathname = usePathname()
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [selectedAccount, setSelectedAccount] = useState(accounts[0])

//   return (
//     <div
//       className={cn(
//         "hidden lg:flex h-full flex-col border-r border-border bg-card transition-all duration-300",
//         isCollapsed ? "w-20" : "w-72",
//       )}
//     >
//       {/* Header with Logo and Collapse Toggle */}
//       <div className="flex h-16 items-center justify-between border-b border-border px-4">
//         {!isCollapsed && (
//           <Link href="/dashboard" className="flex items-center gap-3 group">
//             <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-foreground shadow-lg dark:shadow-black/50 transition-all group-hover:scale-105 group-hover:shadow-xl">
//               <Instagram className="h-5 w-5 text-background" />
//             </div>
//             <div className="flex flex-col">
//               <span className="text-lg font-bold tracking-tight text-foreground">Yazzil</span>
//               <span className="text-[10px] font-medium text-muted-foreground">Professional</span>
//             </div>
//           </Link>
//         )}
//         {isCollapsed && (
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground shadow-lg">
//             <Instagram className="h-5 w-5 text-background" />
//           </div>
//         )}
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="hidden lg:flex h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
//         >
//           {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//         </Button>
//       </div>

//       {/* Quick Actions */}
//       {!isCollapsed && (
//         <div className="border-b border-border p-4">
//           <div className="grid grid-cols-2 gap-2">
//             <Button
//               size="sm"
//               className="bg-foreground text-background hover:bg-foreground/90 shadow-lg dark:shadow-black/50 hover:shadow-xl hover:scale-[1.02] transition-all font-medium"
//             >
//               <Zap className="mr-1.5 h-3.5 w-3.5" />
//               New Flow
//             </Button>
//             <Button
//               size="sm"
//               variant="outline"
//               className="border-border bg-background hover:bg-accent shadow-md dark:shadow-black/30 hover:shadow-lg hover:scale-[1.02] transition-all font-medium"
//             >
//               <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
//               Compose
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Live Stats */}
//       {/* {!isCollapsed && (
//         <div className="border-b border-border px-4 py-3 bg-muted/30">
//           <div className="space-y-2">
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground font-medium">Active Automations</span>
//               <div className="flex items-center gap-1.5">
//                 <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
//                 <span className="font-semibold text-green-600 dark:text-green-400">3 Live</span>
//               </div>
//             </div>
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground font-medium">Response Rate</span>
//               <div className="flex items-center gap-1">
//                 <TrendingUp className="h-3 w-3 text-blue-600 dark:text-blue-400" />
//                 <span className="font-semibold text-foreground">94.2%</span>
//               </div>
//             </div>
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-muted-foreground font-medium">Messages Today</span>
//               <span className="font-semibold text-foreground">1,247</span>
//             </div>
//           </div>
//         </div>
//       )} */}

//       {/* Navigation */}
//       <nav className="flex-1 space-y-1 overflow-y-auto p-3">
//         {navigation.map((item, index) => {
//           const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
//           const showDivider = index > 0 && navigation[index - 1].group !== item.group

//           return (
//             <div key={item.name}>
//               {showDivider && !isCollapsed && <div className="my-3 h-px bg-border" />}
//               <Link
//                 href={item.href}
//                 className={cn(
//                   "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
//                   isActive
//                     ? "bg-foreground text-background shadow-lg dark:shadow-black/50"
//                     : "text-muted-foreground hover:bg-accent hover:text-foreground",
//                 )}
//               >
//                 {isActive && (
//                   <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-foreground" />
//                 )}
//                 <item.icon
//                   className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive && "text-background")}
//                 />
//                 {!isCollapsed && (
//                   <>
//                     <span className="flex-1">{item.name}</span>
//                     {item.badge && (
//                       <Badge className="h-5 min-w-5 bg-foreground text-background px-1.5 text-xs font-semibold border-0 shadow-md">
//                         {item.badge}
//                       </Badge>
//                     )}
//                   </>
//                 )}
//               </Link>
//             </div>
//           )
//         })}
//       </nav>

//       {/* Account Switcher */}
//       {!isCollapsed && (
//         <div className="border-t border-border p-4">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent rounded-xl transition-all hover:shadow-md dark:hover:shadow-black/30"
//               >
//                 <Avatar className="h-9 w-9 border-2 border-border shadow-md">
//                   <AvatarImage src={selectedAccount.avatar || "/placeholder.svg"} />
//                   <AvatarFallback className="bg-foreground text-background font-semibold">IG</AvatarFallback>
//                 </Avatar>
//                 <div className="flex flex-1 flex-col items-start text-left">
//                   <div className="flex items-center gap-1.5">
//                     <span className="text-sm font-semibold text-foreground">{selectedAccount.username}</span>
//                     <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
//                   </div>
//                   <div className="flex items-center gap-1.5">
//                     <Activity className="h-3 w-3 text-green-600 dark:text-green-400" />
//                     <span className="text-xs text-muted-foreground">Connected</span>
//                   </div>
//                 </div>
//                 <ChevronDown className="h-4 w-4 text-muted-foreground" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-64 bg-card border-border shadow-xl dark:shadow-black/50">
//               {accounts.map((account) => (
//                 <DropdownMenuItem
//                   key={account.id}
//                   onClick={() => setSelectedAccount(account)}
//                   className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all"
//                 >
//                   <Avatar className="h-8 w-8 shadow-sm">
//                     <AvatarImage src={account.avatar || "/placeholder.svg"} />
//                     <AvatarFallback className="bg-foreground text-background text-xs font-semibold">IG</AvatarFallback>
//                   </Avatar>
//                   <div className="flex flex-1 flex-col">
//                     <span className="text-sm font-medium text-foreground">{account.username}</span>
//                     <span className="text-xs text-muted-foreground">{account.active ? "Active" : "Switch to"}</span>
//                   </div>
//                   {account.id === selectedAccount.id && <CheckCircle2 className="h-4 w-4 text-foreground" />}
//                 </DropdownMenuItem>
//               ))}
//               <DropdownMenuSeparator className="bg-border" />
//               <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-dashed border-border">
//                   <Plus className="h-4 w-4 text-muted-foreground" />
//                 </div>
//                 <span className="text-sm text-foreground font-medium">Connect Account</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       )}

//       {/* Plan Badge */}
//       {!isCollapsed && (
//         <div className="border-t border-border p-4">
//           <div className="rounded-xl bg-accent p-4 border border-border shadow-lg dark:shadow-black/30">
//             <div className="flex items-start gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background shadow-md">
//                 <CheckCircle2 className="h-5 w-5" />
//               </div>
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="text-sm font-bold text-foreground">Pro Plan</span>
//                 </div>
//                 <p className="text-xs text-muted-foreground mb-3">Unlimited automations</p>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   className="w-full text-xs h-7 font-medium border-border hover:bg-background shadow-sm hover:shadow-md transition-all bg-transparent"
//                 >
//                   View Usage
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Collapsed State Indicators */}
//       {isCollapsed && (
//         <div className="flex flex-col items-center gap-3 border-t border-border p-3">
//           <Avatar className="h-9 w-9 border-2 border-border shadow-md">
//             <AvatarImage src={selectedAccount.avatar || "/placeholder.svg"} />
//             <AvatarFallback className="bg-foreground text-background text-xs font-semibold">IG</AvatarFallback>
//           </Avatar>
//           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background shadow-md">
//             <CheckCircle2 className="h-4 w-4" />
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


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
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   ChevronDown,
//   CheckCircle2,
//   Activity,
//   Loader2,
// } from "lucide-react"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"

// interface InstagramAccount {
//   id: string
//   username: string
//   profilePicUrl: string | null
//   followerCount: number
// }

// const navigation = [
//   {
//     name: "Dashboard",
//     href: "/dashboard",
//     icon: LayoutDashboard,
//     badge: null,
//     group: "main",
//   },
//   {
//     name: "Inbox",
//     href: "/inbox",
//     icon: MessageSquare,
//     badge: null,
//     group: "main",
//   },
//    {
//     name: "Customers",
//     href: "/customers",
//     icon: MessageSquare,
//     badge: null,
//     group: "main",
//   },
//   {
//     name: "Automations",
//     href: "/automations",
//     icon: Zap,
//     badge: null,
//     group: "main",
//   },
//   {
//     name: "Content Hub",
//     href: "/content",
//     icon: ImageIcon,
//     badge: null,
//     group: "content",
//   },
//   {
//     name: "Media Library",
//     href: "/media",
//     icon: Grid3x3,
//     badge: null,
//     group: "content",
//   },
//   {
//     name: "Accounts",
//     href: "/accounts",
//     icon: Instagram,
//     badge: null,
//     group: "settings",
//   },
//   {
//     name: "Analytics",
//     href: "/analytics",
//     icon: BarChart3,
//     badge: null,
//     group: "settings",
//   },
//   {
//     name: "Subscription",
//     href: "/subscription",
//     icon: CreditCard,
//     badge: null,
//     group: "settings",
//   },
//   {
//     name: "Settings",
//     href: "/settings",
//     icon: Settings,
//     badge: null,
//     group: "settings",
//   },
// ]

// export function Sidebar() {
//   const pathname = usePathname()
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [accounts, setAccounts] = useState<InstagramAccount[]>([])
//   const [selectedAccount, setSelectedAccount] = useState<InstagramAccount | null>(null)
//   const [loading, setLoading] = useState(true)

//   // Fetch Instagram accounts on mount
//   useEffect(() => {
//     async function fetchAccounts() {
//       try {
//         const response = await fetch("/api/instagram/accounts")
//         if (response.ok) {
//           const data = await response.json()
//           setAccounts(data.accounts || [])
          
//           // Set selected account from cookie or default to first account
//           const savedAccountId = getCookie("selectedInstagramAccountId")
//           if (savedAccountId && data.accounts) {
//             const saved = data.accounts.find((acc: InstagramAccount) => acc.id === savedAccountId)
//             setSelectedAccount(saved || data.accounts[0] || null)
//           } else if (data.accounts?.length > 0) {
//             setSelectedAccount(data.accounts[0])
//             setCookie("selectedInstagramAccountId", data.accounts[0].id)
//           }
//         }
//       } catch (error) {
//         console.error("Failed to fetch accounts:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchAccounts()
//   }, [])

//   // Handle account switch
//   const handleAccountSwitch = async (account: InstagramAccount) => {
//     setSelectedAccount(account)
//     setCookie("selectedInstagramAccountId", account.id)
    
//     // Trigger a page refresh to reload data for the new account
//     window.location.reload()
//   }

//   return (
//     <div
//       className={cn(
//         "hidden lg:flex h-full flex-col border-r border-border bg-card transition-all duration-300",
//         isCollapsed ? "w-20" : "w-72",
//       )}
//     >
//       {/* Header with Logo and Collapse Toggle */}
//       <div className="flex h-16 items-center justify-between border-b border-border px-4">
//         {!isCollapsed && (
//           <Link href="/dashboard" className="flex items-center gap-3 group">
//             <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-foreground shadow-lg dark:shadow-black/50 transition-all group-hover:scale-105 group-hover:shadow-xl">
//               <Instagram className="h-5 w-5 text-background" />
//             </div>
//             <div className="flex flex-col">
//               <span className="text-lg font-bold tracking-tight text-foreground">Yazzil</span>
//               <span className="text-[10px] font-medium text-muted-foreground">Professional</span>
//             </div>
//           </Link>
//         )}
//         {isCollapsed && (
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground shadow-lg">
//             <Instagram className="h-5 w-5 text-background" />
//           </div>
//         )}
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="hidden lg:flex h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
//         >
//           {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//         </Button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 space-y-1 overflow-y-auto p-3">
//         {navigation.map((item, index) => {
//           const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
//           const showDivider = index > 0 && navigation[index - 1].group !== item.group

//           return (
//             <div key={item.name}>
//               {showDivider && !isCollapsed && <div className="my-3 h-px bg-border" />}
//               <Link
//                 href={item.href}
//                 className={cn(
//                   "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
//                   isActive
//                     ? "bg-foreground text-background shadow-lg dark:shadow-black/50"
//                     : "text-muted-foreground hover:bg-accent hover:text-foreground",
//                 )}
//               >
//                 {isActive && (
//                   <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-foreground" />
//                 )}
//                 <item.icon
//                   className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive && "text-background")}
//                 />
//                 {!isCollapsed && (
//                   <>
//                     <span className="flex-1">{item.name}</span>
//                     {item.badge && (
//                       <Badge className="h-5 min-w-5 bg-foreground text-background px-1.5 text-xs font-semibold border-0 shadow-md">
//                         {item.badge}
//                       </Badge>
//                     )}
//                   </>
//                 )}
//               </Link>
//             </div>
//           )
//         })}
//       </nav>

//       {/* Account Switcher */}
//       {!isCollapsed && (
//         <div className="border-t border-border p-4">
//           {loading ? (
//             <div className="flex items-center justify-center py-3">
//               <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
//             </div>
//           ) : accounts.length === 0 ? (
//             <Link href="/api/auth/instagram/connect">
//               <Button
//                 variant="outline"
//                 className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent rounded-xl transition-all hover:shadow-md dark:hover:shadow-black/30"
//               >
//                 <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-dashed border-border">
//                   <Plus className="h-4 w-4 text-muted-foreground" />
//                 </div>
//                 <span className="text-sm text-foreground font-medium">Connect Instagram</span>
//               </Button>
//             </Link>
//           ) : (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent rounded-xl transition-all hover:shadow-md dark:hover:shadow-black/30"
//                 >
//                   <Avatar className="h-9 w-9 border-2 border-border shadow-md">
//                     <AvatarImage src={selectedAccount?.profilePicUrl || ""} />
//                     <AvatarFallback className="bg-foreground text-background font-semibold">
//                       {selectedAccount?.username.substring(0, 2).toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex flex-1 flex-col items-start text-left">
//                     <div className="flex items-center gap-1.5">
//                       <span className="text-sm font-semibold text-foreground">@{selectedAccount?.username}</span>
//                       <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       <Activity className="h-3 w-3 text-green-600 dark:text-green-400" />
//                       <span className="text-xs text-muted-foreground">Connected</span>
//                     </div>
//                   </div>
//                   <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-64 bg-card border-border shadow-xl dark:shadow-black/50">
//                 {accounts.map((account) => (
//                   <DropdownMenuItem
//                     key={account.id}
//                     onClick={() => handleAccountSwitch(account)}
//                     className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all"
//                   >
//                     <Avatar className="h-8 w-8 shadow-sm">
//                       <AvatarImage src={account.profilePicUrl || ""} />
//                       <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
//                         {account.username.substring(0, 2).toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex flex-1 flex-col">
//                       <span className="text-sm font-medium text-foreground">@{account.username}</span>
//                       <span className="text-xs text-muted-foreground">
//                         {account.followerCount.toLocaleString()} followers
//                       </span>
//                     </div>
//                     {account.id === selectedAccount?.id && <CheckCircle2 className="h-4 w-4 text-foreground" />}
//                   </DropdownMenuItem>
//                 ))}
//                 <DropdownMenuSeparator className="bg-border" />
//                 <DropdownMenuItem asChild>
//                   <Link 
//                     href="/api/auth/instagram/connect"
//                     className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all"
//                   >
//                     <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-dashed border-border">
//                       <Plus className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                     <span className="text-sm text-foreground font-medium">Connect Account</span>
//                   </Link>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           )}
//         </div>
//       )}

//       {/* Plan Badge */}
//       {!isCollapsed && (
//         <div className="border-t border-border p-4">
//           <div className="rounded-xl bg-accent p-4 border border-border shadow-lg dark:shadow-black/30">
//             <div className="flex items-start gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background shadow-md">
//                 <CheckCircle2 className="h-5 w-5" />
//               </div>
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="text-sm font-bold text-foreground">Pro Plan</span>
//                 </div>
//                 <p className="text-xs text-muted-foreground mb-3">Unlimited automations</p>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   className="w-full text-xs h-7 font-medium border-border hover:bg-background shadow-sm hover:shadow-md transition-all bg-transparent"
//                 >
//                   View Usage
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Collapsed State Indicators */}
//       {isCollapsed && (
//         <div className="flex flex-col items-center gap-3 border-t border-border p-3">
//           {selectedAccount ? (
//             <Avatar className="h-9 w-9 border-2 border-border shadow-md">
//               <AvatarImage src={selectedAccount.profilePicUrl || ""} />
//               <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
//                 {selectedAccount.username.substring(0, 2).toUpperCase()}
//               </AvatarFallback>
//             </Avatar>
//           ) : (
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-dashed border-border">
//               <Plus className="h-4 w-4 text-muted-foreground" />
//             </div>
//           )}
//           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background shadow-md">
//             <CheckCircle2 className="h-4 w-4" />
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// // Cookie helper functions
// function getCookie(name: string): string | null {
//   if (typeof document === "undefined") return null
//   const value = `; ${document.cookie}`
//   const parts = value.split(`; ${name}=`)
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null
//   return null
// }

// function setCookie(name: string, value: string, days: number = 365) {
//   if (typeof document === "undefined") return
//   const expires = new Date()
//   expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
//   document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
// }

// "use client"

// import type React from "react"

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
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   ChevronDown,
//   CheckCircle2,
//   Activity,
//   Loader2,
//   Boxes,
//   Calendar,
//   ShoppingBag,
//   FileText,
//   Menu,
// } from "lucide-react"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// interface InstagramAccount {
//   id: string
//   username: string
//   profilePicUrl: string | null
//   followerCount: number
// }

// interface NavigationItem {
//   name: string
//   href: string
//   icon: React.ElementType
//   badge?: number | null
//   subItems?: NavigationItem[]
// }

// const navigation: NavigationItem[] = [
//   {
//     name: "Dashboard",
//     href: "/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     name: "Inbox",
//     href: "/inbox",
//     icon: MessageSquare,
//   },
//   {
//     name: "Customers",
//     href: "/customers",
//     icon: MessageSquare,
//   },
//   {
//     name: "Automations",
//     href: "/automations",
//     icon: Zap,
//   },
//   {
//     name: "Content Hub",
//     href: "/content",
//     icon: ImageIcon,
//   },
//   {
//     name: "Media Library",
//     href: "/media",
//     icon: Grid3x3,
//   },
//   {
//     name: "Integrations",
//     href: "/dashboard/integrations",
//     icon: Boxes,
//     subItems: [
//       {
//         name: "Calendly",
//         href: "/dashboard/integrations/calendly",
//         icon: Calendar,
//       },
//       {
//         name: "Shopify",
//         href: "/dashboard/integrations/shopify",
//         icon: ShoppingBag,
//       },
//     ],
//   },
//   {
//     name: "Templates",
//     href: "/dashboard/templates",
//     icon: FileText,
//   },
//   {
//     name: "Accounts",
//     href: "/accounts",
//     icon: Instagram,
//   },
//   {
//     name: "Analytics",
//     href: "/analytics",
//     icon: BarChart3,
//   },
//   {
//     name: "Subscription",
//     href: "/subscription",
//     icon: CreditCard,
//   },
//   {
//     name: "Settings",
//     href: "/settings",
//     icon: Settings,
//   },
// ]

// function SidebarContent({
//   isCollapsed,
//   pathname,
//   navigation,
//   openSubmenus,
//   toggleSubmenu,
//   accounts,
//   selectedAccount,
//   loading,
//   handleAccountSwitch,
// }: {
//   isCollapsed: boolean
//   pathname: string | null
//   navigation: NavigationItem[]
//   openSubmenus: Record<string, boolean>
//   toggleSubmenu: (name: string) => void
//   accounts: InstagramAccount[]
//   selectedAccount: InstagramAccount | null
//   loading: boolean
//   handleAccountSwitch: (account: InstagramAccount) => void
// }) {
//   return (
//     <>
//       {/* Navigation */}
//       <nav className="flex-1 space-y-1 overflow-y-auto p-3">
//         {navigation.map((item) => {
//           const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
//           const hasSubItems = item.subItems && item.subItems.length > 0
//           const isSubmenuOpen = openSubmenus[item.name]

//           const isSubItemActive = hasSubItems
//             ? item.subItems!.some((subItem) => pathname === subItem.href || pathname?.startsWith(subItem.href + "/"))
//             : false

//           if (hasSubItems && !isCollapsed) {
//             return (
//               <Collapsible key={item.name} open={isSubmenuOpen} onOpenChange={() => toggleSubmenu(item.name)}>
//                 <CollapsibleTrigger asChild>
//                   <button
//                     className={cn(
//                       "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
//                       isSubItemActive
//                         ? "bg-foreground/10 text-foreground shadow-sm"
//                         : "text-muted-foreground hover:bg-accent hover:text-foreground",
//                     )}
//                   >
//                     <item.icon
//                       className={cn(
//                         "h-5 w-5 transition-transform group-hover:scale-110",
//                         isSubItemActive && "text-foreground",
//                       )}
//                     />
//                     <span className="flex-1 text-left">{item.name}</span>
//                     <ChevronDown
//                       className={cn("h-4 w-4 transition-transform duration-200", isSubmenuOpen && "rotate-180")}
//                     />
//                   </button>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent className="mt-1 space-y-1">
//                   {item.subItems!.map((subItem) => {
//                     const isSubActive = pathname === subItem.href || pathname?.startsWith(subItem.href + "/")
//                     return (
//                       <Link
//                         key={subItem.name}
//                         href={subItem.href}
//                         className={cn(
//                           "group relative flex items-center gap-3 rounded-xl pl-11 pr-3 py-2 text-sm font-medium transition-all duration-200",
//                           isSubActive
//                             ? "bg-foreground text-background shadow-lg dark:shadow-black/50"
//                             : "text-muted-foreground hover:bg-accent hover:text-foreground",
//                         )}
//                       >
//                         {isSubActive && (
//                           <div className="absolute left-6 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-background" />
//                         )}
//                         <subItem.icon
//                           className={cn(
//                             "h-4 w-4 transition-transform group-hover:scale-110",
//                             isSubActive && "text-background",
//                           )}
//                         />
//                         <span className="flex-1">{subItem.name}</span>
//                       </Link>
//                     )
//                   })}
//                 </CollapsibleContent>
//               </Collapsible>
//             )
//           }

//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={cn(
//                 "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
//                 isActive
//                   ? "bg-foreground text-background shadow-lg dark:shadow-black/50"
//                   : "text-muted-foreground hover:bg-accent hover:text-foreground",
//               )}
//             >
//               {isActive && !isCollapsed && (
//                 <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-background" />
//               )}
//               <item.icon
//                 className={cn(
//                   "h-5 w-5 transition-transform group-hover:scale-110",
//                   isActive && "text-background",
//                   isCollapsed && "mx-auto",
//                 )}
//               />
//               {!isCollapsed && (
//                 <>
//                   <span className="flex-1">{item.name}</span>
//                   {item.badge && (
//                     <Badge className="h-5 min-w-5 bg-foreground text-background px-1.5 text-xs font-semibold border-0 shadow-md">
//                       {item.badge}
//                     </Badge>
//                   )}
//                 </>
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {!isCollapsed && (
//         <div className="border-t border-border p-4">
//           {loading ? (
//             <div className="flex items-center justify-center py-3">
//               <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
//             </div>
//           ) : accounts.length === 0 ? (
//             <Link href="/api/auth/instagram/connect">
//               <Button
//                 variant="outline"
//                 className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent rounded-xl transition-all hover:shadow-md dark:hover:shadow-black/30 bg-transparent"
//               >
//                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border">
//                   <Plus className="h-4 w-4 text-muted-foreground" />
//                 </div>
//                 <span className="text-sm text-foreground font-medium">Connect Instagram</span>
//               </Button>
//             </Link>
//           ) : (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent rounded-xl transition-all hover:shadow-md dark:hover:shadow-black/30"
//                 >
//                   <Avatar className="h-9 w-9 shrink-0 border-2 border-border shadow-md">
//                     <AvatarImage src={selectedAccount?.profilePicUrl || ""} />
//                     <AvatarFallback className="bg-foreground text-background font-semibold text-xs">
//                       {selectedAccount?.username.substring(0, 2).toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex flex-1 flex-col items-start text-left min-w-0">
//                     <div className="flex items-center gap-1.5 w-full min-w-0">
//                       <span className="text-sm font-semibold text-foreground truncate">
//                         @{selectedAccount?.username}
//                       </span>
//                       <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       <Activity className="h-3 w-3 shrink-0 text-green-600 dark:text-green-400" />
//                       <span className="text-xs text-muted-foreground">Connected</span>
//                     </div>
//                   </div>
//                   <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-64 bg-card border-border shadow-xl dark:shadow-black/50">
//                 {accounts.map((account) => (
//                   <DropdownMenuItem
//                     key={account.id}
//                     onClick={() => handleAccountSwitch(account)}
//                     className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all"
//                   >
//                     <Avatar className="h-8 w-8 shrink-0 shadow-sm">
//                       <AvatarImage src={account.profilePicUrl || ""} />
//                       <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
//                         {account.username.substring(0, 2).toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex flex-1 flex-col min-w-0">
//                       <span className="text-sm font-medium text-foreground truncate">@{account.username}</span>
//                       <span className="text-xs text-muted-foreground">
//                         {account.followerCount.toLocaleString()} followers
//                       </span>
//                     </div>
//                     {account.id === selectedAccount?.id && (
//                       <CheckCircle2 className="h-4 w-4 shrink-0 text-foreground" />
//                     )}
//                   </DropdownMenuItem>
//                 ))}
//                 <DropdownMenuSeparator className="bg-border" />
//                 <DropdownMenuItem asChild>
//                   <Link
//                     href="/api/auth/instagram/connect"
//                     className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all"
//                   >
//                     <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border">
//                       <Plus className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                     <span className="text-sm text-foreground font-medium">Connect Account</span>
//                   </Link>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           )}
//         </div>
//       )}

//       {/* Plan Badge */}
//       {!isCollapsed && (
//         <div className="border-t border-border p-4">
//           <div className="rounded-xl bg-accent p-4 border border-border shadow-lg dark:shadow-black/30">
//             <div className="flex items-start gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background shadow-md">
//                 <CheckCircle2 className="h-5 w-5" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="text-sm font-bold text-foreground">Pro Plan</span>
//                 </div>
//                 <p className="text-xs text-muted-foreground mb-3">Unlimited automations</p>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   className="w-full text-xs h-7 font-medium border-border hover:bg-background shadow-sm hover:shadow-md transition-all bg-transparent"
//                 >
//                   View Usage
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Collapsed State Indicators */}
//       {isCollapsed && (
//         <div className="flex flex-col items-center gap-3 border-t border-border p-3">
//           {selectedAccount ? (
//             <Avatar className="h-9 w-9 border-2 border-border shadow-md">
//               <AvatarImage src={selectedAccount.profilePicUrl || ""} />
//               <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
//                 {selectedAccount.username.substring(0, 2).toUpperCase()}
//               </AvatarFallback>
//             </Avatar>
//           ) : (
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-dashed border-border">
//               <Plus className="h-4 w-4 text-muted-foreground" />
//             </div>
//           )}
//           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background shadow-md">
//             <CheckCircle2 className="h-4 w-4" />
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export function Sidebar() {
//   const pathname = usePathname()
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [accounts, setAccounts] = useState<InstagramAccount[]>([])
//   const [selectedAccount, setSelectedAccount] = useState<InstagramAccount | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({})
//   const [mobileOpen, setMobileOpen] = useState(false)

//   // Fetch Instagram accounts on mount
//   useEffect(() => {
//     async function fetchAccounts() {
//       try {
//         const response = await fetch("/api/instagram/accounts")
//         if (response.ok) {
//           const data = await response.json()
//           setAccounts(data.accounts || [])

//           // Set selected account from cookie or default to first account
//           const savedAccountId = getCookie("selectedInstagramAccountId")
//           if (savedAccountId && data.accounts) {
//             const saved = data.accounts.find((acc: InstagramAccount) => acc.id === savedAccountId)
//             setSelectedAccount(saved || data.accounts[0] || null)
//           } else if (data.accounts?.length > 0) {
//             setSelectedAccount(data.accounts[0])
//             setCookie("selectedInstagramAccountId", data.accounts[0].id)
//           }
//         }
//       } catch (error) {
//         console.error("Failed to fetch accounts:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchAccounts()
//   }, [])

//   useEffect(() => {
//     const newOpenSubmenus: Record<string, boolean> = {}
//     navigation.forEach((item) => {
//       if (item.subItems) {
//         const isSubItemActive = item.subItems.some(
//           (subItem) => pathname === subItem.href || pathname?.startsWith(subItem.href + "/"),
//         )
//         if (isSubItemActive) {
//           newOpenSubmenus[item.name] = true
//         }
//       }
//     })
//     setOpenSubmenus(newOpenSubmenus)
//   }, [pathname])

//   // Handle account switch
//   const handleAccountSwitch = async (account: InstagramAccount) => {
//     setSelectedAccount(account)
//     setCookie("selectedInstagramAccountId", account.id)

//     // Trigger a page refresh to reload data for the new account
//     window.location.reload()
//   }

//   const toggleSubmenu = (itemName: string) => {
//     setOpenSubmenus((prev) => ({
//       ...prev,
//       [itemName]: !prev[itemName],
//     }))
//   }

//   return (
//     <>
//       <div className="lg:hidden">
//         <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
//           <SheetTrigger asChild>
//             <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-40 h-10 w-10 lg:hidden">
//               <Menu className="h-5 w-5" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="w-72 p-0 bg-card border-border">
//             <div className="flex h-full flex-col">
//               <SidebarContent
//                 isCollapsed={false}
//                 pathname={pathname}
//                 navigation={navigation}
//                 openSubmenus={openSubmenus}
//                 toggleSubmenu={toggleSubmenu}
//                 accounts={accounts}
//                 selectedAccount={selectedAccount}
//                 loading={loading}
//                 handleAccountSwitch={handleAccountSwitch}
//               />
//             </div>
//           </SheetContent>
//         </Sheet>
//       </div>

//       <div
//         className={cn(
//           "hidden lg:flex h-full flex-col border-r border-border bg-card transition-all duration-300",
//           isCollapsed ? "w-20" : "w-72",
//         )}
//       >
//         <div className="flex h-14 items-center justify-end px-4">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
//           >
//             {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>

//         <SidebarContent
//           isCollapsed={isCollapsed}
//           pathname={pathname}
//           navigation={navigation}
//           openSubmenus={openSubmenus}
//           toggleSubmenu={toggleSubmenu}
//           accounts={accounts}
//           selectedAccount={selectedAccount}
//           loading={loading}
//           handleAccountSwitch={handleAccountSwitch}
//         />
//       </div>
//     </>
//   )
// }

// // Cookie helper functions
// function getCookie(name: string): string | null {
//   if (typeof document === "undefined") return null
//   const value = `; ${document.cookie}`
//   const parts = value.split(`; ${name}=`)
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null
//   return null
// }

// function setCookie(name: string, value: string, days = 365) {
//   if (typeof document === "undefined") return
//   const expires = new Date()
//   expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
//   document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
// }


// "use client"

// import type React from "react"

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
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   ChevronDown,
//   CheckCircle2,
//   Activity,
//   Loader2,
//   Boxes,
//   Calendar,
//   ShoppingBag,
//   FileText,
//   Menu,
// } from "lucide-react"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import Image from "next/image"

// interface InstagramAccount {
//   id: string
//   username: string
//   profilePicUrl: string | null
//   followerCount: number
// }

// interface NavigationItem {
//   name: string
//   href: string
//   icon: React.ElementType
//   badge?: number | null
//   subItems?: NavigationItem[]
// }

// const navigation: NavigationItem[] = [
//   {
//     name: "Dashboard",
//     href: "/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     name: "Inbox",
//     href: "/inbox",
//     icon: MessageSquare,
//   },
//   {
//     name: "Customers",
//     href: "/customers",
//     icon: MessageSquare,
//   },
//   {
//     name: "Automations",
//     href: "/automations",
//     icon: Zap,
//   },
//   // {
//   //   name: "Content Hub",
//   //   href: "/content",
//   //   icon: ImageIcon,
//   // },
//   // {
//   //   name: "Media Library",
//   //   href: "/media",
//   //   icon: Grid3x3,
//   // },
//   // {
//   //   name: "Integrations",
//   //   href: "/dashboard/integrations",
//   //   icon: Boxes,
//   //   subItems: [
//   //     {
//   //       name: "Calendly",
//   //       href: "/dashboard/integrations/calendly",
//   //       icon: Calendar,
//   //     },
//   //     {
//   //       name: "Shopify",
//   //       href: "/dashboard/integrations/shopify",
//   //       icon: ShoppingBag,
//   //     },
//   //   ],
//   // },
//   {
//     name: "AI-settings",
//     href: "/ai-dashboard",
//     icon: FileText,
//   },
//   {
//     name: "Accounts",
//     href: "/accounts",
//     icon: Instagram,
//   },
//   {
//     name: "Analytics",
//     href: "/analytics",
//     icon: BarChart3,
//   },
//   {
//     name: "Subscription",
//     href: "/subscription",
//     icon: CreditCard,
//   },
//   {
//     name: "Settings",
//     href: "/settings",
//     icon: Settings,
//   },
// ]

// function SidebarContent({
//   isCollapsed,
//   pathname,
//   navigation,
//   openSubmenus,
//   toggleSubmenu,
//   accounts,
//   selectedAccount,
//   loading,
//   handleAccountSwitch,
// }: {
//   isCollapsed: boolean
//   pathname: string | null
//   navigation: NavigationItem[]
//   openSubmenus: Record<string, boolean>
//   toggleSubmenu: (name: string) => void
//   accounts: InstagramAccount[]
//   selectedAccount: InstagramAccount | null
//   loading: boolean
//   handleAccountSwitch: (account: InstagramAccount) => void
// }) {
//   return (
//     <>
//       <div className="flex items-center justify-center border-b border-border p-4">
//         {isCollapsed ? (
//           <div className="relative h-10 w-10 shrink-0">
//             <Image src="/branded-original.png" alt="Logo" fill className="object-contain" />
//           </div>
//         ) : (
//           <div className="relative h-12 w-full max-w-[200px]">
//             <Image src="/branded-original.png" alt="Logo" fill className="object-contain" />
//           </div>
//         )}
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 space-y-1 overflow-y-auto p-3">
//         {navigation.map((item) => {
//           const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
//           const hasSubItems = item.subItems && item.subItems.length > 0
//           const isSubmenuOpen = openSubmenus[item.name]

//           const isSubItemActive = hasSubItems
//             ? item.subItems!.some((subItem) => pathname === subItem.href || pathname?.startsWith(subItem.href + "/"))
//             : false

//           if (hasSubItems && !isCollapsed) {
//             return (
//               <Collapsible key={item.name} open={isSubmenuOpen} onOpenChange={() => toggleSubmenu(item.name)}>
//                 <CollapsibleTrigger asChild>
//                   <button
//                     className={cn(
//                       "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
//                       isSubItemActive
//                         ? "bg-foreground/10 text-foreground shadow-sm"
//                         : "text-muted-foreground hover:bg-accent hover:text-foreground",
//                     )}
//                   >
//                     <item.icon
//                       className={cn(
//                         "h-5 w-5 transition-transform group-hover:scale-110",
//                         isSubItemActive && "text-foreground",
//                       )}
//                     />
//                     <span className="flex-1 text-left">{item.name}</span>
//                     <ChevronDown
//                       className={cn("h-4 w-4 transition-transform duration-200", isSubmenuOpen && "rotate-180")}
//                     />
//                   </button>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent className="mt-1 space-y-1 pl-2">
//                   <div className="relative ml-2 border-l-2 border-border/50 pl-2 space-y-1">
//                     {item.subItems!.map((subItem) => {
//                       const isSubActive = pathname === subItem.href || pathname?.startsWith(subItem.href + "/")
//                       return (
//                         <Link
//                           key={subItem.name}
//                           href={subItem.href}
//                           className={cn(
//                             "group relative flex items-center gap-3 rounded-lg pl-3 pr-3 py-2 text-sm font-medium transition-all duration-200",
//                             isSubActive
//                               ? "bg-gradient-to-r from-foreground/10 to-foreground/5 text-foreground border-l-2 border-foreground shadow-sm"
//                               : "text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:translate-x-1",
//                           )}
//                         >
//                           <subItem.icon
//                             className={cn(
//                               "h-4 w-4 transition-all group-hover:scale-110",
//                               isSubActive && "text-foreground",
//                             )}
//                           />
//                           <span className="flex-1">{subItem.name}</span>
//                           {isSubActive && <div className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" />}
//                         </Link>
//                       )
//                     })}
//                   </div>
//                 </CollapsibleContent>
//               </Collapsible>
//             )
//           }

//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={cn(
//                 "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
//                 isActive
//                   ? "bg-foreground text-background shadow-lg dark:shadow-black/50"
//                   : "text-muted-foreground hover:bg-accent hover:text-foreground",
//               )}
//             >
//               {isActive && !isCollapsed && (
//                 <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-background" />
//               )}
//               <item.icon
//                 className={cn(
//                   "h-5 w-5 transition-transform group-hover:scale-110",
//                   isActive && "text-background",
//                   isCollapsed && "mx-auto",
//                 )}
//               />
//               {!isCollapsed && (
//                 <>
//                   <span className="flex-1">{item.name}</span>
//                   {item.badge && (
//                     <Badge className="h-5 min-w-5 bg-foreground text-background px-1.5 text-xs font-semibold border-0 shadow-md">
//                       {item.badge}
//                     </Badge>
//                   )}
//                 </>
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {!isCollapsed && (
//         <div className="border-t border-border p-4">
//           {loading ? (
//             <div className="flex items-center justify-center py-3">
//               <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
//             </div>
//           ) : accounts.length === 0 ? (
//             <Link href="/api/auth/instagram/connect">
//               <Button
//                 variant="outline"
//                 className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent rounded-xl transition-all hover:shadow-md dark:hover:shadow-black/30 bg-transparent"
//               >
//                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border">
//                   <Plus className="h-4 w-4 text-muted-foreground" />
//                 </div>
//                 <span className="text-sm text-foreground font-medium">Connect Instagram</span>
//               </Button>
//             </Link>
//           ) : (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent rounded-xl transition-all hover:shadow-md dark:hover:shadow-black/30"
//                 >
//                   <Avatar className="h-9 w-9 shrink-0 border-2 border-border shadow-md">
//                     <AvatarImage src={selectedAccount?.profilePicUrl || ""} />
//                     <AvatarFallback className="bg-foreground text-background font-semibold text-xs">
//                       {selectedAccount?.username.substring(0, 2).toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex flex-1 flex-col items-start text-left min-w-0">
//                     <div className="flex items-center gap-1.5 w-full min-w-0">
//                       <span className="text-sm font-semibold text-foreground truncate">
//                         @{selectedAccount?.username}
//                       </span>
//                       <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       <Activity className="h-3 w-3 shrink-0 text-green-600 dark:text-green-400" />
//                       <span className="text-xs text-muted-foreground">Connected</span>
//                     </div>
//                   </div>
//                   <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-64 bg-card border-border shadow-xl dark:shadow-black/50">
//                 {accounts.map((account) => (
//                   <DropdownMenuItem
//                     key={account.id}
//                     onClick={() => handleAccountSwitch(account)}
//                     className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all"
//                   >
//                     <Avatar className="h-8 w-8 shrink-0 shadow-sm">
//                       <AvatarImage src={account.profilePicUrl || ""} />
//                       <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
//                         {account.username.substring(0, 2).toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex flex-1 flex-col min-w-0">
//                       <span className="text-sm font-medium text-foreground truncate">@{account.username}</span>
//                       <span className="text-xs text-muted-foreground">
//                         {account.followerCount.toLocaleString()} followers
//                       </span>
//                     </div>
//                     {account.id === selectedAccount?.id && (
//                       <CheckCircle2 className="h-4 w-4 shrink-0 text-foreground" />
//                     )}
//                   </DropdownMenuItem>
//                 ))}
//                 <DropdownMenuSeparator className="bg-border" />
//                 <DropdownMenuItem asChild>
//                   <Link
//                     href="/api/auth/instagram/connect"
//                     className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all"
//                   >
//                     <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border">
//                       <Plus className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                     <span className="text-sm text-foreground font-medium">Add Account</span>
//                   </Link>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           )}
//         </div>
//       )}

//       {/* Plan Badge */}
//       {!isCollapsed && (
//         <div className="border-t border-border p-4">
//           <div className="rounded-xl bg-accent p-4 border border-border shadow-lg dark:shadow-black/30">
//             <div className="flex items-start gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background shadow-md">
//                 <CheckCircle2 className="h-5 w-5" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="text-sm font-bold text-foreground">Pro Plan</span>
//                 </div>
//                 <p className="text-xs text-muted-foreground mb-3">Unlimited automations</p>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   className="w-full text-xs h-7 font-medium border-border hover:bg-background shadow-sm hover:shadow-md transition-all bg-transparent"
//                 >
//                   View Usage
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Collapsed State Indicators */}
//       {isCollapsed && (
//         <div className="flex flex-col items-center gap-3 border-t border-border p-3">
//           {selectedAccount ? (
//             <Avatar className="h-9 w-9 border-2 border-border shadow-md">
//               <AvatarImage src={selectedAccount.profilePicUrl || ""} />
//               <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
//                 {selectedAccount.username.substring(0, 2).toUpperCase()}
//               </AvatarFallback>
//             </Avatar>
//           ) : (
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-dashed border-border">
//               <Plus className="h-4 w-4 text-muted-foreground" />
//             </div>
//           )}
//           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background shadow-md">
//             <CheckCircle2 className="h-4 w-4" />
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export function Sidebar() {
//   const pathname = usePathname()
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [accounts, setAccounts] = useState<InstagramAccount[]>([])
//   const [selectedAccount, setSelectedAccount] = useState<InstagramAccount | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({})
//   const [mobileOpen, setMobileOpen] = useState(false)

//   // Fetch Instagram accounts on mount
//   useEffect(() => {
//     async function fetchAccounts() {
//       try {
//         const response = await fetch("/api/instagram/accounts")
//         if (response.ok) {
//           const data = await response.json()
//           setAccounts(data.accounts || [])

//           // Set selected account from cookie or default to first account
//           const savedAccountId = getCookie("selectedInstagramAccountId")
//           if (savedAccountId && data.accounts) {
//             const saved = data.accounts.find((acc: InstagramAccount) => acc.id === savedAccountId)
//             setSelectedAccount(saved || data.accounts[0] || null)
//           } else if (data.accounts?.length > 0) {
//             setSelectedAccount(data.accounts[0])
//             setCookie("selectedInstagramAccountId", data.accounts[0].id)
//           }
//         }
//       } catch (error) {
//         console.error("Failed to fetch accounts:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchAccounts()
//   }, [])

//   useEffect(() => {
//     const newOpenSubmenus: Record<string, boolean> = {}
//     navigation.forEach((item) => {
//       if (item.subItems) {
//         const isSubItemActive = item.subItems.some(
//           (subItem) => pathname === subItem.href || pathname?.startsWith(subItem.href + "/"),
//         )
//         if (isSubItemActive) {
//           newOpenSubmenus[item.name] = true
//         }
//       }
//     })
//     setOpenSubmenus(newOpenSubmenus)
//   }, [pathname])

//   // Handle account switch
//   const handleAccountSwitch = async (account: InstagramAccount) => {
//     setSelectedAccount(account)
//     setCookie("selectedInstagramAccountId", account.id)

//     // Trigger a page refresh to reload data for the new account
//     window.location.reload()
//   }

//   const toggleSubmenu = (itemName: string) => {
//     setOpenSubmenus((prev) => ({
//       ...prev,
//       [itemName]: !prev[itemName],
//     }))
//   }

//   return (
//     <>
//       <div className="lg:hidden">
//         <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
//           <SheetTrigger asChild>
//             <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-40 h-10 w-10 lg:hidden">
//               <Menu className="h-5 w-5" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="w-72 p-0 bg-card border-border">
//             <div className="flex h-full flex-col">
//               <SidebarContent
//                 isCollapsed={false}
//                 pathname={pathname}
//                 navigation={navigation}
//                 openSubmenus={openSubmenus}
//                 toggleSubmenu={toggleSubmenu}
//                 accounts={accounts}
//                 selectedAccount={selectedAccount}
//                 loading={loading}
//                 handleAccountSwitch={handleAccountSwitch}
//               />
//             </div>
//           </SheetContent>
//         </Sheet>
//       </div>

//       <div
//         className={cn(
//           "hidden lg:flex h-full flex-col border-r border-border bg-card transition-all duration-300",
//           isCollapsed ? "w-20" : "w-72",
//         )}
//       >
//         <div className="flex h-16 items-center justify-between px-4 border-b border-border">
//           {!isCollapsed && (
//             <div className="relative h-10 w-full max-w-[160px]">
//               <Image src="/branded-original.png" alt="Logo" fill className="object-contain" />
//             </div>
//           )}
//           {isCollapsed && (
//             <div className="relative h-10 w-10 mx-auto">
//               <Image src="/branded-original.png" alt="Logo" fill className="object-contain" />
//             </div>
//           )}
//           {!isCollapsed && (
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setIsCollapsed(!isCollapsed)}
//               className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//           )}
//         </div>

//         {isCollapsed && (
//           <div className="flex justify-center py-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setIsCollapsed(!isCollapsed)}
//               className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
//             >
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//         )}

//         <div className="flex-1 overflow-hidden flex flex-col">
//           {/* Navigation */}
//           <nav className="flex-1 space-y-1 overflow-y-auto p-3">
//             {navigation.map((item) => {
//               const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
//               const hasSubItems = item.subItems && item.subItems.length > 0
//               const isSubmenuOpen = openSubmenus[item.name]

//               const isSubItemActive = hasSubItems
//                 ? item.subItems!.some(
//                     (subItem) => pathname === subItem.href || pathname?.startsWith(subItem.href + "/"),
//                   )
//                 : false

//               if (hasSubItems && !isCollapsed) {
//                 return (
//                   <Collapsible key={item.name} open={isSubmenuOpen} onOpenChange={() => toggleSubmenu(item.name)}>
//                     <CollapsibleTrigger asChild>
//                       <button
//                         className={cn(
//                           "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
//                           isSubItemActive
//                             ? "bg-foreground/10 text-foreground shadow-sm"
//                             : "text-muted-foreground hover:bg-accent hover:text-foreground",
//                         )}
//                       >
//                         <item.icon
//                           className={cn(
//                             "h-5 w-5 transition-transform group-hover:scale-110",
//                             isSubItemActive && "text-foreground",
//                           )}
//                         />
//                         <span className="flex-1 text-left">{item.name}</span>
//                         <ChevronDown
//                           className={cn("h-4 w-4 transition-transform duration-200", isSubmenuOpen && "rotate-180")}
//                         />
//                       </button>
//                     </CollapsibleTrigger>
//                     <CollapsibleContent className="mt-1 space-y-1 pl-2">
//                       <div className="relative ml-2 border-l-2 border-border/50 pl-2 space-y-1">
//                         {item.subItems!.map((subItem) => {
//                           const isSubActive = pathname === subItem.href || pathname?.startsWith(subItem.href + "/")
//                           return (
//                             <Link
//                               key={subItem.name}
//                               href={subItem.href}
//                               className={cn(
//                                 "group relative flex items-center gap-3 rounded-lg pl-3 pr-3 py-2 text-sm font-medium transition-all duration-200",
//                                 isSubActive
//                                   ? "bg-gradient-to-r from-foreground/10 to-foreground/5 text-foreground border-l-2 border-foreground shadow-sm"
//                                   : "text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:translate-x-1",
//                               )}
//                             >
//                               <subItem.icon
//                                 className={cn(
//                                   "h-4 w-4 transition-all group-hover:scale-110",
//                                   isSubActive && "text-foreground",
//                                 )}
//                               />
//                               <span className="flex-1">{subItem.name}</span>
//                               {isSubActive && <div className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" />}
//                             </Link>
//                           )
//                         })}
//                       </div>
//                     </CollapsibleContent>
//                   </Collapsible>
//                 )
//               }

//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={cn(
//                     "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
//                     isActive
//                       ? "bg-foreground text-background shadow-lg dark:shadow-black/50"
//                       : "text-muted-foreground hover:bg-accent hover:text-foreground",
//                   )}
//                 >
//                   {isActive && !isCollapsed && (
//                     <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-background" />
//                   )}
//                   <item.icon
//                     className={cn(
//                       "h-5 w-5 transition-transform group-hover:scale-110",
//                       isActive && "text-background",
//                       isCollapsed && "mx-auto",
//                     )}
//                   />
//                   {!isCollapsed && (
//                     <>
//                       <span className="flex-1">{item.name}</span>
//                       {item.badge && (
//                         <Badge className="h-5 min-w-5 bg-foreground text-background px-1.5 text-xs font-semibold border-0 shadow-md">
//                           {item.badge}
//                         </Badge>
//                       )}
//                     </>
//                   )}
//                 </Link>
//               )
//             })}
//           </nav>

//           {!isCollapsed && (
//             <div className="border-t border-border p-4">
//               {loading ? (
//                 <div className="flex items-center justify-center py-3">
//                   <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
//                 </div>
//               ) : accounts.length === 0 ? (
//                 <Link href="/api/auth/instagram/connect">
//                   <Button
//                     variant="outline"
//                     className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent rounded-xl transition-all hover:shadow-md dark:hover:shadow-black/30 bg-transparent"
//                   >
//                     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border">
//                       <Plus className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                     <span className="text-sm text-foreground font-medium">Connect Instagram</span>
//                   </Button>
//                 </Link>
//               ) : (
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent rounded-xl transition-all hover:shadow-md dark:hover:shadow-black/30"
//                     >
//                       <Avatar className="h-9 w-9 shrink-0 border-2 border-border shadow-md">
//                         <AvatarImage src={selectedAccount?.profilePicUrl || ""} />
//                         <AvatarFallback className="bg-foreground text-background font-semibold text-xs">
//                           {selectedAccount?.username.substring(0, 2).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="flex flex-1 flex-col items-start text-left min-w-0">
//                         <div className="flex items-center gap-1.5 w-full min-w-0">
//                           <span className="text-sm font-semibold text-foreground truncate">
//                             @{selectedAccount?.username}
//                           </span>
//                           <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
//                         </div>
//                         <div className="flex items-center gap-1.5">
//                           <Activity className="h-3 w-3 shrink-0 text-green-600 dark:text-green-400" />
//                           <span className="text-xs text-muted-foreground">Connected</span>
//                         </div>
//                       </div>
//                       <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent
//                     align="end"
//                     className="w-64 bg-card border-border shadow-xl dark:shadow-black/50"
//                   >
//                     {accounts.map((account) => (
//                       <DropdownMenuItem
//                         key={account.id}
//                         onClick={() => handleAccountSwitch(account)}
//                         className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all"
//                       >
//                         <Avatar className="h-8 w-8 shrink-0 shadow-sm">
//                           <AvatarImage src={account.profilePicUrl || ""} />
//                           <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
//                             {account.username.substring(0, 2).toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="flex flex-1 flex-col min-w-0">
//                           <span className="text-sm font-medium text-foreground truncate">@{account.username}</span>
//                           <span className="text-xs text-muted-foreground">
//                             {account.followerCount.toLocaleString()} followers
//                           </span>
//                         </div>
//                         {account.id === selectedAccount?.id && (
//                           <CheckCircle2 className="h-4 w-4 shrink-0 text-foreground" />
//                         )}
//                       </DropdownMenuItem>
//                     ))}
//                     <DropdownMenuSeparator className="bg-border" />
//                     <DropdownMenuItem asChild>
//                       <Link
//                         href="/api/auth/instagram/connect"
//                         className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all"
//                       >
//                         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border">
//                           <Plus className="h-4 w-4 text-muted-foreground" />
//                         </div>
//                         <span className="text-sm text-foreground font-medium">Connect Account</span>
//                       </Link>
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               )}
//             </div>
//           )}

//           {/* Plan Badge */}
//           {!isCollapsed && (
//             <div className="border-t border-border p-4">
//               <div className="rounded-xl bg-accent p-4 border border-border shadow-lg dark:shadow-black/30">
//                 <div className="flex items-start gap-3">
//                   <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background shadow-md">
//                     <CheckCircle2 className="h-5 w-5" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="text-sm font-bold text-foreground">Pro Plan</span>
//                     </div>
//                     <p className="text-xs text-muted-foreground mb-3">Unlimited automations</p>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       className="w-full text-xs h-7 font-medium border-border hover:bg-background shadow-sm hover:shadow-md transition-all bg-transparent"
//                     >
//                       View Usage
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }

// // Cookie helper functions
// function getCookie(name: string): string | null {
//   if (typeof document === "undefined") return null
//   const value = `; ${document.cookie}`
//   const parts = value.split(`; ${name}=`)
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null
//   return null
// }

// function setCookie(name: string, value: string, days = 365) {
//   if (typeof document === "undefined") return
//   const expires = new Date()
//   expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
//   document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
// }


// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import {
//   LayoutDashboard,
//   MessageSquare,
//   Zap,
//   BarChart3,
//   Settings,
//   Instagram,
//   CreditCard,
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   ChevronDown,
//   CheckCircle2,
//   Activity,
//   Loader2,
//   FileText,
//   Menu,
//   Lock,
// } from "lucide-react"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import Image from "next/image"
// import { toast } from "sonner"

// interface InstagramAccount {
//   id: string
//   username: string
//   profilePicUrl: string | null
//   followerCount: number
// }

// interface NavigationItem {
//   name: string
//   href: string
//   icon: React.ElementType
//   badge?: number | null
//   subItems?: NavigationItem[]
// }

// const navigation: NavigationItem[] = [
//   {
//     name: "Dashboard",
//     href: "/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     name: "Inbox",
//     href: "/inbox",
//     icon: MessageSquare,
//   },
//   {
//     name: "Customers",
//     href: "/customers",
//     icon: MessageSquare,
//   },
//   {
//     name: "Automations",
//     href: "/automations",
//     icon: Zap,
//   },
//   {
//     name: "AI-settings",
//     href: "/ai-dashboard",
//     icon: FileText,
//   },
//   {
//     name: "Accounts",
//     href: "/accounts",
//     icon: Instagram,
//   },
//   // {
//   //   name: "Analytics",
//   //   href: "/analytics",
//   //   icon: BarChart3,
//   // },
//   {
//     name: "Billing",
//     href: "/billing",
//     icon: CreditCard,
//   },
//   // {
//   //   name: "Settings",
//   //   href: "/settings",
//   //   icon: Settings,
//   // },
// ]

// // Utility function to proxy Instagram images
// function proxyInstagramImage(url: string | null | undefined): string {
//   if (!url) return ""
//   if (url.includes("cdninstagram.com")) {
//     return `/api/proxy/image?url=${encodeURIComponent(url)}`
//   }
//   return url
// }

// // Cookie utilities
// function getCookie(name: string): string | null {
//   if (typeof document === "undefined") return null
//   const value = `; ${document.cookie}`
//   const parts = value.split(`; ${name}=`)
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null
//   return null
// }

// function setCookie(name: string, value: string) {
//   if (typeof document === "undefined") return
//   const d = new Date()
//   d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days
//   const expires = "expires=" + d.toUTCString()
//   document.cookie = `${name}=${value};${expires};path=/`
// }

// interface SidebarContentProps {
//   isCollapsed: boolean
//   pathname: string | null
//   navigation: NavigationItem[]
//   openSubmenus: Record<string, boolean>
//   toggleSubmenu: (name: string) => void
//   accounts: InstagramAccount[]
//   selectedAccount: InstagramAccount | null
//   loading: boolean
//   handleAccountSwitch: (account: InstagramAccount) => void
//   currentTier: string
//   onNavigate?: () => void
// }

// function SidebarContent({
//   isCollapsed,
//   pathname,
//   navigation,
//   openSubmenus,
//   toggleSubmenu,
//   accounts,
//   selectedAccount,
//   loading,
//   handleAccountSwitch,
//   currentTier,
//   onNavigate,
// }: SidebarContentProps) {
//   return (
//     <>
//       {/* Navigation */}
//       <nav className="flex-1 space-y-1 overflow-y-auto p-3">
//         {navigation.map((item) => {
//           const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
//           const hasSubItems = item.subItems && item.subItems.length > 0

//           const isSubItemActive = hasSubItems
//             ? item.subItems!.some((subItem) => pathname === subItem.href || pathname?.startsWith(subItem.href + "/"))
//             : false

//           if (hasSubItems && !isCollapsed) {
//             return (
//               <Collapsible key={item.name} open={openSubmenus[item.name]} onOpenChange={() => toggleSubmenu(item.name)}>
//                 <CollapsibleTrigger asChild>
//                   <button
//                     className={cn(
//                       "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
//                       isSubItemActive
//                         ? "bg-foreground/10 text-foreground shadow-sm"
//                         : "text-muted-foreground hover:bg-accent hover:text-foreground",
//                     )}
//                   >
//                     <item.icon
//                       className={cn(
//                         "h-5 w-5 transition-transform group-hover:scale-110",
//                         isSubItemActive && "text-foreground",
//                       )}
//                     />
//                     <span className="flex-1 text-left">{item.name}</span>
//                     <ChevronDown
//                       className={cn(
//                         "h-4 w-4 transition-transform duration-200",
//                         openSubmenus[item.name] && "rotate-180",
//                       )}
//                     />
//                   </button>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent className="mt-1 space-y-1 pl-2">
//                   <div className="relative ml-2 border-l-2 border-border/50 pl-2 space-y-1">
//                     {item.subItems!.map((subItem) => {
//                       const isSubActive = pathname === subItem.href || pathname?.startsWith(subItem.href + "/")
//                       return (
//                         <Link
//                           key={subItem.name}
//                           href={subItem.href}
//                           onClick={onNavigate}
//                           className={cn(
//                             "group relative flex items-center gap-3 rounded-lg pl-3 pr-3 py-2 text-sm font-medium transition-all duration-200",
//                             isSubActive
//                               ? "bg-gradient-to-r from-foreground/10 to-foreground/5 text-foreground border-l-2 border-foreground shadow-sm"
//                               : "text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:translate-x-1",
//                           )}
//                         >
//                           <subItem.icon
//                             className={cn(
//                               "h-4 w-4 transition-all group-hover:scale-110",
//                               isSubActive && "text-foreground",
//                             )}
//                           />
//                           <span className="flex-1">{subItem.name}</span>
//                           {isSubActive && <div className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" />}
//                         </Link>
//                       )
//                     })}
//                   </div>
//                 </CollapsibleContent>
//               </Collapsible>
//             )
//           }

//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               onClick={onNavigate}
//               className={cn(
//                 "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
//                 isActive
//                   ? "bg-foreground text-background shadow-lg dark:shadow-black/50"
//                   : "text-muted-foreground hover:bg-accent hover:text-foreground",
//               )}
//             >
//               {isActive && !isCollapsed && (
//                 <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-background" />
//               )}
//               <item.icon
//                 className={cn(
//                   "h-5 w-5 transition-transform group-hover:scale-110",
//                   isActive && "text-background",
//                   isCollapsed && "mx-auto",
//                 )}
//               />
//               {!isCollapsed && (
//                 <>
//                   <span className="flex-1">{item.name}</span>
//                   {item.badge && (
//                     <Badge className="h-5 min-w-5 bg-foreground text-background px-1.5 text-xs font-semibold border-0 shadow-md">
//                       {item.badge}
//                     </Badge>
//                   )}
//                 </>
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {/* Account Selector */}
//       {!isCollapsed && (
//         <div className="border-t border-border p-4">
//           {loading ? (
//             <div className="flex items-center justify-center py-3">
//               <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
//             </div>
//           ) : accounts.length === 0 ? (
//             <a href="/api/auth/instagram/connect">
//               <Button
//                 variant="outline"
//                 className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent rounded-xl transition-all hover:shadow-md dark:hover:shadow-black/30 bg-transparent"
//               >
//                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border">
//                   <Plus className="h-4 w-4 text-muted-foreground" />
//                 </div>
//                 <span className="text-sm text-foreground font-medium">Connect Instagram</span>
//               </Button>
//             </a>
//           ) : (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent rounded-xl transition-all hover:shadow-md dark:hover:shadow-black/30"
//                 >
//                   <Avatar className="h-9 w-9 shrink-0 border-2 border-border shadow-md">
//                     <AvatarImage src={proxyInstagramImage(selectedAccount?.profilePicUrl)} />
//                     <AvatarFallback className="bg-foreground text-background font-semibold text-xs">
//                       {selectedAccount?.username.substring(0, 2).toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex flex-1 flex-col items-start text-left min-w-0">
//                     <div className="flex items-center gap-1.5 w-full min-w-0">
//                       <span className="text-sm font-semibold text-foreground truncate">
//                         @{selectedAccount?.username}
//                       </span>
//                       <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       <Activity className="h-3 w-3 shrink-0 text-green-600 dark:text-green-400" />
//                       <span className="text-xs text-muted-foreground">Connected</span>
//                     </div>
//                   </div>
//                   <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-64 bg-card border-border shadow-xl dark:shadow-black/50">
//                 {accounts.map((account) => (
//                   <DropdownMenuItem
//                     key={account.id}
//                     onClick={() => handleAccountSwitch(account)}
//                     className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all"
//                   >
//                     <Avatar className="h-8 w-8 shrink-0 shadow-sm">
//                       <AvatarImage src={proxyInstagramImage(account.profilePicUrl)} />
//                       <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
//                         {account.username.substring(0, 2).toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex flex-1 flex-col min-w-0">
//                       <span className="text-sm font-medium text-foreground truncate">@{account.username}</span>
//                       <span className="text-xs text-muted-foreground">
//                         {account.followerCount.toLocaleString()} followers
//                       </span>
//                     </div>
//                     {account.id === selectedAccount?.id && (
//                       <CheckCircle2 className="h-4 w-4 shrink-0 text-foreground" />
//                     )}
//                   </DropdownMenuItem>
//                 ))}
//                 <DropdownMenuSeparator className="bg-border" />
//                 <DropdownMenuItem asChild>
//                   <a
//                     href={currentTier === "free" ? "/billing" : "/api/auth/instagram/connect"}
//                     className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all"
//                     onClick={(e) => {
//                       if (currentTier === "free") {
//                         e.preventDefault()
//                         toast.error("Upgrade to Pro to add a second account")
//                         onNavigate?.()
//                       }
//                     }}
//                   >
//                     {currentTier === "free" ? (
//                       <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border">
//                         <Lock className="h-4 w-4 text-destructive" />
//                       </div>
//                     ) : (
//                       <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border">
//                         <Plus className="h-4 w-4 text-muted-foreground" />
//                       </div>
//                     )}
//                     <span className="text-sm text-foreground font-medium">
//                       {currentTier === "free" ? "Upgrade for Multiple Accounts" : "Add Account"}
//                     </span>
//                   </a>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           )}
//         </div>
//       )}

//       {/* Plan Badge */}
//       {!isCollapsed && (
//         <div className="border-t border-border p-4">
//           <div className="rounded-xl bg-accent p-4 border border-border shadow-lg dark:shadow-black/30">
//             <div className="flex items-start gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background shadow-md">
//                 <CheckCircle2 className="h-5 w-5" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="text-sm font-bold text-foreground capitalize">{currentTier} Plan</span>
//                 </div>
//                 <p className="text-xs text-muted-foreground mb-3">
//                   {currentTier === "free" && "Basic automation features"}
//                   {currentTier === "pro" && "Unlimited automations"}
//                   {currentTier === "enterprise" && "Everything included"}
//                 </p>
//                 <Link href="/billing" onClick={onNavigate}>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     className="w-full text-xs h-7 font-medium border-border hover:bg-background shadow-sm hover:shadow-md transition-all bg-transparent"
//                   >
//                     {currentTier === "free" ? "Upgrade Plan" : "Manage Plan"}
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Collapsed State Indicators */}
//       {isCollapsed && (
//         <div className="flex flex-col items-center gap-3 border-t border-border p-3">
//           {selectedAccount ? (
//             <Avatar className="h-9 w-9 border-2 border-border shadow-md">
//               <AvatarImage src={proxyInstagramImage(selectedAccount.profilePicUrl)} />
//               <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
//                 {selectedAccount.username.substring(0, 2).toUpperCase()}
//               </AvatarFallback>
//             </Avatar>
//           ) : (
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-dashed border-border">
//               <Plus className="h-4 w-4 text-muted-foreground" />
//             </div>
//           )}
//           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background shadow-md">
//             <CheckCircle2 className="h-4 w-4" />
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export function Sidebar() {
//   const pathname = usePathname()
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [accounts, setAccounts] = useState<InstagramAccount[]>([])
//   const [selectedAccount, setSelectedAccount] = useState<InstagramAccount | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({})
//   const [mobileOpen, setMobileOpen] = useState(false)
//   const [currentTier, setCurrentTier] = useState("free")

//   // Fetch Instagram accounts and subscription tier on mount
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const [accountsRes, tierRes] = await Promise.all([
//           fetch("/api/instagram/accounts"),
//           fetch("/api/subscriptions/current"),
//         ])

//         if (accountsRes.ok) {
//           const data = await accountsRes.json()
//           setAccounts(data.accounts || [])

//           // Set selected account from cookie or default to first account
//           const savedAccountId = getCookie("selectedInstagramAccountId")
//           if (savedAccountId && data.accounts) {
//             const saved = data.accounts.find((acc: InstagramAccount) => acc.id === savedAccountId)
//             setSelectedAccount(saved || data.accounts[0] || null)
//           } else if (data.accounts?.length > 0) {
//             setSelectedAccount(data.accounts[0])
//             setCookie("selectedInstagramAccountId", data.accounts[0].id)
//           }
//         }

//         if (tierRes.ok) {
//           const tierData = await tierRes.json()
//           setCurrentTier(tierData.tier || "free")
//         }
//       } catch (error) {
//         console.error("Failed to fetch data:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   useEffect(() => {
//     const newOpenSubmenus: Record<string, boolean> = {}
//     navigation.forEach((item) => {
//       if (item.subItems) {
//         const isSubItemActive = item.subItems.some(
//           (subItem) => pathname === subItem.href || pathname?.startsWith(subItem.href + "/"),
//         )
//         if (isSubItemActive) {
//           newOpenSubmenus[item.name] = true
//         }
//       }
//     })
//     setOpenSubmenus(newOpenSubmenus)
//   }, [pathname])

//   // Handle account switch
//   const handleAccountSwitch = async (account: InstagramAccount) => {
//     setSelectedAccount(account)
//     setCookie("selectedInstagramAccountId", account.id)
//     window.location.reload()
//   }

//   const toggleSubmenu = (itemName: string) => {
//     setOpenSubmenus((prev) => ({
//       ...prev,
//       [itemName]: !prev[itemName],
//     }))
//   }

//   return (
//     <>
//       {/* Mobile Menu */}
//       <div className="lg:hidden">
//         <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
//           <SheetTrigger asChild>
//             <Button
//               variant="outline"
//               size="icon"
//               className="fixed top-4 left-4 z-50 h-10 w-10 bg-card border-border shadow-lg hover:bg-accent"
//             >
//               <Menu className="h-5 w-5" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="w-72 p-0 bg-card border-border">
//             <div className="flex h-full flex-col">
//               {/* Mobile Header */}
//               <div className="flex h-16 items-center justify-between px-4 border-b border-border">
//                 <div className="flex items-center gap-3">
//                   <div className="relative h-10 w-10 shrink-0">
//                     <Image src="/branded-original.png" alt="Logo" fill className="object-contain" />
//                   </div>
//                   <span className="text-lg font-bold text-foreground">Yazzil</span>
//                 </div>
//               </div>

//               <SidebarContent
//                 isCollapsed={false}
//                 pathname={pathname}
//                 navigation={navigation}
//                 openSubmenus={openSubmenus}
//                 toggleSubmenu={toggleSubmenu}
//                 accounts={accounts}
//                 selectedAccount={selectedAccount}
//                 loading={loading}
//                 handleAccountSwitch={handleAccountSwitch}
//                 currentTier={currentTier}
//                 onNavigate={() => setMobileOpen(false)}
//               />
//             </div>
//           </SheetContent>
//         </Sheet>
//       </div>

//       {/* Desktop Sidebar */}
//       <div
//         className={cn(
//           "hidden lg:flex h-full flex-col border-r border-border bg-card transition-all duration-300",
//           isCollapsed ? "w-20" : "w-72",
//         )}
//       >
//         {/* Desktop Header */}
//         <div className="flex h-16 items-center justify-between px-4 border-b border-border">
//           {!isCollapsed && (
//             <div className="flex items-center gap-3 flex-1">
//               <div className="relative h-10 w-10 shrink-0">
//                 <Image src="/branded-original.png" alt="Logo" fill className="object-contain" />
//               </div>
//               <span className="text-lg font-bold text-foreground">Yazzil</span>
//             </div>
//           )}
//           {isCollapsed && (
//             <div className="relative h-10 w-10 mx-auto">
//               <Image src="/branded-original.png" alt="Logo" fill className="object-contain" />
//             </div>
//           )}
//           {!isCollapsed && (
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setIsCollapsed(!isCollapsed)}
//               className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//           )}
//         </div>

//         {isCollapsed && (
//           <div className="flex justify-center py-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setIsCollapsed(!isCollapsed)}
//               className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
//             >
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//         )}

//         <div className="flex h-full flex-col">
//           <SidebarContent
//             isCollapsed={isCollapsed}
//             pathname={pathname}
//             navigation={navigation}
//             openSubmenus={openSubmenus}
//             toggleSubmenu={toggleSubmenu}
//             accounts={accounts}
//             selectedAccount={selectedAccount}
//             loading={loading}
//             handleAccountSwitch={handleAccountSwitch}
//             currentTier={currentTier}
//             onNavigate={() => {}}
//           />
//         </div>
//       </div>
//     </>
//   )
// }



// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import {
//   LayoutDashboard,
//   MessageSquare,
//   Zap,
//   BarChart3,
//   Settings,
//   Instagram,
//   CreditCard,
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   ChevronDown,
//   CheckCircle2,
//   Activity,
//   Loader2,
//   FileText,
//   Menu,
//   Lock,
// } from "lucide-react"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import Image from "next/image"
// import { toast } from "sonner"

// interface InstagramAccount {
//   id: string
//   username: string
//   profilePicUrl: string | null
//   followerCount: number
// }

// interface NavigationItem {
//   name: string
//   href: string
//   icon: React.ElementType
//   badge?: number | null
//   subItems?: NavigationItem[]
// }

// // Extract slug from pathname helper
// function getSlugFromPathname(pathname: string): string | null {
//   const match = pathname.match(/^\/dashboard\/([^\/]+)/)
//   return match ? match[1] : null
// }

// // Utility function to proxy Instagram images
// function proxyInstagramImage(url: string | null | undefined): string {
//   if (!url) return ""
//   if (url.includes("cdninstagram.com")) {
//     return `/api/proxy/image?url=${encodeURIComponent(url)}`
//   }
//   return url
// }

// // Cookie utilities
// function getCookie(name: string): string | null {
//   if (typeof document === "undefined") return null
//   const value = `; ${document.cookie}`
//   const parts = value.split(`; ${name}=`)
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null
//   return null
// }

// function setCookie(name: string, value: string) {
//   if (typeof document === "undefined") return
//   const d = new Date()
//   d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000)
//   const expires = "expires=" + d.toUTCString()
//   document.cookie = `${name}=${value};${expires};path=/`
// }

// interface SidebarContentProps {
//   isCollapsed: boolean
//   pathname: string | null
//   navigation: NavigationItem[]
//   openSubmenus: Record<string, boolean>
//   toggleSubmenu: (name: string) => void
//   accounts: InstagramAccount[]
//   selectedAccount: InstagramAccount | null
//   loading: boolean
//   handleAccountSwitch: (account: InstagramAccount) => void
//   currentTier: string
//   onNavigate?: () => void
//   userSlug: string | null
// }

// function SidebarContent({
//   isCollapsed,
//   pathname,
//   navigation,
//   openSubmenus,
//   toggleSubmenu,
//   accounts,
//   selectedAccount,
//   loading,
//   handleAccountSwitch,
//   currentTier,
//   onNavigate,
//   userSlug,
// }: SidebarContentProps) {
//   // Build href with user slug
//   const buildHref = (href: string) => {
//     if (!userSlug) return href
//     // If href is /dashboard, keep it as is
//     if (href === "/dashboard") return `/dashboard/${userSlug}`
//     // Otherwise, prefix with /dashboard/slug
//     return `/dashboard/${userSlug}${href}`
//   }

//   return (
//     <>
//       {/* Navigation */}
//       <nav className="flex-1 space-y-1 overflow-y-auto p-3">
//         {navigation.map((item) => {
//           const itemHref = buildHref(item.href)
//           const isActive = pathname === itemHref || pathname?.startsWith(itemHref + "/")
//           const hasSubItems = item.subItems && item.subItems.length > 0

//           const isSubItemActive = hasSubItems
//             ? item.subItems!.some((subItem) => {
//                 const subHref = buildHref(subItem.href)
//                 return pathname === subHref || pathname?.startsWith(subHref + "/")
//               })
//             : false

//           if (hasSubItems && !isCollapsed) {
//             return (
//               <Collapsible key={item.name} open={openSubmenus[item.name]} onOpenChange={() => toggleSubmenu(item.name)}>
//                 <CollapsibleTrigger asChild>
//                   <button
//                     className={cn(
//                       "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
//                       isSubItemActive
//                         ? "bg-foreground/10 text-foreground shadow-sm"
//                         : "text-muted-foreground hover:bg-accent hover:text-foreground",
//                     )}
//                   >
//                     <item.icon
//                       className={cn(
//                         "h-5 w-5 transition-transform group-hover:scale-110",
//                         isSubItemActive && "text-foreground",
//                       )}
//                     />
//                     <span className="flex-1 text-left">{item.name}</span>
//                     <ChevronDown
//                       className={cn(
//                         "h-4 w-4 transition-transform duration-200",
//                         openSubmenus[item.name] && "rotate-180",
//                       )}
//                     />
//                   </button>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent className="mt-1 space-y-1 pl-2">
//                   <div className="relative ml-2 border-l-2 border-border/50 pl-2 space-y-1">
//                     {item.subItems!.map((subItem) => {
//                       const subHref = buildHref(subItem.href)
//                       const isSubActive = pathname === subHref || pathname?.startsWith(subHref + "/")
//                       return (
//                         <Link
//                           key={subItem.name}
//                           href={subHref}
//                           onClick={onNavigate}
//                           className={cn(
//                             "group relative flex items-center gap-3 rounded-lg pl-3 pr-3 py-2 text-sm font-medium transition-all duration-200",
//                             isSubActive
//                               ? "bg-gradient-to-r from-foreground/10 to-foreground/5 text-foreground border-l-2 border-foreground shadow-sm"
//                               : "text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:translate-x-1",
//                           )}
//                         >
//                           <subItem.icon
//                             className={cn(
//                               "h-4 w-4 transition-all group-hover:scale-110",
//                               isSubActive && "text-foreground",
//                             )}
//                           />
//                           <span className="flex-1">{subItem.name}</span>
//                           {isSubActive && <div className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" />}
//                         </Link>
//                       )
//                     })}
//                   </div>
//                 </CollapsibleContent>
//               </Collapsible>
//             )
//           }

//           return (
//             <Link
//               key={item.name}
//               href={itemHref}
//               onClick={onNavigate}
//               className={cn(
//                 "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
//                 isActive
//                   ? "bg-foreground text-background shadow-lg dark:shadow-black/50"
//                   : "text-muted-foreground hover:bg-accent hover:text-foreground",
//               )}
//             >
//               {isActive && !isCollapsed && (
//                 <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-background" />
//               )}
//               <item.icon
//                 className={cn(
//                   "h-5 w-5 transition-transform group-hover:scale-110",
//                   isActive && "text-background",
//                   isCollapsed && "mx-auto",
//                 )}
//               />
//               {!isCollapsed && (
//                 <>
//                   <span className="flex-1">{item.name}</span>
//                   {item.badge && (
//                     <Badge className="h-5 min-w-5 bg-foreground text-background px-1.5 text-xs font-semibold border-0 shadow-md">
//                       {item.badge}
//                     </Badge>
//                   )}
//                 </>
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {/* Account Selector */}
//       {!isCollapsed && (
//         <div className="border-t border-border p-4">
//           {loading ? (
//             <div className="flex items-center justify-center py-3">
//               <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
//             </div>
//           ) : accounts.length === 0 ? (
//             <a href="/api/auth/instagram/connect">
//               <Button
//                 variant="outline"
//                 className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent rounded-xl transition-all hover:shadow-md dark:hover:shadow-black/30 bg-transparent"
//               >
//                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border">
//                   <Plus className="h-4 w-4 text-muted-foreground" />
//                 </div>
//                 <span className="text-sm text-foreground font-medium">Connect Instagram</span>
//               </Button>
//             </a>
//           ) : (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent rounded-xl transition-all hover:shadow-md dark:hover:shadow-black/30"
//                 >
//                   <Avatar className="h-9 w-9 shrink-0 border-2 border-border shadow-md">
//                     <AvatarImage src={proxyInstagramImage(selectedAccount?.profilePicUrl)} />
//                     <AvatarFallback className="bg-foreground text-background font-semibold text-xs">
//                       {selectedAccount?.username.substring(0, 2).toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex flex-1 flex-col items-start text-left min-w-0">
//                     <div className="flex items-center gap-1.5 w-full min-w-0">
//                       <span className="text-sm font-semibold text-foreground truncate">
//                         @{selectedAccount?.username}
//                       </span>
//                       <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       <Activity className="h-3 w-3 shrink-0 text-green-600 dark:text-green-400" />
//                       <span className="text-xs text-muted-foreground">Connected</span>
//                     </div>
//                   </div>
//                   <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-64 bg-card border-border shadow-xl dark:shadow-black/50">
//                 {accounts.map((account) => (
//                   <DropdownMenuItem
//                     key={account.id}
//                     onClick={() => handleAccountSwitch(account)}
//                     className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all"
//                   >
//                     <Avatar className="h-8 w-8 shrink-0 shadow-sm">
//                       <AvatarImage src={proxyInstagramImage(account.profilePicUrl)} />
//                       <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
//                         {account.username.substring(0, 2).toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex flex-1 flex-col min-w-0">
//                       <span className="text-sm font-medium text-foreground truncate">@{account.username}</span>
//                       <span className="text-xs text-muted-foreground">
//                         {account.followerCount.toLocaleString()} followers
//                       </span>
//                     </div>
//                     {account.id === selectedAccount?.id && (
//                       <CheckCircle2 className="h-4 w-4 shrink-0 text-foreground" />
//                     )}
//                   </DropdownMenuItem>
//                 ))}
//                 <DropdownMenuSeparator className="bg-border" />
//                 <DropdownMenuItem asChild>
//                   <a
//                     href={currentTier === "free" ? buildHref("/billing") : "/api/auth/instagram/connect"}
//                     className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all"
//                     onClick={(e) => {
//                       if (currentTier === "free") {
//                         e.preventDefault()
//                         toast.error("Upgrade to Pro to add a second account")
//                         onNavigate?.()
//                       }
//                     }}
//                   >
//                     {currentTier === "free" ? (
//                       <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border">
//                         <Lock className="h-4 w-4 text-destructive" />
//                       </div>
//                     ) : (
//                       <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border">
//                         <Plus className="h-4 w-4 text-muted-foreground" />
//                       </div>
//                     )}
//                     <span className="text-sm text-foreground font-medium">
//                       {currentTier === "free" ? "Upgrade for Multiple Accounts" : "Add Account"}
//                     </span>
//                   </a>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           )}
//         </div>
//       )}

//       {/* Plan Badge */}
//       {!isCollapsed && (
//         <div className="border-t border-border p-4">
//           <div className="rounded-xl bg-accent p-4 border border-border shadow-lg dark:shadow-black/30">
//             <div className="flex items-start gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background shadow-md">
//                 <CheckCircle2 className="h-5 w-5" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="text-sm font-bold text-foreground capitalize">{currentTier} Plan</span>
//                 </div>
//                 <p className="text-xs text-muted-foreground mb-3">
//                   {currentTier === "free" && "Basic automation features"}
//                   {currentTier === "pro" && "Unlimited automations"}
//                   {currentTier === "enterprise" && "Everything included"}
//                 </p>
//                 <Link href={buildHref("/billing")} onClick={onNavigate}>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     className="w-full text-xs h-7 font-medium border-border hover:bg-background shadow-sm hover:shadow-md transition-all bg-transparent"
//                   >
//                     {currentTier === "free" ? "Upgrade Plan" : "Manage Plan"}
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Collapsed State Indicators */}
//       {isCollapsed && (
//         <div className="flex flex-col items-center gap-3 border-t border-border p-3">
//           {selectedAccount ? (
//             <Avatar className="h-9 w-9 border-2 border-border shadow-md">
//               <AvatarImage src={proxyInstagramImage(selectedAccount.profilePicUrl)} />
//               <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
//                 {selectedAccount.username.substring(0, 2).toUpperCase()}
//               </AvatarFallback>
//             </Avatar>
//           ) : (
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-dashed border-border">
//               <Plus className="h-4 w-4 text-muted-foreground" />
//             </div>
//           )}
//           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background shadow-md">
//             <CheckCircle2 className="h-4 w-4" />
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export function Sidebar() {
//   const pathname = usePathname()
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [accounts, setAccounts] = useState<InstagramAccount[]>([])
//   const [selectedAccount, setSelectedAccount] = useState<InstagramAccount | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({})
//   const [mobileOpen, setMobileOpen] = useState(false)
//   const [currentTier, setCurrentTier] = useState("free")

//   // Extract user slug from pathname
//   const userSlug = pathname ? getSlugFromPathname(pathname) : null

//   // Navigation items - these are now relative paths
//   const navigation: NavigationItem[] = [
//     {
//       name: "Dashboard",
//       href: "/dashboard",
//       icon: LayoutDashboard,
//     },
//     {
//       name: "Inbox",
//       href: "/inbox",
//       icon: MessageSquare,
//     },
//     {
//       name: "Customers",
//       href: "/customers",
//       icon: MessageSquare,
//     },
//     {
//       name: "Automations",
//       href: "/automations",
//       icon: Zap,
//     },
//     {
//       name: "AI-settings",
//       href: "/ai-dashboard",
//       icon: FileText,
//     },
//     {
//       name: "Accounts",
//       href: "/accounts",
//       icon: Instagram,
//     },
//     {
//       name: "Billing",
//       href: "/billing",
//       icon: CreditCard,
//     },
//   ]

//   // Fetch Instagram accounts and subscription tier on mount
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const [accountsRes, tierRes] = await Promise.all([
//           fetch("/api/instagram/accounts"),
//           fetch("/api/subscriptions/current"),
//         ])

//         if (accountsRes.ok) {
//           const data = await accountsRes.json()
//           setAccounts(data.accounts || [])

//           const savedAccountId = getCookie("selectedInstagramAccountId")
//           if (savedAccountId && data.accounts) {
//             const saved = data.accounts.find((acc: InstagramAccount) => acc.id === savedAccountId)
//             setSelectedAccount(saved || data.accounts[0] || null)
//           } else if (data.accounts?.length > 0) {
//             setSelectedAccount(data.accounts[0])
//             setCookie("selectedInstagramAccountId", data.accounts[0].id)
//           }
//         }

//         if (tierRes.ok) {
//           const tierData = await tierRes.json()
//           setCurrentTier(tierData.tier || "free")
//         }
//       } catch (error) {
//         console.error("Failed to fetch data:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   useEffect(() => {
//     const newOpenSubmenus: Record<string, boolean> = {}
//     navigation.forEach((item) => {
//       if (item.subItems) {
//         const isSubItemActive = item.subItems.some(
//           (subItem) => pathname === subItem.href || pathname?.startsWith(subItem.href + "/"),
//         )
//         if (isSubItemActive) {
//           newOpenSubmenus[item.name] = true
//         }
//       }
//     })
//     setOpenSubmenus(newOpenSubmenus)
//   }, [pathname])

//   const handleAccountSwitch = async (account: InstagramAccount) => {
//     setSelectedAccount(account)
//     setCookie("selectedInstagramAccountId", account.id)
//     window.location.reload()
//   }

//   const toggleSubmenu = (itemName: string) => {
//     setOpenSubmenus((prev) => ({
//       ...prev,
//       [itemName]: !prev[itemName],
//     }))
//   }

//   return (
//     <>
//       {/* Mobile Menu */}
//       <div className="lg:hidden">
//         <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
//           <SheetTrigger asChild>
//             <Button
//               variant="outline"
//               size="icon"
//               className="fixed top-4 left-4 z-50 h-10 w-10 bg-card border-border shadow-lg hover:bg-accent"
//             >
//               <Menu className="h-5 w-5" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="w-72 p-0 bg-card border-border">
//             <div className="flex h-full flex-col">
//               <div className="flex h-16 items-center justify-between px-4 border-b border-border">
//                 <div className="flex items-center gap-3">
//                   <div className="relative h-10 w-10 shrink-0">
//                     <Image src="/branded-original.png" alt="Logo" fill className="object-contain" />
//                   </div>
//                   <span className="text-lg font-bold text-foreground">Yazzil</span>
//                 </div>
//               </div>

//               <SidebarContent
//                 isCollapsed={false}
//                 pathname={pathname}
//                 navigation={navigation}
//                 openSubmenus={openSubmenus}
//                 toggleSubmenu={toggleSubmenu}
//                 accounts={accounts}
//                 selectedAccount={selectedAccount}
//                 loading={loading}
//                 handleAccountSwitch={handleAccountSwitch}
//                 currentTier={currentTier}
//                 onNavigate={() => setMobileOpen(false)}
//                 userSlug={userSlug}
//               />
//             </div>
//           </SheetContent>
//         </Sheet>
//       </div>

//       {/* Desktop Sidebar */}
//       <div
//         className={cn(
//           "hidden lg:flex h-full flex-col border-r border-border bg-card transition-all duration-300",
//           isCollapsed ? "w-20" : "w-72",
//         )}
//       >
//         <div className="flex h-16 items-center justify-between px-4 border-b border-border">
//           {!isCollapsed && (
//             <div className="flex items-center gap-3 flex-1">
//               <div className="relative h-10 w-10 shrink-0">
//                 <Image src="/branded-original.png" alt="Logo" fill className="object-contain" />
//               </div>
//               <span className="text-lg font-bold text-foreground">Yazzil</span>
//             </div>
//           )}
//           {isCollapsed && (
//             <div className="relative h-10 w-10 mx-auto">
//               <Image src="/branded-original.png" alt="Logo" fill className="object-contain" />
//             </div>
//           )}
//           {!isCollapsed && (
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setIsCollapsed(!isCollapsed)}
//               className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//           )}
//         </div>

//         {isCollapsed && (
//           <div className="flex justify-center py-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setIsCollapsed(!isCollapsed)}
//               className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
//             >
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//         )}

//         <div className="flex h-full flex-col">
//           <SidebarContent
//             isCollapsed={isCollapsed}
//             pathname={pathname}
//             navigation={navigation}
//             openSubmenus={openSubmenus}
//             toggleSubmenu={toggleSubmenu}
//             accounts={accounts}
//             selectedAccount={selectedAccount}
//             loading={loading}
//             handleAccountSwitch={handleAccountSwitch}
//             currentTier={currentTier}
//             onNavigate={() => {}}
//             userSlug={userSlug}
//           />
//         </div>
//       </div>
//     </>
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
  BarChart3,
  Settings,
  Instagram,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Plus,
  ChevronDown,
  CheckCircle2,
  Activity,
  Loader2,
  FileText,
  Menu,
  Lock,
  LogOut,
} from "lucide-react"
import { useState, useEffect } from "react"
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Image from "next/image"
import { toast } from "sonner"

interface InstagramAccount {
  id: string
  username: string
  profilePicUrl: string | null
  followerCount: number
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ElementType
  badge?: number | null
  subItems?: NavigationItem[]
}

// Extract slug from pathname helper
function getSlugFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/dashboard\/([^\/]+)/)
  return match ? match[1] : null
}

// Utility function to proxy Instagram images
function proxyInstagramImage(url: string | null | undefined): string {
  if (!url) return ""
  if (url.includes("cdninstagram.com")) {
    return `/api/proxy/image?url=${encodeURIComponent(url)}`
  }
  return url
}

// Cookie utilities
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return
  const d = new Date()
  d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000)
  const expires = "expires=" + d.toUTCString()
  document.cookie = `${name}=${value};${expires};path=/`
}

interface SidebarContentProps {
  isCollapsed: boolean
  pathname: string | null
  navigation: NavigationItem[]
  openSubmenus: Record<string, boolean>
  toggleSubmenu: (name: string) => void
  accounts: InstagramAccount[]
  selectedAccount: InstagramAccount | null
  loading: boolean
  handleAccountSwitch: (account: InstagramAccount) => void
  currentTier: string
  onNavigate?: () => void
  userSlug: string | null
  handleDisconnect: (account: InstagramAccount) => void
  setAccountToDisconnect: (account: InstagramAccount) => void
  setDisconnectDialogOpen: (open: boolean) => void
}

function SidebarContent({
  isCollapsed,
  pathname,
  navigation,
  openSubmenus,
  toggleSubmenu,
  accounts,
  selectedAccount,
  loading,
  handleAccountSwitch,
  currentTier,
  onNavigate,
  userSlug,
  handleDisconnect,
  setAccountToDisconnect,
  setDisconnectDialogOpen,
}: SidebarContentProps) {
  // Build href with user slug
  const buildHref = (href: string) => {
    if (!userSlug) return href
    // If href is /dashboard, keep it as is
    if (href === "/dashboard") return `/dashboard/${userSlug}`
    // Otherwise, prefix with /dashboard/slug
    return `/dashboard/${userSlug}${href}`
  }

  return (
    <>
      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navigation.map((item) => {
          const itemHref = buildHref(item.href)
          const isActive = pathname === itemHref || pathname?.startsWith(itemHref + "/")
          const hasSubItems = item.subItems && item.subItems.length > 0

          const isSubItemActive = hasSubItems
            ? item.subItems!.some((subItem) => {
                const subHref = buildHref(subItem.href)
                return pathname === subHref || pathname?.startsWith(subHref + "/")
              })
            : false

          if (hasSubItems && !isCollapsed) {
            return (
              <Collapsible key={item.name} open={openSubmenus[item.name]} onOpenChange={() => toggleSubmenu(item.name)}>
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isSubItemActive
                        ? "bg-foreground/10 text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-transform group-hover:scale-110",
                        isSubItemActive && "text-foreground",
                      )}
                    />
                    <span className="flex-1 text-left">{item.name}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        openSubmenus[item.name] && "rotate-180",
                      )}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1 space-y-1 pl-2">
                  <div className="relative ml-2 border-l-2 border-border/50 pl-2 space-y-1">
                    {item.subItems!.map((subItem) => {
                      const subHref = buildHref(subItem.href)
                      const isSubActive = pathname === subHref || pathname?.startsWith(subHref + "/")
                      return (
                        <Link
                          key={subItem.name}
                          href={subHref}
                          onClick={onNavigate}
                          className={cn(
                            "group relative flex items-center gap-3 rounded-lg pl-3 pr-3 py-2 text-sm font-medium transition-all duration-200",
                            isSubActive
                              ? "bg-gradient-to-r from-foreground/10 to-foreground/5 text-foreground border-l-2 border-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:translate-x-1",
                          )}
                        >
                          <subItem.icon
                            className={cn(
                              "h-4 w-4 transition-all group-hover:scale-110",
                              isSubActive && "text-foreground",
                            )}
                          />
                          <span className="flex-1">{subItem.name}</span>
                          {isSubActive && <div className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" />}
                        </Link>
                      )
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          }

          return (
            <Link
              key={item.name}
              href={itemHref}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-foreground text-background shadow-lg dark:shadow-black/50"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-background" />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 transition-transform group-hover:scale-110",
                  isActive && "text-background",
                  isCollapsed && "mx-auto",
                )}
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
          )
        })}
      </nav>

      {/* Account Selector */}
      {!isCollapsed && (
        <div className="border-t border-border p-4">
          {loading ? (
            <div className="flex items-center justify-center py-3">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : accounts.length === 0 ? (
            <a href="/api/auth/instagram/connect">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent rounded-xl transition-all hover:shadow-md dark:hover:shadow-black/30 bg-transparent"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border">
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-sm text-foreground font-medium">Connect Instagram</span>
              </Button>
            </a>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent rounded-xl transition-all hover:shadow-md dark:hover:shadow-black/30"
                >
                  <Avatar className="h-9 w-9 shrink-0 border-2 border-border shadow-md">
                    <AvatarImage src={proxyInstagramImage(selectedAccount?.profilePicUrl)} />
                    <AvatarFallback className="bg-foreground text-background font-semibold text-xs">
                      {selectedAccount?.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col items-start text-left min-w-0">
                    <div className="flex items-center gap-1.5 w-full min-w-0">
                      <span className="text-sm font-semibold text-foreground truncate">
                        @{selectedAccount?.username}
                      </span>
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Activity className="h-3 w-3 shrink-0 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-muted-foreground">Connected</span>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-card border-border shadow-xl dark:shadow-black/50">
                {accounts.map((account) => (
                  <div key={account.id} className="space-y-0">
                    <DropdownMenuItem
                      onClick={() => handleAccountSwitch(account)}
                      className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all"
                    >
                      <Avatar className="h-8 w-8 shrink-0 shadow-sm">
                        <AvatarImage src={proxyInstagramImage(account.profilePicUrl)} />
                        <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
                          {account.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">@{account.username}</span>
                        <span className="text-xs text-muted-foreground">
                          {account.followerCount.toLocaleString()} followers
                        </span>
                      </div>
                      {account.id === selectedAccount?.id && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-foreground" />
                      )}
                    </DropdownMenuItem>
                    
                    {/* Disconnect option for each account */}
                    <DropdownMenuItem
                      onClick={() => {
                        setAccountToDisconnect(account)
                        setDisconnectDialogOpen(true)
                      }}
                      className="flex items-center gap-3 p-2 px-3 ml-11 cursor-pointer focus:bg-destructive/10 text-destructive rounded-lg transition-all"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Disconnect</span>
                    </DropdownMenuItem>
                  </div>
                ))}
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem asChild>
                  <a
                    href={currentTier === "free" ? buildHref("/billing") : "/api/auth/instagram/connect"}
                    className="flex items-center gap-3 p-3 cursor-pointer focus:bg-accent rounded-lg transition-all"
                    onClick={(e) => {
                      if (currentTier === "free") {
                        e.preventDefault()
                        toast.error("Upgrade to Pro to add a second account")
                        onNavigate?.()
                      }
                    }}
                  >
                    {currentTier === "free" ? (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border">
                        <Lock className="h-4 w-4 text-destructive" />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border">
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-sm text-foreground font-medium">
                      {currentTier === "free" ? "Upgrade for Multiple Accounts" : "Add Account"}
                    </span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {/* Plan Badge */}
      {!isCollapsed && (
        <div className="border-t border-border p-4">
          <div className="rounded-xl bg-accent p-4 border border-border shadow-lg dark:shadow-black/30">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background shadow-md">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-foreground capitalize">{currentTier} Plan</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {currentTier === "free" && "Basic automation features"}
                  {currentTier === "pro" && "Unlimited automations"}
                  {currentTier === "enterprise" && "Everything included"}
                </p>
                <Link href={buildHref("/billing")} onClick={onNavigate}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs h-7 font-medium border-border hover:bg-background shadow-sm hover:shadow-md transition-all bg-transparent"
                  >
                    {currentTier === "free" ? "Upgrade Plan" : "Manage Plan"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed State Indicators */}
      {isCollapsed && (
        <div className="flex flex-col items-center gap-3 border-t border-border p-3">
          {selectedAccount ? (
            <Avatar className="h-9 w-9 border-2 border-border shadow-md">
              <AvatarImage src={proxyInstagramImage(selectedAccount.profilePicUrl)} />
              <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
                {selectedAccount.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-dashed border-border">
              <Plus className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background shadow-md">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
      )}
    </>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [accounts, setAccounts] = useState<InstagramAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<InstagramAccount | null>(null)
  const [loading, setLoading] = useState(true)
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({})
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currentTier, setCurrentTier] = useState("free")
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false)
  const [accountToDisconnect, setAccountToDisconnect] = useState<InstagramAccount | null>(null)

  // Extract user slug from pathname
  const userSlug = pathname ? getSlugFromPathname(pathname) : null

  // Navigation items - these are now relative paths
  const navigation: NavigationItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Inbox",
      href: "/inbox",
      icon: MessageSquare,
    },
    {
      name: "Customers",
      href: "/customers",
      icon: MessageSquare,
    },
    {
      name: "Automations",
      href: "/automations",
      icon: Zap,
    },
    {
      name: "AI-settings",
      href: "/ai-dashboard",
      icon: FileText,
    },
    {
      name: "Accounts",
      href: "/accounts",
      icon: Instagram,
    },
    {
      name: "Billing",
      href: "/billing",
      icon: CreditCard,
    },
  ]

  // Fetch Instagram accounts and subscription tier on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [accountsRes, tierRes] = await Promise.all([
          fetch("/api/instagram/accounts"),
          fetch("/api/subscriptions/current"),
        ])

        if (accountsRes.ok) {
          const data = await accountsRes.json()
          setAccounts(data.accounts || [])

          const savedAccountId = getCookie("selectedInstagramAccountId")
          if (savedAccountId && data.accounts) {
            const saved = data.accounts.find((acc: InstagramAccount) => acc.id === savedAccountId)
            setSelectedAccount(saved || data.accounts[0] || null)
          } else if (data.accounts?.length > 0) {
            setSelectedAccount(data.accounts[0])
            setCookie("selectedInstagramAccountId", data.accounts[0].id)
          }
        }

        if (tierRes.ok) {
          const tierData = await tierRes.json()
          setCurrentTier(tierData.tier || "free")
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const newOpenSubmenus: Record<string, boolean> = {}
    navigation.forEach((item) => {
      if (item.subItems) {
        const isSubItemActive = item.subItems.some(
          (subItem) => pathname === subItem.href || pathname?.startsWith(subItem.href + "/"),
        )
        if (isSubItemActive) {
          newOpenSubmenus[item.name] = true
        }
      }
    })
    setOpenSubmenus(newOpenSubmenus)
  }, [pathname])

  const handleAccountSwitch = async (account: InstagramAccount) => {
    setSelectedAccount(account)
    setCookie("selectedInstagramAccountId", account.id)
    window.location.reload()
  }

  const toggleSubmenu = (itemName: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }))
  }

  const handleDisconnect = async (account: InstagramAccount) => {
    try {
      const response = await fetch('/api/instagram/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: account.id })
      })

      if (!response.ok) throw new Error('Failed to disconnect')

      toast.success('Account disconnected successfully')
      
      // Remove from local state
      setAccounts(prev => prev.filter(a => a.id !== account.id))
      
      // If this was the selected account, select another or null
      if (selectedAccount?.id === account.id) {
        const remaining = accounts.filter(a => a.id !== account.id)
        setSelectedAccount(remaining[0] || null)
        if (remaining[0]) {
          setCookie('selectedInstagramAccountId', remaining[0].id)
        }
        window.location.reload()
      }
    } catch (error) {
      toast.error('Failed to disconnect account')
      console.error('Disconnect error:', error)
    } finally {
      setDisconnectDialogOpen(false)
      setAccountToDisconnect(null)
    }
  }

  return (
    <>
      {/* Mobile Menu */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-50 h-10 w-10 bg-card border-border shadow-lg hover:bg-accent"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-card border-border">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-between px-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0">
                    <Image src="/branded-original.png" alt="Logo" fill className="object-contain" />
                  </div>
                  <span className="text-lg font-bold text-foreground">Yazzil</span>
                </div>
              </div>

              <SidebarContent
                isCollapsed={false}
                pathname={pathname}
                navigation={navigation}
                openSubmenus={openSubmenus}
                toggleSubmenu={toggleSubmenu}
                accounts={accounts}
                selectedAccount={selectedAccount}
                loading={loading}
                handleAccountSwitch={handleAccountSwitch}
                currentTier={currentTier}
                onNavigate={() => setMobileOpen(false)}
                userSlug={userSlug}
                handleDisconnect={handleDisconnect}
                setAccountToDisconnect={setAccountToDisconnect}
                setDisconnectDialogOpen={setDisconnectDialogOpen}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex h-full flex-col border-r border-border bg-card transition-all duration-300",
          isCollapsed ? "w-20" : "w-72",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center gap-3 flex-1">
              <div className="relative h-10 w-10 shrink-0">
                <Image src="/branded-original.png" alt="Logo" fill className="object-contain" />
              </div>
              <span className="text-lg font-bold text-foreground">Yazzil</span>
            </div>
          )}
          {isCollapsed && (
            <div className="relative h-10 w-10 mx-auto">
              <Image src="/branded-original.png" alt="Logo" fill className="object-contain" />
            </div>
          )}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isCollapsed && (
          <div className="flex justify-center py-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex h-full flex-col">
          <SidebarContent
            isCollapsed={isCollapsed}
            pathname={pathname}
            navigation={navigation}
            openSubmenus={openSubmenus}
            toggleSubmenu={toggleSubmenu}
            accounts={accounts}
            selectedAccount={selectedAccount}
            loading={loading}
            handleAccountSwitch={handleAccountSwitch}
            currentTier={currentTier}
            onNavigate={() => {}}
            userSlug={userSlug}
            handleDisconnect={handleDisconnect}
            setAccountToDisconnect={setAccountToDisconnect}
            setDisconnectDialogOpen={setDisconnectDialogOpen}
          />
        </div>
      </div>

      {/* Disconnect Confirmation Dialog */}
      <AlertDialog open={disconnectDialogOpen} onOpenChange={setDisconnectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Instagram Account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect <strong>@{accountToDisconnect?.username}</strong>? 
              This will:
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Deactivate all automations for this account</li>
                <li>Stop receiving new messages</li>
                <li>Archive all conversations</li>
              </ul>
              <p className="mt-2 text-sm font-medium">You can reconnect anytime.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => accountToDisconnect && handleDisconnect(accountToDisconnect)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

