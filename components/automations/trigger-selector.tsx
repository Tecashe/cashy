"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { TRIGGER_TYPES } from "@/lib/automation-constants"
import type { TriggerType } from "@/lib/types/automation"

interface TriggerSelectorProps {
  open: boolean
  onClose: () => void
  onSelect: (type: TriggerType) => void
}

export function TriggerSelector({ open, onClose, onSelect }: TriggerSelectorProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader className="mb-6">
          <SheetTitle>Select a Trigger</SheetTitle>
          <SheetDescription>Choose what event should activate this automation</SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.values(TRIGGER_TYPES).map((trigger) => {
            const Icon = trigger.icon
            return (
              <Button
                key={trigger.id}
                variant="outline"
                className="h-auto justify-start gap-3 p-4 text-left bg-transparent"
                onClick={() => onSelect(trigger.id as TriggerType)}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-muted">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{trigger.label}</p>
                  <p className="text-sm text-muted-foreground">{trigger.description}</p>
                </div>
              </Button>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
