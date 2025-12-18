// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Plus, X } from "lucide-react"
// import { TRIGGER_TYPES } from "@/lib/constants/utomation-constants"
// import { TriggerSelector } from "../trigger-selector"
// import { TriggerConfig as TriggerConfigModal } from "../trigger-config"
// import type { AutomationFlow, TriggerConfig, TriggerType } from "@/lib/types/automation"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// interface TriggerStepProps {
//   flow: AutomationFlow
//   setFlow: (flow: AutomationFlow) => void
//   accounts: any[]
// }

// export function TriggerStep({ flow, setFlow, accounts }: TriggerStepProps) {
//   const [showSelector, setShowSelector] = useState(false)
//   const [editingTrigger, setEditingTrigger] = useState<number | null>(null)

//   const handleAddTrigger = (type: TriggerType) => {
//     const newTrigger: TriggerConfig = {
//       type,
//       config: {},
//     }
//     setFlow({ ...flow, triggers: [...flow.triggers, newTrigger] })
//     setShowSelector(false)

//     // Open config if trigger requires it
//     const triggerInfo = TRIGGER_TYPES[type]
//     if (triggerInfo.requiresConfig) {
//       setEditingTrigger(flow.triggers.length)
//     }
//   }

//   const handleUpdateTrigger = (index: number, trigger: TriggerConfig) => {
//     const newTriggers = [...flow.triggers]
//     newTriggers[index] = trigger
//     setFlow({ ...flow, triggers: newTriggers })
//     setEditingTrigger(null)
//   }

//   const handleRemoveTrigger = (index: number) => {
//     setFlow({
//       ...flow,
//       triggers: flow.triggers.filter((_, i) => i !== index),
//     })
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Triggers</CardTitle>
//           <CardDescription>Choose one or more triggers that will activate this automation</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {flow.triggers.length > 0 && (
//             <>
//               <div className="space-y-3">
//                 {flow.triggers.map((trigger, index) => {
//                   const triggerInfo = TRIGGER_TYPES[trigger.type]
//                   const TriggerIcon = triggerInfo.icon

//                   return (
//                     <div key={index} className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
//                       <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-background">
//                         <TriggerIcon className="h-5 w-5" />
//                       </div>
//                       <div className="flex-1 space-y-1">
//                         <p className="font-medium">{triggerInfo.label}</p>
//                         <p className="text-sm text-muted-foreground">{triggerInfo.description}</p>
//                         {trigger.config.keywords && (
//                           <div className="flex flex-wrap gap-1">
//                             {trigger.config.keywords.map((kw: string, i: number) => (
//                               <Badge key={i} variant="secondary" className="text-xs">
//                                 {kw}
//                               </Badge>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex gap-2">
//                         {triggerInfo.requiresConfig && (
//                           <Button variant="ghost" size="sm" onClick={() => setEditingTrigger(index)}>
//                             Configure
//                           </Button>
//                         )}
//                         <Button variant="ghost" size="icon" onClick={() => handleRemoveTrigger(index)}>
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>

//               {flow.triggers.length > 1 && (
//                 <Card className="border-dashed">
//                   <CardHeader className="pb-3">
//                     <Label>Trigger Logic</Label>
//                     <CardDescription>How should multiple triggers work together?</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <RadioGroup
//                       value={flow.triggerLogic}
//                       onValueChange={(value) => setFlow({ ...flow, triggerLogic: value as "AND" | "OR" })}
//                     >
//                       <div className="flex items-center space-x-2">
//                         <RadioGroupItem value="OR" id="or" />
//                         <Label htmlFor="or" className="font-normal">
//                           <span className="font-medium">OR</span> - Activate if ANY trigger matches
//                         </Label>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <RadioGroupItem value="AND" id="and" />
//                         <Label htmlFor="and" className="font-normal">
//                           <span className="font-medium">AND</span> - Activate if ALL triggers match
//                         </Label>
//                       </div>
//                     </RadioGroup>
//                   </CardContent>
//                 </Card>
//               )}
//             </>
//           )}

//           <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowSelector(true)}>
//             <Plus className="mr-2 h-4 w-4" />
//             Add Trigger
//           </Button>
//         </CardContent>
//       </Card>

//       <TriggerSelector open={showSelector} onClose={() => setShowSelector(false)} onSelect={handleAddTrigger} />

//       {editingTrigger !== null && (
//         <TriggerConfigModal
//           open={editingTrigger !== null}
//           onClose={() => setEditingTrigger(null)}
//           trigger={flow.triggers[editingTrigger]}
//           onSave={(trigger) => handleUpdateTrigger(editingTrigger, trigger)}
//           accounts={accounts}
//         />
//       )}
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { TRIGGER_TYPES } from "@/lib/constants/utomation-constants"
import { TriggerSelector } from "../trigger-selector"
import { TriggerConfig as TriggerConfigModal } from "../trigger-config"
import type { AutomationFlow, TriggerConfig, TriggerType } from "@/lib/types/automation"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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
      <Card>
        <CardHeader>
          <CardTitle>Triggers</CardTitle>
          <CardDescription>Choose one or more triggers that will activate this automation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {flow.triggers.length > 0 && (
            <>
              <div className="space-y-3">
                {flow.triggers.map((trigger, index) => {
                  const triggerInfo = TRIGGER_TYPES[trigger.type]
                  const TriggerIcon = triggerInfo.icon

                  return (
                    <div key={index} className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-background">
                        <TriggerIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{triggerInfo.label}</p>
                        <p className="text-sm text-muted-foreground">{triggerInfo.description}</p>
                        {/* Only show keywords for comment and keyword trigger types */}
                        {(trigger.type === 'comment' || trigger.type === 'keyword') && 
                          trigger.config?.keywords && 
                          Array.isArray(trigger.config.keywords) && 
                          trigger.config.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {trigger.config.keywords.map((kw: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {kw}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {triggerInfo.requiresConfig && (
                          <Button variant="ghost" size="sm" onClick={() => setEditingTrigger(index)}>
                            Configure
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveTrigger(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {flow.triggers.length > 1 && (
                <Card className="border-dashed">
                  <CardHeader className="pb-3">
                    <Label>Trigger Logic</Label>
                    <CardDescription>How should multiple triggers work together?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={flow.triggerLogic}
                      onValueChange={(value) => setFlow({ ...flow, triggerLogic: value as "AND" | "OR" })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="OR" id="or" />
                        <Label htmlFor="or" className="font-normal">
                          <span className="font-medium">OR</span> - Activate if ANY trigger matches
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="AND" id="and" />
                        <Label htmlFor="and" className="font-normal">
                          <span className="font-medium">AND</span> - Activate if ALL triggers match
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowSelector(true)}>
            <Plus className="mr-2 h-4 w-4" />
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