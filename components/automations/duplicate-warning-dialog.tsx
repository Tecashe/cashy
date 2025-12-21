"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DuplicateWarningDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  duplicates: Array<{ id: string; name: string }>
  onContinue: () => void
  onCancel: () => void
}

export function DuplicateWarningDialog({
  open,
  onOpenChange,
  duplicates,
  onContinue,
  onCancel,
}: DuplicateWarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">Duplicate Automation Detected</DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                You already have similar automations that may conflict with this one.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Similar active automations:</p>
          <div className="space-y-2 rounded-lg border border-border/50 bg-muted/30 p-3">
            {duplicates.map((dup) => (
              <div key={dup.id} className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="font-medium">{dup.name}</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Multiple automations with overlapping triggers may cause unexpected behavior. Consider editing existing
              automations instead.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            Review Existing
          </Button>
          <Button onClick={onContinue} className="flex-1">
            Create Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
