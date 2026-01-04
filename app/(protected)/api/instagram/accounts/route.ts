import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Find user and get their connected Instagram accounts
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        instagramAccounts: {
          where: { isConnected: true },
          select: {
            id: true,
            username: true,
            profilePicUrl: true,
            followerCount: true,
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      accounts: user.instagramAccounts || [],
    })
  } catch (error) {
    console.error("Error fetching Instagram accounts:", error)
    return NextResponse.json(
      { error: "Failed to fetch Instagram accounts" },
      { status: 500 }
    )
  }
}