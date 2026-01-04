import { getAISettings } from "@/lib/actions/ai-settings-actions"
import { AISettingsForm } from "@/components/ai-settings-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Bot, Zap } from "lucide-react"

export default async function AISettingsPage() {
  const settings = await getAISettings()

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure AI-powered responses to automatically handle customer inquiries
        </p>
      </div>

      <div className="grid gap-6 mb-8">
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              How AI Responses Work
            </CardTitle>
            <CardDescription>
              Our AI assistant uses your business information to generate intelligent, contextual responses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="rounded-lg bg-primary/10 p-3 w-fit">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Smart Context</h3>
                <p className="text-sm text-muted-foreground">
                  AI analyzes conversation history to provide relevant, personalized responses
                </p>
              </div>
              <div className="space-y-2">
                <div className="rounded-lg bg-primary/10 p-3 w-fit">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Your Brand Voice</h3>
                <p className="text-sm text-muted-foreground">
                  Responses match your business description and tone preferences
                </p>
              </div>
              <div className="space-y-2">
                <div className="rounded-lg bg-primary/10 p-3 w-fit">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Instant Replies</h3>
                <p className="text-sm text-muted-foreground">Respond to customers 24/7 without manual intervention</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AISettingsForm settings={settings} />
    </div>
  )
}
