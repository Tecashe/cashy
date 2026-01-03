// lib/instagram-utils.ts
export function getProxiedImageUrl(url: string | null): string {
  if (!url) return ""
  
  // Check if it's an Instagram CDN URL
  if (url.includes('cdninstagram.com')) {
    return `/api/proxy/image?url=${encodeURIComponent(url)}`
  }
  
  return url
}