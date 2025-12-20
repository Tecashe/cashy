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
        <Button
          size="sm"
          variant="outline"
          onClick={loadSuggestions}
          disabled={loading}
          className="gap-2 bg-transparent"
        >
          {loading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3" />
              Get AI Suggestions
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          <span>AI Suggestions</span>
        </div>
        <Button size="sm" variant="ghost" onClick={loadSuggestions} disabled={loading} className="h-6 px-2">
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelectSuggestion(suggestion)}
            className="w-full rounded-lg border border-purple-200 bg-purple-50/50 p-3 text-left text-sm hover:bg-purple-100/50 hover:border-purple-300 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
