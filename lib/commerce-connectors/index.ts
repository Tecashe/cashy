import { ShopifyConnector } from "./shopify-connector"
import { WooCommerceConnector } from "./woocommerce-connector"
import { prisma } from "@/lib/db"

export type CommerceConnectorType = "shopify" | "woocommerce" | "manual"

export class UnifiedCommerceConnector {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  async searchProducts(query: string, maxResults = 10) {
    const results: any[] = []

    // Search Shopify if configured
    const shopifyIntegration = await prisma.integration.findFirst({
      where: { userId: this.userId, type: "shopify", isActive: true },
    })

    if (shopifyIntegration) {
      try {
        const shopify = new ShopifyConnector(shopifyIntegration.config as any)
        const shopifyProducts = await shopify.searchProducts(query, maxResults)
        results.push(
          ...shopifyProducts.map((p) => ({
            ...p,
            source: "shopify" as const,
          })),
        )
      } catch (error) {
        console.error("[Commerce] Shopify search error:", error)
      }
    }

    // Search WooCommerce if configured
    const wooIntegration = await prisma.integration.findFirst({
      where: { userId: this.userId, type: "woocommerce", isActive: true },
    })

    if (wooIntegration) {
      try {
        const woo = new WooCommerceConnector(wooIntegration.config as any)
        const wooProducts = await woo.searchProducts(query, maxResults)
        results.push(
          ...wooProducts.map((p) => ({
            ...p,
            source: "woocommerce" as const,
          })),
        )
      } catch (error) {
        console.error("[Commerce] WooCommerce search error:", error)
      }
    }

    // Search manual products from database
    const manualProducts = await prisma.product.findMany({
      where: {
        userId: this.userId,
        isAvailable: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: maxResults,
    })

    results.push(
      ...manualProducts.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        currency: "USD",
        images: p.images,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${p.id}`,
        availableForSale: p.isAvailable,
        source: "manual" as const,
      })),
    )

    // Sort by relevance (simplified - just shuffle)
    return results.slice(0, maxResults)
  }

  async getProduct(productId: string, source: CommerceConnectorType) {
    switch (source) {
      case "shopify": {
        const integration = await prisma.integration.findFirst({
          where: { userId: this.userId, type: "shopify", isActive: true },
        })
        if (!integration) throw new Error("Shopify not configured")
        const shopify = new ShopifyConnector(integration.config as any)
        return { ...(await shopify.getProduct(productId)), source: "shopify" }
      }

      case "woocommerce": {
        const integration = await prisma.integration.findFirst({
          where: { userId: this.userId, type: "woocommerce", isActive: true },
        })
        if (!integration) throw new Error("WooCommerce not configured")
        const woo = new WooCommerceConnector(integration.config as any)
        return { ...(await woo.getProduct(Number.parseInt(productId))), source: "woocommerce" }
      }

      case "manual": {
        const product = await prisma.product.findFirst({
          where: { id: productId, userId: this.userId },
        })
        if (!product) return null
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          currency: "USD",
          images: product.images,
          url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.id}`,
          availableForSale: product.isAvailable,
          source: "manual",
        }
      }

      default:
        throw new Error(`Unknown source: ${source}`)
    }
  }

  async checkAvailability(productId: string, source: CommerceConnectorType) {
    switch (source) {
      case "shopify": {
        const integration = await prisma.integration.findFirst({
          where: { userId: this.userId, type: "shopify", isActive: true },
        })
        if (!integration) throw new Error("Shopify not configured")
        const shopify = new ShopifyConnector(integration.config as any)
        return shopify.checkAvailability(productId)
      }

      case "woocommerce": {
        const integration = await prisma.integration.findFirst({
          where: { userId: this.userId, type: "woocommerce", isActive: true },
        })
        if (!integration) throw new Error("WooCommerce not configured")
        const woo = new WooCommerceConnector(integration.config as any)
        return woo.checkAvailability(Number.parseInt(productId))
      }

      case "manual": {
        const product = await prisma.product.findFirst({
          where: { id: productId, userId: this.userId },
        })
        if (!product) {
          return { available: false, stock: 0, productName: "Unknown" }
        }
        return {
          available: product.isAvailable,
          stock: product.stock,
          productName: product.name,
        }
      }

      default:
        throw new Error(`Unknown source: ${source}`)
    }
  }
}

// Server action to search products from all sources
export async function searchAllProducts(userId: string, query: string, maxResults = 10) {
  const connector = new UnifiedCommerceConnector(userId)
  return connector.searchProducts(query, maxResults)
}
