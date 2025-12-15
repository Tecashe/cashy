import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prompt, style } = await request.json()

    // Using google/gemini-3-pro-image which can generate images
    // Alternatively, you can integrate with services like fal.ai, DALL-E, or Midjourney

    try {
      // Option 1: Use Gemini for image generation (if available)
      // const result = await generateText({
      //   model: 'google/gemini-3-pro-image-preview',
      //   prompt: `${prompt}, ${style} style, high quality, professional`,
      // })

      // const images = []
      // for (const file of result.files) {
      //   if (file.mediaType.startsWith('image/')) {
      //     images.push({
      //       base64: file.base64,
      //       mediaType: file.mediaType,
      //     })
      //   }
      // }

      // if (images.length > 0) {
      //   // Convert base64 to data URL
      //   const imageUrl = `data:${images[0].mediaType};base64,${images[0].base64}`
      //   return NextResponse.json({ imageUrl })
      // }

      // Option 2: Use fal.ai (recommended for production)
      // const fal = require('@fal-ai/serverless-client')
      // fal.config({ credentials: process.env.FAL_KEY })

      // const result = await fal.subscribe("fal-ai/flux/dev", {
      //   input: {
      //     prompt: `${prompt}, ${style} style`,
      //     image_size: "square_hd",
      //     num_images: 1
      //   }
      // })

      // const imageUrl = result.images[0].url
      // return NextResponse.json({ imageUrl })

      // Option 3: Use DALL-E via OpenAI (if you have OpenAI API key)
      // Note: This would require the openai package and API key
      // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      // const response = await openai.images.generate({
      //   model: "dall-e-3",
      //   prompt: `${prompt}, ${style} style`,
      //   size: "1024x1024",
      //   quality: "standard",
      //   n: 1,
      // })
      // const imageUrl = response.data[0].url
      // return NextResponse.json({ imageUrl })

      // Fallback: Return placeholder image with enhanced query
      const enhancedPrompt = `${prompt} in ${style} style`
      const imageUrl = `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(enhancedPrompt)}`

      return NextResponse.json({ imageUrl })
    } catch (aiError) {
      console.error("[v0] AI image generation failed:", aiError)

      // Fallback to placeholder
      const imageUrl = `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(prompt)}`
      return NextResponse.json({ imageUrl })
    }
  } catch (error) {
    console.error("[v0] Error generating image:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
