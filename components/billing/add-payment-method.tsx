// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Plus, Loader2 } from "lucide-react"
// import { toast } from "sonner"
// import { loadStripe } from "@stripe/stripe-js"
// import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js"

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// function AddPaymentMethodForm({ onSuccess }: { onSuccess: () => void }) {
//   const stripe = useStripe()
//   const elements = useElements()
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!stripe || !elements) {
//       return
//     }

//     try {
//       setLoading(true)

//       // Get setup intent
//       const setupRes = await fetch("/api/payment-methods/add", {
//         method: "POST",
//       })

//       if (!setupRes.ok) {
//         toast.error("Failed to prepare payment method form")
//         return
//       }

//       const { clientSecret } = await setupRes.json()

//       // Confirm setup
//       const cardElement = elements.getElement(CardElement)
//       if (!cardElement) {
//         toast.error("Card element not found")
//         return
//       }

//       const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
//         payment_method: {
//           card: cardElement,
//           type: "card",
//         },
//       })

//       if (error) {
//         toast.error(error.message || "Failed to add card")
//         return
//       }

//       if (setupIntent && setupIntent.status === "succeeded") {
//         toast.success("Payment method added successfully")
//         onSuccess()
//       }
//     } catch (error) {
//       console.error("Error:", error)
//       toast.error("Something went wrong")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <CardElement
//         options={{
//           style: {
//             base: {
//               fontSize: "16px",
//               color: "oklch(0.145 0 0)",
//               "::placeholder": {
//                 color: "oklch(0.556 0 0)",
//               },
//             },
//             invalid: {
//               color: "oklch(0.577 0.245 27.325)",
//             },
//           },
//         }}
//       />
//       <Button type="submit" disabled={loading} className="w-full">
//         {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
//         Add Card
//       </Button>
//     </form>
//   )
// }

// export function AddPaymentMethodDialog({ onSuccess }: { onSuccess: () => void }) {
//   const [open, setOpen] = useState(false)

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="w-full sm:w-auto bg-transparent" size="sm" variant="outline">
//           <Plus className="mr-2 h-4 w-4" />
//           Add Card
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-sm">
//         <DialogHeader>
//           <DialogTitle>Add Payment Method</DialogTitle>
//           <DialogDescription>Add a new card to your account securely.</DialogDescription>
//         </DialogHeader>
//         <Elements stripe={stripePromise}>
//           <AddPaymentMethodForm
//             onSuccess={() => {
//               setOpen(false)
//               onSuccess()
//             }}
//           />
//         </Elements>
//       </DialogContent>
//     </Dialog>
//   )
// }



"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function AddPaymentMethodForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    try {
      setLoading(true)

      // Get setup intent
      const setupRes = await fetch("/api/payment-methods/add", {
        method: "POST",
      })

      if (!setupRes.ok) {
        toast.error("Failed to prepare payment method form")
        return
      }

      const { clientSecret } = await setupRes.json()

      // Confirm setup
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        toast.error("Card element not found")
        return
      }

      const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (error) {
        toast.error(error.message || "Failed to add card")
        return
      }

      if (setupIntent && setupIntent.status === "succeeded") {
        toast.success("Payment method added successfully")
        onSuccess()
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "oklch(0.145 0 0)",
              "::placeholder": {
                color: "oklch(0.556 0 0)",
              },
            },
            invalid: {
              color: "oklch(0.577 0.245 27.325)",
            },
          },
        }}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
        Add Card
      </Button>
    </form>
  )
}

export function AddPaymentMethodDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-transparent" size="sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Card
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>Add a new card to your account securely.</DialogDescription>
        </DialogHeader>
        <Elements stripe={stripePromise}>
          <AddPaymentMethodForm
            onSuccess={() => {
              setOpen(false)
              onSuccess()
            }}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  )
}
