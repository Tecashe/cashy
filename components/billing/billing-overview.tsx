// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { getSubscriptionDetails, getBillingStats } from "@/lib/payment-actions"
// import { formatDate } from "@/lib/utils"

// interface BillingData {
//   tier: string
//   status: string
//   currentPeriodEnd: Date | null
//   totalSpent: number
//   paymentCount: number
// }

// export function BillingOverview({ userId }: { userId: string }) {
//   const [data, setData] = useState<BillingData | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchData() {
//       const [subRes, statsRes] = await Promise.all([getSubscriptionDetails(userId), getBillingStats(userId)])

//       if (subRes.success && statsRes.success && subRes.data && statsRes.data) {
//         setData({
//           tier: subRes.data.user.subscriptionTier,
//           status: subRes.data.subscription?.status || "active",
//           currentPeriodEnd: subRes.data.subscription?.currentPeriodEnd
//             ? new Date(subRes.data.subscription.currentPeriodEnd)
//             : null,
//           totalSpent: statsRes.data.totalSpent / 100,
//           paymentCount: statsRes.data.paymentCount,
//         })
//       }
//       setLoading(false)
//     }

//     fetchData()
//   }, [userId])

//   if (loading) {
//     return (
//       <div className="grid gap-6 md:grid-cols-4">
//         {[1, 2, 3, 4].map((i) => (
//           <Card key={i}>
//             <CardHeader>
//               <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
//             </CardHeader>
//             <CardContent>
//               <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     )
//   }

//   if (!data) return null

//   const stats = [
//     {
//       label: "Current Plan",
//       value: data.tier.charAt(0).toUpperCase() + data.tier.slice(1),
//       subtext: data.status === "active" ? "Active" : "Inactive",
//     },
//     {
//       label: "Next Billing Date",
//       value: data.currentPeriodEnd ? formatDate(data.currentPeriodEnd) : "N/A",
//       subtext: "Renews automatically",
//     },
//     {
//       label: "Total Spent",
//       value: `$${data.totalSpent.toFixed(2)}`,
//       subtext: `${data.paymentCount} payments`,
//     },
//     {
//       label: "Status",
//       value: data.status === "active" ? "Active" : "Inactive",
//       subtext: data.status === "active" ? "Subscription active" : "Subscription inactive",
//     },
//   ]

//   return (
//     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//       {stats.map((stat, i) => (
//         <Card key={i} className="border-border/50">
//           <CardHeader className="pb-3">
//             <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-1">
//               <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
//               <p className="text-xs text-muted-foreground">{stat.subtext}</p>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )
// }


// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { getSubscriptionDetails, getBillingStats } from "@/lib/payment-actions"
// import { formatDate } from "@/lib/utils"

// interface BillingData {
//   tier: string
//   status: string
//   currentPeriodEnd: Date | null
//   totalSpent: number
//   paymentCount: number
// }

// export function BillingOverview({ userId }: { userId: string }) {
//   const [data, setData] = useState<BillingData | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchData() {
//       const [subRes, statsRes] = await Promise.all([getSubscriptionDetails(userId), getBillingStats(userId)])

//       if (subRes.success && statsRes.success && subRes.data && statsRes.data) {
//         setData({
//           tier: subRes.data.user.subscriptionTier,
//           status: subRes.data.subscription?.status || "active",
//           currentPeriodEnd: subRes.data.subscription?.currentPeriodEnd
//             ? new Date(subRes.data.subscription.currentPeriodEnd)
//             : null,
//           totalSpent: statsRes.data.totalSpent / 100,
//           paymentCount: statsRes.data.paymentCount,
//         })
//       }
//       setLoading(false)
//     }

//     fetchData()
//   }, [userId])

//   if (loading) {
//     return (
//       <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
//         {[1, 2, 3, 4].map((i) => (
//           <Card key={i}>
//             <CardHeader className="pb-3">
//               <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
//             </CardHeader>
//             <CardContent>
//               <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     )
//   }

//   if (!data) return null

//   const stats = [
//     {
//       label: "Current Plan",
//       value: data.tier.charAt(0).toUpperCase() + data.tier.slice(1),
//       subtext: data.status === "active" ? "Active" : "Inactive",
//     },
//     {
//       label: "Next Billing",
//       value: data.currentPeriodEnd ? formatDate(data.currentPeriodEnd) : "N/A",
//       subtext: "Auto-renews",
//     },
//     {
//       label: "Total Spent",
//       value: `$${data.totalSpent.toFixed(2)}`,
//       subtext: `${data.paymentCount} payments`,
//     },
//     {
//       label: "Status",
//       value: data.status === "active" ? "Active" : "Inactive",
//       subtext: data.status === "active" ? "Subscription active" : "Paused",
//     },
//   ]

//   return (
//     <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
//       {stats.map((stat, i) => (
//         <Card key={i} className="border-border">
//           <CardHeader className="pb-3">
//             <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-1">
//               <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
//               <p className="text-xs text-muted-foreground">{stat.subtext}</p>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"

interface BillingData {
  tier: string
  status: string
  currentPeriodEnd: Date | null
  totalSpent: number
  paymentCount: number
}

export function BillingOverview({ userId }: { userId: string }) {
  const [data, setData] = useState<BillingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [subRes, statsRes] = await Promise.all([fetch("/api/subscriptions/current"), fetch("/api/billing/stats")])

        if (subRes.ok && statsRes.ok) {
          const sub = await subRes.json()
          const stats = await statsRes.json()

          setData({
            tier: sub.tier,
            status: sub.status,
            currentPeriodEnd: sub.subscription?.currentPeriodEnd ? new Date(sub.subscription.currentPeriodEnd) : null,
            totalSpent: stats.totalSpent / 100,
            paymentCount: stats.paymentCount,
          })
        }
      } catch (error) {
        console.error("Error fetching billing data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) return null

  const stats = [
    {
      label: "Current Plan",
      value: data.tier.charAt(0).toUpperCase() + data.tier.slice(1),
      subtext: data.status === "active" ? "Active" : "Inactive",
    },
    {
      label: "Next Billing",
      value: data.currentPeriodEnd ? formatDate(data.currentPeriodEnd) : "N/A",
      subtext: "Auto-renews",
    },
    {
      label: "Total Spent",
      value: `$${data.totalSpent.toFixed(2)}`,
      subtext: `${data.paymentCount} payments`,
    },
    {
      label: "Status",
      value: data.status === "active" ? "Active" : "Inactive",
      subtext: data.status === "active" ? "Subscription active" : "Paused",
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i} className="border-border">
          <CardHeader className="pb-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.subtext}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
