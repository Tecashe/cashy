import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { InboxLayout } from "@/components/inbox/inbox-layout"

export default async function InboxPage() {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) redirect("/sign-in")

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    include: {
      instagramAccounts: {
        select: {
          id: true,
          username: true,
          profilePicUrl: true,
          isConnected: true,
        },
      },
    },
  })

  if (!user) redirect("/sign-in")

  return <InboxLayout userId={user.id} instagramAccounts={user.instagramAccounts} />
}
