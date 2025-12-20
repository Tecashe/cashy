// "use client"
// import { formatDistanceToNow } from "date-fns"
// import { cn } from "@/lib/utils"
// import { Badge } from "@/components/ui/badge"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Star, Circle } from "lucide-react"

// type Message = {
//   id: string
//   content: string
//   createdAt: Date
//   isFromUser: boolean
// }

// type Conversation = {
//   id: string
//   participantUsername: string
//   participantName: string | null
//   isRead: boolean
//   isAuto: boolean
//   starred: boolean
//   isArchived: boolean
//   lastMessageAt: Date
//   messages: Message[]
//   conversationTags: { tag: { id: string; name: string; color: string } }[]
//   _count: {
//     messages: number
//   }
// }

// interface ConversationListProps {
//   conversations: Conversation[]
//   currentConversationId?: string
//   selectionMode?: boolean
//   selectedIds?: string[]
//   onSelectionChange?: (ids: string[]) => void
//   onSelect?: (id: string) => void
// }

// export function ConversationList({
//   conversations,
//   currentConversationId,
//   selectionMode = false,
//   selectedIds = [],
//   onSelectionChange,
//   onSelect,
// }: ConversationListProps) {
//   const handleSelect = (id: string) => {
//     if (!onSelectionChange) return

//     if (selectedIds.includes(id)) {
//       onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id))
//     } else {
//       onSelectionChange([...selectedIds, id])
//     }
//   }

//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2)
//   }

//   return (
//     <div className="flex flex-col">
//       {conversations.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
//           <div className="bg-muted rounded-full p-4 mb-3">
//             <Circle className="h-8 w-8 text-muted-foreground" />
//           </div>
//           <h3 className="font-medium mb-1">No conversations</h3>
//           <p className="text-sm text-muted-foreground">
//             Your conversations will appear here when customers message you
//           </p>
//         </div>
//       ) : (
//         conversations.map((conversation) => {
//           const isSelected = selectedIds.includes(conversation.id)
//           const isActive = currentConversationId === conversation.id
//           const lastMessage = conversation.messages[0]
//           const tags = conversation.conversationTags.map((ct) => ct.tag)

//           return (
//             <button
//               key={conversation.id}
//               onClick={() => onSelect?.(conversation.id)}
//               className={cn(
//                 "flex items-start gap-3 p-4 border-b border-border hover:bg-accent/50 transition-colors text-left w-full",
//                 isActive && "bg-accent border-l-4 border-l-primary",
//                 !conversation.isRead && "bg-primary/5",
//               )}
//             >
//               {selectionMode && (
//                 <Checkbox
//                   checked={isSelected}
//                   onCheckedChange={() => handleSelect(conversation.id)}
//                   onClick={(e) => e.stopPropagation()}
//                 />
//               )}

//               <div className="relative">
//                 <Avatar className="h-12 w-12">
//                   <AvatarImage
//                     src={`https://avatar.vercel.sh/${conversation.participantUsername}`}
//                     alt={conversation.participantName || conversation.participantUsername}
//                   />
//                   <AvatarFallback className="font-semibold">
//                     {getInitials(conversation.participantName || conversation.participantUsername)}
//                   </AvatarFallback>
//                 </Avatar>
//                 {!conversation.isRead && (
//                   <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-card" />
//                 )}
//               </div>

//               <div className="flex-1 min-w-0">
//                 <div className="flex items-start justify-between gap-2 mb-1">
//                   <div className="flex items-center gap-2 min-w-0 flex-1">
//                     <h3 className={cn("font-medium truncate", !conversation.isRead && "font-semibold")}>
//                       {conversation.participantName || conversation.participantUsername}
//                     </h3>
//                     {conversation.starred && <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 shrink-0" />}
//                   </div>
//                   <time className="text-xs text-muted-foreground shrink-0">
//                     {formatDistanceToNow(new Date(conversation.lastMessageAt), {
//                       addSuffix: true,
//                     })}
//                   </time>
//                 </div>

//                 <p className="text-xs text-muted-foreground mb-2">@{conversation.participantUsername}</p>

//                 {lastMessage && (
//                   <p
//                     className={cn(
//                       "text-sm truncate mb-2",
//                       !conversation.isRead ? "text-foreground font-medium" : "text-muted-foreground",
//                     )}
//                   >
//                     <span className="font-medium">{lastMessage.isFromUser ? "" : "You: "}</span>
//                     {lastMessage.content}
//                   </p>
//                 )}

//                 <div className="flex items-center gap-2 flex-wrap">
//                   {!conversation.isRead && (
//                     <Badge variant="default" className="text-xs h-5">
//                       New
//                     </Badge>
//                   )}
//                   {tags.slice(0, 2).map((tag) => (
//                     <Badge
//                       key={tag.id}
//                       variant="outline"
//                       className="text-xs h-5"
//                       style={{
//                         backgroundColor: `${tag.color}10`,
//                         borderColor: tag.color,
//                         color: tag.color,
//                       }}
//                     >
//                       {tag.name}
//                     </Badge>
//                   ))}
//                   {tags.length > 2 && <span className="text-xs text-muted-foreground">+{tags.length - 2}</span>}
//                 </div>
//               </div>
//             </button>
//           )
//         })
//       )}
//     </div>
//   )
// }
"use client"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"
import { Star, Circle, Clock, MessageSquare, Bot } from "lucide-react"

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
    <div className="flex flex-col divide-y divide-border/50">
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-xl" />
            <div className="relative bg-muted rounded-full p-6">
              <MessageSquare className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-2">No conversations yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm text-balance">
            Your Instagram DM conversations will appear here when customers message you
          </p>
        </div>
      ) : (
        conversations.map((conversation) => {
          const isSelected = selectedIds.includes(conversation.id)
          const isActive = currentConversationId === conversation.id
          const lastMessage = conversation.messages[0]
          const tags = conversation.conversationTags.map((ct) => ct.tag)

          return (
            <HoverCard key={conversation.id} openDelay={300}>
              <HoverCardTrigger asChild>
                <button
                  onClick={() => onSelect?.(conversation.id)}
                  className={cn(
                    "group flex items-start gap-3 p-4 hover:bg-accent/70 transition-all duration-200 text-left w-full relative",
                    "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:scale-y-0 before:transition-transform",
                    isActive && "bg-accent/50 before:scale-y-100 shadow-sm",
                    !conversation.isRead && "bg-primary/5 font-medium",
                  )}
                >
                  {selectionMode && (
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleSelect(conversation.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1 data-[state=checked]:bg-primary"
                    />
                  )}

                  <div className="relative">
                    <Avatar
                      className={cn(
                        "h-12 w-12 ring-2 ring-offset-2 ring-offset-background transition-all",
                        isActive ? "ring-primary" : "ring-transparent group-hover:ring-primary/50",
                      )}
                    >
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${conversation.participantUsername}`}
                        alt={conversation.participantName || conversation.participantUsername}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-sm">
                        {getInitials(conversation.participantName || conversation.participantUsername)}
                      </AvatarFallback>
                    </Avatar>
                    {!conversation.isRead && (
                      <div className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-primary rounded-full border-2 border-background animate-pulse" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <h3 className={cn("font-semibold truncate text-sm", !conversation.isRead && "text-foreground")}>
                          {conversation.participantName || conversation.participantUsername}
                        </h3>
                        {conversation.starred && (
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0 animate-in zoom-in duration-200" />
                        )}
                        {conversation.isAuto && <Bot className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </div>
                      <time className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(conversation.lastMessageAt), {
                          addSuffix: false,
                        })}
                      </time>
                    </div>

                    <p className="text-xs text-muted-foreground">@{conversation.participantUsername}</p>

                    {lastMessage && (
                      <p
                        className={cn(
                          "text-sm line-clamp-2 leading-relaxed",
                          !conversation.isRead ? "text-foreground font-medium" : "text-muted-foreground",
                        )}
                      >
                        {!lastMessage.isFromUser && <span className="text-primary font-semibold">You: </span>}
                        {lastMessage.content}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {!conversation.isRead && (
                        <Badge variant="default" className="text-xs h-5 px-2 font-medium shadow-sm">
                          New
                        </Badge>
                      )}
                      {tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-xs h-5 px-2 font-medium transition-all hover:scale-105"
                          style={{
                            backgroundColor: `${tag.color}15`,
                            borderColor: tag.color,
                            color: tag.color,
                          }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                      {tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs h-5 px-2">
                          +{tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              </HoverCardTrigger>

              <HoverCardContent className="w-80" side="right" align="start">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-border">
                      <AvatarImage src={`https://avatar.vercel.sh/${conversation.participantUsername}`} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold">
                        {getInitials(conversation.participantName || conversation.participantUsername)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">
                        {conversation.participantName || conversation.participantUsername}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">@{conversation.participantUsername}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Messages</p>
                      <p className="font-semibold flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {conversation._count.messages}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Mode</p>
                      <p className="font-semibold flex items-center gap-1">
                        {conversation.isAuto ? <Bot className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                        {conversation.isAuto ? "Auto" : "Manual"}
                      </p>
                    </div>
                  </div>

                  {tags.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">Tags</p>
                        <div className="flex flex-wrap gap-1.5">
                          {tags.map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className="text-xs"
                              style={{
                                backgroundColor: `${tag.color}15`,
                                borderColor: tag.color,
                                color: tag.color,
                              }}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          )
        })
      )}
    </div>
  )
}
