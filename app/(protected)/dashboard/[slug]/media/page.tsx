import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, MessageSquare, Heart } from "lucide-react"
import Link from "next/link"

// Simulated Instagram media data
async function getInstagramMedia(userId: string) {
  return [
    {
      id: "1",
      mediaUrl: "/instagram-fashion-post.png",
      caption: "New collection drop! 🔥",
      likes: 1234,
      comments: 89,
      timestamp: new Date("2024-03-01"),
      type: "image",
    },
    {
      id: "2",
      mediaUrl: "/instagram-product-showcase.jpg",
      caption: "Behind the scenes of our latest photoshoot 📸",
      likes: 892,
      comments: 56,
      timestamp: new Date("2024-02-28"),
      type: "image",
    },
    {
      id: "3",
      mediaUrl: "/instagram-lifestyle-content.jpg",
      caption: "Weekend vibes ✨",
      likes: 2103,
      comments: 145,
      timestamp: new Date("2024-02-26"),
      type: "image",
    },
    {
      id: "4",
      mediaUrl: "/instagram-promo-post.png",
      caption: "Limited time offer! Shop now 🛍️",
      likes: 1567,
      comments: 234,
      timestamp: new Date("2024-02-24"),
      type: "image",
    },
    {
      id: "5",
      mediaUrl: "/instagram-brand-story.jpg",
      caption: "Our journey so far... 🚀",
      likes: 3421,
      comments: 456,
      timestamp: new Date("2024-02-22"),
      type: "image",
    },
    {
      id: "6",
      mediaUrl: "/instagram-engagement-post.jpg",
      caption: "What's your favorite? Comment below! 👇",
      likes: 998,
      comments: 567,
      timestamp: new Date("2024-02-20"),
      type: "image",
    },
  ]
}

export default async function MediaPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const media = await getInstagramMedia(userId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Instagram Media</h1>
        <p className="text-slate-600 dark:text-slate-400">Select posts to automate comment responses</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((post) => (
          <Card key={post.id} className="glass-card overflow-hidden">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={post.mediaUrl || "/placeholder.svg"}
                alt="Instagram post"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-black/50 text-white backdrop-blur">
                  <ImageIcon className="mr-1 h-3 w-3" />
                  {post.type}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-3">
              <CardDescription className="line-clamp-2">{post.caption}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {post.likes.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {post.comments}
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                <Link href={`/media/${post.id}/automate`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Setup Comment Automation
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
