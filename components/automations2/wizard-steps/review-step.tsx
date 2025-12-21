"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { TRIGGER_TYPES, ACTION_TYPES } from "@/lib/constants/utomation-constants"
import type { AutomationFlow } from "@/lib/types/automation"
import { ArrowRight, CheckCircle2, Play, Zap } from "lucide-react"
import { motion } from "framer-motion"

interface ReviewStepProps {
  flow: AutomationFlow
  setFlow: (flow: AutomationFlow) => void
}

export function ReviewStep({ flow, setFlow }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="overflow-hidden border border-border/50 bg-gradient-to-br from-card via-card/80 to-card/50 shadow-xl backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold tracking-tight">{flow.name}</CardTitle>
                {flow.description && (
                  <CardDescription className="mt-2 text-base leading-relaxed">{flow.description}</CardDescription>
                )}
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4 ring-1 ring-border/50">
                <Switch
                  checked={flow.isActive}
                  onCheckedChange={(checked) => setFlow({ ...flow, isActive: checked })}
                  className="data-[state=checked]:bg-primary"
                />
                <Label className="cursor-pointer font-semibold">{flow.isActive ? "Active" : "Inactive"}</Label>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="overflow-hidden border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-muted/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 shadow-inner ring-1 ring-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold tracking-tight">Triggers</CardTitle>
                <CardDescription className="text-sm">
                  {flow.triggers.length} trigger{flow.triggers.length !== 1 ? "s" : ""}{" "}
                  {flow.triggers.length > 1 && (
                    <Badge variant="secondary" className="ml-2 shadow-sm">
                      {flow.triggerLogic}
                    </Badge>
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {flow.triggers.map((trigger, index) => {
              const triggerInfo = TRIGGER_TYPES[trigger.type]
              const TriggerIcon = triggerInfo.icon

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group flex items-center gap-4 rounded-xl border border-border/50 bg-gradient-to-r from-muted/50 to-muted/30 p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner ring-1 ring-primary/10">
                    <TriggerIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold leading-tight">{triggerInfo.label}</p>
                    {(trigger.type === "comment" || trigger.type === "keyword") &&
                      trigger.config?.keywords &&
                      Array.isArray(trigger.config.keywords) &&
                      trigger.config.keywords.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {trigger.config.keywords.map((kw: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs shadow-sm">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      )}
                  </div>
                  {index < flow.triggers.length - 1 && (
                    <Badge variant="outline" className="shadow-sm">
                      {flow.triggerLogic}
                    </Badge>
                  )}
                </motion.div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg ring-4 ring-background">
          <ArrowRight className="h-6 w-6 text-primary" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="overflow-hidden border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-muted/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 shadow-inner ring-1 ring-primary/10">
                <Play className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold tracking-tight">Actions</CardTitle>
                <CardDescription className="text-sm">
                  {flow.actions.length} action{flow.actions.length !== 1 ? "s" : ""} will be executed
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            <div className="relative space-y-3">
              <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />

              {flow.actions.map((action, index) => {
                const actionInfo = ACTION_TYPES[action.type]
                const ActionIcon = actionInfo.icon

                return (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 + 0.1 }}
                    className="relative group flex items-center gap-4 rounded-xl border border-border/50 bg-gradient-to-r from-card to-card/80 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-x-1"
                  >
                    <div className="absolute -left-1 flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-bold text-primary-foreground shadow-lg ring-4 ring-background">
                        {index + 1}
                      </div>
                    </div>

                    <div className="ml-6 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner ring-1 ring-primary/10">
                      <ActionIcon className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex-1 space-y-1.5 min-w-0">
                      <p className="font-semibold leading-tight">{actionInfo.label}</p>
                      {action.config.message && (
                        <p className="line-clamp-1 text-sm italic text-muted-foreground rounded bg-muted/50 px-2 py-1">
                          "{action.config.message}"
                        </p>
                      )}
                      {action.config.delayMinutes && (
                        <p className="text-sm text-muted-foreground">⏱ Wait {action.config.delayMinutes} minutes</p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {flow.isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-5 ring-1 ring-primary/20"
        >
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <p className="font-semibold text-primary">This automation is ready to go live!</p>
        </motion.div>
      )}
    </div>
  )
}
