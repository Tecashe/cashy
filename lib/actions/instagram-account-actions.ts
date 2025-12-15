// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { InstagramAPI } from "@/lib/instagram-api"

// export async function getInstagramAccounts() {
//   const { userId } = await auth()
//   if (!userId) return []

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return []

//   const accounts = await prisma.instagramAccount.findMany({
//     where: { userId: user.id },
//     orderBy: { createdAt: "desc" },
//   })

//   return accounts
// }

// export async function disconnectInstagramAccount(accountId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const account = await prisma.instagramAccount.findFirst({
//     where: { id: accountId, userId: user.id },
//   })
//   if (!account) throw new Error("Account not found")

//   await prisma.instagramAccount.delete({
//     where: { id: accountId },
//   })

//   revalidatePath("/settings/instagram")
//   return { success: true }
// }

// export async function refreshInstagramToken(accountId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const account = await prisma.instagramAccount.findFirst({
//     where: { id: accountId, userId: user.id },
//   })
//   if (!account) throw new Error("Account not found")

//   try {
//     const response = await InstagramAPI.refreshAccessToken(account.accessToken)

//     await prisma.instagramAccount.update({
//       where: { id: accountId },
//       data: {
//         accessToken: response.access_token,
//         tokenExpiry: new Date(Date.now() + response.expires_in * 1000),
//       },
//     })

//     revalidatePath("/settings/instagram")
//     return { success: true }
//   } catch (error) {
//     console.error("[Instagram] Token refresh failed:", error)
//     throw new Error("Failed to refresh token")
//   }
// }

// export async function updateInstagramAccountProfile(accountId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const account = await prisma.instagramAccount.findFirst({
//     where: { id: accountId, userId: user.id },
//   })
//   if (!account) throw new Error("Account not found")

//   try {
//     const api = new InstagramAPI({
//       accessToken: account.accessToken,
//       instagramId: account.instagramId,
//     })

//     const profile = await api.getProfile()

//     await prisma.instagramAccount.update({
//       where: { id: accountId },
//       data: {
//         username: profile.username,
//         profilePicUrl: profile.profile_picture_url,
//         followerCount: profile.followers_count,
//       },
//     })

//     revalidatePath("/settings/instagram")
//     return profile
//   } catch (error) {
//     console.error("[Instagram] Profile update failed:", error)
//     throw new Error("Failed to update profile")
//   }
// }

// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { InstagramAPI } from "@/lib/instagram-api"

// export async function getInstagramAccounts() {
//   const { userId } = await auth()
//   if (!userId) return []

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) return []

//   const accounts = await prisma.instagramAccount.findMany({
//     where: { userId: user.id },
//     orderBy: { createdAt: "desc" },
//   })

//   return accounts
// }

// export async function disconnectInstagramAccount(accountId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const account = await prisma.instagramAccount.findFirst({
//     where: { id: accountId, userId: user.id },
//   })
//   if (!account) throw new Error("Account not found")

//   await prisma.instagramAccount.delete({
//     where: { id: accountId },
//   })

//   revalidatePath("/settings/instagram")
//   return { success: true }
// }

// export async function refreshInstagramToken(accountId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const account = await prisma.instagramAccount.findFirst({
//     where: { id: accountId, userId: user.id },
//   })
//   if (!account) throw new Error("Account not found")

//   try {
//     const response = await InstagramAPI.refreshAccessToken(account.accessToken)

//     await prisma.instagramAccount.update({
//       where: { id: accountId },
//       data: {
//         accessToken: response.access_token,
//         tokenExpiry: new Date(Date.now() + response.expires_in * 1000),
//       },
//     })

//     revalidatePath("/settings/instagram")
//     return { success: true }
//   } catch (error) {
//     console.error("[Instagram] Token refresh failed:", error)
//     throw new Error("Failed to refresh token")
//   }
// }

// export async function updateInstagramAccountProfile(accountId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await prisma.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const account = await prisma.instagramAccount.findFirst({
//     where: { id: accountId, userId: user.id },
//   })
//   if (!account) throw new Error("Account not found")

//   try {
//     const api = new InstagramAPI({
//       accessToken: account.accessToken,
//       instagramId: account.instagramId,
//     })

//     const profile = await api.getProfile()

//     await prisma.instagramAccount.update({
//       where: { id: accountId },
//       data: {
//         username: profile.username,
//         profilePicUrl: profile.profile_picture_url,
//         followerCount: profile.followers_count,
//       },
//     })

//     revalidatePath("/settings/instagram")
//     return profile
//   } catch (error) {
//     console.error("[Instagram] Profile update failed:", error)
//     throw new Error("Failed to update profile")
//   }
// }

"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { InstagramAPI } from "@/lib/instagram-api"

export async function getInstagramAccounts() {
  const { userId } = await auth()
  if (!userId) return []

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return []

  const accounts = await prisma.instagramAccount.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })

  return accounts
}

export async function disconnectInstagramAccount(accountId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const account = await prisma.instagramAccount.findFirst({
    where: { id: accountId, userId: user.id },
  })
  if (!account) throw new Error("Account not found")

  await prisma.instagramAccount.delete({
    where: { id: accountId },
  })

  revalidatePath("/settings/instagram")
  return { success: true }
}

export async function refreshInstagramToken(accountId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const account = await prisma.instagramAccount.findFirst({
    where: { id: accountId, userId: user.id },
  })
  if (!account) throw new Error("Account not found")

  try {
    const response = await InstagramAPI.refreshAccessToken(account.accessToken)

    await prisma.instagramAccount.update({
      where: { id: accountId },
      data: {
        accessToken: response.access_token,
        tokenExpiry: new Date(Date.now() + response.expires_in * 1000),
      },
    })

    revalidatePath("/settings/instagram")
    return { success: true }
  } catch (error) {
    console.error("[Instagram] Token refresh failed:", error)
    throw new Error("Failed to refresh token")
  }
}

export async function updateInstagramAccountProfile(accountId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const account = await prisma.instagramAccount.findFirst({
    where: { id: accountId, userId: user.id },
  })
  if (!account) throw new Error("Account not found")

  try {
    const api = new InstagramAPI({
      accessToken: account.accessToken,
      instagramId: account.instagramId,
    })

    const profile = await api.getProfile()

    await prisma.instagramAccount.update({
      where: { id: accountId },
      data: {
        username: profile.username,
        profilePicUrl: profile.profile_picture_url,
        followerCount: profile.followers_count,
      },
    })

    revalidatePath("/settings/instagram")
    return profile
  } catch (error) {
    console.error("[Instagram] Profile update failed:", error)
    throw new Error("Failed to update profile")
  }
}
