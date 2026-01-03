// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { BillingOverview } from "@/components/billing/billing-overview"
// import { PaymentMethods } from "@/components/billing/payment-methods"
// import { PaymentHistory } from "@/components/billing/payment-history"

// export const metadata = {
//   title: "Billing & Payments",
//   description: "Manage your subscription, payment methods, and billing history",
// }

// export default async function BillingPage() {
//   const { userId } = await auth()

//   if (!userId) {
//     redirect("/signin")
//   }

//   return (
//     <main className="min-h-screen bg-background">
//       <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
//         <div className="mb-12">
//           <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Payments</h1>
//           <p className="mt-2 text-sm text-muted-foreground">
//             Manage your subscription, payment methods, and view your billing history
//           </p>
//         </div>

//         <div className="space-y-8">
//           {/* Overview Stats */}
//           <section>
//             <BillingOverview userId={userId} />
//           </section>

//           {/* Payment Methods and History */}
//           <section className="grid gap-8 lg:grid-cols-3">
//             <div className="lg:col-span-1">
//               <PaymentMethods userId={userId} />
//             </div>
//             <div className="lg:col-span-2">
//               <PaymentHistory userId={userId} />
//             </div>
//           </section>
//         </div>
//       </div>
//     </main>
//   )
// }

// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { BillingOverview } from "@/components/billing/billing-overview"
// import { PaymentMethods } from "@/components/billing/payment-methods"
// import { PaymentHistory } from "@/components/billing/payment-history"

// export const metadata = {
//   title: "Billing & Payments",
//   description: "Manage your subscription, payment methods, and billing history",
// }

// export default async function BillingPage() {
//   const { userId } = await auth()

//   if (!userId) {
//     redirect("/signin")
//   }

//   return (
//     <main className="min-h-screen bg-background">
//       <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Payments</h1>
//           <p className="mt-1 text-sm text-muted-foreground">Manage your subscription and payment methods</p>
//         </div>

//         {/* Overview Stats */}
//         <section className="mb-8">
//           <BillingOverview userId={userId} />
//         </section>

//         {/* Payment Methods and History Grid */}
//         <section className="grid gap-6 lg:grid-cols-3">
//           <div className="lg:col-span-1">
//             <PaymentMethods userId={userId} />
//           </div>
//           <div className="lg:col-span-2">
//             <PaymentHistory userId={userId} />
//           </div>
//         </section>
//       </div>
//     </main>
//   )
// }

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { BillingOverview } from "@/components/billing/billing-overview"
import { PaymentMethods } from "@/components/billing/payment-methods"
import { PaymentHistory } from "@/components/billing/payment-history"
import { SubscriptionTiers } from "@/components/billing/subscription-tiers"
import { Separator } from "@/components/ui/separator"
import { getCurrentSubscriptionTier } from "@/lib/subscription-actions"

export const metadata = {
  title: "Billing & Payments",
  description: "Manage your subscription, payment methods, and billing history",
}

export default async function BillingPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/signin")
  }

  const currentTier = await getCurrentSubscriptionTier()

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Payments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your subscription, payment methods, and billing history
          </p>
        </div>

        {/* Overview Stats */}
        <section className="mb-8">
          <BillingOverview userId={userId} />
        </section>

        <Separator className="my-8" />

        {/* Subscription Tiers */}
        <section className="mb-8">
          <SubscriptionTiers currentTier={currentTier as "free" | "pro" | "enterprise"} userId={userId} />
        </section>

        <Separator className="my-8" />

        {/* Payment Methods and History Grid */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <PaymentMethods userId={userId} />
          </div>
          <div className="lg:col-span-2">
            <PaymentHistory userId={userId} />
          </div>
        </section>
      </div>
    </main>
  )
}
