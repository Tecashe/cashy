"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TRIGGER_TYPES, type TriggerTypeId } from "@/lib/automation-constants"
import { Search, Sparkles, Zap, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-is-mobile"

interface InCanvasTriggerSelectorProps {
  onSelect: (triggerType: TriggerTypeId) => void
  className?: string
}

export function InCanvasTriggerSelector({ onSelect, className }: InCanvasTriggerSelectorProps) {
  const [search, setSearch] = useState("")
  const [hoveredTrigger, setHoveredTrigger] = useState<string | null>(null)
  const isMobile = useMobile()

  const filteredTriggers = Object.entries(TRIGGER_TYPES).filter(
    ([_, config]) =>
      config.label.toLowerCase().includes(search.toLowerCase()) ||
      config.description?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Card className={cn("max-w-2xl mx-auto shadow-2xl border-0 overflow-hidden relative animate-bounce-in", className)}>
      <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-8 md:p-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-32 h-32 bg-white/10 rounded-full blur-3xl top-0 left-0 animate-float"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute w-40 h-40 bg-pink-500/10 rounded-full blur-3xl bottom-0 right-0 animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl top-1/2 left-1/2 animate-float"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        <div className="relative z-10 text-center space-y-4">
          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl border-2 border-white/30 animate-bounce-in">
            <div className="relative">
              <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-white drop-shadow-2xl" />
              <div className="absolute inset-0 w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full blur-xl animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3 drop-shadow-lg">
              <Zap className="w-7 h-7 md:w-8 md:h-8 text-yellow-300 animate-pulse" />
              Start Your Automation
            </h2>
            <p className="text-base md:text-lg text-white/95 font-medium max-w-md mx-auto">
              Choose a trigger to activate your workflow automatically
            </p>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "p-6 md:p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900",
          "space-y-5",
        )}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors pointer-events-none" />
          <Input
            placeholder="Search triggers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "pl-12 border-2 transition-all duration-200 shadow-sm",
              isMobile ? "h-14 text-lg" : "h-12 text-base",
              "focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-950",
              "focus:shadow-lg",
            )}
          />
        </div>

        <div className="grid gap-3 max-h-[50vh] overflow-y-auto pr-2 automation-scroll">
          {filteredTriggers.map(([typeId, config]) => {
            const Icon = config.icon
            const isHovered = hoveredTrigger === typeId

            return (
              <Button
                key={typeId}
                variant="outline"
                onClick={() => onSelect(typeId as TriggerTypeId)}
                onMouseEnter={() => setHoveredTrigger(typeId)}
                onMouseLeave={() => setHoveredTrigger(null)}
                className={cn(
                  "h-auto justify-start text-left transition-all duration-300 relative overflow-hidden group",
                  isMobile ? "p-5" : "p-4",
                  "border-2 hover:border-violet-400 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50",
                  "dark:hover:from-violet-950/30 dark:hover:to-purple-950/30",
                  "hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                  isHovered && "border-violet-400 shadow-xl scale-[1.02]",
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    "bg-gradient-to-r from-transparent via-white/20 to-transparent",
                    "-translate-x-full group-hover:translate-x-full",
                    "transition-transform duration-1000",
                  )}
                />

                <div className="flex items-start gap-4 md:gap-5 w-full relative z-10">
                  <div
                    className={cn(
                      "rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600",
                      "flex items-center justify-center flex-shrink-0 shadow-lg relative",
                      isMobile ? "w-14 h-14" : "w-12 h-12 md:w-14 md:h-14",
                      "transition-all duration-300 border-2 border-white/20",
                      isHovered && "scale-110 rotate-6 shadow-2xl border-white/40",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300",
                      )}
                    />
                    <Icon
                      className={cn(
                        isMobile ? "w-7 h-7" : "w-6 h-6 md:w-7 md:h-7",
                        "text-white drop-shadow-lg relative z-10",
                      )}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4
                        className={cn(
                          "font-bold transition-colors duration-200",
                          isMobile ? "text-lg" : "text-base md:text-lg",
                          isHovered && "text-violet-600 dark:text-violet-400",
                        )}
                      >
                        {config.label}
                      </h4>
                      <ArrowRight
                        className={cn(
                          "w-4 h-4 transition-all duration-300",
                          isHovered ? "opacity-100 translate-x-1 text-violet-600" : "opacity-0 -translate-x-2",
                        )}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {config.description || "Triggers when this event occurs"}
                    </p>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>

        {filteredTriggers.length === 0 && (
          <div className="text-center py-12 animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground mb-1">No triggers found</p>
            <p className="text-sm text-muted-foreground">Try searching with different keywords</p>
          </div>
        )}
      </div>
    </Card>
  )
}
