"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { TriggerConfig as TriggerConfigType } from "@/lib/automation-types"
import { getInstagramMedia } from "@/lib/actions/instagram-media-actions"
import { useEffect } from "react"

interface TriggerConfigProps {
  open: boolean
  onClose: () => void
  trigger: TriggerConfigType
  onSave: (trigger: TriggerConfigType) => void
  accounts: any[]
}

export function TriggerConfig({ open, onClose, trigger, onSave, accounts }: TriggerConfigProps) {
  const [config, setConfig] = useState(trigger.config)
  const [keywordInput, setKeywordInput] = useState("")
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    if (trigger.type === "comment" && open) {
      const account = accounts[0]
      if (account) {
        getInstagramMedia(account.id, { limit: 20 }).then((media) => {
          setPosts(media)
        })
      }
    }
  }, [trigger.type, open, accounts])

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      const keywords = config.keywords || []
      setConfig({
        ...config,
        keywords: [...keywords, keywordInput.trim()],
      })
      setKeywordInput("")
    }
  }

  const handleRemoveKeyword = (index: number) => {
    const keywords = config.keywords || []
    setConfig({
      ...config,
      keywords: keywords.filter((_, i) => i !== index),
    })
  }

  const handleSave = () => {
    onSave({ ...trigger, config })
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader className="mb-6">
          <SheetTitle>Configure Trigger</SheetTitle>
          <SheetDescription>Set up the specific conditions for this trigger</SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {trigger.type === "keyword" && (
            <>
              <div className="space-y-3">
                <Label>Keywords</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter keyword..."
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddKeyword()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddKeyword}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {config.keywords && config.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {config.keywords.map((keyword: string, index: number) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {keyword}
                        <button type="button" onClick={() => handleRemoveKeyword(index)} className="ml-1">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>Match Type</Label>
                <RadioGroup
                  value={config.matchType || "any"}
                  onValueChange={(value) => setConfig({ ...config, matchType: value as "any" | "all" | "exact" })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id="any" />
                    <Label htmlFor="any" className="font-normal">
                      Contains any keyword
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="font-normal">
                      Contains all keywords
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="exact" id="exact" />
                    <Label htmlFor="exact" className="font-normal">
                      Exact match
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          {trigger.type === "comment" && (
            <div className="space-y-3">
              <Label>Apply to posts</Label>
              <RadioGroup
                value={config.postId || "all"}
                onValueChange={(value) => setConfig({ ...config, postId: value === "all" ? undefined : value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-posts" />
                  <Label htmlFor="all-posts" className="font-normal">
                    All posts
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="specific" id="specific-post" />
                  <Label htmlFor="specific-post" className="font-normal">
                    Specific post
                  </Label>
                </div>
              </RadioGroup>

              {config.postId !== "all" && config.postId !== undefined && (
                <Select value={config.postId} onValueChange={(value) => setConfig({ ...config, postId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a post" />
                  </SelectTrigger>
                  <SelectContent>
                    {posts.map((post) => (
                      <SelectItem key={post.id} value={post.id}>
                        {post.caption?.substring(0, 50) || "Untitled post"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Configuration</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
