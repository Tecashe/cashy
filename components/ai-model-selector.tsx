"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AIModelConfig {
  model?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
}

interface AIModelSelectorProps {
  config: AIModelConfig
  onChange: (config: AIModelConfig) => void
}

export function AIModelSelector({ config, onChange }: AIModelSelectorProps) {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Configure your AI model to handle automated responses. Choose from various providers and customize behavior.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="ai-model">AI Model</Label>
        <Select
          value={config.model || "openai/gpt-4o-mini"}
          onValueChange={(value) => onChange({ ...config, model: value })}
        >
          <SelectTrigger id="ai-model">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai/gpt-4o-mini">GPT-4o Mini (Fast & Affordable)</SelectItem>
            <SelectItem value="openai/gpt-4o">GPT-4o (Most Capable)</SelectItem>
            <SelectItem value="anthropic/claude-sonnet-4.5">Claude Sonnet 4.5</SelectItem>
            <SelectItem value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
            <SelectItem value="xai/grok-4-fast">Grok 4 Fast</SelectItem>
            <SelectItem value="xai/grok-4">Grok 4</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Default models use Vercel AI Gateway. Custom models require API keys.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="system-prompt">System Prompt</Label>
        <Textarea
          id="system-prompt"
          placeholder="You are a helpful assistant for my business. Be friendly, professional, and concise."
          value={config.systemPrompt || ""}
          onChange={(e) => onChange({ ...config, systemPrompt: e.target.value })}
          className="min-h-[100px]"
        />
        <p className="text-xs text-muted-foreground">
          Define how the AI should behave and what it knows about your business
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="temperature">Creativity: {config.temperature?.toFixed(1) || "0.7"}</Label>
        </div>
        <Slider
          id="temperature"
          min={0}
          max={2}
          step={0.1}
          value={[config.temperature || 0.7]}
          onValueChange={(value) => onChange({ ...config, temperature: value[0] })}
        />
        <p className="text-xs text-muted-foreground">Lower = More consistent, Higher = More creative</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="max-tokens">Max Response Length</Label>
        <Select
          value={String(config.maxTokens || 250)}
          onValueChange={(value) => onChange({ ...config, maxTokens: Number.parseInt(value) })}
        >
          <SelectTrigger id="max-tokens">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100">Short (100 tokens)</SelectItem>
            <SelectItem value="250">Medium (250 tokens)</SelectItem>
            <SelectItem value="500">Long (500 tokens)</SelectItem>
            <SelectItem value="1000">Very Long (1000 tokens)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
