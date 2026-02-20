import { auth, currentUser } from "@clerk/nextjs/server"
import { isAdminUser } from "@/lib/admin-auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress
    if (!isAdminUser(email)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const tier = searchParams.get("tier") || ""
    const skip = (page - 1) * limit

    const where = {
        ...(search
            ? {
                OR: [
                    { email: { contains: search, mode: "insensitive" as const } },
                    { firstName: { contains: search, mode: "insensitive" as const } },
                    { lastName: { contains: search, mode: "insensitive" as const } },
                ],
            }
            : {}),
        ...(tier ? { subscriptionTier: tier } : {}),
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                subscriptionTier: true,
                subscriptionStatus: true,
                businessName: true,
                createdAt: true,
                _count: {
                    select: { orders: true, conversations: true, automations: true },
                },
            },
        }),
        prisma.user.count({ where }),
    ])

    return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) })
}
