"use client"

import { useCallback, useState, useEffect } from "react"
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  MarkerType,
  BackgroundVariant,
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Tag,
  GitBranch,
  User,
  Sparkles,
  Trash2,
  Hash,
  ImageIcon,
  AtSign,
  Send,
  Timer,
  Link2,
  Target,
  Bot,
} from "lucide-react"

type NodeType = "trigger" | "action"
type TriggerType = "DM_RECEIVED" | "STORY_REPLY" | "COMMENT" | "MENTION" | "KEYWORD" | "FIRST_MESSAGE"
type ActionType = "SEND_MESSAGE" | "AI_RESPONSE" | "ADD_TAG" | "DELAY" | "CONDITION" | "SEND_TO_HUMAN" | "WEBHOOK"

interface FlowNodeData {
  label: string
  type: NodeType
  actionType: TriggerType | ActionType
  config: any
  onConfigure: () => void
  onDelete: () => void
  isConfigured: boolean
}

const TRIGGER_ICONS: Record<string, any> = {
  DM_RECEIVED: MessageSquare,
  STORY_REPLY: ImageIcon,
  COMMENT: Hash,
  MENTION: AtSign,
  KEYWORD: Target,
  FIRST_MESSAGE: Sparkles,
}

const ACTION_ICONS: Record<string, any> = {
  SEND_MESSAGE: Send,
  AI_RESPONSE: Bot,
  ADD_TAG: Tag,
  DELAY: Timer,
  CONDITION: GitBranch,
  SEND_TO_HUMAN: User,
  WEBHOOK: Link2,
}

function CustomNode({ data }: { data: FlowNodeData }) {
  const Icon = data.type === "trigger" ? TRIGGER_ICONS[data.actionType] : ACTION_ICONS[data.actionType]

  return (
    <Card
      className={`min-w-[280px] cursor-move ${
        data.type === "trigger"
          ? "bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-background border-indigo-200 dark:border-indigo-800"
          : "bg-white dark:bg-background"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                data.type === "trigger"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              {Icon && <Icon className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm text-foreground truncate">{data.label}</h4>
                {data.isConfigured && (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs">
                    Ready
                  </Badge>
                )}
              </div>
              <Badge variant="outline" className="text-xs capitalize">
                {data.type}
              </Badge>
            </div>
          </div>
          {data.type === "action" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={data.onDelete}
              className="h-7 w-7 p-0 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
            </Button>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={data.onConfigure} className="w-full bg-transparent">
          {data.isConfigured ? "Edit Configuration" : "Configure"}
        </Button>
      </div>
    </Card>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

interface AutomationFlowCanvasProps {
  initialTrigger?: { type: TriggerType; config: any }
  initialActions?: Array<{ type: ActionType; config: any; order: number }>
  onNodesChange: (
    trigger: { type: TriggerType; config: any } | null,
    actions: Array<{ type: ActionType; config: any; order: number }>,
  ) => void
  onConfigureNode: (nodeId: string, nodeType: NodeType, actionType: string) => void
}

export function AutomationFlowCanvas({
  initialTrigger,
  initialActions = [],
  onNodesChange,
  onConfigureNode,
}: AutomationFlowCanvasProps) {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [nodeIdCounter, setNodeIdCounter] = useState(1)

  const onNodesChangeHandler = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds))
  }, [])

  const onEdgesChangeHandler = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds))
  }, [])

  useEffect(() => {
    const initialNodes: Node[] = []
    const initialEdges: Edge[] = []

    if (initialTrigger) {
      const triggerNode: Node = {
        id: "trigger-0",
        type: "custom",
        position: { x: 250, y: 50 },
        data: {
          label: getTriggerLabel(initialTrigger.type),
          type: "trigger" as NodeType,
          actionType: initialTrigger.type,
          config: initialTrigger.config,
          isConfigured: Object.keys(initialTrigger.config || {}).length > 0,
          onConfigure: () => onConfigureNode("trigger-0", "trigger", initialTrigger.type),
          onDelete: () => {},
        },
        draggable: true,
      }
      initialNodes.push(triggerNode)
    }

    initialActions.forEach((action, index) => {
      const actionNode: Node = {
        id: `action-${index + 1}`,
        type: "custom",
        position: { x: 250, y: 200 + index * 150 },
        data: {
          label: getActionLabel(action.type),
          type: "action" as NodeType,
          actionType: action.type,
          config: action.config,
          isConfigured: Object.keys(action.config || {}).length > 0,
          onConfigure: () => onConfigureNode(`action-${index + 1}`, "action", action.type),
          onDelete: () => handleDeleteNode(`action-${index + 1}`),
        },
        draggable: true,
      }
      initialNodes.push(actionNode)

      if (index === 0 && initialTrigger) {
        initialEdges.push({
          id: `edge-trigger-action-${index + 1}`,
          source: "trigger-0",
          target: `action-${index + 1}`,
          type: "smoothstep",
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        })
      } else if (index > 0) {
        initialEdges.push({
          id: `edge-action-${index}-${index + 1}`,
          source: `action-${index}`,
          target: `action-${index + 1}`,
          type: "smoothstep",
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        })
      }
    })

    if (initialNodes.length > 0) {
      setNodes(initialNodes)
      setEdges(initialEdges)
      setNodeIdCounter(initialNodes.length)
    }
  }, [initialTrigger, initialActions])

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId))
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))

      setTimeout(() => {
        const updatedNodes = nodes.filter((node) => node.id !== nodeId)
        syncNodesToParent(updatedNodes)
      }, 0)
    },
    [nodes],
  )

  const addActionNode = useCallback(
    (actionType: ActionType) => {
      const newNodeId = `action-${nodeIdCounter}`
      const lastNode = nodes[nodes.length - 1]
      const yPosition = lastNode ? lastNode.position.y + 150 : 200

      const newNode: Node = {
        id: newNodeId,
        type: "custom",
        position: { x: 250, y: yPosition },
        data: {
          label: getActionLabel(actionType),
          type: "action" as NodeType,
          actionType,
          config: {},
          isConfigured: false,
          onConfigure: () => onConfigureNode(newNodeId, "action", actionType),
          onDelete: () => handleDeleteNode(newNodeId),
        },
        draggable: true,
      }

      setNodes((nds) => [...nds, newNode])
      setNodeIdCounter((c) => c + 1)

      if (lastNode) {
        const newEdge: Edge = {
          id: `edge-${lastNode.id}-${newNodeId}`,
          source: lastNode.id,
          target: newNodeId,
          type: "smoothstep",
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        }
        setEdges((eds) => [...eds, newEdge])
      }

      setTimeout(() => {
        const updatedNodes = [...nodes, newNode]
        syncNodesToParent(updatedNodes)
      }, 0)
    },
    [nodes, nodeIdCounter, onConfigureNode, handleDeleteNode],
  )

  const syncNodesToParent = useCallback(
    (updatedNodes: Node[]) => {
      const triggerNode = updatedNodes.find((n) => n.data.type === "trigger")
      const actionNodes = updatedNodes.filter((n) => n.data.type === "action")

      const trigger = triggerNode
        ? { type: triggerNode.data.actionType as TriggerType, config: triggerNode.data.config }
        : null

      const actions = actionNodes.map((node, index) => ({
        type: node.data.actionType as ActionType,
        config: node.data.config,
        order: index,
      }))

      onNodesChange(trigger, actions)
    },
    [onNodesChange],
  )

  const onConnect = useCallback((params: Connection) => {
    const newEdge = {
      ...params,
      type: "smoothstep",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
    }
    setEdges((eds) => addEdge(newEdge, eds))
  }, [])

  const getTriggerLabel = (type: TriggerType): string => {
    const labels: Record<TriggerType, string> = {
      DM_RECEIVED: "Direct Message Received",
      STORY_REPLY: "Story Reply",
      COMMENT: "Comment on Post",
      MENTION: "Mentioned in Story/Post",
      KEYWORD: "Keyword Detected",
      FIRST_MESSAGE: "First Message from User",
    }
    return labels[type] || type
  }

  const getActionLabel = (type: ActionType): string => {
    const labels: Record<ActionType, string> = {
      SEND_MESSAGE: "Send Message",
      AI_RESPONSE: "AI Response",
      ADD_TAG: "Add Tag",
      DELAY: "Wait / Delay",
      CONDITION: "Conditional Branch",
      SEND_TO_HUMAN: "Human Handoff",
      WEBHOOK: "Webhook Call",
    }
    return labels[type] || type
  }

  const ACTION_TYPES: Array<{ type: ActionType; label: string; icon: any }> = [
    { type: "SEND_MESSAGE", label: "Send Message", icon: Send },
    { type: "AI_RESPONSE", label: "AI Response", icon: Bot },
    { type: "ADD_TAG", label: "Add Tag", icon: Tag },
    { type: "DELAY", label: "Delay", icon: Timer },
    { type: "CONDITION", label: "Condition", icon: GitBranch },
    { type: "SEND_TO_HUMAN", label: "Send to Human", icon: User },
    { type: "WEBHOOK", label: "Webhook", icon: Link2 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Automation Flow</h3>
          <p className="text-sm text-muted-foreground">Drag nodes to rearrange, click to configure</p>
        </div>
      </div>

      <div className="h-[600px] border rounded-lg bg-slate-50 dark:bg-slate-950/50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeHandler}
          onEdgesChange={onEdgesChangeHandler}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.5}
          maxZoom={1.5}
        >
          <Controls />
          <MiniMap zoomable pannable />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm text-foreground">Add Action</h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {ACTION_TYPES.map((actionType) => {
            const Icon = actionType.icon
            return (
              <Button
                key={actionType.type}
                variant="outline"
                onClick={() => addActionNode(actionType.type)}
                className="h-auto flex flex-col gap-2 py-3 hover:bg-primary/5 hover:border-primary"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium">{actionType.label}</span>
              </Button>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
