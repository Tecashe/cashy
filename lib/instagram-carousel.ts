
export interface CarouselCard {
  title: string
  subtitle?: string
  image_url: string
  buttons: {
    type: "web_url" | "postback"
    url?: string
    title: string
    payload?: string
  }[]
}

/**
 * Creates carousel cards from a list of products
 */
export function createProductCarouselCards(products: any[]): CarouselCard[] {
  return products.map((product) => ({
    title: product.name,
    subtitle: product.description || `$${product.price}`,
    image_url: product.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    buttons: [
      {
        type: "web_url",
        url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.id}`,
        title: "View Product",
      },
    ],
  }))
}

/**
 * Formats a list of products into an Instagram Carousel (Generic Template)
 */
export function formatInstagramCarousel(cards: CarouselCard[]) {
  return {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: cards.slice(0, 10).map((card) => ({
          title: card.title.substring(0, 80),
          subtitle: card.subtitle?.substring(0, 80),
          image_url: card.image_url,
          default_action: {
            type: "web_url",
            url: card.buttons[0]?.url || "",
            webview_height_ratio: "full",
          },
          buttons: card.buttons.map((btn) => ({
            type: btn.type,
            url: btn.url,
            title: btn.title.substring(0, 20),
            payload: btn.payload,
          })),
        })),
      },
    },
  }
}
