import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ ticketId: string }> }
) {
    try {
        await requireAdmin()
        const { ticketId } = await params

        const messages = await prisma.ticketMessage.findMany({
            where: { ticketId },
            orderBy: { createdAt: "asc" },
        })

        return NextResponse.json({
            messages: messages.map((m) => ({
                ...m,
                createdAt: m.createdAt.toISOString(),
            })),
        })
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ ticketId: string }> }
) {
    try {
        const admin = await requireAdmin()
        const { ticketId } = await params
        const { content, isInternal } = await req.json()

        const message = await prisma.ticketMessage.create({
            data: {
                ticketId,
                senderId: admin.clerkId,
                senderRole: admin.role,
                content,
                isInternal: isInternal || false,
            },
        })

        // Update ticket status to in_progress if open
        await prisma.supportTicket.updateMany({
            where: { id: ticketId, status: "open" },
            data: { status: "in_progress", assignedTo: admin.clerkId },
        })

        return NextResponse.json({
            message: { ...message, createdAt: message.createdAt.toISOString() },
        })
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}
