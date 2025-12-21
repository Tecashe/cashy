"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle2, Circle, ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getInstagramStories } from "@/lib/actions/instagram-media-actions"

interface Story {
  id: string
  media_url: string
  media_type: string
  timestamp: string
  thumbnail_url?: string
}

interface InstagramStorySelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accountId: string
  selectedStoryIds: string[]
  onSelectStories: (storyIds: string[]) => void
}

export function InstagramStorySelector({
  open,
  onOpenChange,
  accountId,
  selectedStoryIds,
  onSelectStories,
}: InstagramStorySelectorProps) {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedStoryIds)

  useEffect(() => {
    if (open && accountId) {
      fetchStories()
    }
  }, [open, accountId])

  useEffect(() => {
    setSelectedIds(selectedStoryIds)
  }, [selectedStoryIds])

  const fetchStories = async () => {
    setLoading(true)
    try {
      const data = await getInstagramStories(accountId)
      setStories(data)
    } catch (error) {
      console.error("Failed to fetch stories:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleStory = (storyId: string) => {
    setSelectedIds((prev) => (prev.includes(storyId) ? prev.filter((id) => id !== storyId) : [...prev, storyId]))
  }

  const handleSave = () => {
    onSelectStories(selectedIds)
    onOpenChange(false)
  }

  const filteredStories = stories.filter((story) => story.id.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500/10 to-orange-500/10 border border-pink-500/20">
              <ImageIcon className="w-5 h-5 text-pink-500" />
            </div>
            Select Instagram Stories
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">Choose which stories you want this automation to work on</p>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-secondary/50 border-0"
          />
        </div>

        {/* Stories Grid */}
        <div className="flex-1 overflow-y-auto -mx-6 px-6 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-3">
                <Spinner className="w-8 h-8 mx-auto" />
                <p className="text-sm text-muted-foreground">Loading stories...</p>
              </div>
            </div>
          ) : filteredStories.length === 0 ? (
            <Empty>
              <EmptyContent>
                <EmptyMedia variant="icon">
                  <ImageIcon className="w-6 h-6" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No Stories Found</EmptyTitle>
                  <EmptyDescription>
                    No active stories found on this account. Stories are only available for 24 hours.
                  </EmptyDescription>
                </EmptyHeader>
              </EmptyContent>
            </Empty>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4">
              <AnimatePresence>
                {filteredStories.map((story, index) => {
                  const isSelected = selectedIds.includes(story.id)
                  return (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <button
                        onClick={() => toggleStory(story.id)}
                        className={`
                          relative group w-full aspect-[9/16] rounded-xl overflow-hidden
                          transition-all duration-300
                          ${
                            isSelected
                              ? "ring-2 ring-pink-500 ring-offset-2 ring-offset-background scale-[0.98]"
                              : "hover:scale-[0.98]"
                          }
                        `}
                      >
                        <img
                          src={story.thumbnail_url || story.media_url}
                          alt="Story"
                          className="w-full h-full object-cover"
                        />

                        {/* Overlay */}
                        <div
                          className={`
                            absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20
                            transition-opacity duration-300
                            ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                          `}
                        />

                        {/* Selection Indicator */}
                        <div className="absolute top-2 right-2">
                          {isSelected ? (
                            <div className="p-1 rounded-full bg-pink-500 shadow-lg animate-in zoom-in">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          ) : (
                            <div className="p-1 rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                              <Circle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Story Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 text-left">
                          <p className="text-xs text-white/80 truncate">
                            {new Date(story.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {selectedIds.length} {selectedIds.length === 1 ? "story" : "stories"} selected
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
            >
              Save Selection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
