// "use client"

// import { useState, useEffect } from "react"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Slider } from "@/components/ui/slider"
// import { Switch } from "@/components/ui/switch"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { TRIGGER_TYPES, ACTION_TYPES, type TriggerTypeId, type ActionTypeId } from "@/lib/automation-constants"
// import { Info, Save } from "lucide-react"

// interface ConfigDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   nodeType: "trigger" | "action"
//   actionType: string
//   config: any
//   onSave: (config: any) => void
// }

// export function AutomationConfigDialog({
//   open,
//   onOpenChange,
//   nodeType,
//   actionType,
//   config,
//   onSave,
// }: ConfigDialogProps) {
//   const [currentConfig, setCurrentConfig] = useState(config || {})

//   useEffect(() => {
//     setCurrentConfig(config || {})
//   }, [config, open])

//   const handleSave = () => {
//     onSave(currentConfig)
//     onOpenChange(false)
//   }

//   const renderTriggerConfig = () => {
//     switch (actionType as TriggerTypeId) {
//       case "KEYWORD":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="keywords">Keywords</Label>
//               <Textarea
//                 id="keywords"
//                 placeholder="Enter keywords, one per line (e.g., price, pricing, cost, how much)"
//                 value={(currentConfig.keywords || []).join("\n")}
//                 onChange={(e) =>
//                   setCurrentConfig({
//                     ...currentConfig,
//                     keywords: e.target.value
//                       .split("\n")
//                       .map((k) => k.trim())
//                       .filter(Boolean),
//                   })
//                 }
//                 className="min-h-[100px]"
//               />
//               <p className="text-xs text-muted-foreground">
//                 The automation will trigger when any of these keywords are detected
//               </p>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="matchType">Match Type</Label>
//               <Select
//                 value={currentConfig.matchType || "contains"}
//                 onValueChange={(value) => setCurrentConfig({ ...currentConfig, matchType: value })}
//               >
//                 <SelectTrigger id="matchType">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="contains">Contains keyword (flexible)</SelectItem>
//                   <SelectItem value="exact">Exact match only</SelectItem>
//                   <SelectItem value="starts_with">Starts with keyword</SelectItem>
//                   <SelectItem value="ends_with">Ends with keyword</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
//               <div className="flex-1 space-y-1">
//                 <Label htmlFor="case-sensitive">Case Sensitive</Label>
//                 <p className="text-sm text-muted-foreground">Match keywords with exact capitalization</p>
//               </div>
//               <Switch
//                 id="case-sensitive"
//                 checked={currentConfig.caseSensitive || false}
//                 onCheckedChange={(checked) => setCurrentConfig({ ...currentConfig, caseSensitive: checked })}
//               />
//             </div>
//           </div>
//         )

//       case "COMMENT":
//         return (
//           <div className="space-y-4">
//             <Alert>
//               <Info className="h-4 w-4" />
//               <AlertDescription>
//                 This trigger activates when someone comments on your Instagram posts. Configure filtering options below.
//               </AlertDescription>
//             </Alert>
//             <div className="space-y-2">
//               <Label htmlFor="postId">Specific Post ID (Optional)</Label>
//               <Input
//                 id="postId"
//                 placeholder="Leave empty to monitor all posts"
//                 value={currentConfig.postId || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, postId: e.target.value })}
//               />
//               <p className="text-xs text-muted-foreground">
//                 If specified, only comments on this post will trigger the automation
//               </p>
//             </div>
//             <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
//               <div className="flex-1 space-y-1">
//                 <Label htmlFor="exclude-replies">Exclude Comment Replies</Label>
//                 <p className="text-sm text-muted-foreground">Only trigger on top-level comments</p>
//               </div>
//               <Switch
//                 id="exclude-replies"
//                 checked={currentConfig.excludeReplies || false}
//                 onCheckedChange={(checked) => setCurrentConfig({ ...currentConfig, excludeReplies: checked })}
//               />
//             </div>
//           </div>
//         )

//       default:
//         return (
//           <Alert>
//             <Info className="h-4 w-4" />
//             <AlertDescription>
//               This trigger type activates automatically and doesn't require additional configuration.
//             </AlertDescription>
//           </Alert>
//         )
//     }
//   }

//   const renderActionConfig = () => {
//     switch (actionType as ActionTypeId) {
//       case "SEND_MESSAGE":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="message">Message Template</Label>
//               <Textarea
//                 id="message"
//                 placeholder="Type your message here..."
//                 value={currentConfig.message || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, message: e.target.value })}
//                 className="min-h-[150px]"
//               />
//               <div className="flex flex-wrap gap-2 mt-2">
//                 <Badge variant="outline" className="text-xs">
//                   Available variables:
//                 </Badge>
//                 <Badge
//                   variant="secondary"
//                   className="text-xs cursor-pointer"
//                   onClick={() => {
//                     setCurrentConfig({ ...currentConfig, message: (currentConfig.message || "") + "{username}" })
//                   }}
//                 >
//                   {"{username}"}
//                 </Badge>
//                 <Badge
//                   variant="secondary"
//                   className="text-xs cursor-pointer"
//                   onClick={() => {
//                     setCurrentConfig({ ...currentConfig, message: (currentConfig.message || "") + "{name}" })
//                   }}
//                 >
//                   {"{name}"}
//                 </Badge>
//                 <Badge
//                   variant="secondary"
//                   className="text-xs cursor-pointer"
//                   onClick={() => {
//                     setCurrentConfig({ ...currentConfig, message: (currentConfig.message || "") + "{first_name}" })
//                   }}
//                 >
//                   {"{first_name}"}
//                 </Badge>
//               </div>
//             </div>
//           </div>
//         )

//       case "SEND_IMAGE":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="imageUrl">Image URL</Label>
//               <Input
//                 id="imageUrl"
//                 type="url"
//                 placeholder="https://example.com/image.jpg"
//                 value={currentConfig.imageUrl || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, imageUrl: e.target.value })}
//               />
//               <p className="text-xs text-muted-foreground">Provide a publicly accessible image URL</p>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="caption">Caption (Optional)</Label>
//               <Textarea
//                 id="caption"
//                 placeholder="Add a caption to your image..."
//                 value={currentConfig.caption || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, caption: e.target.value })}
//                 rows={3}
//               />
//             </div>
//           </div>
//         )

//       case "REPLY_TO_COMMENT":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="reply">Reply Message</Label>
//               <Textarea
//                 id="reply"
//                 placeholder="Your reply to the comment..."
//                 value={currentConfig.replyMessage || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, replyMessage: e.target.value })}
//                 className="min-h-[120px]"
//               />
//             </div>
//           </div>
//         )

//       case "HIDE_COMMENT":
//         return (
//           <div className="space-y-4">
//             <Alert>
//               <Info className="h-4 w-4" />
//               <AlertDescription>
//                 This action will hide comments that trigger the automation. Useful for filtering spam or inappropriate
//                 content.
//               </AlertDescription>
//             </Alert>
//             <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
//               <div className="flex-1 space-y-1">
//                 <Label htmlFor="hide-action">Action</Label>
//                 <p className="text-sm text-muted-foreground">Hide or unhide the comment</p>
//               </div>
//               <Switch
//                 id="hide-action"
//                 checked={currentConfig.hide !== false}
//                 onCheckedChange={(checked) => setCurrentConfig({ ...currentConfig, hide: checked })}
//               />
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
//                 <Label htmlFor="ai-instructions">AI Instructions</Label>
//                 <Textarea
//                   id="ai-instructions"
//                   placeholder="Example: You are a friendly customer service assistant. Answer questions about our products, pricing, and services. Be helpful and professional."
//                   value={currentConfig.aiInstructions || ""}
//                   onChange={(e) => setCurrentConfig({ ...currentConfig, aiInstructions: e.target.value })}
//                   className="min-h-[150px]"
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   Tell the AI how to respond and what information to provide
//                 </p>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="knowledge-base">Knowledge Base (Optional)</Label>
//                 <Textarea
//                   id="knowledge-base"
//                   placeholder="Add specific information the AI should know about your business, products, or services..."
//                   value={currentConfig.aiKnowledgeBase || ""}
//                   onChange={(e) => setCurrentConfig({ ...currentConfig, aiKnowledgeBase: e.target.value })}
//                   className="min-h-[120px]"
//                 />
//                 <p className="text-xs text-muted-foreground">Provide context and facts for the AI to reference</p>
//               </div>
//             </TabsContent>
//             <TabsContent value="advanced" className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="tone">Response Tone</Label>
//                 <Select
//                   value={currentConfig.aiTone || "friendly"}
//                   onValueChange={(value) => setCurrentConfig({ ...currentConfig, aiTone: value })}
//                 >
//                   <SelectTrigger id="tone">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="friendly">Friendly & Casual</SelectItem>
//                     <SelectItem value="professional">Professional</SelectItem>
//                     <SelectItem value="formal">Formal</SelectItem>
//                     <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
//                     <SelectItem value="empathetic">Empathetic</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label htmlFor="creativity">Creativity Level: {currentConfig.temperature || 0.7}</Label>
//                 </div>
//                 <Slider
//                   id="creativity"
//                   min={0}
//                   max={1}
//                   step={0.1}
//                   value={[currentConfig.temperature || 0.7]}
//                   onValueChange={(value) => setCurrentConfig({ ...currentConfig, temperature: value[0] })}
//                 />
//                 <p className="text-xs text-muted-foreground">Lower = More consistent, Higher = More creative</p>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="max-length">Max Response Length</Label>
//                 <Select
//                   value={String(currentConfig.maxTokens || 150)}
//                   onValueChange={(value) => setCurrentConfig({ ...currentConfig, maxTokens: Number.parseInt(value) })}
//                 >
//                   <SelectTrigger id="max-length">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="50">Short (50 tokens)</SelectItem>
//                     <SelectItem value="150">Medium (150 tokens)</SelectItem>
//                     <SelectItem value="300">Long (300 tokens)</SelectItem>
//                     <SelectItem value="500">Very Long (500 tokens)</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </TabsContent>
//           </Tabs>
//         )

//       case "ADD_TAG":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="tag">Tag Name</Label>
//               <Input
//                 id="tag"
//                 placeholder="e.g., Hot Lead, VIP Customer, Needs Follow-up"
//                 value={currentConfig.tagName || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, tagName: e.target.value })}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="color">Tag Color</Label>
//               <div className="grid grid-cols-8 gap-2">
//                 {["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#6B7280", "#14B8A6"].map(
//                   (color) => (
//                     <button
//                       key={color}
//                       type="button"
//                       className="w-10 h-10 rounded-lg border-2 transition-all hover:scale-110"
//                       style={{
//                         backgroundColor: color,
//                         borderColor: currentConfig.tagColor === color ? "#000" : "transparent",
//                       }}
//                       onClick={() => setCurrentConfig({ ...currentConfig, tagColor: color })}
//                     />
//                   ),
//                 )}
//               </div>
//             </div>
//           </div>
//         )

//       case "DELAY":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="delay-amount">Delay Duration</Label>
//               <div className="flex gap-2">
//                 <Input
//                   id="delay-amount"
//                   type="number"
//                   min="1"
//                   placeholder="5"
//                   value={currentConfig.delayAmount || ""}
//                   onChange={(e) => setCurrentConfig({ ...currentConfig, delayAmount: e.target.value })}
//                   className="flex-1"
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
//               <p className="text-xs text-muted-foreground">
//                 The automation will wait this long before executing the next action
//               </p>
//             </div>
//           </div>
//         )

//       case "CONDITION":
//         return (
//           <div className="space-y-4">
//             <Alert>
//               <Info className="h-4 w-4" />
//               <AlertDescription>
//                 Create conditional logic to branch your automation based on message content or other conditions.
//               </AlertDescription>
//             </Alert>
//             <div className="space-y-2">
//               <Label htmlFor="field">Check Field</Label>
//               <Select
//                 value={currentConfig.field || "message"}
//                 onValueChange={(value) => setCurrentConfig({ ...currentConfig, field: value })}
//               >
//                 <SelectTrigger id="field">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="message">Message Content</SelectItem>
//                   <SelectItem value="username">Username</SelectItem>
//                   <SelectItem value="follower_count">Follower Count</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="operator">Condition</Label>
//               <Select
//                 value={currentConfig.operator || "contains"}
//                 onValueChange={(value) => setCurrentConfig({ ...currentConfig, operator: value })}
//               >
//                 <SelectTrigger id="operator">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="contains">Contains</SelectItem>
//                   <SelectItem value="equals">Equals</SelectItem>
//                   <SelectItem value="starts_with">Starts with</SelectItem>
//                   <SelectItem value="ends_with">Ends with</SelectItem>
//                   <SelectItem value="greater_than">Greater than</SelectItem>
//                   <SelectItem value="less_than">Less than</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="value">Value</Label>
//               <Input
//                 id="value"
//                 placeholder="Enter comparison value..."
//                 value={currentConfig.value || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, value: e.target.value })}
//               />
//             </div>
//           </div>
//         )

//       case "SEND_TO_HUMAN":
//         return (
//           <div className="space-y-4">
//             <Alert>
//               <Info className="h-4 w-4" />
//               <AlertDescription>
//                 This action will flag the conversation for human review and stop the automation.
//               </AlertDescription>
//             </Alert>
//             <div className="space-y-2">
//               <Label htmlFor="reason">Handoff Reason</Label>
//               <Textarea
//                 id="reason"
//                 placeholder="e.g., Customer needs pricing information, Complex technical question, VIP customer"
//                 value={currentConfig.reason || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, reason: e.target.value })}
//                 className="min-h-[100px]"
//               />
//               <p className="text-xs text-muted-foreground">This note will be visible to your team members</p>
//             </div>
//             <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
//               <div className="flex-1 space-y-1">
//                 <Label htmlFor="notify-team">Notify Team</Label>
//                 <p className="text-sm text-muted-foreground">Send notification when handoff occurs</p>
//               </div>
//               <Switch
//                 id="notify-team"
//                 checked={currentConfig.notifyTeam !== false}
//                 onCheckedChange={(checked) => setCurrentConfig({ ...currentConfig, notifyTeam: checked })}
//               />
//             </div>
//           </div>
//         )

//       case "WEBHOOK":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="webhook-url">Webhook URL</Label>
//               <Input
//                 id="webhook-url"
//                 type="url"
//                 placeholder="https://your-service.com/webhook"
//                 value={currentConfig.webhookUrl || ""}
//                 onChange={(e) => setCurrentConfig({ ...currentConfig, webhookUrl: e.target.value })}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="method">HTTP Method</Label>
//               <Select
//                 value={currentConfig.webhookMethod || "POST"}
//                 onValueChange={(value) => setCurrentConfig({ ...currentConfig, webhookMethod: value })}
//               >
//                 <SelectTrigger id="method">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="POST">POST</SelectItem>
//                   <SelectItem value="GET">GET</SelectItem>
//                   <SelectItem value="PUT">PUT</SelectItem>
//                   <SelectItem value="PATCH">PATCH</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="headers">Custom Headers (Optional)</Label>
//               <Textarea
//                 id="headers"
//                 placeholder={'{"Authorization": "Bearer YOUR_TOKEN", "Content-Type": "application/json"}'}
//                 value={currentConfig.webhookHeaders ? JSON.stringify(currentConfig.webhookHeaders, null, 2) : ""}
//                 onChange={(e) => {
//                   try {
//                     const headers = JSON.parse(e.target.value)
//                     setCurrentConfig({ ...currentConfig, webhookHeaders: headers })
//                   } catch {
//                     // Invalid JSON, don't update
//                   }
//                 }}
//                 className="min-h-[80px] font-mono text-xs"
//               />
//             </div>
//           </div>
//         )

//       default:
//         return null
//     }
//   }

//   const typeConfig =
//     nodeType === "trigger" ? TRIGGER_TYPES[actionType as TriggerTypeId] : ACTION_TYPES[actionType as ActionTypeId]

//   const Icon = typeConfig?.icon

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <div className="flex items-center gap-3">
//             {Icon && (
//               <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeConfig?.color} text-white`}>
//                 <Icon className="w-5 h-5" />
//               </div>
//             )}
//             <div>
//               <DialogTitle>Configure {typeConfig?.label}</DialogTitle>
//               <DialogDescription>{typeConfig?.description}</DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>
//         <div className="space-y-6 py-4">{nodeType === "trigger" ? renderTriggerConfig() : renderActionConfig()}</div>
//         <div className="flex justify-end gap-2 pt-4 border-t">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSave}>
//             <Save className="w-4 h-4 mr-2" />
//             Save Configuration
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TRIGGER_TYPES, ACTION_TYPES, type TriggerTypeId, type ActionTypeId } from "@/lib/automation-constants"
import { Info, Save } from "lucide-react"
import { PostStorySelector } from "@/components/post-story-selector"
import { AIModelSelector } from "@/components/ai-model-selector"

interface ConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nodeType: "trigger" | "action"
  actionType: string
  config: any
  onSave: (config: any) => void
}

export function AutomationConfigDialog({
  open,
  onOpenChange,
  nodeType,
  actionType,
  config,
  onSave,
}: ConfigDialogProps) {
  const [currentConfig, setCurrentConfig] = useState(config || {})

  useEffect(() => {
    setCurrentConfig(config || {})
  }, [config, open])

  const handleSave = () => {
    onSave(currentConfig)
    onOpenChange(false)
  }

  const renderTriggerConfig = () => {
    switch (actionType as TriggerTypeId) {
      case "KEYWORD":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Textarea
                id="keywords"
                placeholder="Enter keywords, one per line (e.g., price, pricing, cost, how much)"
                value={(currentConfig.keywords || []).join("\n")}
                onChange={(e) =>
                  setCurrentConfig({
                    ...currentConfig,
                    keywords: e.target.value
                      .split("\n")
                      .map((k) => k.trim())
                      .filter(Boolean),
                  })
                }
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                The automation will trigger when any of these keywords are detected
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="matchType">Match Type</Label>
              <Select
                value={currentConfig.matchType || "contains"}
                onValueChange={(value) => setCurrentConfig({ ...currentConfig, matchType: value })}
              >
                <SelectTrigger id="matchType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contains">Contains keyword (flexible)</SelectItem>
                  <SelectItem value="exact">Exact match only</SelectItem>
                  <SelectItem value="starts_with">Starts with keyword</SelectItem>
                  <SelectItem value="ends_with">Ends with keyword</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="case-sensitive">Case Sensitive</Label>
                <p className="text-sm text-muted-foreground">Match keywords with exact capitalization</p>
              </div>
              <Switch
                id="case-sensitive"
                checked={currentConfig.caseSensitive || false}
                onCheckedChange={(checked) => setCurrentConfig({ ...currentConfig, caseSensitive: checked })}
              />
            </div>
          </div>
        )

      case "COMMENT":
        return (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This trigger activates when someone comments on your Instagram posts. Configure filtering options below.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label>Target Post (Optional)</Label>
              <PostStorySelector
                accountId={currentConfig.instagramAccountId || ""}
                type="post"
                selectedId={currentConfig.postId}
                onSelect={(post) => setCurrentConfig({ ...currentConfig, postId: post.id, postCaption: post.caption })}
              />
              <p className="text-xs text-muted-foreground">
                Select a specific post or leave empty to monitor all posts
              </p>
            </div>
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="exclude-replies">Exclude Comment Replies</Label>
                <p className="text-sm text-muted-foreground">Only trigger on top-level comments</p>
              </div>
              <Switch
                id="exclude-replies"
                checked={currentConfig.excludeReplies || false}
                onCheckedChange={(checked) => setCurrentConfig({ ...currentConfig, excludeReplies: checked })}
              />
            </div>
          </div>
        )

      case "STORY_REPLY":
        return (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This trigger activates when someone replies to your Instagram stories.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label>Target Story (Optional)</Label>
              <PostStorySelector
                accountId={currentConfig.instagramAccountId || ""}
                type="story"
                selectedId={currentConfig.storyId}
                onSelect={(story) => setCurrentConfig({ ...currentConfig, storyId: story.id })}
              />
              <p className="text-xs text-muted-foreground">
                Select a specific story or leave empty to monitor all story replies
              </p>
            </div>
          </div>
        )

      default:
        return (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This trigger type activates automatically and doesn't require additional configuration.
            </AlertDescription>
          </Alert>
        )
    }
  }

  const renderActionConfig = () => {
    switch (actionType as ActionTypeId) {
      case "SEND_MESSAGE":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message Template</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={currentConfig.message || ""}
                onChange={(e) => setCurrentConfig({ ...currentConfig, message: e.target.value })}
                className="min-h-[150px]"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  Available variables:
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-xs cursor-pointer"
                  onClick={() => {
                    setCurrentConfig({ ...currentConfig, message: (currentConfig.message || "") + "{username}" })
                  }}
                >
                  {"{username}"}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-xs cursor-pointer"
                  onClick={() => {
                    setCurrentConfig({ ...currentConfig, message: (currentConfig.message || "") + "{name}" })
                  }}
                >
                  {"{name}"}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-xs cursor-pointer"
                  onClick={() => {
                    setCurrentConfig({ ...currentConfig, message: (currentConfig.message || "") + "{first_name}" })
                  }}
                >
                  {"{first_name}"}
                </Badge>
              </div>
            </div>
          </div>
        )

      case "SEND_IMAGE":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={currentConfig.imageUrl || ""}
                onChange={(e) => setCurrentConfig({ ...currentConfig, imageUrl: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Provide a publicly accessible image URL</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Caption (Optional)</Label>
              <Textarea
                id="caption"
                placeholder="Add a caption to your image..."
                value={currentConfig.caption || ""}
                onChange={(e) => setCurrentConfig({ ...currentConfig, caption: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        )

      case "REPLY_TO_COMMENT":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reply">Reply Message</Label>
              <Textarea
                id="reply"
                placeholder="Your reply to the comment..."
                value={currentConfig.replyMessage || ""}
                onChange={(e) => setCurrentConfig({ ...currentConfig, replyMessage: e.target.value })}
                className="min-h-[120px]"
              />
            </div>
          </div>
        )

      case "HIDE_COMMENT":
        return (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This action will hide comments that trigger the automation. Useful for filtering spam or inappropriate
                content.
              </AlertDescription>
            </Alert>
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="hide-action">Action</Label>
                <p className="text-sm text-muted-foreground">Hide or unhide the comment</p>
              </div>
              <Switch
                id="hide-action"
                checked={currentConfig.hide !== false}
                onCheckedChange={(checked) => setCurrentConfig({ ...currentConfig, hide: checked })}
              />
            </div>
          </div>
        )

      case "AI_RESPONSE":
        return (
          <Tabs defaultValue="instructions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="model">AI Model</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="instructions" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-instructions">AI Instructions</Label>
                <Textarea
                  id="ai-instructions"
                  placeholder="Example: You are a friendly customer service assistant. Answer questions about our products, pricing, and services. Be helpful and professional."
                  value={currentConfig.aiInstructions || ""}
                  onChange={(e) => setCurrentConfig({ ...currentConfig, aiInstructions: e.target.value })}
                  className="min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground">
                  Tell the AI how to respond and what information to provide
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="knowledge-base">Knowledge Base (Optional)</Label>
                <Textarea
                  id="knowledge-base"
                  placeholder="Add specific information the AI should know about your business, products, or services..."
                  value={currentConfig.aiKnowledgeBase || ""}
                  onChange={(e) => setCurrentConfig({ ...currentConfig, aiKnowledgeBase: e.target.value })}
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">Provide context and facts for the AI to reference</p>
              </div>
            </TabsContent>
            <TabsContent value="model" className="space-y-4">
              <AIModelSelector
                config={{
                  model: currentConfig.aiModel,
                  temperature: currentConfig.temperature,
                  maxTokens: currentConfig.maxTokens,
                  systemPrompt: currentConfig.systemPrompt,
                }}
                onChange={(aiConfig) =>
                  setCurrentConfig({
                    ...currentConfig,
                    aiModel: aiConfig.model,
                    temperature: aiConfig.temperature,
                    maxTokens: aiConfig.maxTokens,
                    systemPrompt: aiConfig.systemPrompt,
                  })
                }
              />
            </TabsContent>
            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Response Tone</Label>
                <Select
                  value={currentConfig.aiTone || "friendly"}
                  onValueChange={(value) => setCurrentConfig({ ...currentConfig, aiTone: value })}
                >
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly & Casual</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="empathetic">Empathetic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        )

      case "ADD_TAG":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tag">Tag Name</Label>
              <Input
                id="tag"
                placeholder="e.g., Hot Lead, VIP Customer, Needs Follow-up"
                value={currentConfig.tagName || ""}
                onChange={(e) => setCurrentConfig({ ...currentConfig, tagName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Tag Color</Label>
              <div className="grid grid-cols-8 gap-2">
                {["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#6B7280", "#14B8A6"].map(
                  (color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-10 h-10 rounded-lg border-2 transition-all hover:scale-110"
                      style={{
                        backgroundColor: color,
                        borderColor: currentConfig.tagColor === color ? "#000" : "transparent",
                      }}
                      onClick={() => setCurrentConfig({ ...currentConfig, tagColor: color })}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        )

      case "DELAY":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delay-amount">Delay Duration</Label>
              <div className="flex gap-2">
                <Input
                  id="delay-amount"
                  type="number"
                  min="1"
                  placeholder="5"
                  value={currentConfig.delayAmount || ""}
                  onChange={(e) => setCurrentConfig({ ...currentConfig, delayAmount: e.target.value })}
                  className="flex-1"
                />
                <Select
                  value={currentConfig.delayUnit || "minutes"}
                  onValueChange={(value) => setCurrentConfig({ ...currentConfig, delayUnit: value })}
                >
                  <SelectTrigger className="w-32">
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
              <p className="text-xs text-muted-foreground">
                The automation will wait this long before executing the next action
              </p>
            </div>
          </div>
        )

      case "CONDITION":
        return (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Create conditional logic to branch your automation based on message content or other conditions.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="field">Check Field</Label>
              <Select
                value={currentConfig.field || "message"}
                onValueChange={(value) => setCurrentConfig({ ...currentConfig, field: value })}
              >
                <SelectTrigger id="field">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="message">Message Content</SelectItem>
                  <SelectItem value="username">Username</SelectItem>
                  <SelectItem value="follower_count">Follower Count</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="operator">Condition</Label>
              <Select
                value={currentConfig.operator || "contains"}
                onValueChange={(value) => setCurrentConfig({ ...currentConfig, operator: value })}
              >
                <SelectTrigger id="operator">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="starts_with">Starts with</SelectItem>
                  <SelectItem value="ends_with">Ends with</SelectItem>
                  <SelectItem value="greater_than">Greater than</SelectItem>
                  <SelectItem value="less_than">Less than</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                placeholder="Enter comparison value..."
                value={currentConfig.value || ""}
                onChange={(e) => setCurrentConfig({ ...currentConfig, value: e.target.value })}
              />
            </div>
          </div>
        )

      case "SEND_TO_HUMAN":
        return (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This action will flag the conversation for human review and stop the automation.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="reason">Handoff Reason</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Customer needs pricing information, Complex technical question, VIP customer"
                value={currentConfig.reason || ""}
                onChange={(e) => setCurrentConfig({ ...currentConfig, reason: e.target.value })}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">This note will be visible to your team members</p>
            </div>
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="notify-team">Notify Team</Label>
                <p className="text-sm text-muted-foreground">Send notification when handoff occurs</p>
              </div>
              <Switch
                id="notify-team"
                checked={currentConfig.notifyTeam !== false}
                onCheckedChange={(checked) => setCurrentConfig({ ...currentConfig, notifyTeam: checked })}
              />
            </div>
          </div>
        )

      case "WEBHOOK":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://your-service.com/webhook"
                value={currentConfig.webhookUrl || ""}
                onChange={(e) => setCurrentConfig({ ...currentConfig, webhookUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">HTTP Method</Label>
              <Select
                value={currentConfig.webhookMethod || "POST"}
                onValueChange={(value) => setCurrentConfig({ ...currentConfig, webhookMethod: value })}
              >
                <SelectTrigger id="method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="headers">Custom Headers (Optional)</Label>
              <Textarea
                id="headers"
                placeholder={'{"Authorization": "Bearer YOUR_TOKEN", "Content-Type": "application/json"}'}
                value={currentConfig.webhookHeaders ? JSON.stringify(currentConfig.webhookHeaders, null, 2) : ""}
                onChange={(e) => {
                  try {
                    const headers = JSON.parse(e.target.value)
                    setCurrentConfig({ ...currentConfig, webhookHeaders: headers })
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                className="min-h-[80px] font-mono text-xs"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const typeConfig =
    nodeType === "trigger" ? TRIGGER_TYPES[actionType as TriggerTypeId] : ACTION_TYPES[actionType as ActionTypeId]

  const Icon = typeConfig?.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeConfig?.color} text-white`}>
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              <DialogTitle>Configure {typeConfig?.label}</DialogTitle>
              <DialogDescription>{typeConfig?.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-6 py-4">{nodeType === "trigger" ? renderTriggerConfig() : renderActionConfig()}</div>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
