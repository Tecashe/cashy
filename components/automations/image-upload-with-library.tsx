"use client"

import { useState } from "react"
import { upload } from "@vercel/blob/client"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Loader2, ImageIcon, Check } from "lucide-react"
import { toast } from "sonner"
import { useEffect } from "react"

interface ImageUploadWithLibraryProps {
  value: string
  onChange: (url: string) => void
}

export function ImageUploadWithLibrary({ value, onChange }: ImageUploadWithLibraryProps) {
  const [uploading, setUploading] = useState(false)
  const [library, setLibrary] = useState<Array<{ url: string; uploadedAt: number }>>([])
  const [activeTab, setActiveTab] = useState("upload")

  // Load library from localStorage
  useEffect(() => {
    const savedLibrary = localStorage.getItem("instagram_automation_image_library")
    if (savedLibrary) {
      try {
        setLibrary(JSON.parse(savedLibrary))
      } catch (e) {
        console.error("Failed to parse image library", e)
      }
    }
  }, [])

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be less than 8MB")
      return
    }

    setUploading(true)
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      })

      // Save to library
      const newLibraryItem = { url: blob.url, uploadedAt: Date.now() }
      const updatedLibrary = [newLibraryItem, ...library].slice(0, 50) // Keep last 50 images
      setLibrary(updatedLibrary)
      localStorage.setItem("instagram_automation_image_library", JSON.stringify(updatedLibrary))

      onChange(blob.url)
      toast.success("Image uploaded successfully")
      setActiveTab("library")
    } catch (error) {
      console.error("Upload failed:", error)
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload">Upload New</TabsTrigger>
        <TabsTrigger value="library">Library {library.length > 0 && `(${library.length})`}</TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="space-y-4 mt-4">
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file)
            }}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/50 bg-muted/20 p-12 text-center hover:bg-muted/40 transition-colors">
            {uploading ? (
              <>
                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-3" />
                <p className="text-sm font-medium">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">JPG, PNG, GIF up to 8MB</p>
              </>
            )}
          </div>
        </div>

        {value && (
          <Card className="p-3">
            <div className="flex items-center gap-3">
              <img src={value || "/placeholder.svg"} alt="Selected" className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Current image</p>
                <p className="text-xs text-muted-foreground truncate">{value}</p>
              </div>
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
            </div>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="library" className="mt-4">
        {library.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-border/50 bg-muted/20 p-12 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium mb-1">No images in library</p>
            <p className="text-xs text-muted-foreground">Upload images to save them for reuse</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
            {library.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onChange(item.url)
                  toast.success("Image selected from library")
                }}
                className="group relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:border-primary"
                style={{ borderColor: value === item.url ? "hsl(var(--primary))" : "transparent" }}
              >
                <img
                  src={item.url || "/placeholder.svg"}
                  alt={`Library image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                {value === item.url && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <Check className="h-8 w-8 text-primary-foreground drop-shadow-lg" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
