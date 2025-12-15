"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageSquare, Sparkles, Filter, MessageCircle, Hash, AtSign, FileText } from "lucide-react"

const TRIGGER_TYPES = [
  {
    value: "DM_RECEIVED",
    label: "Direct Message Received",
    description: "Triggers when any DM is received",
    icon: MessageSquare,
  },
  {
    value: "FIRST_MESSAGE",
    label: "First Message",
    description: "Triggers when someone messages for the first time",
    icon: Sparkles,
  },
  {
    value: "KEYWORD",
    label: "Keyword Match",
    description: "Triggers when specific keywords are detected",
    icon: Filter,
  },
  {
    value: "STORY_REPLY",
    label: "Story Reply",
    description: "Triggers when someone replies to your story",
    icon: MessageCircle,
  },
  {
    value: "COMMENT_RECEIVED",
    label: "Comment on Post",
    description: "Triggers when someone comments on your post",
    icon: Hash,
  },
  {
    value: "MENTION_RECEIVED",
    label: "Mention in Story/Post",
    description: "Triggers when someone mentions you",
    icon: AtSign,
  },
  {
    value: "POST_PUBLISHED",
    label: "Post Published",
    description: "Triggers when you publish a new post",
    icon: FileText,
  },
]

interface TriggerSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (triggerType: string, triggerData: any) => void
}

export function TriggerSelector({ open, onOpenChange, onSelect }: TriggerSelectorProps) {
  const handleSelect = (trigger: (typeof TRIGGER_TYPES)[0]) => {
    const defaultData: Record<string, any> = {
      label: trigger.label,
      description: trigger.description,
    }

    if (trigger.value === "KEYWORD") {
      defaultData.keywords = []
      defaultData.matchType = "contains"
    }

    onSelect(trigger.value, defaultData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Trigger</DialogTitle>
          <DialogDescription>Choose what event will start this automation</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-4">
          {TRIGGER_TYPES.map((trigger) => (
            <Button
              key={trigger.value}
              variant="outline"
              className="h-auto py-4 px-4 flex flex-col items-start gap-2 hover:border-primary hover:bg-primary/5 bg-transparent"
              onClick={() => handleSelect(trigger)}
            >
              <div className="flex items-center gap-2 w-full">
                <trigger.icon className="w-5 h-5 text-primary shrink-0" />
                <span className="font-medium text-sm text-left">{trigger.label}</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">{trigger.description}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
