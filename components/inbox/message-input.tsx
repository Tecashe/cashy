"use client"

import type React from "react"

import { useState, useTransition, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"
import { sendMessage } from "@/actions/conversation-actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface MessageInputProps {
  conversationId: string
  onMessageSent?: () => void
}

export function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border bg-card p-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="resize-none min-h-[60px] max-h-[200px] pr-10"
            disabled={isPending}
          />
        </div>
        <Button
          onClick={handleSend}
          disabled={!message.trim() || isPending}
          size="icon"
          className={cn("h-[60px] w-[60px] shrink-0 transition-all", message.trim() && !isPending && "scale-105")}
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">Enter</kbd> to send •{" "}
        <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">Shift + Enter</kbd> for new line
      </p>
    </div>
  )
}
