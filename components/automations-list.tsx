"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreVertical, Edit, Copy, Trash2, Bot, MessageSquare, Clock, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { toggleAutomationStatus, deleteAutomation, duplicateAutomation } from "@/lib/actions/automation-actions"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

interface AutomationsListProps {
  automations: any[]
  instagramAccounts: any[]
}

export function AutomationsList({ automations, instagramAccounts }: AutomationsListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = async (automationId: string, currentStatus: boolean) => {
    try {
      await toggleAutomationStatus(automationId, !currentStatus)
      toast({
        title: "Success",
        description: `Automation ${!currentStatus ? "activated" : "paused"}`,
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update automation",
        variant: "destructive",
      })
    }
  }

  const handleDuplicate = async (automationId: string) => {
    try {
      const duplicated = await duplicateAutomation(automationId)
      toast({
        title: "Success",
        description: "Automation duplicated successfully",
      })
      router.push(`/automations/${duplicated.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to duplicate automation",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedAutomation) return

    setIsDeleting(true)
    try {
      await deleteAutomation(selectedAutomation)
      toast({
        title: "Success",
        description: "Automation deleted successfully",
      })
      setDeleteDialogOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete automation",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getTriggerDescription = (trigger: any) => {
    switch (trigger.type) {
      case "DM_RECEIVED":
        return "Any DM received"
      case "FIRST_MESSAGE":
        return "First message from user"
      case "KEYWORD":
        const keywords = trigger.conditions?.keywords || []
        return `Keywords: ${keywords.slice(0, 3).join(", ")}${keywords.length > 3 ? "..." : ""}`
      case "STORY_REPLY":
        return "Story reply"
      case "COMMENT":
        return "Comment on post"
      case "MENTION":
        return "Mention in story"
      case "HAS_TAG":
        return "Has specific tag"
      default:
        return trigger.type
    }
  }

  const getActionSummary = (actions: any[]) => {
    const actionCounts = actions.reduce(
      (acc, action) => {
        if (action.type === "SEND_MESSAGE") acc.messages++
        else if (action.type === "AI_RESPONSE") acc.ai++
        else if (action.type === "DELAY") acc.delays++
        else if (action.type === "SEND_TO_HUMAN") acc.handoffs++
        return acc
      },
      { messages: 0, ai: 0, delays: 0, handoffs: 0 },
    )

    return (
      <div className="flex gap-3 text-xs text-muted-foreground">
        {actionCounts.messages > 0 && (
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {actionCounts.messages} message{actionCounts.messages > 1 ? "s" : ""}
          </div>
        )}
        {actionCounts.ai > 0 && (
          <div className="flex items-center gap-1">
            <Bot className="h-3 w-3" />
            {actionCounts.ai} AI response{actionCounts.ai > 1 ? "s" : ""}
          </div>
        )}
        {actionCounts.delays > 0 && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {actionCounts.delays} delay{actionCounts.delays > 1 ? "s" : ""}
          </div>
        )}
        {actionCounts.handoffs > 0 && (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {actionCounts.handoffs} handoff{actionCounts.handoffs > 1 ? "s" : ""}
          </div>
        )}
      </div>
    )
  }

  if (automations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-muted p-4 mb-4">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No automations yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
            Create your first automation to start automating your Instagram DM responses
          </p>
          <Button onClick={() => router.push(("/automations/new"))}>Create Automation</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {automations.map((automation) => {
          const trigger = automation.triggers[0]
          const account = instagramAccounts.find((acc) => acc.id === automation.instagramAccountId)

          return (
            <Card key={automation.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{automation.name}</CardTitle>
                      <Badge variant={automation.isActive ? "default" : "secondary"}>
                        {automation.isActive ? "Active" : automation.status}
                      </Badge>
                    </div>
                    {automation.description && (
                      <CardDescription className="mt-1 line-clamp-2">{automation.description}</CardDescription>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/automations/${automation.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(automation.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setSelectedAutomation(automation.id)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{automation.isActive ? "Active" : "Paused"}</span>
                      <Switch
                        checked={automation.isActive}
                        onCheckedChange={() => handleToggle(automation.id, automation.isActive)}
                      />
                    </div>
                  </div>

                  {account && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Account</span>
                      <span className="font-medium">@{account.username}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Trigger</span>
                    <span className="font-medium text-right line-clamp-1">{getTriggerDescription(trigger)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Actions</span>
                    <span className="font-medium">{automation.actions.length}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Executions</span>
                    <span className="font-medium">{automation._count?.executions || 0}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">{getActionSummary(automation.actions)}</div>

                <div className="text-xs text-muted-foreground">
                  Created {formatDistanceToNow(new Date(automation.createdAt), { addSuffix: true })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Automation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this automation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
