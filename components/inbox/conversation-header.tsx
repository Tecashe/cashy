// "use client"

// import { useState, useTransition } from "react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Textarea } from "@/components/ui/textarea"
// import { MoreVertical, Archive, Star, Mail, MailOpen, LucideTag, StickyNote, Bot, User } from "lucide-react"
// import {
//   updateConversationReadStatus,
//   archiveConversation,
//   starConversation,
//   addTagToConversation,
//   removeTagFromConversation,
//   addConversationNote,
//   updateConversationMode,
//   getTags,
// } from "@/actions/conversation-actions"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"
// import { useEffect } from "react"

// type Conversation = {
//   id: string
//   userId: string
//   participantUsername: string
//   participantName: string | null
//   isRead: boolean
//   isAuto: boolean
//   starred: boolean
//   isArchived: boolean
//   notes: string | null
//   conversationTags: { tag: { id: string; name: string; color: string } }[]
// }

// interface ConversationHeaderProps {
//   conversation: Conversation
// }

// export function ConversationHeader({ conversation }: ConversationHeaderProps) {
//   const [isPending, startTransition] = useTransition()
//   const [showNoteDialog, setShowNoteDialog] = useState(false)
//   const [noteContent, setNoteContent] = useState(conversation.notes || "")
//   const [availableTags, setAvailableTags] = useState<any[]>([])

//   const tags = conversation.conversationTags.map((ct) => ct.tag)

//   useEffect(() => {
//     const loadTags = async () => {
//       const result = await getTags(conversation.userId)
//       if (result.success) {
//         setAvailableTags(result.tags || [])
//       }
//     }
//     loadTags()
//   }, [conversation.userId])

//   const handleAction = (action: () => Promise<any>, successMessage: string) => {
//     startTransition(async () => {
//       const result = await action()
//       if (result.success) {
//         toast.success(successMessage)
//       } else {
//         toast.error(result.error || "Action failed")
//       }
//     })
//   }

//   const handleSaveNote = () => {
//     handleAction(() => addConversationNote(conversation.id, noteContent), "Note saved successfully")
//     setShowNoteDialog(false)
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
//     <>
//       <div className="bg-card p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3 flex-1 min-w-0">
//             <Avatar className="h-12 w-12 ring-2 ring-border">
//               <AvatarImage
//                 src={`https://avatar.vercel.sh/${conversation.participantUsername}`}
//                 alt={conversation.participantName || conversation.participantUsername}
//               />
//               <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
//                 {getInitials(conversation.participantName || conversation.participantUsername)}
//               </AvatarFallback>
//             </Avatar>

//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2">
//                 <h2 className="font-semibold truncate">
//                   {conversation.participantName || conversation.participantUsername}
//                 </h2>
//                 {conversation.starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0" />}
//               </div>
//               <p className="text-sm text-muted-foreground truncate">@{conversation.participantUsername}</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <Button
//               variant={conversation.isAuto ? "default" : "outline"}
//               size="sm"
//               onClick={() =>
//                 handleAction(
//                   () => updateConversationMode(conversation.id, !conversation.isAuto),
//                   `Switched to ${conversation.isAuto ? "Manual" : "Auto"} mode`,
//                 )
//               }
//               disabled={isPending}
//               className="gap-2"
//             >
//               {conversation.isAuto ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
//               {conversation.isAuto ? "Auto" : "Manual"}
//             </Button>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon" disabled={isPending}>
//                   <MoreVertical className="h-5 w-5" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56">
//                 <DropdownMenuItem
//                   onClick={() =>
//                     handleAction(
//                       () => updateConversationReadStatus(conversation.id, !conversation.isRead),
//                       conversation.isRead ? "Marked as unread" : "Marked as read",
//                     )
//                   }
//                 >
//                   {conversation.isRead ? <Mail className="h-4 w-4 mr-2" /> : <MailOpen className="h-4 w-4 mr-2" />}
//                   Mark as {conversation.isRead ? "unread" : "read"}
//                 </DropdownMenuItem>

//                 <DropdownMenuItem
//                   onClick={() =>
//                     handleAction(
//                       () => starConversation(conversation.id, !conversation.starred),
//                       conversation.starred ? "Unstarred conversation" : "Starred conversation",
//                     )
//                   }
//                 >
//                   <Star className={cn("h-4 w-4 mr-2", conversation.starred && "fill-current")} />
//                   {conversation.starred ? "Unstar" : "Star"}
//                 </DropdownMenuItem>

//                 <DropdownMenuItem
//                   onClick={() =>
//                     handleAction(
//                       () => archiveConversation(conversation.id, !conversation.isArchived),
//                       conversation.isArchived ? "Unarchived conversation" : "Archived conversation",
//                     )
//                   }
//                 >
//                   <Archive className="h-4 w-4 mr-2" />
//                   {conversation.isArchived ? "Unarchive" : "Archive"}
//                 </DropdownMenuItem>

//                 <DropdownMenuSeparator />

//                 <DropdownMenuItem onClick={() => setShowNoteDialog(true)}>
//                   <StickyNote className="h-4 w-4 mr-2" />
//                   {conversation.notes ? "Edit note" : "Add note"}
//                 </DropdownMenuItem>

//                 {availableTags.length > 0 && <DropdownMenuSeparator />}

//                 {availableTags.map((tag) => {
//                   const hasTag = tags.some((t) => t.id === tag.id)
//                   return (
//                     <DropdownMenuItem
//                       key={tag.id}
//                       onClick={() =>
//                         handleAction(
//                           () =>
//                             hasTag
//                               ? removeTagFromConversation(conversation.id, tag.id)
//                               : addTagToConversation(conversation.id, tag.id),
//                           hasTag ? `Removed tag: ${tag.name}` : `Added tag: ${tag.name}`,
//                         )
//                       }
//                     >
//                       <LucideTag className="h-4 w-4 mr-2" style={{ color: tag.color }} />
//                       {hasTag ? "Remove" : "Add"} {tag.name}
//                     </DropdownMenuItem>
//                   )
//                 })}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>

//         {(tags.length > 0 || conversation.notes) && (
//           <div className="mt-3 pt-3 border-t border-border space-y-2">
//             {tags.length > 0 && (
//               <div className="flex flex-wrap gap-2">
//                 {tags.map((tag) => (
//                   <Badge
//                     key={tag.id}
//                     variant="outline"
//                     className="text-xs"
//                     style={{
//                       backgroundColor: `${tag.color}15`,
//                       borderColor: tag.color,
//                       color: tag.color,
//                     }}
//                   >
//                     {tag.name}
//                   </Badge>
//                 ))}
//               </div>
//             )}
//             {conversation.notes && (
//               <div className="bg-muted/50 rounded-lg p-3">
//                 <p className="text-xs text-muted-foreground font-medium mb-1">Internal Note</p>
//                 <p className="text-sm">{conversation.notes}</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{conversation.notes ? "Edit Internal Note" : "Add Internal Note"}</DialogTitle>
//           </DialogHeader>
//           <Textarea
//             value={noteContent}
//             onChange={(e) => setNoteContent(e.target.value)}
//             placeholder="Add internal notes about this conversation... (Only visible to your team)"
//             rows={6}
//             className="resize-none"
//           />
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSaveNote}>Save Note</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }
"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { MoreVertical, Archive, Star, Mail, MailOpen, LucideTag, StickyNote, Bot, User } from "lucide-react"
import {
  updateConversationReadStatus,
  archiveConversation,
  starConversation,
  addTagToConversation,
  removeTagFromConversation,
  addConversationNote,
  updateConversationMode,
  getTags,
} from "@/actions/conversation-actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

type Conversation = {
  id: string
  userId: string
  participantUsername: string
  participantName: string | null
  isRead: boolean
  isAuto: boolean
  starred: boolean
  isArchived: boolean
  notes: string | null
  conversationTags: { tag: { id: string; name: string; color: string } }[]
}

interface ConversationHeaderProps {
  conversation: Conversation
}

export function ConversationHeader({ conversation }: ConversationHeaderProps) {
  const [isPending, startTransition] = useTransition()
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [noteContent, setNoteContent] = useState(conversation.notes || "")
  const [availableTags, setAvailableTags] = useState<any[]>([])

  const tags = conversation.conversationTags.map((ct) => ct.tag)

  useEffect(() => {
    const loadTags = async () => {
      const result = await getTags(conversation.userId)
      if (result.success) {
        setAvailableTags(result.tags || [])
      }
    }
    loadTags()
  }, [conversation.userId])

  const handleAction = (action: () => Promise<any>, successMessage: string) => {
    startTransition(async () => {
      const result = await action()
      if (result.success) {
        toast.success(successMessage)
      } else {
        toast.error(result.error || "Action failed")
      }
    })
  }

  const handleSaveNote = () => {
    handleAction(() => addConversationNote(conversation.id, noteContent), "Note saved successfully")
    setShowNoteDialog(false)
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
    <>
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-11 w-11 ring-2 ring-border shadow-sm">
              <AvatarImage
                src={`https://avatar.vercel.sh/${conversation.participantUsername}`}
                alt={conversation.participantName || conversation.participantUsername}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-sm">
                {getInitials(conversation.participantName || conversation.participantUsername)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-base truncate">
                  {conversation.participantName || conversation.participantUsername}
                </h2>
                {conversation.starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground truncate">@{conversation.participantUsername}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={conversation.isAuto ? "default" : "outline"}
              size="sm"
              onClick={() =>
                handleAction(
                  () => updateConversationMode(conversation.id, !conversation.isAuto),
                  `Switched to ${conversation.isAuto ? "Manual" : "Auto"} mode`,
                )
              }
              disabled={isPending}
              className="gap-2"
            >
              {conversation.isAuto ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              {conversation.isAuto ? "Auto" : "Manual"}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isPending}>
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() =>
                    handleAction(
                      () => updateConversationReadStatus(conversation.id, !conversation.isRead),
                      conversation.isRead ? "Marked as unread" : "Marked as read",
                    )
                  }
                >
                  {conversation.isRead ? <Mail className="h-4 w-4 mr-2" /> : <MailOpen className="h-4 w-4 mr-2" />}
                  Mark as {conversation.isRead ? "unread" : "read"}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    handleAction(
                      () => starConversation(conversation.id, !conversation.starred),
                      conversation.starred ? "Unstarred conversation" : "Starred conversation",
                    )
                  }
                >
                  <Star className={cn("h-4 w-4 mr-2", conversation.starred && "fill-current")} />
                  {conversation.starred ? "Unstar" : "Star"}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    handleAction(
                      () => archiveConversation(conversation.id, !conversation.isArchived),
                      conversation.isArchived ? "Unarchived conversation" : "Archived conversation",
                    )
                  }
                >
                  <Archive className="h-4 w-4 mr-2" />
                  {conversation.isArchived ? "Unarchive" : "Archive"}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setShowNoteDialog(true)}>
                  <StickyNote className="h-4 w-4 mr-2" />
                  {conversation.notes ? "Edit note" : "Add note"}
                </DropdownMenuItem>

                {availableTags.length > 0 && <DropdownMenuSeparator />}

                {availableTags.map((tag) => {
                  const hasTag = tags.some((t) => t.id === tag.id)
                  return (
                    <DropdownMenuItem
                      key={tag.id}
                      onClick={() =>
                        handleAction(
                          () =>
                            hasTag
                              ? removeTagFromConversation(conversation.id, tag.id)
                              : addTagToConversation(conversation.id, tag.id),
                          hasTag ? `Removed tag: ${tag.name}` : `Added tag: ${tag.name}`,
                        )
                      }
                    >
                      <LucideTag className="h-4 w-4 mr-2" style={{ color: tag.color }} />
                      {hasTag ? "Remove" : "Add"} {tag.name}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {(tags.length > 0 || conversation.notes) && (
          <div className="mt-3 pt-3 border-t border-border space-y-2">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-xs font-medium"
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
            )}
            {conversation.notes && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground font-medium mb-1">Internal Note</p>
                <p className="text-sm">{conversation.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{conversation.notes ? "Edit Internal Note" : "Add Internal Note"}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Add internal notes about this conversation... (Only visible to your team)"
            rows={6}
            className="resize-none"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
