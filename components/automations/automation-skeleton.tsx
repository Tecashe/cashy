"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

export const AutomationSkeleton = ({ index = 0 }: { index?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-card/90 to-card/70 border border-border/50 relative overflow-hidden">
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="p-6 relative space-y-5">
          {/* Header with title and menu button */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-muted/50 rounded-lg w-56 animate-pulse" />
              <div className="h-4 bg-muted/50 rounded w-80 animate-pulse" />
            </div>
            <div className="h-8 w-8 bg-muted/50 rounded-lg animate-pulse" />
          </div>

          {/* Instagram Account Section */}
          <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3 ring-1 ring-border/50">
            <div className="h-10 w-10 rounded-full bg-muted/50 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted/50 rounded w-32 animate-pulse" />
              <div className="h-3 bg-muted/50 rounded w-24 animate-pulse" />
            </div>
          </div>

          {/* Trigger/Actions Summary Button */}
          <div className="rounded-lg bg-muted/30 p-3 ring-1 ring-border/50 space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted/50 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted/50 rounded w-40 animate-pulse" />
                <div className="h-3 bg-muted/50 rounded w-32 animate-pulse" />
              </div>
              <div className="h-6 bg-muted/50 rounded-full w-20 animate-pulse" />
            </div>
          </div>

          {/* Execution Statistics Grid */}
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <motion.div key={i} className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-2">
                <div className="h-3 bg-muted/50 rounded w-16 animate-pulse" />
                <div className="h-6 bg-muted/50 rounded w-12 animate-pulse" />
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="space-y-2 rounded-lg border border-border/50 bg-muted/20 p-3">
            <div className="h-4 bg-muted/50 rounded w-48 animate-pulse" />
            <div className="h-4 bg-muted/50 rounded w-56 animate-pulse" />
            <div className="h-4 bg-muted/50 rounded w-40 animate-pulse" />
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-10 bg-muted/50 rounded-full animate-pulse" />
              <div className="h-4 bg-muted/50 rounded w-20 animate-pulse" />
            </div>
            <div className="h-6 bg-muted/50 rounded-full w-20 animate-pulse" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export const AutomationListSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
        {/* Header Skeleton */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="h-10 bg-muted/50 rounded-lg w-64 animate-pulse" />
              <div className="h-5 bg-muted/50 rounded w-96 animate-pulse" />
            </div>
            <div className="h-11 bg-muted/50 rounded-lg w-48 animate-pulse" />
          </div>
        </motion.div>

        {/* Grid Skeleton */}
        <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-2">
          {[0, 1, 2, 3].map((index) => (
            <AutomationSkeleton key={index} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
