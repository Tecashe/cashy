"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"
import { sendMessage } from "@/actions/conversation-actions"
import { useToast } from "@/hooks/use-toast"

interface MessageInputProps {
  conversationId: string
  onMessageSent?: () => void
}

export function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleSend = () => {
    if (!message.trim() || isPending) return

    startTransition(async () => {
      const result = await sendMessage(conversationId, message)

      if (result.success) {
        setMessage("")
        onMessageSent?.()
        toast({
          title: "Message sent",
          description: "Your message has been sent successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send message",
          variant: "destructive",
        })
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
    <div className="border-t border-border p-4">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
          className="resize-none"
          rows={3}
          disabled={isPending}
        />
        <Button onClick={handleSend} disabled={!message.trim() || isPending} size="icon" className="shrink-0 h-auto">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">Press Enter to send, Shift+Enter for new line</p>
    </div>
  )
}
