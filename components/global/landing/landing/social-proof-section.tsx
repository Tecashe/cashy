"use client"

import { useEffect, useRef } from "react"
import { Star, TrendingUp, Users, Zap } from "lucide-react"

export function SocialProofSection() {
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

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-purple/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-20 scroll-reveal">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Loved by <span className="text-purple">Thousands</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join the businesses already crushing it with yazzil
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-card border-2 border-orange/20 rounded-2xl p-8 text-center scroll-reveal hover:border-orange transition-colors">
            <div className="w-16 h-16 bg-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-orange" />
            </div>
            <div className="text-4xl font-bold text-orange mb-2">10,000+</div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </div>

          <div className="bg-card border-2 border-green/20 rounded-2xl p-8 text-center scroll-reveal hover:border-green transition-colors">
            <div className="w-16 h-16 bg-green/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green" />
            </div>
            <div className="text-4xl font-bold text-green mb-2">5M+</div>
            <p className="text-sm text-muted-foreground">DMs Automated</p>
          </div>

          <div className="bg-card border-2 border-yellow/20 rounded-2xl p-8 text-center scroll-reveal hover:border-yellow transition-colors">
            <div className="w-16 h-16 bg-yellow/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-yellow" />
            </div>
            <div className="text-4xl font-bold text-yellow mb-2">4.9/5</div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>

          <div className="bg-card border-2 border-red/20 rounded-2xl p-8 text-center scroll-reveal hover:border-red transition-colors">
            <div className="w-16 h-16 bg-red/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-red" />
            </div>
            <div className="text-4xl font-bold text-red mb-2">98%</div>
            <p className="text-sm text-muted-foreground">Response Rate</p>
          </div>
        </div>

        {/* Featured brands */}
        <div className="scroll-reveal">
          <p className="text-center text-sm text-muted-foreground mb-8">Trusted by leading brands</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-32 h-12 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
