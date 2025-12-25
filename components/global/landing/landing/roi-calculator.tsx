"use client"

import { useState, useEffect, useRef } from "react"
import { Calculator, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ROICalculator() {
  const [dmPerDay, setDmPerDay] = useState(50)
  const [avgOrderValue, setAvgOrderValue] = useState(100)
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

  // Calculate ROI
  const monthlyDMs = dmPerDay * 30
  const responseRateIncrease = 2.34 // 234% increase
  const conversionRate = 0.15 // 15% conversion
  const additionalConversions = monthlyDMs * responseRateIncrease * conversionRate
  const additionalRevenue = Math.round(additionalConversions * avgOrderValue)
  const roi = Math.round((additionalRevenue / 79) * 100) // Assuming Growth plan at $79

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow/10 border border-yellow/20 mb-6">
              <Calculator className="w-4 h-4 text-yellow" />
              <span className="text-sm font-medium text-yellow">ROI Calculator</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Calculate Your <span className="text-yellow">Potential Revenue</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how much additional revenue yazzil could generate for your business
            </p>
          </div>

          <div className="scroll-reveal bg-card border-2 border-yellow rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Input side */}
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium mb-3">Instagram DMs per day</label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    value={dmPerDay}
                    onChange={(e) => setDmPerDay(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-yellow"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-muted-foreground">10</span>
                    <span className="text-2xl font-bold text-yellow">{dmPerDay}</span>
                    <span className="text-sm text-muted-foreground">500</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Average order value ($)</label>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={avgOrderValue}
                    onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-yellow"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-muted-foreground">$10</span>
                    <span className="text-2xl font-bold text-yellow">${avgOrderValue}</span>
                    <span className="text-sm text-muted-foreground">$1,000</span>
                  </div>
                </div>

                <div className="bg-muted rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly DMs</span>
                    <span className="font-semibold">{monthlyDMs.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Response rate increase</span>
                    <span className="font-semibold text-green">+234%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Conversion rate</span>
                    <span className="font-semibold">15%</span>
                  </div>
                </div>
              </div>

              {/* Results side */}
              <div className="flex flex-col justify-center">
                <div className="bg-yellow/5 border-2 border-yellow rounded-3xl p-8 text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <TrendingUp className="w-6 h-6 text-yellow" />
                    <span className="text-sm font-medium text-yellow">Projected Monthly Revenue</span>
                  </div>
                  <div className="text-6xl lg:text-7xl font-bold text-yellow mb-2">
                    ${additionalRevenue.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Additional revenue per month</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-card border border-border rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-green">{Math.round(additionalConversions)}</div>
                    <div className="text-xs text-muted-foreground mt-1">Extra Sales</div>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-orange">{roi}%</div>
                    <div className="text-xs text-muted-foreground mt-1">ROI</div>
                  </div>
                </div>

                <Link href="/dashboard" className="w-full">
                  <Button size="lg" className="w-full bg-yellow text-black hover:bg-yellow/90 font-semibold">
                    Start Generating Revenue
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
