import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-slate-900 dark:via-purple-900 dark:to-pink-900">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
