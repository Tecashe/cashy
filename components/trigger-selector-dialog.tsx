"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TRIGGER_TYPES, type TriggerTypeId } from "@/lib/automation-constants"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface TriggerSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (triggerType: TriggerTypeId) => void
  currentTrigger?: TriggerTypeId
}

export function TriggerSelectorDialog({ open, onOpenChange, onSelect, currentTrigger }: TriggerSelectorDialogProps) {
  const [search, setSearch] = useState("")

  const filteredTriggers = Object.entries(TRIGGER_TYPES).filter(
    ([_, config]) =>
      config.label.toLowerCase().includes(search.toLowerCase()) ||
      config.description?.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSelect = (triggerType: TriggerTypeId) => {
    onSelect(triggerType)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Trigger Event</DialogTitle>
          <DialogDescription>Choose when this automation should activate</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search triggers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
            {filteredTriggers.map(([typeId, config]) => {
              const Icon = config.icon
              const isSelected = currentTrigger === typeId

              return (
                <Button
                  key={typeId}
                  variant="outline"
                  onClick={() => handleSelect(typeId as TriggerTypeId)}
                  className={cn(
                    "h-auto p-4 justify-start text-left hover:bg-accent transition-all",
                    isSelected && "border-violet-500 bg-violet-50 dark:bg-violet-950/20",
                  )}
                >
                  <div className="flex items-start gap-4 w-full">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{config.label}</h4>
                        {isSelected && <Badge className="bg-violet-500 text-white text-xs">Current</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {config.description || "Triggers when this event occurs"}
                      </p>
                    </div>
                  </div>
                </Button>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
