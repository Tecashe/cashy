"use client"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Circle } from "lucide-react"

type Message = {
  id: string
  content: string
  createdAt: Date
  isFromUser: boolean
}

type Conversation = {
  id: string
  participantUsername: string
  participantName: string | null
  isRead: boolean
  isAuto: boolean
  starred: boolean
  isArchived: boolean
  lastMessageAt: Date
  messages: Message[]
  conversationTags: { tag: { id: string; name: string; color: string } }[]
  _count: {
    messages: number
  }
}

interface ConversationListProps {
  conversations: Conversation[]
  currentConversationId?: string
  selectionMode?: boolean
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  onSelect?: (id: string) => void
}

export function ConversationList({
  conversations,
  currentConversationId,
  selectionMode = false,
  selectedIds = [],
  onSelectionChange,
  onSelect,
}: ConversationListProps) {
  const handleSelect = (id: string) => {
    if (!onSelectionChange) return

    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex flex-col">
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="bg-muted rounded-full p-4 mb-3">
            <Circle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-1">No conversations</h3>
          <p className="text-sm text-muted-foreground">
            Your conversations will appear here when customers message you
          </p>
        </div>
      ) : (
        conversations.map((conversation) => {
          const isSelected = selectedIds.includes(conversation.id)
          const isActive = currentConversationId === conversation.id
          const lastMessage = conversation.messages[0]
          const tags = conversation.conversationTags.map((ct) => ct.tag)

          return (
            <button
              key={conversation.id}
              onClick={() => onSelect?.(conversation.id)}
              className={cn(
                "flex items-start gap-3 p-4 border-b border-border hover:bg-accent/50 transition-colors text-left w-full",
                isActive && "bg-accent border-l-4 border-l-primary",
                !conversation.isRead && "bg-primary/5",
              )}
            >
              {selectionMode && (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleSelect(conversation.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${conversation.participantUsername}`}
                    alt={conversation.participantName || conversation.participantUsername}
                  />
                  <AvatarFallback className="font-semibold">
                    {getInitials(conversation.participantName || conversation.participantUsername)}
                  </AvatarFallback>
                </Avatar>
                {!conversation.isRead && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-card" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <h3 className={cn("font-medium truncate", !conversation.isRead && "font-semibold")}>
                      {conversation.participantName || conversation.participantUsername}
                    </h3>
                    {conversation.starred && <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 shrink-0" />}
                  </div>
                  <time className="text-xs text-muted-foreground shrink-0">
                    {formatDistanceToNow(new Date(conversation.lastMessageAt), {
                      addSuffix: true,
                    })}
                  </time>
                </div>

                <p className="text-xs text-muted-foreground mb-2">@{conversation.participantUsername}</p>

                {lastMessage && (
                  <p
                    className={cn(
                      "text-sm truncate mb-2",
                      !conversation.isRead ? "text-foreground font-medium" : "text-muted-foreground",
                    )}
                  >
                    <span className="font-medium">{lastMessage.isFromUser ? "" : "You: "}</span>
                    {lastMessage.content}
                  </p>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  {!conversation.isRead && (
                    <Badge variant="default" className="text-xs h-5">
                      New
                    </Badge>
                  )}
                  {tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="text-xs h-5"
                      style={{
                        backgroundColor: `${tag.color}10`,
                        borderColor: tag.color,
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                  {tags.length > 2 && <span className="text-xs text-muted-foreground">+{tags.length - 2}</span>}
                </div>
              </div>
            </button>
          )
        })
      )}
    </div>
  )
}
