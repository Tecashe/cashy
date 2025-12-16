"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, Copy, MoreVertical } from "lucide-react"
import { TRIGGER_TYPES } from "@/lib/automation-constants"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toggleAutomationStatus, deleteAutomation, duplicateAutomation } from "@/lib/actions/automation-actions"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

interface AutomationsListProps {
  automations: any[]
  accounts: any[]
}

export function AutomationsList({ automations, accounts }: AutomationsListProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  if (automations.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold">No automations yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first automation to start automating Instagram interactions
            </p>
          </div>
          <Link href="/automations/new">
            <Button size="lg">Create Your First Automation</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const handleToggle = (id: string, isActive: boolean) => {
    startTransition(async () => {
      await toggleAutomationStatus(id, !isActive)
      router.refresh()
    })
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this automation?")) {
      startTransition(async () => {
        await deleteAutomation(id)
        router.refresh()
      })
    }
  }

  const handleDuplicate = (id: string) => {
    startTransition(async () => {
      await duplicateAutomation(id)
      router.refresh()
    })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {automations.map((automation) => {
        const trigger = automation.triggers[0]
        const triggerInfo = TRIGGER_TYPES[trigger?.type as keyof typeof TRIGGER_TYPES]
        const TriggerIcon = triggerInfo?.icon

        return (
          <Card key={automation.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-1">
                  <CardTitle className="line-clamp-1 text-lg">{automation.name}</CardTitle>
                  {automation.description && (
                    <CardDescription className="line-clamp-2">{automation.description}</CardDescription>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/automations/${automation.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(automation.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(automation.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {TriggerIcon && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                    <TriggerIcon className="h-5 w-5" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{triggerInfo?.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {automation.actions.length} action{automation.actions.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 border-t pt-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={automation.isActive}
                    onCheckedChange={() => handleToggle(automation.id, automation.isActive)}
                    disabled={isPending}
                  />
                  <span className="text-sm text-muted-foreground">{automation.isActive ? "Active" : "Inactive"}</span>
                </div>
                <Badge variant={automation.isActive ? "default" : "secondary"}>{automation.status}</Badge>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
