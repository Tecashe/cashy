"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ACTION_TYPES, ACTION_CATEGORIES } from "@/lib/constants/utomation-constants"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ActionType } from "@/lib/types/automation"
import { motion, AnimatePresence } from "framer-motion"

interface ActionSelectorProps {
  open: boolean
  onClose: () => void
  onSelect: (type: ActionType) => void
}

export function ActionSelector({ open, onClose, onSelect }: ActionSelectorProps) {
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredActions = Object.values(ACTION_TYPES).filter(
    (action) => activeCategory === "all" || action.category === activeCategory,
  )

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[85vh] border-t border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80"
      >
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-semibold tracking-tight">Add Action</SheetTitle>
          <SheetDescription className="text-base text-muted-foreground">
            Choose what action to perform when the trigger activates
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="mb-6 h-11 w-full justify-start overflow-x-auto rounded-lg border border-border/50 bg-muted/30 p-1 backdrop-blur-sm">
            {ACTION_CATEGORIES.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex-shrink-0 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <motion.div
            className="grid gap-3 sm:grid-cols-2 automation-scroll max-h-[calc(85vh-220px)] overflow-y-auto pr-2"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.03,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="group relative h-auto w-full justify-start gap-4 overflow-hidden border border-border/50 bg-card/50 p-4 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:shadow-md"
                      onClick={() => onSelect(action.id as ActionType)}
                    >
                      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
                      </div>

                      <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-inner ring-1 ring-border/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:ring-primary/20">
                        <Icon className="h-6 w-6 text-primary transition-colors duration-300 group-hover:text-primary" />
                      </div>

                      <div className="relative flex-1 space-y-1.5">
                        <p className="font-semibold leading-none tracking-tight">{action.label}</p>
                        <p className="text-sm leading-snug text-muted-foreground line-clamp-2">{action.description}</p>
                      </div>
                    </Button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
