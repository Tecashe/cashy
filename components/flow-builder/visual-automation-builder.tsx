"use client"

import { useState, useCallback, useEffect } from "react"
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
  Panel,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TriggerNode, ActionNode } from "./custom-nodes"
import { TriggerEditor } from "./trigger-editor"
import { ActionEditor } from "./action-editor"
import { TriggerSelector } from "./trigger-selector"
import { ActionSelector } from "./action-selector"
import { Save, Plus, Zap } from "lucide-react"

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
}

export interface FlowNode {
  id: string
  type: "trigger" | "action"
  actionType: string
  data: any
  position: { x: number; y: number }
}

interface VisualAutomationBuilderProps {
  initialNodes?: FlowNode[]
  onSave: (nodes: FlowNode[]) => Promise<void>
  isSaving?: boolean
}

export function VisualAutomationBuilder({ initialNodes = [], onSave, isSaving = false }: VisualAutomationBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isTriggerSelectorOpen, setIsTriggerSelectorOpen] = useState(false)
  const [isActionSelectorOpen, setIsActionSelectorOpen] = useState(false)

  // Initialize nodes and edges from initialNodes
  useEffect(() => {
    if (initialNodes.length > 0) {
      const flowNodes: Node[] = []
      const flowEdges: Edge[] = []

      initialNodes.forEach((node, index) => {
        const position =
          node.position.x !== 0 || node.position.y !== 0 ? node.position : { x: 400, y: index * 150 + 50 }

        flowNodes.push({
          id: node.id,
          type: node.type,
          position,
          data: {
            ...node.data,
            id: node.id,
            actionType: node.actionType,
            label: node.data.label || node.actionType,
            description: node.data.description || "",
            order: index,
            onEdit: handleEditNode,
            onDelete: handleDeleteNode,
          },
        })

        // Create edges between consecutive nodes
        if (index > 0) {
          flowEdges.push({
            id: `e${initialNodes[index - 1].id}-${node.id}`,
            source: initialNodes[index - 1].id,
            target: node.id,
            type: "smoothstep",
            animated: true,
          })
        }
      })

      setNodes(flowNodes)
      setEdges(flowEdges)
    }
  }, [initialNodes])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: "smoothstep", animated: true }, eds)),
    [setEdges],
  )

  const handleEditNode = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId)
      if (node) {
        const flowNode: FlowNode = {
          id: node.id,
          type: node.type as "trigger" | "action",
          actionType: node.data.actionType,
          data: node.data,
          position: node.position,
        }
        setSelectedNode(flowNode)
        setIsEditDialogOpen(true)
      }
    },
    [nodes],
  )

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId))
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))
    },
    [setNodes, setEdges],
  )

  const addTrigger = useCallback(
    (triggerType: string, triggerData: any) => {
      const newNode: Node = {
        id: `trigger-${Date.now()}`,
        type: "trigger",
        position: { x: 400, y: 50 },
        data: {
          ...triggerData,
          actionType: triggerType,
          onEdit: handleEditNode,
          onDelete: handleDeleteNode,
        },
      }
      setNodes((nds) => [newNode, ...nds.filter((n) => n.type !== "trigger")])
      setIsTriggerSelectorOpen(false)
    },
    [handleEditNode, handleDeleteNode, setNodes],
  )

  const addAction = useCallback(
    (actionType: string, actionData: any) => {
      const actionNodes = nodes.filter((n) => n.type === "action")
      const lastNode = nodes.length > 0 ? nodes[nodes.length - 1] : null
      const yPosition = lastNode ? lastNode.position.y + 150 : 200

      const newNode: Node = {
        id: `action-${Date.now()}`,
        type: "action",
        position: { x: 400, y: yPosition },
        data: {
          ...actionData,
          actionType,
          order: actionNodes.length + 1,
          onEdit: handleEditNode,
          onDelete: handleDeleteNode,
        },
      }

      setNodes((nds) => [...nds, newNode])

      // Connect to the last node
      if (lastNode) {
        setEdges((eds) => [
          ...eds,
          {
            id: `e${lastNode.id}-${newNode.id}`,
            source: lastNode.id,
            target: newNode.id,
            type: "smoothstep",
            animated: true,
          },
        ])
      }

      setIsActionSelectorOpen(false)
    },
    [nodes, handleEditNode, handleDeleteNode, setNodes, setEdges],
  )

  const updateNode = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...newData,
                },
              }
            : node,
        ),
      )
    },
    [setNodes],
  )

  const handleSave = async () => {
    const flowNodes: FlowNode[] = nodes.map((node) => ({
      id: node.id,
      type: node.type as "trigger" | "action",
      actionType: node.data.actionType,
      data: node.data,
      position: node.position,
    }))
    await onSave(flowNodes)
  }

  const hasTrigger = nodes.some((n) => n.type === "trigger")

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-6 py-4 bg-background border-b">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Automation Flow Builder</h2>
          <p className="text-sm text-muted-foreground mt-1">Design your automation visually</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving || !hasTrigger} size="lg">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Automation"}
        </Button>
      </div>

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-muted/30"
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: true,
          }}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable className="bg-background border border-border" />
          <Panel position="top-right" className="flex gap-2">
            {!hasTrigger && (
              <Button onClick={() => setIsTriggerSelectorOpen(true)} size="sm" variant="default">
                <Zap className="w-4 h-4 mr-2" />
                Add Trigger
              </Button>
            )}
            {hasTrigger && (
              <Button onClick={() => setIsActionSelectorOpen(true)} size="sm" variant="default">
                <Plus className="w-4 h-4 mr-2" />
                Add Action
              </Button>
            )}
          </Panel>

          {!hasTrigger && nodes.length === 0 && (
            <Panel position="top-center" className="pointer-events-none">
              <Card className="p-8 border-2 border-dashed bg-background/95 backdrop-blur">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Start Building</h3>
                    <p className="text-sm text-muted-foreground">Click "Add Trigger" to begin your automation</p>
                  </div>
                </div>
              </Card>
            </Panel>
          )}
        </ReactFlow>
      </div>

      {/* Edit Node Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedNode?.type === "trigger" ? "Edit Trigger" : "Edit Action"}</DialogTitle>
            <DialogDescription>
              Configure the settings for this {selectedNode?.type === "trigger" ? "trigger" : "action"}
            </DialogDescription>
          </DialogHeader>
          {selectedNode && selectedNode.type === "trigger" && (
            <TriggerEditor
              node={selectedNode}
              onUpdate={(data) => {
                updateNode(selectedNode.id, data)
                setIsEditDialogOpen(false)
              }}
            />
          )}
          {selectedNode && selectedNode.type === "action" && (
            <ActionEditor
              node={selectedNode}
              onUpdate={(data) => {
                updateNode(selectedNode.id, data)
                setIsEditDialogOpen(false)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Trigger Selector Dialog */}
      <TriggerSelector open={isTriggerSelectorOpen} onOpenChange={setIsTriggerSelectorOpen} onSelect={addTrigger} />

      {/* Action Selector Dialog */}
      <ActionSelector open={isActionSelectorOpen} onOpenChange={setIsActionSelectorOpen} onSelect={addAction} />
    </div>
  )
}
