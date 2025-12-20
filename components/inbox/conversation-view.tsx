// "use client"

// import { useState, useEffect, useTransition } from "react"
// import { getConversation } from "@/actions/conversation-actions"
// import { syncInstagramUserProfile } from "@/actions/instagram-sync-actions"
// import { ConversationHeader } from "@/components/inbox/conversation-header"
// import { MessageThread } from "@/components/inbox/message-thread"
// import { EnhancedMessageInput } from "@/components/inbox/message-input"
// import { CustomerTimelineSidebar } from "@/components/inbox/customer-timeline-sidebar"
// import { AISuggestionsPanel } from "@/components/inbox/ai-suggestions-panel"
// import { Loader2, ArrowLeft, PanelRightClose, PanelRight } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useMobile } from "@/hooks/use-mobile"
// import { prisma } from "@/lib/db"
// import { hasAccess } from "@/lib/subscription"

// interface ConversationViewProps {
//   conversationId: string
//   userId: string
//   onBack?: () => void
// }

// export function ConversationView({ conversationId, userId, onBack }: ConversationViewProps) {
//   const [conversation, setConversation] = useState<any>(null)
//   const [isLoading, startTransition] = useTransition()
//   const [showCustomerSidebar, setShowCustomerSidebar] = useState(false)
//   const [showAISuggestions, setShowAISuggestions] = useState(false)
//   const [userTier, setUserTier] = useState<"free" | "pro" | "enterprise">("free")
//   const isMobile = useMobile()

//   const loadConversation = () => {
//     startTransition(async () => {
//       const result = await getConversation(conversationId)
//       if (result.success) {
//         setConversation(result.conversation)

//         if (result.conversation && (!result.conversation.participantName || !result.conversation.participantAvatar)) {
//           await syncInstagramUserProfile(conversationId)
//         }
//       }
//     })
//   }

//   useEffect(() => {
//     loadConversation()
//     const interval = setInterval(loadConversation, 10000)
//     return () => clearInterval(interval)
//   }, [conversationId])

//   useEffect(() => {
//     const loadUserTier = async () => {
//       // Fetch user subscription tier from database
//       const user = await prisma.user.findUnique({
//         where: { clerkId: userId },
//         select: { subscriptionTier: true },
//       })
//       if (user) {
//         setUserTier((user.subscriptionTier as any) || "free")
//       }
//     }
//     loadUserTier()
//   }, [userId])

//   const canUseAI = hasAccess(userTier, "aiSuggestions")

//   if (isLoading && !conversation) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//       </div>
//     )
//   }

//   if (!conversation) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <p className="text-muted-foreground">Conversation not found</p>
//       </div>
//     )
//   }

//   return (
//     <div className="flex h-full bg-background">
//       <div className="flex-1 flex flex-col min-w-0">
//         <div className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
//           {isMobile && onBack && (
//             <div className="border-b border-border/50 p-2">
//               <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-accent/50">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//             </div>
//           )}
//           <div className="flex items-center justify-between">
//             <div className="flex-1 min-w-0">
//               <ConversationHeader conversation={conversation} />
//             </div>
//             {!isMobile && (
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setShowCustomerSidebar(!showCustomerSidebar)}
//                 className="mr-2 h-9 w-9 shrink-0"
//               >
//                 {showCustomerSidebar ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
//               </Button>
//             )}
//           </div>
//         </div>

//         <MessageThread messages={conversation.messages} />

//         {canUseAI && showAISuggestions && conversation.messages.length > 0 && (
//           <div className="border-t border-border/50 bg-muted/30">
//             <AISuggestionsPanel
//               conversationId={conversationId}
//               userId={userId}
//               onSelectSuggestion={(suggestion) => {
//                 // Insert suggestion into message input
//                 setShowAISuggestions(false)
//               }}
//             />
//           </div>
//         )}

//         <div className="border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//           {canUseAI && (
//             <div className="px-4 py-2 border-b border-border/50 flex items-center justify-between">
//               <p className="text-xs text-muted-foreground">AI Smart Reply Suggestions</p>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setShowAISuggestions(!showAISuggestions)}
//                 className="h-7 text-xs"
//               >
//                 {showAISuggestions ? "Hide" : "Show"} AI Suggestions
//               </Button>
//             </div>
//           )}

//           <EnhancedMessageInput
//             conversationId={conversationId}
//             userId={userId}
//             lastCustomerMessageAt={conversation.lastCustomerMessageAt}
//             onMessageSent={loadConversation}
//           />
//         </div>
//       </div>

//       {showCustomerSidebar && !isMobile && <CustomerTimelineSidebar conversation={conversation} userId={userId} />}
//     </div>
//   )
// }
"use client"

import { useState, useEffect, useTransition } from "react"
import { getConversation } from "@/actions/conversation-actions"
import { syncInstagramUserProfile } from "@/actions/instagram-sync-actions"
import { getUserSubscriptionTier } from "@/actions/user-actions"
import { ConversationHeader } from "@/components/inbox/conversation-header"
import { MessageThread } from "@/components/inbox/message-thread"
import { EnhancedMessageInput } from "@/components/inbox/message-input"
import { CustomerTimelineSidebar } from "@/components/inbox/customer-timeline-sidebar"
import { AISuggestionsPanel } from "@/components/inbox/ai-suggestions-panel"
import { Loader2, ArrowLeft, PanelRightClose, PanelRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { hasAccess } from "@/lib/subscription"

interface ConversationViewProps {
  conversationId: string
  userId: string
  onBack?: () => void
}

export function ConversationView({ conversationId, userId, onBack }: ConversationViewProps) {
  const [conversation, setConversation] = useState<any>(null)
  const [isLoading, startTransition] = useTransition()
  const [showCustomerSidebar, setShowCustomerSidebar] = useState(false)
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [userTier, setUserTier] = useState<"free" | "pro" | "enterprise">("free")
  const isMobile = useMobile()

  const loadConversation = () => {
    startTransition(async () => {
      const result = await getConversation(conversationId)
      if (result.success) {
        setConversation(result.conversation)

        if (result.conversation && (!result.conversation.participantName || !result.conversation.participantAvatar)) {
          await syncInstagramUserProfile(conversationId)
        }
      }
    })
  }

  useEffect(() => {
    loadConversation()
    const interval = setInterval(loadConversation, 10000)
    return () => clearInterval(interval)
  }, [conversationId])

  useEffect(() => {
    const loadUserTier = async () => {
      const result = await getUserSubscriptionTier(userId)
      if (result.success) {
        setUserTier(result.tier)
      }
    }
    loadUserTier()
  }, [userId])

  const canUseAI = hasAccess(userTier, "aiSuggestions")

  if (isLoading && !conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Conversation not found</p>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-background">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
          {isMobile && onBack && (
            <div className="border-b border-border/50 p-2">
              <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-accent/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <ConversationHeader conversation={conversation} />
            </div>
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCustomerSidebar(!showCustomerSidebar)}
                className="mr-2 h-9 w-9 shrink-0"
              >
                {showCustomerSidebar ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        <MessageThread messages={conversation.messages} />

        {canUseAI && showAISuggestions && conversation.messages.length > 0 && (
          <div className="border-t border-border/50 bg-muted/30">
            <AISuggestionsPanel
              conversationId={conversationId}
              userId={userId}
              onSelectSuggestion={(suggestion) => {
                // Insert suggestion into message input
                setShowAISuggestions(false)
              }}
            />
          </div>
        )}

        <div className="border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {canUseAI && (
            <div className="px-4 py-2 border-b border-border/50 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">AI Smart Reply Suggestions</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAISuggestions(!showAISuggestions)}
                className="h-7 text-xs"
              >
                {showAISuggestions ? "Hide" : "Show"} AI Suggestions
              </Button>
            </div>
          )}

          <EnhancedMessageInput
            conversationId={conversationId}
            userId={userId}
            lastCustomerMessageAt={conversation.lastCustomerMessageAt}
            onMessageSent={loadConversation}
          />
        </div>
      </div>

      {showCustomerSidebar && !isMobile && <CustomerTimelineSidebar conversation={conversation} userId={userId} />}
    </div>
  )
}
