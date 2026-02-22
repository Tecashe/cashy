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

// Provider icon components
function AnthropicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.304 3.541h-3.677l6.696 16.918h3.677L17.304 3.541zm-10.608 0L0 20.459h3.744l1.37-3.553h7.005l1.369 3.553h3.744L10.536 3.541H6.696zm.895 10.599L10.2 7.468l2.61 6.672H7.59z" />
    </svg>
  )
}

function OpenAIIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  )
}

function XAIIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.3 21.5L10.3 12L2.3 2.5h3.1l5.7 6.8L16.8 2.5h3.1L11.9 12l8.0 9.5h-3.1l-5.7-6.8-5.7 6.8H2.3z" />
    </svg>
  )
}

function MetaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.915 4.03c-1.968 0-3.308 1.168-4.14 2.457C1.957 7.777 1.5 9.27 1.5 10.4c0 1.313.5 2.407 1.4 3.107.88.686 2.1 1.043 3.515 1.043 1.068 0 2.15-.305 3.185-.996.626-.418 1.245-.98 1.87-1.7l.147-.17.148.17c.624.72 1.243 1.282 1.869 1.7 1.035.691 2.117.996 3.185.996 1.415 0 2.635-.357 3.515-1.043.9-.7 1.4-1.794 1.4-3.107 0-1.13-.458-2.623-1.276-3.913-.832-1.289-2.172-2.457-4.14-2.457-1.312 0-2.367.52-3.34 1.334-.476.398-.939.883-1.4 1.468-.46-.585-.923-1.07-1.399-1.468C9.282 4.55 8.227 4.03 6.915 4.03z" />
    </svg>
  )
}

function MistralIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="1" y="3" width="5" height="5" />
      <rect x="18" y="3" width="5" height="5" />
      <rect x="1" y="10" width="5" height="5" />
      <rect x="10" y="10" width="5" height="5" />
      <rect x="18" y="10" width="5" height="5" />
      <rect x="1" y="17" width="5" height="5" />
      <rect x="18" y="17" width="5" height="5" />
    </svg>
  )
}

function CohereIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  )
}

function DeepSeekIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}

const PROVIDER_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Anthropic: AnthropicIcon,
  OpenAI: OpenAIIcon,
  Google: GoogleIcon,
  xAI: XAIIcon,
  Meta: MetaIcon,
  Mistral: MistralIcon,
  Cohere: CohereIcon,
  DeepSeek: DeepSeekIcon,
}

const AI_MODELS = [
  // Anthropic
  { value: "claude-sonnet-4", label: "Claude Sonnet 4", description: "Best balance of speed and quality (Recommended)", provider: "Anthropic" },
  { value: "claude-opus-4", label: "Claude Opus 4", description: "Most capable, best for complex tasks", provider: "Anthropic" },
  { value: "claude-haiku-4", label: "Claude Haiku 4", description: "Fastest, great for simple responses", provider: "Anthropic" },
  // OpenAI
  { value: "gpt-4o", label: "GPT-4o", description: "OpenAI's flagship multimodal model", provider: "OpenAI" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini", description: "Fast and cost-effective", provider: "OpenAI" },
  { value: "o3", label: "o3", description: "Advanced reasoning model", provider: "OpenAI" },
  { value: "o4-mini", label: "o4-mini", description: "Efficient reasoning model", provider: "OpenAI" },
  // Google
  { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro", description: "Google's most capable model", provider: "Google" },
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", description: "Fast and efficient multimodal", provider: "Google" },
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash", description: "Speed-optimized model", provider: "Google" },
  // xAI (Grok)
  { value: "grok-3", label: "Grok 3", description: "xAI's flagship — witty & knowledgeable", provider: "xAI" },
  { value: "grok-3-mini", label: "Grok 3 Mini", description: "Lightweight Grok for fast responses", provider: "xAI" },
  // Meta (Llama)
  { value: "llama-4-scout", label: "Llama 4 Scout", description: "Meta's latest efficient model", provider: "Meta" },
  { value: "llama-4-maverick", label: "Llama 4 Maverick", description: "Meta's powerful open model", provider: "Meta" },
  { value: "llama-3.3-70b", label: "Llama 3.3 70B", description: "Strong open-source for most tasks", provider: "Meta" },
  // Mistral
  { value: "mistral-large", label: "Mistral Large", description: "Most capable Mistral model", provider: "Mistral" },
  { value: "mistral-medium", label: "Mistral Medium", description: "Balanced performance and cost", provider: "Mistral" },
  { value: "mistral-small", label: "Mistral Small", description: "Fast for simpler tasks", provider: "Mistral" },
  // Cohere
  { value: "command-r-plus", label: "Command R+", description: "Cohere's flagship, great for business", provider: "Cohere" },
  { value: "command-r", label: "Command R", description: "Efficient for retrieval tasks", provider: "Cohere" },
  // DeepSeek
  { value: "deepseek-r1", label: "DeepSeek R1", description: "Advanced reasoning from DeepSeek", provider: "DeepSeek" },
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
  const providers = Array.from(new Set(AI_MODELS.map((m) => m.provider)))

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

      {/* AI Model Selection — Card Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Model Selection
          </CardTitle>
          <CardDescription>Choose which AI model powers your assistant — {AI_MODELS.length} models from {providers.length} providers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {providers.map((provider) => {
            const ProviderIcon = PROVIDER_ICONS[provider]
            const models = AI_MODELS.filter((m) => m.provider === provider)

            return (
              <div key={provider} className="space-y-3">
                <div className="flex items-center gap-2">
                  {ProviderIcon && <ProviderIcon className="h-4 w-4" />}
                  <h4 className="font-semibold text-sm">{provider}</h4>
                  <Badge variant="outline" className="text-xs ml-auto">
                    {models.length} model{models.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {models.map((model) => {
                    const isSelected = config.aiModel === model.value
                    return (
                      <button
                        key={model.value}
                        onClick={() =>
                          setConfig({
                            ...config,
                            aiModel: model.value,
                            aiProvider: model.provider.toLowerCase(),
                          })
                        }
                        className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-sm"
                            : "border-border hover:border-primary/40 hover:bg-muted/50"
                          }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                          </div>
                        )}
                        <div className="flex items-center gap-2.5 mb-1.5">
                          {ProviderIcon && (
                            <ProviderIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className="font-medium text-sm">{model.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {model.description}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {selectedModel && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl mt-4">
              <div className="flex items-center gap-2 mb-1">
                {(() => {
                  const Icon = PROVIDER_ICONS[selectedModel.provider]
                  return Icon ? <Icon className="h-4 w-4" /> : null
                })()}
                <p className="text-sm font-semibold">Selected: {selectedModel.label}</p>
                <Badge variant="outline" className="text-xs ml-auto">
                  {selectedModel.provider}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{selectedModel.description}</p>
            </div>
          )}
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
