import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { InstagramAPI } from "@/lib/instagram-api"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const accountsToRefresh = await prisma.instagramAccount.findMany({
      where: {
        isConnected: true,
        tokenExpiry: {
          lte: sevenDaysFromNow,
        },
      },
    })

    let refreshed = 0
    let failed = 0

    for (const account of accountsToRefresh) {
      try {
        const response = await InstagramAPI.refreshAccessToken(account.accessToken)

        await prisma.instagramAccount.update({
          where: { id: account.id },
          data: {
            accessToken: response.access_token,
            tokenExpiry: new Date(Date.now() + response.expires_in * 1000),
          },
        })

        refreshed++
        console.log(`[TokenRefresh] Successfully refreshed token for account: ${account.username}`)
      } catch (error) {
        failed++
        console.error(`[TokenRefresh] Failed to refresh token for account: ${account.username}`, error)

        await prisma.instagramAccount.update({
          where: { id: account.id },
          data: { isConnected: false },
        })
      }
    }

    return NextResponse.json({
      success: true,
      refreshed,
      failed,
      total: accountsToRefresh.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Cron] Token refresh error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
