"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BarChart, TrendingUp, MessageSquare, Clock, Users } from "lucide-react"
import { getInboxAnalytics } from "@/actions/inbox-actions"
import { toast } from "sonner"
import { hasFeatureAccess } from "@/lib/subscription"
import { UpgradePrompt } from "./upgrade-prompt"

interface AnalyticsModalProps {
  open: boolean
  onClose: () => void
  userId: string
  subscriptionTier: string
}

export function AnalyticsModal({ open, onClose, userId, subscriptionTier }: AnalyticsModalProps) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showUpgrade, setShowUpgrade] = useState(false)

  const hasAccess = hasFeatureAccess(subscriptionTier as any, "analytics")

  useEffect(() => {
    if (open && hasAccess) {
      loadAnalytics()
    }
  }, [open, hasAccess])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const result = await getInboxAnalytics(userId, {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
      })

      if (result.success && result.analytics) {
        setAnalytics(result.analytics)
      } else {
        toast.error("Failed to load analytics")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!hasAccess) {
    return (
      <UpgradePrompt
        open={open}
        onClose={onClose}
        feature="Advanced Analytics"
        description="detailed performance insights and metrics"
      />
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Inbox Analytics
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading analytics...</div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">Total Conversations</span>
                </div>
                <p className="text-2xl font-bold">{analytics.totalConversations}</p>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs">Unresolved</span>
                </div>
                <p className="text-2xl font-bold">{analytics.unresolvedCount}</p>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Avg Response Time</span>
                </div>
                <p className="text-2xl font-bold">{analytics.avgResponseTime}m</p>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs">Categories</span>
                </div>
                <p className="text-2xl font-bold">{Object.keys(analytics.conversationsByCategory).length}</p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-medium mb-4">Conversations by Category</h3>
              <div className="space-y-3">
                {Object.entries(analytics.conversationsByCategory).map(([category, count]: [string, any]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{category}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${(count / analytics.totalConversations) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages by Hour */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-medium mb-4">Messages by Hour</h3>
              <div className="flex items-end justify-between gap-1 h-32">
                {analytics.messagesByHour.map((count: number, hour: number) => (
                  <div key={hour} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-primary/20 hover:bg-primary/30 rounded-t transition-colors"
                      style={{
                        height: `${(count / Math.max(...analytics.messagesByHour)) * 100}%`,
                        minHeight: count > 0 ? "4px" : "0",
                      }}
                    />
                    {hour % 3 === 0 && <span className="text-[10px] text-muted-foreground">{hour}h</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">No analytics data available</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
