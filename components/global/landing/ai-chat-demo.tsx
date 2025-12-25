// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { Bot, Send, User, Sparkles } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"

// interface Message {
//   role: "user" | "assistant"
//   content: string
// }

// export default function AiChatDemo() {
//   const [messages, setMessages] = useState<Message[]>([
//     { role: "assistant", content: "Hi there! 👋 I'm your Instagram DM assistant. How can I help you today?" },
//   ])
//   const [input, setInput] = useState("")
//   const [isTyping, setIsTyping] = useState(false)

//   const predefinedResponses: Record<string, string> = {
//     "Do you offer international shipping?":
//       "Yes, we ship to over 50 countries worldwide! Shipping costs vary by location. Would you like me to check the shipping cost for your country?",
//     "What's your return policy?":
//       "We offer a 30-day satisfaction guarantee! If you're not happy with your purchase, you can return it within 30 days for a full refund or exchange.",
//     "Are there any discounts available?":
//       "Great question! We currently have a special promotion: 15% off your first order with code WELCOME15. Would you like me to apply this to your cart?",
//     "How long does shipping take?":
//       "Domestic orders typically arrive in 3-5 business days. International shipping can take 7-14 business days depending on your location and customs processing.",
//     "Can I track my order?":
//       "Once your order ships, you'll receive a tracking number via email. You can also check your order status anytime in your account dashboard.",
//   }

//   const handleSend = () => {
//     if (!input.trim()) return

//     // Add user message
//     const userMessage: Message = { role: "user", content: input }
//     setMessages((prev) => [...prev, userMessage])
//     setInput("")

//     // Simulate AI typing
//     setIsTyping(true)

//     // Simulate AI response after a delay
//     setTimeout(() => {
//       let response = "I will need to check on that for you. Let me connect you with our team for more information!"

//       // Check for predefined responses
//       for (const [question, answer] of Object.entries(predefinedResponses)) {
//         if (input.toLowerCase().includes(question.toLowerCase().split(" ")[0])) {
//           response = answer
//           break
//         }
//       }

//       setMessages((prev) => [...prev, { role: "assistant", content: response }])
//       setIsTyping(false)
//     }, 1500)
//   }

//   return (
//     <div className="bg-slate-900 border border-blue-900/50 rounded-xl overflow-hidden shadow-xl shadow-blue-900/20 h-[400px] flex flex-col">
//       <div className="bg-slate-800 p-3 border-b border-blue-900/30 flex items-center">
//         <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center mr-3">
//           <Bot className="h-4 w-4 text-blue-400" />
//         </div>
//         <div>
//           <div className="font-medium text-white">Yazzil Assistant</div>
//           <div className="text-xs text-slate-400 flex items-center">
//             <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
//             Online
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((message, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
//           >
//             {message.role === "assistant" && (
//               <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center mr-2 flex-shrink-0">
//                 <Bot className="h-4 w-4 text-blue-400" />
//               </div>
//             )}

//             <div
//               className={`max-w-[80%] rounded-2xl px-4 py-2 ${
//                 message.role === "user"
//                   ? "bg-blue-600 text-white rounded-tr-none"
//                   : "bg-slate-800 text-slate-200 rounded-tl-none"
//               }`}
//             >
//               <p className="text-sm">{message.content}</p>
//             </div>

//             {message.role === "user" && (
//               <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center ml-2 flex-shrink-0">
//                 <User className="h-4 w-4 text-slate-300" />
//               </div>
//             )}
//           </motion.div>
//         ))}

//         {isTyping && (
//           <div className="flex justify-start">
//             <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center mr-2">
//               <Bot className="h-4 w-4 text-blue-400" />
//             </div>
//             <div className="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3">
//               <div className="flex space-x-1">
//                 <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"></div>
//                 <div
//                   className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"
//                   style={{ animationDelay: "0.2s" }}
//                 ></div>
//                 <div
//                   className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"
//                   style={{ animationDelay: "0.4s" }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="p-3 border-t border-blue-900/30">
//         <div className="flex items-center">
//           <Input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && handleSend()}
//             placeholder="Type a message..."
//             className="flex-1 bg-slate-800 border-none rounded-l-full px-4 py-2 text-sm text-white focus:outline-none"
//           />
//           <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 rounded-r-full px-3 py-2 h-10">
//             <Send className="h-4 w-4 text-white" />
//           </Button>
//         </div>
//         <div className="mt-2 flex items-center justify-center">
//           <Sparkles className="h-3 w-3 text-blue-400 mr-1.5" />
//           <span className="text-xs text-slate-400">Try asking about shipping, returns, or discounts</span>
//         </div>
//       </div>
//     </div>
//   )
// }



"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MessageSquare, Target, Database } from "lucide-react"

export default function ScrollAnimatedFlowSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])

  const steps = [
    {
      id: 1,
      title: "Instagram DMs Captured",
      description: "AI automatically responds to every Instagram DM with personalized, intelligent messages that engage your audience.",
      image: "/captured.png",
      icon: MessageSquare,
      color: "from-blue-500/20 to-cyan-500/20",
      position: "left"
    },
    {
      id: 2,
      title: "Leads Qualified with AI",
      description: "Smart algorithms analyze conversation patterns, sentiment, and intent to identify high-quality prospects.",
      image: "/qualified.png",
      icon: Target,
      color: "from-purple-500/20 to-pink-500/20",
      position: "center"
    },
    {
      id: 3,
      title: "Synced to Your CRM",
      description: "Qualified leads automatically flow into your CRM with complete conversation context and lead scoring.",
      image: "/synced.png",
      icon: Database,
      color: "from-green-500/20 to-emerald-500/20",
      position: "right"
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const stepId = parseInt(entry.target.getAttribute('data-step') || '0')
          
          if (entry.isIntersecting) {
            setVisibleSteps(prev => {
              if (!prev.includes(stepId)) {
                return [...prev, stepId]
              }
              return prev
            })
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: "-50px 0px -50px 0px"
      }
    )

    const stepElements = document.querySelectorAll('[data-step]')
    stepElements.forEach(el => observer.observe(el))

    return () => {
      stepElements.forEach(el => observer.unobserve(el))
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
            Complete Solution
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl/tight">
            From Instagram DMs to CRM in one seamless flow
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-xl">
            Watch how conversations transform into qualified leads through our intelligent automation pipeline.
          </p>
        </div>

        {/* Animated Flow Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-green-500/30 transform -translate-y-1/2 z-0" />
          
          {/* Flow Arrows */}
          <div className="hidden lg:block absolute top-1/2 left-1/3 transform -translate-y-1/2 z-10">
            <div className="bg-background rounded-full p-2 border shadow-lg">
              <ArrowRight className="h-4 w-4 text-purple-500" />
            </div>
          </div>
          <div className="hidden lg:block absolute top-1/2 left-2/3 transform -translate-y-1/2 z-10">
            <div className="bg-background rounded-full p-2 border shadow-lg">
              <ArrowRight className="h-4 w-4 text-green-500" />
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              const isVisible = visibleSteps.includes(step.id)
              
              return (
                <div
                  key={step.id}
                  data-step={step.id}
                  className={`relative transition-all duration-1000 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: `${index * 200}ms`
                  }}
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} border-2 border-background flex items-center justify-center shadow-lg`}>
                      <span className="text-sm font-bold text-foreground">{step.id}</span>
                    </div>
                  </div>

                  {/* Main Card */}
                  <div className="relative group">
                    {/* Glow Effect */}
                    <div className={`absolute -inset-4 bg-gradient-to-r ${step.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Card Content */}
                    <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                      {/* Icon */}
                      <div className="flex justify-center mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${step.color} border`}>
                          <IconComponent className="h-6 w-6 text-foreground" />
                        </div>
                      </div>

                      {/* Image Container with 3D Effect */}
                      <div className="relative mb-6 group">
                        <div className="relative overflow-hidden rounded-xl">
                          {/* Background Images for Depth */}
                          <div className="absolute inset-0 transform translate-x-2 translate-y-2 opacity-20">
                            <Image
                              src="/eight.png"
                              alt="Background Layer"
                              width={400}
                              height={250}
                              className="w-full h-auto rounded-xl"
                            />
                          </div>
                          <div className="absolute inset-0 transform translate-x-1 translate-y-1 opacity-40">
                            <Image
                              src="/eleven.png"
                              alt="Middle Layer"
                              width={400}
                              height={250}
                              className="w-full h-auto rounded-xl"
                            />
                          </div>
                          
                          {/* Main Image */}
                          <div className="relative z-10 transform transition-transform duration-500 hover:scale-105">
                            <Image
                              src={step.image}
                              alt={step.title}
                              width={400}
                              height={250}
                              className="w-full h-auto rounded-xl shadow-lg"
                            />
                          </div>

                          {/* Overlay Gradient */}
                          <div className={`absolute inset-0 bg-gradient-to-t ${step.color} opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-xl`} />
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full opacity-60 animate-pulse" />
                        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-500 rounded-full opacity-40 animate-pulse delay-500" />
                      </div>

                      {/* Text Content */}
                      <div className="text-center space-y-3">
                        <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                          {step.title}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      {/* Progress Indicator */}
                      <div className="mt-6 flex justify-center">
                        <div className="flex space-x-1">
                          {[1, 2, 3].map((dot) => (
                            <div
                              key={dot}
                              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                dot <= step.id ? 'bg-primary' : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Connection Arrow */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center mt-8">
                      <div className="bg-background rounded-full p-2 border shadow-lg">
                        <ArrowRight className="h-4 w-4 text-primary rotate-90" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center mt-16">
          <div className={`transition-all duration-1000 ${
            visibleSteps.length >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <p className="text-muted-foreground mb-4">
              Ready to see this automation in action?
            </p>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-primary-foreground px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Start Your Free Trial
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}