"use client"

import { useEffect, useRef } from "react"
import { TrendingUp, Users, MessageSquare, DollarSign } from "lucide-react"
import Image from "next/image"

const results = [
  {
    metric: "+234%",
    label: "Response Rate",
    description: "Businesses see 3x more engagement",
    icon: TrendingUp,
    color: "green",
    before: "12%",
    after: "40%",
  },
  {
    metric: "+180%",
    label: "Lead Generation",
    description: "More qualified leads every month",
    icon: Users,
    color: "orange",
    before: "50",
    after: "140",
  },
  {
    metric: "24/7",
    label: "Availability",
    description: "Never miss a customer again",
    icon: MessageSquare,
    color: "purple",
    before: "9-5",
    after: "24/7",
  },
  {
    metric: "+320%",
    label: "Revenue Growth",
    description: "Average increase in sales",
    icon: DollarSign,
    color: "red",
    before: "$5k",
    after: "$21k",
  },
]

export function ResultsSection() {
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
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Real Results from <span className="text-orange">Real Businesses</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See the measurable impact yazzil has on businesses just like yours
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {results.map((result, index) => {
            const Icon = result.icon
            return (
              <div
                key={result.label}
                className={`scroll-reveal bg-card border-2 border-${result.color} rounded-3xl p-6 hover:scale-105 transition-all duration-300`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 bg-${result.color}/10 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 text-${result.color}`} />
                </div>

                <div className={`text-4xl font-bold text-${result.color} mb-2`}>{result.metric}</div>
                <div className="text-lg font-semibold mb-2">{result.label}</div>
                <p className="text-sm text-muted-foreground mb-4">{result.description}</p>

                {/* Before/After */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Before</div>
                    <div className="text-lg font-bold">{result.before}</div>
                  </div>
                  <div className="text-muted-foreground">→</div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">After</div>
                    <div className={`text-lg font-bold text-${result.color}`}>{result.after}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Case study preview */}
        <div className="scroll-reveal max-w-5xl mx-auto bg-card border-2 border-green rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/10 border border-green/20 mb-6">
                <span className="text-sm font-medium text-green">Success Story</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                How FashionHub Increased Sales by 320% in 3 Months
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                &ldquo;yazzil transformed our Instagram from a content platform to a revenue-generating machine. We&apos;re now
                closing deals in DMs while we sleep.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-green">
                  <Image
                    src="/professional-woman-smiling.png"
                    alt="Maryann"
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <div className="font-semibold">Maryann</div>
                  <div className="text-sm text-muted-foreground">Founder, Vavi Handmade</div>
                </div>
              </div>
            </div>

            <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden bg-green/5 border-2 border-green/20">
              <Image
                src="/sales-growth-chart-trending-up.jpg"
                alt="Growth chart"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
