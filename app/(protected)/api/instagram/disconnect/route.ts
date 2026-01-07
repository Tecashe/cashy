
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { accountId } = await request.json()

    if (!accountId) {
      return NextResponse.json({ error: "Account ID required" }, { status: 400 })
    }

    // Verify account belongs to user
    const account = await prisma.instagramAccount.findFirst({
      where: {
        id: accountId,
        user: { clerkId: userId }
      }
    })

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    // Disconnect account
    await prisma.instagramAccount.update({
      where: { id: accountId },
      data: {
        isConnected: false,
        accessToken: '', // Clear sensitive data
        disconnectedAt: new Date()
      }
    })

    // Deactivate related automations
    await prisma.automation.updateMany({
      where: { instagramAccountId: accountId },
      data: { isActive: false }
    })

    // Mark conversations as inactive
    // await prisma.conversation.updateMany({
    //   where: { instagramAccountId: accountId },
    //   data: { isActive: false }
    // })

    console.log("[Disconnect] ✅ Account disconnected:", account.username)

    return NextResponse.json({ 
      success: true,
      message: "Account disconnected successfully" 
    })
  } catch (error) {
    console.error("[Disconnect] ❌ Error:", error)
    return NextResponse.json(
      { error: "Failed to disconnect account" },
      { status: 500 }
    )
  }
}
