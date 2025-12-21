"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon, X, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getInstagramPostsByIds } from "@/lib/actions/instagram-media-actions"

interface Post {
  id: string
  media_url: string
  caption?: string
  media_type: string
  permalink?: string
}

interface SelectedPostsPreviewProps {
  postIds: string[]
  accountId: string
  onRemove?: (postId: string) => void
}

export function SelectedPostsPreview({ postIds, accountId, onRemove }: SelectedPostsPreviewProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (postIds.length > 0 && accountId) {
      fetchPosts()
    } else {
      setPosts([])
    }
  }, [postIds, accountId])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const fetchedPosts = await getInstagramPostsByIds(accountId, postIds)
      setPosts(fetchedPosts)
    } catch (error) {
      console.error("Failed to fetch posts:", error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  if (postIds.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <ImageIcon className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium">Selected Posts</p>
            <p className="text-xs text-muted-foreground">
              {postIds.length} {postIds.length === 1 ? "post" : "posts"} selected
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
            >
              <img
                src={post.media_url || "/placeholder.svg"}
                alt={post.caption?.substring(0, 50)}
                className="w-full h-full object-cover"
              />

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {post.permalink && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => window.open(post.permalink, "_blank")}
                    className="h-8 px-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}
                {onRemove && (
                  <Button size="sm" variant="destructive" onClick={() => onRemove(post.id)} className="h-8 px-2">
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
