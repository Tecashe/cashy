"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { automationTemplates } from "@/lib/automation-templates"
import {
  Search,
  Sparkles,
  MessageSquare,
  DollarSign,
  Camera,
  Target,
  Ticket,
  Calendar,
  HelpCircle,
  Gift,
} from "lucide-react"
import Link from "next/link"

const ICON_MAP: Record<string, any> = {
  wave: MessageSquare,
  dollar: DollarSign,
  camera: Camera,
  target: Target,
  ticket: Ticket,
  calendar: Calendar,
  question: HelpCircle,
  celebration: Gift,
}

export function AutomationTemplateSelector() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    { id: "all", name: "All Templates", color: "bg-slate-500" },
    { id: "welcome", name: "Welcome", color: "bg-blue-500" },
    { id: "sales", name: "Sales", color: "bg-green-500" },
    { id: "support", name: "Support", color: "bg-orange-500" },
    { id: "engagement", name: "Engagement", color: "bg-purple-500" },
  ]

  const filteredTemplates = automationTemplates.filter((template) => {
    const matchesSearch =
      search === "" ||
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Choose a Template</h2>
          <p className="text-muted-foreground">Start with a pre-built automation or create from scratch</p>
        </div>
        <Link href="/automations/new?from=scratch">
          <Button variant="outline">
            <Sparkles className="mr-2 h-4 w-4" />
            Start from Scratch
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id === "all" ? null : category.id)}
              className="whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => {
          const IconComponent = ICON_MAP[template.icon] || MessageSquare
          return (
            <Link key={template.id} href={`/automations/new?template=${template.id}`}>
              <Card className="h-full cursor-pointer hover:border-primary transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="outline" className="mt-1 capitalize">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {template.actions.length} actions
                    </Badge>
                    {template.actions.some((a) => a.type === "AI_RESPONSE") && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No templates found matching your search</p>
        </div>
      )}
    </div>
  )
}
