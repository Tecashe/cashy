// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"
// import { TRIGGER_TYPES, ACTION_TYPES } from "@/lib/constants/utomation-constants"
// import type { AutomationFlow } from "@/lib/types/automation"
// import { ArrowRight } from "lucide-react"

// interface ReviewStepProps {
//   flow: AutomationFlow
//   setFlow: (flow: AutomationFlow) => void
// }

// export function ReviewStep({ flow, setFlow }: ReviewStepProps) {
//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>{flow.name}</CardTitle>
//               {flow.description && <CardDescription className="mt-1">{flow.description}</CardDescription>}
//             </div>
//             <div className="flex items-center gap-2">
//               <Switch checked={flow.isActive} onCheckedChange={(checked) => setFlow({ ...flow, isActive: checked })} />
//               <Label>Active</Label>
//             </div>
//           </div>
//         </CardHeader>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Triggers</CardTitle>
//           <CardDescription>
//             {flow.triggers.length} trigger{flow.triggers.length !== 1 ? "s" : ""}{" "}
//             {flow.triggers.length > 1 && `(${flow.triggerLogic})`}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           {flow.triggers.map((trigger, index) => {
//             const triggerInfo = TRIGGER_TYPES[trigger.type]
//             const TriggerIcon = triggerInfo.icon

//             return (
//               <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
//                   <TriggerIcon className="h-5 w-5" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-medium">{triggerInfo.label}</p>
//                   {trigger.config.keywords && (
//                     <div className="mt-1 flex flex-wrap gap-1">
//                       {trigger.config.keywords.map((kw: string, i: number) => (
//                         <Badge key={i} variant="secondary" className="text-xs">
//                           {kw}
//                         </Badge>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 {index < flow.triggers.length - 1 && <Badge variant="outline">{flow.triggerLogic}</Badge>}
//               </div>
//             )
//           })}
//         </CardContent>
//       </Card>

//       <div className="flex justify-center">
//         <ArrowRight className="h-6 w-6 text-muted-foreground" />
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Actions</CardTitle>
//           <CardDescription>
//             {flow.actions.length} action{flow.actions.length !== 1 ? "s" : ""} will be executed
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           {flow.actions.map((action, index) => {
//             const actionInfo = ACTION_TYPES[action.type]
//             const ActionIcon = actionInfo.icon

//             return (
//               <div key={action.id} className="flex items-center gap-3 rounded-lg border p-3">
//                 <Badge variant="outline" className="flex-shrink-0">
//                   {index + 1}
//                 </Badge>
//                 <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
//                   <ActionIcon className="h-5 w-5" />
//                 </div>
//                 <div className="flex-1 space-y-1">
//                   <p className="font-medium">{actionInfo.label}</p>
//                   {action.config.message && (
//                     <p className="line-clamp-1 text-sm text-muted-foreground">"{action.config.message}"</p>
//                   )}
//                   {action.config.delayMinutes && (
//                     <p className="text-sm text-muted-foreground">Wait {action.config.delayMinutes} minutes</p>
//                   )}
//                 </div>
//               </div>
//             )
//           })}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { TRIGGER_TYPES, ACTION_TYPES } from "@/lib/constants/utomation-constants"
import type { AutomationFlow } from "@/lib/types/automation"
import { ArrowRight } from "lucide-react"

interface ReviewStepProps {
  flow: AutomationFlow
  setFlow: (flow: AutomationFlow) => void
}

export function ReviewStep({ flow, setFlow }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{flow.name}</CardTitle>
              {flow.description && <CardDescription className="mt-1">{flow.description}</CardDescription>}
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={flow.isActive} onCheckedChange={(checked) => setFlow({ ...flow, isActive: checked })} />
              <Label>Active</Label>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Triggers</CardTitle>
          <CardDescription>
            {flow.triggers.length} trigger{flow.triggers.length !== 1 ? "s" : ""}{" "}
            {flow.triggers.length > 1 && `(${flow.triggerLogic})`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {flow.triggers.map((trigger, index) => {
            const triggerInfo = TRIGGER_TYPES[trigger.type]
            const TriggerIcon = triggerInfo.icon

            return (
              <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                  <TriggerIcon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{triggerInfo.label}</p>
                  {/* Only show keywords for comment and keyword trigger types */}
                  {(trigger.type === 'comment' || trigger.type === 'keyword') && 
                    trigger.config?.keywords && 
                    Array.isArray(trigger.config.keywords) && 
                    trigger.config.keywords.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {trigger.config.keywords.map((kw: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {index < flow.triggers.length - 1 && <Badge variant="outline">{flow.triggerLogic}</Badge>}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <ArrowRight className="h-6 w-6 text-muted-foreground" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            {flow.actions.length} action{flow.actions.length !== 1 ? "s" : ""} will be executed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {flow.actions.map((action, index) => {
            const actionInfo = ACTION_TYPES[action.type]
            const ActionIcon = actionInfo.icon

            return (
              <div key={action.id} className="flex items-center gap-3 rounded-lg border p-3">
                <Badge variant="outline" className="flex-shrink-0">
                  {index + 1}
                </Badge>
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                  <ActionIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{actionInfo.label}</p>
                  {action.config.message && (
                    <p className="line-clamp-1 text-sm text-muted-foreground">"{action.config.message}"</p>
                  )}
                  {action.config.delayMinutes && (
                    <p className="text-sm text-muted-foreground">Wait {action.config.delayMinutes} minutes</p>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

