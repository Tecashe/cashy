// "use client"

// import { useState } from "react"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { ACTION_TYPES, AI_TONES, AVAILABLE_VARIABLES } from "@/lib/constants/utomation-constants"
// import type { ActionConfig as ActionConfigType } from "@/lib/types/automation"
// import { ConditionBuilder } from "./condition-builder"
// import { Plus, Info } from "lucide-react"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { CarouselImageUploader } from "./carousel-image-uploader"
// import React from "react"

// interface ActionConfigModalProps {
//   open: boolean
//   onClose: () => void
//   action: ActionConfigType
//   onSave: (action: ActionConfigType) => void
//   tags: any[]
// }

// export function ActionConfigModal({ open, onClose, action, onSave, tags }: ActionConfigModalProps) {
//   const [config, setConfig] = useState(action.config)
//   const actionInfo = ACTION_TYPES[action.type]

//   const handleSave = () => {
//     onSave({ ...action, config })
//     onClose()
//   }

//   const insertVariable = (variable: string, field: "message" | "aiInstructions") => {
//     const currentValue = config[field] || ""
//     const textarea = document.querySelector(`textarea[data-field="${field}"]`) as HTMLTextAreaElement
//     if (textarea) {
//       const start = textarea.selectionStart
//       const end = textarea.selectionEnd
//       const newValue = currentValue.slice(0, start) + variable + currentValue.slice(end)
//       setConfig({ ...config, [field]: newValue })

//       setTimeout(() => {
//         textarea.focus()
//         textarea.setSelectionRange(start + variable.length, start + variable.length)
//       }, 0)
//     } else {
//       setConfig({ ...config, [field]: currentValue + variable })
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
//         <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
//           <div className="flex items-start gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
//               {React.createElement(actionInfo.icon, { className: "h-5 w-5 text-primary" })}
//             </div>
//             <div className="flex-1">
//               <DialogTitle className="text-xl font-semibold flex items-center gap-2">
//                 {actionInfo.label}
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Info className="h-4 w-4 text-muted-foreground" />
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p className="max-w-xs">{actionInfo.description}</p>
//                     </TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//               </DialogTitle>
//               <DialogDescription className="mt-1">{actionInfo.description}</DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>

//         <ScrollArea className="flex-1 px-6 py-6 max-h-[calc(90vh-180px)]">
//           <div className="space-y-6">
//             {/* Send Message */}
//             {action.type === "send_message" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Message Content</CardTitle>
//                   <CardDescription>Compose your automated message</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="message">Message *</Label>
//                     <Textarea
//                       id="message"
//                       data-field="message"
//                       placeholder="Hi {first_name}! Thanks for reaching out..."
//                       value={config.message || ""}
//                       onChange={(e) => setConfig({ ...config, message: e.target.value })}
//                       rows={6}
//                       className="resize-none"
//                     />
//                     <p className="text-xs text-muted-foreground">{(config.message || "").length} characters</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm">Insert Variables</Label>
//                     <div className="flex flex-wrap gap-2">
//                       {AVAILABLE_VARIABLES.map((variable) => (
//                         <Button
//                           key={variable.value}
//                           variant="outline"
//                           size="sm"
//                           type="button"
//                           onClick={() => insertVariable(variable.value, "message")}
//                           className="border-border/50 hover:border-primary/30"
//                         >
//                           <Plus className="mr-1 h-3 w-3" />
//                           {variable.label}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Send Image */}
//             {action.type === "send_image" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Image Settings</CardTitle>
//                   <CardDescription>Configure the image to send</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="imageUrl">Image URL *</Label>
//                     <Input
//                       id="imageUrl"
//                       placeholder="https://example.com/image.jpg"
//                       value={config.imageUrl || ""}
//                       onChange={(e) => setConfig({ ...config, imageUrl: e.target.value })}
//                     />
//                     <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF (max 8MB)</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="imageCaption">Caption (optional)</Label>
//                     <Textarea
//                       id="imageCaption"
//                       placeholder="Add a caption to your image..."
//                       value={config.message || ""}
//                       onChange={(e) => setConfig({ ...config, message: e.target.value })}
//                       rows={3}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Send Carousel */}
//             {action.type === "send_carousel" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Carousel Images</CardTitle>
//                   <CardDescription>Upload and arrange multiple images (2-10 images)</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <CarouselImageUploader
//                     images={
//                       config.carouselImages?.map((url: string, index: number) => ({
//                         id: `img-${index}`,
//                         url,
//                       })) || []
//                     }
//                     onImagesChange={(images) => {
//                       setConfig({
//                         ...config,
//                         carouselImages: images.map((img) => img.url),
//                       })
//                     }}
//                     maxImages={10}
//                   />
//                 </CardContent>
//               </Card>
//             )}

//             {/* Reply to Comment */}
//             {action.type === "reply_to_comment" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Comment Reply</CardTitle>
//                   <CardDescription>Configure your automated comment reply</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="reply">Reply Message *</Label>
//                     <Textarea
//                       id="reply"
//                       data-field="message"
//                       placeholder="Thanks for your comment! Check your DMs..."
//                       value={config.message || ""}
//                       onChange={(e) => setConfig({ ...config, message: e.target.value })}
//                       rows={4}
//                     />
//                     <p className="text-xs text-muted-foreground">Keep replies short and engaging</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm">Insert Variables</Label>
//                     <div className="flex flex-wrap gap-2">
//                       {AVAILABLE_VARIABLES.map((variable) => (
//                         <Button
//                           key={variable.value}
//                           variant="outline"
//                           size="sm"
//                           type="button"
//                           onClick={() => insertVariable(variable.value, "message")}
//                           className="border-border/50 hover:border-primary/30"
//                         >
//                           <Plus className="mr-1 h-3 w-3" />
//                           {variable.label}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Hide Comment */}
//             {action.type === "hide_comment" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Comment Moderation</CardTitle>
//                   <CardDescription>Control comment visibility</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex items-center justify-between rounded-lg border p-4">
//                     <div className="space-y-0.5">
//                       <Label>Hide Comment</Label>
//                       <p className="text-sm text-muted-foreground">Hide offensive or spam comments automatically</p>
//                     </div>
//                     <Switch
//                       checked={config.shouldHide !== false}
//                       onCheckedChange={(checked) => setConfig({ ...config, shouldHide: checked })}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* AI Response */}
//             {action.type === "ai_response" && (
//               <div className="space-y-4">
//                 <Card className="border-border/50">
//                   <CardHeader>
//                     <CardTitle className="text-base">AI Configuration</CardTitle>
//                     <CardDescription>Customize AI response behavior</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="tone">Response Tone *</Label>
//                       <Select
//                         value={config.tone || "professional"}
//                         onValueChange={(value) => setConfig({ ...config, tone: value })}
//                       >
//                         <SelectTrigger id="tone">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {AI_TONES.map((tone) => (
//                             <SelectItem key={tone.value} value={tone.value}>
//                               {tone.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="instructions">Custom Instructions</Label>
//                       <Textarea
//                         id="instructions"
//                         data-field="aiInstructions"
//                         placeholder="e.g., Keep responses under 50 words, be enthusiastic, include emojis..."
//                         value={config.aiInstructions || ""}
//                         onChange={(e) => setConfig({ ...config, aiInstructions: e.target.value })}
//                         rows={4}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className="text-sm">Insert Variables</Label>
//                       <div className="flex flex-wrap gap-2">
//                         {AVAILABLE_VARIABLES.map((variable) => (
//                           <Button
//                             key={variable.value}
//                             variant="outline"
//                             size="sm"
//                             type="button"
//                             onClick={() => insertVariable(variable.value, "aiInstructions")}
//                             className="border-border/50 hover:border-primary/30"
//                           >
//                             <Plus className="mr-1 h-3 w-3" />
//                             {variable.label}
//                           </Button>
//                         ))}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="border-border/50">
//                   <CardHeader>
//                     <CardTitle className="text-base">Advanced Settings</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="flex items-center justify-between rounded-lg border p-4">
//                       <div className="space-y-0.5">
//                         <Label>Use Knowledge Base</Label>
//                         <p className="text-sm text-muted-foreground">
//                           Include your custom knowledge base in AI responses
//                         </p>
//                       </div>
//                       <Switch
//                         checked={config.aiKnowledgeBase || false}
//                         onCheckedChange={(checked) => setConfig({ ...config, aiKnowledgeBase: checked })}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="maxTokens">Max Response Length</Label>
//                       <Input
//                         id="maxTokens"
//                         type="number"
//                         placeholder="150"
//                         value={config.maxTokens || 150}
//                         onChange={(e) => setConfig({ ...config, maxTokens: Number.parseInt(e.target.value) || 150 })}
//                       />
//                       <p className="text-xs text-muted-foreground">Tokens (roughly 0.75 words per token)</p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             )}

//             {/* Add Tag */}
//             {action.type === "add_tag" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Tag Selection</CardTitle>
//                   <CardDescription>Choose a tag to apply to the conversation</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   <Label htmlFor="tag">Tag *</Label>
//                   <Select value={config.tag || ""} onValueChange={(value) => setConfig({ ...config, tag: value })}>
//                     <SelectTrigger id="tag">
//                       <SelectValue placeholder="Select a tag" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {tags.length === 0 ? (
//                         <div className="p-2 text-sm text-muted-foreground">No tags available</div>
//                       ) : (
//                         tags.map((tag) => (
//                           <SelectItem key={tag.id} value={tag.id}>
//                             <div className="flex items-center gap-2">
//                               <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
//                               {tag.name}
//                             </div>
//                           </SelectItem>
//                         ))
//                       )}
//                     </SelectContent>
//                   </Select>
//                   {tags.length === 0 && (
//                     <p className="text-xs text-muted-foreground">Create tags first in the Tags section</p>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             {/* Delay */}
//             {action.type === "delay" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Delay Duration</CardTitle>
//                   <CardDescription>Set how long to wait before the next action</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-3 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="days">Days</Label>
//                       <Input
//                         id="days"
//                         type="number"
//                         min="0"
//                         placeholder="0"
//                         value={config.delayDays || ""}
//                         onChange={(e) => setConfig({ ...config, delayDays: Number.parseInt(e.target.value) || 0 })}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="hours">Hours</Label>
//                       <Input
//                         id="hours"
//                         type="number"
//                         min="0"
//                         max="23"
//                         placeholder="0"
//                         value={config.delayHours || ""}
//                         onChange={(e) => setConfig({ ...config, delayHours: Number.parseInt(e.target.value) || 0 })}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="minutes">Minutes</Label>
//                       <Input
//                         id="minutes"
//                         type="number"
//                         min="0"
//                         max="59"
//                         placeholder="0"
//                         value={config.delayMinutes || ""}
//                         onChange={(e) => setConfig({ ...config, delayMinutes: Number.parseInt(e.target.value) || 0 })}
//                       />
//                     </div>
//                   </div>
//                   <p className="mt-3 text-sm text-muted-foreground">
//                     Total delay:{" "}
//                     {(config.delayDays || 0) * 24 * 60 + (config.delayHours || 0) * 60 + (config.delayMinutes || 0)}{" "}
//                     minutes
//                   </p>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Conditional Branch */}
//             {action.type === "condition" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Conditional Logic</CardTitle>
//                   <CardDescription>Create IF/THEN/ELSE branches based on conditions</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <ConditionBuilder
//                     conditionGroups={config.conditionGroups || []}
//                     onChange={(groups) => setConfig({ ...config, conditionGroups: groups })}
//                   />
//                 </CardContent>
//               </Card>
//             )}

//             {/* Human Handoff */}
//             {action.type === "human_handoff" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Human Handoff</CardTitle>
//                   <CardDescription>Transfer conversation to live agent</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="rounded-lg border bg-muted/50 p-4">
//                     <p className="text-sm text-muted-foreground">
//                       When this action is triggered, the conversation will be flagged for human review and removed from
//                       automation. You can add a notification message to alert your team.
//                     </p>
//                   </div>
//                   <div className="mt-4 space-y-2">
//                     <Label htmlFor="handoffMessage">Handoff Message (optional)</Label>
//                     <Textarea
//                       id="handoffMessage"
//                       placeholder="A team member will be with you shortly..."
//                       value={config.message || ""}
//                       onChange={(e) => setConfig({ ...config, message: e.target.value })}
//                       rows={3}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Webhook */}
//             {action.type === "webhook" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Webhook Configuration</CardTitle>
//                   <CardDescription>Send data to external services</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="webhookUrl">Webhook URL *</Label>
//                     <Input
//                       id="webhookUrl"
//                       placeholder="https://api.example.com/webhook"
//                       value={config.webhookUrl || ""}
//                       onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="method">HTTP Method</Label>
//                     <Select
//                       value={config.webhookMethod || "POST"}
//                       onValueChange={(value) => setConfig({ ...config, webhookMethod: value as "GET" | "POST" })}
//                     >
//                       <SelectTrigger id="method">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="GET">GET</SelectItem>
//                         <SelectItem value="POST">POST</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="webhookBody">Request Body (JSON)</Label>
//                     <Textarea
//                       id="webhookBody"
//                       placeholder='{"event": "automation_triggered", "user": "{username}"}'
//                       value={config.webhookBody || ""}
//                       onChange={(e) => setConfig({ ...config, webhookBody: e.target.value })}
//                       rows={6}
//                       className="font-mono text-sm"
//                     />
//                     <p className="text-xs text-muted-foreground">
//                       You can use variables like {"{username}"}, {"{message}"}, etc.
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </ScrollArea>

//         <DialogFooter className="border-t border-border/50 px-6 py-4">
//           <div className="flex w-full gap-3">
//             <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
//               Cancel
//             </Button>
//             <Button onClick={handleSave} className="flex-1 shadow-sm">
//               Save Action
//             </Button>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }


// "use client"

// import { useState } from "react"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { ACTION_TYPES, AI_TONES, AVAILABLE_VARIABLES } from "@/lib/constants/utomation-constants"
// import type { ActionConfig as ActionConfigType } from "@/lib/types/automation"
// import { ConditionBuilder } from "./condition-builder"
// import { Plus, Info } from "lucide-react"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { CarouselImageUploader } from "./carousel-image-uploader"
// import { ImageUploadWithLibrary } from "./image-upload-with-library"
// import React from "react"

// interface ActionConfigModalProps {
//   open: boolean
//   onClose: () => void
//   action: ActionConfigType
//   onSave: (action: ActionConfigType) => void
//   tags: any[]
// }

// export function ActionConfigModal({ open, onClose, action, onSave, tags }: ActionConfigModalProps) {
//   const [config, setConfig] = useState(action.config)
//   const actionInfo = ACTION_TYPES[action.type]

//   const handleSave = () => {
//     onSave({ ...action, config })
//     onClose()
//   }

//   const insertVariable = (variable: string, field: "message" | "aiInstructions") => {
//     const currentValue = config[field] || ""
//     const textarea = document.querySelector(`textarea[data-field="${field}"]`) as HTMLTextAreaElement
//     if (textarea) {
//       const start = textarea.selectionStart
//       const end = textarea.selectionEnd
//       const newValue = currentValue.slice(0, start) + variable + currentValue.slice(end)
//       setConfig({ ...config, [field]: newValue })

//       setTimeout(() => {
//         textarea.focus()
//         textarea.setSelectionRange(start + variable.length, start + variable.length)
//       }, 0)
//     } else {
//       setConfig({ ...config, [field]: currentValue + variable })
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
//         <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
//           <div className="flex items-start gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
//               {React.createElement(actionInfo.icon, { className: "h-5 w-5 text-primary" })}
//             </div>
//             <div className="flex-1">
//               <DialogTitle className="text-xl font-semibold flex items-center gap-2">
//                 {actionInfo.label}
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Info className="h-4 w-4 text-muted-foreground" />
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p className="max-w-xs">{actionInfo.description}</p>
//                     </TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//               </DialogTitle>
//               <DialogDescription className="mt-1">{actionInfo.description}</DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>

//         <ScrollArea className="flex-1 px-6 py-6 max-h-[calc(90vh-180px)]">
//           <div className="space-y-6">
//             {/* Send Message */}
//             {action.type === "send_message" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Message Content</CardTitle>
//                   <CardDescription>Compose your automated message</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="message">Message *</Label>
//                     <Textarea
//                       id="message"
//                       data-field="message"
//                       placeholder="Hi {first_name}! Thanks for reaching out..."
//                       value={config.message || ""}
//                       onChange={(e) => setConfig({ ...config, message: e.target.value })}
//                       rows={6}
//                       className="resize-none"
//                     />
//                     <p className="text-xs text-muted-foreground">{(config.message || "").length} characters</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm">Insert Variables</Label>
//                     <div className="flex flex-wrap gap-2">
//                       {AVAILABLE_VARIABLES.map((variable) => (
//                         <Button
//                           key={variable.value}
//                           variant="outline"
//                           size="sm"
//                           type="button"
//                           onClick={() => insertVariable(variable.value, "message")}
//                           className="border-border/50 hover:border-primary/30"
//                         >
//                           <Plus className="mr-1 h-3 w-3" />
//                           {variable.label}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Send Image */}
//             {action.type === "send_image" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Image Settings</CardTitle>
//                   <CardDescription>Upload or select an image from your library</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label>Image *</Label>
//                     <ImageUploadWithLibrary
//                       value={config.imageUrl || ""}
//                       onChange={(url) => setConfig({ ...config, imageUrl: url })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="imageCaption">Caption (optional)</Label>
//                     <Textarea
//                       id="imageCaption"
//                       placeholder="Add a caption to your image..."
//                       value={config.message || ""}
//                       onChange={(e) => setConfig({ ...config, message: e.target.value })}
//                       rows={3}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Send Carousel */}
//             {action.type === "send_carousel" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Carousel Images</CardTitle>
//                   <CardDescription>Upload and arrange multiple images (2-10 images)</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <CarouselImageUploader
//                     images={
//                       config.carouselImages?.map((url: string, index: number) => ({
//                         id: `img-${index}`,
//                         url,
//                       })) || []
//                     }
//                     onImagesChange={(images) => {
//                       setConfig({
//                         ...config,
//                         carouselImages: images.map((img) => img.url),
//                       })
//                     }}
//                     maxImages={10}
//                   />
//                 </CardContent>
//               </Card>
//             )}

//             {/* Reply to Comment */}
//             {action.type === "reply_to_comment" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Comment Reply</CardTitle>
//                   <CardDescription>Configure your automated comment reply</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="reply">Reply Message *</Label>
//                     <Textarea
//                       id="reply"
//                       data-field="message"
//                       placeholder="Thanks for your comment! Check your DMs..."
//                       value={config.message || ""}
//                       onChange={(e) => setConfig({ ...config, message: e.target.value })}
//                       rows={4}
//                     />
//                     <p className="text-xs text-muted-foreground">Keep replies short and engaging</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm">Insert Variables</Label>
//                     <div className="flex flex-wrap gap-2">
//                       {AVAILABLE_VARIABLES.map((variable) => (
//                         <Button
//                           key={variable.value}
//                           variant="outline"
//                           size="sm"
//                           type="button"
//                           onClick={() => insertVariable(variable.value, "message")}
//                           className="border-border/50 hover:border-primary/30"
//                         >
//                           <Plus className="mr-1 h-3 w-3" />
//                           {variable.label}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Hide Comment */}
//             {action.type === "hide_comment" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Comment Moderation</CardTitle>
//                   <CardDescription>Control comment visibility</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex items-center justify-between rounded-lg border p-4">
//                     <div className="space-y-0.5">
//                       <Label>Hide Comment</Label>
//                       <p className="text-sm text-muted-foreground">Hide offensive or spam comments automatically</p>
//                     </div>
//                     <Switch
//                       checked={config.shouldHide !== false}
//                       onCheckedChange={(checked) => setConfig({ ...config, shouldHide: checked })}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             )}



















//             {/* AI Response */}
//             {action.type === "ai_response" && (
//               <div className="space-y-4">
//                 <Card className="border-border/50">
//                   <CardHeader>
//                     <CardTitle className="text-base">AI Configuration</CardTitle>
//                     <CardDescription>Customize AI response behavior</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="tone">Response Tone *</Label>
//                       <Select
//                         value={config.tone || "professional"}
//                         onValueChange={(value) => setConfig({ ...config, tone: value })}
//                       >
//                         <SelectTrigger id="tone">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {AI_TONES.map((tone) => (
//                             <SelectItem key={tone.value} value={tone.value}>
//                               {tone.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="instructions">Custom Instructions</Label>
//                       <Textarea
//                         id="instructions"
//                         data-field="aiInstructions"
//                         placeholder="e.g., Keep responses under 50 words, be enthusiastic, include emojis..."
//                         value={config.aiInstructions || ""}
//                         onChange={(e) => setConfig({ ...config, aiInstructions: e.target.value })}
//                         rows={4}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className="text-sm">Insert Variables</Label>
//                       <div className="flex flex-wrap gap-2">
//                         {AVAILABLE_VARIABLES.map((variable) => (
//                           <Button
//                             key={variable.value}
//                             variant="outline"
//                             size="sm"
//                             type="button"
//                             onClick={() => insertVariable(variable.value, "aiInstructions")}
//                             className="border-border/50 hover:border-primary/30"
//                           >
//                             <Plus className="mr-1 h-3 w-3" />
//                             {variable.label}
//                           </Button>
//                         ))}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="border-border/50">
//                   <CardHeader>
//                     <CardTitle className="text-base">Advanced Settings</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="flex items-center justify-between rounded-lg border p-4">
//                       <div className="space-y-0.5">
//                         <Label>Use Knowledge Base</Label>
//                         <p className="text-sm text-muted-foreground">
//                           Include your custom knowledge base in AI responses
//                         </p>
//                       </div>
//                       <Switch
//                         checked={config.aiKnowledgeBase || false}
//                         onCheckedChange={(checked) => setConfig({ ...config, aiKnowledgeBase: checked })}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="maxTokens">Max Response Length</Label>
//                       <Input
//                         id="maxTokens"
//                         type="number"
//                         placeholder="150"
//                         value={config.maxTokens || 150}
//                         onChange={(e) => setConfig({ ...config, maxTokens: Number.parseInt(e.target.value) || 150 })}
//                       />
//                       <p className="text-xs text-muted-foreground">Tokens (roughly 0.75 words per token)</p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             )}























//             {/* Add Tag */}
//             {action.type === "add_tag" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Tag Selection</CardTitle>
//                   <CardDescription>Choose a tag to apply to the conversation</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   <Label htmlFor="tag">Tag *</Label>
//                   <Select value={config.tag || ""} onValueChange={(value) => setConfig({ ...config, tag: value })}>
//                     <SelectTrigger id="tag">
//                       <SelectValue placeholder="Select a tag" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {tags.length === 0 ? (
//                         <div className="p-2 text-sm text-muted-foreground">No tags available</div>
//                       ) : (
//                         tags.map((tag) => (
//                           <SelectItem key={tag.id} value={tag.id}>
//                             <div className="flex items-center gap-2">
//                               <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
//                               {tag.name}
//                             </div>
//                           </SelectItem>
//                         ))
//                       )}
//                     </SelectContent>
//                   </Select>
//                   {tags.length === 0 && (
//                     <p className="text-xs text-muted-foreground">Create tags first in the Tags section</p>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             {/* Delay */}
//             {action.type === "delay" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Delay Duration</CardTitle>
//                   <CardDescription>Set how long to wait before the next action</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-3 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="days">Days</Label>
//                       <Input
//                         id="days"
//                         type="number"
//                         min="0"
//                         placeholder="0"
//                         value={config.delayDays || ""}
//                         onChange={(e) => setConfig({ ...config, delayDays: Number.parseInt(e.target.value) || 0 })}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="hours">Hours</Label>
//                       <Input
//                         id="hours"
//                         type="number"
//                         min="0"
//                         max="23"
//                         placeholder="0"
//                         value={config.delayHours || ""}
//                         onChange={(e) => setConfig({ ...config, delayHours: Number.parseInt(e.target.value) || 0 })}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="minutes">Minutes</Label>
//                       <Input
//                         id="minutes"
//                         type="number"
//                         min="0"
//                         max="59"
//                         placeholder="0"
//                         value={config.delayMinutes || ""}
//                         onChange={(e) => setConfig({ ...config, delayMinutes: Number.parseInt(e.target.value) || 0 })}
//                       />
//                     </div>
//                   </div>
//                   <p className="mt-3 text-sm text-muted-foreground">
//                     Total delay:{" "}
//                     {(config.delayDays || 0) * 24 * 60 + (config.delayHours || 0) * 60 + (config.delayMinutes || 0)}{" "}
//                     minutes
//                   </p>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Conditional Branch */}
//             {action.type === "condition" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Conditional Logic</CardTitle>
//                   <CardDescription>Create IF/THEN/ELSE branches based on conditions</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <ConditionBuilder
//                     conditionGroups={config.conditionGroups || []}
//                     onChange={(groups) => setConfig({ ...config, conditionGroups: groups })}
//                   />
//                 </CardContent>
//               </Card>
//             )}

//             {/* Human Handoff */}
//             {action.type === "human_handoff" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Human Handoff</CardTitle>
//                   <CardDescription>Transfer conversation to live agent</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="rounded-lg border bg-muted/50 p-4">
//                     <p className="text-sm text-muted-foreground">
//                       When this action is triggered, the conversation will be flagged for human review and removed from
//                       automation. You can add a notification message to alert your team.
//                     </p>
//                   </div>
//                   <div className="mt-4 space-y-2">
//                     <Label htmlFor="handoffMessage">Handoff Message (optional)</Label>
//                     <Textarea
//                       id="handoffMessage"
//                       placeholder="A team member will be with you shortly..."
//                       value={config.message || ""}
//                       onChange={(e) => setConfig({ ...config, message: e.target.value })}
//                       rows={3}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Webhook */}
//             {action.type === "webhook" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-base">Webhook Configuration</CardTitle>
//                   <CardDescription>Send data to external services</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="webhookUrl">Webhook URL *</Label>
//                     <Input
//                       id="webhookUrl"
//                       placeholder="https://api.example.com/webhook"
//                       value={config.webhookUrl || ""}
//                       onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="method">HTTP Method</Label>
//                     <Select
//                       value={config.webhookMethod || "POST"}
//                       onValueChange={(value) => setConfig({ ...config, webhookMethod: value as "GET" | "POST" })}
//                     >
//                       <SelectTrigger id="method">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="GET">GET</SelectItem>
//                         <SelectItem value="POST">POST</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="webhookBody">Request Body (JSON)</Label>
//                     <Textarea
//                       id="webhookBody"
//                       placeholder='{"event": "automation_triggered", "user": "{username}"}'
//                       value={config.webhookBody || ""}
//                       onChange={(e) => setConfig({ ...config, webhookBody: e.target.value })}
//                       rows={6}
//                       className="font-mono text-sm"
//                     />
//                     <p className="text-xs text-muted-foreground">
//                       You can use variables like {"{username}"}, {"{message}"}, etc.
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </ScrollArea>

//         <DialogFooter className="border-t border-border/50 px-6 py-4">
//           <div className="flex w-full gap-3">
//             <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
//               Cancel
//             </Button>
//             <Button onClick={handleSave} className="flex-1 shadow-sm">
//               Save Action
//             </Button>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }










"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ACTION_TYPES, AI_TONES, AVAILABLE_VARIABLES } from "@/lib/constants/utomation-constants"
import type { ActionConfig as ActionConfigType } from "@/lib/types/automation"
import { ConditionBuilder } from "./condition-builder"
import { Plus, Info, Book, CheckCircle, ShoppingCart, Sparkles } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CarouselImageUploader } from "./carousel-image-uploader"
import { ImageUploadWithLibrary } from "./image-upload-with-library"
import React from "react"

interface ActionConfigModalProps {
  open: boolean
  onClose: () => void
  action: ActionConfigType
  onSave: (action: ActionConfigType) => void
  tags: any[]
}

export function ActionConfigModal({ open, onClose, action, onSave, tags }: ActionConfigModalProps) {
  const [config, setConfig] = useState(action.config)
  const actionInfo = ACTION_TYPES[action.type]

  const handleSave = () => {
    onSave({ ...action, config })
    onClose()
  }

  const insertVariable = (variable: string, field: "message" | "aiInstructions") => {
    const currentValue = config[field] || ""
    const textarea = document.querySelector(`textarea[data-field="${field}"]`) as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = currentValue.slice(0, start) + variable + currentValue.slice(end)
      setConfig({ ...config, [field]: newValue })

      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + variable.length, start + variable.length)
      }, 0)
    } else {
      setConfig({ ...config, [field]: currentValue + variable })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              {React.createElement(actionInfo.icon, { className: "h-5 w-5 text-primary" })}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                {actionInfo.label}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{actionInfo.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DialogTitle>
              <DialogDescription className="mt-1">{actionInfo.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-6 max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Send Message */}
            {action.type === "send_message" && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Message Content</CardTitle>
                  <CardDescription>Compose your automated message</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      data-field="message"
                      placeholder="Hi {first_name}! Thanks for reaching out..."
                      value={config.message || ""}
                      onChange={(e) => setConfig({ ...config, message: e.target.value })}
                      rows={6}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">{(config.message || "").length} characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Insert Variables</Label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_VARIABLES.map((variable) => (
                        <Button
                          key={variable.value}
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => insertVariable(variable.value, "message")}
                          className="border-border/50 hover:border-primary/30"
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          {variable.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Send Image */}
            {action.type === "send_image" && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Image Settings</CardTitle>
                  <CardDescription>Upload or select an image from your library</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Image *</Label>
                    <ImageUploadWithLibrary
                      value={config.imageUrl || ""}
                      onChange={(url) => setConfig({ ...config, imageUrl: url })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageCaption">Caption (optional)</Label>
                    <Textarea
                      id="imageCaption"
                      placeholder="Add a caption to your image..."
                      value={config.message || ""}
                      onChange={(e) => setConfig({ ...config, message: e.target.value })}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Send Carousel */}
            {action.type === "send_carousel" && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Carousel Images</CardTitle>
                  <CardDescription>Upload and arrange multiple images (2-10 images)</CardDescription>
                </CardHeader>
                <CardContent>
                  <CarouselImageUploader
                    images={
                      config.carouselImages?.map((url: string, index: number) => ({
                        id: `img-${index}`,
                        url,
                      })) || []
                    }
                    onImagesChange={(images) => {
                      setConfig({
                        ...config,
                        carouselImages: images.map((img) => img.url),
                      })
                    }}
                    maxImages={10}
                  />
                </CardContent>
              </Card>
            )}

            {/* Reply to Comment */}
            {action.type === "reply_to_comment" && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Comment Reply</CardTitle>
                  <CardDescription>Configure your automated comment reply</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reply">Reply Message *</Label>
                    <Textarea
                      id="reply"
                      data-field="message"
                      placeholder="Thanks for your comment! Check your DMs..."
                      value={config.message || ""}
                      onChange={(e) => setConfig({ ...config, message: e.target.value })}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">Keep replies short and engaging</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Insert Variables</Label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_VARIABLES.map((variable) => (
                        <Button
                          key={variable.value}
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => insertVariable(variable.value, "message")}
                          className="border-border/50 hover:border-primary/30"
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          {variable.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hide Comment */}
            {action.type === "hide_comment" && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Comment Moderation</CardTitle>
                  <CardDescription>Control comment visibility</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Hide Comment</Label>
                      <p className="text-sm text-muted-foreground">Hide offensive or spam comments automatically</p>
                    </div>
                    <Switch
                      checked={config.shouldHide !== false}
                      onCheckedChange={(checked) => setConfig({ ...config, shouldHide: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}



















        {/* AI Response - REVOLUTIONARY VERSION */}
        {action.type === "ai_response" && (
          <div className="space-y-4">
            {/* Quick Setup Wizard */}
            <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">AI Commerce Mode</CardTitle>
                    <CardDescription>
                      Enable full commerce features with one click
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-white dark:bg-black/20 rounded-lg">
                  <div>
                    <Label className="font-medium">Enable AI Commerce</Label>
                    <p className="text-sm text-muted-foreground">
                      Payments, bookings, product catalog, and CRM sync
                    </p>
                  </div>
                  <Switch
                    checked={config.enableCommerce || false}
                    onCheckedChange={(checked) => setConfig({ 
                      ...config, 
                      enableCommerce: checked,
                      enablePayments: checked,
                      enableProductCatalog: checked,
                      enableAppointments: checked,
                      mcpEnabled: checked
                    })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tone & Personality */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">AI Personality</CardTitle>
                <CardDescription>How should AI communicate with customers?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tone">Conversation Tone *</Label>
                  <Select
                    value={config.tone || "professional"}
                    onValueChange={(value) => setConfig({ ...config, tone: value })}
                  >
                    <SelectTrigger id="tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_TONES.map((tone) => (
                        <SelectItem key={tone.value} value={tone.value}>
                          {tone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">System Prompt (optional)</Label>
                  <Textarea
                    id="systemPrompt"
                    placeholder="You are a helpful sales assistant for [Your Brand]..."
                    value={config.systemPrompt || ""}
                    onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                    rows={4}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Override the default AI personality
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Custom Instructions</Label>
                  <Textarea
                    id="instructions"
                    data-field="aiInstructions"
                    placeholder="e.g., Always suggest related products, keep responses under 50 words..."
                    value={config.aiInstructions || ""}
                    onChange={(e) => setConfig({ ...config, aiInstructions: e.target.value })}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Commerce Features - Only show if enabled */}
            {config.enableCommerce && (
              <Card className="border-green-500/20 bg-green-50/50 dark:bg-green-950/10">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-base">Commerce Features</CardTitle>
                  </div>
                  <CardDescription>
                    AI can now handle the full customer journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 bg-white dark:bg-black/20 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Browse Products</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-white dark:bg-black/20 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Process Payments</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-white dark:bg-black/20 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Book Appointments</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-white dark:bg-black/20 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Update CRM</span>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="maxOrderValue">Max Order Value (Security)</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">$</span>
                      <Input
                        id="maxOrderValue"
                        type="number"
                        placeholder="5000"
                        value={(config.maxOrderValue || 500000) / 100}
                        onChange={(e) => setConfig({ 
                          ...config, 
                          maxOrderValue: parseFloat(e.target.value || "0") * 100 
                        })}
                        className="max-w-[150px]"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Orders above this require manual approval
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-black/20 rounded-lg mt-3">
                    <div>
                      <Label className="text-sm">Require Payment Confirmation</Label>
                      <p className="text-xs text-muted-foreground">
                        AI asks "Confirm payment?" before processing
                      </p>
                    </div>
                    <Switch
                      checked={config.requirePaymentConfirmation !== false}
                      onCheckedChange={(checked) => setConfig({ 
                        ...config, 
                        requirePaymentConfirmation: checked 
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Knowledge Base */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Knowledge Base</CardTitle>
                <CardDescription>Give AI access to your business information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Use Knowledge Base</Label>
                    <p className="text-sm text-muted-foreground">
                      Include FAQs, policies, and product info
                    </p>
                  </div>
                  <Switch
                    checked={config.aiKnowledgeBase || false}
                    onCheckedChange={(checked) => setConfig({ ...config, aiKnowledgeBase: checked })}
                  />
                </div>

                {config.aiKnowledgeBase && (
                  <div className="p-4 border border-dashed rounded-lg text-center space-y-2">
                    <Book className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">Upload Knowledge Documents</p>
                    <p className="text-xs text-muted-foreground">
                      PDFs, docs, or text files with product info and FAQs
                    </p>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Documents
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Behavior & Safety */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Behavior & Safety</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxTokens">Max Response Length</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      placeholder="500"
                      value={config.maxTokens || 500}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        maxTokens: Number.parseInt(e.target.value) || 500 
                      })}
                    />
                    <p className="text-xs text-muted-foreground">Tokens (~0.75 words each)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxTurns">Max Conversation Turns</Label>
                    <Input
                      id="maxTurns"
                      type="number"
                      placeholder="10"
                      value={config.maxTurns || 10}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        maxTurns: Number.parseInt(e.target.value) || 10 
                      })}
                    />
                    <p className="text-xs text-muted-foreground">Before human handoff</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Auto Handoff</Label>
                    <p className="text-sm text-muted-foreground">
                      Transfer to human if customer is frustrated
                    </p>
                  </div>
                  <Switch
                    checked={config.autoHandoff !== false}
                    onCheckedChange={(checked) => setConfig({ ...config, autoHandoff: checked })}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Conversation History</Label>
                    <p className="text-sm text-muted-foreground">
                      Remember previous messages
                    </p>
                  </div>
                  <Switch
                    checked={config.useConversationHistory !== false}
                    onCheckedChange={(checked) => setConfig({ 
                      ...config, 
                      useConversationHistory: checked 
                    })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Success Banner */}
            {config.enableCommerce && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">AI Commerce Enabled!</p>
                    <p className="text-sm text-white/90">
                      Your AI can now handle sales, bookings, and customer support end-to-end
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}




















            {/* Add Tag */}
            {action.type === "add_tag" && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Tag Selection</CardTitle>
                  <CardDescription>Choose a tag to apply to the conversation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label htmlFor="tag">Tag *</Label>
                  <Select value={config.tag || ""} onValueChange={(value) => setConfig({ ...config, tag: value })}>
                    <SelectTrigger id="tag">
                      <SelectValue placeholder="Select a tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {tags.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">No tags available</div>
                      ) : (
                        tags.map((tag) => (
                          <SelectItem key={tag.id} value={tag.id}>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
                              {tag.name}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {tags.length === 0 && (
                    <p className="text-xs text-muted-foreground">Create tags first in the Tags section</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Delay */}
            {action.type === "delay" && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Delay Duration</CardTitle>
                  <CardDescription>Set how long to wait before the next action</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="days">Days</Label>
                      <Input
                        id="days"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={config.delayDays || ""}
                        onChange={(e) => setConfig({ ...config, delayDays: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hours">Hours</Label>
                      <Input
                        id="hours"
                        type="number"
                        min="0"
                        max="23"
                        placeholder="0"
                        value={config.delayHours || ""}
                        onChange={(e) => setConfig({ ...config, delayHours: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minutes">Minutes</Label>
                      <Input
                        id="minutes"
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        value={config.delayMinutes || ""}
                        onChange={(e) => setConfig({ ...config, delayMinutes: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Total delay:{" "}
                    {(config.delayDays || 0) * 24 * 60 + (config.delayHours || 0) * 60 + (config.delayMinutes || 0)}{" "}
                    minutes
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Conditional Branch */}
            {action.type === "condition" && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Conditional Logic</CardTitle>
                  <CardDescription>Create IF/THEN/ELSE branches based on conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ConditionBuilder
                    conditionGroups={config.conditionGroups || []}
                    onChange={(groups) => setConfig({ ...config, conditionGroups: groups })}
                  />
                </CardContent>
              </Card>
            )}

            {/* Human Handoff */}
            {action.type === "human_handoff" && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Human Handoff</CardTitle>
                  <CardDescription>Transfer conversation to live agent</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                      When this action is triggered, the conversation will be flagged for human review and removed from
                      automation. You can add a notification message to alert your team.
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="handoffMessage">Handoff Message (optional)</Label>
                    <Textarea
                      id="handoffMessage"
                      placeholder="A team member will be with you shortly..."
                      value={config.message || ""}
                      onChange={(e) => setConfig({ ...config, message: e.target.value })}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Webhook */}
            {action.type === "webhook" && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Webhook Configuration</CardTitle>
                  <CardDescription>Send data to external services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL *</Label>
                    <Input
                      id="webhookUrl"
                      placeholder="https://api.example.com/webhook"
                      value={config.webhookUrl || ""}
                      onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="method">HTTP Method</Label>
                    <Select
                      value={config.webhookMethod || "POST"}
                      onValueChange={(value) => setConfig({ ...config, webhookMethod: value as "GET" | "POST" })}
                    >
                      <SelectTrigger id="method">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhookBody">Request Body (JSON)</Label>
                    <Textarea
                      id="webhookBody"
                      placeholder='{"event": "automation_triggered", "user": "{username}"}'
                      value={config.webhookBody || ""}
                      onChange={(e) => setConfig({ ...config, webhookBody: e.target.value })}
                      rows={6}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      You can use variables like {"{username}"}, {"{message}"}, etc.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="border-t border-border/50 px-6 py-4">
          <div className="flex w-full gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 shadow-sm">
              Save Action
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
