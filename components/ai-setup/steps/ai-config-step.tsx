"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Bot, CheckCircle2, Info, ShoppingCart, Calendar, CreditCard, Database } from "lucide-react"
import { AI_TONES } from "@/lib/constants/utomation-constants"

interface AIConfigStepProps {
  data?: any
  onComplete: (data: any) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function AIConfigStep({ data, onComplete, onNext, onBack }: AIConfigStepProps) {
  const [config, setConfig] = useState({
    tone: data?.tone || "professional",
    systemPrompt: data?.systemPrompt || "",
    aiInstructions: data?.aiInstructions || "",
    enableCommerce: data?.enableCommerce ?? true,
    enablePayments: data?.enablePayments ?? true,
    enableProductCatalog: data?.enableProductCatalog ?? true,
    enableAppointments: data?.enableAppointments ?? false,
    mcpEnabled: data?.mcpEnabled ?? true,
    maxOrderValue: data?.maxOrderValue || 50000,
    requirePaymentConfirmation: data?.requirePaymentConfirmation ?? true,
    aiKnowledgeBase: data?.aiKnowledgeBase ?? true,
  })

  const handleContinue = () => {
    onComplete(config)
    onNext()
  }

  const handleCommerceToggle = (enabled: boolean) => {
    setConfig({
      ...config,
      enableCommerce: enabled,
      enablePayments: enabled,
      enableProductCatalog: enabled,
      enableAppointments: enabled,
      mcpEnabled: enabled,
    })
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Configure your AI assistant's behavior</p>
            <p className="text-sm">
              These settings control how the AI talks to customers and what actions it can take. Think of this as
              training your virtual employee.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Bot className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>AI Personality</CardTitle>
              <CardDescription>How should the AI communicate with your customers?</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tone">Conversation Tone</Label>
            <Select value={config.tone} onValueChange={(value) => setConfig({ ...config, tone: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_TONES.map((tone) => (
                  <SelectItem key={tone.value} value={tone.value}>
                    <div>
                      <div className="font-medium">{tone.label}</div>
                      <div className="text-xs text-muted-foreground">{tone.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This affects how formal or casual the AI sounds when talking to customers.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="systemPrompt">Custom AI Personality (Optional)</Label>
            <Textarea
              id="systemPrompt"
              placeholder="e.g., You are a friendly fashion stylist who loves helping customers find their perfect outfit..."
              value={config.systemPrompt}
              onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Override the default personality with custom instructions for specialized behavior.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aiInstructions">Additional Instructions (Optional)</Label>
            <Textarea
              id="aiInstructions"
              placeholder="e.g., Always mention free shipping on orders over $50. Never offer discounts without approval. Recommend our loyalty program to repeat customers."
              value={config.aiInstructions}
              onChange={(e) => setConfig({ ...config, aiInstructions: e.target.value })}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Specific rules and guidelines the AI should follow when responding.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Commerce Capabilities</CardTitle>
              <CardDescription>Enable the AI to help with sales and bookings</CardDescription>
            </div>
            <Switch checked={config.enableCommerce} onCheckedChange={handleCommerceToggle} />
          </div>
        </CardHeader>
        {config.enableCommerce && (
          <CardContent className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <p className="font-medium mb-2">AI Commerce is enabled! Your AI can now:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <ShoppingCart className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Search & Recommend Products</p>
                      <p className="text-xs">Show products when customers ask about items</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CreditCard className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Process Payments</p>
                      <p className="text-xs">Create secure payment links via Stripe</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Book Appointments</p>
                      <p className="text-xs">Schedule appointments automatically</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Database className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Update Customer Info</p>
                      <p className="text-xs">Save preferences and contact details</p>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="maxOrderValue">Maximum Order Value (cents)</Label>
                <Input
                  id="maxOrderValue"
                  type="number"
                  value={config.maxOrderValue}
                  onChange={(e) => setConfig({ ...config, maxOrderValue: Number.parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">
                  Safety limit: AI can't create orders above ${(config.maxOrderValue / 100).toFixed(2)}. Orders above
                  this need human approval.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="paymentConfirm" className="cursor-pointer">
                    Require Payment Confirmation
                  </Label>
                  <p className="text-xs text-muted-foreground">AI asks customer to confirm before processing payment</p>
                </div>
                <Switch
                  id="paymentConfirm"
                  checked={config.requirePaymentConfirmation}
                  onCheckedChange={(checked) => setConfig({ ...config, requirePaymentConfirmation: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="knowledgeBase" className="cursor-pointer">
                    Use Knowledge Base
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    AI searches your FAQs and policies to answer questions
                  </p>
                </div>
                <Switch
                  id="knowledgeBase"
                  checked={config.aiKnowledgeBase}
                  onCheckedChange={(checked) => setConfig({ ...config, aiKnowledgeBase: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="mcpEnabled" className="cursor-pointer">
                    Enable MCP Tools (Advanced)
                  </Label>
                  <p className="text-xs text-muted-foreground">Model Context Protocol for extended AI capabilities</p>
                </div>
                <Switch
                  id="mcpEnabled"
                  checked={config.mcpEnabled}
                  onCheckedChange={(checked) => setConfig({ ...config, mcpEnabled: checked })}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm text-blue-800">
            <li className="flex gap-3">
              <Badge variant="secondary" className="h-6 w-6 p-0 flex items-center justify-center flex-shrink-0">
                1
              </Badge>
              <div>
                <p className="font-medium">Customer sends a message on Instagram</p>
                <p className="text-xs">Direct message, comment, or story reply</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Badge variant="secondary" className="h-6 w-6 p-0 flex items-center justify-center flex-shrink-0">
                2
              </Badge>
              <div>
                <p className="font-medium">AI analyzes the message and conversation history</p>
                <p className="text-xs">Understands context and customer intent</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Badge variant="secondary" className="h-6 w-6 p-0 flex items-center justify-center flex-shrink-0">
                3
              </Badge>
              <div>
                <p className="font-medium">AI searches your knowledge base and products</p>
                <p className="text-xs">Finds relevant information to answer the question</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Badge variant="secondary" className="h-6 w-6 p-0 flex items-center justify-center flex-shrink-0">
                4
              </Badge>
              <div>
                <p className="font-medium">AI takes action if needed</p>
                <p className="text-xs">Shows products, creates payment links, books appointments</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Badge variant="secondary" className="h-6 w-6 p-0 flex items-center justify-center flex-shrink-0">
                5
              </Badge>
              <div>
                <p className="font-medium">Responds naturally in your chosen tone</p>
                <p className="text-xs">Customer receives helpful, on-brand reply in seconds</p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} size="lg">
          Back
        </Button>
        <Button onClick={handleContinue} size="lg">
          Continue to Testing
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
