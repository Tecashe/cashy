import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { InstagramAPI } from "@/lib/instagram-api"

export async function POST() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        instagramAccounts: {
          where: { isConnected: true },
          take: 1,
        },
      },
    })

    if (!user || !user.instagramAccounts[0]) {
      return NextResponse.json({ error: "Instagram not connected" }, { status: 400 })
    }

    const instagramAccount = user.instagramAccounts[0]
    const api = new InstagramAPI({
      accessToken: instagramAccount.accessToken,
      instagramId: instagramAccount.instagramId,
    })

    // Fetch latest profile information
    const profile = await api.getProfile()

    // Update database
    await prisma.instagramAccount.update({
      where: { id: instagramAccount.id },
      data: {
        username: profile.username,
        profilePicUrl: profile.profile_picture_url,
        followerCount: profile.followers_count,
      },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("[v0] Error syncing profile:", error)
    return NextResponse.json({ error: "Failed to sync profile" }, { status: 500 })
  }
}
