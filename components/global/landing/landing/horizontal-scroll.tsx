// "use client"

// import { useEffect, useRef } from "react"
// import { Zap, TrendingUp, Users, MessageSquare, ShoppingCart, BarChart } from "lucide-react"

// const features = [
//   { icon: Zap, text: "Instant Automation", color: "orange" },
//   { icon: TrendingUp, text: "10x Response Speed", color: "green" },
//   { icon: Users, text: "Unlimited Contacts", color: "purple" },
//   { icon: MessageSquare, text: "Smart AI Replies", color: "red" },
//   { icon: ShoppingCart, text: "Built-in Checkout", color: "yellow" },
//   { icon: BarChart, text: "Real-time Analytics", color: "maroon" },
// ]

// export function HorizontalScroll() {
//   const scrollRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const handleScroll = () => {
//       if (!scrollRef.current) return

//       const scrollY = window.scrollY
//       const elementTop = scrollRef.current.offsetTop
//       const elementHeight = scrollRef.current.offsetHeight
//       const windowHeight = window.innerHeight

//       // Calculate scroll progress through this section
//       const scrollProgress = (scrollY - elementTop + windowHeight) / (elementHeight + windowHeight)

//       const translateX = (scrollProgress - 0.5) * 200

//       scrollRef.current.style.transform = `translateX(${-translateX}px)`
//     }

//     window.addEventListener("scroll", handleScroll)
//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [])

//   return (
//     <section className="py-16 overflow-hidden">
//       <div className="mb-12 text-center">
//         <h3 className="text-3xl md:text-4xl font-bold">Everything You Need</h3>
//         <p className="text-muted-foreground mt-2">All-in-one Instagram automation platform</p>
//       </div>

//       <div
//         ref={scrollRef}
//         className="flex gap-6 px-4 transition-transform duration-100 ease-out will-change-transform"
//         style={{ width: "max-content" }}
//       >
//         {features.map((feature, index) => {
//           const Icon = feature.icon
//           return (
//             <div
//               key={index}
//               className={`flex-shrink-0 w-72 bg-card border-2 border-${feature.color} rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform`}
//             >
//               <div className={`w-14 h-14 bg-${feature.color}/10 rounded-xl flex items-center justify-center mb-4`}>
//                 <Icon className={`w-7 h-7 text-${feature.color}`} />
//               </div>
//               <h4 className="text-xl font-bold">{feature.text}</h4>
//               <p className="text-sm text-muted-foreground mt-2">Powerful features designed to help you grow faster</p>
//             </div>
//           )
//         })}
//       </div>
//     </section>
//   )
// }

"use client"

import { useRef, useState, useEffect } from "react"
import { Zap, TrendingUp, Users, MessageSquare, ShoppingCart, BarChart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Zap,
    text: "Instant Automation",
    description: "Set up powerful automations in seconds, not hours",
    color: "orange",
    bgColor: "bg-orange/10",
    borderColor: "border-orange/30",
    iconBg: "bg-orange",
  },
  {
    icon: TrendingUp,
    text: "10x Response Speed",
    description: "Reply to customers instantly, 24/7 without delays",
    color: "green",
    bgColor: "bg-green/10",
    borderColor: "border-green/30",
    iconBg: "bg-green",
  },
  {
    icon: Users,
    text: "Unlimited Contacts",
    description: "Scale without limits, handle thousands of conversations",
    color: "purple",
    bgColor: "bg-purple/10",
    borderColor: "border-purple/30",
    iconBg: "bg-purple",
  },
  {
    icon: MessageSquare,
    text: "Smart AI Replies",
    description: "AI-powered responses that feel natural and personal",
    color: "red",
    bgColor: "bg-red/10",
    borderColor: "border-red/30",
    iconBg: "bg-red",
  },
  {
    icon: ShoppingCart,
    text: "Built-in Checkout",
    description: "Accept payments directly in Instagram DMs",
    color: "yellow",
    bgColor: "bg-yellow/10",
    borderColor: "border-yellow/30",
    iconBg: "bg-yellow",
  },
  {
    icon: BarChart,
    text: "Real-time Analytics",
    description: "Track performance and optimize your automation",
    color: "maroon",
    bgColor: "bg-maroon/10",
    borderColor: "border-maroon/30",
    iconBg: "bg-maroon",
  },
]

export function HorizontalScroll() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  const checkScroll = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)

    // Calculate active index based on scroll position
    const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 0
    const gap = 24 // gap-6 = 24px
    const index = Math.round(scrollLeft / (cardWidth + gap))
    setActiveIndex(index)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    checkScroll()
    container.addEventListener("scroll", checkScroll)
    window.addEventListener("resize", checkScroll)

    return () => {
      container.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
    }
  }, [])

  const scrollToCard = (index: number) => {
    if (!scrollContainerRef.current) return

    const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 0
    const gap = 24
    const scrollPosition = index * (cardWidth + gap)

    scrollContainerRef.current.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    })
  }

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 0
    const gap = 24
    const scrollAmount = cardWidth + gap

    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <section className="py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-8 lg:mb-12 text-center">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">Everything You Need</h3>
          <p className="text-base md:text-lg text-muted-foreground">All-in-one Instagram automation platform</p>
        </div>

        {/* Desktop: Horizontal scroll with navigation */}
        <div className="hidden md:block relative">
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-lg"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}

          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-lg"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory px-12"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={`flex-shrink-0 w-80 ${feature.bgColor} border-2 ${feature.borderColor} rounded-2xl p-6 shadow-lg hover:scale-105 transition-all snap-center group`}
                >
                  <div
                    className={`w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7 text-black" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">{feature.text}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToCard(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex ? "w-8 bg-orange" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="md:hidden grid grid-cols-1 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`${feature.bgColor} border-2 ${feature.borderColor} rounded-2xl p-6 shadow-lg`}
              >
                <div className={`w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7 text-black" />
                </div>
                <h4 className="text-xl font-bold mb-2">{feature.text}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
