"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Upload, X, GripVertical, Plus, CheckCircle } from "lucide-react"
import { Reorder, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { uploadImageToBlob } from "@/lib/actions/blob-upload-actions"
import { useToast } from "@/hooks/use-toast"

interface CarouselImage {
  id: string
  url: string
  file?: File
  uploading?: boolean
}

interface CarouselImageUploaderProps {
  images: CarouselImage[]
  onImagesChange: (images: CarouselImage[]) => void
  maxImages?: number
}

export function CarouselImageUploader({ images, onImagesChange, maxImages = 10 }: CarouselImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const { toast } = useToast()

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const imageFiles = fileArray.filter((file) => file.type.startsWith("image/"))

    if (images.length + imageFiles.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images`,
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const result = await uploadImageToBlob(formData)

        return {
          id: Math.random().toString(36).substring(7),
          url: result.url,
          file,
        }
      })

      const uploadedImages = await Promise.all(uploadPromises)
      onImagesChange([...images, ...uploadedImages])

      toast({
        title: "Upload successful",
        description: `${uploadedImages.length} ${uploadedImages.length === 1 ? "image" : "images"} uploaded`,
      })
    } catch (error) {
      console.error("Failed to upload images:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [images],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const removeImage = (id: string) => {
    onImagesChange(images.filter((img) => img.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300",
          dragOver
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border/50 bg-secondary/20 hover:border-border hover:bg-secondary/30",
          uploading && "pointer-events-none opacity-60",
        )}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || images.length >= maxImages}
        />

        <div className="flex flex-col items-center gap-3 text-center pointer-events-none">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            {uploading ? <Spinner className="w-6 h-6 text-blue-500" /> : <Upload className="w-6 h-6 text-blue-500" />}
          </div>

          {uploading ? (
            <>
              <p className="font-medium">Uploading images...</p>
              <p className="text-sm text-muted-foreground">Please wait while we upload your images</p>
            </>
          ) : (
            <>
              <div>
                <p className="font-medium">Drop images here or click to upload</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Up to {maxImages} images, PNG, JPG, GIF (max 5MB each)
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {images.length} / {maxImages} images uploaded
              </p>
            </>
          )}
        </div>
      </div>

      {/* Images Grid with Reordering */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Carousel Images (Drag to reorder)</p>
            <p className="text-xs text-muted-foreground">{images.length} images</p>
          </div>

          <Reorder.Group axis="y" values={images} onReorder={onImagesChange} className="space-y-2">
            <AnimatePresence>
              {images.map((image) => (
                <Reorder.Item
                  key={image.id}
                  value={image}
                  className="group relative flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50 hover:border-border hover:bg-secondary transition-all cursor-grab active:cursor-grabbing"
                >
                  {/* Drag Handle */}
                  <div className="flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Image Preview */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted relative">
                    <img src={image.url || "/placeholder.svg"} alt="Carousel" className="w-full h-full object-cover" />
                    {image.uploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Spinner className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Image Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{image.file?.name || "Uploaded image"}</p>
                      {!image.uploading && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {image.file ? `${(image.file.size / 1024).toFixed(1)} KB` : "Remote image"}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(image.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                    disabled={image.uploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        </div>
      )}

      {images.length > 0 && images.length < maxImages && (
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
          disabled={uploading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add More Images ({maxImages - images.length} remaining)
        </Button>
      )}
    </div>
  )
}
