import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ImageIcon, Sparkles } from "lucide-react"
import Link from "next/link"

// Simulated data
async function getContentPosts(userId: string) {
  return [
    {
      id: "1",
      caption: "Excited to share our new product launch! 🚀 #innovation #tech",
      mediaUrls: ["/placeholder.svg?height=300&width=300"],
      status: "published",
      scheduledFor: null,
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      aiGenerated: true,
    },
    {
      id: "2",
      caption: "Behind the scenes of our creative process ✨",
      mediaUrls: ["/placeholder.svg?height=300&width=300"],
      status: "scheduled",
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      postedAt: null,
      aiGenerated: false,
    },
    {
      id: "3",
      caption: "Tips for growing your Instagram presence...",
      mediaUrls: [],
      status: "draft",
      scheduledFor: null,
      postedAt: null,
      aiGenerated: true,
    },
  ]
}

function getStatusColor(status: string) {
  switch (status) {
    case "published":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "scheduled":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "draft":
      return "bg-slate-100 text-slate-800 dark:bg-slate-800/30 dark:text-slate-400"
    default:
      return "bg-slate-100 text-slate-800 dark:bg-slate-800/30 dark:text-slate-400"
  }
}

export default async function ContentPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const posts = await getContentPosts(userId)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Content Hub</h1>
          <p className="text-slate-600 dark:text-slate-400">Create and schedule Instagram content with AI</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="gap-2 bg-transparent">
            <Link href="/content/calendar">
              <Calendar className="h-4 w-4" />
              Calendar
            </Link>
          </Button>
          <Button
            asChild
            className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Link href="/content/generate">
              <Sparkles className="h-4 w-4" />
              Generate Content
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Actions*/}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/content/generate">
          <Card className="glass-card cursor-pointer transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">AI Caption Generator</CardTitle>
                  <CardDescription className="text-xs">Generate engaging captions</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/content/generate?tab=image">
          <Card className="glass-card cursor-pointer transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-pink-600 to-orange-600">
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">AI Image Generator</CardTitle>
                  <CardDescription className="text-xs">Create stunning visuals</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/content/calendar">
          <Card className="glass-card cursor-pointer transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-orange-600 to-purple-600">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Content Calendar</CardTitle>
                  <CardDescription className="text-xs">Schedule your posts</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Recent Posts */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Your latest content</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/content/calendar">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                {post.mediaUrls.length > 0 && (
                  <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={post.mediaUrls[0] || "/placeholder.svg"}
                      alt="Post"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 text-sm">{post.caption}</p>
                    {post.aiGenerated && <Sparkles className="h-4 w-4 flex-shrink-0 text-purple-600" />}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(post.status)}`}
                    >
                      {post.status}
                    </span>
                    {post.status === "scheduled" && post.scheduledFor && (
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {post.scheduledFor.toLocaleDateString()}
                      </span>
                    )}
                    {post.status === "published" && post.postedAt && (
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {post.postedAt.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Edit
                    </Button>
                    {post.status === "draft" && (
                      <Button size="sm" className="flex-1">
                        Schedule
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}