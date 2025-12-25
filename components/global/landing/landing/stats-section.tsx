// export function StatsSection() {
//   const stats = [
//     {
//       value: "10,000+",
//       label: "Active Users",
//       description: "Instagram businesses trust yazzil",
//       color: "orange",
//     },
//     {
//       value: "5M+",
//       label: "Messages Automated",
//       description: "Every single month",
//       color: "green",
//     },
//     {
//       value: "300%",
//       label: "Avg. Engagement Boost",
//       description: "Within first 30 days",
//       color: "red",
//     },
//     {
//       value: "24/7",
//       label: "Always Active",
//       description: "Never miss a customer",
//       color: "yellow",
//     },
//   ]

//   const colorClasses: Record<string, string> = {
//     orange: "text-orange",
//     green: "text-green",
//     red: "text-red",
//     yellow: "text-yellow",
//   }

//   return (
//     <section className="py-20 lg:py-32 bg-card/50">
//       <div className="container mx-auto px-4 lg:px-8">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
//           {stats.map((stat, index) => (
//             <div key={index} className="text-center scroll-reveal" style={{ animationDelay: `${index * 100}ms` }}>
//               <div className={`text-4xl lg:text-5xl font-bold ${colorClasses[stat.color]} mb-2`}>{stat.value}</div>
//               <div className="text-lg font-semibold mb-1 text-white">{stat.label}</div>
//               <div className="text-sm text-muted-foreground">{stat.description}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }


"use client"

import { useEffect, useRef, useState } from "react"

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const stats = [
    {
      value: 10000,
      suffix: "+",
      label: "Active Users",
      description: "Instagram businesses trust yazzil",
      color: "#ff6b35", // orange
      icon: "",
    },
    {
      value: 5,
      suffix: "M+",
      label: "Messages Automated",
      description: "Every single month",
      color: "#00d9a3", // green
      icon: "",
    },
    {
      value: 300,
      suffix: "%",
      label: "Avg. Engagement Boost",
      description: "Within first 30 days",
      color: "#ff3366", // red
      icon: "",
    },
    {
      value: 24,
      suffix: "/7",
      label: "Always Active",
      description: "Never miss a customer",
      color: "#ffd23f", // yellow
      icon: "",
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Trusted by Thousands of Instagram Businesses
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the fastest-growing Instagram automation platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({ stat, index, isVisible }: { stat: any; index: number; isVisible: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const increment = stat.value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= stat.value) {
        setCount(stat.value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, stat.value])

  return (
    <div
      className="relative group"
      style={{
        animation: isVisible ? `fadeInUp 0.6s ease-out ${index * 0.1}s both` : "none",
      }}
    >
      <div
        className="relative bg-card rounded-2xl p-6 lg:p-8 border-2 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
        style={{
          borderColor: stat.color,
          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px ${stat.color}20`,
        }}
      >
        {/* Glow effect on hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
          style={{
            background: `radial-gradient(circle at center, ${stat.color}40, transparent 70%)`,
          }}
        />

        <div className="relative z-10">
          {/* Icon */}
          <div className="text-4xl mb-4">{stat.icon}</div>

          {/* Animated counter */}
          <div className="text-4xl lg:text-5xl font-bold mb-2" style={{ color: stat.color }}>
            {count.toLocaleString()}
            {stat.suffix}
          </div>

          {/* Label */}
          <div className="text-lg lg:text-xl font-semibold mb-2 text-white">{stat.label}</div>

          {/* Description */}
          <div className="text-sm text-muted-foreground">{stat.description}</div>
        </div>

        {/* Decorative corner accent */}
        <div
          className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10"
          style={{ backgroundColor: stat.color }}
        />
      </div>
    </div>
  )
}
;<style jsx>{`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`}</style>
