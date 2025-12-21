"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical, Trash2, Workflow, ChevronUp, ChevronDown } from "lucide-react"
import { ACTION_TYPES } from "@/lib/constants/utomation-constants"
import { ActionSelector } from "../action-selector"
import { ActionConfigModal } from "../action-config"
import type { AutomationFlow, ActionConfig, ActionType } from "@/lib/types/automation"
import { motion, AnimatePresence } from "framer-motion"

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
      <Card className="overflow-hidden border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="border-b border-border/50 bg-muted/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 shadow-inner ring-1 ring-primary/10">
              <Workflow className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold tracking-tight">Actions</CardTitle>
              <CardDescription className="text-sm">Build the sequence of actions that will be executed</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          {flow.actions.length > 0 && (
            <div className="relative space-y-4">
              <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />

              <AnimatePresence>
                {flow.actions.map((action, index) => {
                  const actionInfo = ACTION_TYPES[action.type]
                  const ActionIcon = actionInfo.icon

                  return (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="relative"
                    >
                      <div className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-border/50 bg-gradient-to-r from-card to-card/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:translate-x-1">
                        <div className="absolute -left-1 flex items-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 + 0.1 }}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-bold text-primary-foreground shadow-lg ring-4 ring-background"
                          >
                            {index + 1}
                          </motion.div>
                        </div>

                        <div className="ml-6 flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 cursor-pointer opacity-0 transition-all group-hover:opacity-100 hover:bg-muted/50 disabled:opacity-0"
                            onClick={() => handleMoveAction(index, "up")}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <GripVertical className="h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-muted-foreground" />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 cursor-pointer opacity-0 transition-all group-hover:opacity-100 hover:bg-muted/50 disabled:opacity-0"
                            onClick={() => handleMoveAction(index, "down")}
                            disabled={index === flow.actions.length - 1}
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-110">
                          <ActionIcon className="h-6 w-6 text-primary" />
                        </div>

                        <div className="flex-1 space-y-1.5 min-w-0">
                          <p className="font-semibold leading-tight">{actionInfo.label}</p>
                          <p className="text-sm text-muted-foreground leading-snug line-clamp-1">
                            {actionInfo.description}
                          </p>
                          {action.config.message && (
                            <p className="line-clamp-1 text-sm italic text-muted-foreground rounded bg-muted/50 px-2 py-1">
                              "{action.config.message}"
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingAction(index)}
                            className="hover:bg-primary/10 hover:text-primary"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAction(index)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}

          <Button
            variant="outline"
            className="group relative w-full overflow-hidden border-2 border-dashed border-border/50 bg-transparent py-6 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5"
            onClick={() => setShowSelector(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Plus className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
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
