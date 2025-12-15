import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, MessageSquare, Users, Zap, Calendar } from "lucide-react"

// Simulated analytics data
async function getAnalytics(userId: string) {
  return {
    overview: {
      totalMessages: 1247,
      totalConversations: 89,
      activeAutomations: 8,
      avgResponseTime: "2.5 min",
      responseRate: 94.2,
      contentGenerated: 45,
    },
    messageStats: {
      thisWeek: [
        { day: "Mon", sent: 45, received: 67 },
        { day: "Tue", sent: 52, received: 71 },
        { day: "Wed", sent: 48, received: 65 },
        { day: "Thu", sent: 61, received: 82 },
        { day: "Fri", sent: 55, received: 78 },
        { day: "Sat", sent: 38, received: 54 },
        { day: "Sun", sent: 32, received: 48 },
      ],
      growth: 12.5,
    },
    automationStats: [
      { name: "Welcome New Followers", triggered: 234, responseRate: 96.8, avgTime: "1.2s" },
      { name: "Product Inquiry Response", triggered: 156, responseRate: 94.2, avgTime: "1.5s" },
      { name: "Story Reply Handler", triggered: 89, responseRate: 91.5, avgTime: "2.1s" },
    ],
    topTags: [
      { name: "VIP", count: 23, color: "#8B5CF6" },
      { name: "Lead", count: 45, color: "#EC4899" },
      { name: "Customer", count: 67, color: "#10B981" },
      { name: "Follow-up", count: 34, color: "#F59E0B" },
    ],
    contentPerformance: {
      postsPublished: 24,
      avgEngagement: 5.8,
      bestTime: "6:00 PM - 9:00 PM",
      topHashtags: ["#instagram", "#socialmedia", "#marketing"],
    },
  }
}

export default async function AnalyticsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const analytics = await getAnalytics(userId)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-slate-600 dark:text-slate-400">Track your Instagram automation performance</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalMessages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{analytics.messageStats.growth}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <Users className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalConversations}</div>
            <p className="text-xs text-muted-foreground">Active conversations</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.responseRate}%</div>
            <p className="text-xs text-muted-foreground">Avg response time: {analytics.overview.avgResponseTime}</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.activeAutomations}</div>
            <p className="text-xs text-muted-foreground">Running smoothly</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
            <BarChart3 className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.contentGenerated}</div>
            <p className="text-xs text-muted-foreground">AI-powered captions & images</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts Published</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.contentPerformance.postsPublished}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        {/* Messages Analytics */}
        <TabsContent value="messages" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Message Activity</CardTitle>
              <CardDescription>Messages sent and received this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.messageStats.thisWeek.map((day, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{day.day}</span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {day.sent} sent / {day.received} received
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                        style={{ width: `${(day.sent / 100) * 100}%` }}
                      />
                      <div
                        className="h-2 rounded-full bg-slate-200 dark:bg-slate-700"
                        style={{ width: `${(day.received / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Top Tags</CardTitle>
              <CardDescription>Most used conversation tags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topTags.map((tag) => (
                  <div key={tag.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
                      <span className="font-medium">{tag.name}</span>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{tag.count} conversations</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Analytics */}
        <TabsContent value="automations" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Automation Performance</CardTitle>
              <CardDescription>How your automations are performing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.automationStats.map((automation) => (
                  <Card key={automation.name}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{automation.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-purple-600">{automation.triggered}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Times Triggered</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-pink-600">{automation.responseRate}%</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Response Rate</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-orange-600">{automation.avgTime}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Avg Time</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Analytics */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>Your content metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Posts Published</span>
                  <span className="text-2xl font-bold">{analytics.contentPerformance.postsPublished}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Avg Engagement</span>
                  <span className="text-2xl font-bold">{analytics.contentPerformance.avgEngagement}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Best Time to Post</span>
                  <span className="text-sm font-medium">{analytics.contentPerformance.bestTime}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Top Hashtags</CardTitle>
                <CardDescription>Your most used hashtags</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analytics.contentPerformance.topHashtags.map((hashtag) => (
                    <span
                      key={hashtag}
                      className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-sm text-white"
                    >
                      {hashtag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
