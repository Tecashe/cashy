"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Story {
  id: number
  author: string
  business: string
  avatar: string
  fallback: string
  metric: string
  result: string
  thumbnail: string
  color: string
}

const stories: Story[] = [
  {
    id: 1,
    author: "Sarah Chen",
    business: "Fashion Boutique",
    avatar: "/professional-woman-smiling.png",
    fallback: "SC",
    metric: "300% Sales Increase",
    result: "Automated 2,000+ DMs monthly",
    thumbnail: "/luxury-designer-handbag-brown-leather.jpg",
    color: "orange",
  },
  {
    id: 2,
    author: "Mike Rodriguez",
    business: "Fitness Coach",
    avatar: "/fitness-coach-man.jpg",
    fallback: "MR",
    metric: "500+ Bookings/Month",
    result: "Automated appointment scheduling",
    thumbnail: "/fitness-workout-gym-motivation.jpg",
    color: "green",
  },
  {
    id: 3,
    author: "Emma Wilson",
    business: "Beauty Brand",
    avatar: "/professional-woman-glasses.png",
    fallback: "EW",
    metric: "85% Response Rate",
    result: "Instant customer support 24/7",
    thumbnail: "/customer-support-headset-help-desk.jpg",
    color: "purple",
  },
  {
    id: 4,
    author: "David Kim",
    business: "Restaurant Owner",
    avatar: "/smiling-chef.png",
    fallback: "DK",
    metric: "1,200+ Reservations",
    result: "Automated table bookings via DM",
    thumbnail: "/calendar-booking-appointment-scheduling.jpg",
    color: "red",
  },
  {
    id: 5,
    author: "Lisa Martinez",
    business: "E-commerce Store",
    avatar: "/professional-woman-smiling.png",
    fallback: "LM",
    metric: "$50K+ Revenue",
    result: "Automated product recommendations",
    thumbnail: "/ecommerce-shopping-bags-and-products.jpg",
    color: "yellow",
  },
]

export function SuccessStories() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const storyWidth = 220 // width + gap

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("stories-container")
    if (!container) return

    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - storyWidth)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + storyWidth)

    container.scrollTo({ left: newPosition, behavior: "smooth" })
    setScrollPosition(newPosition)
  }

  return (
    <section className="py-20 bg-card relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Success <span className="text-green">Stories</span>
          </h2>
          <p className="text-xl text-muted-foreground">Real results from businesses using yazzil</p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background rounded-full shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleScroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background rounded-full shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Stories container */}
          <div
            id="stories-container"
            className="flex gap-4 overflow-x-auto scrollbar-hide px-12"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {stories.map((story) => (
              <div key={story.id} className="flex-shrink-0 w-[200px] group cursor-pointer">
                {/* Instagram Story style */}
                <div
                  className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-4 border-${story.color} shadow-xl transition-transform group-hover:scale-105`}
                >
                  {/* Background image */}
                  <img
                    src={story.thumbnail || "/placeholder.svg"}
                    alt={story.author}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  {/* Author info at top */}
                  <div className="absolute top-4 left-4 right-4 flex items-center gap-2 z-10">
                    <Avatar className={`w-10 h-10 border-2 border-${story.color}`}>
                      <AvatarImage src={story.avatar || "/placeholder.svg"} alt={story.author} />
                      <AvatarFallback>{story.fallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{story.author}</p>
                      <p className="text-white/80 text-xs truncate">{story.business}</p>
                    </div>
                  </div>

                  {/* Metrics at bottom */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className={`inline-block px-3 py-1 bg-${story.color} rounded-full mb-2`}>
                      <p className="text-white font-bold text-lg">{story.metric}</p>
                    </div>
                    <p className="text-white text-sm font-medium">{story.result}</p>
                  </div>

                  {/* Video placeholder indicator */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business name below */}
                <p className="text-center mt-3 text-sm font-medium text-foreground">{story.business}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Join 10,000+ businesses automating with yazzil</p>
          <Button size="lg" className="bg-green hover:bg-green/90 text-white font-semibold px-8" asChild>
            <a href="/dashboard">Start Your Success Story</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
