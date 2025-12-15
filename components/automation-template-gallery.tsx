"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { automationTemplates, type AutomationTemplate } from "@/lib/automation-templates"
import { Search, Sparkles, ShoppingBag, HeadphonesIcon, Heart, Home, Dumbbell, Utensils, Store } from "lucide-react"

const INDUSTRY_ICONS: Record<string, any> = {
  "E-commerce": ShoppingBag,
  "Real Estate": Home,
  Fitness: Dumbbell,
  Restaurant: Utensils,
  Retail: Store,
}

const CATEGORY_INFO = {
  welcome: { label: "Welcome & Onboarding", icon: Sparkles, color: "bg-purple-500" },
  sales: { label: "Sales & Lead Gen", icon: ShoppingBag, color: "bg-green-500" },
  support: { label: "Customer Support", icon: HeadphonesIcon, color: "bg-blue-500" },
  engagement: { label: "Engagement", icon: Heart, color: "bg-pink-500" },
  ecommerce: { label: "E-commerce", icon: ShoppingBag, color: "bg-orange-500" },
  "real-estate": { label: "Real Estate", icon: Home, color: "bg-indigo-500" },
  fitness: { label: "Fitness", icon: Dumbbell, color: "bg-red-500" },
  restaurant: { label: "Restaurant", icon: Utensils, color: "bg-yellow-500" },
}

interface AutomationTemplateGalleryProps {
  onSelectTemplate: (template: AutomationTemplate) => void
}

export function AutomationTemplateGallery({ onSelectTemplate }: AutomationTemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTemplate, setSelectedTemplate] = useState<AutomationTemplate | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const industries = Array.from(new Set(automationTemplates.map((t) => t.industry).filter(Boolean)))

  const filteredTemplates = automationTemplates.filter((template) => {
    const matchesSearch =
      searchQuery === "" ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handlePreview = (template: AutomationTemplate) => {
    setSelectedTemplate(template)
    setIsPreviewOpen(true)
  }

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
      setIsPreviewOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Automation Templates</h2>
        <p className="text-sm text-muted-foreground">Start with a pre-built template or create from scratch</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="welcome">Welcome</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {filteredTemplates.length === 0 ? (
            <Card className="p-12 text-center">
              <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No templates found matching your search</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const categoryInfo = CATEGORY_INFO[template.category as keyof typeof CATEGORY_INFO]
                const CategoryIcon = categoryInfo?.icon || Sparkles

                return (
                  <Card
                    key={template.id}
                    className="p-6 hover:border-primary transition-all cursor-pointer group"
                    onClick={() => handlePreview(template)}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-12 h-12 rounded-lg ${categoryInfo?.color || "bg-gray-500"} flex items-center justify-center`}
                        >
                          <CategoryIcon className="w-6 h-6 text-white" />
                        </div>
                        {template.industry && (
                          <Badge variant="outline" className="text-xs">
                            {template.industry}
                          </Badge>
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <Badge variant="secondary" className="text-xs">
                          {template.actions.length} actions
                        </Badge>
                        <span className="text-xs text-muted-foreground">{categoryInfo?.label}</span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {industries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Browse by Industry</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {industries.map((industry) => {
              const Icon = INDUSTRY_ICONS[industry as string] || Store
              const count = automationTemplates.filter((t) => t.industry === industry).length

              return (
                <Button
                  key={industry}
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 bg-transparent"
                  onClick={() => {
                    setSelectedCategory("all")
                    setSearchQuery(industry as string)
                  }}
                >
                  <Icon className="w-6 h-6 text-primary" />
                  <span className="font-medium text-sm">{industry}</span>
                  <span className="text-xs text-muted-foreground">{count} templates</span>
                </Button>
              )
            })}
          </div>
        </div>
      )}

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>{selectedTemplate?.description}</DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedTemplate.category}</Badge>
                {selectedTemplate.industry && <Badge variant="outline">{selectedTemplate.industry}</Badge>}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Trigger</h4>
                  <Card className="p-4 bg-muted/50">
                    <p className="text-sm text-foreground">{selectedTemplate.triggerType.replace(/_/g, " ")}</p>
                    {selectedTemplate.triggerConditions.keywords && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {selectedTemplate.triggerConditions.keywords.map((keyword: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Actions ({selectedTemplate.actions.length})</h4>
                  <div className="space-y-2">
                    {selectedTemplate.actions.map((action, index) => (
                      <Card key={index} className="p-4 bg-muted/50">
                        <div className="flex items-start gap-3">
                          <Badge variant="secondary" className="shrink-0">
                            {index + 1}
                          </Badge>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{action.type.replace(/_/g, " ")}</p>
                            {action.content.message && (
                              <p className="text-xs text-muted-foreground mt-1">{action.content.message}</p>
                            )}
                            {action.content.tagName && (
                              <Badge variant="outline" className="mt-2 text-xs">
                                {action.content.tagName}
                              </Badge>
                            )}
                            {action.content.delayAmount && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Wait {action.content.delayAmount} {action.content.delayUnit}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUseTemplate}>Use This Template</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
