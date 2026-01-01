// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Loader2, ImageIcon, Video } from "lucide-react"
// import { getInstagramPosts, getInstagramStories } from "@/lib/actions/instagram-media-actions"
// import { cn } from "@/lib/utils"

// interface Media {
//   id: string
//   caption: string
//   mediaType: string
//   mediaUrl: string
//   thumbnailUrl?: string
//   permalink?: string
//   timestamp: string
// }

// interface PostStorySelectorProps {
//   accountId: string
//   type: "post" | "story"
//   selectedId?: string
//   onSelect: (media: Media) => void
// }

// export function PostStorySelector({ accountId, type, selectedId, onSelect }: PostStorySelectorProps) {
//   const [open, setOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [media, setMedia] = useState<Media[]>([])
//   const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)

//   useEffect(() => {
//     if (open && accountId) {
//       loadMedia()
//     }
//   }, [open, accountId])

//   const loadMedia = async () => {
//     setLoading(true)
//     try {
//       const data = type === "post" ? await getInstagramPosts(accountId) : await getInstagramStories(accountId)
//       setMedia(data)
//     } catch (error) {
//       console.error(`Failed to load ${type}s:`, error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSelect = (item: Media) => {
//     setSelectedMedia(item)
//     onSelect(item)
//     setOpen(false)
//   }

//   const getSelectedCaption = () => {
//     if (!selectedId) return `Select a ${type}`
//     const selected = media.find((m) => m.id === selectedId)
//     return selected?.caption.substring(0, 30) + "..." || `${type} selected`
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="w-full justify-start bg-transparent">
//           {getSelectedCaption()}
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>Select {type === "post" ? "a Post" : "a Story"}</DialogTitle>
//         </DialogHeader>
//         <ScrollArea className="h-[500px] pr-4">
//           {loading ? (
//             <div className="flex items-center justify-center py-12">
//               <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//             </div>
//           ) : media.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12 text-center">
//               <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
//               <p className="text-sm text-muted-foreground">
//                 No {type}s found. Make sure you have {type}s on your Instagram account.
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 gap-4">
//               {media.map((item) => (
//                 <button
//                   key={item.id}
//                   onClick={() => handleSelect(item)}
//                   className={cn(
//                     "relative rounded-lg overflow-hidden border-2 transition-all hover:scale-[1.02]",
//                     selectedId === item.id ? "border-primary ring-2 ring-primary" : "border-transparent",
//                   )}
//                 >
//                   <div className="aspect-square relative bg-muted">
//                     {item.mediaType === "VIDEO" ? (
//                       <>
//                         <img
//                           src={item.thumbnailUrl || item.mediaUrl}
//                           alt={item.caption}
//                           className="w-full h-full object-cover"
//                         />
//                         <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//                           <Video className="h-12 w-12 text-white" />
//                         </div>
//                       </>
//                     ) : (
//                       <img
//                         src={item.thumbnailUrl || item.mediaUrl}
//                         alt={item.caption}
//                         className="w-full h-full object-cover"
//                       />
//                     )}
//                   </div>
//                   <div className="p-2 bg-card">
//                     <p className="text-xs text-left line-clamp-2">{item.caption}</p>
//                     <p className="text-xs text-muted-foreground mt-1">
//                       {new Date(item.timestamp).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   )
// }
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ImageIcon, Video, Loader2 } from "lucide-react"

interface InstagramMediaItem {
  id: string
  media_type: string
  media_url: string
  thumbnail_url?: string
  timestamp: string
  caption?: string
  permalink?: string
}

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
  type: string
  selectedId: string
  onSelect: (media: Media) => void
}

const PostStorySelector: React.FC<PostStorySelectorProps> = ({ accountId, type, selectedId, onSelect }) => {
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
      const response = await fetch(`/api/instagram/media?accountId=${accountId}&type=${type}`)
      const data = await response.json()

      const formattedMedia: Media[] = data.map((item: any) => ({
        id: item.id,
        caption: item.caption || "",
        mediaType: item.media_type,
        mediaUrl: item.media_url,
        thumbnailUrl: item.thumbnail_url,
        permalink: item.permalink,
        timestamp: item.timestamp,
      }))

      setMedia(formattedMedia)
    } catch (error) {
      console.error(`[v0] Failed to load ${type}s:`, error)
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
    if (!selectedId && !selectedMedia) return `Select a ${type}`
    const selected = selectedMedia || media.find((m) => m.id === selectedId)
    if (!selected) return `Select a ${type}`
    return (selected.caption?.substring(0, 30) || "Media") + (selected.caption?.length > 30 ? "..." : "")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 bg-transparent overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {type === "post" ? <ImageIcon className="h-4 w-4 shrink-0" /> : <Video className="h-4 w-4 shrink-0" />}
          {getSelectedCaption()}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "post" ? <ImageIcon className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            Select {type === "post" ? "a Post" : "a Story"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4 -mr-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground animate-pulse">Fetching your {type}s...</p>
            </div>
          ) : media.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
              <ImageIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-base font-medium text-muted-foreground">No {type}s found</p>
              <p className="text-xs text-muted-foreground/60 max-w-[250px] mt-1">
                Share some {type}s on your Instagram account to see them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-1">
              {media.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "group relative aspect-square rounded-lg overflow-hidden border-2 transition-all active:scale-95",
                    selectedId === item.id || selectedMedia?.id === item.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-primary/50",
                  )}
                >
                  <img
                    src={item.thumbnailUrl || item.mediaUrl}
                    alt={item.caption}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  {item.mediaType === "VIDEO" && (
                    <div className="absolute top-2 right-2 p-1 bg-black/50 backdrop-blur-sm rounded-md">
                      <Video className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                    <p className="text-[10px] text-white line-clamp-2 leading-tight">{item.caption || "No caption"}</p>
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

export default PostStorySelector
