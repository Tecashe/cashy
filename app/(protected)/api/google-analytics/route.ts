// import { auth } from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"
// import { BetaAnalyticsDataClient } from "@google-analytics/data"

// const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID

// function getAnalyticsClient() {
//     const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
//     if (!keyJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not set")

//     const credentials = JSON.parse(keyJson)

//     return new BetaAnalyticsDataClient({
//         credentials: {
//             client_email: credentials.client_email,
//             private_key: credentials.private_key,
//         },
//     })
// }

// export async function GET() {
//     try {
//         const { userId } = await auth()
//         if (!userId) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//         }

//         if (!propertyId) {
//             return NextResponse.json({ error: "GOOGLE_ANALYTICS_PROPERTY_ID is not set" }, { status: 500 })
//         }

//         const analyticsDataClient = getAnalyticsClient()

//         const [response] = await analyticsDataClient.runReport({
//             property: `properties/${propertyId}`,
//             dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
//             metrics: [
//                 { name: "sessions" },
//                 { name: "screenPageViews" },
//                 { name: "activeUsers" },
//                 { name: "bounceRate" },
//                 { name: "averageSessionDuration" },
//             ],
//         })

//         const row = response.rows?.[0]?.metricValues

//         const metrics = {
//             sessions: parseInt(row?.[0]?.value ?? "0"),
//             pageviews: parseInt(row?.[1]?.value ?? "0"),
//             users: parseInt(row?.[2]?.value ?? "0"),
//             bounceRate: parseFloat((parseFloat(row?.[3]?.value ?? "0") * 100).toFixed(1)),
//             avgSessionDuration: parseFloat(parseFloat(row?.[4]?.value ?? "0").toFixed(0)),
//         }

//         return NextResponse.json({ metrics })
//     } catch (error) {
//         console.error("[google-analytics] Error fetching GA data:", error)
//         return NextResponse.json({ error: "Failed to fetch Google Analytics data" }, { status: 500 })
//     }
// }
import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
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

function getPreviousDateRange(days: number): { startDate: string; endDate: string } {
    const end = new Date()
    end.setDate(end.getDate() - days)
    const start = new Date(end)
    start.setDate(start.getDate() - days)
    return {
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
    }
}

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        if (!propertyId) return NextResponse.json({ error: "GOOGLE_ANALYTICS_PROPERTY_ID is not set" }, { status: 500 })

        const days = parseInt(request.nextUrl.searchParams.get("days") ?? "30")
        const client = getAnalyticsClient()
        const prevRange = getPreviousDateRange(days)

        const [currentRes, previousRes, topPagesRes] = await Promise.all([
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
                metrics: [
                    { name: "sessions" },
                    { name: "screenPageViews" },
                    { name: "activeUsers" },
                    { name: "bounceRate" },
                    { name: "averageSessionDuration" },
                ],
            }),
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: prevRange.startDate, endDate: prevRange.endDate }],
                metrics: [
                    { name: "sessions" },
                    { name: "screenPageViews" },
                    { name: "activeUsers" },
                    { name: "bounceRate" },
                    { name: "averageSessionDuration" },
                ],
            }),
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
                dimensions: [{ name: "pagePath" }],
                metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
                orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
                limit: 5,
            }),
        ])

        const curr = currentRes[0].rows?.[0]?.metricValues
        const prev = previousRes[0].rows?.[0]?.metricValues

        function pct(current: number, previous: number) {
            if (!previous) return 0
            return parseFloat((((current - previous) / previous) * 100).toFixed(1))
        }

        const sessions = parseInt(curr?.[0]?.value ?? "0")
        const pageviews = parseInt(curr?.[1]?.value ?? "0")
        const users = parseInt(curr?.[2]?.value ?? "0")
        const bounceRate = parseFloat((parseFloat(curr?.[3]?.value ?? "0") * 100).toFixed(1))
        const avgSessionDuration = parseFloat(parseFloat(curr?.[4]?.value ?? "0").toFixed(0))

        const prevSessions = parseInt(prev?.[0]?.value ?? "0")
        const prevPageviews = parseInt(prev?.[1]?.value ?? "0")
        const prevUsers = parseInt(prev?.[2]?.value ?? "0")
        const prevBounceRate = parseFloat((parseFloat(prev?.[3]?.value ?? "0") * 100).toFixed(1))
        const prevAvgDuration = parseFloat(parseFloat(prev?.[4]?.value ?? "0").toFixed(0))

        const topPages = (topPagesRes[0].rows ?? []).map((row) => ({
            path: row.dimensionValues?.[0]?.value ?? "/",
            views: parseInt(row.metricValues?.[0]?.value ?? "0"),
            users: parseInt(row.metricValues?.[1]?.value ?? "0"),
        }))

        return NextResponse.json({
            metrics: {
                sessions, pageviews, users, bounceRate, avgSessionDuration,
                changes: {
                    sessions: pct(sessions, prevSessions),
                    pageviews: pct(pageviews, prevPageviews),
                    users: pct(users, prevUsers),
                    bounceRate: pct(bounceRate, prevBounceRate),
                    avgSessionDuration: pct(avgSessionDuration, prevAvgDuration),
                },
            },
            topPages,
        })
    } catch (error) {
        console.error("[google-analytics] Error fetching GA data:", error)
        return NextResponse.json({ error: "Failed to fetch Google Analytics data" }, { status: 500 })
    }
}