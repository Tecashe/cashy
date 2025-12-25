"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReelItem {
  id: number
  title: string
  description: string
  category: string
  thumbnail: string
}

const reels: ReelItem[] = [
  {
    id: 1,
    title: "E-commerce Automation",
    description: "Watch how a fashion brand automated 1000+ DMs per day",
    category: "Shopping",
    thumbnail: "/luxury-designer-handbag-brown-leather.jpg",
  },
  {
    id: 2,
    title: "Story Reply Magic",
    description: "See automated story replies convert followers to customers",
    category: "Engagement",
    thumbnail: "/fashion-model-wearing-new-summer-collection.jpg",
  },
  {
    id: 3,
    title: "Comment to Sale",
    description: "Turn post comments into sales conversations automatically",
    category: "Sales",
    thumbnail: "/ecommerce-shopping-bags-and-products.jpg",
  },
  {
    id: 4,
    title: "Booking Automation",
    description: "Schedule appointments directly through Instagram DMs",
    category: "Scheduling",
    thumbnail: "/calendar-booking-appointment-scheduling.jpg",
  },
]

export function AutomationReels() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const progressInterval = useRef<NodeJS.Timeout>()

  const currentReel = reels[currentIndex]

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext()
            return 0
          }
          return prev + 1
        })
      }, 60) // 6 seconds per reel
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [isPlaying, currentIndex])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reels.length)
    setProgress(0)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length)
    setProgress(0)
  }

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See It In <span className="text-orange">Action</span>
          </h2>
          <p className="text-xl text-muted-foreground">Real automation demos from real businesses</p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Instagram Reels-style container */}
          <div className="relative aspect-[9/16] bg-card rounded-3xl overflow-hidden shadow-2xl border-4 border-orange/20">
            {/* Progress bars */}
            <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-3">
              {reels.map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100"
                    style={{
                      width: index < currentIndex ? "100%" : index === currentIndex ? `${progress}%` : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Video placeholder with thumbnail */}
            <div className="absolute inset-0">
              <img
                src={currentReel.thumbnail || "/placeholder.svg"}
                alt={currentReel.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-orange text-white text-sm font-semibold rounded-full mb-3">
                  {currentReel.category}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">{currentReel.title}</h3>
                <p className="text-white/90 text-sm">{currentReel.description}</p>
              </div>

              {/* Video placeholder indicator */}
              <div className="flex items-center gap-2 text-white/70 text-xs">
                <div className="w-2 h-2 bg-red rounded-full animate-pulse" />
                
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-24 left-0 right-0 z-20 flex items-center justify-between px-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="bg-black/50 hover:bg-black/70 text-white rounded-full"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="bg-black/50 hover:bg-black/70 text-white rounded-full"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* CTA below reels */}
          <div className="mt-8 text-center">
            <Button size="lg" className="bg-orange hover:bg-orange/90 text-white font-semibold px-8" asChild>
              <a href="/dashboard">Start Automating Free</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
