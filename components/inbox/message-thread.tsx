// "use client"

// import { useEffect, useRef } from "react"
// import { format, isToday, isYesterday } from "date-fns"
// import { cn } from "@/lib/utils"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { CheckCheck, Check } from "lucide-react"

// type Message = {
//   id: string
//   content: string
//   createdAt: Date
//   isFromUser: boolean
//   isRead: boolean
// }

// interface MessageThreadProps {
//   messages: Message[]
// }

// export function MessageThread({ messages }: MessageThreadProps) {
//   const bottomRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   // Group messages by date
//   const groupedMessages = messages.reduce(
//     (groups, message) => {
//       const date = format(new Date(message.createdAt), "yyyy-MM-dd")
//       if (!groups[date]) {
//         groups[date] = []
//       }
//       groups[date].push(message)
//       return groups
//     },
//     {} as Record<string, typeof messages>,
//   )

//   const formatDateLabel = (dateString: string) => {
//     const date = new Date(dateString)
//     if (isToday(date)) return "Today"
//     if (isYesterday(date)) return "Yesterday"
//     return format(date, "MMMM d, yyyy")
//   }

//   return (
//     <div className="flex-1 overflow-y-auto px-6 py-4">
//       <div className="space-y-6 max-w-4xl mx-auto">
//         {Object.entries(groupedMessages).map(([date, msgs]) => (
//           <div key={date}>
//             {/* Date divider */}
//             <div className="flex items-center gap-4 mb-6">
//               <div className="flex-1 h-px bg-border" />
//               <span className="text-xs text-muted-foreground font-medium px-3 py-1.5 bg-muted/50 rounded-full">
//                 {formatDateLabel(date)}
//               </span>
//               <div className="flex-1 h-px bg-border" />
//             </div>

//             {/* Messages */}
//             <div className="space-y-3">
//               {msgs.map((message, index) => {
//                 const showAvatar = index === 0 || msgs[index - 1].isFromUser !== message.isFromUser
//                 const isConsecutive = index > 0 && msgs[index - 1].isFromUser === message.isFromUser

//                 return (
//                   <div
//                     key={message.id}
//                     className={cn(
//                       "flex gap-3 items-end group transition-opacity hover:opacity-100",
//                       !message.isFromUser && "flex-row-reverse",
//                       isConsecutive && "opacity-90",
//                     )}
//                   >
//                     {/* Avatar */}
//                     {showAvatar ? (
//                       <Avatar className="h-8 w-8 shadow-sm">
//                         {message.isFromUser ? (
//                           <AvatarFallback className="bg-gradient-to-br from-pink-500 to-orange-400 text-white text-xs font-medium">
//                             CU
//                           </AvatarFallback>
//                         ) : (
//                           <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
//                             YO
//                           </AvatarFallback>
//                         )}
//                       </Avatar>
//                     ) : (
//                       <div className="h-8 w-8" />
//                     )}

//                     <div className={cn("flex flex-col gap-1 max-w-[65%]", !message.isFromUser && "items-end")}>
//                       <div
//                         className={cn(
//                           "rounded-2xl px-4 py-2.5 shadow-sm transition-all",
//                           message.isFromUser
//                             ? "bg-muted text-foreground rounded-bl-sm"
//                             : "bg-primary text-primary-foreground rounded-br-sm",
//                           showAvatar && message.isFromUser && "rounded-tl-2xl",
//                           showAvatar && !message.isFromUser && "rounded-tr-2xl",
//                         )}
//                       >
//                         <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
//                       </div>
//                       <div className="flex items-center gap-1.5 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <time className="text-xs text-muted-foreground">
//                           {format(new Date(message.createdAt), "h:mm a")}
//                         </time>
//                         {!message.isFromUser && (
//                           <span className="text-muted-foreground">
//                             {message.isRead ? (
//                               <CheckCheck className="h-3 w-3 text-primary" />
//                             ) : (
//                               <Check className="h-3 w-3" />
//                             )}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         ))}
//         <div ref={bottomRef} />
//       </div>
//     </div>
//   )
// }

// "use client"

// import { useEffect, useRef, useState } from "react"
// import { format, isToday, isYesterday } from "date-fns"
// import { cn } from "@/lib/utils"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { CheckCheck, Check } from "lucide-react"

// type Message = {
//   id: string
//   content: string
//   createdAt: Date
//   isFromUser: boolean
//   isRead: boolean
// }

// interface MessageThreadProps {
//   messages: Message[]
// }

// export function MessageThread({ messages }: MessageThreadProps) {
//   const bottomRef = useRef<HTMLDivElement>(null)
//   const [prevMessageCount, setPrevMessageCount] = useState(messages.length)
//   const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
//   const scrollContainerRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     if (messages.length > prevMessageCount && shouldAutoScroll) {
//       bottomRef.current?.scrollIntoView({ behavior: "smooth" })
//     }
//     setPrevMessageCount(messages.length)
//   }, [messages, prevMessageCount, shouldAutoScroll])

//   const handleScroll = () => {
//     if (!scrollContainerRef.current) return
//     const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
//     const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
//     setShouldAutoScroll(isNearBottom)
//   }

//   const groupedMessages = messages.reduce(
//     (groups, message) => {
//       const date = format(new Date(message.createdAt), "yyyy-MM-dd")
//       if (!groups[date]) {
//         groups[date] = []
//       }
//       groups[date].push(message)
//       return groups
//     },
//     {} as Record<string, typeof messages>,
//   )

//   const formatDateLabel = (dateString: string) => {
//     const date = new Date(dateString)
//     if (isToday(date)) return "Today"
//     if (isYesterday(date)) return "Yesterday"
//     return format(date, "MMMM d, yyyy")
//   }

//   return (
//     <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-6 py-4">
//       <div className="space-y-6 max-w-4xl mx-auto">
//         {Object.entries(groupedMessages).map(([date, msgs]) => (
//           <div key={date}>
//             {/* Date divider */}
//             <div className="flex items-center gap-4 mb-6">
//               <div className="flex-1 h-px bg-border" />
//               <span className="text-xs text-muted-foreground font-medium px-3 py-1.5 bg-muted/50 rounded-full">
//                 {formatDateLabel(date)}
//               </span>
//               <div className="flex-1 h-px bg-border" />
//             </div>

//             {/* Messages */}
//             <div className="space-y-3">
//               {msgs.map((message, index) => {
//                 const showAvatar = index === 0 || msgs[index - 1].isFromUser !== message.isFromUser
//                 const isConsecutive = index > 0 && msgs[index - 1].isFromUser === message.isFromUser

//                 return (
//                   <div
//                     key={message.id}
//                     className={cn(
//                       "flex gap-3 items-end group transition-opacity hover:opacity-100",
//                       !message.isFromUser && "flex-row-reverse",
//                       isConsecutive && "opacity-90",
//                     )}
//                   >
//                     {/* Avatar */}
//                     {showAvatar ? (
//                       <Avatar className="h-8 w-8 shadow-sm">
//                         {message.isFromUser ? (
//                           <AvatarFallback className="bg-gradient-to-br from-pink-500 to-orange-400 text-white text-xs font-medium">
//                             CU
//                           </AvatarFallback>
//                         ) : (
//                           <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
//                             YO
//                           </AvatarFallback>
//                         )}
//                       </Avatar>
//                     ) : (
//                       <div className="h-8 w-8" />
//                     )}

//                     <div className={cn("flex flex-col gap-1 max-w-[65%]", !message.isFromUser && "items-end")}>
//                       <div
//                         className={cn(
//                           "rounded-2xl px-4 py-2.5 shadow-sm transition-all",
//                           message.isFromUser
//                             ? "bg-muted text-foreground rounded-bl-sm"
//                             : "bg-primary text-primary-foreground rounded-br-sm",
//                           showAvatar && message.isFromUser && "rounded-tl-2xl",
//                           showAvatar && !message.isFromUser && "rounded-tr-2xl",
//                         )}
//                       >
//                         <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
//                       </div>
//                       <div className="flex items-center gap-1.5 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <time className="text-xs text-muted-foreground">
//                           {format(new Date(message.createdAt), "h:mm a")}
//                         </time>
//                         {!message.isFromUser && (
//                           <span className="text-muted-foreground">
//                             {message.isRead ? (
//                               <CheckCheck className="h-3 w-3 text-primary" />
//                             ) : (
//                               <Check className="h-3 w-3" />
//                             )}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         ))}
//         <div ref={bottomRef} />
//       </div>
//     </div>
//   )
// }

// "use client"

// import { useEffect, useRef, useState } from "react"
// import { format, isToday, isYesterday } from "date-fns"
// import { cn } from "@/lib/utils"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { CheckCheck, Check, ImageIcon, Mic } from "lucide-react"

// type Message = {
//   id: string
//   content: string
//   createdAt: Date
//   isFromUser: boolean
//   isRead: boolean
//   messageType?: string
//   attachmentUrl?: string | null
//   attachmentMetadata?: any
// }

// interface MessageThreadProps {
//   messages: Message[]
// }

// export function MessageThread({ messages }: MessageThreadProps) {
//   const bottomRef = useRef<HTMLDivElement>(null)
//   const [prevMessageCount, setPrevMessageCount] = useState(messages.length)
//   const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
//   const scrollContainerRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     if (messages.length > prevMessageCount && shouldAutoScroll) {
//       bottomRef.current?.scrollIntoView({ behavior: "smooth" })
//     }
//     setPrevMessageCount(messages.length)
//   }, [messages, prevMessageCount, shouldAutoScroll])

//   const handleScroll = () => {
//     if (!scrollContainerRef.current) return
//     const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
//     const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
//     setShouldAutoScroll(isNearBottom)
//   }

//   const groupedMessages = messages.reduce(
//     (groups, message) => {
//       const date = format(new Date(message.createdAt), "yyyy-MM-dd")
//       if (!groups[date]) {
//         groups[date] = []
//       }
//       groups[date].push(message)
//       return groups
//     },
//     {} as Record<string, typeof messages>,
//   )

//   const formatDateLabel = (dateString: string) => {
//     const date = new Date(dateString)
//     if (isToday(date)) return "Today"
//     if (isYesterday(date)) return "Yesterday"
//     return format(date, "MMMM d, yyyy")
//   }

//   const renderMessageContent = (message: Message) => {
//     const messageType = message.messageType || "text"

//     switch (messageType) {
//       case "image":
//         return (
//           <div className="space-y-2">
//             {message.attachmentUrl && (
//               <div className="rounded-lg overflow-hidden bg-muted/30">
//                 <img
//                   src={message.attachmentUrl || "/placeholder.svg"}
//                   alt="Shared image"
//                   className="max-w-full h-auto max-h-96 object-contain"
//                 />
//               </div>
//             )}
//             {message.content && message.content !== "Sent image" && (
//               <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
//             )}
//           </div>
//         )

//       case "video":
//         return (
//           <div className="space-y-2">
//             {message.attachmentUrl && (
//               <div className="rounded-lg overflow-hidden bg-muted/30 relative group">
//                 <video
//                   src={message.attachmentUrl}
//                   controls
//                   className="max-w-full h-auto max-h-96 object-contain"
//                   preload="metadata"
//                 >
//                   Your browser does not support the video tag.
//                 </video>
//               </div>
//             )}
//             {message.content && message.content !== "Sent video" && (
//               <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
//             )}
//           </div>
//         )

//       case "audio":
//         return (
//           <div className="space-y-2">
//             {message.attachmentUrl && (
//               <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
//                 <Mic className="h-4 w-4 text-muted-foreground" />
//                 <audio src={message.attachmentUrl} controls className="flex-1">
//                   Your browser does not support the audio tag.
//                 </audio>
//               </div>
//             )}
//             {message.content && message.content !== "Sent audio" && (
//               <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
//             )}
//           </div>
//         )

//       case "carousel":
//         return (
//           <div className="space-y-2">
//             <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
//               <ImageIcon className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm text-muted-foreground">Carousel message</span>
//             </div>
//             {message.content && (
//               <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
//             )}
//           </div>
//         )

//       default:
//         return <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
//     }
//   }

//   return (
//     <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-6 py-4">
//       <div className="space-y-6 max-w-4xl mx-auto">
//         {Object.entries(groupedMessages).map(([date, msgs]) => (
//           <div key={date}>
//             <div className="flex items-center gap-4 mb-6">
//               <div className="flex-1 h-px bg-border" />
//               <span className="text-xs text-muted-foreground font-medium px-3 py-1.5 bg-muted/50 rounded-full">
//                 {formatDateLabel(date)}
//               </span>
//               <div className="flex-1 h-px bg-border" />
//             </div>

//             <div className="space-y-3">
//               {msgs.map((message, index) => {
//                 const showAvatar = index === 0 || msgs[index - 1].isFromUser !== message.isFromUser
//                 const isConsecutive = index > 0 && msgs[index - 1].isFromUser === message.isFromUser

//                 return (
//                   <div
//                     key={message.id}
//                     className={cn(
//                       "flex gap-3 items-end group transition-opacity hover:opacity-100",
//                       !message.isFromUser && "flex-row-reverse",
//                       isConsecutive && "opacity-90",
//                     )}
//                   >
//                     {showAvatar ? (
//                       <Avatar className="h-8 w-8 shadow-sm">
//                         {message.isFromUser ? (
//                           <AvatarFallback className="bg-gradient-to-br from-pink-500 to-orange-400 text-white text-xs font-medium">
//                             CU
//                           </AvatarFallback>
//                         ) : (
//                           <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
//                             YO
//                           </AvatarFallback>
//                         )}
//                       </Avatar>
//                     ) : (
//                       <div className="h-8 w-8" />
//                     )}

//                     <div className={cn("flex flex-col gap-1 max-w-[65%]", !message.isFromUser && "items-end")}>
//                       <div
//                         className={cn(
//                           "rounded-2xl px-4 py-2.5 shadow-sm transition-all",
//                           message.isFromUser
//                             ? "bg-muted text-foreground rounded-bl-sm"
//                             : "bg-primary text-primary-foreground rounded-br-sm",
//                           showAvatar && message.isFromUser && "rounded-tl-2xl",
//                           showAvatar && !message.isFromUser && "rounded-tr-2xl",
//                         )}
//                       >
//                         {renderMessageContent(message)}
//                       </div>
//                       <div className="flex items-center gap-1.5 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <time className="text-xs text-muted-foreground">
//                           {format(new Date(message.createdAt), "h:mm a")}
//                         </time>
//                         {!message.isFromUser && (
//                           <span className="text-muted-foreground">
//                             {message.isRead ? (
//                               <CheckCheck className="h-3 w-3 text-primary" />
//                             ) : (
//                               <Check className="h-3 w-3" />
//                             )}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         ))}
//         <div ref={bottomRef} />
//       </div>
//     </div>
//   )
// }


"use client"

import { useEffect, useRef, useState } from "react"
import { format, isToday, isYesterday } from "date-fns"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCheck, Check, ImageIcon, Mic } from "lucide-react"

type Message = {
  id: string
  content: string
  createdAt: Date
  isFromUser: boolean
  isRead: boolean
  messageType?: string
  attachmentUrl?: string | null
  attachmentMetadata?: any
}

interface MessageThreadProps {
  messages: Message[]
}

export function MessageThread({ messages }: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [prevMessageCount, setPrevMessageCount] = useState(messages.length)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > prevMessageCount && shouldAutoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    setPrevMessageCount(messages.length)
  }, [messages, prevMessageCount, shouldAutoScroll])

  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setShouldAutoScroll(isNearBottom)
  }

  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = format(new Date(message.createdAt), "yyyy-MM-dd")
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
      return groups
    },
    {} as Record<string, typeof messages>,
  )

  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString)
    if (isToday(date)) return "Today"
    if (isYesterday(date)) return "Yesterday"
    return format(date, "MMMM d, yyyy")
  }

  const renderMessageContent = (message: Message) => {
    const messageType = message.messageType || "text"

    switch (messageType) {
      case "image":
        return (
          <div className="space-y-2">
            {message.attachmentUrl && (
              <div className="rounded-lg overflow-hidden bg-muted/30">
                <img
                  src={message.attachmentUrl || "/placeholder.svg"}
                  alt="Shared image"
                  className="max-w-full h-auto max-h-96 object-contain"
                />
              </div>
            )}
            {message.content && message.content !== "Sent image" && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
            )}
          </div>
        )

      case "video":
        return (
          <div className="space-y-2">
            {message.attachmentUrl && (
              <div className="rounded-lg overflow-hidden bg-muted/30 relative group">
                <video
                  src={message.attachmentUrl}
                  controls
                  className="max-w-full h-auto max-h-96 object-contain"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            {message.content && message.content !== "Sent video" && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
            )}
          </div>
        )

      case "audio":
        return (
          <div className="space-y-2">
            {message.attachmentUrl && (
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Mic className="h-4 w-4 text-muted-foreground" />
                <audio src={message.attachmentUrl} controls className="flex-1">
                  Your browser does not support the audio tag.
                </audio>
              </div>
            )}
            {message.content && message.content !== "Sent audio" && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
            )}
          </div>
        )

      case "carousel":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Carousel message</span>
            </div>
            {message.content && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
            )}
          </div>
        )

      default:
        return <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
    }
  }

  return (
    <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-6 py-4">
      <div className="space-y-6 max-w-4xl mx-auto">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium px-3 py-1.5 bg-muted/50 rounded-full">
                {formatDateLabel(date)}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="space-y-3">
              {msgs.map((message, index) => {
                const showAvatar = index === 0 || msgs[index - 1].isFromUser !== message.isFromUser
                const isConsecutive = index > 0 && msgs[index - 1].isFromUser === message.isFromUser

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 items-end group transition-opacity hover:opacity-100",
                      message.isFromUser && "flex-row-reverse",
                      isConsecutive && "opacity-90",
                    )}
                  >
                    {showAvatar ? (
                      <Avatar className="h-8 w-8 shadow-sm">
                        {message.isFromUser ? (
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                            YO
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-pink-500 to-orange-400 text-white text-xs font-medium">
                            CU
                          </AvatarFallback>
                        )}
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8" />
                    )}

                    <div className={cn("flex flex-col gap-1 max-w-[65%]", message.isFromUser && "items-end")}>
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2.5 shadow-sm transition-all",
                          message.isFromUser
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted text-foreground rounded-bl-sm",
                          showAvatar && message.isFromUser && "rounded-tr-2xl",
                          showAvatar && !message.isFromUser && "rounded-tl-2xl",
                        )}
                      >
                        {renderMessageContent(message)}
                      </div>
                      <div className="flex items-center gap-1.5 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <time className="text-xs text-muted-foreground">
                          {format(new Date(message.createdAt), "h:mm a")}
                        </time>
                        {message.isFromUser && (
                          <span className="text-muted-foreground">
                            {message.isRead ? (
                              <CheckCheck className="h-3 w-3 text-primary" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
