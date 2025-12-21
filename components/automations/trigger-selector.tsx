"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { TRIGGER_TYPES } from "@/lib/constants/utomation-constants"
import type { TriggerType } from "@/lib/types/automation"
import { motion } from "framer-motion"

interface TriggerSelectorProps {
  open: boolean
  onClose: () => void
  onSelect: (type: TriggerType) => void
}

export function TriggerSelector({ open, onClose, onSelect }: TriggerSelectorProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[85vh] border-t border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80"
      >
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-semibold tracking-tight">Select a Trigger</SheetTitle>
          <SheetDescription className="text-base text-muted-foreground">
            Choose what event should activate this automation
          </SheetDescription>
        </SheetHeader>

        <motion.div
          className="grid gap-3 sm:grid-cols-2 automation-scroll max-h-[calc(85vh-180px)] overflow-y-auto pr-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {Object.values(TRIGGER_TYPES).map((trigger, index) => {
            const Icon = trigger.icon
            return (
              <motion.div
                key={trigger.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: [0.4, 0, 0.2, 1],
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="group relative h-auto w-full justify-start gap-4 overflow-hidden border border-border/50 bg-card/50 p-4 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:shadow-md"
                  onClick={() => onSelect(trigger.id as TriggerType)}
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
                  </div>

                  <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-inner ring-1 ring-border/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:ring-primary/20">
                    <Icon className="h-6 w-6 text-primary transition-colors duration-300 group-hover:text-primary" />
                  </div>

                  <div className="relative flex-1 space-y-1.5">
                    <p className="font-semibold leading-none tracking-tight">{trigger.label}</p>
                    <p className="text-sm leading-snug text-muted-foreground line-clamp-2">{trigger.description}</p>
                  </div>
                </Button>
              </motion.div>
            )
          })}
        </motion.div>
      </SheetContent>
    </Sheet>
  )
}
