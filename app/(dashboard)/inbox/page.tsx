import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { InboxClient } from "@/components/inbox-client"

// Simulated data - replace with real database queries
async function getConversations(userId: string) {
  return [
    {
      id: "1",
      participantName: "Sarah Johnson",
      participantUsername: "sarahjay",
      participantAvatar: "/diverse-woman-avatar.png",
      lastMessageText: "Thanks for the quick response!",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 5),
      unreadCount: 0,
      tags: [{ id: "1", name: "VIP", color: "#8B5CF6" }],
    },
    {
      id: "2",
      participantName: "Mike Chen",
      participantUsername: "mikechen",
      participantAvatar: "/man-avatar.png",
      lastMessageText: "Can I get more info about your product?",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 15),
      unreadCount: 2,
      tags: [{ id: "2", name: "Lead", color: "#EC4899" }],
    },
    {
      id: "3",
      participantName: "Emma Wilson",
      participantUsername: "emmawilson",
      participantAvatar: "/woman-avatar-2.png",
      lastMessageText: "Love your content!",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 30),
      unreadCount: 1,
      tags: [],
    },
    {
      id: "4",
      participantName: "James Rodriguez",
      participantUsername: "jamesrod",
      participantAvatar: "/placeholder.svg?height=40&width=40",
      lastMessageText: "When will this be back in stock?",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 60),
      unreadCount: 0,
      tags: [{ id: "3", name: "Customer", color: "#10B981" }],
    },
    {
      id: "5",
      participantName: "Lisa Kim",
      participantUsername: "lisakim",
      participantAvatar: "/placeholder.svg?height=40&width=40",
      lastMessageText: "Thanks! I'll check it out",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 120),
      unreadCount: 0,
      tags: [{ id: "4", name: "Follow-up", color: "#F59E0B" }],
    },
  ]
}

async function getTags(userId: string) {
  return [
    { id: "1", name: "VIP", color: "#8B5CF6" },
    { id: "2", name: "Lead", color: "#EC4899" },
    { id: "3", name: "Customer", color: "#10B981" },
    { id: "4", name: "Follow-up", color: "#F59E0B" },
  ]
}

export default async function InboxPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const conversations = await getConversations(userId)
  const tags = await getTags(userId)

  return <InboxClient initialConversations={conversations} tags={tags} />
}
