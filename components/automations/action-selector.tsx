"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ACTION_TYPES, ACTION_CATEGORIES } from "@/lib/constants/utomation-constants"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ActionType } from "@/lib/types/automation"
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription } from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { Zap } from "lucide-react"

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

  const handleSelect = (type: ActionType) => {
    onSelect(type)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">Add Action</DialogTitle>
              <DialogDescription className="mt-1">
                Choose what action to perform when the trigger activates
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex flex-col h-full">
          <div className="px-6 pt-4">
            <TabsList className="w-full justify-start rounded-lg border border-border/50 bg-muted/30 p-1">
              {ACTION_CATEGORIES.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <ScrollArea className="flex-1 px-6 py-4 max-h-[calc(90vh-220px)]">
            <motion.div className="grid gap-3 sm:grid-cols-2" layout>
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
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Item
                        variant="outline"
                        className="cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/80 hover:shadow-md"
                        onClick={() => handleSelect(action.id as ActionType)}
                        asChild
                      >
                        <button type="button">
                          <ItemMedia variant="icon">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                          </ItemMedia>
                          <ItemContent>
                            <ItemTitle>{action.label}</ItemTitle>
                            <ItemDescription>{action.description}</ItemDescription>
                          </ItemContent>
                        </button>
                      </Item>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
