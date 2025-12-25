"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, MessageSquare, TrendingUp, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

type Message = {
  type: "bot" | "user" | "comment"
  text: string
  hasImage: boolean
  image?: string
  productName?: string
  productPrice?: string
  isCalendar?: boolean
  isHandoff?: boolean
}

type DMScenario = {
  id: string
  title: string
  messages: Message[]
}

const dmScenarios: DMScenario[] = [
  {
    id: "ecommerce",
    title: "E-commerce Shopping",
    messages: [
      { type: "bot", text: "Hey! 👋 Check out our new collection!", hasImage: false },
      { type: "user", text: "Show me the bags!", hasImage: false },
      {
        type: "bot",
        text: "Here are our bestsellers! 🔥",
        hasImage: true,
        image: "/ecommerce-shopping-bags-and-products.jpg",
        productName: "Premium Leather Bag",
        productPrice: "$299",
      },
      { type: "user", text: "Love it! Add to cart 🛍️", hasImage: false },
      { type: "bot", text: "Added! Ready to checkout? 💳", hasImage: false },
    ],
  },
  {
    id: "booking",
    title: "Appointment Booking",
    messages: [
      { type: "bot", text: "Hi! Want to book a consultation? 📅", hasImage: false },
      { type: "user", text: "Yes, what times are available?", hasImage: false },
      {
        type: "bot",
        text: "Here are available slots:",
        hasImage: true,
        image: "/calendar-booking-appointment-scheduling.jpg",
        isCalendar: true,
      },
      { type: "user", text: "Book me for 2pm tomorrow!", hasImage: false },
      { type: "bot", text: "Booked! ✅ Confirmation sent to your email", hasImage: false },
    ],
  },
  {
    id: "support",
    title: "AI to Human Handoff",
    messages: [
      { type: "bot", text: "How can I help you today? 🤖", hasImage: false },
      { type: "user", text: "I need help with my order", hasImage: false },
      { type: "bot", text: "Let me connect you with our team...", hasImage: false },
      {
        type: "bot",
        text: "Sarah from support is here! 👋",
        hasImage: true,
        image: "/customer-support-headset-help-desk.jpg",
        isHandoff: true,
      },
      { type: "user", text: "Thanks! That was quick!", hasImage: false },
    ],
  },
  {
    id: "comment-reply",
    title: "Comment to DM Flow",
    messages: [
      {
        type: "comment",
        text: "Someone commented: 'Where can I buy this? 😍'",
        hasImage: true,
        image: "/influencer-marketing-megaphone-social-media.jpg",
      },
      { type: "bot", text: "Hey! I saw your comment! 👋 Here's the link...", hasImage: false },
      { type: "user", text: "Perfect! How much?", hasImage: false },
      { type: "bot", text: "$149 with free shipping! 🚚", hasImage: false },
      { type: "user", text: "Sold! 💳", hasImage: false },
    ],
  },
]

export function HeroSection() {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [messageStep, setMessageStep] = useState(0)
  const [showCursor, setShowCursor] = useState(false)

  useEffect(() => {
    setMessageStep(0)
    setShowCursor(false)

    const messageInterval = setInterval(() => {
      setMessageStep((prev) => {
        const maxSteps = dmScenarios[currentScenario].messages.length
        if (prev < maxSteps - 1) {
          return prev + 1
        }
        return prev
      })
    }, 1500)

    const cursorTimeout = setTimeout(() => {
      setShowCursor(true)
    }, 3000)

    const scenarioTimeout = setTimeout(
      () => {
        setCurrentScenario((prev) => (prev + 1) % dmScenarios.length)
      },
      dmScenarios[currentScenario].messages.length * 1500 + 2000,
    )

    return () => {
      clearInterval(messageInterval)
      clearTimeout(cursorTimeout)
      clearTimeout(scenarioTimeout)
    }
  }, [currentScenario])

  const scenario = dmScenarios[currentScenario]

  return (
    <section className="pt-20 pb-32 lg:pt-32 lg:pb-48 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[10%] w-20 h-20 bg-orange rounded-2xl opacity-10 animate-float" />
        <div className="absolute top-40 left-[15%] w-16 h-16 bg-green rounded-full opacity-10 animate-float-delayed" />
        <div className="absolute bottom-40 right-[20%] w-24 h-24 bg-red rounded-2xl opacity-10 animate-float" />
        <div className="absolute top-60 right-[30%] w-12 h-12 bg-yellow rounded-full opacity-10 animate-float-delayed" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-orange/20 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-orange" />
              <span className="text-sm font-medium text-muted-foreground">10,000+ businesses trust yazzil</span>
            </div> */}

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] animate-fade-in-up">
              Turn Instagram DMs Into{" "}
              <span className="relative inline-block">
                <span className="text-orange">Revenue</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 10C50 5 100 2 150 3C200 4 250 7 298 10"
                    stroke="#ff6b35"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed animate-fade-in-up max-w-xl">
              Automate conversations, close sales, and scale your Instagram business while you sleep.
            </p>

            <div className="flex flex-wrap gap-8 animate-fade-in-up">
              <div>
                <div className="text-3xl font-bold text-green">98%</div>
                <div className="text-sm text-muted-foreground">Response Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange">3.2x</div>
                <div className="text-sm text-muted-foreground">More Sales</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow">24/7</div>
                <div className="text-sm text-muted-foreground">Automations</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in-up">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-orange text-black hover:bg-orange/90 text-lg px-8 py-6 h-auto font-semibold shadow-lg shadow-orange/20 w-full sm:w-auto"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a
                href="https://calendly.com/tecashe111/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 h-auto border-2 border-muted text-white hover:border-orange hover:text-orange bg-transparent w-full"
                >
                  Talk to Sales
                  <Zap className="ml-2 w-5 h-5" />
                </Button>
              </a>
            </div>

            <p className="text-sm text-muted-foreground animate-fade-in-up">
              No credit card required • Setup in 2 minutes • Cancel anytime
            </p>
          </div>

          <div className="relative animate-fade-in-up lg:animate-slide-in-right">
            <div className="absolute -top-8 -left-8 bg-card border border-green/20 rounded-2xl p-4 shadow-xl z-10 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green" />
                </div>
                <div>
                  <div className="text-sm font-semibold">+234%</div>
                  <div className="text-xs text-muted-foreground">Engagement</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -right-8 bg-card border border-orange/20 rounded-2xl p-4 shadow-xl z-10 animate-float-delayed">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange/20 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-orange" />
                </div>
                <div>
                  <div className="text-sm font-semibold">1,247</div>
                  <div className="text-xs text-muted-foreground">DMs Today</div>
                </div>
              </div>
            </div>

            <div className="relative mx-auto max-w-sm">
              <div className="bg-card border-4 border-border rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="bg-background h-8 flex items-center justify-center">
                  <div className="w-32 h-6 bg-card rounded-full" />
                </div>

                <div className="bg-card">
                  <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">yazzil Bot</p>
                      <p className="text-xs text-green flex items-center gap-1">
                        <span className="w-2 h-2 bg-green rounded-full" />
                        Active now
                      </p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 min-h-[450px]">
                    {scenario.messages.slice(0, messageStep + 1).map((message, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-2 ${message.type === "user" ? "justify-end" : ""} ${
                          idx === messageStep ? "animate-slide-in-left" : ""
                        }`}
                      >
                        {message.type === "comment" ? (
                          <div className="w-full bg-muted border border-purple/20 rounded-xl p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-purple rounded-full" />
                              <div>
                                <p className="text-xs font-semibold">New Comment</p>
                                <p className="text-xs text-muted-foreground">@fashionlover</p>
                              </div>
                            </div>
                            {message.hasImage && message.image && (
                              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                                <Image
                                  src={message.image || "/placeholder.svg"}
                                  alt="Post"
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, 300px"
                                />
                              </div>
                            )}
                            <p className="text-sm">{message.text}</p>
                          </div>
                        ) : message.type === "user" ? (
                          <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                            <p className="text-sm text-black font-medium">{message.text}</p>
                          </div>
                        ) : (
                          <div className="max-w-[85%] space-y-2">
                            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                              <p className="text-sm">{message.text}</p>
                            </div>
                            {message.hasImage && message.image && (
                              <div className="bg-card border border-border rounded-xl p-3 space-y-2 relative">
                                {message.isCalendar ? (
                                  <div className="space-y-2">
                                    <div className="relative w-full h-24 rounded-lg overflow-hidden">
                                      <Image
                                        src={message.image || "/placeholder.svg"}
                                        alt="Calendar"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 300px"
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <button className="flex-1 text-xs bg-green text-black px-3 py-2 rounded-lg font-medium">
                                        2:00 PM
                                      </button>
                                      <button className="flex-1 text-xs bg-muted px-3 py-2 rounded-lg">4:00 PM</button>
                                    </div>
                                  </div>
                                ) : message.isHandoff ? (
                                  <div className="space-y-2">
                                    <div className="relative w-full h-24 rounded-lg overflow-hidden">
                                      <Image
                                        src={message.image || "/placeholder.svg"}
                                        alt="Support agent"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 300px"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-green rounded-full animate-pulse" />
                                      <p className="text-xs text-green font-medium">Sarah is typing...</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex gap-3 relative">
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-maroon">
                                      <Image
                                        src={message.image || "/placeholder.svg"}
                                        alt={message.productName || "Product"}
                                        fill
                                        className="object-cover"
                                        sizes="100px"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-semibold text-sm">{message.productName}</p>
                                      <p className="text-xs text-muted-foreground">{message.productPrice}</p>
                                      <button className="mt-1 text-xs bg-green text-black px-3 py-1 rounded-full font-medium hover:bg-green/90 transition-colors">
                                        Add to Cart
                                      </button>
                                    </div>
                                    {showCursor && idx === messageStep && (
                                      <div className="absolute top-12 right-8 pointer-events-none cursor-animate">
                                        <svg
                                          width="20"
                                          height="20"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          className="text-orange drop-shadow-lg"
                                        >
                                          <path
                                            d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                                            fill="currentColor"
                                            stroke="white"
                                            strokeWidth="1"
                                          />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-5deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 1s;
        }
        .cursor-animate {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          from,
          to {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}