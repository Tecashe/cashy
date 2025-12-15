// "use client"

// import { useState, useEffect, Suspense } from "react"
// import { useRouter, useParams } from "next/navigation"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { AutomationFlowCanvas } from "@/components/automation-flow-canvas"
// import { updateAutomation, getAutomation } from "@/lib/actions/automation-actions"
// import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
// import { ArrowLeft, Loader2, Save } from "lucide-react"
// import Link from "next/link"
// import { toast } from "sonner"

// type TriggerType = "DM_RECEIVED" | "STORY_REPLY" | "COMMENT" | "MENTION" | "KEYWORD" | "FIRST_MESSAGE"
// type ActionType = "SEND_MESSAGE" | "AI_RESPONSE" | "ADD_TAG" | "DELAY" | "CONDITION" | "SEND_TO_HUMAN" | "WEBHOOK"

// interface NodeConfig {
//   message?: string
//   customInstructions?: string
//   tone?: string
//   tagName?: string
//   delayAmount?: string
//   delayUnit?: string
//   field?: string
//   operator?: string
//   value?: string
//   reason?: string
//   webhookUrl?: string
//   webhookMethod?: string
//   keywords?: string[]
//   matchType?: string
// }

// function EditAutomationPageContent() {
//   const router = useRouter()
//   const params = useParams()
//   const automationId = params.id as string

//   const [name, setName] = useState("")
//   const [description, setDescription] = useState("")
//   const [instagramAccountId, setInstagramAccountId] = useState<string>("")
//   const [instagramAccounts, setInstagramAccounts] = useState<any[]>([])
//   const [trigger, setTrigger] = useState<{ type: TriggerType; config: any } | null>(null)
//   const [actions, setActions] = useState<Array<{ type: ActionType; config: any; order: number }>>([])
//   const [isSaving, setIsSaving] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [configDialogOpen, setConfigDialogOpen] = useState(false)
//   const [currentConfigNode, setCurrentConfigNode] = useState<{
//     id: string
//     type: "trigger" | "action"
//     actionType: string
//   } | null>(null)
//   const [currentConfig, setCurrentConfig] = useState<NodeConfig>({})

//   useEffect(() => {
//     async function loadData() {
//       try {
//         const [automation, accounts] = await Promise.all([getAutomation(automationId), getInstagramAccounts()])

//         setName(automation.name)
//         setDescription(automation.description || "")
//         setInstagramAccountId(automation.instagramAccountId || "")
//         setInstagramAccounts(accounts)

//         if (automation.triggers && automation.triggers.length > 0) {
//           const triggerData = automation.triggers[0]
//           setTrigger({
//             type: triggerData.type as TriggerType,
//             config: triggerData.conditions,
//           })
//         }

//         if (automation.actions && automation.actions.length > 0) {
//           setActions(
//             automation.actions.map((action: any) => ({
//               type: action.type as ActionType,
//               config: action.content,
//               order: action.order,
//             })),
//           )
//         }
//       } catch (error) {
//         console.error("[v0] Failed to load automation:", error)
//         toast.error("Failed to load automation")
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     loadData()
//   }, [automationId])

//   const handleNodesChange = (
//     newTrigger: { type: TriggerType; config: any } | null,
//     newActions: Array<{ type: ActionType; config: any; order: number }>,
//   ) => {
//     if (newTrigger) setTrigger(newTrigger)
//     setActions(newActions)
//   }

//   const handleConfigureNode = (nodeId: string, nodeType: "trigger" | "action", actionType: string) => {
//     setCurrentConfigNode({ id: nodeId, type: nodeType, actionType })

//     if (nodeType === "trigger" && trigger) {
//       setCurrentConfig(trigger.config || {})
//     } else if (nodeType === "action") {
//       const actionIndex = Number.parseInt(nodeId.replace("action-", "")) - 1
//       const actionNode = actions[actionIndex]
//       setCurrentConfig(actionNode?.config || {})
//     }

//     setConfigDialogOpen(true)
//   }

//   const handleSaveConfig = () => {
//     if (!currentConfigNode) return

//     if (currentConfigNode.type === "trigger" && trigger) {
//       setTrigger({ ...trigger, config: currentConfig })
//     } else if (currentConfigNode.type === "action") {
//       const actionIndex = Number.parseInt(currentConfigNode.id.replace("action-", "")) - 1
//       const updatedActions = [...actions]
//       if (updatedActions[actionIndex]) {
//         updatedActions[actionIndex].config = currentConfig
//       }
//       setActions(updatedActions)
//     }

//     setConfigDialogOpen(false)
//     setCurrentConfigNode(null)
//     setCurrentConfig({})
//   }

//   const renderConfigForm = () => {
//     if (!currentConfigNode) return null

//     const actionType = currentConfigNode.actionType

//     if (currentConfigNode.type === "trigger") {
//       if (actionType === "KEYWORD") {
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Keywords (comma separated)</Label>
//               <Input
//                 placeholder="price, pricing, cost, how much"
//                 value={(currentConfig.keywords || []).join(", ")}
//                 onChange={(e) =>
//                   setCurrentConfig({
//                     ...currentConfig,
//                     keywords: e.target.value.split(",").map((k) => k.trim()),
//                   })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Match Type</Label>
//               <Select
//                 value={currentConfig.matchType || "contains"}
//                 onValueChange={(value) => setCurrentConfig({ ...currentConfig, matchType: value })}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="contains">Contains keyword</SelectItem>
//                   <SelectItem value="exact">Exact match</SelectItem>
//                   <SelectItem value="starts_with">Starts with</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         )
//       }
//       return (
//         <div className="text-sm text-muted-foreground">This trigger type doesn't require additional configuration.</div>
//       )
//     }

//     switch (actionType) {
//       case "SEND_MESSAGE":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Message Template</Label>
//               <Textarea
//                 placeholder="Enter your message..."
//                 value={currentConfig.message || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, message: e.target.value })}
//                 className="min-h-[120px]"
//               />
//               <p className="text-xs text-muted-foreground">
//                 Use variables: {"{name}"}, {"{username}"}, {"{first_name}"}
//               </p>
//             </div>
//           </div>
//         )

//       case "AI_RESPONSE":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>AI Instructions</Label>
//               <Textarea
//                 placeholder="Tell the AI how to respond..."
//                 value={currentConfig.customInstructions || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, customInstructions: e.target.value })}
//                 className="min-h-[120px]"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Tone</Label>
//               <Select
//                 value={currentConfig.tone || "friendly"}
//                 onValueChange={(value) => setCurrentConfig({ ...currentConfig, tone: value })}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="friendly">Friendly</SelectItem>
//                   <SelectItem value="professional">Professional</SelectItem>
//                   <SelectItem value="casual">Casual</SelectItem>
//                   <SelectItem value="formal">Formal</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         )

//       case "ADD_TAG":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Tag Name</Label>
//               <Input
//                 placeholder="e.g., interested, follow-up"
//                 value={currentConfig.tagName || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, tagName: e.target.value })}
//               />
//             </div>
//           </div>
//         )

//       case "DELAY":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Delay Duration</Label>
//               <div className="flex gap-2">
//                 <Input
//                   type="number"
//                   placeholder="5"
//                   value={currentConfig.delayAmount || ""}
//                   onChange={(e) => setCurrentConfig({ ...currentConfig, delayAmount: e.target.value })}
//                 />
//                 <Select
//                   value={currentConfig.delayUnit || "minutes"}
//                   onValueChange={(value) => setCurrentConfig({ ...currentConfig, delayUnit: value })}
//                 >
//                   <SelectTrigger className="w-32">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="seconds">Seconds</SelectItem>
//                     <SelectItem value="minutes">Minutes</SelectItem>
//                     <SelectItem value="hours">Hours</SelectItem>
//                     <SelectItem value="days">Days</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>
//         )

//       case "CONDITION":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Condition Type</Label>
//               <Select
//                 value={currentConfig.operator || "contains"}
//                 onValueChange={(value) => setCurrentConfig({ ...currentConfig, operator: value })}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="contains">Message contains</SelectItem>
//                   <SelectItem value="equals">Message equals</SelectItem>
//                   <SelectItem value="starts_with">Starts with</SelectItem>
//                   <SelectItem value="ends_with">Ends with</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Value</Label>
//               <Input
//                 placeholder="Enter condition value..."
//                 value={currentConfig.value || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, value: e.target.value })}
//               />
//             </div>
//           </div>
//         )

//       case "SEND_TO_HUMAN":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Handoff Reason</Label>
//               <Textarea
//                 placeholder="Add context for the human agent..."
//                 value={currentConfig.reason || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, reason: e.target.value })}
//                 className="min-h-[100px]"
//               />
//             </div>
//           </div>
//         )

//       case "WEBHOOK":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Webhook URL</Label>
//               <Input
//                 type="url"
//                 placeholder="https://example.com/webhook"
//                 value={currentConfig.webhookUrl || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, webhookUrl: e.target.value })}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Method</Label>
//               <Select
//                 value={currentConfig.webhookMethod || "POST"}
//                 onValueChange={(value) => setCurrentConfig({ ...currentConfig, webhookMethod: value })}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="POST">POST</SelectItem>
//                   <SelectItem value="GET">GET</SelectItem>
//                   <SelectItem value="PUT">PUT</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         )

//       default:
//         return null
//     }
//   }

//   const handleSave = async () => {
//     if (!name.trim()) {
//       toast.error("Please enter an automation name")
//       return
//     }

//     if (!instagramAccountId) {
//       toast.error("Please select an Instagram account")
//       return
//     }

//     if (!trigger) {
//       toast.error("Please add a trigger to your automation")
//       return
//     }

//     if (actions.length === 0) {
//       toast.error("Please add at least one action")
//       return
//     }

//     const hasUnconfigured = actions.some((action) => Object.keys(action.config || {}).length === 0)
//     if (hasUnconfigured) {
//       toast.error("Please configure all actions before saving")
//       return
//     }

//     setIsSaving(true)
//     try {
//       await updateAutomation(automationId, {
//         name,
//         description,
//         instagramAccountId,
//         triggerType: trigger.type,
//         triggerConditions: trigger.config,
//         actions: actions.map((action) => ({
//           type: action.type,
//           content: action.config,
//           order: action.order,
//         })),
//       })
//       toast.success("Automation updated successfully!")
//       router.push("/automations")
//     } catch (error) {
//       console.error("[v0] Failed to update automation:", error)
//       toast.error("Failed to update automation")
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-primary" />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="border-b bg-card">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Link href="/automations">
//                 <Button variant="ghost" size="sm">
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back
//                 </Button>
//               </Link>
//               <div>
//                 <h1 className="text-2xl font-semibold text-foreground">Edit Automation</h1>
//                 <p className="text-sm text-muted-foreground">Modify your automation workflow</p>
//               </div>
//             </div>
//             <Button onClick={handleSave} disabled={isSaving} size="lg">
//               <Save className="w-4 h-4 mr-2" />
//               {isSaving ? "Saving..." : "Update Automation"}
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
//         <Card className="p-6">
//           <h3 className="font-semibold text-foreground mb-4">Automation Details</h3>
//           <div className="grid gap-4 md:grid-cols-2">
//             <div>
//               <Label htmlFor="name">Name</Label>
//               <Input
//                 id="name"
//                 placeholder="Welcome new followers"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//             <div>
//               <Label htmlFor="account">Instagram Account</Label>
//               <Select value={instagramAccountId} onValueChange={setInstagramAccountId}>
//                 <SelectTrigger id="account">
//                   <SelectValue placeholder="Select account" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {instagramAccounts.map((account) => (
//                     <SelectItem key={account.id} value={account.id}>
//                       @{account.username}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="md:col-span-2">
//               <Label htmlFor="description">Description (Optional)</Label>
//               <Textarea
//                 id="description"
//                 placeholder="Describe what this automation does..."
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 rows={2}
//               />
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6">
//           <AutomationFlowCanvas
//             initialTrigger={trigger || undefined}
//             initialActions={actions}
//             onNodesChange={handleNodesChange}
//             onConfigureNode={handleConfigureNode}
//           />
//         </Card>
//       </div>

//       <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Configure {currentConfigNode?.type === "trigger" ? "Trigger" : "Action"}</DialogTitle>
//             <DialogDescription>Customize the settings below</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             {renderConfigForm()}
//             <div className="flex justify-end gap-2 pt-4">
//               <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleSaveConfig}>Save Configuration</Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

// export default function EditAutomationPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="flex items-center justify-center min-h-screen">
//           <Loader2 className="w-8 h-8 animate-spin text-primary" />
//         </div>
//       }
//     >
//       <EditAutomationPageContent />
//     </Suspense>
//   )
// }


// "use client"

// import { useState, useEffect, Suspense } from "react"
// import { useRouter, useParams } from "next/navigation"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { AutomationFlowCanvas } from "@/components/automation-flow-canvas"
// import { updateAutomation, getAutomation } from "@/lib/actions/automation-actions"
// import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
// import { ArrowLeft, Loader2, Save } from "lucide-react"
// import Link from "next/link"
// import { toast } from "sonner"
// import type { TriggerTypeId, ActionTypeId } from "@/lib/automation-constants"

// interface NodeConfig {
//   message?: string
//   customInstructions?: string
//   tone?: string
//   tagName?: string
//   delayAmount?: string
//   delayUnit?: string
//   field?: string
//   operator?: string
//   value?: string
//   reason?: string
//   webhookUrl?: string
//   webhookMethod?: string
//   keywords?: string[]
//   matchType?: string
// }

// function EditAutomationPageContent() {
//   const router = useRouter()
//   const params = useParams()
//   const automationId = params.id as string

//   const [name, setName] = useState("")
//   const [description, setDescription] = useState("")
//   const [instagramAccountId, setInstagramAccountId] = useState<string>("")
//   const [instagramAccounts, setInstagramAccounts] = useState<any[]>([])
//   const [trigger, setTrigger] = useState<{ type: TriggerTypeId; config: any } | null>(null)
//   const [actions, setActions] = useState<Array<{ type: ActionTypeId; config: any; order: number }>>([])
//   const [isSaving, setIsSaving] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [configDialogOpen, setConfigDialogOpen] = useState(false)
//   const [currentConfigNode, setCurrentConfigNode] = useState<{
//     id: string
//     type: "trigger" | "action"
//     actionType: string
//   } | null>(null)
//   const [currentConfig, setCurrentConfig] = useState<NodeConfig>({})

//   useEffect(() => {
//     async function loadData() {
//       try {
//         const [automation, accounts] = await Promise.all([getAutomation(automationId), getInstagramAccounts()])

//         setName(automation.name)
//         setDescription(automation.description || "")
//         setInstagramAccountId(automation.instagramAccountId || "")
//         setInstagramAccounts(accounts)

//         if (automation.triggers && automation.triggers.length > 0) {
//           const triggerData = automation.triggers[0]
//           setTrigger({
//             type: triggerData.type as TriggerTypeId,
//             config: triggerData.conditions,
//           })
//         }

//         if (automation.actions && automation.actions.length > 0) {
//           setActions(
//             automation.actions.map((action: any) => ({
//               type: action.type as ActionTypeId,
//               config: action.content,
//               order: action.order,
//             })),
//           )
//         }
//       } catch (error) {
//         console.error("[v0] Failed to load automation:", error)
//         toast.error("Failed to load automation")
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     loadData()
//   }, [automationId])

//   const handleNodesChange = (
//     newTrigger: { type: TriggerTypeId; config: any } | null,
//     newActions: Array<{ type: ActionTypeId; config: any; order: number }>,
//   ) => {
//     if (newTrigger) setTrigger(newTrigger)
//     setActions(newActions)
//   }

//   const handleConfigureNode = (nodeId: string, nodeType: "trigger" | "action", actionType: string) => {
//     setCurrentConfigNode({ id: nodeId, type: nodeType, actionType })

//     if (nodeType === "trigger" && trigger) {
//       setCurrentConfig(trigger.config || {})
//     } else if (nodeType === "action") {
//       const actionIndex = Number.parseInt(nodeId.replace("action-", "")) - 1
//       const actionNode = actions[actionIndex]
//       setCurrentConfig(actionNode?.config || {})
//     }

//     setConfigDialogOpen(true)
//   }

//   const handleSaveConfig = () => {
//     if (!currentConfigNode) return

//     if (currentConfigNode.type === "trigger" && trigger) {
//       setTrigger({ ...trigger, config: currentConfig })
//     } else if (currentConfigNode.type === "action") {
//       const actionIndex = Number.parseInt(currentConfigNode.id.replace("action-", "")) - 1
//       const updatedActions = [...actions]
//       if (updatedActions[actionIndex]) {
//         updatedActions[actionIndex].config = currentConfig
//       }
//       setActions(updatedActions)
//     }

//     setConfigDialogOpen(false)
//     setCurrentConfigNode(null)
//     setCurrentConfig({})
//   }

//   const renderConfigForm = () => {
//     if (!currentConfigNode) return null

//     const actionType = currentConfigNode.actionType

//     if (currentConfigNode.type === "trigger") {
//       if (actionType === "KEYWORD") {
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Keywords (comma separated)</Label>
//               <Input
//                 placeholder="price, pricing, cost, how much"
//                 value={(currentConfig.keywords || []).join(", ")}
//                 onChange={(e) =>
//                   setCurrentConfig({
//                     ...currentConfig,
//                     keywords: e.target.value.split(",").map((k) => k.trim()),
//                   })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Match Type</Label>
//               <Select
//                 value={currentConfig.matchType || "contains"}
//                 onValueChange={(value) => setCurrentConfig({ ...currentConfig, matchType: value })}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="contains">Contains keyword</SelectItem>
//                   <SelectItem value="exact">Exact match</SelectItem>
//                   <SelectItem value="starts_with">Starts with</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         )
//       }
//       return (
//         <div className="text-sm text-muted-foreground">This trigger type doesn't require additional configuration.</div>
//       )
//     }

//     switch (actionType) {
//       case "SEND_MESSAGE":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Message Template</Label>
//               <Textarea
//                 placeholder="Enter your message..."
//                 value={currentConfig.message || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, message: e.target.value })}
//                 className="min-h-[120px]"
//               />
//               <p className="text-xs text-muted-foreground">
//                 Use variables: {"{name}"}, {"{username}"}, {"{first_name}"}
//               </p>
//             </div>
//           </div>
//         )

//       case "AI_RESPONSE":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>AI Instructions</Label>
//               <Textarea
//                 placeholder="Tell the AI how to respond..."
//                 value={currentConfig.customInstructions || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, customInstructions: e.target.value })}
//                 className="min-h-[120px]"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Tone</Label>
//               <Select
//                 value={currentConfig.tone || "friendly"}
//                 onValueChange={(value) => setCurrentConfig({ ...currentConfig, tone: value })}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="friendly">Friendly</SelectItem>
//                   <SelectItem value="professional">Professional</SelectItem>
//                   <SelectItem value="casual">Casual</SelectItem>
//                   <SelectItem value="formal">Formal</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         )

//       case "ADD_TAG":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Tag Name</Label>
//               <Input
//                 placeholder="e.g., interested, follow-up"
//                 value={currentConfig.tagName || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, tagName: e.target.value })}
//               />
//             </div>
//           </div>
//         )

//       case "DELAY":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Delay Duration</Label>
//               <div className="flex gap-2">
//                 <Input
//                   type="number"
//                   placeholder="5"
//                   value={currentConfig.delayAmount || ""}
//                   onChange={(e) => setCurrentConfig({ ...currentConfig, delayAmount: e.target.value })}
//                 />
//                 <Select
//                   value={currentConfig.delayUnit || "minutes"}
//                   onValueChange={(value) => setCurrentConfig({ ...currentConfig, delayUnit: value })}
//                 >
//                   <SelectTrigger className="w-32">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="seconds">Seconds</SelectItem>
//                     <SelectItem value="minutes">Minutes</SelectItem>
//                     <SelectItem value="hours">Hours</SelectItem>
//                     <SelectItem value="days">Days</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>
//         )

//       case "CONDITION":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Condition Type</Label>
//               <Select
//                 value={currentConfig.operator || "contains"}
//                 onValueChange={(value) => setCurrentConfig({ ...currentConfig, operator: value })}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="contains">Message contains</SelectItem>
//                   <SelectItem value="equals">Message equals</SelectItem>
//                   <SelectItem value="starts_with">Starts with</SelectItem>
//                   <SelectItem value="ends_with">Ends with</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Value</Label>
//               <Input
//                 placeholder="Enter condition value..."
//                 value={currentConfig.value || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, value: e.target.value })}
//               />
//             </div>
//           </div>
//         )

//       case "SEND_TO_HUMAN":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Handoff Reason</Label>
//               <Textarea
//                 placeholder="Add context for the human agent..."
//                 value={currentConfig.reason || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, reason: e.target.value })}
//                 className="min-h-[100px]"
//               />
//             </div>
//           </div>
//         )

//       case "WEBHOOK":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Webhook URL</Label>
//               <Input
//                 type="url"
//                 placeholder="https://example.com/webhook"
//                 value={currentConfig.webhookUrl || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, webhookUrl: e.target.value })}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Method</Label>
//               <Select
//                 value={currentConfig.webhookMethod || "POST"}
//                 onValueChange={(value) => setCurrentConfig({ ...currentConfig, webhookMethod: value })}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="POST">POST</SelectItem>
//                   <SelectItem value="GET">GET</SelectItem>
//                   <SelectItem value="PUT">PUT</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         )

//       default:
//         return null
//     }
//   }

//   const handleSave = async () => {
//     if (!name.trim()) {
//       toast.error("Please enter an automation name")
//       return
//     }

//     if (!instagramAccountId) {
//       toast.error("Please select an Instagram account")
//       return
//     }

//     if (!trigger) {
//       toast.error("Please add a trigger to your automation")
//       return
//     }

//     if (actions.length === 0) {
//       toast.error("Please add at least one action")
//       return
//     }

//     const hasUnconfigured = actions.some((action) => Object.keys(action.config || {}).length === 0)
//     if (hasUnconfigured) {
//       toast.error("Please configure all actions before saving")
//       return
//     }

//     setIsSaving(true)
//     try {
//       await updateAutomation(automationId, {
//         name,
//         description,
//         instagramAccountId,
//         triggerType: trigger.type,
//         triggerConditions: trigger.config,
//         actions: actions.map((action) => ({
//           type: action.type,
//           content: action.config,
//           order: action.order,
//         })),
//       })
//       toast.success("Automation updated successfully!")
//       router.push("/automations")
//     } catch (error) {
//       console.error("[v0] Failed to update automation:", error)
//       toast.error("Failed to update automation")
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-primary" />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="border-b bg-card">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Link href="/automations">
//                 <Button variant="ghost" size="sm">
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back
//                 </Button>
//               </Link>
//               <div>
//                 <h1 className="text-2xl font-semibold text-foreground">Edit Automation</h1>
//                 <p className="text-sm text-muted-foreground">Modify your automation workflow</p>
//               </div>
//             </div>
//             <Button onClick={handleSave} disabled={isSaving} size="lg">
//               <Save className="w-4 h-4 mr-2" />
//               {isSaving ? "Saving..." : "Update Automation"}
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
//         <Card className="p-6">
//           <h3 className="font-semibold text-foreground mb-4">Automation Details</h3>
//           <div className="grid gap-4 md:grid-cols-2">
//             <div>
//               <Label htmlFor="name">Name</Label>
//               <Input
//                 id="name"
//                 placeholder="Welcome new followers"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//             <div>
//               <Label htmlFor="account">Instagram Account</Label>
//               <Select value={instagramAccountId} onValueChange={setInstagramAccountId}>
//                 <SelectTrigger id="account">
//                   <SelectValue placeholder="Select account" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {instagramAccounts.map((account) => (
//                     <SelectItem key={account.id} value={account.id}>
//                       @{account.username}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="md:col-span-2">
//               <Label htmlFor="description">Description (Optional)</Label>
//               <Textarea
//                 id="description"
//                 placeholder="Describe what this automation does..."
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 rows={2}
//               />
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6">
//           <AutomationFlowCanvas
//             initialTrigger={trigger || undefined}
//             initialActions={actions}
//             onNodesChange={handleNodesChange}
//             onConfigureNode={handleConfigureNode}
//           />
//         </Card>
//       </div>

//       <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Configure {currentConfigNode?.type === "trigger" ? "Trigger" : "Action"}</DialogTitle>
//             <DialogDescription>Customize the settings below</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             {renderConfigForm()}
//             <div className="flex justify-end gap-2 pt-4">
//               <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleSaveConfig}>Save Configuration</Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

// export default function EditAutomationPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="flex items-center justify-center min-h-screen">
//           <Loader2 className="w-8 h-8 animate-spin text-primary" />
//         </div>
//       }
//     >
//       <EditAutomationPageContent />
//     </Suspense>
//   )
// }


"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AutomationFlowCanvas } from "@/components/automation-flow-canvas"
import { AutomationConfigDialog } from "@/components/automation-config-dialog"
import { TriggerSelectorDialog } from "@/components/trigger-selector-dialog"
import { updateAutomation, getAutomation } from "@/lib/actions/automation-actions"
import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
import { ArrowLeft, Loader2, Save, Sparkles } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import type { TriggerTypeId, ActionTypeId } from "@/lib/automation-constants"
import { TRIGGER_TYPES } from "@/lib/automation-constants"

function EditAutomationPageContent() {
  const router = useRouter()
  const params = useParams()
  const automationId = params.id as string

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [instagramAccountId, setInstagramAccountId] = useState<string>("")
  const [instagramAccounts, setInstagramAccounts] = useState<any[]>([])
  const [trigger, setTrigger] = useState<{ type: TriggerTypeId; config: any } | null>(null)
  const [actions, setActions] = useState<Array<{ type: ActionTypeId; config: any; order: number }>>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [showTriggerSelector, setShowTriggerSelector] = useState(false)
  const [currentConfigNode, setCurrentConfigNode] = useState<{
    id: string
    type: "trigger" | "action"
    actionType: string
  } | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [automation, accounts] = await Promise.all([getAutomation(automationId), getInstagramAccounts()])

        setName(automation.name)
        setDescription(automation.description || "")
        setInstagramAccountId(automation.instagramAccountId || "")
        setInstagramAccounts(accounts)

        if (automation.triggers && automation.triggers.length > 0) {
          const triggerData = automation.triggers[0]
          setTrigger({
            type: triggerData.type as TriggerTypeId,
            config: triggerData.conditions,
          })
        }

        if (automation.actions && automation.actions.length > 0) {
          setActions(
            automation.actions.map((action: any) => ({
              type: action.type as ActionTypeId,
              config: action.content,
              order: action.order,
            })),
          )
        }
      } catch (error) {
        console.error("[v0] Failed to load automation:", error)
        toast.error("Failed to load automation")
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [automationId])

  const handleSelectTrigger = (triggerType: TriggerTypeId) => {
    setTrigger({ type: triggerType, config: {} })
    setShowTriggerSelector(false)
  }

  const handleNodesChange = (
    newTrigger: { type: TriggerTypeId; config: any } | null,
    newActions: Array<{ type: ActionTypeId; config: any; order: number }>,
  ) => {
    if (newTrigger) setTrigger(newTrigger)
    setActions(newActions)
  }

  const handleConfigureNode = (nodeId: string, nodeType: "trigger" | "action", actionType: string) => {
    setCurrentConfigNode({ id: nodeId, type: nodeType, actionType })
    setConfigDialogOpen(true)
  }

  const handleSaveConfig = (config: any) => {
    if (!currentConfigNode) return

    if (currentConfigNode.type === "trigger" && trigger) {
      setTrigger({ ...trigger, config })
    } else if (currentConfigNode.type === "action") {
      const actionIndex = Number.parseInt(currentConfigNode.id.replace("action-", "")) - 1
      const updatedActions = [...actions]
      if (updatedActions[actionIndex]) {
        updatedActions[actionIndex].config = config
      }
      setActions(updatedActions)
    }

    setConfigDialogOpen(false)
    setCurrentConfigNode(null)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter an automation name")
      return
    }

    if (!instagramAccountId) {
      toast.error("Please select an Instagram account")
      return
    }

    if (!trigger) {
      toast.error("Please add a trigger to your automation")
      return
    }

    if (actions.length === 0) {
      toast.error("Please add at least one action")
      return
    }

    const hasUnconfigured = actions.some((action) => Object.keys(action.config || {}).length === 0)
    if (hasUnconfigured) {
      toast.error("Please configure all actions before saving")
      return
    }

    setIsSaving(true)
    try {
      await updateAutomation(automationId, {
        name,
        description,
        instagramAccountId,
        triggerType: trigger.type,
        triggerConditions: trigger.config,
        actions: actions.map((action) => ({
          type: action.type,
          content: action.config,
          order: action.order,
        })),
      })
      toast.success("Automation updated successfully!")
      router.push("/automations")
    } catch (error) {
      console.error("[v0] Failed to update automation:", error)
      toast.error("Failed to update automation")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const currentConfig =
    currentConfigNode?.type === "trigger"
      ? trigger?.config
      : actions.find((_, index) => `action-${index + 1}` === currentConfigNode?.id)?.config

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-none border-b bg-card shadow-sm z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-4">
              <Link href="/automations">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Edit Automation</h1>
                  <p className="text-sm text-muted-foreground">Modify your automation workflow</p>
                </div>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isSaving} size="lg" className="min-w-[180px] shadow-lg">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Update Automation"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-96 flex-none border-r bg-card overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-4">Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Welcome New Followers"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account">Instagram Account</Label>
                  <Select value={instagramAccountId} onValueChange={setInstagramAccountId}>
                    <SelectTrigger id="account">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {instagramAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          @{account.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="What does this automation do?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Trigger Info Card */}
            {trigger && (
              <Card className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm text-foreground">Current Trigger</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTriggerSelector(true)}
                    className="h-7 text-xs"
                  >
                    Change
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {trigger ? TRIGGER_TYPES[trigger.type]?.label : "No trigger selected"}
                </p>
              </Card>
            )}

            {/* Stats */}
            <div className="pt-4 border-t">
              <h4 className="font-semibold text-sm mb-3">Workflow Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trigger:</span>
                  <span className="font-medium">{trigger ? "1 event" : "None"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Actions:</span>
                  <span className="font-medium">{actions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Configured:</span>
                  <span className="font-medium">
                    {actions.filter((a) => Object.keys(a.config || {}).length > 0).length}/{actions.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-6 overflow-hidden">
          <AutomationFlowCanvas
            initialTrigger={trigger || undefined}
            initialActions={actions}
            onNodesChange={handleNodesChange}
            onConfigureNode={handleConfigureNode}
          />
        </div>
      </div>

      {/* Dialogs */}
      <AutomationConfigDialog
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        nodeType={currentConfigNode?.type || "action"}
        actionType={currentConfigNode?.actionType || ""}
        config={currentConfig || {}}
        onSave={handleSaveConfig}
      />

      <TriggerSelectorDialog
        open={showTriggerSelector}
        onOpenChange={setShowTriggerSelector}
        onSelect={handleSelectTrigger}
        currentTrigger={trigger?.type}
      />
    </div>
  )
}

export default function EditAutomationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <EditAutomationPageContent />
    </Suspense>
  )
}
