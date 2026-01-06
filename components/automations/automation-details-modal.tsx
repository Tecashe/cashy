"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Zap, Play, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface AutomationDetailsModalProps {
  automation: any
}

export function AutomationDetailsModal({ automation }: AutomationDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedTrigger, setExpandedTrigger] = useState(false)
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set())

  const toggleActionExpanded = (actionId: string) => {
    const newSet = new Set(expandedActions)
    if (newSet.has(actionId)) {
      newSet.delete(actionId)
    } else {
      newSet.add(actionId)
    }
    setExpandedActions(newSet)
  }

  const triggers = automation.triggers || []
  const actions = automation.actions || []

  const renderValue = (value: any): string => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-left rounded-lg bg-gradient-to-r from-muted/30 to-muted/20 p-3 ring-1 ring-border/50 transition-all hover:bg-muted/40 hover:ring-primary/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 shadow-inner ring-1 ring-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">
                {triggers.length > 0 ? triggers[0].type : "No trigger"} Trigger
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {actions.length} action{actions.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="flex-shrink-0 text-xs gap-1">
            <Eye className="h-3 w-3" />
            Details
          </Badge>
        </div>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">{automation.name}</DialogTitle>
            <DialogDescription>Trigger and action configuration details</DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="space-y-6 px-6 pb-6">
              {/* Triggers Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Triggers</h3>
                  <Badge variant="outline" className="text-xs">
                    {triggers.length}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {triggers.length > 0 ? (
                    triggers.map((trigger: any, index: number) => (
                      <motion.div
                        key={trigger.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="space-y-2"
                      >
                        <button
                          onClick={() => setExpandedTrigger(!expandedTrigger)}
                          className="w-full rounded-lg border border-border/50 bg-gradient-to-r from-muted/30 to-muted/10 p-4 text-left transition-all hover:bg-muted/50 hover:border-primary/30"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                                <Zap className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{trigger.type}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Step {trigger.order + 1}</p>
                              </div>
                            </div>
                            <ChevronDown
                              className={cn("h-4 w-4 transition-transform", expandedTrigger && "rotate-180")}
                            />
                          </div>
                        </button>

                        <AnimatePresence>
                          {expandedTrigger && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="rounded-lg border border-border/50 bg-gradient-to-r from-muted/20 to-muted/10 p-4"
                            >
                              <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                                Conditions
                              </p>
                              <div className="space-y-2">
                                {Object.entries(trigger.conditions || {}).map(([key, value]) => (
                                  <div
                                    key={key}
                                    className="rounded bg-background/50 p-3 font-mono text-xs border border-border/30 break-words"
                                  >
                                    <span className="text-primary font-semibold">{key}:</span>{" "}
                                    <span className="text-muted-foreground">{renderValue(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-border/50 bg-muted/20 p-4 text-center text-sm text-muted-foreground">
                      No triggers configured
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-2" />

              {/* Actions Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Actions</h3>
                  <Badge variant="outline" className="text-xs">
                    {actions.length}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {actions.length > 0 ? (
                    actions.map((action: any, index: number) => (
                      <motion.div
                        key={action.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="space-y-2"
                      >
                        <button
                          onClick={() => toggleActionExpanded(action.id)}
                          className="w-full rounded-lg border border-border/50 bg-gradient-to-r from-muted/30 to-muted/10 p-4 text-left transition-all hover:bg-muted/50 hover:border-primary/30"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                                <Play className="h-4 w-4 text-green-400" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{action.type}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Step {action.order + 1}</p>
                              </div>
                            </div>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform",
                                expandedActions.has(action.id) && "rotate-180",
                              )}
                            />
                          </div>
                        </button>

                        <AnimatePresence>
                          {expandedActions.has(action.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="rounded-lg border border-border/50 bg-gradient-to-r from-muted/20 to-muted/10 p-4"
                            >
                              <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                                Configuration
                              </p>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {Object.entries(action.content || {}).map(([key, value]) => (
                                  <div
                                    key={key}
                                    className="rounded bg-background/50 p-3 font-mono text-xs border border-border/30 break-words"
                                  >
                                    <span className="text-primary font-semibold">{key}:</span>{" "}
                                    <span className="text-muted-foreground">{renderValue(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-border/50 bg-muted/20 p-4 text-center text-sm text-muted-foreground">
                      No actions configured
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
