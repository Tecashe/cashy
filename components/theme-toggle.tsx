"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="relative h-11 w-11">
        <div className="h-5 w-5" />
      </button>
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative h-11 w-11 rounded-2xl overflow-hidden transition-all duration-500 group ${
        isDark ? "glass-button-dark elevated-dark hover:scale-105" : "glass-button-light elevated-light hover:scale-105"
      }`}
      aria-label="Toggle theme"
    >
      <div className={`absolute inset-0 transition-opacity duration-700 ${isDark ? "opacity-100" : "opacity-0"}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/40 via-zinc-800/40 to-zinc-900/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      <div className={`absolute inset-0 transition-opacity duration-700 ${isDark ? "opacity-0" : "opacity-100"}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-gray-50/60 to-white/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,0,0,0.05),transparent_50%)]" />
      </div>

      <div className="relative h-full w-full flex items-center justify-center">
        {/* Sun Icon */}
        <div
          className={`absolute transition-all duration-700 ${
            isDark ? "rotate-180 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        >
          <Sun className="h-5 w-5 text-zinc-900" />
          <div className="absolute inset-0 blur-md">
            <Sun className="h-5 w-5 text-amber-500 opacity-50" />
          </div>
        </div>

        {/* Moon Icon */}
        <div
          className={`absolute transition-all duration-700 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-180 scale-0 opacity-0"
          }`}
        >
          <Moon className="h-5 w-5 text-zinc-100" />
          <div className="absolute inset-0 blur-md">
            <Moon className="h-5 w-5 text-blue-400 opacity-40" />
          </div>
        </div>
      </div>

      <div
        className={`absolute inset-0 transition-all duration-700 rounded-2xl ${
          isDark
            ? "bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100"
            : "bg-gradient-to-br from-amber-500/20 via-transparent to-orange-500/20 opacity-0 group-hover:opacity-100"
        }`}
      />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-gradient-to-r from-transparent via-white/5 to-transparent"
              : "bg-gradient-to-r from-transparent via-black/5 to-transparent"
          } animate-[shimmer_2s_ease-in-out_infinite]`}
        />
      </div>
    </button>
  )
}
