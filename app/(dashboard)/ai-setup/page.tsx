import { Suspense } from "react"
import { AISetupWizard } from "@/components/ai-setup/ai-setup-wizard"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AISetupPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AI Assistant Setup</h1>
        <p className="text-muted-foreground text-lg">
          Configure your AI-powered Instagram automation in a few simple steps
        </p>
      </div>

      <Suspense fallback={<SetupSkeleton />}>
        <AISetupWizard />
      </Suspense>
    </div>
  )
}

function SetupSkeleton() {
  return (
    <Card className="p-8">
      <Skeleton className="h-12 w-3/4 mb-4" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-6 w-5/6 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </Card>
  )
}
