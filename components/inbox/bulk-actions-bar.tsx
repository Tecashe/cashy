"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Archive, CheckCheck, Star, Tag, Trash2, X } from "lucide-react"
import { bulkUpdateConversations, bulkAddTags } from "@/actions/inbox-actions"
import { toast } from "sonner"

interface BulkActionsBarProps {
  selectedIds: string[]
  onClearSelection: () => void
  onActionComplete: () => void
  userId: string
  availableTags: Array<{ id: string; name: string; color: string }>
}

export function BulkActionsBar({
  selectedIds,
  onClearSelection,
  onActionComplete,
  userId,
  availableTags,
}: BulkActionsBarProps) {
  const [isPending, startTransition] = useTransition()

  const handleBulkAction = (action: string, tagId?: string) => {
    startTransition(async () => {
      let result

      if (action === "addTag" && tagId) {
        result = await bulkAddTags(selectedIds, tagId)
      } else {
        result = await bulkUpdateConversations(selectedIds, action as any, userId)
      }

      if (result.success) {
        toast.success(`Successfully updated ${selectedIds.length} conversation(s)`)
        onClearSelection()
        onActionComplete()
      } else {
        toast.error(result.error || "Failed to update conversations")
      }
    })
  }

  if (selectedIds.length === 0) return null

  return (
    <div className="border-b border-border bg-primary/5 backdrop-blur-sm">
      <div className="px-4 py-2.5 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="h-6 px-2">
            {selectedIds.length} selected
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-7 text-muted-foreground hover:text-foreground"
            disabled={isPending}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1.5 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleBulkAction("read")}
            disabled={isPending}
            className="h-8"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark Read
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleBulkAction("archive")}
            disabled={isPending}
            className="h-8"
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleBulkAction("star")}
            disabled={isPending}
            className="h-8"
          >
            <Star className="h-4 w-4 mr-2" />
            Star
          </Button>

          {availableTags.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isPending} className="h-8">
                  <Tag className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {availableTags.map((tag) => (
                  <DropdownMenuItem key={tag.id} onClick={() => handleBulkAction("addTag", tag.id)}>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
                      {tag.name}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleBulkAction("delete")}
            disabled={isPending}
            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
