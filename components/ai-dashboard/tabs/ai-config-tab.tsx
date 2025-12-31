"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Info, Save, Sparkles, Loader2 } from "lucide-react"
import { AI_TONES } from "@/lib/constants/utomation-constants"
import { getOrCreateDefaultAutomation, updateAIConfig } from "@/actions/ai-setup-actions"
import { useToast } from "@/hooks/use-toast"

const AI_MODELS = [
  {
    value: "claude-sonnet-4",
    label: "Claude Sonnet 4",
    description: "Best balance of speed and quality (Recommended)",
    provider: "Anthropic",
  },
  {
    value: "claude-opus-4",
    label: "Claude Opus 4",
    description: "Most capable, best for complex tasks",
    provider: "Anthropic",
  },
  {
    value: "claude-haiku-4",
    label: "Claude Haiku 4",
    description: "Fastest, great for simple responses",
    provider: "Anthropic",
  },
  {
    value: "gpt-4o",
    label: "GPT-4o",
    description: "OpenAI's most advanced model",
    provider: "Vercel AI Gateway",
  },
  {
    value: "gpt-4o-mini",
    label: "GPT-4o Mini",
    description: "Fast and cost-effective",
    provider: "Vercel AI Gateway",
  },
]

export function AIConfigTab({ automationId }: { automationId: string | null }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [config, setConfig] = useState<Record<string, any>>({
    aiModel: "claude-sonnet-4",
    aiProvider: "anthropic",
    tone: "friendly",
    systemPrompt: "",
    aiInstructions: "",
    enableCommerce: false,
    maxOrderValue: 50000,
    requirePaymentConfirmation: true,
    aiKnowledgeBase: true,
    enableAutoHandoff: true,
    useEmojis: true,
  })

  useEffect(() => {
    loadConfig()
  }, [automationId])

  const loadConfig = async () => {
    try {
      setLoading(true)
      const automation = await getOrCreateDefaultAutomation()
      const aiAction = automation.actions[0]

      if (aiAction?.content && typeof aiAction.content === "object") {
        const content = aiAction.content as Record<string, any>
        setConfig({
          aiModel: content.aiModel || "claude-sonnet-4",
          aiProvider: content.aiProvider || "anthropic",
          tone: content.tone || "friendly",
          systemPrompt: content.systemPrompt || "",
          aiInstructions: content.aiInstructions || "",
          enableCommerce: content.enableCommerce || false,
          maxOrderValue: content.maxOrderValue || 50000,
          requirePaymentConfirmation: content.requirePaymentConfirmation ?? true,
          aiKnowledgeBase: content.aiKnowledgeBase ?? true,
          enableAutoHandoff: content.enableAutoHandoff ?? true,
          useEmojis: content.useEmojis ?? true,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load AI configuration",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!automationId) {
      toast({
        title: "Error",
        description: "Automation not found",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      await updateAIConfig(automationId, config)
      toast({
        title: "Configuration saved",
        description: "Your AI settings have been updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const selectedModel = AI_MODELS.find((m) => m.value === config.aiModel)

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
          <p className="font-medium mb-2">These settings control how your AI responds to customers</p>
          <p className="text-sm">
            Changes take effect immediately. Test your AI after making changes to ensure it responds as expected.
          </p>
        </AlertDescription>
      </Alert>

      {/* AI Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Model Selection
          </CardTitle>
          <CardDescription>Choose which AI model powers your assistant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>AI Model</Label>
            <Select value={config.aiModel} onValueChange={(value) => setConfig({ ...config, aiModel: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{model.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {model.provider}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedModel && (
              <div className="p-3 bg-muted rounded-lg mt-2">
                <p className="text-sm font-medium">Currently using: {selectedModel.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{selectedModel.description}</p>
                <p className="text-xs text-muted-foreground mt-1">Provider: {selectedModel.provider}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personality & Tone */}
      <Card>
        <CardHeader>
          <CardTitle>AI Personality</CardTitle>
          <CardDescription>How the AI talks to your customers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Conversation Tone</Label>
            <Select value={config.tone} onValueChange={(value) => setConfig({ ...config, tone: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_TONES.map((tone) => (
                  <SelectItem key={tone.value} value={tone.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{tone.label}</span>
                      <span className="text-xs text-muted-foreground">{tone.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Custom AI Personality (Optional)</Label>
            <Textarea
              placeholder="You are a helpful assistant for a boutique fashion store..."
              value={config.systemPrompt}
              onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Override the default personality. Leave blank to use the tone setting above.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Additional Instructions</Label>
            <Textarea
              placeholder="Always mention our 30-day return policy..."
              value={config.aiInstructions}
              onChange={(e) => setConfig({ ...config, aiInstructions: e.target.value })}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Add specific rules or information the AI should always remember.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Commerce Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Commerce Capabilities</CardTitle>
          <CardDescription>Enable AI to handle sales and bookings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Commerce Features</Label>
              <p className="text-sm text-muted-foreground">
                AI can search products, process payments, and book appointments
              </p>
            </div>
            <Switch
              checked={config.enableCommerce}
              onCheckedChange={(checked) => setConfig({ ...config, enableCommerce: checked })}
            />
          </div>

          {config.enableCommerce && (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Payment Confirmation</Label>
                <p className="text-sm text-muted-foreground">Ask customer to confirm before processing payment</p>
              </div>
              <Switch
                checked={config.requirePaymentConfirmation}
                onCheckedChange={(checked) => setConfig({ ...config, requirePaymentConfirmation: checked })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Behavior Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Use Knowledge Base</Label>
              <p className="text-sm text-muted-foreground">Search knowledge base when answering questions</p>
            </div>
            <Switch
              checked={config.aiKnowledgeBase}
              onCheckedChange={(checked) => setConfig({ ...config, aiKnowledgeBase: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Handoff to Human</Label>
              <p className="text-sm text-muted-foreground">Transfer to human if customer is frustrated</p>
            </div>
            <Switch
              checked={config.enableAutoHandoff}
              onCheckedChange={(checked) => setConfig({ ...config, enableAutoHandoff: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Use Emojis</Label>
              <p className="text-sm text-muted-foreground">Add emojis to responses for warmth</p>
            </div>
            <Switch
              checked={config.useEmojis}
              onCheckedChange={(checked) => setConfig({ ...config, useEmojis: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} size="lg" className="w-full" disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
        Save AI Configuration
      </Button>
    </div>
  )
}
