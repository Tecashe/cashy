"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Zap } from "lucide-react"
import { TRIGGER_TYPES } from "@/lib/constants/utomation-constants"
import { TriggerSelector } from "../trigger-selector"
import { TriggerConfig as TriggerConfigModal } from "../trigger-config"
import type { AutomationFlow, TriggerConfig, TriggerType } from "@/lib/types/automation"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion, AnimatePresence } from "framer-motion"

interface TriggerStepProps {
  flow: AutomationFlow
  setFlow: (flow: AutomationFlow) => void
  accounts: any[]
}

export function TriggerStep({ flow, setFlow, accounts }: TriggerStepProps) {
  const [showSelector, setShowSelector] = useState(false)
  const [editingTrigger, setEditingTrigger] = useState<number | null>(null)

  const handleAddTrigger = (type: TriggerType) => {
    const newTrigger: TriggerConfig = {
      type,
      config: {},
    }
    setFlow({ ...flow, triggers: [...flow.triggers, newTrigger] })
    setShowSelector(false)

    // Open config if trigger requires it
    const triggerInfo = TRIGGER_TYPES[type]
    if (triggerInfo.requiresConfig) {
      setEditingTrigger(flow.triggers.length)
    }
  }

  const handleUpdateTrigger = (index: number, trigger: TriggerConfig) => {
    const newTriggers = [...flow.triggers]
    newTriggers[index] = trigger
    setFlow({ ...flow, triggers: newTriggers })
    setEditingTrigger(null)
  }

  const handleRemoveTrigger = (index: number) => {
    setFlow({
      ...flow,
      triggers: flow.triggers.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="border-b border-border/50 bg-muted/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 shadow-inner ring-1 ring-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold tracking-tight">Triggers</CardTitle>
              <CardDescription className="text-sm">
                Choose one or more triggers that will activate this automation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          {flow.triggers.length > 0 && (
            <>
              <div className="space-y-3">
                <AnimatePresence>
                  {flow.triggers.map((trigger, index) => {
                    const triggerInfo = TRIGGER_TYPES[trigger.type]
                    const TriggerIcon = triggerInfo.icon

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.01 }}
                        className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-border/50 bg-gradient-to-r from-muted/50 to-muted/30 p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-110">
                          <TriggerIcon className="h-6 w-6 text-primary" />
                        </div>

                        <div className="relative flex-1 space-y-1.5 min-w-0">
                          <p className="font-semibold leading-tight">{triggerInfo.label}</p>
                          <p className="text-sm text-muted-foreground leading-snug line-clamp-1">
                            {triggerInfo.description}
                          </p>
                          {(trigger.type === "comment" || trigger.type === "keyword") &&
                            trigger.config?.keywords &&
                            Array.isArray(trigger.config.keywords) &&
                            trigger.config.keywords.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {trigger.config.keywords.map((kw: string, i: number) => (
                                  <Badge key={i} variant="secondary" className="text-xs shadow-sm">
                                    {kw}
                                  </Badge>
                                ))}
                              </div>
                            )}
                        </div>

                        <div className="relative flex gap-2">
                          {triggerInfo.requiresConfig && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingTrigger(index)}
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              Configure
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveTrigger(index)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              {flow.triggers.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-2 border-dashed border-primary/30 bg-primary/5 shadow-sm">
                    <CardHeader className="pb-3">
                      <Label className="text-base font-semibold">Trigger Logic</Label>
                      <CardDescription className="text-sm">How should multiple triggers work together?</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={flow.triggerLogic}
                        onValueChange={(value) => setFlow({ ...flow, triggerLogic: value as "AND" | "OR" })}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3 rounded-lg border border-border/50 bg-background/50 p-3 transition-all hover:bg-background">
                          <RadioGroupItem value="OR" id="or" className="border-primary text-primary" />
                          <Label htmlFor="or" className="flex-1 cursor-pointer font-normal leading-relaxed">
                            <span className="font-semibold text-primary">OR</span> - Activate if ANY trigger matches
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-lg border border-border/50 bg-background/50 p-3 transition-all hover:bg-background">
                          <RadioGroupItem value="AND" id="and" className="border-primary text-primary" />
                          <Label htmlFor="and" className="flex-1 cursor-pointer font-normal leading-relaxed">
                            <span className="font-semibold text-primary">AND</span> - Activate if ALL triggers match
                          </Label>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          )}

          <Button
            variant="outline"
            className="group relative w-full overflow-hidden border-2 border-dashed border-border/50 bg-transparent py-6 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5"
            onClick={() => setShowSelector(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Plus className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
            Add Trigger
          </Button>
        </CardContent>
      </Card>

      <TriggerSelector open={showSelector} onClose={() => setShowSelector(false)} onSelect={handleAddTrigger} />

      {editingTrigger !== null && (
        <TriggerConfigModal
          open={editingTrigger !== null}
          onClose={() => setEditingTrigger(null)}
          trigger={flow.triggers[editingTrigger]}
          onSave={(trigger) => handleUpdateTrigger(editingTrigger, trigger)}
          accounts={accounts}
        />
      )}
    </div>
  )
}
