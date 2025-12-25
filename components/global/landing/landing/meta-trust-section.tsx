"use client"

import { Shield, CheckCircle2, Lock, Award } from "lucide-react"
import { useEffect, useRef } from "react"

export function MetaTrustSection() {
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
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main badge */}
        <div className="text-center mb-16 scroll-reveal">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card border-2 border-purple rounded-2xl shadow-xl mb-6">
            <Shield className="w-8 h-8 text-blue" />
            <div className="text-left">
              <p className="text-sm font-semibold text-blue">Meta Verified Partner</p>
              <p className="text-xs text-muted-foreground">Official Instagram Business Solution</p>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Your Account is <span className="text-blue">100% Safe</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We follow Meta&apos;s official guidelines and best practices. Your Instagram account security is our top
            priority.
          </p>
        </div>

        {/* Trust cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-card border-2 border-yellow/20 rounded-2xl p-6 scroll-reveal hover:border-yellow transition-colors">
            <div className="w-12 h-12 bg-blue/20 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-blue" />
            </div>
            <h3 className="text-lg font-bold mb-2">Meta Approved</h3>
            <p className="text-sm text-muted-foreground">
              Officially verified and approved by Meta as a trusted Instagram automation partner
            </p>
          </div>

          <div className="bg-card border-2 border-orange/20 rounded-2xl p-6 scroll-reveal hover:border-orange transition-colors">
            <div className="w-12 h-12 bg-orange/20 rounded-xl flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-orange" />
            </div>
            <h3 className="text-lg font-bold mb-2">Secure & Compliant</h3>
            <p className="text-sm text-muted-foreground">
              Bank-level encryption and full compliance with Instagram&apos;s Terms of Service
            </p>
          </div>

          <div className="bg-card border-2 border-purple/20 rounded-2xl p-6 scroll-reveal hover:border-purple transition-colors">
            <div className="w-12 h-12 bg-purple/20 rounded-xl flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-purple" />
            </div>
            <h3 className="text-lg font-bold mb-2">Best Practices</h3>
            <p className="text-sm text-muted-foreground">
              Built following Meta&apos;s official API guidelines and automation best practices
            </p>
          </div>

          <div className="bg-card border-2 border-yellow/20 rounded-2xl p-6 scroll-reveal hover:border-yellow transition-colors">
            <div className="w-12 h-12 bg-yellow/20 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-yellow" />
            </div>
            <h3 className="text-lg font-bold mb-2">Zero Ban Risk</h3>
            <p className="text-sm text-muted-foreground">
              10,000+ accounts automated safely with zero bans or restrictions
            </p>
          </div>
        </div>

        {/* Bottom statement */}
        <div className="text-center mt-16 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-muted rounded-full">
            <CheckCircle2 className="w-5 h-5 text-yellow" />
            <p className="text-sm font-medium">
              Trusted by <span className="text-yellow font-bold">10,000+</span> businesses worldwide
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
