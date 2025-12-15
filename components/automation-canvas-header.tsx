"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save, Settings, Sparkles } from "lucide-react"
import { useMobile } from "@/hooks/use-is-mobile"

interface AutomationCanvasHeaderProps {
  name: string
  onNameChange: (name: string) => void
  onSave: () => void
  isSaving: boolean
  onToggleSidebar: () => void
  showSidebar: boolean
  onBack: () => void
}

export function AutomationCanvasHeader({
  name,
  onNameChange,
  onSave,
  isSaving,
  onToggleSidebar,
  showSidebar,
  onBack,
}: AutomationCanvasHeaderProps) {
  const isMobile = useMobile()

  return (
    <div className="flex-none border-b bg-card/95 backdrop-blur-sm shadow-sm z-20 sticky top-0">
      <div className="px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-3 md:gap-4 max-w-screen-2xl mx-auto">
          {/* Left section */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            <Button variant="ghost" size="sm" onClick={onBack} className="flex-shrink-0">
              <ArrowLeft className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Back</span>
            </Button>

            {!isMobile && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <Input
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="Automation Name"
                  className="max-w-md border-none shadow-none focus-visible:ring-0 text-xl font-bold"
                />
              </div>
            )}

            {isMobile && (
              <Input
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Automation Name"
                className="border-none shadow-none focus-visible:ring-0 font-semibold"
              />
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={onToggleSidebar}>
              <Settings className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">{showSidebar ? "Hide" : "Show"} Details</span>
            </Button>
            <Button onClick={onSave} disabled={isSaving} size={isMobile ? "sm" : "lg"} className="shadow-lg">
              <Save className="w-4 h-4 md:mr-2" />
              {isMobile ? "" : isSaving ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
