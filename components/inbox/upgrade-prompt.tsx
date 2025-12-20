"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sparkles, Zap, Crown } from "lucide-react"

interface UpgradePromptProps {
  open: boolean
  onClose: () => void
  feature: string
  description: string
}

export function UpgradePrompt({ open, onClose, feature, description }: UpgradePromptProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-center">Upgrade to Pro</DialogTitle>
          <DialogDescription className="text-center">
            {feature} is a premium feature. Upgrade to access {description} and more.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">AI Smart Replies</p>
                <p className="text-xs text-muted-foreground">Get instant AI-powered response suggestions</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Advanced Analytics</p>
                <p className="text-xs text-muted-foreground">Track performance and optimize your workflow</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-start gap-3">
              <Crown className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Unlimited Features</p>
                <p className="text-xs text-muted-foreground">Bulk actions, reminders, advanced filters & more</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Maybe Later
          </Button>
          <Button
            onClick={() => (window.location.href = "/pricing")}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Upgrade Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
