"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { pusherClient } from "@/lib/pusher"
import { markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "@/lib/notification-actions"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Check, CheckCheck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  icon: string
  isRead: boolean
  actionUrl?: string
  createdAt: Date
}

export function NotificationsSidebar() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { data, mutate } = useSWR("/api/notifications/list", (url) => fetch(url).then((r) => r.json()))

  useEffect(() => {
    if (data?.notifications) {
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount || 0)
    }
  }, [data])

  useEffect(() => {
    const channel = pusherClient.subscribe("notifications-current-user")

    channel.bind("new-notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)
    })

    channel.bind("notification-read", (data: { id: string }) => {
      setNotifications((prev) => prev.map((n) => (n.id === data.id ? { ...n, isRead: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    })

    channel.bind("notification-deleted", (data: { id: string }) => {
      setNotifications((prev) => prev.filter((n) => n.id !== data.id))
    })

    return () => {
      channel.unbind_all()
      pusherClient.unsubscribe("notifications-current-user")
    }
  }, [])

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id)
    mutate()
  }

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead()
    mutate()
  }

  const handleDelete = async (id: string) => {
    await deleteNotification(id)
    mutate()
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-sm flex items-center justify-between">
          Notifications
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">{unreadCount}</span>
          )}
        </h2>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" className="text-xs h-7 mt-2 w-full" onClick={handleMarkAllAsRead}>
            <CheckCheck className="h-3 w-3 mr-1" />
            Mark all as read
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        {notifications.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">No notifications</div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 transition-colors ${notification.isRead ? "bg-card" : "bg-accent/50"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <span className="text-lg flex-shrink-0">{notification.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{notification.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
