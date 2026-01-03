// import type { ReactNode } from "react"
// import { Sidebar } from "@/components/sidebar"
// import { Header } from "@/components/header"

// export default function DashboardLayout({ children }: { children: ReactNode }) {
//   return (
//     <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
//       <Sidebar />
//       <div className="flex flex-1 flex-col overflow-hidden">
//         <Header />
//         <main className="flex-1 overflow-y-auto p-6">{children}</main>
//       </div>
//     </div>
//   )
// }

// import type { ReactNode } from "react"
// import { Sidebar } from "@/components/sidebar"
// import { Header } from "@/components/header"

// export default function DashboardLayout({ children }: { children: ReactNode }) {
//   return (
//     <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
//       <Sidebar />
//       <div className="flex flex-1 flex-col overflow-hidden">
//         <Header />
//         <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
//       </div>
//     </div>
//   )
// }





// // app/(dashboard)/layout.tsx
// import type { ReactNode } from "react"
// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { Sidebar } from "@/components/sidebar"
// import { Header } from "@/components/header"
// import { ensureUserExists } from "@/lib/actions/user-sync"

// export default async function DashboardLayout({ children }: { children: ReactNode }) {
//   // Get authenticated user from Clerk
//   const { userId } = await auth()
  
//   // Redirect to sign-in if not authenticated
//   if (!userId) {
//     redirect("/sign-in")
//   }

//   // Ensure user exists in database (sync from Clerk if needed)
//   await ensureUserExists(userId)

//   return (
//     <div className="flex h-screen overflow-hidden">
//       <Sidebar />
//       <div className="flex flex-1 flex-col overflow-hidden">
//         <Header />
//         <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
//       </div>
//     </div>
//   )
// }


// app/(dashboard)/layout.tsx
import type { ReactNode } from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ensureUserExists } from "@/lib/actions/user-sync"
import { NotificationPopup } from "@/components/notifications/notification-popup"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Get authenticated user from Clerk
  const { userId } = await auth()
  
  // Redirect to sign-in if not authenticated
  if (!userId) {
    redirect("/sign-in")
  }

  // Ensure user exists in database (sync from Clerk if needed)
  const user = await ensureUserExists(userId)

  // Check if user has completed onboarding
  if (user) {
    const isOnboarded = !!(user.businessName && user.businessType)
    
    if (!isOnboarded) {
      redirect("/onboarding")
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}