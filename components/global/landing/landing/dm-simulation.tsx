"use client"

import { useEffect, useState } from "react"
import { ShoppingBag, Check } from "lucide-react"

export function DMSimulation() {
  const [step, setStep] = useState(0)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(false)

  useEffect(() => {
    const sequence = [
      { delay: 1000, action: () => setStep(1) }, // Show initial message
      { delay: 2000, action: () => setStep(2) }, // Show product options
      {
        delay: 3000,
        action: () => {
          setShowCursor(true)
          setCursorPos({ x: 50, y: 50 })
        },
      }, // Show cursor
      { delay: 4000, action: () => setCursorPos({ x: 120, y: 180 }) }, // Move cursor to product
      {
        delay: 5000,
        action: () => {
          setStep(3)
          setShowCursor(false)
        },
      }, // Select product
      { delay: 6000, action: () => setStep(4) }, // Show confirmation
      {
        delay: 8000,
        action: () => {
          setStep(0)
          setShowCursor(false)
        },
      }, // Reset
    ]

    const timers = sequence.map(({ delay, action }) => setTimeout(action, delay))

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Instagram DM Interface */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
        {/* DM Header */}
        <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-black" />
          </div>
          <div>
            <p className="font-semibold text-sm">Luxury Boutique</p>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>

        {/* DM Messages */}
        <div className="p-4 space-y-4 min-h-[400px] relative">
          {/* Bot message */}
          {step >= 1 && (
            <div className="flex gap-2 animate-slide-in-left">
              <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-4 h-4 text-black" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                <p className="text-sm">Hey! 👋 Thanks for your interest! Which style are you looking for?</p>
              </div>
            </div>
          )}

          {/* Product options */}
          {step >= 2 && (
            <div className="flex gap-2 animate-fade-in">
              <div className="w-8 h-8 flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div
                  className={`bg-card border-2 ${step >= 3 ? "border-green" : "border-border"} rounded-xl p-3 cursor-pointer hover:border-green/50 transition-all ${step >= 3 ? "scale-105" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-maroon rounded-lg" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Red Handbag</p>
                      <p className="text-xs text-muted-foreground">$299</p>
                    </div>
                    {step >= 3 && <Check className="w-5 h-5 text-green" />}
                  </div>
                </div>
                <div className="bg-card border-2 border-border rounded-xl p-3 cursor-pointer hover:border-green/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-brown rounded-lg" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Brown Shoes</p>
                      <p className="text-xs text-muted-foreground">$199</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User selection */}
          {step >= 3 && (
            <div className="flex gap-2 justify-end animate-slide-in-right">
              <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                <p className="text-sm text-black font-medium">Red Handbag</p>
              </div>
            </div>
          )}

          {/* Confirmation */}
          {step >= 4 && (
            <div className="flex gap-2 animate-slide-in-left">
              <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-4 h-4 text-black" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                <p className="text-sm">Perfect choice! ✨ Added to your cart. Ready to checkout?</p>
              </div>
            </div>
          )}

          {/* Animated cursor */}
          {showCursor && (
            <div
              className="absolute pointer-events-none transition-all duration-1000 ease-out"
              style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
                <path
                  d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                  fill="#ff6b35"
                  stroke="#0a0a0a"
                  strokeWidth="1"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
