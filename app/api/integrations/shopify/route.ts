// app/api/integrations/shopify/route.ts

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { encrypt, decrypt } from "@/lib/encrypt"

// POST: Connect Shopify & Sync Product
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { shopDomain, accessToken } = await request.json()

    // Test connection
    const testResponse = await fetch(`https://${shopDomain}/admin/api/2024-01/shop.json`, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
      },
    })

    if (!testResponse.ok) {
      return NextResponse.json({ error: "Invalid Shopify credentials" }, { status: 400 })
    }

    const shopData = await testResponse.json()

    // Store integration
    await prisma.integration.upsert({
      where: {
        userId_type: {
          userId: user.id,
          type: "shopify",
        },
      },
      create: {
        userId: user.id,
        type: "shopify",
        name: "Shopify",
        isActive: true,
        config: {
          encrypted: encrypt(accessToken),
          shopDomain,
          shopName: shopData.shop.name,
        },
      },
      update: {
        isActive: true,
        config: {
          encrypted: encrypt(accessToken),
          shopDomain,
          shopName: shopData.shop.name,
        },
      },
    })

    // Immediately sync products
    const productCount = await syncShopifyProducts(user.id, shopDomain, accessToken)

    return NextResponse.json({
      success: true,
      shop: shopData.shop,
      productsImported: productCount,
    })
  } catch (error) {
    console.error("[Shopify] Connection error:", error)
    return NextResponse.json({ error: "Failed to connect Shopify" }, { status: 500 })
  }
}

// GET: Trigger manual sync
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const integration = await prisma.integration.findFirst({
      where: {
        userId: user.id,
        type: "shopify",
        isActive: true,
      },
    })

    if (!integration) {
      return NextResponse.json({ error: "Shopify not connected" }, { status: 400 })
    }

    const config = integration.config as any
    const accessToken = decrypt(config.encrypted)
    const shopDomain = config.shopDomain

    const productCount = await syncShopifyProducts(user.id, shopDomain, accessToken)

    return NextResponse.json({
      success: true,
      productsImported: productCount,
    })
  } catch (error) {
    console.error("[Shopify] Sync error:", error)
    return NextResponse.json({ error: "Failed to sync products" }, { status: 500 })
  }
}

// ============================================
// Product Sync Function
// ============================================

async function syncShopifyProducts(
  userId: string,
  shopDomain: string,
  accessToken: string
): Promise<number> {
  let allProducts: any[] = []
  let hasNextPage = true
  let pageInfo = ""

  // Fetch all products with pagination
  while (hasNextPage) {
    const url = pageInfo
      ? `https://${shopDomain}/admin/api/2024-01/products.json?limit=250&page_info=${pageInfo}`
      : `https://${shopDomain}/admin/api/2024-01/products.json?limit=250`

    const response = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch Shopify products")
    }

    const data = await response.json()
    allProducts = [...allProducts, ...data.products]

    // Check for next page
    const linkHeader = response.headers.get("Link")
    if (linkHeader && linkHeader.includes('rel="next"')) {
      const match = linkHeader.match(/page_info=([^>]+)>; rel="next"/)
      pageInfo = match ? match[1] : ""
    } else {
      hasNextPage = false
    }
  }

  console.log(`[Shopify] Fetched ${allProducts.length} products`)

  // Sync products to database
  for (const shopifyProduct of allProducts) {
    const variant = shopifyProduct.variants[0] // Use first variant

    await prisma.product.upsert({
      where: {
        userId_sku: {
          userId,
          sku: `shopify_${shopifyProduct.id}`,
        },
      },
      create: {
        userId,
        name: shopifyProduct.title,
        description: shopifyProduct.body_html || shopifyProduct.title,
        price: Math.round(parseFloat(variant.price) * 100),
        compareAtPrice: variant.compare_at_price
          ? Math.round(parseFloat(variant.compare_at_price) * 100)
          : null,
        imageUrl: shopifyProduct.images[0]?.src,
        images: shopifyProduct.images.map((img: any) => img.src),
        category: shopifyProduct.product_type || "Uncategorized",
        tags: shopifyProduct.tags.split(", "),
        sku: `shopify_${shopifyProduct.id}`,
        barcode: variant.barcode || null,
        stock: variant.inventory_quantity || 0,
        isAvailable: shopifyProduct.status === "active",
        hasVariants: shopifyProduct.variants.length > 1,
        metadata: {
          shopifyId: shopifyProduct.id,
          shopifyHandle: shopifyProduct.handle,
          vendor: shopifyProduct.vendor,
        },
      },
      update: {
        name: shopifyProduct.title,
        description: shopifyProduct.body_html || shopifyProduct.title,
        price: Math.round(parseFloat(variant.price) * 100),
        compareAtPrice: variant.compare_at_price
          ? Math.round(parseFloat(variant.compare_at_price) * 100)
          : null,
        imageUrl: shopifyProduct.images[0]?.src,
        images: shopifyProduct.images.map((img: any) => img.src),
        category: shopifyProduct.product_type || "Uncategorized",
        tags: shopifyProduct.tags.split(", "),
        stock: variant.inventory_quantity || 0,
        isAvailable: shopifyProduct.status === "active",
        metadata: {
          shopifyId: shopifyProduct.id,
          shopifyHandle: shopifyProduct.handle,
          vendor: shopifyProduct.vendor,
        },
      },
    })

    // Import variants if product has multiple
    if (shopifyProduct.variants.length > 1) {
      for (const variant of shopifyProduct.variants) {
        await prisma.productVariant.upsert({
          where: {
            productId_sku: {
              productId: `shopify_${shopifyProduct.id}`,
              sku: variant.sku || `variant_${variant.id}`,
            },
          },
          create: {
            productId: `shopify_${shopifyProduct.id}`,
            name: variant.title,
            price: Math.round(parseFloat(variant.price) * 100),
            sku: variant.sku || `variant_${variant.id}`,
            stock: variant.inventory_quantity || 0,
            options: {
              size: variant.option1,
              color: variant.option2,
              style: variant.option3,
            },
          },
          update: {
            name: variant.title,
            price: Math.round(parseFloat(variant.price) * 100),
            stock: variant.inventory_quantity || 0,
          },
        })
      }
    }
  }

  return allProducts.length
}
