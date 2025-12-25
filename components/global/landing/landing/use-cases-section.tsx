"use client"

import { useEffect, useRef } from "react"
import { ShoppingBag, Calendar, Headphones, TrendingUp, Users, Zap } from "lucide-react"

const useCases = [
  {
    icon: ShoppingBag,
    title: "E-commerce",
    description: "Turn DMs into sales with automated product catalogs and checkout flows",
    color: "orange",
    image: "/ecommerce-shopping-bags-and-products.jpg",
  },
  {
    icon: Calendar,
    title: "Booking & Appointments",
    description: "Let customers book appointments directly through Instagram DMs",
    color: "green",
    image: "/calendar-booking-appointment-scheduling.jpg",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description: "Provide instant support with AI-powered responses and ticket routing",
    color: "purple",
    image: "/customer-support-headset-help-desk.jpg",
  },
  {
    icon: TrendingUp,
    title: "Lead Generation",
    description: "Capture and qualify leads automatically while you focus on closing deals",
    color: "red",
    image: "/sales-growth-chart-trending-up.jpg",
  },
  {
    icon: Users,
    title: "Community Management",
    description: "Engage with your community at scale without losing the personal touch",
    color: "yellow",
    image: "/community-people-group-networking.jpg",
  },
  {
    icon: Zap,
    title: "Influencer Marketing",
    description: "Manage brand deals and collaborations efficiently through automated DMs",
    color: "maroon",
    image: "/influencer-marketing-megaphone-social-media.jpg",
  },
]

export function UseCasesSection() {
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
    <section ref={sectionRef} className="py-32 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-20 scroll-reveal">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Built For <span className="text-orange">Every Business</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No matter your industry, yazzil adapts to your unique workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon
            return (
              <div
                key={useCase.title}
                className={`scroll-reveal group relative bg-card border-2 border-border rounded-3xl overflow-hidden hover:border-${useCase.color} transition-all duration-300`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Image with overlay */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={useCase.image || "/placeholder.svg"}
                    alt={useCase.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent`} />
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 bg-${useCase.color}/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-8 h-8 text-${useCase.color}`} />
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{useCase.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{useCase.description}</p>
                </div>

                {/* Colored accent bar */}
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-${useCase.color}`} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
