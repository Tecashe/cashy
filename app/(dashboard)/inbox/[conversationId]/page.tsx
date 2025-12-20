import { auth } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import { getConversation, getTags } from "@/actions/conversation-actions"
import { ConversationHeader } from "@/components/inbox/conversation-header"
import { MessageThread } from "@/components/inbox/message-thread"
import { MessageInput } from "@/components/inbox/message-input"
import { prisma } from "@/lib/db"

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const { conversationId } = await params

  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) redirect("/sign-in")

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  })

  if (!user) redirect("/sign-in")

  const [conversationResult, tagsResult] = await Promise.all([getConversation(conversationId), getTags(user.id)])

  if (!conversationResult.success || !conversationResult.conversation) {
    notFound()
  }

  const conversation = conversationResult.conversation
  const tags = tagsResult.success ? tagsResult.tags || [] : []

  return (
    <div className="flex flex-col h-screen bg-background">
      <ConversationHeader conversation={conversation} availableTags={tags} />
      <MessageThread
        messages={conversation.messages}
        customerName={conversation.participantName || conversation.participantUsername}
        igUsername={conversation.participantUsername}
      />
      <MessageInput conversationId={conversationId} />
    </div>
  )
}
