"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { pusherClient } from "@/lib/pusher"
import { markNotificationAsRead } from "@/lib/notification-actions"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  icon: string
  actionUrl?: string
  createdAt: Date
}
//tek
export function NotificationPopup() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { data } = useSWR("/api/notifications/list", (url) => fetch(url).then((r) => r.json()))

  useEffect(() => {
    if (data?.notifications) {
      const unread = data.notifications.filter((n: any) => !n.isRead).slice(0, 3)
      setNotifications(unread)
      setUnreadCount(data.unreadCount || 0)
    }
  }, [data])

  useEffect(() => {
    const channel = pusherClient.subscribe("notifications-current-user")
    channel.bind("new-notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 3))
      setUnreadCount((prev) => prev + 1)
    })

    return () => {
      channel.unbind_all()
      pusherClient.unsubscribe("notifications-current-user")
    }
  }, [])

  const handleDismiss = async (id: string) => {
    await markNotificationAsRead(id)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 space-y-2 pointer-events-none z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="pointer-events-auto bg-card border border-border rounded-lg shadow-lg p-4 w-96 max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{notification.icon}</span>
                <h3 className="font-semibold text-sm">{notification.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
              {notification.actionUrl && (
                <Link href={notification.actionUrl} className="text-xs text-primary hover:underline mt-2 inline-block">
                  View Details
                </Link>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
              onClick={() => handleDismiss(notification.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
