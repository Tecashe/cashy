"use client"

import { useState, useEffect, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, FileText, TrendingUp } from "lucide-react"
import { getMessageTemplates, createMessageTemplate, deleteMessageTemplate } from "@/actions/inbox-actions"
import { toast } from "sonner"

interface TemplatesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

export function TemplatesModal({ open, onOpenChange, userId }: TemplatesModalProps) {
  const [templates, setTemplates] = useState<any[]>([])
  const [isPending, startTransition] = useTransition()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
  })

  const loadTemplates = () => {
    startTransition(async () => {
      const result = await getMessageTemplates(userId)
      if (result.success) {
        setTemplates(result.templates || [])
      }
    })
  }

  useEffect(() => {
    if (open) {
      loadTemplates()
    }
  }, [open, userId])

  const handleCreate = () => {
    startTransition(async () => {
      // Extract variables from content (e.g., {{customerName}})
      const variableRegex = /\{\{(\w+)\}\}/g
      const variables = Array.from(formData.content.matchAll(variableRegex), (m) => m[1])

      const result = await createMessageTemplate(userId, formData.title, formData.content, formData.category, variables)

      if (result.success) {
        toast.success("Template created successfully")
        setFormData({ title: "", content: "", category: "general" })
        setShowCreateForm(false)
        loadTemplates()
      } else {
        toast.error(result.error || "Failed to create template")
      }
    })
  }

  const handleDelete = (templateId: string) => {
    startTransition(async () => {
      const result = await deleteMessageTemplate(templateId)
      if (result.success) {
        toast.success("Template deleted")
        loadTemplates()
      } else {
        toast.error("Failed to delete template")
      }
    })
  }

  const categories = [
    { value: "greeting", label: "Greeting" },
    { value: "followup", label: "Follow-up" },
    { value: "support", label: "Support" },
    { value: "sales", label: "Sales" },
    { value: "general", label: "General" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Message Templates
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!showCreateForm ? (
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {templates.length} template{templates.length !== 1 ? "s" : ""} saved
              </p>
              <Button onClick={() => setShowCreateForm(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </div>
          ) : (
            <Card className="p-4 border-primary/50 bg-primary/5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Create New Template</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Template Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Welcome Message"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Message Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Hi {{customerName}}, thanks for reaching out..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Use {"{{"}
                      <span className="font-mono">variableName</span>
                      {"}"} for dynamic content (e.g., {"{{"}
                      <span className="font-mono">customerName</span>
                      {"}"})
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={isPending || !formData.title || !formData.content}
                  className="w-full"
                >
                  Create Template
                </Button>
              </div>
            </Card>
          )}

          <Separator />

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {templates.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">No templates yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Create your first template to save time replying</p>
                </div>
              ) : (
                templates.map((template) => (
                  <Card key={template.id} className="p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">{template.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {categories.find((c) => c.value === template.category)?.label || template.category}
                          </Badge>
                          {template.usageCount > 0 && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {template.usageCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{template.content}</p>
                        {template.variables.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {template.variables.map((variable: string) => (
                              <Badge key={variable} variant="outline" className="text-xs font-mono">
                                {"{{"}
                                {variable}
                                {"}}"}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(template.id)}
                        disabled={isPending}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
