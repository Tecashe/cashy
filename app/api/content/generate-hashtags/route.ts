import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { topic } = await request.json()

    try {
      const prompt = `Generate 15-20 relevant Instagram hashtags for content about "${topic}".
Include a mix of:
- 3-5 highly popular hashtags (500k+ posts)
- 5-7 medium popularity hashtags (50k-500k posts)
- 5-7 niche hashtags (under 50k posts)

Format: Return only the hashtags, one per line, each starting with #.
No explanations or categories, just the hashtags.`

      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt,
      })

      const hashtags = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("#"))
        .slice(0, 20)

      if (hashtags.length === 0) {
        throw new Error("No hashtags generated")
      }

      return NextResponse.json({ hashtags })
    } catch (aiError) {
      console.error("[v0] AI hashtag generation failed, using fallback:", aiError)

      const hashtags = [
        "#instagram",
        "#instagood",
        "#instadaily",
        "#socialmedia",
        "#marketing",
        "#digitalmarketing",
        "#content",
        "#contentcreator",
        "#engagement",
        "#growth",
        "#business",
        "#entrepreneur",
        "#success",
        "#motivation",
        "#inspiration",
      ]

      return NextResponse.json({ hashtags })
    }
  } catch (error) {
    console.error("[v0] Error generating hashtags:", error)
    return NextResponse.json({ error: "Failed to generate hashtags" }, { status: 500 })
  }
}