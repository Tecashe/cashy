"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Keyboard } from "lucide-react"

interface KeyboardShortcutsModalProps {
  open: boolean
  onClose: () => void
}

export function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsModalProps) {
  const shortcuts = [
    { keys: ["Cmd", "K"], description: "Open search" },
    { keys: ["Cmd", "Enter"], description: "Send message" },
    { keys: ["Cmd", "/"], description: "Open templates" },
    { keys: ["E"], description: "Archive conversation" },
    { keys: ["R"], description: "Mark as unread" },
    { keys: ["S"], description: "Star conversation" },
    { keys: ["A"], description: "Assign to team member" },
    { keys: ["↑", "↓"], description: "Navigate conversations" },
    { keys: ["Esc"], description: "Close conversation" },
    { keys: ["?"], description: "Show shortcuts" },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <kbd key={keyIndex} className="px-2 py-1 text-xs font-semibold bg-muted border border-border rounded">
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
