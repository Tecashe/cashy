"use client"

import { useEffect, useState } from "react"
import { Send } from "lucide-react"

export function StorySimulation() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const sequence = [
      { delay: 1000, action: () => setStep(1) }, // Show story
      { delay: 2500, action: () => setStep(2) }, // Show reply
      { delay: 4000, action: () => setStep(3) }, // Show auto response
      { delay: 6000, action: () => setStep(4) }, // Show offer
      { delay: 8000, action: () => setStep(0) }, // Reset
    ]

    const timers = sequence.map(({ delay, action }) => setTimeout(action, delay))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <section className="py-20 lg:py-32 bg-card/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Turn Story Viewers Into <span className="text-green">Customers</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Automatically respond to story replies with personalized messages that drive sales
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Instagram Story Mockup */}
            <div className="relative mx-auto max-w-sm">
              <div className="bg-card border-2 border-green/30 rounded-3xl overflow-hidden shadow-2xl">
                {/* Story Header */}
                <div className="bg-muted px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green" />
                  <div>
                    <p className="font-semibold text-sm">fashionbrand</p>
                    <p className="text-xs text-muted-foreground">2h ago</p>
                  </div>
                </div>

                {/* Story Content */}
                <div className="aspect-[9/16] bg-green/10 relative flex items-center justify-center p-8">
                  {step >= 1 && (
                    <div className="text-center animate-scale-in">
                      <div className="w-48 h-48 bg-green rounded-2xl mb-4 mx-auto" />
                      <p className="text-2xl font-bold text-white">New Summer Collection</p>
                      <p className="text-muted-foreground mt-2">Swipe up to shop</p>
                    </div>
                  )}

                  {/* Reply indicator */}
                  {step >= 2 && (
                    <div className="absolute bottom-4 left-4 right-4 animate-slide-in-left">
                      <div className="bg-card/95 backdrop-blur rounded-2xl p-3 border border-green/30">
                        <p className="text-sm">😍 Love this! Do you have it in blue?</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* DM Response */}
            <div className="space-y-6">
              {step >= 3 && (
                <div className="bg-card border-2 border-green/30 rounded-2xl p-6 animate-slide-in-right">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green flex items-center justify-center flex-shrink-0">
                      <Send className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Auto-Reply Sent</p>
                      <p className="text-sm text-muted-foreground">Instantly responded to story reply</p>
                    </div>
                  </div>
                  <div className="bg-muted rounded-xl p-4">
                    <p className="text-sm mb-3">Hey! 💙 Yes, we have it in blue! Here&apos;s the link to check it out:</p>
                    {step >= 4 && (
                      <div className="bg-green/20 border border-green/30 rounded-lg p-3 animate-fade-in">
                        <p className="text-xs font-semibold text-green mb-1">SPECIAL OFFER</p>
                        <p className="text-sm">Use code STORY15 for 15% off your first order! 🎉</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green/10 border border-green/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green">100%</p>
                  <p className="text-xs text-muted-foreground mt-1">Reply Rate</p>
                </div>
                <div className="bg-green/10 border border-green/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green">&lt;1s</p>
                  <p className="text-xs text-muted-foreground mt-1">Response Time</p>
                </div>
                <div className="bg-green/10 border border-green/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green">24/7</p>
                  <p className="text-xs text-muted-foreground mt-1">Always On</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
