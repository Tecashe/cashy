"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Zap,
  MessageSquare,
  Clock,
  Tag,
  Webhook,
  UserCheck,
  Bot,
  Filter,
  Trash2,
  Settings,
  ImageIcon,
  Hash,
  AtSign,
  Sparkles,
  MessageCircle,
  FileText,
} from "lucide-react"

const ICON_MAP: Record<string, any> = {
  DM_RECEIVED: MessageSquare,
  FIRST_MESSAGE: Sparkles,
  KEYWORD: Filter,
  STORY_REPLY: MessageCircle,
  COMMENT_RECEIVED: Hash,
  MENTION_RECEIVED: AtSign,
  POST_PUBLISHED: FileText,
  SEND_MESSAGE: MessageSquare,
  SEND_IMAGE: ImageIcon,
  SEND_VIDEO: ImageIcon,
  AI_RESPONSE: Bot,
  ADD_TAG: Tag,
  DELAY: Clock,
  WEBHOOK: Webhook,
  SEND_TO_HUMAN: UserCheck,
  CONDITION: Filter,
}

const COLOR_MAP: Record<string, string> = {
  SEND_MESSAGE: "bg-blue-500",
  SEND_IMAGE: "bg-indigo-500",
  SEND_VIDEO: "bg-violet-500",
  AI_RESPONSE: "bg-purple-500",
  ADD_TAG: "bg-green-500",
  DELAY: "bg-orange-500",
  WEBHOOK: "bg-cyan-500",
  SEND_TO_HUMAN: "bg-pink-500",
  CONDITION: "bg-amber-500",
}

export const TriggerNode = memo(({ data, selected }: NodeProps) => {
  const Icon = ICON_MAP[data.actionType] || Zap

  return (
    <Card
      className={`min-w-[280px] border-2 transition-all ${
        selected ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-border shadow-md"
      }`}
    >
      <div className="bg-primary/5 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <Badge variant="secondary" className="text-xs">
              Trigger
            </Badge>
            <h4 className="text-sm font-semibold text-foreground mt-1">{data.label}</h4>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              data.onEdit?.(data.id)
            }}
            className="h-7 w-7 p-0"
          >
            <Settings className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      <div className="px-4 py-3">
        <p className="text-xs text-muted-foreground">{data.description}</p>
        {data.actionType === "KEYWORD" && data.keywords?.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {data.keywords.slice(0, 3).map((keyword: string, i: number) => (
              <Badge key={i} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {data.keywords.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{data.keywords.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary" />
    </Card>
  )
})

TriggerNode.displayName = "TriggerNode"

export const ActionNode = memo(({ data, selected }: NodeProps) => {
  const Icon = ICON_MAP[data.actionType] || MessageSquare
  const color = COLOR_MAP[data.actionType] || "bg-gray-500"

  return (
    <Card
      className={`min-w-[280px] border-2 transition-all ${
        selected ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-border shadow-md"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-primary" />
      <div className={`${color}/10 border-b border-border px-4 py-3`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <Badge className="text-xs mb-1">Action {data.order}</Badge>
            <h4 className="text-sm font-semibold text-foreground">{data.label}</h4>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                data.onEdit?.(data.id)
              }}
              className="h-7 w-7 p-0"
            >
              <Settings className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                data.onDelete?.(data.id)
              }}
              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="px-4 py-3">
        <p className="text-xs text-muted-foreground mb-2">{data.description}</p>
        {data.actionType === "SEND_MESSAGE" && data.message && (
          <p className="text-xs text-foreground bg-muted p-2 rounded line-clamp-2">{data.message}</p>
        )}
        {data.actionType === "SEND_IMAGE" && data.imageUrl && (
          <p className="text-xs text-foreground bg-muted p-2 rounded truncate">{data.imageUrl}</p>
        )}
        {data.actionType === "ADD_TAG" && data.tagName && (
          <Badge variant="outline" className="text-xs">
            {data.tagName}
          </Badge>
        )}
        {data.actionType === "DELAY" && (
          <p className="text-xs text-foreground">
            Wait {data.delayAmount} {data.delayUnit}
          </p>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary" />
    </Card>
  )
})

ActionNode.displayName = "ActionNode"
