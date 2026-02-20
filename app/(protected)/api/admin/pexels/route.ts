import { auth, currentUser } from "@clerk/nextjs/server"
import { isAdminUser } from "@/lib/admin-auth"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress
    if (!isAdminUser(email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const pexelsKey = process.env.PEXELS_API_KEY
    if (!pexelsKey) {
        return NextResponse.json({ error: "Pexels API key not configured", photos: [] })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query") || "business"
    const page = searchParams.get("page") || "1"

    const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20&page=${page}`,
        { headers: { Authorization: pexelsKey } }
    )

    if (!response.ok) {
        return NextResponse.json({ error: "Pexels request failed", photos: [] }, { status: 502 })
    }

    const data = await response.json()
    return NextResponse.json(data)
}
