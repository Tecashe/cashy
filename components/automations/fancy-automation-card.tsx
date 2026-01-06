// "use client"

// import { useState } from "react"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Switch } from "@/components/ui/switch"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu"
// import { motion, AnimatePresence } from "framer-motion"
// import {
//   Edit,
//   Trash2,
//   MoreVertical,
//   Clock,
//   AlertCircle,
//   MessageSquare,
//   ChevronDown,
//   ChevronUp,
//   TrendingUp,
// } from "lucide-react"
// import Link from "next/link"
// import { cn } from "@/lib/utils"
// import { formatDate } from "@/lib/utils"
// import { useRouter, useTransition } from "next/navigation"
// import { toggleAutomationStatus, deleteAutomation } from "@/lib/actions/automation-actions"
// import { AutomationDetailsModal } from "./automation-details-modal"
// import { useConfirm } from "./confirm-dialog"
// //
// interface FancyAutomationCardProps {
//   automation: any
//   index?: number
//   onDelete?: () => void
//   onToggle?: (isActive: boolean) => void
// }

// export function FancyAutomationCard({ automation, index = 0, onDelete, onToggle }: FancyAutomationCardProps) {
//   const [isPending, startTransition] = useTransition()
//   const router = useRouter()
//   const { confirm, dialog } = useConfirm()
//   const [showChat, setShowChat] = useState(false)

//   const executionStats = {
//     total: automation.executions?.length || 0,
//     successful: automation.executions?.filter((e: any) => e.status === "success").length || 0,
//     failed: automation.executions?.filter((e: any) => e.status === "failed").length || 0,
//     successRate: automation.executions?.length
//       ? Math.round(
//           (automation.executions.filter((e: any) => e.status === "success").length / automation.executions.length) *
//             100,
//         )
//       : 0,
//     lastExecution: automation.executions?.[0]?.executedAt,
//   }

//   const connectedAccount = automation.instagramAccount
//   const primaryTrigger = automation.triggers?.[0]
//   const actionCount = automation.actions?.length || 0

//   const handleToggle = () => {
//     if (onToggle) {
//       onToggle(!automation.isActive)
//     } else {
//       startTransition(async () => {
//         await toggleAutomationStatus(automation.id, !automation.isActive)
//         router.refresh()
//       })
//     }
//   }

//   const handleDelete = () => {
//     if (onDelete) {
//       onDelete()
//     } else {
//       confirm({
//         title: "Delete Automation?",
//         description: "This automation and all its settings will be permanently deleted. This action cannot be undone.",
//         confirmText: "Delete",
//         cancelText: "Cancel",
//         variant: "danger",
//         onConfirm: async () => {
//           startTransition(async () => {
//             await deleteAutomation(automation.id)
//             router.refresh()
//           })
//         },
//       })
//     }
//   }

//   return (
//     <>
//       {dialog}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{
//           duration: 0.4,
//           delay: (index || 0) * 0.05,
//           ease: [0.4, 0, 0.2, 1],
//         }}
//       >
//         <Card
//           className={cn(
//             "group relative overflow-hidden border border-border/50",
//             "bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm",
//             "shadow-lg transition-all duration-300",
//             "hover:border-primary/30 hover:shadow-2xl hover:-translate-y-1",
//             automation.isActive && "border-primary/20 bg-gradient-to-br from-primary/5 to-card/70",
//           )}
//         >
//           {/* Active status indicator */}
//           {automation.isActive && (
//             <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary via-primary/70 to-primary/30">
//               <div className="absolute inset-0 animate-pulse bg-primary/30 blur-sm" />
//             </div>
//           )}

//           {/* Gradient overlay on hover */}
//           <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

//           <div className="relative space-y-5 p-6">
//             {/* Header */}
//             <div className="flex items-start justify-between gap-3">
//               <div className="flex-1 min-w-0 space-y-1">
//                 <h3 className="text-xl font-bold tracking-tight line-clamp-1 text-foreground">{automation.name}</h3>
//                 {automation.description && (
//                   <p className="text-sm text-muted-foreground line-clamp-2">{automation.description}</p>
//                 )}
//               </div>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted/50"
//                     disabled={isPending}
//                   >
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-48">
//                   <DropdownMenuItem asChild>
//                     <Link href={`/automations/${automation.id}`} className="cursor-pointer">
//                       <Edit className="mr-3 h-4 w-4" />
//                       Edit
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem
//                     onClick={handleDelete}
//                     disabled={isPending}
//                     className="cursor-pointer text-destructive focus:text-destructive"
//                   >
//                     <Trash2 className="mr-3 h-4 w-4" />
//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             {/* Connected Instagram Account */}
//             {connectedAccount && (
//               <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-muted/40 to-muted/20 p-3 ring-1 ring-border/50">
//                 {connectedAccount.profilePicUrl && (
//                   <img
//                     src={connectedAccount.profilePicUrl || "/placeholder.svg"}
//                     alt={connectedAccount.username}
//                     className="h-10 w-10 rounded-full object-cover ring-1 ring-primary/20"
//                   />
//                 )}
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-semibold leading-tight">@{connectedAccount.username}</p>
//                   <p className="text-xs text-muted-foreground mt-0.5">
//                     {connectedAccount.followerCount?.toLocaleString() || 0} followers
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Trigger & Action Details Modal */}
//             <AutomationDetailsModal automation={automation} />

//             {/* Execution Statistics Grid */}
//             <div className="grid grid-cols-3 gap-2">
//               <motion.div
//                 className="rounded-lg border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-3"
//                 whileHover={{ y: -2 }}
//               >
//                 <p className="text-xs text-muted-foreground font-medium">Total</p>
//                 <p className="text-lg font-bold mt-1">{executionStats.total}</p>
//               </motion.div>

//               <motion.div
//                 className="rounded-lg border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5 p-3"
//                 whileHover={{ y: -2 }}
//               >
//                 <p className="text-xs text-muted-foreground font-medium">Success</p>
//                 <p className="text-lg font-bold mt-1 text-green-400">{executionStats.successful}</p>
//               </motion.div>

//               <motion.div
//                 className={cn(
//                   "rounded-lg border p-3",
//                   executionStats.failed > 0
//                     ? "border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-500/5"
//                     : "border-border/50 bg-gradient-to-br from-muted/30 to-muted/10",
//                 )}
//                 whileHover={{ y: -2 }}
//               >
//                 <p className="text-xs text-muted-foreground font-medium">Failed</p>
//                 <p className={cn("text-lg font-bold mt-1", executionStats.failed > 0 ? "text-red-400" : "text-muted")}>
//                   {executionStats.failed}
//                 </p>
//               </motion.div>
//             </div>

//             <div className="space-y-2 rounded-lg border border-border/50 bg-gradient-to-r from-muted/20 to-muted/10 p-3">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                   <TrendingUp className="h-3.5 w-3.5 text-green-400" />
//                   <span>Success Rate</span>
//                 </div>
//                 <span className="text-sm font-semibold text-green-400">{executionStats.successRate}%</span>
//               </div>

//               <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                 <Clock className="h-3.5 w-3.5" />
//                 <span>Created {formatDate(new Date(automation.createdAt))}</span>
//               </div>

//               {executionStats.lastExecution && (
//                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                   <AlertCircle className="h-3.5 w-3.5" />
//                   <span>Last executed {formatDate(new Date(executionStats.lastExecution))}</span>
//                 </div>
//               )}
//             </div>

//             {executionStats.total > 0 && (
//               <div className="border-t border-border/50 pt-3">
//                 <button
//                   onClick={() => setShowChat(!showChat)}
//                   className="w-full flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors"
//                 >
//                   <div className="flex items-center gap-2">
//                     <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
//                       <MessageSquare className="h-4 w-4 text-blue-400" />
//                     </div>
//                     <span className="font-medium text-sm">View Execution History</span>
//                   </div>
//                   {showChat ? (
//                     <ChevronUp className="h-4 w-4 text-muted-foreground" />
//                   ) : (
//                     <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                   )}
//                 </button>

//                 <AnimatePresence>
//                   {showChat && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: "auto", opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="mt-3 space-y-2 max-h-64 overflow-y-auto"
//                     >
//                       {automation.executions?.slice(0, 5).map((exec: any) => (
//                         <motion.div
//                           key={exec.id}
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           className="rounded-lg border border-border/50 bg-muted/20 p-3 text-xs"
//                         >
//                           <div className="flex items-center justify-between mb-1">
//                             <span className="font-medium flex items-center gap-2">
//                               {exec.status === "success" ? (
//                                 <span className="text-green-400">✓</span>
//                               ) : (
//                                 <span className="text-red-400">✗</span>
//                               )}
//                               {exec.status}
//                             </span>
//                             <span className="text-muted-foreground">{formatDate(new Date(exec.executedAt))}</span>
//                           </div>
//                           {exec.error && <p className="text-red-400 mt-1 break-words">{exec.error}</p>}
//                         </motion.div>
//                       ))}
//                       {executionStats.total > 5 && (
//                         <p className="text-xs text-muted-foreground text-center py-2">
//                           +{executionStats.total - 5} more executions
//                         </p>
//                       )}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             )}

//             {/* Status Toggle & Badge */}
//             <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-4">
//               <div className="flex items-center gap-2">
//                 <Switch
//                   checked={automation.isActive}
//                   onCheckedChange={handleToggle}
//                   disabled={isPending}
//                   className="data-[state=checked]:bg-primary"
//                 />
//                 <span className="text-sm font-medium text-muted-foreground">
//                   {automation.isActive ? "Active" : "Inactive"}
//                 </span>
//               </div>

//               <Badge
//                 className={cn(
//                   "text-xs font-semibold",
//                   automation.isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
//                 )}
//               >
//                 {automation.status || "draft"}
//               </Badge>
//             </div>
//           </div>
//         </Card>
//       </motion.div>
//     </>
//   )
// }
"use client"

import { useState, useTransition } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import {
  Edit,
  Trash2,
  MoreVertical,
  Clock,
  AlertCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toggleAutomationStatus, deleteAutomation } from "@/lib/actions/automation-actions"
import { AutomationDetailsModal } from "./automation-details-modal"
import { useConfirm } from "./confirm-dialog"

interface FancyAutomationCardProps {
  automation: any
  index?: number
  onDelete?: () => void
  onToggle?: (isActive: boolean) => void
}

export function FancyAutomationCard({ automation, index = 0, onDelete, onToggle }: FancyAutomationCardProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { confirm, dialog } = useConfirm()
  const [showChat, setShowChat] = useState(false)

  const executionStats = {
    total: automation.executions?.length || 0,
    successful: automation.executions?.filter((e: any) => e.status === "success").length || 0,
    failed: automation.executions?.filter((e: any) => e.status === "failed").length || 0,
    successRate: automation.executions?.length
      ? Math.round(
          (automation.executions.filter((e: any) => e.status === "success").length / automation.executions.length) *
            100,
        )
      : 0,
    lastExecution: automation.executions?.[0]?.executedAt,
  }

  const connectedAccount = automation.instagramAccount
  const primaryTrigger = automation.triggers?.[0]
  const actionCount = automation.actions?.length || 0

  const handleToggle = () => {
    if (onToggle) {
      onToggle(!automation.isActive)
    } else {
      startTransition(async () => {
        await toggleAutomationStatus(automation.id, !automation.isActive)
        router.refresh()
      })
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    } else {
      confirm({
        title: "Delete Automation?",
        description: "This automation and all its settings will be permanently deleted. This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
        variant: "danger",
        onConfirm: async () => {
          startTransition(async () => {
            await deleteAutomation(automation.id)
            router.refresh()
          })
        },
      })
    }
  }

  return (
    <>
      {dialog}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: (index || 0) * 0.05,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <Card
          className={cn(
            "group relative overflow-hidden border border-border/50",
            "bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm",
            "shadow-lg transition-all duration-300",
            "hover:border-primary/30 hover:shadow-2xl hover:-translate-y-1",
            automation.isActive && "border-primary/20 bg-gradient-to-br from-primary/5 to-card/70",
          )}
        >
          {/* Active status indicator */}
          {automation.isActive && (
            <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary via-primary/70 to-primary/30">
              <div className="absolute inset-0 animate-pulse bg-primary/30 blur-sm" />
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative space-y-5 p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="text-xl font-bold tracking-tight line-clamp-1 text-foreground">{automation.name}</h3>
                {automation.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{automation.description}</p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted/50"
                    disabled={isPending}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={`/automations/${automation.id}`} className="cursor-pointer">
                      <Edit className="mr-3 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isPending}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-3 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Connected Instagram Account */}
            {connectedAccount && (
              <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-muted/40 to-muted/20 p-3 ring-1 ring-border/50">
                {connectedAccount.profilePicUrl && (
                  <img
                    src={connectedAccount.profilePicUrl || "/placeholder.svg"}
                    alt={connectedAccount.username}
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-primary/20"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight">@{connectedAccount.username}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {connectedAccount.followerCount?.toLocaleString() || 0} followers
                  </p>
                </div>
              </div>
            )}

            {/* Trigger & Action Details Modal */}
            <AutomationDetailsModal automation={automation} />

            {/* Execution Statistics Grid */}
            <div className="grid grid-cols-3 gap-2">
              <motion.div
                className="rounded-lg border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-3"
                whileHover={{ y: -2 }}
              >
                <p className="text-xs text-muted-foreground font-medium">Total</p>
                <p className="text-lg font-bold mt-1">{executionStats.total}</p>
              </motion.div>

              <motion.div
                className="rounded-lg border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5 p-3"
                whileHover={{ y: -2 }}
              >
                <p className="text-xs text-muted-foreground font-medium">Success</p>
                <p className="text-lg font-bold mt-1 text-green-400">{executionStats.successful}</p>
              </motion.div>

              <motion.div
                className={cn(
                  "rounded-lg border p-3",
                  executionStats.failed > 0
                    ? "border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-500/5"
                    : "border-border/50 bg-gradient-to-br from-muted/30 to-muted/10",
                )}
                whileHover={{ y: -2 }}
              >
                <p className="text-xs text-muted-foreground font-medium">Failed</p>
                <p className={cn("text-lg font-bold mt-1", executionStats.failed > 0 ? "text-red-400" : "text-muted")}>
                  {executionStats.failed}
                </p>
              </motion.div>
            </div>

            <div className="space-y-2 rounded-lg border border-border/50 bg-gradient-to-r from-muted/20 to-muted/10 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                  <span>Success Rate</span>
                </div>
                <span className="text-sm font-semibold text-green-400">{executionStats.successRate}%</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Created {formatDate(new Date(automation.createdAt))}</span>
              </div>

              {executionStats.lastExecution && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Last executed {formatDate(new Date(executionStats.lastExecution))}</span>
                </div>
              )}
            </div>

            {executionStats.total > 0 && (
              <div className="border-t border-border/50 pt-3">
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <MessageSquare className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="font-medium text-sm">View Execution History</span>
                  </div>
                  {showChat ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {showChat && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 space-y-2 max-h-64 overflow-y-auto"
                    >
                      {automation.executions?.slice(0, 5).map((exec: any) => (
                        <motion.div
                          key={exec.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="rounded-lg border border-border/50 bg-muted/20 p-3 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium flex items-center gap-2">
                              {exec.status === "success" ? (
                                <span className="text-green-400">✓</span>
                              ) : (
                                <span className="text-red-400">✗</span>
                              )}
                              {exec.status}
                            </span>
                            <span className="text-muted-foreground">{formatDate(new Date(exec.executedAt))}</span>
                          </div>
                          {exec.error && <p className="text-red-400 mt-1 break-words">{exec.error}</p>}
                        </motion.div>
                      ))}
                      {executionStats.total > 5 && (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          +{executionStats.total - 5} more executions
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Status Toggle & Badge */}
            <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={automation.isActive}
                  onCheckedChange={handleToggle}
                  disabled={isPending}
                  className="data-[state=checked]:bg-primary"
                />
                <span className="text-sm font-medium text-muted-foreground">
                  {automation.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <Badge
                className={cn(
                  "text-xs font-semibold",
                  automation.isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                {automation.status || "draft"}
              </Badge>
            </div>
          </div>
        </Card>
      </motion.div>
    </>
  )
}
