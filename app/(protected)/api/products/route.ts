import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/clerk"

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth()

    const { searchParams } = request.nextUrl
    const search = searchParams.get("search")
    const category = searchParams.get("category")

    const products = await prisma.product.findMany({
      where: {
        userId,
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(category && category !== "all" && { category }),
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth()

    const data = await request.json()

    const product = await prisma.product.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        price: Math.round(parseFloat(data.price) * 100),
        compareAtPrice: data.compareAtPrice ? Math.round(parseFloat(data.compareAtPrice) * 100) : null,
        category: data.category,
        stock: parseInt(data.stock),
        imageUrl: data.imageUrl,
        sku: data.sku,
        tags: data.tags?.split(",").map((t: string) => t.trim()).filter(Boolean) || [],
        isAvailable: true,
      },
    })

    return NextResponse.json({ product })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}