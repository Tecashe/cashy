"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { ConversationListPanel } from "@/components/inbox/conversation-list-panel"
import { ConversationView } from "@/components/inbox/conversation-view"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Instagram, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useNavigation } from "@/hooks/use-navigation"

type InstagramAccount = {
  id: string
  username: string
  profilePicUrl: string | null
  isConnected: boolean
}

interface InboxLayoutProps {
  userId: string
  instagramAccounts: InstagramAccount[]
}

export function InboxLayout({ userId, instagramAccounts }: InboxLayoutProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const conversationId = searchParams.get("c")
  const { buildHref } = useNavigation()

  const [selectedAccount, setSelectedAccount] = useState<string>(
    instagramAccounts.find((a) => a.isConnected)?.id || instagramAccounts[0]?.id || "",
  )

  const handleAccountChange = (accountId: string) => {
    setSelectedAccount(accountId)
    router.push(buildHref("/inbox"))
  }

  const handleConversationSelect = (id: string) => {
      router.push(buildHref(`/inbox?c=${id}`))
    }
  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="border-b px-4 py-3 bg-card shadow-sm">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {conversationId && (
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9" onClick={() => router.push(buildHref("/inbox"))}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="p-2 rounded-lg bg-primary/10">
              <Instagram className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold">Inbox</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Manage Instagram conversations</p>
            </div>
          </div>

          {instagramAccounts.length > 0 && (
            <Select value={selectedAccount} onValueChange={handleAccountChange}>
              <SelectTrigger className="w-[160px] sm:w-[220px]">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {instagramAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center gap-2 py-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={account.profilePicUrl || undefined} />
                        <AvatarFallback className="text-xs bg-primary/10">
                          {account.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">@{account.username}</span>
                      {account.isConnected && (
                        <Badge variant="default" className="ml-auto text-xs hidden sm:inline-flex">
                          Active
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={cn(
            "border-r flex flex-col",
            conversationId ? "hidden lg:flex lg:w-[360px]" : "w-full lg:w-[360px]",
          )}
        >
          <ConversationListPanel
            userId={userId}
            instagramAccountId={selectedAccount}
            selectedConversationId={conversationId || undefined}
            onConversationSelect={handleConversationSelect}
          />
        </div>

        <div className={cn("flex-1 flex flex-col", !conversationId && "hidden lg:flex")}>
          {conversationId ? (
            <ConversationView conversationId={conversationId} userId={userId} onBack={() => router.push(buildHref("/inbox"))} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="bg-muted/30 rounded-full p-12 mb-6">
                <Instagram className="h-16 w-16 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Select a conversation</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Choose a conversation from the list to view messages and engage with your customers
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
