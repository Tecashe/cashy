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

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Instagram, Plus, CheckCircle2, Settings } from "lucide-react"
import { prisma } from "@/lib/db"
import type { InstagramAccount } from "@prisma/client"

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

export default async function AccountsPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const accounts = await getInstagramAccounts(userId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Instagram Accounts</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage multiple Instagram accounts</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Plus className="h-4 w-4" />
          Connect Account
        </Button>
      </div>

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
            </CardContent>
          </Card>
        ))}

        {accounts.length === 0 && (
          <Card className="glass-card col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Instagram className="h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-semibold">No Instagram accounts connected</h3>
              <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                Connect your first Instagram account to start automating
              </p>
              <Button className="mt-4 gap-2 bg-gradient-to-r from-purple-600 to-pink-600">
                <Instagram className="h-4 w-4" />
                Connect Instagram
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}