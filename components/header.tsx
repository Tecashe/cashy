// "use client"

// import { UserButton } from "@clerk/nextjs"
// import { Bell } from "lucide-react"
// import { Button } from "@/components/ui/button"

// export function Header() {
//   return (
//     <header className="flex h-16 items-center justify-between border-b bg-white/50 px-6 backdrop-blur-sm dark:bg-slate-900/50">
//       <div className="flex items-center gap-4">
//         <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>
//       </div>

//       <div className="flex items-center gap-4">
//         <Button variant="ghost" size="icon" className="relative">
//           <Bell className="h-5 w-5" />
//           <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-pink-600" />
//         </Button>

//         <UserButton afterSignOutUrl="/sign-in" />
//       </div>
//     </header>
//   )
// }



"use client"

import { UserButton } from "@clerk/nextjs"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { NotificationsSidebar } from "@/components/notifications/notifications-sidebar"
import useSWR from "swr"
import { useState } from "react"

export function Header() {
    const [notificationSheetOpen, setNotificationSheetOpen] = useState(false)
    const { data } = useSWR("/api/notifications/list", (url) => fetch(url).then((r) => r.json()))
    const unreadCount = data?.unreadCount || 0

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <MobileSidebar />
        <div className="hidden sm:block min-w-0">
          <Breadcrumbs />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Sheet open={notificationSheetOpen} onOpenChange={setNotificationSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <NotificationsSidebar />
          </SheetContent>
        </Sheet>

        <div className="ml-1">
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </header>
  )
}

// import { Breadcrumbs } from "@/components/breadcrumbs"
// import { ThemeToggle } from "@/components/theme-toggle"
// import { Button } from "@/components/ui/button"
// import { Bell } from "lucide-react"
// import { UserButton } from "@clerk/nextjs"

// export function Header() {
//   return (
//     <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-xl lg:px-6">
//       <div className="flex items-center gap-3 flex-1 min-w-0">
//         <div className="hidden sm:block min-w-0">
//           <Breadcrumbs />
//         </div>
//       </div>

//       <div className="flex items-center gap-2">
//         <ThemeToggle />
//         <Button
//           variant="ghost"
//           size="icon"
//           className="relative h-9 w-9 hover:bg-accent transition-all hover:shadow-md dark:hover:shadow-black/30 rounded-xl"
//         >
//           <Bell className="h-5 w-5" />
//           <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
//         </Button>
//         <div className="ml-1">
//           <UserButton afterSignOutUrl="/sign-in" />
//         </div>
//       </div>
//     </header>
//   )
// }

// "use client"

// import { useState } from "react"
// import { Breadcrumbs } from "@/components/breadcrumbs"
// import { ThemeToggle } from "@/components/theme-toggle"
// import { UserButton } from "@/components/user-button"
// import { Button } from "@/components/ui/button"
// import { Bell } from "lucide-react"
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
// import { NotificationsSidebar } from "@/components/notifications/notifications-sidebar"
// import useSWR from "swr"

// export function Header() {
//   const [notificationSheetOpen, setNotificationSheetOpen] = useState(false)
//   const { data } = useSWR("/api/notifications/list", (url) => fetch(url).then((r) => r.json()))
//   const unreadCount = data?.unreadCount || 0

//   return (
//     <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-xl lg:px-6">
//       <div className="flex items-center gap-3 flex-1 min-w-0">
//         <div className="hidden sm:block min-w-0">
//           <Breadcrumbs />
//         </div>
//       </div>

//       <div className="flex items-center gap-2">
//         <ThemeToggle />

//         <Sheet open={notificationSheetOpen} onOpenChange={setNotificationSheetOpen}>
//           <SheetTrigger asChild>
//             <Button variant="ghost" size="icon" className="relative h-9 w-9">
//               <Bell className="h-5 w-5" />
//               {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />}
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="right" className="w-full sm:w-96 p-0">
//             <SheetHeader className="sr-only">
//               <SheetTitle>Notifications</SheetTitle>
//             </SheetHeader>
//             <NotificationsSidebar />
//           </SheetContent>
//         </Sheet>

//         <div className="ml-1">
//           <UserButton />
//         </div>
//       </div>
//     </header>
//   )
// }
