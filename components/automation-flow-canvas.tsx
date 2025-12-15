// "use client"

// import { useCallback, useState, useEffect } from "react"
// import {
//   ReactFlow,
//   MiniMap,
//   Controls,
//   Background,
//   addEdge,
//   type Connection,
//   type Edge,
//   type Node,
//   MarkerType,
//   BackgroundVariant,
//   type NodeChange,
//   type EdgeChange,
//   applyNodeChanges,
//   applyEdgeChanges,
// } from "@xyflow/react"
// import "@xyflow/react/dist/style.css"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import {
//   MessageSquare,
//   Tag,
//   GitBranch,
//   User,
//   Sparkles,
//   Trash2,
//   Hash,
//   ImageIcon,
//   AtSign,
//   Send,
//   Timer,
//   Link2,
//   Target,
//   Bot,
// } from "lucide-react"

// type NodeType = "trigger" | "action"
// type TriggerType = "DM_RECEIVED" | "STORY_REPLY" | "COMMENT" | "MENTION" | "KEYWORD" | "FIRST_MESSAGE"
// type ActionType = "SEND_MESSAGE" | "AI_RESPONSE" | "ADD_TAG" | "DELAY" | "CONDITION" | "SEND_TO_HUMAN" | "WEBHOOK"

// interface FlowNodeData {
//   label: string
//   type: NodeType
//   actionType: TriggerType | ActionType
//   config: any
//   onConfigure: () => void
//   onDelete: () => void
//   isConfigured: boolean
// }

// const TRIGGER_ICONS: Record<string, any> = {
//   DM_RECEIVED: MessageSquare,
//   STORY_REPLY: ImageIcon,
//   COMMENT: Hash,
//   MENTION: AtSign,
//   KEYWORD: Target,
//   FIRST_MESSAGE: Sparkles,
// }

// const ACTION_ICONS: Record<string, any> = {
//   SEND_MESSAGE: Send,
//   AI_RESPONSE: Bot,
//   ADD_TAG: Tag,
//   DELAY: Timer,
//   CONDITION: GitBranch,
//   SEND_TO_HUMAN: User,
//   WEBHOOK: Link2,
// }

// function CustomNode({ data }: { data: FlowNodeData }) {
//   const Icon = data.type === "trigger" ? TRIGGER_ICONS[data.actionType] : ACTION_ICONS[data.actionType]

//   return (
//     <Card
//       className={`min-w-[280px] cursor-move ${
//         data.type === "trigger"
//           ? "bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-background border-indigo-200 dark:border-indigo-800"
//           : "bg-white dark:bg-background"
//       }`}
//     >
//       <div className="p-4">
//         <div className="flex items-start justify-between gap-3 mb-3">
//           <div className="flex items-center gap-3 flex-1">
//             <div
//               className={`w-10 h-10 rounded-lg flex items-center justify-center ${
//                 data.type === "trigger"
//                   ? "bg-indigo-500 text-white"
//                   : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
//               }`}
//             >
//               {Icon && <Icon className="w-5 h-5" />}
//             </div>
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-1">
//                 <h4 className="font-semibold text-sm text-foreground truncate">{data.label}</h4>
//                 {data.isConfigured && (
//                   <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs">
//                     Ready
//                   </Badge>
//                 )}
//               </div>
//               <Badge variant="outline" className="text-xs capitalize">
//                 {data.type}
//               </Badge>
//             </div>
//           </div>
//           {data.type === "action" && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={data.onDelete}
//               className="h-7 w-7 p-0 hover:bg-red-50 dark:hover:bg-red-950/20"
//             >
//               <Trash2 className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
//             </Button>
//           )}
//         </div>
//         <Button variant="outline" size="sm" onClick={data.onConfigure} className="w-full bg-transparent">
//           {data.isConfigured ? "Edit Configuration" : "Configure"}
//         </Button>
//       </div>
//     </Card>
//   )
// }

// const nodeTypes = {
//   custom: CustomNode,
// }

// interface AutomationFlowCanvasProps {
//   initialTrigger?: { type: TriggerType; config: any }
//   initialActions?: Array<{ type: ActionType; config: any; order: number }>
//   onNodesChange: (
//     trigger: { type: TriggerType; config: any } | null,
//     actions: Array<{ type: ActionType; config: any; order: number }>,
//   ) => void
//   onConfigureNode: (nodeId: string, nodeType: NodeType, actionType: string) => void
// }

// export function AutomationFlowCanvas({
//   initialTrigger,
//   initialActions = [],
//   onNodesChange,
//   onConfigureNode,
// }: AutomationFlowCanvasProps) {
//   const [nodes, setNodes] = useState<Node[]>([])
//   const [edges, setEdges] = useState<Edge[]>([])
//   const [nodeIdCounter, setNodeIdCounter] = useState(1)

//   const onNodesChangeHandler = useCallback((changes: NodeChange[]) => {
//     setNodes((nds) => applyNodeChanges(changes, nds))
//   }, [])

//   const onEdgesChangeHandler = useCallback((changes: EdgeChange[]) => {
//     setEdges((eds) => applyEdgeChanges(changes, eds))
//   }, [])

//   useEffect(() => {
//     const initialNodes: Node[] = []
//     const initialEdges: Edge[] = []

//     if (initialTrigger) {
//       const triggerNode: Node = {
//         id: "trigger-0",
//         type: "custom",
//         position: { x: 250, y: 50 },
//         data: {
//           label: getTriggerLabel(initialTrigger.type),
//           type: "trigger" as NodeType,
//           actionType: initialTrigger.type,
//           config: initialTrigger.config,
//           isConfigured: Object.keys(initialTrigger.config || {}).length > 0,
//           onConfigure: () => onConfigureNode("trigger-0", "trigger", initialTrigger.type),
//           onDelete: () => {},
//         },
//         draggable: true,
//       }
//       initialNodes.push(triggerNode)
//     }

//     initialActions.forEach((action, index) => {
//       const actionNode: Node = {
//         id: `action-${index + 1}`,
//         type: "custom",
//         position: { x: 250, y: 200 + index * 150 },
//         data: {
//           label: getActionLabel(action.type),
//           type: "action" as NodeType,
//           actionType: action.type,
//           config: action.config,
//           isConfigured: Object.keys(action.config || {}).length > 0,
//           onConfigure: () => onConfigureNode(`action-${index + 1}`, "action", action.type),
//           onDelete: () => handleDeleteNode(`action-${index + 1}`),
//         },
//         draggable: true,
//       }
//       initialNodes.push(actionNode)

//       if (index === 0 && initialTrigger) {
//         initialEdges.push({
//           id: `edge-trigger-action-${index + 1}`,
//           source: "trigger-0",
//           target: `action-${index + 1}`,
//           type: "smoothstep",
//           animated: true,
//           markerEnd: { type: MarkerType.ArrowClosed },
//         })
//       } else if (index > 0) {
//         initialEdges.push({
//           id: `edge-action-${index}-${index + 1}`,
//           source: `action-${index}`,
//           target: `action-${index + 1}`,
//           type: "smoothstep",
//           animated: true,
//           markerEnd: { type: MarkerType.ArrowClosed },
//         })
//       }
//     })

//     if (initialNodes.length > 0) {
//       setNodes(initialNodes)
//       setEdges(initialEdges)
//       setNodeIdCounter(initialNodes.length)
//     }
//   }, [initialTrigger, initialActions])

//   const handleDeleteNode = useCallback(
//     (nodeId: string) => {
//       setNodes((nds) => nds.filter((node) => node.id !== nodeId))
//       setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))

//       setTimeout(() => {
//         const updatedNodes = nodes.filter((node) => node.id !== nodeId)
//         syncNodesToParent(updatedNodes)
//       }, 0)
//     },
//     [nodes],
//   )

//   const addActionNode = useCallback(
//     (actionType: ActionType) => {
//       const newNodeId = `action-${nodeIdCounter}`
//       const lastNode = nodes[nodes.length - 1]
//       const yPosition = lastNode ? lastNode.position.y + 150 : 200

//       const newNode: Node = {
//         id: newNodeId,
//         type: "custom",
//         position: { x: 250, y: yPosition },
//         data: {
//           label: getActionLabel(actionType),
//           type: "action" as NodeType,
//           actionType,
//           config: {},
//           isConfigured: false,
//           onConfigure: () => onConfigureNode(newNodeId, "action", actionType),
//           onDelete: () => handleDeleteNode(newNodeId),
//         },
//         draggable: true,
//       }

//       setNodes((nds) => [...nds, newNode])
//       setNodeIdCounter((c) => c + 1)

//       if (lastNode) {
//         const newEdge: Edge = {
//           id: `edge-${lastNode.id}-${newNodeId}`,
//           source: lastNode.id,
//           target: newNodeId,
//           type: "smoothstep",
//           animated: true,
//           markerEnd: { type: MarkerType.ArrowClosed },
//         }
//         setEdges((eds) => [...eds, newEdge])
//       }

//       setTimeout(() => {
//         const updatedNodes = [...nodes, newNode]
//         syncNodesToParent(updatedNodes)
//       }, 0)
//     },
//     [nodes, nodeIdCounter, onConfigureNode, handleDeleteNode],
//   )

//   const syncNodesToParent = useCallback(
//     (updatedNodes: Node[]) => {
//       const triggerNode = updatedNodes.find((n) => n.data.type === "trigger")
//       const actionNodes = updatedNodes.filter((n) => n.data.type === "action")

//       const trigger = triggerNode
//         ? { type: triggerNode.data.actionType as TriggerType, config: triggerNode.data.config }
//         : null

//       const actions = actionNodes.map((node, index) => ({
//         type: node.data.actionType as ActionType,
//         config: node.data.config,
//         order: index,
//       }))

//       onNodesChange(trigger, actions)
//     },
//     [onNodesChange],
//   )

//   const onConnect = useCallback((params: Connection) => {
//     const newEdge = {
//       ...params,
//       type: "smoothstep",
//       animated: true,
//       markerEnd: { type: MarkerType.ArrowClosed },
//     }
//     setEdges((eds) => addEdge(newEdge, eds))
//   }, [])

//   const getTriggerLabel = (type: TriggerType): string => {
//     const labels: Record<TriggerType, string> = {
//       DM_RECEIVED: "Direct Message Received",
//       STORY_REPLY: "Story Reply",
//       COMMENT: "Comment on Post",
//       MENTION: "Mentioned in Story/Post",
//       KEYWORD: "Keyword Detected",
//       FIRST_MESSAGE: "First Message from User",
//     }
//     return labels[type] || type
//   }

//   const getActionLabel = (type: ActionType): string => {
//     const labels: Record<ActionType, string> = {
//       SEND_MESSAGE: "Send Message",
//       AI_RESPONSE: "AI Response",
//       ADD_TAG: "Add Tag",
//       DELAY: "Wait / Delay",
//       CONDITION: "Conditional Branch",
//       SEND_TO_HUMAN: "Human Handoff",
//       WEBHOOK: "Webhook Call",
//     }
//     return labels[type] || type
//   }

//   const ACTION_TYPES: Array<{ type: ActionType; label: string; icon: any }> = [
//     { type: "SEND_MESSAGE", label: "Send Message", icon: Send },
//     { type: "AI_RESPONSE", label: "AI Response", icon: Bot },
//     { type: "ADD_TAG", label: "Add Tag", icon: Tag },
//     { type: "DELAY", label: "Delay", icon: Timer },
//     { type: "CONDITION", label: "Condition", icon: GitBranch },
//     { type: "SEND_TO_HUMAN", label: "Send to Human", icon: User },
//     { type: "WEBHOOK", label: "Webhook", icon: Link2 },
//   ]

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className="text-lg font-semibold text-foreground">Automation Flow</h3>
//           <p className="text-sm text-muted-foreground">Drag nodes to rearrange, click to configure</p>
//         </div>
//       </div>

//       <div className="h-[600px] border rounded-lg bg-slate-50 dark:bg-slate-950/50">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChangeHandler}
//           onEdgesChange={onEdgesChangeHandler}
//           onConnect={onConnect}
//           nodeTypes={nodeTypes}
//           fitView
//           minZoom={0.5}
//           maxZoom={1.5}
//         >
//           <Controls />
//           <MiniMap zoomable pannable />
//           <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
//         </ReactFlow>
//       </div>

//       <Card className="p-4">
//         <div className="flex items-center justify-between mb-3">
//           <h4 className="font-medium text-sm text-foreground">Add Action</h4>
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
//           {ACTION_TYPES.map((actionType) => {
//             const Icon = actionType.icon
//             return (
//               <Button
//                 key={actionType.type}
//                 variant="outline"
//                 onClick={() => addActionNode(actionType.type)}
//                 className="h-auto flex flex-col gap-2 py-3 hover:bg-primary/5 hover:border-primary"
//               >
//                 <Icon className="h-4 w-4" />
//                 <span className="text-xs font-medium">{actionType.label}</span>
//               </Button>
//             )
//           })}
//         </div>
//       </Card>
//     </div>
//   )
// }


// "use client"

// import { useCallback, useState, useEffect } from "react"
// import {
//   ReactFlow,
//   MiniMap,
//   Controls,
//   Background,
//   addEdge,
//   type Connection,
//   type Node,
//   type Edge,
//   MarkerType,
//   BackgroundVariant,
//   type NodeChange,
//   type EdgeChange,
//   applyNodeChanges,
//   applyEdgeChanges,
//   Panel,
// } from "@xyflow/react"
// import "@xyflow/react/dist/style.css"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import {
//   TRIGGER_TYPES,
//   ACTION_TYPES,
//   ACTION_CATEGORIES,
//   type TriggerTypeId,
//   type ActionTypeId,
// } from "@/lib/automation-constants"
// import { Trash2, Settings, Plus, Zap } from "lucide-react"
// import { cn } from "@/lib/utils"

// type NodeType = "trigger" | "action"

// interface FlowNodeData {
//   label: string
//   type: NodeType
//   actionType: TriggerTypeId | ActionTypeId
//   config: any
//   onConfigure: () => void
//   onDelete: () => void
//   isConfigured: boolean
// }

// function CustomNode({ data }: { data: FlowNodeData }) {
//   const isTrigger = data.type === "trigger"
//   const typeConfig = isTrigger
//     ? TRIGGER_TYPES[data.actionType as TriggerTypeId]
//     : ACTION_TYPES[data.actionType as ActionTypeId]

//   const Icon = typeConfig?.icon

//   return (
//     <Card
//       className={cn(
//         "min-w-[280px] cursor-move transition-all hover:shadow-lg",
//         isTrigger
//           ? "bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-background border-indigo-300 dark:border-indigo-700"
//           : "bg-white dark:bg-card border-border",
//       )}
//     >
//       <div className="p-4">
//         <div className="flex items-start justify-between gap-3 mb-3">
//           <div className="flex items-center gap-3 flex-1">
//             <div
//               className={cn(
//                 "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
//                 isTrigger
//                   ? "bg-indigo-500 text-white"
//                   : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
//               )}
//             >
//               {Icon && <Icon className="w-5 h-5" />}
//             </div>
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-1">
//                 <h4 className="font-semibold text-sm text-foreground truncate">{data.label}</h4>
//                 {data.isConfigured ? (
//                   <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs">
//                     Configured
//                   </Badge>
//                 ) : (
//                   <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs">
//                     Setup Required
//                   </Badge>
//                 )}
//               </div>
//               <Badge variant="outline" className="text-xs capitalize">
//                 {isTrigger ? "Trigger" : "Action"}
//               </Badge>
//             </div>
//           </div>
//           {!isTrigger && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={(e) => {
//                 e.stopPropagation()
//                 data.onDelete()
//               }}
//               className="h-7 w-7 p-0 hover:bg-red-50 dark:hover:bg-red-950/20 flex-shrink-0"
//             >
//               <Trash2 className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
//             </Button>
//           )}
//         </div>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={(e) => {
//             e.stopPropagation()
//             data.onConfigure()
//           }}
//           className="w-full bg-transparent"
//         >
//           <Settings className="w-3.5 h-3.5 mr-2" />
//           {data.isConfigured ? "Edit" : "Configure"}
//         </Button>
//       </div>
//     </Card>
//   )
// }

// const nodeTypes = {
//   custom: CustomNode,
// }

// interface AutomationFlowCanvasProps {
//   initialTrigger?: { type: TriggerTypeId; config: any }
//   initialActions?: Array<{ type: ActionTypeId; config: any; order: number }>
//   onNodesChange: (
//     trigger: { type: TriggerTypeId; config: any } | null,
//     actions: Array<{ type: ActionTypeId; config: any; order: number }>,
//   ) => void
//   onConfigureNode: (nodeId: string, nodeType: NodeType, actionType: string) => void
// }

// export function AutomationFlowCanvas({
//   initialTrigger,
//   initialActions = [],
//   onNodesChange,
//   onConfigureNode,
// }: AutomationFlowCanvasProps) {
//   const [nodes, setNodes] = useState<Node[]>([])
//   const [edges, setEdges] = useState<Edge[]>([])
//   const [selectedCategory, setSelectedCategory] = useState<string>("all")

//   useEffect(() => {
//     const initialNodes: Node[] = []
//     const initialEdges: Edge[] = []

//     if (initialTrigger) {
//       const triggerConfig = TRIGGER_TYPES[initialTrigger.type]
//       const triggerNode: Node = {
//         id: "trigger-0",
//         type: "custom",
//         position: { x: 300, y: 50 },
//         data: {
//           label: triggerConfig?.label || initialTrigger.type,
//           type: "trigger" as NodeType,
//           actionType: initialTrigger.type,
//           config: initialTrigger.config,
//           isConfigured: Object.keys(initialTrigger.config || {}).length > 0,
//           onConfigure: () => onConfigureNode("trigger-0", "trigger", initialTrigger.type),
//           onDelete: () => {},
//         },
//         draggable: true,
//       }
//       initialNodes.push(triggerNode)
//     }

//     initialActions.forEach((action, index) => {
//       const actionConfig = ACTION_TYPES[action.type as ActionTypeId]
//       const actionNode: Node = {
//         id: `action-${index + 1}`,
//         type: "custom",
//         position: { x: 300, y: 200 + index * 180 },
//         data: {
//           label: actionConfig?.label || action.type,
//           type: "action" as NodeType,
//           actionType: action.type,
//           config: action.config,
//           isConfigured: Object.keys(action.config || {}).length > 0,
//           onConfigure: () => onConfigureNode(`action-${index + 1}`, "action", action.type),
//           onDelete: () => handleDeleteNode(`action-${index + 1}`),
//         },
//         draggable: true,
//       }
//       initialNodes.push(actionNode)

//       if (index === 0 && initialTrigger) {
//         initialEdges.push({
//           id: `edge-trigger-action-1`,
//           source: "trigger-0",
//           target: "action-1",
//           type: "smoothstep",
//           animated: true,
//           style: { stroke: "#6366f1", strokeWidth: 2 },
//           markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
//         })
//       } else if (index > 0) {
//         initialEdges.push({
//           id: `edge-action-${index}-${index + 1}`,
//           source: `action-${index}`,
//           target: `action-${index + 1}`,
//           type: "smoothstep",
//           animated: true,
//           style: { stroke: "#6366f1", strokeWidth: 2 },
//           markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
//         })
//       }
//     })

//     if (initialNodes.length > 0) {
//       setNodes(initialNodes)
//       setEdges(initialEdges)
//     }
//   }, [initialTrigger, initialActions])

//   const onNodesChangeHandler = useCallback((changes: NodeChange[]) => {
//     setNodes((nds) => applyNodeChanges(changes, nds))
//   }, [])

//   const onEdgesChangeHandler = useCallback((changes: EdgeChange[]) => {
//     setEdges((eds) => applyEdgeChanges(changes, eds))
//   }, [])

//   const handleDeleteNode = useCallback(
//     (nodeId: string) => {
//       setNodes((nds) => {
//         const updatedNodes = nds.filter((node) => node.id !== nodeId)

//         const renumberedNodes = updatedNodes.map((node, index) => {
//           if (node.data.type === "action") {
//             return {
//               ...node,
//               id: `action-${index}`,
//             }
//           }
//           return node
//         })

//         syncNodesToParent(renumberedNodes)
//         return renumberedNodes
//       })

//       setEdges((eds) => {
//         const filteredEdges = eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)

//         const actionNodes = nodes.filter((n) => n.data.type === "action" && n.id !== nodeId)
//         const newEdges: Edge[] = []

//         actionNodes.forEach((node, index) => {
//           if (index === 0) {
//             newEdges.push({
//               id: "edge-trigger-action-1",
//               source: "trigger-0",
//               target: "action-1",
//               type: "smoothstep",
//               animated: true,
//               style: { stroke: "#6366f1", strokeWidth: 2 },
//               markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
//             })
//           } else {
//             newEdges.push({
//               id: `edge-action-${index}-${index + 1}`,
//               source: `action-${index}`,
//               target: `action-${index + 1}`,
//               type: "smoothstep",
//               animated: true,
//               style: { stroke: "#6366f1", strokeWidth: 2 },
//               markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
//             })
//           }
//         })

//         return newEdges
//       })
//     },
//     [nodes],
//   )

//   const addActionNode = useCallback(
//     (actionType: ActionTypeId) => {
//       const actionConfig = ACTION_TYPES[actionType]
//       const actionNodes = nodes.filter((n) => n.data.type === "action")
//       const newNodeId = `action-${actionNodes.length + 1}`
//       const lastNode = nodes[nodes.length - 1]
//       const yPosition = lastNode ? lastNode.position.y + 180 : 200

//       const newNode: Node = {
//         id: newNodeId,
//         type: "custom",
//         position: { x: 300, y: yPosition },
//         data: {
//           label: actionConfig.label,
//           type: "action" as NodeType,
//           actionType,
//           config: {},
//           isConfigured: false,
//           onConfigure: () => onConfigureNode(newNodeId, "action", actionType),
//           onDelete: () => handleDeleteNode(newNodeId),
//         },
//         draggable: true,
//       }

//       setNodes((nds) => {
//         const updatedNodes = [...nds, newNode]
//         syncNodesToParent(updatedNodes)
//         return updatedNodes
//       })

//       if (lastNode) {
//         const newEdge: Edge = {
//           id: `edge-${lastNode.id}-${newNodeId}`,
//           source: lastNode.id,
//           target: newNodeId,
//           type: "smoothstep",
//           animated: true,
//           style: { stroke: "#6366f1", strokeWidth: 2 },
//           markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
//         }
//         setEdges((eds) => [...eds, newEdge])
//       }
//     },
//     [nodes, onConfigureNode, handleDeleteNode],
//   )

//   const syncNodesToParent = useCallback(
//     (updatedNodes: Node[]) => {
//       const triggerNode = updatedNodes.find((n) => n.data.type === "trigger")
//       const actionNodes = updatedNodes.filter((n) => n.data.type === "action")

//       const trigger = triggerNode
//         ? { type: triggerNode.data.actionType as TriggerTypeId, config: triggerNode.data.config }
//         : null

//       const actions = actionNodes.map((node, index) => ({
//         type: node.data.actionType as ActionTypeId,
//         config: node.data.config,
//         order: index,
//       }))

//       onNodesChange(trigger, actions)
//     },
//     [onNodesChange],
//   )

//   const onConnect = useCallback((params: Connection) => {
//     const newEdge = {
//       ...params,
//       type: "smoothstep",
//       animated: true,
//       style: { stroke: "#6366f1", strokeWidth: 2 },
//       markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
//     }
//     setEdges((eds) => addEdge(newEdge, eds))
//   }, [])

//   const filteredActions = Object.entries(ACTION_TYPES).filter(([_, config]) => {
//     if (selectedCategory === "all") return true
//     return config.category === selectedCategory
//   })

//   return (
//     <div className="space-y-6">
//       {/* Flow Canvas */}
//       <div className="h-[600px] border-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 overflow-hidden shadow-inner">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChangeHandler}
//           onEdgesChange={onEdgesChangeHandler}
//           onConnect={onConnect}
//           nodeTypes={nodeTypes}
//           fitView
//           minZoom={0.3}
//           maxZoom={1.5}
//           defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
//         >
//           <Controls className="bg-card border border-border rounded-lg shadow-lg" />
//           <MiniMap
//             className="bg-card border border-border rounded-lg shadow-lg"
//             nodeColor={(node) => (node.data.type === "trigger" ? "#6366f1" : "#94a3b8")}
//             maskColor="rgb(240, 240, 240, 0.6)"
//           />
//           <Background variant={BackgroundVariant.Dots} gap={16} size={1} className="bg-slate-50 dark:bg-slate-950/50" />
//           <Panel
//             position="top-left"
//             className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-4 py-2 shadow-lg"
//           >
//             <div className="flex items-center gap-2 text-sm">
//               <Zap className="w-4 h-4 text-indigo-500" />
//               <span className="font-medium text-foreground">Automation Flow</span>
//             </div>
//           </Panel>
//         </ReactFlow>
//       </div>

//       {/* Add Actions Panel */}
//       <Card className="p-6 shadow-lg">
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h4 className="font-semibold text-foreground flex items-center gap-2">
//                 <Plus className="w-4 h-4" />
//                 Add Action
//               </h4>
//               <p className="text-sm text-muted-foreground mt-1">Click an action to add it to your automation flow</p>
//             </div>
//           </div>

//           <Separator />

//           {/* Category Filter */}
//           <div className="flex flex-wrap gap-2">
//             {ACTION_CATEGORIES.map((category) => (
//               <Button
//                 key={category.id}
//                 variant={selectedCategory === category.id ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setSelectedCategory(category.id)}
//                 className="text-xs"
//               >
//                 {category.label}
//               </Button>
//             ))}
//           </div>

//           {/* Actions Grid */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
//             {filteredActions.map(([typeId, config]) => {
//               const Icon = config.icon
//               return (
//                 <Button
//                   key={typeId}
//                   variant="outline"
//                   onClick={() => addActionNode(typeId as ActionTypeId)}
//                   className="h-auto flex flex-col gap-2 py-4 hover:bg-primary/5 hover:border-primary hover:shadow-md transition-all"
//                 >
//                   <div
//                     className={cn("w-10 h-10 rounded-lg flex items-center justify-center", config.color, "text-white")}
//                   >
//                     <Icon className="h-5 w-5" />
//                   </div>
//                   <span className="text-xs font-medium text-center leading-tight">{config.label}</span>
//                 </Button>
//               )
//             })}
//           </div>
//         </div>
//       </Card>
//     </div>
//   )
// }


// "use client"

// import { useCallback, useState, useEffect } from "react"
// import {
//   ReactFlow,
//   MiniMap,
//   Controls,
//   Background,
//   addEdge,
//   type Connection,
//   type Node,
//   type Edge,
//   MarkerType,
//   BackgroundVariant,
//   type NodeChange,
//   type EdgeChange,
//   applyNodeChanges,
//   applyEdgeChanges,
//   Panel,
//   Handle,
//   Position,
//   ConnectionLineType,
// } from "@xyflow/react"
// import "@xyflow/react/dist/style.css"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import {
//   TRIGGER_TYPES,
//   ACTION_TYPES,
//   ACTION_CATEGORIES,
//   type TriggerTypeId,
//   type ActionTypeId,
// } from "@/lib/automation-constants"
// import { Trash2, Settings, Plus, Zap } from "lucide-react"
// import { cn } from "@/lib/utils"

// type NodeType = "trigger" | "action"

// interface FlowNodeData {
//   label: string
//   type: NodeType
//   actionType: TriggerTypeId | ActionTypeId
//   config: any
//   onConfigure: () => void
//   onDelete: () => void
//   isConfigured: boolean
// }

// function CustomNode({ data }: { data: FlowNodeData }) {
//   const isTrigger = data.type === "trigger"
//   const typeConfig = isTrigger
//     ? TRIGGER_TYPES[data.actionType as TriggerTypeId]
//     : ACTION_TYPES[data.actionType as ActionTypeId]

//   const Icon = typeConfig?.icon

//   return (
//     <div className="relative">
//       {!isTrigger && (
//         <Handle
//           type="target"
//           position={Position.Top}
//           className="!w-4 !h-4 !bg-indigo-500 !border-2 !border-white dark:!border-slate-900 !shadow-lg hover:!w-5 hover:!h-5 transition-all"
//           style={{ top: -8 }}
//         />
//       )}

//       <Card
//         className={cn(
//           "min-w-[280px] cursor-move transition-all hover:shadow-lg",
//           isTrigger
//             ? "bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-background border-2 border-indigo-300 dark:border-indigo-700"
//             : "bg-white dark:bg-card border-2 border-slate-200 dark:border-slate-700",
//         )}
//       >
//         <div className="p-4">
//           <div className="flex items-start justify-between gap-3 mb-3">
//             <div className="flex items-center gap-3 flex-1">
//               <div
//                 className={cn(
//                   "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm",
//                   isTrigger
//                     ? "bg-indigo-500 text-white"
//                     : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
//                 )}
//               >
//                 {Icon && <Icon className="w-5 h-5" />}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-1">
//                   <h4 className="font-semibold text-sm text-foreground truncate">{data.label}</h4>
//                   {data.isConfigured ? (
//                     <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs">
//                       ✓
//                     </Badge>
//                   ) : (
//                     <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs">
//                       Setup
//                     </Badge>
//                   )}
//                 </div>
//                 <Badge variant="outline" className="text-xs capitalize">
//                   {isTrigger ? "Trigger" : "Action"}
//                 </Badge>
//               </div>
//             </div>
//             {!isTrigger && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   data.onDelete()
//                 }}
//                 className="h-7 w-7 p-0 hover:bg-red-50 dark:hover:bg-red-950/20 flex-shrink-0"
//               >
//                 <Trash2 className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
//               </Button>
//             )}
//           </div>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={(e) => {
//               e.stopPropagation()
//               data.onConfigure()
//             }}
//             className="w-full bg-transparent"
//           >
//             <Settings className="w-3.5 h-3.5 mr-2" />
//             {data.isConfigured ? "Edit" : "Configure"}
//           </Button>
//         </div>
//       </Card>

//       <Handle
//         type="source"
//         position={Position.Bottom}
//         className="!w-4 !h-4 !bg-indigo-500 !border-2 !border-white dark:!border-slate-900 !shadow-lg hover:!w-5 hover:!h-5 transition-all"
//         style={{ bottom: -8 }}
//       />
//     </div>
//   )
// }

// const nodeTypes = {
//   custom: CustomNode,
// }

// interface AutomationFlowCanvasProps {
//   initialTrigger?: { type: TriggerTypeId; config: any }
//   initialActions?: Array<{ type: ActionTypeId; config: any; order: number }>
//   onNodesChange: (
//     trigger: { type: TriggerTypeId; config: any } | null,
//     actions: Array<{ type: ActionTypeId; config: any; order: number }>,
//   ) => void
//   onConfigureNode: (nodeId: string, nodeType: NodeType, actionType: string) => void
// }

// export function AutomationFlowCanvas({
//   initialTrigger,
//   initialActions = [],
//   onNodesChange,
//   onConfigureNode,
// }: AutomationFlowCanvasProps) {
//   const [nodes, setNodes] = useState<Node[]>([])
//   const [edges, setEdges] = useState<Edge[]>([])
//   const [selectedCategory, setSelectedCategory] = useState<string>("all")

//   useEffect(() => {
//     const initialNodes: Node[] = []
//     const initialEdges: Edge[] = []

//     if (initialTrigger) {
//       const triggerConfig = TRIGGER_TYPES[initialTrigger.type]
//       const triggerNode: Node = {
//         id: "trigger-0",
//         type: "custom",
//         position: { x: 300, y: 50 },
//         data: {
//           label: triggerConfig?.label || initialTrigger.type,
//           type: "trigger" as NodeType,
//           actionType: initialTrigger.type,
//           config: initialTrigger.config,
//           isConfigured: Object.keys(initialTrigger.config || {}).length > 0,
//           onConfigure: () => onConfigureNode("trigger-0", "trigger", initialTrigger.type),
//           onDelete: () => {},
//         },
//         draggable: true,
//       }
//       initialNodes.push(triggerNode)
//     }

//     initialActions.forEach((action, index) => {
//       const actionConfig = ACTION_TYPES[action.type as ActionTypeId]
//       const actionNode: Node = {
//         id: `action-${index + 1}`,
//         type: "custom",
//         position: { x: 300, y: 200 + index * 180 },
//         data: {
//           label: actionConfig?.label || action.type,
//           type: "action" as NodeType,
//           actionType: action.type,
//           config: action.config,
//           isConfigured: Object.keys(action.config || {}).length > 0,
//           onConfigure: () => onConfigureNode(`action-${index + 1}`, "action", action.type),
//           onDelete: () => handleDeleteNode(`action-${index + 1}`),
//         },
//         draggable: true,
//       }
//       initialNodes.push(actionNode)

//       if (index === 0 && initialTrigger) {
//         initialEdges.push({
//           id: `edge-trigger-action-1`,
//           source: "trigger-0",
//           target: "action-1",
//           type: "smoothstep",
//           animated: true,
//           style: { stroke: "#6366f1", strokeWidth: 2 },
//           markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
//         })
//       } else if (index > 0) {
//         initialEdges.push({
//           id: `edge-action-${index}-${index + 1}`,
//           source: `action-${index}`,
//           target: `action-${index + 1}`,
//           type: "smoothstep",
//           animated: true,
//           style: { stroke: "#6366f1", strokeWidth: 2 },
//           markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
//         })
//       }
//     })

//     if (initialNodes.length > 0) {
//       setNodes(initialNodes)
//       setEdges(initialEdges)
//     }
//   }, [initialTrigger, initialActions])

//   const onNodesChangeHandler = useCallback((changes: NodeChange[]) => {
//     setNodes((nds) => applyNodeChanges(changes, nds))
//   }, [])

//   const onEdgesChangeHandler = useCallback((changes: EdgeChange[]) => {
//     setEdges((eds) => applyEdgeChanges(changes, eds))
//   }, [])

//   const handleDeleteNode = useCallback(
//     (nodeId: string) => {
//       setNodes((nds) => {
//         const updatedNodes = nds.filter((node) => node.id !== nodeId)

//         const renumberedNodes = updatedNodes.map((node, index) => {
//           if (node.data.type === "action") {
//             return {
//               ...node,
//               id: `action-${index}`,
//             }
//           }
//           return node
//         })

//         syncNodesToParent(renumberedNodes)
//         return renumberedNodes
//       })

//       setEdges((eds) => {
//         const filteredEdges = eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)

//         const actionNodes = nodes.filter((n) => n.data.type === "action" && n.id !== nodeId)
//         const newEdges: Edge[] = []

//         actionNodes.forEach((node, index) => {
//           if (index === 0) {
//             newEdges.push({
//               id: "edge-trigger-action-1",
//               source: "trigger-0",
//               target: "action-1",
//               type: "smoothstep",
//               animated: true,
//               style: { stroke: "#6366f1", strokeWidth: 2 },
//               markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
//             })
//           } else {
//             newEdges.push({
//               id: `edge-action-${index}-${index + 1}`,
//               source: `action-${index}`,
//               target: `action-${index + 1}`,
//               type: "smoothstep",
//               animated: true,
//               style: { stroke: "#6366f1", strokeWidth: 2 },
//               markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
//             })
//           }
//         })

//         return newEdges
//       })
//     },
//     [nodes],
//   )

//   const addActionNode = useCallback(
//     (actionType: ActionTypeId) => {
//       const actionConfig = ACTION_TYPES[actionType]
//       const actionNodes = nodes.filter((n) => n.data.type === "action")
//       const newNodeId = `action-${actionNodes.length + 1}`
//       const lastNode = nodes[nodes.length - 1]
//       const yPosition = lastNode ? lastNode.position.y + 180 : 200

//       const newNode: Node = {
//         id: newNodeId,
//         type: "custom",
//         position: { x: 300, y: yPosition },
//         data: {
//           label: actionConfig.label,
//           type: "action" as NodeType,
//           actionType,
//           config: {},
//           isConfigured: false,
//           onConfigure: () => onConfigureNode(newNodeId, "action", actionType),
//           onDelete: () => handleDeleteNode(newNodeId),
//         },
//         draggable: true,
//       }

//       setNodes((nds) => {
//         const updatedNodes = [...nds, newNode]
//         syncNodesToParent(updatedNodes)
//         return updatedNodes
//       })

//       if (lastNode) {
//         const newEdge: Edge = {
//           id: `edge-${lastNode.id}-${newNodeId}`,
//           source: lastNode.id,
//           target: newNodeId,
//           type: "smoothstep",
//           animated: true,
//           style: { stroke: "#6366f1", strokeWidth: 2 },
//           markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
//         }
//         setEdges((eds) => [...eds, newEdge])
//       }
//     },
//     [nodes, onConfigureNode, handleDeleteNode],
//   )

//   const syncNodesToParent = useCallback(
//     (updatedNodes: Node[]) => {
//       const triggerNode = updatedNodes.find((n) => n.data.type === "trigger")
//       const actionNodes = updatedNodes.filter((n) => n.data.type === "action")

//       const trigger = triggerNode
//         ? { type: triggerNode.data.actionType as TriggerTypeId, config: triggerNode.data.config }
//         : null

//       const actions = actionNodes.map((node, index) => ({
//         type: node.data.actionType as ActionTypeId,
//         config: node.data.config,
//         order: index,
//       }))

//       onNodesChange(trigger, actions)
//     },
//     [onNodesChange],
//   )

//   const onConnect = useCallback((params: Connection) => {
//     const newEdge = {
//       ...params,
//       type: "smoothstep",
//       animated: true,
//       style: { stroke: "#6366f1", strokeWidth: 2 },
//       markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
//     }
//     setEdges((eds) => addEdge(newEdge, eds))
//   }, [])

//   const filteredActions = Object.entries(ACTION_TYPES).filter(([_, config]) => {
//     if (selectedCategory === "all") return true
//     return config.category === selectedCategory
//   })

//   return (
//     <div className="space-y-6">
//       {/* Flow Canvas */}
//       <div className="h-[600px] border-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 overflow-hidden shadow-inner">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChangeHandler}
//           onEdgesChange={onEdgesChangeHandler}
//           onConnect={onConnect}
//           nodeTypes={nodeTypes}
//           fitView
//           minZoom={0.3}
//           maxZoom={1.5}
//           defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
//           connectionLineStyle={{ stroke: "#6366f1", strokeWidth: 3 }}
//           connectionLineType={ConnectionLineType.SmoothStep}
//         >
//           <Controls className="bg-card border border-border rounded-lg shadow-lg" />
//           <MiniMap
//             className="bg-card border border-border rounded-lg shadow-lg"
//             nodeColor={(node) => (node.data.type === "trigger" ? "#6366f1" : "#94a3b8")}
//             maskColor="rgb(240, 240, 240, 0.6)"
//           />
//           <Background variant={BackgroundVariant.Dots} gap={16} size={1} className="bg-slate-50 dark:bg-slate-950/50" />
//           <Panel
//             position="top-left"
//             className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-4 py-2 shadow-lg"
//           >
//             <div className="flex items-center gap-2 text-sm">
//               <Zap className="w-4 h-4 text-indigo-500" />
//               <span className="font-medium text-foreground">Automation Flow</span>
//               <Badge variant="outline" className="text-xs">
//                 Drag handles to connect
//               </Badge>
//             </div>
//           </Panel>
//         </ReactFlow>
//       </div>

//       {/* Add Actions Panel */}
//       <Card className="p-6 shadow-lg">
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h4 className="font-semibold text-foreground flex items-center gap-2">
//                 <Plus className="w-4 h-4" />
//                 Add Action
//               </h4>
//               <p className="text-sm text-muted-foreground mt-1">Click an action to add it to your automation flow</p>
//             </div>
//           </div>

//           <Separator />

//           {/* Category Filter */}
//           <div className="flex flex-wrap gap-2">
//             {ACTION_CATEGORIES.map((category) => (
//               <Button
//                 key={category.id}
//                 variant={selectedCategory === category.id ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setSelectedCategory(category.id)}
//                 className="text-xs"
//               >
//                 {category.label}
//               </Button>
//             ))}
//           </div>

//           {/* Actions Grid */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
//             {filteredActions.map(([typeId, config]) => {
//               const Icon = config.icon
//               return (
//                 <Button
//                   key={typeId}
//                   variant="outline"
//                   onClick={() => addActionNode(typeId as ActionTypeId)}
//                   className="h-auto flex flex-col gap-2 py-4 hover:bg-primary/5 hover:border-primary hover:shadow-md transition-all"
//                 >
//                   <div
//                     className={cn(
//                       "w-10 h-10 rounded-lg flex items-center justify-center shadow-sm",
//                       config.color,
//                       "text-white",
//                     )}
//                   >
//                     <Icon className="h-5 w-5" />
//                   </div>
//                   <span className="text-xs font-medium text-center leading-tight">{config.label}</span>
//                 </Button>
//               )
//             })}
//           </div>
//         </div>
//       </Card>
//     </div>
//   )
// }


"use client"

import type React from "react"

import { useCallback, useState, useEffect, useMemo, useRef } from "react"
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  type Node,
  type Edge,
  MarkerType,
  type NodeChange,
  type EdgeChange,
  Handle,
  Position,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  Panel,
  type Connection,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TRIGGER_TYPES, ACTION_TYPES, type TriggerTypeId, type ActionTypeId } from "@/lib/automation-constants"
import { Trash2, Settings, Plus, ChevronDown, Zap, Sparkles, AlertCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-is-mobile"
import { InCanvasTriggerSelector } from "./in-canvas-trigger-selector"
import { TriggerSelectorDialog } from "./trigger-selector-dialog"

type NodeType = "trigger" | "action" | "add-button" | "trigger-selector"

interface FlowNodeData extends Record<string, unknown> {
  label: string
  type: NodeType
  actionType?: TriggerTypeId | ActionTypeId
  config?: any
  onConfigure?: () => void
  onDelete?: () => void
  onAddAction?: (actionType: ActionTypeId) => void
  onChangeTrigger?: () => void
  onSelectTrigger?: (triggerType: TriggerTypeId) => void
  isConfigured?: boolean
}

function TriggerSelectorNode({ data }: { data: FlowNodeData }) {
  return (
    <div className="relative animate-in fade-in-0 zoom-in-95 duration-500">
      <InCanvasTriggerSelector
        onSelect={(triggerType) => data.onSelectTrigger?.(triggerType)}
        className="border-4 border-violet-400 shadow-[0_0_40px_rgba(139,92,246,0.5)] animate-pulse-glow"
      />
    </div>
  )
}

function TriggerNode({ data }: { data: FlowNodeData }) {
  const typeConfig = data.actionType ? TRIGGER_TYPES[data.actionType as TriggerTypeId] : null
  const Icon = typeConfig?.icon
  const isMobile = useMobile()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative group animate-in fade-in-0 slide-in-from-top-4 duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "min-w-[280px] md:min-w-[340px] cursor-move transition-all duration-300 shadow-2xl",
          "border-0 overflow-hidden relative",
          "bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600",
          isHovered && "shadow-[0_20px_70px_rgba(139,92,246,0.6)] scale-105 rotate-1",
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />
        <div className="absolute inset-[2px] bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-[inherit]" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-2 h-2 bg-white/30 rounded-full top-1/4 left-1/4 animate-float"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute w-1.5 h-1.5 bg-white/20 rounded-full top-3/4 left-2/3 animate-float"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute w-2.5 h-2.5 bg-white/25 rounded-full top-1/2 right-1/4 animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className={cn("p-5 md:p-6 relative z-10")}>
          <div className={cn("flex items-center gap-3 md:gap-4 mb-4")}>
            <div
              className={cn(
                "w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/20 backdrop-blur-xl",
                "flex items-center justify-center flex-shrink-0 shadow-2xl",
                "border-2 border-white/30 transition-all duration-300",
                isHovered && "scale-110 rotate-12 border-white/50",
              )}
            >
              {Icon && <Icon className="w-7 h-7 md:w-8 md:h-8 text-white drop-shadow-lg" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className={cn("flex items-center gap-2 mb-2")}>
                <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
                <Badge className="bg-yellow-400/90 text-yellow-900 border-0 shadow-lg font-bold text-xs backdrop-blur-sm">
                  TRIGGER
                </Badge>
              </div>
              <h4 className="font-bold text-base md:text-lg text-white drop-shadow-md truncate">{data.label}</h4>
              {data.isConfigured ? (
                <Badge className="mt-1.5 bg-emerald-400/30 text-emerald-100 border border-emerald-300/50 text-xs backdrop-blur-sm">
                  ✓ Configured
                </Badge>
              ) : (
                <Badge className="mt-1.5 bg-amber-400/30 text-amber-100 border border-amber-300/50 text-xs backdrop-blur-sm animate-pulse">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Setup Required
                </Badge>
              )}
            </div>
          </div>

          <div className={cn("flex gap-2", isMobile && "flex-col")}>
            <Button
              variant="secondary"
              size={isMobile ? "default" : "sm"}
              onClick={(e) => {
                e.stopPropagation()
                data.onConfigure?.()
              }}
              className={cn(
                "bg-white hover:bg-white/90 text-purple-700 font-semibold shadow-lg",
                "hover:shadow-xl transition-all duration-200 hover:scale-105",
                isMobile ? "w-full" : "flex-1",
              )}
            >
              <Settings className="w-4 h-4 mr-2" />
              {data.isConfigured ? "Edit Trigger" : "Configure Now"}
            </Button>
            {!isMobile && (
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  data.onChangeTrigger?.()
                }}
                className="bg-white/90 hover:bg-white text-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Handle
        type="source"
        position={Position.Bottom}
        className={cn(
          "!bg-gradient-to-r !from-violet-400 !to-purple-500 !border-4 !border-white !shadow-2xl transition-all duration-300",
          isMobile ? "!w-6 !h-6" : "!w-5 !h-5 hover:!w-7 hover:!h-7 hover:!shadow-[0_0_20px_rgba(139,92,246,0.8)]",
        )}
        style={{ bottom: isMobile ? -12 : -10 }}
      />
    </div>
  )
}

function ActionNode({ data }: { data: FlowNodeData }) {
  const typeConfig = data.actionType ? ACTION_TYPES[data.actionType as ActionTypeId] : null
  const Icon = typeConfig?.icon
  const isMobile = useMobile()
  const [isHovered, setIsHovered] = useState(false)

  const gradientClass = useMemo(() => {
    if (!typeConfig) return "from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"

    const categoryGradients: Record<string, string> = {
      messaging: "from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950",
      ai: "from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950",
      organization: "from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950",
      moderation: "from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950",
      flow: "from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900",
      handoff: "from-rose-50 to-red-50 dark:from-rose-950 dark:to-red-950",
      integration: "from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950",
    }

    return categoryGradients[typeConfig.category] || categoryGradients.messaging
  }, [typeConfig])

  const borderColorClass = useMemo(() => {
    if (!typeConfig) return "border-slate-300 dark:border-slate-700"

    const borderColors: Record<string, string> = {
      messaging: "border-blue-300 dark:border-blue-700",
      ai: "border-purple-300 dark:border-purple-700",
      organization: "border-teal-300 dark:border-teal-700",
      moderation: "border-yellow-300 dark:border-yellow-700",
      flow: "border-gray-300 dark:border-gray-700",
      handoff: "border-rose-300 dark:border-rose-700",
      integration: "border-violet-300 dark:border-violet-700",
    }

    return borderColors[typeConfig.category] || borderColors.messaging
  }, [typeConfig])

  return (
    <div
      className="relative group animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
      style={{ animationDelay: "100ms" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={cn(
          "!bg-gradient-to-r !from-indigo-400 !to-purple-500 !border-4 !border-white !shadow-2xl transition-all duration-300",
          isMobile ? "!w-6 !h-6" : "!w-5 !h-5 hover:!w-7 hover:!h-7 hover:!shadow-[0_0_20px_rgba(99,102,241,0.8)]",
        )}
        style={{ top: isMobile ? -12 : -10 }}
      />

      <Card
        className={cn(
          "min-w-[280px] md:min-w-[340px] cursor-move transition-all duration-300 shadow-xl",
          "border-2 relative overflow-hidden",
          `bg-gradient-to-br ${gradientClass}`,
          borderColorClass,
          isHovered && "shadow-2xl scale-105 -rotate-1",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent",
            "translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000",
          )}
        />

        <div className={cn("p-5 md:p-6 relative z-10")}>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={cn(
                  "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg",
                  "transition-all duration-300 border-2",
                  typeConfig?.color || "bg-slate-500",
                  "text-white relative overflow-hidden",
                  isHovered && "scale-110 -rotate-6 shadow-2xl",
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                {Icon && <Icon className="w-6 h-6 md:w-7 h-7 relative z-10 drop-shadow-lg" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h4 className="font-bold text-base md:text-lg text-foreground truncate">{data.label}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-medium border-2">
                    {typeConfig?.category || "Action"}
                  </Badge>
                  {data.isConfigured ? (
                    <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs border-0">
                      ✓ Ready
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs border-0 animate-pulse">
                      Setup
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                data.onDelete?.()
              }}
              className={cn(
                "hover:bg-red-100 dark:hover:bg-red-950/40 flex-shrink-0 transition-all duration-200",
                "hover:scale-110 hover:rotate-12",
                isMobile ? "h-10 w-10" : "h-9 w-9",
              )}
            >
              <Trash2 className={cn(isMobile ? "h-5 w-5" : "h-4.5 w-4.5", "text-red-600 dark:text-red-400")} />
            </Button>
          </div>

          <Button
            variant="outline"
            size={isMobile ? "default" : "sm"}
            onClick={(e) => {
              e.stopPropagation()
              data.onConfigure?.()
            }}
            className={cn(
              "w-full border-2 font-semibold transition-all duration-200",
              "hover:scale-105 hover:shadow-lg",
              isMobile && "h-11",
            )}
          >
            <Settings className="w-4 h-4 mr-2" />
            {data.isConfigured ? "Edit Configuration" : "Configure Action"}
          </Button>
        </div>
      </Card>

      <Handle
        type="source"
        position={Position.Bottom}
        className={cn(
          "!bg-gradient-to-r !from-indigo-400 !to-purple-500 !border-4 !border-white !shadow-2xl transition-all duration-300",
          isMobile ? "!w-6 !h-6" : "!w-5 !h-5 hover:!w-7 hover:!h-7 hover:!shadow-[0_0_20px_rgba(99,102,241,0.8)]",
        )}
        style={{ bottom: isMobile ? -12 : -10 }}
      />
    </div>
  )
}

function AddButtonNode({ data }: { data: FlowNodeData }) {
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const isMobile = useMobile()

  const categories = [
    { id: "all", label: "All" },
    { id: "messaging", label: "Messaging" },
    { id: "ai", label: "AI" },
    { id: "flow", label: "Flow" },
  ]

  const filteredActions = Object.entries(ACTION_TYPES).filter(
    ([_, config]) => selectedCategory === "all" || config.category === selectedCategory,
  )

  return (
    <div className="relative animate-in fade-in-0 zoom-in-50 duration-500" style={{ animationDelay: "200ms" }}>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-slate-300 dark:!bg-slate-600 !border-2 !border-white !shadow-md opacity-0"
        style={{ top: isMobile ? -12 : -10 }}
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size={isMobile ? "lg" : "default"}
            className={cn(
              "rounded-full shadow-xl border-3 border-dashed transition-all duration-300",
              "bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800",
              "border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400",
              "hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/50",
              "hover:scale-110 hover:shadow-2xl hover:shadow-indigo-500/50",
              isMobile ? "h-16 w-16" : "h-14 w-14",
            )}
          >
            <Plus className={cn(isMobile ? "w-8 h-8" : "w-7 h-7", "animate-pulse")} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn("p-0 border-2 shadow-2xl", isMobile ? "w-[90vw]" : "w-96")}
          align="center"
          side={isMobile ? "bottom" : "right"}
        >
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 text-white">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Add Action
            </h3>
            <p className="text-sm text-white/90 mt-1">Choose what happens next</p>
          </div>

          <div className="p-3 border-b bg-muted/30">
            <div className="flex gap-1 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn("text-xs transition-all duration-200", selectedCategory === cat.id && "shadow-md")}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2 automation-scroll">
            <div className="space-y-1.5">
              {filteredActions.map(([typeId, config]) => {
                const Icon = config.icon
                return (
                  <Button
                    key={typeId}
                    variant="ghost"
                    onClick={() => {
                      data.onAddAction?.(typeId as ActionTypeId)
                      setOpen(false)
                    }}
                    className={cn(
                      "w-full justify-start h-auto p-3 transition-all duration-200",
                      "hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50",
                      "dark:hover:from-indigo-950 dark:hover:to-purple-950",
                      "hover:scale-105 hover:shadow-md border border-transparent hover:border-indigo-200",
                    )}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          config.color,
                          "text-white shadow-md",
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-sm">{config.label}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{config.description}</div>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  addButton: AddButtonNode,
  triggerSelector: TriggerSelectorNode,
}

interface AutomationFlowCanvasProps {
  initialTrigger?: { type: TriggerTypeId; config: any }
  initialActions?: Array<{ type: ActionTypeId; config: any; order: number }>
  onNodesChange: (
    trigger: { type: TriggerTypeId; config: any } | null,
    actions: Array<{ type: ActionTypeId; config: any; order: number }>,
  ) => void
  onConfigureNode: (nodeId: string, nodeType: "trigger" | "action", actionType: string) => void
  onSelectTrigger?: (triggerType: TriggerTypeId) => void
}

export function AutomationFlowCanvas({
  initialTrigger,
  initialActions = [],
  onNodesChange,
  onConfigureNode,
  onSelectTrigger,
}: AutomationFlowCanvasProps) {
  const [nodes, setNodes, onNodesChangeHandler] = useNodesState<Node<FlowNodeData>>([])
  const [edges, setEdges, onEdgesChangeHandler] = useEdgesState<Edge>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [showTriggerDialog, setShowTriggerDialog] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const isMobile = useMobile()
  const isTablet = false


  const prevTriggerRef = useRef<string | undefined>(undefined)
  const prevActionsRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    // Only compare the actual data (type and config), not functions
    const triggerKey = initialTrigger 
      ? JSON.stringify({ type: initialTrigger.type, config: initialTrigger.config })
      : "none"
    const actionsKey = JSON.stringify(
      initialActions.map(a => ({ type: a.type, config: a.config, order: a.order }))
    )

    if (prevTriggerRef.current === triggerKey && prevActionsRef.current === actionsKey) {
      return
    }

    prevTriggerRef.current = triggerKey
    prevActionsRef.current = actionsKey

  // const prevTriggerRef = useRef<string>()
  // const prevActionsRef = useRef<string>()

  // useEffect(() => {
  //   const triggerKey = initialTrigger ? JSON.stringify(initialTrigger) : "none"
  //   const actionsKey = JSON.stringify(initialActions)

  //   if (prevTriggerRef.current === triggerKey && prevActionsRef.current === actionsKey) {
  //     return
  //   }

  //   prevTriggerRef.current = triggerKey
  //   prevActionsRef.current = actionsKey

    const newNodes: Node<FlowNodeData>[] = []
    const newEdges: Edge[] = []

    const baseX = 50
    const nodeSpacing = isMobile ? 200 : isTablet ? 220 : 250

    if (initialTrigger === undefined || initialTrigger === null) {
      const selectorNode: Node<FlowNodeData> = {
        id: "trigger-selector",
        type: "triggerSelector",
        position: { x: isMobile ? 20 : baseX, y: 50 },
        data: {
          label: "Select Trigger",
          type: "trigger-selector" as NodeType,
          onSelectTrigger: onSelectTrigger,
        },
        draggable: false,
      }
      newNodes.push(selectorNode)

      const addButtonX = isMobile ? 20 : baseX
      const addButtonNode: Node<FlowNodeData> = {
        id: "add-button",
        type: "addButton",
        position: { x: addButtonX, y: 50 + nodeSpacing },
        data: {
          label: "Add Action",
          type: "add-button" as NodeType,
          onAddAction: handleAddAction,
        },
        draggable: false,
      }
      newNodes.push(addButtonNode)

      const edgeToAdd: Edge = {
        id: "edge-to-selector",
        source: "trigger-selector",
        target: "add-button",
        type: "smoothstep",
        animated: false,
        style: {
          stroke: "#cbd5e1",
          strokeWidth: isMobile ? 4 : 3,
          strokeDasharray: "8,8",
        },
      }
      newEdges.push(edgeToAdd)
    } else {
      const triggerNode: Node<FlowNodeData> = {
        id: "trigger",
        type: "trigger",
        position: { x: isMobile ? 20 : baseX, y: 50 },
        data: {
          label: TRIGGER_TYPES[initialTrigger.type]?.label || "Trigger",
          type: "trigger" as NodeType,
          actionType: initialTrigger.type,
          config: initialTrigger.config,
          isConfigured: !!initialTrigger.config && Object.keys(initialTrigger.config).length > 0,
          onConfigure: () => onConfigureNode("trigger", "trigger", initialTrigger.type),
          onChangeTrigger: () => setShowTriggerDialog(true),
        },
        draggable: !isMobile,
      }
      newNodes.push(triggerNode)

      initialActions
        .sort((a, b) => a.order - b.order)
        .forEach((action, index) => {
          const actionNode: Node<FlowNodeData> = {
            id: `action-${index}`,
            type: "action",
            position: { x: isMobile ? 20 : baseX, y: 50 + nodeSpacing * (index + 1) },
            data: {
              label: ACTION_TYPES[action.type]?.label || "Action",
              type: "action" as NodeType,
              actionType: action.type,
              config: action.config,
              isConfigured: !!action.config && Object.keys(action.config).length > 0,
              onConfigure: () => onConfigureNode(`action-${index}`, "action", action.type),
              onDelete: () => handleDeleteAction(index),
            },
            draggable: !isMobile,
          }
          newNodes.push(actionNode)
        })

      const lastNodeId = initialActions.length > 0 ? `action-${initialActions.length - 1}` : "trigger"

      const finalAddButton: Node<FlowNodeData> = {
        id: `add-button-final`,
        type: "addButton",
        position: { x: isMobile ? 20 : baseX, y: 50 + nodeSpacing * (initialActions.length + 1) },
        data: {
          label: "Add Action",
          type: "add-button" as NodeType,
          onAddAction: handleAddAction,
        },
        draggable: false,
      }
      newNodes.push(finalAddButton)

      const edgeToFinalAdd: Edge = {
        id: `edge-to-final-add`,
        source: lastNodeId,
        target: `add-button-final`,
        type: "smoothstep",
        animated: false,
        style: {
          stroke: "#cbd5e1",
          strokeWidth: isMobile ? 4 : 3,
          strokeDasharray: "8,8",
        },
      }
      newEdges.push(edgeToFinalAdd)
    }

    setNodes(newNodes)
    setEdges(newEdges)
  }, [
    initialTrigger,
    JSON.stringify(initialActions.map((a) => ({ type: a.type, order: a.order }))),
    isMobile,
    isTablet,
    onSelectTrigger,
    onConfigureNode,
  ])

  const handleDeleteAction = useCallback(
    (nodeIdOrIndex: string | number) => {
      setNodes((nds) => {
        const updatedNodes = nds.filter((node) => node.id !== `action-${nodeIdOrIndex}` && node.type !== "addButton")
        const triggerNode = updatedNodes.find((n) => n.type === "trigger")
        const actionNodes = updatedNodes.filter((n) => n.type === "action")

        const baseX = 50
        const startY = 50
        const nodeSpacing = isMobile ? 200 : isTablet ? 220 : 250

        const renumberedActions = actionNodes.map((node, index) => ({
          ...node,
          id: `action-${index}`,
          position: { x: isMobile ? 20 : baseX, y: startY + (index + 1) * nodeSpacing },
        }))

        const finalNodes = triggerNode ? [triggerNode, ...renumberedActions] : renumberedActions

        if (finalNodes.length > 0) {
          const lastNode = finalNodes[finalNodes.length - 1]
          const addButtonX = isMobile ? 20 : baseX
          finalNodes.push({
            id: "add-button",
            type: "addButton",
            position: { x: addButtonX, y: lastNode.position.y + nodeSpacing },
            data: {
              label: "Add Action",
              type: "add-button" as NodeType,
              onAddAction: (actionType: ActionTypeId) => handleAddAction(actionType),
            },
            draggable: false,
          })
        }

        const triggerData = finalNodes.find((n) => n.type === "trigger")
        const actionData = finalNodes.filter((n) => n.type === "action")

        const finalTrigger = triggerData
          ? { type: triggerData.data.actionType as TriggerTypeId, config: triggerData.data.config }
          : null

        const finalActions = actionData.map((node, index) => ({
          type: node.data.actionType as ActionTypeId,
          config: node.data.config,
          order: index,
        }))

        onNodesChange(finalTrigger, finalActions)
        return finalNodes
      })

      rebuildEdges()
    },
    [isMobile, isTablet, onNodesChange],
  )

  const rebuildEdges = useCallback(() => {
    setNodes((currentNodes) => {
      setEdges(() => {
        const newEdges: Edge[] = []
        const flowNodes = currentNodes.filter((n) => n.type !== "addButton")

        for (let i = 0; i < flowNodes.length - 1; i++) {
          newEdges.push({
            id: `edge-${i}`,
            source: flowNodes[i].id,
            target: flowNodes[i + 1].id,
            type: "smoothstep",
            animated: true,
            style: {
              stroke: "url(#edge-gradient)",
              strokeWidth: isMobile ? 4 : 3,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#8b5cf6",
              width: isMobile ? 24 : 20,
              height: isMobile ? 24 : 20,
            },
          })
        }

        if (flowNodes.length > 0) {
          newEdges.push({
            id: "edge-to-add",
            source: flowNodes[flowNodes.length - 1].id,
            target: "add-button",
            type: "smoothstep",
            animated: false,
            style: {
              stroke: "#cbd5e1",
              strokeWidth: isMobile ? 4 : 3,
              strokeDasharray: "8,8",
            },
          })
        }

        return newEdges
      })
      return currentNodes
    })
  }, [isMobile, setEdges, setNodes])

  const handleAddAction = useCallback(
    (actionType: ActionTypeId) => {
      const actionConfig = ACTION_TYPES[actionType]
      const baseX = 50
      const startY = 50
      const nodeSpacing = isMobile ? 200 : isTablet ? 220 : 250

      setNodes((nds) => {
        const actionNodes = nds.filter((n) => n.type === "action")
        const newNodeId = `action-${actionNodes.length}`
        const addButtonNode = nds.find((n) => n.id === "add-button")
        const yPosition = addButtonNode ? addButtonNode.position.y : startY + (actionNodes.length + 1) * nodeSpacing

        const newNode: Node<FlowNodeData> = {
          id: newNodeId,
          type: "action",
          position: { x: isMobile ? 20 : baseX, y: yPosition },
          data: {
            label: actionConfig.label,
            type: "action" as NodeType,
            actionType,
            config: {},
            isConfigured: false,
            onConfigure: () => onConfigureNode(newNodeId, "action", actionType),
            onDelete: () => handleDeleteAction(newNodeId),
          },
          draggable: !isMobile,
        }

        const withoutAddButton = nds.filter((n) => n.id !== "add-button")
        const updatedNodes = [...withoutAddButton, newNode]

        const addButtonX = isMobile ? 20 : baseX
        updatedNodes.push({
          id: "add-button",
          type: "addButton",
          position: { x: addButtonX, y: yPosition + nodeSpacing },
          data: {
            label: "Add Action",
            type: "add-button" as NodeType,
            onAddAction: handleAddAction,
          },
          draggable: false,
        })

        const triggerNode = updatedNodes.find((n) => n.type === "trigger")
        const actions = updatedNodes
          .filter((n) => n.type === "action")
          .map((node, index) => ({
            type: node.data.actionType as ActionTypeId,
            config: node.data.config,
            order: index,
          }))

        const trigger = triggerNode
          ? { type: triggerNode.data.actionType as TriggerTypeId, config: triggerNode.data.config }
          : null

        onNodesChange(trigger, actions)
        return updatedNodes
      })

      setTimeout(() => rebuildEdges(), 50)
    },
    [onConfigureNode, isMobile, isTablet, onNodesChange, handleDeleteAction, rebuildEdges, setNodes],
  )

  const onNodesChangeHandlerWrapper = useCallback(
    (changes: NodeChange[]) => {
      onNodesChangeHandler(changes as NodeChange<Node<FlowNodeData>>[])
      setNodes((nds) => {
        const triggerNode = nds.find((n) => n.type === "trigger")
        const actionNodes = nds.filter((n) => n.type === "action")

        const triggerData = triggerNode
          ? { type: triggerNode.data.actionType as TriggerTypeId, config: triggerNode.data.config }
          : null

        const actionData = actionNodes.map((node, index) => ({
          type: node.data.actionType as ActionTypeId,
          config: node.data.config,
          order: index,
        }))

        onNodesChange(triggerData, actionData)
        return nds
      })
    },
    [onNodesChangeHandler, onNodesChange, setNodes],
  )

  const onEdgesChangeHandlerWrapper = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChangeHandler(changes)
    },
    [onEdgesChangeHandler],
  )

  const onEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      setTimeout(() => rebuildEdges(), 100)
    },
    [rebuildEdges],
  )

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setNodes((nds) => {
        const updatedNodes = nds.map((n) => (n.id === node.id ? { ...n, position: node.position } : n))
        return updatedNodes
      })
    },
    [setNodes],
  )

  const onNodeDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const onConnect = useCallback((connection: Connection) => {
    console.log("[v0] Connection attempt:", connection)
  }, [])

  return (
    <>
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChangeHandlerWrapper}
            onEdgesChange={onEdgesChangeHandlerWrapper}
            onEdgesDelete={onEdgesDelete}
            onNodeDragStart={onNodeDragStart}
            onNodeDragStop={onNodeDragStop}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3, maxZoom: isMobile ? 0.7 : 0.8 }}
            minZoom={isMobile ? 0.3 : 0.1}
            maxZoom={isMobile ? 1.2 : 1.5}
            defaultViewport={{ x: 0, y: 0, zoom: isMobile ? 0.7 : 0.65 }}
            connectionLineStyle={{ stroke: "#8b5cf6", strokeWidth: isMobile ? 5 : 4 }}
            connectionLineType={ConnectionLineType.SmoothStep}
            nodesDraggable={true}
            nodesConnectable={false}
            edgesFocusable={true}
            edgesReconnectable={false}
            translateExtent={[
              [-2000, -2000],
              [2000, 4000],
            ]}
            nodeExtent={[
              [-1500, -1500],
              [1500, 3500],
            ]}
            selectNodesOnDrag={false}
            panOnDrag={[1, 2]}
            selectionOnDrag={false}
            className="relative z-10"
          >
            <svg style={{ position: "absolute", width: 0, height: 0 }}>
              <defs>
                <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>

            {!isMobile && (
              <Controls
                className="!bg-card/80 backdrop-blur-xl !border-2 !border-border !rounded-2xl !shadow-2xl !left-6 !bottom-6"
                showInteractive={false}
              />
            )}

            {!isMobile && !isTablet && (
              <MiniMap
                className="!bg-card/80 backdrop-blur-xl !border-2 !border-border !rounded-2xl !shadow-2xl !right-6 !bottom-6"
                nodeColor={(node) => {
                  if (node.type === "trigger") return "#8b5cf6"
                  if (node.type === "addButton") return "#cbd5e1"
                  if (node.type === "triggerSelector") return "#a78bfa"
                  return "#6366f1"
                }}
                maskColor="rgba(0, 0, 0, 0.1)"
              />
            )}

            <Background color="#94a3b8" gap={isMobile ? 20 : 16} size={isMobile ? 1.5 : 1} />

            <Panel
              position="top-left"
              className="bg-card/80 backdrop-blur-xl border-2 border-border rounded-xl shadow-xl p-3 m-4"
            >
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-violet-500 animate-pulse" />
                  <span className="font-medium">{initialTrigger ? 1 : 0} Trigger</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="font-medium">{initialActions.length} Actions</span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {showTriggerDialog && (
        <TriggerSelectorDialog
          open={showTriggerDialog}
          onOpenChange={setShowTriggerDialog}
          onSelect={(triggerType) => {
            onSelectTrigger?.(triggerType)
            setShowTriggerDialog(false)
          }}
        />
      )}
    </>
  )
}
