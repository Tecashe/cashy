"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, Copy, MoreVertical, Zap, Play } from "lucide-react"
import { TRIGGER_TYPES } from "@/lib/constants/utomation-constants"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toggleAutomationStatus, deleteAutomation, duplicateAutomation } from "@/lib/actions/automation-actions"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface AutomationsListProps {
  automations: any[]
  accounts: any[]
}

export function AutomationsList({ automations, accounts }: AutomationsListProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  if (automations.length === 0) {
    return (
      <Card className="group relative overflow-hidden border-dashed border-2 border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <CardContent className="relative flex min-h-[500px] flex-col items-center justify-center gap-6 py-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 animate-pulse-glow rounded-full bg-primary/20 blur-2xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg ring-1 ring-primary/10">
              <Zap className="h-12 w-12 text-primary" />
            </div>
          </motion.div>

          <div className="text-center space-y-3 max-w-md">
            <h3 className="text-2xl font-semibold tracking-tight">No automations yet</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Create your first automation to start automating Instagram interactions and save time
            </p>
          </div>

          <Link href="/automations/new">
            <Button
              size="lg"
              className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Play className="h-4 w-4" />
                Create Your First Automation
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Button>
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
    <motion.div
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {automations.map((automation, index) => {
        const trigger = automation.triggers[0]
        const triggerInfo = TRIGGER_TYPES[trigger?.type as keyof typeof TRIGGER_TYPES]
        const TriggerIcon = triggerInfo?.icon

        return (
          <motion.div
            key={automation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.05,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <Card className="group relative h-full overflow-hidden border border-border/50 bg-card/50 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
              {automation.isActive && (
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary via-primary/70 to-primary/30">
                  <div className="absolute inset-0 animate-pulse-glow bg-primary/50 blur-sm" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <CardHeader className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2 min-w-0">
                    <CardTitle className="line-clamp-1 text-lg font-semibold tracking-tight leading-tight">
                      {automation.name}
                    </CardTitle>
                    {automation.description && (
                      <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                        {automation.description}
                      </CardDescription>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted/50"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href={`/automations/${automation.id}/edit`} className="cursor-pointer">
                          <Edit className="mr-3 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(automation.id)} className="cursor-pointer">
                        <Copy className="mr-3 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(automation.id)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-3 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-5">
                <div className="flex items-center gap-4 rounded-lg bg-muted/30 p-3 ring-1 ring-border/50">
                  {TriggerIcon && (
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 shadow-inner ring-1 ring-primary/10">
                      <TriggerIcon className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight">{triggerInfo?.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {automation.actions.length} action{automation.actions.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={automation.isActive}
                      onCheckedChange={() => handleToggle(automation.id, automation.isActive)}
                      disabled={isPending}
                      className="data-[state=checked]:bg-primary"
                    />
                    <span className="text-sm font-medium text-muted-foreground">
                      {automation.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <Badge
                    variant={automation.isActive ? "default" : "secondary"}
                    className={automation.isActive ? "shadow-sm bg-primary/90" : ""}
                  >
                    {automation.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
