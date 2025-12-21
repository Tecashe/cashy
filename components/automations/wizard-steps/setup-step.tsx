"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AutomationFlow } from "@/lib/types/automation"
import { motion } from "framer-motion"
import { FileText, Instagram } from "lucide-react"

interface SetupStepProps {
  flow: AutomationFlow
  setFlow: (flow: AutomationFlow) => void
  accounts: any[]
}

export function SetupStep({ flow, setFlow, accounts }: SetupStepProps) {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="overflow-hidden border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-muted/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 shadow-inner ring-1 ring-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold tracking-tight">Automation Details</CardTitle>
                <CardDescription className="text-sm">Give your automation a name and description</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2.5">
              <Label htmlFor="name" className="text-sm font-medium">
                Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g., Welcome New Followers"
                value={flow.name}
                onChange={(e) => setFlow({ ...flow, name: e.target.value })}
                className="h-11 border-border/50 bg-background/50 shadow-sm transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what this automation does..."
                value={flow.description}
                onChange={(e) => setFlow({ ...flow, description: e.target.value })}
                rows={4}
                className="resize-none border-border/50 bg-background/50 shadow-sm transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">{flow.description?.length} / 500 characters</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="overflow-hidden border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-muted/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 shadow-inner ring-1 ring-primary/10">
                <Instagram className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold tracking-tight">Instagram Account</CardTitle>
                <CardDescription className="text-sm">
                  Select which Instagram account this automation applies to
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2.5">
              <Label htmlFor="account" className="text-sm font-medium">
                Account *
              </Label>
              <Select
                value={flow.instagramAccountId}
                onValueChange={(value) => setFlow({ ...flow, instagramAccountId: value })}
              >
                <SelectTrigger className="h-11 border-border/50 bg-background/50 shadow-sm transition-all duration-200 hover:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                          <Instagram className="h-3.5 w-3.5 text-primary" />
                        </div>
                        @{account.username}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {accounts.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2 rounded-lg bg-destructive/10 p-3 ring-1 ring-destructive/20">
                  No Instagram accounts connected. Please connect an account first.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
