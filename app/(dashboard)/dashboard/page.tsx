import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Zap, TrendingUp, Users, ArrowUpRight, Plus } from "lucide-react"
import Link from "next/link"

// Simulated data - replace with real database queries
async function getDashboardData(userId: string) {
  // In production, fetch from database:
  // const conversations = await prisma.conversation.findMany({ where: { userId }, take: 5 })
  // const automations = await prisma.automation.findMany({ where: { userId, isActive: true } })
  // const analytics = await prisma.analytics.findFirst({ where: { userId, date: today } })

  return {
    stats: {
      totalMessages: 1247,
      activeAutomations: 8,
      responseRate: 94.2,
      newLeads: 156,
    },
    recentConversations: [
      {
        id: "1",
        participantName: "Sarah Johnson",
        participantUsername: "sarahjay",
        participantAvatar: "/diverse-woman-avatar.png",
        lastMessageText: "Thanks for the quick response!",
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 5),
        unreadCount: 0,
      },
      {
        id: "2",
        participantName: "Mike Chen",
        participantUsername: "mikechen",
        participantAvatar: "/man-avatar.png",
        lastMessageText: "Can I get more info about your product?",
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 15),
        unreadCount: 2,
      },
      {
        id: "3",
        participantName: "Emma Wilson",
        participantUsername: "emmawilson",
        participantAvatar: "/woman-avatar-2.png",
        lastMessageText: "Love your content!",
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 30),
        unreadCount: 1,
      },
    ],
    activeAutomations: [
      {
        id: "1",
        name: "Welcome New Followers",
        status: "active",
        triggeredToday: 23,
      },
      {
        id: "2",
        name: "Product Inquiry Response",
        status: "active",
        triggeredToday: 15,
      },
      {
        id: "3",
        name: "Story Reply Handler",
        status: "active",
        triggeredToday: 31,
      },
    ],
  }
}

function formatRelativeTime(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return "just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export default async function DashboardPage() {
  const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  let userId = "mock-user-id"

  if (hasClerkKeys) {
    const { auth } = await import("@clerk/nextjs/server")
    const authResult = await auth()
    if (!authResult.userId) {
      redirect("/sign-in")
    }
    userId = authResult.userId
  }

  const data = await getDashboardData(userId)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="gap-2 bg-transparent">
            <Link href="/inbox">
              <MessageSquare className="h-4 w-4" />
              View Inbox
            </Link>
          </Button>
          <Button
            asChild
            className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Link href="/automations/new">
              <Plus className="h-4 w-4" />
              New Automation
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalMessages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
            <Zap className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.activeAutomations}</div>
            <p className="text-xs text-muted-foreground">Running smoothly</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.responseRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.3%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.newLeads}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Conversations */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Conversations</CardTitle>
                <CardDescription>Your latest Instagram DM conversations</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link href="/inbox">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentConversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/inbox/${conversation.id}`}
                  className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <img
                    src={conversation.participantAvatar || "/placeholder.svg"}
                    alt={conversation.participantName}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-slate-900 dark:text-white truncate">
                        {conversation.participantName}
                      </p>
                      <span className="text-xs text-slate-500">{formatRelativeTime(conversation.lastMessageAt)}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                      @{conversation.participantUsername}
                    </p>
                    <p className="text-sm text-slate-500 truncate">{conversation.lastMessageText}</p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-xs font-bold text-white">
                      {conversation.unreadCount}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Automations */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Automations</CardTitle>
                <CardDescription>Your running automation workflows</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link href="/automations">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.activeAutomations.map((automation) => (
                <Link
                  key={automation.id}
                  href={`/automations/${automation.id}`}
                  className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{automation.name}</p>
                      <p className="text-sm text-slate-500">Triggered {automation.triggeredToday} times today</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to help you manage your Instagram automation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild variant="outline" className="h-auto flex-col gap-2 p-6 bg-transparent">
              <Link href="/automations/new">
                <Zap className="h-8 w-8 text-purple-600" />
                <div className="text-center">
                  <p className="font-medium">Create Automation</p>
                  <p className="text-xs text-muted-foreground">Set up a new workflow</p>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto flex-col gap-2 p-6 bg-transparent">
              <Link href="/content/generate">
                <MessageSquare className="h-8 w-8 text-pink-600" />
                <div className="text-center">
                  <p className="font-medium">Generate Content</p>
                  <p className="text-xs text-muted-foreground">Create AI-powered posts</p>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto flex-col gap-2 p-6 bg-transparent">
              <Link href="/analytics">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="text-center">
                  <p className="font-medium">View Analytics</p>
                  <p className="text-xs text-muted-foreground">Track your performance</p>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
