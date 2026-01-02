// "use client"

// import { useState, useEffect } from "react"
// import { loadStripe } from "@stripe/stripe-js"
// import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Spinner } from "@/components/ui/spinner"

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// interface PaymentModalProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   tier: "free"|"pro" | "enterprise"
//   onSuccess?: () => void
//   clientSecret: string | null
//   isLoading?: boolean
// }

// export function PaymentModal({
//   open,
//   onOpenChange,
//   tier,
//   onSuccess,
//   clientSecret,
//   isLoading = false,
// }: PaymentModalProps) {
//   const [options, setOptions] = useState({
//     clientSecret: clientSecret || "",
//   })

// //   const options = {
// //   clientSecret: clientSecret,
// //   onComplete: () => {
// //     // This callback is for EmbeddedCheckoutProvider, not EmbeddedCheckout
// //     onSuccess?.()
// //     onOpenChange(false)
// //   }
// // }

//   useEffect(() => {
//     if (clientSecret) {
//       setOptions({ clientSecret })
//     }
//   }, [clientSecret])

//   if (!clientSecret || isLoading) {
//     return (
//       <Dialog open={open} onOpenChange={onOpenChange}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Processing Payment</DialogTitle>
//             <DialogDescription>Preparing your upgrade to {tier} plan...</DialogDescription>
//           </DialogHeader>
//           <div className="flex justify-center py-8">
//             <Spinner />
//           </div>
//         </DialogContent>
//       </Dialog>
//     )
//   }
  
// return (
//   <Dialog open={open} onOpenChange={onOpenChange}>
//     <DialogContent className="max-w-md">
//       <DialogHeader>
//         <DialogTitle>Complete Your Payment</DialogTitle>
//         <DialogDescription>Upgrade to the {tier} plan</DialogDescription>
//       </DialogHeader>

//       <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
//         <EmbeddedCheckout />
//       </EmbeddedCheckoutProvider>
//     </DialogContent>
//   </Dialog>
// )
// }

"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tier: "free" | "pro" | "enterprise"
  onSuccess?: () => void
  clientSecret: string | null
  isLoading?: boolean
}

export function PaymentModal({
  open,
  onOpenChange,
  tier,
  onSuccess,
  clientSecret,
  isLoading = false,
}: PaymentModalProps) {
  const [options, setOptions] = useState({ clientSecret: clientSecret || "" })

  useEffect(() => {
    if (clientSecret) {
      setOptions({ clientSecret })
    }
  }, [clientSecret])

  if (!clientSecret || isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Processing Payment</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
          <p className="text-sm text-muted-foreground text-center">Preparing your upgrade to {tier} plan...</p>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Complete Your Payment</DialogTitle>
        </DialogHeader>

        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </DialogContent>
    </Dialog>
  )
}
