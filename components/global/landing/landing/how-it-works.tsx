"use client"

import { useEffect, useRef } from "react"
import { MessageSquare, Zap, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const steps = [
  {
    number: "01",
    title: "Connect Instagram",
    description: "Link your Instagram account in 30 seconds. No technical skills required.",
    icon: MessageSquare,
    color: "orange",
  },
  {
    number: "02",
    title: "Set Up Automation",
    description: "Create custom flows for DMs, story replies, and comments with our visual builder.",
    icon: Zap,
    color: "red",
  },
  {
    number: "03",
    title: "Watch It Work",
    description: "Your AI assistant handles conversations 24/7 while you focus on growing your business.",
    icon: TrendingUp,
    color: "purple",
  },
  {
    number: "04",
    title: "Scale & Optimize",
    description: "Track performance, A/B test messages, and continuously improve your conversion rates.",
    icon: CheckCircle,
    color: "red",
  },
]

export function HowItWorks() {
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
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-1/4 left-0 w-full opacity-10" viewBox="0 0 1200 400" fill="none">
          <path
            d="M0 200 Q 300 100, 600 200 T 1200 200"
            stroke="currentColor"
            strokeWidth="2"
            className="text-orange"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16 lg:mb-24 scroll-reveal">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Get Started in <span className="text-orange">4 Simple Steps</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From zero to automated in less than 5 minutes. No coding, no complexity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className={`scroll-reveal relative bg-card border-2 border-${step.color} rounded-3xl p-8 hover:scale-105 transition-all duration-300 group`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Step number */}
                <div
                  className={`absolute -top-4 -right-4 w-16 h-16 bg-${step.color} rounded-2xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-300`}
                >
                  <span className="text-2xl font-bold text-black">{step.number}</span>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 bg-${step.color}/10 rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon className={`w-8 h-8 text-${step.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

                {/* Connecting line (hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
                )}
              </div>
            )
          })}
        </div>

        <div className="text-center scroll-reveal">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-orange text-black hover:bg-orange/90 text-lg px-10 py-7 h-auto font-semibold"
            >
              Start Your Free Trial
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">No credit card required • 14-day free trial</p>
        </div>
      </div>
    </section>
  )
}
