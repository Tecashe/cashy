"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, ArrowRight } from "lucide-react"
import Link from "next/link"

interface UpsellCardProps {
  featureName: string
  description: string
  requiredTier: "pro" | "business" | "enterprise"
  currentTier?: "freemium" | "pro" | "business" | "enterprise"
}

export function UpsellCard({ featureName, description, requiredTier, currentTier }: UpsellCardProps) {
  const tierDisplay = requiredTier === "pro" ? "Pro" : requiredTier === "business" ? "Business" : "Enterprise"

  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lock className="h-5 w-5 text-amber-600" />
          {featureName}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">This feature is available on our {tierDisplay} plan</p>
          <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/50">
            {tierDisplay} Plan
          </Badge>
        </div>
        <Link href="/pricing">
          <Button className="w-full gap-2">
            Upgrade to {tierDisplay}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
