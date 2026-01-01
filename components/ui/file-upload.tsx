"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload, X, Loader2, ImageIcon, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { uploadFile, uploadMultipleFiles, validateImage, validateDocument } from "@/lib/file-upload"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  type: "product" | "knowledge" | "document"
  accept?: string
  multiple?: boolean
  maxFiles?: number
  onUploadComplete: (urls: string[]) => void
  preview?: boolean
}

export function FileUpload({
  type,
  accept = "image/*",
  multiple = false,
  maxFiles = 10,
  onUploadComplete,
  preview = true,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const { toast } = useToast()

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])

      if (files.length === 0) return

      if (!multiple && files.length > 1) {
        toast({
          title: "Multiple files not allowed",
          description: "Please select only one file",
          variant: "destructive",
        })
        return
      }

      if (files.length > maxFiles) {
        toast({
          title: "Too many files",
          description: `Maximum ${maxFiles} files allowed`,
          variant: "destructive",
        })
        return
      }

      // Validate files
      const isImage = accept.includes("image")
      for (const file of files) {
        const error = isImage ? validateImage(file) : validateDocument(file)
        if (error) {
          toast({
            title: "Invalid file",
            description: error,
            variant: "destructive",
          })
          return
        }
      }

      setSelectedFiles(files)

      // Generate previews for images
      if (preview && isImage) {
        const urls = files.map((file) => URL.createObjectURL(file))
        setPreviewUrls(urls)
      }
    },
    [accept, multiple, maxFiles, preview, toast],
  )

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    try {
      setUploading(true)
      setProgress(0)

      let urls: string[]
      if (multiple) {
        urls = await uploadMultipleFiles(selectedFiles)
      } else {
        const url = await uploadFile(selectedFiles[0])
        urls = [url]
        setProgress(100)
      }

      onUploadComplete(urls)

      toast({
        title: "Upload successful",
        description: `${urls.length} file(s) uploaded`,
      })

      // Clean up
      setSelectedFiles([])
      setPreviewUrls([])
      setProgress(0)
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    if (preview) {
      URL.revokeObjectURL(previewUrls[index])
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const isImage = accept.includes("image")

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-lg p-6 bg-muted/20 hover:bg-muted/30 transition-colors">
        <label className="flex flex-col items-center justify-center cursor-pointer">
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          {isImage ? (
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-3" />
          ) : (
            <FileText className="h-12 w-12 text-muted-foreground mb-3" />
          )}
          <p className="text-sm font-medium mb-1">{multiple ? "Click to upload files" : "Click to upload a file"}</p>
          <p className="text-xs text-muted-foreground">
            {isImage ? "PNG, JPG, WebP or GIF (max 10MB)" : "PDF, TXT, CSV or JSON (max 10MB)"}
          </p>
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <Card className="p-4 space-y-4">
          {preview && isImage && previewUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="w-full aspect-video object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {(!preview || !isImage) && (
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{(file.size / 1024).toFixed(0)}KB</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-xs text-center text-muted-foreground">{Math.round(progress)}% uploaded</p>
            </div>
          )}

          <Button onClick={handleUpload} disabled={uploading} className="w-full">
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload {selectedFiles.length} {selectedFiles.length === 1 ? "File" : "Files"}
              </>
            )}
          </Button>
        </Card>
      )}
    </div>
  )
}
