"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// Simulated scheduled posts
const scheduledPosts = [
  {
    id: "1",
    date: new Date(2024, 2, 15),
    caption: "New product launch 🚀",
    status: "scheduled",
  },
  {
    id: "2",
    date: new Date(2024, 2, 18),
    caption: "Behind the scenes content",
    status: "scheduled",
  },
  {
    id: "3",
    date: new Date(2024, 2, 22),
    caption: "Customer testimonial",
    status: "scheduled",
  },
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getPostsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return scheduledPosts.filter((post) => post.date.toDateString() === date.toDateString())
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Content Calendar</h1>
          <p className="text-slate-600 dark:text-slate-400">Plan and schedule your Instagram posts</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Plus className="h-4 w-4" />
          Schedule Post
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="min-h-24 rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50" />
            ))}

            {/* Calendar days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1
              const posts = getPostsForDate(day)
              const isToday =
                new Date().toDateString() ===
                new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

              return (
                <div
                  key={day}
                  className={cn(
                    "min-h-24 rounded-lg border-2 p-2 transition-colors hover:border-purple-300 dark:hover:border-purple-700",
                    isToday
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                      : "border-slate-200 dark:border-slate-700",
                  )}
                >
                  <div className={cn("text-sm font-medium", isToday && "text-purple-600 dark:text-purple-400")}>
                    {day}
                  </div>
                  <div className="mt-1 space-y-1">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="cursor-pointer rounded bg-gradient-to-r from-purple-600 to-pink-600 px-1.5 py-1 text-xs text-white hover:from-purple-700 hover:to-pink-700"
                      >
                        {post.caption.slice(0, 20)}...
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Posts */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Upcoming Posts</CardTitle>
          <CardDescription>Posts scheduled for the next 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduledPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{post.caption}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {post.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {post.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
