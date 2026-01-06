// "use client"

// import { useState, useCallback, useMemo, useTransition } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { FancyAutomationCard } from "./fancy-automation-card"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Zap, Play, Search, Grid3x3, List, Trash2, Filter, AlertTriangle, Flame } from "lucide-react"
// import Link from "next/link"
// import { cn } from "@/lib/utils"
// import { useAutomations } from "@/hooks/use-automations"
// import { useConfirm } from "./confirm-dialog"

// interface AutomationsListProps {
//   initialAutomations: any[]
//   userId: string
// }

// const STATS_CARDS = [
//   {
//     label: "Total Automations",
//     icon: Zap,
//     color: "from-blue-500/10 to-blue-500/5",
//     iconColor: "text-blue-400",
//     key: "total",
//   },
//   {
//     label: "Active",
//     icon: Play,
//     color: "from-green-500/10 to-green-500/5",
//     iconColor: "text-green-400",
//     key: "active",
//   },
//   {
//     label: "Paused",
//     icon: AlertTriangle,
//     color: "from-yellow-500/10 to-yellow-500/5",
//     iconColor: "text-yellow-400",
//     key: "paused",
//   },
//   {
//     label: "Total Executions",
//     icon: Flame,
//     color: "from-red-500/10 to-red-500/5",
//     iconColor: "text-red-400",
//     key: "executions",
//   },
// ]

// export function AutomationsList({ initialAutomations, userId }: AutomationsListProps) {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
//   const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all")
//   const [showTrash, setShowTrash] = useState(false)
//   const [showEmptyTrashDialog, setShowEmptyTrashDialog] = useState(false)
//   const [isPending, startTransition] = useTransition()

//   const {
//     automations,
//     trashedAutomations,
//     isLoading,
//     fetchAutomations,
//     fetchTrashedAutomations,
//     handleMoveToTrash,
//     handleRestore,
//     handlePermanentlyDelete,
//     handleEmptyTrash,
//     handleToggleStatus,
//   } = useAutomations()

//   const { confirm, dialog } = useConfirm()

//   // Initialize automations on mount
//   const [initialized, setInitialized] = useState(false)
//   if (!initialized) {
//     if (automations.length === 0) {
//       startTransition(async () => {
//         if (initialAutomations.length > 0) {
//           // Use initial data from server
//         }
//         await fetchAutomations()
//         await fetchTrashedAutomations()
//         setInitialized(true)
//       })
//     } else {
//       setInitialized(true)
//     }
//   }

//   // Calculate stats
//   const stats = useMemo(() => {
//     const displayAutomations = initialAutomations.length > 0 ? initialAutomations : automations
//     return {
//       total: displayAutomations.length,
//       active: displayAutomations.filter((a) => a.isActive).length,
//       paused: displayAutomations.filter((a) => !a.isActive).length,
//       executions: displayAutomations.reduce((sum, a) => sum + (a.executions?.length || 0), 0),
//     }
//   }, [automations, initialAutomations])

//   // Filter and search automations
//   const filteredAutomations = useMemo(() => {
//     const displayAutomations = initialAutomations.length > 0 ? initialAutomations : automations

//     return displayAutomations
//       .filter((automation) => {
//         if (activeFilter === "active") return automation.isActive
//         if (activeFilter === "inactive") return !automation.isActive
//         return true
//       })
//       .filter((automation) => {
//         const searchLower = searchQuery.toLowerCase()
//         return (
//           automation.name.toLowerCase().includes(searchLower) ||
//           automation.description?.toLowerCase().includes(searchLower) ||
//           automation.instagramAccount?.username.toLowerCase().includes(searchLower)
//         )
//       })
//   }, [automations, initialAutomations, searchQuery, activeFilter])

//   const handleDeleteWithConfirm = useCallback(
//     (automationId: string, automationName: string) => {
//       confirm({
//         title: "Move to Trash?",
//         description: `"${automationName}" will be moved to trash. You can restore it later.`,
//         confirmText: "Move to Trash",
//         cancelText: "Cancel",
//         variant: "danger",
//         onConfirm: () => handleMoveToTrash(automationId),
//       })
//     },
//     [confirm, handleMoveToTrash],
//   )

//   const handlePermanentlyDeleteWithConfirm = useCallback(
//     (automationId: string, automationName: string) => {
//       confirm({
//         title: "Permanently Delete?",
//         description: `"${automationName}" will be permanently deleted. This action cannot be undone.`,
//         confirmText: "Delete Forever",
//         cancelText: "Cancel",
//         variant: "danger",
//         onConfirm: () => handlePermanentlyDelete(automationId),
//       })
//     },
//     [confirm, handlePermanentlyDelete],
//   )

//   const handleEmptyTrashWithConfirm = useCallback(() => {
//     confirm({
//       title: "Empty Trash?",
//       description: `All ${trashedAutomations.length} automation(s) in trash will be permanently deleted. This action cannot be undone.`,
//       confirmText: "Empty Trash",
//       cancelText: "Cancel",
//       variant: "danger",
//       onConfirm: () => {
//         handleEmptyTrash()
//         setShowEmptyTrashDialog(false)
//       },
//     })
//   }, [confirm, trashedAutomations.length, handleEmptyTrash])

//   // Empty state
//   if (filteredAutomations.length === 0 && !showTrash && !searchQuery && activeFilter === "all") {
//     return (
//       <>
//         {dialog}
//         <Card className="group relative overflow-hidden border-dashed border-2 border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/50">
//           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
//           <CardContent className="relative flex min-h-[500px] flex-col items-center justify-center gap-6 py-16">
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.5, ease: "easeOut" }}
//               className="relative"
//             >
//               <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-2xl" />
//               <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg ring-1 ring-primary/10">
//                 <Zap className="h-12 w-12 text-primary" />
//               </div>
//             </motion.div>

//             <div className="text-center space-y-3 max-w-md">
//               <h3 className="text-2xl font-semibold tracking-tight">No automations yet</h3>
//               <p className="text-base text-muted-foreground leading-relaxed">
//                 Create your first automation to start automating Instagram interactions
//               </p>
//             </div>

//             <Link href="/automations/new">
//               <Button
//                 size="lg"
//                 className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
//               >
//                 <span className="relative z-10 flex items-center gap-2">
//                   <Play className="h-4 w-4" />
//                   Create Your First Automation
//                 </span>
//                 <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
//               </Button>
//             </Link>
//           </CardContent>
//         </Card>
//       </>
//     )
//   }

//   return (
//     <>
//       {dialog}

//       {/* Trash Modal */}
//       <Dialog open={showTrash} onOpenChange={setShowTrash}>
//         <DialogContent className="max-w-4xl">
//           <DialogHeader>
//             <DialogTitle>Trash</DialogTitle>
//             <DialogDescription>Recover or permanently delete automations</DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4">
//             {trashedAutomations.length > 0 && (
//               <div className="flex justify-end">
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   onClick={() => setShowEmptyTrashDialog(true)}
//                   disabled={isPending}
//                 >
//                   <Trash2 className="mr-2 h-4 w-4" />
//                   Empty Trash
//                 </Button>
//               </div>
//             )}

//             {trashedAutomations.length === 0 ? (
//               <Card>
//                 <CardContent className="flex items-center justify-center py-12">
//                   <p className="text-muted-foreground">Trash is empty</p>
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
//                 {trashedAutomations.map((automation) => (
//                   <motion.div
//                     key={automation.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                   >
//                     <Card className="relative overflow-hidden border-border/50 bg-card/50">
//                       <CardContent className="p-6 space-y-4">
//                         <div>
//                           <h4 className="font-semibold">{automation.name}</h4>
//                           {automation.instagramAccount && (
//                             <p className="text-sm text-muted-foreground mt-1">
//                               @{automation.instagramAccount.username}
//                             </p>
//                           )}
//                         </div>

//                         <div className="flex gap-2 pt-2 border-t border-border/50">
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => handleRestore(automation.id)}
//                             disabled={isPending}
//                             className="flex-1"
//                           >
//                             Restore
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="destructive"
//                             onClick={() => handlePermanentlyDeleteWithConfirm(automation.id, automation.name)}
//                             disabled={isPending}
//                             className="flex-1"
//                           >
//                             Delete
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Empty Trash Confirmation */}
//       <Dialog open={showEmptyTrashDialog} onOpenChange={setShowEmptyTrashDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Empty Trash?</DialogTitle>
//             <DialogDescription>
//               This will permanently delete {trashedAutomations.length} automation(s). This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="flex gap-3 justify-end pt-4">
//             <Button variant="outline" onClick={() => setShowEmptyTrashDialog(false)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={handleEmptyTrashWithConfirm} disabled={isPending}>
//               Empty Trash
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Stats Cards */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
//         {STATS_CARDS.map((card, idx) => {
//           const Icon = card.icon
//           const value = stats[card.key as keyof typeof stats]

//           return (
//             <motion.div
//               key={card.label}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: idx * 0.1 }}
//             >
//               <Card className={cn("bg-gradient-to-br border-border/50", card.color)}>
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
//                       <p className="text-3xl font-bold mt-2">{value}</p>
//                     </div>
//                     <div className={cn("p-3 rounded-lg bg-card/50 border border-border/50", card.iconColor)}>
//                       <Icon className="h-6 w-6" />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )
//         })}
//       </div>

//       {/* Search and Filters */}
//       <div className="space-y-4 mb-8">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//           <Input
//             placeholder="Search automations by name, description, or Instagram account..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 bg-card border-border/50 h-11"
//           />
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
//           <div className="flex gap-2">
//             <Badge
//               variant={activeFilter === "all" ? "default" : "secondary"}
//               className="cursor-pointer"
//               onClick={() => setActiveFilter("all")}
//             >
//               <Filter className="mr-1 h-3 w-3" />
//               All
//             </Badge>
//             <Badge
//               variant={activeFilter === "active" ? "default" : "secondary"}
//               className="cursor-pointer"
//               onClick={() => setActiveFilter("active")}
//             >
//               Active
//             </Badge>
//             <Badge
//               variant={activeFilter === "inactive" ? "default" : "secondary"}
//               className="cursor-pointer"
//               onClick={() => setActiveFilter("inactive")}
//             >
//               Inactive
//             </Badge>
//           </div>

//           <div className="flex gap-2 sm:ml-auto">
//             <Button
//               size="icon"
//               variant={viewMode === "grid" ? "default" : "outline"}
//               onClick={() => setViewMode("grid")}
//             >
//               <Grid3x3 className="h-4 w-4" />
//             </Button>
//             <Button
//               size="icon"
//               variant={viewMode === "list" ? "default" : "outline"}
//               onClick={() => setViewMode("list")}
//             >
//               <List className="h-4 w-4" />
//             </Button>
//             <Button size="sm" variant="outline" onClick={() => setShowTrash(true)} className="ml-auto sm:ml-2">
//               <Trash2 className="mr-2 h-4 w-4" />
//               Trash {trashedAutomations.length > 0 && `(${trashedAutomations.length})`}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* No Results State */}
//       {filteredAutomations.length === 0 ? (
//         <Card className="border-dashed border-2">
//           <CardContent className="flex items-center justify-center py-12">
//             <div className="text-center">
//               <p className="text-muted-foreground mb-2">No automations found</p>
//               <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <AnimatePresence>
//           <motion.div
//             className={cn("gap-5", viewMode === "grid" ? "grid sm:grid-cols-1 lg:grid-cols-2" : "flex flex-col")}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             {filteredAutomations.map((automation, index) => (
//               <FancyAutomationCard
//                 key={automation.id}
//                 automation={automation}
//                 index={index}
//                 onDelete={() => handleDeleteWithConfirm(automation.id, automation.name)}
//                 onToggle={(isActive) => handleToggleStatus(automation.id, isActive)}
//               />
//             ))}
//           </motion.div>
//         </AnimatePresence>
//       )}
//     </>
//   )
// }

// "use client"

// import { useState, useCallback, useMemo, useTransition } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { FancyAutomationCard } from "./fancy-automation-card"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Zap, Play, Search, Grid3x3, List, Trash2, Filter, AlertTriangle, Flame } from "lucide-react"
// import Link from "next/link"
// import { cn } from "@/lib/utils"
// import { useAutomations } from "@/hooks/use-automations"
// import { useConfirm } from "./confirm-dialog"

// interface AutomationsListProps {
//   initialAutomations: any[]
//   userId: string
// }

// const STATS_CARDS = [
//   {
//     label: "Total Automations",
//     icon: Zap,
//     color: "from-blue-500/10 to-blue-500/5",
//     iconColor: "text-blue-400",
//     key: "total",
//   },
//   {
//     label: "Active",
//     icon: Play,
//     color: "from-green-500/10 to-green-500/5",
//     iconColor: "text-green-400",
//     key: "active",
//   },
//   {
//     label: "Paused",
//     icon: AlertTriangle,
//     color: "from-yellow-500/10 to-yellow-500/5",
//     iconColor: "text-yellow-400",
//     key: "paused",
//   },
//   {
//     label: "Total Executions",
//     icon: Flame,
//     color: "from-red-500/10 to-red-500/5",
//     iconColor: "text-red-400",
//     key: "executions",
//   },
// ]

// export function AutomationsList({ initialAutomations, userId }: AutomationsListProps) {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
//   const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all")
//   const [showTrash, setShowTrash] = useState(false)
//   const [showEmptyTrashDialog, setShowEmptyTrashDialog] = useState(false)
//   const [isPending, startTransition] = useTransition()

//   const {
//     trashedAutomations,
//     handleMoveToTrash,
//     handleRestore,
//     handlePermanentlyDelete,
//     handleEmptyTrash,
//     handleToggleStatus,
//   } = useAutomations()

//   const { confirm, dialog } = useConfirm()

//   // Just use the initialAutomations prop directly

//   // Calculate stats from initialAutomations
//   const stats = useMemo(() => {
//     return {
//       total: initialAutomations.length,
//       active: initialAutomations.filter((a) => a.isActive).length,
//       paused: initialAutomations.filter((a) => !a.isActive).length,
//       executions: initialAutomations.reduce((sum, a) => sum + (a.executions?.length || 0), 0),
//     }
//   }, [initialAutomations])

//   // Filter and search automations
//   const filteredAutomations = useMemo(() => {
//     return initialAutomations
//       .filter((automation) => {
//         if (activeFilter === "active") return automation.isActive
//         if (activeFilter === "inactive") return !automation.isActive
//         return true
//       })
//       .filter((automation) => {
//         const searchLower = searchQuery.toLowerCase()
//         return (
//           automation.name.toLowerCase().includes(searchLower) ||
//           automation.description?.toLowerCase().includes(searchLower) ||
//           automation.instagramAccount?.username.toLowerCase().includes(searchLower)
//         )
//       })
//   }, [initialAutomations, searchQuery, activeFilter])

//   const handleDeleteWithConfirm = useCallback(
//     (automationId: string, automationName: string) => {
//       confirm({
//         title: "Move to Trash?",
//         description: `"${automationName}" will be moved to trash. You can restore it later.`,
//         confirmText: "Move to Trash",
//         cancelText: "Cancel",
//         variant: "danger",
//         onConfirm: () => handleMoveToTrash(automationId),
//       })
//     },
//     [confirm, handleMoveToTrash],
//   )

//   const handlePermanentlyDeleteWithConfirm = useCallback(
//     (automationId: string, automationName: string) => {
//       confirm({
//         title: "Permanently Delete?",
//         description: `"${automationName}" will be permanently deleted. This action cannot be undone.`,
//         confirmText: "Delete Forever",
//         cancelText: "Cancel",
//         variant: "danger",
//         onConfirm: () => handlePermanentlyDelete(automationId),
//       })
//     },
//     [confirm, handlePermanentlyDelete],
//   )

//   const handleEmptyTrashWithConfirm = useCallback(() => {
//     confirm({
//       title: "Empty Trash?",
//       description: `All ${trashedAutomations.length} automation(s) in trash will be permanently deleted. This action cannot be undone.`,
//       confirmText: "Empty Trash",
//       cancelText: "Cancel",
//       variant: "danger",
//       onConfirm: () => {
//         handleEmptyTrash()
//         setShowEmptyTrashDialog(false)
//       },
//     })
//   }, [confirm, trashedAutomations.length, handleEmptyTrash])

//   // Empty state
//   if (filteredAutomations.length === 0 && !showTrash && !searchQuery && activeFilter === "all") {
//     return (
//       <>
//         {dialog}
//         <Card className="group relative overflow-hidden border-dashed border-2 border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/50">
//           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
//           <CardContent className="relative flex min-h-[500px] flex-col items-center justify-center gap-6 py-16">
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.5, ease: "easeOut" }}
//               className="relative"
//             >
//               <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-2xl" />
//               <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg ring-1 ring-primary/10">
//                 <Zap className="h-12 w-12 text-primary" />
//               </div>
//             </motion.div>

//             <div className="text-center space-y-3 max-w-md">
//               <h3 className="text-2xl font-semibold tracking-tight">No automations yet</h3>
//               <p className="text-base text-muted-foreground leading-relaxed">
//                 Create your first automation to start automating Instagram interactions
//               </p>
//             </div>

//             <Link href="/automations/new">
//               <Button
//                 size="lg"
//                 className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
//               >
//                 <span className="relative z-10 flex items-center gap-2">
//                   <Play className="h-4 w-4" />
//                   Create Your First Automation
//                 </span>
//                 <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
//               </Button>
//             </Link>
//           </CardContent>
//         </Card>
//       </>
//     )
//   }

//   return (
//     <>
//       {dialog}

//       {/* Trash Modal */}
//       <Dialog open={showTrash} onOpenChange={setShowTrash}>
//         <DialogContent className="max-w-4xl">
//           <DialogHeader>
//             <DialogTitle>Trash</DialogTitle>
//             <DialogDescription>Recover or permanently delete automations</DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4">
//             {trashedAutomations.length > 0 && (
//               <div className="flex justify-end">
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   onClick={() => setShowEmptyTrashDialog(true)}
//                   disabled={isPending}
//                 >
//                   <Trash2 className="mr-2 h-4 w-4" />
//                   Empty Trash
//                 </Button>
//               </div>
//             )}

//             {trashedAutomations.length === 0 ? (
//               <Card>
//                 <CardContent className="flex items-center justify-center py-12">
//                   <p className="text-muted-foreground">Trash is empty</p>
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
//                 {trashedAutomations.map((automation) => (
//                   <motion.div
//                     key={automation.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                   >
//                     <Card className="relative overflow-hidden border-border/50 bg-card/50">
//                       <CardContent className="p-6 space-y-4">
//                         <div>
//                           <h4 className="font-semibold">{automation.name}</h4>
//                           {automation.instagramAccount && (
//                             <p className="text-sm text-muted-foreground mt-1">
//                               @{automation.instagramAccount.username}
//                             </p>
//                           )}
//                         </div>

//                         <div className="flex gap-2 pt-2 border-t border-border/50">
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => handleRestore(automation.id)}
//                             disabled={isPending}
//                             className="flex-1"
//                           >
//                             Restore
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="destructive"
//                             onClick={() => handlePermanentlyDeleteWithConfirm(automation.id, automation.name)}
//                             disabled={isPending}
//                             className="flex-1"
//                           >
//                             Delete
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Empty Trash Confirmation */}
//       <Dialog open={showEmptyTrashDialog} onOpenChange={setShowEmptyTrashDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Empty Trash?</DialogTitle>
//             <DialogDescription>
//               This will permanently delete {trashedAutomations.length} automation(s). This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="flex gap-3 justify-end pt-4">
//             <Button variant="outline" onClick={() => setShowEmptyTrashDialog(false)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={handleEmptyTrashWithConfirm} disabled={isPending}>
//               Empty Trash
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Stats Cards */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
//         {STATS_CARDS.map((card, idx) => {
//           const Icon = card.icon
//           const value = stats[card.key as keyof typeof stats]

//           return (
//             <motion.div
//               key={card.label}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: idx * 0.1 }}
//             >
//               <Card className={cn("bg-gradient-to-br border-border/50", card.color)}>
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
//                       <p className="text-3xl font-bold mt-2">{value}</p>
//                     </div>
//                     <div className={cn("p-3 rounded-lg bg-card/50 border border-border/50", card.iconColor)}>
//                       <Icon className="h-6 w-6" />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )
//         })}
//       </div>

//       {/* Search and Filters */}
//       <div className="space-y-4 mb-8">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//           <Input
//             placeholder="Search automations by name, description, or Instagram account..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 bg-card border-border/50 h-11"
//           />
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
//           <div className="flex gap-2">
//             <Badge
//               variant={activeFilter === "all" ? "default" : "secondary"}
//               className="cursor-pointer"
//               onClick={() => setActiveFilter("all")}
//             >
//               <Filter className="mr-1 h-3 w-3" />
//               All
//             </Badge>
//             <Badge
//               variant={activeFilter === "active" ? "default" : "secondary"}
//               className="cursor-pointer"
//               onClick={() => setActiveFilter("active")}
//             >
//               Active
//             </Badge>
//             <Badge
//               variant={activeFilter === "inactive" ? "default" : "secondary"}
//               className="cursor-pointer"
//               onClick={() => setActiveFilter("inactive")}
//             >
//               Inactive
//             </Badge>
//           </div>

//           <div className="flex gap-2 sm:ml-auto">
//             <Button
//               size="icon"
//               variant={viewMode === "grid" ? "default" : "outline"}
//               onClick={() => setViewMode("grid")}
//             >
//               <Grid3x3 className="h-4 w-4" />
//             </Button>
//             <Button
//               size="icon"
//               variant={viewMode === "list" ? "default" : "outline"}
//               onClick={() => setViewMode("list")}
//             >
//               <List className="h-4 w-4" />
//             </Button>
//             <Button size="sm" variant="outline" onClick={() => setShowTrash(true)} className="ml-auto sm:ml-2">
//               <Trash2 className="mr-2 h-4 w-4" />
//               Trash {trashedAutomations.length > 0 && `(${trashedAutomations.length})`}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* No Results State */}
//       {filteredAutomations.length === 0 ? (
//         <Card className="border-dashed border-2">
//           <CardContent className="flex items-center justify-center py-12">
//             <div className="text-center">
//               <p className="text-muted-foreground mb-2">No automations found</p>
//               <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <AnimatePresence>
//           <motion.div
//             className={cn("gap-5", viewMode === "grid" ? "grid sm:grid-cols-1 lg:grid-cols-2" : "flex flex-col")}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             {filteredAutomations.map((automation, index) => (
//               <FancyAutomationCard
//                 key={automation.id}
//                 automation={automation}
//                 index={index}
//                 onDelete={() => handleDeleteWithConfirm(automation.id, automation.name)}
//                 onToggle={(isActive) => handleToggleStatus(automation.id, isActive)}
//               />
//             ))}
//           </motion.div>
//         </AnimatePresence>
//       )}
//     </>
//   )
// }

"use client"

import { useState, useCallback, useMemo, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FancyAutomationCard } from "./fancy-automation-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Zap, Play, Search, Grid3x3, List, Trash2, Filter, AlertTriangle, Flame } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useAutomations } from "@/hooks/use-automations"
import { useConfirm } from "./confirm-dialog"

interface AutomationsListProps {
  initialAutomations: any[]
  userId: string
}

const STATS_CARDS = [
  {
    label: "Total Automations",
    icon: Zap,
    color: "from-muted/40 to-muted/20",
    iconColor: "text-muted-foreground",
    key: "total",
  },
  {
    label: "Active",
    icon: Play,
    color: "from-muted/40 to-muted/20",
    iconColor: "text-muted-foreground",
    key: "active",
  },
  {
    label: "Paused",
    icon: AlertTriangle,
    color: "from-muted/40 to-muted/20",
    iconColor: "text-muted-foreground",
    key: "paused",
  },
  {
    label: "Total Executions",
    icon: Flame,
    color: "from-muted/40 to-muted/20",
    iconColor: "text-muted-foreground",
    key: "executions",
  },
]

export function AutomationsList({ initialAutomations, userId }: AutomationsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all")
  const [showTrash, setShowTrash] = useState(false)
  const [showEmptyTrashDialog, setShowEmptyTrashDialog] = useState(false)
  const [isPending, startTransition] = useTransition()

  const {
    trashedAutomations,
    handleMoveToTrash,
    handleRestore,
    handlePermanentlyDelete,
    handleEmptyTrash,
    handleToggleStatus,
  } = useAutomations()

  const { confirm, dialog } = useConfirm()

  // Just use the initialAutomations prop directly

  // Calculate stats from initialAutomations
  const stats = useMemo(() => {
    return {
      total: initialAutomations.length,
      active: initialAutomations.filter((a) => a.isActive).length,
      paused: initialAutomations.filter((a) => !a.isActive).length,
      executions: initialAutomations.reduce((sum, a) => sum + (a.executions?.length || 0), 0),
    }
  }, [initialAutomations])

  // Filter and search automations
  const filteredAutomations = useMemo(() => {
    return initialAutomations
      .filter((automation) => {
        if (activeFilter === "active") return automation.isActive
        if (activeFilter === "inactive") return !automation.isActive
        return true
      })
      .filter((automation) => {
        const searchLower = searchQuery.toLowerCase()
        return (
          automation.name.toLowerCase().includes(searchLower) ||
          automation.description?.toLowerCase().includes(searchLower) ||
          automation.instagramAccount?.username.toLowerCase().includes(searchLower)
        )
      })
  }, [initialAutomations, searchQuery, activeFilter])

  const handleDeleteWithConfirm = useCallback(
    (automationId: string, automationName: string) => {
      confirm({
        title: "Move to Trash?",
        description: `"${automationName}" will be moved to trash. You can restore it later.`,
        confirmText: "Move to Trash",
        cancelText: "Cancel",
        variant: "danger",
        onConfirm: () => handleMoveToTrash(automationId),
      })
    },
    [confirm, handleMoveToTrash],
  )

  const handlePermanentlyDeleteWithConfirm = useCallback(
    (automationId: string, automationName: string) => {
      confirm({
        title: "Permanently Delete?",
        description: `"${automationName}" will be permanently deleted. This action cannot be undone.`,
        confirmText: "Delete Forever",
        cancelText: "Cancel",
        variant: "danger",
        onConfirm: () => handlePermanentlyDelete(automationId),
      })
    },
    [confirm, handlePermanentlyDelete],
  )

  const handleEmptyTrashWithConfirm = useCallback(() => {
    confirm({
      title: "Empty Trash?",
      description: `All ${trashedAutomations.length} automation(s) in trash will be permanently deleted. This action cannot be undone.`,
      confirmText: "Empty Trash",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: () => {
        handleEmptyTrash()
        setShowEmptyTrashDialog(false)
      },
    })
  }, [confirm, trashedAutomations.length, handleEmptyTrash])

  // Empty state
  if (filteredAutomations.length === 0 && !showTrash && !searchQuery && activeFilter === "all") {
    return (
      <>
        {dialog}
        <Card className="group relative overflow-hidden border-dashed border-2 border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <CardContent className="relative flex min-h-[500px] flex-col items-center justify-center gap-6 py-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-2xl" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg ring-1 ring-primary/10">
                <Zap className="h-12 w-12 text-primary" />
              </div>
            </motion.div>

            <div className="text-center space-y-3 max-w-md">
              <h3 className="text-2xl font-semibold tracking-tight">No automations yet</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Create your first automation to start automating Instagram interactions
              </p>
            </div>

            <Link href="/automations/new">
              <Button
                size="lg"
                className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Create Your First Automation
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      {dialog}

      {/* Header with Create Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Automations</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor your automated workflows</p>
        </div>
        <Link href="/automations/new">
          <Button size="lg" className="gap-2">
            <Zap className="h-4 w-4" />
            Create Automation
          </Button>
        </Link>
      </div>

      {/* Trash Modal */}
      <Dialog open={showTrash} onOpenChange={setShowTrash}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Trash</DialogTitle>
            <DialogDescription>Recover or permanently delete automations</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {trashedAutomations.length > 0 && (
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowEmptyTrashDialog(true)}
                  disabled={isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Empty Trash
                </Button>
              </div>
            )}

            {trashedAutomations.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Trash is empty</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                {trashedAutomations.map((automation) => (
                  <motion.div
                    key={automation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card className="relative overflow-hidden border-border/50 bg-card/50">
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <h4 className="font-semibold">{automation.name}</h4>
                          {automation.instagramAccount && (
                            <p className="text-sm text-muted-foreground mt-1">
                              @{automation.instagramAccount.username}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-border/50">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestore(automation.id)}
                            disabled={isPending}
                            className="flex-1"
                          >
                            Restore
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handlePermanentlyDeleteWithConfirm(automation.id, automation.name)}
                            disabled={isPending}
                            className="flex-1"
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Empty Trash Confirmation */}
      <Dialog open={showEmptyTrashDialog} onOpenChange={setShowEmptyTrashDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Empty Trash?</DialogTitle>
            <DialogDescription>
              This will permanently delete {trashedAutomations.length} automation(s). This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => setShowEmptyTrashDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleEmptyTrashWithConfirm} disabled={isPending}>
              Empty Trash
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {STATS_CARDS.map((card, idx) => {
          const Icon = card.icon
          const value = stats[card.key as keyof typeof stats]

          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={cn("bg-gradient-to-br border-border/50", card.color)}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
                      <p className="text-3xl font-bold mt-2">{value}</p>
                    </div>
                    <div className={cn("p-3 rounded-lg bg-card/50 border border-border/50", card.iconColor)}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search automations by name, description, or Instagram account..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border/50 h-11"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <Badge
              variant={activeFilter === "all" ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setActiveFilter("all")}
            >
              <Filter className="mr-1 h-3 w-3" />
              All
            </Badge>
            <Badge
              variant={activeFilter === "active" ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setActiveFilter("active")}
            >
              Active
            </Badge>
            <Badge
              variant={activeFilter === "inactive" ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setActiveFilter("inactive")}
            >
              Inactive
            </Badge>
          </div>

          <div className="flex gap-2 sm:ml-auto">
            <Button
              size="icon"
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowTrash(true)} className="ml-auto sm:ml-2">
              <Trash2 className="mr-2 h-4 w-4" />
              Trash {trashedAutomations.length > 0 && `(${trashedAutomations.length})`}
            </Button>
          </div>
        </div>
      </div>

      {/* No Results State */}
      {filteredAutomations.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No automations found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence>
          <motion.div
            className={cn("gap-5", viewMode === "grid" ? "grid sm:grid-cols-1 lg:grid-cols-2" : "flex flex-col")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredAutomations.map((automation, index) => (
              <FancyAutomationCard
                key={automation.id}
                automation={automation}
                index={index}
                onDelete={() => handleDeleteWithConfirm(automation.id, automation.name)}
                onToggle={(isActive) => handleToggleStatus(automation.id, isActive)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  )
}
