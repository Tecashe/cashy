import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ ticketId: string }> }
) {
    try {
        const user = await currentUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { ticketId } = await params

        const messages = await prisma.ticketMessage.findMany({
            where: { ticketId, isInternal: false },
            orderBy: { createdAt: "asc" },
        })

        return NextResponse.json({
            messages: messages.map((m) => ({
                ...m,
                createdAt: m.createdAt.toISOString(),
            })),
        })
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ ticketId: string }> }
) {
    try {
        const user = await currentUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { ticketId } = await params
        const { content } = await req.json()

        const message = await prisma.ticketMessage.create({
            data: {
                ticketId,
                senderId: user.id,
                senderRole: "USER",
                content,
            },
        })

        return NextResponse.json({
            message: { ...message, createdAt: message.createdAt.toISOString() },
        })
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
