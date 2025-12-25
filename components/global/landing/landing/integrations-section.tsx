// "use client"

// import { useEffect, useRef, useState } from "react"
// import { MessageSquare, ShoppingCart, Calendar, CreditCard, Users, Video } from "lucide-react"

// export function IntegrationsSection() {
//   const sectionRef = useRef<HTMLDivElement>(null)
//   const [activeScenario, setActiveScenario] = useState(0)
//   const scenarios = ["ecommerce", "booking", "payment", "crm"]

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("revealed")
//           }
//         })
//       },
//       { threshold: 0.1 },
//     )

//     const elements = sectionRef.current?.querySelectorAll(".scroll-reveal")
//     elements?.forEach((el) => observer.observe(el))

//     return () => observer.disconnect()
//   }, [])

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveScenario((prev) => (prev + 1) % scenarios.length)
//     }, 3000)
//     return () => clearInterval(interval)
//   }, [scenarios.length])

//   const currentScenario = scenarios[activeScenario]

//   return (
//     <section ref={sectionRef} className="py-16 lg:py-20 relative overflow-hidden">
//       {/* Background decoration */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange/5 rounded-full blur-3xl" />
//       </div>

//       <div className="container mx-auto px-4 lg:px-8 relative z-10">
//         <div className="text-center mb-12 lg:mb-20 scroll-reveal">
//           <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6">
//             Connects With <span className="text-orange">Everything</span>
//           </h2>
//           <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
//             Watch data flow seamlessly between Instagram DMs and your favorite tools
//           </p>
//         </div>

//         {/* Mobile Layout */}
//         <div className="lg:hidden space-y-8">
//           {/* Center DM Interface */}
//           <div className="max-w-md mx-auto">
//             <div className="bg-card border-4 border-border rounded-3xl overflow-hidden shadow-2xl">
//               {/* DM Header */}
//               <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-3">
//                 <MessageSquare className="w-6 h-6 text-orange" />
//                 <div>
//                   <p className="font-semibold text-sm">Instagram DM</p>
//                   <p className="text-xs text-green flex items-center gap-1">
//                     <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
//                     Processing...
//                   </p>
//                 </div>
//               </div>

//               {/* DM Content */}
//               <div className="p-4 space-y-3 min-h-[200px]">
//                 {currentScenario === "ecommerce" && (
//                   <>
//                     <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
//                       <p className="text-sm">I want to buy the blue sneakers!</p>
//                     </div>
//                     <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%]">
//                       <p className="text-sm text-black font-medium">Processing order... 🛍️</p>
//                     </div>
//                   </>
//                 )}
//                 {currentScenario === "booking" && (
//                   <>
//                     <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
//                       <p className="text-sm">Book me for tomorrow at 2pm</p>
//                     </div>
//                     <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%]">
//                       <p className="text-sm text-black font-medium">Checking calendar... 📅</p>
//                     </div>
//                   </>
//                 )}
//                 {currentScenario === "payment" && (
//                   <>
//                     <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
//                       <p className="text-sm">Ready to checkout!</p>
//                     </div>
//                     <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%]">
//                       <p className="text-sm text-black font-medium">Processing payment... 💳</p>
//                     </div>
//                   </>
//                 )}
//                 {currentScenario === "crm" && (
//                   <>
//                     <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
//                       <p className="text-sm">Tell me more about your services</p>
//                     </div>
//                     <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%]">
//                       <p className="text-sm text-black font-medium">Updating CRM... 📊</p>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Integration Icons Grid */}
//           <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
//             <div
//               className={`p-4 bg-card border-3 rounded-2xl flex flex-col items-center justify-center shadow-xl transition-all ${
//                 currentScenario === "ecommerce" ? "border-green shadow-green/20 scale-105" : "border-border"
//               }`}
//             >
//               <ShoppingCart
//                 className={`w-8 h-8 mb-2 ${currentScenario === "ecommerce" ? "text-green" : "text-muted"}`}
//               />
//               <p className="text-xs font-medium text-center">Shopify</p>
//             </div>

//             <div
//               className={`p-4 bg-card border-3 rounded-2xl flex flex-col items-center justify-center shadow-xl transition-all ${
//                 currentScenario === "payment" ? "border-purple shadow-purple/20 scale-105" : "border-border"
//               }`}
//             >
//               <CreditCard className={`w-8 h-8 mb-2 ${currentScenario === "payment" ? "text-purple" : "text-muted"}`} />
//               <p className="text-xs font-medium text-center">Stripe</p>
//             </div>

//             <div
//               className={`p-4 bg-card border-3 rounded-2xl flex flex-col items-center justify-center shadow-xl transition-all ${
//                 currentScenario === "booking" ? "border-yellow shadow-yellow/20 scale-105" : "border-border"
//               }`}
//             >
//               <Calendar className={`w-8 h-8 mb-2 ${currentScenario === "booking" ? "text-yellow" : "text-muted"}`} />
//               <p className="text-xs font-medium text-center">Calendly</p>
//             </div>

//             <div
//               className={`p-4 bg-card border-3 rounded-2xl flex flex-col items-center justify-center shadow-xl transition-all ${
//                 currentScenario === "crm" ? "border-red shadow-red/20 scale-105" : "border-border"
//               }`}
//             >
//               <Users className={`w-8 h-8 mb-2 ${currentScenario === "crm" ? "text-red" : "text-muted"}`} />
//               <p className="text-xs font-medium text-center">HubSpot</p>
//             </div>

//             <div className="p-4 bg-card border-3 border-border rounded-2xl flex flex-col items-center justify-center shadow-xl">
//               <Video className="w-8 h-8 mb-2 text-muted" />
//               <p className="text-xs font-medium text-center">Zoom</p>
//             </div>

//             <div className="p-4 bg-card border-3 border-border rounded-2xl flex flex-col items-center justify-center shadow-xl">
//               <Users className="w-8 h-8 mb-2 text-muted" />
//               <p className="text-xs font-medium text-center">Salesforce</p>
//             </div>
//           </div>
//         </div>

//         {/* Desktop Layout with connecting lines */}
//         <div className="hidden lg:block relative max-w-6xl mx-auto h-[700px] scroll-reveal">
//           {/* Center - DM Interface */}
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
//             <div className="w-80 bg-card border-4 border-border rounded-3xl overflow-hidden shadow-2xl">
//               {/* DM Header */}
//               <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-3">
//                 <MessageSquare className="w-6 h-6 text-orange" />
//                 <div>
//                   <p className="font-semibold text-sm">Instagram DM</p>
//                   <p className="text-xs text-green flex items-center gap-1">
//                     <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
//                     Processing...
//                   </p>
//                 </div>
//               </div>

//               {/* DM Content */}
//               <div className="p-4 space-y-3 min-h-[200px]">
//                 {currentScenario === "ecommerce" && (
//                   <>
//                     <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
//                       <p className="text-sm">I want to buy the blue sneakers!</p>
//                     </div>
//                     <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%]">
//                       <p className="text-sm text-black font-medium">Processing order... 🛍️</p>
//                     </div>
//                   </>
//                 )}
//                 {currentScenario === "booking" && (
//                   <>
//                     <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
//                       <p className="text-sm">Book me for tomorrow at 2pm</p>
//                     </div>
//                     <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%]">
//                       <p className="text-sm text-black font-medium">Checking calendar... 📅</p>
//                     </div>
//                   </>
//                 )}
//                 {currentScenario === "payment" && (
//                   <>
//                     <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
//                       <p className="text-sm">Ready to checkout!</p>
//                     </div>
//                     <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%]">
//                       <p className="text-sm text-black font-medium">Processing payment... 💳</p>
//                     </div>
//                   </>
//                 )}
//                 {currentScenario === "crm" && (
//                   <>
//                     <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
//                       <p className="text-sm">Tell me more about your services</p>
//                     </div>
//                     <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%]">
//                       <p className="text-sm text-black font-medium">Updating CRM... 📊</p>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* SVG for hand-drawn connectors with animated data flow */}
//           <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//               {/* Animated gradient for data flow */}
//               <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="0%">
//                 <stop offset="0%" stopColor="transparent" />
//                 <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
//                 <stop offset="100%" stopColor="transparent" />
//                 <animate attributeName="x1" values="-100%;100%" dur="2s" repeatCount="indefinite" />
//                 <animate attributeName="x2" values="0%;200%" dur="2s" repeatCount="indefinite" />
//               </linearGradient>
//             </defs>

//             {/* Shopify - Top Left */}
//             <path
//               d="M 480 350 Q 400 280, 200 180"
//               stroke={currentScenario === "ecommerce" ? "#00d9a3" : "#262626"}
//               strokeWidth="3"
//               fill="none"
//               strokeLinecap="round"
//               className="transition-all duration-500"
//             />
//             {currentScenario === "ecommerce" && (
//               <circle r="6" fill="#00d9a3" className="animate-data-flow">
//                 <animateMotion dur="2s" repeatCount="indefinite" path="M 480 350 Q 400 280, 200 180" />
//               </circle>
//             )}

//             {/* Stripe - Top Right */}
//             <path
//               d="M 480 350 Q 560 280, 760 180"
//               stroke={currentScenario === "payment" ? "#9d4edd" : "#262626"}
//               strokeWidth="3"
//               fill="none"
//               strokeLinecap="round"
//               className="transition-all duration-500"
//             />
//             {currentScenario === "payment" && (
//               <circle r="6" fill="#9d4edd" className="animate-data-flow">
//                 <animateMotion dur="2s" repeatCount="indefinite" path="M 480 350 Q 560 280, 760 180" />
//               </circle>
//             )}

//             {/* Calendly - Middle Left */}
//             <path
//               d="M 480 350 Q 300 350, 150 350"
//               stroke={currentScenario === "booking" ? "#ffd93d" : "#262626"}
//               strokeWidth="3"
//               fill="none"
//               strokeLinecap="round"
//               className="transition-all duration-500"
//             />
//             {currentScenario === "booking" && (
//               <circle r="6" fill="#ffd93d" className="animate-data-flow">
//                 <animateMotion dur="2s" repeatCount="indefinite" path="M 480 350 Q 300 350, 150 350" />
//               </circle>
//             )}

//             {/* HubSpot - Middle Right */}
//             <path
//               d="M 480 350 Q 660 350, 810 350"
//               stroke={currentScenario === "crm" ? "#ff3366" : "#262626"}
//               strokeWidth="3"
//               fill="none"
//               strokeLinecap="round"
//               className="transition-all duration-500"
//             />
//             {currentScenario === "crm" && (
//               <circle r="6" fill="#ff3366" className="animate-data-flow">
//                 <animateMotion dur="2s" repeatCount="indefinite" path="M 480 350 Q 660 350, 810 350" />
//               </circle>
//             )}

//             {/* Zoom - Bottom Left */}
//             <path d="M 480 350 Q 400 420, 200 520" stroke="#262626" strokeWidth="3" fill="none" strokeLinecap="round" />

//             {/* Salesforce - Bottom Right */}
//             <path d="M 480 350 Q 560 420, 760 520" stroke="#262626" strokeWidth="3" fill="none" strokeLinecap="round" />
//           </svg>

//           {/* Integration icons positioned around center */}
//           <div className="absolute top-8 left-8 animate-float">
//             <div
//               className={`w-24 h-24 bg-card border-3 rounded-2xl flex flex-col items-center justify-center shadow-xl hover:scale-110 transition-all ${
//                 currentScenario === "ecommerce" ? "border-green shadow-green/20" : "border-border"
//               }`}
//             >
//               <ShoppingCart className={`w-10 h-10 ${currentScenario === "ecommerce" ? "text-green" : "text-muted"}`} />
//               <p className="text-xs mt-2 font-medium">Shopify</p>
//             </div>
//           </div>

//           <div className="absolute top-8 right-8 animate-float-delayed">
//             <div
//               className={`w-24 h-24 bg-card border-3 rounded-2xl flex flex-col items-center justify-center shadow-xl hover:scale-110 transition-all ${
//                 currentScenario === "payment" ? "border-purple shadow-purple/20" : "border-border"
//               }`}
//             >
//               <CreditCard className={`w-10 h-10 ${currentScenario === "payment" ? "text-purple" : "text-muted"}`} />
//               <p className="text-xs mt-2 font-medium">Stripe</p>
//             </div>
//           </div>

//           <div className="absolute top-1/2 -translate-y-1/2 left-0 animate-float">
//             <div
//               className={`w-24 h-24 bg-card border-3 rounded-2xl flex flex-col items-center justify-center shadow-xl hover:scale-110 transition-all ${
//                 currentScenario === "booking" ? "border-yellow shadow-yellow/20" : "border-border"
//               }`}
//             >
//               <Calendar className={`w-10 h-10 ${currentScenario === "booking" ? "text-yellow" : "text-muted"}`} />
//               <p className="text-xs mt-2 font-medium">Calendly</p>
//             </div>
//           </div>

//           <div className="absolute top-1/2 -translate-y-1/2 right-0 animate-float-delayed">
//             <div
//               className={`w-24 h-24 bg-card border-3 rounded-2xl flex flex-col items-center justify-center shadow-xl hover:scale-110 transition-all ${
//                 currentScenario === "crm" ? "border-red shadow-red/20" : "border-border"
//               }`}
//             >
//               <Users className={`w-10 h-10 ${currentScenario === "crm" ? "text-red" : "text-muted"}`} />
//               <p className="text-xs mt-2 font-medium">HubSpot</p>
//             </div>
//           </div>

//           <div className="absolute bottom-8 left-8 animate-float">
//             <div className="w-24 h-24 bg-card border-3 border-border rounded-2xl flex flex-col items-center justify-center shadow-xl hover:scale-110 transition-all">
//               <Video className="w-10 h-10 text-muted" />
//               <p className="text-xs mt-2 font-medium">Zoom</p>
//             </div>
//           </div>

//           <div className="absolute bottom-8 right-8 animate-float-delayed">
//             <div className="w-24 h-24 bg-card border-3 border-border rounded-2xl flex flex-col items-center justify-center shadow-xl hover:scale-110 transition-all">
//               <Users className="w-10 h-10 text-muted" />
//               <p className="text-xs mt-2 font-medium">Salesforce</p>
//             </div>
//           </div>
//         </div>

//         <div className="text-center mt-12 lg:mt-20 scroll-reveal">
//           <p className="text-base lg:text-lg text-muted-foreground mb-6">And 50+ more integrations</p>
//           <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
//             {["Zapier", "Make", "WooCommerce", "Mailchimp", "Slack", "Notion"].map((tool) => (
//               <div
//                 key={tool}
//                 className="px-3 py-2 lg:px-4 bg-card border border-border rounded-full text-xs lg:text-sm hover:border-orange transition-colors"
//               >
//                 {tool}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes data-flow {
//           0% {
//             opacity: 0;
//           }
//           50% {
//             opacity: 1;
//           }
//           100% {
//             opacity: 0;
//           }
//         }
//         .animate-data-flow {
//           animation: data-flow 2s ease-in-out infinite;
//         }
//       `}</style>
//     </section>
//   )
// }



"use client"

import { useEffect, useRef, useState } from "react"
import { MessageSquare, ShoppingCart, Calendar, CreditCard, Users, Video } from "lucide-react"

export function IntegrationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeScenario, setActiveScenario] = useState(0)
  const scenarios = ["ecommerce", "booking", "payment", "crm"]

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScenario((prev) => (prev + 1) % scenarios.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [scenarios.length])

  const currentScenario = scenarios[activeScenario]

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-orange/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto container-padding relative z-10">
        <div className="text-center mb-12 lg:mb-20 scroll-reveal">
          <h2 className="text-responsive-xl font-bold mb-4 lg:mb-6">
            Connects With <span className="text-orange">Everything</span>
          </h2>
          <p className="text-responsive-base text-muted-foreground max-w-2xl mx-auto">
            Watch data flow seamlessly between Instagram DMs and your favorite tools
          </p>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-8">
          {/* Center DM Interface */}
          <div className="max-w-md mx-auto">
            <div className="bg-card border-4 border-border rounded-3xl overflow-hidden shadow-2xl">
              {/* DM Header */}
              <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-orange" />
                <div>
                  <p className="font-semibold text-sm text-foreground">Instagram DM</p>
                  <p className="text-xs text-green flex items-center gap-1">
                    <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
                    Processing...
                  </p>
                </div>
              </div>

              {/* DM Content */}
              <div className="p-4 space-y-3 min-h-[200px] bg-gradient-to-b from-background/50 to-background/80">
                {currentScenario === "ecommerce" && (
                  <>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 border border-border/50 animate-slide-in-left">
                      <p className="text-sm text-foreground">I want to buy the blue sneakers!</p>
                    </div>
                    <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%] shadow-md animate-slide-in-right">
                      <p className="text-sm text-primary-foreground font-medium">Processing order... 🛍️</p>
                    </div>
                  </>
                )}
                {currentScenario === "booking" && (
                  <>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 border border-border/50 animate-slide-in-left">
                      <p className="text-sm text-foreground">Book me for tomorrow at 2pm</p>
                    </div>
                    <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%] shadow-md animate-slide-in-right">
                      <p className="text-sm text-primary-foreground font-medium">Checking calendar... 📅</p>
                    </div>
                  </>
                )}
                {currentScenario === "payment" && (
                  <>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 border border-border/50 animate-slide-in-left">
                      <p className="text-sm text-foreground">Ready to checkout!</p>
                    </div>
                    <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%] shadow-md animate-slide-in-right">
                      <p className="text-sm text-primary-foreground font-medium">Processing payment... 💳</p>
                    </div>
                  </>
                )}
                {currentScenario === "crm" && (
                  <>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 border border-border/50 animate-slide-in-left">
                      <p className="text-sm text-foreground">Tell me more about your services</p>
                    </div>
                    <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%] shadow-md animate-slide-in-right">
                      <p className="text-sm text-primary-foreground font-medium">Updating CRM... 📊</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Integration Icons Grid */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[
              { id: "ecommerce", name: "Shopify", icon: ShoppingCart, color: "green" },
              { id: "payment", name: "Stripe", icon: CreditCard, color: "purple" },
              { id: "booking", name: "Calendly", icon: Calendar, color: "yellow" },
              { id: "crm", name: "HubSpot", icon: Users, color: "red" },
              { id: "video", name: "Zoom", icon: Video, color: "muted" },
              { id: "sales", name: "Salesforce", icon: Users, color: "muted" },
            ].map((integration) => {
              const Icon = integration.icon
              const isActive = currentScenario === integration.id
              const colorClass = integration.color

              return (
                <div
                  key={integration.id}
                  className={`p-4 bg-card border-2 rounded-2xl flex flex-col items-center justify-center shadow-lg transition-all duration-500 ${
                    isActive
                      ? `border-${colorClass} shadow-${colorClass}/30 scale-105 bg-${colorClass}/5`
                      : "border-border"
                  }`}
                >
                  <Icon
                    className={`w-8 h-8 mb-2 transition-colors duration-500 ${
                      isActive ? `text-${colorClass}` : "text-muted-foreground"
                    }`}
                  />
                  <p
                    className={`text-xs font-medium text-center transition-colors duration-500 ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {integration.name}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Desktop Layout - PERFECT GEOMETRY */}
        <div className="hidden lg:block relative max-w-[1200px] mx-auto h-[800px] scroll-reveal">
          {/* PERFECTLY CENTERED DM INTERFACE - 384px width, positioned at exact center */}
          <div 
            className="absolute z-30"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '384px',
              height: '320px'
            }}
          >
            <div className="w-full h-full bg-card border-4 border-orange/30 rounded-3xl overflow-hidden shadow-2xl">
              {/* DM Header */}
              <div className="bg-muted px-5 py-4 border-b border-border flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center shadow-logo">
                  <MessageSquare className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-base text-foreground">Instagram DM</p>
                  <p className="text-xs text-green flex items-center gap-1">
                    <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
                    Processing...
                  </p>
                </div>
              </div>

              {/* DM Content */}
              <div className="p-5 space-y-3 h-[calc(100%-80px)] bg-gradient-to-b from-background/50 to-background/80">
                {currentScenario === "ecommerce" && (
                  <>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 border border-border/50 animate-slide-in-left">
                      <p className="text-sm text-foreground">I want to buy the blue sneakers!</p>
                    </div>
                    <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%] shadow-md animate-slide-in-right">
                      <p className="text-sm text-primary-foreground font-medium">Processing order... 🛍️</p>
                    </div>
                  </>
                )}
                {currentScenario === "booking" && (
                  <>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 border border-border/50 animate-slide-in-left">
                      <p className="text-sm text-foreground">Book me for tomorrow at 2pm</p>
                    </div>
                    <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%] shadow-md animate-slide-in-right">
                      <p className="text-sm text-primary-foreground font-medium">Checking calendar... 📅</p>
                    </div>
                  </>
                )}
                {currentScenario === "payment" && (
                  <>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 border border-border/50 animate-slide-in-left">
                      <p className="text-sm text-foreground">Ready to checkout!</p>
                    </div>
                    <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%] shadow-md animate-slide-in-right">
                      <p className="text-sm text-primary-foreground font-medium">Processing payment... 💳</p>
                    </div>
                  </>
                )}
                {currentScenario === "crm" && (
                  <>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 border border-border/50 animate-slide-in-left">
                      <p className="text-sm text-foreground">Tell me more about your services</p>
                    </div>
                    <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%] shadow-md animate-slide-in-right">
                      <p className="text-sm text-primary-foreground font-medium">Updating CRM... 📊</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* SVG Layer with PERFECT connection points */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-20" 
            viewBox="0 0 1200 800"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Glowing gradients */}
              <linearGradient id="greenGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00d9a3" stopOpacity="0" />
                <stop offset="50%" stopColor="#00d9a3" stopOpacity="1" />
                <stop offset="100%" stopColor="#00d9a3" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9d4edd" stopOpacity="0" />
                <stop offset="50%" stopColor="#9d4edd" stopOpacity="1" />
                <stop offset="100%" stopColor="#9d4edd" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="yellowGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffd93d" stopOpacity="0" />
                <stop offset="50%" stopColor="#ffd93d" stopOpacity="1" />
                <stop offset="100%" stopColor="#ffd93d" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="redGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff3366" stopOpacity="0" />
                <stop offset="50%" stopColor="#ff3366" stopOpacity="1" />
                <stop offset="100%" stopColor="#ff3366" stopOpacity="0" />
              </linearGradient>

              {/* Enhanced glow filter */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* CENTER BOX: 600,400 center, 384px wide, 320px tall
                 Left edge: 408, Right edge: 792
                 Top edge: 240, Bottom edge: 560 */}

            {/* SHOPIFY - Top Left (140, 140) center of 128px box
                 Connection point: right edge at 204, center at 140 */}
            <g>
              {/* Base line */}
              <path
                d="M 204 140 C 280 140, 350 200, 408 260"
                stroke="#262626"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.3"
              />
              {currentScenario === "ecommerce" && (
                <>
                  {/* Glowing animated line */}
                  <path
                    d="M 204 140 C 280 140, 350 200, 408 260"
                    stroke="url(#greenGlow)"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  >
                    <animate 
                      attributeName="stroke-dasharray" 
                      values="0 500; 500 0" 
                      dur="2s" 
                      repeatCount="indefinite" 
                    />
                    <animate
                      attributeName="stroke-dashoffset"
                      values="500; 0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </path>
                  {/* Traveling particle */}
                  <circle r="8" fill="#00d9a3" filter="url(#glow)">
                    <animateMotion 
                      dur="2s" 
                      repeatCount="indefinite" 
                      path="M 204 140 C 280 140, 350 200, 408 260" 
                    />
                  </circle>
                </>
              )}
            </g>

            {/* STRIPE - Top Right (1060, 140)
                 Connection point: left edge at 996, center at 140 */}
            <g>
              <path
                d="M 996 140 C 920 140, 850 200, 792 260"
                stroke="#262626"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.3"
              />
              {currentScenario === "payment" && (
                <>
                  <path
                    d="M 996 140 C 920 140, 850 200, 792 260"
                    stroke="url(#purpleGlow)"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  >
                    <animate 
                      attributeName="stroke-dasharray" 
                      values="0 500; 500 0" 
                      dur="2s" 
                      repeatCount="indefinite" 
                    />
                    <animate
                      attributeName="stroke-dashoffset"
                      values="500; 0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <circle r="8" fill="#9d4edd" filter="url(#glow)">
                    <animateMotion 
                      dur="2s" 
                      repeatCount="indefinite" 
                      path="M 996 140 C 920 140, 850 200, 792 260" 
                    />
                  </circle>
                </>
              )}
            </g>

            {/* CALENDLY - Middle Left (140, 400)
                 Connection point: right edge at 204, center at 400 */}
            <g>
              <path
                d="M 204 400 C 280 400, 340 400, 408 400"
                stroke="#262626"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.3"
              />
              {currentScenario === "booking" && (
                <>
                  <path
                    d="M 204 400 C 280 400, 340 400, 408 400"
                    stroke="url(#yellowGlow)"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  >
                    <animate 
                      attributeName="stroke-dasharray" 
                      values="0 500; 500 0" 
                      dur="2s" 
                      repeatCount="indefinite" 
                    />
                    <animate
                      attributeName="stroke-dashoffset"
                      values="500; 0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <circle r="8" fill="#ffd93d" filter="url(#glow)">
                    <animateMotion 
                      dur="2s" 
                      repeatCount="indefinite" 
                      path="M 204 400 C 280 400, 340 400, 408 400" 
                    />
                  </circle>
                </>
              )}
            </g>

            {/* HUBSPOT - Middle Right (1060, 400)
                 Connection point: left edge at 996, center at 400 */}
            <g>
              <path
                d="M 996 400 C 920 400, 860 400, 792 400"
                stroke="#262626"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.3"
              />
              {currentScenario === "crm" && (
                <>
                  <path
                    d="M 996 400 C 920 400, 860 400, 792 400"
                    stroke="url(#redGlow)"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  >
                    <animate 
                      attributeName="stroke-dasharray" 
                      values="0 500; 500 0" 
                      dur="2s" 
                      repeatCount="indefinite" 
                    />
                    <animate
                      attributeName="stroke-dashoffset"
                      values="500; 0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <circle r="8" fill="#ff3366" filter="url(#glow)">
                    <animateMotion 
                      dur="2s" 
                      repeatCount="indefinite" 
                      path="M 996 400 C 920 400, 860 400, 792 400" 
                    />
                  </circle>
                </>
              )}
            </g>

            {/* ZOOM - Bottom Left (140, 660)
                 Connection point: right edge at 204, center at 660 */}
            <path
              d="M 204 660 C 280 660, 350 600, 408 540"
              stroke="#262626"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.3"
            />

            {/* SALESFORCE - Bottom Right (1060, 660)
                 Connection point: left edge at 996, center at 660 */}
            <path
              d="M 996 660 C 920 660, 850 600, 792 540"
              stroke="#262626"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.3"
            />
          </svg>

          {/* Integration icons - PERFECTLY POSITIONED at exact coordinates */}
          
          {/* Top Left - Shopify at (140, 140) */}
          <div 
            className="absolute animate-float"
            style={{
              left: '76px', // 140 - 64 (half of 128px)
              top: '76px',  // 140 - 64
              width: '128px',
              height: '128px'
            }}
          >
            <div
              className={`w-full h-full bg-card border-3 rounded-3xl flex flex-col items-center justify-center shadow-2xl transition-all duration-500 ${
                currentScenario === "ecommerce"
                  ? "border-green scale-110 bg-green/5 shadow-green/40"
                  : "border-border hover:scale-105"
              }`}
            >
              <ShoppingCart
                className={`w-12 h-12 transition-all duration-500 ${
                  currentScenario === "ecommerce" ? "text-green scale-110" : "text-muted-foreground"
                }`}
              />
              <p
                className={`text-sm mt-3 font-semibold transition-colors duration-500 ${
                  currentScenario === "ecommerce" ? "text-green" : "text-muted-foreground"
                }`}
              >
                Shopify
              </p>
            </div>
          </div>

          {/* Top Right - Stripe at (1060, 140) */}
          <div 
            className="absolute animate-float-delayed"
            style={{
              left: '996px', // 1060 - 64
              top: '76px',
              width: '128px',
              height: '128px'
            }}
          >
            <div
              className={`w-full h-full bg-card border-3 rounded-3xl flex flex-col items-center justify-center shadow-2xl transition-all duration-500 ${
                currentScenario === "payment"
                  ? "border-purple scale-110 bg-purple/5 shadow-purple/40"
                  : "border-border hover:scale-105"
              }`}
            >
              <CreditCard
                className={`w-12 h-12 transition-all duration-500 ${
                  currentScenario === "payment" ? "text-purple scale-110" : "text-muted-foreground"
                }`}
              />
              <p
                className={`text-sm mt-3 font-semibold transition-colors duration-500 ${
                  currentScenario === "payment" ? "text-purple" : "text-muted-foreground"
                }`}
              >
                Stripe
              </p>
            </div>
          </div>

          {/* Middle Left - Calendly at (140, 400) */}
          <div 
            className="absolute animate-float"
            style={{
              left: '76px', // 140 - 64
              top: '336px', // 400 - 64
              width: '128px',
              height: '128px'
            }}
          >
            <div
              className={`w-full h-full bg-card border-3 rounded-3xl flex flex-col items-center justify-center shadow-2xl transition-all duration-500 ${
                currentScenario === "booking"
                  ? "border-yellow scale-110 bg-yellow/5 shadow-yellow/40"
                  : "border-border hover:scale-105"
              }`}
            >
              <Calendar
                className={`w-12 h-12 transition-all duration-500 ${
                  currentScenario === "booking" ? "text-yellow scale-110" : "text-muted-foreground"
                }`}
              />
              <p
                className={`text-sm mt-3 font-semibold transition-colors duration-500 ${
                  currentScenario === "booking" ? "text-yellow" : "text-muted-foreground"
                }`}
              >
                Calendly
              </p>
            </div>
          </div>

          {/* Middle Right - HubSpot at (1060, 400) */}
          <div 
            className="absolute animate-float-delayed"
            style={{
              left: '996px', // 1060 - 64
              top: '336px',  // 400 - 64
              width: '128px',
              height: '128px'
            }}
          >
            <div
              className={`w-full h-full bg-card border-3 rounded-3xl flex flex-col items-center justify-center shadow-2xl transition-all duration-500 ${
                currentScenario === "crm"
                  ? "border-red scale-110 bg-red/5 shadow-red/40"
                  : "border-border hover:scale-105"
              }`}
            >
              <Users
                className={`w-12 h-12 transition-all duration-500 ${
                  currentScenario === "crm" ? "text-red scale-110" : "text-muted-foreground"
                }`}
              />
              <p
                className={`text-sm mt-3 font-semibold transition-colors duration-500 ${
                  currentScenario === "crm" ? "text-red" : "text-muted-foreground"
                }`}
              >
                HubSpot
              </p>
            </div>
          </div>

          {/* Bottom Left - Zoom at (140, 660) */}
          <div 
            className="absolute animate-float"
            style={{
              left: '76px',  // 140 - 64
              top: '596px',  // 660 - 64
              width: '128px',
              height: '128px'
            }}
          >
            <div className="w-full h-full bg-card border-3 border-border rounded-3xl flex flex-col items-center justify-center shadow-2xl hover:scale-105 transition-all duration-500">
              <Video className="w-12 h-12 text-muted-foreground" />
              <p className="text-sm mt-3 font-semibold text-muted-foreground">Zoom</p>
            </div>
          </div>

          {/* Bottom Right - Salesforce at (1060, 660) */}
          <div 
            className="absolute animate-float-delayed"
            style={{
              left: '996px', // 1060 - 64
              top: '596px',  // 660 - 64
              width: '128px',
              height: '128px'
            }}
          >
            <div className="w-full h-full bg-card border-3 border-border rounded-3xl flex flex-col items-center justify-center shadow-2xl hover:scale-105 transition-all duration-500">
              <Users className="w-12 h-12 text-muted-foreground" />
              <p className="text-sm mt-3 font-semibold text-muted-foreground">Salesforce</p>
            </div>
          </div>
        </div>

        {/* Additional Integrations */}
        <div className="text-center mt-12 lg:mt-20 scroll-reveal">
          <p className="text-responsive-base text-muted-foreground mb-6">And 50+ more integrations</p>
          <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
            {["Zapier", "Make", "WooCommerce", "Mailchimp", "Slack", "Notion"].map((tool) => (
              <div
                key={tool}
                className="px-4 py-2 lg:px-5 lg:py-3 bg-card border-2 border-border rounded-full text-xs lg:text-sm font-medium hover:border-orange hover:bg-orange/5 hover:scale-105 transition-all duration-300 shadow-sm text-foreground"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}