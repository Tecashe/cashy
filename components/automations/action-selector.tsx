// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { ACTION_TYPES, ACTION_CATEGORIES } from "@/lib/constants/utomation-constants"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import type { ActionType } from "@/lib/types/automation"
// import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription } from "@/components/ui/item"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { motion, AnimatePresence } from "framer-motion"
// import { Zap } from "lucide-react"

// interface ActionSelectorProps {
//   open: boolean
//   onClose: () => void
//   onSelect: (type: ActionType) => void
// }

// export function ActionSelector({ open, onClose, onSelect }: ActionSelectorProps) {
//   const [activeCategory, setActiveCategory] = useState("all")

//   const filteredActions = Object.values(ACTION_TYPES).filter(
//     (action) => activeCategory === "all" || action.category === activeCategory,
//   )

//   const handleSelect = (type: ActionType) => {
//     onSelect(type)
//     onClose()
//   }

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
//         <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
//           <div className="flex items-start gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
//               <Zap className="h-5 w-5 text-primary" />
//             </div>
//             <div className="flex-1">
//               <DialogTitle className="text-xl font-semibold">Add Action</DialogTitle>
//               <DialogDescription className="mt-1">
//                 Choose what action to perform when the trigger activates
//               </DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>

//         <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex flex-col h-full">
//           <div className="px-6 pt-4">
//             <TabsList className="w-full justify-start overflow-x-auto rounded-lg border border-border/50 bg-muted/30 p-1">
//               {ACTION_CATEGORIES.map((category) => (
//                 <TabsTrigger
//                   key={category.id}
//                   value={category.id}
//                   className="flex-shrink-0 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
//                 >
//                   {category.label}
//                 </TabsTrigger>
//               ))}
//             </TabsList>
//           </div>

//           <ScrollArea className="flex-1 px-6 py-4 max-h-[calc(90vh-220px)]">
//             <motion.div className="grid gap-3 sm:grid-cols-2" layout>
//               <AnimatePresence mode="popLayout">
//                 {filteredActions.map((action, index) => {
//                   const Icon = action.icon
//                   return (
//                     <motion.div
//                       key={action.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, scale: 0.9 }}
//                       transition={{
//                         duration: 0.3,
//                         delay: index * 0.03,
//                         ease: [0.4, 0, 0.2, 1],
//                       }}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                     >
//                       <Item
//                         variant="outline"
//                         className="cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/80 hover:shadow-md"
//                         onClick={() => handleSelect(action.id as ActionType)}
//                         asChild
//                       >
//                         <button type="button">
//                           <ItemMedia variant="icon">
//                             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
//                               <Icon className="h-5 w-5 text-primary" />
//                             </div>
//                           </ItemMedia>
//                           <ItemContent>
//                             <ItemTitle>{action.label}</ItemTitle>
//                             <ItemDescription>{action.description}</ItemDescription>
//                           </ItemContent>
//                         </button>
//                       </Item>
//                     </motion.div>
//                   )
//                 })}
//               </AnimatePresence>
//             </motion.div>
//           </ScrollArea>
//         </Tabs>
//       </DialogContent>
//     </Dialog>
//   )
// }

// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { ACTION_TYPES, ACTION_CATEGORIES } from "@/lib/constants/automations"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import type { ActionType } from "@/lib/types/automation"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { motion, AnimatePresence } from "framer-motion"
// import { Zap, ArrowRight } from "lucide-react"
// import { cn } from "@/lib/utils"

// interface ActionSelectorProps {
//   open: boolean
//   onClose: () => void
//   onSelect: (type: ActionType) => void
// }

// const FALLBACK_CATEGORIES = [
//   { id: "all", label: "All Actions" },
//   { id: "messaging", label: "Messaging" },
//   { id: "ai", label: "AI Powered" },
//   { id: "organization", label: "Organization" },
//   { id: "moderation", label: "Moderation" },
//   { id: "flow", label: "Flow Control" },
//   { id: "handoff", label: "Handoff" },
//   { id: "integration", label: "Integration" },
// ] as const

// export function ActionSelector({ open, onClose, onSelect }: ActionSelectorProps) {
//   const [activeCategory, setActiveCategory] = useState("all")
//   const [hoveredAction, setHoveredAction] = useState<string | null>(null)

//   const categories = ACTION_CATEGORIES || FALLBACK_CATEGORIES

//   const filteredActions = Object.values(ACTION_TYPES).filter(
//     (action) => activeCategory === "all" || action.category === activeCategory,
//   )

//   const handleSelect = (type: ActionType) => {
//     onSelect(type)
//     onClose()
//   }

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-6xl max-h-[85vh] p-0 gap-0 overflow-hidden">
//         <DialogHeader className="px-8 pt-7 pb-6 border-b border-border/50 bg-gradient-to-b from-muted/30 to-background">
//           <div className="flex items-start gap-4">
//             <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg ring-1 ring-primary/20">
//               <Zap className="h-6 w-6 text-primary" />
//             </div>
//             <div className="flex-1">
//               <DialogTitle className="text-2xl font-bold tracking-tight">Add Action</DialogTitle>
//               <DialogDescription className="mt-2 text-base">
//                 Choose what action to perform when the trigger activates
//               </DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>

//         <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex flex-col h-full">
//           <div className="px-8 pt-6 pb-4 bg-muted/10 border-b border-border/30">
//             <ScrollArea className="w-full">
//               <TabsList className="inline-flex w-auto justify-start gap-2 rounded-xl border border-border/50 bg-muted/50 p-1.5 shadow-sm">
//                 {categories.map((category) => (
//                   <TabsTrigger
//                     key={category.id}
//                     value={category.id}
//                     className="flex-shrink-0 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md hover:bg-muted/70"
//                   >
//                     {category.label}
//                   </TabsTrigger>
//                 ))}
//               </TabsList>
//             </ScrollArea>
//           </div>

//           <ScrollArea className="flex-1 px-8 py-6">
//             <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2" layout>
//               <AnimatePresence mode="popLayout">
//                 {filteredActions.map((action, index) => {
//                   const Icon = action.icon
//                   const isHovered = hoveredAction === action.id

//                   return (
//                     <motion.button
//                       key={action.id}
//                       type="button"
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, scale: 0.9 }}
//                       transition={{
//                         duration: 0.2,
//                         delay: index * 0.02,
//                         ease: [0.4, 0, 0.2, 1],
//                       }}
//                       whileHover={{ y: -2 }}
//                       whileTap={{ scale: 0.98 }}
//                       onMouseEnter={() => setHoveredAction(action.id)}
//                       onMouseLeave={() => setHoveredAction(null)}
//                       onClick={() => handleSelect(action.id as ActionType)}
//                       className={cn(
//                         "group relative flex items-start gap-4 rounded-xl border p-5 text-left transition-all duration-300",
//                         "bg-card/50 backdrop-blur-sm",
//                         "hover:bg-card hover:shadow-xl hover:shadow-primary/10",
//                         isHovered ? "border-primary/50" : "border-border/50",
//                       )}
//                     >
//                       <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

//                       <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow-md ring-1 ring-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
//                         <Icon className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
//                       </div>

//                       <div className="relative flex-1 min-w-0 pt-0.5">
//                         <div className="flex items-start justify-between gap-2 mb-2">
//                           <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
//                             {action.label}
//                           </h3>
//                           <ArrowRight
//                             className={cn(
//                               "h-5 w-5 flex-shrink-0 text-muted-foreground transition-all duration-300",
//                               isHovered && "translate-x-1 text-primary",
//                             )}
//                           />
//                         </div>
//                         <p className="text-sm leading-relaxed text-muted-foreground">{action.description}</p>
//                       </div>
//                     </motion.button>
//                   )
//                 })}
//               </AnimatePresence>
//             </motion.div>

//             {filteredActions.length === 0 && (
//               <div className="flex flex-col items-center justify-center py-16 text-center">
//                 <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-4">
//                   <Zap className="h-10 w-10 text-muted-foreground/50" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-foreground mb-2">No actions found</h3>
//                 <p className="text-sm text-muted-foreground max-w-sm">
//                   No actions match the selected category. Try selecting a different category.
//                 </p>
//               </div>
//             )}
//           </ScrollArea>
//         </Tabs>
//       </DialogContent>
//     </Dialog>
//   )
// }


"use client"

import { useState } from "react"
import { ACTION_TYPES, ACTION_CATEGORIES } from "@/lib/constants/automations"
import type { ActionType } from "@/lib/types/automation"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import * as DialogPrimitive from "@radix-ui/react-dialog"

interface ActionSelectorProps {
  open: boolean
  onClose: () => void
  onSelect: (type: ActionType) => void
}

const FALLBACK_CATEGORIES = [
  { id: "all", label: "All Actions" },
  { id: "messaging", label: "Messaging" },
  { id: "ai", label: "AI Powered" },
  { id: "organization", label: "Organization" },
  { id: "moderation", label: "Moderation" },
  { id: "flow", label: "Flow Control" },
  { id: "handoff", label: "Handoff" },
  { id: "integration", label: "Integration" },
] as const

export function ActionSelector({ open, onClose, onSelect }: ActionSelectorProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [hoveredAction, setHoveredAction] = useState<string | null>(null)

  const categories = ACTION_CATEGORIES || FALLBACK_CATEGORIES

  const filteredActions = Object.values(ACTION_TYPES).filter(
    (action) => activeCategory === "all" || action.category === activeCategory,
  )

  const handleSelect = (type: ActionType) => {
    onSelect(type)
    onClose()
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />
        </DialogPrimitive.Overlay>
        <DialogPrimitive.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-[50%] top-[50%] z-50 w-[95vw] max-w-5xl translate-x-[-50%] translate-y-[-50%] rounded-2xl border border-border/50 bg-background shadow-2xl"
          >
            <div className="flex h-[85vh] flex-col overflow-hidden">
              {/* Header */}
              <div className="relative border-b border-border/50 bg-gradient-to-b from-muted/30 to-background px-8 pb-6 pt-7">
                <DialogPrimitive.Close className="absolute right-6 top-6 rounded-lg p-2 opacity-70 ring-offset-background transition-all hover:bg-accent hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>

                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg ring-1 ring-primary/20">
                    <Zap className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <DialogPrimitive.Title className="text-2xl font-bold tracking-tight">
                      Add Action
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="mt-2 text-base text-muted-foreground">
                      Choose what action to perform when the trigger activates
                    </DialogPrimitive.Description>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="mt-6 -mb-2 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={cn(
                        "flex-shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all",
                        activeCategory === category.id
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions Grid - Custom Scrollable */}
              <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-hide">
                <motion.div className="grid gap-4 pb-4 sm:grid-cols-2" layout>
                  <AnimatePresence mode="popLayout">
                    {filteredActions.map((action, index) => {
                      const Icon = action.icon
                      const isHovered = hoveredAction === action.id

                      return (
                        <motion.button
                          key={action.id}
                          type="button"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{
                            duration: 0.2,
                            delay: index * 0.03,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          whileHover={{ y: -4, transition: { duration: 0.2 } }}
                          whileTap={{ scale: 0.97 }}
                          onMouseEnter={() => setHoveredAction(action.id)}
                          onMouseLeave={() => setHoveredAction(null)}
                          onClick={() => handleSelect(action.id as ActionType)}
                          className={cn(
                            "group relative flex items-start gap-4 rounded-2xl border p-6 text-left transition-all duration-300",
                            "bg-card/50 backdrop-blur-sm",
                            "hover:bg-card hover:shadow-xl hover:shadow-primary/5",
                            isHovered ? "border-primary/40 scale-[1.02]" : "border-border/50",
                          )}
                        >
                          {/* Gradient Overlay on Hover */}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                          {/* Icon Container */}
                          <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow-md ring-1 ring-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
                            <Icon className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />

                            {/* Sparkle effect on hover */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                              className="absolute -right-1 -top-1"
                            >
                              <Sparkles className="h-4 w-4 text-primary" />
                            </motion.div>
                          </div>

                          {/* Content */}
                          <div className="relative flex-1 min-w-0 pt-1">
                            <h3 className="mb-2 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                              {action.label}
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">{action.description}</p>
                          </div>

                          {/* Arrow indicator */}
                          <div className="relative flex-shrink-0 pt-1">
                            <motion.div
                              animate={isHovered ? { x: 4 } : { x: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20"
                            >
                              <svg
                                className="h-4 w-4 text-primary"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </motion.div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredActions.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted/50 mb-6">
                      <Zap className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No actions found</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      No actions match the selected category. Try selecting a different category.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
