"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { CONDITION_OPERATORS, CONDITION_FIELDS } from "@/lib/constants/utomation-constants"
import type { ConditionGroup, ConditionRule, ConditionOperator, LogicOperator } from "@/lib/types/automation"
import { Label } from "@/components/ui/label"

interface ConditionBuilderProps {
  conditionGroups: ConditionGroup[]
  onChange: (groups: ConditionGroup[]) => void
}

export function ConditionBuilder({ conditionGroups, onChange }: ConditionBuilderProps) {
  const addGroup = () => {
    const newGroup: ConditionGroup = {
      id: `group-${Date.now()}`,
      operator: "AND",
      rules: [
        {
          id: `rule-${Date.now()}`,
          field: "message",
          operator: "contains",
          value: "",
        },
      ],
    }
    onChange([...conditionGroups, newGroup])
  }

  const updateGroup = (groupId: string, operator: LogicOperator) => {
    onChange(conditionGroups.map((group) => (group.id === groupId ? { ...group, operator } : group)))
  }

  const removeGroup = (groupId: string) => {
    onChange(conditionGroups.filter((group) => group.id !== groupId))
  }

  const addRule = (groupId: string) => {
    const newRule: ConditionRule = {
      id: `rule-${Date.now()}`,
      field: "message",
      operator: "contains",
      value: "",
    }
    onChange(
      conditionGroups.map((group) => (group.id === groupId ? { ...group, rules: [...group.rules, newRule] } : group)),
    )
  }

  const updateRule = (groupId: string, ruleId: string, updates: Partial<ConditionRule>) => {
    onChange(
      conditionGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              rules: group.rules.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule)),
            }
          : group,
      ),
    )
  }

  const removeRule = (groupId: string, ruleId: string) => {
    onChange(
      conditionGroups.map((group) =>
        group.id === groupId ? { ...group, rules: group.rules.filter((rule) => rule.id !== ruleId) } : group,
      ),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Conditions</Label>
        <Button type="button" variant="outline" size="sm" onClick={addGroup}>
          <Plus className="mr-2 h-4 w-4" />
          Add Condition Group
        </Button>
      </div>

      {conditionGroups.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex min-h-[200px] items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">No conditions added. Click "Add Condition Group" to start.</p>
          </CardContent>
        </Card>
      )}

      {conditionGroups.map((group, groupIndex) => (
        <Card key={group.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">IF {groupIndex > 0 && "OR"}</CardTitle>
                <Select value={group.operator} onValueChange={(value) => updateGroup(group.id, value as LogicOperator)}>
                  <SelectTrigger className="h-8 w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeGroup(group.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {group.rules.map((rule, ruleIndex) => (
              <div key={rule.id} className="space-y-2">
                {ruleIndex > 0 && (
                  <Badge variant="secondary" className="mb-2">
                    {group.operator}
                  </Badge>
                )}
                <div className="grid gap-2 sm:grid-cols-[1fr,1fr,1fr,auto]">
                  <Select value={rule.field} onValueChange={(value) => updateRule(group.id, rule.id, { field: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITION_FIELDS.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={rule.operator}
                    onValueChange={(value) =>
                      updateRule(group.id, rule.id, {
                        operator: value as ConditionOperator,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITION_OPERATORS.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {!["is_empty", "is_not_empty"].includes(rule.operator) && (
                    <Input
                      placeholder="Value"
                      value={rule.value}
                      onChange={(e) => updateRule(group.id, rule.id, { value: e.target.value })}
                    />
                  )}

                  <Button type="button" variant="ghost" size="icon" onClick={() => removeRule(group.id, rule.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
              onClick={() => addRule(group.id)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Rule
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
