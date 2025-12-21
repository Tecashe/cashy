"use client"

import { motion } from "framer-motion"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface InstagramPost {
  id: string
  caption?: string
  mediaUrl?: string
  timestamp?: string
}

interface InstagramPreviewProps {
  post?: InstagramPost
  showComment?: boolean
  commentText?: string
  showReply?: boolean
  replyText?: string
}

export function InstagramPreview({
  post,
  showComment = false,
  commentText,
  showReply = false,
  replyText,
}: InstagramPreviewProps) {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-xl border border-border/50 bg-background shadow-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>IG</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">your_account</p>
            <p className="text-xs text-muted-foreground">Sponsored</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      <div className="relative aspect-square w-full bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-orange-500/10">
        {post?.mediaUrl ? (
          <img src={post.mediaUrl || "/placeholder.svg"} alt="Post" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-2 text-6xl">📷</div>
              <p className="text-sm text-muted-foreground">Post Preview</p>
            </div>
          </div>
        )}
      </div>

      <div className="border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Send className="h-6 w-6" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bookmark className="h-6 w-6" />
          </Button>
        </div>

        <p className="mt-2 text-sm font-semibold">1,234 likes</p>

        <div className="mt-2">
          <p className="text-sm">
            <span className="font-semibold">your_account</span>{" "}
            <span className="text-muted-foreground">{post?.caption || "Your post caption here..."}</span>
          </p>
        </div>

        <button className="mt-2 text-sm text-muted-foreground">View all 42 comments</button>
      </div>

      {showComment && commentText && (
        <motion.div
          className="border-b border-border/50 bg-primary/5 px-4 py-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-start gap-3">
            <Avatar className="h-7 w-7">
              <AvatarFallback>👤</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">user_commenter</span>
                <span className="ml-2 text-muted-foreground">Great post!</span>
              </p>
              <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                <span>2m</span>
                <button>Reply</button>
              </div>

              {showReply && replyText && (
                <motion.div
                  className="mt-3 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/10 p-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <Avatar className="h-6 w-6 ring-2 ring-primary/50">
                    <AvatarFallback>🤖</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold text-primary">your_account</span>
                      <span className="ml-2">{replyText}</span>
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-primary">
                      <span className="font-medium">Automated Reply ✨</span>
                      <span>Just now</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <div className="px-4 py-3">
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full bg-transparent text-sm outline-none"
          disabled
        />
      </div>
    </motion.div>
  )
}
