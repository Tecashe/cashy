// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Zap, Plus, Pause, Play, Trash2, Settings, Copy, MoreVertical } from "lucide-react"
// import Link from "next/link"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// // Simulated data - replace with real database queries
// async function getAutomations(userId: string) {
//   return [
//     {
//       id: "1",
//       name: "Welcome New Followers",
//       description: "Send a welcome message to anyone who sends their first DM",
//       status: "active",
//       isActive: true,
//       triggeredCount: 234,
//       triggerType: "FIRST_MESSAGE",
//       createdAt: new Date("2024-01-15"),
//     },
//     {
//       id: "2",
//       name: "Product Inquiry Response",
//       description: "Auto-respond to messages containing product keywords",
//       status: "active",
//       isActive: true,
//       triggeredCount: 156,
//       triggerType: "KEYWORD",
//       createdAt: new Date("2024-01-20"),
//     },
//     {
//       id: "3",
//       name: "Story Reply Handler",
//       description: "Engage with users who reply to your stories",
//       status: "active",
//       isActive: true,
//       triggeredCount: 89,
//       triggerType: "STORY_REPLY",
//       createdAt: new Date("2024-02-01"),
//     },
//     {
//       id: "4",
//       name: "Comment Follow-up",
//       description: "Send DM to users who comment on your posts",
//       status: "paused",
//       isActive: false,
//       triggeredCount: 45,
//       triggerType: "COMMENT",
//       createdAt: new Date("2024-02-10"),
//     },
//     {
//       id: "5",
//       name: "Re-engagement Campaign",
//       description: "Reach out to inactive customers",
//       status: "draft",
//       isActive: false,
//       triggeredCount: 0,
//       triggerType: "DM_RECEIVED",
//       createdAt: new Date("2024-02-15"),
//     },
//   ]
// }

// function getStatusColor(status: string) {
//   switch (status) {
//     case "active":
//       return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
//     case "paused":
//       return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
//     case "draft":
//       return "bg-slate-100 text-slate-800 dark:bg-slate-800/30 dark:text-slate-400"
//     default:
//       return "bg-slate-100 text-slate-800 dark:bg-slate-800/30 dark:text-slate-400"
//   }
// }

// function getTriggerLabel(type: string) {
//   switch (type) {
//     case "FIRST_MESSAGE":
//       return "First Message"
//     case "KEYWORD":
//       return "Keyword Match"
//     case "STORY_REPLY":
//       return "Story Reply"
//     case "COMMENT":
//       return "Comment"
//     case "DM_RECEIVED":
//       return "DM Received"
//     case "MENTION":
//       return "Mention"
//     default:
//       return type
//   }
// }

// export default async function AutomationsPage() {
//   const { userId } = await auth()

//   if (!userId) {
//     redirect("/sign-in")
//   }

//   const automations = await getAutomations(userId)

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Automations</h1>
//           <p className="text-slate-600 dark:text-slate-400">Manage your Instagram automation workflows</p>
//         </div>
//         <Button
//           asChild
//           className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
//         >
//           <Link href="/automations/new">
//             <Plus className="h-4 w-4" />
//             Create Automation
//           </Link>
//         </Button>
//       </div>

//       {/* Stats */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card className="glass-card">
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{automations.filter((a) => a.isActive).length}</div>
//           </CardContent>
//         </Card>

//         <Card className="glass-card">
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium">Total Triggered</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {automations.reduce((sum, a) => sum + a.triggeredCount, 0).toLocaleString()}
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="glass-card">
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium">Draft Automations</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{automations.filter((a) => a.status === "draft").length}</div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Automations List */}
//       <div className="grid gap-4">
//         {automations.map((automation) => (
//           <Card key={automation.id} className="glass-card">
//             <CardHeader>
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
//                       <Zap className="h-5 w-5 text-white" />
//                     </div>
//                     <div>
//                       <CardTitle className="text-lg">{automation.name}</CardTitle>
//                       <CardDescription>{automation.description}</CardDescription>
//                     </div>
//                   </div>
//                   <div className="mt-4 flex items-center gap-4">
//                     <Badge className={getStatusColor(automation.status)} variant="secondary">
//                       {automation.status}
//                     </Badge>
//                     <Badge variant="outline">{getTriggerLabel(automation.triggerType)}</Badge>
//                     <span className="text-sm text-slate-600 dark:text-slate-400">
//                       Triggered {automation.triggeredCount} times
//                     </span>
//                   </div>
//                 </div>

//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="icon">
//                       <MoreVertical className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem asChild>
//                       <Link href={`/automations/${automation.id}`}>
//                         <Settings className="mr-2 h-4 w-4" />
//                         Edit
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>
//                       <Copy className="mr-2 h-4 w-4" />
//                       Duplicate
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>
//                       {automation.isActive ? (
//                         <>
//                           <Pause className="mr-2 h-4 w-4" />
//                           Pause
//                         </>
//                       ) : (
//                         <>
//                           <Play className="mr-2 h-4 w-4" />
//                           Activate
//                         </>
//                       )}
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem className="text-destructive">
//                       <Trash2 className="mr-2 h-4 w-4" />
//                       Delete
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="flex gap-2">
//                 <Button asChild variant="outline" size="sm">
//                   <Link href={`/automations/${automation.id}`}>View Details</Link>
//                 </Button>
//                 <Button variant="outline" size="sm">
//                   View Analytics
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {automations.length === 0 && (
//         <Card className="glass-card">
//           <CardContent className="flex flex-col items-center justify-center py-12">
//             <Zap className="h-12 w-12 text-slate-400" />
//             <h3 className="mt-4 text-lg font-semibold">No automations yet</h3>
//             <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
//               Get started by creating your first automation workflow
//             </p>
//             <Button asChild className="mt-4 gap-2 bg-gradient-to-r from-purple-600 to-pink-600">
//               <Link href="/automations/new">
//                 <Plus className="h-4 w-4" />
//                 Create Automation
//               </Link>
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }

// import { getAutomations } from "@/lib/actions/automation-actions"
// import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
// import { AutomationsList } from "@/components/automations-list"
// import { Button } from "@/components/ui/button"
// import { Plus } from "lucide-react"
// import Link from "next/link"

// export default async function AutomationsPage() {
//   const [automations, instagramAccounts] = await Promise.all([getAutomations(), getInstagramAccounts()])

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
//           <p className="text-muted-foreground mt-2">Create intelligent workflows to automate your Instagram DMs</p>
//         </div>
//         <Link href="/automations/new">
//           <Button>
//             <Plus className="mr-2 h-4 w-4" />
//             Create Automation
//           </Button>
//         </Link>
//       </div>

//       <AutomationsList automations={automations} instagramAccounts={instagramAccounts} />
//     </div>
//   )
// }

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Zap, TrendingUp, Clock, Play, Pause, MoreVertical, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAutomations } from "@/lib/actions/automation-actions"

export default async function AutomationsPage() {
  const automations = await getAutomations()

  const activeCount = automations.filter((a) => a.status === "active").length
  const totalTriggers = automations.reduce((sum, a) => sum + (a._count?.executions || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Automations</h1>
          <p className="text-muted-foreground mt-2">Create and manage your Instagram automation workflows</p>
        </div>
        <Link href="/automations/new">
          <Button
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all font-semibold"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Automation
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Automations</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{activeCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Running live</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Triggers</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalTriggers}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Automations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{automations.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Created</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1.2s</div>
            <p className="text-xs text-muted-foreground mt-1">Average response</p>
          </CardContent>
        </Card>
      </div>

      {/* Automations List */}
      <div className="space-y-4">
        {automations.map((automation) => (
          <Card
            key={automation.id}
            className="bg-card border-border shadow-md hover:shadow-xl transition-all hover:scale-[1.01]"
          >
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background shadow-lg">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">{automation.name}</h3>
                        <Badge
                          variant={automation.status === "active" ? "default" : "secondary"}
                          className={
                            automation.status === "active"
                              ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 shadow-sm"
                              : "bg-muted text-muted-foreground shadow-sm"
                          }
                        >
                          {automation.status === "active" ? (
                            <>
                              <Play className="mr-1 h-3 w-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <Pause className="mr-1 h-3 w-3" />
                              Paused
                            </>
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{automation.description || "No description"}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Executions:</span>
                      <span className="font-semibold text-foreground">{automation._count?.executions || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Actions:</span>
                      <span className="font-semibold text-foreground">{automation.actions?.length || 0}</span>
                    </div>
                    {automation.instagramAccount && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Account:</span>
                        <span className="font-semibold text-foreground">@{automation.instagramAccount.username}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/automations/${automation.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border hover:bg-accent shadow-md hover:shadow-lg transition-all bg-transparent"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-accent shadow-md hover:shadow-lg transition-all"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border shadow-xl">
                      <DropdownMenuItem className="cursor-pointer focus:bg-accent">
                        <Play className="mr-2 h-4 w-4" />
                        {automation.status === "active" ? "Pause" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer focus:bg-accent">
                        <Zap className="mr-2 h-4 w-4" />
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-500/10">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {automations.length === 0 && (
        <Card className="bg-card border-border shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16 px-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
              <Zap className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No automations yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Get started by creating your first automation workflow to engage with your Instagram audience
            </p>
            <Link href="/automations/new">
              <Button
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all font-semibold"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Automation
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
