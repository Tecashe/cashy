// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { getPaymentHistory } from "@/lib/payment-actions"
// import { formatDate } from "@/lib/utils"

// interface Payment {
//   id: string
//   amount: number
//   currency: string
//   status: string
//   description: string
//   stripePaymentIntentId: string
//   createdAt: Date
// }

// const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
//   succeeded: { label: "Completed", variant: "default" },
//   pending: { label: "Pending", variant: "secondary" },
//   failed: { label: "Failed", variant: "destructive" },
//   canceled: { label: "Canceled", variant: "outline" },
// }

// export function PaymentHistory({ userId }: { userId: string }) {
//   const [payments, setPayments] = useState<Payment[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchHistory() {
//       const res = await getPaymentHistory(userId)
//       if (res.success) {
//         setPayments(res.data as Payment[])
//       }
//       setLoading(false)
//     }

//     fetchHistory()
//   }, [userId])

//   return (
//     <Card>
//       <CardHeader className="border-b border-border/50">
//         <CardTitle className="text-lg">Payment History</CardTitle>
//       </CardHeader>
//       <CardContent className="pt-6">
//         {loading ? (
//           <div className="space-y-4">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="h-16 animate-pulse rounded bg-muted"></div>
//             ))}
//           </div>
//         ) : payments.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-sm text-muted-foreground">No payment history yet</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-border/50">
//                   <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
//                   <th className="text-left py-3 px-4 font-medium text-muted-foreground">Description</th>
//                   <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount</th>
//                   <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
//                   <th className="text-center py-3 px-4 font-medium text-muted-foreground">Invoice</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {payments.map((payment) => {
//                   const config = statusConfig[payment.status] || { label: payment.status, variant: "outline" as const }
//                   return (
//                     <tr key={payment.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
//                       <td className="py-4 px-4">
//                         <span className="text-foreground">{formatDate(new Date(payment.createdAt))}</span>
//                       </td>
//                       <td className="py-4 px-4">
//                         <span className="text-foreground">{payment.description || "Subscription"}</span>
//                       </td>
//                       <td className="py-4 px-4 text-right">
//                         <span className="font-medium">
//                           ${(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
//                         </span>
//                       </td>
//                       <td className="py-4 px-4 text-center">
//                         <Badge variant={config.variant}>{config.label}</Badge>
//                       </td>
//                       <td className="py-4 px-4 text-center">
//                         <button className="text-primary hover:underline text-xs font-medium">Download</button>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getPaymentHistory } from "@/lib/payment-actions"
import { formatDate } from "@/lib/utils"

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  description: string
  stripePaymentIntentId: string
  createdAt: Date
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  succeeded: { label: "Completed", variant: "default" },
  pending: { label: "Pending", variant: "secondary" },
  failed: { label: "Failed", variant: "destructive" },
  canceled: { label: "Canceled", variant: "outline" },
}

export function PaymentHistory({ userId }: { userId: string }) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      const res = await getPaymentHistory(userId)
      if (res.success) {
        setPayments(res.data as Payment[])
      }
      setLoading(false)
    }

    fetchHistory()
  }, [userId])

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle className="text-base">Payment History</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted"></div>
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No payment history yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-0 font-medium text-muted-foreground text-xs">Date</th>
                  <th className="text-left py-2 px-0 font-medium text-muted-foreground text-xs">Description</th>
                  <th className="text-right py-2 px-0 font-medium text-muted-foreground text-xs">Amount</th>
                  <th className="text-center py-2 px-0 font-medium text-muted-foreground text-xs">Status</th>
                  <th className="text-right py-2 px-0 font-medium text-muted-foreground text-xs">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => {
                  const config = statusConfig[payment.status] || { label: payment.status, variant: "outline" as const }
                  return (
                    <tr key={payment.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-0">
                        <span className="text-foreground text-xs">{formatDate(new Date(payment.createdAt))}</span>
                      </td>
                      <td className="py-3 px-0">
                        <span className="text-foreground text-xs">{payment.description || "Subscription"}</span>
                      </td>
                      <td className="py-3 px-0 text-right">
                        <span className="font-medium text-xs">
                          ${(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-0 text-center">
                        <Badge variant={config.variant} className="text-xs">
                          {config.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-0 text-right">
                        <Button variant="link" size="sm" className="h-6 text-xs text-primary">
                          Download
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
