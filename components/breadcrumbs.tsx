"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { Fragment } from "react"

export function Breadcrumbs() {
  const pathname = usePathname()

  const pathSegments = pathname?.split("/").filter(Boolean) || []

  const formatSegment = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link
        href="/dashboard"
        className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join("/")}`
        const isLast = index === pathSegments.length - 1

        return (
          <Fragment key={href}>
            <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-600" />
            {isLast ? (
              <span className="font-medium text-slate-900 dark:text-white">{formatSegment(segment)}</span>
            ) : (
              <Link
                href={href}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                {formatSegment(segment)}
              </Link>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
