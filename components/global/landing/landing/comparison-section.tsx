"use client"

import { useEffect, useRef } from "react"
import { Check, X } from "lucide-react"

export function ComparisonSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".scroll-reveal")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const features = [
    { feature: "DM Automation", yazzil: true, manychat: true },
    { feature: "Story Reply Automation", yazzil: true, manychat: false },
    { feature: "Comment Automation", yazzil: true, manychat: true },
    { feature: "Instagram-Native Interface", yazzil: true, manychat: false },
    { feature: "Visual Product Catalogs", yazzil: true, manychat: false },
    { feature: "Advanced Analytics", yazzil: true, manychat: true },
    { feature: "Setup Time", yazzil: "2 minutes", manychat: "30+ minutes" },
    { feature: "Customer Support", yazzil: "24/7 Live Chat", manychat: "Email Only" },
    { feature: "Instagram-First Design", yazzil: true, manychat: false },
    { feature: "Pricing", yazzil: "From $29/mo", manychat: "From $15/mo" },
  ]

  return (
    <section ref={sectionRef} className="py-32 bg-muted/30 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-20 scroll-reveal">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            yazzil vs <span className="text-orange">Manychat</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We built yazzil specifically for Instagram. Here&apos;s how we compare.
          </p>
        </div>

        <div className="max-w-4xl mx-auto scroll-reveal">
          <div className="bg-card rounded-3xl border-2 border-border overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-muted/50 border-b-2 border-border">
              <div className="font-bold text-lg">Feature</div>
              <div className="font-bold text-lg text-center">
                <span className="text-orange">yazzil</span>
              </div>
              <div className="font-bold text-lg text-center text-muted-foreground">Manychat</div>
            </div>

            {/* Rows */}
            {features.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-4 p-6 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                <div className="font-medium">{item.feature}</div>
                <div className="flex justify-center">
                  {typeof item.yazzil === "boolean" ? (
                    item.yazzil ? (
                      <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <X className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )
                  ) : (
                    <span className="text-sm font-semibold text-orange">{item.yazzil}</span>
                  )}
                </div>
                <div className="flex justify-center">
                  {typeof item.manychat === "boolean" ? (
                    item.manychat ? (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Check className="w-5 h-5 text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red/20 flex items-center justify-center">
                        <X className="w-5 h-5 text-red" />
                      </div>
                    )
                  ) : (
                    <span className="text-sm text-muted-foreground">{item.manychat}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
