"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { FlowNode } from "./visual-automation-builder"

interface ActionEditorProps {
  node: FlowNode
  onUpdate: (data: any) => void
}

export function ActionEditor({ node, onUpdate }: ActionEditorProps) {
  const [localData, setLocalData] = useState(node.data)

  const handleSave = () => {
    onUpdate(localData)
  }

  if (node.actionType === "SEND_MESSAGE") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Message</Label>
          <Textarea
            placeholder="Enter your message... Use {name} for personalization"
            value={localData.message || ""}
            onChange={(e) => setLocalData({ ...localData, message: e.target.value })}
            rows={5}
          />
          <p className="text-xs text-muted-foreground mt-1">Use variables like {"{name}"} to personalize messages</p>
        </div>
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    )
  }

  if (node.actionType === "SEND_IMAGE") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Image URL</Label>
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={localData.imageUrl || ""}
            onChange={(e) => setLocalData({ ...localData, imageUrl: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">Enter the URL of the image to send</p>
        </div>
        <div>
          <Label>Optional Caption</Label>
          <Textarea
            placeholder="Add a caption (optional)"
            value={localData.caption || ""}
            onChange={(e) => setLocalData({ ...localData, caption: e.target.value })}
            rows={3}
          />
        </div>
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    )
  }

  if (node.actionType === "SEND_VIDEO") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Video URL</Label>
          <Input
            type="url"
            placeholder="https://example.com/video.mp4"
            value={localData.videoUrl || ""}
            onChange={(e) => setLocalData({ ...localData, videoUrl: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">Enter the URL of the video to send</p>
        </div>
        <div>
          <Label>Optional Caption</Label>
          <Textarea
            placeholder="Add a caption (optional)"
            value={localData.caption || ""}
            onChange={(e) => setLocalData({ ...localData, caption: e.target.value })}
            rows={3}
          />
        </div>
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    )
  }

  if (node.actionType === "AI_RESPONSE") {
    return (
      <div className="space-y-4">
        <div>
          <Label>AI Instructions</Label>
          <Textarea
            placeholder="Provide instructions for the AI response..."
            value={localData.customInstructions || ""}
            onChange={(e) => setLocalData({ ...localData, customInstructions: e.target.value })}
            rows={5}
          />
          <p className="text-xs text-muted-foreground mt-1">Guide the AI on how to respond to messages</p>
        </div>
        <div>
          <Label>Tone</Label>
          <Select
            value={localData.tone || "friendly"}
            onValueChange={(value) => setLocalData({ ...localData, tone: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="use-kb">Use Knowledge Base</Label>
          <Switch
            id="use-kb"
            checked={localData.useKnowledgeBase || false}
            onCheckedChange={(checked) => setLocalData({ ...localData, useKnowledgeBase: checked })}
          />
        </div>
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    )
  }

  if (node.actionType === "ADD_TAG") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Tag Name</Label>
          <Input
            placeholder="Enter tag name"
            value={localData.tagName || ""}
            onChange={(e) => setLocalData({ ...localData, tagName: e.target.value })}
          />
        </div>
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    )
  }

  if (node.actionType === "DELAY") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Duration</Label>
            <Input
              type="number"
              min="1"
              placeholder="5"
              value={localData.delayAmount || ""}
              onChange={(e) => setLocalData({ ...localData, delayAmount: e.target.value })}
            />
          </div>
          <div>
            <Label>Unit</Label>
            <Select
              value={localData.delayUnit || "minutes"}
              onValueChange={(value) => setLocalData({ ...localData, delayUnit: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    )
  }

  if (node.actionType === "WEBHOOK") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Webhook URL</Label>
          <Input
            type="url"
            placeholder="https://your-webhook-url.com/endpoint"
            value={localData.webhookUrl || ""}
            onChange={(e) => setLocalData({ ...localData, webhookUrl: e.target.value })}
          />
        </div>
        <div>
          <Label>Method</Label>
          <Select
            value={localData.method || "POST"}
            onValueChange={(value) => setLocalData({ ...localData, method: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    )
  }

  if (node.actionType === "SEND_TO_HUMAN") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Handoff Reason</Label>
          <Textarea
            placeholder="Why should this be handed off to a human?"
            value={localData.reason || ""}
            onChange={(e) => setLocalData({ ...localData, reason: e.target.value })}
            rows={3}
          />
        </div>
        <div>
          <Label>Priority</Label>
          <Select
            value={localData.priority || "normal"}
            onValueChange={(value) => setLocalData({ ...localData, priority: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    )
  }

  if (node.actionType === "CONDITION") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Field</Label>
          <Select
            value={localData.field || "message"}
            onValueChange={(value) => setLocalData({ ...localData, field: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="message">Message Content</SelectItem>
              <SelectItem value="confidence">AI Confidence</SelectItem>
              <SelectItem value="tag">Has Tag</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Operator</Label>
          <Select
            value={localData.operator || "contains"}
            onValueChange={(value) => setLocalData({ ...localData, operator: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contains">Contains</SelectItem>
              <SelectItem value="equals">Equals</SelectItem>
              <SelectItem value="greater_than">Greater Than</SelectItem>
              <SelectItem value="less_than">Less Than</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Value</Label>
          <Input
            placeholder="Enter value"
            value={localData.value || ""}
            onChange={(e) => setLocalData({ ...localData, value: e.target.value })}
          />
        </div>
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">No additional configuration needed for this action.</p>
      <Button onClick={handleSave} className="w-full">
        Done
      </Button>
    </div>
  )
}
