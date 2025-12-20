"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ConversationListPanel } from "@/components/inbox/conversation-list-panel"
import { ConversationView } from "@/components/inbox/conversation-view"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Instagram } from "lucide-react"
import { cn } from "@/lib/utils"

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

  const [selectedAccount, setSelectedAccount] = useState<string>(
    instagramAccounts.find((a) => a.isConnected)?.id || instagramAccounts[0]?.id || "",
  )

  const handleAccountChange = (accountId: string) => {
    setSelectedAccount(accountId)
    // Clear conversation selection when switching accounts
    router.push("/inbox")
  }

  const handleConversationSelect = (id: string) => {
    router.push(`/inbox?c=${id}`)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-xl px-3 md:px-6 py-3 md:py-4 shadow-lg">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <div className="p-1.5 md:p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-md">
              <Instagram className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base md:text-lg font-semibold truncate">Inbox</h1>
              <p className="text-xs text-muted-foreground hidden sm:block truncate">
                Manage your Instagram conversations
              </p>
            </div>
          </div>

          {instagramAccounts.length > 0 && (
            <Select value={selectedAccount} onValueChange={handleAccountChange}>
              <SelectTrigger className="w-[140px] sm:w-[200px] md:w-[280px] bg-background/95 backdrop-blur-sm shadow-sm border-border/50 text-sm">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent className="backdrop-blur-xl bg-card/95">
                {instagramAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center gap-2 md:gap-3 py-1">
                      <Avatar className="h-6 w-6 md:h-7 md:w-7 border-2 border-border shadow-sm">
                        <AvatarImage src={account.profilePicUrl || undefined} />
                        <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {account.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm truncate">@{account.username}</span>
                      <Badge
                        variant={account.isConnected ? "default" : "secondary"}
                        className="ml-auto text-xs h-5 shadow-sm hidden sm:inline-flex"
                      >
                        {account.isConnected ? "Active" : "Disconnected"}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Conversation List */}
        <div
          className={cn(
            "border-r border-border/50 bg-card/95 backdrop-blur-sm flex flex-col shadow-xl",
            conversationId ? "hidden lg:flex lg:w-[380px] xl:w-[420px]" : "w-full lg:w-[380px] xl:w-[420px]",
          )}
        >
          <ConversationListPanel
            userId={userId}
            instagramAccountId={selectedAccount}
            selectedConversationId={conversationId || undefined}
            onConversationSelect={handleConversationSelect}
          />
        </div>

        {/* Right: Conversation View */}
        <div className={cn("flex-1 flex flex-col bg-background", !conversationId && "hidden lg:flex")}>
          {conversationId ? (
            <ConversationView conversationId={conversationId} userId={userId} onBack={() => router.push("/inbox")} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full p-8 mb-6 shadow-lg backdrop-blur-sm">
                <Instagram className="h-16 w-16 text-muted-foreground" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">Select a conversation</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-md text-balance">
                Choose a conversation from the list to view messages and engage with your customers
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
