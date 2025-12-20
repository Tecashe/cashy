"use client"

import { useState, useEffect, useTransition } from "react"
import { getConversation } from "@/actions/conversation-actions"
import { ConversationHeader } from "@/components/inbox/conversation-header"
import { MessageThread } from "./message-thread"
import { MessageInput } from "./message-input"
import { CustomerTimelineSidebar } from "./customer-timeline-sidebar"
import { Loader2, ArrowLeft, PanelRightClose, PanelRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

interface ConversationViewProps {
  conversationId: string
  userId: string
  onBack?: () => void
}

export function ConversationView({ conversationId, userId, onBack }: ConversationViewProps) {
  const [conversation, setConversation] = useState<any>(null)
  const [isLoading, startTransition] = useTransition()
  const [showCustomerSidebar, setShowCustomerSidebar] = useState(true)
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
    const interval = setInterval(loadConversation, 10000)
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
    <div className="flex h-full bg-background">
      <div className="flex-1 flex flex-col">
        <div className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {isMobile && onBack && (
            <div className="border-b border-border/50 p-2">
              <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-accent/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <ConversationHeader conversation={conversation} />
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowCustomerSidebar(!showCustomerSidebar)}
              className="mr-2"
            >
              {showCustomerSidebar ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <MessageThread messages={conversation.messages} />

        <div className="border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <MessageInput conversationId={conversationId} userId={userId} onMessageSent={loadConversation} />
        </div>
      </div>

      {showCustomerSidebar && !isMobile && <CustomerTimelineSidebar conversation={conversation} userId={userId} />}
    </div>
  )
}
