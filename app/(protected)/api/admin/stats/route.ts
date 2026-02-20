import { auth, currentUser } from "@clerk/nextjs/server"
import { isAdminUser } from "@/lib/admin-auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress
    if (!isAdminUser(email)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const [
        totalUsers,
        totalOrders,
        activeSubscriptions,
        recentPayments,
        salesUploads,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.order.count(),
        prisma.subscription.count({ where: { status: "active" } }),
        prisma.payment.findMany({
            where: { status: "succeeded" },
            select: { amount: true, currency: true },
        }),
        prisma.salesUploadItem.findMany({
            select: { amount: true, currency: true },
        }),
    ])

    const last30DaysPayments = await prisma.payment.findMany({
        where: {
            status: "succeeded",
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        select: { amount: true },
    })

    const mrr = last30DaysPayments.reduce((sum, p) => sum + p.amount, 0) / 100

    const totalRevenue =
        recentPayments.reduce((sum, p) => sum + p.amount, 0) / 100 +
        salesUploads.reduce((sum, s) => sum + s.amount, 0)

    const newUsersThisWeek = await prisma.user.count({
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    })

    const tierBreakdown = await prisma.user.groupBy({
        by: ["subscriptionTier"],
        _count: { id: true },
    })

    const recentUsers = await prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            subscriptionTier: true,
            createdAt: true,
        },
    })

    return NextResponse.json({
        stats: {
            totalUsers,
            totalOrders,
            activeSubscriptions,
            mrr,
            totalRevenue,
            newUsersThisWeek,
        },
        tierBreakdown,
        recentUsers,
    })
}
