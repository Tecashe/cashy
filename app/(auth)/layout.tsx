// import type { ReactNode } from "react"

// export default function AuthLayout({ children }: { children: ReactNode }) {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-slate-900 dark:via-purple-900 dark:to-pink-900">
//       <div className="w-full max-w-md">{children}</div>
//     </div>
//   )
// }


"use client"

import type React from "react"
import { Suspense, useState, useEffect } from "react"
import { Loader2, Instagram } from "lucide-react"

// Three sets of images: Creatives, Business, E-commerce
const imageSets = {
  creatives: [
    "/images/auth/creative-1.jpg",
    "/images/auth/creative-2.jpg",
    "/images/auth/creative-3.jpg",
    "/images/auth/creative-4.jpg",
    "/images/auth/creative-5.jpg",
    "/images/auth/creative-6.jpg",
  ],
  business: [
    "/images/auth/business-1.jpg",
    "/images/auth/business-2.jpg",
    "/images/auth/business-3.jpg",
    "/images/auth/business-4.jpg",
    "/images/auth/business-5.jpg",
    "/images/auth/business-6.jpg",
  ],
  ecommerce: [
    "/images/auth/ecommerce-1.jpg",
    "/images/auth/ecommerce-2.jpg",
    "/images/auth/ecommerce-3.jpg",
    "/images/auth/ecommerce-4.jpg",
    "/images/auth/ecommerce-5.jpg",
    "/images/auth/ecommerce-6.jpg",
  ],
}

type SlideDirection = "left" | "right" | "top" | "bottom"

const slideDirections: SlideDirection[] = ["left", "bottom", "right", "top", "left", "bottom"]

interface BentoCellProps {
  cellIndex: number
  direction: SlideDirection
  parallax: number
  mousePosition: { x: number; y: number }
  className?: string
}

function BentoCell({ cellIndex, direction, parallax, mousePosition, className = "" }: BentoCellProps) {
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sets = [imageSets.creatives, imageSets.business, imageSets.ecommerce]

  useEffect(() => {
    const interval = setInterval(
      () => {
        setIsTransitioning(true)
        setTimeout(() => {
          setCurrentSetIndex((prev) => (prev + 1) % 3)
          setIsTransitioning(false)
        }, 1500) // Transition takes 1.5 seconds
      },
      12000 + cellIndex * 2000, // 12-22 seconds per cell before switching
    )

    return () => clearInterval(interval)
  }, [cellIndex])

  const getTransitionClasses = () => {
    if (!isTransitioning) return "translate-x-0 translate-y-0 opacity-100"

    switch (direction) {
      case "left":
        return "-translate-x-full opacity-0"
      case "right":
        return "translate-x-full opacity-0"
      case "top":
        return "-translate-y-full opacity-0"
      case "bottom":
        return "translate-y-full opacity-0"
    }
  }

  const getEnterClasses = () => {
    switch (direction) {
      case "left":
        return "translate-x-full"
      case "right":
        return "-translate-x-full"
      case "top":
        return "translate-y-full"
      case "bottom":
        return "-translate-y-full"
    }
  }

  const parallaxStyle = {
    transform: `translate(${mousePosition.x * parallax}px, ${mousePosition.y * parallax}px)`,
  }

  const currentImage = sets[currentSetIndex][cellIndex]
  const nextImage = sets[(currentSetIndex + 1) % 3][cellIndex]

  return (
    <div className={`rounded-3xl overflow-hidden shadow-2xl ${className}`} style={parallaxStyle}>
      <div className="relative w-full h-full">
        {/* Current Image */}
        <img
          src={currentImage || "/placeholder.svg"}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-in-out ${getTransitionClasses()}`}
        />
        {/* Next Image (slides in) */}
        <img
          src={nextImage || "/placeholder.svg"}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-in-out ${
            isTransitioning ? "translate-x-0 translate-y-0 opacity-100" : `${getEnterClasses()} opacity-0`
          }`}
        />
      </div>
    </div>
  )
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const parallaxValues = [0.4, -0.3, 0.5, -0.4, 0.3, -0.5]

  return (
    <div className="h-screen bg-coral relative overflow-hidden flex">
      {/* Left Side - Bento Grid */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-6 xl:p-10">
        <div
          className={`
            grid grid-cols-3 grid-rows-3 gap-3 xl:gap-4 w-full max-w-3xl h-[90vh]
            ${mounted ? "animate-slide-up" : "opacity-0"}
          `}
        >
          {/* Large featured - spans 2 cols, 2 rows */}
          <BentoCell
            cellIndex={0}
            direction={slideDirections[0]}
            parallax={parallaxValues[0]}
            mousePosition={mousePosition}
            className="col-span-2 row-span-2"
          />

          {/* Top right */}
          <BentoCell
            cellIndex={1}
            direction={slideDirections[1]}
            parallax={parallaxValues[1]}
            mousePosition={mousePosition}
          />

          {/* Middle right */}
          <BentoCell
            cellIndex={2}
            direction={slideDirections[2]}
            parallax={parallaxValues[2]}
            mousePosition={mousePosition}
          />

          {/* Bottom left */}
          <BentoCell
            cellIndex={3}
            direction={slideDirections[3]}
            parallax={parallaxValues[3]}
            mousePosition={mousePosition}
          />

          {/* Bottom middle */}
          <BentoCell
            cellIndex={4}
            direction={slideDirections[4]}
            parallax={parallaxValues[4]}
            mousePosition={mousePosition}
          />

          {/* Bottom right */}
          <BentoCell
            cellIndex={5}
            direction={slideDirections[5]}
            parallax={parallaxValues[5]}
            mousePosition={mousePosition}
          />
        </div>
      </div>

      {/* Right Side - Floating Auth */}
      <main className="flex-1 flex items-center justify-center p-6 lg:p-8">
        <div
          className={`
            w-full max-w-md
            ${mounted ? "animate-slide-up" : "opacity-0"}
          `}
          style={{ animationDelay: "0.2s" }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-black/10">
              <Instagram className="w-7 h-7 text-coral" />
            </div>
          </div>

          {/* Clerk Component - No background wrapper */}
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
      </main>

      {/* Mobile floating images */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none lg:hidden">
          <div
            className="absolute top-6 left-4 w-36 h-36 rounded-2xl overflow-hidden shadow-xl animate-float opacity-50"
            style={{ transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)` }}
          >
            <img src={imageSets.creatives[0] || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
          </div>
          <div
            className="absolute top-12 right-4 w-32 h-32 rounded-2xl overflow-hidden shadow-xl animate-float-reverse opacity-50"
            style={{ transform: `translate(${mousePosition.x * -0.4}px, ${mousePosition.y * -0.4}px)` }}
          >
            <img src={imageSets.business[1] || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
          </div>
          <div
            className="absolute bottom-24 left-6 w-28 h-28 rounded-2xl overflow-hidden shadow-xl animate-bounce-subtle opacity-50"
            style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}
          >
            <img src={imageSets.ecommerce[2] || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
          </div>
          <div
            className="absolute bottom-16 right-6 w-32 h-32 rounded-2xl overflow-hidden shadow-xl animate-wave opacity-50"
            style={{ transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)` }}
          >
            <img src={imageSets.creatives[3] || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      )}
    </div>
  )
}
