// "use client"

// import { Play, Sparkles, Video } from "lucide-react"
// import { useEffect, useRef } from "react"

// interface VideoShowcasePremiumProps {
//   title: string
//   description: string
//   accent?: "orange" | "green" | "red" | "yellow" | "purple" | "maroon"
//   style?: "floating" | "split" | "fullwidth" | "card"
// }

// export function VideoShowcasePremium({
//   title,
//   description,
//   accent = "orange",
//   style = "floating",
// }: VideoShowcasePremiumProps) {
//   const sectionRef = useRef<HTMLDivElement>(null)

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

//   const colorClasses: Record<string, { bg: string; border: string; button: string; glow: string }> = {
//     orange: {
//       bg: "bg-orange/5",
//       border: "border-orange",
//       button: "bg-orange hover:bg-orange/90",
//       glow: "shadow-orange/20",
//     },
//     green: {
//       bg: "bg-green/5",
//       border: "border-green",
//       button: "bg-green hover:bg-green/90",
//       glow: "shadow-green/20",
//     },
//     red: { bg: "bg-red/5", border: "border-red", button: "bg-red hover:bg-red/90", glow: "shadow-red/20" },
//     yellow: {
//       bg: "bg-yellow/5",
//       border: "border-yellow",
//       button: "bg-yellow hover:bg-yellow/90",
//       glow: "shadow-yellow/20",
//     },
//     purple: {
//       bg: "bg-purple/5",
//       border: "border-purple",
//       button: "bg-purple hover:bg-purple/90",
//       glow: "shadow-purple/20",
//     },
//     maroon: {
//       bg: "bg-maroon/5",
//       border: "border-maroon",
//       button: "bg-maroon hover:bg-maroon/90",
//       glow: "shadow-maroon/20",
//     },
//   }

//   const colors = colorClasses[accent]

//   if (style === "floating") {
//     return (
//       <section ref={sectionRef} className="py-16 lg:py-24 relative overflow-hidden">
//         {/* Floating decorative elements */}
//         <div className="absolute inset-0 pointer-events-none overflow-hidden">
//           <div className={`absolute top-20 right-[10%] w-32 h-32 ${colors.bg} rounded-full blur-3xl opacity-50`} />
//           <div className={`absolute bottom-20 left-[15%] w-40 h-40 ${colors.bg} rounded-full blur-3xl opacity-50`} />
//         </div>

//         <div className="container mx-auto px-4 lg:px-8 relative z-10">
//           <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-12 scroll-reveal">
//               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-6">
//                 <Video className={`w-4 h-4 text-${accent}`} />
//                 <span className="text-sm font-medium">Watch Demo</span>
//               </div>
//               <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">{title}</h3>
//               <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">{description}</p>
//             </div>

//             <div className="scroll-reveal relative">
//               {/* Floating accent cards */}
//               <div
//                 className={`absolute -top-6 -left-6 w-24 h-24 ${colors.bg} ${colors.border} border-2 rounded-2xl rotate-12 hidden lg:block`}
//               />
//               <div
//                 className={`absolute -bottom-6 -right-6 w-32 h-32 ${colors.bg} ${colors.border} border-2 rounded-2xl -rotate-12 hidden lg:block`}
//               />

//               {/* Main video container */}
//               <div
//                 className={`relative rounded-3xl overflow-hidden ${colors.border} border-4 ${colors.glow} shadow-2xl group`}
//               >
//                 <div className={`aspect-video ${colors.bg} flex items-center justify-center relative`}>
//                   {/* Play button with pulse effect */}
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className={`absolute w-32 h-32 ${colors.bg} rounded-full animate-ping opacity-20`} />
//                     <button
//                       className={`relative w-24 h-24 ${colors.button} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${colors.glow} shadow-xl z-10`}
//                     >
//                       <Play className="w-12 h-12 text-black fill-black ml-2" />
//                     </button>
//                   </div>

//                   {/* Video placeholder text */}
//                   <div className="absolute bottom-8 left-0 right-0 text-center z-20">
//                     <div className="inline-flex items-center gap-2 px-6 py-3 bg-card/90 backdrop-blur-sm rounded-full border border-border">
//                       <Sparkles className={`w-4 h-4 text-${accent}`} />
//                       <span className="text-sm font-semibold">Drop your video here</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     )
//   }

//   if (style === "split") {
//     return (
//       <section ref={sectionRef} className="py-16 lg:py-24">
//         <div className="container mx-auto px-4 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
//             <div className="scroll-reveal space-y-6">
//               <div
//                 className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} border ${colors.border}`}
//               >
//                 <Video className={`w-4 h-4 text-${accent}`} />
//                 <span className="text-sm font-medium">Video Demo</span>
//               </div>
//               <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">{title}</h3>
//               <p className="text-lg text-muted-foreground leading-relaxed text-pretty">{description}</p>
//             </div>

//             <div className="scroll-reveal">
//               <div
//                 className={`relative rounded-3xl overflow-hidden ${colors.border} border-4 ${colors.glow} shadow-2xl group`}
//               >
//                 <div className={`aspect-video ${colors.bg} flex items-center justify-center`}>
//                   <button
//                     className={`w-20 h-20 ${colors.button} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${colors.glow} shadow-xl`}
//                   >
//                     <Play className="w-10 h-10 text-black fill-black ml-1" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     )
//   }

//   if (style === "card") {
//     return (
//       <section ref={sectionRef} className="py-12 lg:py-16">
//         <div className="container mx-auto px-4 lg:px-8">
//           <div className="max-w-4xl mx-auto">
//             <div
//               className={`scroll-reveal bg-card border-2 ${colors.border} rounded-3xl p-6 md:p-8 lg:p-12 ${colors.glow} shadow-xl`}
//             >
//               <div className="text-center mb-8">
//                 <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-balance">{title}</h3>
//                 <p className="text-base md:text-lg text-muted-foreground text-pretty">{description}</p>
//               </div>

//               <div className={`relative rounded-2xl overflow-hidden ${colors.border} border-2 group`}>
//                 <div className={`aspect-video ${colors.bg} flex items-center justify-center`}>
//                   <button
//                     className={`w-16 h-16 ${colors.button} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
//                   >
//                     <Play className="w-8 h-8 text-black fill-black ml-1" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     )
//   }

//   // fullwidth style
//   return (
//     <section ref={sectionRef} className="py-16 lg:py-24 relative">
//       <div className="container mx-auto px-4 lg:px-8">
//         <div className="text-center mb-12 scroll-reveal">
//           <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">{title}</h3>
//           <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">{description}</p>
//         </div>

//         <div className="scroll-reveal max-w-7xl mx-auto">
//           <div
//             className={`relative rounded-3xl overflow-hidden ${colors.border} border-4 ${colors.glow} shadow-2xl group`}
//           >
//             <div className={`aspect-video ${colors.bg} flex items-center justify-center`}>
//               <div className="text-center">
//                 <button
//                   className={`w-28 h-28 ${colors.button} rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 ${colors.glow} shadow-2xl`}
//                 >
//                   <Play className="w-14 h-14 text-black fill-black ml-2" />
//                 </button>
//                 <p className="text-lg font-semibold">Insert Your Video Here</p>
//                 <p className="text-sm text-muted-foreground mt-2">Drag and drop your Canva video</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// "use client"

// import { Play, Pause, Sparkles, Video } from "lucide-react"
// import { useEffect, useRef, useState } from "react"

// interface VideoShowcasePremiumProps {
//   title: string
//   description: string
//   videoUrl: string
//   accent?: "orange" | "green" | "red" | "yellow" | "purple" | "maroon"
//   style?: "floating" | "split" | "fullwidth" | "card"
// }

// export function VideoShowcasePremium({
//   title,
//   description,
//   videoUrl,
//   accent = "orange",
//   style = "floating",
// }: VideoShowcasePremiumProps) {
//   const sectionRef = useRef<HTMLDivElement>(null)
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const [isPlaying, setIsPlaying] = useState(false)

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

//   const togglePlay = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause()
//       } else {
//         videoRef.current.play()
//       }
//       setIsPlaying(!isPlaying)
//     }
//   }

//   const handleVideoClick = () => {
//     togglePlay()
//   }

//   const colorClasses: Record<string, { bg: string; border: string; button: string; glow: string }> = {
//     orange: {
//       bg: "bg-orange-500/5",
//       border: "border-orange-500",
//       button: "bg-orange-500 hover:bg-orange-600",
//       glow: "shadow-orange-500/20",
//     },
//     green: {
//       bg: "bg-green-500/5",
//       border: "border-green-500",
//       button: "bg-green-500 hover:bg-green-600",
//       glow: "shadow-green-500/20",
//     },
//     red: { 
//       bg: "bg-red-500/5", 
//       border: "border-red-500", 
//       button: "bg-red-500 hover:bg-red-600", 
//       glow: "shadow-red-500/20" 
//     },
//     yellow: {
//       bg: "bg-yellow-500/5",
//       border: "border-yellow-500",
//       button: "bg-yellow-500 hover:bg-yellow-600",
//       glow: "shadow-yellow-500/20",
//     },
//     purple: {
//       bg: "bg-purple-500/5",
//       border: "border-purple-500",
//       button: "bg-purple-500 hover:bg-purple-600",
//       glow: "shadow-purple-500/20",
//     },
//     maroon: {
//       bg: "bg-red-900/5",
//       border: "border-red-900",
//       button: "bg-red-900 hover:bg-red-800",
//       glow: "shadow-red-900/20",
//     },
//   }

//   const colors = colorClasses[accent]

//   const VideoPlayer = () => (
//     <div className="relative rounded-3xl overflow-hidden group cursor-pointer" onClick={handleVideoClick}>
//       <video
//         ref={videoRef}
//         className="w-full h-full object-cover"
//         src={videoUrl}
//         onEnded={() => setIsPlaying(false)}
//       />
      
//       {/* Overlay and play button - hidden when playing */}
//       {!isPlaying && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/20">
//           <div className={`absolute w-32 h-32 ${colors.bg} rounded-full animate-ping opacity-20`} />
//           <button
//             className={`relative w-24 h-24 ${colors.button} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${colors.glow} shadow-xl z-10`}
//             onClick={togglePlay}
//           >
//             <Play className="w-12 h-12 text-white fill-white ml-2" />
//           </button>
//         </div>
//       )}

//       {/* Pause overlay - shown when playing and hovering */}
//       {isPlaying && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all opacity-0 group-hover:opacity-100">
//           <button
//             className={`w-24 h-24 ${colors.button} rounded-full flex items-center justify-center transition-all duration-300 scale-90 group-hover:scale-100 ${colors.glow} shadow-xl`}
//             onClick={togglePlay}
//           >
//             <Pause className="w-12 h-12 text-white fill-white" />
//           </button>
//         </div>
//       )}
//     </div>
//   )

//   if (style === "floating") {
//     return (
//       <section ref={sectionRef} className="py-16 lg:py-24 relative overflow-hidden">
//         {/* Floating decorative elements */}
//         <div className="absolute inset-0 pointer-events-none overflow-hidden">
//           <div className={`absolute top-20 right-[10%] w-32 h-32 ${colors.bg} rounded-full blur-3xl opacity-50`} />
//           <div className={`absolute bottom-20 left-[15%] w-40 h-40 ${colors.bg} rounded-full blur-3xl opacity-50`} />
//         </div>

//         <div className="container mx-auto px-4 lg:px-8 relative z-10">
//           <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-12 scroll-reveal">
//               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 mb-6">
//                 <Video className={`w-4 h-4 text-${accent}-500`} />
//                 <span className="text-sm font-medium">Watch Demo</span>
//               </div>
//               <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">{title}</h3>
//               <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto text-pretty">{description}</p>
//             </div>

//             <div className="scroll-reveal relative">
//               {/* Floating accent cards */}
//               <div
//                 className={`absolute -top-6 -left-6 w-24 h-24 ${colors.bg} ${colors.border} border-2 rounded-2xl rotate-12 hidden lg:block`}
//               />
//               <div
//                 className={`absolute -bottom-6 -right-6 w-32 h-32 ${colors.bg} ${colors.border} border-2 rounded-2xl -rotate-12 hidden lg:block`}
//               />

//               {/* Main video container */}
//               <div className={`relative ${colors.border} border-4 ${colors.glow} shadow-2xl rounded-3xl overflow-hidden`}>
//                 <VideoPlayer />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     )
//   }

//   if (style === "split") {
//     return (
//       <section ref={sectionRef} className="py-16 lg:py-24">
//         <div className="container mx-auto px-4 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
//             <div className="scroll-reveal space-y-6">
//               <div
//                 className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} border ${colors.border}`}
//               >
//                 <Video className={`w-4 h-4 text-${accent}-500`} />
//                 <span className="text-sm font-medium">Video Demo</span>
//               </div>
//               <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">{title}</h3>
//               <p className="text-lg text-gray-600 leading-relaxed text-pretty">{description}</p>
//             </div>

//             <div className="scroll-reveal">
//               <div className={`relative ${colors.border} border-4 ${colors.glow} shadow-2xl rounded-3xl overflow-hidden`}>
//                 <VideoPlayer />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     )
//   }

//   if (style === "card") {
//     return (
//       <section ref={sectionRef} className="py-12 lg:py-16">
//         <div className="container mx-auto px-4 lg:px-8">
//           <div className="max-w-4xl mx-auto">
//             <div
//               className={`scroll-reveal bg-white border-2 ${colors.border} rounded-3xl p-6 md:p-8 lg:p-12 ${colors.glow} shadow-xl`}
//             >
//               <div className="text-center mb-8">
//                 <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-balance">{title}</h3>
//                 <p className="text-base md:text-lg text-gray-600 text-pretty">{description}</p>
//               </div>

//               <div className={`relative ${colors.border} border-2 rounded-2xl overflow-hidden`}>
//                 <VideoPlayer />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     )
//   }

//   // fullwidth style
//   return (
//     <section ref={sectionRef} className="py-16 lg:py-24 relative">
//       <div className="container mx-auto px-4 lg:px-8">
//         <div className="text-center mb-12 scroll-reveal">
//           <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">{title}</h3>
//           <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">{description}</p>
//         </div>

//         <div className="scroll-reveal max-w-7xl mx-auto">
//           <div className={`relative ${colors.border} border-4 ${colors.glow} shadow-2xl rounded-3xl overflow-hidden`}>
//             <VideoPlayer />
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

"use client"

import { Play, Sparkles, Video } from "lucide-react"
import { useEffect, useRef } from "react"

interface VideoShowcasePremiumProps {
  title: string
  description: string
  accent?: "orange" | "green" | "red" | "yellow" | "purple" | "maroon"
  style?: "floating" | "split" | "fullwidth" | "card"
  videoUrl?: string
}

export function VideoShowcasePremium({
  title,
  description,
  accent = "orange",
  style = "floating",
  videoUrl,
}: VideoShowcasePremiumProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
            if (videoRef.current) {
              videoRef.current.play().catch(() => {
                // Autoplay was prevented, user interaction needed
              })
            }
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".scroll-reveal")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const colorClasses: Record<string, { bg: string; border: string; button: string; glow: string }> = {
    orange: {
      bg: "bg-orange/5",
      border: "border-orange",
      button: "bg-orange hover:bg-orange/90",
      glow: "shadow-orange/20",
    },
    green: {
      bg: "bg-green/5",
      border: "border-green",
      button: "bg-green hover:bg-green/90",
      glow: "shadow-green/20",
    },
    red: { bg: "bg-red/5", border: "border-red", button: "bg-red hover:bg-red/90", glow: "shadow-red/20" },
    yellow: {
      bg: "bg-yellow/5",
      border: "border-yellow",
      button: "bg-yellow hover:bg-yellow/90",
      glow: "shadow-yellow/20",
    },
    purple: {
      bg: "bg-purple/5",
      border: "border-purple",
      button: "bg-purple hover:bg-purple/90",
      glow: "shadow-purple/20",
    },
    maroon: {
      bg: "bg-maroon/5",
      border: "border-maroon",
      button: "bg-maroon hover:bg-maroon/90",
      glow: "shadow-maroon/20",
    },
  }

  const colors = colorClasses[accent]

  if (style === "floating") {
    return (
      <section ref={sectionRef} className="py-16 lg:py-24 relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute top-20 right-[10%] w-32 h-32 ${colors.bg} rounded-full blur-3xl opacity-50`} />
          <div className={`absolute bottom-20 left-[15%] w-40 h-40 ${colors.bg} rounded-full blur-3xl opacity-50`} />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 scroll-reveal">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-6">
                <Video className={`w-4 h-4 text-${accent}`} />
                <span className="text-sm font-medium">Watch Demo</span>
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">{title}</h3>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">{description}</p>
            </div>

            <div className="scroll-reveal relative">
              {/* Floating accent cards */}
              <div
                className={`absolute -top-6 -left-6 w-24 h-24 ${colors.bg} ${colors.border} border-2 rounded-2xl rotate-12 hidden lg:block`}
              />
              <div
                className={`absolute -bottom-6 -right-6 w-32 h-32 ${colors.bg} ${colors.border} border-2 rounded-2xl -rotate-12 hidden lg:block`}
              />

              {/* Main video container */}
              <div
                className={`relative rounded-3xl overflow-hidden ${colors.border} border-4 ${colors.glow} shadow-2xl group`}
              >
                <div className={`aspect-[4/3] ${colors.bg} flex items-center justify-center relative`}>
                  {videoUrl ? (
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      {/* Play button with pulse effect */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`absolute w-32 h-32 ${colors.bg} rounded-full animate-ping opacity-20`} />
                        <button
                          className={`relative w-24 h-24 ${colors.button} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${colors.glow} shadow-xl z-10`}
                        >
                          <Play className="w-12 h-12 text-black fill-black ml-2" />
                        </button>
                      </div>

                      {/* Video placeholder text */}
                      <div className="absolute bottom-8 left-0 right-0 text-center z-20">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-card/90 backdrop-blur-sm rounded-full border border-border">
                          <Sparkles className={`w-4 h-4 text-${accent}`} />
                          <span className="text-sm font-semibold">Drop your video here</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (style === "split") {
    return (
      <section ref={sectionRef} className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="scroll-reveal space-y-6">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} border ${colors.border}`}
              >
                <Video className={`w-4 h-4 text-${accent}`} />
                <span className="text-sm font-medium">Video Demo</span>
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">{title}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">{description}</p>
            </div>

            <div className="scroll-reveal">
              <div
                className={`relative rounded-3xl overflow-hidden ${colors.border} border-4 ${colors.glow} shadow-2xl group`}
              >
                <div className={`aspect-[4/3] ${colors.bg} flex items-center justify-center`}>
                  {videoUrl ? (
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <button
                      className={`w-20 h-20 ${colors.button} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${colors.glow} shadow-xl`}
                    >
                      <Play className="w-10 h-10 text-black fill-black ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (style === "card") {
    return (
      <section ref={sectionRef} className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div
              className={`scroll-reveal bg-card border-2 ${colors.border} rounded-3xl p-6 md:p-8 lg:p-12 ${colors.glow} shadow-xl`}
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-balance">{title}</h3>
                <p className="text-base md:text-lg text-muted-foreground text-pretty">{description}</p>
              </div>

              <div className={`relative rounded-2xl overflow-hidden ${colors.border} border-2 group`}>
                <div className={`aspect-[4/3] ${colors.bg} flex items-center justify-center`}>
                  {videoUrl ? (
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <button
                      className={`w-16 h-16 ${colors.button} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
                    >
                      <Play className="w-8 h-8 text-black fill-black ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // fullwidth style
  return (
    <section ref={sectionRef} className="py-16 lg:py-24 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 scroll-reveal">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">{title}</h3>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">{description}</p>
        </div>

        <div className="scroll-reveal max-w-5xl mx-auto">
          <div
            className={`relative rounded-3xl overflow-hidden ${colors.border} border-4 ${colors.glow} shadow-2xl group`}
          >
            <div className={`aspect-[4/3] ${colors.bg} flex items-center justify-center`}>
              {videoUrl ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <button
                    className={`w-28 h-28 ${colors.button} rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 ${colors.glow} shadow-2xl`}
                  >
                    <Play className="w-14 h-14 text-black fill-black ml-2" />
                  </button>
                  <p className="text-lg font-semibold">Insert Your Video Here</p>
                  <p className="text-sm text-muted-foreground mt-2">Drag and drop your Canva video</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
