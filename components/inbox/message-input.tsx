// "use client"

// import type React from "react"

// import { useState, useTransition, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Send, Loader2, FileText } from "lucide-react"
// import { sendMessage } from "@/actions/conversation-actions"
// import { getMessageTemplates, updateTemplateUsage } from "@/actions/inbox-actions"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// interface MessageInputProps {
//   conversationId: string
//   userId: string
//   onMessageSent?: () => void
// }

// export function MessageInput({ conversationId, userId, onMessageSent }: MessageInputProps) {
//   const [message, setMessage] = useState("")
//   const [isPending, startTransition] = useTransition()
//   const [templates, setTemplates] = useState<any[]>([])
//   const [showTemplates, setShowTemplates] = useState(false)
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

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

//   const handleSend = () => {
//     if (!message.trim() || isPending) return

//     startTransition(async () => {
//       const result = await sendMessage(conversationId, message.trim())

//       if (result.success) {
//         setMessage("")
//         onMessageSent?.()
//         toast.success("Message sent successfully")
//       } else {
//         toast.error(result.error || "Failed to send message")
//       }
//     })
//   }

//   const handleUseTemplate = (template: any) => {
//     setMessage(template.content)
//     setShowTemplates(false)
//     textareaRef.current?.focus()
//     // Update template usage after using a template
//     updateTemplateUsage(template.id)
//   }

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       handleSend()
//     }
//   }

//   return (
//     <div className="p-4 bg-background">
//       <Card className="shadow-lg border-border/50 overflow-hidden">
//         <div className="flex gap-2 items-end p-3">
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
//                             {template.name}
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

//           <div className="flex-1 relative group">
//             <Textarea
//               ref={textareaRef}
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Type your message..."
//               className="resize-none min-h-[52px] max-h-[160px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-2 scrollbar-thin"
//               disabled={isPending}
//               rows={1}
//             />
//           </div>

//           <Button
//             onClick={handleSend}
//             disabled={!message.trim() || isPending}
//             size="icon"
//             className={cn(
//               "h-10 w-10 shrink-0 transition-all duration-200 shadow-sm",
//               message.trim() && !isPending && "scale-105 shadow-md shadow-primary/20",
//             )}
//           >
//             {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//           </Button>
//         </div>

//         <div className="px-3 py-2 bg-muted/30 border-t border-border/50 flex items-center justify-between">
//           <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
//             <kbd className="px-1.5 py-0.5 text-xs bg-background rounded border border-border font-mono shadow-sm">
//               Enter
//             </kbd>
//             <span>to send</span>
//             <span className="text-border">•</span>
//             <kbd className="px-1.5 py-0.5 text-xs bg-background rounded border border-border font-mono shadow-sm">
//               Shift + Enter
//             </kbd>
//             <span>for new line</span>
//           </p>
//           {templates.length > 0 && (
//             <Badge variant="secondary" className="text-xs">
//               {templates.length} templates
//             </Badge>
//           )}
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Send, Loader2, FileText, ImageIcon, Video, Mic, X } from "lucide-react"
import { sendMessageToInstagram, uploadMessageAttachment } from "@/actions/message-actions"
import { getMessageTemplates, updateTemplateUsage } from "@/actions/inbox-actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface EnhancedMessageInputProps {
  conversationId: string
  userId: string
  onMessageSent?: () => void
}

type MessageType = "text" | "image" | "video" | "audio" | "carousel"

export function EnhancedMessageInput({ conversationId, userId, onMessageSent }: EnhancedMessageInputProps) {
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()
  const [templates, setTemplates] = useState<any[]>([])
  const [showTemplates, setShowTemplates] = useState(false)
  const [messageType, setMessageType] = useState<MessageType>("text")
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
          toast.error(result.error || "Failed to send message")
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

  const messageTypeButtons = [
    { type: "image" as const, icon: ImageIcon, label: "Image", accept: "image/*" },
    { type: "video" as const, icon: Video, label: "Video", accept: "video/*" },
    { type: "audio" as const, icon: Mic, label: "Audio", accept: "audio/*" },
  ]

  return (
    <div className="p-4 bg-background">
      <Card className="shadow-lg border-border/50 overflow-hidden">
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

        <div className="flex gap-2 items-end p-3">
          {/* Templates button */}
          {templates.length > 0 && (
            <Popover open={showTemplates} onOpenChange={setShowTemplates}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start" side="top">
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
                "h-9 w-9 shrink-0",
                messageType === type ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => handleFileSelect(type)}
              title={label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}

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
              className="resize-none min-h-[52px] max-h-[160px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-2 scrollbar-thin"
              disabled={isPending || isUploading}
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
              isUploading
            }
            size="icon"
            className={cn(
              "h-10 w-10 shrink-0 transition-all duration-200 shadow-sm",
              ((messageType === "text" && message.trim()) || (messageType !== "text" && attachmentFile)) &&
                !isPending &&
                !isUploading &&
                "scale-105 shadow-md shadow-primary/20",
            )}
          >
            {isPending || isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>

        {/* Footer */}
        <div className="px-3 py-2 bg-muted/30 border-t border-border/50 flex items-center justify-between">
          <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
            {isUploading ? (
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Uploading...
              </span>
            ) : (
              <>
                <kbd className="px-1.5 py-0.5 text-xs bg-background rounded border border-border font-mono shadow-sm">
                  Enter
                </kbd>
                <span>to send</span>
                <span className="text-border">•</span>
                <kbd className="px-1.5 py-0.5 text-xs bg-background rounded border border-border font-mono shadow-sm">
                  Shift + Enter
                </kbd>
                <span>for new line</span>
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
              <Badge variant="secondary" className="text-xs">
                {templates.length} templates
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
