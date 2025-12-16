"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ACTION_TYPES, ACTION_CATEGORIES } from "@/lib/automation-constants"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ActionType } from "@/lib/types/automation"

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
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader className="mb-6">
          <SheetTitle>Add Action</SheetTitle>
          <SheetDescription>Choose what action to perform when the trigger activates</SheetDescription>
        </SheetHeader>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4 w-full justify-start overflow-x-auto">
            {ACTION_CATEGORIES.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex-shrink-0">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid gap-3 sm:grid-cols-2">
            {filteredActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto justify-start gap-3 p-4 text-left bg-transparent"
                  onClick={() => onSelect(action.id as ActionType)}
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-muted">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{action.label}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              )
            })}
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}