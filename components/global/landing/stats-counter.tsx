"use client"

import { useEffect, useState } from "react"

interface StatsCounterProps {
  value: number
  label: string
  suffix?: string
}

export default function StatsCounter({ value, label, suffix = "" }: StatsCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000 // Animation duration in ms
    const steps = 50 // Number of steps in the animation
    const stepValue = value / steps
    const stepTime = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += stepValue
      if (current > value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="text-center">
      <div className="text-3xl font-bold md:text-4xl">
        {count.toLocaleString()}
        {suffix}
      </div>
      <p className="text-sm text-muted-foreground md:text-base">{label}</p>
    </div>
  )
}
