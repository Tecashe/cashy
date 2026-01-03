"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"

export async function createNotification(
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "error",
  actionUrl?: string,
  data?: Record<string, any>,
) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  })

  if (!user) throw new Error("User not found")

  const notification = await prisma.notification.create({
    data: {
      userId: user.id,
      title,
      message,
      type,
      actionUrl,
      data,
      icon: getIconForType(type),
    },
  })

  // Broadcast to user via Pusher
  await pusherServer.trigger(`notifications-${user.id}`, "new-notification", {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    icon: notification.icon,
    actionUrl: notification.actionUrl,
    createdAt: notification.createdAt,
  })

  return notification
}

export async function getNotifications(limit = 10, isRead?: boolean) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  })

  if (!user) throw new Error("User not found")

  const where = {
    userId: user.id,
    ...(isRead !== undefined && { isRead }),
  }

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  })

  const unreadCount = await prisma.notification.count({
    where: {
      userId: user.id,
      isRead: false,
    },
  })

  return { notifications, unreadCount }
}

export async function markNotificationAsRead(notificationId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  })

  if (!user) throw new Error("User not found")

  const notification = await prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  })

  // Broadcast read status via Pusher
  await pusherServer.trigger(`notifications-${user.id}`, "notification-read", {
    id: notification.id,
  })

  return notification
}

export async function markAllNotificationsAsRead() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  })

  if (!user) throw new Error("User not found")

  await prisma.notification.updateMany({
    where: {
      userId: user.id,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  })

  // Broadcast via Pusher
  await pusherServer.trigger(`notifications-${user.id}`, "mark-all-read", {})

  return { success: true }
}

export async function deleteNotification(notificationId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  })

  if (!user) throw new Error("User not found")

  await prisma.notification.delete({
    where: { id: notificationId },
  })

  // Broadcast deletion via Pusher
  await pusherServer.trigger(`notifications-${user.id}`, "notification-deleted", {
    id: notificationId,
  })

  return { success: true }
}

function getIconForType(type: string) {
  const icons: Record<string, string> = {
    info: "📋",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  }
  return icons[type] || "📬"
}
