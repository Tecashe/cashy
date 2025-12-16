"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ACTION_TYPES, AI_TONES, AVAILABLE_VARIABLES } from "@/lib/constants/utomation-constants"
import type { ActionConfig as ActionConfigType } from "@/lib/types/automation"
import { ConditionBuilder } from "./condition-builder"
import { Plus, Info } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ActionConfigModalProps {
  open: boolean
  onClose: () => void
  action: ActionConfigType
  onSave: (action: ActionConfigType) => void
  tags: any[]
}

export function ActionConfigModal({ open, onClose, action, onSave, tags }: ActionConfigModalProps) {
  const [config, setConfig] = useState(action.config)
  const actionInfo = ACTION_TYPES[action.type]

  const handleSave = () => {
    onSave({ ...action, config })
    onClose()
  }

  const insertVariable = (variable: string, field: "message" | "aiInstructions") => {
    const currentValue = config[field] || ""
    const textarea = document.querySelector(`textarea[data-field="${field}"]`) as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = currentValue.slice(0, start) + variable + currentValue.slice(end)
      setConfig({ ...config, [field]: newValue })

      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + variable.length, start + variable.length)
      }, 0)
    } else {
      setConfig({ ...config, [field]: currentValue + variable })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            {actionInfo.label}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{actionInfo.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SheetTitle>
          <SheetDescription>{actionInfo.description}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 py-6">
            {/* Send Message */}
            {action.type === "send_message" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Message Content</CardTitle>
                  <CardDescription>Compose your automated message</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      data-field="message"
                      placeholder="Hi {first_name}! Thanks for reaching out..."
                      value={config.message || ""}
                      onChange={(e) => setConfig({ ...config, message: e.target.value })}
                      rows={6}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">{(config.message || "").length} characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Insert Variables</Label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_VARIABLES.map((variable) => (
                        <Button
                          key={variable.value}
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => insertVariable(variable.value, "message")}
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          {variable.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Send Image */}
            {action.type === "send_image" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Image Settings</CardTitle>
                  <CardDescription>Configure the image to send</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL *</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      value={config.imageUrl || ""}
                      onChange={(e) => setConfig({ ...config, imageUrl: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF (max 8MB)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageCaption">Caption (optional)</Label>
                    <Textarea
                      id="imageCaption"
                      placeholder="Add a caption to your image..."
                      value={config.message || ""}
                      onChange={(e) => setConfig({ ...config, message: e.target.value })}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Send Carousel */}
            {action.type === "send_carousel" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Carousel Settings</CardTitle>
                  <CardDescription>Add multiple images (2-10 images)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Image URLs</Label>
                    <Textarea
                      placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                      value={config.images?.join("\n") || ""}
                      onChange={(e) =>
                        setConfig({ ...config, images: e.target.value.split("\n").filter((url) => url.trim()) })
                      }
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground">Enter one URL per line (2-10 images)</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reply to Comment */}
            {action.type === "reply_to_comment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Comment Reply</CardTitle>
                  <CardDescription>Configure your automated comment reply</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reply">Reply Message *</Label>
                    <Textarea
                      id="reply"
                      data-field="message"
                      placeholder="Thanks for your comment! Check your DMs..."
                      value={config.message || ""}
                      onChange={(e) => setConfig({ ...config, message: e.target.value })}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">Keep replies short and engaging</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Insert Variables</Label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_VARIABLES.map((variable) => (
                        <Button
                          key={variable.value}
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => insertVariable(variable.value, "message")}
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          {variable.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hide Comment */}
            {action.type === "hide_comment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Comment Moderation</CardTitle>
                  <CardDescription>Control comment visibility</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Hide Comment</Label>
                      <p className="text-sm text-muted-foreground">Hide offensive or spam comments automatically</p>
                    </div>
                    <Switch
                      checked={config.shouldHide !== false}
                      onCheckedChange={(checked) => setConfig({ ...config, shouldHide: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Response */}
            {action.type === "ai_response" && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">AI Configuration</CardTitle>
                    <CardDescription>Customize AI response behavior</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tone">Response Tone *</Label>
                      <Select
                        value={config.tone || "professional"}
                        onValueChange={(value) => setConfig({ ...config, tone: value })}
                      >
                        <SelectTrigger id="tone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AI_TONES.map((tone) => (
                            <SelectItem key={tone.value} value={tone.value}>
                              {tone.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions">Custom Instructions</Label>
                      <Textarea
                        id="instructions"
                        data-field="aiInstructions"
                        placeholder="e.g., Keep responses under 50 words, be enthusiastic, include emojis..."
                        value={config.aiInstructions || ""}
                        onChange={(e) => setConfig({ ...config, aiInstructions: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Insert Variables</Label>
                      <div className="flex flex-wrap gap-2">
                        {AVAILABLE_VARIABLES.map((variable) => (
                          <Button
                            key={variable.value}
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => insertVariable(variable.value, "aiInstructions")}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            {variable.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Advanced Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label>Use Knowledge Base</Label>
                        <p className="text-sm text-muted-foreground">
                          Include your custom knowledge base in AI responses
                        </p>
                      </div>
                      <Switch
                        checked={config.aiKnowledgeBase || false}
                        onCheckedChange={(checked) => setConfig({ ...config, aiKnowledgeBase: checked })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxTokens">Max Response Length</Label>
                      <Input
                        id="maxTokens"
                        type="number"
                        placeholder="150"
                        value={config.maxTokens || 150}
                        onChange={(e) => setConfig({ ...config, maxTokens: Number.parseInt(e.target.value) || 150 })}
                      />
                      <p className="text-xs text-muted-foreground">Tokens (roughly 0.75 words per token)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Add Tag */}
            {action.type === "add_tag" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tag Selection</CardTitle>
                  <CardDescription>Choose a tag to apply to the conversation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label htmlFor="tag">Tag *</Label>
                  <Select value={config.tag || ""} onValueChange={(value) => setConfig({ ...config, tag: value })}>
                    <SelectTrigger id="tag">
                      <SelectValue placeholder="Select a tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {tags.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">No tags available</div>
                      ) : (
                        tags.map((tag) => (
                          <SelectItem key={tag.id} value={tag.id}>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
                              {tag.name}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {tags.length === 0 && (
                    <p className="text-xs text-muted-foreground">Create tags first in the Tags section</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Delay */}
            {action.type === "delay" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Delay Duration</CardTitle>
                  <CardDescription>Set how long to wait before the next action</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="days">Days</Label>
                      <Input
                        id="days"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={config.delayDays || ""}
                        onChange={(e) => setConfig({ ...config, delayDays: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hours">Hours</Label>
                      <Input
                        id="hours"
                        type="number"
                        min="0"
                        max="23"
                        placeholder="0"
                        value={config.delayHours || ""}
                        onChange={(e) => setConfig({ ...config, delayHours: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minutes">Minutes</Label>
                      <Input
                        id="minutes"
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        value={config.delayMinutes || ""}
                        onChange={(e) => setConfig({ ...config, delayMinutes: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Total delay:{" "}
                    {(config.delayDays || 0) * 24 * 60 + (config.delayHours || 0) * 60 + (config.delayMinutes || 0)}{" "}
                    minutes
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Conditional Branch */}
            {action.type === "condition" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Conditional Logic</CardTitle>
                  <CardDescription>Create IF/THEN/ELSE branches based on conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ConditionBuilder
                    conditionGroups={config.conditionGroups || []}
                    onChange={(groups) => setConfig({ ...config, conditionGroups: groups })}
                  />
                </CardContent>
              </Card>
            )}

            {/* Human Handoff */}
            {action.type === "human_handoff" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Human Handoff</CardTitle>
                  <CardDescription>Transfer conversation to live agent</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                      When this action is triggered, the conversation will be flagged for human review and removed from
                      automation. You can add a notification message to alert your team.
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="handoffMessage">Handoff Message (optional)</Label>
                    <Textarea
                      id="handoffMessage"
                      placeholder="A team member will be with you shortly..."
                      value={config.message || ""}
                      onChange={(e) => setConfig({ ...config, message: e.target.value })}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Webhook */}
            {action.type === "webhook" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Webhook Configuration</CardTitle>
                  <CardDescription>Send data to external services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL *</Label>
                    <Input
                      id="webhookUrl"
                      placeholder="https://api.example.com/webhook"
                      value={config.webhookUrl || ""}
                      onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="method">HTTP Method</Label>
                    <Select
                      value={config.webhookMethod || "POST"}
                      onValueChange={(value) => setConfig({ ...config, webhookMethod: value as "GET" | "POST" })}
                    >
                      <SelectTrigger id="method">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhookBody">Request Body (JSON)</Label>
                    <Textarea
                      id="webhookBody"
                      placeholder='{"event": "automation_triggered", "user": "{username}"}'
                      value={config.webhookBody || ""}
                      onChange={(e) => setConfig({ ...config, webhookBody: e.target.value })}
                      rows={6}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      You can use variables like {"{username}"}, {"{message}"}, etc.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        <SheetFooter className="sticky bottom-0 border-t bg-background px-6 py-4">
          <div className="flex w-full gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Action
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
