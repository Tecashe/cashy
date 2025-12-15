"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TRIGGER_TYPES, type TriggerTypeId } from "@/lib/automation-constants"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-is-mobile"

interface InCanvasTriggerSelectorProps {
  onSelect: (triggerType: TriggerTypeId) => void
  className?: string
}

export function InCanvasTriggerSelector({ onSelect, className }: InCanvasTriggerSelectorProps) {
  const [search, setSearch] = useState("")
  const isMobile = useMobile()

  const filteredTriggers = Object.entries(TRIGGER_TYPES).filter(
    ([_, config]) =>
      config.label.toLowerCase().includes(search.toLowerCase()) ||
      config.description?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Card className={cn("max-w-2xl mx-auto shadow-lg border-2", className)}>
      <div className="p-6 border-b bg-muted/30">
        <h2 className="text-2xl font-bold mb-2">Choose Your Trigger</h2>
        <p className="text-sm text-muted-foreground">Select what starts your automation</p>
      </div>

      <div className="p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search triggers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn("pl-10", isMobile ? "h-12" : "h-10")}
          />
        </div>

        <div className="grid gap-2 max-h-[50vh] overflow-y-auto scrollbar-thin">
          {filteredTriggers.map(([typeId, config]) => {
            const Icon = config.icon
            return (
              <Button
                key={typeId}
                variant="outline"
                onClick={() => onSelect(typeId as TriggerTypeId)}
                className="h-auto justify-start text-left p-4 border-2"
              >
                <div className="flex items-start gap-4 w-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1">{config.label}</h4>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>

        {filteredTriggers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No triggers found</p>
          </div>
        )}
      </div>
    </Card>
  )
}
