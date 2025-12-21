"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Sparkles } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { TriggerConfig as TriggerConfigType } from "@/lib/automation-types"
import { getInstagramMedia } from "@/lib/actions/instagram-media-actions"
import { InstagramPostSelector } from "./instagram-post-selector"
import { motion, AnimatePresence } from "framer-motion"

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
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([])

  useEffect(() => {
    if (trigger.type === "comment" && open && config.postId !== "all") {
      setIsLoadingPosts(true)
      const account = accounts[0]
      if (account) {
        getInstagramMedia(account.id, { limit: 20 })
          .then((media) => {
            setPosts(media)
          })
          .finally(() => {
            setIsLoadingPosts(false)
          })
      }
    }
  }, [trigger.type, open, accounts, config.postId])

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">Configure Trigger</DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                Set up the specific conditions for this trigger
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-6 max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Keyword Trigger Configuration */}
            {trigger.type === "keyword" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Keywords</Label>
                  <InputGroup>
                    <InputGroupInput
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
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton onClick={handleAddKeyword} size="sm">
                        <Plus className="h-4 w-4" />
                        Add
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>

                  <AnimatePresence mode="popLayout">
                    {config.keywords && config.keywords.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2"
                      >
                        {config.keywords.map((keyword: string, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Badge
                              variant="secondary"
                              className="gap-2 px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 transition-colors"
                            >
                              {keyword}
                              <button
                                type="button"
                                onClick={() => handleRemoveKeyword(index)}
                                className="hover:text-destructive transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
                  <Label className="text-base font-semibold">Match Type</Label>
                  <RadioGroup
                    value={config.matchType || "any"}
                    onValueChange={(value) => setConfig({ ...config, matchType: value as "any" | "all" | "exact" })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                      <RadioGroupItem value="any" id="any" />
                      <Label htmlFor="any" className="flex-1 cursor-pointer font-normal">
                        <span className="font-medium">Contains any keyword</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Triggers when at least one keyword is found
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all" className="flex-1 cursor-pointer font-normal">
                        <span className="font-medium">Contains all keywords</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Triggers only when all keywords are found
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                      <RadioGroupItem value="exact" id="exact" />
                      <Label htmlFor="exact" className="flex-1 cursor-pointer font-normal">
                        <span className="font-medium">Exact match</span>
                        <p className="text-xs text-muted-foreground mt-0.5">Triggers only for exact phrase match</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </motion.div>
            )}

            {/* Comment Trigger Configuration */}
            {trigger.type === "comment" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
                  <Label className="text-base font-semibold">Apply to posts</Label>
                  <RadioGroup
                    value={config.postId || "all"}
                    onValueChange={(value) => setConfig({ ...config, postId: value === "all" ? undefined : value })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                      <RadioGroupItem value="all" id="all-posts" />
                      <Label htmlFor="all-posts" className="flex-1 cursor-pointer font-normal">
                        <span className="font-medium">All posts</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Apply automation to all current and future posts
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                      <RadioGroupItem value="specific" id="specific-post" />
                      <Label htmlFor="specific-post" className="flex-1 cursor-pointer font-normal">
                        <span className="font-medium">Specific posts</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Choose which posts this automation applies to
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <AnimatePresence>
                  {config.postId !== "all" && config.postId !== undefined && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      {isLoadingPosts ? (
                        <div className="flex h-48 items-center justify-center rounded-lg border border-border/50 bg-muted/20">
                          <div className="text-center">
                            <Spinner className="mx-auto h-8 w-8 text-primary" />
                            <p className="mt-3 text-sm text-muted-foreground">Loading your posts...</p>
                          </div>
                        </div>
                      ) : (
                        <InstagramPostSelector
                          posts={posts}
                          selectedPostIds={selectedPostIds}
                          onSelectionChange={setSelectedPostIds}
                          multiSelect={true}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="border-t border-border/50 px-6 py-4">
          <div className="flex w-full gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 shadow-sm">
              Save Configuration
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
