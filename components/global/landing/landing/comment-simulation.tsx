"use client"

import { useEffect, useState } from "react"
import { MessageCircle, Heart, Send } from "lucide-react"

export function CommentSimulation() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const sequence = [
      { delay: 1000, action: () => setStep(1) }, // Show post
      { delay: 2500, action: () => setStep(2) }, // Show comment
      { delay: 4000, action: () => setStep(3) }, // Show auto reply
      { delay: 5500, action: () => setStep(4) }, // Show DM sent
      { delay: 7500, action: () => setStep(0) }, // Reset
    ]

    const timers = sequence.map(({ delay, action }) => setTimeout(action, delay))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Never Miss a <span className="text-red">Comment</span> Again
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Auto-reply to comments and send personalized DMs to engage every commenter
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Instagram Post Mockup */}
            <div className="bg-card border-2 border-red/30 rounded-3xl overflow-hidden shadow-2xl">
              {/* Post Header */}
              <div className="px-4 py-3 flex items-center gap-3 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-red" />
                <div>
                  <p className="font-semibold text-sm">techgadgets</p>
                  <p className="text-xs text-muted-foreground">Sponsored</p>
                </div>
              </div>

              {/* Post Image */}
              {step >= 1 && (
                <div className="aspect-square bg-red/10 flex items-center justify-center animate-fade-in">
                  <div className="w-48 h-48 bg-red rounded-2xl" />
                </div>
              )}

              {/* Post Actions */}
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center gap-4 mb-3">
                  <Heart className="w-6 h-6" />
                  <MessageCircle className="w-6 h-6" />
                  <Send className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold">1,234 likes</p>
              </div>

              {/* Comments */}
              <div className="px-4 py-3 space-y-3 max-h-48 overflow-y-auto">
                {step >= 2 && (
                  <div className="animate-slide-in-left">
                    <p className="text-sm">
                      <span className="font-semibold">john_doe</span>{" "}
                      <span className="text-muted-foreground">How much does this cost?</span>
                    </p>
                  </div>
                )}
                {step >= 3 && (
                  <div className="ml-8 animate-slide-in-left">
                    <p className="text-sm">
                      <span className="font-semibold text-red">techgadgets</span>{" "}
                      <span className="text-muted-foreground">
                        Great question! I&apos;ll send you all the details in DM 📱
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Automation Flow */}
            <div className="space-y-6">
              {step >= 3 && (
                <div className="bg-card border-2 border-red/30 rounded-2xl p-6 animate-scale-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-semibold">Comment Detected</p>
                      <p className="text-sm text-muted-foreground">Auto-reply posted</p>
                    </div>
                  </div>
                </div>
              )}

              {step >= 4 && (
                <div className="bg-card border-2 border-red/30 rounded-2xl p-6 animate-scale-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red flex items-center justify-center">
                      <Send className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-semibold">DM Sent Automatically</p>
                      <p className="text-sm text-muted-foreground">Personalized message delivered</p>
                    </div>
                  </div>
                  <div className="bg-muted rounded-xl p-4">
                    <p className="text-sm">
                      Hey John! 👋 Thanks for your interest! Our latest gadget is $299 with free shipping.
                      <br />
                      <br />
                      Want to see a demo? Reply YES and I&apos;ll send you a video!
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red/10 border border-red/30 rounded-xl p-4">
                  <p className="text-2xl font-bold text-red">Instant</p>
                  <p className="text-xs text-muted-foreground mt-1">Comment replies</p>
                </div>
                <div className="bg-red/10 border border-red/30 rounded-xl p-4">
                  <p className="text-2xl font-bold text-red">Auto</p>
                  <p className="text-xs text-muted-foreground mt-1">DM follow-ups</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
