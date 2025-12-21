"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw, Loader2 } from "lucide-react"
import { generateAISuggestions } from "@/actions/ai-actions"
import { toast } from "sonner"
import { UpgradePrompt } from "./upgrade-prompt"

interface AISuggestionsPanelProps {
  conversationId: string
  userId: string
  onSelectSuggestion: (text: string) => void
}

export function AISuggestionsPanel({ conversationId, userId, onSelectSuggestion }: AISuggestionsPanelProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  const loadSuggestions = async () => {
    setLoading(true)
    try {
      const result = await generateAISuggestions(conversationId, userId)

      if (result.requiresUpgrade) {
        setShowUpgrade(true)
        return
      }

      if (result.success && result.suggestions) {
        setSuggestions(result.suggestions)
        if (!result.cached) {
          toast.success("AI suggestions generated!")
        }
      } else {
        toast.error(result.error || "Failed to generate suggestions")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (suggestions.length === 0) {
    return (
      <>
        <Button size="sm" onClick={loadSuggestions} disabled={loading} className="gap-2 w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating AI suggestions...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate AI Suggestions
            </>
          )}
        </Button>
        <UpgradePrompt
          open={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          feature="AI Smart Replies"
          description="AI-powered response suggestions"
        />
      </>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">{suggestions.length} suggestions</span>
        <Button size="sm" variant="ghost" onClick={loadSuggestions} disabled={loading} className="h-7 px-2">
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelectSuggestion(suggestion)}
            className="w-full rounded-lg border bg-background p-3 text-left text-sm hover:bg-accent transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
