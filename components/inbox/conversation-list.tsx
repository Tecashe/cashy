"use client"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Mail } from "lucide-react"
import Link from "next/link"

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
}

export function ConversationList({
  conversations,
  currentConversationId,
  selectionMode = false,
  selectedIds = [],
  onSelectionChange,
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
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Mail className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No conversations found</h3>
          <p className="text-sm text-muted-foreground mt-1">Start a conversation to see it here</p>
        </div>
      ) : (
        conversations.map((conversation) => {
          const isSelected = selectedIds.includes(conversation.id)
          const isActive = currentConversationId === conversation.id
          const lastMessage = conversation.messages[0]
          const tags = conversation.conversationTags.map((ct) => ct.tag)

          return (
            <Link
              key={conversation.id}
              href={`/inbox/${conversation.id}`}
              className={cn(
                "flex items-start gap-3 p-4 border-b border-border hover:bg-accent/50 transition-colors",
                isActive && "bg-accent",
                !conversation.isRead && "bg-muted/30",
              )}
            >
              {selectionMode && (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleSelect(conversation.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              <Avatar className="h-10 w-10 mt-1">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${conversation.participantUsername}`}
                  alt={conversation.participantName || conversation.participantUsername}
                />
                <AvatarFallback>
                  {getInitials(conversation.participantName || conversation.participantUsername)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <h3 className={cn("font-medium truncate", !conversation.isRead && "font-semibold")}>
                      {conversation.participantName || conversation.participantUsername}
                    </h3>
                    {conversation.starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0" />}
                  </div>
                  <time className="text-xs text-muted-foreground shrink-0">
                    {formatDistanceToNow(new Date(conversation.lastMessageAt), {
                      addSuffix: true,
                    })}
                  </time>
                </div>

                <p className="text-sm text-muted-foreground mb-2">@{conversation.participantUsername}</p>

                {lastMessage && (
                  <p
                    className={cn(
                      "text-sm truncate",
                      !conversation.isRead ? "text-foreground font-medium" : "text-muted-foreground",
                    )}
                  >
                    {lastMessage.isFromUser ? "Them: " : "You: "}
                    {lastMessage.content}
                  </p>
                )}

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="text-xs"
                        style={{
                          backgroundColor: `${tag.color}20`,
                          color: tag.color,
                          borderColor: `${tag.color}40`,
                        }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-2">
                  {!conversation.isRead && (
                    <Badge variant="default" className="text-xs">
                      Unread
                    </Badge>
                  )}
                  <Badge variant={conversation.isAuto ? "secondary" : "outline"} className="text-xs">
                    {conversation.isAuto ? "Auto" : "Manual"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{conversation._count.messages} messages</span>
                </div>
              </div>
            </Link>
          )
        })
      )}
    </div>
  )
}
