"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Instagram, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`fixed top-4 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "top-2" : ""}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div
          className={`relative rounded-2xl transition-all duration-500 ${
            scrolled
              ? "bg-card/80 backdrop-blur-2xl border-2 border-border shadow-[0_8px_32px_rgba(0,0,0,0.4),0_2px_8px_rgba(255,107,53,0.1),inset_0_1px_0_rgba(255,255,255,0.05)]"
              : "bg-card/60 backdrop-blur-xl border border-border/50 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
          }`}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

          <div className="relative flex items-center justify-between h-16 lg:h-18 px-4 lg:px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-orange blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="flex items-center gap-2">
                  <Image src="/branded-original.png" alt="Yazzil logo" width={64} height={64} className="h-12 w-12 sm:h-16 sm:w-16" />
                </div>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">yazzil</span>
            </Link>

            {/* Desktop Navigation */}
            
            <nav className="hidden md:flex items-center gap-1 bg-muted/50 rounded-xl p-1 border border-border/50">
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-white hover:bg-card px-4 py-2 rounded-lg transition-all duration-200"
              >
                Features
              </a>
              <a
                href="#demo"
                className="text-sm font-medium text-muted-foreground hover:text-white hover:bg-card px-4 py-2 rounded-lg transition-all duration-200"
              >
                Demo
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-white hover:bg-card px-4 py-2 rounded-lg transition-all duration-200"
              >
                Pricing
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="hidden sm:block">
                <Button variant="ghost" className="text-white hover:text-orange hover:bg-orange/10 font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="relative bg-orange text-black hover:bg-orange/90 font-semibold text-sm md:text-base px-5 md:px-7 h-10 md:h-11 shadow-[0_4px_16px_rgba(255,107,53,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_6px_20px_rgba(255,107,53,0.5)] hover:scale-105 transition-all duration-200">
                  <span className="relative z-10">Start Free Trial</span>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                </Button>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border/50 p-4 space-y-2 animate-fade-in">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-muted-foreground hover:text-white hover:bg-muted px-4 py-3 rounded-lg transition-colors"
              >
                Features
              </a>
              <a
                href="#demo"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-muted-foreground hover:text-white hover:bg-muted px-4 py-3 rounded-lg transition-colors"
              >
                Demo
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-muted-foreground hover:text-white hover:bg-muted px-4 py-3 rounded-lg transition-colors"
              >
                Pricing
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
