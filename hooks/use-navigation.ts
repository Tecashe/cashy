

import { usePathname } from "next/navigation"

function getSlugFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/dashboard\/([^\/]+)/)
  return match ? match[1] : null
}

export function useNavigation() {
  const pathname = usePathname()
  const userSlug = pathname ? getSlugFromPathname(pathname) : null

  const buildHref = (href: string) => {
    if (!userSlug) return href
    
    // If href already starts with /dashboard/[slug], return as is
    if (href.match(/^\/dashboard\/[^\/]+\//)) return href
    
    // If href is /dashboard, replace with /dashboard/slug
    if (href === "/dashboard") return `/dashboard/${userSlug}`
    
    // Otherwise, prefix with /dashboard/slug
    return `/dashboard/${userSlug}${href}`
  }

  return {
    userSlug,
    buildHref,
    pathname,
  }
}