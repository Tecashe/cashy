"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, Info, Loader2 } from "lucide-react"
import { getOrCreateDefaultAutomation } from "@/actions/ai-setup-actions"

interface OverviewTabProps {
  automationId: string | null
  stats: {
    products: number
    knowledgeDocs: number
    activeIntegrations: number
  }
  onRefresh?: () => void
}

export function OverviewTab({ automationId, stats, onRefresh }: OverviewTabProps) {
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<Record<string, any>>({})

  useEffect(() => {
    loadConfig()
  }, [automationId])

  const loadConfig = async () => {
    try {
      setLoading(true)
      const automation = await getOrCreateDefaultAutomation()
      const aiAction = automation.actions[0]

      if (aiAction?.content && typeof aiAction.content === "object") {
        setConfig(aiAction.content as Record<string, any>)
      }
    } catch (error) {
      console.error("Failed to load config:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <p className="font-medium mb-2">How Your AI Works</p>
          <ol className="text-sm space-y-2 ml-4 list-decimal">
            <li>
              <strong>Customer sends message</strong> - Instagram DM, comment, or story reply arrives
            </li>
            <li>
              <strong>AI analyzes</strong> - Reads message, checks conversation history, and searches your knowledge
              base
            </li>
            <li>
              <strong>AI takes action</strong> - Responds, searches products, creates payment links, or books
              appointments
            </li>
            <li>
              <strong>Sends response</strong> - Customer receives instant, personalized reply
            </li>
            <li>
              <strong>Human handoff</strong> - If customer is frustrated or AI is unsure, it alerts you
            </li>
          </ol>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              What's Working
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">AI Model Connected</span>
              <Badge variant="default" className="bg-green-600">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{stats.products} Products Available</span>
              <Badge variant="secondary">Ready</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{stats.knowledgeDocs} Knowledge Documents</span>
              <Badge variant="secondary">Ready</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{stats.activeIntegrations} Active Integrations</span>
              <Badge
                variant={stats.activeIntegrations > 0 ? "default" : "secondary"}
                className={stats.activeIntegrations > 0 ? "bg-green-600" : ""}
              >
                {stats.activeIntegrations > 0 ? "Active" : "None"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              {stats.products === 0 && <p>• Add products to enable AI product recommendations</p>}
              {stats.knowledgeDocs === 0 && <p>• Create knowledge documents to improve AI responses</p>}
              {stats.activeIntegrations === 0 && <p>• Connect integrations like Stripe for payments</p>}
              <p>• Test AI responses with edge case questions</p>
              <p>• Monitor AI performance and adjust settings as needed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current AI Personality</CardTitle>
          <CardDescription>How your AI is configured to respond</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Tone</p>
              <Badge>{config.tone || "Friendly"}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">AI Model</p>
              <Badge>{config.aiModel || "Claude Sonnet 4"}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Commerce</p>
              <Badge className={config.enableCommerce ? "bg-green-600" : ""}>
                {config.enableCommerce ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Knowledge Base</p>
              <Badge className={config.aiKnowledgeBase ? "bg-green-600" : ""}>
                {config.aiKnowledgeBase ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Active Capabilities</p>
            <div className="flex flex-wrap gap-2">
              {config.enableCommerce && (
                <>
                  <Badge variant="outline">Search Products</Badge>
                  <Badge variant="outline">Process Payments</Badge>
                  <Badge variant="outline">Book Appointments</Badge>
                </>
              )}
              {config.aiKnowledgeBase && <Badge variant="outline">Knowledge Base Search</Badge>}
              <Badge variant="outline">Personalized Responses</Badge>
              {config.enableAutoHandoff && <Badge variant="outline">Auto Human Handoff</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
