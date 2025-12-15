// import { AutomationBuilder } from "@/components/automation-builder"
// import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft } from "lucide-react"
// import Link from "next/link"
// //
// export default async function NewAutomationPage() {
//   const instagramAccounts = await getInstagramAccounts()

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <Link href="/automations">
//         <Button variant="ghost" size="sm" className="mb-6">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Automations
//         </Button>
//       </Link>

//       <div className="mb-8">
//         <h1 className="text-3xl font-bold tracking-tight">Create Automation</h1>
//         <p className="text-muted-foreground mt-2">Build an intelligent workflow to automate your Instagram responses</p>
//       </div>

//       <AutomationBuilder instagramAccounts={instagramAccounts} />
//     </div>
//   )
// // }

// import { AutomationBuilder } from "@/components/automation-builder"
// import { AutomationTemplateSelector } from "@/components/automation-template-selector"
// import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
// import { getTemplateById } from "@/lib/automation-templates"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft } from "lucide-react"
// import Link from "next/link"

// export default async function NewAutomationPage({
//   searchParams,
// }: {
//   searchParams: { template?: string; from?: string }
// }) {
//   const instagramAccounts = await getInstagramAccounts()

//   // If no template or from parameter, show template selector
//   if (!searchParams.template && !searchParams.from) {
//     return (
//       <div className="container mx-auto py-8 px-4">
//         <Link href="/automations">
//           <Button variant="ghost" size="sm" className="mb-6">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Automations
//           </Button>
//         </Link>
//         <AutomationTemplateSelector />
//       </div>
//     )
//   }

//   // Load template if specified
//   let automation = null
//   if (searchParams.template) {
//     const template = getTemplateById(searchParams.template)
//     if (template) {
//       automation = {
//         name: template.name,
//         description: template.description,
//         triggers: [
//           {
//             type: template.triggerType,
//             conditions: template.triggerConditions,
//           },
//         ],
//         actions: template.actions.map((a, i) => ({
//           id: `action-${i}`,
//           type: a.type,
//           order: a.order,
//           content: a.content,
//         })),
//       }
//     }
//   }

//   return (
//     <div className="container mx-auto py-8 px-4 max-w-7xl">
//       <Link href="/automations">
//         <Button variant="ghost" size="sm" className="mb-6">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Automations
//         </Button>
//       </Link>

//       <div className="mb-8">
//         <h1 className="text-3xl font-bold tracking-tight">
//           {searchParams.template ? "Customize Template" : "Create Automation"}
//         </h1>
//         <p className="text-muted-foreground mt-2">
//           {searchParams.template
//             ? "Customize this template to fit your needs"
//             : "Build an intelligent workflow to automate your Instagram responses"}
//         </p>
//       </div>

//       <AutomationBuilder automation={automation} instagramAccounts={instagramAccounts} />
//     </div>
//   )
// }

// import { AutomationBuilder } from "@/components/automation-builder"
// import { AutomationTemplateSelector } from "@/components/automation-template-selector"
// import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
// import { getTemplateById } from "@/lib/automation-templates"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft } from "lucide-react"
// import Link from "next/link"

// export default async function NewAutomationPage({
//   searchParams,
// }: {
//   searchParams: { template?: string; from?: string }
// }) {
//   const instagramAccounts = await getInstagramAccounts()

//   // If no template or from parameter, show template selector
//   if (!searchParams.template && !searchParams.from) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center gap-4">
//           <Link href="/automations">
//             <Button variant="ghost" size="sm" className="hover:bg-accent shadow-md hover:shadow-lg transition-all">
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//           </Link>
//         </div>
//         <AutomationTemplateSelector />
//       </div>
//     )
//   }

//   // Load template if specified
//   let automation = null
//   if (searchParams.template) {
//     const template = getTemplateById(searchParams.template)
//     if (template) {
//       automation = {
//         name: template.name,
//         description: template.description,
//         triggers: [
//           {
//             type: template.triggerType,
//             conditions: template.triggerConditions,
//           },
//         ],
//         actions: template.actions.map((a, i) => ({
//           id: `action-${i}`,
//           type: a.type,
//           order: a.order,
//           content: a.content,
//         })),
//       }
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-4">
//         <Link href="/automations">
//           <Button variant="ghost" size="sm" className="hover:bg-accent shadow-md hover:shadow-lg transition-all">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back
//           </Button>
//         </Link>
//       </div>

//       <div className="space-y-2">
//         <h1 className="text-3xl font-bold tracking-tight text-foreground">
//           {searchParams.template ? "Customize Template" : "Create Automation"}
//         </h1>
//         <p className="text-muted-foreground">
//           {searchParams.template
//             ? "Customize this template to fit your needs"
//             : "Build an intelligent workflow to automate your Instagram responses"}
//         </p>
//       </div>

//       <AutomationBuilder automation={automation} instagramAccounts={instagramAccounts} />
//     </div>
//   )
// }







// "use client"

// import { useState, useEffect, Suspense } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { AutomationFlowCanvas } from "@/components/automation-flow-canvas"
// import { AutomationTemplateSelector } from "@/components/automation-template-selector"
// import { createAutomation } from "@/lib/actions/automation-actions"
// import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
// import { getTemplateById } from "@/lib/automation-templates"

// import { ArrowLeft, Save } from "lucide-react"
// import Link from "next/link"
// import { toast } from "sonner"

// type TriggerType = "DM_RECEIVED" | "STORY_REPLY" | "COMMENT" | "MENTION" | "KEYWORD" | "FIRST_MESSAGE"
// type ActionType = "SEND_MESSAGE" | "AI_RESPONSE" | "ADD_TAG" | "DELAY" | "CONDITION" | "SEND_TO_HUMAN" | "WEBHOOK"

// interface NodeConfig {
//   // SEND_MESSAGE
//   message?: string
//   // AI_RESPONSE
//   customInstructions?: string
//   tone?: string
//   // ADD_TAG
//   tagName?: string
//   // DELAY
//   delayAmount?: string
//   delayUnit?: string
//   // CONDITION
//   field?: string
//   operator?: string
//   value?: string
//   // SEND_TO_HUMAN
//   reason?: string
//   // WEBHOOK
//   webhookUrl?: string
//   webhookMethod?: string
//   // KEYWORD (trigger)
//   keywords?: string[]
//   matchType?: string
// }

// function CreateAutomationPageContent() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const templateId = searchParams.get("template")
//   const fromScratch = searchParams.get("from") === "scratch"

//   const [showTemplates, setShowTemplates] = useState(!templateId && !fromScratch)
//   const [name, setName] = useState("")
//   const [description, setDescription] = useState("")
//   const [instagramAccountId, setInstagramAccountId] = useState<string>("")
//   const [instagramAccounts, setInstagramAccounts] = useState<any[]>([])
//   const [trigger, setTrigger] = useState<{ type: TriggerType; config: any } | null>(null)
//   const [actions, setActions] = useState<Array<{ type: ActionType; config: any; order: number }>>([])
//   const [isSaving, setIsSaving] = useState(false)
//   const [configDialogOpen, setConfigDialogOpen] = useState(false)
//   const [currentConfigNode, setCurrentConfigNode] = useState<{
//     id: string
//     type: "trigger" | "action"
//     actionType: string
//   } | null>(null)
//   const [currentConfig, setCurrentConfig] = useState<NodeConfig>({})

//   useEffect(() => {
//     async function loadAccounts() {
//       const accounts = await getInstagramAccounts()
//       setInstagramAccounts(accounts)
//       if (accounts.length === 1) {
//         setInstagramAccountId(accounts[0].id)
//       }
//     }
//     loadAccounts()
//   }, [])

//   useEffect(() => {
//     if (templateId) {
//       const template = getTemplateById(templateId)
//       if (template) {
//         setName(template.name)
//         setDescription(template.description)
//         setTrigger({ type: template.triggerType as TriggerType, config: template.triggerConditions })
//         setActions(
//           template.actions.map((action) => ({
//             type: action.type as ActionType,
//             config: action.content,
//             order: action.order,
//           })),
//         )
//         setShowTemplates(false)
//       }
//     } else if (fromScratch) {
//       setTrigger({ type: "DM_RECEIVED", config: {} })
//       setShowTemplates(false)
//     }
//   }, [templateId, fromScratch])

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
//       const actionNode = actions.find((_, index) => `action-${index + 1}` === nodeId)
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

//     // Trigger configurations
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

//     // Action configurations
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
//       await createAutomation({
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
//       toast.success("Automation created successfully!")
//       router.push("/automations")
//     } catch (error) {
//       console.error("[v0] Failed to create automation:", error)
//       toast.error("Failed to create automation")
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   if (showTemplates) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="border-b bg-card">
//           <div className="max-w-7xl mx-auto px-6 py-4">
//             <div className="flex items-center gap-4">
//               <Link href="/automations">
//                 <Button variant="ghost" size="sm">
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <AutomationTemplateSelector />
//         </div>
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
//                 <h1 className="text-2xl font-semibold text-foreground">Create Automation</h1>
//                 <p className="text-sm text-muted-foreground">Build intelligent workflows for Instagram</p>
//               </div>
//             </div>
//             <Button onClick={handleSave} disabled={isSaving} size="lg">
//               <Save className="w-4 h-4 mr-2" />
//               {isSaving ? "Saving..." : "Create Automation"}
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

// export default function CreateAutomationPage() {
//   return (
//     <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
//       <CreateAutomationPageContent />
//     </Suspense>
//   )
// }











"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AutomationFlowCanvas } from "@/components/automation-flow-canvas"
import { AutomationConfigDialog } from "@/components/automation-config-dialog"
import { AutomationTemplateSelector } from "@/components/automation-template-selector"
import { createAutomation } from "@/lib/actions/automation-actions"
import { getInstagramAccounts } from "@/lib/actions/instagram-account-actions"
import { getTemplateById } from "@/lib/automation-templates"
import type { TriggerTypeId, ActionTypeId } from "@/lib/automation-constants"
import { ArrowLeft, Save, Zap } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

function CreateAutomationPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template")
  const fromScratch = searchParams.get("from") === "scratch"

  const [showTemplates, setShowTemplates] = useState(!templateId && !fromScratch)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [instagramAccountId, setInstagramAccountId] = useState<string>("")
  const [instagramAccounts, setInstagramAccounts] = useState<any[]>([])
  const [trigger, setTrigger] = useState<{ type: TriggerTypeId; config: any } | null>(null)
  const [actions, setActions] = useState<Array<{ type: ActionTypeId; config: any; order: number }>>([])
  const [isSaving, setIsSaving] = useState(false)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [currentConfigNode, setCurrentConfigNode] = useState<{
    id: string
    type: "trigger" | "action"
    actionType: string
  } | null>(null)

  useEffect(() => {
    async function loadAccounts() {
      const accounts = await getInstagramAccounts()
      setInstagramAccounts(accounts)
      if (accounts.length === 1) {
        setInstagramAccountId(accounts[0].id)
      }
    }
    loadAccounts()
  }, [])

  useEffect(() => {
    if (templateId) {
      const template = getTemplateById(templateId)
      if (template) {
        setName(template.name)
        setDescription(template.description)
        setTrigger({ type: template.triggerType as TriggerTypeId, config: template.triggerConditions })
        setActions(
          template.actions.map((action) => ({
            type: action.type as ActionTypeId,
            config: action.content,
            order: action.order,
          })),
        )
        setShowTemplates(false)
      }
    } else if (fromScratch) {
      setTrigger({ type: "DM_RECEIVED", config: {} })
      setShowTemplates(false)
    }
  }, [templateId, fromScratch])

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

    const unconfiguredActions = actions.filter((action) => Object.keys(action.config || {}).length === 0)
    if (unconfiguredActions.length > 0) {
      toast.error("Please configure all actions before saving")
      return
    }

    setIsSaving(true)
    try {
      await createAutomation({
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
      toast.success("Automation created successfully!")
      router.push("/automations")
    } catch (error) {
      console.error("[v0] Failed to create automation:", error)
      toast.error("Failed to create automation. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (showTemplates) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Link href="/automations">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <AutomationTemplateSelector />
        </div>
      </div>
    )
  }

  const currentConfig =
    currentConfigNode?.type === "trigger"
      ? trigger?.config
      : actions.find((_, index) => `action-${index + 1}` === currentConfigNode?.id)?.config

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/automations">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Create Automation</h1>
                  <p className="text-sm text-muted-foreground">Build intelligent Instagram workflows</p>
                </div>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isSaving} size="lg" className="min-w-[160px]">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Creating..." : "Create Automation"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Details Card */}
        <Card className="p-6 shadow-lg">
          <h3 className="font-semibold text-lg text-foreground mb-4">Automation Details</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Welcome New Followers"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">Instagram Account *</Label>
              <Select value={instagramAccountId} onValueChange={setInstagramAccountId}>
                <SelectTrigger id="account" className="bg-background">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {instagramAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center gap-2">
                        <span>@{account.username}</span>
                        {account.followerCount && (
                          <span className="text-xs text-muted-foreground">
                            ({account.followerCount.toLocaleString()} followers)
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe what this automation does..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="bg-background"
              />
            </div>
          </div>
        </Card>

        {/* Flow Canvas */}
        <AutomationFlowCanvas
          initialTrigger={trigger || undefined}
          initialActions={actions}
          onNodesChange={handleNodesChange}
          onConfigureNode={handleConfigureNode}
        />
      </div>

      {/* Configuration Dialog */}
      <AutomationConfigDialog
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        nodeType={currentConfigNode?.type || "action"}
        actionType={currentConfigNode?.actionType || ""}
        config={currentConfig || {}}
        onSave={handleSaveConfig}
      />
    </div>
  )
}

export default function CreateAutomationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <CreateAutomationPageContent />
    </Suspense>
  )
}

