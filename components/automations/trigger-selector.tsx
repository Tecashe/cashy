// "use client"

// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { TRIGGER_TYPES } from "@/lib/constants/utomation-constants"
// import type { TriggerType } from "@/lib/types/automation"
// import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription } from "@/components/ui/item"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { motion, AnimatePresence } from "framer-motion"
// import { Sparkles } from "lucide-react"

// interface TriggerSelectorProps {
//   open: boolean
//   onClose: () => void
//   onSelect: (type: TriggerType) => void
// }

// export function TriggerSelector({ open, onClose, onSelect }: TriggerSelectorProps) {
//   const handleSelect = (type: TriggerType) => {
//     onSelect(type)
//     onClose()
//   }

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0">
//         <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
//           <div className="flex items-start gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
//               <Sparkles className="h-5 w-5 text-primary" />
//             </div>
//             <div className="flex-1">
//               <DialogTitle className="text-xl font-semibold">Select a Trigger</DialogTitle>
//               <DialogDescription className="mt-1">Choose what event should activate this automation</DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>

//         <ScrollArea className="px-6 py-6 max-h-[calc(85vh-140px)]">
//           <div className="grid gap-3 sm:grid-cols-2">
//             <AnimatePresence>
//               {Object.values(TRIGGER_TYPES).map((trigger, index) => {
//                 const Icon = trigger.icon
//                 return (
//                   <motion.div
//                     key={trigger.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.9 }}
//                     transition={{
//                       duration: 0.3,
//                       delay: index * 0.05,
//                       ease: [0.4, 0, 0.2, 1],
//                     }}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <Item
//                       variant="outline"
//                       className="cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/80 hover:shadow-md"
//                       onClick={() => handleSelect(trigger.id as TriggerType)}
//                       asChild
//                     >
//                       <button type="button">
//                         <ItemMedia variant="icon">
//                           <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
//                             <Icon className="h-5 w-5 text-primary" />
//                           </div>
//                         </ItemMedia>
//                         <ItemContent>
//                           <ItemTitle>{trigger.label}</ItemTitle>
//                           <ItemDescription>{trigger.description}</ItemDescription>
//                         </ItemContent>
//                       </button>
//                     </Item>
//                   </motion.div>
//                 )
//               })}
//             </AnimatePresence>
//           </div>
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   )
// }



// "use client"

// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { TRIGGER_TYPES } from "@/lib/constants/utomation-constants"
// import type { TriggerType } from "@/lib/types/automation"
// import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription } from "@/components/ui/item"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { motion, AnimatePresence } from "framer-motion"
// import { Sparkles } from "lucide-react"
// import { Badge } from "@/components/ui/badge" // Import Badge component

// interface TriggerSelectorProps {
//   open: boolean
//   onClose: () => void
//   onSelect: (type: TriggerType) => void
//   existingTriggers?: TriggerType[]
//   userTier: "pro" | "enterprise" | "free"
//   canAddTrigger: (type: TriggerType) => boolean
// }

// export function TriggerSelector({ open, onClose, userTier, onSelect, existingTriggers = [] }: TriggerSelectorProps) {
//   const handleSelect = (type: TriggerType) => {
//     onSelect(type)
//     onClose()
//   }

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0">
//         <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
//           <div className="flex items-start gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
//               <Sparkles className="h-5 w-5 text-primary" />
//             </div>
//             <div className="flex-1">
//               <DialogTitle className="text-xl font-semibold">Select a Trigger</DialogTitle>
//               <DialogDescription className="mt-1">Choose what event should activate this automation</DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>

//         <ScrollArea className="px-6 py-6 max-h-[calc(85vh-140px)]">
//           <div className="grid gap-3 sm:grid-cols-2">
//             <AnimatePresence>
//               {Object.values(TRIGGER_TYPES).map((trigger, index) => {
//                 const Icon = trigger.icon
//                 const isAdded = existingTriggers.includes(trigger.id as TriggerType)
//                 const canAddMultiple = trigger.requiresConfig // Only configurable triggers can have duplicates

//                 return (
//                   <motion.div
//                     key={trigger.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.9 }}
//                     transition={{
//                       duration: 0.3,
//                       delay: index * 0.05,
//                       ease: [0.4, 0, 0.2, 1],
//                     }}
//                     whileHover={{ scale: isAdded && !canAddMultiple ? 1 : 1.02 }}
//                     whileTap={{ scale: isAdded && !canAddMultiple ? 1 : 0.98 }}
//                   >
//                     <Item
//                       variant="outline"
//                       className={`cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all ${
//                         isAdded && !canAddMultiple
//                           ? "opacity-50 cursor-not-allowed"
//                           : "hover:border-primary/30 hover:bg-card/80 hover:shadow-md"
//                       }`}
//                       onClick={() => {
//                         if (!isAdded || canAddMultiple) {
//                           handleSelect(trigger.id as TriggerType)
//                         }
//                       }}
//                       asChild
//                     >
//                       <button type="button" disabled={isAdded && !canAddMultiple}>
//                         <ItemMedia variant="icon">
//                           <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
//                             <Icon className="h-5 w-5 text-primary" />
//                           </div>
//                         </ItemMedia>
//                         <ItemContent>
//                           <ItemTitle className="flex items-center gap-2">
//                             {trigger.label}
//                             {isAdded && !canAddMultiple && (
//                               <Badge variant="secondary" className="text-xs">
//                                 Added
//                               </Badge>
//                             )}
//                           </ItemTitle>
//                           <ItemDescription>{trigger.description}</ItemDescription>
//                         </ItemContent>
//                       </button>
//                     </Item>
//                   </motion.div>
//                 )
//               })}
//             </AnimatePresence>
//           </div>
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   )
// }


"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TRIGGER_TYPES } from "@/lib/constants/utomation-constants"
import type { TriggerType } from "@/lib/types/automation"
import type { SubscriptionTier } from "@/lib/tier-config"
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription } from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TriggerSelectorProps {
  open: boolean
  onClose: () => void
  onSelect: (type: TriggerType) => void
  existingTriggers?: TriggerType[]
  userTier: SubscriptionTier
  canAddTrigger: (type: TriggerType) => boolean
}

export function TriggerSelector({ 
  open, 
  onClose, 
  userTier, 
  onSelect, 
  existingTriggers = [],
  canAddTrigger 
}: TriggerSelectorProps) {
  const handleSelect = (type: TriggerType) => {
    onSelect(type)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">Select a Trigger</DialogTitle>
              <DialogDescription className="mt-1">Choose what event should activate this automation</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="px-6 py-6 max-h-[calc(85vh-140px)]">
          <div className="grid gap-3 sm:grid-cols-2">
            <AnimatePresence>
              {Object.values(TRIGGER_TYPES).map((trigger, index) => {
                const Icon = trigger.icon
                const isAdded = existingTriggers.includes(trigger.id as TriggerType)
                const canAddMultiple = trigger.requiresConfig
                const canAdd = canAddTrigger(trigger.id as TriggerType)
                const isDisabled = (isAdded && !canAddMultiple) || !canAdd

                return (
                  <motion.div
                    key={trigger.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                    whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                  >
                    <Item
                      variant="outline"
                      className={`cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all ${
                        isDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:border-primary/30 hover:bg-card/80 hover:shadow-md"
                      }`}
                      onClick={() => {
                        if (!isDisabled) {
                          handleSelect(trigger.id as TriggerType)
                        }
                      }}
                      asChild
                    >
                      <button type="button" disabled={isDisabled}>
                        <ItemMedia variant="icon">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle className="flex items-center gap-2">
                            {trigger.label}
                            {isAdded && !canAddMultiple && (
                              <Badge variant="secondary" className="text-xs">
                                Added
                              </Badge>
                            )}
                            {!canAdd && (
                              <Badge variant="secondary" className="text-xs">
                                Upgrade
                              </Badge>
                            )}
                          </ItemTitle>
                          <ItemDescription>{trigger.description}</ItemDescription>
                        </ItemContent>
                      </button>
                    </Item>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}