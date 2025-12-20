"use client"

import { useState, useEffect, useTransition } from "react"
import { getConversation } from "@/actions/conversation-actions"
import { ConversationHeader } from "@/components/inbox/conversation-header"
import { MessageThread } from "@/components/inbox/message-thread"
import { MessageInput } from "@/components/inbox/message-input"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMobile } from "@/hooks/use-mobile"

interface ConversationViewProps {
  conversationId: string
  onBack?: () => void
}

export function ConversationView({ conversationId, onBack }: ConversationViewProps) {
  const [conversation, setConversation] = useState<any>(null)
  const [isLoading, startTransition] = useTransition()
  const isMobile = useMobile()

  const loadConversation = () => {
    startTransition(async () => {
      const result = await getConversation(conversationId)
      if (result.success) {
        setConversation(result.conversation)
      }
    })
  }

  useEffect(() => {
    loadConversation()
    // Poll for new messages every 5 seconds
    const interval = setInterval(loadConversation, 5000)
    return () => clearInterval(interval)
  }, [conversationId])

  if (isLoading && !conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Conversation not found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with back button on mobile */}
      <div className="border-b border-border">
        {isMobile && onBack && (
          <div className="border-b border-border p-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to conversations
            </Button>
          </div>
        )}
        <ConversationHeader conversation={conversation} />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <MessageThread messages={conversation.messages} />
      </ScrollArea>

      {/* Input */}
      <MessageInput conversationId={conversationId} onMessageSent={loadConversation} />
    </div>
  )
}
