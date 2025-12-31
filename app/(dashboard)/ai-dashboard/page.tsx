import { Suspense } from "react"
import { AIDashboard } from "@/components/ai-dashboard/ai-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default function AIDashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Suspense fallback={<Skeleton className="h-96" />}>
        <AIDashboard />
      </Suspense>
    </div>
  )
}
