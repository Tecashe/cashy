"use server"

import { auth } from "@clerk/nextjs/server"
import { UnifiedCommerceConnector } from "@/lib/commerce-connectors"

export async function searchProductsAcrossCatalogs(query: string, maxResults = 10) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const connector = new UnifiedCommerceConnector(userId)
  return connector.searchProducts(query, maxResults)
}

export async function getProductDetails(productId: string, source: "shopify" | "woocommerce" | "manual") {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const connector = new UnifiedCommerceConnector(userId)
  return connector.getProduct(productId, source)
}

export async function checkProductAvailability(productId: string, source: "shopify" | "woocommerce" | "manual") {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const connector = new UnifiedCommerceConnector(userId)
  return connector.checkAvailability(productId, source)
}
