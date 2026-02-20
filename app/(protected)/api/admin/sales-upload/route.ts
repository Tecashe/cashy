import { auth, currentUser } from "@clerk/nextjs/server"
import { isAdminUser } from "@/lib/admin-auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress
    if (!isAdminUser(email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await req.json()
    const { fileName, rows } = body as {
        fileName: string
        rows: Array<{
            date: string
            amount: number
            description?: string
            product?: string
            customer?: string
            currency?: string
            quantity?: number
        }>
    }

    if (!rows || rows.length === 0) {
        return NextResponse.json({ error: "No rows provided" }, { status: 400 })
    }

    const upload = await prisma.salesUpload.create({
        data: {
            userId,
            fileName,
            rowCount: rows.length,
            status: "processed",
        },
    })

    await prisma.salesUploadItem.createMany({
        data: rows.map((row) => ({
            uploadId: upload.id,
            date: new Date(row.date),
            amount: Number(row.amount),
            description: row.description || null,
            product: row.product || null,
            customer: row.customer || null,
            currency: row.currency || "USD",
            quantity: row.quantity || 1,
        })),
    })

    return NextResponse.json({ success: true, uploadId: upload.id, count: rows.length })
}

export async function GET() {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress
    if (!isAdminUser(email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const uploads = await prisma.salesUpload.findMany({
        orderBy: { uploadedAt: "desc" },
        select: {
            id: true,
            fileName: true,
            uploadedAt: true,
            rowCount: true,
            status: true,
            notes: true,
        },
    })

    return NextResponse.json({ uploads })
}

export async function DELETE(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress
    if (!isAdminUser(email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const uploadId = searchParams.get("id")
    if (!uploadId) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    await prisma.salesUpload.delete({ where: { id: uploadId } })
    return NextResponse.json({ success: true })
}
