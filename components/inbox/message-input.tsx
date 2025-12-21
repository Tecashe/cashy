// "use client"

// import type React from "react"

// import { useState, useTransition, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Send, Loader2, FileText, ImageIcon, Video, Mic, X, AlertTriangle, Clock } from "lucide-react"
// import { sendMessageToInstagram, uploadMessageAttachment } from "@/actions/message-actions"
// import { getMessageTemplates, updateTemplateUsage } from "@/actions/inbox-actions"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// interface EnhancedMessageInputProps {
//   conversationId: string
//   userId: string
//   lastCustomerMessageAt?: Date | null
//   onMessageSent?: () => void
// }

// type MessageType = "text" | "image" | "video" | "audio" | "carousel"

// export function EnhancedMessageInput({
//   conversationId,
//   userId,
//   lastCustomerMessageAt,
//   onMessageSent,
// }: EnhancedMessageInputProps) {
//   const [message, setMessage] = useState("")
//   const [isPending, startTransition] = useTransition()
//   const [templates, setTemplates] = useState<any[]>([])
//   const [showTemplates, setShowTemplates] = useState(false)
//   const [messageType, setMessageType] = useState<MessageType>("text")
//   const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
//   const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null)
//   const [isUploading, setIsUploading] = useState(false)

//   const textareaRef = useRef<HTMLTextAreaElement>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const isWithinMessagingWindow = lastCustomerMessageAt
//     ? (Date.now() - new Date(lastCustomerMessageAt).getTime()) / (1000 * 60 * 60) < 24
//     : false

//   const hoursRemaining = lastCustomerMessageAt
//     ? Math.max(0, 24 - (Date.now() - new Date(lastCustomerMessageAt).getTime()) / (1000 * 60 * 60))
//     : 0

//   useEffect(() => {
//     const loadTemplates = async () => {
//       const result = await getMessageTemplates(userId)
//       if (result.success && result.templates) {
//         setTemplates(result.templates)
//       }
//     }
//     loadTemplates()
//   }, [userId])

//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto"
//       textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
//     }
//   }, [message])

//   const handleFileSelect = (type: "image" | "video" | "audio") => {
//     setMessageType(type)
//     fileInputRef.current?.click()
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     setAttachmentFile(file)

//     // Create preview for images and videos
//     if (messageType === "image" || messageType === "video") {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setAttachmentPreview(reader.result as string)
//       }
//       reader.readAsDataURL(file)
//     } else {
//       setAttachmentPreview(file.name)
//     }
//   }

//   const clearAttachment = () => {
//     setAttachmentFile(null)
//     setAttachmentPreview(null)
//     setMessageType("text")
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""
//     }
//   }

//   const handleSend = async () => {
//     if (messageType === "text" && !message.trim()) return
//     if (messageType !== "text" && !attachmentFile) return
//     if (isPending) return

//     if (!isWithinMessagingWindow) {
//       toast.error("Cannot send message outside 24-hour window", {
//         description: "The customer needs to send you a message first before you can reply.",
//       })
//       return
//     }

//     startTransition(async () => {
//       try {
//         let attachmentUrl: string | undefined

//         // Upload attachment if present
//         if (attachmentFile && messageType !== "text") {
//           setIsUploading(true)
//           const formData = new FormData()
//           formData.append("file", attachmentFile)

//           const uploadResult = await uploadMessageAttachment(formData, messageType as "image" | "video" | "audio")

//           if (!uploadResult.success) {
//             toast.error(uploadResult.error || "Failed to upload file")
//             setIsUploading(false)
//             return
//           }

//           attachmentUrl = uploadResult.url
//           setIsUploading(false)
//         }

//         // Send message
//         const result = await sendMessageToInstagram({
//           conversationId,
//           content: message.trim() || `Sent ${messageType}`,
//           messageType,
//           attachmentUrl,
//         })

//         if (result.success) {
//           setMessage("")
//           clearAttachment()
//           onMessageSent?.()
//           toast.success("Message sent successfully")
//         } else {
//           if (result.code === "MESSAGING_WINDOW_EXCEEDED" || result.code === "NO_CUSTOMER_MESSAGE") {
//             toast.error(result.error, {
//               description: "Instagram only allows messages within 24 hours of customer contact.",
//             })
//           } else if (result.code === "RATE_LIMIT_WARNING") {
//             toast.warning(result.error)
//           } else {
//             toast.error(result.error || "Failed to send message")
//           }
//         }
//       } catch (error) {
//         console.error("[v0] Error sending message:", error)
//         toast.error("An unexpected error occurred")
//       }
//     })
//   }

//   const handleUseTemplate = (template: any) => {
//     setMessage(template.content)
//     setShowTemplates(false)
//     textareaRef.current?.focus()
//     updateTemplateUsage(template.id)
//   }

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       handleSend()
//     }
//   }

//   const messageTypeButtons = [
//     { type: "image" as const, icon: ImageIcon, label: "Image", accept: "image/*" },
//     { type: "video" as const, icon: Video, label: "Video", accept: "video/*" },
//     { type: "audio" as const, icon: Mic, label: "Audio", accept: "audio/*" },
//   ]

//   return (
//     <div className="p-4 bg-background/50 backdrop-blur-xl">
//       {!isWithinMessagingWindow && (
//         <Alert variant="destructive" className="mb-4">
//           <AlertTriangle className="h-4 w-4" />
//           <AlertDescription>
//             {!lastCustomerMessageAt
//               ? "Cannot send messages. The customer must initiate the conversation first."
//               : "24-hour messaging window expired. Wait for the customer to send a new message."}
//           </AlertDescription>
//         </Alert>
//       )}

//       {isWithinMessagingWindow && hoursRemaining < 2 && (
//         <Alert className="mb-4 border-orange-500/50 bg-orange-500/10">
//           <Clock className="h-4 w-4 text-orange-500" />
//           <AlertDescription className="text-orange-700 dark:text-orange-300">
//             Messaging window expires in {Math.floor(hoursRemaining)} hours {Math.floor((hoursRemaining % 1) * 60)}{" "}
//             minutes
//           </AlertDescription>
//         </Alert>
//       )}

//       <Card className="shadow-lg border-border/50 overflow-hidden backdrop-blur-sm bg-card/95">
//         {/* Attachment preview */}
//         {attachmentPreview && (
//           <div className="p-3 border-b border-border bg-muted/30">
//             <div className="flex items-start gap-3">
//               {(messageType === "image" || messageType === "video") && (
//                 <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
//                   <img
//                     src={attachmentPreview || "/placeholder.svg"}
//                     alt="Preview"
//                     className="w-full h-full object-cover"
//                   />
//                   {messageType === "video" && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//                       <Video className="h-8 w-8 text-white" />
//                     </div>
//                   )}
//                 </div>
//               )}
//               {messageType === "audio" && (
//                 <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
//                   <Mic className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm text-muted-foreground">{attachmentPreview}</span>
//                 </div>
//               )}
//               <div className="flex-1">
//                 <div className="flex items-center justify-between">
//                   <Badge variant="secondary" className="text-xs">
//                     {messageType}
//                   </Badge>
//                   <Button variant="ghost" size="icon" className="h-6 w-6" onClick={clearAttachment}>
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   {attachmentFile && `${(attachmentFile.size / 1024 / 1024).toFixed(2)} MB`}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex gap-2 items-end p-3">
//           {/* Templates button */}
//           {templates.length > 0 && (
//             <Popover open={showTemplates} onOpenChange={setShowTemplates}>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0"
//                 >
//                   <FileText className="h-4 w-4" />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-80 p-0" align="start" side="top">
//                 <div className="p-3 border-b border-border">
//                   <h4 className="font-semibold text-sm">Quick Reply Templates</h4>
//                   <p className="text-xs text-muted-foreground mt-0.5">Click to insert a template</p>
//                 </div>
//                 <ScrollArea className="h-[300px]">
//                   <div className="p-2 space-y-1">
//                     {templates.map((template) => (
//                       <button
//                         key={template.id}
//                         onClick={() => handleUseTemplate(template)}
//                         className="w-full text-left p-3 rounded-lg hover:bg-accent/50 transition-colors group"
//                       >
//                         <div className="flex items-start justify-between gap-2 mb-1">
//                           <h5 className="font-medium text-sm group-hover:text-primary transition-colors">
//                             {template.title}
//                           </h5>
//                           {template.category && (
//                             <Badge variant="outline" className="text-xs shrink-0">
//                               {template.category}
//                             </Badge>
//                           )}
//                         </div>
//                         <p className="text-xs text-muted-foreground line-clamp-2">{template.content}</p>
//                       </button>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               </PopoverContent>
//             </Popover>
//           )}

//           {/* Media type buttons */}
//           {messageTypeButtons.map(({ type, icon: Icon, label, accept }) => (
//             <Button
//               key={type}
//               variant="ghost"
//               size="icon"
//               className={cn(
//                 "h-9 w-9 shrink-0",
//                 messageType === type ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
//               )}
//               onClick={() => handleFileSelect(type)}
//               title={label}
//             >
//               <Icon className="h-4 w-4" />
//             </Button>
//           ))}

//           {/* Hidden file input */}
//           <input
//             ref={fileInputRef}
//             type="file"
//             className="hidden"
//             accept={messageTypeButtons.find((b) => b.type === messageType)?.accept}
//             onChange={handleFileChange}
//           />

//           {/* Message textarea */}
//           <div className="flex-1 relative group">
//             <Textarea
//               ref={textareaRef}
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder={attachmentFile ? "Add a caption (optional)..." : "Type your message..."}
//               className="resize-none min-h-[52px] max-h-[160px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-2 scrollbar-thin"
//               disabled={isPending || isUploading}
//               rows={1}
//             />
//           </div>

//           {/* Send button */}
//           <Button
//             onClick={handleSend}
//             disabled={
//               !isWithinMessagingWindow ||
//               (messageType === "text" && !message.trim()) ||
//               (messageType !== "text" && !attachmentFile) ||
//               isPending ||
//               isUploading
//             }
//             size="icon"
//             className={cn(
//               "h-10 w-10 shrink-0 transition-all duration-200 shadow-sm",
//               ((messageType === "text" && message.trim()) || (messageType !== "text" && attachmentFile)) &&
//                 !isPending &&
//                 !isUploading &&
//                 isWithinMessagingWindow &&
//                 "scale-105 shadow-md shadow-primary/20",
//             )}
//           >
//             {isPending || isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//           </Button>
//         </div>

//         {/* Footer */}
//         <div className="px-3 py-2 bg-muted/30 border-t border-border/50 flex items-center justify-between">
//           <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
//             {isUploading ? (
//               <span className="flex items-center gap-1">
//                 <Loader2 className="h-3 w-3 animate-spin" />
//                 Uploading...
//               </span>
//             ) : (
//               <>
//                 <kbd className="px-1.5 py-0.5 text-xs bg-background rounded border border-border font-mono shadow-sm">
//                   Enter
//                 </kbd>
//                 <span>to send</span>
//                 <span className="text-border">•</span>
//                 <kbd className="px-1.5 py-0.5 text-xs bg-background rounded border border-border font-mono shadow-sm">
//                   Shift + Enter
//                 </kbd>
//                 <span>for new line</span>
//               </>
//             )}
//           </p>
//           <div className="flex items-center gap-2">
//             {attachmentFile && (
//               <Badge variant="secondary" className="text-xs">
//                 {messageType}
//               </Badge>
//             )}
//             {templates.length > 0 && (
//               <Badge variant="secondary" className="text-xs">
//                 {templates.length} templates
//               </Badge>
//             )}
//           </div>
//         </div>
//       </Card>
//     </div>
//   )
// }

// "use client"

// import type React from "react"

// import { useState, useTransition, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Send, Loader2, FileText, ImageIcon, Video, Mic, X, AlertTriangle, Clock, MicOff } from "lucide-react"
// import { sendMessageToInstagram, uploadMessageAttachment } from "@/actions/message-actions"
// import { getMessageTemplates, updateTemplateUsage } from "@/actions/inbox-actions"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// interface EnhancedMessageInputProps {
//   conversationId: string
//   userId: string
//   lastCustomerMessageAt?: Date | null
//   onMessageSent?: () => void
// }

// type MessageType = "text" | "image" | "video" | "audio" | "carousel"

// export function EnhancedMessageInput({
//   conversationId,
//   userId,
//   lastCustomerMessageAt,
//   onMessageSent,
// }: EnhancedMessageInputProps) {
//   const [message, setMessage] = useState("")
//   const [isPending, startTransition] = useTransition()
//   const [templates, setTemplates] = useState<any[]>([])
//   const [showTemplates, setShowTemplates] = useState(false)
//   const [messageType, setMessageType] = useState<MessageType>("text")
//   const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
//   const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null)
//   const [isUploading, setIsUploading] = useState(false)
//   const [isRecording, setIsRecording] = useState(false)
//   const [recordingTime, setRecordingTime] = useState(0)
//   const textareaRef = useRef<HTMLTextAreaElement>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null)
//   const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

//   const isWithinMessagingWindow = lastCustomerMessageAt
//     ? (Date.now() - new Date(lastCustomerMessageAt).getTime()) / (1000 * 60 * 60) < 24
//     : false

//   const hoursRemaining = lastCustomerMessageAt
//     ? Math.max(0, 24 - (Date.now() - new Date(lastCustomerMessageAt).getTime()) / (1000 * 60 * 60))
//     : 0

//   useEffect(() => {
//     const loadTemplates = async () => {
//       const result = await getMessageTemplates(userId)
//       if (result.success && result.templates) {
//         setTemplates(result.templates)
//       }
//     }
//     loadTemplates()
//   }, [userId])

//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto"
//       textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
//     }
//   }, [message])

//   const handleFileSelect = (type: "image" | "video" | "audio") => {
//     setMessageType(type)
//     fileInputRef.current?.click()
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     setAttachmentFile(file)

//     // Create preview for images and videos
//     if (messageType === "image" || messageType === "video") {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setAttachmentPreview(reader.result as string)
//       }
//       reader.readAsDataURL(file)
//     } else {
//       setAttachmentPreview(file.name)
//     }
//   }

//   const clearAttachment = () => {
//     setAttachmentFile(null)
//     setAttachmentPreview(null)
//     setMessageType("text")
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""
//     }
//   }

//   const handleSend = async () => {
//     if (messageType === "text" && !message.trim()) return
//     if (messageType !== "text" && !attachmentFile) return
//     if (isPending) return

//     if (!isWithinMessagingWindow) {
//       toast.error("Cannot send message outside 24-hour window", {
//         description: "The customer needs to send you a message first before you can reply.",
//       })
//       return
//     }

//     startTransition(async () => {
//       try {
//         let attachmentUrl: string | undefined

//         // Upload attachment if present
//         if (attachmentFile && messageType !== "text") {
//           setIsUploading(true)
//           const formData = new FormData()
//           formData.append("file", attachmentFile)

//           const uploadResult = await uploadMessageAttachment(formData, messageType as "image" | "video" | "audio")

//           if (!uploadResult.success) {
//             toast.error(uploadResult.error || "Failed to upload file")
//             setIsUploading(false)
//             return
//           }

//           attachmentUrl = uploadResult.url
//           setIsUploading(false)
//         }

//         // Send message
//         const result = await sendMessageToInstagram({
//           conversationId,
//           content: message.trim() || `Sent ${messageType}`,
//           messageType,
//           attachmentUrl,
//         })

//         if (result.success) {
//           setMessage("")
//           clearAttachment()
//           onMessageSent?.()
//           toast.success("Message sent successfully")
//         } else {
//           if (result.code === "MESSAGING_WINDOW_EXCEEDED" || result.code === "NO_CUSTOMER_MESSAGE") {
//             toast.error(result.error, {
//               description: "Instagram only allows messages within 24 hours of customer contact.",
//             })
//           } else if (result.code === "RATE_LIMIT_WARNING") {
//             toast.warning(result.error)
//           } else {
//             toast.error(result.error || "Failed to send message")
//           }
//         }
//       } catch (error) {
//         console.error("[v0] Error sending message:", error)
//         toast.error("An unexpected error occurred")
//       }
//     })
//   }

//   const handleUseTemplate = (template: any) => {
//     setMessage(template.content)
//     setShowTemplates(false)
//     textareaRef.current?.focus()
//     updateTemplateUsage(template.id)
//   }

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       handleSend()
//     }
//   }

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//       const mediaRecorder = new MediaRecorder(stream)
//       mediaRecorderRef.current = mediaRecorder

//       const audioChunks: Blob[] = []
//       mediaRecorder.addEventListener("dataavailable", (event) => {
//         audioChunks.push(event.data)
//       })

//       mediaRecorder.addEventListener("stop", () => {
//         const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
//         const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { type: "audio/webm" })
//         setAttachmentFile(audioFile)
//         setAttachmentPreview(`Voice recording (${recordingTime}s)`)
//         setMessageType("audio")

//         // Stop all tracks
//         stream.getTracks().forEach((track) => track.stop())
//       })

//       mediaRecorder.start()
//       setIsRecording(true)
//       setRecordingTime(0)

//       recordingIntervalRef.current = setInterval(() => {
//         setRecordingTime((prev) => prev + 1)
//       }, 1000)

//       toast.success("Recording started")
//     } catch (error) {
//       console.error("[v0] Error starting recording:", error)
//       toast.error("Could not access microphone")
//     }
//   }

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop()
//       setIsRecording(false)
//       if (recordingIntervalRef.current) {
//         clearInterval(recordingIntervalRef.current)
//       }
//       toast.success("Recording stopped")
//     }
//   }

//   useEffect(() => {
//     return () => {
//       if (recordingIntervalRef.current) {
//         clearInterval(recordingIntervalRef.current)
//       }
//     }
//   }, [])

//   const messageTypeButtons = [
//     { type: "image" as const, icon: ImageIcon, label: "Image", accept: "image/*" },
//     { type: "video" as const, icon: Video, label: "Video", accept: "video/*" },
//     { type: "audio" as const, icon: Mic, label: "Audio", accept: "audio/*" },
//   ]

//   return (
//     <div className="p-3 md:p-4 bg-background/50 backdrop-blur-xl">
//       {!isWithinMessagingWindow && (
//         <Alert variant="destructive" className="mb-4">
//           <AlertTriangle className="h-4 w-4" />
//           <AlertDescription>
//             {!lastCustomerMessageAt
//               ? "Cannot send messages. The customer must initiate the conversation first."
//               : "24-hour messaging window expired. Wait for the customer to send a new message."}
//           </AlertDescription>
//         </Alert>
//       )}

//       {isWithinMessagingWindow && hoursRemaining < 2 && (
//         <Alert className="mb-4 border-orange-500/50 bg-orange-500/10">
//           <Clock className="h-4 w-4 text-orange-500" />
//           <AlertDescription className="text-orange-700 dark:text-orange-300">
//             Messaging window expires in {Math.floor(hoursRemaining)} hours {Math.floor((hoursRemaining % 1) * 60)}{" "}
//             minutes
//           </AlertDescription>
//         </Alert>
//       )}

//       {isRecording && (
//         <Alert className="mb-4 border-red-500/50 bg-red-500/10">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
//               <span className="text-red-700 dark:text-red-300 font-medium text-sm">Recording: {recordingTime}s</span>
//             </div>
//             <Button variant="destructive" size="sm" onClick={stopRecording}>
//               <MicOff className="h-4 w-4 mr-2" />
//               Stop Recording
//             </Button>
//           </div>
//         </Alert>
//       )}

//       <Card className="shadow-lg border-border/50 overflow-hidden backdrop-blur-sm bg-card/95">
//         {/* Attachment preview */}
//         {attachmentPreview && (
//           <div className="p-3 border-b border-border bg-muted/30">
//             <div className="flex items-start gap-3">
//               {(messageType === "image" || messageType === "video") && (
//                 <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
//                   <img
//                     src={attachmentPreview || "/placeholder.svg"}
//                     alt="Preview"
//                     className="w-full h-full object-cover"
//                   />
//                   {messageType === "video" && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//                       <Video className="h-8 w-8 text-white" />
//                     </div>
//                   )}
//                 </div>
//               )}
//               {messageType === "audio" && (
//                 <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
//                   <Mic className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm text-muted-foreground">{attachmentPreview}</span>
//                 </div>
//               )}
//               <div className="flex-1">
//                 <div className="flex items-center justify-between">
//                   <Badge variant="secondary" className="text-xs">
//                     {messageType}
//                   </Badge>
//                   <Button variant="ghost" size="icon" className="h-6 w-6" onClick={clearAttachment}>
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   {attachmentFile && `${(attachmentFile.size / 1024 / 1024).toFixed(2)} MB`}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex gap-1.5 md:gap-2 items-end p-2 md:p-3">
//           {/* Templates button */}
//           {templates.length > 0 && (
//             <Popover open={showTemplates} onOpenChange={setShowTemplates}>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 md:h-9 md:w-9 text-muted-foreground hover:text-foreground shrink-0"
//                 >
//                   <FileText className="h-3.5 w-3.5 md:h-4 md:w-4" />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-72 md:w-80 p-0" align="start" side="top">
//                 <div className="p-3 border-b border-border">
//                   <h4 className="font-semibold text-sm">Quick Reply Templates</h4>
//                   <p className="text-xs text-muted-foreground mt-0.5">Click to insert a template</p>
//                 </div>
//                 <ScrollArea className="h-[300px]">
//                   <div className="p-2 space-y-1">
//                     {templates.map((template) => (
//                       <button
//                         key={template.id}
//                         onClick={() => handleUseTemplate(template)}
//                         className="w-full text-left p-3 rounded-lg hover:bg-accent/50 transition-colors group"
//                       >
//                         <div className="flex items-start justify-between gap-2 mb-1">
//                           <h5 className="font-medium text-sm group-hover:text-primary transition-colors">
//                             {template.title}
//                           </h5>
//                           {template.category && (
//                             <Badge variant="outline" className="text-xs shrink-0">
//                               {template.category}
//                             </Badge>
//                           )}
//                         </div>
//                         <p className="text-xs text-muted-foreground line-clamp-2">{template.content}</p>
//                       </button>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               </PopoverContent>
//             </Popover>
//           )}

//           {/* Media type buttons */}
//           {messageTypeButtons.map(({ type, icon: Icon, label, accept }) => (
//             <Button
//               key={type}
//               variant="ghost"
//               size="icon"
//               className={cn(
//                 "h-8 w-8 md:h-9 md:w-9 shrink-0",
//                 messageType === type ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
//               )}
//               onClick={() => handleFileSelect(type)}
//               title={label}
//             >
//               <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
//             </Button>
//           ))}

//           <Button
//             variant="ghost"
//             size="icon"
//             className={cn(
//               "h-8 w-8 md:h-9 md:w-9 shrink-0",
//               isRecording ? "text-red-500 bg-red-500/10" : "text-muted-foreground hover:text-foreground",
//             )}
//             onClick={isRecording ? stopRecording : startRecording}
//             title={isRecording ? "Stop Recording" : "Start Voice Recording"}
//           >
//             <Mic className={cn("h-3.5 w-3.5 md:h-4 md:w-4", isRecording && "animate-pulse")} />
//           </Button>

//           {/* Hidden file input */}
//           <input
//             ref={fileInputRef}
//             type="file"
//             className="hidden"
//             accept={messageTypeButtons.find((b) => b.type === messageType)?.accept}
//             onChange={handleFileChange}
//           />

//           {/* Message textarea */}
//           <div className="flex-1 relative group">
//             <Textarea
//               ref={textareaRef}
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder={attachmentFile ? "Add a caption (optional)..." : "Type your message..."}
//               className="resize-none min-h-[48px] md:min-h-[52px] max-h-[160px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-2 scrollbar-thin text-sm"
//               disabled={isPending || isUploading || isRecording}
//               rows={1}
//             />
//           </div>

//           {/* Send button */}
//           <Button
//             onClick={handleSend}
//             disabled={
//               !isWithinMessagingWindow ||
//               (messageType === "text" && !message.trim()) ||
//               (messageType !== "text" && !attachmentFile) ||
//               isPending ||
//               isUploading ||
//               isRecording
//             }
//             size="icon"
//             className={cn(
//               "h-9 w-9 md:h-10 md:w-10 shrink-0 transition-all duration-200 shadow-sm",
//               ((messageType === "text" && message.trim()) || (messageType !== "text" && attachmentFile)) &&
//                 !isPending &&
//                 !isUploading &&
//                 !isRecording &&
//                 isWithinMessagingWindow &&
//                 "scale-105 shadow-md shadow-primary/20",
//             )}
//           >
//             {isPending || isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//           </Button>
//         </div>

//         {/* Footer */}
//         <div className="px-2 md:px-3 py-1.5 md:py-2 bg-muted/30 border-t border-border/50 flex items-center justify-between text-xs md:text-sm">
//           <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
//             {isUploading ? (
//               <span className="flex items-center gap-1">
//                 <Loader2 className="h-3 w-3 animate-spin" />
//                 Uploading...
//               </span>
//             ) : isRecording ? (
//               <span className="flex items-center gap-1 text-red-500">
//                 <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
//                 Recording...
//               </span>
//             ) : (
//               <>
//                 <kbd className="px-1.5 py-0.5 text-xs bg-background rounded border border-border font-mono shadow-sm hidden sm:inline">
//                   Enter
//                 </kbd>
//                 <span className="hidden sm:inline">to send</span>
//                 <span className="text-border hidden md:inline">•</span>
//                 <kbd className="px-1.5 py-0.5 text-xs bg-background rounded border border-border font-mono shadow-sm hidden md:inline">
//                   Shift + Enter
//                 </kbd>
//                 <span className="hidden md:inline">for new line</span>
//               </>
//             )}
//           </p>
//           <div className="flex items-center gap-2">
//             {attachmentFile && (
//               <Badge variant="secondary" className="text-xs">
//                 {messageType}
//               </Badge>
//             )}
//             {templates.length > 0 && (
//               <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
//                 {templates.length} templates
//               </Badge>
//             )}
//           </div>
//         </div>
//       </Card>
//     </div>
//   )
// }
























// "use client"

// import type React from "react"

// import { useState, useTransition, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Send, Loader2, FileText, ImageIcon, Video, Mic, X, AlertTriangle, Clock, MicOff } from "lucide-react"
// import { sendMessageToInstagram, uploadMessageAttachment } from "@/actions/message-actions"
// import { getMessageTemplates, updateTemplateUsage } from "@/actions/inbox-actions"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// interface EnhancedMessageInputProps {
//   conversationId: string
//   userId: string
//   lastCustomerMessageAt?: Date | null
//   onMessageSent?: () => void
// }

// type MessageType = "text" | "image" | "video" | "audio" | "carousel"

// export function EnhancedMessageInput({
//   conversationId,
//   userId,
//   lastCustomerMessageAt,
//   onMessageSent,
// }: EnhancedMessageInputProps) {
//   const [message, setMessage] = useState("")
//   const [isPending, startTransition] = useTransition()
//   const [templates, setTemplates] = useState<any[]>([])
//   const [showTemplates, setShowTemplates] = useState(false)
//   const [messageType, setMessageType] = useState<MessageType>("text")
//   const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
//   const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null)
//   const [isUploading, setIsUploading] = useState(false)
//   const [isRecording, setIsRecording] = useState(false)
//   const [recordingTime, setRecordingTime] = useState(0)
//   const textareaRef = useRef<HTMLTextAreaElement>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null)
//   const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

//   const isWithinMessagingWindow = lastCustomerMessageAt
//     ? (Date.now() - new Date(lastCustomerMessageAt).getTime()) / (1000 * 60 * 60) < 24
//     : false

//   const hoursRemaining = lastCustomerMessageAt
//     ? Math.max(0, 24 - (Date.now() - new Date(lastCustomerMessageAt).getTime()) / (1000 * 60 * 60))
//     : 0

//   useEffect(() => {
//     const loadTemplates = async () => {
//       const result = await getMessageTemplates(userId)
//       if (result.success && result.templates) {
//         setTemplates(result.templates)
//       }
//     }
//     loadTemplates()
//   }, [userId])

//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto"
//       textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
//     }
//   }, [message])

//   const handleFileSelect = (type: "image" | "video" | "audio") => {
//     setMessageType(type)
//     fileInputRef.current?.click()
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     setAttachmentFile(file)

//     // Create preview for images and videos
//     if (messageType === "image" || messageType === "video") {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setAttachmentPreview(reader.result as string)
//       }
//       reader.readAsDataURL(file)
//     } else {
//       setAttachmentPreview(file.name)
//     }
//   }

//   const clearAttachment = () => {
//     setAttachmentFile(null)
//     setAttachmentPreview(null)
//     setMessageType("text")
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""
//     }
//   }

//   const handleSend = async () => {
//     if (messageType === "text" && !message.trim()) return
//     if (messageType !== "text" && !attachmentFile) return
//     if (isPending) return

//     if (!isWithinMessagingWindow) {
//       toast.warning(
//         "Warning: 24-hour messaging window expired. Instagram may not deliver this message unless the customer sends a new message first.",
//         {
//           description: "Instagram only allows messages within 24 hours of customer contact.",
//         },
//       )
//     }

//     if (!lastCustomerMessageAt) {
//       toast.warning(
//         "Warning: No customer message detected yet. Make sure the customer has initiated the conversation on Instagram before sending messages.",
//         {
//           description: "The customer must initiate the conversation first.",
//         },
//       )
//     }

//     startTransition(async () => {
//       try {
//         let attachmentUrl: string | undefined

//         // Upload attachment if present
//         if (attachmentFile && messageType !== "text") {
//           setIsUploading(true)
//           const formData = new FormData()
//           formData.append("file", attachmentFile)

//           const uploadResult = await uploadMessageAttachment(formData, messageType as "image" | "video" | "audio")

//           if (!uploadResult.success) {
//             toast.error(uploadResult.error || "Failed to upload file")
//             setIsUploading(false)
//             return
//           }

//           attachmentUrl = uploadResult.url
//           setIsUploading(false)
//         }

//         // Send message
//         const result = await sendMessageToInstagram({
//           conversationId,
//           content: message.trim() || `Sent ${messageType}`,
//           messageType,
//           attachmentUrl,
//         })

//         if (result.success) {
//           setMessage("")
//           clearAttachment()
//           onMessageSent?.()
//           toast.success("Message sent successfully")
//         } else {
//           if (result.code === "MESSAGING_WINDOW_EXCEEDED" || result.code === "NO_CUSTOMER_MESSAGE") {
//             toast.error(result.error, {
//               description: "Instagram only allows messages within 24 hours of customer contact.",
//             })
//           } else if (result.code === "RATE_LIMIT_WARNING") {
//             toast.warning(result.error)
//           } else {
//             toast.error(result.error || "Failed to send message")
//           }
//         }
//       } catch (error) {
//         console.error("[v0] Error sending message:", error)
//         toast.error("An unexpected error occurred")
//       }
//     })
//   }

//   const handleUseTemplate = (template: any) => {
//     setMessage(template.content)
//     setShowTemplates(false)
//     textareaRef.current?.focus()
//     updateTemplateUsage(template.id)
//   }

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       handleSend()
//     }
//   }

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//       const mediaRecorder = new MediaRecorder(stream)
//       mediaRecorderRef.current = mediaRecorder

//       const audioChunks: Blob[] = []
//       mediaRecorder.addEventListener("dataavailable", (event) => {
//         audioChunks.push(event.data)
//       })

//       mediaRecorder.addEventListener("stop", () => {
//         const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
//         const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { type: "audio/webm" })
//         setAttachmentFile(audioFile)
//         setAttachmentPreview(`Voice recording (${recordingTime}s)`)
//         setMessageType("audio")

//         // Stop all tracks
//         stream.getTracks().forEach((track) => track.stop())
//       })

//       mediaRecorder.start()
//       setIsRecording(true)
//       setRecordingTime(0)

//       recordingIntervalRef.current = setInterval(() => {
//         setRecordingTime((prev) => prev + 1)
//       }, 1000)

//       toast.success("Recording started")
//     } catch (error) {
//       console.error("[v0] Error starting recording:", error)
//       toast.error("Could not access microphone")
//     }
//   }

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop()
//       setIsRecording(false)
//       if (recordingIntervalRef.current) {
//         clearInterval(recordingIntervalRef.current)
//       }
//       toast.success("Recording stopped")
//     }
//   }

//   useEffect(() => {
//     return () => {
//       if (recordingIntervalRef.current) {
//         clearInterval(recordingIntervalRef.current)
//       }
//     }
//   }, [])

//   const messageTypeButtons = [
//     { type: "image" as const, icon: ImageIcon, label: "Image", accept: "image/*" },
//     { type: "video" as const, icon: Video, label: "Video", accept: "video/*" },
//     { type: "audio" as const, icon: Mic, label: "Audio", accept: "audio/*" },
//   ]

//   return (
//     <div className="p-3 md:p-4 bg-background/50 backdrop-blur-xl">
//       {!isWithinMessagingWindow && lastCustomerMessageAt && (
//         <Alert variant="default" className="mb-4 border-orange-500/50 bg-orange-500/10">
//           <AlertTriangle className="h-4 w-4 text-orange-500" />
//           <AlertDescription className="text-orange-700 dark:text-orange-300">
//             Warning: 24-hour messaging window expired. Instagram may not deliver this message unless the customer sends
//             a new message first.
//           </AlertDescription>
//         </Alert>
//       )}

//       {!lastCustomerMessageAt && (
//         <Alert variant="default" className="mb-4 border-orange-500/50 bg-orange-500/10">
//           <AlertTriangle className="h-4 w-4 text-orange-500" />
//           <AlertDescription className="text-orange-700 dark:text-orange-300">
//             Warning: No customer message detected yet. Make sure the customer has initiated the conversation on
//             Instagram before sending messages.
//           </AlertDescription>
//         </Alert>
//       )}

//       {isWithinMessagingWindow && hoursRemaining < 2 && (
//         <Alert className="mb-4 border-orange-500/50 bg-orange-500/10">
//           <Clock className="h-4 w-4 text-orange-500" />
//           <AlertDescription className="text-orange-700 dark:text-orange-300">
//             Messaging window expires in {Math.floor(hoursRemaining)} hours {Math.floor((hoursRemaining % 1) * 60)}{" "}
//             minutes
//           </AlertDescription>
//         </Alert>
//       )}

//       {isRecording && (
//         <Alert className="mb-4 border-red-500/50 bg-red-500/10">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
//               <span className="text-red-700 dark:text-red-300 font-medium text-sm">Recording: {recordingTime}s</span>
//             </div>
//             <Button variant="destructive" size="sm" onClick={stopRecording}>
//               <MicOff className="h-4 w-4 mr-2" />
//               Stop Recording
//             </Button>
//           </div>
//         </Alert>
//       )}

//       <Card className="shadow-lg border-border/50 overflow-hidden backdrop-blur-sm bg-card/95">
//         {/* Attachment preview */}
//         {attachmentPreview && (
//           <div className="p-3 border-b border-border bg-muted/30">
//             <div className="flex items-start gap-3">
//               {(messageType === "image" || messageType === "video") && (
//                 <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
//                   <img
//                     src={attachmentPreview || "/placeholder.svg"}
//                     alt="Preview"
//                     className="w-full h-full object-cover"
//                   />
//                   {messageType === "video" && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//                       <Video className="h-8 w-8 text-white" />
//                     </div>
//                   )}
//                 </div>
//               )}
//               {messageType === "audio" && (
//                 <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
//                   <Mic className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm text-muted-foreground">{attachmentPreview}</span>
//                 </div>
//               )}
//               <div className="flex-1">
//                 <div className="flex items-center justify-between">
//                   <Badge variant="secondary" className="text-xs">
//                     {messageType}
//                   </Badge>
//                   <Button variant="ghost" size="icon" className="h-6 w-6" onClick={clearAttachment}>
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   {attachmentFile && `${(attachmentFile.size / 1024 / 1024).toFixed(2)} MB`}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex gap-1.5 md:gap-2 items-end p-2 md:p-3">
//           {/* Templates button */}
//           {templates.length > 0 && (
//             <Popover open={showTemplates} onOpenChange={setShowTemplates}>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 md:h-9 md:w-9 text-muted-foreground hover:text-foreground shrink-0"
//                 >
//                   <FileText className="h-3.5 w-3.5 md:h-4 md:w-4" />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-72 md:w-80 p-0" align="start" side="top">
//                 <div className="p-3 border-b border-border">
//                   <h4 className="font-semibold text-sm">Quick Reply Templates</h4>
//                   <p className="text-xs text-muted-foreground mt-0.5">Click to insert a template</p>
//                 </div>
//                 <ScrollArea className="h-[300px]">
//                   <div className="p-2 space-y-1">
//                     {templates.map((template) => (
//                       <button
//                         key={template.id}
//                         onClick={() => handleUseTemplate(template)}
//                         className="w-full text-left p-3 rounded-lg hover:bg-accent/50 transition-colors group"
//                       >
//                         <div className="flex items-start justify-between gap-2 mb-1">
//                           <h5 className="font-medium text-sm group-hover:text-primary transition-colors">
//                             {template.title}
//                           </h5>
//                           {template.category && (
//                             <Badge variant="outline" className="text-xs shrink-0">
//                               {template.category}
//                             </Badge>
//                           )}
//                         </div>
//                         <p className="text-xs text-muted-foreground line-clamp-2">{template.content}</p>
//                       </button>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               </PopoverContent>
//             </Popover>
//           )}

//           {/* Media type buttons */}
//           {messageTypeButtons.map(({ type, icon: Icon, label, accept }) => (
//             <Button
//               key={type}
//               variant="ghost"
//               size="icon"
//               className={cn(
//                 "h-8 w-8 md:h-9 md:w-9 shrink-0",
//                 messageType === type ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
//               )}
//               onClick={() => handleFileSelect(type)}
//               title={label}
//             >
//               <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
//             </Button>
//           ))}

//           <Button
//             variant="ghost"
//             size="icon"
//             className={cn(
//               "h-8 w-8 md:h-9 md:w-9 shrink-0",
//               isRecording ? "text-red-500 bg-red-500/10" : "text-muted-foreground hover:text-foreground",
//             )}
//             onClick={isRecording ? stopRecording : startRecording}
//             title={isRecording ? "Stop Recording" : "Start Voice Recording"}
//           >
//             <Mic className={cn("h-3.5 w-3.5 md:h-4 md:w-4", isRecording && "animate-pulse")} />
//           </Button>

//           {/* Hidden file input */}
//           <input
//             ref={fileInputRef}
//             type="file"
//             className="hidden"
//             accept={messageTypeButtons.find((b) => b.type === messageType)?.accept}
//             onChange={handleFileChange}
//           />

//           {/* Message textarea */}
//           <div className="flex-1 relative group">
//             <Textarea
//               ref={textareaRef}
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder={attachmentFile ? "Add a caption (optional)..." : "Type your message..."}
//               className="resize-none min-h-[48px] md:min-h-[52px] max-h-[160px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-2 scrollbar-thin text-sm"
//               disabled={isPending || isUploading || isRecording}
//               rows={1}
//             />
//           </div>

//           {/* Send button */}
//           <Button
//             onClick={handleSend}
//             disabled={
//               (messageType === "text" && !message.trim()) ||
//               (messageType !== "text" && !attachmentFile) ||
//               isPending ||
//               isUploading ||
//               isRecording
//             }
//             size="icon"
//             className={cn(
//               "h-9 w-9 md:h-10 md:w-10 shrink-0 transition-all duration-200 shadow-sm",
//               ((messageType === "text" && message.trim()) || (messageType !== "text" && attachmentFile)) &&
//                 !isPending &&
//                 !isUploading &&
//                 !isRecording &&
//                 "scale-105 shadow-md shadow-primary/20",
//             )}
//           >
//             {isPending || isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//           </Button>
//         </div>

//         {/* Footer */}
//         <div className="px-2 md:px-3 py-1.5 md:py-2 bg-muted/30 border-t border-border/50 flex items-center justify-between text-xs md:text-sm">
//           <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
//             {isUploading ? (
//               <span className="flex items-center gap-1">
//                 <Loader2 className="h-3 w-3 animate-spin" />
//                 Uploading...
//               </span>
//             ) : isRecording ? (
//               <span className="flex items-center gap-1 text-red-500">
//                 <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
//                 Recording...
//               </span>
//             ) : (
//               <>
//                 <kbd className="px-1.5 py-0.5 text-xs bg-background rounded border border-border font-mono shadow-sm hidden sm:inline">
//                   Enter
//                 </kbd>
//                 <span className="hidden sm:inline">to send</span>
//                 <span className="text-border hidden md:inline">•</span>
//                 <kbd className="px-1.5 py-0.5 text-xs bg-background rounded border border-border font-mono shadow-sm hidden md:inline">
//                   Shift + Enter
//                 </kbd>
//                 <span className="hidden md:inline">for new line</span>
//               </>
//             )}
//           </p>
//           <div className="flex items-center gap-2">
//             {attachmentFile && (
//               <Badge variant="secondary" className="text-xs">
//                 {messageType}
//               </Badge>
//             )}
//             {templates.length > 0 && (
//               <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
//                 {templates.length} templates
//               </Badge>
//             )}
//           </div>
//         </div>
//       </Card>
//     </div>
//   )
// }



"use client"

import type React from "react"

import { useState, useTransition, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Send, Loader2, FileText, ImageIcon, Video, Mic, X, AlertTriangle, Clock, MicOff } from "lucide-react"
import { sendMessageToInstagram, uploadMessageAttachment } from "@/actions/message-actions"
import { getMessageTemplates, updateTemplateUsage } from "@/actions/inbox-actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface EnhancedMessageInputProps {
  conversationId: string
  userId: string
  lastCustomerMessageAt?: Date | null
  onMessageSent?: () => void
  externalMessage?: string // Added prop to receive AI suggestions
  onExternalMessageUsed?: () => void // Callback when external message is used
}

export function EnhancedMessageInput({
  conversationId,
  userId,
  lastCustomerMessageAt,
  onMessageSent,
  externalMessage,
  onExternalMessageUsed,
}: EnhancedMessageInputProps) {
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()
  const [templates, setTemplates] = useState<any[]>([])
  const [showTemplates, setShowTemplates] = useState(false)
  const [messageType, setMessageType] = useState<MessageType>("text")
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const isWithinMessagingWindow = lastCustomerMessageAt
    ? (Date.now() - new Date(lastCustomerMessageAt).getTime()) / (1000 * 60 * 60) < 24
    : false

  const hoursRemaining = lastCustomerMessageAt
    ? Math.max(0, 24 - (Date.now() - new Date(lastCustomerMessageAt).getTime()) / (1000 * 60 * 60))
    : 0

  useEffect(() => {
    const loadTemplates = async () => {
      const result = await getMessageTemplates(userId)
      if (result.success && result.templates) {
        setTemplates(result.templates)
      }
    }
    loadTemplates()
  }, [userId])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [message])

  useEffect(() => {
    if (externalMessage) {
      setMessage(externalMessage)
      onExternalMessageUsed?.()
      textareaRef.current?.focus()
    }
  }, [externalMessage, onExternalMessageUsed])

  const handleFileSelect = (type: "image" | "video" | "audio") => {
    setMessageType(type)
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAttachmentFile(file)

    // Create preview for images and videos
    if (messageType === "image" || messageType === "video") {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAttachmentPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setAttachmentPreview(file.name)
    }
  }

  const clearAttachment = () => {
    setAttachmentFile(null)
    setAttachmentPreview(null)
    setMessageType("text")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSend = async () => {
    if (messageType === "text" && !message.trim()) return
    if (messageType !== "text" && !attachmentFile) return
    if (isPending) return

    if (!isWithinMessagingWindow) {
      toast.warning(
        "Warning: 24-hour messaging window expired. Instagram may not deliver this message unless the customer sends a new message first.",
        {
          description: "Instagram only allows messages within 24 hours of customer contact.",
        },
      )
    }

    if (!lastCustomerMessageAt) {
      toast.warning(
        "Warning: No customer message detected yet. Make sure the customer has initiated the conversation on Instagram before sending messages.",
        {
          description: "The customer must initiate the conversation first.",
        },
      )
    }

    startTransition(async () => {
      try {
        let attachmentUrl: string | undefined

        // Upload attachment if present
        if (attachmentFile && messageType !== "text") {
          setIsUploading(true)
          const formData = new FormData()
          formData.append("file", attachmentFile)

          const uploadResult = await uploadMessageAttachment(formData, messageType as "image" | "video" | "audio")

          if (!uploadResult.success) {
            toast.error(uploadResult.error || "Failed to upload file")
            setIsUploading(false)
            return
          }

          attachmentUrl = uploadResult.url
          setIsUploading(false)
        }

        // Send message
        const result = await sendMessageToInstagram({
          conversationId,
          content: message.trim() || `Sent ${messageType}`,
          messageType,
          attachmentUrl,
        })

        if (result.success) {
          setMessage("")
          clearAttachment()
          onMessageSent?.()
          toast.success("Message sent successfully")
        } else {
          if (result.code === "MESSAGING_WINDOW_EXCEEDED" || result.code === "NO_CUSTOMER_MESSAGE") {
            toast.error(result.error, {
              description: "Instagram only allows messages within 24 hours of customer contact.",
            })
          } else if (result.code === "RATE_LIMIT_WARNING") {
            toast.warning(result.error)
          } else {
            toast.error(result.error || "Failed to send message")
          }
        }
      } catch (error) {
        console.error("[v0] Error sending message:", error)
        toast.error("An unexpected error occurred")
      }
    })
  }

  const handleUseTemplate = (template: any) => {
    setMessage(template.content)
    setShowTemplates(false)
    textareaRef.current?.focus()
    updateTemplateUsage(template.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const audioChunks: Blob[] = []
      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data)
      })

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { type: "audio/webm" })
        setAttachmentFile(audioFile)
        setAttachmentPreview(`Voice recording (${recordingTime}s)`)
        setMessageType("audio")

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      })

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      toast.success("Recording started")
    } catch (error) {
      console.error("[v0] Error starting recording:", error)
      toast.error("Could not access microphone")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      toast.success("Recording stopped")
    }
  }

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }, [])

  const messageTypeButtons = [
    { type: "image" as const, icon: ImageIcon, label: "Image", accept: "image/*" },
    { type: "video" as const, icon: Video, label: "Video", accept: "video/*" },
    { type: "audio" as const, icon: Mic, label: "Audio", accept: "audio/*" },
  ]

  return (
    <div className="p-3 md:p-4 bg-background/50 backdrop-blur-xl">
      {!isWithinMessagingWindow && lastCustomerMessageAt && (
        <Alert variant="default" className="mb-4 border-orange-500/50 bg-orange-500/10">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-700 dark:text-orange-300">
            Warning: 24-hour messaging window expired. Instagram may not deliver this message unless the customer sends
            a new message first.
          </AlertDescription>
        </Alert>
      )}

      {!lastCustomerMessageAt && (
        <Alert variant="default" className="mb-4 border-orange-500/50 bg-orange-500/10">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-700 dark:text-orange-300">
            Warning: No customer message detected yet. Make sure the customer has initiated the conversation on
            Instagram before sending messages.
          </AlertDescription>
        </Alert>
      )}

      {isWithinMessagingWindow && hoursRemaining < 2 && (
        <Alert className="mb-4 border-orange-500/50 bg-orange-500/10">
          <Clock className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-700 dark:text-orange-300">
            Messaging window expires in {Math.floor(hoursRemaining)} hours {Math.floor((hoursRemaining % 1) * 60)}{" "}
            minutes
          </AlertDescription>
        </Alert>
      )}

      {isRecording && (
        <Alert className="mb-4 border-red-500/50 bg-red-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-700 dark:text-red-300 font-medium text-sm">Recording: {recordingTime}s</span>
            </div>
            <Button variant="destructive" size="sm" onClick={stopRecording}>
              <MicOff className="h-4 w-4 mr-2" />
              Stop Recording
            </Button>
          </div>
        </Alert>
      )}

      <Card className="shadow-lg border-border/50 overflow-hidden backdrop-blur-sm bg-card/95">
        {/* Attachment preview */}
        {attachmentPreview && (
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="flex items-start gap-3">
              {(messageType === "image" || messageType === "video") && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={attachmentPreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {messageType === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Video className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              )}
              {messageType === "audio" && (
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                  <Mic className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{attachmentPreview}</span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {messageType}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={clearAttachment}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {attachmentFile && `${(attachmentFile.size / 1024 / 1024).toFixed(2)} MB`}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-1.5 md:gap-2 items-end p-2 md:p-3">
          {/* Templates button */}
          {templates.length > 0 && (
            <Popover open={showTemplates} onOpenChange={setShowTemplates}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:h-9 md:w-9 text-muted-foreground hover:text-foreground shrink-0"
                >
                  <FileText className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 md:w-80 p-0" align="start" side="top">
                <div className="p-3 border-b border-border">
                  <h4 className="font-semibold text-sm">Quick Reply Templates</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Click to insert a template</p>
                </div>
                <ScrollArea className="h-[300px]">
                  <div className="p-2 space-y-1">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleUseTemplate(template)}
                        className="w-full text-left p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h5 className="font-medium text-sm group-hover:text-primary transition-colors">
                            {template.title}
                          </h5>
                          {template.category && (
                            <Badge variant="outline" className="text-xs shrink-0">
                              {template.category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{template.content}</p>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          )}

          {/* Media type buttons */}
          {messageTypeButtons.map(({ type, icon: Icon, label, accept }) => (
            <Button
              key={type}
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 md:h-9 md:w-9 shrink-0",
                messageType === type ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => handleFileSelect(type)}
              title={label}
            >
              <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          ))}

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 md:h-9 md:w-9 shrink-0",
              isRecording ? "text-red-500 bg-red-500/10" : "text-muted-foreground hover:text-foreground",
            )}
            onClick={isRecording ? stopRecording : startRecording}
            title={isRecording ? "Stop Recording" : "Start Voice Recording"}
          >
            <Mic className={cn("h-3.5 w-3.5 md:h-4 md:w-4", isRecording && "animate-pulse")} />
          </Button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={messageTypeButtons.find((b) => b.type === messageType)?.accept}
            onChange={handleFileChange}
          />

          {/* Message textarea */}
          <div className="flex-1 relative group">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={attachmentFile ? "Add a caption (optional)..." : "Type your message..."}
              className="resize-none min-h-[48px] md:min-h-[52px] max-h-[160px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-2 scrollbar-thin text-sm"
              disabled={isPending || isUploading || isRecording}
              rows={1}
            />
          </div>

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={
              (messageType === "text" && !message.trim()) ||
              (messageType !== "text" && !attachmentFile) ||
              isPending ||
              isUploading ||
              isRecording
            }
            size="icon"
            className={cn(
              "h-9 w-9 md:h-10 md:w-10 shrink-0 transition-all duration-200 shadow-sm",
              ((messageType === "text" && message.trim()) || (messageType !== "text" && attachmentFile)) &&
                !isPending &&
                !isUploading &&
                !isRecording &&
                "scale-105 shadow-md shadow-primary/20",
            )}
          >
            {isPending || isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>

        {/* Footer */}
        <div className="px-2 md:px-3 py-1.5 md:py-2 bg-muted/30 border-t border-border/50 flex items-center justify-between text-xs md:text-sm">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
            {isUploading ? (
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Uploading...
              </span>
            ) : isRecording ? (
              <span className="flex items-center gap-1 text-red-500">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                Recording...
              </span>
            ) : (
              <>
                <kbd className="px-1.5 py-0.5 text-xs bg-background rounded border border-border font-mono shadow-sm hidden sm:inline">
                  Enter
                </kbd>
                <span className="hidden sm:inline">to send</span>
                <span className="text-border hidden md:inline">•</span>
                <kbd className="px-1.5 py-0.5 text-xs bg-background rounded border border-border font-mono shadow-sm hidden md:inline">
                  Shift + Enter
                </kbd>
                <span className="hidden md:inline">for new line</span>
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            {attachmentFile && (
              <Badge variant="secondary" className="text-xs">
                {messageType}
              </Badge>
            )}
            {templates.length > 0 && (
              <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                {templates.length} templates
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

type MessageType = "text" | "image" | "video" | "audio" | "carousel"
