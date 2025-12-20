"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect, useTransition } from "react"
import { getConversations, getTags } from "@/actions/conversation-actions"
import { ConversationList } from "@/components/inbox/conversation-list"
import { InboxFilters } from "@/components/inbox/inbox-filters"
import { Button } from "@/components/ui/button"
import { RefreshCw, Inbox } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

type Conversation = any // Use the actual type from your actions

interface ConversationListPanelProps {
  userId: string
  instagramAccountId: string
  selectedConversationId?: string
  onConversationSelect: (id: string) => void
}

export function ConversationListPanel({
  userId,
  instagramAccountId,
  selectedConversationId,
  onConversationSelect,
}: ConversationListPanelProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [isLoading, startTransition] = useTransition()
  const [filters, setFilters] = useState<any>({})

  const loadConversations = () => {
    startTransition(async () => {
      const [convResult, tagsResult] = await Promise.all([
        getConversations({ ...filters, userId, instagramAccountId }),
        getTags(userId),
      ])

      if (convResult.success) {
        setConversations(
          (convResult.conversations || []).filter(
            (c): c is typeof c & { lastMessageAt: Date } => c.lastMessageAt !== null,
          ),
        )
      }

      if (tagsResult.success) {
        setTags(tagsResult.tags || [])
      }
    })
  }

  useEffect(() => {
    loadConversations()
  }, [userId, instagramAccountId, filters])

  const unreadCount = conversations.filter((c) => !c.isRead).length

  return (
    <>
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="font-semibold">All Conversations</h2>
              <p className="text-xs text-muted-foreground">
                {conversations.length} total
                {unreadCount > 0 && ` • ${unreadCount} unread`}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={loadConversations} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <InboxFilters onFilterChange={setFilters} tags={tags} />

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <ConversationList
          conversations={conversations}
          currentConversationId={selectedConversationId}
          onSelect={onConversationSelect}
        />
      </ScrollArea>
    </>
  )
}
