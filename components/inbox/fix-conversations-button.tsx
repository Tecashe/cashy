"use client"

import { Button } from "@/components/ui/button"
import { Wrench } from "lucide-react"
import { fixConversationParticipants } from "@/actions/fix-conversation-data"
import { toast } from "sonner"
import { useState } from "react"

export function FixConversationsButton({
  userId,
  instagramAccountId,
}: {
  userId: string
  instagramAccountId: string
}) {
  const [isFixing, setIsFixing] = useState(false)

  const handleFix = async () => {
    setIsFixing(true)
    const result = await fixConversationParticipants(userId, instagramAccountId)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.error || "Failed to fix conversations")
    }
    setIsFixing(false)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleFix} disabled={isFixing} className="gap-2 bg-transparent">
      <Wrench className="h-4 w-4" />
      {isFixing ? "Fixing..." : "Fix Wrong Customer Data"}
    </Button>
  )
}
