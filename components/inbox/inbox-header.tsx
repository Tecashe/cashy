// "use client"

// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Inbox, RefreshCw } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { useState } from "react"

// interface InboxHeaderProps {
//   unreadCount: number
//   totalCount: number
// }

// export function InboxHeader({ unreadCount, totalCount }: InboxHeaderProps) {
//   const router = useRouter()
//   const [isRefreshing, setIsRefreshing] = useState(false)

//   const handleRefresh = () => {
//     setIsRefreshing(true)
//     router.refresh()
//     setTimeout(() => setIsRefreshing(false), 1000)
//   }

//   return (
//     <div className="border-b border-border bg-card">
//       <div className="flex items-center justify-between p-4">
//         <div className="flex items-center gap-3">
//           <Inbox className="h-6 w-6" />
//           <div>
//             <h1 className="text-xl font-semibold">Inbox</h1>
//             <p className="text-sm text-muted-foreground">
//               {totalCount} conversations
//               {unreadCount > 0 && (
//                 <Badge variant="default" className="ml-2">
//                   {unreadCount} unread
//                 </Badge>
//               )}
//             </p>
//           </div>
//         </div>
//         <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
//           <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
//           Refresh
//         </Button>
//       </div>
//     </div>
//   )
// }
"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Inbox, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface InboxHeaderProps {
  unreadCount: number
  totalCount: number
}

export function InboxHeader({ unreadCount, totalCount }: InboxHeaderProps) {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="border-b border-border bg-card">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Inbox className="h-6 w-6" />
          <div>
            <h1 className="text-xl font-semibold">Inbox</h1>
            <p className="text-sm text-muted-foreground">
              {totalCount} conversations
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {unreadCount} unread
                </Badge>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  )
}
