"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageSquare, Bot, Tag, Clock, Webhook, UserCheck, Filter, ImageIcon, Video } from "lucide-react"

const ACTION_TYPES = [
  {
    value: "SEND_MESSAGE",
    label: "Send Text Message",
    description: "Send an automated text message",
    icon: MessageSquare,
    color: "bg-blue-500",
  },
  {
    value: "SEND_IMAGE",
    label: "Send Image",
    description: "Send an image to the user",
    icon: ImageIcon,
    color: "bg-indigo-500",
  },
  {
    value: "SEND_VIDEO",
    label: "Send Video",
    description: "Send a video to the user",
    icon: Video,
    color: "bg-violet-500",
  },
  {
    value: "AI_RESPONSE",
    label: "AI Response",
    description: "Generate AI-powered response",
    icon: Bot,
    color: "bg-purple-500",
  },
  {
    value: "ADD_TAG",
    label: "Add Tag",
    description: "Tag the conversation",
    icon: Tag,
    color: "bg-green-500",
  },
  {
    value: "DELAY",
    label: "Delay",
    description: "Wait before next action",
    icon: Clock,
    color: "bg-orange-500",
  },
  {
    value: "WEBHOOK",
    label: "Send Webhook",
    description: "Send data to external service",
    icon: Webhook,
    color: "bg-cyan-500",
  },
  {
    value: "SEND_TO_HUMAN",
    label: "Hand Off to Human",
    description: "Transfer conversation to team",
    icon: UserCheck,
    color: "bg-pink-500",
  },
  {
    value: "CONDITION",
    label: "Conditional Branch",
    description: "Create conditional logic",
    icon: Filter,
    color: "bg-amber-500",
  },
]

interface ActionSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (actionType: string, actionData: any) => void
}

export function ActionSelector({ open, onOpenChange, onSelect }: ActionSelectorProps) {
  const handleSelect = (action: (typeof ACTION_TYPES)[0]) => {
    const defaultData: Record<string, any> = {
      label: action.label,
      description: action.description,
    }

    // Set default configurations based on action type
    switch (action.value) {
      case "SEND_MESSAGE":
        defaultData.message = ""
        break
      case "SEND_IMAGE":
        defaultData.imageUrl = ""
        break
      case "SEND_VIDEO":
        defaultData.videoUrl = ""
        break
      case "AI_RESPONSE":
        defaultData.customInstructions = ""
        defaultData.tone = "friendly"
        defaultData.useKnowledgeBase = false
        break
      case "ADD_TAG":
        defaultData.tagName = ""
        break
      case "DELAY":
        defaultData.delayAmount = "5"
        defaultData.delayUnit = "minutes"
        break
      case "WEBHOOK":
        defaultData.webhookUrl = ""
        defaultData.method = "POST"
        break
      case "SEND_TO_HUMAN":
        defaultData.reason = ""
        defaultData.priority = "normal"
        break
      case "CONDITION":
        defaultData.field = "message"
        defaultData.operator = "contains"
        defaultData.value = ""
        break
    }

    onSelect(action.value, defaultData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Action</DialogTitle>
          <DialogDescription>Choose an action to add to your automation flow</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-4 max-h-[60vh] overflow-y-auto">
          {ACTION_TYPES.map((action) => (
            <Button
              key={action.value}
              variant="outline"
              className="h-auto py-4 px-4 flex flex-col items-start gap-2 hover:border-primary hover:bg-primary/5 bg-transparent"
              onClick={() => handleSelect(action)}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center shrink-0`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
