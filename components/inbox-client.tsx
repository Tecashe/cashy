"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, MoreVertical, Archive, Star, Paperclip, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePolling } from "@/hooks/use-polling"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  content: string
  sender: "user" | "participant"
  timestamp: Date
  isRead: boolean
}

interface Conversation {
  id: string
  participantName: string
  participantUsername: string
  participantAvatar: string
  lastMessageText: string
  lastMessageAt: Date
  unreadCount: number
  tags: Array<{ id: string; name: string; color: string }>
}

interface InboxClientProps {
  initialConversations: Conversation[]
  tags: Array<{ id: string; name: string; color: string }>
}

// Simulated messages for selected conversation
const getMessages = (conversationId: string): Message[] => {
  const messagesByConversation: Record<string, Message[]> = {
    "1": [
      {
        id: "1",
        content: "Hi! I'm interested in your services",
        sender: "participant",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isRead: true,
      },
      {
        id: "2",
        content:
          "Hello Sarah! Thank you for reaching out. I'd be happy to help you. What specific service are you interested in?",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 50),
        isRead: true,
      },
      {
        id: "3",
        content: "I'm looking for social media management for my business",
        sender: "participant",
        timestamp: new Date(Date.now() - 1000 * 60 * 40),
        isRead: true,
      },
      {
        id: "4",
        content: "Perfect! We have great packages for social media management. Let me send you more details...",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isRead: true,
      },
      {
        id: "5",
        content: "Thanks for the quick response!",
        sender: "participant",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isRead: true,
      },
    ],
    "2": [
      {
        id: "1",
        content: "Hey! Saw your post about the new product",
        sender: "participant",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isRead: true,
      },
      {
        id: "2",
        content: "Can I get more info about your product?",
        sender: "participant",
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        isRead: false,
      },
    ],
  }

  return (
    messagesByConversation[conversationId] || [
      {
        id: "1",
        content: "This is a simulated conversation",
        sender: "participant",
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        isRead: true,
      },
    ]
  )
}

function formatRelativeTime(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return "just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function formatMessageTime(date: Date) {
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  }

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  if (isYesterday) {
    return "Yesterday"
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function InboxClient({ initialConversations, tags }: InboxClientProps) {
  const [conversations, setConversations] = useState(initialConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(initialConversations[0])
  const [messages, setMessages] = useState<Message[]>(getMessages(initialConversations[0].id))
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isManualMode, setIsManualMode] = useState(false)

  const fetchConversations = useCallback(async () => {
    const response = await fetch("/api/conversations")
    if (!response.ok) throw new Error("Failed to fetch conversations")
    const data = await response.json()
    return data.conversations
  }, [])

  usePolling(fetchConversations, {
    interval: 5000, // Poll every 5 seconds
    enabled: true,
    onSuccess: (data) => {
      setConversations(data)
    },
  })

  const fetchMessages = useCallback(async () => {
    if (!selectedConversation) return []
    const response = await fetch(`/api/messages?conversationId=${selectedConversation.id}`)
    if (!response.ok) throw new Error("Failed to fetch messages")
    const data = await response.json()
    return data.messages
  }, [selectedConversation])

  usePolling(fetchMessages, {
    interval: 3000, // Poll messages more frequently
    enabled: !!selectedConversation,
    onSuccess: (data) => {
      setMessages(data)
    },
  })

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setMessages(getMessages(conversation.id))
    setIsManualMode(false) // Reset manual mode when switching conversations
    // Mark as read
    setConversations((prev) => prev.map((c) => (c.id === conversation.id ? { ...c, unreadCount: 0 } : c)))
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          content: newMessage,
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      const { message } = await response.json()
      setMessages([...messages, message])
      setNewMessage("")

      // Update conversation last message
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversation.id ? { ...c, lastMessageText: newMessage, lastMessageAt: new Date() } : c,
        ),
      )
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message. Please try again.")
    }
  }

  const filteredConversations = conversations.filter(
    (c) =>
      c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.participantUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessageText.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const quickReplies = [
    "Thanks for reaching out!",
    "I'll get back to you shortly",
    "Can you provide more details?",
    "Check out our website for more info",
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Inbox</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your Instagram conversations</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:h-[calc(100vh-16rem)]">
        {/* Conversations List */}
        <Card className="glass-card lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Conversations</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] lg:h-[calc(100vh-24rem)]">
              <div className="space-y-1 p-3">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={cn(
                      "w-full rounded-lg p-3 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800",
                      selectedConversation?.id === conversation.id && "bg-slate-100 dark:bg-slate-800",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={conversation.participantAvatar || "/placeholder.svg"}
                        alt={conversation.participantName}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-slate-900 dark:text-white truncate">
                            {conversation.participantName}
                          </p>
                          <span className="text-xs text-slate-500 flex-shrink-0">
                            {formatRelativeTime(conversation.lastMessageAt)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          @{conversation.participantUsername}
                        </p>
                        <p className="mt-1 text-sm text-slate-500 truncate">{conversation.lastMessageText}</p>
                        {conversation.tags.length > 0 && (
                          <div className="mt-1 flex gap-1">
                            {conversation.tags.map((tag) => (
                              <Badge key={tag.id} style={{ backgroundColor: tag.color }} className="text-xs text-white">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-xs font-bold text-white">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="glass-card lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedConversation.participantAvatar || "/placeholder.svg"}
                      alt={selectedConversation.participantName}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {selectedConversation.participantName}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        @{selectedConversation.participantUsername}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Star className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          {/* Tag icon here */}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {tags.map((tag) => (
                          <DropdownMenuItem key={tag.id}>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
                              {tag.name}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Block User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant={isManualMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsManualMode(!isManualMode)}
                      className={isManualMode ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
                    >
                      {isManualMode ? (
                        <>
                          <User className="mr-2 h-4 w-4" />
                          Manual Mode
                        </>
                      ) : (
                        <>
                          <Bot className="mr-2 h-4 w-4" />
                          Auto Mode
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                {!isManualMode && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Bot className="h-4 w-4" />
                    <span>Automations are active for this conversation</span>
                  </div>
                )}
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-[400px] lg:h-[calc(100vh-32rem)] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn("flex gap-2", message.sender === "user" ? "justify-end" : "justify-start")}
                      >
                        {message.sender === "participant" && (
                          <img
                            src={selectedConversation.participantAvatar || "/placeholder.svg"}
                            alt={selectedConversation.participantName}
                            className="h-8 w-8 rounded-full"
                          />
                        )}
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg px-4 py-2",
                            message.sender === "user"
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                              : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white",
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={cn(
                              "mt-1 text-xs",
                              message.sender === "user" ? "text-white/70" : "text-slate-500 dark:text-slate-400",
                            )}
                          >
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Quick Replies */}
              <div className="border-t px-4 py-2">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setNewMessage(reply)}
                      className="flex-shrink-0 text-xs"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-slate-600 dark:text-slate-400">Select a conversation to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
