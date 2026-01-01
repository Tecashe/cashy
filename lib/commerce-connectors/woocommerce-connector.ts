// WooCommerce REST API Connector

interface WooCommerceConfig {
  storeUrl: string
  consumerKey: string
  consumerSecret: string
}

interface WooCommerceProduct {
  id: number
  name: string
  description: string
  short_description: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  stock_status: string
  stock_quantity: number | null
  images: Array<{
    src: string
    alt: string
  }>
  categories: Array<{
    id: number
    name: string
  }>
  permalink: string
}

export class WooCommerceConnector {
  private config: WooCommerceConfig
  private baseUrl: string

  constructor(config: WooCommerceConfig) {
    this.config = config
    this.baseUrl = `${config.storeUrl}/wp-json/wc/v3`
  }

  private getAuthHeader() {
    const credentials = Buffer.from(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString("base64")
    return `Basic ${credentials}`
  }

  private async request(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: this.getAuthHeader(),
      },
    })

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.statusText}`)
    }

    return response.json()
  }

  async searchProducts(query: string, maxResults = 10) {
    const products = await this.request("/products", {
      search: query,
      per_page: maxResults,
      status: "publish",
    })

    return products.map((product: WooCommerceProduct) => this.formatProduct(product))
  }

  async getProductsByCategory(categoryId: number, maxResults = 10) {
    const products = await this.request("/products", {
      category: categoryId,
      per_page: maxResults,
      status: "publish",
    })

    return products.map((product: WooCommerceProduct) => this.formatProduct(product))
  }

  async getProduct(productId: number) {
    const product = await this.request(`/products/${productId}`)
    return this.formatProduct(product)
  }

  async checkAvailability(productId: number) {
    const product = await this.request(`/products/${productId}`)

    return {
      available: product.stock_status === "instock",
      stock: product.stock_quantity || 0,
      productName: product.name,
    }
  }

  async getCategories() {
    const categories = await this.request("/products/categories", {
      per_page: 100,
    })

    return categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      count: cat.count,
    }))
  }

  private formatProduct(product: WooCommerceProduct) {
    return {
      id: product.id.toString(),
      name: product.name,
      description: product.description || product.short_description,
      price: Math.round(Number.parseFloat(product.price) * 100),
      currency: "USD", // WooCommerce doesn't return currency in product endpoint
      images: product.images.map((img) => img.src),
      categories: product.categories.map((cat) => cat.name),
      url: product.permalink,
      availableForSale: product.stock_status === "instock",
      onSale: product.on_sale,
      stockQuantity: product.stock_quantity,
    }
  }
}
