// import { redirect } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { MessageSquare, Zap, TrendingUp, Users, ArrowUpRight, Plus } from "lucide-react"
// import Link from "next/link"

// // Simulated data - replace with real database queries
// async function getDashboardData(userId: string) {
//   // In production, fetch from database:
//   // const conversations = await prisma.conversation.findMany({ where: { userId }, take: 5 })
//   // const automations = await prisma.automation.findMany({ where: { userId, isActive: true } })
//   // const analytics = await prisma.analytics.findFirst({ where: { userId, date: today } })

//   return {
//     stats: {
//       totalMessages: 1247,
//       activeAutomations: 8,
//       responseRate: 94.2,
//       newLeads: 156,
//     },
//     recentConversations: [
//       {
//         id: "1",
//         participantName: "Sarah Johnson",
//         participantUsername: "sarahjay",
//         participantAvatar: "/diverse-woman-avatar.png",
//         lastMessageText: "Thanks for the quick response!",
//         lastMessageAt: new Date(Date.now() - 1000 * 60 * 5),
//         unreadCount: 0,
//       },
//       {
//         id: "2",
//         participantName: "Mike Chen",
//         participantUsername: "mikechen",
//         participantAvatar: "/man-avatar.png",
//         lastMessageText: "Can I get more info about your product?",
//         lastMessageAt: new Date(Date.now() - 1000 * 60 * 15),
//         unreadCount: 2,
//       },
//       {
//         id: "3",
//         participantName: "Emma Wilson",
//         participantUsername: "emmawilson",
//         participantAvatar: "/woman-avatar-2.png",
//         lastMessageText: "Love your content!",
//         lastMessageAt: new Date(Date.now() - 1000 * 60 * 30),
//         unreadCount: 1,
//       },
//     ],
//     activeAutomations: [
//       {
//         id: "1",
//         name: "Welcome New Followers",
//         status: "active",
//         triggeredToday: 23,
//       },
//       {
//         id: "2",
//         name: "Product Inquiry Response",
//         status: "active",
//         triggeredToday: 15,
//       },
//       {
//         id: "3",
//         name: "Story Reply Handler",
//         status: "active",
//         triggeredToday: 31,
//       },
//     ],
//   }
// }

// function formatRelativeTime(date: Date) {
//   const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

//   if (seconds < 60) return "just now"
//   if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
//   if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
//   return `${Math.floor(seconds / 86400)}d ago`
// }

// export default async function DashboardPage() {
//   const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
//   let userId = "mock-user-id"

//   if (hasClerkKeys) {
//     const { auth } = await import("@clerk/nextjs/server")
//     const authResult = await auth()
//     if (!authResult.userId) {
//       redirect("/sign-in")
//     }
//     userId = authResult.userId
//   }

//   const data = await getDashboardData(userId)

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
//           <p className="text-slate-600 dark:text-slate-400">Welcome back! Here's what's happening today.</p>
//         </div>
//         <div className="flex gap-3">
//           <Button asChild variant="outline" className="gap-2 bg-transparent">
//             <Link href="/inbox">
//               <MessageSquare className="h-4 w-4" />
//               View Inbox
//             </Link>
//           </Button>
//           <Button
//             asChild
//             className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
//           >
//             <Link href="/automations/new">
//               <Plus className="h-4 w-4" />
//               New Automation
//             </Link>
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card className="glass-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
//             <MessageSquare className="h-4 w-4 text-purple-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{data.stats.totalMessages.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground">
//               <span className="text-green-600">+12.5%</span> from last month
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="glass-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
//             <Zap className="h-4 w-4 text-pink-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{data.stats.activeAutomations}</div>
//             <p className="text-xs text-muted-foreground">Running smoothly</p>
//           </CardContent>
//         </Card>

//         <Card className="glass-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
//             <TrendingUp className="h-4 w-4 text-orange-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{data.stats.responseRate}%</div>
//             <p className="text-xs text-muted-foreground">
//               <span className="text-green-600">+2.3%</span> from last week
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="glass-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">New Leads</CardTitle>
//             <Users className="h-4 w-4 text-purple-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{data.stats.newLeads}</div>
//             <p className="text-xs text-muted-foreground">This month</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid gap-6 lg:grid-cols-2">
//         {/* Recent Conversations */}
//         <Card className="glass-card">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle>Recent Conversations</CardTitle>
//                 <CardDescription>Your latest Instagram DM conversations</CardDescription>
//               </div>
//               <Button asChild variant="ghost" size="sm" className="gap-1">
//                 <Link href="/inbox">
//                   View All
//                   <ArrowUpRight className="h-4 w-4" />
//                 </Link>
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {data.recentConversations.map((conversation) => (
//                 <Link
//                   key={conversation.id}
//                   href={`/inbox/${conversation.id}`}
//                   className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
//                 >
//                   <img
//                     src={conversation.participantAvatar || "/placeholder.svg"}
//                     alt={conversation.participantName}
//                     className="h-10 w-10 rounded-full"
//                   />
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center justify-between gap-2">
//                       <p className="font-medium text-slate-900 dark:text-white truncate">
//                         {conversation.participantName}
//                       </p>
//                       <span className="text-xs text-slate-500">{formatRelativeTime(conversation.lastMessageAt)}</span>
//                     </div>
//                     <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
//                       @{conversation.participantUsername}
//                     </p>
//                     <p className="text-sm text-slate-500 truncate">{conversation.lastMessageText}</p>
//                   </div>
//                   {conversation.unreadCount > 0 && (
//                     <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-xs font-bold text-white">
//                       {conversation.unreadCount}
//                     </div>
//                   )}
//                 </Link>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Active Automations */}
//         <Card className="glass-card">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle>Active Automations</CardTitle>
//                 <CardDescription>Your running automation workflows</CardDescription>
//               </div>
//               <Button asChild variant="ghost" size="sm" className="gap-1">
//                 <Link href="/automations">
//                   View All
//                   <ArrowUpRight className="h-4 w-4" />
//                 </Link>
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {data.activeAutomations.map((automation) => (
//                 <Link
//                   key={automation.id}
//                   href={`/automations/${automation.id}`}
//                   className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
//                       <Zap className="h-5 w-5 text-white" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-slate-900 dark:text-white">{automation.name}</p>
//                       <p className="text-sm text-slate-500">Triggered {automation.triggeredToday} times today</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
//                       Active
//                     </span>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Quick Actions */}
//       <Card className="glass-card">
//         <CardHeader>
//           <CardTitle>Quick Actions</CardTitle>
//           <CardDescription>Common tasks to help you manage your Instagram automation</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4 md:grid-cols-3">
//             <Button asChild variant="outline" className="h-auto flex-col gap-2 p-6 bg-transparent">
//               <Link href="/automations/new">
//                 <Zap className="h-8 w-8 text-purple-600" />
//                 <div className="text-center">
//                   <p className="font-medium">Create Automation</p>
//                   <p className="text-xs text-muted-foreground">Set up a new workflow</p>
//                 </div>
//               </Link>
//             </Button>

//             <Button asChild variant="outline" className="h-auto flex-col gap-2 p-6 bg-transparent">
//               <Link href="/content/generate">
//                 <MessageSquare className="h-8 w-8 text-pink-600" />
//                 <div className="text-center">
//                   <p className="font-medium">Generate Content</p>
//                   <p className="text-xs text-muted-foreground">Create AI-powered posts</p>
//                 </div>
//               </Link>
//             </Button>

//             <Button asChild variant="outline" className="h-auto flex-col gap-2 p-6 bg-transparent">
//               <Link href="/analytics">
//                 <TrendingUp className="h-8 w-8 text-orange-600" />
//                 <div className="text-center">
//                   <p className="font-medium">View Analytics</p>
//                   <p className="text-xs text-muted-foreground">Track your performance</p>
//                 </div>
//               </Link>
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
import { Suspense } from "react"
import { getAnalyticsOverview, getAutomationPerformance, getRecentActivity } from "@/actions/analytics-actions"
import { MessageSquare, Users, Zap, Clock, Activity, CheckCircle2, BarChart3 } from "lucide-react"
import { MessageVolumeChart, StatusPieChart, CategoryBarChart } from "@/components/analytics/charts"

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  const params = await searchParams
  const dateRange = (params.range as "7d" | "30d" | "90d") || "30d"

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Track your performance and engagement metrics</p>
        </div>

        {/* Date Range Filter */}
        <DateRangeFilter currentRange={dateRange} />

        {/* Main Content */}
        <Suspense fallback={<LoadingSkeleton />}>
          <AnalyticsContent dateRange={dateRange} />
        </Suspense>
      </div>
    </div>
  )
}

async function AnalyticsContent({ dateRange }: { dateRange: "7d" | "30d" | "90d" }) {
  const [overview, automationPerf, activity] = await Promise.all([
    getAnalyticsOverview(dateRange),
    getAutomationPerformance(),
    getRecentActivity(),
  ])

  return (
    <>
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Messages"
          value={overview.overview.totalMessages}
          icon={MessageSquare}
          trend="+12%"
          color="orange"
        />
        <MetricCard
          title="Conversations"
          value={overview.overview.conversationsStarted}
          icon={Users}
          trend="+8%"
          color="green"
        />
        <MetricCard
          title="Automations Triggered"
          value={overview.overview.automationTriggered}
          icon={Zap}
          trend="+24%"
          color="purple"
        />
        <MetricCard
          title="Avg Response Time"
          value={`${overview.overview.avgResponseTime}m`}
          icon={Clock}
          trend="-5%"
          color="yellow"
          trendPositive={false}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Volume Chart */}
        <ChartCard title="Message Volume">
          <MessageVolumeChart data={overview.chartData} />
        </ChartCard>

        {/* Status Breakdown */}
        <ChartCard title="Conversation Status">
          <StatusPieChart data={overview.statusBreakdown} />
        </ChartCard>
      </div>

      {/* Automation Performance & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automation Performance */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Automation Performance</h3>
            <Activity className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {automationPerf.slice(0, 5).map((auto) => (
              <div key={auto.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{auto.name}</span>
                  <span className="text-muted-foreground">{auto.successRate}% success</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green transition-all duration-500"
                    style={{ width: `${auto.successRate}%` }}
                  />
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{auto.totalExecutions} runs</span>
                  <span>{auto.successCount} successful</span>
                  {auto.failedCount > 0 && <span className="text-red">{auto.failedCount} failed</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <ChartCard title="Conversation Categories">
          <CategoryBarChart data={overview.categoryBreakdown} />
        </ChartCard>
      </div>

      {/* Top Tags */}
      {overview.topTags.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">Top Tags</h3>
          <div className="flex flex-wrap gap-3">
            {overview.topTags.map((tag) => (
              <div
                key={tag.name}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-muted"
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                <span className="font-medium">{tag.name}</span>
                <span className="text-sm text-muted-foreground">({tag.count})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Conversations */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">Recent Conversations</h3>
          <div className="space-y-3">
            {activity.conversations.map((conv) => (
              <div key={conv.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                <div className="w-10 h-10 rounded-full bg-orange/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-orange">
                    {conv.participantName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium truncate">{conv.participantName}</p>
                    {conv.unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-orange text-xs font-medium text-background">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Automation Runs */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">Recent Automation Runs</h3>
          <div className="space-y-3">
            {activity.executions.map((exec) => (
              <div key={exec.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    exec.status === "success" ? "bg-green" : exec.status === "failed" ? "bg-red" : "bg-yellow"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{exec.automationName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(exec.executedAt).toLocaleString()}
                  </p>
                  {exec.error && <p className="text-xs text-red mt-1 truncate">{exec.error}</p>}
                </div>
                {exec.status === "success" && <CheckCircle2 className="w-4 h-4 text-green flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  trendPositive = true,
}: {
  title: string
  value: string | number
  icon: React.ElementType
  trend: string
  color: "orange" | "green" | "purple" | "yellow"
  trendPositive?: boolean
}) {
  const colorClasses = {
    orange: "bg-orange/10 text-orange",
    green: "bg-green/10 text-green",
    purple: "bg-purple/10 text-purple",
    yellow: "bg-yellow/10 text-yellow",
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4 hover:border-orange/50 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold">{value}</p>
        <p className={`text-sm ${trendPositive ? "text-green" : "text-red"}`}>
          {trend} from last period
        </p>
      </div>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  )
}

function DateRangeFilter({ currentRange }: { currentRange: string }) {
  return (
    <div className="flex items-center gap-2">
      <a
        href="?range=7d"
        className={`px-4 py-2 rounded-lg border transition-colors ${
          currentRange === "7d"
            ? "bg-orange text-background border-orange"
            : "border-border hover:border-orange/50"
        }`}
      >
        7 Days
      </a>
      <a
        href="?range=30d"
        className={`px-4 py-2 rounded-lg border transition-colors ${
          currentRange === "30d"
            ? "bg-orange text-background border-orange"
            : "border-border hover:border-orange/50"
        }`}
      >
        30 Days
      </a>
      <a
        href="?range=90d"
        className={`px-4 py-2 rounded-lg border transition-colors ${
          currentRange === "90d"
            ? "bg-orange text-background border-orange"
            : "border-border hover:border-orange/50"
        }`}
      >
        90 Days
      </a>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 h-80" />
        ))}
      </div>
    </div>
  )
}