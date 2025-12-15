import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { topic, tone, length } = await request.json()

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        businessName: true,
        businessDescription: true,
        businessType: true,
      },
    })

    const businessContext = user?.businessDescription
      ? `\n\nBusiness Context: ${user?.businessName ? `${user.businessName} - ` : ""}${user.businessDescription}`
      : ""

    try {
      const lengthMap: Record<string, string> = {
        short: "1-2 sentences",
        medium: "3-5 sentences",
        long: "6+ sentences",
      }

      const prompt = `Generate 3 different Instagram captions about "${topic}" with a ${tone} tone. 
Each caption should be ${lengthMap[length] || "3-5 sentences"} long.
Include relevant emojis and 3-5 hashtags per caption.
Format each caption on its own line, separated by a blank line.
Make each caption unique and engaging.${businessContext}`

      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt,
      })

      const captions = text
        .split("\n\n")
        .filter((caption) => caption.trim().length > 0)
        .slice(0, 3)

      if (captions.length === 0) {
        throw new Error("No captions generated")
      }

      return NextResponse.json({ captions })
    } catch (aiError) {
      console.error("[v0] AI generation failed, using fallback:", aiError)

      const captions = [
        `Excited to share insights about ${topic}! 🚀 This ${tone} approach is a game-changer. #innovation #${topic.replace(/\s+/g, "")} #content`,
        `Here's what you need to know about ${topic}: It's not just a trend, it's the future! ✨ #trending #socialmedia #${topic.replace(/\s+/g, "")}`,
        `Let's talk about ${topic}. Join the conversation and share your thoughts! 💡 #community #engagement #discussion`,
      ]

      return NextResponse.json({ captions })
    }
  } catch (error) {
    console.error("[v0] Error generating caption:", error)
    return NextResponse.json({ error: "Failed to generate caption" }, { status: 500 })
  }
}