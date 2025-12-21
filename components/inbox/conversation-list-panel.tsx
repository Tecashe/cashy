// "use client"

// import { cn } from "@/lib/utils"
// import { useState, useEffect, useTransition } from "react"
// import { getConversations, getTags } from "@/actions/conversation-actions"
// import { ConversationList } from "@/components/inbox/conversation-list"
// import { BulkActionsBar } from "@/components/inbox/bulk-actions-bar"
// import { TemplatesModal } from "@/components/inbox/templates-modal"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
//   DropdownMenuLabel,
//   DropdownMenuCheckboxItem,
// } from "@/components/ui/dropdown-menu"
// import { Badge } from "@/components/ui/badge"
// import { RefreshCw, SlidersHorizontal, FileText, Star, AlertCircle, Clock, Zap, Archive, X } from "lucide-react"
// import { ScrollArea } from "@/components/ui/scroll-area"

// type Conversation = any

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
//       console.log("[v0] Loading conversations with filters:", { ...filters, userId, instagramAccountId })

//       const [convResult, tagsResult] = await Promise.all([
//         getConversations({ ...filters, userId, instagramAccountId }),
//         getTags(userId),
//       ])

//       console.log("[v0] Conversations result:", convResult)

//       if (convResult.success) {
//         const allConversations = convResult.conversations || []
//         console.log("[v0] Total conversations:", allConversations.length)
//         setConversations(allConversations)
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
//   const activeFilterCount = Object.keys(filters).filter(
//     (key) => key !== "userId" && key !== "instagramAccountId",
//   ).length

//   const applyFilter = (newFilter: any) => {
//     setFilters((prev: any) => ({ ...prev, ...newFilter }))
//   }

//   const clearFilters = () => {
//     setFilters({})
//   }

//   return (
//     <>
//       <div className="border-b p-4 bg-background">
//         <div className="flex items-center justify-between mb-3">
//           <div className="min-w-0 flex-1">
//             <h2 className="font-semibold text-lg">Conversations</h2>
//             <p className="text-sm text-muted-foreground">
//               {conversations.length} total
//               {unreadCount > 0 && <span className="text-primary font-medium"> • {unreadCount} unread</span>}
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             <Button variant="ghost" size="icon" onClick={loadConversations} disabled={isLoading} className="h-9 w-9">
//               <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
//             </Button>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm" className="gap-2 bg-transparent">
//                   <SlidersHorizontal className="h-4 w-4" />
//                   Filters
//                   {activeFilterCount > 0 && (
//                     <Badge variant="default" className="ml-1 h-5 px-1.5">
//                       {activeFilterCount}
//                     </Badge>
//                   )}
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-64">
//                 <DropdownMenuLabel>Quick Filters</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuCheckboxItem
//                   checked={filters.priority === "high"}
//                   onCheckedChange={(checked) => applyFilter({ priority: checked ? "high" : undefined })}
//                 >
//                   <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
//                   High Priority
//                 </DropdownMenuCheckboxItem>
//                 <DropdownMenuCheckboxItem
//                   checked={filters.isRead === false}
//                   onCheckedChange={(checked) => applyFilter({ isRead: checked ? false : undefined })}
//                 >
//                   <Clock className="h-4 w-4 mr-2 text-orange-500" />
//                   Needs Response
//                 </DropdownMenuCheckboxItem>
//                 <DropdownMenuCheckboxItem
//                   checked={filters.isVip === true}
//                   onCheckedChange={(checked) => applyFilter({ isVip: checked ? true : undefined })}
//                 >
//                   <Star className="h-4 w-4 mr-2 text-yellow-500" />
//                   VIP Customers
//                 </DropdownMenuCheckboxItem>
//                 <DropdownMenuCheckboxItem
//                   checked={filters.hasReminder === true}
//                   onCheckedChange={(checked) => applyFilter({ hasReminder: checked ? true : undefined })}
//                 >
//                   <Zap className="h-4 w-4 mr-2 text-blue-500" />
//                   Follow-up Due
//                 </DropdownMenuCheckboxItem>

//                 <DropdownMenuSeparator />
//                 <DropdownMenuLabel>Status</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuCheckboxItem
//                   checked={filters.status === "open"}
//                   onCheckedChange={(checked) => applyFilter({ status: checked ? "open" : undefined })}
//                 >
//                   Open
//                 </DropdownMenuCheckboxItem>
//                 <DropdownMenuCheckboxItem
//                   checked={filters.status === "pending"}
//                   onCheckedChange={(checked) => applyFilter({ status: checked ? "pending" : undefined })}
//                 >
//                   Pending
//                 </DropdownMenuCheckboxItem>
//                 <DropdownMenuCheckboxItem
//                   checked={filters.status === "resolved"}
//                   onCheckedChange={(checked) => applyFilter({ status: checked ? "resolved" : undefined })}
//                 >
//                   Resolved
//                 </DropdownMenuCheckboxItem>

//                 <DropdownMenuSeparator />
//                 <DropdownMenuCheckboxItem
//                   checked={filters.starred === true}
//                   onCheckedChange={(checked) => applyFilter({ starred: checked ? true : undefined })}
//                 >
//                   <Star className="h-4 w-4 mr-2" />
//                   Starred Only
//                 </DropdownMenuCheckboxItem>
//                 <DropdownMenuCheckboxItem
//                   checked={filters.archived === true}
//                   onCheckedChange={(checked) => applyFilter({ archived: checked ? true : undefined })}
//                 >
//                   <Archive className="h-4 w-4 mr-2" />
//                   Archived
//                 </DropdownMenuCheckboxItem>

//                 {activeFilterCount > 0 && (
//                   <>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={clearFilters}>
//                       <X className="h-4 w-4 mr-2" />
//                       Clear All Filters
//                     </DropdownMenuItem>
//                   </>
//                 )}

//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={() => setShowTemplates(true)}>
//                   <FileText className="h-4 w-4 mr-2" />
//                   Manage Templates
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>

//         {activeFilterCount > 0 && (
//           <div className="flex flex-wrap gap-2 mt-2">
//             {Object.entries(filters).map(([key, value]) => {
//               if (key === "userId" || key === "instagramAccountId" || !value) return null
//               return (
//                 <Badge key={key} variant="secondary" className="gap-1">
//                   {key}: {String(value)}
//                   <X className="h-3 w-3 cursor-pointer" onClick={() => applyFilter({ [key]: undefined })} />
//                 </Badge>
//               )
//             })}
//           </div>
//         )}
//       </div>

//       <BulkActionsBar
//         selectedIds={selectedIds}
//         onClearSelection={() => setSelectedIds([])}
//         onActionComplete={loadConversations}
//         userId={userId}
//         availableTags={tags}
//       />

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

      {/* Advanced Filters Panel */}
      <AdvancedFiltersPanel onFiltersChange={setFilters} currentFilters={filters} tags={tags} />

      {/* Conversation List */}
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
