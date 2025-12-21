
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { TRIGGER_TYPES, ACTION_TYPES } from "@/lib/constants/utomation-constants"
import type { AutomationFlow } from "@/lib/types/automation"
import { ArrowRight, CheckCircle2, Play, Zap, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { InstagramMockPreview } from "../automation-mock-preview"
import { useState, useEffect } from "react"
import { getInstagramPostsByIds } from "@/lib/actions/instagram-media-actions"

interface ReviewStepProps {
  flow: AutomationFlow
  setFlow: (flow: AutomationFlow) => void
  accounts: any[]
}

export function ReviewStep({ flow, setFlow, accounts }: ReviewStepProps) {
  const [selectedPosts, setSelectedPosts] = useState<any[]>([])

  useEffect(() => {
    const fetchSelectedPosts = async () => {
      const commentTrigger = flow.triggers.find((t) => t.type === "comment")
      if (commentTrigger?.config?.postIds && commentTrigger.config.postIds.length > 0 && accounts[0]) {
        const posts = await getInstagramPostsByIds(accounts[0].id, commentTrigger.config.postIds)
        setSelectedPosts(posts)
      }
    }
    fetchSelectedPosts()
  }, [flow.triggers, accounts])

  const getAutomationStory = () => {
    const trigger = flow.triggers[0]
    const firstAction = flow.actions[0]

    if (!trigger || !firstAction) return null

    const triggerInfo = TRIGGER_TYPES[trigger.type]
    const actionInfo = ACTION_TYPES[firstAction.type]

    let triggerDescription = ""
    let actionDescription = ""

    // Build trigger description
    if (trigger.type === "comment") {
      if (trigger.config?.postIds && trigger.config.postIds.length > 0) {
        triggerDescription = `someone comments on any of these ${trigger.config.postIds.length} specific posts`
      } else {
        triggerDescription = "someone comments on any of your posts"
      }
    } else if (trigger.type === "keyword") {
      const keywords = trigger.config?.keywords || []
      triggerDescription = `someone sends a message containing ${keywords.length > 1 ? "these keywords" : "this keyword"}: ${keywords.join(", ")}`
    } else if (trigger.type === "new_message") {
      triggerDescription = "someone sends you a direct message"
    } else if (trigger.type === "story_reply") {
      triggerDescription = "someone replies to your Instagram story"
    } else {
      triggerDescription = triggerInfo.description.toLowerCase()
    }

    // Build action description
    if (firstAction.type === "send_message") {
      actionDescription = `they will be sent this message: "${firstAction.config.message}"`
    } else if (firstAction.type === "reply_to_comment") {
      actionDescription = `their comment will be replied to with: "${firstAction.config.message}"`
    } else if (firstAction.type === "ai_response") {
      actionDescription = "they will receive an AI-generated response"
    } else {
      actionDescription = `the "${actionInfo.label}" action will be performed`
    }

    return { triggerDescription, actionDescription }
  }

  const story = getAutomationStory()

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background shadow-xl">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle className="text-2xl font-bold">How Your Automation Works</CardTitle>
                </div>
                {story && (
                  <div className="space-y-2 text-base leading-relaxed">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">When</span> {story.triggerDescription},
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Then</span> {story.actionDescription}
                    </p>
                  </div>
                )}
                {flow.description && <CardDescription className="text-base pt-2">{flow.description}</CardDescription>}
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4 ring-1 ring-border/50">
                <Switch
                  checked={flow.isActive}
                  onCheckedChange={(checked) => setFlow({ ...flow, isActive: checked })}
                  className="data-[state=checked]:bg-primary"
                />
                <Label className="cursor-pointer font-semibold">{flow.isActive ? "Active" : "Inactive"}</Label>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Left: Automation Flow */}
        <div className="space-y-6">
          {/* Triggers */}
          <Card className="overflow-hidden border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 bg-muted/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 shadow-inner ring-1 ring-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Triggers</CardTitle>
                  <CardDescription className="text-sm">
                    {flow.triggers.length} trigger{flow.triggers.length !== 1 ? "s" : ""}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {flow.triggers.map((trigger, index) => {
                const triggerInfo = TRIGGER_TYPES[trigger.type]
                const TriggerIcon = triggerInfo.icon

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-4 rounded-xl border border-border/50 bg-gradient-to-r from-muted/50 to-muted/30 p-4 shadow-sm"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner">
                      <TriggerIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold leading-tight">{triggerInfo.label}</p>
                      {trigger.config?.keywords && trigger.config.keywords.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {trigger.config.keywords.map((kw: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}

              {selectedPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 space-y-3"
                >
                  <p className="text-sm font-medium text-muted-foreground">Selected Posts:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedPosts.slice(0, 3).map((post) => (
                      <div key={post.id} className="aspect-square rounded-lg overflow-hidden border border-border/50">
                        <img
                          src={post.media_url || "/placeholder.svg"}
                          alt="Selected post"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {selectedPosts.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{selectedPosts.length - 3} more posts</p>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* Actions */}
          <Card className="overflow-hidden border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 bg-muted/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 shadow-inner">
                  <Play className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Actions</CardTitle>
                  <CardDescription className="text-sm">
                    {flow.actions.length} action{flow.actions.length !== 1 ? "s" : ""}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <div className="relative space-y-3">
                <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />

                {flow.actions.map((action, index) => {
                  const actionInfo = ACTION_TYPES[action.type]
                  const ActionIcon = actionInfo.icon

                  return (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 + 0.1 }}
                      className="relative flex items-center gap-4 rounded-xl border border-border/50 bg-gradient-to-r from-card to-card/80 p-4 shadow-sm"
                    >
                      <div className="absolute -left-1 flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-bold text-primary-foreground shadow-lg ring-4 ring-background">
                          {index + 1}
                        </div>
                      </div>

                      <div className="ml-6 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner">
                        <ActionIcon className="h-5 w-5 text-primary" />
                      </div>

                      <div className="flex-1 space-y-1.5 min-w-0">
                        <p className="font-semibold leading-tight">{actionInfo.label}</p>
                        {action.config.message && (
                          <p className="line-clamp-2 text-sm italic text-muted-foreground rounded bg-muted/50 px-2 py-1">
                            "{action.config.message}"
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold">Live Preview</h3>
            </div>

            <InstagramMockPreview
              type={flow.triggers[0]?.type === "comment" ? "post" : "dm"}
              accountName={accounts[0]?.instagram_username || "your_account"}
              accountAvatar={accounts[0]?.profile_picture_url}
              commentText={
                flow.triggers[0]?.type === "keyword"
                  ? flow.triggers[0]?.config?.keywords?.[0] || "Hello"
                  : "This looks amazing! 🔥"
              }
              replyText={flow.actions[0]?.config?.message}
              dmMessage={flow.actions[0]?.config?.message}
              selectedPosts={selectedPosts}
            />
          </div>
        </div>
      </motion.div>

      {flow.isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-5 ring-1 ring-primary/20"
        >
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <p className="font-semibold text-primary">This automation is ready to go live!</p>
        </motion.div>
      )}
    </div>
  )
}
