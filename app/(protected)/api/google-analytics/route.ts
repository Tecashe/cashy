import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { BetaAnalyticsDataClient } from "@google-analytics/data"

const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID

function getAnalyticsClient() {
    const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
    if (!keyJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not set")

    const credentials = JSON.parse(keyJson)

    return new BetaAnalyticsDataClient({
        credentials: {
            client_email: credentials.client_email,
            private_key: credentials.private_key,
        },
    })
}

export async function GET() {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (!propertyId) {
            return NextResponse.json({ error: "GOOGLE_ANALYTICS_PROPERTY_ID is not set" }, { status: 500 })
        }

        const analyticsDataClient = getAnalyticsClient()

        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            metrics: [
                { name: "sessions" },
                { name: "screenPageViews" },
                { name: "activeUsers" },
                { name: "bounceRate" },
                { name: "averageSessionDuration" },
            ],
        })

        const row = response.rows?.[0]?.metricValues

        const metrics = {
            sessions: parseInt(row?.[0]?.value ?? "0"),
            pageviews: parseInt(row?.[1]?.value ?? "0"),
            users: parseInt(row?.[2]?.value ?? "0"),
            bounceRate: parseFloat((parseFloat(row?.[3]?.value ?? "0") * 100).toFixed(1)),
            avgSessionDuration: parseFloat(parseFloat(row?.[4]?.value ?? "0").toFixed(0)),
        }

        return NextResponse.json({ metrics })
    } catch (error) {
        console.error("[google-analytics] Error fetching GA data:", error)
        return NextResponse.json({ error: "Failed to fetch Google Analytics data" }, { status: 500 })
    }
}