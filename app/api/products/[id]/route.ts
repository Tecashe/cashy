
// // ============================================
// // API Route: /api/products/[id]/route.ts
// // ============================================
// import { NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/db"
// import { getServerSession } from "next-auth"

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession()
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const data = await request.json()

//   const product = await prisma.product.update({
//     where: {
//       id: params.id,
//       userId: session.user.id,
//     },
//     data: {
//       ...(data.name && { name: data.name }),
//       ...(data.description && { description: data.description }),
//       ...(data.price && { price: Math.round(parseFloat(data.price) * 100) }),
//       ...(data.compareAtPrice !== undefined && {
//         compareAtPrice: data.compareAtPrice ? Math.round(parseFloat(data.compareAtPrice) * 100) : null,
//       }),
//       ...(data.category && { category: data.category }),
//       ...(data.stock !== undefined && { stock: parseInt(data.stock) }),
//       ...(data.imageUrl && { imageUrl: data.imageUrl }),
//       ...(data.sku && { sku: data.sku }),
//       ...(data.tags && {
//         tags: data.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
//       }),
//       ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
//     },
//   })

//   return NextResponse.json({ product })
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession()
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   await prisma.product.delete({
//     where: {
//       id: params.id,
//       userId: session.user.id,
//     },
//   })

//   return NextResponse.json({ success: true })
// }
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/clerk"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth()

    const data = await request.json()

    const product = await prisma.product.update({
      where: {
        id: params.id,
        userId,
      },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.price && { price: Math.round(parseFloat(data.price) * 100) }),
        ...(data.compareAtPrice !== undefined && {
          compareAtPrice: data.compareAtPrice ? Math.round(parseFloat(data.compareAtPrice) * 100) : null,
        }),
        ...(data.category && { category: data.category }),
        ...(data.stock !== undefined && { stock: parseInt(data.stock) }),
        ...(data.imageUrl && { imageUrl: data.imageUrl }),
        ...(data.sku && { sku: data.sku }),
        ...(data.tags && {
          tags: data.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        }),
        ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
      },
    })

    return NextResponse.json({ product })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth()

    await prisma.product.delete({
      where: {
        id: params.id,
        userId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}