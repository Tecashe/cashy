// "use client"

// import { cn } from "@/lib/utils"
// import { useState, useEffect, useTransition } from "react"
// import { getConversations, getTags } from "@/actions/conversation-actions"
// import { ConversationList } from "@/components/inbox/conversation-list"
// import { AdvancedFiltersPanel } from "@/components/inbox/advanced-filters-panel"
// import { BulkActionsBar } from "@/components/inbox/bulk-actions-bar"
// import { TemplatesModal } from "@/components/inbox/templates-modal"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { RefreshCw, Inbox, MoreVertical, FileText, SlidersHorizontal } from "lucide-react"
// import { ScrollArea } from "@/components/ui/scroll-area"

// type Conversation = any // Use the actual type from your actions

// interface ConversationListPanelProps {
//   userId: string
//   instagramAccountId: string
//   selectedConversationId?: string
//   onConversationSelect: (id: string) => void
// }

// export function ConversationListPanel({
//   userId,
//   instagramAccountId,
//   selectedConversationId,
//   onConversationSelect,
// }: ConversationListPanelProps) {
//   const [conversations, setConversations] = useState<Conversation[]>([])
//   const [tags, setTags] = useState<any[]>([])
//   const [isLoading, startTransition] = useTransition()
//   const [filters, setFilters] = useState<any>({})
//   const [selectedIds, setSelectedIds] = useState<string[]>([])
//   const [showTemplates, setShowTemplates] = useState(false)

//   const loadConversations = () => {
//     startTransition(async () => {
//       const [convResult, tagsResult] = await Promise.all([
//         getConversations({ ...filters, userId, instagramAccountId }),
//         getTags(userId),
//       ])

//       if (convResult.success) {
//         setConversations(
//           (convResult.conversations || []).filter(
//             (c): c is typeof c & { lastMessageAt: Date } => c.lastMessageAt !== null,
//           ),
//         )
//       }

//       if (tagsResult.success) {
//         setTags(tagsResult.tags || [])
//       }
//     })
//   }

//   useEffect(() => {
//     loadConversations()
//   }, [userId, instagramAccountId, filters])

//   const unreadCount = conversations.filter((c) => !c.isRead).length

//   return (
//     <>
//       <div className="border-b border-border/50 p-3 md:p-4 bg-card/80 backdrop-blur-xl">
//         <div className="flex items-center justify-between mb-2 md:mb-3">
//           <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
//             <div className="p-1.5 md:p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
//               <Inbox className="h-4 w-4 md:h-5 md:w-5 text-primary" />
//             </div>
//             <div className="min-w-0 flex-1">
//               <h2 className="font-semibold text-sm md:text-base truncate">All Conversations</h2>
//               <p className="text-xs text-muted-foreground hidden sm:block">
//                 {conversations.length} total
//                 {unreadCount > 0 && <span className="text-primary font-medium"> • {unreadCount} unread</span>}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-1 md:gap-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={loadConversations}
//               disabled={isLoading}
//               className="h-8 w-8 md:h-9 md:w-9"
//             >
//               <RefreshCw className={cn("h-3.5 w-3.5 md:h-4 md:w-4", isLoading && "animate-spin")} />
//             </Button>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="icon" className="h-8 w-8 md:h-9 md:w-9 shadow-sm bg-transparent">
//                   <MoreVertical className="h-3.5 w-3.5 md:h-4 md:w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56 backdrop-blur-xl bg-card/95">
//                 <DropdownMenuItem onClick={() => setShowTemplates(true)}>
//                   <FileText className="h-4 w-4 mr-2" />
//                   Manage Templates
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>
//                   <SlidersHorizontal className="h-4 w-4 mr-2" />
//                   Filter Settings
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </div>

//       <BulkActionsBar
//         selectedIds={selectedIds}
//         onClearSelection={() => setSelectedIds([])}
//         onActionComplete={loadConversations}
//         userId={userId}
//         availableTags={tags}
//       />

//       {/* Advanced Filters Panel */}
//       <AdvancedFiltersPanel onFiltersChange={setFilters} currentFilters={filters} tags={tags} />

//       {/* Conversation List */}
//       <ScrollArea className="flex-1">
//         <ConversationList
//           conversations={conversations}
//           currentConversationId={selectedConversationId}
//           onSelect={onConversationSelect}
//           selectedIds={selectedIds}
//           onSelectionChange={setSelectedIds}
//         />
//       </ScrollArea>

//       <TemplatesModal open={showTemplates} onOpenChange={setShowTemplates} userId={userId} />
//     </>
//   )
// }


"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect, useTransition } from "react"
import { getConversations, getTags } from "@/actions/conversation-actions"
import { ConversationList } from "@/components/inbox/conversation-list"
import { AdvancedFiltersPanel } from "@/components/inbox/advanced-filters-panel"
import { BulkActionsBar } from "@/components/inbox/bulk-actions-bar"
import { TemplatesModal } from "@/components/inbox/templates-modal"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RefreshCw, Inbox, MoreVertical, FileText, SlidersHorizontal } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

type Conversation = any

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
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showTemplates, setShowTemplates] = useState(false)

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
      <div className="border-b border-border/50 p-3 md:p-4 bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <div className="p-1.5 md:p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <Inbox className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-sm md:text-base truncate">All Conversations</h2>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {conversations.length} total
                {unreadCount > 0 && <span className="text-primary font-medium"> • {unreadCount} unread</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={loadConversations}
              disabled={isLoading}
              className="h-8 w-8 md:h-9 md:w-9"
            >
              <RefreshCw className={cn("h-3.5 w-3.5 md:h-4 md:w-4", isLoading && "animate-spin")} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 md:h-9 md:w-9 shadow-sm bg-transparent">
                  <MoreVertical className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 backdrop-blur-xl bg-card/95">
                <DropdownMenuItem onClick={() => setShowTemplates(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Templates
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filter Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <BulkActionsBar
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
        onActionComplete={loadConversations}
        userId={userId}
        availableTags={tags}
      />

      <AdvancedFiltersPanel onFiltersChange={setFilters} currentFilters={filters} tags={tags} />

      <ScrollArea className="flex-1">
        <ConversationList
          conversations={conversations}
          currentConversationId={selectedConversationId}
          onSelect={onConversationSelect}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </ScrollArea>

      <TemplatesModal open={showTemplates} onOpenChange={setShowTemplates} userId={userId} />
    </>
  )
}
