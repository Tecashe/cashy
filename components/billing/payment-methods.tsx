"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getPaymentMethods, setDefaultPaymentMethod, deletePaymentMethod } from "@/lib/payment-actions"

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
    }
  }

  const handleDelete = async (paymentMethodId: string) => {
    const res = await deletePaymentMethod(userId, paymentMethodId)
    if (res.success) {
      setMethods((prev) => prev.filter((m) => m.id !== paymentMethodId))
    }
  }

  return (
    <Card>
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Payment Methods</CardTitle>
          <Button variant="outline" size="sm">
            Add Card
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-muted"></div>
            ))}
          </div>
        ) : methods.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No payment methods added yet</p>
            <Button variant="outline" size="sm" className="mt-4 bg-transparent">
              Add Payment Method
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {methods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between rounded-lg border border-border/50 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex h-10 w-16 items-center justify-center rounded bg-muted">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">{method.brand}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• {method.last4}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {method.isDefault && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Default
                    </span>
                  )}

                  {!method.isDefault && (
                    <Button variant="ghost" size="sm" onClick={() => handleSetDefault(method.id)} className="text-xs">
                      Set as Default
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(method.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
