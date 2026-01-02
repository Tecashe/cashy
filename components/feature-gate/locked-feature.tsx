"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"

interface LockedFeatureProps {
  tier: "pro" | "enterprise"
  children?: React.ReactNode
}

export function LockedFeature({ tier, children }: LockedFeatureProps) {
  return (
    <Card className="relative border-2 border-dashed border-muted">
      <CardContent className="pt-6">
        <div className="flex items-center justify-center gap-3 py-8 text-center">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium text-muted-foreground">Feature Locked</p>
            <p className="text-sm text-muted-foreground">Available on {tier === "pro" ? "Pro" : "Enterprise"} plan</p>
          </div>
        </div>
      </CardContent>
      <div className="absolute top-2 right-2">
        <Badge variant="secondary" className="gap-1">
          <Lock className="h-3 w-3" />
          {tier === "pro" ? "Pro+" : "Enterprise"}
        </Badge>
      </div>
    </Card>
  )
}
