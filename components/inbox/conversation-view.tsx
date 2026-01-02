// "use client"

// import { useState, useEffect, useTransition } from "react"
// import { getConversation } from "@/actions/conversation-actions"
// import { getUserSubscriptionTier } from "@/actions/user-actions"
// import { ConversationHeader } from "@/components/inbox/conversation-header"
// import { MessageThread } from "@/components/inbox/message-thread"
// import { EnhancedMessageInput } from "@/components/inbox/message-input"
// import { CustomerTimelineSidebar } from "@/components/inbox/customer-timeline-sidebar"
// import { AISuggestionsPanel } from "@/components/inbox/ai-suggestions-panel"
// import { Loader2, ArrowLeft, PanelRightClose, PanelRight, Sparkles } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useMobile } from "@/hooks/use-mobile"
// import { hasAccess } from "@/lib/subscription"
// import { Badge } from "@/components/ui/badge"

// interface ConversationViewProps {
//   conversationId: string
//   userId: string
//   conversation?: any
//   onBack?: () => void
// }

// export function ConversationView({
//   conversationId,
//   userId,
//   conversation: initialConversation,
//   onBack,
// }: ConversationViewProps) {
//   const [conversation, setConversation] = useState<any>(initialConversation || null)
//   const [isLoading, startTransition] = useTransition()
//   const [showCustomerSidebar, setShowCustomerSidebar] = useState(false)
//   const [showAISuggestions, setShowAISuggestions] = useState(false)
//   const [userTier, setUserTier] = useState<"free" | "pro" | "enterprise">("free")
//   const [messageInputValue, setMessageInputValue] = useState("")
//   const isMobile = useMobile()

//   const loadConversation = () => {
//     startTransition(async () => {
//       const result = await getConversation(conversationId)
//       if (result.success) {
//         setConversation(result.conversation)
//       }
//     })
//   }

//   useEffect(() => {
//     if (!initialConversation) {
//       loadConversation()
//     }
//     const interval = setInterval(loadConversation, 10000)
//     return () => clearInterval(interval)
//   }, [conversationId, initialConversation])

//   useEffect(() => {
//     const loadUserTier = async () => {
//       const result = await getUserSubscriptionTier(userId)
//       if (result.success) {
//         setUserTier(result.tier)
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
//         <div className="border-b">
//           {isMobile && onBack && (
//             <div className="border-b p-2">
//               <Button variant="ghost" size="sm" onClick={onBack}>
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

//         <div className="border-t bg-muted/20">
//           {canUseAI ? (
//             <div className="p-3 md:p-4">
//               <div className="mb-3 flex items-center gap-2">
//                 <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
//                 <span className="text-sm font-medium">AI Smart Replies</span>
//                 <Badge variant="secondary" className="text-xs">
//                   Pro
//                 </Badge>
//               </div>
//               <AISuggestionsPanel
//                 conversationId={conversationId}
//                 userId={userId}
//                 onSelectSuggestion={(suggestion) => {
//                   setMessageInputValue(suggestion)
//                   setShowAISuggestions(false)
//                 }}
//               />
//             </div>
//           ) : (
//             <div className="p-2">
//               <Button
//                 variant="default"
//                 size="sm"
//                 onClick={() => setShowAISuggestions(true)}
//                 className="w-full justify-center gap-2 h-9 shadow-sm"
//               >
//                 <Sparkles className="h-4 w-4" />
//                 <span>Get AI Smart Replies</span>
//                 <Badge variant="secondary" className="text-xs bg-primary-foreground/20">
//                   Pro
//                 </Badge>
//               </Button>
//             </div>
//           )}
//         </div>

//         <div className="border-t">
//           <EnhancedMessageInput
//             conversationId={conversationId}
//             userId={userId}
//             lastCustomerMessageAt={conversation.lastCustomerMessageAt}
//             onMessageSent={loadConversation}
//             externalMessage={messageInputValue}
//             onExternalMessageUsed={() => setMessageInputValue("")}
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
import { getUserSubscriptionTier } from "@/actions/user-actions"
import { ConversationHeader } from "@/components/inbox/conversation-header"
import { MessageThread } from "@/components/inbox/message-thread"
import { EnhancedMessageInput } from "@/components/inbox/message-input"
import { CustomerTimelineSidebar } from "@/components/inbox/customer-timeline-sidebar"
import { AISuggestionsPanel } from "@/components/inbox/ai-suggestions-panel"
import { Loader2, ArrowLeft, PanelRightClose, PanelRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { hasAccess } from "@/lib/subscription"
import { Badge } from "@/components/ui/badge"

interface ConversationViewProps {
  conversationId: string
  userId: string
  conversation?: any
  onBack?: () => void
}

export function ConversationView({
  conversationId,
  userId,
  conversation: initialConversation,
  onBack,
}: ConversationViewProps) {
  const [conversation, setConversation] = useState<any>(initialConversation || null)
  const [isLoading, startTransition] = useTransition()
  const [showCustomerSidebar, setShowCustomerSidebar] = useState(false)
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [userTier, setUserTier] = useState<"free" | "pro" | "enterprise">("free")
  const [messageInputValue, setMessageInputValue] = useState("")
  const isMobile = useMobile()

  const loadConversation = () => {
    startTransition(async () => {
      const result = await getConversation(conversationId)
      if (result.success) {
        setConversation(result.conversation)
      }
    })
  }

  useEffect(() => {
    if (!initialConversation) {
      loadConversation()
    }
    const interval = setInterval(loadConversation, 10000)
    return () => clearInterval(interval)
  }, [conversationId, initialConversation])

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
        <div className="border-b">
          {isMobile && onBack && (
            <div className="border-b p-2">
              <Button variant="ghost" size="sm" onClick={onBack}>
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

        <MessageThread 
          messages={conversation.messages} 
          participantAvatar={conversation.participantAvatar}
          participantName={conversation.participantName}
          businessAvatar={conversation.instagramAccount?.profilePictureUrl}
        />

        <div className="border-t bg-muted/20">
          {canUseAI ? (
            <div className="p-3 md:p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium">AI Smart Replies</span>
                <Badge variant="secondary" className="text-xs">
                  Pro
                </Badge>
              </div>
              <AISuggestionsPanel
                conversationId={conversationId}
                userId={userId}
                onSelectSuggestion={(suggestion) => {
                  setMessageInputValue(suggestion)
                  setShowAISuggestions(false)
                }}
              />
            </div>
          ) : (
            <div className="p-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowAISuggestions(true)}
                className="w-full justify-center gap-2 h-9 shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>Get AI Smart Replies</span>
                <Badge variant="secondary" className="text-xs bg-primary-foreground/20">
                  Pro
                </Badge>
              </Button>
            </div>
          )}
        </div>

        <div className="border-t">
          <EnhancedMessageInput
            conversationId={conversationId}
            userId={userId}
            lastCustomerMessageAt={conversation.lastCustomerMessageAt}
            onMessageSent={loadConversation}
            externalMessage={messageInputValue}
            onExternalMessageUsed={() => setMessageInputValue("")}
          />
        </div>
      </div>

      {showCustomerSidebar && !isMobile && <CustomerTimelineSidebar conversation={conversation} userId={userId} />}
    </div>
  )
}