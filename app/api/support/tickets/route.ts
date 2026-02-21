import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"

export async function GET() {
    try {
        const user = await currentUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } })
        if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

        const tickets = await prisma.supportTicket.findMany({
            where: { userId: dbUser.id },
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { messages: true } } },
        })

        return NextResponse.json({
            tickets: tickets.map((t) => ({
                ...t,
                createdAt: t.createdAt.toISOString(),
                updatedAt: t.updatedAt.toISOString(),
                resolvedAt: t.resolvedAt?.toISOString() || null,
            })),
        })
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const user = await currentUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } })
        if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

        const { subject, description, category, priority } = await req.json()

        const ticket = await prisma.supportTicket.create({
            data: {
                userId: dbUser.id,
                customerName: `${dbUser.firstName || ""} ${dbUser.lastName || ""}`.trim() || dbUser.email,
                subject,
                description,
                category: category || "general",
                priority: priority || "medium",
            },
            include: { _count: { select: { messages: true } } },
        })

        return NextResponse.json({
            ticket: {
                ...ticket,
                createdAt: ticket.createdAt.toISOString(),
                updatedAt: ticket.updatedAt.toISOString(),
            },
        })
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
