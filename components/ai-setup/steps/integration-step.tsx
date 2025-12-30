"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, CheckCircle2, ExternalLink, Info, Loader2 } from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  icon: string
  isRequired: boolean
  isConnected: boolean
  capabilities: string[]
  setupUrl?: string
}

interface IntegrationStepProps {
  data?: any
  onComplete: (data: any) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const AVAILABLE_INTEGRATIONS: Integration[] = [
  {
    id: "stripe",
    name: "Stripe Payments",
    description: "Process payments and create payment links automatically",
    icon: "💳",
    isRequired: false,
    isConnected: false,
    capabilities: ["Create payment links", "Process orders", "Handle refunds"],
    setupUrl: "https://stripe.com",
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    description: "Schedule appointments and manage bookings",
    icon: "📅",
    isRequired: false,
    isConnected: false,
    capabilities: ["Book appointments", "Send reminders", "Sync availability"],
    setupUrl: "https://calendar.google.com",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    description: "Powers the AI responses (Required)",
    icon: "🤖",
    isRequired: true,
    isConnected: false,
    capabilities: ["AI conversations", "Natural language understanding", "Function calling"],
  },
  {
    id: "mcp_servers",
    name: "MCP Servers",
    description: "Connect external tools via Model Context Protocol",
    icon: "🔌",
    isRequired: false,
    isConnected: false,
    capabilities: ["Extended AI capabilities", "Custom tool integration", "Advanced workflows"],
  },
]

export function IntegrationStep({ data, onComplete, onNext, onBack, onSkip }: IntegrationStepProps) {
  const [integrations, setIntegrations] = useState<Integration[]>(data?.integrations || AVAILABLE_INTEGRATIONS)
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(data?.apiKeys || {})
  const [testingConnection, setTestingConnection] = useState<string | null>(null)

  const handleApiKeyChange = (integrationId: string, value: string) => {
    setApiKeys({ ...apiKeys, [integrationId]: value })
  }

  const handleTestConnection = async (integrationId: string) => {
    setTestingConnection(integrationId)
    // Simulate API key validation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIntegrations(integrations.map((int) => (int.id === integrationId ? { ...int, isConnected: true } : int)))
    setTestingConnection(null)
  }

  const handleContinue = () => {
    onComplete({ integrations, apiKeys })
    onNext()
  }

  const handleSkipStep = () => {
    onComplete({ integrations: [], apiKeys: {} })
    onSkip()
  }

  const requiredIntegration = integrations.find((i) => i.isRequired)
  const canContinue = requiredIntegration?.isConnected

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Connect services to unlock AI capabilities</p>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              <li>Anthropic Claude API is required for AI responses</li>
              <li>Stripe enables payment processing in DMs</li>
              <li>Google Calendar allows automatic appointment booking</li>
              <li>MCP servers extend AI with custom tools (optional, advanced)</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className={integration.isRequired ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{integration.icon}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      {integration.isRequired && (
                        <Badge variant="destructive" className="text-xs">
                          Required
                        </Badge>
                      )}
                      {integration.isConnected && (
                        <Badge variant="default" className="text-xs bg-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Capabilities:</p>
                <div className="flex flex-wrap gap-2">
                  {integration.capabilities.map((cap) => (
                    <Badge key={cap} variant="secondary" className="text-xs">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </div>

              {!integration.isConnected && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor={`${integration.id}-key`}>API Key {integration.isRequired && "*"}</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`${integration.id}-key`}
                        type="password"
                        placeholder={`Enter your ${integration.name} API key`}
                        value={apiKeys[integration.id] || ""}
                        onChange={(e) => handleApiKeyChange(integration.id, e.target.value)}
                      />
                      <Button
                        onClick={() => handleTestConnection(integration.id)}
                        disabled={!apiKeys[integration.id] || testingConnection === integration.id}
                        variant="secondary"
                      >
                        {testingConnection === integration.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Testing
                          </>
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Get your API key from{" "}
                      {integration.setupUrl ? (
                        <a
                          href={integration.setupUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          {integration.name}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        "the provider's dashboard"
                      )}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} size="lg">
          Back
        </Button>
        <div className="flex gap-2">
          {!canContinue && (
            <Button variant="ghost" onClick={handleSkipStep} size="lg">
              I'll Set This Up Later
            </Button>
          )}
          <Button onClick={handleContinue} disabled={!canContinue} size="lg">
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
