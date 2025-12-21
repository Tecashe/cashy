"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@/components/ui/empty"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, CheckCircle2, Circle, ImageIcon, Video, Layers } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getInstagramPosts } from "@/lib/actions/instagram-media-actions"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Post {
  id: string
  media_url: string
  media_type: string
  caption?: string
  permalink?: string
  timestamp: string
  thumbnail_url?: string
}

interface InstagramPostSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accountId: string
  selectedPostIds: string[]
  onSelectPosts: (postIds: string[]) => void
}

export function InstagramPostSelector({
  open,
  onOpenChange,
  accountId,
  selectedPostIds,
  onSelectPosts,
}: InstagramPostSelectorProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedPostIds)

  useEffect(() => {
    if (open && accountId) {
      fetchPosts()
    }
  }, [open, accountId])

  useEffect(() => {
    setSelectedIds(selectedPostIds)
  }, [selectedPostIds])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const data = await getInstagramPosts(accountId)
      setPosts(data)
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const togglePost = (postId: string) => {
    setSelectedIds((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  const handleSave = () => {
    onSelectPosts(selectedIds)
    onOpenChange(false)
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case "VIDEO":
        return <Video className="w-3 h-3" />
      case "CAROUSEL_ALBUM":
        return <Layers className="w-3 h-3" />
      default:
        return <ImageIcon className="w-3 h-3" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <ImageIcon className="w-5 h-5 text-blue-500" />
            </div>
            Select Instagram Posts
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">Choose which posts you want this automation to work on</p>
        </DialogHeader>

        <div className="px-6 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search posts by caption or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-secondary/50 border-0"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 py-4 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-3">
                <Spinner className="w-8 h-8 mx-auto" />
                <p className="text-sm text-muted-foreground">Loading your posts...</p>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <Empty>
              <EmptyContent>
                <EmptyMedia variant="icon">
                  <ImageIcon className="w-6 h-6" />
                </EmptyMedia>
              </EmptyContent>
              <EmptyHeader>
                <EmptyTitle>{searchQuery ? "No posts found" : "No Posts Available"}</EmptyTitle>
                <EmptyDescription>
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "No posts found on this account. Create some posts first."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <AnimatePresence>
                {filteredPosts.map((post, index) => {
                  const isSelected = selectedIds.includes(post.id)
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <button
                        onClick={() => togglePost(post.id)}
                        className={cn(
                          "relative group w-full aspect-square rounded-xl overflow-hidden transition-all duration-300",
                          isSelected
                            ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-background scale-[0.98]"
                            : "hover:scale-[0.98]",
                        )}
                      >
                        {/* Post Image */}
                        <img
                          src={post.thumbnail_url || post.media_url || "/placeholder.svg"}
                          alt={post.caption?.substring(0, 50)}
                          className="w-full h-full object-cover"
                        />

                        {/* Overlay */}
                        <div
                          className={cn(
                            "absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 transition-opacity duration-300",
                            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                          )}
                        />

                        {/* Selection Indicator */}
                        <div className="absolute top-2 right-2">
                          {isSelected ? (
                            <div className="p-1 rounded-full bg-blue-500 shadow-lg animate-in zoom-in">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          ) : (
                            <div className="p-1 rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                              <Circle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Media Type Badge */}
                        {post.media_type !== "IMAGE" && (
                          <Badge
                            variant="secondary"
                            className="absolute top-2 left-2 text-xs backdrop-blur-sm bg-black/60 text-white border-white/20 flex items-center gap-1"
                          >
                            {getMediaIcon(post.media_type)}
                            {post.media_type === "VIDEO" ? "Video" : "Carousel"}
                          </Badge>
                        )}

                        {/* Post Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                          <p className="text-xs text-white/90 line-clamp-2 drop-shadow-lg">
                            {post.caption || "No caption"}
                          </p>
                          <p className="text-xs text-white/70 mt-1">{new Date(post.timestamp).toLocaleDateString()}</p>
                        </div>
                      </button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="border-t border-border/50 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              {selectedIds.length} {selectedIds.length === 1 ? "post" : "posts"} selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                Save Selection
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
