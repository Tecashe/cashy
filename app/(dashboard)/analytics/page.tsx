// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { BarChart3, TrendingUp, MessageSquare, Users, Zap, Calendar } from "lucide-react"

// // Simulated analytics data
// async function getAnalytics(userId: string) {
//   return {
//     overview: {
//       totalMessages: 1247,
//       totalConversations: 89,
//       activeAutomations: 8,
//       avgResponseTime: "2.5 min",
//       responseRate: 94.2,
//       contentGenerated: 45,
//     },
//     messageStats: {
//       thisWeek: [
//         { day: "Mon", sent: 45, received: 67 },
//         { day: "Tue", sent: 52, received: 71 },
//         { day: "Wed", sent: 48, received: 65 },
//         { day: "Thu", sent: 61, received: 82 },
//         { day: "Fri", sent: 55, received: 78 },
//         { day: "Sat", sent: 38, received: 54 },
//         { day: "Sun", sent: 32, received: 48 },
//       ],
//       growth: 12.5,
//     },
//     automationStats: [
//       { name: "Welcome New Followers", triggered: 234, responseRate: 96.8, avgTime: "1.2s" },
//       { name: "Product Inquiry Response", triggered: 156, responseRate: 94.2, avgTime: "1.5s" },
//       { name: "Story Reply Handler", triggered: 89, responseRate: 91.5, avgTime: "2.1s" },
//     ],
//     topTags: [
//       { name: "VIP", count: 23, color: "#8B5CF6" },
//       { name: "Lead", count: 45, color: "#EC4899" },
//       { name: "Customer", count: 67, color: "#10B981" },
//       { name: "Follow-up", count: 34, color: "#F59E0B" },
//     ],
//     contentPerformance: {
//       postsPublished: 24,
//       avgEngagement: 5.8,
//       bestTime: "6:00 PM - 9:00 PM",
//       topHashtags: ["#instagram", "#socialmedia", "#marketing"],
//     },
//   }
// }

// export default async function AnalyticsPage() {
//   const { userId } = await auth()

//   if (!userId) {
//     redirect("/sign-in")
//   }

//   const analytics = await getAnalytics(userId)

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
//         <p className="text-slate-600 dark:text-slate-400">Track your Instagram automation performance</p>
//       </div>

//       {/* Overview Stats */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         <Card className="glass-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
//             <MessageSquare className="h-4 w-4 text-purple-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{analytics.overview.totalMessages.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground">
//               <span className="text-green-600">+{analytics.messageStats.growth}%</span> from last month
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="glass-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
//             <Users className="h-4 w-4 text-pink-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{analytics.overview.totalConversations}</div>
//             <p className="text-xs text-muted-foreground">Active conversations</p>
//           </CardContent>
//         </Card>

//         <Card className="glass-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
//             <TrendingUp className="h-4 w-4 text-orange-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{analytics.overview.responseRate}%</div>
//             <p className="text-xs text-muted-foreground">Avg response time: {analytics.overview.avgResponseTime}</p>
//           </CardContent>
//         </Card>

//         <Card className="glass-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
//             <Zap className="h-4 w-4 text-purple-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{analytics.overview.activeAutomations}</div>
//             <p className="text-xs text-muted-foreground">Running smoothly</p>
//           </CardContent>
//         </Card>

//         <Card className="glass-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
//             <BarChart3 className="h-4 w-4 text-pink-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{analytics.overview.contentGenerated}</div>
//             <p className="text-xs text-muted-foreground">AI-powered captions & images</p>
//           </CardContent>
//         </Card>

//         <Card className="glass-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Posts Published</CardTitle>
//             <Calendar className="h-4 w-4 text-orange-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{analytics.contentPerformance.postsPublished}</div>
//             <p className="text-xs text-muted-foreground">This month</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Detailed Analytics */}
//       <Tabs defaultValue="messages" className="space-y-6">
//         <TabsList>
//           <TabsTrigger value="messages">Messages</TabsTrigger>
//           <TabsTrigger value="automations">Automations</TabsTrigger>
//           <TabsTrigger value="content">Content</TabsTrigger>
//         </TabsList>

//         {/* Messages Analytics */}
//         <TabsContent value="messages" className="space-y-6">
//           <Card className="glass-card">
//             <CardHeader>
//               <CardTitle>Message Activity</CardTitle>
//               <CardDescription>Messages sent and received this week</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {analytics.messageStats.thisWeek.map((day, index) => (
//                   <div key={index} className="space-y-2">
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="font-medium">{day.day}</span>
//                       <span className="text-slate-600 dark:text-slate-400">
//                         {day.sent} sent / {day.received} received
//                       </span>
//                     </div>
//                     <div className="flex gap-2">
//                       <div
//                         className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
//                         style={{ width: `${(day.sent / 100) * 100}%` }}
//                       />
//                       <div
//                         className="h-2 rounded-full bg-slate-200 dark:bg-slate-700"
//                         style={{ width: `${(day.received / 100) * 100}%` }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="glass-card">
//             <CardHeader>
//               <CardTitle>Top Tags</CardTitle>
//               <CardDescription>Most used conversation tags</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {analytics.topTags.map((tag) => (
//                   <div key={tag.name} className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
//                       <span className="font-medium">{tag.name}</span>
//                     </div>
//                     <span className="text-sm text-slate-600 dark:text-slate-400">{tag.count} conversations</span>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Automation Analytics */}
//         <TabsContent value="automations" className="space-y-6">
//           <Card className="glass-card">
//             <CardHeader>
//               <CardTitle>Automation Performance</CardTitle>
//               <CardDescription>How your automations are performing</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {analytics.automationStats.map((automation) => (
//                   <Card key={automation.name}>
//                     <CardHeader className="pb-3">
//                       <CardTitle className="text-base">{automation.name}</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-2">
//                       <div className="grid grid-cols-3 gap-4 text-center">
//                         <div>
//                           <p className="text-2xl font-bold text-purple-600">{automation.triggered}</p>
//                           <p className="text-xs text-slate-600 dark:text-slate-400">Times Triggered</p>
//                         </div>
//                         <div>
//                           <p className="text-2xl font-bold text-pink-600">{automation.responseRate}%</p>
//                           <p className="text-xs text-slate-600 dark:text-slate-400">Response Rate</p>
//                         </div>
//                         <div>
//                           <p className="text-2xl font-bold text-orange-600">{automation.avgTime}</p>
//                           <p className="text-xs text-slate-600 dark:text-slate-400">Avg Time</p>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Content Analytics */}
//         <TabsContent value="content" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             <Card className="glass-card">
//               <CardHeader>
//                 <CardTitle>Content Performance</CardTitle>
//                 <CardDescription>Your content metrics</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-slate-600 dark:text-slate-400">Posts Published</span>
//                   <span className="text-2xl font-bold">{analytics.contentPerformance.postsPublished}</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-slate-600 dark:text-slate-400">Avg Engagement</span>
//                   <span className="text-2xl font-bold">{analytics.contentPerformance.avgEngagement}%</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-slate-600 dark:text-slate-400">Best Time to Post</span>
//                   <span className="text-sm font-medium">{analytics.contentPerformance.bestTime}</span>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="glass-card">
//               <CardHeader>
//                 <CardTitle>Top Hashtags</CardTitle>
//                 <CardDescription>Your most used hashtags</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex flex-wrap gap-2">
//                   {analytics.contentPerformance.topHashtags.map((hashtag) => (
//                     <span
//                       key={hashtag}
//                       className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-sm text-white"
//                     >
//                       {hashtag}
//                     </span>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

import { Suspense } from "react"
import { getAnalyticsOverview, getAutomationPerformance, getRecentActivity } from "@/actions/analytics-actions"
import { BarChart3, MessageSquare, Users, Zap, Clock, TrendingUp, Activity, CheckCircle2 } from "lucide-react"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

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
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={overview.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="date" stroke="#a3a3a3" fontSize={12} />
              <YAxis stroke="#a3a3a3" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141414",
                  border: "1px solid #262626",
                  borderRadius: "0.5rem",
                }}
              />
              <Area type="monotone" dataKey="received" stackId="1" stroke="#00d9a3" fill="#00d9a3" fillOpacity={0.6} />
              <Area type="monotone" dataKey="sent" stackId="1" stroke="#ff6b35" fill="#ff6b35" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Status Breakdown */}
        <ChartCard title="Conversation Status">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Open", value: overview.statusBreakdown.open, color: "#ff6b35" },
                  { name: "Awaiting", value: overview.statusBreakdown.awaiting_response, color: "#ffd93d" },
                  { name: "Resolved", value: overview.statusBreakdown.resolved, color: "#00d9a3" },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {[
                  { name: "Open", value: overview.statusBreakdown.open, color: "#ff6b35" },
                  { name: "Awaiting", value: overview.statusBreakdown.awaiting_response, color: "#ffd93d" },
                  { name: "Resolved", value: overview.statusBreakdown.resolved, color: "#00d9a3" },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141414",
                  border: "1px solid #262626",
                  borderRadius: "0.5rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
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
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Conversation Categories</h3>
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={[
                { name: "Sales", value: overview.categoryBreakdown.sales, color: "#00d9a3" },
                { name: "Support", value: overview.categoryBreakdown.support, color: "#ff6b35" },
                { name: "Collaboration", value: overview.categoryBreakdown.collaboration, color: "#9d4edd" },
                { name: "General", value: overview.categoryBreakdown.general, color: "#ffd93d" },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="name" stroke="#a3a3a3" fontSize={12} />
              <YAxis stroke="#a3a3a3" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141414",
                  border: "1px solid #262626",
                  borderRadius: "0.5rem",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {[
                  { name: "Sales", value: overview.categoryBreakdown.sales, color: "#00d9a3" },
                  { name: "Support", value: overview.categoryBreakdown.support, color: "#ff6b35" },
                  { name: "Collaboration", value: overview.categoryBreakdown.collaboration, color: "#9d4edd" },
                  { name: "General", value: overview.categoryBreakdown.general, color: "#ffd93d" },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
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