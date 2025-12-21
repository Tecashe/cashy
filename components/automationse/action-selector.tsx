"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ACTION_TYPES, ACTION_CATEGORIES } from "@/lib/constants/automations"
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

  const categories = ACTION_CATEGORIES || FALLBACK_CATEGORIES

  const filteredActions = Object.values(ACTION_TYPES).filter(
    (action) => activeCategory === "all" || action.category === activeCategory,
  )

  const handleSelect = (type: ActionType) => {
    onSelect(type)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-5 border-b border-border/50 bg-muted/20">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-inner ring-1 ring-primary/20">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold tracking-tight">Add Action</DialogTitle>
              <DialogDescription className="mt-1.5 text-sm">
                Choose what action to perform when the trigger activates
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex flex-col h-full">
          <div className="px-6 pt-5 pb-1">
            <ScrollArea className="w-full">
              <TabsList className="inline-flex w-auto justify-start gap-1 rounded-xl border border-border/50 bg-muted/30 p-1.5 shadow-inner">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-muted/50"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
          </div>

          <ScrollArea className="flex-1 px-6 py-5 max-h-[calc(90vh-240px)]">
            <motion.div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-2" layout>
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
                        duration: 0.25,
                        delay: index * 0.025,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                    >
                      <Item
                        variant="outline"
                        className="group cursor-pointer border border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/70 hover:shadow-lg hover:shadow-primary/5"
                        onClick={() => handleSelect(action.id as ActionType)}
                        asChild
                      >
                        <button type="button" className="w-full">
                          <ItemMedia variant="icon">
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 via-primary/8 to-transparent shadow-inner ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/10">
                              <Icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-3" />
                            </div>
                          </ItemMedia>
                          <ItemContent className="py-0.5">
                            <ItemTitle className="text-base font-semibold tracking-tight">{action.label}</ItemTitle>
                            <ItemDescription className="mt-1 text-sm leading-relaxed">
                              {action.description}
                            </ItemDescription>
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
