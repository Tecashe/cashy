"use client"

import { useEffect, useRef } from "react"
import { Shield, Lock, CheckCircle, Award } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Meta Verified Partner",
    description: "Official Meta Business Partner with full API access and compliance",
    color: "green",
  },
  {
    icon: Lock,
    title: "Bank-Level Security",
    description: "256-bit encryption and SOC 2 Type II certified infrastructure",
    color: "orange",
  },
  {
    icon: CheckCircle,
    title: "Account Safety Guaranteed",
    description: "Follow Meta's best practices to keep your account safe from bans",
    color: "purple",
  },
  {
    icon: Award,
    title: "GDPR Compliant",
    description: "Full compliance with international data protection regulations",
    color: "red",
  },
]

export function SecuritySection() {
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
    <section ref={sectionRef} className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/10 border border-green/20 mb-6">
            <Shield className="w-4 h-4 text-green" />
            <span className="text-sm font-medium text-green">Trusted & Secure</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Your Account is <span className="text-green">100% Safe</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We&apos;re verified by Meta and follow all best practices to ensure your Instagram account stays secure
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={`scroll-reveal bg-card border-2 border-${feature.color} rounded-3xl p-6 hover:scale-105 transition-all duration-300`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 bg-${feature.color}/10 rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 text-${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Meta partnership badge */}
        <div className="scroll-reveal max-w-4xl mx-auto bg-card border-2 border-green rounded-3xl p-8 lg:p-12 text-center">
          <div className="w-20 h-20 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-green" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">Official Meta Business Partner</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            yazzil is an official Meta Business Partner, which means we have direct access to Instagram&apos;s API and follow
            all of Meta&apos;s guidelines. Your account will never be at risk of being banned when using our platform.
          </p>
        </div>
      </div>
    </section>
  )
}
