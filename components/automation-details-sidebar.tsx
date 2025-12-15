"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useMobile } from "@/hooks/use-is-mobile"
import { TRIGGER_TYPES } from "@/lib/automation-constants"
import type { TriggerTypeId, ActionTypeId } from "@/lib/automation-constants"

interface AutomationDetailsSidebarProps {
  name: string
  description: string
  instagramAccountId: string
  instagramAccounts: any[]
  trigger: { type: TriggerTypeId; config: any } | null
  actions: Array<{ type: ActionTypeId; config: any; order: number }>
  onNameChange: (name: string) => void
  onDescriptionChange: (description: string) => void
  onInstagramAccountChange: (accountId: string) => void
  onChangeTrigger: () => void
  onClose: () => void
}

export function AutomationDetailsSidebar({
  name,
  description,
  instagramAccountId,
  instagramAccounts,
  trigger,
  actions,
  onNameChange,
  onDescriptionChange,
  onInstagramAccountChange,
  onChangeTrigger,
  onClose,
}: AutomationDetailsSidebarProps) {
  const isMobile = useMobile()

  if (isMobile) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-50 bg-card border-t shadow-2xl rounded-t-2xl animate-in slide-in-from-bottom-full duration-300 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-lg">Automation Details</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mobile-name">Name</Label>
            <Input
              id="mobile-name"
              placeholder="Welcome New Followers"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile-account">Instagram Account</Label>
            <Select value={instagramAccountId} onValueChange={onInstagramAccountChange}>
              <SelectTrigger id="mobile-account">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {instagramAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    @{account.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile-description">Description</Label>
            <Textarea
              id="mobile-description"
              placeholder="What does this automation do?"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={3}
            />
          </div>

          {trigger && (
            <Card className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">Current Trigger</h4>
                <Button variant="ghost" size="sm" onClick={onChangeTrigger} className="h-7 text-xs">
                  Change
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{TRIGGER_TYPES[trigger.type]?.label || "Unknown"}</p>
            </Card>
          )}

          <div className="pt-2 border-t">
            <h4 className="font-semibold text-sm mb-2">Workflow Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Actions:</span>
                <Badge variant="secondary">{actions.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Configured:</span>
                <Badge variant="secondary">
                  {actions.filter((a) => Object.keys(a.config || {}).length > 0).length}/{actions.length}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-96 flex-none border-l bg-card overflow-y-auto shadow-xl animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between z-10">
        <h3 className="font-semibold text-lg">Details</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="desktop-name">Name</Label>
            <Input
              id="desktop-name"
              placeholder="Welcome New Followers"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desktop-account">Instagram Account</Label>
            <Select value={instagramAccountId} onValueChange={onInstagramAccountChange}>
              <SelectTrigger id="desktop-account">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {instagramAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    @{account.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desktop-description">Description</Label>
            <Textarea
              id="desktop-description"
              placeholder="What does this automation do?"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {trigger && (
          <Card className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm">Current Trigger</h4>
              <Button variant="ghost" size="sm" onClick={onChangeTrigger} className="h-7 text-xs">
                Change
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{TRIGGER_TYPES[trigger.type]?.label || "Unknown"}</p>
          </Card>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-semibold text-sm mb-3">Workflow Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trigger:</span>
              <Badge variant="secondary">{trigger ? "1 event" : "None"}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Actions:</span>
              <Badge variant="secondary">{actions.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Configured:</span>
              <Badge variant="secondary">
                {actions.filter((a) => Object.keys(a.config || {}).length > 0).length}/{actions.length}
              </Badge>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-semibold text-sm mb-2">Quick Guide</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-violet-500 font-bold">1.</span>
              <span>Select or configure your trigger</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet-500 font-bold">2.</span>
              <span>Add actions using the + button</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet-500 font-bold">3.</span>
              <span>Click nodes to configure them</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet-500 font-bold">4.</span>
              <span>Save to activate automation</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
