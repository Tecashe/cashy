// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Instagram, Plus, CheckCircle2, Settings } from "lucide-react"
// import { prisma } from "@/lib/db"

// async function getInstagramAccounts(userId: string) {
//   const user = await prisma.user.findUnique({
//     where: { clerkId: userId },
//     include: {
//       instagramAccounts: {
//         where: { isConnected: true },
//       },
//     },
//   })
// //
//   return user?.instagramAccounts || []
// }

// export default async function AccountsPage() {
//   const { userId } = await auth()
//   if (!userId) redirect("/sign-in")

//   const accounts = await getInstagramAccounts(userId)

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Instagram Accounts</h1>
//           <p className="text-slate-600 dark:text-slate-400">Manage multiple Instagram accounts</p>
//         </div>
//         <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
//           <Plus className="h-4 w-4" />
//           Connect Account
//         </Button>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {accounts.map((account) => (
//           <Card key={account.id} className="glass-card">
//             <CardHeader>
//               <div className="flex items-center gap-3">
//                 <img
//                   src={account.profilePicUrl || "/placeholder.svg"}
//                   alt={account.username}
//                   className="h-12 w-12 rounded-full"
//                 />
//                 <div className="flex-1">
//                   <CardTitle className="text-lg">@{account.username}</CardTitle>
//                   <div className="flex items-center gap-2">
//                     <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
//                       <CheckCircle2 className="mr-1 h-3 w-3" />
//                       Connected
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-slate-600 dark:text-slate-400">Followers</span>
//                 <span className="font-semibold">{account.followerCount.toLocaleString()}</span>
//               </div>
//               <div className="flex gap-2">
//                 <Button variant="outline" size="sm" className="flex-1 bg-transparent">
//                   <Settings className="mr-2 h-3 w-3" />
//                   Manage
//                 </Button>
//                 <Button variant="outline" size="sm" className="flex-1 bg-transparent">
//                   Switch To
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}

//         {accounts.length === 0 && (
//           <Card className="glass-card col-span-full">
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <Instagram className="h-12 w-12 text-slate-400" />
//               <h3 className="mt-4 text-lg font-semibold">No Instagram accounts connected</h3>
//               <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
//                 Connect your first Instagram account to start automating
//               </p>
//               <Button className="mt-4 gap-2 bg-gradient-to-r from-purple-600 to-pink-600">
//                 <Instagram className="h-4 w-4" />
//                 Connect Instagram
//               </Button>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   )
// }

// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Instagram, Plus, CheckCircle2, Settings } from "lucide-react"
// import { prisma } from "@/lib/db"
// import type { InstagramAccount } from "@prisma/client"

// async function getInstagramAccounts(userId: string) {
//   const user = await prisma.user.findUnique({
//     where: { clerkId: userId },
//     include: {
//       instagramAccounts: {
//         where: { isConnected: true },
//       },
//     },
//   })

//   return user?.instagramAccounts || []
// }

// export default async function AccountsPage() {
//   const { userId } = await auth()
//   if (!userId) redirect("/sign-in")

//   const accounts = await getInstagramAccounts(userId)

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Instagram Accounts</h1>
//           <p className="text-slate-600 dark:text-slate-400">Manage multiple Instagram accounts</p>
//         </div>
//         <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
//           <Plus className="h-4 w-4" />
//           Connect Account
//         </Button>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {accounts.map((account: InstagramAccount) => (
//           <Card key={account.id} className="glass-card">
//             <CardHeader>
//               <div className="flex items-center gap-3">
//                 <img
//                   src={account.profilePicUrl || "/placeholder.svg"}
//                   alt={account.username}
//                   className="h-12 w-12 rounded-full"
//                 />
//                 <div className="flex-1">
//                   <CardTitle className="text-lg">@{account.username}</CardTitle>
//                   <div className="flex items-center gap-2">
//                     <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
//                       <CheckCircle2 className="mr-1 h-3 w-3" />
//                       Connected
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-slate-600 dark:text-slate-400">Followers</span>
//                 <span className="font-semibold">{account.followerCount.toLocaleString()}</span>
//               </div>
//               <div className="flex gap-2">
//                 <Button variant="outline" size="sm" className="flex-1 bg-transparent">
//                   <Settings className="mr-2 h-3 w-3" />
//                   Manage
//                 </Button>
//                 <Button variant="outline" size="sm" className="flex-1 bg-transparent">
//                   Switch To
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}

//         {accounts.length === 0 && (
//           <Card className="glass-card col-span-full">
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <Instagram className="h-12 w-12 text-slate-400" />
//               <h3 className="mt-4 text-lg font-semibold">No Instagram accounts connected</h3>
//               <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
//                 Connect your first Instagram account to start automating
//               </p>
//               <Button className="mt-4 gap-2 bg-gradient-to-r from-purple-600 to-pink-600">
//                 <Instagram className="h-4 w-4" />
//                 Connect Instagram
//               </Button>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   )
// }

// // app/accounts/page.tsx
// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Instagram, Plus, CheckCircle2, Settings, AlertCircle } from "lucide-react"
// import { prisma } from "@/lib/db"
// import type { InstagramAccount } from "@prisma/client"
// import Link from "next/link"

// async function getInstagramAccounts(userId: string) {
//   const user = await prisma.user.findUnique({
//     where: { clerkId: userId },
//     include: {
//       instagramAccounts: {
//         where: { isConnected: true },
//       },
//     },
//   })

//   return user?.instagramAccounts || []
// }

// export default async function AccountsPage({
//   searchParams,
// }: {
//   searchParams: { success?: string; error?: string }
// }) {
//   const { userId } = await auth()
//   if (!userId) redirect("/sign-in")

//   const accounts = await getInstagramAccounts(userId)

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Instagram Accounts</h1>
//           <p className="text-slate-600 dark:text-slate-400">Manage multiple Instagram accounts</p>
//         </div>
//         <Link href="/api/auth/instagram/connect">
//           <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
//             <Plus className="h-4 w-4" />
//             Connect Account
//           </Button>
//         </Link>
//       </div>

//       {/* Success/Error Messages */}
//       {searchParams.success && (
//         <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20">
//           <CardContent className="flex items-center gap-2 pt-6">
//             <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
//             <p className="text-green-800 dark:text-green-300">
//               Instagram account connected successfully!
//             </p>
//           </CardContent>
//         </Card>
//       )}

//       {searchParams.error && (
//         <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
//           <CardContent className="flex items-center gap-2 pt-6">
//             <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
//             <p className="text-red-800 dark:text-red-300">
//               {getErrorMessage(searchParams.error)}
//             </p>
//           </CardContent>
//         </Card>
//       )}

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {accounts.map((account: InstagramAccount) => (
//           <Card key={account.id} className="glass-card">
//             <CardHeader>
//               <div className="flex items-center gap-3">
//                 <img
//                   src={account.profilePicUrl || "/placeholder.svg"}
//                   alt={account.username}
//                   className="h-12 w-12 rounded-full"
//                 />
//                 <div className="flex-1">
//                   <CardTitle className="text-lg">@{account.username}</CardTitle>
//                   <div className="flex items-center gap-2">
//                     <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
//                       <CheckCircle2 className="mr-1 h-3 w-3" />
//                       Connected
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-slate-600 dark:text-slate-400">Followers</span>
//                 <span className="font-semibold">{account.followerCount.toLocaleString()}</span>
//               </div>
//               <div className="flex gap-2">
//                 <Button variant="outline" size="sm" className="flex-1 bg-transparent">
//                   <Settings className="mr-2 h-3 w-3" />
//                   Manage
//                 </Button>
//                 <Button variant="outline" size="sm" className="flex-1 bg-transparent">
//                   Switch To
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}

//         {accounts.length === 0 && (
//           <Card className="glass-card col-span-full">
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <Instagram className="h-12 w-12 text-slate-400" />
//               <h3 className="mt-4 text-lg font-semibold">No Instagram accounts connected</h3>
//               <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
//                 Connect your first Instagram Business account to start automating
//               </p>
//               <Link href="/api/auth/instagram/connect">
//                 <Button className="mt-4 gap-2 bg-gradient-to-r from-purple-600 to-pink-600">
//                   <Instagram className="h-4 w-4" />
//                   Connect Instagram
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   )
// }

// function getErrorMessage(error: string): string {
//   switch (error) {
//     case "access_denied":
//       return "You denied access to Instagram. Please try again and approve the permissions."
//     case "no_code":
//       return "No authorization code received. Please try again."
//     case "unauthorized":
//       return "Unauthorized request. Please try again."
//     case "token_exchange_failed":
//       return "Failed to exchange authorization code. Please try again."
//     case "no_pages":
//       return "No Facebook Pages found. You need a Facebook Page connected to an Instagram Business account."
//     case "no_instagram_accounts":
//       return "No Instagram Business accounts found. Make sure your Instagram account is connected to a Facebook Page."
//     case "user_not_found":
//       return "User not found. Please try signing in again."
//     default:
//       return "An unknown error occurred. Please try again."
//   }
// }



// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Instagram, Plus, CheckCircle2, Settings, AlertCircle } from "lucide-react"
// import { prisma } from "@/lib/db"
// import type { InstagramAccount } from "@prisma/client"
// import Link from "next/link"

// async function getInstagramAccounts(userId: string) {
//   const user = await prisma.user.findUnique({
//     where: { clerkId: userId },
//     include: {
//       instagramAccounts: {
//         where: { isConnected: true },
//       },
//     },
//   })

//   return user?.instagramAccounts || []
// }

// export default async function AccountsPage({
//   searchParams,
// }: {
//   searchParams: { success?: string; error?: string; reason?: string }
// }) {
//   const { userId } = await auth()
//   if (!userId) redirect("/sign-in")

//   const accounts = await getInstagramAccounts(userId)

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Instagram Accounts</h1>
//           <p className="text-slate-600 dark:text-slate-400">Manage multiple Instagram accounts</p>
//         </div>
//         <Link href="/api/auth/instagram/connect">
//           <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
//             <Plus className="h-4 w-4" />
//             Connect Account
//           </Button>
//         </Link>
//       </div>

//       {/* Success Message */}
//       {searchParams.success && (
//         <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20">
//           <CardContent className="flex items-center gap-2 pt-6">
//             <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
//             <p className="text-green-800 dark:text-green-300">
//               Instagram account connected successfully!
//             </p>
//           </CardContent>
//         </Card>
//       )}

//       {/* Error Messages */}
//       {searchParams.error && (
//         <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
//           <CardContent className="flex items-center gap-2 pt-6">
//             <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
//             <p className="text-red-800 dark:text-red-300">
//               {getErrorMessage(searchParams.error, searchParams.reason)}
//             </p>
//           </CardContent>
//         </Card>
//       )}

//       {/* Instagram Accounts Grid */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {accounts.map((account: InstagramAccount) => (
//           <Card key={account.id} className="glass-card">
//             <CardHeader>
//               <div className="flex items-center gap-3">
//                 <img
//                   src={account.profilePicUrl || "/placeholder.svg"}
//                   alt={account.username}
//                   className="h-12 w-12 rounded-full"
//                 />
//                 <div className="flex-1">
//                   <CardTitle className="text-lg">@{account.username}</CardTitle>
//                   <div className="flex items-center gap-2">
//                     <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
//                       <CheckCircle2 className="mr-1 h-3 w-3" />
//                       Connected
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-slate-600 dark:text-slate-400">Followers</span>
//                 <span className="font-semibold">{account.followerCount.toLocaleString()}</span>
//               </div>
//               <div className="flex gap-2">
//                 <Button variant="outline" size="sm" className="flex-1 bg-transparent">
//                   <Settings className="mr-2 h-3 w-3" />
//                   Manage
//                 </Button>
//                 <Button variant="outline" size="sm" className="flex-1 bg-transparent">
//                   Switch To
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}

//         {/* Empty State */}
//         {accounts.length === 0 && (
//           <Card className="glass-card col-span-full">
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <Instagram className="h-12 w-12 text-slate-400" />
//               <h3 className="mt-4 text-lg font-semibold">No Instagram accounts connected</h3>
//               <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
//                 Connect your first Instagram Business account to start automating
//               </p>
//               <Link href="/api/auth/instagram/connect">
//                 <Button className="mt-4 gap-2 bg-gradient-to-r from-purple-600 to-pink-600">
//                   <Instagram className="h-4 w-4" />
//                   Connect Instagram
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   )
// }

// function getErrorMessage(error: string, reason?: string): string {
//   switch (error) {
//     case "access_denied":
//       return reason === "user_denied" 
//         ? "You cancelled the Instagram authorization. Please try again to connect your account."
//         : "Access to Instagram was denied. Please try again and approve the permissions."
//     case "no_code":
//       return "No authorization code received from Instagram. Please try again."
//     case "unauthorized":
//       return "You must be signed in to connect an Instagram account."
//     case "connection_failed":
//       return "Failed to connect to Instagram. Please check your app credentials and try again."
//     case "user_not_found":
//       return "User account not found. Please try signing in again."
//     default:
//       return "An error occurred while connecting to Instagram. Please try again."
//   }
// }


import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Instagram, Plus, CheckCircle2, Settings, AlertCircle, LogOut } from "lucide-react"
import { prisma } from "@/lib/db"
import type { InstagramAccount } from "@prisma/client"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

async function getInstagramAccounts(userId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      instagramAccounts: {
        where: { isConnected: true },
      },
    },
  })

  return user?.instagramAccounts || []
}

async function disconnectAccount(formData: FormData) {
  "use server"
  const { userId } = await auth()
  if (!userId) {
    console.error("[Disconnect] ❌ Unauthorized")
    return
  }

  const accountId = formData.get("accountId") as string
  const slug = formData.get("slug") as string

  try {
    // Verify account belongs to user
    const account = await prisma.instagramAccount.findFirst({
      where: {
        id: accountId,
        user: { clerkId: userId },
      },
    })

    if (!account) {
      console.error("[Disconnect] ❌ Account not found")
      return
    }

    // Disconnect account
    await prisma.instagramAccount.update({
      where: { id: accountId },
      data: {
        isConnected: false,
        accessToken: "",
        disconnectedAt: new Date(),
      },
    })

    // Deactivate automations
    await prisma.automation.updateMany({
      where: { instagramAccountId: accountId },
      data: { isActive: false },
    })

    console.log("[Disconnect] ✅ Account disconnected:", account.username)

    redirect(`/dashboard/${slug}/accounts?disconnected=true`)
  } catch (error) {
    console.error("[Disconnect] ❌ Error:", error)
  }
}

export default async function AccountsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: { success?: string; error?: string; reason?: string; disconnected?: string }
}) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { slug } = await params
  const accounts = await getInstagramAccounts(userId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Instagram Accounts</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage multiple Instagram accounts</p>
        </div>
        <Link href="/api/auth/instagram/connect">
          <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="h-4 w-4" />
            Connect Account
          </Button>
        </Link>
      </div>

      {/* Success Message */}
      {searchParams.success && (
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20">
          <CardContent className="flex items-center gap-2 pt-6">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-green-800 dark:text-green-300">
              Instagram account connected successfully!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Disconnected Message */}
      {searchParams.disconnected && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20">
          <CardContent className="flex items-center gap-2 pt-6">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <p className="text-yellow-800 dark:text-yellow-300">
              Instagram account disconnected successfully
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error Messages */}
      {searchParams.error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
          <CardContent className="flex items-center gap-2 pt-6">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-red-800 dark:text-red-300">
              {getErrorMessage(searchParams.error, searchParams.reason)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Instagram Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account: InstagramAccount) => (
          <Card key={account.id} className="glass-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <img
                  src={account.profilePicUrl || "/placeholder.svg"}
                  alt={account.username}
                  className="h-12 w-12 rounded-full"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">@{account.username}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Connected
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Followers</span>
                <span className="font-semibold">{account.followerCount.toLocaleString()}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Settings className="mr-2 h-3 w-3" />
                  Manage
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Switch To
                </Button>
              </div>

              {/* Disconnect Button with Confirmation */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                  >
                    <LogOut className="mr-2 h-3 w-3" />
                    Disconnect Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Disconnect @{account.username}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will deactivate all automations and archive conversations for this account.
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                        <li>All automations will be deactivated</li>
                        <li>No new messages will be received</li>
                        <li>All conversations will be archived</li>
                        <li>You can reconnect anytime</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form action={disconnectAccount}>
                      <input type="hidden" name="accountId" value={account.id} />
                      <input type="hidden" name="slug" value={slug} />
                      <AlertDialogAction
                        type="submit"
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Disconnect
                      </AlertDialogAction>
                    </form>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {accounts.length === 0 && (
          <Card className="glass-card col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Instagram className="h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-semibold">No Instagram accounts connected</h3>
              <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                Connect your first Instagram Business account to start automating
              </p>
              <Link href="/api/auth/instagram/connect">
                <Button className="mt-4 gap-2 bg-gradient-to-r from-purple-600 to-pink-600">
                  <Instagram className="h-4 w-4" />
                  Connect Instagram
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function getErrorMessage(error: string, reason?: string): string {
  switch (error) {
    case "access_denied":
      return reason === "user_denied"
        ? "You cancelled the Instagram authorization. Please try again to connect your account."
        : "Access to Instagram was denied. Please try again and approve the permissions."
    case "no_code":
      return "No authorization code received from Instagram. Please try again."
    case "unauthorized":
      return "You must be signed in to connect an Instagram account."
    case "connection_failed":
      return "Failed to connect to Instagram. Please check your app credentials and try again."
    case "user_not_found":
      return "User account not found. Please try signing in again."
    default:
      return "An error occurred while connecting to Instagram. Please try again."
  }
}