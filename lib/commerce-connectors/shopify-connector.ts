// Shopify Storefront API Connector

interface ShopifyConfig {
  storeUrl: string
  storefrontAccessToken: string
}

interface ShopifyProduct {
  id: string
  title: string
  description: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  images: Array<{
    url: string
    altText: string | null
  }>
  variants: Array<{
    id: string
    title: string
    priceV2: {
      amount: string
      currencyCode: string
    }
    availableForSale: boolean
  }>
  handle: string
}

export class ShopifyConnector {
  private config: ShopifyConfig

  constructor(config: ShopifyConfig) {
    this.config = config
  }

  private async graphqlRequest(query: string, variables: any = {}) {
    const response = await fetch(`https://${this.config.storeUrl}/api/2024-01/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": this.config.storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    })

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`)
    }

    const data = await response.json()
    if (data.errors) {
      throw new Error(`Shopify GraphQL errors: ${JSON.stringify(data.errors)}`)
    }

    return data.data
  }

  async searchProducts(query: string, maxResults = 10) {
    const graphqlQuery = `
      query SearchProducts($query: String!, $first: Int!) {
        search(query: $query, first: $first, types: PRODUCT) {
          edges {
            node {
              ... on Product {
                id
                title
                description
                handle
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 5) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      id
                      title
                      priceV2 {
                        amount
                        currencyCode
                      }
                      availableForSale
                    }
                  }
                }
              }
            }
          }
        }
      }
    `

    const data = await this.graphqlRequest(graphqlQuery, { query, first: maxResults })

    return data.search.edges.map((edge: any) => this.formatProduct(edge.node))
  }

  async getProductsByCollection(collectionHandle: string, maxResults = 10) {
    const graphqlQuery = `
      query GetCollection($handle: String!, $first: Int!) {
        collection(handle: $handle) {
          products(first: $first) {
            edges {
              node {
                id
                title
                description
                handle
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 5) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      id
                      title
                      priceV2 {
                        amount
                        currencyCode
                      }
                      availableForSale
                    }
                  }
                }
              }
            }
          }
        }
      }
    `

    const data = await this.graphqlRequest(graphqlQuery, { handle: collectionHandle, first: maxResults })

    if (!data.collection) {
      return []
    }

    return data.collection.products.edges.map((edge: any) => this.formatProduct(edge.node))
  }

  async getProduct(handle: string) {
    const graphqlQuery = `
      query GetProduct($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    `

    const data = await this.graphqlRequest(graphqlQuery, { handle })

    if (!data.productByHandle) {
      return null
    }

    return this.formatProduct(data.productByHandle)
  }

  async checkAvailability(productId: string) {
    const graphqlQuery = `
      query CheckAvailability($id: ID!) {
        product(id: $id) {
          id
          title
          availableForSale
          totalInventory
        }
      }
    `

    const data = await this.graphqlRequest(graphqlQuery, { id: productId })

    return {
      available: data.product.availableForSale,
      stock: data.product.totalInventory,
      productName: data.product.title,
    }
  }

  private formatProduct(product: any) {
    return {
      id: product.id,
      name: product.title,
      description: product.description,
      price: Math.round(Number.parseFloat(product.priceRange.minVariantPrice.amount) * 100),
      currency: product.priceRange.minVariantPrice.currencyCode,
      images: product.images.edges.map((edge: any) => edge.node.url),
      variants: product.variants.edges.map((edge: any) => edge.node),
      url: `https://${this.config.storeUrl}/products/${product.handle}`,
      handle: product.handle,
      availableForSale: product.variants.edges[0]?.node.availableForSale || false,
    }
  }
}
