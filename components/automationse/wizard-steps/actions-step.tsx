"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical, Trash2 } from "lucide-react"
import { ACTION_TYPES } from "@/lib/constants/utomation-constants"
import { ActionSelector } from "../action-selector"
import { ActionConfigModal } from "../action-config"
import type { AutomationFlow, ActionConfig, ActionType } from "@/lib/types/automation"

interface ActionsStepProps {
  flow: AutomationFlow
  setFlow: (flow: AutomationFlow) => void
  tags: any[]
}

export function ActionsStep({ flow, setFlow, tags }: ActionsStepProps) {
  const [showSelector, setShowSelector] = useState(false)
  const [editingAction, setEditingAction] = useState<number | null>(null)

  const handleAddAction = (type: ActionType) => {
    const newAction: ActionConfig = {
      id: `action-${Date.now()}`,
      type,
      config: {},
    }
    setFlow({ ...flow, actions: [...flow.actions, newAction] })
    setShowSelector(false)
    setEditingAction(flow.actions.length)
  }

  const handleUpdateAction = (index: number, action: ActionConfig) => {
    const newActions = [...flow.actions]
    newActions[index] = action
    setFlow({ ...flow, actions: newActions })
    setEditingAction(null)
  }

  const handleRemoveAction = (index: number) => {
    setFlow({
      ...flow,
      actions: flow.actions.filter((_, i) => i !== index),
    })
  }

  const handleMoveAction = (index: number, direction: "up" | "down") => {
    const newActions = [...flow.actions]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex >= 0 && targetIndex < newActions.length) {
      ;[newActions[index], newActions[targetIndex]] = [newActions[targetIndex], newActions[index]]
      setFlow({ ...flow, actions: newActions })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Build the sequence of actions that will be executed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {flow.actions.length > 0 && (
            <div className="space-y-3">
              {flow.actions.map((action, index) => {
                const actionInfo = ACTION_TYPES[action.type]
                const ActionIcon = actionInfo.icon

                return (
                  <div key={action.id} className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 cursor-grab"
                        onClick={() => handleMoveAction(index, "up")}
                        disabled={index === 0}
                      >
                        <GripVertical className="h-4 w-4" />
                      </Button>
                      <span className="text-center text-xs text-muted-foreground">{index + 1}</span>
                    </div>
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-background">
                      <ActionIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{actionInfo.label}</p>
                      <p className="text-sm text-muted-foreground">{actionInfo.description}</p>
                      {action.config.message && (
                        <p className="line-clamp-1 text-sm text-muted-foreground">"{action.config.message}"</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingAction(index)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveAction(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowSelector(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Action
          </Button>
        </CardContent>
      </Card>

      <ActionSelector open={showSelector} onClose={() => setShowSelector(false)} onSelect={handleAddAction} />

      {editingAction !== null && (
        <ActionConfigModal
          open={editingAction !== null}
          onClose={() => setEditingAction(null)}
          action={flow.actions[editingAction]}
          onSave={(action) => handleUpdateAction(editingAction, action)}
          tags={tags}
        />
      )}
    </div>
  )
}
