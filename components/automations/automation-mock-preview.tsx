"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Verified } from "lucide-react"
import { motion } from "framer-motion"

interface InstagramMockPreviewProps {
  accountName?: string
  accountAvatar?: string
  postImage?: string
  commentText?: string
  replyText?: string
  dmMessage?: string
  type: "post" | "dm" | "story"
  selectedPosts?: Array<{ media_url: string; caption?: string }>
}

export function InstagramMockPreview({
  accountName = "your_account",
  accountAvatar,
  postImage,
  commentText,
  replyText,
  dmMessage,
  type,
  selectedPosts = [],
}: InstagramMockPreviewProps) {
  if (type === "post") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="border border-border/50 bg-background overflow-hidden shadow-2xl">
          {/* Instagram Post Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
            <Avatar className="h-8 w-8 ring-2 ring-gradient-to-br from-pink-500 via-purple-500 to-orange-500">
              <AvatarImage src={accountAvatar || "/placeholder.svg"} />
              <AvatarFallback>{accountName[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm">{accountName}</span>
                <Verified className="h-3.5 w-3.5 text-blue-500 fill-blue-500" />
              </div>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          {/* Post Images */}
          {selectedPosts.length > 0 && (
            <div className="relative aspect-square bg-muted">
              <img
                src={selectedPosts[0].media_url || "/placeholder.svg"}
                alt="Post"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4 px-4 py-3 border-b border-border/50">
            <button className="hover:text-muted-foreground transition-colors">
              <Heart className="h-6 w-6" />
            </button>
            <button className="hover:text-muted-foreground transition-colors">
              <MessageCircle className="h-6 w-6" />
            </button>
            <button className="hover:text-muted-foreground transition-colors">
              <Send className="h-6 w-6" />
            </button>
            <button className="ml-auto hover:text-muted-foreground transition-colors">
              <Bookmark className="h-6 w-6" />
            </button>
          </div>

          {/* Comments Section */}
          <div className="px-4 py-3 space-y-3">
            {commentText && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <div className="flex items-start gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs">U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <span className="font-semibold text-sm">random_user</span>{" "}
                    <span className="text-sm">{commentText}</span>
                  </div>
                </div>

                {replyText && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-start gap-2 ml-9 p-2 rounded-lg bg-primary/10 border border-primary/20"
                  >
                    <Avatar className="h-6 w-6 ring-2 ring-primary/30">
                      <AvatarImage src={accountAvatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{accountName[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <span className="font-semibold text-sm">{accountName}</span>{" "}
                      <span className="text-sm">{replyText}</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    )
  }

  if (type === "dm") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="border border-border/50 bg-background overflow-hidden shadow-2xl">
          {/* DM Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
            <Avatar className="h-8 w-8">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <span className="font-semibold text-sm">random_user</span>
            </div>
          </div>

          {/* Messages */}
          <div className="px-4 py-6 space-y-3 min-h-[300px] flex flex-col justify-end bg-muted/20">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-start"
            >
              <div className="max-w-[70%] px-4 py-2 rounded-3xl bg-muted text-sm">{commentText || "Hello! 👋"}</div>
            </motion.div>

            {dmMessage && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex justify-end"
              >
                <div className="max-w-[70%] px-4 py-2 rounded-3xl bg-primary text-primary-foreground text-sm">
                  {dmMessage}
                </div>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    )
  }

  return null
}
