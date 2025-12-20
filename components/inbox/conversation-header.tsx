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
import {
  ArrowLeft,
  MoreVertical,
  Archive,
  Star,
  Mail,
  MailOpen,
  LucideTag,
  StickyNote,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  updateConversationReadStatus,
  archiveConversation,
  starConversation,
  addTagToConversation,
  removeTagFromConversation,
  addConversationNote,
  updateConversationMode,
} from "@/actions/conversation-actions"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type Conversation = {
  id: string
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
  availableTags: { id: string; name: string; color: string }[]
}

export function ConversationHeader({ conversation, availableTags }: ConversationHeaderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [noteContent, setNoteContent] = useState(conversation.notes || "")

  const tags = conversation.conversationTags.map((ct) => ct.tag)

  const handleAction = (action: () => Promise<any>, successMessage: string) => {
    startTransition(async () => {
      const result = await action()
      if (result.success) {
        toast({ title: successMessage })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    })
  }

  const handleSaveNote = () => {
    handleAction(() => addConversationNote(conversation.id, noteContent), "Note saved")
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
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/inbox")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`https://avatar.vercel.sh/${conversation.participantUsername}`}
                alt={conversation.participantName || conversation.participantUsername}
              />
              <AvatarFallback>
                {getInitials(conversation.participantName || conversation.participantUsername)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="font-semibold">{conversation.participantName || conversation.participantUsername}</h2>
              <p className="text-sm text-muted-foreground">@{conversation.participantUsername}</p>
            </div>

            {conversation.starred && <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={conversation.isAuto ? "secondary" : "outline"}
              className="cursor-pointer"
              onClick={() =>
                handleAction(
                  () => updateConversationMode(conversation.id, !conversation.isAuto),
                  `Switched to ${conversation.isAuto ? "Manual" : "Auto"} mode`,
                )
              }
            >
              {conversation.isAuto ? <ToggleRight className="h-4 w-4 mr-1" /> : <ToggleLeft className="h-4 w-4 mr-1" />}
              {conversation.isAuto ? "Auto" : "Manual"}
            </Badge>

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
                      conversation.starred ? "Unstarred" : "Starred",
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
                      conversation.isArchived ? "Unarchived" : "Archived",
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

                <DropdownMenuSeparator />

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

        {tags.length > 0 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
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
      </div>

      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{conversation.notes ? "Edit Note" : "Add Note"}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Add internal notes about this conversation..."
            rows={6}
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
