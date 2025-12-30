"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

const BUSINESS_TYPES = [
  { value: "ecommerce", label: "E-commerce Store" },
  { value: "service", label: "Service Business" },
  { value: "restaurant", label: "Restaurant / Cafe" },
  { value: "salon", label: "Salon / Spa" },
  { value: "fitness", label: "Fitness / Gym" },
  { value: "real_estate", label: "Real Estate" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education / Coaching" },
  { value: "other", label: "Other" },
]

interface BusinessInfoStepProps {
  data?: any
  onComplete: (data: any) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function BusinessInfoStep({ data, onComplete, onNext, isFirstStep }: BusinessInfoStepProps) {
  const [formData, setFormData] = useState({
    businessName: data?.businessName || "",
    businessType: data?.businessType || "",
    description: data?.description || "",
    industry: data?.industry || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
    onNext()
  }

  const isValid = formData.businessName && formData.businessType && formData.description

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This information helps the AI understand your business and communicate appropriately with customers.
          Everything can be edited later.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            placeholder="e.g., Bella's Boutique"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessType">Business Type *</Label>
          <Select
            value={formData.businessType}
            onValueChange={(value) => setFormData({ ...formData, businessType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your business type" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Business Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe what your business does, what you sell/offer, and what makes you unique. The AI will use this to introduce your business to customers."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            required
          />
          <p className="text-xs text-muted-foreground">
            Example: "We're a boutique clothing store specializing in sustainable fashion for women. We offer curated
            collections from eco-friendly brands, custom styling services, and free shipping on orders over $100."
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry (Optional)</Label>
          <Input
            id="industry"
            placeholder="e.g., Fashion & Apparel"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <div />
        <Button type="submit" disabled={!isValid} size="lg">
          Continue to Products
        </Button>
      </div>
    </form>
  )
}
