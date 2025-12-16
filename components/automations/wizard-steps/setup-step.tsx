"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AutomationFlow } from "@/lib/types/automation"

interface SetupStepProps {
  flow: AutomationFlow
  setFlow: (flow: AutomationFlow) => void
  accounts: any[]
}

export function SetupStep({ flow, setFlow, accounts }: SetupStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Automation Details</CardTitle>
          <CardDescription>Give your automation a name and description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Welcome New Followers"
              value={flow.name}
              onChange={(e) => setFlow({ ...flow, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this automation does..."
              value={flow.description}
              onChange={(e) => setFlow({ ...flow, description: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instagram Account</CardTitle>
          <CardDescription>Select which Instagram account this automation applies to</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="account">Account *</Label>
            <Select
              value={flow.instagramAccountId}
              onValueChange={(value) => setFlow({ ...flow, instagramAccountId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    @{account.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {accounts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No Instagram accounts connected. Please connect an account first.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
