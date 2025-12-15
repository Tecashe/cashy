"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, ImageIcon, Video } from "lucide-react"
import { getInstagramPosts, getInstagramStories } from "@/lib/actions/instagram-media-actions"
import { cn } from "@/lib/utils"

interface Media {
  id: string
  caption: string
  mediaType: string
  mediaUrl: string
  thumbnailUrl?: string
  permalink?: string
  timestamp: string
}

interface PostStorySelectorProps {
  accountId: string
  type: "post" | "story"
  selectedId?: string
  onSelect: (media: Media) => void
}

export function PostStorySelector({ accountId, type, selectedId, onSelect }: PostStorySelectorProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [media, setMedia] = useState<Media[]>([])
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)

  useEffect(() => {
    if (open && accountId) {
      loadMedia()
    }
  }, [open, accountId])

  const loadMedia = async () => {
    setLoading(true)
    try {
      const data = type === "post" ? await getInstagramPosts(accountId) : await getInstagramStories(accountId)
      setMedia(data)
    } catch (error) {
      console.error(`Failed to load ${type}s:`, error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (item: Media) => {
    setSelectedMedia(item)
    onSelect(item)
    setOpen(false)
  }

  const getSelectedCaption = () => {
    if (!selectedId) return `Select a ${type}`
    const selected = media.find((m) => m.id === selectedId)
    return selected?.caption.substring(0, 30) + "..." || `${type} selected`
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start bg-transparent">
          {getSelectedCaption()}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select {type === "post" ? "a Post" : "a Story"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : media.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                No {type}s found. Make sure you have {type}s on your Instagram account.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {media.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "relative rounded-lg overflow-hidden border-2 transition-all hover:scale-[1.02]",
                    selectedId === item.id ? "border-primary ring-2 ring-primary" : "border-transparent",
                  )}
                >
                  <div className="aspect-square relative bg-muted">
                    {item.mediaType === "VIDEO" ? (
                      <>
                        <img
                          src={item.thumbnailUrl || item.mediaUrl}
                          alt={item.caption}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Video className="h-12 w-12 text-white" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={item.thumbnailUrl || item.mediaUrl}
                        alt={item.caption}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-2 bg-card">
                    <p className="text-xs text-left line-clamp-2">{item.caption}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
