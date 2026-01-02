// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { getPaymentMethods, setDefaultPaymentMethod, deletePaymentMethod } from "@/lib/payment-actions"

// interface PaymentMethod {
//   id: string
//   type: string
//   brand: string
//   last4: string
//   expiryMonth: number
//   expiryYear: number
//   isDefault: boolean
//   createdAt: Date
// }

// export function PaymentMethods({ userId }: { userId: string }) {
//   const [methods, setMethods] = useState<PaymentMethod[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchMethods() {
//       const res = await getPaymentMethods(userId)
//       if (res.success) {
//         setMethods(res.data as PaymentMethod[])
//       }
//       setLoading(false)
//     }

//     fetchMethods()
//   }, [userId])

//   const handleSetDefault = async (paymentMethodId: string) => {
//     const res = await setDefaultPaymentMethod(userId, paymentMethodId)
//     if (res.success) {
//       setMethods((prev) =>
//         prev.map((method) => ({
//           ...method,
//           isDefault: method.id === paymentMethodId,
//         })),
//       )
//     }
//   }

//   const handleDelete = async (paymentMethodId: string) => {
//     const res = await deletePaymentMethod(userId, paymentMethodId)
//     if (res.success) {
//       setMethods((prev) => prev.filter((m) => m.id !== paymentMethodId))
//     }
//   }

//   return (
//     <Card>
//       <CardHeader className="border-b border-border/50">
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-lg">Payment Methods</CardTitle>
//           <Button variant="outline" size="sm">
//             Add Card
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent className="pt-6">
//         {loading ? (
//           <div className="space-y-4">
//             {[1, 2].map((i) => (
//               <div key={i} className="h-20 animate-pulse rounded-lg bg-muted"></div>
//             ))}
//           </div>
//         ) : methods.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-sm text-muted-foreground">No payment methods added yet</p>
//             <Button variant="outline" size="sm" className="mt-4 bg-transparent">
//               Add Payment Method
//             </Button>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {methods.map((method) => (
//               <div
//                 key={method.id}
//                 className="flex items-center justify-between rounded-lg border border-border/50 p-4 hover:bg-muted/30 transition-colors"
//               >
//                 <div className="flex items-center gap-4 flex-1">
//                   <div className="flex h-10 w-16 items-center justify-center rounded bg-muted">
//                     <span className="text-xs font-semibold uppercase text-muted-foreground">{method.brand}</span>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium">
//                       {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• {method.last4}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       Expires {method.expiryMonth}/{method.expiryYear}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   {method.isDefault && (
//                     <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
//                       Default
//                     </span>
//                   )}

//                   {!method.isDefault && (
//                     <Button variant="ghost" size="sm" onClick={() => handleSetDefault(method.id)} className="text-xs">
//                       Set as Default
//                     </Button>
//                   )}

//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleDelete(method.id)}
//                     className="text-destructive hover:text-destructive hover:bg-destructive/10"
//                   >
//                     Remove
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPaymentMethods, setDefaultPaymentMethod, deletePaymentMethod } from "@/lib/payment-actions"
import { useToast } from "@/hooks/use-toast"

interface PaymentMethod {
  id: string
  type: string
  brand: string
  last4: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
  createdAt: Date
}

export function PaymentMethods({ userId }: { userId: string }) {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchMethods() {
      const res = await getPaymentMethods(userId)
      if (res.success) {
        setMethods(res.data as PaymentMethod[])
      }
      setLoading(false)
    }

    fetchMethods()
  }, [userId])

  const handleSetDefault = async (paymentMethodId: string) => {
    const res = await setDefaultPaymentMethod(userId, paymentMethodId)
    if (res.success) {
      setMethods((prev) =>
        prev.map((method) => ({
          ...method,
          isDefault: method.id === paymentMethodId,
        })),
      )
      toast({
        title: "Success",
        description: "Default payment method updated",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to update payment method",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (paymentMethodId: string) => {
    const res = await deletePaymentMethod(userId, paymentMethodId)
    if (res.success) {
      setMethods((prev) => prev.filter((m) => m.id !== paymentMethodId))
      toast({
        title: "Success",
        description: "Payment method removed",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to remove payment method",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Payment Methods</CardTitle>
          <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
            Add Card
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-muted"></div>
            ))}
          </div>
        ) : methods.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground mb-4">No payment methods added yet</p>
            <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
              Add Payment Method
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {methods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex h-9 w-14 items-center justify-center rounded bg-muted">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">{method.brand}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• {method.last4}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expires {method.expiryMonth.toString().padStart(2, "0")}/{method.expiryYear}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {method.isDefault ? (
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                      className="h-8 text-xs"
                    >
                      Set Default
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(method.id)}
                    className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
