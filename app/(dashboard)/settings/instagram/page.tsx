import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
import { InstagramAccountCard } from "@/components/instagram-account-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Instagram, Plus, Shield, Zap, MessageSquare } from "lucide-react"
import Link from "next/link"

export default async function InstagramSettingsPage() {
  const accounts = await getInstagramAccounts()

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Instagram className="h-8 w-8 text-primary" />
          Instagram Accounts
        </h1>
        <p className="text-muted-foreground mt-2">
          Connect your Instagram accounts to start automating your DM responses
        </p>
      </div>

      {accounts.length === 0 && (
        <Card className="border-primary/50 mb-8">
          <CardHeader>
            <CardTitle>Why Connect Instagram?</CardTitle>
            <CardDescription>
              Unlock powerful automation features by connecting your Instagram Business account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="rounded-lg bg-primary/10 p-3 w-fit">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Auto-Reply to DMs</h3>
                <p className="text-sm text-muted-foreground">Respond to messages automatically with custom workflows</p>
              </div>
              <div className="space-y-2">
                <div className="rounded-lg bg-primary/10 p-3 w-fit">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">AI-Powered Responses</h3>
                <p className="text-sm text-muted-foreground">Let AI handle conversations intelligently and naturally</p>
              </div>
              <div className="space-y-2">
                <div className="rounded-lg bg-primary/10 p-3 w-fit">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is encrypted and never shared with third parties
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{accounts.length > 0 ? "Connected Accounts" : "Get Started"}</h2>
        <Link href="/api/auth/instagram">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Connect Instagram Account
          </Button>
        </Link>
      </div>

      {accounts.length > 0 ? (
        <div className="grid gap-4">
          {accounts.map((account) => (
            <InstagramAccountCard key={account.id} account={account} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Instagram className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No accounts connected</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Connect your Instagram Business account to start automating your DM responses
            </p>
            <Link href="/api/auth/instagram">
              <Button>
                <Instagram className="mr-2 h-4 w-4" />
                Connect Your First Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>Follow these steps to connect your Instagram account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                1
              </div>
              <div>
                <p className="font-medium">Convert to Business Account</p>
                <p className="text-sm text-muted-foreground">
                  Your Instagram account must be a Business or Creator account
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                2
              </div>
              <div>
                <p className="font-medium">Connect to Facebook Page</p>
                <p className="text-sm text-muted-foreground">Link your Instagram Business account to a Facebook Page</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                3
              </div>
              <div>
                <p className="font-medium">Grant Permissions</p>
                <p className="text-sm text-muted-foreground">
                  Allow access to messages, comments, and insights when prompted
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                4
              </div>
              <div>
                <p className="font-medium">Start Automating</p>
                <p className="text-sm text-muted-foreground">Create your first automation and let AI handle your DMs</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
