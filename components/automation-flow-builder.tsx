"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  MessageSquare,
  Clock,
  Tag,
  Webhook,
  UserCheck,
  Bot,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Sparkles,
  Filter,
} from "lucide-react"

export interface FlowNode {
  id: string
  type: "trigger" | "action"
  actionType: string
  data: any
  position: { x: number; y: number }
}

interface AutomationFlowBuilderProps {
  initialNodes?: FlowNode[]
  onSave: (nodes: FlowNode[]) => Promise<void>
  isSaving?: boolean
}

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
    icon: MessageSquare,
  },
]

const ACTION_TYPES = [
  {
    value: "SEND_MESSAGE",
    label: "Send Message",
    description: "Send an automated message",
    icon: MessageSquare,
    color: "bg-blue-500",
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

export function AutomationFlowBuilder({ initialNodes = [], onSave, isSaving = false }: AutomationFlowBuilderProps) {
  const [nodes, setNodes] = useState<FlowNode[]>(initialNodes)
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddActionOpen, setIsAddActionOpen] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const hasTrigger = nodes.some((node) => node.type === "trigger")
  const trigger = nodes.find((node) => node.type === "trigger")
  const actions = nodes
    .filter((node) => node.type === "action")
    .sort((a, b) => {
      const aIndex = nodes.indexOf(a)
      const bIndex = nodes.indexOf(b)
      return aIndex - bIndex
    })

  const addTrigger = useCallback(
    (triggerType: string) => {
      const triggerConfig = TRIGGER_TYPES.find((t) => t.value === triggerType)
      if (!triggerConfig) return

      const newNode: FlowNode = {
        id: `trigger-${Date.now()}`,
        type: "trigger",
        actionType: triggerType,
        data: triggerType === "KEYWORD" ? { keywords: [], matchType: "contains" } : {},
        position: { x: 0, y: 0 },
      }
      setNodes([newNode, ...nodes])
    },
    [nodes],
  )

  const addAction = useCallback(
    (actionType: string) => {
      const actionConfig = ACTION_TYPES.find((a) => a.value === actionType)
      if (!actionConfig) return

      let defaultData = {}
      switch (actionType) {
        case "SEND_MESSAGE":
          defaultData = { message: "" }
          break
        case "AI_RESPONSE":
          defaultData = { customInstructions: "" }
          break
        case "ADD_TAG":
          defaultData = { tagName: "" }
          break
        case "DELAY":
          defaultData = { delayAmount: "5", delayUnit: "minutes" }
          break
        case "WEBHOOK":
          defaultData = { webhookUrl: "" }
          break
        case "SEND_TO_HUMAN":
          defaultData = { reason: "" }
          break
        case "CONDITION":
          defaultData = { field: "message", operator: "contains", value: "" }
          break
      }

      const newNode: FlowNode = {
        id: `action-${Date.now()}`,
        type: "action",
        actionType,
        data: defaultData,
        position: { x: 0, y: 0 },
      }
      setNodes([...nodes, newNode])
      setIsAddActionOpen(false)
    },
    [nodes],
  )

  const updateNode = useCallback((nodeId: string, newData: any) => {
    setNodes((prev) => prev.map((node) => (node.id === nodeId ? { ...node, data: newData } : node)))
  }, [])

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId))
    setSelectedNode(null)
    setIsEditDialogOpen(false)
  }, [])

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newNodes = [...nodes]
    const draggedNode = newNodes[draggedIndex]
    newNodes.splice(draggedIndex, 1)
    newNodes.splice(index, 0, draggedNode)
    setNodes(newNodes)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const openEditDialog = (node: FlowNode) => {
    setSelectedNode(node)
    setIsEditDialogOpen(true)
  }

  const handleSave = async () => {
    await onSave(nodes)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Automation Flow</h2>
          <p className="text-sm text-muted-foreground mt-1">Build your automation by adding a trigger and actions</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving || !hasTrigger}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Automation"}
        </Button>
      </div>

      <div ref={canvasRef} className="flex-1 space-y-4">
        {!hasTrigger && (
          <Card className="p-8 border-2 border-dashed border-border bg-muted/50">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Add a Trigger to Start</h3>
                <p className="text-sm text-muted-foreground mb-4">Choose what event will start this automation</p>
              </div>
              <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                {TRIGGER_TYPES.map((trigger) => (
                  <Button
                    key={trigger.value}
                    variant="outline"
                    className="h-auto py-4 px-4 flex flex-col items-start gap-2 hover:border-primary hover:bg-primary/5 bg-transparent"
                    onClick={() => addTrigger(trigger.value)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <trigger.icon className="w-5 h-5 text-primary shrink-0" />
                      <span className="font-medium text-sm text-left">{trigger.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground text-left">{trigger.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {hasTrigger && (
          <div className="space-y-4">
            {trigger && (
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-2 pt-2">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-foreground" />
                  </div>
                  {actions.length > 0 && <div className="w-0.5 h-12 bg-border" />}
                </div>
                <Card
                  className="flex-1 p-4 cursor-pointer hover:border-primary transition-colors"
                  onClick={() => openEditDialog(trigger)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">Trigger</Badge>
                        <h4 className="font-semibold text-foreground">
                          {TRIGGER_TYPES.find((t) => t.value === trigger.actionType)?.label}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {TRIGGER_TYPES.find((t) => t.value === trigger.actionType)?.description}
                      </p>
                      {trigger.actionType === "KEYWORD" && trigger.data.keywords?.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {trigger.data.keywords.map((keyword: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {actions.map((node, index) => (
              <div key={node.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-2 pt-2">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      ACTION_TYPES.find((a) => a.value === node.actionType)?.color || "bg-gray-500"
                    } flex items-center justify-center`}
                  >
                    {(() => {
                      const ActionIcon = ACTION_TYPES.find((a) => a.value === node.actionType)?.icon || MessageSquare
                      return <ActionIcon className="w-5 h-5 text-white" />
                    })()}
                  </div>
                  {index < actions.length - 1 && <div className="w-0.5 h-12 bg-border" />}
                </div>
                <Card
                  draggable
                  onDragStart={() => handleDragStart(nodes.indexOf(node))}
                  onDragOver={(e) => handleDragOver(e, nodes.indexOf(node))}
                  onDragEnd={handleDragEnd}
                  className="flex-1 p-4 cursor-move hover:border-primary transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1" onClick={() => openEditDialog(node)}>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge>Action {index + 1}</Badge>
                        <h4 className="font-semibold text-foreground">
                          {ACTION_TYPES.find((a) => a.value === node.actionType)?.label}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {ACTION_TYPES.find((a) => a.value === node.actionType)?.description}
                      </p>
                      {node.actionType === "SEND_MESSAGE" && node.data.message && (
                        <p className="text-sm text-foreground/80 line-clamp-2 bg-muted p-2 rounded">
                          {node.data.message}
                        </p>
                      )}
                      {node.actionType === "ADD_TAG" && node.data.tagName && (
                        <Badge variant="outline">{node.data.tagName}</Badge>
                      )}
                      {node.actionType === "DELAY" && (
                        <p className="text-sm text-foreground/80">
                          Wait {node.data.delayAmount} {node.data.delayUnit}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNode(node.id)
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}

            <div className="flex items-start gap-4">
              <div className="w-10" />
              <Button
                variant="outline"
                className="flex-1 h-16 border-2 border-dashed hover:border-primary hover:bg-primary/5 bg-transparent"
                onClick={() => setIsAddActionOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Action
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedNode?.type === "trigger" ? "Edit Trigger" : "Edit Action"}</DialogTitle>
            <DialogDescription>
              Configure the settings for this {selectedNode?.type === "trigger" ? "trigger" : "action"}
            </DialogDescription>
          </DialogHeader>
          {selectedNode && (
            <NodeEditor
              node={selectedNode}
              onUpdate={(data) => updateNode(selectedNode.id, data)}
              onDelete={() => deleteNode(selectedNode.id)}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddActionOpen} onOpenChange={setIsAddActionOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Action</DialogTitle>
            <DialogDescription>Choose an action to add to your automation flow</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-4">
            {ACTION_TYPES.map((action) => (
              <Button
                key={action.value}
                variant="outline"
                className="h-auto py-4 px-4 flex flex-col items-start gap-2 hover:border-primary hover:bg-primary/5 bg-transparent"
                onClick={() => addAction(action.value)}
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
    </div>
  )
}

function NodeEditor({
  node,
  onUpdate,
  onDelete,
}: {
  node: FlowNode
  onUpdate: (data: any) => void
  onDelete: () => void
}) {
  const [localData, setLocalData] = useState(node.data)

  useEffect(() => {
    onUpdate(localData)
  }, [localData, onUpdate])

  if (node.type === "trigger" && node.actionType === "KEYWORD") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Keywords</Label>
          <Input
            placeholder="Enter keywords separated by commas"
            value={localData.keywords?.join(", ") || ""}
            onChange={(e) =>
              setLocalData({
                ...localData,
                keywords: e.target.value
                  .split(",")
                  .map((k) => k.trim())
                  .filter(Boolean),
              })
            }
          />
          <p className="text-xs text-muted-foreground mt-1">Separate multiple keywords with commas</p>
        </div>
        <div>
          <Label>Match Type</Label>
          <Select
            value={localData.matchType || "contains"}
            onValueChange={(value) => setLocalData({ ...localData, matchType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contains">Contains</SelectItem>
              <SelectItem value="exact">Exact Match</SelectItem>
              <SelectItem value="starts_with">Starts With</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  if (node.actionType === "SEND_MESSAGE") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Message</Label>
          <Textarea
            placeholder="Enter your message... Use {name} for personalization"
            value={localData.message || ""}
            onChange={(e) => setLocalData({ ...localData, message: e.target.value })}
            rows={5}
          />
          <p className="text-xs text-muted-foreground mt-1">Use variables like {"{name}"} to personalize messages</p>
        </div>
      </div>
    )
  }

  if (node.actionType === "AI_RESPONSE") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Custom Instructions</Label>
          <Textarea
            placeholder="Provide instructions for the AI response..."
            value={localData.customInstructions || ""}
            onChange={(e) => setLocalData({ ...localData, customInstructions: e.target.value })}
            rows={5}
          />
          <p className="text-xs text-muted-foreground mt-1">Guide the AI on how to respond to messages</p>
        </div>
      </div>
    )
  }

  if (node.actionType === "ADD_TAG") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Tag Name</Label>
          <Input
            placeholder="Enter tag name"
            value={localData.tagName || ""}
            onChange={(e) => setLocalData({ ...localData, tagName: e.target.value })}
          />
        </div>
      </div>
    )
  }

  if (node.actionType === "DELAY") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Duration</Label>
            <Input
              type="number"
              min="1"
              placeholder="5"
              value={localData.delayAmount || ""}
              onChange={(e) => setLocalData({ ...localData, delayAmount: e.target.value })}
            />
          </div>
          <div>
            <Label>Unit</Label>
            <Select
              value={localData.delayUnit || "minutes"}
              onValueChange={(value) => setLocalData({ ...localData, delayUnit: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    )
  }

  if (node.actionType === "WEBHOOK") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Webhook URL</Label>
          <Input
            type="url"
            placeholder="https://your-webhook-url.com/endpoint"
            value={localData.webhookUrl || ""}
            onChange={(e) => setLocalData({ ...localData, webhookUrl: e.target.value })}
          />
        </div>
      </div>
    )
  }

  if (node.actionType === "SEND_TO_HUMAN") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Handoff Reason</Label>
          <Textarea
            placeholder="Why should this be handed off to a human?"
            value={localData.reason || ""}
            onChange={(e) => setLocalData({ ...localData, reason: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    )
  }

  if (node.actionType === "CONDITION") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Field</Label>
          <Select
            value={localData.field || "message"}
            onValueChange={(value) => setLocalData({ ...localData, field: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="message">Message Content</SelectItem>
              <SelectItem value="confidence">AI Confidence</SelectItem>
              <SelectItem value="tag">Has Tag</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Operator</Label>
          <Select
            value={localData.operator || "contains"}
            onValueChange={(value) => setLocalData({ ...localData, operator: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contains">Contains</SelectItem>
              <SelectItem value="equals">Equals</SelectItem>
              <SelectItem value="greater_than">Greater Than</SelectItem>
              <SelectItem value="less_than">Less Than</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Value</Label>
          <Input
            placeholder="Enter value"
            value={localData.value || ""}
            onChange={(e) => setLocalData({ ...localData, value: e.target.value })}
          />
        </div>
      </div>
    )
  }

  return <div className="text-sm text-muted-foreground">No additional configuration needed for this {node.type}.</div>
}
