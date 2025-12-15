import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default async function AutomateMediaPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/media">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Comment Automation Setup</h1>
          <p className="text-slate-600 dark:text-slate-400">Configure automatic responses to comments on this post</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Post Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/instagram-post-lifestyle.png" alt="Post" className="h-full w-full object-cover" />
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              New collection drop! 🔥 #fashion #style #newcollection
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Comment-to-DM Automation</CardTitle>
            <CardDescription>Automatically send a DM when someone comments specific keywords</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trigger">Trigger Keywords (comma-separated)</Label>
              <Input id="trigger" placeholder="e.g., interested, price, buy, info" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                DM will be sent when comment contains any of these keywords
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dmMessage">DM Message Template</Label>
              <Textarea
                id="dmMessage"
                placeholder="Hi {name}! Thanks for your interest. Here's more information..."
                rows={6}
              />
              <p className="text-xs text-slate-600 dark:text-slate-400">Use {`{name}`} for personalization</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commentReply">Comment Reply (Optional)</Label>
              <Input id="commentReply" placeholder="Check your DMs! 💬" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Public reply that will be posted on the comment
              </p>
            </div>

            <Button className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Save className="h-4 w-4" />
              Save Automation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
