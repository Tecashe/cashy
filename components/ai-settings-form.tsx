"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateAISettings } from "@/lib/actions/ai-settings-actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Save, Sparkles } from "lucide-react"

interface AISettingsFormProps {
  settings: {
    businessDescription: string | null
    aiEnabled: boolean
    aiInstructions: string | null
    aiTone: string | null
    aiPersonality: string | null
  }
}

export function AISettingsForm({ settings }: AISettingsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [businessDescription, setBusinessDescription] = useState(settings.businessDescription || "")
  const [aiEnabled, setAiEnabled] = useState(settings.aiEnabled)
  const [aiInstructions, setAiInstructions] = useState(settings.aiInstructions || "")
  const [aiTone, setAiTone] = useState(settings.aiTone || "professional")
  const [aiPersonality, setAiPersonality] = useState(settings.aiPersonality || "")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!businessDescription.trim() && aiEnabled) {
      toast({
        title: "Error",
        description: "Please provide a business description to enable AI responses",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      await updateAISettings({
        businessDescription,
        aiEnabled,
        aiInstructions,
        aiTone,
        aiPersonality,
      })

      toast({
        title: "Success",
        description: "AI settings updated successfully",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enable AI Responses</CardTitle>
          <CardDescription>Allow AI to automatically respond to customer messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>AI Responses</Label>
              <p className="text-sm text-muted-foreground">Automatically generate responses using AI in automations</p>
            </div>
            <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Tell the AI about your business to generate better responses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessDescription">Business Description *</Label>
            <Textarea
              id="businessDescription"
              placeholder="Describe your business, products, services, and what makes you unique..."
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              rows={6}
              disabled={!aiEnabled}
            />
            <p className="text-xs text-muted-foreground">
              Be specific about your offerings, target audience, and key selling points. This helps the AI understand
              your business context.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Personality</CardTitle>
          <CardDescription>Customize how the AI communicates with your customers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aiTone">Response Tone</Label>
            <Select value={aiTone} onValueChange={setAiTone} disabled={!aiEnabled}>
              <SelectTrigger id="aiTone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aiPersonality">Personality Traits (Optional)</Label>
            <Textarea
              id="aiPersonality"
              placeholder="e.g., Helpful, patient, knowledgeable about fashion, uses occasional emojis"
              value={aiPersonality}
              onChange={(e) => setAiPersonality(e.target.value)}
              rows={3}
              disabled={!aiEnabled}
            />
            <p className="text-xs text-muted-foreground">
              Describe personality traits, communication style, or any specific behaviors
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Instructions</CardTitle>
          <CardDescription>Add specific guidelines for AI responses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aiInstructions">AI Instructions (Optional)</Label>
            <Textarea
              id="aiInstructions"
              placeholder="e.g., Always mention our free shipping policy, Don't discuss pricing without human approval, Direct technical questions to support team"
              value={aiInstructions}
              onChange={(e) => setAiInstructions(e.target.value)}
              rows={5}
              disabled={!aiEnabled}
            />
            <p className="text-xs text-muted-foreground">
              Provide specific do's and don'ts, topics to avoid, or standard responses for common scenarios
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Pro Tips
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Be specific about what the AI should and shouldn't discuss</li>
              <li>Include common FAQs and their ideal responses</li>
              <li>Set boundaries for complex topics that need human intervention</li>
              <li>Define your brand voice and key messaging points</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
