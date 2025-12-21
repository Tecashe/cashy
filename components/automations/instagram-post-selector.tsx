"use client"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { ImageIcon } from "lucide-react"

interface InstagramPost {
  id: string
  media_url: string
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
  caption?: string
  like_count?: number
  comments_count?: number
  timestamp: string
}

interface InstagramPostSelectorProps {
  posts: InstagramPost[]
  selectedPostIds: string[]
  onSelectionChange: (ids: string[]) => void
  multiSelect?: boolean
}

export function InstagramPostSelector({
  posts,
  selectedPostIds,
  onSelectionChange,
  multiSelect = false,
}: InstagramPostSelectorProps) {
  const handlePostClick = (postId: string) => {
    if (multiSelect) {
      if (selectedPostIds.includes(postId)) {
        onSelectionChange(selectedPostIds.filter((id) => id !== postId))
      } else {
        onSelectionChange([...selectedPostIds, postId])
      }
    } else {
      onSelectionChange([postId])
    }
  }

  if (posts.length === 0) {
    return (
      <Empty className="border border-dashed min-h-[300px]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ImageIcon />
          </EmptyMedia>
          <EmptyTitle>No posts found</EmptyTitle>
          <EmptyDescription>
            We couldn't load your Instagram posts. Please check your account connection and try again.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          {selectedPostIds.length > 0 ? `${selectedPostIds.length} selected` : "Select posts"}
        </p>
        {multiSelect && selectedPostIds.length > 0 && (
          <button
            type="button"
            onClick={() => onSelectionChange([])}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear selection
          </button>
        )}
      </div>

      <ScrollArea className="h-[400px] rounded-lg border border-border/50">
        <div className="grid grid-cols-3 gap-2 p-2">
          <AnimatePresence>
            {posts.map((post, index) => {
              const isSelected = selectedPostIds.includes(post.id)
              return (
                <motion.button
                  key={post.id}
                  type="button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePostClick(post.id)}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-lg transition-all duration-300",
                    "ring-2 ring-transparent hover:ring-primary/30",
                    isSelected && "ring-primary ring-offset-2 ring-offset-background",
                  )}
                >
                  {/* Instagram Post Image */}
                  <div className="absolute inset-0">
                    <img
                      src={post.media_url || "/placeholder.svg"}
                      alt={post.caption || "Instagram post"}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* Selection Indicator */}
                  <div
                    className={cn(
                      "absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-lg scale-100"
                        : "bg-black/30 text-white backdrop-blur-sm scale-0 group-hover:scale-100",
                    )}
                  >
                    {isSelected && <Check className="h-4 w-4" />}
                  </div>

                  {/* Media Type Badge */}
                  {post.media_type !== "IMAGE" && (
                    <Badge
                      variant="secondary"
                      className="absolute top-2 left-2 text-xs backdrop-blur-sm bg-black/50 text-white border-white/20"
                    >
                      {post.media_type === "VIDEO" ? "Video" : "Carousel"}
                    </Badge>
                  )}

                  {/* Post Stats Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-xs font-medium line-clamp-2 drop-shadow-lg">{post.caption || "No caption"}</p>
                  </div>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  )
}
