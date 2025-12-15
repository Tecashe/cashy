"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FlowNode } from "./visual-automation-builder"

interface TriggerEditorProps {
  node: FlowNode
  onUpdate: (data: any) => void
}

export function TriggerEditor({ node, onUpdate }: TriggerEditorProps) {
  const [localData, setLocalData] = useState(node.data)

  const handleSave = () => {
    onUpdate(localData)
  }

  if (node.actionType === "KEYWORD") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Keywords</Label>
          <Input
            placeholder="Enter keywords separated by commas"
            value={localData.keywords?.join(", ") || ""}
            onChange={(e) =>
              setLocalData({
                ...localData,
                keywords: e.target.value
                  .split(",")
                  .map((k) => k.trim())
                  .filter(Boolean),
              })
            }
          />
          <p className="text-xs text-muted-foreground mt-1">Separate multiple keywords with commas</p>
        </div>
        <div>
          <Label>Match Type</Label>
          <Select
            value={localData.matchType || "contains"}
            onValueChange={(value) => setLocalData({ ...localData, matchType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contains">Contains</SelectItem>
              <SelectItem value="exact">Exact Match</SelectItem>
              <SelectItem value="starts_with">Starts With</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">This trigger doesn't require additional configuration.</p>
      <Button onClick={() => onUpdate(localData)} className="w-full">
        Done
      </Button>
    </div>
  )
}
