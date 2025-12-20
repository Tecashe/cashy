"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Calendar, MessageSquare, Star, Ban, Download, Clock } from "lucide-react"
import { getCustomerHistory, toggleVipStatus, createReminder } from "@/actions/inbox-actions"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface CustomerTimelineSidebarProps {
  conversation: any
  userId: string
}

export function CustomerTimelineSidebar({ conversation, userId }: CustomerTimelineSidebarProps) {
  const [history, setHistory] = useState<any>(null)
  const [isVip, setIsVip] = useState(conversation.isVip)

  useEffect(() => {
    const loadHistory = async () => {
      const result = await getCustomerHistory(conversation.participantId, userId)
      if (result.success) {
        setHistory(result.history)
      }
    }
    loadHistory()
  }, [conversation.participantId, userId])

  const handleToggleVip = async () => {
    const result = await toggleVipStatus(conversation.id, !isVip)
    if (result.success) {
      setIsVip(!isVip)
      toast.success(isVip ? "Removed from VIP" : "Marked as VIP")
    }
  }

  const handleSetReminder = async () => {
    // Simple: set reminder for 24 hours from now
    const remindAt = new Date()
    remindAt.setHours(remindAt.getHours() + 24)

    const result = await createReminder(
      conversation.id,
      userId,
      `Follow up with ${conversation.participantName}`,
      remindAt,
    )

    if (result.success) {
      toast.success("Reminder set for 24 hours from now")
    }
  }

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm">Customer Profile</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Profile Card */}
          <Card className="p-4 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-3 border-4 border-background shadow-lg">
                <AvatarImage src={conversation.participantAvatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {conversation.participantName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h4 className="font-semibold">{conversation.participantName}</h4>
              <p className="text-sm text-muted-foreground">@{conversation.participantUsername}</p>
              {history?.firstContact && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Customer for {formatDistanceToNow(history.firstContact)}
                </p>
              )}
              {isVip && (
                <Badge variant="default" className="mt-2 bg-yellow-500 hover:bg-yellow-600">
                  <Star className="h-3 w-3 mr-1" />
                  VIP Customer
                </Badge>
              )}
            </div>
          </Card>

          {/* Stats */}
          {history && (
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 text-center">
                <MessageSquare className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-2xl font-bold">{history.conversationCount}</p>
                <p className="text-xs text-muted-foreground">Conversations</p>
              </Card>
              <Card className="p-3 text-center">
                <MessageSquare className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-2xl font-bold">{history.totalMessages}</p>
                <p className="text-xs text-muted-foreground">Messages</p>
              </Card>
            </div>
          )}

          <Separator />

          {/* Quick Actions */}
          <div>
            <h5 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Quick Actions</h5>
            <div className="space-y-2">
              <Button
                variant={isVip ? "default" : "outline"}
                className="w-full justify-start"
                size="sm"
                onClick={handleToggleVip}
              >
                <Star className={cn("h-4 w-4 mr-2", isVip && "fill-current")} />
                {isVip ? "Remove from VIP" : "Mark as VIP"}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                size="sm"
                onClick={handleSetReminder}
              >
                <Clock className="h-4 w-4 mr-2" />
                Set Reminder
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Conversation
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive bg-transparent" size="sm">
                <Ban className="h-4 w-4 mr-2" />
                Block User
              </Button>
            </div>
          </div>

          {/* Past Interactions */}
          {history && history.conversations.length > 1 && (
            <>
              <Separator />
              <div>
                <h5 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  Past Interactions ({history.conversations.length - 1} previous)
                </h5>
                <div className="space-y-2">
                  {history.conversations.slice(1, 4).map((conv: any) => (
                    <Card key={conv.id} className="p-3 hover:bg-accent/50 cursor-pointer transition-colors">
                      <p className="text-xs text-muted-foreground mb-1">
                        {formatDistanceToNow(conv.date, { addSuffix: true })}
                      </p>
                      <p className="text-sm line-clamp-2">{conv.firstMessage}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {conv.messageCount} messages
                      </Badge>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
