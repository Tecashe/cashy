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

// NEW EMBED - app/accounts/page.tsx
// This is the accounts page that displays connected Instagram accounts

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


// app/api/onboarding/route.ts

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  console.log("\n🚀 ===== ONBOARDING POST REQUEST STARTED =====")
  
  try {
    // Debug: Log request details
    console.log("📍 Request URL:", request.url)
    console.log("📍 Request Method:", request.method)
    console.log("🍪 Has Cookies:", !!request.headers.get('cookie'))
    console.log("🔑 Cookie Header:", request.headers.get('cookie')?.substring(0, 100) + "...")
    
    // Attempt authentication
    console.log("\n🔐 Attempting authentication...")
    const session = await auth()
    
    console.log("📊 Auth Session Object:", JSON.stringify(session, null, 2))
    console.log("👤 User ID from session:", session?.userId)
    console.log("✅ Has User ID:", !!session?.userId)
    
    if (!session?.userId) {
      console.log("\n❌ AUTHENTICATION FAILED - No userId in session")
      console.log("Session state:", session)
      return NextResponse.json({ 
        error: "Unauthorized",
        debug: {
          hasSession: !!session,
          sessionKeys: session ? Object.keys(session) : [],
        }
      }, { status: 401 })
    }

    const { userId } = session
    console.log("\n✅ AUTHENTICATED SUCCESSFULLY")
    console.log("👤 Clerk User ID:", userId)

    // Parse request body
    console.log("\n📦 Parsing request body...")
    const data = await request.json()
    console.log("📄 Request Data Keys:", Object.keys(data))
    console.log("📄 Business Name:", data.businessName)
    console.log("📄 Business Type:", data.businessType)

    // Find user in database
    console.log("\n🔍 Looking up user in database...")
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, email: true, clerkId: true }
    })
    
    if (!existingUser) {
      console.log("❌ USER NOT FOUND IN DATABASE")
      console.log("Clerk ID searched:", userId)
      return NextResponse.json({ 
        error: "User not found in database",
        debug: { clerkId: userId }
      }, { status: 404 })
    }
    
    console.log("✅ User found in database:", existingUser.id)

    // Update user with business profile
    console.log("\n💾 Updating user profile...")
    const user = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        businessName: data.businessName,
        businessDescription: data.businessDescription,
        businessType: data.businessType,
        businessIndustry: data.industry || null,
        
        // AI Configuration
        aiEnabled: true,
        aiTone: data.aiTone || 'professional',
        aiPersonality: data.aiPersonality || null,
        aiInstructions: buildAIInstructions(data),
      },
    })
    console.log("✅ User profile updated:", user.id)

    // Create knowledge documents if provided
    if (data.faqs) {
      console.log("\n📚 Creating FAQ knowledge document...")
      await prisma.knowledgeDocument.create({
        data: {
          userId: user.id,
          title: "FAQs",
          content: data.faqs,
          type: "faq",
          tags: ["onboarding", "faq"],
          embedding: [],
        },
      })
      console.log("✅ FAQ document created")
    }

    if (data.policies) {
      console.log("\n📋 Creating policies knowledge document...")
      await prisma.knowledgeDocument.create({
        data: {
          userId: user.id,
          title: "Business Policies",
          content: data.policies,
          type: "policy",
          tags: ["onboarding", "policy"],
          embedding: [],
        },
      })
      console.log("✅ Policies document created")
    }

    // Store API key if BYOK (encrypted)
    if (data.aiProvider === 'byok' && data.anthropicApiKey) {
      console.log("\n🔐 Storing encrypted API key...")
      const { encrypt } = await import("@/lib/encrypt")
      
      await prisma.integration.create({
        data: {
          userId: user.id,
          type: 'anthropic_api',
          name: 'Anthropic API',
          isActive: true,
          config: {
            encrypted: encrypt(data.anthropicApiKey),
            provider: 'byok',
          },
        },
      })
      console.log("✅ API key stored")
    }

    // Create default automations
    console.log("\n🤖 Creating default automations...")
    await createDefaultAutomations(user.id, data)
    console.log("✅ Automations created")

    console.log("\n🎉 ===== ONBOARDING COMPLETED SUCCESSFULLY =====\n")
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        businessName: user.businessName,
        businessType: user.businessType,
      },
    })
  } catch (error) {
    console.error("\n💥 ===== ONBOARDING ERROR =====")
    console.error("Error Type:", error?.constructor?.name)
    console.error("Error Message:", error instanceof Error ? error.message : String(error))
    console.error("Error Stack:", error instanceof Error ? error.stack : 'No stack trace')
    console.error("================================\n")
    
    return NextResponse.json(
      { 
        error: "Failed to save onboarding data",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

function buildAIInstructions(data: any): string {
  console.log("🧠 Building AI instructions...")
  const instructions = []

  // Base instruction
  instructions.push(`You are an AI assistant for ${data.businessName}.`)
  instructions.push(data.businessDescription)

  // Add feature-specific instructions
  if (data.enableProducts) {
    instructions.push("You can browse the product catalog, recommend products, and help customers make purchases.")
  }

  if (data.enableBooking) {
    instructions.push("You can check availability and book appointments for customers.")
  }

  if (data.enableLeadQual) {
    instructions.push("When talking to new leads, ask qualifying questions to understand their needs and budget.")
  }

  if (data.enableSupport) {
    instructions.push("Answer customer questions using the knowledge base. If you don't know something, create a support ticket.")
  }

  // Add custom personality
  if (data.aiPersonality) {
    instructions.push(data.aiPersonality)
  }

  const result = instructions.join("\n\n")
  console.log("✅ AI instructions built:", result.length, "characters")
  return result
}

async function createDefaultAutomations(userId: string, data: any) {
  console.log("🤖 Looking for Instagram account...")
  const instagramAccount = await prisma.instagramAccount.findFirst({
    where: { userId },
  })

  if (!instagramAccount) {
    console.log("⚠️ No Instagram account found, skipping automation creation")
    return
  }

  console.log("✅ Instagram account found:", instagramAccount.username)
  const automations = []

  // COACH: Welcome + Booking Flow
  if (data.businessType === 'coach' && data.enableBooking) {
    console.log("📝 Adding coach automation (booking flow)")
    automations.push({
      userId,
      instagramAccountId: instagramAccount.id,
      name: "Welcome & Book Discovery Call",
      description: "Greet new contacts and help them book a discovery call",
      status: "published",
      isActive: true,
      triggers: {
        create: {
          type: "FIRST_MESSAGE",
          conditions: {},
          order: 0,
        },
      },
      actions: {
        create: [
          {
            type: "AI_RESPONSE",
            content: {
              enableBooking: true,
              enableCommerce: false,
              aiTone: data.aiTone,
              systemPrompt: `Warmly welcome the person. Let them know you're ${data.businessName}'s AI assistant. Ask if they'd like to book a free discovery call.`,
            },
            order: 0,
          },
        ],
      },
    })
  }

  // ECOMMERCE: Product Recommendations
  if (data.businessType === 'ecommerce' && data.enableProducts) {
    console.log("📝 Adding ecommerce automation (product assistant)")
    automations.push({
      userId,
      instagramAccountId: instagramAccount.id,
      name: "Product Assistant",
      description: "Help customers find and buy products",
      status: "published",
      isActive: true,
      triggers: {
        create: {
          type: "DM_RECEIVED",
          conditions: {},
          order: 0,
        },
      },
      actions: {
        create: [
          {
            type: "AI_RESPONSE",
            content: {
              enableCommerce: true,
              enableProductCatalog: true,
              enablePayments: true,
              aiTone: data.aiTone,
              systemPrompt: `You're a helpful shopping assistant for ${data.businessName}. Help customers find products, answer questions, and complete purchases.`,
            },
            order: 0,
          },
        ],
      },
    })
  }

  // SERVICES: Lead Qualification
  if (data.businessType === 'services' && data.enableLeadQual) {
    console.log("📝 Adding services automation (lead qualification)")
    automations.push({
      userId,
      instagramAccountId: instagramAccount.id,
      name: "Qualify New Leads",
      description: "Ask qualifying questions and schedule consultations",
      status: "published",
      isActive: true,
      triggers: {
        create: {
          type: "FIRST_MESSAGE",
          conditions: {},
          order: 0,
        },
      },
      actions: {
        create: [
          {
            type: "AI_RESPONSE",
            content: {
              enableBooking: data.enableBooking,
              aiTone: data.aiTone,
              systemPrompt: `Ask about their project needs, timeline, and budget. If they're a good fit, offer to schedule a consultation.`,
            },
            order: 0,
          },
        ],
      },
    })
  }

  // Create all automations
  console.log(`🚀 Creating ${automations.length} automation(s)...`)
  for (const automation of automations) {
    const created = await prisma.automation.create({ data: automation })
    console.log(`✅ Created automation: ${created.name}`)
  }
}

// ============================================
// GET: Retrieve onboarding status
// ============================================

export async function GET(request: NextRequest) {
  console.log("\n🔍 ===== ONBOARDING GET REQUEST STARTED =====")
  
  try {
    console.log("📍 Request URL:", request.url)
    console.log("🍪 Has Cookies:", !!request.headers.get('cookie'))
    
    console.log("\n🔐 Attempting authentication...")
    const session = await auth()
    
    console.log("📊 Auth Session:", !!session)
    console.log("👤 User ID:", session?.userId)
    
    if (!session?.userId) {
      console.log("❌ No authentication - returning 401")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId } = session
    console.log("✅ Authenticated as:", userId)

    console.log("\n🔍 Fetching user profile...")
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        businessName: true,
        businessDescription: true,
        businessType: true,
        businessIndustry: true,
        aiEnabled: true,
        aiTone: true,
        aiPersonality: true,
      },
    })

    if (!user) {
      console.log("❌ User not found in database")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isOnboarded = !!(user?.businessName && user?.businessDescription)
    console.log("✅ User found. Is onboarded:", isOnboarded)

    console.log("\n✅ ===== ONBOARDING GET COMPLETED =====\n")
    return NextResponse.json({
      isOnboarded,
      profile: user,
    })
  } catch (error) {
    console.error("\n💥 ===== ONBOARDING GET ERROR =====")
    console.error("Error:", error)
    console.error("================================\n")
    
    return NextResponse.json(
      { error: "Failed to check onboarding status" },
      { status: 500 }
    )
  }
}