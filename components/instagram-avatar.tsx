"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface InstagramAvatarProps {
  src: string | null
  alt: string
  fallback: string
  className?: string
}

export function InstagramAvatar({ src, alt, fallback, className }: InstagramAvatarProps) {
  // Check if it's an Instagram URL
  const isInstagramUrl = src?.includes('cdninstagram.com')
  
  // Proxy Instagram URLs through our API
  const proxiedSrc = isInstagramUrl && src 
    ? `/api/proxy/image?url=${encodeURIComponent(src)}`
    : src

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={proxiedSrc || ""} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}