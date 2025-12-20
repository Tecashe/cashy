"use client"

import { useEffect, useRef } from "react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Message = {
  id: string
  content: string
  createdAt: Date
  isFromUser: boolean
}

interface MessageThreadProps {
  messages: Message[]
  customerName: string
  igUsername: string
}

export function MessageThread({ messages, customerName, igUsername }: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={cn("flex gap-3", !message.isFromUser && "flex-row-reverse")}>
          <Avatar className="h-8 w-8">
            {message.isFromUser ? (
              <>
                <AvatarImage src={`https://avatar.vercel.sh/${igUsername}`} alt={customerName || igUsername} />
                <AvatarFallback>{getInitials(customerName || igUsername)}</AvatarFallback>
              </>
            ) : (
              <>
                <AvatarFallback className="bg-primary text-primary-foreground">You</AvatarFallback>
              </>
            )}
          </Avatar>

          <div className={cn("flex flex-col gap-1", !message.isFromUser && "items-end")}>
            <div
              className={cn(
                "rounded-lg px-4 py-2 max-w-[70%]",
                message.isFromUser ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
              )}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
            <time className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(message.createdAt), {
                addSuffix: true,
              })}
            </time>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
