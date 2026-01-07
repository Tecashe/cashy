"use client"

import { Button } from "@/components/ui/button"
import { Bug } from "lucide-react"
import { debugConversationData } from "@/actions/fix-conversation-data"
import { toast } from "sonner"

export function ConversationDebugButton({ conversationId }: { conversationId: string }) {
  const handleDebug = async () => {
    const result = await debugConversationData(conversationId)
    if (result.success) {
      toast.success("Check browser console for debug data")
      console.log("[v0] Conversation Debug Data:", result.data)
    } else {
      toast.error("Debug failed")
    }
  }

  // Only show in developments
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDebug} className="gap-2">
      <Bug className="h-4 w-4" />
      Debug
    </Button>
  )
}
