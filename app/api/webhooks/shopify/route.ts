
// ============================================
// Webhook Handler for Real-time Sync
// app/api/webhooks/shopify/route.ts
// ============================================

import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const topic = request.headers.get("X-Shopify-Topic")

    console.log(`[Shopify Webhook] Received: ${topic}`)

    // Verify webhook (in production, verify HMAC)
    // const hmac = request.headers.get('X-Shopify-Hmac-Sha256')
    // if (!verifyWebhook(hmac, body)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    // }

    switch (topic) {
      case "products/create":
      case "products/update":
        await handleProductUpdate(body)
        break

      case "products/delete":
        await handleProductDelete(body)
        break

      case "inventory_levels/update":
        await handleInventoryUpdate(body)
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Shopify Webhook] Error:", error)
    return NextResponse.json({ success: true }) // Always return 200 to Shopify
  }
}

async function handleProductUpdate(shopifyProduct: any) {
  // Find user by Shopify domain
  const integration = await prisma.integration.findFirst({
    where: {
      type: "shopify",
      config: {
        path: ["shopDomain"],
        equals: shopifyProduct.admin_graphql_api_id.split("/")[2],
      },
    },
  })

  if (!integration) return

  const variant = shopifyProduct.variants[0]

  await prisma.product.upsert({
    where: {
      userId_sku: {
        userId: integration.userId,
        sku: `shopify_${shopifyProduct.id}`,
      },
    },
    create: {
      userId: integration.userId,
      name: shopifyProduct.title,
      description: shopifyProduct.body_html || shopifyProduct.title,
      price: Math.round(parseFloat(variant.price) * 100),
      stock: variant.inventory_quantity || 0,
      isAvailable: shopifyProduct.status === "active",
      imageUrl: shopifyProduct.images[0]?.src,
      sku: `shopify_${shopifyProduct.id}`,
    },
    update: {
      name: shopifyProduct.title,
      price: Math.round(parseFloat(variant.price) * 100),
      stock: variant.inventory_quantity || 0,
      isAvailable: shopifyProduct.status === "active",
    },
  })
}

async function handleProductDelete(data: any) {
  await prisma.product.deleteMany({
    where: {
      sku: `shopify_${data.id}`,
    },
  })
}

async function handleInventoryUpdate(data: any) {
  // Update stock levels
  await prisma.product.updateMany({
    where: {
      metadata: {
        path: ["shopifyId"],
        equals: data.inventory_item_id,
      },
    },
    data: {
      stock: data.available,
    },
  })
}