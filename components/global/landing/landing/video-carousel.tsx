// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Play, Pause } from "lucide-react"

// interface VideoCard {
//   id: number
//   title: string
//   description: string
//   color: string
//   videoUrl: string
// }

// const videos: VideoCard[] = [
//   {
//     id: 1,
//     title: "E-commerce Automation",
//     description: "Watch how DM automation increases sales by 300%",
//     color: "orange",
//     videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
//   },
//   {
//     id: 2,
//     title: "Story Reply Magic",
//     description: "Automatically respond to story replies at scale",
//     color: "green",
//     videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
//   },
//   {
//     id: 3,
//     title: "Comment to DM",
//     description: "Convert comments into personalized DM conversations",
//     color: "purple",
//     videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
//   },
//   {
//     id: 4,
//     title: "Booking Automation",
//     description: "Schedule appointments directly through Instagram DMs",
//     color: "red",
//     videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4#t=20",
//   },
//   {
//     id: 5,
//     title: "24/7 Support",
//     description: "Provide instant customer support around the clock",
//     color: "yellow",
//     videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4#t=20",
//   },
// ]

// export function VideoCarousel() {
//   const [activeIndex, setActiveIndex] = useState(0)
//   const [isPlaying, setIsPlaying] = useState(true)
//   const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

//   // Auto-advance to next video when current one ends
//   const handleVideoEnd = () => {
//     setActiveIndex((prev) => (prev + 1) % videos.length)
//     setIsPlaying(true)
//   }

//   // Play/pause active video
//   useEffect(() => {
//     const activeVideo = videoRefs.current[activeIndex]
//     if (activeVideo) {
//       if (isPlaying) {
//         activeVideo.play().catch(() => {
//           // Auto-play might be blocked, that's okay
//         })
//       } else {
//         activeVideo.pause()
//       }
//     }
//   }, [activeIndex, isPlaying])

//   const getCardStyle = (index: number) => {
//     const diff = index - activeIndex
//     const isActive = diff === 0

//     if (isActive) {
//       return {
//         transform: "scale(1) translateX(0) rotateY(0deg)",
//         opacity: 1,
//         zIndex: 30,
//         filter: "brightness(1.2)",
//       }
//     } else if (diff === 1 || (activeIndex === videos.length - 1 && index === 0)) {
//       return {
//         transform: "scale(0.85) translateX(40%) rotateY(-15deg)",
//         opacity: 0.6,
//         zIndex: 20,
//         filter: "brightness(0.7)",
//       }
//     } else if (diff === -1 || (activeIndex === 0 && index === videos.length - 1)) {
//       return {
//         transform: "scale(0.85) translateX(-40%) rotateY(15deg)",
//         opacity: 0.6,
//         zIndex: 20,
//         filter: "brightness(0.7)",
//       }
//     } else {
//       return {
//         transform: "scale(0.7) translateX(0) rotateY(0deg)",
//         opacity: 0,
//         zIndex: 10,
//         filter: "brightness(0.5)",
//       }
//     }
//   }

//   const activeVideo = videos[activeIndex]

//   return (
//     <section className="py-20 bg-background relative overflow-hidden">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl md:text-6xl font-bold mb-4">
//             See It <span className={`text-${activeVideo.color}`}>In Action</span>
//           </h2>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             Watch real automation scenarios that drive results for businesses like yours
//           </p>
//         </div>

//         {/* 3D Carousel Container */}
//         <div className="relative h-[600px] md:h-[700px] flex items-center justify-center perspective-[2000px]">
//           <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
//             {videos.map((video, index) => {
//               const style = getCardStyle(index)
//               const isActive = index === activeIndex

//               return (
//                 <div
//                   key={video.id}
//                   className="absolute w-[90%] md:w-[600px] h-[500px] md:h-[600px] transition-all duration-700 ease-out cursor-pointer"
//                   style={style}
//                   onClick={() => {
//                     setActiveIndex(index)
//                     setIsPlaying(true)
//                   }}
//                 >
//                   <div
//                     className={`relative w-full h-full rounded-3xl overflow-hidden ${
//                       isActive
//                         ? `shadow-[0_0_80px_rgba(var(--color-${video.color}),0.6),0_20px_60px_rgba(0,0,0,0.8)]`
//                         : "shadow-2xl"
//                     }`}
//                     style={{
//                       boxShadow: isActive
//                         ? `0 0 80px ${
//                             video.color === "orange"
//                               ? "rgba(255,107,53,0.6)"
//                               : video.color === "green"
//                                 ? "rgba(0,217,163,0.6)"
//                                 : video.color === "purple"
//                                   ? "rgba(157,78,221,0.6)"
//                                   : video.color === "red"
//                                     ? "rgba(255,51,102,0.6)"
//                                     : "rgba(255,210,63,0.6)"
//                           }, 0 20px 60px rgba(0,0,0,0.8)`
//                         : "0 20px 60px rgba(0,0,0,0.5)",
//                     }}
//                   >
//                     <video
//                       ref={(el) => {
//                         videoRefs.current[index] = el
//                       }}
//                       className="w-full h-full object-cover rounded-3xl"
//                       onEnded={handleVideoEnd}
//                       loop={false}
//                       muted
//                       playsInline
//                       src={video.videoUrl}
//                     />

//                     {/* Gradient overlay for depth */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none rounded-3xl" />

//                     {/* Info overlay at bottom */}
//                     <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
//                       <div className={`inline-block px-4 py-2 bg-${video.color} rounded-full mb-3`}>
//                         <p className="text-white font-bold text-sm md:text-base">{video.title}</p>
//                       </div>
//                       <p className="text-white text-sm md:text-base font-medium">{video.description}</p>
//                     </div>

//                     {/* Play/Pause button for active card */}
//                     {isActive && (
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           setIsPlaying(!isPlaying)
//                         }}
//                         className={`absolute top-6 right-6 w-12 h-12 rounded-full bg-${video.color} flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-20`}
//                       >
//                         {isPlaying ? (
//                           <Pause className="w-6 h-6 text-white" />
//                         ) : (
//                           <Play className="w-6 h-6 text-white ml-0.5" />
//                         )}
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>

//         {/* Navigation dots */}
//         <div className="flex justify-center gap-3 mt-12">
//           {videos.map((video, index) => (
//             <button
//               key={video.id}
//               onClick={() => {
//                 setActiveIndex(index)
//                 setIsPlaying(true)
//               }}
//               className={`transition-all duration-300 rounded-full ${
//                 index === activeIndex
//                   ? `w-12 h-3 bg-${video.color}`
//                   : "w-3 h-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
//               }`}
//               aria-label={`Go to video ${index + 1}`}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }








"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause } from "lucide-react"

interface VideoCard {
  id: number
  title: string
  description: string
  color: string
  videoUrl: string
}

const videos: VideoCard[] = [
  {
    id: 1,
    title: "E-commerce Automation",
    description: "Watch how DM automation increases sales by 300%",
    color: "orange",
    videoUrl: "/Instagram one.mp4",
  },
  {
    id: 2,
    title: "Story Reply Magic",
    description: "Automatically respond to story replies at scale",
    color: "green",
    videoUrl: "/Instagram two.mp4",
  },
  {
    id: 3,
    title: "Comment to DM",
    description: "Convert comments into personalized DM conversations",
    color: "purple",
    videoUrl: "/Instagram three.mp4",
  },
  {
    id: 4,
    title: "Booking Automation",
    description: "Schedule appointments directly through Instagram DMs",
    color: "red",
    videoUrl: "/Instagram four.mp4",
  },
  {
    id: 5,
    title: "24/7 Support",
    description: "Provide instant customer support around the clock",
    color: "yellow",
    videoUrl: "/Instagram five.mp4",
  },
]

export function VideoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Auto-advance to next video when current one ends
  const handleVideoEnd = () => {
    setActiveIndex((prev) => (prev + 1) % videos.length)
    setIsPlaying(true)
  }

  // Play/pause active video
  useEffect(() => {
    const activeVideo = videoRefs.current[activeIndex]
    if (activeVideo) {
      if (isPlaying) {
        activeVideo.play().catch(() => {
          // Auto-play might be blocked, that's okay
        })
      } else {
        activeVideo.pause()
      }
    }
  }, [activeIndex, isPlaying])

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex
    const isActive = diff === 0

    if (isActive) {
      return {
        transform: "scale(1) translateX(0) rotateY(0deg)",
        opacity: 1,
        zIndex: 30,
        filter: "brightness(1.2)",
      }
    } else if (diff === 1 || (activeIndex === videos.length - 1 && index === 0)) {
      return {
        transform: "scale(0.85) translateX(40%) rotateY(-15deg)",
        opacity: 0.6,
        zIndex: 20,
        filter: "brightness(0.7)",
      }
    } else if (diff === -1 || (activeIndex === 0 && index === videos.length - 1)) {
      return {
        transform: "scale(0.85) translateX(-40%) rotateY(15deg)",
        opacity: 0.6,
        zIndex: 20,
        filter: "brightness(0.7)",
      }
    } else {
      return {
        transform: "scale(0.7) translateX(0) rotateY(0deg)",
        opacity: 0,
        zIndex: 10,
        filter: "brightness(0.5)",
      }
    }
  }

  const activeVideo = videos[activeIndex]

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            See It <span className={`text-${activeVideo.color}`}>In Action</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch real automation scenarios that drive results for businesses like yours
          </p>
        </div>

        {/* 3D Carousel Container */}
        <div className="relative h-[600px] md:h-[700px] flex items-center justify-center perspective-[2000px]">
          <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
            {videos.map((video, index) => {
              const style = getCardStyle(index)
              const isActive = index === activeIndex

              return (
                <div
                  key={video.id}
                  className="absolute w-[90%] md:w-[600px] h-[500px] md:h-[600px] transition-all duration-700 ease-out cursor-pointer"
                  style={style}
                  onClick={() => {
                    setActiveIndex(index)
                    setIsPlaying(true)
                  }}
                >
                  <div
                    className={`relative w-full h-full rounded-3xl overflow-hidden ${
                      isActive
                        ? `shadow-[0_0_80px_rgba(var(--color-${video.color}),0.6),0_20px_60px_rgba(0,0,0,0.8)]`
                        : "shadow-2xl"
                    }`}
                    style={{
                      boxShadow: isActive
                        ? `0 0 80px ${
                            video.color === "orange"
                              ? "rgba(255,107,53,0.6)"
                              : video.color === "green"
                                ? "rgba(0,217,163,0.6)"
                                : video.color === "purple"
                                  ? "rgba(157,78,221,0.6)"
                                  : video.color === "red"
                                    ? "rgba(255,51,102,0.6)"
                                    : "rgba(255,210,63,0.6)"
                          }, 0 20px 60px rgba(0,0,0,0.8)`
                        : "0 20px 60px rgba(0,0,0,0.5)",
                    }}
                  >
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el
                      }}
                      className="w-full h-full object-cover rounded-3xl"
                      onEnded={handleVideoEnd}
                      loop={false}
                      muted
                      playsInline
                      src={video.videoUrl}
                    />

                    {/* Gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none rounded-3xl" />

                    {/* Info overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                      <div className={`inline-block px-4 py-2 bg-${video.color} rounded-full mb-3`}>
                        <p className="text-white font-bold text-sm md:text-base">{video.title}</p>
                      </div>
                      <p className="text-white text-sm md:text-base font-medium">{video.description}</p>
                    </div>

                    {/* Play/Pause button for active card */}
                    {isActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsPlaying(!isPlaying)
                        }}
                        className={`absolute top-6 right-6 w-12 h-12 rounded-full bg-${video.color} flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-20`}
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white ml-0.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-3 mt-12">
          {videos.map((video, index) => (
            <button
              key={video.id}
              onClick={() => {
                setActiveIndex(index)
                setIsPlaying(true)
              }}
              className={`transition-all duration-300 rounded-full ${
                index === activeIndex
                  ? `w-12 h-3 bg-${video.color}`
                  : "w-3 h-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}