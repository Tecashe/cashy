import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getConversations, getTags } from "@/actions/conversation-actions"
import { ConversationList } from "@/components/inbox/conversation-list"
import { InboxFilters } from "@/components/inbox/inbox-filters"
import { InboxHeader } from "@/components/inbox/inbox-header"
import { prisma } from "@/lib/db"

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) redirect("/sign-in")

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  })

  if (!user) redirect("/sign-in")

  const params = await searchParams
  const userId = user.id

  const filters: any = { userId }
  if (params.search) filters.search = params.search as string
  if (params.starred === "true") filters.starred = true
  if (params.archived === "true") filters.archived = true
  if (params.isRead === "true") filters.isRead = true
  if (params.isRead === "false") filters.isRead = false

  const [conversationsResult, tagsResult] = await Promise.all([getConversations(filters), getTags(userId)])

  if (!conversationsResult.success || !tagsResult.success) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Error loading inbox</h2>
          <p className="text-sm text-muted-foreground mt-2">{conversationsResult.error || tagsResult.error}</p>
        </div>
      </div>
    )
  }

  const conversations = (conversationsResult.conversations || []).filter(
    (c): c is typeof c & { lastMessageAt: Date } => c.lastMessageAt !== null,
  )
  const tags = tagsResult.tags || []

  // If we have conversations and no specific conversation is selected, redirect to first one
  if (conversations.length > 0 && !params.id) {
    redirect(`/inbox/${conversations[0].id}`)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <InboxHeader unreadCount={conversations.filter((c) => !c.isRead).length} totalCount={conversations.length} />
      <InboxFilters onFilterChange={() => {}} tags={tags} />
      <div className="flex-1 overflow-hidden">
        <ConversationList conversations={conversations} />
      </div>
    </div>
  )
}
