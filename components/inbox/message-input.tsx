// "use client"

// import type React from "react"

// import { useState, useTransition, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Send, Loader2 } from "lucide-react"
// import { sendMessage } from "@/actions/conversation-actions"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// interface MessageInputProps {
//   conversationId: string
//   onMessageSent?: () => void
// }

// export function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
//   const [message, setMessage] = useState("")
//   const [isPending, startTransition] = useTransition()
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

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

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       handleSend()
//     }
//   }

//   return (
//     <div className="border-t border-border bg-card p-4">
//       <div className="flex gap-3 items-end">
//         <div className="flex-1 relative">
//           <Textarea
//             ref={textareaRef}
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Type your message..."
//             className="resize-none min-h-[60px] max-h-[200px] pr-10"
//             disabled={isPending}
//           />
//         </div>
//         <Button
//           onClick={handleSend}
//           disabled={!message.trim() || isPending}
//           size="icon"
//           className={cn("h-[60px] w-[60px] shrink-0 transition-all", message.trim() && !isPending && "scale-105")}
//         >
//           {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
//         </Button>
//       </div>
//       <p className="text-xs text-muted-foreground mt-2">
//         <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">Enter</kbd> to send •{" "}
//         <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">Shift + Enter</kbd> for new line
//       </p>
//     </div>
//   )
// }
// "use client"

// import type React from "react"

// import { useState, useTransition, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
// import { Separator } from "@/components/ui/separator"
// import { Send, Loader2, Smile, Paperclip, Sparkles } from "lucide-react"
// import { sendMessage } from "@/actions/conversation-actions"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// interface MessageInputProps {
//   conversationId: string
//   onMessageSent?: () => void
// }

// export function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
//   const [message, setMessage] = useState("")
//   const [isPending, startTransition] = useTransition()
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

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

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       handleSend()
//     }
//   }

//   return (
//     <div className="p-4 bg-background">
//       <div className="relative rounded-xl border border-border/50 bg-card shadow-sm hover:border-border transition-colors overflow-hidden">
//         {/* Gradient accent on focus */}
//         <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />

//         <div className="flex gap-2 items-end p-3">
//           <div className="flex items-end gap-1 pb-1">
//             <HoverCard openDelay={300}>
//               <HoverCardTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-9 w-9 text-muted-foreground hover:text-foreground"
//                   disabled
//                 >
//                   <Smile className="h-4 w-4" />
//                 </Button>
//               </HoverCardTrigger>
//               <HoverCardContent side="top" className="w-auto p-2">
//                 <p className="text-xs text-muted-foreground">Emoji picker coming soon</p>
//               </HoverCardContent>
//             </HoverCard>

//             <HoverCard openDelay={300}>
//               <HoverCardTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-9 w-9 text-muted-foreground hover:text-foreground"
//                   disabled
//                 >
//                   <Paperclip className="h-4 w-4" />
//                 </Button>
//               </HoverCardTrigger>
//               <HoverCardContent side="top" className="w-auto p-2">
//                 <p className="text-xs text-muted-foreground">Attachments coming soon</p>
//               </HoverCardContent>
//             </HoverCard>
//           </div>

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

//         <Separator />

//         <div className="px-3 py-2 bg-muted/30 flex items-center justify-between">
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
//           <HoverCard openDelay={300}>
//             <HoverCardTrigger asChild>
//               <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1" disabled>
//                 <Sparkles className="h-3 w-3" />
//                 AI Assist
//               </Button>
//             </HoverCardTrigger>
//             <HoverCardContent side="top" className="w-auto p-2">
//               <p className="text-xs text-muted-foreground">AI-powered responses coming soon</p>
//             </HoverCardContent>
//           </HoverCard>
//         </div>
//       </div>
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
import { Send, Loader2, FileText } from "lucide-react"
import { sendMessage } from "@/actions/conversation-actions"
import { getMessageTemplates } from "@/actions/inbox-actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface MessageInputProps {
  conversationId: string
  userId: string
  onMessageSent?: () => void
}

export function MessageInput({ conversationId, userId, onMessageSent }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()
  const [templates, setTemplates] = useState<any[]>([])
  const [showTemplates, setShowTemplates] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  const handleSend = () => {
    if (!message.trim() || isPending) return

    startTransition(async () => {
      const result = await sendMessage(conversationId, message.trim())

      if (result.success) {
        setMessage("")
        onMessageSent?.()
        toast.success("Message sent successfully")
      } else {
        toast.error(result.error || "Failed to send message")
      }
    })
  }

  const handleUseTemplate = (template: any) => {
    setMessage(template.content)
    setShowTemplates(false)
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="p-4 bg-background">
      <Card className="shadow-lg border-border/50 overflow-hidden">
        <div className="flex gap-2 items-end p-3">
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
                            {template.name}
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

          <div className="flex-1 relative group">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="resize-none min-h-[52px] max-h-[160px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-2 scrollbar-thin"
              disabled={isPending}
              rows={1}
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={!message.trim() || isPending}
            size="icon"
            className={cn(
              "h-10 w-10 shrink-0 transition-all duration-200 shadow-sm",
              message.trim() && !isPending && "scale-105 shadow-md shadow-primary/20",
            )}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>

        <div className="px-3 py-2 bg-muted/30 border-t border-border/50 flex items-center justify-between">
          <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
            <kbd className="px-1.5 py-0.5 text-xs bg-background rounded border border-border font-mono shadow-sm">
              Enter
            </kbd>
            <span>to send</span>
            <span className="text-border">•</span>
            <kbd className="px-1.5 py-0.5 text-xs bg-background rounded border border-border font-mono shadow-sm">
              Shift + Enter
            </kbd>
            <span>for new line</span>
          </p>
          {templates.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {templates.length} templates
            </Badge>
          )}
        </div>
      </Card>
    </div>
  )
}
