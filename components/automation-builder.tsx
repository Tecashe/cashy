// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import {
//   MessageSquare,
//   TagIcon,
//   Clock,
//   Webhook,
//   GitBranch,
//   User,
//   Plus,
//   Trash2,
//   Save,
//   ArrowDown,
//   Play,
//   Sparkles,
//   Bot,
//   GripVertical,
// } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { createAutomation, updateAutomation } from "@/lib/actions/automation-actions"
// import { useToast } from "@/hooks/use-toast"
// //
// type TriggerType = "DM_RECEIVED" | "KEYWORD" | "STORY_REPLY" | "COMMENT" | "MENTION" | "FIRST_MESSAGE" | "HAS_TAG"
// type ActionType =
//   | "SEND_MESSAGE"
//   | "AI_RESPONSE"
//   | "ADD_TAG"
//   | "REMOVE_TAG"
//   | "DELAY"
//   | "WEBHOOK"
//   | "BRANCH"
//   | "SEND_TO_HUMAN"

// interface AutomationAction {
//   id: string
//   type: ActionType
//   order: number
//   content: any
// }

// interface AutomationBuilderProps {
//   automation?: any
//   instagramAccounts: any[]
// }

// export function AutomationBuilder({ automation, instagramAccounts }: AutomationBuilderProps) {
//   const router = useRouter()
//   const { toast } = useToast()
//   const [name, setName] = useState(automation?.name || "")
//   const [description, setDescription] = useState(automation?.description || "")
//   const [instagramAccountId, setInstagramAccountId] = useState(automation?.instagramAccountId || "")
//   const [triggerType, setTriggerType] = useState<TriggerType>(automation?.triggers[0]?.type || "DM_RECEIVED")
//   const [keywords, setKeywords] = useState(automation?.triggers[0]?.conditions?.keywords?.join(", ") || "")
//   const [matchType, setMatchType] = useState(automation?.triggers[0]?.conditions?.matchType || "contains")
//   const [actions, setActions] = useState<AutomationAction[]>(automation?.actions || [])
//   const [isSaving, setIsSaving] = useState(false)

//   const addAction = (type: ActionType) => {
//     const newAction: AutomationAction = {
//       id: `action-${Date.now()}`,
//       type,
//       order: actions.length,
//       content: {},
//     }
//     setActions([...actions, newAction])
//   }

//   const removeAction = (id: string) => {
//     setActions(actions.filter((a) => a.id !== id).map((a, i) => ({ ...a, order: i })))
//   }

//   const updateAction = (id: string, content: any) => {
//     setActions(actions.map((a) => (a.id === id ? { ...a, content: { ...a.content, ...content } } : a)))
//   }

//   const handleSave = async () => {
//     if (!name.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter an automation name",
//         variant: "destructive",
//       })
//       return
//     }

//     if (actions.length === 0) {
//       toast({
//         title: "Error",
//         description: "Please add at least one action",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSaving(true)

//     try {
//       const keywordArray = keywords
//         .split(",")
//         .map((k: string) => k.trim())
//         .filter((k: string | any[]) => k.length > 0)

//       const triggerConditions = triggerType === "KEYWORD" ? { keywords: keywordArray, matchType } : {}

//       if (automation) {
//         await updateAutomation(automation.id, {
//           name,
//           description,
//           instagramAccountId: instagramAccountId || undefined,
//           triggerType,
//           triggerConditions,
//           actions: actions.map((a) => ({
//             type: a.type,
//             content: a.content,
//             order: a.order,
//           })),
//         })
//       } else {
//         await createAutomation({
//           name,
//           description,
//           instagramAccountId: instagramAccountId || undefined,
//           triggerType,
//           triggerConditions,
//           actions: actions.map((a) => ({
//             type: a.type,
//             content: a.content,
//             order: a.order,
//           })),
//         })
//       }

//       toast({
//         title: "Success",
//         description: `Automation ${automation ? "updated" : "created"} successfully`,
//       })

//       router.push("/automations")
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to save automation",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const getActionIcon = (type: ActionType) => {
//     switch (type) {
//       case "SEND_MESSAGE":
//         return MessageSquare
//       case "AI_RESPONSE":
//         return Bot
//       case "ADD_TAG":
//       case "REMOVE_TAG":
//         return TagIcon
//       case "DELAY":
//         return Clock
//       case "WEBHOOK":
//         return Webhook
//       case "BRANCH":
//         return GitBranch
//       case "SEND_TO_HUMAN":
//         return User
//     }
//   }

//   const getActionLabel = (type: ActionType) => {
//     return type
//       .replace(/_/g, " ")
//       .toLowerCase()
//       .replace(/^\w/, (c) => c.toUpperCase())
//   }

//   return (
//     <div className="grid gap-6 lg:grid-cols-3">
//       {/* Left Panel - Configuration */}
//       <div className="lg:col-span-1 space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Basic Info</CardTitle>
//             <CardDescription>Name and describe your automation</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Automation Name *</Label>
//               <Input
//                 id="name"
//                 placeholder="e.g., Welcome New Followers"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 placeholder="What does this automation do?"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 rows={3}
//               />
//             </div>
//             {instagramAccounts.length > 0 && (
//               <div className="space-y-2">
//                 <Label htmlFor="account">Instagram Account</Label>
//                 <Select value={instagramAccountId} onValueChange={setInstagramAccountId}>
//                   <SelectTrigger id="account">
//                     <SelectValue placeholder="All accounts" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All accounts</SelectItem>
//                     {instagramAccounts.map((account) => (
//                       <SelectItem key={account.id} value={account.id}>
//                         @{account.username}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Trigger</CardTitle>
//             <CardDescription>When should this automation run?</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="trigger">Trigger Type</Label>
//               <Select value={triggerType} onValueChange={(value) => setTriggerType(value as TriggerType)}>
//                 <SelectTrigger id="trigger">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="DM_RECEIVED">Any DM Received</SelectItem>
//                   <SelectItem value="FIRST_MESSAGE">First Message</SelectItem>
//                   <SelectItem value="KEYWORD">Keyword Match</SelectItem>
//                   <SelectItem value="STORY_REPLY">Story Reply</SelectItem>
//                   <SelectItem value="COMMENT">Comment on Post</SelectItem>
//                   <SelectItem value="MENTION">Mention in Story</SelectItem>
//                   <SelectItem value="HAS_TAG">Has Specific Tag</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {triggerType === "KEYWORD" && (
//               <>
//                 <div className="space-y-2">
//                   <Label htmlFor="keywords">Keywords (comma-separated)</Label>
//                   <Input
//                     id="keywords"
//                     placeholder="e.g., price, product, buy"
//                     value={keywords}
//                     onChange={(e) => setKeywords(e.target.value)}
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     Messages containing these words will trigger the automation
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="matchType">Match Type</Label>
//                   <Select value={matchType} onValueChange={setMatchType}>
//                     <SelectTrigger id="matchType">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="contains">Contains (anywhere in message)</SelectItem>
//                       <SelectItem value="exact">Exact match</SelectItem>
//                       <SelectItem value="regex">Regular expression</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </>
//             )}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Add Actions</CardTitle>
//             <CardDescription>Build your automation flow</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <Button
//               onClick={() => addAction("SEND_MESSAGE")}
//               variant="outline"
//               size="sm"
//               className="w-full justify-start gap-2"
//             >
//               <MessageSquare className="h-4 w-4" />
//               Send Message
//             </Button>
//             <Button
//               onClick={() => addAction("AI_RESPONSE")}
//               variant="outline"
//               size="sm"
//               className="w-full justify-start gap-2"
//             >
//               <Bot className="h-4 w-4" />
//               AI Response
//               <Badge variant="secondary" className="ml-auto text-xs">
//                 <Sparkles className="h-3 w-3 mr-1" />
//                 AI
//               </Badge>
//             </Button>
//             <Button
//               onClick={() => addAction("ADD_TAG")}
//               variant="outline"
//               size="sm"
//               className="w-full justify-start gap-2"
//             >
//               <TagIcon className="h-4 w-4" />
//               Add Tag
//             </Button>
//             <Button
//               onClick={() => addAction("DELAY")}
//               variant="outline"
//               size="sm"
//               className="w-full justify-start gap-2"
//             >
//               <Clock className="h-4 w-4" />
//               Add Delay
//             </Button>
//             <Button
//               onClick={() => addAction("SEND_TO_HUMAN")}
//               variant="outline"
//               size="sm"
//               className="w-full justify-start gap-2"
//             >
//               <User className="h-4 w-4" />
//               Send to Human
//             </Button>
//             <Button
//               onClick={() => addAction("WEBHOOK")}
//               variant="outline"
//               size="sm"
//               className="w-full justify-start gap-2"
//             >
//               <Webhook className="h-4 w-4" />
//               Call Webhook
//             </Button>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Right Panel - Visual Flow */}
//       <div className="lg:col-span-2 space-y-6">
//         <Card>
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle>Automation Flow</CardTitle>
//                 <CardDescription>Visual representation of your automation</CardDescription>
//               </div>
//               <div className="flex gap-2">
//                 <Button variant="outline" size="sm" disabled>
//                   <Play className="mr-2 h-4 w-4" />
//                   Test
//                 </Button>
//                 <Button size="sm" onClick={handleSave} disabled={isSaving}>
//                   <Save className="mr-2 h-4 w-4" />
//                   {isSaving ? "Saving..." : "Save"}
//                 </Button>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {/* Trigger Node */}
//               <div className="relative rounded-lg border-2 border-primary bg-primary/5 p-4">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
//                     <MessageSquare className="h-5 w-5 text-primary-foreground" />
//                   </div>
//                   <div>
//                     <p className="font-semibold">Trigger</p>
//                     <p className="text-sm text-muted-foreground">
//                       {triggerType === "DM_RECEIVED" && "When a DM is received"}
//                       {triggerType === "FIRST_MESSAGE" && "When someone sends their first message"}
//                       {triggerType === "KEYWORD" && `When message contains: ${keywords || "keywords"}`}
//                       {triggerType === "STORY_REPLY" && "When someone replies to a story"}
//                       {triggerType === "COMMENT" && "When someone comments on a post"}
//                       {triggerType === "MENTION" && "When mentioned in a story"}
//                       {triggerType === "HAS_TAG" && "When conversation has specific tag"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Arrow */}
//               {actions.length > 0 && (
//                 <div className="flex justify-center">
//                   <ArrowDown className="h-6 w-6 text-muted-foreground" />
//                 </div>
//               )}

//               {/* Action Nodes */}
//               {actions.map((action, index) => {
//                 const Icon = getActionIcon(action.type)
//                 return (
//                   <div key={action.id}>
//                     <Card className="border-2">
//                       <CardHeader className="pb-3">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
//                             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
//                               <Icon className="h-4 w-4" />
//                             </div>
//                             <div>
//                               <p className="font-semibold">{getActionLabel(action.type)}</p>
//                               <Badge variant="outline" className="text-xs">
//                                 Step {index + 1}
//                               </Badge>
//                             </div>
//                           </div>
//                           <Button variant="ghost" size="icon" onClick={() => removeAction(action.id)}>
//                             <Trash2 className="h-4 w-4 text-destructive" />
//                           </Button>
//                         </div>
//                       </CardHeader>
//                       <CardContent className="space-y-3">
//                         {action.type === "SEND_MESSAGE" && (
//                           <div className="space-y-2">
//                             <Label>Message</Label>
//                             <Textarea
//                               placeholder="Enter your message... Use {name}, {username} for personalization"
//                               value={action.content.message || ""}
//                               onChange={(e) => updateAction(action.id, { message: e.target.value })}
//                               rows={3}
//                             />
//                             <p className="text-xs text-muted-foreground">
//                               Variables: {"{name}"}, {"{username}"}, {"{businessName}"}
//                             </p>
//                           </div>
//                         )}

//                         {action.type === "AI_RESPONSE" && (
//                           <div className="space-y-3">
//                             <div className="rounded-lg bg-primary/10 p-3 border border-primary/20">
//                               <div className="flex items-start gap-2">
//                                 <Sparkles className="h-5 w-5 text-primary mt-0.5" />
//                                 <div>
//                                   <p className="text-sm font-medium">AI-Powered Response</p>
//                                   <p className="text-xs text-muted-foreground mt-1">
//                                     AI will generate a personalized response based on your business description and
//                                     conversation context. Configure AI settings in Settings.
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="space-y-2">
//                               <Label>Custom Instructions (Optional)</Label>
//                               <Textarea
//                                 placeholder="Additional context for this specific response..."
//                                 value={action.content.customInstructions || ""}
//                                 onChange={(e) => updateAction(action.id, { customInstructions: e.target.value })}
//                                 rows={2}
//                               />
//                             </div>
//                           </div>
//                         )}

//                         {action.type === "ADD_TAG" && (
//                           <div className="space-y-2">
//                             <Label>Tag Name</Label>
//                             <Input
//                               placeholder="e.g., New Lead"
//                               value={action.content.tagName || ""}
//                               onChange={(e) => updateAction(action.id, { tagName: e.target.value })}
//                             />
//                           </div>
//                         )}

//                         {action.type === "REMOVE_TAG" && (
//                           <div className="space-y-2">
//                             <Label>Tag Name to Remove</Label>
//                             <Input
//                               placeholder="e.g., Pending"
//                               value={action.content.tagName || ""}
//                               onChange={(e) => updateAction(action.id, { tagName: e.target.value })}
//                             />
//                           </div>
//                         )}

//                         {action.type === "DELAY" && (
//                           <div className="space-y-2">
//                             <Label>Delay Duration</Label>
//                             <div className="flex gap-2">
//                               <Input
//                                 type="number"
//                                 placeholder="5"
//                                 min="1"
//                                 value={action.content.delayAmount || ""}
//                                 onChange={(e) => updateAction(action.id, { delayAmount: e.target.value })}
//                               />
//                               <Select
//                                 value={action.content.delayUnit || "minutes"}
//                                 onValueChange={(value) => updateAction(action.id, { delayUnit: value })}
//                               >
//                                 <SelectTrigger className="w-32">
//                                   <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectItem value="seconds">Seconds</SelectItem>
//                                   <SelectItem value="minutes">Minutes</SelectItem>
//                                   <SelectItem value="hours">Hours</SelectItem>
//                                   <SelectItem value="days">Days</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                           </div>
//                         )}

//                         {action.type === "WEBHOOK" && (
//                           <div className="space-y-2">
//                             <Label>Webhook URL</Label>
//                             <Input
//                               type="url"
//                               placeholder="https://your-webhook.com/endpoint"
//                               value={action.content.webhookUrl || ""}
//                               onChange={(e) => updateAction(action.id, { webhookUrl: e.target.value })}
//                             />
//                             <p className="text-xs text-muted-foreground">
//                               Conversation data will be sent via POST request
//                             </p>
//                           </div>
//                         )}

//                         {action.type === "SEND_TO_HUMAN" && (
//                           <div className="space-y-2">
//                             <div className="rounded-lg bg-muted p-3">
//                               <p className="text-sm text-muted-foreground">
//                                 This conversation will be marked for human review and appear in your inbox
//                               </p>
//                             </div>
//                             <Label>Handoff Reason (Optional)</Label>
//                             <Input
//                               placeholder="e.g., Complex question"
//                               value={action.content.reason || ""}
//                               onChange={(e) => updateAction(action.id, { reason: e.target.value })}
//                             />
//                           </div>
//                         )}
//                       </CardContent>
//                     </Card>

//                     {/* Arrow between actions */}
//                     {index < actions.length - 1 && (
//                       <div className="flex justify-center py-2">
//                         <ArrowDown className="h-6 w-6 text-muted-foreground" />
//                       </div>
//                     )}
//                   </div>
//                 )
//               })}

//               {/* Empty State */}
//               {actions.length === 0 && (
//                 <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12">
//                   <Plus className="h-8 w-8 text-muted-foreground" />
//                   <p className="mt-2 text-sm text-muted-foreground">Add actions from the left panel</p>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { createAutomation, updateAutomation } from "@/lib/actions/automation-actions"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"
// import {
//   MessageSquare,
//   Tag,
//   Clock,
//   GitBranch,
//   User,
//   Webhook,
//   Sparkles,
//   Trash2,
//   Save,
//   Eye,
//   Bot,
//   Hash,
//   ImageIcon,
//   AtSign,
//   Send,
//   Timer,
//   Link2,
//   Target,
// } from "lucide-react"

// interface InstagramAccount {
//   id: string
//   username: string
//   profilePicUrl?: string | null
//   followerCount?: number | null
//   isConnected?: boolean
// }

// interface AutomationData {
//   id?: string
//   name: string
//   description?: string | null
//   instagramAccountId?: string | null
//   triggers: Array<{
//     type: string
//     conditions: any
//   }>
//   actions: Array<{
//     id: string
//     type: string
//     order: number
//     content: any
//   }>
// }

// interface AutomationBuilderProps {
//   automation?: AutomationData | null
//   instagramAccounts: InstagramAccount[]
// }

// type TriggerType = "dm" | "story_reply" | "comment" | "mention" | "keyword" | "first_message"
// type ActionType = "send_message" | "ai_response" | "add_tag" | "delay" | "condition" | "send_to_human" | "webhook"

// interface ActionNode {
//   id: string
//   type: ActionType
//   order: number
//   config: any
//   isConfigured: boolean
// }

// const TRIGGERS = [
//   { id: "dm", label: "Direct Message", icon: MessageSquare, description: "Any DM received" },
//   { id: "story_reply", label: "Story Reply", icon: ImageIcon, description: "Reply to your story" },
//   { id: "comment", label: "Comment", icon: Hash, description: "Comment on posts" },
//   { id: "mention", label: "Mention", icon: AtSign, description: "Tagged in story/post" },
//   { id: "keyword", label: "Keyword", icon: Target, description: "Specific words detected" },
//   { id: "first_message", label: "First Message", icon: Sparkles, description: "New conversation" },
// ]

// const ACTIONS = [
//   { id: "send_message", label: "Send Message", icon: Send, description: "Send a text response" },
//   { id: "ai_response", label: "AI Response", icon: Bot, description: "AI-generated reply" },
//   { id: "add_tag", label: "Add Tag", icon: Tag, description: "Organize contacts" },
//   { id: "delay", label: "Wait", icon: Timer, description: "Add time delay" },
//   { id: "condition", label: "Condition", icon: GitBranch, description: "If/then logic" },
//   { id: "send_to_human", label: "Human Handoff", icon: User, description: "Route to team" },
//   { id: "webhook", label: "Webhook", icon: Link2, description: "External integration" },
// ]

// const TEMPLATES = [
//   {
//     id: "welcome",
//     name: "Welcome Message",
//     icon: "👋",
//     category: "Popular",
//     trigger: "first_message",
//     actions: [
//       { type: "send_message", config: { message: "Hi {name}! Thanks for reaching out. How can I help you today?" } },
//       { type: "add_tag", config: { tag: "New Lead" } },
//     ],
//   },
//   {
//     id: "faq",
//     name: "FAQ Responder",
//     icon: "❓",
//     category: "Popular",
//     trigger: "keyword",
//     actions: [
//       { type: "condition", config: { field: "message", operator: "contains", value: "price" } },
//       { type: "send_message", config: { message: "Our pricing starts at $99/month. Check our website for details!" } },
//     ],
//   },
//   {
//     id: "story_engage",
//     name: "Story Engagement",
//     icon: "📸",
//     category: "Engagement",
//     trigger: "story_reply",
//     actions: [
//       { type: "send_message", config: { message: "Thanks for your reply! 🙌" } },
//       { type: "add_tag", config: { tag: "Story Engaged" } },
//     ],
//   },
//   {
//     id: "lead_qualify",
//     name: "Lead Qualifier",
//     icon: "🎯",
//     category: "Sales",
//     trigger: "dm",
//     actions: [
//       { type: "ai_response", config: { instructions: "Ask qualifying questions about their needs and budget" } },
//       { type: "delay", config: { amount: 2, unit: "hours" } },
//       { type: "send_to_human", config: { reason: "Qualified lead ready for sales team" } },
//     ],
//   },
// ]

// const actionTypes = [
//   {
//     type: "send_message" as ActionType,
//     label: "Send Message",
//     icon: MessageSquare,
//     description: "Send a predefined message",
//   },
//   {
//     type: "ai_response" as ActionType,
//     label: "AI Response",
//     icon: Sparkles,
//     description: "Generate intelligent AI responses",
//   },
//   {
//     type: "add_tag" as ActionType,
//     label: "Add Tag",
//     icon: Tag,
//     description: "Tag the conversation",
//   },
//   {
//     type: "delay" as ActionType,
//     label: "Delay",
//     icon: Clock,
//     description: "Wait before next action",
//   },
//   {
//     type: "condition" as ActionType,
//     label: "Condition",
//     icon: GitBranch,
//     description: "Branch based on conditions",
//   },
//   {
//     type: "send_to_human" as ActionType,
//     label: "Send to Human",
//     icon: User,
//     description: "Escalate to human agent",
//   },
//   {
//     type: "webhook" as ActionType,
//     label: "Webhook",
//     icon: Webhook,
//     description: "Send data to external service",
//   },
// ]

// const triggerTypes = [
//   { value: "dm" as TriggerType, label: "New DM", description: "When someone sends a direct message" },
//   { value: "story_reply" as TriggerType, label: "Story Reply", description: "When someone replies to your story" },
//   { value: "comment" as TriggerType, label: "New Comment", description: "When someone comments on your post" },
//   { value: "mention" as TriggerType, label: "Mention", description: "When someone mentions you" },
//   { value: "keyword" as TriggerType, label: "Keyword", description: "When specific keywords are detected" },
//   {
//     value: "first_message" as TriggerType,
//     label: "First Message",
//     description: "When someone messages for the first time",
//   },
// ]

// export function AutomationBuilder({ automation, instagramAccounts }: AutomationBuilderProps) {
//   const router = useRouter()
//   const [automationName, setAutomationName] = useState(automation?.name || "My Automation")
//   const [automationDescription, setAutomationDescription] = useState(automation?.description || "")
//   const [selectedAccount, setSelectedAccount] = useState<string>(automation?.instagramAccountId || "")
//   const [selectedTrigger, setSelectedTrigger] = useState<TriggerType>(
//     (automation?.triggers[0]?.type as TriggerType) || "dm",
//   )
//   const [triggerConfig, setTriggerConfig] = useState<any>(automation?.triggers[0]?.conditions || { keywords: [] })
//   const [actions, setActions] = useState<ActionNode[]>([])
//   const [selectedAction, setSelectedAction] = useState<string | null>(null)
//   const [showTemplates, setShowTemplates] = useState(false)
//   const [showPreview, setShowPreview] = useState(false)
//   const [isSaving, setIsSaving] = useState(false)

//   useEffect(() => {
//     if (automation?.actions && automation.actions.length > 0) {
//       const mappedActions = automation.actions.map((action) => ({
//         id: action.id,
//         type: action.type as ActionType,
//         order: action.order,
//         config: action.content,
//         isConfigured: true,
//       }))
//       setActions(mappedActions)
//     }
//   }, [automation])

//   const addAction = (type: ActionType) => {
//     const newAction: ActionNode = {
//       id: `action-${Date.now()}`,
//       type,
//       order: actions.length,
//       config: {},
//       isConfigured: false,
//     }
//     setActions([...actions, newAction])
//     setSelectedAction(newAction.id)
//   }

//   const removeAction = (id: string) => {
//     setActions(actions.filter((a) => a.id !== id).map((a, i) => ({ ...a, order: i })))
//     if (selectedAction === id) setSelectedAction(null)
//   }

//   const updateActionConfig = (id: string, config: any) => {
//     setActions(actions.map((a) => (a.id === id ? { ...a, config, isConfigured: true } : a)))
//   }

//   const handleSave = async () => {
//     if (!automationName.trim()) {
//       toast.error("Please enter an automation name")
//       return
//     }

//     if (actions.length === 0) {
//       toast.error("Please add at least one action")
//       return
//     }

//     const hasUnconfigured = actions.some((a) => !a.isConfigured)
//     if (hasUnconfigured) {
//       toast.error("Please configure all actions before saving")
//       return
//     }

//     setIsSaving(true)

//     try {
//       const automationData = {
//         name: automationName,
//         description: automationDescription,
//         instagramAccountId: selectedAccount || undefined,
//         triggerType: selectedTrigger,
//         triggerConditions: triggerConfig,
//         actions: actions.map((a) => ({
//           type: a.type,
//           content: a.config,
//           order: a.order,
//         })),
//       }

//       if (automation?.id) {
//         await updateAutomation(automation.id, automationData)
//         toast.success("Automation updated successfully!")
//       } else {
//         await createAutomation(automationData)
//         toast.success("Automation created successfully!")
//       }

//       router.push("/automations")
//     } catch (error) {
//       console.error("Failed to save automation:", error)
//       toast.error("Failed to save automation")
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const renderActionConfig = (action: ActionNode) => {
//     switch (action.type) {
//       case "send_message":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Message Template</Label>
//               <Textarea
//                 placeholder="Enter your message template..."
//                 value={action.config.message || ""}
//                 onChange={(e) => updateActionConfig(action.id, { ...action.config, message: e.target.value })}
//                 className="min-h-[120px] bg-background"
//               />
//               <p className="text-xs text-muted-foreground">
//                 Use variables like {"{username}"}, {"{first_name}"} to personalize
//               </p>
//             </div>
//           </div>
//         )

//       case "ai_response":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>AI Instructions</Label>
//               <Textarea
//                 placeholder="Tell the AI how to respond..."
//                 value={action.config.instructions || ""}
//                 onChange={(e) => updateActionConfig(action.id, { ...action.config, instructions: e.target.value })}
//                 className="min-h-[120px] bg-background"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Tone</Label>
//               <Select
//                 value={action.config.tone || "friendly"}
//                 onValueChange={(value) => updateActionConfig(action.id, { ...action.config, tone: value })}
//               >
//                 <SelectTrigger className="bg-background">
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

//       case "add_tag":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Tag Name</Label>
//               <Input
//                 placeholder="e.g., interested, follow-up"
//                 value={action.config.tag || ""}
//                 onChange={(e) => updateActionConfig(action.id, { ...action.config, tag: e.target.value })}
//                 className="bg-background"
//               />
//             </div>
//           </div>
//         )

//       case "delay":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Delay Duration</Label>
//               <div className="flex gap-2">
//                 <Input
//                   type="number"
//                   placeholder="5"
//                   value={action.config.duration || ""}
//                   onChange={(e) => updateActionConfig(action.id, { ...action.config, duration: e.target.value })}
//                   className="bg-background"
//                 />
//                 <Select
//                   value={action.config.unit || "minutes"}
//                   onValueChange={(value) => updateActionConfig(action.id, { ...action.config, unit: value })}
//                 >
//                   <SelectTrigger className="w-32 bg-background">
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

//       case "condition":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Condition Type</Label>
//               <Select
//                 value={action.config.conditionType || "contains"}
//                 onValueChange={(value) => updateActionConfig(action.id, { ...action.config, conditionType: value })}
//               >
//                 <SelectTrigger className="bg-background">
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
//                 value={action.config.value || ""}
//                 onChange={(e) => updateActionConfig(action.id, { ...action.config, value: e.target.value })}
//                 className="bg-background"
//               />
//             </div>
//           </div>
//         )

//       case "send_to_human":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Note for Human Agent</Label>
//               <Textarea
//                 placeholder="Add context for the human agent..."
//                 value={action.config.note || ""}
//                 onChange={(e) => updateActionConfig(action.id, { ...action.config, note: e.target.value })}
//                 className="min-h-[100px] bg-background"
//               />
//             </div>
//           </div>
//         )

//       case "webhook":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Webhook URL</Label>
//               <Input
//                 type="url"
//                 placeholder="https://example.com/webhook"
//                 value={action.config.url || ""}
//                 onChange={(e) => updateActionConfig(action.id, { ...action.config, url: e.target.value })}
//                 className="bg-background"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Method</Label>
//               <Select
//                 value={action.config.method || "POST"}
//                 onValueChange={(value) => updateActionConfig(action.id, { ...action.config, method: value })}
//               >
//                 <SelectTrigger className="bg-background">
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

//   return (
//     <div className="space-y-6">
//       <Card className="border-border bg-card shadow-lg">
//         <div className="border-b border-border bg-muted/30 px-6 py-4">
//           <h2 className="text-lg font-semibold text-foreground">Automation Details</h2>
//         </div>
//         <div className="space-y-6 p-6">
//           <div className="space-y-2">
//             <Label htmlFor="name">Automation Name</Label>
//             <Input
//               id="name"
//               placeholder="Enter automation name"
//               value={automationName}
//               onChange={(e) => setAutomationName(e.target.value)}
//               className="bg-background shadow-sm"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description">Description (optional)</Label>
//             <Textarea
//               id="description"
//               placeholder="Describe what this automation does..."
//               value={automationDescription}
//               onChange={(e) => setAutomationDescription(e.target.value)}
//               className="min-h-[80px] bg-background shadow-sm"
//             />
//           </div>

//           {instagramAccounts.length > 0 && (
//             <div className="space-y-2">
//               <Label htmlFor="account">Instagram Account</Label>
//               <Select value={selectedAccount} onValueChange={setSelectedAccount}>
//                 <SelectTrigger id="account" className="bg-background shadow-sm">
//                   <SelectValue placeholder="Select an account" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {instagramAccounts.map((account) => (
//                     <SelectItem key={account.id} value={account.id}>
//                       <div className="flex items-center gap-2">
//                         <span>@{account.username}</span>
//                         {account.followerCount && (
//                           <span className="text-xs text-muted-foreground">
//                             ({account.followerCount.toLocaleString()} followers)
//                           </span>
//                         )}
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}
//         </div>
//       </Card>

//       <Card className="border-border bg-card shadow-lg">
//         <div className="border-b border-border bg-muted/30 px-6 py-4">
//           <h2 className="text-lg font-semibold text-foreground">Trigger</h2>
//           <p className="text-sm text-muted-foreground">When should this automation run?</p>
//         </div>
//         <div className="space-y-4 p-6">
//           <div className="space-y-2">
//             <Label>Trigger Type</Label>
//             <Select value={selectedTrigger} onValueChange={(v) => setSelectedTrigger(v as TriggerType)}>
//               <SelectTrigger className="bg-background shadow-sm">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {triggerTypes.map((trigger) => (
//                   <SelectItem key={trigger.value} value={trigger.value}>
//                     <div className="space-y-0.5">
//                       <div className="font-medium">{trigger.label}</div>
//                       <div className="text-xs text-muted-foreground">{trigger.description}</div>
//                     </div>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {selectedTrigger === "keyword" && (
//             <div className="space-y-2">
//               <Label>Keywords (comma separated)</Label>
//               <Input
//                 placeholder="pricing, demo, help"
//                 value={(triggerConfig.keywords || []).join(", ")}
//                 onChange={(e) =>
//                   setTriggerConfig({
//                     keywords: e.target.value.split(",").map((k) => k.trim()),
//                   })
//                 }
//                 className="bg-background shadow-sm"
//               />
//             </div>
//           )}
//         </div>
//       </Card>

//       <Card className="border-border bg-card shadow-lg">
//         <div className="border-b border-border bg-muted/30 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-semibold text-foreground">Actions</h2>
//               <p className="text-sm text-muted-foreground">What should happen when triggered?</p>
//             </div>
//           </div>
//         </div>
//         <div className="p-6 space-y-4">
//           {actions.length === 0 ? (
//             <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-12 text-center">
//               <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
//               <h3 className="mt-4 text-lg font-medium text-foreground">No actions yet</h3>
//               <p className="mt-2 text-sm text-muted-foreground">Add your first action to get started</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {actions.map((action, index) => {
//                 const ActionIcon = actionTypes.find((t) => t.type === action.type)?.icon || MessageSquare
//                 return (
//                   <div
//                     key={action.id}
//                     className="group rounded-lg border border-border bg-background p-4 shadow-sm hover:shadow-md transition-all"
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-start gap-3 flex-1">
//                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
//                           <ActionIcon className="h-4 w-4 text-primary" />
//                         </div>
//                         <div className="flex-1 space-y-1">
//                           <div className="flex items-center gap-2">
//                             <h4 className="font-medium text-foreground">
//                               {actionTypes.find((t) => t.type === action.type)?.label}
//                             </h4>
//                             {action.isConfigured && (
//                               <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
//                                 Configured
//                               </Badge>
//                             )}
//                           </div>
//                           <p className="text-sm text-muted-foreground">
//                             {actionTypes.find((t) => t.type === action.type)?.description}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => setSelectedAction(action.id)}
//                           className="shadow-sm hover:shadow-md transition-all"
//                         >
//                           Configure
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeAction(action.id)}
//                           className="text-destructive hover:bg-destructive/10 shadow-sm hover:shadow-md transition-all"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           )}

//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-4">
//             {actionTypes.map((actionType) => {
//               const Icon = actionType.icon
//               return (
//                 <Button
//                   key={actionType.type}
//                   variant="outline"
//                   onClick={() => addAction(actionType.type)}
//                   className="h-auto flex-col gap-2 py-4 shadow-md hover:shadow-lg transition-all"
//                 >
//                   <Icon className="h-5 w-5" />
//                   <span className="text-xs font-medium">{actionType.label}</span>
//                 </Button>
//               )
//             })}
//           </div>
//         </div>
//       </Card>

//       <div className="flex items-center justify-between gap-4 sticky bottom-6 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-xl">
//         <Button
//           variant="outline"
//           onClick={() => router.push("/automations")}
//           className="shadow-md hover:shadow-lg transition-all"
//         >
//           Cancel
//         </Button>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             onClick={() => setShowPreview(true)}
//             className="gap-2 shadow-md hover:shadow-lg transition-all"
//           >
//             <Eye className="h-4 w-4" />
//             Preview
//           </Button>
//           <Button onClick={handleSave} disabled={isSaving} className="gap-2 shadow-lg hover:shadow-xl transition-all">
//             <Save className="h-4 w-4" />
//             {isSaving ? "Saving..." : automation?.id ? "Update" : "Create"} Automation
//           </Button>
//         </div>
//       </div>

//       <Dialog open={selectedAction !== null} onOpenChange={() => setSelectedAction(null)}>
//         <DialogContent className="sm:max-w-[500px] bg-card border-border">
//           <DialogHeader>
//             <DialogTitle>
//               Configure{" "}
//               {selectedAction
//                 ? actionTypes.find((t) => t.type === actions.find((a) => a.id === selectedAction)?.type)?.label
//                 : ""}
//             </DialogTitle>
//             <DialogDescription>Customize the action settings below</DialogDescription>
//           </DialogHeader>
//           {selectedAction && (
//             <div className="space-y-4">
//               {renderActionConfig(actions.find((a) => a.id === selectedAction)!)}
//               <div className="flex justify-end gap-2 pt-4">
//                 <Button
//                   variant="outline"
//                   onClick={() => setSelectedAction(null)}
//                   className="shadow-md hover:shadow-lg transition-all"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     const action = actions.find((a) => a.id === selectedAction)
//                     if (action && Object.keys(action.config).length > 0) {
//                       setSelectedAction(null)
//                     }
//                   }}
//                   className="shadow-lg hover:shadow-xl transition-all"
//                 >
//                   Save Configuration
//                 </Button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       <Dialog open={showPreview} onOpenChange={setShowPreview}>
//         <DialogContent className="sm:max-w-[600px] bg-card border-border">
//           <DialogHeader>
//             <DialogTitle>Automation Preview</DialogTitle>
//             <DialogDescription>Review your automation workflow</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="rounded-lg bg-muted/50 p-4 space-y-2">
//               <h3 className="font-semibold text-foreground">{automationName}</h3>
//               {automationDescription && <p className="text-sm text-muted-foreground">{automationDescription}</p>}
//             </div>
//             <div className="space-y-2">
//               <h4 className="text-sm font-medium text-foreground">Trigger</h4>
//               <div className="rounded-lg border border-border bg-background p-3">
//                 <p className="text-sm">{triggerTypes.find((t) => t.value === selectedTrigger)?.label}</p>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <h4 className="text-sm font-medium text-foreground">Actions ({actions.length})</h4>
//               <div className="space-y-2">
//                 {actions.map((action, index) => {
//                   const ActionIcon = actionTypes.find((t) => t.type === action.type)?.icon || MessageSquare
//                   return (
//                     <div
//                       key={action.id}
//                       className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
//                     >
//                       <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
//                         <ActionIcon className="h-3 w-3 text-primary" />
//                       </div>
//                       <span className="text-sm">{actionTypes.find((t) => t.type === action.type)?.label}</span>
//                     </div>
//                   )
//                 })}
//               </div>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { createAutomation, updateAutomation } from "@/lib/actions/automation-actions"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"
// import {
//   MessageSquare,
//   Tag,
//   Clock,
//   GitBranch,
//   User,
//   Webhook,
//   Sparkles,
//   Trash2,
//   Save,
//   Eye,
//   Bot,
//   Hash,
//   ImageIcon,
//   AtSign,
//   Send,
//   Timer,
//   Link2,
//   Target,
// } from "lucide-react"

// interface InstagramAccount {
//   id: string
//   username: string
//   profilePicUrl?: string | null
//   followerCount?: number | null
//   isConnected?: boolean
// }

// interface AutomationData {
//   id?: string
//   name: string
//   description?: string | null
//   instagramAccountId?: string | null
//   triggers: Array<{
//     type: string
//     conditions: any
//   }>
//   actions: Array<{
//     id: string
//     type: string
//     order: number
//     content: any
//   }>
// }

// interface AutomationBuilderProps {
//   automation?: AutomationData | null
//   instagramAccounts: InstagramAccount[]
// }

// type TriggerType = "dm" | "story_reply" | "comment" | "mention" | "keyword" | "first_message"
// type ActionType = "send_message" | "ai_response" | "add_tag" | "delay" | "condition" | "send_to_human" | "webhook"

// interface ActionNode {
//   id: string
//   type: ActionType
//   order: number
//   config: any
//   isConfigured: boolean
// }

// const TRIGGERS = [
//   { id: "dm", label: "Direct Message", icon: MessageSquare, description: "Any DM received" },
//   { id: "story_reply", label: "Story Reply", icon: ImageIcon, description: "Reply to your story" },
//   { id: "comment", label: "Comment", icon: Hash, description: "Comment on posts" },
//   { id: "mention", label: "Mention", icon: AtSign, description: "Tagged in story/post" },
//   { id: "keyword", label: "Keyword", icon: Target, description: "Specific words detected" },
//   { id: "first_message", label: "First Message", icon: Sparkles, description: "New conversation" },
// ]

// const ACTIONS = [
//   { id: "send_message", label: "Send Message", icon: Send, description: "Send a text response" },
//   { id: "ai_response", label: "AI Response", icon: Bot, description: "AI-generated reply" },
//   { id: "add_tag", label: "Add Tag", icon: Tag, description: "Organize contacts" },
//   { id: "delay", label: "Wait", icon: Timer, description: "Add time delay" },
//   { id: "condition", label: "Condition", icon: GitBranch, description: "If/then logic" },
//   { id: "send_to_human", label: "Human Handoff", icon: User, description: "Route to team" },
//   { id: "webhook", label: "Webhook", icon: Link2, description: "External integration" },
// ]

// const TEMPLATES = [
//   {
//     id: "welcome",
//     name: "Welcome Message",
//     icon: "👋",
//     category: "Popular",
//     trigger: "first_message",
//     actions: [
//       { type: "send_message", config: { message: "Hi {name}! Thanks for reaching out. How can I help you today?" } },
//       { type: "add_tag", config: { tag: "New Lead" } },
//     ],
//   },
//   {
//     id: "faq",
//     name: "FAQ Responder",
//     icon: "❓",
//     category: "Popular",
//     trigger: "keyword",
//     actions: [
//       { type: "condition", config: { field: "message", operator: "contains", value: "price" } },
//       { type: "send_message", config: { message: "Our pricing starts at $99/month. Check our website for details!" } },
//     ],
//   },
//   {
//     id: "story_engage",
//     name: "Story Engagement",
//     icon: "📸",
//     category: "Engagement",
//     trigger: "story_reply",
//     actions: [
//       { type: "send_message", config: { message: "Thanks for your reply! 🙌" } },
//       { type: "add_tag", config: { tag: "Story Engaged" } },
//     ],
//   },
//   {
//     id: "lead_qualify",
//     name: "Lead Qualifier",
//     icon: "🎯",
//     category: "Sales",
//     trigger: "dm",
//     actions: [
//       { type: "ai_response", config: { instructions: "Ask qualifying questions about their needs and budget" } },
//       { type: "delay", config: { amount: 2, unit: "hours" } },
//       { type: "send_to_human", config: { reason: "Qualified lead ready for sales team" } },
//     ],
//   },
// ]

// const actionTypes = [
//   {
//     type: "send_message" as ActionType,
//     label: "Send Message",
//     icon: MessageSquare,
//     description: "Send a predefined message",
//   },
//   {
//     type: "ai_response" as ActionType,
//     label: "AI Response",
//     icon: Sparkles,
//     description: "Generate intelligent AI responses",
//   },
//   {
//     type: "add_tag" as ActionType,
//     label: "Add Tag",
//     icon: Tag,
//     description: "Tag the conversation",
//   },
//   {
//     type: "delay" as ActionType,
//     label: "Delay",
//     icon: Clock,
//     description: "Wait before next action",
//   },
//   {
//     type: "condition" as ActionType,
//     label: "Condition",
//     icon: GitBranch,
//     description: "Branch based on conditions",
//   },
//   {
//     type: "send_to_human" as ActionType,
//     label: "Send to Human",
//     icon: User,
//     description: "Escalate to human agent",
//   },
//   {
//     type: "webhook" as ActionType,
//     label: "Webhook",
//     icon: Webhook,
//     description: "Send data to external service",
//   },
// ]

// const triggerTypes = [
//   { value: "dm" as TriggerType, label: "New DM", description: "When someone sends a direct message" },
//   { value: "story_reply" as TriggerType, label: "Story Reply", description: "When someone replies to your story" },
//   { value: "comment" as TriggerType, label: "New Comment", description: "When someone comments on your post" },
//   { value: "mention" as TriggerType, label: "Mention", description: "When someone mentions you" },
//   { value: "keyword" as TriggerType, label: "Keyword", description: "When specific keywords are detected" },
//   {
//     value: "first_message" as TriggerType,
//     label: "First Message",
//     description: "When someone messages for the first time",
//   },
// ]

// export function AutomationBuilder({ automation, instagramAccounts }: AutomationBuilderProps) {
//   const router = useRouter()
//   const [automationName, setAutomationName] = useState(automation?.name || "My Automation")
//   const [automationDescription, setAutomationDescription] = useState(automation?.description || "")
//   const [selectedAccount, setSelectedAccount] = useState<string>(automation?.instagramAccountId || "")
//   const [selectedTrigger, setSelectedTrigger] = useState<TriggerType>(
//     (automation?.triggers[0]?.type as TriggerType) || "dm",
//   )
//   const [triggerConfig, setTriggerConfig] = useState<any>(automation?.triggers[0]?.conditions || { keywords: [] })
//   const [actions, setActions] = useState<ActionNode[]>([])
//   const [selectedAction, setSelectedAction] = useState<string | null>(null)
//   const [showTemplates, setShowTemplates] = useState(false)
//   const [showPreview, setShowPreview] = useState(false)
//   const [isSaving, setIsSaving] = useState(false)

//   useEffect(() => {
//     if (automation?.actions && automation.actions.length > 0) {
//       const mappedActions = automation.actions.map((action) => ({
//         id: action.id,
//         type: action.type as ActionType,
//         order: action.order,
//         config: action.content,
//         isConfigured: true,
//       }))
//       setActions(mappedActions)
//     }
//   }, [automation])

//   const addAction = (type: ActionType) => {
//     const newAction: ActionNode = {
//       id: `action-${Date.now()}`,
//       type,
//       order: actions.length,
//       config: {},
//       isConfigured: false,
//     }
//     setActions([...actions, newAction])
//     setSelectedAction(newAction.id)
//   }

//   const removeAction = (id: string) => {
//     setActions(actions.filter((a) => a.id !== id).map((a, i) => ({ ...a, order: i })))
//     if (selectedAction === id) setSelectedAction(null)
//   }

//   const updateActionConfig = (id: string, config: any) => {
//     setActions(actions.map((a) => (a.id === id ? { ...a, config, isConfigured: true } : a)))
//   }

//   const handleSave = async () => {
//     if (!automationName.trim()) {
//       toast.error("Please enter an automation name")
//       return
//     }

//     if (actions.length === 0) {
//       toast.error("Please add at least one action")
//       return
//     }

//     const hasUnconfigured = actions.some((a) => !a.isConfigured)
//     if (hasUnconfigured) {
//       toast.error("Please configure all actions before saving")
//       return
//     }

//     setIsSaving(true)

//     try {
//       const automationData = {
//         name: automationName,
//         description: automationDescription,
//         instagramAccountId: selectedAccount || undefined,
//         triggerType: selectedTrigger,
//         triggerConditions: triggerConfig,
//         actions: actions.map((a) => ({
//           type: a.type,
//           content: a.config,
//           order: a.order,
//         })),
//       }

//       if (automation?.id) {
//         await updateAutomation(automation.id, automationData)
//         toast.success("Automation updated successfully!")
//       } else {
//         await createAutomation(automationData)
//         toast.success("Automation created successfully!")
//       }

//       router.push("/automations")
//     } catch (error) {
//       console.error("Failed to save automation:", error)
//       toast.error("Failed to save automation")
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const renderActionConfig = (action: ActionNode) => {
//     switch (action.type) {
//       case "send_message":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Message Template</Label>
//               <Textarea
//                 placeholder="Enter your message template..."
//                 value={action.config.message || ""}
//                 onChange={(e) => updateActionConfig(action.id, { ...action.config, message: e.target.value })}
//                 className="min-h-[120px] bg-background"
//               />
//               <p className="text-xs text-muted-foreground">
//                 Use variables like {"{username}"}, {"{first_name}"} to personalize
//               </p>
//             </div>
//           </div>
//         )

//       case "ai_response":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>AI Instructions</Label>
//               <Textarea
//                 placeholder="Tell the AI how to respond..."
//                 value={action.config.instructions || ""}
//                 onChange={(e) => updateActionConfig(action.id, { ...action.config, instructions: e.target.value })}
//                 className="min-h-[120px] bg-background"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Tone</Label>
//               <Select
//                 value={action.config.tone || "friendly"}
//                 onValueChange={(value) => updateActionConfig(action.id, { ...action.config, tone: value })}
//               >
//                 <SelectTrigger className="bg-background">
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

//       case "add_tag":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Tag Name</Label>
//               <Input
//                 placeholder="e.g., interested, follow-up"
//                 value={action.config.tag || ""}
//                 onChange={(e) => updateActionConfig(action.id, { ...action.config, tag: e.target.value })}
//                 className="bg-background"
//               />
//             </div>
//           </div>
//         )

//       case "delay":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Delay Duration</Label>
//               <div className="flex gap-2">
//                 <Input
//                   type="number"
//                   placeholder="5"
//                   value={action.config.duration || ""}
//                   onChange={(e) => updateActionConfig(action.id, { ...action.config, duration: e.target.value })}
//                   className="bg-background"
//                 />
//                 <Select
//                   value={action.config.unit || "minutes"}
//                   onValueChange={(value) => updateActionConfig(action.id, { ...action.config, unit: value })}
//                 >
//                   <SelectTrigger className="w-32 bg-background">
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

//       case "condition":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Condition Type</Label>
//               <Select
//                 value={action.config.conditionType || "contains"}
//                 onValueChange={(value) => updateActionConfig(action.id, { ...action.config, conditionType: value })}
//               >
//                 <SelectTrigger className="bg-background">
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
//                 value={action.config.value || ""}
//                 onChange={(e) => updateActionConfig(action.id, { ...action.config, value: e.target.value })}
//                 className="bg-background"
//               />
//             </div>
//           </div>
//         )

//       case "send_to_human":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Note for Human Agent</Label>
//               <Textarea
//                 placeholder="Add context for the human agent..."
//                 value={action.config.note || ""}
//                 onChange={(e) => updateActionConfig(action.id, { ...action.config, note: e.target.value })}
//                 className="min-h-[100px] bg-background"
//               />
//             </div>
//           </div>
//         )

//       case "webhook":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Webhook URL</Label>
//               <Input
//                 type="url"
//                 placeholder="https://example.com/webhook"
//                 value={action.config.url || ""}
//                 onChange={(e) => updateActionConfig(action.id, { ...action.config, url: e.target.value })}
//                 className="bg-background"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Method</Label>
//               <Select
//                 value={action.config.method || "POST"}
//                 onValueChange={(value) => updateActionConfig(action.id, { ...action.config, method: value })}
//               >
//                 <SelectTrigger className="bg-background">
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

//   return (
//     <div className="space-y-6">
//       <Card className="border-border bg-card shadow-lg">
//         <div className="border-b border-border bg-muted/30 px-6 py-4">
//           <h2 className="text-lg font-semibold text-foreground">Automation Details</h2>
//         </div>
//         <div className="space-y-6 p-6">
//           <div className="space-y-2">
//             <Label htmlFor="name">Automation Name</Label>
//             <Input
//               id="name"
//               placeholder="Enter automation name"
//               value={automationName}
//               onChange={(e) => setAutomationName(e.target.value)}
//               className="bg-background shadow-sm"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description">Description (optional)</Label>
//             <Textarea
//               id="description"
//               placeholder="Describe what this automation does..."
//               value={automationDescription}
//               onChange={(e) => setAutomationDescription(e.target.value)}
//               className="min-h-[80px] bg-background shadow-sm"
//             />
//           </div>

//           {instagramAccounts.length > 0 && (
//             <div className="space-y-2">
//               <Label htmlFor="account">Instagram Account</Label>
//               <Select value={selectedAccount} onValueChange={setSelectedAccount}>
//                 <SelectTrigger id="account" className="bg-background shadow-sm">
//                   <SelectValue placeholder="Select an account" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {instagramAccounts.map((account) => (
//                     <SelectItem key={account.id} value={account.id}>
//                       <div className="flex items-center gap-2">
//                         <span>@{account.username}</span>
//                         {account.followerCount && (
//                           <span className="text-xs text-muted-foreground">
//                             ({account.followerCount.toLocaleString()} followers)
//                           </span>
//                         )}
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}
//         </div>
//       </Card>

//       <Card className="border-border bg-card shadow-lg">
//         <div className="border-b border-border bg-muted/30 px-6 py-4">
//           <h2 className="text-lg font-semibold text-foreground">Trigger</h2>
//           <p className="text-sm text-muted-foreground">When should this automation run?</p>
//         </div>
//         <div className="space-y-4 p-6">
//           <div className="space-y-2">
//             <Label>Trigger Type</Label>
//             <Select value={selectedTrigger} onValueChange={(v) => setSelectedTrigger(v as TriggerType)}>
//               <SelectTrigger className="bg-background shadow-sm">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {triggerTypes.map((trigger) => (
//                   <SelectItem key={trigger.value} value={trigger.value}>
//                     <div className="space-y-0.5">
//                       <div className="font-medium">{trigger.label}</div>
//                       <div className="text-xs text-muted-foreground">{trigger.description}</div>
//                     </div>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {selectedTrigger === "keyword" && (
//             <div className="space-y-2">
//               <Label>Keywords (comma separated)</Label>
//               <Input
//                 placeholder="pricing, demo, help"
//                 value={(triggerConfig.keywords || []).join(", ")}
//                 onChange={(e) =>
//                   setTriggerConfig({
//                     keywords: e.target.value.split(",").map((k) => k.trim()),
//                   })
//                 }
//                 className="bg-background shadow-sm"
//               />
//             </div>
//           )}
//         </div>
//       </Card>

//       <Card className="border-border bg-card shadow-lg">
//         <div className="border-b border-border bg-muted/30 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-semibold text-foreground">Actions</h2>
//               <p className="text-sm text-muted-foreground">What should happen when triggered?</p>
//             </div>
//           </div>
//         </div>
//         <div className="p-6 space-y-4">
//           {actions.length === 0 ? (
//             <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-12 text-center">
//               <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
//               <h3 className="mt-4 text-lg font-medium text-foreground">No actions yet</h3>
//               <p className="mt-2 text-sm text-muted-foreground">Add your first action to get started</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {actions.map((action, index) => {
//                 const ActionIcon = actionTypes.find((t) => t.type === action.type)?.icon || MessageSquare
//                 return (
//                   <div
//                     key={action.id}
//                     className="group rounded-lg border border-border bg-background p-4 shadow-sm hover:shadow-md transition-all"
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-start gap-3 flex-1">
//                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
//                           <ActionIcon className="h-4 w-4 text-primary" />
//                         </div>
//                         <div className="flex-1 space-y-1">
//                           <div className="flex items-center gap-2">
//                             <h4 className="font-medium text-foreground">
//                               {actionTypes.find((t) => t.type === action.type)?.label}
//                             </h4>
//                             {action.isConfigured && (
//                               <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
//                                 Configured
//                               </Badge>
//                             )}
//                           </div>
//                           <p className="text-sm text-muted-foreground">
//                             {actionTypes.find((t) => t.type === action.type)?.description}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => setSelectedAction(action.id)}
//                           className="shadow-sm hover:shadow-md transition-all"
//                         >
//                           Configure
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeAction(action.id)}
//                           className="text-destructive hover:bg-destructive/10 shadow-sm hover:shadow-md transition-all"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           )}

//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-4">
//             {actionTypes.map((actionType) => {
//               const Icon = actionType.icon
//               return (
//                 <Button
//                   key={actionType.type}
//                   variant="outline"
//                   onClick={() => addAction(actionType.type)}
//                   className="h-auto flex-col gap-2 py-4 shadow-md hover:shadow-lg transition-all"
//                 >
//                   <Icon className="h-5 w-5" />
//                   <span className="text-xs font-medium">{actionType.label}</span>
//                 </Button>
//               )
//             })}
//           </div>
//         </div>
//       </Card>

//       <div className="flex items-center justify-between gap-4 sticky bottom-6 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-xl">
//         <Button
//           variant="outline"
//           onClick={() => router.push("/automations")}
//           className="shadow-md hover:shadow-lg transition-all"
//         >
//           Cancel
//         </Button>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             onClick={() => setShowPreview(true)}
//             className="gap-2 shadow-md hover:shadow-lg transition-all"
//           >
//             <Eye className="h-4 w-4" />
//             Preview
//           </Button>
//           <Button onClick={handleSave} disabled={isSaving} className="gap-2 shadow-lg hover:shadow-xl transition-all">
//             <Save className="h-4 w-4" />
//             {isSaving ? "Saving..." : automation?.id ? "Update" : "Create"} Automation
//           </Button>
//         </div>
//       </div>

//       <Dialog open={selectedAction !== null} onOpenChange={() => setSelectedAction(null)}>
//         <DialogContent className="sm:max-w-[500px] bg-card border-border">
//           <DialogHeader>
//             <DialogTitle>
//               Configure{" "}
//               {selectedAction
//                 ? actionTypes.find((t) => t.type === actions.find((a) => a.id === selectedAction)?.type)?.label
//                 : ""}
//             </DialogTitle>
//             <DialogDescription>Customize the action settings below</DialogDescription>
//           </DialogHeader>
//           {selectedAction && (
//             <div className="space-y-4">
//               {renderActionConfig(actions.find((a) => a.id === selectedAction)!)}
//               <div className="flex justify-end gap-2 pt-4">
//                 <Button
//                   variant="outline"
//                   onClick={() => setSelectedAction(null)}
//                   className="shadow-md hover:shadow-lg transition-all"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     const action = actions.find((a) => a.id === selectedAction)
//                     if (action && Object.keys(action.config).length > 0) {
//                       setSelectedAction(null)
//                     }
//                   }}
//                   className="shadow-lg hover:shadow-xl transition-all"
//                 >
//                   Save Configuration
//                 </Button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       <Dialog open={showPreview} onOpenChange={setShowPreview}>
//         <DialogContent className="sm:max-w-[600px] bg-card border-border">
//           <DialogHeader>
//             <DialogTitle>Automation Preview</DialogTitle>
//             <DialogDescription>Review your automation workflow</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="rounded-lg bg-muted/50 p-4 space-y-2">
//               <h3 className="font-semibold text-foreground">{automationName}</h3>
//               {automationDescription && <p className="text-sm text-muted-foreground">{automationDescription}</p>}
//             </div>
//             <div className="space-y-2">
//               <h4 className="text-sm font-medium text-foreground">Trigger</h4>
//               <div className="rounded-lg border border-border bg-background p-3">
//                 <p className="text-sm">{triggerTypes.find((t) => t.value === selectedTrigger)?.label}</p>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <h4 className="text-sm font-medium text-foreground">Actions ({actions.length})</h4>
//               <div className="space-y-2">
//                 {actions.map((action, index) => {
//                   const ActionIcon = actionTypes.find((t) => t.type === action.type)?.icon || MessageSquare
//                   return (
//                     <div
//                       key={action.id}
//                       className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
//                     >
//                       <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
//                         <ActionIcon className="h-3 w-3 text-primary" />
//                       </div>
//                       <span className="text-sm">{actionTypes.find((t) => t.type === action.type)?.label}</span>
//                     </div>
//                   )
//                 })}
//               </div>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { useNavigation } from "@/hooks/use-navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createAutomation, updateAutomation } from "@/lib/actions/automation-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  MessageSquare,
  Tag,
  Clock,
  GitBranch,
  User,
  Webhook,
  Sparkles,
  Trash2,
  Save,
  Eye,
  Bot,
  Hash,
  ImageIcon,
  AtSign,
  Send,
  Timer,
  Link2,
  Target,
} from "lucide-react"

interface InstagramAccount {
  id: string
  username: string
  profilePicUrl?: string | null
  followerCount?: number | null
  isConnected?: boolean
}

interface AutomationData {
  id?: string
  name: string
  description?: string | null
  instagramAccountId?: string | null
  triggers: Array<{
    type: string
    conditions: any
  }>
  actions: Array<{
    id: string
    type: string
    order: number
    content: any
  }>
}

interface AutomationBuilderProps {
  automation?: AutomationData | null
  instagramAccounts: InstagramAccount[]
}

type TriggerType = "dm" | "story_reply" | "comment" | "mention" | "keyword" | "first_message"
type ActionType = "send_message" | "ai_response" | "add_tag" | "delay" | "condition" | "send_to_human" | "webhook"

interface ActionNode {
  id: string
  type: ActionType
  order: number
  config: any
  isConfigured: boolean
}

const TRIGGERS = [
  { id: "dm", label: "Direct Message", icon: MessageSquare, description: "Any DM received" },
  { id: "story_reply", label: "Story Reply", icon: ImageIcon, description: "Reply to your story" },
  { id: "comment", label: "Comment", icon: Hash, description: "Comment on posts" },
  { id: "mention", label: "Mention", icon: AtSign, description: "Tagged in story/post" },
  { id: "keyword", label: "Keyword", icon: Target, description: "Specific words detected" },
  { id: "first_message", label: "First Message", icon: Sparkles, description: "New conversation" },
]

const ACTIONS = [
  { id: "send_message", label: "Send Message", icon: Send, description: "Send a text response" },
  { id: "ai_response", label: "AI Response", icon: Bot, description: "AI-generated reply" },
  { id: "add_tag", label: "Add Tag", icon: Tag, description: "Organize contacts" },
  { id: "delay", label: "Wait", icon: Timer, description: "Add time delay" },
  { id: "condition", label: "Condition", icon: GitBranch, description: "If/then logic" },
  { id: "send_to_human", label: "Human Handoff", icon: User, description: "Route to team" },
  { id: "webhook", label: "Webhook", icon: Link2, description: "External integration" },
]

const TEMPLATES = [
  {
    id: "welcome",
    name: "Welcome Message",
    icon: "👋",
    category: "Popular",
    trigger: "first_message",
    actions: [
      { type: "send_message", config: { message: "Hi {name}! Thanks for reaching out. How can I help you today?" } },
      { type: "add_tag", config: { tag: "New Lead" } },
    ],
  },
  {
    id: "faq",
    name: "FAQ Responder",
    icon: "❓",
    category: "Popular",
    trigger: "keyword",
    actions: [
      { type: "condition", config: { field: "message", operator: "contains", value: "price" } },
      { type: "send_message", config: { message: "Our pricing starts at $99/month. Check our website for details!" } },
    ],
  },
  {
    id: "story_engage",
    name: "Story Engagement",
    icon: "📸",
    category: "Engagement",
    trigger: "story_reply",
    actions: [
      { type: "send_message", config: { message: "Thanks for your reply! 🙌" } },
      { type: "add_tag", config: { tag: "Story Engaged" } },
    ],
  },
  {
    id: "lead_qualify",
    name: "Lead Qualifier",
    icon: "🎯",
    category: "Sales",
    trigger: "dm",
    actions: [
      { type: "ai_response", config: { instructions: "Ask qualifying questions about their needs and budget" } },
      { type: "delay", config: { amount: 2, unit: "hours" } },
      { type: "send_to_human", config: { reason: "Qualified lead ready for sales team" } },
    ],
  },
]

const actionTypes = [
  {
    type: "send_message" as ActionType,
    label: "Send Message",
    icon: MessageSquare,
    description: "Send a predefined message",
  },
  {
    type: "ai_response" as ActionType,
    label: "AI Response",
    icon: Sparkles,
    description: "Generate intelligent AI responses",
  },
  {
    type: "add_tag" as ActionType,
    label: "Add Tag",
    icon: Tag,
    description: "Tag the conversation",
  },
  {
    type: "delay" as ActionType,
    label: "Delay",
    icon: Clock,
    description: "Wait before next action",
  },
  {
    type: "condition" as ActionType,
    label: "Condition",
    icon: GitBranch,
    description: "Branch based on conditions",
  },
  {
    type: "send_to_human" as ActionType,
    label: "Send to Human",
    icon: User,
    description: "Escalate to human agent",
  },
  {
    type: "webhook" as ActionType,
    label: "Webhook",
    icon: Webhook,
    description: "Send data to external service",
  },
]

const triggerTypes = [
  { value: "dm" as TriggerType, label: "New DM", description: "When someone sends a direct message" },
  { value: "story_reply" as TriggerType, label: "Story Reply", description: "When someone replies to your story" },
  { value: "comment" as TriggerType, label: "New Comment", description: "When someone comments on your post" },
  { value: "mention" as TriggerType, label: "Mention", description: "When someone mentions you" },
  { value: "keyword" as TriggerType, label: "Keyword", description: "When specific keywords are detected" },
  {
    value: "first_message" as TriggerType,
    label: "First Message",
    description: "When someone messages for the first time",
  },
]

export function AutomationBuilder({ automation, instagramAccounts }: AutomationBuilderProps) {
  const router = useRouter()
  const [automationName, setAutomationName] = useState(automation?.name || "My Automation")
  const [automationDescription, setAutomationDescription] = useState(automation?.description || "")
  const [selectedAccount, setSelectedAccount] = useState<string>(automation?.instagramAccountId || "")
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerType>(
    (automation?.triggers[0]?.type as TriggerType) || "dm",
  )
  const [triggerConfig, setTriggerConfig] = useState<any>(automation?.triggers[0]?.conditions || { keywords: [] })
  const [actions, setActions] = useState<ActionNode[]>([])
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { buildHref } = useNavigation()

  useEffect(() => {
    if (automation?.actions && automation.actions.length > 0) {
      const mappedActions = automation.actions.map((action) => ({
        id: action.id,
        type: action.type as ActionType,
        order: action.order,
        config: action.content,
        isConfigured: true,
      }))
      setActions(mappedActions)
    }
  }, [automation])

  const addAction = (type: ActionType) => {
    const newAction: ActionNode = {
      id: `action-${Date.now()}`,
      type,
      order: actions.length,
      config: {},
      isConfigured: false,
    }
    setActions([...actions, newAction])
    setSelectedAction(newAction.id)
  }

  const removeAction = (id: string) => {
    setActions(actions.filter((a) => a.id !== id).map((a, i) => ({ ...a, order: i })))
    if (selectedAction === id) setSelectedAction(null)
  }

  const updateActionConfig = (id: string, config: any) => {
    setActions(actions.map((a) => (a.id === id ? { ...a, config, isConfigured: true } : a)))
  }

  const handleSave = async () => {
    if (!automationName.trim()) {
      toast.error("Please enter an automation name")
      return
    }

    if (actions.length === 0) {
      toast.error("Please add at least one action")
      return
    }

    const hasUnconfigured = actions.some((a) => !a.isConfigured)
    if (hasUnconfigured) {
      toast.error("Please configure all actions before saving")
      return
    }

    setIsSaving(true)

    try {
      const automationData = {
        name: automationName,
        description: automationDescription,
        instagramAccountId: selectedAccount || undefined,
        triggerType: selectedTrigger,
        triggerConditions: triggerConfig,
        actions: actions.map((a) => ({
          type: a.type,
          content: a.config,
          order: a.order,
        })),
      }

      if (automation?.id) {
        await updateAutomation(automation.id, automationData)
        toast.success("Automation updated successfully!")
      } else {
        await createAutomation(automationData)
        toast.success("Automation created successfully!")
      }

      router.push(buildHref("/automations"))
    } catch (error) {
      console.error("Failed to save automation:", error)
      toast.error("Failed to save automation")
    } finally {
      setIsSaving(false)
    }
  }

  const renderActionConfig = (action: ActionNode) => {
    switch (action.type) {
      case "send_message":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Message Template</Label>
              <Textarea
                placeholder="Enter your message template..."
                value={action.config.message || ""}
                onChange={(e) => updateActionConfig(action.id, { ...action.config, message: e.target.value })}
                className="min-h-[120px] bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Use variables like {"{username}"}, {"{first_name}"} to personalize
              </p>
            </div>
          </div>
        )

      case "ai_response":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>AI Instructions</Label>
              <Textarea
                placeholder="Tell the AI how to respond..."
                value={action.config.instructions || ""}
                onChange={(e) => updateActionConfig(action.id, { ...action.config, instructions: e.target.value })}
                className="min-h-[120px] bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select
                value={action.config.tone || "friendly"}
                onValueChange={(value) => updateActionConfig(action.id, { ...action.config, tone: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "add_tag":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tag Name</Label>
              <Input
                placeholder="e.g., interested, follow-up"
                value={action.config.tag || ""}
                onChange={(e) => updateActionConfig(action.id, { ...action.config, tag: e.target.value })}
                className="bg-background"
              />
            </div>
          </div>
        )

      case "delay":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Delay Duration</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="5"
                  value={action.config.duration || ""}
                  onChange={(e) => updateActionConfig(action.id, { ...action.config, duration: e.target.value })}
                  className="bg-background"
                />
                <Select
                  value={action.config.unit || "minutes"}
                  onValueChange={(value) => updateActionConfig(action.id, { ...action.config, unit: value })}
                >
                  <SelectTrigger className="w-32 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case "condition":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Condition Type</Label>
              <Select
                value={action.config.conditionType || "contains"}
                onValueChange={(value) => updateActionConfig(action.id, { ...action.config, conditionType: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contains">Message contains</SelectItem>
                  <SelectItem value="equals">Message equals</SelectItem>
                  <SelectItem value="starts_with">Starts with</SelectItem>
                  <SelectItem value="ends_with">Ends with</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input
                placeholder="Enter condition value..."
                value={action.config.value || ""}
                onChange={(e) => updateActionConfig(action.id, { ...action.config, value: e.target.value })}
                className="bg-background"
              />
            </div>
          </div>
        )

      case "send_to_human":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Note for Human Agent</Label>
              <Textarea
                placeholder="Add context for the human agent..."
                value={action.config.note || ""}
                onChange={(e) => updateActionConfig(action.id, { ...action.config, note: e.target.value })}
                className="min-h-[100px] bg-background"
              />
            </div>
          </div>
        )

      case "webhook":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Webhook URL</Label>
              <Input
                type="url"
                placeholder="https://example.com/webhook"
                value={action.config.url || ""}
                onChange={(e) => updateActionConfig(action.id, { ...action.config, url: e.target.value })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>Method</Label>
              <Select
                value={action.config.method || "POST"}
                onValueChange={(value) => updateActionConfig(action.id, { ...action.config, method: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card shadow-lg">
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Automation Details</h2>
        </div>
        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="name">Automation Name</Label>
            <Input
              id="name"
              placeholder="Enter automation name"
              value={automationName}
              onChange={(e) => setAutomationName(e.target.value)}
              className="bg-background shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe what this automation does..."
              value={automationDescription}
              onChange={(e) => setAutomationDescription(e.target.value)}
              className="min-h-[80px] bg-background shadow-sm"
            />
          </div>

          {instagramAccounts.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="account">Instagram Account</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger id="account" className="bg-background shadow-sm">
                  <SelectValue placeholder="Select an account" />
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
          )}
        </div>
      </Card>

      <Card className="border-border bg-card shadow-lg">
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Trigger</h2>
          <p className="text-sm text-muted-foreground">When should this automation run?</p>
        </div>
        <div className="space-y-4 p-6">
          <div className="space-y-2">
            <Label>Trigger Type</Label>
            <Select value={selectedTrigger} onValueChange={(v) => setSelectedTrigger(v as TriggerType)}>
              <SelectTrigger className="bg-background shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {triggerTypes.map((trigger) => (
                  <SelectItem key={trigger.value} value={trigger.value}>
                    <div className="space-y-0.5">
                      <div className="font-medium">{trigger.label}</div>
                      <div className="text-xs text-muted-foreground">{trigger.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTrigger === "keyword" && (
            <div className="space-y-2">
              <Label>Keywords (comma separated)</Label>
              <Input
                placeholder="pricing, demo, help"
                value={(triggerConfig.keywords || []).join(", ")}
                onChange={(e) =>
                  setTriggerConfig({
                    keywords: e.target.value.split(",").map((k) => k.trim()),
                  })
                }
                className="bg-background shadow-sm"
              />
            </div>
          )}
        </div>
      </Card>

      <Card className="border-border bg-card shadow-lg">
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Actions</h2>
              <p className="text-sm text-muted-foreground">What should happen when triggered?</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {actions.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No actions yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">Add your first action to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {actions.map((action, index) => {
                const ActionIcon = actionTypes.find((t) => t.type === action.type)?.icon || MessageSquare
                return (
                  <div
                    key={action.id}
                    className="group rounded-lg border border-border bg-background p-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <ActionIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">
                              {actionTypes.find((t) => t.type === action.type)?.label}
                            </h4>
                            {action.isConfigured && (
                              <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                                Configured
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {actionTypes.find((t) => t.type === action.type)?.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAction(action.id)}
                          className="shadow-sm hover:shadow-md transition-all"
                        >
                          Configure
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAction(action.id)}
                          className="text-destructive hover:bg-destructive/10 shadow-sm hover:shadow-md transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-4">
            {actionTypes.map((actionType) => {
              const Icon = actionType.icon
              return (
                <Button
                  key={actionType.type}
                  variant="outline"
                  onClick={() => addAction(actionType.type)}
                  className="h-auto flex-col gap-2 py-4 shadow-md hover:shadow-lg transition-all"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{actionType.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between gap-4 sticky bottom-6 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-xl">
        <Button
          variant="outline"
          onClick={() => router.push(buildHref("/automations"))}
          className="shadow-md hover:shadow-lg transition-all"
        >
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            className="gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2 shadow-lg hover:shadow-xl transition-all">
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : automation?.id ? "Update" : "Create"} Automation
          </Button>
        </div>
      </div>

      <Dialog open={selectedAction !== null} onOpenChange={() => setSelectedAction(null)}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>
              Configure{" "}
              {selectedAction
                ? actionTypes.find((t) => t.type === actions.find((a) => a.id === selectedAction)?.type)?.label
                : ""}
            </DialogTitle>
            <DialogDescription>Customize the action settings below</DialogDescription>
          </DialogHeader>
          {selectedAction && (
            <div className="space-y-4">
              {renderActionConfig(actions.find((a) => a.id === selectedAction)!)}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedAction(null)}
                  className="shadow-md hover:shadow-lg transition-all"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    const action = actions.find((a) => a.id === selectedAction)
                    if (action && Object.keys(action.config).length > 0) {
                      setSelectedAction(null)
                    }
                  }}
                  className="shadow-lg hover:shadow-xl transition-all"
                >
                  Save Configuration
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[600px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Automation Preview</DialogTitle>
            <DialogDescription>Review your automation workflow</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <h3 className="font-semibold text-foreground">{automationName}</h3>
              {automationDescription && <p className="text-sm text-muted-foreground">{automationDescription}</p>}
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Trigger</h4>
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-sm">{triggerTypes.find((t) => t.value === selectedTrigger)?.label}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Actions ({actions.length})</h4>
              <div className="space-y-2">
                {actions.map((action, index) => {
                  const ActionIcon = actionTypes.find((t) => t.type === action.type)?.icon || MessageSquare
                  return (
                    <div
                      key={action.id}
                      className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                        <ActionIcon className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">{actionTypes.find((t) => t.type === action.type)?.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}




















//BETTER FROM CLAUDE


// "use client"

// import { useState, useCallback, useEffect } from "react"
// import {
//   ReactFlow,
//   Controls,
//   Background,
//   addEdge,
//   type Connection,
//   type Node,
//   type Edge,
//   MarkerType,
//   BackgroundVariant,
//   type NodeChange,
//   type EdgeChange,
//   applyNodeChanges,
//   applyEdgeChanges,
//   Handle,
//   Position,
//   ConnectionLineType,
// } from "@xyflow/react"
// import "@xyflow/react/dist/style.css"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Switch } from "@/components/ui/switch"
// import { Slider } from "@/components/ui/slider"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import {
//   MessageCircle,
//   Hash,
//   Image as ImageIcon,
//   AtSign,
//   Sparkles,
//   Send,
//   Bot,
//   Tag,
//   Timer,
//   GitBranch,
//   User,
//   Link2,
//   Plus,
//   Trash2,
//   Save,
//   ArrowLeft,
//   Settings,
//   Play,
//   Info,
//   CheckCircle2,
//   AlertCircle,
//   Zap,
//   Eye,
//   ChevronRight,
//   Layers,
// } from "lucide-react"

// const TRIGGERS = [
//   { id: "DM_RECEIVED", label: "Direct Message", icon: MessageCircle, color: "bg-blue-500", description: "Any DM received" },
//   { id: "STORY_REPLY", label: "Story Reply", icon: ImageIcon, color: "bg-purple-500", description: "Reply to your story" },
//   { id: "COMMENT", label: "Comment", icon: Hash, color: "bg-green-500", description: "Comment on posts" },
//   { id: "MENTION", label: "Mention", icon: AtSign, color: "bg-orange-500", description: "Tagged in story/post" },
//   { id: "KEYWORD", label: "Keyword", icon: Sparkles, color: "bg-pink-500", description: "Specific words detected" },
//   { id: "FIRST_MESSAGE", label: "First Message", icon: Sparkles, color: "bg-cyan-500", description: "New conversation" },
// ]

// const ACTIONS = [
//   { id: "SEND_MESSAGE", label: "Send Message", icon: Send, color: "bg-blue-500", description: "Send a text response" },
//   { id: "AI_RESPONSE", label: "AI Response", icon: Bot, color: "bg-purple-500", description: "AI-generated reply" },
//   { id: "ADD_TAG", label: "Add Tag", icon: Tag, color: "bg-green-500", description: "Organize contacts" },
//   { id: "DELAY", label: "Wait", icon: Timer, color: "bg-yellow-500", description: "Add time delay" },
//   { id: "CONDITION", label: "Condition", icon: GitBranch, color: "bg-orange-500", description: "If/then logic" },
//   { id: "SEND_TO_HUMAN", label: "Human Handoff", icon: User, color: "bg-red-500", description: "Route to team" },
//   { id: "WEBHOOK", label: "Webhook", icon: Link2, color: "bg-gray-500", description: "External integration" },
// ]

// function CustomNode({ data }: { data: any }) {
//   const isTrigger = data.nodeType === "trigger"
//   const typeConfig = isTrigger
//     ? TRIGGERS.find((t) => t.id === data.actionType)
//     : ACTIONS.find((a) => a.id === data.actionType)
//   const Icon = typeConfig?.icon

//   return (
//     <div className="relative group">
//       {!isTrigger && (
//         <Handle
//           type="target"
//           position={Position.Top}
//           className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white !shadow-lg"
//           style={{ top: -6 }}
//         />
//       )}

//       <Card
//         className={`min-w-[280px] shadow-lg transition-all ${
//           isTrigger
//             ? "bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-400"
//             : "bg-white border-2 border-slate-200 hover:border-indigo-300"
//         }`}
//       >
//         <div className="p-4">
//           <div className="flex items-start justify-between gap-3 mb-3">
//             <div className="flex items-center gap-3 flex-1">
//               <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeConfig?.color} shadow-sm`}>
//                 {Icon && <Icon className="w-5 h-5 text-white" />}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h4 className="font-semibold text-sm truncate">{typeConfig?.label}</h4>
//                 {data.isConfigured ? (
//                   <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs mt-1">
//                     <CheckCircle2 className="w-3 h-3 mr-1" />
//                     Configured
//                   </Badge>
//                 ) : (
//                   <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs mt-1">
//                     <AlertCircle className="w-3 h-3 mr-1" />
//                     Setup Required
//                   </Badge>
//                 )}
//               </div>
//             </div>
//             {!isTrigger && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   data.onDelete()
//                 }}
//                 className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 <Trash2 className="h-3.5 w-3.5 text-red-500" />
//               </Button>
//             )}
//           </div>
//           {data.isConfigured && data.preview && (
//             <div className="text-xs text-muted-foreground mb-3 line-clamp-2 bg-slate-50 p-2 rounded">
//               {data.preview}
//             </div>
//           )}
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={(e) => {
//               e.stopPropagation()
//               data.onConfigure()
//             }}
//             className="w-full"
//           >
//             <Settings className="w-3.5 h-3.5 mr-2" />
//             {data.isConfigured ? "Edit" : "Configure"}
//           </Button>
//         </div>
//       </Card>

//       <Handle
//         type="source"
//         position={Position.Bottom}
//         className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white !shadow-lg"
//         style={{ bottom: -6 }}
//       />

//       {/* Add Action Button */}
//       <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
//         <Button
//           size="sm"
//           onClick={(e) => {
//             e.stopPropagation()
//             data.onAddBelow()
//           }}
//           className="rounded-full h-8 w-8 p-0 shadow-lg bg-indigo-500 hover:bg-indigo-600"
//         >
//           <Plus className="w-4 h-4" />
//         </Button>
//       </div>
//     </div>
//   )
// }

// const nodeTypes = { custom: CustomNode }

// export function AutomationBuilder() {
//   const [nodes, setNodes] = useState<Node[]>([])
//   const [edges, setEdges] = useState<Edge[]>([])
//   const [automationName, setAutomationName] = useState("My Automation")
//   const [automationDescription, setAutomationDescription] = useState("")
//   const [selectedAccount, setSelectedAccount] = useState("")
  
//   const [showTriggerDialog, setShowTriggerDialog] = useState(true)
//   const [showActionDialog, setShowActionDialog] = useState(false)
//   const [showConfigDialog, setShowConfigDialog] = useState(false)
//   const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  
//   const [selectedNodeForConfig, setSelectedNodeForConfig] = useState<string | null>(null)
//   const [pendingAddBelowNode, setPendingAddBelowNode] = useState<string | null>(null)
//   const [currentConfig, setCurrentConfig] = useState<any>({})

//   const onNodesChange = useCallback((changes: NodeChange[]) => {
//     setNodes((nds) => applyNodeChanges(changes, nds))
//   }, [])

//   const onEdgesChange = useCallback((changes: EdgeChange[]) => {
//     setEdges((eds) => applyEdgeChanges(changes, eds))
//   }, [])

//   const onConnect = useCallback((params: Connection) => {
//     const newEdge = {
//       ...params,
//       type: "smoothstep",
//       animated: true,
//       style: { stroke: "#6366f1", strokeWidth: 2 },
//       markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
//     }
//     setEdges((eds) => addEdge(newEdge, eds))
//   }, [])

//   const addTriggerNode = (triggerId: string) => {
//     const trigger = TRIGGERS.find((t) => t.id === triggerId)
//     if (!trigger) return

//     const triggerNode: Node = {
//       id: "trigger-0",
//       type: "custom",
//       position: { x: 400, y: 100 },
//       data: {
//         nodeType: "trigger",
//         actionType: triggerId,
//         isConfigured: triggerId !== "KEYWORD",
//         onConfigure: () => handleConfigureNode("trigger-0"),
//         onAddBelow: () => handleAddBelow("trigger-0"),
//         preview: trigger.description,
//       },
//     }

//     setNodes([triggerNode])
//     setShowTriggerDialog(false)
//   }

//   const handleAddBelow = (nodeId: string) => {
//     setPendingAddBelowNode(nodeId)
//     setShowActionDialog(true)
//   }

//   const addActionNode = (actionId: string) => {
//     const action = ACTIONS.find((a) => a.id === actionId)
//     if (!action) return

//     const sourceNode = nodes.find((n) => n.id === pendingAddBelowNode)
//     if (!sourceNode) return

//     const existingActions = nodes.filter((n) => n.data.nodeType === "action")
//     const newNodeId = `action-${existingActions.length + 1}`
    
//     const yPosition = sourceNode.position.y + 200

//     const newNode: Node = {
//       id: newNodeId,
//       type: "custom",
//       position: { x: sourceNode.position.x, y: yPosition },
//       data: {
//         nodeType: "action",
//         actionType: actionId,
//         isConfigured: false,
//         config: {},
//         onConfigure: () => handleConfigureNode(newNodeId),
//         onDelete: () => handleDeleteNode(newNodeId),
//         onAddBelow: () => handleAddBelow(newNodeId),
//       },
//     }

//     setNodes((nds) => [...nds, newNode])

//     const newEdge: Edge = {
//       id: `edge-${sourceNode.id}-${newNodeId}`,
//       source: sourceNode.id,
//       target: newNodeId,
//       type: "smoothstep",
//       animated: true,
//       style: { stroke: "#6366f1", strokeWidth: 2 },
//       markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
//     }
//     setEdges((eds) => [...eds, newEdge])

//     setShowActionDialog(false)
//     setPendingAddBelowNode(null)
    
//     // Auto-open config dialog
//     setTimeout(() => handleConfigureNode(newNodeId), 100)
//   }

//   const handleDeleteNode = (nodeId: string) => {
//     setNodes((nds) => nds.filter((node) => node.id !== nodeId))
//     setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
//   }

//   const handleConfigureNode = (nodeId: string) => {
//     const node = nodes.find((n) => n.id === nodeId)
//     if (!node) return

//     setSelectedNodeForConfig(nodeId)
//     setCurrentConfig(node.data.config || {})
//     setShowConfigDialog(true)
//   }

//   const handleSaveConfig = (config: any) => {
//     if (!selectedNodeForConfig) return

//     setNodes((nds) =>
//       nds.map((node) => {
//         if (node.id === selectedNodeForConfig) {
//           const preview = getConfigPreview(node.data.actionType as string, config)
//           return {
//             ...node,
//             data: {
//               ...node.data,
//               config,
//               isConfigured: Object.keys(config).length > 0,
//               preview,
//             },
//           }
//         }
//         return node
//       })
//     )

//     setShowConfigDialog(false)
//     setSelectedNodeForConfig(null)
//     setCurrentConfig({})
//   }

//   const getConfigPreview = (actionType: string, config: any) => {
//     switch (actionType) {
//       case "SEND_MESSAGE":
//         return config.message ? `"${config.message.substring(0, 60)}..."` : ""
//       case "AI_RESPONSE":
//         return "AI will generate contextual response"
//       case "ADD_TAG":
//         return config.tagName ? `Tag: ${config.tagName}` : ""
//       case "DELAY":
//         return config.delayAmount ? `Wait ${config.delayAmount} ${config.delayUnit}` : ""
//       case "KEYWORD":
//         return config.keywords?.length ? `Keywords: ${config.keywords.join(", ")}` : ""
//       default:
//         return ""
//     }
//   }

//   const renderConfigForm = () => {
//     const node = nodes.find((n) => n.id === selectedNodeForConfig)
//     if (!node) return null

//     const actionType = node.data.actionType
//     const isTrigger = node.data.nodeType === "trigger"

//     if (isTrigger && actionType === "KEYWORD") {
//       return (
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <Label>Keywords (one per line)</Label>
//             <Textarea
//               placeholder="price&#10;pricing&#10;cost&#10;how much"
//               value={(currentConfig.keywords || []).join("\n")}
//               onChange={(e) =>
//                 setCurrentConfig({
//                   ...currentConfig,
//                   keywords: e.target.value.split("\n").filter(Boolean),
//                 })
//               }
//               className="min-h-[120px] font-mono"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label>Match Type</Label>
//             <Select
//               value={currentConfig.matchType || "contains"}
//               onValueChange={(v) => setCurrentConfig({ ...currentConfig, matchType: v })}
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="contains">Contains keyword</SelectItem>
//                 <SelectItem value="exact">Exact match</SelectItem>
//                 <SelectItem value="starts_with">Starts with</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       )
//     }

//     switch (actionType) {
//       case "SEND_MESSAGE":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Message Template</Label>
//               <Textarea
//                 placeholder="Hi {name}! Thanks for reaching out..."
//                 value={currentConfig.message || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, message: e.target.value })}
//                 className="min-h-[150px]"
//               />
//               <div className="flex flex-wrap gap-2">
//                 <Badge variant="secondary" className="text-xs">{"{name}"}</Badge>
//                 <Badge variant="secondary" className="text-xs">{"{username}"}</Badge>
//                 <Badge variant="secondary" className="text-xs">{"{first_name}"}</Badge>
//               </div>
//             </div>
//           </div>
//         )

//       case "AI_RESPONSE":
//         return (
//           <Tabs defaultValue="instructions" className="w-full">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="instructions">Instructions</TabsTrigger>
//               <TabsTrigger value="advanced">Advanced</TabsTrigger>
//             </TabsList>
//             <TabsContent value="instructions" className="space-y-4">
//               <div className="space-y-2">
//                 <Label>AI Instructions</Label>
//                 <Textarea
//                   placeholder="You are a friendly customer service assistant..."
//                   value={currentConfig.aiInstructions || ""}
//                   onChange={(e) => setCurrentConfig({ ...currentConfig, aiInstructions: e.target.value })}
//                   className="min-h-[150px]"
//                 />
//               </div>
//             </TabsContent>
//             <TabsContent value="advanced" className="space-y-4">
//               <div className="space-y-2">
//                 <Label>Tone</Label>
//                 <Select
//                   value={currentConfig.aiTone || "friendly"}
//                   onValueChange={(v) => setCurrentConfig({ ...currentConfig, aiTone: v })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="friendly">Friendly</SelectItem>
//                     <SelectItem value="professional">Professional</SelectItem>
//                     <SelectItem value="casual">Casual</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label>Creativity: {currentConfig.temperature || 0.7}</Label>
//                 <Slider
//                   min={0}
//                   max={1}
//                   step={0.1}
//                   value={[currentConfig.temperature || 0.7]}
//                   onValueChange={(v) => setCurrentConfig({ ...currentConfig, temperature: v[0] })}
//                 />
//               </div>
//             </TabsContent>
//           </Tabs>
//         )

//       case "ADD_TAG":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Tag Name</Label>
//               <Input
//                 placeholder="e.g., Hot Lead, VIP Customer"
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
//                   min="1"
//                   placeholder="5"
//                   value={currentConfig.delayAmount || ""}
//                   onChange={(e) => setCurrentConfig({ ...currentConfig, delayAmount: e.target.value })}
//                 />
//                 <Select
//                   value={currentConfig.delayUnit || "minutes"}
//                   onValueChange={(v) => setCurrentConfig({ ...currentConfig, delayUnit: v })}
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
//               <Label>Field</Label>
//               <Select
//                 value={currentConfig.field || "message"}
//                 onValueChange={(v) => setCurrentConfig({ ...currentConfig, field: v })}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                   </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="message">Message Content</SelectItem>
//                   <SelectItem value="username">Username</SelectItem>
//                   <SelectItem value="follower_count">Follower Count</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Operator</Label>
//               <Select
//                 value={currentConfig.operator || "contains"}
//                 onValueChange={(v) => setCurrentConfig({ ...currentConfig, operator: v })}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="contains">Contains</SelectItem>
//                   <SelectItem value="equals">Equals</SelectItem>
//                   <SelectItem value="greater_than">Greater than</SelectItem>
//                   <SelectItem value="less_than">Less than</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Value</Label>
//               <Input
//                 placeholder="Enter value..."
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
//                 onValueChange={(v) => setCurrentConfig({ ...currentConfig, webhookMethod: v })}
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

//   const selectedNodeData = selectedNodeForConfig ? nodes.find((n) => n.id === selectedNodeForConfig)?.data : null
//   const selectedTypeConfig = selectedNodeData
//     ? selectedNodeData.nodeType === "trigger"
//       ? TRIGGERS.find((t) => t.id === selectedNodeData.actionType)
//       : ACTIONS.find((a) => a.id === selectedNodeData.actionType)
//     : null

//   return (
//     <div className="h-screen flex flex-col bg-slate-50">
//       {/* Minimal Top Bar */}
//       <div className="border-b bg-white shadow-sm z-50">
//         <div className="px-6 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="sm">
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back
//             </Button>
//             <div className="h-6 w-px bg-border" />
//             <Input
//               value={automationName}
//               onChange={(e) => setAutomationName(e.target.value)}
//               className="border-none shadow-none font-semibold text-lg w-64 h-8 px-2"
//               placeholder="Automation Name"
//             />
//             <Badge variant="secondary" className="gap-1.5">
//               <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
//               Draft
//             </Badge>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="sm" onClick={() => setShowDetailsDialog(true)}>
//               <Settings className="w-4 h-4 mr-2" />
//               Details
//             </Button>
//             <Button variant="outline" size="sm">
//               <Play className="w-4 h-4 mr-2" />
//               Test
//             </Button>
//             <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
//               <Save className="w-4 h-4 mr-2" />
//               Save & Activate
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Full Canvas */}
//       <div className="flex-1 relative">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           nodeTypes={nodeTypes}
//           fitView
//           minZoom={0.5}
//           maxZoom={1.5}
//           defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
//           connectionLineStyle={{ stroke: "#6366f1", strokeWidth: 3 }}
//           connectionLineType={ConnectionLineType.SmoothStep}
//           className="bg-slate-50"
//         >
//           <Controls className="bg-white border border-slate-200 rounded-lg shadow-lg" />
//           <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="bg-slate-50" />
          
//           {nodes.length === 0 && (
//             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//               <div className="text-center max-w-md">
//                 <div className="w-20 h-20 rounded-full bg-indigo-100 mx-auto flex items-center justify-center mb-4">
//                   <Zap className="w-10 h-10 text-indigo-500" />
//                 </div>
//                 <h3 className="text-2xl font-bold mb-2">Choose Your Trigger</h3>
//                 <p className="text-muted-foreground mb-6">
//                   Select what event should start your automation
//                 </p>
//                 <Button 
//                   onClick={() => setShowTriggerDialog(true)}
//                   size="lg"
//                   className="pointer-events-auto bg-indigo-600 hover:bg-indigo-700"
//                 >
//                   <Plus className="w-5 h-5 mr-2" />
//                   Select Trigger
//                 </Button>
//               </div>
//             </div>
//           )}
//         </ReactFlow>
//       </div>

//       {/* Trigger Selection Dialog */}
//       <Dialog open={showTriggerDialog} onOpenChange={setShowTriggerDialog}>
//         <DialogContent className="max-w-3xl">
//           <DialogHeader>
//             <DialogTitle className="text-2xl flex items-center gap-2">
//               <Zap className="w-6 h-6 text-indigo-500" />
//               Choose a Trigger
//             </DialogTitle>
//             <DialogDescription>Select what event should start this automation</DialogDescription>
//           </DialogHeader>
//           <div className="grid grid-cols-2 gap-3 mt-4">
//             {TRIGGERS.map((trigger) => {
//               const Icon = trigger.icon
//               return (
//                 <Card
//                   key={trigger.id}
//                   className="p-4 cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all group"
//                   onClick={() => addTriggerNode(trigger.id)}
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className={`w-12 h-12 rounded-lg ${trigger.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
//                       <Icon className="w-6 h-6 text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-semibold mb-1">{trigger.label}</h4>
//                       <p className="text-sm text-muted-foreground">{trigger.description}</p>
//                     </div>
//                     <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
//                   </div>
//                 </Card>
//               )
//             })}
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Action Selection Dialog */}
//       <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
//         <DialogContent className="max-w-3xl">
//           <DialogHeader>
//             <DialogTitle className="text-2xl flex items-center gap-2">
//               <Layers className="w-6 h-6 text-indigo-500" />
//               Add an Action
//             </DialogTitle>
//             <DialogDescription>What should happen next?</DialogDescription>
//           </DialogHeader>
//           <div className="grid grid-cols-2 gap-3 mt-4">
//             {ACTIONS.map((action) => {
//               const Icon = action.icon
//               return (
//                 <Card
//                   key={action.id}
//                   className="p-4 cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all group"
//                   onClick={() => addActionNode(action.id)}
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
//                       <Icon className="w-6 h-6 text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-semibold mb-1">{action.label}</h4>
//                       <p className="text-sm text-muted-foreground">{action.description}</p>
//                     </div>
//                     <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
//                   </div>
//                 </Card>
//               )
//             })}
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Configuration Dialog */}
//       <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
//         <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
//           <DialogHeader>
//             <div className="flex items-center gap-3">
//               {selectedTypeConfig?.icon && (
//                 <div className={`w-12 h-12 rounded-lg ${selectedTypeConfig.color} flex items-center justify-center`}>
//                   <selectedTypeConfig.icon className="w-6 h-6 text-white" />
//                 </div>
//               )}
//               <div>
//                 <DialogTitle className="text-xl">{selectedTypeConfig?.label}</DialogTitle>
//                 <DialogDescription>{selectedTypeConfig?.description}</DialogDescription>
//               </div>
//             </div>
//           </DialogHeader>
//           <div className="py-4">
//             {renderConfigForm()}
//           </div>
//           <div className="flex justify-end gap-2 pt-4 border-t">
//             <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
//               Cancel
//             </Button>
//             <Button onClick={() => handleSaveConfig(currentConfig)} className="bg-indigo-600 hover:bg-indigo-700">
//               <Save className="w-4 h-4 mr-2" />
//               Save Configuration
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Details Dialog */}
//       <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
//         <DialogContent className="max-w-xl">
//           <DialogHeader>
//             <DialogTitle>Automation Details</DialogTitle>
//             <DialogDescription>Configure your automation settings</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label>Automation Name</Label>
//               <Input
//                 value={automationName}
//                 onChange={(e) => setAutomationName(e.target.value)}
//                 placeholder="e.g., Welcome New Followers"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Description (Optional)</Label>
//               <Textarea
//                 value={automationDescription}
//                 onChange={(e) => setAutomationDescription(e.target.value)}
//                 placeholder="Describe what this automation does..."
//                 rows={3}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Instagram Account</Label>
//               <Select value={selectedAccount} onValueChange={setSelectedAccount}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select an account" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="account1">@myaccount</SelectItem>
//                   <SelectItem value="account2">@mybusiness</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <div className="flex justify-end gap-2 pt-4 border-t">
//             <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
//               Cancel
//             </Button>
//             <Button onClick={() => setShowDetailsDialog(false)} className="bg-indigo-600 hover:bg-indigo-700">
//               Save Details
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }